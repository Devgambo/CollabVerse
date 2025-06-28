"use client";

import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#1a1a1a] text-[#ededed] relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23333%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      <main className="flex-1 relative z-10">
        <SignedIn>
          <RedirectToDashboard />
        </SignedIn>
        <SignedOut>
          <LandingPage />
        </SignedOut>
      </main>
      <footer className="py-6 px-4 border-t border-[#222222] text-center text-[#666666] text-sm relative z-10">
        © 2025 CollabVerse. All rights reserved.
      </footer>
    </div>
  );
}

function RedirectToDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>
      <Link
        href="/home"
        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-md font-medium transition-colors"
      >
        Go to Editor
      </Link>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto mb-16 text-center relative">
        <div className="mb-6">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold animate-bounce">
            🎉 FREE TRIAL - No Credit Card Required
          </span>
        </div>

        <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text leading-tight">
          Code Together
          <br />
          <span className="text-5xl md:text-6xl">in Perfect Darkness</span>
        </h1>

        <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
          The collaborative code editor that{" "}
          <strong className="text-white">actually works</strong> for your team
        </p>

        {/* Primary CTA - Above the fold */}
        <div className="mb-16 flex flex-col items-center relative">
          {/* Left Arrow */}
          <img
            src="lr-arrow.svg"
            className="absolute left-[30px] lg:left-[-10px] lg:pb-10 top-1/2 -translate-y-1/2 h-16 w-16 lg:h-32 lg:w-32 rotate-[-20deg] pointer-events-none"
            alt="Arrow pointing to signup"
          />
          <SignUpButton mode="modal" fallbackRedirectUrl="/code">
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-6 rounded-2xl text-2xl font-bold transition-all transform hover:scale-105 shadow-2xl border border-blue-500/50 relative z-10">
              <span className="flex items-center gap-3">
                ⚡ Start Free Trial
                <svg
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>
          </SignUpButton>
          {/* Right Arrow */}
          <img
            src="rl-arrow.svg"
            className="absolute right-[30px] lg:right-[10px] lg:pb-10 top-1/2 -translate-y-1/2 h-16 w-16 lg:h-32 lg:w-32   rotate-[20deg] pointer-events-none"
            alt="Arrow pointing to signup"
          />
          <p className="mt-4 text-gray-400">Setup in under 60 seconds</p>
        </div>
      </div>

      {/* Bento Grid Features */}
      <div className="w-full max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large feature - Code Preview */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-2xl border border-[#333] shadow-2xl overflow-hidden p-6">
            <div className="bg-[#1e1e1e] py-2 px-4 flex items-center rounded-lg mb-4">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <span className="text-xs text-gray-500">team-project.tsx</span>
            </div>
            <div className="font-mono text-sm">
              <pre className="text-gray-400">
                <span className="text-pink-400">const</span>{" "}
                <span className="text-yellow-400">TeamProject</span> = () =
                {"> "}
                {"{"}
              </pre>
              <pre className="text-gray-400 bg-blue-900/20 border-l-2 border-blue-500 pl-2">
                {" "}
                <span className="text-gray-600">// 👨‍💻 Alex is typing...</span>
              </pre>
              <pre className="text-gray-400">
                {" "}
                <span className="text-pink-400">return</span>{" "}
                <span className="text-purple-400">&lt;CollabEditor</span>{" "}
                <span className="text-blue-400">theme</span>=
                <span className="text-green-400">"dark"</span>{" "}
                <span className="text-purple-400">/&gt;</span>
              </pre>
              <pre className="text-gray-400">{"}"}</pre>
            </div>
          </div>

          {/* Feature cards */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 p-6 rounded-2xl border border-blue-500/30">
              <h3 className="text-xl font-bold mb-2 text-blue-400">
                ⚡ Real-time
              </h3>
              <p className="text-gray-300">See changes instantly</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 p-6 rounded-2xl border border-purple-500/30">
              <h3 className="text-xl font-bold mb-2 text-purple-400">
                👁️ Eye-friendly
              </h3>
              <p className="text-gray-300">Perfect dark theme</p>
            </div>
          </div>
        </div>

        {/* Additional features row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 p-6 rounded-2xl border border-green-500/30">
            <h3 className="text-xl font-bold mb-2 text-green-400">
              🔧 Git Integration
            </h3>
            <p className="text-gray-300">Built-in version control</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 p-6 rounded-2xl border border-orange-500/30">
            <h3 className="text-xl font-bold mb-2 text-orange-400">
              🚀 Fast Setup
            </h3>
            <p className="text-gray-300">Ready in seconds</p>
          </div>

          <div className="bg-gradient-to-br from-pink-900/20 to-pink-800/20 p-6 rounded-2xl border border-pink-500/30">
            <h3 className="text-xl font-bold mb-2 text-pink-400">
              👥 Team-first
            </h3>
            <p className="text-gray-300">Built for collaboration</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="w-full max-w-2xl mx-auto text-center bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] p-12 rounded-3xl border border-[#333]">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
          Join 1000+ developers coding better
        </h2>
        <SignUpButton mode="modal">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 mb-4">
            Start Your Free Trial
          </button>
        </SignUpButton>
        <p className="text-gray-400">
          No commitment • Cancel anytime • Setup in 1 minute
        </p>
      </div>
    </div>
  );
}
