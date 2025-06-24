"use client";

import { CollaborativeEditor } from "@/components/ColloborativeEditor";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import React, { Suspense, useState } from "react";

export default function CodePage() {
  const [isSideBarOpen, setSideBarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSideBarOpen((e) => !e);
  };

  return (
    <div
      className={cn("h-full flex flex-col", isSideBarOpen ? "w-3/4" : "w-full")}
    >
      <div className="flex-1 overflow-hidden">
        <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
          <RoomProvider id="my-room" initialPresence={{ cursor: null }}>
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-white">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading editor...</p>
                  </div>
                </div>
              }
            >
              <CollaborativeEditor />
            </Suspense>
          </RoomProvider>
        </LiveblocksProvider>
      </div>
      <Button className="fixed bottom-2 right-2" onClick={toggleSidebar}>
        SideBar
      </Button>
    </div>
  );
}
