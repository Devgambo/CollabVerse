"use client";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoomSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.roomId as string;
  const [room, setRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRoomById(id);
  }, [id]);

  const fetchRoomById = async (roomId: string) => {
    try {
      // Fetch just this specific room
      const response = await fetch(`/api/rooms/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setRoom(data);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Error fetching room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading room data...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        {room?.name}
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {room?.roomType?.toUpperCase() || "ROOM"}
        </span>
      </h1>
      <div className="mb-4">
        <span className="block text-sm text-gray-500">Room ID:</span>
        <span className="font-mono text-base">{room?.id}</span>
      </div>
      <div className="mb-4">
        <span className="block text-sm text-gray-500">Owner:</span>
        <span className="font-mono text-base">{room?.ownerId}</span>
      </div>
      <div className="mb-4">
        <span className="block text-sm text-gray-500">Created At:</span>
        <span className="font-mono text-base">
          {room?.createdAt
            ? new Date(Number(room.createdAt)).toLocaleString()
            : "Unknown"}
        </span>
      </div>
      <div className="mb-4">
        <span className="block text-sm text-gray-500">Access:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-32">
              {room?.isPublic ? "Public" : "Private"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            <Button
              variant="ghost"
              className={`justify-start w-full ${room?.isPublic ? "font-bold" : ""}`}
              onClick={() => {}}
            >
              Public
            </Button>
            <Button
              variant="ghost"
              className={`justify-start w-full ${!room?.isPublic ? "font-bold" : ""}`}
              onClick={() => {}}
            >
              Private
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mb-4">
        <span className="block text-sm text-gray-500">Default Accesses:</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {room?.defaultAccesses?.map((access: string) => (
            <span
              key={access}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
            >
              {access}
            </span>
          ))}
        </div>
      </div>

      <Button
        variant="default"
        onClick={() => {
          router.push(`/home/${id}/code`);
        }}
      >
        Let's Manifest!!
      </Button>
    </div>
  );
}
