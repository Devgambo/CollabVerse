"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Info,
  FileText,
  Users,
  Settings,
  Lock,
  Unlock,
  AlertCircle,
} from "lucide-react";
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
import { Badge } from "@/src/components/ui/badge";
import { motion } from "framer-motion";

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
    name: room?.name || "UNKNOWN",
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

    if (formData.maxUsers <= 0 || formData.maxUsers > 50) {
      newErrors.maxUsers = "Max users must be between 1 and 50";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 1 }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "roomInfo",
          data: formData,
        }),
      });

      if (response.ok) {
        toast.success("🎉 Room information updated successfully!");
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Room Information</h2>
            <p className="text-slate-400">
              Configure your collaborative workspace settings
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Name Section */}
          <div className="space-y-3">
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-semibold text-slate-200"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              Room Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Enter a descriptive room name..."
              value={formData.name}
              onChange={handleChange}
              className={`bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 ${
                errors.name ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.name && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <label
              htmlFor="description"
              className="flex items-center gap-2 text-sm font-semibold text-slate-200"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              Description
              <Badge
                variant="secondary"
                className="text-xs bg-slate-700 text-slate-300"
              >
                Optional
              </Badge>
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the purpose of this collaboration room..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20 resize-none min-h-[100px] transition-all duration-200"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Room Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Room Type */}
            <div className="space-y-3">
              <label
                htmlFor="roomType"
                className="flex items-center gap-2 text-sm font-semibold text-slate-200"
              >
                <Settings className="w-4 h-4 text-green-400" />
                Room Type
              </label>
              <Select
                value={formData.roomType}
                onValueChange={(value) => handleSelectChange("roomType", value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-green-500">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem
                    value="collab"
                    className="text-white hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      Collaboration
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="mentor"
                    className="text-white hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      Mentorship
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Max Users */}
            <div className="space-y-3">
              <label
                htmlFor="maxUsers"
                className="flex items-center gap-2 text-sm font-semibold text-slate-200"
              >
                <Users className="w-4 h-4 text-orange-400" />
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
                className={`bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 ${
                  errors.maxUsers ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.maxUsers && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.maxUsers}
                </div>
              )}
            </div>
          </div>

          {/* Public Access Toggle */}
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-lg ${formData.isPublic ? "bg-green-500/20" : "bg-yellow-500/20"}`}
                >
                  {formData.isPublic ? (
                    <Unlock className="w-5 h-5 text-green-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="isPublic"
                    className="text-base font-semibold text-white cursor-pointer"
                  >
                    Public Access
                  </label>
                  <p className="text-sm text-slate-400 max-w-sm">
                    {formData.isPublic
                      ? "Anyone with the link can join this room"
                      : "Only invited members can access this room"}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      formData.isPublic
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    }`}
                  >
                    {formData.isPublic ? "Public Room" : "Private Room"}
                  </Badge>
                </div>
              </div>
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  handleSwitchChange("isPublic", checked)
                }
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-[1.02]"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Settings className="mr-2 h-5 w-5" />
                Save Room Information
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
