"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Code2,
  Palette,
  Type,
  IndentIncrease,
  Save,
  AlertCircle,
  Zap,
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
import { motion } from "framer-motion";

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
        toast.success("🎨 Editor settings updated successfully!");
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

  const themeOptions = [
    {
      value: "vs-dark",
      label: "Dark Theme",
      color: "bg-slate-800",
      description: "Perfect for late-night coding",
    },
    {
      value: "vs-light",
      label: "Light Theme",
      color: "bg-white",
      description: "Clean and bright interface",
    },
    {
      value: "hc-black",
      label: "High Contrast Dark",
      color: "bg-black",
      description: "Enhanced accessibility",
    },
    {
      value: "hc-light",
      label: "High Contrast Light",
      color: "bg-gray-100",
      description: "Maximum contrast for clarity",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Editor Settings</h2>
            <p className="text-slate-400">
              Customize your coding environment and preferences
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-4">
            <label
              htmlFor="theme"
              className="flex items-center gap-2 text-sm font-semibold text-slate-200"
            >
              <Palette className="w-4 h-4 text-purple-400" />
              Editor Theme
            </label>
            <Select
              value={formData.theme}
              onValueChange={(value) => handleSelectChange("theme", value)}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-purple-500 h-14">
                <SelectValue placeholder="Select editor theme" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {themeOptions.map((theme) => (
                  <SelectItem
                    key={theme.value}
                    value={theme.value}
                    className="text-white hover:bg-slate-700 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded border-2 border-slate-600 ${theme.color}`}
                      ></div>
                      <div>
                        <div className="font-medium">{theme.label}</div>
                        <div className="text-xs text-slate-400">
                          {theme.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Typography Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Font Size */}
            <div className="space-y-3">
              <label
                htmlFor="fontSize"
                className="flex items-center gap-2 text-sm font-semibold text-slate-200"
              >
                <Type className="w-4 h-4 text-blue-400" />
                Font Size
              </label>
              <div className="relative">
                <Input
                  id="fontSize"
                  name="fontSize"
                  type="number"
                  min={8}
                  max={32}
                  value={formData.fontSize}
                  onChange={handleNumberChange}
                  className={`bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 pr-12 ${
                    errors.fontSize ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                  px
                </div>
              </div>
              {errors.fontSize && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fontSize}
                </div>
              )}
              <div className="text-xs text-slate-500">Recommended: 12-16px</div>
            </div>

            {/* Tab Size */}
            <div className="space-y-3">
              <label
                htmlFor="tabSize"
                className="flex items-center gap-2 text-sm font-semibold text-slate-200"
              >
                <IndentIncrease className="w-4 h-4 text-green-400" />
                Tab Size
              </label>
              <Select
                value={formData.tabSize.toString()}
                onValueChange={(value) => handleSelectChange("tabSize", value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {[2, 4, 6, 8].map((size) => (
                    <SelectItem
                      key={size}
                      value={size.toString()}
                      className="text-white hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        {size} spaces
                        {size === 2 && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-slate-500">
                Most developers prefer 2 or 4 spaces
              </div>
            </div>
          </div>

          {/* Auto-Save Feature */}
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-lg ${formData.autoSaveEnabled ? "bg-green-500/20" : "bg-slate-700"}`}
                >
                  {formData.autoSaveEnabled ? (
                    <Zap className="w-5 h-5 text-green-400" />
                  ) : (
                    <Save className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="autoSaveEnabled"
                    className="text-base font-semibold text-white cursor-pointer"
                  >
                    Auto-Save
                  </label>
                  <p className="text-sm text-slate-400 max-w-sm">
                    {formData.autoSaveEnabled
                      ? "Changes are automatically saved as you type"
                      : "Manual save required for changes"}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      formData.autoSaveEnabled
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-slate-600 text-slate-300"
                    }`}
                  >
                    {formData.autoSaveEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
              <Switch
                id="autoSaveEnabled"
                checked={formData.autoSaveEnabled}
                onCheckedChange={(checked) =>
                  handleSwitchChange("autoSaveEnabled", checked)
                }
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-[1.02]"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Applying Settings...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Editor Settings
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
