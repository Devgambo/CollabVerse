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
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import {
  Loader2,
  UserPlus,
  Settings,
  Info,
  Code2,
  ArrowLeft,
  Users,
  Share2,
  Lock,
  Unlock,
  Calendar,
  Clock,
} from "lucide-react";
import { motion, easeInOut } from "framer-motion";
import { animations } from "@/src/lib/design-system";

import RoomInfoForm from "./components/RoomInfoForm";

export default function RoomSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.roomId as string;
  const [room, setRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("room-info");

  useEffect(() => {
    fetchRoomById(id);
  }, [id]);

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

  const goToCodeEditor = () => {
    router.push(`/home/${id}/room/code-editor`);
  };

  const goBack = () => {
    router.push("/home");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading room settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <motion.div className="bg-slate-900/50 border-b border-slate-800 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rooms
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-white">
                    {room?.name}
                  </h1>
                  <Badge variant="secondary" className="text-xs bg-amber-200">
                    {room?.isPublic ? (
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
                <p className="text-slate-400">Room Settings & Configuration</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={goToCodeEditor}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Code2 className="w-4 h-4 mr-2" />
                Open Editor
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Room Stats Sidebar */}
            <motion.div
              className="lg:col-span-1 space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, ease: easeInOut }}
            >
              <Card className="bg-slate-900/50 border-slate-800 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Room Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">
                      {room?.users?.length || 0} members
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">
                      Created{" "}
                      {new Date(
                        room?.createdAt || Date.now(),
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">
                      Updated{" "}
                      {new Date(
                        room?.updatedAt || Date.now(),
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-purple-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Members
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Room
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                  >
                    <TabsList className="grid w-full grid-cols-1 bg-slate-800 border-slate-700">
                      <TabsTrigger
                        value="room-info"
                        className="flex items-center gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                      >
                        <Info className="w-4 h-4" />
                        <span className="hidden sm:block">
                          Room Information
                        </span>
                        <span className="sm:hidden">Info</span>
                      </TabsTrigger>
                      {/* <TabsTrigger
                        value="room-settings"
                        className="flex items-center gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:block">Editor Settings</span>
                        <span className="sm:hidden">Settings</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="room-users"
                        className="flex items-center gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:block">User Management</span>
                        <span className="sm:hidden">Users</span>
                      </TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="room-info">
                      <RoomInfoForm
                        room={room}
                        roomId={id}
                        onUpdate={fetchRoomById}
                      />
                    </TabsContent>

                    {/* <TabsContent value="room-settings">
                      <div className="space-y-6">
                        <div className="text-center py-12">
                          <Settings className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-slate-300 mb-2">
                            Editor Settings
                          </h3>
                          <p className="text-slate-400">
                            Coming soon - Configure your editor preferences
                          </p>
                        </div>
                      </div>
                    </TabsContent> */}

                    {/* <TabsContent value="room-users">
                      <div className="space-y-6">
                        <div className="text-center py-12">
                          <UserPlus className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-slate-300 mb-2">
                            User Management
                          </h3>
                          <p className="text-slate-400">
                            Coming soon - Manage room members and permissions
                          </p>
                        </div>
                      </div>
                    </TabsContent> */}
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
