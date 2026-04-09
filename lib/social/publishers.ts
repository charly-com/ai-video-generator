// src/lib/social/publishers.ts

import type { SocialAccount, SocialPlatform } from  '../../types';

// ─── YouTube Publisher ────────────────────────────────────────────────────────

interface YouTubeUploadOptions {
  title: string
  description: string
  tags: string[]
  categoryId: string
  privacyStatus: 'public' | 'private' | 'unlisted'
  videoUrl: string
  thumbnailUrl?: string
}

export async function uploadToYouTube(
  account: SocialAccount,
  options: YouTubeUploadOptions
): Promise<{ videoId: string; url: string }> {
  // Step 1: Fetch the video file as buffer
  const videoResponse = await fetch(options.videoUrl)
  const videoBuffer = await videoResponse.arrayBuffer()

  // Step 2: Initialize resumable upload
  const initResponse = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': 'video/mp4',
        'X-Upload-Content-Length': videoBuffer.byteLength.toString(),
      },
      body: JSON.stringify({
        snippet: {
          title: options.title,
          description: options.description,
          tags: options.tags,
          categoryId: options.categoryId ?? '22', // People & Blogs
        },
        status: {
          privacyStatus: options.privacyStatus,
          selfDeclaredMadeForKids: false,
        },
      }),
    }
  )

  if (!initResponse.ok) {
    const err = await initResponse.text()
    throw new Error(`YouTube upload init failed: ${err}`)
  }

  const uploadUrl = initResponse.headers.get('Location')
  if (!uploadUrl) throw new Error('No upload URL from YouTube')

  // Step 3: Upload video bytes
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': videoBuffer.byteLength.toString(),
    },
    body: videoBuffer,
  })

  if (!uploadResponse.ok && uploadResponse.status !== 201) {
    throw new Error(`YouTube video upload failed: ${uploadResponse.status}`)
  }

  const uploadResult = await uploadResponse.json()
  const videoId: string = uploadResult.id

  // Step 4: Set thumbnail if provided
  if (options.thumbnailUrl && videoId) {
    await setYouTubeThumbnail(account.accessToken, videoId, options.thumbnailUrl)
  }

  return {
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
  }
}

async function setYouTubeThumbnail(
  accessToken: string,
  videoId: string,
  thumbnailUrl: string
): Promise<void> {
  const thumbResponse = await fetch(thumbnailUrl)
  const thumbBuffer = await thumbResponse.arrayBuffer()

  await fetch(
    `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${videoId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'image/jpeg',
      },
      body: thumbBuffer,
    }
  )
}

// ─── Instagram Publisher ──────────────────────────────────────────────────────

interface InstagramPublishOptions {
  caption: string
  mediaUrl: string
  mediaType: 'IMAGE' | 'VIDEO' | 'REELS'
  locationId?: string
}

export async function publishToInstagram(
  account: SocialAccount,
  options: InstagramPublishOptions
): Promise<{ postId: string; url: string }> {
  const baseUrl = 'https://graph.instagram.com/v21.0'

  // Step 1: Create media container
  const containerParams = new URLSearchParams({
    access_token: account.accessToken,
    caption: options.caption,
  })

  if (options.mediaType === 'IMAGE') {
    containerParams.set('image_url', options.mediaUrl)
  } else {
    containerParams.set('video_url', options.mediaUrl)
    containerParams.set('media_type', 'REELS')
  }

  if (options.locationId) {
    containerParams.set('location_id', options.locationId)
  }

  const containerResponse = await fetch(
    `${baseUrl}/${account.platformUserId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: containerParams.toString(),
    }
  )

  if (!containerResponse.ok) {
    const err = await containerResponse.json()
    throw new Error(`Instagram container creation failed: ${JSON.stringify(err)}`)
  }

  const { id: containerId } = await containerResponse.json()

  // Step 2: Poll for video processing (videos take time)
  if (options.mediaType !== 'IMAGE') {
    await pollInstagramContainer(account.accessToken, containerId, baseUrl)
  }

  // Step 3: Publish the container
  const publishResponse = await fetch(
    `${baseUrl}/${account.platformUserId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        access_token: account.accessToken,
        creation_id: containerId,
      }).toString(),
    }
  )

  if (!publishResponse.ok) {
    const err = await publishResponse.json()
    throw new Error(`Instagram publish failed: ${JSON.stringify(err)}`)
  }

  const { id: postId } = await publishResponse.json()

  return {
    postId,
    url: `https://www.instagram.com/p/${postId}/`,
  }
}

async function pollInstagramContainer(
  accessToken: string,
  containerId: string,
  baseUrl: string,
  maxAttempts = 30
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(
      `${baseUrl}/${containerId}?fields=status_code&access_token=${accessToken}`
    )
    const { status_code } = await response.json()

    if (status_code === 'FINISHED') return
    if (status_code === 'ERROR') throw new Error('Instagram video processing failed')

    await new Promise(r => setTimeout(r, 5000)) // poll every 5s
  }
  throw new Error('Instagram video processing timeout')
}

// ─── Twitter/X Publisher ──────────────────────────────────────────────────────

interface TwitterPublishOptions {
  text: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
}

