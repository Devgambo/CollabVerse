"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUser, SignIn } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";

export default function JoinRoomPage() {
  const params = useParams();
  const { roomId } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { isSignedIn, isLoaded, user } = useUser();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [invitationDetails, setInvitationDetails] = useState<any>(null);

  useEffect(() => {
    const fetchRoomAndInvitation = async () => {
      try {
        setIsProcessing(true);
        const convex = new ConvexHttpClient(
          process.env.NEXT_PUBLIC_CONVEX_URL || "",
        );

        const room = await convex.query(api.rooms.getRoomById, {
          roomId: roomId as string,
        });
        setRoomDetails(room);

        if (token) {
          const invitation = await convex.query(
            api.invitations.getInvitationByToken,
            { token },
          );
          setInvitationDetails(invitation);

          if (!invitation) {
            setError("Invalid or expired invitation");
          }
        }
      } catch (err) {
        setError("Failed to load room details");
      } finally {
        setIsProcessing(false);
      }
    };

    if (roomId) {
      fetchRoomAndInvitation();
    }
  }, [roomId, token]);

  useEffect(() => {
    const processJoin = async () => {
      if (!isLoaded || !isSignedIn || !user || isProcessing) return;

      try {
        setIsProcessing(true);

        const response = await fetch(`/api/rooms/${roomId}/access`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          router.push(`/home/${roomId}/room/code-editor`);
        } else {
          setError(data.error || "Access denied");
        }
      } catch (err) {
        setError("Failed to process room access");
      } finally {
        setIsProcessing(false);
      }
    };

    if (isLoaded && isSignedIn && roomDetails) {
      processJoin();
    }
  }, [
    isLoaded,
    isSignedIn,
    user,
    roomDetails,
    roomId,
    router,
    token,
    isProcessing,
  ]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-800/50 p-6 backdrop-blur-sm">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            Sign in to join the room
          </h2>
          <SignIn
            redirectUrl={`/home/${roomId}/join${token ? `?token=${token}` : ""}`}
          />
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-800/50 p-6 text-center backdrop-blur-sm">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />
          <h2 className="text-xl font-medium text-white">
            Processing your access...
          </h2>
          <p className="mt-2 text-gray-400">
            Please wait while we verify your invitation
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-800/50 p-6 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-900/20 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-white">Access Error</h2>
          <p className="mt-2 text-gray-400">{error}</p>
          <Button
            onClick={() => router.push("/home")}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-800/50 p-6 text-center backdrop-blur-sm">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />
        <h2 className="text-xl font-medium text-white">Joining room...</h2>
      </div>
    </div>
  );
}
