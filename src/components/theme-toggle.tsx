"use client";

import { useTheme } from "@/lib/themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors">
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  const toggleMode = () => {
    setIsTransitioning(true);
    
    // Start transition
    setTimeout(() => {
      if (mode === "light") {
        setMode("dark");
      } else if (mode === "dark") {
        setMode("system");
      } else {
        setMode("light");
      }
      
      // End transition after a short delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 75);
  };

  const getIcon = () => {
    if (mode === "light") return <Sun className="h-5 w-5" />;
    if (mode === "dark") return <Moon className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  return (
    <button
      onClick={toggleMode}
      className="p-2 rounded-lg border border-border bg-background hover:bg-accent active:scale-95 transition-all duration-150"
      aria-label="Toggle light/dark mode"
    >
      <div className={`transition-all duration-150 ${
        isTransitioning 
          ? "scale-50 blur-[3px] opacity-70" 
          : "scale-100 blur-none opacity-100"
      }`}>
        {getIcon()}
      </div>
    </button>
  );
} 