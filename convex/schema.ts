import { defineSchema,defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    diaries: defineTable({
    title: v.string(),
    content: v.string(),
    userId: v.string(),
    mood: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  }).index("by_user", ["userId"]),
  users: defineTable({
    account: v.string(),
    password: v.string(),
    isPro: v.optional(v.boolean()),
    subscriptionEndTime: v.optional(v.number()),
  }),
  tags: defineTable({
    name: v.string(),
    userId: v.string(),
  })
  .index("by_user", ["userId"])
  .index("by_user_name", ["userId", "name"]),
});

