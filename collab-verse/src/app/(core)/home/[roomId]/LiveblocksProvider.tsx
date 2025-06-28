// "use client";

// import { LiveblocksProvider } from "@liveblocks/react";
// import { PropsWithChildren } from "react";

// export function Providers({ children }: PropsWithChildren) {
//   return (
    // <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
    //   {children}
    // </LiveblocksProvider>
//   );
// }

"use client";

import {
  RoomProvider,
  ClientSideSuspense,
  useRoom,
} from "@liveblocks/react";
import { LiveMap, LiveList } from "@liveblocks/client";
import { useEffect } from "react";

export default function  Providers({
  children,
  roomId,
  roomData,
}: {
  children: React.ReactNode;
  roomId: string;
  roomData: any;
}) {
  return (
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

  );
}

// Hydrate files[fileId] with lastSyncedContent (if needed)
function Hydrator({ fileSnapshots }: { fileSnapshots: Record<string, string> }) {
  const room = useRoom();

  useEffect(() => {
    room.getStorage().then(({ root }) => {
      const files = root.get("files") as LiveMap<string, string>;

      for (const [fileId, code] of Object.entries(fileSnapshots)) {
        if (!files.has(fileId)) {
          files.set(fileId, code); // Initialize file with last known content
        }
      }
    });
  }, [fileSnapshots, room]);

  return null;
}
