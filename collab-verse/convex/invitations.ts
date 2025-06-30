import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createInvitation = mutation({
  args: {
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
    expiresAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existingInvitation = await ctx.db
      .query("invitations")
      .filter((q) =>
        q.and(
          q.eq(q.field("roomId"), args.roomId),
          q.eq(q.field("email"), args.email),
          q.eq(q.field("status"), "pending"),
        ),
      )
      .first();

    if (existingInvitation) {
      await ctx.db.patch(existingInvitation._id, {
        role: args.role,
        permissions: args.permissions,
        token: args.token,
        expiresAt: args.expiresAt,
        createdAt: new Date().toISOString(),
      });

      return { invitationId: existingInvitation._id };
    }

    const invitationId = await ctx.db.insert("invitations", {
      roomId: args.roomId,
      email: args.email,
      role: args.role,
      permissions: args.permissions,
      token: args.token,
      status: args.status,
      createdAt: new Date().toISOString(),
      expiresAt: args.expiresAt,
    });

    return { invitationId };
  },
});

export const getInvitationByToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("invitations")
      .filter((q) => q.eq(q.field("token"), args.token))
      .first();

    return invitation;
  },
});

export const getInvitationForUser = query({
  args: {
    roomId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("invitations")
      .filter((q) =>
        q.and(
          q.eq(q.field("roomId"), args.roomId),
          q.eq(q.field("email"), args.email),
          q.eq(q.field("status"), "pending"),
        ),
      )
      .first();

    return invitation;
  },
});

export const markInvitationAccepted = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invitationId, {
      status: "accepted",
    });

    return { success: true };
  },
});
