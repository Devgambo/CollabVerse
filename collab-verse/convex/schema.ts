import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    users: defineTable({
        userId: v.string(), // clerkId
        username: v.string(),
        email: v.string(),
        isPro: v.optional(v.boolean())
    }).index("by_user_id", ["userId"]),

    rooms: defineTable({
        name: v.string(),
        ownerId: v.string(), // Clerk user ID
        roomType: v.union(v.literal("collab"), v.literal("mentor")),
        createdAt: v.number(),
        lastAccessed: v.number(),
    }).index("by_owner", ["ownerId"]),

    roomUsers: defineTable({
        roomId: v.id("rooms"),
        userId: v.string(), // Clerk user ID
        role: v.union(
          v.literal("owner"),
          v.literal("mentor"),
          v.literal("student"),
          v.literal("collaborator")
        ),
        joinedAt: v.number(),
    })
        .index("by_room", ["roomId"])
        .index("by_user", ["userId"]),
    
    roomContent: defineTable({
        roomId: v.id("rooms"),
        content: v.object({
          code: v.optional(v.string()),
          text: v.optional(v.string()),
          whiteboard: v.optional(v.string()), // Serialized whiteboard state
        }),
        version: v.number(),
        savedAt: v.number(),
    }).index("by_room", ["roomId"]),
    
    messages: defineTable({
        roomId: v.id("rooms"),
        userId: v.union(v.string(), v.null()), // Null for AI messages
        text: v.string(),   //TODO: set lim to 100 words
        isAI: v.boolean(),
        createdAt: v.number(),
    }).index("by_room", ["roomId"]),

});
