import { Id } from "@/convex/_generated/dataModel";

/**
 * User profile information
 */
export interface User {
  _id: Id<"users">;
  _creationTime: number;
  userId: string; // Clerk ID
  username: string;
  email: string;
  isPro?: boolean;
}

/**
 * Room types for different collaboration modes
 */
export type RoomType = "collab" | "mentor";

/**
 * User roles within a room
 */
export type RoomUserRole = "owner" | "mentor" | "student" | "collaborator";

/**
 * Permission types for room actions
 */
export type Permission = "read" | "write";

/**
 * Room information
 */
export interface Room {
  _id: Id<"rooms">;
  _creationTime: number;
  name: string;
  description?: string;
  ownerId: string;
  roomType: RoomType;
  isPublic?: boolean;
  maxUsers?: number;
  createdAt: number;
  lastAccessed: number;
}

/**
 * User membership in a room with roles and permissions
 */
export interface RoomUser {
  _id: Id<"roomUsers">;
  _creationTime: number;
  roomId: Id<"rooms">;
  userId: string;
  role: RoomUserRole;
  permissions?: Permission[];
  lastActiveAt: number;
  joinedAt: number;
}

/**
 * Chat message in a room
 */
export interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  roomId: Id<"rooms">;
  userId: string | null; // null for AI-generated messages
  text: string;
  isAI: boolean;
  replyToId?: Id<"messages">;
  createdAt: number;
  editedAt?: number;
}

/**
 * Editor settings for a room
 */
export interface EditorSettings {
  theme?: string;
  fontSize?: number;
  tabSize?: number;
}

/**
 * Content settings for a room
 */
export interface RoomContent {
  _id: Id<"roomContent">;
  _creationTime: number;
  roomId: Id<"rooms">;
  liveblockWhiteboardId?: string;
  activeFileId?: Id<"filesystem">;
  settings?: EditorSettings;
  version: number;
  savedAt: number;
  autoSaveEnabled?: boolean;
}

/**
 * File system item types
 */
export type FileSystemItemType = "file" | "folder";

/**
 * File system item (file or folder)
 */
export interface FileSystemItem {
  _id: Id<"filesystem">;
  _creationTime: number;
  name: string;
  type: FileSystemItemType;
  roomId: Id<"rooms">;
  parentId: Id<"filesystem"> | null; // null for root level items
  extension?: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  lastModifiedBy?: string;
}

/**
 * File content data
 */
export interface FileContent {
  _id: Id<"fileContent">;
  _creationTime: number;
  fileId: Id<"filesystem">;
  content?: string;
  language?: string;
  output?: string;
  error?: string;
  executionTime?: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Invitation status options
 */
export type InvitationStatus = "pending" | "accepted" | "rejected" | "expired";

/**
 * Room invitation
 */
export interface Invitation {
  _id: Id<"invitations">;
  _creationTime: number;
  roomId: string;
  email: string;
  role: RoomUserRole;
  permissions?: Permission[];
  token: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

/**
 * Combined file system item with its content
 */
export interface FileWithContent extends FileSystemItem {
  content?: FileContent;
}

/**
 * Room with additional user and content information
 */
export interface RoomWithDetails extends Room {
  memberCount?: number;
  userRole?: RoomUserRole;
  userPermissions?: Permission[];
  isActive?: boolean;
}

/**
 * API response wrapper for consistent error handling
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
