"use client";

import {
  ClientSideSuspense,
  LiveblocksProvider as LBProvider,
} from "@liveblocks/react";
import { LiveList, LiveMap } from "@liveblocks/client";
import { Id } from "@/convex/_generated/dataModel";
import { RoomProvider } from "@/src/liveblocks.config";
import LoadingScreen from "../components/Loading";

interface RoomDataProps {
  roomId: Id<"rooms">;
  activeFileId: Id<"filesystem"> | null;
  whiteboardId?: string;
}

export default function LiveblocksProvider({
  children,
  roomId,
  roomData,
}: {
  children: React.ReactNode;
  roomId: string;
  roomData: RoomDataProps;
}) {
  return (
    <LBProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selectedFileId: roomData.activeFileId,
          selection: [],
          pencilDraft: null,
          penColor: null,
        }}
        initialStorage={{
          files: new LiveMap(),
          layers: new LiveMap(),
          layerIds: new LiveList([]),
        }}
      >
        <ClientSideSuspense fallback={<div>{<LoadingScreen/>}</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LBProvider>
  );
}
