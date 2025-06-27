import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
