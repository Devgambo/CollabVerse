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

  const roomId = params.roomId;
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
      defaultAccesses: [],
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
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roomId = params.roomId;
  if (!roomId) {
    return NextResponse.json({ error: "Room ID required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const convex = new ConvexHttpClient(
      process.env.NEXT_PUBLIC_CONVEX_URL || "",
    );

    // Determine which update to perform based on the 'type' field
    switch (body.type) {
      case "roomInfo":
        const roomInfo = await convex.mutation(api.rooms.updateRoomInfo, {
          roomId,
          ...body.data,
        });
        return NextResponse.json(roomInfo);

      case "roomContent":
        const roomContent = await convex.mutation(api.rooms.updateRoomContent, {
          roomId,
          ...body.data,
        });
        return NextResponse.json(roomContent);

      case "roomUser":
        const roomUser = await convex.mutation(api.rooms.updateRoomUser, {
          roomId,
          ...body.data,
        });
        return NextResponse.json(roomUser);

      default:
        return NextResponse.json(
          { error: "Invalid update type" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 },
    );
  }
}
