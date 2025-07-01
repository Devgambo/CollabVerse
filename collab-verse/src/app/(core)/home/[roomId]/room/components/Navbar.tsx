"use client";

import {
  Code,
  HomeIcon,
  LinkIcon,
  LucidePanelsRightBottom,
  LucideSwitchCamera,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Separator } from "@/src/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";
import { Dock, DockIcon } from "@/src/components/magicui/dock";
export type IconProps = React.HTMLAttributes<SVGElement>;

import { UserButton, useUser } from "@clerk/nextjs";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { toast } from "sonner";
import RoomSettingsModal from "./RoomSettingsModal";

type NavbarProps = {
  roomId: string;
};

export default function Navbar({ roomId }: NavbarProps) {
  const { user } = useUser();
  const others = useOthers();
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);

  const getUserColor = (id: string) => {
    const hash = Array.from(id).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return `hsl(${Math.abs(hash % 360)}, 70%, 60%)`;
  };

  return (
    <>
      <nav className="w-[25%] absolute right-[35%] -top-8 z-50">
        <TooltipProvider>
          <div className="shadow-xl">
            <Dock
              direction="middle"
              className="border-[1px] border-gray-950 backdrop-blur-md bg-gray-800/50"
            >
              <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center justify-center size-10 rounded-lg hover:bg-gray-700/50 transition-colors duration-200",
                      )}
                    >
                      <UserButton
                        appearance={{
                          elements: {
                            userButtonAvatarBox: {
                              width: "1.75rem",
                              height: "1.75rem",
                            },
                          },
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-gray-800 text-white border-gray-600"
                  >
                    <p>{user?.firstName}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>

              <Separator
                orientation="vertical"
                className="h-8 bg-gray-600/30 mx-1"
              />

              <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/home/${roomId}/room/whiteboard`}
                      className={cn(
                        "flex items-center justify-center size-10 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 text-gray-300 hover:text-white",
                      )}
                    >
                      <LucideSwitchCamera className="size-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-gray-800 text-white border-gray-600"
                  >
                    <p>Switch to WhiteBoard</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>

              <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/home/${roomId}/room/code-editor`}
                      className={cn(
                        "flex items-center justify-center size-10 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 text-gray-300 hover:text-white",
                      )}
                    >
                      <Code className="size-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-gray-800 text-white border-gray-600"
                  >
                    <p>Switch to Code Editor</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>

              <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        const shareUrl = window.location.href;
                        navigator.clipboard.writeText(shareUrl);
                        toast.success("Session Link Copied!");
                      }}
                      className={cn(
                        "flex items-center justify-center size-10 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 text-gray-300 hover:text-white",
                      )}
                    >
                      <LinkIcon className="size-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-gray-800 text-white border-gray-600"
                  >
                    <p>Copy session link</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>

              <Separator
                orientation="vertical"
                className="h-8 bg-gray-600/30 mx-1"
              />

              <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setSettingsModalOpen(true)}
                      className={cn(
                        "flex items-center justify-center size-10 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 text-gray-300 hover:text-white",
                      )}
                    >
                      <LucidePanelsRightBottom className="size-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-gray-800 text-white border-gray-600"
                  >
                    <p>Manage Room Settings</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
              <Separator
                orientation="vertical"
                className="h-8 bg-gray-600/30 mx-1"
              />

              <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 px-2">
                      {others.length > 0 ? (
                        others.slice(0, 3).map((person, index) => {
                          const info = person.info as
                            | { name?: string }
                            | undefined;
                          return (
                            <div
                              key={person.connectionId}
                              className={cn(
                                "w-7 h-7 rounded-full border-2 border-gray-700 flex items-center justify-center text-xs font-semibold text-white transition-transform hover:scale-110",
                                index > 0 && "-ml-2",
                              )}
                              style={{
                                background: getUserColor(
                                  person.connectionId.toString(),
                                ),
                              }}
                            >
                              {info?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          );
                        })
                      ) : (
                        <div className="w-7 h-7 rounded-full border-2 border-gray-600 border-dashed flex items-center justify-center text-xs text-gray-500">
                          <span>•</span>
                        </div>
                      )}
                      {others.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-gray-600 border-2 border-gray-700 flex items-center justify-center text-xs font-semibold text-white -ml-2">
                          +{others.length - 3}
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-gray-800 text-white border-gray-600"
                  >
                    <p>
                      {others.length > 0
                        ? `${others.length} other user${others.length > 1 ? "s" : ""} online`
                        : "No other users online"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            </Dock>
          </div>
        </TooltipProvider>
      </nav>
      <RoomSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        roomId={roomId}
      />
    </>
  );
}
