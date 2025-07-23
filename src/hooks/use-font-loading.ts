'use client'

import { useEffect, useState } from 'react'

export function useFontLoading() {
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [fontsLoading, setFontsLoading] = useState(true)

  useEffect(() => {
    // Check if fonts are already loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true)
        setFontsLoading(false)
      })
    } else {
      // Fallback for browsers that don't support Font Loading API
      const timer = setTimeout(() => {
        setFontsLoaded(true)
        setFontsLoading(false)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  return { fontsLoaded, fontsLoading }
} 