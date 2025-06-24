"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelf } from "@liveblocks/react/suspense";
import { AwarenessList, UserAwareness } from "@/liveblocks.config";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { generateRandomColor } from "@/lib/utils"; // You'll need to create this

type Props = {
  yProvider: LiveblocksYjsProvider;
};

export function Cursors({ yProvider }: Props) {
  // Get user info from Liveblocks authentication endpoint
  const userInfo = useSelf((me) => me.info);
  const [awarenessUsers, setAwarenessUsers] = useState<AwarenessList>([]);

  useEffect(() => {
    // Add user info to Yjs awareness with random color if not provided
    const localUser: UserAwareness["user"] = {
      name: userInfo?.name || "Unknown",
      color: generateRandomColor(),
      avatar: userInfo?.avatar || "",
    };

    yProvider.awareness.setLocalStateField("user", localUser);

    // On changes, update `awarenessUsers`
    function setUsers() {
      setAwarenessUsers([...yProvider.awareness.getStates()] as AwarenessList);
    }

    yProvider.awareness.on("change", setUsers);
    setUsers();

    return () => {
      yProvider.awareness.off("change", setUsers);
    };
  }, [yProvider, userInfo]);

  // Note: We still need to use dangerouslySetInnerHTML here because of how Monaco cursor styling works
  // This cannot be converted to pure Tailwind as it needs to inject dynamic class names for cursor highlighting
  const styleSheet = useMemo(() => {
    let cursorStyles = "";

    for (const [clientId, client] of awarenessUsers) {
      if (client?.user) {
        // Add styles for remote selection and cursor
        cursorStyles += `
          .yRemoteSelection-${clientId}, 
          .yRemoteSelectionHead-${clientId}  {
            --user-color: ${client.user.color || "#ff0000"};
          }
          
          .yRemoteSelectionHead-${clientId}::after {
            content: "${client.user.name || "Anonymous"}";
            background-color: var(--user-color);
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
          }
        `;
      }
    }

    return { __html: cursorStyles };
  }, [awarenessUsers]);

  return <style dangerouslySetInnerHTML={styleSheet} />;
}
