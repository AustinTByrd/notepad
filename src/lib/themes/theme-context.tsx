"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { ThemeContextType, ThemeConfig, ThemeMode } from "./types";
import { themes } from "./index";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export function ThemeProvider({ children, defaultTheme = "default" }: ThemeProviderProps) {
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved theme preset from localStorage
    const savedTheme = localStorage.getItem("theme-preset");
    if (savedTheme && themes.find((t: ThemeConfig) => t.name === savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const setTheme = (themeName: string) => {
    const theme = themes.find((t: ThemeConfig) => t.name === themeName);
    if (!theme) return;

    setCurrentTheme(themeName);
    localStorage.setItem("theme-preset", themeName);
    
    // Apply CSS custom properties
    applyThemeVariables(theme, nextTheme as ThemeMode);
  };

  const setMode = (mode: ThemeMode) => {
    setNextTheme(mode);
  };

  useEffect(() => {
    if (mounted && currentTheme) {
      const theme = themes.find((t: ThemeConfig) => t.name === currentTheme);
      if (theme) {
        applyThemeVariables(theme, nextTheme as ThemeMode);
      }
    }
  }, [currentTheme, nextTheme, mounted]);

  const contextValue: ThemeContextType = {
    currentTheme,
    themes,
    setTheme,
    mode: nextTheme as ThemeMode,
    setMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function applyThemeVariables(theme: ThemeConfig, mode: ThemeMode) {
  const root = document.documentElement;
  const colors = mode === "dark" ? theme.dark : theme.light;
  
  // Apply color variables
  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`;
    root.style.setProperty(cssVar, value);
  });

  // Apply font variables
  Object.entries(theme.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value);
  });

  // Apply radius
  root.style.setProperty("--radius", theme.radius);

  // Apply shadow variables
  Object.entries(theme.shadows).forEach(([key, value]) => {
    const shadowKey = key === "default" ? "shadow" : `shadow-${key}`;
    root.style.setProperty(`--${shadowKey}`, value);
  });
} 