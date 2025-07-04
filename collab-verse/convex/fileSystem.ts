import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

//Things we need
//fetch all the files/folder of all type from one room  [done]
//fetch the file content from fileId    [done]

//update filecontent ---> fileId, body
//create file-->
//
//step-1//fileSystem create
//step-2 //on saving create filecontent if not with fileid
//if already there update filecontent.

export const getFilesFolders = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) return { success: false, error: "Invalid room ID" };
    const room = await ctx.db.get(roomId);
    if (!room) return { success: false, error: "Room not found" };
    const files = await ctx.db
      .query("filesystem")
      .filter((eachFile) => eachFile.eq(eachFile.field("roomId"), roomId))
      .order("desc")
      .collect();
    return { files };
  },
});

export const createFileOrFolder = mutation({
  args: {
    name: v.string(),
    roomId: v.string(),
    parentId: v.optional(v.union(v.string(), v.null())),
    type: v.union(v.literal("file"), v.literal("folder")),
    extension: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const roomId = ctx.db.normalizeId("rooms", args.roomId);
    if (!roomId) return { success: false, error: "Invalid room ID" };

    let pId = null;
    if (args.parentId != null) {
      pId = ctx.db.normalizeId("filesystem", args.parentId);
      if (!pId) return { success: false, error: "Invalid parent ID" };
    }

    const fileId = await ctx.db.insert("filesystem", {
      name: args.name,
      type: args.type,
      roomId: roomId,
      parentId: pId ? pId : null,
      extension: args.extension,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: args.userId,
      lastModifiedBy: args.userId,
    });

    return { success: true, fileId };
  },
});

export const updateFileOrFolder = mutation({
  args: {
    fileId: v.string(),
    name: v.optional(v.string()),
    parentId: v.optional(v.union(v.string(), v.null())),
    extension: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("filesystem", args.fileId);
    if (!id) return { success: false, error: "Invalid file ID" };

    const existing = await ctx.db.get(id);
    if (!existing) return { success: false, error: "File not found" };

    let pId = existing.parentId;
    if (args.parentId !== undefined) {
      if (args.parentId === null) {
        pId = null;
      } else {
        pId = ctx.db.normalizeId("filesystem", args.parentId) ?? null;
        if (!pId) return { success: false, error: "Invalid parent ID" };
      }
    }

    const updateData: any = {
      updatedAt: Date.now(),
      lastModifiedBy: args.userId,
    };

    if (args.name !== undefined) updateData.name = args.name;
    if (args.parentId !== undefined) updateData.parentId = pId;
    if (args.extension !== undefined) updateData.extension = args.extension;

    await ctx.db.patch(id, updateData);
    return { success: true };
  },
});

export const deleteFileOrFolder = mutation({
  args: {
    fileId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("filesystem", args.fileId);
    if (!id) return { success: false, error: "Invalid file ID" };

    const existing = await ctx.db.get(id);
    if (!existing) return { success: false, error: "File not found" };

    if (existing.type === "folder") {
      const children = await ctx.db
        .query("filesystem")
        .withIndex("by_parent", (q) => q.eq("parentId", id))
        .collect();

      if (children.length > 0) {
        return { success: false, error: "Cannot delete folder with children" };
      }
    }

    if (existing.type === "file") {
      const content = await ctx.db
        .query("fileContent")
        .withIndex("by_fileId", (q) => q.eq("fileId", id))
        .first();

      if (content) {
        await ctx.db.delete(content._id);
      }
    }

    await ctx.db.delete(id);
    return { success: true };
  },
});

// FILE CONTENT FUNCTIONS

//get filecontent
export const getFileContent = query({
  args: {
    fileId: v.string(),
  },

  handler: async (ctx, args) => {
    const fileId = ctx.db.normalizeId("filesystem", args.fileId);
    if (!fileId) return { success: false, error: "Invalid file ID" };

    const file = await ctx.db.get(fileId);
    if (!file) return { success: false, error: "File/Folder not found" };

    if (file.type != "file") {
      return { success: false, error: "Can't fetch content with folderId" };
    }

    const content = await ctx.db
      .query("fileContent")
      .filter((eachContent) =>
        eachContent.eq(eachContent.field("fileId"), fileId))
      .collect()

    if (content.length === 0) {
      return { success: false, error: "File content not found" };
    }
    
    return { success: true, data: content };
  },
});

// Save file content (create or update)
export const saveFileContent = mutation({
  args: {
    fileId: v.string(),
    content: v.optional(v.string()),
    language: v.optional(v.string()),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
    executionTime: v.optional(v.number()),
    isExecutable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("filesystem", args.fileId);
    if (!id) return { success: false, error: "Invalid file ID" };

    const file = await ctx.db.get(id);
    if (!file) return { success: false, error: "File not found" };
    if (file.type !== "file")
      return { success: false, error: "Can only save content for files" };

    // Check if content already exists
    const existingContent = await ctx.db
      .query("fileContent")
      .withIndex("by_fileId", (q) => q.eq("fileId", id))
      .first();

    if (existingContent) {
      // Update existing content
      const updateData: any = {
        updatedAt: Date.now(),
      };

      if (args.content !== undefined) updateData.content = args.content;
      if (args.language !== undefined) updateData.language = args.language;
      if (args.output !== undefined) updateData.output = args.output;
      if (args.error !== undefined) updateData.error = args.error;
      if (args.executionTime !== undefined)
        updateData.executionTime = args.executionTime;
      if (args.isExecutable !== undefined)
        updateData.isExecutable = args.isExecutable;

      await ctx.db.patch(existingContent._id, updateData);
      return {
        success: true,
        contentId: existingContent._id,
        action: "updated",
      };
    } else {
      // Create new content
      const contentId = await ctx.db.insert("fileContent", {
        fileId: id,
        content: args.content,
        language: args.language,
        output: args.output,
        error: args.error,
        executionTime: args.executionTime,
        // isExecutable: args.isExecutable,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { success: true, contentId, action: "created" };
    }
  },
});

// Delete file content
export const deleteFileContent = mutation({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("filesystem", args.fileId);
    if (!id) return { success: false, error: "Invalid file ID" };

    const content = await ctx.db
      .query("fileContent")
      .withIndex("by_fileId", (q) => q.eq("fileId", id))
      .first();

    if (!content) return { success: false, error: "Content not found" };

    await ctx.db.delete(content._id);
    return { success: true };
  },
});
