"use client";

import {
  RoomProvider,
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react";
import { LiveMap, LiveList } from "@liveblocks/client";
import { Id } from "@/convex/_generated/dataModel";

interface RoomDataProps {
  roomId: Id<"rooms">;
  activeFileId: Id<"filesystem"> | null;
  whiteboard: string[];
}

export default function Providers({
  children,
  roomId,
  roomData,
}: {
  children: React.ReactNode;
  roomId: string;
  roomData: RoomDataProps;
}) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selectedFileId: roomData.activeFileId,
        }}
        initialStorage={{
          files: new LiveMap(), // will hydrate later
          whiteboard: new LiveList(roomData.whiteboard || []),
        }}
      >
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
