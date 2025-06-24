import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const registerUser = mutation({
    args: {
        userId: v.string(),
        username: v.string(),
        email: v.string(),
        isPro: v.boolean(),
    },

    handler: async(ctx,args)=>{
        const existingUser = await ctx.db
            .query("users")
            .filter((q)=>q.eq(q.field("userId"), args.userId))
            .first();

        if (!existingUser) {
            await ctx.db.insert("users", {
              userId: args.userId,
              username: args.username,
              email: args.email,
              isPro: false,
            });
        }
    }
});



