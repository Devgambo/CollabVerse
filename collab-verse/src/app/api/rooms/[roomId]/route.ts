import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { Liveblocks } from "@liveblocks/node";
import { currentUser } from "@clerk/nextjs/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY || "",
});

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } },
) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const param = await params;
  const roomId = param.roomId;
  console.log(roomId);

  if (!roomId) {
    return NextResponse.json({ error: "Not a valid roomId" }, { status: 404 });
  }

  try {
    const convex = new ConvexHttpClient(
      process.env.NEXT_PUBLIC_CONVEX_URL || "",
    );

    const roomData = await convex.query(api.rooms.getRoomById, {
      roomId: roomId,
    });

    if (!roomData) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const roomMetadata = {
      name: roomData.name,
      ownerId: roomData.ownerId,
      createdAt: String(roomData.createdAt ?? new Date().getTime()),
    };

    const liveblocksRoom = await liveblocks.getOrCreateRoom(roomId, {
      defaultAccesses: roomData.isPublic ? ["room:write"] : [],
      metadata: roomMetadata,
      usersAccesses: {
        [roomData.ownerId]: ["room:write"],
      },
    });

    return NextResponse.json(
      {
        ...roomData,
        liveblocks: {
          ...liveblocksRoom,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error accessing room:", error);
    return NextResponse.json(
      { error: "Failed to access room" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { roomId: string } },
) {
  const requestId = "PATCH LOGS";
  console.log(`[${requestId}] PATCH request for room ${params.roomId}`);

  const user = await currentUser();

  if (!user?.id) {
    console.log(`[${requestId}] Unauthorized - No user found`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = await params;
  if (!roomId) {
    console.log(`[${requestId}] Bad request - Missing roomId`);
    return NextResponse.json({ error: "Room ID required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log(
      `[${requestId}] Processing ${body.type} update for room ${roomId}`,
    );

    const convex = new ConvexHttpClient(
      process.env.NEXT_PUBLIC_CONVEX_URL || "",
    );

    console.log(body);

    // Determine which update to perform based on the 'type' field
    switch (body.type) {
      case "roomInfo":
        try {
          // 1. Update in Convex first
          const roomInfo = await convex.mutation(api.rooms.updateRoomInfo, {
            userId: user.id,
            roomId,
            ...body.data,
          });

          console.log(roomInfo);
          if (!roomInfo.success) {
            console.error(
              `[${requestId}] Convex update failed:`,
              roomInfo.error,
            );
            return NextResponse.json(
              { error: roomInfo.error || "Failed to update room in database" },
              { status: 400 },
            );
          }

          // 2. Update the corresponding Liveblocks room
          try {
            // Get updated room data after the mutation
            const updatedRoom = await convex.query(api.rooms.getRoomById, {
              roomId,
            });

            if (!updatedRoom) {
              throw new Error("Room not found after update");
            }

            // Update Liveblocks room with new metadata and access settings
            const liveblocksRoom = await liveblocks.updateRoom(roomId, {
              metadata: {
                name: updatedRoom.name,
                description: updatedRoom.description || "",
                roomType: updatedRoom.roomType,
                updatedAt: new Date().toISOString(),
                updatedBy: user.id,
              },
              defaultAccesses:
                updatedRoom.roomType === "mentor"
                  ? ["room:read", "room:presence:write"]
                  : updatedRoom.isPublic
                    ? ["room:write"]
                    : [],
            });

            console.log(
              `[${requestId}] Room info updated successfully in both systems`,
            );
            return NextResponse.json({
              success: true,
              convex: roomInfo,
              liveblocks: {
                roomId: liveblocksRoom.id,
              },
            });
          } catch (liveblocksError) {
            console.error(
              `[${requestId}] Liveblocks update failed:`,
              liveblocksError,
            );
            // We still return success since the main database was updated
            return NextResponse.json({
              success: true,
              warning:
                "Room info updated in database but not in real-time collaboration service",
              convex: roomInfo,
            });
          }
        } catch (error) {
          console.error(`[${requestId}] Room info update error:`, error);
          throw error;
        }

      case "roomContent":
        try {
          const roomContent = await convex.mutation(
            api.rooms.updateRoomContent,
            {
              roomId,
              ...body.data,
            },
          );

          if (!roomContent.success) {
            console.error(
              `[${requestId}] Content update failed:`,
              roomContent.error,
            );
            return NextResponse.json(
              { error: roomContent.error },
              { status: 400 },
            );
          }

          console.log(`[${requestId}] Room content updated successfully`);
          return NextResponse.json(roomContent);
        } catch (error) {
          console.error(`[${requestId}] Room content update error:`, error);
          throw error;
        }

      case "roomUser":
        try {
          // 1. Update permissions in Convex
          const roomUser = await convex.mutation(api.rooms.updateRoomUser, {
            roomId,
            ...body.data,
          });

          if (!roomUser.success) {
            console.error(
              `[${requestId}] User permission update failed:`,
              roomUser.error,
            );
            return NextResponse.json(
              { error: roomUser.error },
              { status: 400 },
            );
          }

          // 2. Update permissions in Liveblocks
          try {
            // Get all current users for this room
            const room = await convex.query(api.rooms.getRoomById, { roomId });
            const roomUsers = await convex.query(api.rooms.getRoomUsers, {
              roomId,
            });

            if (!room || !roomUsers) {
              throw new Error("Couldn't retrieve room users after update");
            }

            const liveblocksAccesses: Record<
              string,
              ["room:read", "room:presence:write"] | ["room:write"] | null
            > = {};

            // Always ensure owner has full access
            liveblocksAccesses[room.ownerId] = ["room:write"];

            // Map other users based on their roles/permissions
            roomUsers.forEach((user: any) => {
              if (user.userId === room.ownerId) return;

              if (user.permissions.includes("write")) {
                liveblocksAccesses[user.userId] = ["room:write"];
              } else if (user.permissions.includes("read")) {
                liveblocksAccesses[user.userId] = [
                  "room:read",
                  "room:presence:write",
                ];
              } else {
                liveblocksAccesses[user.userId] = null;
              }
            });

            // Update Liveblocks with new access mappings
            const liveblocksRoom = await liveblocks.updateRoom(roomId, {
              usersAccesses: liveblocksAccesses,
            });

            console.log(
              `[${requestId}] User permissions updated successfully in both systems`,
            );
            return NextResponse.json({
              success: true,
              convex: roomUser,
              liveblocks: {
                roomId: liveblocksRoom.id,
              },
            });
          } catch (liveblocksError) {
            console.error(
              `[${requestId}] Liveblocks permission update failed:`,
              liveblocksError,
            );
            // Return success with a warning since the main DB was updated
            return NextResponse.json({
              success: true,
              warning:
                "User permissions updated in database but not in real-time collaboration service",
              convex: roomUser,
            });
          }
        } catch (error) {
          console.error(`[${requestId}] User permission update error:`, error);
          throw error;
        }

      default:
        console.warn(`[${requestId}] Invalid update type: ${body.type}`);
        return NextResponse.json(
          { error: `Invalid update type: '${body.type}'` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error(`[${requestId}] Unhandled error:`, error);
    return NextResponse.json(
      {
        error: "Failed to update room",
        details: error instanceof Error ? error.message : String(error),
        requestId, // Include for support reference
      },
      { status: 500 },
    );
  }
}
