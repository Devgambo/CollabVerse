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
    await ctx.db.insert("rooms", {
      name: args.name,
      ownerId: args.ownerId,
      roomType: args.roomType,
      createdAt: Date.now(),
      lastAccessed: 1,
    });
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

export const getRoomById = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("_id"), args.roomId))
      .first();
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
      whiteboard: [], // you could fetch Liveblocks here if you had a backup
      fileSnapshots,
      settings: roomContent?.settings ?? {},
    };
  },
});
