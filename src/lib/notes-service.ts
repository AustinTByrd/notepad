import { createClient } from './supabase'
import { themes } from './themes'
import type { Database, TiptapContent } from './database.types'

type Note = Database['public']['Tables']['notes']['Row']

const getRandomTheme = () => {
  const themeNames = themes.map(theme => theme.name)
  return themeNames[Math.floor(Math.random() * themeNames.length)]
}

// Default Tiptap content structure for new notes
const getDefaultContent = (): TiptapContent => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: []
    }
  ]
})

export class NotesService {
  private supabase = createClient()

  async getNote(slug: string): Promise<Note | null> {
    try {
      const { data, error } = await this.supabase
        .from('notes')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        return null
      }

      return data
    } catch (err) {
      // Catch any network or other errors
      return null
    }
  }

  async createNote(slug: string): Promise<Note> {
    const theme = getRandomTheme()
    const now = new Date().toISOString()

    try {
      const { data, error } = await this.supabase
        .from('notes')
        .insert({
          slug,
          content: getDefaultContent(),
          theme,
          created_at: now,
          updated_at: now,
          last_accessed: now,
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create note: ${error.message}`)
      }

      if (!data) {
        throw new Error('No data returned after creating note')
      }

      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create note')
    }
  }

  async updateNote(slug: string, content: TiptapContent): Promise<Note> {
    const now = new Date().toISOString()

    try {
      const { data, error } = await this.supabase
        .from('notes')
        .update({
          content,
          updated_at: now,
          last_accessed: now,
        })
        .eq('slug', slug)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update note: ${error.message}`)
      }

      if (!data) {
        throw new Error('No data returned after updating note')
      }

      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update note')
    }
  }

  async updateLastAccessed(slug: string): Promise<void> {
    const now = new Date().toISOString()

    try {
      const { error } = await this.supabase
        .from('notes')
        .update({ last_accessed: now })
        .eq('slug', slug)

      if (error) {
        // Don't throw for last_accessed updates - it's not critical
      }
    } catch (err) {
      // Don't throw for last_accessed updates - it's not critical
    }
  }

  async updateTheme(slug: string, theme: string): Promise<Note | null> {
    const now = new Date().toISOString()

    try {
      const { data, error } = await this.supabase
        .from('notes')
        .update({ 
          theme,
          updated_at: now 
        })
        .eq('slug', slug)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update note theme: ${error.message}`)
      }

      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update note theme')
    }
  }
} 