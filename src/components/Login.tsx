import React, { useState } from "react";
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, Compass, LogIn, Loader2 } from "lucide-react";

export interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. First attempt login via server API route
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        onLoginSuccess(data.user?.username || username.trim());
        return;
      }

      // If response returned 401 or failure
      if (data && !data.success) {
        setError(data.error || "Invalid username or password.");
        setLoading(false);
        return;
      }

      // 2. Client-side fallback check using environment variables
      const envUser = import.meta.env.VITE_GIS_USERNAME;
      const envPass = import.meta.env.VITE_GIS_PASSWORD;

      if (envUser && envPass && username.trim() === envUser && password.trim() === envPass) {
        onLoginSuccess(username.trim());
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      // Fallback check if server offline
      const envUser = import.meta.env.VITE_GIS_USERNAME;
      const envPass = import.meta.env.VITE_GIS_PASSWORD;

      if (envUser && envPass && username.trim() === envUser && password.trim() === envPass) {
        onLoginSuccess(username.trim());
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/35 p-4 font-sans select-none animate-fadeIn">
      {/* Translucent light login card - map background remains crisp & visible underneath */}
      <div className="w-full max-w-[420px] bg-slate-200/90 dark:bg-slate-800/90 backdrop-none border border-white/60 dark:border-slate-700/80 shadow-2xl rounded-3xl p-8 text-slate-800 dark:text-slate-100 relative overflow-hidden transition-all duration-300">
        
        {/* Top Circular Icon Badge */}
        <div className="w-16 h-16 rounded-full bg-indigo-500/15 border border-indigo-300/50 dark:border-indigo-500/30 shadow-sm flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>

        {/* Title and Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            Dehradun Geoportal
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium max-w-xs mx-auto leading-relaxed">
            Authorized Access Only. Please sign in to explore interactive district maps & planners.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 font-semibold leading-snug">{error}</div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1.5">
              USERNAME
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                required
                autoFocus
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-900/80 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1.5">
              PASSWORD
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-10 py-3 bg-white/80 dark:bg-slate-900/80 border border-slate-300/80 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 font-bold text-xs text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Explore Geoportal</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-slate-300/50 dark:border-slate-700/50 text-center">
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-400 tracking-[0.2em] uppercase">
            DEHRADUN • GEOPORTAL
          </span>
        </div>
      </div>
    </div>
  );
}
