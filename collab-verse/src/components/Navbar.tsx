"use client";

import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useOthers, useSelf } from "@liveblocks/react/suspense";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Code Ed");
  const { user } = useUser();
  const others = useOthers();
  const currentUser = useSelf();

  const tabs = [{ name: "Code Ed" }, { name: "Text Ed" }, { name: "Canvas" }];

  // Generate a deterministic color based on user ID
  const getUserColor = (id: string) => {
    // Simple hash function to generate a number from string
    const hash = Array.from(id).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return `hsl(${Math.abs(hash % 360)}, 70%, 60%)`;
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[#0f0f0f] border-b border-[#333] relative z-50">
      {/* Left section with logo and status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* Online status indicator */}
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30"></div>

          {/* User avatar and name */}
          <div className="flex items-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "2.5rem",
                    height: "2.5rem",
                  },
                },
              }}
            />
            <div className="pl-2 text-base font-medium text-white">
              {(user && user.firstName) || "Guest"}
            </div>
          </div>
        </div>
      </div>

      {/* Center section with tabs */}
      <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-xl p-1 border border-[#333]">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                activeTab === tab.name
                  ? "bg-[#333] text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Right section with collaborators and share button */}
      <div className="flex items-center gap-3">
        {/* Collaboration avatars */}
        <div className="flex items-center -space-x-2">
          {/* Current user avatar */}
          <div
            className="w-8 h-8 rounded-full border-2 border-[#0f0f0f] flex items-center justify-center text-xs font-semibold text-white"
            style={{
              background: getUserColor(user?.id || "default-user"),
            }}
          >
            {user?.firstName?.charAt(0) || "?"}
          </div>

          {/* Other users avatars */}
          {others.map((person) => (
            <div
              key={person.connectionId}
              className="w-8 h-8 rounded-full border-2 border-[#0f0f0f] flex items-center justify-center text-xs font-semibold text-white"
              style={{
                background: getUserColor(person.connectionId.toString()),
              }}
            >
              {person.info?.name?.charAt(0) || "UK"}
            </div>
          ))}
        </div>

        {/* Share button */}
        <button
          className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all duration-200"
          onClick={() => {
            const shareUrl = window.location.href;
            navigator.clipboard.writeText(shareUrl);
            alert("Session link copied to clipboard!");
          }}
          title="Copy session link"
        >
          <div className="flex flex-col items-center">
            <span className="text-xs">SHARE</span>
            <span className="text-xs">SESSION</span>
          </div>
        </button>
      </div>
    </nav>
  );
}
