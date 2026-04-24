import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query: get all tasks for a specific user sorted by createdAt desc
export const getTasks = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await ctx.db
      .query("tasks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Mutation: add a new task
export const addTask = mutation({
  args: {
    text: v.string(),
    priority: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      text: args.text,
      completed: false,
      priority: args.priority || "Medium",
      createdAt: Date.now(),
      userId: args.userId,
    });
  },
});

// Mutation: delete a task
export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Mutation: toggle task completion
export const toggleTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    await ctx.db.patch(args.id, { completed: !task.completed });
  },
});

// Mutation: edit task text
export const editTask = mutation({
  args: { id: v.id("tasks"), text: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { text: args.text });
  },
});

// Mutation: change task priority
export const changePriority = mutation({
  args: { id: v.id("tasks"), priority: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { priority: args.priority });
  },
});

// Mutation: clear all completed tasks for a user
export const clearCompleted = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const completed = await ctx.db
      .query("tasks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();
    for (const task of completed) {
      await ctx.db.delete(task._id);
    }
  },
});
