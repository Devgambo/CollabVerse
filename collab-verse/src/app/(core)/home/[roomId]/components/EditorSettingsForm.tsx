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

interface EditorSettingsFormProps {
  room: any;
  roomId: string;
  onUpdate: (roomId: string) => void;
}

export default function EditorSettingsForm({
  room,
  roomId,
  onUpdate,
}: EditorSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    theme: room?.content?.settings?.theme || "vs-dark",
    fontSize: room?.content?.settings?.fontSize || 14,
    tabSize: room?.content?.settings?.tabSize || 2,
    autoSaveEnabled: room?.content?.autoSaveEnabled !== false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.fontSize < 8 || formData.fontSize > 32) {
      newErrors.fontSize = "Font size must be between 8 and 32";
    }

    if (formData.tabSize < 2 || formData.tabSize > 8) {
      newErrors.tabSize = "Tab size must be between 2 and 8";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
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
          type: "roomContent",
          data: {
            settings: {
              theme: formData.theme,
              fontSize: formData.fontSize,
              tabSize: formData.tabSize,
            },
            autoSaveEnabled: formData.autoSaveEnabled,
          },
        }),
      });

      if (response.ok) {
        toast.success("Editor settings updated successfully");
        onUpdate(roomId);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update settings",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor Settings</CardTitle>
        <CardDescription>
          Customize the code editor and auto-save preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Theme Selection */}
          <div className="space-y-2">
            <label htmlFor="theme" className="text-sm font-medium">
              Editor Theme
            </label>
            <Select
              value={formData.theme}
              onValueChange={(value) => handleSelectChange("theme", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vs-dark">Dark</SelectItem>
                <SelectItem value="vs-light">Light</SelectItem>
                <SelectItem value="hc-black">High Contrast Dark</SelectItem>
                <SelectItem value="hc-light">High Contrast Light</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font Size and Tab Size */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="fontSize" className="text-sm font-medium">
                Font Size
              </label>
              <Input
                id="fontSize"
                name="fontSize"
                type="number"
                min={8}
                max={32}
                value={formData.fontSize}
                onChange={handleNumberChange}
                className={errors.fontSize ? "border-red-500" : ""}
              />
              {errors.fontSize && (
                <p className="text-red-500 text-xs">{errors.fontSize}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="tabSize" className="text-sm font-medium">
                Tab Size
              </label>
              <Input
                id="tabSize"
                name="tabSize"
                type="number"
                min={2}
                max={8}
                value={formData.tabSize}
                onChange={handleNumberChange}
                className={errors.tabSize ? "border-red-500" : ""}
              />
              {errors.tabSize && (
                <p className="text-red-500 text-xs">{errors.tabSize}</p>
              )}
            </div>
          </div>

          {/* Auto-Save Switch */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label
                htmlFor="autoSaveEnabled"
                className="text-base font-medium"
              >
                Auto-Save
              </label>
              <p className="text-sm text-muted-foreground">
                Automatically save changes to the document
              </p>
            </div>
            <Switch
              id="autoSaveEnabled"
              checked={formData.autoSaveEnabled}
              onCheckedChange={(checked) =>
                handleSwitchChange("autoSaveEnabled", checked)
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
              "Save Editor Settings"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
