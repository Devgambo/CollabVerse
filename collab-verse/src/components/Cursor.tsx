import { useEffect, useMemo, useState } from "react";
import { useSelf } from "@liveblocks/react/suspense";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useCallback } from "react";

type Props = {
    yProvider: LiveblocksYjsProvider;
};

export function Cursors({ yProvider }: Props) {
    const userInfo = useSelf((me) => me.info);

    const [awarenessUsers, setAwarenessUsers] = useState<any[]>([]);

    useEffect(() => {
        yProvider.awareness.setLocalStateField("user", userInfo);

        function setUsers() {
            setAwarenessUsers(Array.from(yProvider.awareness.getStates().entries()));
        }

        yProvider.awareness.on("change", setUsers);
        setUsers();

        return () => {
            yProvider.awareness.off("change", setUsers);
        };
    }, [yProvider, userInfo]);

    // Render cursors using TailwindCSS
    return (
        <>
            {awarenessUsers.map(([clientId, client]) =>
                client?.user ? (
                    <div
                        key={clientId}
                        className="absolute pointer-events-none flex items-center space-x-2"
                        style={{
                            left: client.cursor?.x ?? 0,
                            top: client.cursor?.y ?? 0,
                            zIndex: 50,
                        }}
                    >
                        <div
                            className="w-3 h-3 rounded-full border-2"
                            style={{
                                backgroundColor: client.user.color || "orangered",
                                borderColor: client.user.color || "orangered",
                            }}
                        />
                        <span
                            className="px-2 py-1 rounded text-xs font-medium shadow bg-white border"
                            style={{
                                color: client.user.color || "orangered",
                                borderColor: client.user.color || "orangered",
                            }}
                        >
                            {client.user.name}
                        </span>
                    </div>
                ) : null
            )}
        </>
    );
}