"use client";

import { useState, useCallback, memo } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/src/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { CheckIcon, X as CrossIcon } from "lucide-react";
import { toast } from "sonner"; // Assuming you use sonner for toasts

// Define strong types
type Permission = {
  read: boolean;
  write: boolean;
};

type UserInfo = {
  name?: string;
  avatar?: string;
};

type MemberAvatarProps = {
  id: string;
  name: string;
  isSelf?: boolean;
  onPermissionChange?: (id: string, permission: Partial<Permission>) => void;
  permissions: Permission;
};

const MemberAvatar = memo(
  ({
    id,
    name,
    isSelf = false,
    permissions,
    onPermissionChange,
  }: MemberAvatarProps) => {
    const initial = name.charAt(0) || "U";
    const bgColor = getUserColor(id);

    // Security: Only show permission controls for others (not self) and for users with permission to change
    const canChangePermissions = !isSelf && onPermissionChange;

    // Callbacks to prevent re-renders
    const handleReadToggle = useCallback(() => {
      if (canChangePermissions) {
        onPermissionChange?.(id, { read: !permissions.read });
      }
    }, [id, permissions.read, canChangePermissions, onPermissionChange]);

    const handleWriteToggle = useCallback(() => {
      if (canChangePermissions) {
        onPermissionChange?.(id, { write: !permissions.write });
      }
    }, [id, permissions.write, canChangePermissions, onPermissionChange]);

    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative inline-block">
              {canChangePermissions ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer">
                      <UserAvatar
                        id={id}
                        initial={initial}
                        bgColor={bgColor}
                        isSelf={isSelf}
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <Avatar
                        className="h-5 w-5"
                        style={{ backgroundColor: bgColor }}
                      >
                        <AvatarFallback>{initial}</AvatarFallback>
                      </Avatar>
                      <span>
                        {name} {isSelf && "(You)"}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={permissions.read}
                      onCheckedChange={handleReadToggle}
                      className="flex justify-between"
                    >
                      <span>Read Access</span>
                      {permissions.read ? (
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <CrossIcon className="h-4 w-4 text-red-500" />
                      )}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={permissions.write}
                      onCheckedChange={handleWriteToggle}
                      className="flex justify-between"
                    >
                      <span>Write Access</span>
                      {permissions.write ? (
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <CrossIcon className="h-4 w-4 text-red-500" />
                      )}
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <UserAvatar
                  id={id}
                  initial={initial}
                  bgColor={bgColor}
                  isSelf={isSelf}
                />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>
              {name} {isSelf && "(You)"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

// For better code organization, extract the Avatar UI to its own component
const UserAvatar = memo(
  ({
    id,
    initial,
    bgColor,
    isSelf,
  }: {
    id: string;
    initial: string;
    bgColor: string;
    isSelf: boolean;
  }) => (
    <div className="relative">
      <Avatar
        className={`h-8 w-8 border-2 ${
          isSelf ? "border-green-500" : "border-[#0f0f0f]"
        }`}
        style={{ backgroundColor: bgColor }}
      >
        <AvatarFallback className="" style={{ backgroundColor: bgColor }}>
          {initial || "UK"}
        </AvatarFallback>
      </Avatar>
      {isSelf && (
        <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[#0f0f0f] bg-green-500" />
      )}
    </div>
  ),
);

// TODO : Put this function to some component file
function getUserColor(id: string): string {
  const hash = Array.from(id).reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return `hsl(${Math.abs(hash % 360)}, 70%, 60%)`;
}

const RoomMembers = () => {
  const { user } = useUser();
  const others = useOthers();
  const self = useSelf();

  // Permissions state for each user (by id)
  const [permissions, setPermissions] = useState<Record<string, Permission>>(
    {},
  );

  const getPermission = useCallback(
    (id: string): Permission => {
      return permissions[id] || { read: true, write: true };
    },
    [permissions],
  );

  // Toggle permission for a user
  const handlePermissionChange = useCallback(
    (id: string, update: Partial<Permission>) => {
      setPermissions((prev) => ({
        ...prev,
        [id]: {
          ...getPermission(id),
          ...update,
        },
      }));

      // TODO : Update permissions here by call an API to update permissions
      toast.success(`Updated permissions for user`);
    },
    [getPermission],
  );

  return (
    <div className="flex items-center -space-x-2">
      {/* Current user avatar */}
      <MemberAvatar
        id={user?.id || "default-user"}
        name={user?.firstName || "Guest"}
        isSelf={true}
        permissions={getPermission(user?.id || "default-user")}
        // No onPermissionChange for self - can't change your own permissions
      />

      {/* Other users avatars */}
      {others.map(({ connectionId, info }) => {
        const userData = info as UserInfo | undefined;
        const name = userData?.name || "Unknown";
        const userId = connectionId.toString();

        return (
          <MemberAvatar
            key={userId}
            id={userId}
            name={name}
            permissions={getPermission(userId)}
            onPermissionChange={handlePermissionChange}
          />
        );
      })}
    </div>
  );
};

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Code Ed");
  const { user } = useUser();

  const tabs = [{ name: "Code Ed" }, { name: "Text Ed" }, { name: "Canvas" }];

  const handleShareClick = useCallback(() => {
    try {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Session link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast.error("Failed to copy session link");
    }
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[#0f0f0f] border-b border-[#333] relative z-50">
      {/* Left section with logo and status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* Online status indicator */}
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30"></div>

          {/* User avatar and name */}
          <div className="flex items-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "2.5rem",
                    height: "2.5rem",
                  },
                },
              }}
            />
            <div className="pl-2 text-base font-medium text-white">
              {(user && user.firstName) || "Guest"}
            </div>
          </div>
        </div>
      </div>

      {/* Center section with tabs */}
      <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-xl p-1 border border-[#333]">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                activeTab === tab.name
                  ? "bg-[#333] text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Right section with collaborators and share button */}
      <div className="flex items-center gap-3">
        {/* Collaboration avatars */}
        <RoomMembers />

        {/* Share button */}
        <button
          className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all duration-200"
          onClick={handleShareClick}
          aria-label="Copy session link"
        >
          <div className="flex flex-col items-center">
            <span className="text-xs">SHARE</span>
            <span className="text-xs">SESSION</span>
          </div>
        </button>
      </div>
    </nav>
  );
}
