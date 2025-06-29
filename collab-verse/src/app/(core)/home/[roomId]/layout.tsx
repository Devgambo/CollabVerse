import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Providers from "./LiveblocksProvider";

export default async function RoomLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { roomId: string };
}) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

  const { roomId } = await params;
  const roomData = await convex.query(api.rooms.getRoomData, {
    roomId: roomId,
  });

  if (!roomData) return notFound();

  return (
    <Providers
      roomId={params.roomId}
      roomData={JSON.parse(JSON.stringify(roomData))}
    >
      {children}
    </Providers>
  );
}
