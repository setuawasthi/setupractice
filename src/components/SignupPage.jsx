import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function SignupPage({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createUser = useMutation(api.auth.createUser);
  const createSession = useMutation(api.auth.createSession);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userId = await createUser({
        name,
        email,
        emailVerified: false,
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
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#e5e6e8] dark:bg-[#0f1117] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-[420px] bg-white dark:bg-[#1a1d29] rounded-3xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-4">
            <User size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Create account</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">Get started with BetterTasks today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-0.5">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full h-11 pl-10 pr-4 text-sm text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/60 rounded-xl placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary-200/60 dark:focus:ring-primary-800/40 border border-transparent focus:border-primary-200 dark:focus:border-primary-800"
              />
            </div>
          </div>

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
            {isLoading ? "Creating account..." : "Create Account"}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
          Already have an account?{" "}
          <button onClick={onSwitch} className="text-primary-500 hover:text-primary-600 font-semibold cursor-pointer">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
