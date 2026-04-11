import { google } from 'googleapis';
import { prisma } from '../db/prisma';

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/social/callback/youtube`
);
 
export function getYouTubeAuthUrl(userId: string): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    state: userId,
    prompt: 'consent',
  });
}
 
export async function handleYouTubeCallback(code: string, userId: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
 
  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
  const channelRes = await youtube.channels.list({ part: ['snippet', 'statistics'], mine: true });
  const channel = channelRes.data.items?.[0];
 
  await prisma.socialAccount.upsert({
    where: { userId_platform_platformUserId: { userId, platform: 'youtube', platformUserId: channel?.id ?? '' } },
    create: {
      userId,
      platform: 'youtube',
      platformUserId: channel?.id ?? '',
      username: channel?.snippet?.title ?? '',
      displayName: channel?.snippet?.title ?? '',
      profileImageUrl: channel?.snippet?.thumbnails?.default?.url ?? '',
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token ?? undefined,
      tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      followers: parseInt(channel?.statistics?.subscriberCount ?? '0', 10) || 0,
    },
    update: {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token ?? undefined,
      tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      isActive: true,
    },
  });
}
 
export async function uploadYouTubeVideo(params: {
  socialAccountId: string;
  videoUrl: string;
  title: string;
  description: string;
  tags?: string[];
  privacyStatus?: 'public' | 'private' | 'unlisted';
}): Promise<string> {
  const account = await prisma.socialAccount.findUnique({ where: { id: params.socialAccountId } });
  if (!account) throw new Error('Social account not found');
 
  oauth2Client.setCredentials({ access_token: account.accessToken, refresh_token: account.refreshToken ?? undefined });
 
  // Fetch the video buffer from FAL CDN
  const response = await fetch(params.videoUrl);
  const buffer = await response.arrayBuffer();
 
  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
 
  const uploadRes = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: { title: params.title, description: params.description, tags: params.tags ?? [] },
      status: { privacyStatus: params.privacyStatus ?? 'public' },
    },
    media: {
      mimeType: 'video/mp4',
      body: Buffer.from(buffer) as unknown as NodeJS.ReadableStream,
    },
  });
 
  return uploadRes.data.id!;
}