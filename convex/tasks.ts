import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query: get all tasks sorted by createdAt desc
export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

// Mutation: add a new task
export const addTask = mutation({
  args: {
    text: v.string(),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      text: args.text,
      completed: false,
      priority: args.priority || "Medium",
      createdAt: Date.now(),
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

// Mutation: clear all completed tasks
export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const completed = await ctx.db
      .query("tasks")
      .withIndex("by_completed")
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();
    for (const task of completed) {
      await ctx.db.delete(task._id);
    }
  },
});
