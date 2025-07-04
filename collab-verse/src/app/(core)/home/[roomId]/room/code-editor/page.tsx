"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  MessageCircleDashedIcon,
  MessageCircleIcon,
  Text,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import ChatBox from "@/src/components/code-editor-components/ChatBox";
import FileSystem from "@/src/components/FileSystem";
import OutputBox from "@/src/components/OutputBox";
import { cn } from "@/src/lib/utils";

const CollaborativeEditorWithNoSSR = dynamic(
  () =>
    import("@/src/components/code-editor-components/ColloborativeEditor").then(
      (mod) => mod.CollaborativeEditor,
    ),
  { ssr: false },
);

export default function CodeEditorPage() {
  const params = useParams();
  const { roomId } = params;
  const [leftSide, setLeftSide] = useState(true);
  const [rightSide, setRightSide] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [chatOpen, setChatOpen] = useState<boolean>(true);

  const [fileId, setFileId] = useState<string>("");

  //TODO:fetching the messages with respect to the room-id
  useEffect(() => {
    const checkAccess = async () => {
      if (!isLoaded || !isSignedIn) return;
      try {
        setIsLoading(true);
        const response = await fetch(`/api/rooms/${roomId}/access`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          toast.error(data.error || "You don't have access to this room");
          router.push(`/home/${roomId}/join`);
          return;
        }

        setPermissions(data.permissions || []);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to verify room access");
        router.push("/home");
      }
    };

    checkAccess();
  }, [roomId, router, isLoaded, isSignedIn, setChatOpen]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d1117]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#0d1117] text-white overflow-hidden flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar */}
        <div
          className={cn(
            "bg-[#161b22] border-r border-gray-700/50 transition-all duration-300 ease-in-out flex-shrink-0",
            leftSide ? "w-[20%] min-w-[250px]" : "w-0",
          )}
        >
          <div
            className={cn(
              "h-full overflow-hidden transition-opacity duration-300",
              leftSide ? "opacity-100" : "opacity-0",
            )}
          >
            {/* File Tree Component */}
            {leftSide && (
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    File Explorer
                  </h3>
                  <div className="h-px bg-gray-700/50"></div>
                </div>
                <div className="h-[calc(100%-2rem)] overflow-y-auto">
                  {/*  TODO : Fix the expand thing + delete message to show users */}
                  that please delete all children
                  <FileSystem
                    roomId={roomId}
                    activeFileId={fileId}
                    setActiveFileId={setFileId}
                  />
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
              fileId={fileId}
              permissions={permissions}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          className={cn(
            "bg-[#161b22] border-l border-gray-700/50 transition-all duration-300 ease-in-out flex-shrink-0",
            rightSide ? "w-[20%] min-w-[300px]" : "w-0",
          )}
        >
          <div
            className={cn(
              "h-full overflow-hidden transition-opacity duration-300",
              rightSide ? "opacity-100" : "opacity-0",
            )}
          >
            {rightSide && (
              <div className="p-4 h-full">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Output
                  </h3>
                  <div className="h-px bg-gray-700/50"></div>
                </div>
                <div className="h-[calc(100%-2rem)] overflow-y-auto">
                  <OutputBox />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* chat vala dabba*/}
        <div>
          {!chatOpen && (
            <button
              onClick={() => {
                setChatOpen((prev) => !prev);
              }}
              className="h-12 w-15 z-50 absolute bottom-15 right-20"
            >
              <div className="group relative">
                <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-md transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#161b22] ring-1 ring-gray-700/50">
                  <MessageCircleIcon className="h-7 w-7 text-gray-400 transition-colors group-hover:text-white" />
                </div>
              </div>
            </button>
          )}
          {chatOpen && (
            <div className="absolute w-[500px] right-30 bottom-2 z-50">
              <ChatBox roomId={roomId} setChatOpen={setChatOpen} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
