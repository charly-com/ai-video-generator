 
// ──────────────────────────────────────────────────────────────
// lib/social/instagram.ts
// ──────────────────────────────────────────────────────────────
import { prisma } from '../db/prisma';

export function getInstagramAuthUrl(userId: string): string {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/social/callback/instagram`,
    scope: 'instagram_basic,instagram_content_publish,pages_read_engagement',
    response_type: 'code',
    state: userId,
  });
  return `https://www.facebook.com/dialog/oauth?${params}`;
}
 
export async function handleInstagramCallback(code: string, userId: string) {
  // Exchange code for access token
  const tokenRes = await fetch('https://graph.facebook.com/oauth/access_token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: process.env.META_APP_ID!,
      client_secret: process.env.META_APP_SECRET!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/social/callback/instagram`,
      code,
    }),
  });
  const tokenData = await tokenRes.json() as { access_token: string; expires_in: number };
 
  // Get long-lived token
  const longTokenRes = await fetch(
    `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${tokenData.access_token}`
  );
  const longToken = await longTokenRes.json() as { access_token: string; expires_in: number };
 
  // Get Instagram user info
  const userRes = await fetch(
    `https://graph.facebook.com/me/accounts?access_token=${longToken.access_token}`
  );
  const pages = await userRes.json() as { data: Array<{ id: string; name: string; access_token: string }> };
  const page = pages.data[0];
 
  const igRes = await fetch(`https://graph.facebook.com/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`);
  const igData = await igRes.json() as { instagram_business_account?: { id: string } };
 
  const igAccountId = igData.instagram_business_account?.id;
  if (!igAccountId) throw new Error('No Instagram business account found');
 
  const igUserRes = await fetch(`https://graph.facebook.com/${igAccountId}?fields=username,profile_picture_url,followers_count&access_token=${page.access_token}`);
  const igUser = await igUserRes.json() as { username: string; profile_picture_url: string; followers_count: number };
 
  await prisma.socialAccount.upsert({
    where: { userId_platform_platformUserId: { userId, platform: 'instagram', platformUserId: igAccountId } },
    create: {
      userId,
      platform: 'instagram',
      platformUserId: igAccountId,
      username: igUser.username,
      displayName: igUser.username,
      avatarUrl: igUser.profile_picture_url,
      accessToken: page.access_token,
      tokenExpiresAt: new Date(Date.now() + longToken.expires_in * 1000),
      metadata: { followersCount: igUser.followers_count },
    },
    update: { accessToken: page.access_token, isActive: true },
  });
}
 
export async function publishInstagramMedia(params: {
  socialAccountId: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'REELS';
  caption: string;
}): Promise<string> {
  const account = await prisma.socialAccount.findUnique({ where: { id: params.socialAccountId } });
  if (!account) throw new Error('Social account not found');
 
  const igUserId = account.platformUserId;
  const token = account.accessToken;
 
  // Step 1: Create container
  const containerBody: Record<string, string> = {
    caption: params.caption,
    access_token: token,
  };
 
  if (params.mediaType === 'IMAGE') {
    containerBody.image_url = params.mediaUrl;
  } else {
    containerBody.video_url = params.mediaUrl;
    containerBody.media_type = params.mediaType;
  }
 
  const containerRes = await fetch(`https://graph.facebook.com/${igUserId}/media`, {
    method: 'POST',
    body: new URLSearchParams(containerBody),
  });
  const container = await containerRes.json() as { id: string };
 
  // Wait for video processing if needed
  if (params.mediaType !== 'IMAGE') {
    await new Promise(r => setTimeout(r, 15000));
  }
 
  // Step 2: Publish
  const publishRes = await fetch(`https://graph.facebook.com/${igUserId}/media_publish`, {
    method: 'POST',
    body: new URLSearchParams({ creation_id: container.id, access_token: token }),
  });
  const published = await publishRes.json() as { id: string };
  return published.id;
}