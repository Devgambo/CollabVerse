"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2,
  PlusCircle,
  Clock,
  Users,
  Trash2,
  Code2,
  Settings,
  Share2,
  Lock,
  Unlock,
  Search,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { animations } from "@/src/lib/design-system";

export default function HomePage() {
  const [roomName, setRoomName] = useState<string>("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [filterType, _setFilterType] = useState<"all" | "owned" | "joined">(
    "all",
  );
  const router = useRouter();

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchQuery, filterType]);

  const filterRooms = () => {
    let filtered = rooms;

    if (searchQuery) {
      filtered = filtered.filter((room) =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((room) => {
        // Add logic based on user ID when available
        return true;
      });
    }

    setFilteredRooms(filtered);
  };

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
        toast.success("🎉 Room created successfully!");
        setRoomName("");
        fetchRooms();
      } else {
        toast.error(body.error || "Failed to create room");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Could not connect to the server.");
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = (roomId: string) => {
    router.push(`/home/${roomId}`);
  };

  const goToCodeEditor = (roomId: string) => {
    setIsLoading(true);
    router.push(`/home/${roomId}/room/code-editor`);
    setIsLoading(false);
  };

  const deleteRoom = async (roomId: string, ownerId: string) => {
    setIsLoading(true);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm border-b border-slate-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-6 py-12">
          <div className="max-w-4xl text-4xl font-mono text-amber-100  ">
            CollabVerse
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Room Section */}
            <motion.div className="lg:col-span-1" {...animations.slideIn}>
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                      <PlusCircle className="w-5 h-5 text-white" />
                    </div>
                    Create New Room
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Start a new collaborative coding session
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="room-name"
                      className="text-sm font-medium text-slate-300"
                    >
                      Room Name
                    </label>
                    <Input
                      id="room-name"
                      placeholder="e.g., React Workshop, Team Project..."
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      disabled={isCreating}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleRoomCreation()
                      }
                    />
                  </div>
                  <Button
                    onClick={handleRoomCreation}
                    disabled={isCreating || !roomName.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 transition-all duration-200"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Room...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Room
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rooms List Section */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl text-white">
                        Your Rooms
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Manage and access your collaborative spaces
                      </CardDescription>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          placeholder="Search rooms..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 w-48"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchRooms}
                        disabled={isLoading}
                        className="border-slate-700 bg-slate-500 text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                        />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        className="flex justify-center items-center h-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                          <p className="text-gray-200">Loading your rooms...</p>
                        </div>
                      </motion.div>
                    ) : filteredRooms?.length ? (
                      <motion.div className="space-y-3" {...animations.stagger}>
                        {filteredRooms.map((room, index) => (
                          <motion.div
                            key={room._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                            className="group"
                          >
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-200">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12 border-2 border-slate-700">
                                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                                    {room?.name
                                      ?.substring(0, 2)
                                      .toUpperCase() || "R"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-white truncate">
                                      {room?.name || "Unknown Room"}
                                    </h4>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {room.isPublic ? (
                                        <>
                                          <Unlock className="w-3 h-3 mr-1" />
                                          Public
                                        </>
                                      ) : (
                                        <>
                                          <Lock className="w-3 h-3 mr-1" />
                                          Private
                                        </>
                                      )}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {new Date(
                                        room?.createdAt || Date.now(),
                                      ).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      {room?.users?.length || 0} members
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => goToCodeEditor(room._id)}
                                  className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                                >
                                  <Code2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => joinRoom(room._id)}
                                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-slate-400 hover:text-slate-300 hover:bg-slate-400/10"
                                >
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    deleteRoom(room._id, room.ownerId)
                                  }
                                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Code2 className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-300 mb-2">
                          {searchQuery ? "No rooms found" : "No rooms yet"}
                        </h3>
                        <p className="text-slate-400 mb-4">
                          {searchQuery
                            ? "Try adjusting your search criteria"
                            : "Create your first room to start collaborating"}
                        </p>
                        {!searchQuery && (
                          <Button
                            onClick={() =>
                              document.getElementById("room-name")?.focus()
                            }
                            variant="outline"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                          >
                            Create Your First Room
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
