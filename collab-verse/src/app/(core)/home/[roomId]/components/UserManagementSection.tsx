"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
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

interface UserManagementSectionProps {
  room: any;
  roomId: string;
  onUpdate: (roomId: string) => void;
  onGoToWorkspace: () => void;
}

export default function UserManagementSection({
  room,
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

  // List of possible permissions
  const availablePermissions = ["read", "write", "execute", "delete", "invite"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.targetUserId || formData.targetUserId.length < 1) {
      newErrors.targetUserId = "User ID is required";
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
        toast.success("User permissions updated successfully");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Invite users and manage their permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* User List Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Current Users</h3>
          {room?.users && room.users.length > 0 ? (
            <div className="space-y-2">
              {room.users.map((user: any) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      {user.userId.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.userId}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {user.permissions?.map((perm: string) => (
                      <Badge key={perm} variant="secondary">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No users found</p>
          )}
        </div>

        <Separator className="my-6" />

        {/* User Form Section */}
        <h3 className="text-lg font-medium mb-4">Add or Update User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User ID */}
          <div className="space-y-2">
            <label htmlFor="targetUserId" className="text-sm font-medium">
              User ID
            </label>
            <Input
              id="targetUserId"
              name="targetUserId"
              placeholder="Enter user ID or email"
              value={formData.targetUserId}
              onChange={handleChange}
              className={errors.targetUserId ? "border-red-500" : ""}
            />
            {errors.targetUserId && (
              <p className="text-red-500 text-xs">{errors.targetUserId}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter the Clerk user ID or email address
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleSelectChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="collaborator">Collaborator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <div className="mb-2">
              <label className="text-sm font-medium">Permissions</label>
              <p className="text-xs text-muted-foreground">
                Select the permissions for this user
              </p>
            </div>
            {errors.permissions && (
              <p className="text-red-500 text-xs">{errors.permissions}</p>
            )}
            <div className="grid grid-cols-2 gap-2">
              {availablePermissions.map((permission) => (
                <div
                  key={permission}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <Switch
                    id={`permission-${permission}`}
                    checked={formData.permissions.includes(permission)}
                    onCheckedChange={(checked) =>
                      handlePermissionToggle(permission, checked)
                    }
                  />
                  <label
                    htmlFor={`permission-${permission}`}
                    className="font-normal cursor-pointer"
                  >
                    {permission.charAt(0).toUpperCase() + permission.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Update User Permissions"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Reset Form
        </Button>
        <Button variant="default" onClick={onGoToWorkspace}>
          Go to Workspace
        </Button>
      </CardFooter>
    </Card>
  );
}
