'use client'

import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeSelector } from "@/components/theme-selector"
import { useNote } from "@/hooks/use-note"
import { useFontLoading } from "@/hooks/use-font-loading"
import { useTheme } from "@/lib/themes"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { TiptapContent } from "@/lib/database.types"
import { generateMemorableSlug } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface NoteEditorProps {
  slug: string
}

export function NoteEditor({ slug }: NoteEditorProps) {
  const { content, theme, isLoading, showSaved, error, updateContent, updateTheme } = useNote(slug)
  const { setTheme, currentTheme } = useTheme()
  const { fontsLoaded } = useFontLoading()
  const router = useRouter()
  const [isCreatingNew, setIsCreatingNew] = useState(false) // Prevent rapid clicks
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showCopied, setShowCopied] = useState(false)
  const lastAppliedTheme = useRef<string | null>(null)
  
  // Initialize lastAppliedTheme with current theme to prevent unnecessary updates
  useEffect(() => {
    if (currentTheme && !lastAppliedTheme.current) {
      lastAppliedTheme.current = currentTheme
    }
  }, [currentTheme])

  // Configure Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure basic rich text features
        bold: {
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        italic: {
          HTMLAttributes: {
            class: 'italic',
          },
        },
        strike: {
          HTMLAttributes: {
            class: 'line-through',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'bg-muted px-1 py-0.5 rounded text-sm font-mono',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-muted p-4 rounded-lg font-mono text-sm my-4',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-muted-foreground/20 pl-4 my-4 italic',
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'my-2',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'my-1',
          },
        },
      }),
    ],
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: []
        }
      ]
    }, // Always start with empty content - will be updated by useEffect
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      updateContent(json as TiptapContent)
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        // Add keyboard shortcuts for lists
        if (event.key === '-' && event.ctrlKey) {
          event.preventDefault()
          editor?.chain().focus().toggleBulletList().run()
          return true
        }
        return false
      },
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-96 p-4 border rounded-lg bg-background text-foreground border-border max-w-none',
      },
    },
    immediatelyRender: false,
  }, []) // Don't recreate editor when slug changes - handle content updates in useEffect

  // Update editor content when note content changes
  useEffect(() => {
    if (!editor || !content) return
    
    setIsTransitioning(true)
    
    const currentEditorContent = editor.getJSON()
    const contentChanged = JSON.stringify(currentEditorContent) !== JSON.stringify(content)
    
    if (contentChanged) {
      // Small delay to ensure editor is fully ready
      const timer = setTimeout(() => {
        editor.commands.setContent(content, { emitUpdate: false })
        setIsTransitioning(false)
      }, 10)
      
      return () => clearTimeout(timer)
    } else {
      setIsTransitioning(false)
    }
  }, [editor, content, slug])

  // Apply the note's theme when it loads (only if different from current)
  useEffect(() => {
    if (theme && theme !== lastAppliedTheme.current && !isLoading) {
      setTheme(theme)
      lastAppliedTheme.current = theme
    }
  }, [theme, setTheme, isLoading])

  // Auto-focus the editor when it's ready and the note is empty
  useEffect(() => {
    if (editor && !isLoading && content && (!editor.getText().trim())) {
      // Small delay to ensure the editor is fully rendered and content is loaded
      const timer = setTimeout(() => {
        editor.commands.focus()
      }, 150)
      
      return () => clearTimeout(timer)
    }
  }, [editor, content, isLoading])

  const createNewNote = () => {
    // Prevent rapid clicks
    if (isCreatingNew) {
      return
    }
    
    setIsCreatingNew(true)
    const memorableSlug = generateMemorableSlug()
    
    // Small delay to ensure the transition is visible
    setTimeout(() => {
      router.push(`/${memorableSlug}`)
    }, 50)
    
    // Reset the flag after the transition completes
    setTimeout(() => {
      setIsCreatingNew(false)
    }, 1200)
  }

  if (isLoading || !fontsLoaded) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    )
  }

  return (
    <>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-[600px] pb-20 sm:pb-0">
        <div className="w-full">
          {/* Editor Content */}
          <div className="relative">
            <EditorContent 
              editor={editor} 
              className="w-full rounded-b-lg [&_.ProseMirror]:min-h-96 [&_.ProseMirror]:outline-none"
            />
            {!editor?.getText() && !isLoading && !isTransitioning && (
                          <div className="absolute top-4 left-4 text-muted-foreground/50 pointer-events-none">
              What&apos;s on your mind...
            </div>
            )}
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 min-h-[20px]">
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  showSaved 
                    ? 'opacity-80 transform translate-y-0' 
                    : 'opacity-0 transform -translate-y-1 pointer-events-none'
                }`}
              >
                <span>Saved</span>
              </div>
            </div>
            
            {error && (
              <span className="text-destructive">Error: {error}</span>
            )}
          </div>
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-[24px] items-center justify-center w-fit cursor-default">
        <div className="flex items-center gap-1">
          <ThemeSelector updateTheme={updateTheme} />
          <ThemeToggle />
        </div>
        <div className="w-px h-4 bg-border"></div>
        <div className="relative">
          <button
            onClick={() => {
              const url = `${window.location.origin}/${slug}`
              navigator.clipboard.writeText(url)
              setShowCopied(true)
              setTimeout(() => setShowCopied(false), 2000)
            }}
            className="cursor-pointer transition-all duration-200 active:scale-95"
          >
            <Badge variant="outline" className="text-xs text-muted-foreground hover:text-foreground px-2.5 py-1 cursor-default">
              {slug}
            </Badge>
          </button>
          <div
            className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground transition-all duration-300 ${
              showCopied 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-1 pointer-events-none'
            }`}
          >
            Copied!
          </div>
        </div>
        <button
          onClick={createNewNote}
          disabled={isCreatingNew}
          className={`text-sm transition-all duration-200 active:scale-95 whitespace-nowrap ${
            isCreatingNew 
              ? 'text-foreground/50' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          New
        </button>
      </footer>
    </>
  )
} 