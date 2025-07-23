import { Suspense } from 'react'
import type { Metadata } from 'next'
import { NoteEditor } from '@/components/note-editor'
import { LoadingSpinner } from '@/components/loading-spinner'
import { NotesService } from '@/lib/notes-service'
import { extractTitleFromTiptapContent, createDescriptionFromTiptapContent } from '@/lib/utils'

interface NotePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params
  
  // Fetch the note to generate metadata
  const notesService = new NotesService()
  const note = await notesService.getNote(slug)
  
  if (!note || !note.content) {
    return {
      title: `${slug} | Notepad`,
      description: 'A note created with Notepad - Fast, beautiful note taking.',
      robots: {
        index: false, // Don't index empty notes
        follow: true,
      },
    }
  }
  
  const title = extractTitleFromTiptapContent(note.content)
  const description = createDescriptionFromTiptapContent(note.content)
  const noteTitle = title || `Note: ${slug}`
  
  return {
    title: noteTitle,
    description: description,
    keywords: ["note", "notepad", "writing", slug],
    authors: [{ name: "Notepad User" }],
    openGraph: {
      title: noteTitle,
      description: description,
      type: "article",
      url: `https://notepad.app/${slug}`,
      siteName: "Notepad",
      images: [
        {
          url: `/api/og?slug=${encodeURIComponent(slug)}`,
          width: 1200,
          height: 630,
          alt: noteTitle,
        },
      ],
      publishedTime: note.created_at,
      modifiedTime: note.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: noteTitle,
      description: description,
      images: [`/api/og?slug=${encodeURIComponent(slug)}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={<LoadingSpinner />}>
        <NoteEditor slug={slug} />
      </Suspense>
    </div>
  )
} 