import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Providers from "@/src/providers/LiveblocksProvider";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ roomId: string }>;
}

export default async function RoomLayout({ children, params }: LayoutProps) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

  // Await the params since they're now a Promise in Next.js 15
  const { roomId } = await params;

  const roomData = await convex.query(api.rooms.getRoomData, {
    roomId: roomId,
  });

  if (!roomData) return notFound();

  return (
    <Providers roomId={roomId} roomData={JSON.parse(JSON.stringify(roomData))}>
      {children}
    </Providers>
  );
}
