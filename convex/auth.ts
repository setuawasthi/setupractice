import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// --- PBKDF2 Password Hashing (Secure) ---
async function pbkdf2Hash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial, 256
  );
  const saltB64 = btoa(String.fromCharCode(...salt));
  const hashB64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
  return `${saltB64}:${hashB64}`;
}

async function pbkdf2Verify(password: string, stored: string): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(":");
  if (!saltB64 || !hashB64) return false;
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial, 256
  );
  const derivedB64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
  return derivedB64 === hashB64;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeString(str: string, maxLen = 200): string {
  return str.trim().slice(0, maxLen);
}

// --- User Functions ---
export const createUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = sanitizeString(args.email).toLowerCase();
    if (!isValidEmail(email)) throw new Error("Invalid email format");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) throw new Error("Email already registered");

    const now = Date.now();
    return await ctx.db.insert("users", {
      name: args.name ? sanitizeString(args.name, 100) : undefined,
      email,
      emailVerified: args.emailVerified,
      image: args.image ? sanitizeString(args.image, 500) : undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const findUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = sanitizeString(args.email).toLowerCase();
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
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
    const sanitized: any = { updatedAt: Date.now() };
    if (updates.name !== undefined) sanitized.name = sanitizeString(updates.name, 100);
    if (updates.email !== undefined) {
      const email = sanitizeString(updates.email).toLowerCase();
      if (!isValidEmail(email)) throw new Error("Invalid email format");
      sanitized.email = email;
    }
    if (updates.emailVerified !== undefined) sanitized.emailVerified = updates.emailVerified;
    if (updates.image !== undefined) sanitized.image = sanitizeString(updates.image, 500);
    await ctx.db.patch(id, sanitized);
  },
});

// --- Session Functions ---
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

// --- Account Functions (OAuth) ---
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

// --- Verification Functions ---
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

// --- Auth: get current session + user ---
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

// --- Secure Password Functions ---
export const setPassword = mutation({
  args: {
    userId: v.id("users"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.password.length < 6) throw new Error("Password must be at least 6 characters");
    const hashed = await pbkdf2Hash(args.password);
    const existing = await ctx.db
      .query("accounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    const creds = existing.find((a) => a.providerId === "credentials");
    if (creds) {
      await ctx.db.patch(creds._id, { password: hashed, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("accounts", {
        userId: args.userId,
        accountId: args.userId,
        providerId: "credentials",
        password: hashed,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
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
    if (!creds || !creds.password) return false;
    return await pbkdf2Verify(args.password, creds.password);
  },
});

// --- Rate Limiting (simple in-memory per email) ---
export const checkRateLimit = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = sanitizeString(args.email).toLowerCase();
    const key = `rl:${email}`;
    const existing = await ctx.db
      .query("verifications")
      .withIndex("by_identifier", (q) => q.eq("identifier", key))
      .unique();
    
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 5;
    
    if (existing) {
      const attempts = parseInt(existing.value, 10) || 0;
      if (existing.expiresAt > now && attempts >= maxAttempts) {
        return { allowed: false, retryAfter: Math.ceil((existing.expiresAt - now) / 1000) };
      }
      if (existing.expiresAt <= now) {
        // Reset window
        await ctx.db.patch(existing._id, { value: "1", expiresAt: now + windowMs, updatedAt: now });
      } else {
        await ctx.db.patch(existing._id, { value: String(attempts + 1), updatedAt: now });
      }
    } else {
      await ctx.db.insert("verifications", {
        identifier: key,
        value: "1",
        expiresAt: now + windowMs,
        createdAt: now,
        updatedAt: now,
      });
    }
    return { allowed: true, retryAfter: 0 };
  },
});