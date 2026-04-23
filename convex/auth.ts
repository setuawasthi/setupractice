import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// User functions
export const createUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      emailVerified: args.emailVerified,
      image: args.image,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const findUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const findUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
  },
});

// Session functions
export const createSession = mutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("sessions", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const findSessionByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
  },
});

export const deleteSession = mutation({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const deleteExpiredSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const sessions = await ctx.db.query("sessions").collect();
    for (const session of sessions) {
      if (session.expiresAt < now) {
        await ctx.db.delete(session._id);
      }
    }
  },
});

// Account functions (OAuth)
export const createAccount = mutation({
  args: {
    userId: v.id("users"),
    accountId: v.string(),
    providerId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    idToken: v.optional(v.string()),
    accessTokenExpiresAt: v.optional(v.number()),
    refreshTokenExpiresAt: v.optional(v.number()),
    scope: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("accounts", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const findAccount = query({
  args: {
    providerId: v.string(),
    accountId: v.string(),
  },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query("accounts")
      .withIndex("by_userId")
      .collect();
    return accounts.find(
      (a) => a.providerId === args.providerId && a.accountId === args.accountId
    );
  },
});

// Verification functions
export const createVerification = mutation({
  args: {
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("verifications", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const findVerification = query({
  args: { identifier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("verifications")
      .withIndex("by_identifier", (q) => q.eq("identifier", args.identifier))
      .unique();
  },
});

export const deleteVerification = mutation({
  args: { id: v.id("verifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Auth: get current session + user
export const getSessionAndUser = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
      await ctx.db.delete(session._id);
      return null;
    }
    const user = await ctx.db.get(session.userId);
    if (!user) return null;
    return { session, user };
  },
});

// Password utils
export const setPassword = mutation({
  args: {
    userId: v.id("users"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("accounts", {
      userId: args.userId,
      accountId: args.userId,
      providerId: "credentials",
      password: args.password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const verifyPassword = mutation({
  args: {
    userId: v.id("users"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query("accounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    const creds = accounts.find((a) => a.providerId === "credentials");
    return creds ? creds.password === args.password : false;
  },
});
