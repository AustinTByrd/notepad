'use client'

import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeSelector } from "@/components/theme-selector"
import { useNote } from "@/hooks/use-note"
import { useTheme } from "@/lib/themes"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { TiptapContent } from "@/lib/database.types"
import { generateMemorableSlug } from "@/lib/utils"

interface NoteEditorProps {
  slug: string
}

export function NoteEditor({ slug }: NoteEditorProps) {
  const { content, theme, isLoading, isSaving, showSaved, error, updateContent } = useNote(slug)
  const { setTheme } = useTheme()
  const router = useRouter()
  const [isCreatingNew, setIsCreatingNew] = useState(false) // Prevent rapid clicks

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
  }, [slug]) // Recreate editor when slug changes to ensure clean state

  // Update editor content when note content changes
  useEffect(() => {
    if (!editor || !content) return
    
    const currentEditorContent = editor.getJSON()
    const contentChanged = JSON.stringify(currentEditorContent) !== JSON.stringify(content)
    
    if (contentChanged) {
      // Small delay to ensure editor is fully ready
      const timer = setTimeout(() => {
        editor.commands.setContent(content, { emitUpdate: false })
      }, 10)
      
      return () => clearTimeout(timer)
    }
  }, [editor, content, slug])

  // Apply the note's theme when it loads
  useEffect(() => {
    if (theme) {
      setTheme(theme)
    }
  }, [theme, setTheme])

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
    router.push(`/${memorableSlug}`)
    
    // Reset the flag after a short delay
    setTimeout(() => {
      setIsCreatingNew(false)
    }, 1000)
  }

  // Check for missing environment variables
  if (error && error.includes('Missing Supabase environment variables')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Setup Required</h1>
          <p className="text-muted-foreground mb-4">
            Please add your Supabase credentials to continue.
          </p>
          <div className="bg-muted p-4 rounded-lg text-left text-sm">
            <p className="mb-2">Create a <code>.env.local</code> file in your project root with:</p>
            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`}
            </pre>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    )
  }

  return (
    <>
      {/* Theme Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <ThemeSelector />
        <ThemeToggle />
      </div>
      
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-[600px]">
        <div className="w-full">
          {/* Editor Content */}
          <div className="relative">
            <EditorContent 
              editor={editor} 
              className="w-full rounded-b-lg [&_.ProseMirror]:min-h-96 [&_.ProseMirror]:outline-none"
            />
            {!editor?.getText() && (
              <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
                Start typing your notes here...
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
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <span className="text-sm text-muted-foreground">
          Note: {slug}
        </span>
        <button
          onClick={createNewNote}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          New Note
        </button>
      </footer>
    </>
  )
} 