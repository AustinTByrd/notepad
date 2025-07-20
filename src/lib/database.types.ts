// Type for Tiptap editor content
export interface TiptapContent {
  type: string
  content?: TiptapContent[]
  text?: string
  marks?: Array<{
    type: string
    attrs?: Record<string, unknown>
  }>
  attrs?: Record<string, unknown>
}

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          slug: string
          content: TiptapContent | null
          theme: string
          created_at: string
          updated_at: string
          last_accessed: string
        }
        Insert: {
          id?: string
          slug: string
          content?: TiptapContent | null
          theme: string
          created_at?: string
          updated_at?: string
          last_accessed?: string
        }
        Update: {
          id?: string
          slug?: string
          content?: TiptapContent | null
          theme?: string
          created_at?: string
          updated_at?: string
          last_accessed?: string
        }
      }
    }
  }
} 