import { useState, useEffect, useCallback, useRef } from 'react'
import { useDebounce } from './use-debounce'
import { NotesService } from '@/lib/notes-service'
import type { Database, TiptapContent } from '@/lib/database.types'

type Note = Database['public']['Tables']['notes']['Row']

// Global request tracking to persist across Fast Refresh
const globalRequestTracker = new Map<string, Promise<Note | null>>()

// Cleanup old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [slug, promise] of globalRequestTracker.entries()) {
    // Remove entries older than 30 seconds
    if (now - (promise as any).timestamp > 30000) {
      globalRequestTracker.delete(slug)
    }
  }
}, 10000) // Check every 10 seconds

export function useNote(slug: string) {
  const [note, setNote] = useState<Note | null>(null)
  const [content, setContent] = useState<TiptapContent | null>({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: []
      }
    ]
  }) // Start with empty content so editor appears immediately
  const [isLoading, setIsLoading] = useState(false) // Start with no loading state
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState('default')
  
  const notesService = useRef(new NotesService())
  const lastSavedContent = useRef<TiptapContent | null>(null)
  const loadingRef = useRef(false) // Prevent multiple simultaneous loads
  const currentSlugRef = useRef<string | null>(null) // Track the current slug being processed
  const userHasModified = useRef(false) // Track if user has actually made changes
  const debouncedContent = useDebounce(content, 800) // 2 second debounce

  // Load note on mount or when slug changes
  useEffect(() => {
    // Reset content state immediately when slug changes to prevent showing stale content
    setContent({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: []
        }
      ]
    })
    setNote(null)
    setError(null)
    userHasModified.current = false // Reset user modification flag
    
    // Set the current slug immediately
    currentSlugRef.current = slug
    
    // Check if there's already a request in progress for this slug
    if (globalRequestTracker.has(slug)) {
      return
    }
    
    // Prevent multiple simultaneous loads for the same slug
    if (loadingRef.current) {
      return
    }
    
    const loadNote = async () => {
      // Set loading flag to prevent race conditions
      loadingRef.current = true
      const currentSlug = slug // Capture current slug to check for stale requests
      
      // Create a promise for this request and store it globally
      const requestPromise = (async () => {
        try {
          // Don't set loading state - we want immediate appearance
          setError(null)
          
          let noteData = await notesService.current.getNote(currentSlug)
          
          // Check if slug changed while we were fetching - ignore stale results
          if (currentSlugRef.current !== currentSlug) {
            return null
          }
          
          if (!noteData) {
            // Create new note if it doesn't exist
            noteData = await notesService.current.createNote(currentSlug)
          } else {
            // Update last accessed time for existing notes
            await notesService.current.updateLastAccessed(currentSlug)
          }
          
          // Final check to ensure slug hasn't changed
          if (currentSlugRef.current !== currentSlug) {
            return null
          }
          
          setNote(noteData)
          setContent(noteData.content)
          lastSavedContent.current = noteData.content
          setTheme(noteData.theme)
          
          return noteData
        } catch (err) {
          // Only set error if this is still the current slug
          if (currentSlugRef.current === currentSlug) {
            setError(err instanceof Error ? err.message : 'Failed to load note')
          }
          throw err
        } finally {
          // Don't set loading to false since we never set it to true
          loadingRef.current = false
          // Remove from global tracker
          globalRequestTracker.delete(currentSlug)
        }
      })()
      
      // Add timestamp to the promise for cleanup tracking
      ;(requestPromise as any).timestamp = Date.now()
      
      // Store the promise globally
      globalRequestTracker.set(currentSlug, requestPromise)
      
      // Wait for the request to complete
      await requestPromise
    }

    loadNote()

    // Cleanup function to reset loading flag if slug changes
    return () => {
      // Only reset loading flag if we're still processing this slug
      if (loadingRef.current) {
        loadingRef.current = false
      }
      // Don't remove from global tracker here - let the request complete
    }
  }, [slug])

  // Save content when debounced value changes
  useEffect(() => {
    if (!note || !debouncedContent || !userHasModified.current) return

    // Deep comparison to check if content actually changed
    const hasContentChanged = JSON.stringify(debouncedContent) !== JSON.stringify(lastSavedContent.current)
    
    if (!hasContentChanged) return

    const saveContent = async () => {
      try {
        setIsSaving(true)
        const updatedNote = await notesService.current.updateNote(slug, debouncedContent)
        setNote(updatedNote)
        lastSavedContent.current = debouncedContent
        
        // Show saved indicator for 2 seconds
        setShowSaved(true)
        setTimeout(() => {
          setShowSaved(false)
        }, 2000)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save note')
      } finally {
        setIsSaving(false)
      }
    }

    saveContent()
  }, [debouncedContent, note, slug])

  const updateContent = useCallback((newContent: TiptapContent) => {
    setContent(newContent)
    userHasModified.current = true // Mark that user has made changes
    setError(null) // Clear any previous errors when user starts typing
  }, [])

  const updateTheme = useCallback(async (newTheme: string) => {
    if (!note) return

    try {
      const updatedNote = await notesService.current.updateTheme(slug, newTheme)
      if (updatedNote) {
        setNote(updatedNote)
        setTheme(newTheme)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update theme')
    }
  }, [note, slug])

  return {
    note,
    content,
    theme,
    isLoading,
    isSaving,
    showSaved,
    error,
    updateContent,
    updateTheme,
  }
} 