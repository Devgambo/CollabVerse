import { v4 as uuidv4 } from "uuid";
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
    const response = await convex.query(api.rooms.getRooms, {
      userId: user.id,
    });

    const data = response;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error creating room in Convex:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const user = await currentUser();
  const newRoomId = uuidv4();
  const body = await request.json();

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const convex = new ConvexHttpClient(
      process.env.NEXT_PUBLIC_CONVEX_URL || "",
    );
    await convex.mutation(api.rooms.createRoom, {
      name: body.roomName,
      ownerId: user.id,
      roomType: body.roomType || "collab",
    });
  } catch (error) {
    console.error("Error creating room in Convex:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }

  const roomMetadata = {
    name: body.roomName,
    ownerId: user?.id,
    createdAt: new Date().toISOString(),
  };

  const room = await liveblocks.createRoom(newRoomId, {
    defaultAccesses: ["room:write"],
    usersAccesses: {
      [user.id]: ["room:write"],
    },
    metadata: roomMetadata,
  });

  console.log("Create room endpoint: User ID:", user?.id);
  console.log("Creating room with ID:", newRoomId);
  console.log("Granting access to user ID:", user.id);

  return NextResponse.json({ roomId: newRoomId });
}
