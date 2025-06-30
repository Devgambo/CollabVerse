"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const CollaborativeEditorWithNoSSR = dynamic(
  () =>
    import(
      "@/src/app/(core)/home/[roomId]/room/components/ColloborativeEditor"
    ).then((mod) => mod.CollaborativeEditor),
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
  const { user, isSignedIn, isLoaded } = useUser();

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
  }, [roomId, router, isLoaded, isSignedIn]);

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
    <div className="flex flex-col h-screen">
      {/* Your navbar would be here */}
      <div className="flex-1 relative">
        {" "}
        {/* This will take remaining height */}
        <CollaborativeEditorWithNoSSR
          leftSide={leftSide}
          rightSide={rightSide}
          setLeftSide={setLeftSide}
          setRightSide={setRightSide}
          file={{}}
          permissions={permissions}
        />
      </div>
    </div>
  );
}
