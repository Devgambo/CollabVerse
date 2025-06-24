"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Code Ed");
  const { user } = useUser();

  const tabs = [{ name: "Code Ed" }, { name: "Text Ed" }, { name: "Canvas" }];

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[#0f0f0f] border-b border-[#333] relative z-50">
      {/* Left section with status indicator */}
      <div className="flex items-center gap-4">
        <div className="flex justify-center items-center text-white rounded-fullshadow-lg shadow-green-500/50">
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
          <div className="px-2 text-xl text-white">
            {(user && user.firstName) || "UK"}
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

      {/* Right section with avatars and share button */}
      <div className="flex items-center gap-3">
        {/* Collaboration avatars */}
        <div className="flex items-center -space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-2 border-[#0f0f0f] flex items-center justify-center text-xs font-semibold text-white">
            A
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-[#0f0f0f] flex items-center justify-center text-xs font-semibold text-white">
            P
          </div>
        </div>

        {/* Share button */}
        <button className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all duration-200">
          <div className="flex flex-col items-center">
            <span className="text-xs">SHARE</span>
            <span className="text-xs">SESSION</span>
          </div>
        </button>
      </div>
    </nav>
  );
}
