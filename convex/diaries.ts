import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// query是函數，所以是query(),然後裡面有對象，所以是query({})
export const list2 = query({
    args:{ userId: v.string() },
    handler: async (ctx,args) => {
        return await ctx.db.query("diaries")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();
    },
})

export const remove = mutation({
    args: { id: v.id("diaries") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const update = mutation({
    args: { 
        id: v.id("diaries"), 
        title: v.string(), 
        content: v.string() 
    },
    handler: async (ctx, args) => {
        const { id, title, content } = args;
        await ctx.db.patch(id, { title, content });
    },
});

export const save = mutation({
    args:{ title: v.string(),  content: v.string() ,userId: v.string(),},
    handler: async (ctx,args) => {
        const id =  await ctx.db.insert("diaries", {
            title:args.title,
            userId: args.userId,
            content: args.content,
        })
        return id
    },
})

