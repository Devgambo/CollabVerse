// import Navbar from "@/src/components/Navbar";
// import { Providers } from "./LiveblocksProvider";

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return <Providers>{children}</Providers>;
// }


// src/app/[roomId]/layout.tsx
import { ReactNode } from "react";
import Providers from "./LiveblocksProvider";
// import { getRoomData } from "@/lib/convex/queries";
import { notFound } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { LiveblocksProvider } from "@liveblocks/react";

export default async function RoomLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { roomId: string };
}) {
  
  const convex = new ConvexHttpClient(
    process.env.NEXT_PUBLIC_CONVEX_URL || "",
  );

  const roomData = await convex.query(api.rooms.getRoomData, {roomId: params.roomId})

  // const roomData = await getRoomData(params.roomId);

  if (!roomData) return notFound();

  return (
  <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
    <Providers roomId={params.roomId} roomData={roomData}>
      {children}
    </Providers>
  </LiveblocksProvider>
  );
}
