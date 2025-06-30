import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createRoom = mutation({
  args: {
    name: v.string(),
    ownerId: v.string(),
    roomType: v.union(v.literal("collab"), v.literal("mentor")),
  },

  handler: async (ctx, args) => {
    const roomId = await ctx.db.insert("rooms", {
      name: args.name,
      ownerId: args.ownerId,
      roomType: args.roomType,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
    });

    const roomUsers = await ctx.db.insert("roomUsers", {
      roomId: roomId,
      userId: args.ownerId,
      role: "owner",
      permissions: ["read", "write"],
      lastActiveAt: Date.now(),
      joinedAt: Date.now(),
    });

    return { _id: roomId };
  },
});

export const getRooms = query({
  args: {
    userId: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .filter((eachRoomhas) =>
        eachRoomhas.eq(eachRoomhas.field("ownerId"), args.userId),
      )
      .collect();
  },
});

export const getRoomUsers = query({
  args: {
    roomId: v.string(),
  },

  handler: async (ctx, args) => {
    // Get all roomUsers for the room
    const roomUsers = await ctx.db
      .query("roomUsers")
      .filter((room) => room.eq(room.field("roomId"), args.roomId))
      .collect();

    const users = await Promise.all(
      roomUsers.map(async (roomUser) => {
        const user = await ctx.db
          .query("users")
          .filter((u) => u.eq(u.field("userId"), roomUser.userId))
          .first();

        return {
          ...roomUser,
          user: user ? { name: user.username, email: user.email } : null,
        };
      }),
    );

    return users.map((roomUser) => ({
      ...roomUser,
      _id: roomUser._id.toString(), // Ensure IDs are stringified
      user: roomUser.user
        ? {
            name:
              roomUser.user.name || roomUser.user.email.split("@")[0] || "User",
            email: roomUser.user.email,
          }
        : null,
    }));
  },
});

export const updateRoomInfo = mutation({
  args: {
    userId: v.string(),
    roomId: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    roomType: v.optional(v.union(v.literal("collab"), v.literal("mentor"))),
    isPublic: v.optional(v.boolean()),
    maxUsers: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) return { success: false, error: "Invalid room ID" };

    const room = await ctx.db.get(roomId);
    if (!room) return { success: false, error: "Room not found" };

    if (room.ownerId !== args.userId) {
      return {
        success: false,
        error: "Unauthorized ( only room admin can make changes)",
      };
    }

    // Build update object with only provided fields
    const updates: Record<string, any> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.roomType !== undefined) updates.roomType = args.roomType;
    if (args.isPublic !== undefined) updates.isPublic = args.isPublic;
    if (args.maxUsers !== undefined) updates.maxUsers = args.maxUsers;

    updates.lastAccessed = Date.now();

    const updatedRoom = await ctx.db.patch(roomId, updates);
    return { success: true, updatedRoom };
  },
});

export const updateRoomContent = mutation({
  args: {
    roomId: v.string(),
    activeFileId: v.optional(v.string()),
    settings: v.optional(
      v.object({
        theme: v.optional(v.string()),
        fontSize: v.optional(v.number()),
        tabSize: v.optional(v.number()),
      }),
    ),
    autoSaveEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) return { success: false, error: "Invalid room ID" };

    // Get the room to check ownership
    const room = await ctx.db.get(roomId);
    if (!room) return { success: false, error: "Room not found" };

    const identity = await ctx.auth.getUserIdentity();
    if (!identity || room.ownerId !== identity.tokenIdentifier) {
      return { success: false, error: "Unauthorized: Not the room owner" };
    }

    const existingContent = await ctx.db
      .query("roomContent")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .first();

    const updates: Record<string, any> = {
      savedAt: Date.now(),
      version: existingContent ? existingContent.version + 1 : 1,
    };

    if (args.activeFileId !== undefined) {
      const fileId = ctx.db.normalizeId("filesystem", args.activeFileId);
      updates.activeFileId = fileId;
    }

    if (args.settings !== undefined) {
      updates.settings = {
        ...(existingContent?.settings || {}),
        ...args.settings,
      };
    }

    if (args.autoSaveEnabled !== undefined) {
      updates.autoSaveEnabled = args.autoSaveEnabled;
    }

    if (existingContent) {
      await ctx.db.patch(existingContent._id, updates);
      return { success: true, contentId: existingContent._id };
    } else {
      const contentId = await ctx.db.insert("roomContent", {
        roomId,
        version: updates.version || 1,
        savedAt: updates.savedAt || Date.now(),
        ...updates,
      });
      return { success: true, contentId };
    }
  },
});

