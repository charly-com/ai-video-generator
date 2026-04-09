 
// ──────────────────────────────────────────────────────────────
// lib/social/twitter.ts
// ──────────────────────────────────────────────────────────────
 
import crypto from 'crypto';
 
export function getTwitterAuthUrl(userId: string): { url: string; codeVerifier: string; state: string } {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  const state = `${userId}:${crypto.randomBytes(8).toString('hex')}`;
 
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TWITTER_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/social/callback/twitter`,
    scope: 'tweet.write media.write users.read offline.access',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
 
  return {
    url: `https://twitter.com/i/oauth2/authorize?${params}`,
    codeVerifier,
    state,
  };
}
 
export async function handleTwitterCallback(code: string, codeVerifier: string, userId: string) {
  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: process.env.TWITTER_CLIENT_ID!,
      client_secret: process.env.TWITTER_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/social/callback/twitter`,
      code_verifier: codeVerifier,
    }),
  });
 
  const tokens = await tokenRes.json() as { access_token: string; refresh_token: string; expires_in: number };
 
  const userRes = await fetch('https://api.twitter.com/2/users/me', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const userData = await userRes.json() as { data: { id: string; name: string; username: string } };
 
  await prisma.socialAccount.upsert({
    where: { userId_platform_platformUserId: { userId, platform: 'twitter', platformUserId: userData.data.id } },
    create: {
      userId,
      platform: 'twitter',
      platformUserId: userData.data.id,
      username: userData.data.username,
      displayName: userData.data.name,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
    update: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      isActive: true,
    },
  });
}
 
export async function postTweet(params: {
  socialAccountId: string;
  text: string;
  mediaUrl?: string;
}): Promise<string> {
  const account = await prisma.socialAccount.findUnique({ where: { id: params.socialAccountId } });
  if (!account) throw new Error('Social account not found');
 
  let mediaId: string | undefined;
 
  if (params.mediaUrl) {
    // Upload media first
    const mediaRes = await fetch(params.mediaUrl);
    const buffer = await mediaRes.arrayBuffer();
 
    const uploadRes = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
      method: 'POST',
      headers: { Authorization: `Bearer ${account.accessToken}`, 'Content-Type': 'application/octet-stream' },
      body: buffer,
    });
    const uploadData = await uploadRes.json() as { media_id_string: string };
    mediaId = uploadData.media_id_string;
  }
 
  const body: Record<string, unknown> = { text: params.text };
  if (mediaId) body.media = { media_ids: [mediaId] };
 
  const tweetRes = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: { Authorization: `Bearer ${account.accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const tweet = await tweetRes.json() as { data: { id: string } };
  return tweet.data.id;
}
 