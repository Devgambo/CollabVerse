"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Users,
  UserPlus,
  Shield,
  Mail,
  Crown,
  Trash2,
  Edit,
  AlertCircle,
  Copy,
  Code2,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { RoomUser } from "@/src/types/core_interface";

interface UserManagementSectionProps {
  roomId: string;
  roomUsers: RoomUser[] | null;
  onUpdate: (roomId: string) => void;
  onGoToWorkspace: () => void;
}

export default function UserManagementSection({
  roomUsers,
  roomId,
  onUpdate,
  onGoToWorkspace,
}: UserManagementSectionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    targetUserId: "",
    role: "collaborator",
    permissions: ["read", "write"] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availablePermissions = [
    {
      id: "read",
      label: "Read",
      description: "View code and files",
      icon: "👁️",
    },
    {
      id: "write",
      label: "Write",
      description: "Edit and modify code",
      icon: "✏️",
    },
    {
      id: "execute",
      label: "Execute",
      description: "Run code and commands",
      icon: "▶️",
    },
    {
      id: "delete",
      label: "Delete",
      description: "Remove files and content",
      icon: "🗑️",
    },
    {
      id: "invite",
      label: "Invite",
      description: "Add new members",
      icon: "👥",
    },
  ];

  const roleOptions = [
    {
      value: "mentor",
      label: "Mentor",
      color: "from-purple-500 to-pink-500",
      description: "Guide and teach others",
    },
    {
      value: "student",
      label: "Student",
      color: "from-blue-500 to-cyan-500",
      description: "Learn and participate",
    },
    {
      value: "collaborator",
      label: "Collaborator",
      color: "from-green-500 to-emerald-500",
      description: "Equal contributor",
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.targetUserId || formData.targetUserId.length < 1) {
      newErrors.targetUserId = "User ID or email is required";
    }

    if (!formData.permissions || formData.permissions.length === 0) {
      newErrors.permissions = "At least one permission is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionToggle = (permission: string, checked: boolean) => {
    setFormData((prev) => {
      const newPermissions = checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission);

      return { ...prev, permissions: newPermissions };
    });

    if (errors.permissions) {
      setErrors((prev) => ({ ...prev, permissions: "" }));
    }
  };

  const handleReset = () => {
    setFormData({
      targetUserId: "",
      role: "collaborator",
      permissions: ["read", "write"],
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "roomUser",
          data: formData,
        }),
      });

      if (response.ok) {
        toast.success("👥 User permissions updated successfully!");
        onUpdate(roomId);
        handleReset();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update user",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/home/${roomId}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("📋 Invite link copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <p className="text-slate-400">
                Manage team members and their permissions
              </p>
            </div>
          </div>
          <Button
            onClick={copyInviteLink}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Invite Link
          </Button>
        </div>

        {/* Current Users Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Current Members
              <Badge
                variant="secondary"
                className="bg-blue-500/20 text-blue-300"
              >
                {roomUsers?.length || 0}
              </Badge>
            </h3>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {roomUsers && roomUsers.length > 0 ? (
                roomUsers.map((user: any, index) => (
                  <motion.div
                    key={user._id || user.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-slate-600">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                            {user.user?.name
                              ? user.user.name.charAt(0).toUpperCase()
                              : (
                                  user.userId?.substring(0, 2) || "?"
                                ).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white">
                              {user.user?.name || user.userId || "Unknown User"}
                            </h4>
                            {user.role === "mentor" && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Badge
                              className={`text-xs ${
                                user.role === "mentor"
                                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                  : user.role === "student"
                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                    : "bg-green-500/20 text-green-300 border-green-500/30"
                              }`}
                            >
                              {user.role || "Collaborator"}
                            </Badge>
                            {user.user?.email && (
                              <>
                                <span>•</span>
                                <Mail className="w-3 h-3" />
                                <span>{user.user.email}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex gap-1 flex-wrap justify-end">
                          {user.permissions?.map((perm: string) => (
                            <Badge
                              key={perm}
                              variant="secondary"
                              className="text-xs bg-slate-700 text-slate-300"
                            >
                              {
                                availablePermissions.find((p) => p.id === perm)
                                  ?.icon
                              }{" "}
                              {perm}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-blue-300 hover:bg-blue-400/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center py-12 rounded-xl bg-slate-800/30 border border-slate-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-slate-300 mb-2">
                    No members yet
                  </h4>
                  <p className="text-slate-400">
                    Invite team members to start collaborating
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Add User Form */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-400" />
            Add Team Member
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User ID Input */}
            <div className="space-y-3">
              <label
                htmlFor="targetUserId"
                className="flex items-center gap-2 text-sm font-semibold text-slate-200"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                User ID or Email
              </label>
              <Input
                id="targetUserId"
                name="targetUserId"
                placeholder="Enter Clerk user ID or email address..."
                value={formData.targetUserId}
                onChange={handleChange}
                className={`bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 ${
                  errors.targetUserId
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
              />
              {errors.targetUserId && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.targetUserId}
                </div>
              )}
              <p className="text-xs text-slate-500">
                The unique identifier from your authentication provider
              </p>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label
                htmlFor="role"
                className="flex items-center gap-2 text-sm font-semibold text-slate-200"
              >
                <Crown className="w-4 h-4 text-yellow-400" />
                Role
              </label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-yellow-500 h-14">
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {roleOptions.map((role) => (
                    <SelectItem
                      key={role.value}
                      value={role.value}
                      className="text-white hover:bg-slate-700 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded bg-gradient-to-r ${role.color}`}
                        ></div>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-slate-400">
                            {role.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  Permissions
                </label>
                <p className="text-xs text-slate-500 mb-4">
                  Select what this user can do in the room
                </p>
              </div>

              {errors.permissions && (
                <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
                  <AlertCircle className="w-4 h-4" />
                  {errors.permissions}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      formData.permissions.includes(permission.id)
                        ? "bg-purple-500/10 border-purple-500/30"
                        : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    }`}
                    onClick={() =>
                      handlePermissionToggle(
                        permission.id,
                        !formData.permissions.includes(permission.id),
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{permission.icon}</span>
                        <div>
                          <div className="font-medium text-white">
                            {permission.label}
                          </div>
                          <div className="text-xs text-slate-400">
                            {permission.description}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={(checked) =>
                          handlePermissionToggle(permission.id, checked)
                        }
                        className="data-[state=checked]:bg-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={handleReset}
                variant="outline"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/25"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Member...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Member
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Quick Action */}
        <div className="pt-6 border-t border-slate-700">
          <Button
            onClick={onGoToWorkspace}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            <Code2 className="mr-2 h-5 w-5" />
            Open Collaborative Workspace
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
