"use client";

import {
  RoomProvider,
  ClientSideSuspense,
  useRoom,
  LiveblocksProvider,
} from "@liveblocks/react";
import { LiveMap, LiveList } from "@liveblocks/client";
import { useEffect } from "react";

export default function Providers({
  children,
  roomId,
  roomData,
}: {
  children: React.ReactNode;
  roomId: string;
  roomData: any;
}) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        // authEndpoint="/api/liveblocks-auth"
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
          <Hydrator fileSnapshots={roomData.fileSnapshots} />
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function Hydrator({
  fileSnapshots,
}: {
  fileSnapshots: Record<string, string> | undefined;
}) {
  const room = useRoom();

  useEffect(() => {
    if (!fileSnapshots) return;

    let isMounted = true;

    room.getStorage().then(({ root }) => {
      if (!isMounted) return;

      const files = root.get("files") as LiveMap<string, string>;
      if (!files) return;

      for (const [fileId, code] of Object.entries(fileSnapshots)) {
        if (!files.has(fileId)) {
          files.set(fileId, code);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fileSnapshots, room]);
  return null;
}
