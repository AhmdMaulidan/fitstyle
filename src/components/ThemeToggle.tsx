"use client";

import { Sun, Moon } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { state, toggleTheme } = useApp();
  const isDark = state.theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-7 rounded-full transition-all duration-300 flex items-center p-1 overflow-hidden",
        isDark 
          ? "bg-brand-900/40 border border-brand-500/20" 
          : "bg-gray-200 border border-gray-300"
      )}
      aria-label="Toggle Theme"
    >
      {/* Background Track Highlights */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        isDark ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute top-1 left-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
        <div className="absolute top-4 left-6 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Sliding Circle */}
      <div
        className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 transform z-10 shadow-lg",
          isDark 
            ? "translate-x-7 bg-brand-500 text-white rotate-0" 
            : "translate-x-0 bg-white text-brand-500 rotate-90"
        )}
      >
        {isDark ? (
          <Moon className="w-3 h-3 fill-current" />
        ) : (
          <Sun className="w-3.5 h-3.5 fill-current" />
        )}
      </div>

      {/* Static Icons in track */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
        <Sun className={cn("w-3.5 h-3.5 transition-opacity duration-300", isDark ? "opacity-0" : "opacity-20 text-brand-600")} />
        <Moon className={cn("w-3 h-3 transition-opacity duration-300", isDark ? "opacity-20 text-white" : "opacity-0")} />
      </div>
    </button>
  );
}
