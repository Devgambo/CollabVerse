import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
    args:{
        roomId: v.string(),
        userId: v.union(v.string(), v.null()), // null for AI
        text: v.string(),
        isAI: v.boolean(),
        // replyToId: v.optional(v.id("messages")),
        createdAt: v.number(),
    },
    handler: async(ctx,args)=>{
        const roomId = ctx.db.normalizeId("rooms", args.roomId);
        if (!roomId) return { success: false, error: "Invalid room ID" };
        const room = await ctx.db.get(roomId);
        if (!room) return { success: false, error: "Room not found" };

        //TODO: check wheather user is from the same room
        await ctx.db.insert("messages",{
            roomId: roomId,
            userId: args.userId,
            text: args.text,
            isAI: args.isAI,
            // replyToId: args.replyToId,
            createdAt: args.createdAt
        })
    }
})


export const getMessages = query({
    args: {
        roomId: v.string()
    },
    handler: async (ctx,args) => {
      const roomId = ctx.db.normalizeId("rooms", args.roomId);
      if (!roomId) return { success: false, error: "Invalid room ID" };
    
      const room = await ctx.db.get(roomId);
      if (!room) return { success: false, error: "Room not found" };

      // Get most recent messages first
      const messages = await ctx.db
        .query("messages")
        .filter((eachMsg)=>
            eachMsg.eq(eachMsg.field("roomId"), roomId),
        )
        .order("desc").take(50);
      // Reverse the list so that it's in a chronological order.
      return messages.reverse();
    },
});


export const deleteMessages = mutation({
    args: {
      roomId: v.string(),
      userId: v.string(),
    },
    handler: async (ctx, args) => {
      const normalizedRoomId = ctx.db.normalizeId("rooms", args.roomId);
      if (!normalizedRoomId) return { success: false, error: "Invalid room ID" };
  
      const room = await ctx.db.get(normalizedRoomId);
      if (!room) return { success: false, error: "Room not found" };
  
      if (room.ownerId !== args.userId) {
        return { success: false, error: "Only owner can delete the messages." };
      }
  
      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("roomId"), normalizedRoomId))
        .collect();
  
      for (const msg of messages) {
        await ctx.db.delete(msg._id);
      }
  
      return { success: true };
    },
  });