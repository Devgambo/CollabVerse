import { NextResponse } from "next/server";
import { Liveblocks } from "@liveblocks/node";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY || "",
});

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const convex = new ConvexHttpClient(
      process.env.NEXT_PUBLIC_CONVEX_URL || "",
    );
    const rooms = await convex.query(api.rooms.getRooms, {
      userId: user.id,
    });

    const formattedRooms = rooms.map((room: any) => ({
      ...room,
      createdAt: new Date(room.createdAt).toISOString(),
      lastAccessed: new Date(room.lastAccessed).toISOString(),
    }));

    return NextResponse.json(formattedRooms, { status: 200 });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const user = await currentUser();
  const body = await request.json();

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const convex = new ConvexHttpClient(
      process.env.NEXT_PUBLIC_CONVEX_URL || "",
    );

    const response = await convex.mutation(api.rooms.createRoom, {
      name: body.roomName,
      ownerId: user.id,
      roomType: body.roomType || "collab",
    });

    if (!response || !response._id) {
      throw new Error("Failed to create room in database");
    }

    const roomMetadata = {
      name: body.roomName,
      ownerId: user.id,
      createdAt: new Date().toISOString(),
    };

    try {
      const liveblocksRoom = await liveblocks.createRoom(response._id, {
        defaultAccesses: ["room:write"],
        usersAccesses: {
          [user.id]: ["room:write"],
        },
        metadata: roomMetadata,
      });

      return NextResponse.json(
        {
          roomId: response._id,
          liveblocks: {
            id: liveblocksRoom.id,
            status: liveblocksRoom,
          },
        },
        { status: 201 },
      );
    } catch (liveblocksError) {
      console.error("Liveblocks room creation failed:", liveblocksError);

      // FIX: Try to delete the Convex room since Liveblocks failed
      await convex.mutation(api.rooms.deleteRoom, {
        roomId: response._id,
        ownerId: user.id,
      });

      throw new Error("Failed to set up collaborative features");
    }
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create room",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.roomId) {
    return NextResponse.json(
      { error: "Missing roomId parameter" },
      { status: 400 },
    );
  }

  try {
    const convex = new ConvexHttpClient(
      process.env.NEXT_PUBLIC_CONVEX_URL || "",
    );

    // First check if the room exists and user is the owner
    const room = await convex.query(api.rooms.getRoomById, {
      roomId: body.roomId,
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.ownerId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this room" },
        { status: 403 },
      );
    }

    // Delete from Convex after owner is affirmed
    const deleteResult = await convex.mutation(api.rooms.deleteRoom, {
      roomId: body.roomId,
      ownerId: user.id,
    });

    // Delete from Liveblocks as well
    try {
      await liveblocks.deleteRoom(body.roomId);
    } catch (liveblockError) {
      console.error("Failed to delete Liveblocks room:", liveblockError);
    }

    return NextResponse.json(
      { success: true, message: "Room deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 },
    );
  }
}
