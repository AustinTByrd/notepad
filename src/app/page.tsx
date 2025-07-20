import { redirect } from 'next/navigation'
import { generateMemorableSlug } from '@/lib/utils'

export default function Home() {
  // Generate a memorable slug and redirect to it
  const memorableSlug = generateMemorableSlug()
  redirect(`/${memorableSlug}`)
}
