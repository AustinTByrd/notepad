// Font performance monitoring utilities

export interface FontMetrics {
  loadTime: number
  fontFamily: string
  isLoaded: boolean
}

export function measureFontLoadTime(fontFamily: string): Promise<FontMetrics> {
  return new Promise((resolve) => {
    const startTime = performance.now()
    
    // Check if font is already loaded
    if (document.fonts && document.fonts.check(`12px "${fontFamily}"`)) {
      resolve({
        loadTime: 0,
        fontFamily,
        isLoaded: true
      })
      return
    }
    
    // Monitor font loading
    const checkFont = () => {
      if (document.fonts && document.fonts.check(`12px "${fontFamily}"`)) {
        const loadTime = performance.now() - startTime
        resolve({
          loadTime,
          fontFamily,
          isLoaded: true
        })
      } else {
        requestAnimationFrame(checkFont)
      }
    }
    
    checkFont()
  })
}

export function optimizeFontDisplay() {
  // Add font-display: swap to all font-face rules
  const style = document.createElement('style')
  style.textContent = `
    @font-face {
      font-display: swap;
    }
  `
  document.head.appendChild(style)
}

// Preload critical fonts
export function preloadCriticalFonts() {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'font'
  link.type = 'font/woff2'
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
} 