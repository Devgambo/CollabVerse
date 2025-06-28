"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { toast } from "sonner";
import {
  Loader2,
  PlusCircle,
  Clock,
  Users,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { Separator } from "@/src/components/ui/separator";
import { motion } from "framer-motion";

export default function HomePage() {
  const [roomName, setRoomName] = useState<string>("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const router = useRouter();

  // Fetch rooms on initial load
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/rooms");
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      } else {
        toast.error("Failed to load rooms. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomCreation = async () => {
    setIsLoading(true);
    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName }),
      });

      const body = await response.json();

      if (response.ok) {
        toast.success("Room created successfully");
        setRoomName("");
        // Fetch updated list of rooms
        fetchRooms();
      } else {
        toast.error(body.error || "Failed to create room");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Could not connect to the server.");
    } finally {
      setIsCreating(false);
      setIsLoading(false);
    }
  };

  const joinRoom = (roomId: string) => {
    router.push(`/home/${roomId}`);
  };

  const deleteRoom = async (roomId: string, ownerId: string) => {
    setIsLoading(true);
    console.log("ownerId ", ownerId);
    try {
      const response = await fetch("/api/rooms", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId, ownerId }),
      });

      const body = await response.json();

      if (response.ok) {
        toast.success("Room deleted successfully");
        // Fetch updated list of rooms
        fetchRooms();
      } else {
        toast.error(body.error || "Failed to delete room");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Create room section */}
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle size={20} />
                Create New Room
              </CardTitle>
              <CardDescription>
                Start a new collaborative coding session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="room-name" className="text-sm font-medium">
                    Room Name
                  </label>
                  <Input
                    id="room-name"
                    placeholder="Enter room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    disabled={isCreating}
                  />
                </div>
                <Button
                  onClick={handleRoomCreation}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Room"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rooms list section */}
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Available Rooms</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchRooms}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>
              <CardDescription>
                Join an existing collaborative room
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : rooms?.length ? (
                <div className="space-y-3">
                  {rooms.map((room, index) => (
                    <motion.div
                      key={room._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {room?.name?.substring(0, 2).toUpperCase() || "R"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">
                              {room?.name || "Unknown Room"}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                {new Date(
                                  room?.createdAt || Date.now(),
                                ).toLocaleDateString()}
                              </span>
                              <Separator
                                orientation="vertical"
                                className="h-3"
                              />
                              <span className="flex items-center">
                                <Users size={12} className="mr-1" />
                                {room?.users?.length || 0} users
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            onClick={() => joinRoom(room._id)}
                            size="sm"
                            className="gap-1 mx-2"
                          >
                            Join <ArrowRight size={14} />
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => deleteRoom(room._id, room.ownerId)}
                            size="sm"
                            className="gap-1"
                          >
                            Delete
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No rooms available</p>
                  <p className="text-sm">Create a new room to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
