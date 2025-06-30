import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { Liveblocks } from "@liveblocks/node";
import { currentUser } from "@clerk/nextjs/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY || "",
});

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } },
) {
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = await params;
  const body = await request.json();
  const { token } = body;

  try {
    const convex = new ConvexHttpClient(
      process.env.NEXT_PUBLIC_CONVEX_URL || "",
    );

    const room = await convex.query(api.rooms.getRoomById, { roomId });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const roomUsers = await convex.query(api.rooms.getRoomUsers, { roomId });
    const userExists = roomUsers.some((ru) => ru.userId === user.id);

    if (userExists) {
      const userInRoom = roomUsers.find((ru) => ru.userId === user.id);

      if (!userInRoom) {
        return NextResponse.json({ error: "Existing User" }, { status: 400 });
      }

      await liveblocks.updateRoom(roomId, {
        usersAccesses: {
          [user.id]: userInRoom.permissions?.includes("write")
            ? ["room:write"]
            : ["room:read", "room:presence:write"],
        },
      });

      return NextResponse.json({
        success: true,
        message: "Already a member of this room",
        permissions: userInRoom.permissions || [],
      });
    }

    if (room.isPublic) {
      if (room.maxUsers && roomUsers.length >= room.maxUsers) {
        return NextResponse.json(
          {
            error: "Room has reached maximum capacity",
          },
          { status: 403 },
        );
      }

      await convex.mutation(api.rooms.addUserToRoom, {
        roomId,
        userId: user.id,
        role: "student",
        permissions: ["read"],
      });

      await liveblocks.updateRoom(roomId, {
        usersAccesses: {
          [user.id]: ["room:read", "room:presence:write"],
        },
      });

      return NextResponse.json({
        success: true,
        message: "Successfully joined public room",
        permissions: ["read"],
      });
    } else {
      let invitation;

      try {
        if (token) {
          invitation = await convex.query(
            api.invitations.getInvitationByToken,
            { token },
          );
        } else {
          invitation = await convex.query(
            api.invitations.getInvitationForUser,
            {
              roomId,
              email: user.emailAddresses[0].emailAddress,
            },
          );
        }

        if (!invitation) {
          return NextResponse.json(
            {
              error: "No valid invitation found for this room",
            },
            { status: 403 },
          );
        }

        if (invitation.status !== "pending") {
          return NextResponse.json(
            {
              error: "Invitation has already been used or is no longer valid",
            },
            { status: 403 },
          );
        }

        if (new Date(invitation.expiresAt) < new Date()) {
          return NextResponse.json(
            {
              error: "Invitation has expired",
            },
            { status: 403 },
          );
        }

        await convex.mutation(api.rooms.addUserToRoom, {
          roomId,
          userId: user.id,
          role: invitation.role,
          permissions: invitation.permissions || ["read"],
        });

        await convex.mutation(api.invitations.markInvitationAccepted, {
          invitationId: invitation._id,
        });

        await liveblocks.updateRoom(roomId, {
          usersAccesses: {
            [user.id]: invitation.permissions?.includes("write")
              ? ["room:write"]
              : ["room:read", "room:presence:write"],
          },
        });

        return NextResponse.json({
          success: true,
          message: "Successfully joined via invitation",
          permissions: invitation.permissions,
        });
      } catch (invitationError) {
        console.error("Error processing invitation:", invitationError);
        return NextResponse.json(
          {
            error: "No valid invitation found for this room",
          },
          { status: 403 },
        );
      }
    }
  } catch (error) {
    console.error("Error processing room access:", error);
    return NextResponse.json(
      {
        error: "Failed to process room access",
      },
      { status: 500 },
    );
  }
}
