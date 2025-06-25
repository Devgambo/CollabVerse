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
          <Sidebar isSideBarOpen={isSideBarOpen} />
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

const options = [
  { name: "/summarize", trigger: "Summarize" },
  { name: "/ai", trigger: "General" },
  { name: "/simplify", trigger: "Simplify" },
  { name: "/check", trigger: "Check" },
];

const Sidebar = ({ isSideBarOpen }: { isSideBarOpen: boolean }) => {
  return (
    <div className="w-full h-full">
      {isSideBarOpen && (
        <div className="w-full h-full border-l border-[#333] bg-[#111] p-4 overflow-y-auto flex flex-col">
          <h2 className="text-lg text-white font-medium mb-4">Team Chat</h2>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {/* Example chat messages */}
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <div className="bg-[#222] text-white px-3 py-2 rounded-lg max-w-xs">
                  Hey team, should we refactor the main function?
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Alice • 10:01 AM
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                Y
              </div>
              <div>
                <div className="bg-[#1a3a1a] text-white px-3 py-2 rounded-lg max-w-xs">
                  Yes, I think that's a good idea!
                </div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                  You • 10:02 AM
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                🤖
              </div>
              <div>
                <div className="bg-[#22224a] text-white px-3 py-2 rounded-lg max-w-xs">
                  I suggest extracting helper functions for better readability.
                </div>
                <div className="text-xs text-gray-400 mt-1">AI • 10:03 AM</div>
              </div>
            </div>
          </div>
          {/* Chat input */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {options.map((option) => (
              <button
                key={option.name}
                className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="button"
                disabled
                title={option.trigger}
              >
                {option.name}
              </button>
            ))}
          </div>
          <form className="mt-4 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-[#222] text-white px-3 py-2 rounded-lg outline-none"
              placeholder="Type your message..."
              disabled
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              disabled
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
