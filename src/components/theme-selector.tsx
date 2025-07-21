"use client";

import { useTheme } from "@/lib/themes";
import { Palette } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ThemeSelectorProps {
  updateTheme?: (theme: string) => Promise<void>;
}

export function ThemeSelector({ updateTheme }: ThemeSelectorProps) {
  const { currentTheme, themes, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleToNextTheme = async () => {
    setIsTransitioning(true);
    
    // Start transition
    setTimeout(async () => {
      const currentIndex = themes.findIndex(theme => theme.name === currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      const nextTheme = themes[nextIndex];
      
      // First update the visual theme
      setTheme(nextTheme.name);
      
      // Then update the database if we're in a note context
      if (updateTheme) {
        try {
          await updateTheme(nextTheme.name);
        } catch (error) {
          console.error('Failed to save theme to database:', error);
          // Theme is still applied visually even if database update fails
        }
      }
      
      // End transition after a short delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 75);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="p-2">
        <Palette className="h-5 w-5" />
      </Button>
    );
  }



  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleToNextTheme}
      className="p-2 active:scale-95 transition-all duration-150"
      aria-label={`Switch theme`}
    >
      <div className={`transition-all duration-150 ${
        isTransitioning 
          ? "scale-50 blur-[2px] opacity-70" 
          : "scale-100 blur-none opacity-100"
      }`}>
        <Palette className="h-5 w-5" />
      </div>
    </Button>
  );
} 