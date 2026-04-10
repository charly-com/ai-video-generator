// src/app/api/auth/social/callback/[platform]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { OAUTH_CONFIGS } from '@/auth'
import type { SocialPlatform } from '@/types'

interface OAuthTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type: string
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const state = searchParams.get('state')

  if (error) {
    console.error(`[OAuth] ${platform} error:`, error)
    return NextResponse.redirect(
      new URL(`/dashboard/social?error=${encodeURIComponent(error)}`, req.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard/social?error=no_code', req.url))
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(platform as SocialPlatform, code, req)

    // Fetch platform user info
    const userInfo = await getPlatformUserInfo(platform as SocialPlatform, tokens.access_token)

    // Check account limit for user's plan
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })
    const accountLimit = getAccountLimit(subscription?.plan ?? 'free')
    const existingCount = await prisma.socialAccount.count({
      where: { userId: session.user.id, isActive: true },
    })

    if (existingCount >= accountLimit) {
      return NextResponse.redirect(
        new URL(`/dashboard/social?error=account_limit&limit=${accountLimit}`, req.url)
      )
    }

    // Encrypt tokens before storing (use your encryption util)
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : undefined

    await prisma.socialAccount.upsert({
      where: {
        userId_platform_platformUserId: {
          userId: session.user.id,
          platform,
          platformUserId: userInfo.id,
        },
      },
      create: {
        userId: session.user.id,
        platform,
        platformUserId: userInfo.id,
        username: userInfo.username,
        displayName: userInfo.displayName,
        profileImageUrl: userInfo.profileImageUrl,
        accessToken: tokens.access_token, // TODO: encrypt in production
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: expiresAt,
        followers: userInfo.followers,
        isActive: true,
      },
      update: {
        username: userInfo.username,
        displayName: userInfo.displayName,
        profileImageUrl: userInfo.profileImageUrl,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: expiresAt,
        followers: userInfo.followers,
        isActive: true,
      },
    })

    return NextResponse.redirect(
      new URL(`/dashboard/social?connected=${platform}`, req.url)
    )
  } catch (error) {
    console.error(`[OAuth] ${platform} callback error:`, error)
    return NextResponse.redirect(
      new URL(`/dashboard/social?error=connection_failed`, req.url)
    )
  }
}

// ─── Token Exchange ───────────────────────────────────────────────────────────

async function exchangeCodeForTokens(
  platform: SocialPlatform,
  code: string,
  req: NextRequest
): Promise<OAuthTokenResponse> {
  const config = OAUTH_CONFIGS[platform]

  const clientSecrets: Record<SocialPlatform, string> = {
    youtube: process.env.GOOGLE_CLIENT_SECRET!,
    instagram: process.env.META_APP_SECRET!,
    twitter: process.env.TWITTER_CLIENT_SECRET!,
    tiktok: process.env.TIKTOK_CLIENT_SECRET!,
    linkedin: process.env.LINKEDIN_CLIENT_SECRET!,
    facebook: process.env.META_APP_SECRET!,
  }

  const clientIds: Record<SocialPlatform, string> = {
    youtube: process.env.GOOGLE_CLIENT_ID!,
    instagram: process.env.META_APP_ID!,
    twitter: process.env.TWITTER_CLIENT_ID!,
    tiktok: process.env.TIKTOK_CLIENT_KEY!,
    linkedin: process.env.LINKEDIN_CLIENT_ID!,
    facebook: process.env.META_APP_ID!,
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/social/callback/${platform}`,
    client_id: clientIds[platform],
    client_secret: clientSecrets[platform],
  })

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Token exchange failed for ${platform}: ${err}`)
  }

  return response.json()
}

// ─── User Info Fetchers ───────────────────────────────────────────────────────

interface PlatformUserInfo {
  id: string
  username: string
  displayName: string
  profileImageUrl?: string
  followers?: number
}

async function getPlatformUserInfo(
  platform: SocialPlatform,
  accessToken: string
): Promise<PlatformUserInfo> {
  switch (platform) {
    case 'youtube': {
      const res = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const data = await res.json()
      const channel = data.items?.[0]
      return {
        id: channel?.id,
        username: channel?.snippet?.customUrl ?? channel?.id,
        displayName: channel?.snippet?.title,
        profileImageUrl: channel?.snippet?.thumbnails?.default?.url,
        followers: parseInt(channel?.statistics?.subscriberCount ?? '0'),
      }
    }

    case 'instagram': {
      const res = await fetch(
        `https://graph.instagram.com/me?fields=id,username,name,profile_picture_url,followers_count&access_token=${accessToken}`
      )
      const data = await res.json()
      return {
        id: data.id,
        username: data.username,
        displayName: data.name,
        profileImageUrl: data.profile_picture_url,
        followers: data.followers_count,
      }
    }

    case 'twitter': {
      const res = await fetch(
        'https://api.twitter.com/2/users/me?user.fields=profile_image_url,public_metrics',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const { data } = await res.json()
      return {
        id: data.id,
        username: data.username,
        displayName: data.name,
        profileImageUrl: data.profile_image_url,
        followers: data.public_metrics?.followers_count,
      }
    }

    case 'tiktok': {
      const res = await fetch(
        'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,follower_count',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const { data } = await res.json()
      return {
        id: data.user?.open_id,
        username: data.user?.display_name,
        displayName: data.user?.display_name,
        profileImageUrl: data.user?.avatar_url,
        followers: data.user?.follower_count,
      }
    }

    case 'linkedin': {
      const res = await fetch('https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture)', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await res.json()
      return {
        id: data.id,
        username: data.id,
        displayName: `${data.localizedFirstName} ${data.localizedLastName}`,
        profileImageUrl: data.profilePicture?.displayImage,
      }
    }

    case 'facebook': {
      const res = await fetch(
        `https://graph.facebook.com/me?fields=id,name,picture&access_token=${accessToken}`
      )
      const data = await res.json()
      return {
        id: data.id,
        username: data.id,
        displayName: data.name,
        profileImageUrl: data.picture?.data?.url,
      }
    }
  }
}

function getAccountLimit(plan: string): number {
  const limits: Record<string, number> = {
    free: 2,
    basic: 5,
    pro: 15,
    agency: 999,
  }
  return limits[plan] ?? 2
}
