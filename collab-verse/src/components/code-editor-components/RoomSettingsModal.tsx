"use client";

import { useState, useEffect } from "react";
import { User, InfoIcon, Users, Settings, Shield, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Separator } from "@/src/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

type User = {
  _id: string;
  userId: string;
  role: string;
  permissions: string[];
  user?: {
    name?: string;
    email?: string;
  };
};

type RoomSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
};

export default function RoomSettingsModal({
  isOpen,
  onClose,
  roomId,
}: RoomSettingsModalProps) {
  const { user: currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [room, setRoom] = useState<any>(null);
  const [roomUsers, setRoomUsers] = useState<User[]>([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPermission, setNewUserPermission] = useState<
    "read" | "write" | "none"
  >("read");
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [isPublic, setIsPublic] = useState(false);
  const [roomType, setRoomType] = useState<"collab" | "mentor">("collab");

  // Fetch room data
  useEffect(() => {
    if (!isOpen || !roomId) return;

    const fetchRoomData = async () => {
      setIsLoading(true);
      try {
        // Fetch room info
        const roomResponse = await fetch(`/api/rooms/${roomId}`);
        if (!roomResponse.ok) throw new Error("Failed to fetch room");
        const roomData = await roomResponse.json();
        setRoom(roomData);
        setIsPublic(roomData.isPublic || false);
        setRoomType(roomData.roomType || "collab");

        // Fetch room users
        const usersResponse = await fetch(`/api/rooms/${roomId}/members`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!usersResponse.ok) throw new Error("Failed to fetch members");
        const usersData = await usersResponse.json();
        setRoomUsers(usersData.users || []);
      } catch (error) {
        console.error("Error fetching room data:", error);
        toast.error("Failed to load room settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId, isOpen]);

  // Check if current user is room owner
  const isOwner = room?.ownerId === currentUser?.id;

  // Handle room settings update
  const handleSaveGeneralSettings = async () => {
    if (!isOwner) {
      toast.error("Only the room owner can modify these settings");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "roomInfo",
          data: {
            isPublic,
            roomType,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to update room");

      const result = await response.json();
      toast.success("Room settings updated successfully");
      setRoom({ ...room, isPublic, roomType });
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle adding a new user
  const handleAddUser = async () => {
    if (!isOwner) {
      toast.error("Only the room owner can add users");
      return;
    }

    if (!newUserEmail.trim() || !newUserEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSaving(true);
    try {
      // First, we need to check if the user exists in the system
      const checkUserResponse = await fetch(
        `/api/users?email=${encodeURIComponent(newUserEmail)}`,
      );
      const userData = await checkUserResponse.json();

      if (!userData?.userId) {
        toast.error("User not found with this email");
        setIsSaving(false);
        return;
      }

      // Now update or add the user to the room
      const permissions =
        newUserPermission === "none"
          ? []
          : newUserPermission === "write"
            ? ["read", "write"]
            : ["read"];

      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "roomUser",
          data: {
            targetUserId: userData.userId,
            role: newUserPermission === "write" ? "collaborator" : "student",
            permissions,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to add user");

      const result = await response.json();
      toast.success("User added successfully");

      // Add the new user to the list or update existing
      const newUser = {
        userId: userData.userId,
        role: newUserPermission === "write" ? "collaborator" : "student",
        permissions,
        user: { name: userData.username || "User", email: newUserEmail },
      };

      // Refresh the user list
      const usersResponse = await fetch(`/api/rooms/${roomId}/members`);
      const usersData = await usersResponse.json();
      setRoomUsers(usersData.users || []);

      // Reset the form
      setNewUserEmail("");
      setNewUserPermission("read");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user to room");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle updating user permissions
  const handleUpdateUserPermission = async (
    userId: string,
    newPermission: "read" | "write" | "none",
  ) => {
    if (!isOwner) {
      toast.error("Only the room owner can modify permissions");
      return;
    }

    // Cannot change owner's permissions
    if (room?.ownerId === userId) {
      toast.error("Cannot change owner's permissions");
      return;
    }

    setIsSaving(true);
    try {
      const permissions =
        newPermission === "none"
          ? []
          : newPermission === "write"
            ? ["read", "write"]
            : ["read"];

      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id,
          type: "roomUser",
          data: {
            targetUserId: userId,
            role: newPermission === "write" ? "collaborator" : "student",
            permissions,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to update user permissions");

      const result = await response.json();
      toast.success("User permissions updated");

      // Update the user in the list
      const updatedUsers = roomUsers.map((user) => {
        if (user.userId === userId) {
          return {
            ...user,
            role: newPermission === "write" ? "collaborator" : "student",
            permissions,
          };
        }
        return user;
      });

      setRoomUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("Failed to update user permissions");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto bg-[#1a1a1a] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Settings className="h-5 w-5" /> Room Settings
          </DialogTitle>
          <DialogDescription>
            Manage your room settings and user permissions
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-white rounded-full"></div>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 bg-gray-800">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-gray-700"
              >
                <Settings className="h-4 w-4 mr-2" /> General
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-gray-700"
              >
                <Users className="h-4 w-4 mr-2" /> Members
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="room-type"
                      className="text-sm flex items-center gap-1"
                    >
                      <InfoIcon className="h-3.5 w-3.5" /> Room Type
                    </Label>
                    <Select
                      disabled={!isOwner || isSaving}
                      value={roomType}
                      onValueChange={(value: "collab" | "mentor") =>
                        setRoomType(value)
                      }
                    >
                      <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="collab">Collaborative</SelectItem>
                        <SelectItem value="mentor">Mentoring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-gray-400">
                    {roomType === "collab"
                      ? "Collaborative mode allows all users to edit content"
                      : "Mentoring mode gives the owner more control over content"}
                  </p>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="public-toggle"
                      className="text-sm flex items-center gap-1"
                    >
                      <Shield className="h-3.5 w-3.5" /> Public Access
                    </Label>
                    <Switch
                      id="public-toggle"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                      disabled={!isOwner || isSaving}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {isPublic
                      ? "Anyone with the link can access this room"
                      : "Only invited users can access this room"}
                  </p>
                </div>

                <Separator className="bg-gray-700" />

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!isOwner || isSaving}
                  onClick={handleSaveGeneralSettings}
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4 py-4">
              <div className="space-y-4">
                {isOwner && (
                  <div className="space-y-3 bg-gray-800 p-3 rounded-md">
                    <h3 className="text-sm font-medium">Add New User</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Email address"
                        className="bg-gray-700 border-gray-600"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                      />
                      <Select
                        value={newUserPermission}
                        onValueChange={(value: "read" | "write" | "none") =>
                          setNewUserPermission(value)
                        }
                      >
                        <SelectTrigger className="w-[120px] bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Permission" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="none">Block</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                      onClick={handleAddUser}
                      disabled={isSaving}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add User
                    </Button>
                  </div>
                )}

                <h3 className="text-sm font-medium">
                  Current Members ({roomUsers.length})
                </h3>

                <div className="space-y-2">
                  {roomUsers.map((roomUser) => {
                    const isRoomOwner = roomUser.userId === room?.ownerId;
                    const currentPermission = roomUser.permissions?.includes(
                      "write",
                    )
                      ? "write"
                      : roomUser.permissions?.includes("read")
                        ? "read"
                        : "none";

                    return (
                      <div
                        key={roomUser._id || roomUser.userId}
                        className="flex items-center justify-between p-2 bg-gray-800 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-700 h-8 w-8 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {roomUser.user?.name || "User"}
                              {isRoomOwner && (
                                <Badge className="ml-2 bg-amber-600">
                                  Owner
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-gray-400">
                              {roomUser.user?.email || roomUser.userId}
                            </p>
                          </div>
                        </div>

                        {!isRoomOwner && isOwner ? (
                          <Select
                            value={currentPermission}
                            onValueChange={(value: "read" | "write" | "none") =>
                              handleUpdateUserPermission(roomUser.userId, value)
                            }
                            disabled={isSaving}
                          >
                            <SelectTrigger className="w-[100px] h-8 bg-gray-700 border-gray-600">
                              <SelectValue placeholder="Permission" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="read">Read</SelectItem>
                              <SelectItem value="write">Write</SelectItem>
                              <SelectItem value="none">Block</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            className={`
                            ${
                              isRoomOwner
                                ? "bg-amber-600"
                                : currentPermission === "write"
                                  ? "bg-green-600"
                                  : currentPermission === "read"
                                    ? "bg-blue-600"
                                    : "bg-red-600"
                            }
                          `}
                          >
                            {isRoomOwner
                              ? "Owner"
                              : currentPermission === "write"
                                ? "Write"
                                : currentPermission === "read"
                                  ? "Read"
                                  : "Blocked"}
                          </Badge>
                        )}
                      </div>
                    );
                  })}

                  {roomUsers.length === 0 && (
                    <div className="text-center py-4 text-gray-400">
                      No members found
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
