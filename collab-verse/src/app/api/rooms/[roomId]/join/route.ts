import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { RoomUsers } from "@/src/types/funciton_interface";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { email, permissions = ["read"] } = body;
  const { roomId } = await params;

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

  try {
    const room = await convex.query(api.rooms.getRoomById, { roomId });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Only room owner can share room" },
        { status: 403 },
      );
    }

    const existingUser = await convex.query(api.users.getUserByEmail, {
      email,
    });

    if (room.isPublic) {
      // Check for space
      if (existingUser) {
        const roomUsers = await convex.query(api.rooms.getRoomUsers, {
          roomId,
        });

        if (room.maxUsers && roomUsers.length >= room.maxUsers) {
          return NextResponse.json(
            { error: "Room has reached maximum capacity" },
            { status: 400 },
          );
        }

        const userInRoom = roomUsers.find(
          (ru: RoomUsers) => ru.userId === existingUser.userId,
        );

        if (userInRoom) {
          await convex.mutation(api.rooms.updateRoomUser, {
            roomId,
            targetUserId: existingUser.userId,
            permissions,
            role: permissions.includes("write") ? "collaborator" : "student",
          });
        } else {
          await convex.mutation(api.rooms.addUserToRoom, {
            roomId,
            userId: existingUser.userId,
            role: permissions.includes("write") ? "collaborator" : "student",
            permissions,
          });
        }

        return NextResponse.json({
          success: true,
          message: "User added to room",
          shareLink: `${process.env.NEXT_PUBLIC_APP_URL}/home/${roomId}`,
        });
      } else {
        const token = uuidv4();

        await convex.mutation(api.invitations.createInvitation, {
          roomId,
          email,
          role: permissions.includes("write") ? "collaborator" : "student",
          permissions,
          token,
          status: "pending",
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

        return NextResponse.json({
          success: true,
          message: "Invitation created",
          shareLink: `${process.env.NEXT_PUBLIC_APP_URL}/home/${roomId}/join?token=${token}`,
        });
      }
    } else {
      const token = uuidv4();

      await convex.mutation(api.invitations.createInvitation, {
        roomId,
        email,
        role: permissions.includes("write") ? "collaborator" : "student",
        permissions,
        token,
        status: "pending",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Invitation created for private room",
        shareLink: `${process.env.NEXT_PUBLIC_APP_URL}/home/${roomId}/join?token=${token}`,
      });
    }
  } catch (error) {
    console.error("Error sharing room:", error);
    return NextResponse.json(
      { error: "Failed to share room" },
      { status: 500 },
    );
  }
}
