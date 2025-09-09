'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/lib/themes'
import { useTheme as useNextTheme } from 'next-themes'

export function DynamicCodeTheme() {
  const { mode } = useTheme()
  const { resolvedTheme, systemTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure we're mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only run on client side and when mounted
    if (!mounted || !mode) return

    // Remove any existing highlight.js theme links
    const existingLinks = document.querySelectorAll('link[href*="highlight.js"]')
    existingLinks.forEach(link => link.remove())

    // Determine the effective theme mode
    let effectiveMode: 'light' | 'dark'
    
    if (mode === 'system') {
      // For system mode, try multiple ways to detect the actual system preference
      if (resolvedTheme) {
        effectiveMode = resolvedTheme === 'dark' ? 'dark' : 'light'
      } else if (systemTheme) {
        effectiveMode = systemTheme === 'dark' ? 'dark' : 'light'
      } else {
        // Fallback to checking system preference directly
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        effectiveMode = prefersDark ? 'dark' : 'light'
      }
    } else {
      // For explicit light/dark modes, use the custom theme mode
      effectiveMode = mode as 'light' | 'dark'
    }

    // Choose the appropriate GitHub theme based on the effective mode
    const themeUrl = effectiveMode === 'dark' 
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.0/styles/github-dark.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.0/styles/github.min.css'

    // Debug logging (remove in production)
    console.log('Theme debug:', { mode, resolvedTheme, systemTheme, effectiveMode, themeUrl })

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = themeUrl
    link.onload = () => console.log('✓ CSS loaded:', themeUrl)
    link.onerror = () => console.error('✗ CSS failed to load:', themeUrl)
    
    document.head.appendChild(link)
    console.log('📦 CSS link added to head:', themeUrl)
  }, [mode, resolvedTheme, systemTheme, mounted])

  return null
}
