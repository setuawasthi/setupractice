import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sessionToken, setSessionToken] = useState(() => {
    try { return localStorage.getItem("bettertasks-session"); } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(true);

  const sessionAndUser = useQuery(
    api.auth.getSessionAndUser,
    sessionToken ? { token: sessionToken } : "skip"
  );

  const createUser = useMutation(api.auth.createUser);
  const createSession = useMutation(api.auth.createSession);
  const findUserByEmail = useQuery(
    api.auth.findUserByEmail,
    undefined // we'll call this differently
  );

  const user = sessionAndUser?.user || null;
  const session = sessionAndUser?.session || null;

  useEffect(() => {
    setIsLoading(false);
  }, [sessionAndUser]);

  const signIn = async ({ email, password }) => {
    // Simple email/password auth via Convex
    // In production, use bcrypt via a backend action
    const userData = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).catch(() => null);
    return userData;
  };

  const signUp = async ({ name, email, password }) => {
    // Create user in Convex
    const userId = await createUser({
      name,
      email,
      emailVerified: false,
    });
    // Create session
    const token = generateToken();
    await createSession({
      userId,
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    localStorage.setItem("bettertasks-session", token);
    setSessionToken(token);
    return { userId, token };
  };

  const signOut = async () => {
    localStorage.removeItem("bettertasks-session");
    setSessionToken(null);
    window.location.reload();
  };

  const socialSignIn = async (provider) => {
    // OAuth flow - simplified for demo
    const mockUser = {
      name: "Demo User",
      email: "demo@example.com",
      image: null,
    };
    // In real implementation, redirect to OAuth provider
    console.log(`Sign in with ${provider}`);
    return mockUser;
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    socialSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function generateToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
