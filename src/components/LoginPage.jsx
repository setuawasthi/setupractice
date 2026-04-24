import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Mail, Lock, Github, Chrome, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

const GOOGLE_CLIENT_ID = "823810541707-o35b0clfil005q3u18pbhp939q2ud1qs.apps.googleusercontent.com";

function decodeJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "="));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function LoginPage({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null); // 'google' | 'github' | null
  const googleBtnRef = useRef(null);

  const createSession = useMutation(api.auth.createSession);
  const createUser = useMutation(api.auth.createUser);
  const verifyPassword = useMutation(api.auth.verifyPassword);
  const userByEmail = useQuery(
    api.auth.findUserByEmail,
    email ? { email } : "skip"
  );

  // Load Google Identity Services
  useEffect(() => {
    if (document.getElementById("google-script")) return;
    const script = document.createElement("script");
    script.id = "google-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        if (window.google && window.google.accounts && window.google.accounts.id && googleBtnRef.current) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            width: googleBtnRef.current.offsetWidth || 380,
            logo_alignment: "center",
          });
        }
      } catch (err) {
        console.error("Google Sign-In initialization failed:", err);
      }
    };
    script.onerror = () => {
      console.error("Failed to load Google Sign-In script");
    };
    document.body.appendChild(script);
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    setOauthLoading("google");
    setError("");
    try {
      const payload = decodeJwt(response.credential);
      if (!payload) throw new Error("Invalid Google token");

      const name = payload.name || payload.given_name || "Google User";
      const email = payload.email;
      const image = payload.picture || null;

      if (!email) throw new Error("No email from Google");

      // Try to find existing user or create new one
      const existingUser = await fetch("/api/placeholder", { method: "HEAD" }).catch(() => null);
      // We'll create a new user since we don't have a direct way to query by email in mutation context
      const userId = await createUser({
        name,
        email,
        emailVerified: true,
        image,
      });

      const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      await createSession({
        userId,
        token,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      });

      localStorage.setItem("bettertasks-session", token);
      window.location.reload();
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      setOauthLoading(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!userByEmail) {
        setError("No account found with this email.");
        setIsLoading(false);
        return;
      }

      const hashed = await hashPassword(password);
      const valid = await verifyPassword({ userId: userByEmail._id, password: hashed });
      if (!valid) {
        setError("Incorrect password.");
        setIsLoading(false);
        return;
      }

      const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      await createSession({
        userId: userByEmail._id,
        token,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      });

      localStorage.setItem("bettertasks-session", token);
      window.location.reload();
    } catch (err) {
      setError("Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  async function hashPassword(pw) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pw);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const handleGithubOAuth = async () => {
    setOauthLoading("github");
    setError("");
    try {
      const demo = { name: "GitHub User", email: `github_${Date.now()}@demo.com` };
      const userId = await createUser({
        name: demo.name,
        email: demo.email,
        emailVerified: true,
      });

      const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      await createSession({
        userId,
        token,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      });

      localStorage.setItem("bettertasks-session", token);
      window.location.reload();
    } catch (err) {
      setError("GitHub sign-in failed. Please try again.");
      setOauthLoading(null);
    }
  };

  const SocialButton = ({ provider, icon: Icon, label, onClick }) => (
    <button
      onClick={onClick}
      disabled={oauthLoading}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {oauthLoading === provider ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Icon size={18} />
      )}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-[#e5e6e8] dark:bg-[#0f1117] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-[420px] bg-white dark:bg-[#1a1d29] rounded-3xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">Sign in to continue with BetterTasks</p>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div ref={googleBtnRef} className="w-full" />
          <SocialButton provider="github" icon={Github} label="GitHub" onClick={handleGithubOAuth} />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">or continue with email</span>
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-0.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-11 pl-10 pr-4 text-sm text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/60 rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary-200/60 dark:focus:ring-primary-800/40 border border-transparent focus:border-primary-200 dark:focus:border-primary-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-0.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 pl-10 pr-10 text-sm text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/60 rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary-200/60 dark:focus:ring-primary-800/40 border border-transparent focus:border-primary-200 dark:focus:border-primary-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? "Signing in..." : "Sign In"}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <button onClick={onSwitch} className="text-primary-500 hover:text-primary-600 font-semibold cursor-pointer">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
