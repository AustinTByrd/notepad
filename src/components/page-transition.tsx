'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Start with blur effect on every route change
    setIsLoaded(false)
    setIsTransitioning(true)
    
    // Show the blur transition for a more noticeable duration
    const timer = setTimeout(() => {
      setIsLoaded(true)
      setIsTransitioning(false)
    }, 350) // Longer duration for more noticeable effect

    return () => clearTimeout(timer)
  }, [pathname]) // Trigger on route changes

  return (
    <div
      className={`transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isLoaded && !isTransitioning
          ? 'blur-0 opacity-100 scale-100' 
          : 'blur-sm opacity-80 scale-[0.98]'
      }`}
    >
      {children}
    </div>
  )
} 