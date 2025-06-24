"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Room from "../Room";

// Dynamically import CollaborativeEditor with no SSR
const CollaborativeEditorWithNoSSR = dynamic(
  () =>
    import("@/components/ColloborativeEditor").then(
      (mod) => mod.CollaborativeEditor,
    ),
  { ssr: false },
);

const EditorLoading = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#1e1e1e] text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p>Loading editor...</p>
    </div>
  </div>
);

export default function CodePage() {
  const router = useRouter();
  const [isSideBarOpen, setSideBarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSideBarOpen((prev) => !prev);
  };

  return (
    <Room>
      <div className="h-screen flex flex-col">
        <Navbar />

        {/* Main content */}
        <div className="flex-1 flex">
          <div
            className={cn(
              "h-full flex flex-col transition-all duration-300",
              isSideBarOpen ? "w-3/4" : "w-full",
            )}
          >
            <div className="flex-1 overflow-hidden relative">
              <CollaborativeEditorWithNoSSR />
            </div>
          </div>

          {/* Sidebar */}
          {isSideBarOpen && (
            <div className="w-1/4 border-l border-[#333] bg-[#111] p-4 overflow-y-auto">
              <h2 className="text-lg font-medium mb-4">Project Files</h2>
              <div className="space-y-2">
                {/* Files list would go here */}
                <div className="px-2 py-1 hover:bg-[#222] rounded cursor-pointer flex items-center">
                  <span className="text-blue-400 mr-2">📄</span>
                  <span>main.ts</span>
                </div>
                <div className="px-2 py-1 hover:bg-[#222] rounded cursor-pointer flex items-center">
                  <span className="text-purple-400 mr-2">📄</span>
                  <span>index.html</span>
                </div>
                <div className="px-2 py-1 hover:bg-[#222] rounded cursor-pointer flex items-center">
                  <span className="text-green-400 mr-2">📄</span>
                  <span>styles.css</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toggle sidebar button */}
        <button
          onClick={toggleSidebar}
          className="absolute bottom-4 right-4 bg-[#222] hover:bg-[#333] text-white p-2 rounded-full shadow-lg z-10"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isSideBarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            )}
          </svg>
        </button>
      </div>
    </Room>
  );
}
