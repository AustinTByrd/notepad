"use client";

import { useTheme } from "@/lib/themes";
import { Palette, Check, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface ThemeSelectorProps {
  updateTheme?: (theme: string) => Promise<void>;
}

export function ThemeSelector({ updateTheme }: ThemeSelectorProps) {
  const { currentTheme, themes, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>('left');
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 256; // w-64 = 16rem = 256px
      
      // Check if dropdown would overflow on the right
      const wouldOverflowRight = buttonRect.left + dropdownWidth > viewportWidth;
      setDropdownPosition(wouldOverflowRight ? 'right' : 'left');
    }
  }, [isOpen]);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors">
        <Palette className="h-5 w-5" />
      </button>
    );
  }

  const currentThemeConfig = themes.find(theme => theme.name === currentTheme);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
        aria-label="Select theme"
      >
        <Palette className="h-5 w-5" />
        <span className="text-sm font-medium">
          {currentThemeConfig?.displayName || "Default"}
        </span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div 
            className={`absolute top-full mt-2 w-64 z-50 bg-popover border border-border rounded-lg shadow-lg py-2 ${
              dropdownPosition === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            <div className="px-3 py-2 border-b border-border">
              <h3 className="text-sm font-semibold text-popover-foreground">
                Choose Theme
              </h3>
              <p className="text-xs text-muted-foreground">
                Select a color theme for your interface
              </p>
            </div>
            
            <div className="py-1">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={async () => {
                    // First update the visual theme
                    setTheme(theme.name);
                    setIsOpen(false);
                    
                    // Then update the database if we're in a note context
                    if (updateTheme) {
                      try {
                        await updateTheme(theme.name);
                      } catch (error) {
                        console.error('Failed to save theme to database:', error);
                        // Theme is still applied visually even if database update fails
                      }
                    }
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Theme preview */}
                    <div className="flex gap-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: theme.light.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: theme.light.secondary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: theme.light.accent }}
                      />
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-popover-foreground">
                        {theme.displayName}
                      </div>
                      {theme.description && (
                        <div className="text-xs text-muted-foreground">
                          {theme.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {currentTheme === theme.name && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 