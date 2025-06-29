"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Loader2, UserPlus, Settings, Info } from "lucide-react";

import RoomInfoForm from "./components/RoomInfoForm";
// import EditorSettingsForm from "./components/EditorSettingsForm";
import UserManagementSection from "./components/UserManagementSection";

export default function RoomSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.roomId as string;
  const [room, setRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("room-info");
  const [roomUsers, setRoomUsers] = useState<any[] | null>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Optional: if you have a loading state
        await Promise.all([fetchRoomById(id), fetchRoomMembers(id)]);
      } catch (error) {
        // Handle error (e.g., set an error state)
        console.error(error);
      } finally {
        setIsLoading(false); // Optional
      }
    };

    fetchData();
  }, [id]);

  const fetchRoomMembers = async (roomId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}/members`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();

      // Correctly access the users array from the response
      setRoomUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching room members:", err);
      toast.error("Failed to fetch room members");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoomById = async (roomId: string) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        setRoom(data);
      } else {
        toast.error("Failed to load room data");
      }
    } catch (error) {
      console.error("Error fetching room:", error);
      toast.error("Something went wrong while loading the room");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading room settings...</span>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{room?.name}</h1>
        <p className="text-muted-foreground">
          Manage room settings and permissions
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="room-info" className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            Room Information
          </TabsTrigger>
          {/* <TabsTrigger
            value="room-settings"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Editor Settings
          </TabsTrigger> */}
          <TabsTrigger value="room-users" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            User Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="room-info">
          <RoomInfoForm room={room} roomId={id} onUpdate={fetchRoomById} />
        </TabsContent>

        {/* <TabsContent value="room-settings">
          <EditorSettingsForm
            room={room}
            roomId={id}
            onUpdate={fetchRoomById}
          />
        </TabsContent> */}

        <TabsContent value="room-users">
          <UserManagementSection
            room={room}
            roomUsers={roomUsers}
            roomId={id}
            onUpdate={fetchRoomById}
            onGoToWorkspace={() => router.push(`/home/${id}/code`)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
