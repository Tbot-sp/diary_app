import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// query是函數，所以是query(),然後裡面有對象，所以是query({})
export const list2 = query({
    args:{ userId: v.string(), tag: v.optional(v.string()) },
    handler: async (ctx,args) => {
        const diaries = await ctx.db.query("diaries")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();

        if (args.tag) {
            return diaries.filter(d => d.tags?.includes(args.tag!));
        }
        return diaries;
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
        content: v.string(),
        mood: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const { id, title, content, mood, tags } = args;
        
        // Ensure tags exist in tags table
        if (tags && tags.length > 0) {
            // Retrieve user from diary (to get userId) or pass userId?
            // To be safe and simple, we assume the frontend ensures tags are created or we create them here.
            // But we don't have userId in args here. We can fetch the diary to get userId.
            const diary = await ctx.db.get(id);
            if (diary) {
                for (const tag of tags) {
                   const existing = await ctx.db
                      .query("tags")
                      .withIndex("by_user_name", (q) => 
                        q.eq("userId", diary.userId).eq("name", tag)
                      )
                      .first();
                    if (!existing) {
                        await ctx.db.insert("tags", { name: tag, userId: diary.userId });
                    }
                }
            }
        }

        await ctx.db.patch(id, { title, content, mood, tags });
    },
});

export const save = mutation({
    args:{ 
        title: v.string(),  
        content: v.string(), 
        userId: v.string(), 
        mood: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx,args) => {
        // Ensure tags exist in tags table
        if (args.tags && args.tags.length > 0) {
            for (const tag of args.tags) {
               const existing = await ctx.db
                  .query("tags")
                  .withIndex("by_user_name", (q) => 
                    q.eq("userId", args.userId).eq("name", tag)
                  )
                  .first();
                if (!existing) {
                    await ctx.db.insert("tags", { name: tag, userId: args.userId });
                }
            }
        }

        const id =  await ctx.db.insert("diaries", {
            title:args.title,
            userId: args.userId,
            content: args.content,
            mood: args.mood,
            tags: args.tags,
        })
        return id
    },
})

