import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tags")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const create = mutation({
  args: { name: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tags")
      .withIndex("by_user_name", (q) => 
        q.eq("userId", args.userId).eq("name", args.name)
      )
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("tags", {
      name: args.name,
      userId: args.userId,
    });
  },
});
