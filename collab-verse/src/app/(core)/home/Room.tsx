"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

export default function Room({ children }: { children: React.ReactNode }) {
  const roomId = getRoomId("liveblocks:examples:nextjs-yjs-codemirror");

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

function getRoomId(exampleRoomId: string): string {
  const params = useSearchParams();
  const id = params.get("roomId");

  const roomId = useMemo(() => {
    return id ? `${id}` : `${exampleRoomId}`;
  }, [exampleRoomId, id]);

  return roomId;
}
