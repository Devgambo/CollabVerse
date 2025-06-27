"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

export default function Room({ children }: { children: React.ReactNode }) {
  const roomId = getRoomId();
  console.log("Room.tsx: Current Room ID:", roomId);
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

function getRoomId(): string {
  const params = useParams();
  const id = params.roomId as string;

  const roomId = useMemo(() => {
    return id;
  }, [id]);

  return roomId || "";
}
