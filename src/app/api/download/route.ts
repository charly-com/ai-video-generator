// src/app/api/download/route.ts
//
// Streams a remote asset back to the client with Content-Disposition: attachment,
// which browsers cannot do for cross-origin URLs via the HTML `download` attribute.

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

const ALLOWED_HOSTS = new Set([
  'fal.media',
  'v3.fal.media',
  'v2.fal.media',
  'storage.googleapis.com',
  'cdn.fal.ai',
  'fal.ai',
])

function isAllowedHost(host: string): boolean {
  if (ALLOWED_HOSTS.has(host)) return true
  return Array.from(ALLOWED_HOSTS).some(allowed => host.endsWith(`.${allowed}`))
}

function guessExtension(url: string, contentType: string | null): string {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase()
  if (ext && /^[a-z0-9]{1,5}$/.test(ext)) return ext
  if (contentType?.startsWith('video/mp4')) return 'mp4'
  if (contentType?.startsWith('video/webm')) return 'webm'
  if (contentType?.startsWith('image/png')) return 'png'
  if (contentType?.startsWith('image/jpeg')) return 'jpg'
  if (contentType?.startsWith('image/webp')) return 'webp'
  if (contentType?.startsWith('audio/mpeg')) return 'mp3'
  return 'bin'
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const urlParam = searchParams.get('url')
  const nameParam = searchParams.get('name') ?? 'download'

  if (!urlParam) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(urlParam)
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
  }
  if (target.protocol !== 'https:') {
    return NextResponse.json({ error: 'Only https urls allowed' }, { status: 400 })
  }
  if (!isAllowedHost(target.hostname)) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 403 })
  }

  const upstream = await fetch(target.toString())
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: `Upstream fetch failed: ${upstream.status}` },
      { status: 502 },
    )
  }

  const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream'
  const ext = guessExtension(target.pathname, contentType)
  const safeName = nameParam.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100) || 'download'
  const filename = safeName.endsWith(`.${ext}`) ? safeName : `${safeName}.${ext}`

  const headers = new Headers()
  headers.set('Content-Type', contentType)
  headers.set('Content-Disposition', `attachment; filename="${filename}"`)
  const len = upstream.headers.get('content-length')
  if (len) headers.set('Content-Length', len)
  headers.set('Cache-Control', 'private, no-store')

  return new NextResponse(upstream.body, { status: 200, headers })
}