export async function publishToTwitter(
  account: SocialAccount,
  options: TwitterPublishOptions
): Promise<{ tweetId: string; url: string }> {
  let mediaId: string | undefined

  // Step 1: Upload media if provided
  if (options.mediaUrl && options.mediaType) {
    mediaId = await uploadTwitterMedia(
      account.accessToken,
      options.mediaUrl,
      options.mediaType
    )
  }

  // Step 2: Create tweet
  const body: Record<string, unknown> = { text: options.text }
  if (mediaId) {
    body.media = { media_ids: [mediaId] }
  }

  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${account.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(`Twitter post failed: ${JSON.stringify(err)}`)
  }

  const { data } = await response.json()

  return {
    tweetId: data.id,
    url: `https://twitter.com/i/web/status/${data.id}`,
  }
}

async function uploadTwitterMedia(
  accessToken: string,
  mediaUrl: string,
  mediaType: 'image' | 'video'
): Promise<string> {
  const mediaResponse = await fetch(mediaUrl)
  const mediaBuffer = await mediaResponse.arrayBuffer()
  const mediaBytes = Buffer.from(mediaBuffer)

  const mimeType = mediaType === 'video' ? 'video/mp4' : 'image/jpeg'

  // INIT
  const initResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      command: 'INIT',
      total_bytes: mediaBytes.length.toString(),
      media_type: mimeType,
      media_category: mediaType === 'video' ? 'tweet_video' : 'tweet_image',
    }).toString(),
  })

  const { media_id_string } = await initResponse.json()

  // APPEND (chunk if needed, simplified here)
  const formData = new FormData()
  formData.append('command', 'APPEND')
  formData.append('media_id', media_id_string)
  formData.append('segment_index', '0')
  formData.append('media', new Blob([mediaBytes], { type: mimeType }))

  await fetch('https://upload.twitter.com/1.1/media/upload.json', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  })

  // FINALIZE
  await fetch('https://upload.twitter.com/1.1/media/upload.json', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      command: 'FINALIZE',
      media_id: media_id_string,
    }).toString(),
  })

  return media_id_string
}

// ─── TikTok Publisher ─────────────────────────────────────────────────────────

interface TikTokPublishOptions {
  title: string
  videoUrl: string
  privacyLevel?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY'
  disableDuet?: boolean
  disableComment?: boolean
  disableStitch?: boolean
}

export async function publishToTikTok(
  account: SocialAccount,
  options: TikTokPublishOptions
): Promise<{ shareId: string }> {
  // Step 1: Initialize video upload
  const initResponse = await fetch(
    'https://open.tiktokapis.com/v2/post/publish/video/init/',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        post_info: {
          title: options.title,
          privacy_level: options.privacyLevel ?? 'PUBLIC_TO_EVERYONE',
          disable_duet: options.disableDuet ?? false,
          disable_comment: options.disableComment ?? false,
          disable_stitch: options.disableStitch ?? false,
          video_cover_timestamp_ms: 1000,
        },
        source_info: {
          source: 'PULL_FROM_URL',
          video_url: options.videoUrl,
        },
      }),
    }
  )

  if (!initResponse.ok) {
    const err = await initResponse.json()
    throw new Error(`TikTok upload failed: ${JSON.stringify(err)}`)
  }

  const { data } = await initResponse.json()

  return { shareId: data.publish_id }
}

// ─── LinkedIn Publisher ───────────────────────────────────────────────────────

interface LinkedInPublishOptions {
  text: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
}

export async function publishToLinkedIn(
  account: SocialAccount,
  options: LinkedInPublishOptions
): Promise<{ postId: string }> {
  const body: Record<string, unknown> = {
    author: `urn:li:person:${account.platformUserId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: options.text },
        shareMediaCategory: options.mediaUrl ? 'IMAGE' : 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  }

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${account.accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(`LinkedIn post failed: ${JSON.stringify(err)}`)
  }

  const result = await response.json()
  return { postId: result.id }
}

// ─── Platform Router ──────────────────────────────────────────────────────────

export async function publishToplatform(
  platform: SocialPlatform,
  account: SocialAccount,
  payload: {
    caption: string
    mediaUrl: string
    mediaType: 'image' | 'video'
    options?: Record<string, unknown>
  }
): Promise<{ platformPostId: string; url?: string }> {
  switch (platform) {
    case 'youtube': {
      const opts = payload.options as unknown as YouTubeUploadOptions
      const result = await uploadToYouTube(account, {
        ...opts,
        videoUrl: payload.mediaUrl,
      })
      return { platformPostId: result.videoId, url: result.url }
    }

    case 'instagram': {
      const result = await publishToInstagram(account, {
        caption: payload.caption,
        mediaUrl: payload.mediaUrl,
        mediaType: payload.mediaType === 'video' ? 'REELS' : 'IMAGE',
      })
      return { platformPostId: result.postId, url: result.url }
    }

    case 'twitter': {
      const result = await publishToTwitter(account, {
        text: payload.caption,
        mediaUrl: payload.mediaUrl,
        mediaType: payload.mediaType,
      })
      return { platformPostId: result.tweetId, url: result.url }
    }

    case 'tiktok': {
      const opts = (payload.options ?? {}) as Partial<TikTokPublishOptions>
      const result = await publishToTikTok(account, {
        title: opts.title ?? payload.caption.slice(0, 150),
        videoUrl: payload.mediaUrl,
        privacyLevel: opts.privacyLevel,
      })
      return { platformPostId: result.shareId }
    }

    case 'linkedin': {
      const result = await publishToLinkedIn(account, {
        text: payload.caption,
        mediaUrl: payload.mediaUrl,
        mediaType: payload.mediaType,
      })
      return { platformPostId: result.postId }
    }

    default:
      throw new Error(`Publisher not implemented for platform: ${platform}`)
  }
}