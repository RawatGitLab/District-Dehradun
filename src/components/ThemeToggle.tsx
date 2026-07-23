import React from "react";
import { Sun, Moon } from "lucide-react";

export interface ThemeToggleProps {
  theme?: "light" | "dark";
  onToggle?: (newTheme: "light" | "dark") => void;
  className?: string;
}

export default function ThemeToggle({
  theme = "light",
  onToggle,
  className = "",
}: ThemeToggleProps) {
  const isDark = theme === "dark";

  const handleToggle = () => {
    const nextTheme = isDark ? "light" : "dark";
    if (onToggle) {
      onToggle(nextTheme);
    }
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Current: ${isDark ? "Dark" : "Light"} mode. Click to switch to ${isDark ? "Light" : "Dark"} mode`}
      className={`relative inline-flex items-center justify-center p-1.5 rounded-lg border transition-all duration-200 cursor-pointer select-none ${
        isDark
          ? "bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:border-slate-600 shadow-xs"
          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900 shadow-xs"
      } ${className}`}
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-amber-300 transition-transform duration-200" />
      ) : (
        <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200" />
      )}
    </button>
  );
}
