import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { NotesService } from '@/lib/notes-service'
import { extractTitleFromTiptapContent, extractTextFromTiptapContent } from '@/lib/utils'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return new ImageResponse(
        (
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            <div
              style={{
                fontSize: 120,
                fontWeight: 700,
                color: 'white',
                textAlign: 'center',
                marginBottom: 40,
              }}
            >
              Super Cute Notes
            </div>
            <div
              style={{
                fontSize: 32,
                color: 'rgba(255,255,255,0.8)',
                textAlign: 'center',
                maxWidth: 800,
              }}
            >
              Fast, Simple Note Taking
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      )
    }

    // Fetch the note
    const notesService = new NotesService()
    const note = await notesService.getNote(slug)

    if (!note || !note.content) {
      return new ImageResponse(
        (
          <div
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            <div
              style={{
                fontSize: 80,
                fontWeight: 600,
                color: 'white',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              {slug}
            </div>
            <div
              style={{
                fontSize: 28,
                color: 'rgba(255,255,255,0.8)',
                textAlign: 'center',
              }}
            >
              New Note · Super Cute Notes
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      )
    }

    const title = extractTitleFromTiptapContent(note.content) || slug
    const content = extractTextFromTiptapContent(note.content)
    const preview = content.length > 200 ? content.substring(0, 200) + '...' : content

    return new ImageResponse(
      (
        <div
          style={{
            background: '#4A1C51',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            fontFamily: 'system-ui, sans-serif',
            padding: 80,
          }}
        >
          <div
            style={{
              background: '#F9F5FA',
              borderRadius: 24,
              padding: 60,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: '#4A1C51',
                marginBottom: 30,
                lineHeight: 1.2,
                overflow: 'hidden',
              }}
            >
              {title}
            </div>
            {preview && (
              <div
                style={{
                  fontSize: 28,
                  color: '#4A1C51',
                  lineHeight: 1.4,
                  marginBottom: 40,
                  overflow: 'hidden',
                }}
              >
                {preview}
              </div>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'auto',
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  color: '#4A1C51',
                  fontWeight: 600,
                }}
              >
                Super Cute Notes
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: '#4A1C51',
                }}
              >
                {new Date(note.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              marginBottom: 40,
            }}
          >
            Super Cute Notes
          </div>
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
            }}
          >
            Fast, Simple Note Taking
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}
