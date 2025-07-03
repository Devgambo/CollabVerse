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
    handler: async (ctx,args) => {
        const roomId = ctx.db.normalizeId("rooms", args.roomId);
        if (!roomId) return { success: false, error: "Invalid room ID" };
        const room = await ctx.db.get(roomId);
        if (!room) return { success: false, error: "Room not found" };
        const files =  await ctx.db
            .query("filesystem")
            .filter((eachFile)=> 
                eachFile.eq(eachFile.field("roomId"),roomId),
            )
            .order("desc");
        return files;
    },
});


export const getFileContent = query({
    args: {
        fileId: v.string(),
    },

    handler: async(ctx, args)=>{
        const fileId = ctx.db.normalizeId("filesystem", args.fileId);
        if(!fileId) return { success: false, error: "Invalid file ID" };
        
        const file = await ctx.db.get(fileId);
        if (!file) return { success: false, error: "File/Folder not found" };

        if(file.type != 'file'){
            return { success: false, error: "Can't fetch content with folderId" }
        }

        const content = await ctx.db
            .query("fileContent")
            .filter((eachContent)=> 
                eachContent.eq(eachContent.field("fileId"),fileId),
            );
        if(!content){
            return { success: false, error: "File constent not found" }
        }

        return content;
    }
})
