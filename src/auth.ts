// src/auth.ts

import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import Twitter from 'next-auth/providers/twitter'
import { prisma } from '../lib/db/prisma';
import type { SocialPlatform } from '../types'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request YouTube upload scope
          scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtube.readonly',
          ].join(' '),
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      return session
    },
    async signIn({ user, account }) {
      // Auto-create free subscription on first sign in
      if (account?.type === 'oauth') {
        const existing = await prisma.subscription.findUnique({
          where: { userId: user.id! },
        })
        if (!existing) {
          const now = new Date()
          const end = new Date(now)
          end.setMonth(end.getMonth() + 1)

          await prisma.subscription.create({
            data: {
              userId: user.id!,
              plan: 'free',
              billingCycle: 'monthly',
              status: 'active',
              currentPeriodStart: now,
              currentPeriodEnd: end,
            },
          })

          await prisma.usageRecord.create({
            data: {
              userId: user.id!,
              videosUsed: 0,
              imagesUsed: 0,
              periodStart: now,
              periodEnd: end,
            },
          })
        }
      }
      return true
    },
  },
})

// ─── OAuth for Social Platforms (separate from auth login) ───────────────────

export const OAUTH_CONFIGS: Record<
  SocialPlatform,
  { authUrl: string; tokenUrl: string; scopes: string[] }
> = {
  youtube: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
    ],
  },
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list'],
  },
  twitter: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'media.write', 'offline.access'],
  },
  tiktok: {
    authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    scopes: ['user.info.basic', 'video.upload', 'video.publish'],
  },
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['pages_manage_posts', 'pages_read_engagement', 'publish_video'],
  },
}

export function buildOAuthUrl(platform: SocialPlatform, state: string): string {
  const config = OAUTH_CONFIGS[platform]
  const clientIds: Record<SocialPlatform, string> = {
    youtube: process.env.GOOGLE_CLIENT_ID!,
    instagram: process.env.META_APP_ID!,
    twitter: process.env.TWITTER_CLIENT_ID!,
    tiktok: process.env.TIKTOK_CLIENT_KEY!,
    linkedin: process.env.LINKEDIN_CLIENT_ID!,
    facebook: process.env.META_APP_ID!,
  }

  const params = new URLSearchParams({
    client_id: clientIds[platform],
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/social/callback/${platform}`,
    scope: config.scopes.join(' '),
    response_type: 'code',
    state,
  })

  if (platform === 'youtube') {
    params.set('access_type', 'offline')
    params.set('prompt', 'consent')
  }

  if (platform === 'twitter') {
    params.set('code_challenge', state)
    params.set('code_challenge_method', 'plain')
  }

  return `${config.authUrl}?${params.toString()}`
}