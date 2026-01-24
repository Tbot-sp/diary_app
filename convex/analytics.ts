import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const recordEvent = mutation({
  args: {
    eventType: v.string(),
    userId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("analytics", {
      eventType: args.eventType,
      userId: args.userId,
      metadata: args.metadata,
    });
  },
});
