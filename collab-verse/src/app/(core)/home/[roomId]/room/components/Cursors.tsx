"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelf } from "@liveblocks/react/suspense";
import { AwarenessList, UserAwareness } from "@/src/liveblocks.config";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { generateRandomColor } from "@/src/lib/utils";

type Props = {
  yProvider: LiveblocksYjsProvider;
};

export interface User {
  name: string;
  username?: string;
  email?: string;
  avatar?: string;
}

export function Cursors({ yProvider }: Props) {
  // Get user info from Liveblocks authentication endpoint
  const userInfo = useSelf((me) => me.info) as User | undefined;
  const [awarenessUsers, setAwarenessUsers] = useState<AwarenessList>([]);

  useEffect(() => {
    // Better user name fallback with logging for debugging
    const userDisplayName =
      userInfo?.name || userInfo?.username || userInfo?.email || "Anonymous";
    console.log("Cursor component user info:", { userInfo, userDisplayName });

    const userColor = generateRandomColor();

    // Add user info to Yjs awareness with better metadata
    const localUser: UserAwareness["user"] = {
      name: userDisplayName,
      color: userColor,
      avatar: userInfo?.avatar || "",
    };

    // Set user information with debugging
    console.log("Setting local awareness:", localUser);
    yProvider.awareness.setLocalStateField("user", localUser);

    // On changes, update `awarenessUsers` with better error handling
    function setUsers() {
      try {
        const states = [...yProvider.awareness.getStates()] as AwarenessList;
        console.log("Awareness states updated:", states.length);
        setAwarenessUsers(states);
      } catch (error) {
        console.error("Error updating awareness states:", error);
      }
    }

    yProvider.awareness.on("change", setUsers);
    setUsers();

    return () => {
      yProvider.awareness.off("change", setUsers);
    };
  }, [yProvider, userInfo]);

  // Optimized stylesheet generation with memoization
  const styleSheet = useMemo(() => {
    let cursorStyles = "";

    for (const [clientId, client] of awarenessUsers) {
      if (client?.user) {
        // Add styles for remote selection and cursor with improved visibility
        cursorStyles += `
          .yRemoteSelection-${clientId} {
            background-color: ${client.user.color}33; /* 20% opacity */
          }
          
          .yRemoteSelectionHead-${clientId} {
            position: absolute;
            border-left: 2px solid ${client.user.color};
            border-top: 2px solid ${client.user.color};
            border-bottom: 2px solid ${client.user.color};
            height: 100%;
            box-sizing: border-box;
          }
          
          .yRemoteSelectionHead-${clientId}::after {
            content: "${client.user.name || "Anonymous"}";
            background-color: ${client.user.color};
            padding: 2px 6px;
            border-radius: 4px;
            color: white;
            font-size: 12px;
            font-weight: bold;
            position: absolute;
            left: 0;
            white-space: nowrap;
            transform: translateY(-100%);
            opacity: 0.85;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            pointer-events: none;
            user-select: none;
          }
        `;
      }
    }

    return { __html: cursorStyles };
  }, [awarenessUsers]);

  return <style dangerouslySetInnerHTML={styleSheet} />;
}

// Helper function to generate consistent colors from strings
function generateColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 60%)`;
}
