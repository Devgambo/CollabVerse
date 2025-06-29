import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(
  _req: Request,
  { params }: { params: { roomId: string } },
) {
  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = await params;

  try {
    const convex = new ConvexHttpClient(
      process.env.NEXT_PUBLIC_CONVEX_URL || "",
    );
    const roomUsers = await convex.query(api.rooms.getRoomUsers, {
      roomId,
    });

    return NextResponse.json({ users: roomUsers });
  } catch (error) {
    console.error("Failed to fetch room users:", error);
    return NextResponse.json(
      { error: "Failed to fetch room users." },
      { status: 500 },
    );
  }
}
