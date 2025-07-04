import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // Clerk ID
    username: v.string(),
    email: v.string(),
    isPro: v.optional(v.boolean()),
  })
    .index("by_user_id", ["userId"])
    .index("by_username", ["username"]),

  rooms: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    ownerId: v.string(),
    roomType: v.union(v.literal("collab"), v.literal("mentor")),
    isPublic: v.optional(v.boolean()),
    maxUsers: v.optional(v.number()),
    createdAt: v.number(),
    lastAccessed: v.number(),
  }).index("by_owner", ["ownerId"]),

  roomUsers: defineTable({
    roomId: v.id("rooms"),
    userId: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("mentor"),
      v.literal("student"),
      v.literal("collaborator"),
    ),
    permissions: v.optional(
      v.array(v.union(v.literal("read"), v.literal("write"))),
    ),
    lastActiveAt: v.number(),
    joinedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user", ["userId"])
    .index("by_room_user", ["roomId", "userId"]),

  messages: defineTable({
    roomId: v.id("rooms"),
    userId: v.union(v.string(), v.null()), // null for AI
    text: v.string(),
    isAI: v.boolean(),
    replyToId: v.optional(v.id("messages")),
    createdAt: v.number(),
    editedAt: v.optional(v.number()),
  }).index("by_room", ["roomId"]),

  roomContent: defineTable({
    roomId: v.id("rooms"),
    //?????
    liveblockWhiteboardId: v.optional(v.string()), // e.g. "room:<roomId>:whiteboard"   ??
    activeFileId: v.optional(v.id("filesystem")),
    settings: v.optional(
      v.object({
        theme: v.optional(v.string()),
        fontSize: v.optional(v.number()),
        tabSize: v.optional(v.number()),
      }),
    ),
    version: v.number(), //inc after every save (1,2,3,...)
    savedAt: v.number(),
    autoSaveEnabled: v.optional(v.boolean()),
  }).index("by_room", ["roomId"]),

  filesystem: defineTable({
    name: v.string(),
    type: v.union(v.literal("file"), v.literal("folder")),
    roomId: v.id("rooms"),
    parentId: v.union(v.id("filesystem"), v.null()), // null for root
    extension: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string(),
    lastModifiedBy: v.optional(v.string()),
  })
    .index("by_room", ["roomId"])
    .index("by_parent", ["parentId"])
    .index("by_room_parent", ["roomId", "parentId"])
    .index("by_room_type", ["roomId", "type"])
    .index("by_created_by", ["createdBy"]),

  fileContent: defineTable({
    fileId: v.id("filesystem"),
    content: v.optional(v.string()),
    language: v.optional(v.string()),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
    executionTime: v.optional(v.number()),
    // isExecutable: v.optional(v.boolean()),
    // lastSyncedContent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_fileId", ["fileId"]),

  // Add invitations table for handling email invites
  invitations: defineTable({
    roomId: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("mentor"),
      v.literal("student"),
      v.literal("collaborator"),
    ),
    permissions: v.optional(
      v.array(v.union(v.literal("read"), v.literal("write"))),
    ),
    token: v.string(),
    status: v.string(),
    createdAt: v.string(),
    expiresAt: v.string(),
  }),
});
