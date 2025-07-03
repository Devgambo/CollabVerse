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
    const fileSystems = await convex.query(api.fileSystem.getFilesFolders, {
      roomId:roomId,
    });
    return NextResponse.json(fileSystems);
  } catch (error) {
    console.error("Failed to fetch files", error);
    return NextResponse.json(
      { error: "Failed to fetch files." },
      { status: 500 },
    );
  }
}
