import { Suspense } from 'react'
import { NoteEditor } from '@/components/note-editor'
import { LoadingSpinner } from '@/components/loading-spinner'

interface NotePageProps {
  params: Promise<{
    slug: string
  }>
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