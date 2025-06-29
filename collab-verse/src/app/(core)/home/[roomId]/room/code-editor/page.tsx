"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { cn } from "@/src/lib/utils";
import FileSystem from "../components/FileSystem";
import OutputBox from "../components/OutputBox";

// Dynamically import CollaborativeEditor with no SSR
const CollaborativeEditorWithNoSSR = dynamic(
  () =>
    import("@/src/app/(core)/home/[roomId]/room/components/ColloborativeEditor").then(
      (mod) => mod.CollaborativeEditor,
    ),
  { ssr: false },
);

const EditorLoading = () => (
  <div className="h-full w-full flex items-center justify-center bg-[#1e1e1e] text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-300">Loading editor...</p>
    </div>
  </div>
);

export default function CodePage() {
  const router = useRouter();
  const [leftSide, setLeftSide] = useState<boolean>(false);
  const [rightSide, setRightSide] = useState<boolean>(false);

  return (
    <div className="h-screen w-full bg-[#0d1117] text-white overflow-hidden flex flex-col">
      {/* Navbar with padding */}
      <div className="flex-none pt-4 pb-2 px-4 bg-[#0d1117] border-b border-gray-800/50">
        <div className="flex justify-center">
          {/* Your existing Navbar component will be rendered here */}
          <div className="bg-[#1c2128] rounded-lg px-2 py-1 border border-gray-700/50 shadow-lg">
            {/* This is where your Navbar component renders */}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar */}
        <div
          className={cn(
            "bg-[#161b22] border-r border-gray-700/50 transition-all duration-300 ease-in-out flex-shrink-0",
            leftSide ? "w-[20%] min-w-[250px]" : "w-0"
          )}
        >
          <div
            className={cn(
              "h-full overflow-hidden transition-opacity duration-300",
              leftSide ? "opacity-100" : "opacity-0"
            )}
          >
            {leftSide && (
              <div className="p-4 h-full">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">File Explorer</h3>
                  <div className="h-px bg-gray-700/50"></div>
                </div>
                <div className="h-[calc(100%-2rem)] overflow-y-auto">
                  <FileSystem />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editor Container */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
          {/* Editor */}
          <div className="flex-1 relative overflow-hidden">
            <CollaborativeEditorWithNoSSR
              leftSide={leftSide}
              rightSide={rightSide}
              setLeftSide={setLeftSide}
              setRightSide={setRightSide}
              file={'whatever-is-selected'}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          className={cn(
            "bg-[#161b22] border-l border-gray-700/50 transition-all duration-300 ease-in-out flex-shrink-0",
            rightSide ? "w-[20%] min-w-[300px]" : "w-0"
          )}
        >
          <div
            className={cn(
              "h-full overflow-hidden transition-opacity duration-300",
              rightSide ? "opacity-100" : "opacity-0"
            )}
          >
            {rightSide && (
              <div className="p-4 h-full">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Output</h3>
                  <div className="h-px bg-gray-700/50"></div>
                </div>
                <div className="h-[calc(100%-2rem)] overflow-y-auto">
                  <OutputBox />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}