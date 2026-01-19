import { defineSchema,defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    diaries: defineTable({
    title: v.string(),
    content: v.string(),
    userId: v.string(),
    mood: v.optional(v.string()),
  }).index("by_user", ["userId"]),
    users: defineTable({
    account: v.string(),
    password: v.string(),
}),
  });

