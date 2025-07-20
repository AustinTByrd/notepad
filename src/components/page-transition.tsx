'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Start with blur effect on every route change
    setIsLoaded(false)
    
    // Quickly reduce blur to 0
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 150) // Slightly longer for smoother effect

    return () => clearTimeout(timer)
  }, [pathname]) // Trigger on route changes

  return (
    <div
      className={`transition-all duration-700 ease-in-out ${
        isLoaded 
          ? 'blur-0 opacity-100' 
          : 'blur-md opacity-90'
      }`}
    >
      {children}
    </div>
  )
} 