export const updateRoomUser = mutation({
  args: {
    roomId: v.string(),
    targetUserId: v.string(),
    role: v.optional(
      v.union(
        v.literal("owner"),
        v.literal("mentor"),
        v.literal("student"),
        v.literal("collaborator"),
      ),
    ),
    permissions: v.optional(
      v.array(v.union(v.literal("read"), v.literal("write"))),
    ),
  },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) return { success: false, error: "Invalid room ID" };

    const room = await ctx.db.get(roomId);
    if (!room) return { success: false, error: "Room not found" };

    const roomUser = await ctx.db
      .query("roomUsers")
      .withIndex("by_room_user", (q) =>
        q.eq("roomId", roomId).eq("userId", args.targetUserId),
      )
      .first();

    if (!roomUser) {
      return { success: false, error: "User not found in this room" };
    }

    if (
      args.targetUserId === room.ownerId &&
      args.role &&
      args.role !== "owner"
    ) {
      return { success: false, error: "Cannot change the owner's role" };
    }

    const updates: Record<string, any> = {};
    if (args.role !== undefined) updates.role = args.role;
    if (args.permissions !== undefined) updates.permissions = args.permissions;

    await ctx.db.patch(roomUser._id, updates);
    return { success: true, userId: args.targetUserId };
  },
});

export const getRoomById = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId); // Best practice : I have used normalizeId function instead of q.eq....
    if (!roomId) return null;

    return await ctx.db.get(roomId);
  },
});

export const deleteRoom = mutation({
  args: {
    roomId: v.string(),
    ownerId: v.string(),
  },

  handler: async (ctx, args) => {
    //handle bad roomId
    const roomId = ctx.db.normalizeId("rooms", args.roomId);

    if (!roomId) {
      return null;
    }

    const room = await ctx.db.get(roomId);

    if (!room) {
      return { success: false, error: "Room Not Found" };
    }

    if (room.ownerId !== args.ownerId) {
      return { success: false, error: "Unauthorized: Not the room owner" };
    }

    await ctx.db.delete(roomId);

    return { success: true, roomId: args.roomId };
  },
});

// convex/queries/getRoomData.ts
export const getRoomData = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) return null;

    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("_id"), roomId))
      .first();
    if (!room) return null;

    const roomContent = await ctx.db
      .query("roomContent")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .first();

    const files = await ctx.db
      .query("filesystem")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect();

    const fileSnapshots: Record<string, string> = {};
    for (const file of files) {
      if (file.type === "file" && file.lastSyncedContent) {
        fileSnapshots[file._id] = file.lastSyncedContent;
      }
    }

    return {
      roomId: room._id,
      activeFileId: roomContent?.activeFileId ?? null,
      whiteboard: [],
      fileSnapshots,
      settings: roomContent?.settings ?? {},
    };
  },
});

export const addUserToRoom = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    role: v.union(
      v.literal("owner"),
      v.literal("mentor"),
      v.literal("student"),
      v.literal("collaborator"),
    ),
    permissions: v.array(v.union(v.literal("read"), v.literal("write"))),
  },

  handler: async (ctx, args) => {
    // Check if room exists
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("_id"), args.roomId))
      .first();

    if (!room) {
      return {
        success: false,
        error: "Room not found",
      };
    }

    // Check if user already exists in room
    const existingRoomUser = await ctx.db
      .query("roomUsers")
      .filter((q) =>
        q.and(
          q.eq(q.field("roomId"), args.roomId),
          q.eq(q.field("userId"), args.userId),
        ),
      )
      .first();

    if (existingRoomUser) {
      // User already exists, update permissions if needed
      await ctx.db.patch(existingRoomUser._id, {
        role: args.role || existingRoomUser.role,
        permissions: args.permissions,
      });

      return {
        success: true,
        message: "User access updated",
        roomUserId: existingRoomUser._id,
      };
    }

    const normalizedRoomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!normalizedRoomId) {
      return {
        success: false,
        error: "Invalid room ID",
      };
    }

    const roomUserId = await ctx.db.insert("roomUsers", {
      roomId: normalizedRoomId,
      userId: args.userId,
      role: args.role || "viewer",
      permissions: args.permissions,
      lastActiveAt: Date.now(),
      joinedAt: Date.now(),
    });

    return {
      success: true,
      message: "User added to room",
      roomUserId,
    };
  },
});
