//FIX:Don't need this file...

"use client";


import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

export default function Room({ children }: { children: React.ReactNode }) {
  // const roomId = getRoomId();
  const { roomId } = useParams() as { roomId: string };
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

//FIX:You cannot use useMemo() outside a React hook or component body. You're calling it inside getRoomId() which is not valid React usage and won't memoize anything.
function getRoomId(): string {
  const params = useParams();
  const id = params.roomId as string;

  const roomId = useMemo(() => {
    return id;
  }, [id]);

  return roomId || "";
}

