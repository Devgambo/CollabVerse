"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
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

interface RoomInfoFormProps {
  room: any;
  roomId: string;
  onUpdate: (roomId: string) => void;
}

export default function RoomInfoForm({
  room,
  roomId,
  onUpdate,
}: RoomInfoFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: room?.name || "",
    description: room?.description || "",
    roomType: room?.roomType || "collab",
    isPublic: room?.isPublic || false,
    maxUsers: room?.maxUsers || 10,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Room name must be at least 3 characters";
    }

    if (formData.maxUsers <= 0) {
      newErrors.maxUsers = "Max users must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 1 }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
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
          type: "roomInfo",
          data: formData,
        }),
      });

      if (response.ok) {
        toast.success("Room information updated successfully");
        onUpdate(roomId);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update room");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update room",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Information</CardTitle>
        <CardDescription>
          Update basic information about this collaboration room
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Room Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Enter room name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the purpose of this room"
              className="resize-none"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Room Type and Max Users */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="roomType" className="text-sm font-medium">
                Room Type
              </label>
              <Select
                value={formData.roomType}
                onValueChange={(value) => handleSelectChange("roomType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collab">Collaboration</SelectItem>
                  <SelectItem value="mentor">Mentorship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="maxUsers" className="text-sm font-medium">
                Max Users
              </label>
              <Input
                id="maxUsers"
                name="maxUsers"
                type="number"
                min={1}
                max={50}
                value={formData.maxUsers}
                onChange={handleNumberChange}
                className={errors.maxUsers ? "border-red-500" : ""}
              />
              {errors.maxUsers && (
                <p className="text-red-500 text-xs">{errors.maxUsers}</p>
              )}
            </div>
          </div>

          {/* Public Access Switch */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label htmlFor="isPublic" className="text-base font-medium">
                Public Access
              </label>
              <p className="text-sm text-muted-foreground">
                Allow anyone with the link to join this room
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) =>
                handleSwitchChange("isPublic", checked)
              }
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Room Information"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
