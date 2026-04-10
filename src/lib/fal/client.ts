// src/lib/fal/client.ts

import { fal } from '@fal-ai/client'
import type {
  GenerateVideoRequest,
  GenerateImageRequest,
  EditImageRequest,
} from '../../types';

export const FAL_MODELS = {
  FLUX_DEV: 'flux-dev',
  FLUX_SCHNELL: 'flux-schnell',
  FLUX_PRO: 'flux-pro-ultra',
  AURA_FLOW: 'flux-realism',
  IDEOGRAM: 'ideogram-v3',
} as const

// Initialize fal client — key is set via FAL_KEY env var automatically
fal.config({
  credentials: process.env.FAL_KEY!,
})

// ─── Types from fal.ai ────────────────────────────────────────────────────────

interface FalVideoResult {
  video: { url: string; content_type: string; file_size: number }
}

interface FalImageResult {
  images: Array<{ url: string; width: number; height: number; content_type: string }>
  seed?: number
}

interface FalAuraSRResult {
  image: { url: string; width: number; height: number }
}

interface FalRembgResult {
  image: { url: string }
}

// ─── Video Generation ─────────────────────────────────────────────────────────

export async function generateVideo(req: GenerateVideoRequest) {
  const modelEndpoints: Record<string, string> = {
    'minimax-video-01': 'fal-ai/minimax-video/image-to-video',
    'kling-video-v2-master': 'fal-ai/kling-video/v2/master/image-to-video',
    'wan-pro': 'fal-ai/wan/v2.2/1080p',
    'luma-dream-machine': 'fal-ai/luma-dream-machine',
  }

  const endpoint = modelEndpoints[req.model]
  if (!endpoint) throw new Error(`Unknown model: ${req.model}`)

  const input = buildVideoInput(req)

  const result = await fal.subscribe(endpoint, {
    input,
    logs: true,
    onQueueUpdate(update) {
      if (update.status === 'IN_PROGRESS') {
        console.log('[fal] Video generation in progress:', update.logs?.map(l => l.message))
      }
    },
  }) as unknown as { data: FalVideoResult; requestId: string }

  return {
    fileUrl: result.data.video.url,
    falRequestId: result.requestId,
  }
}

function buildVideoInput(req: GenerateVideoRequest) {
  const base = {
    prompt: req.prompt,
    negative_prompt: req.negativePrompt,
    seed: req.seed,
  }

  if (req.model === 'minimax-video-01' || req.model === 'kling-video-v2-master') {
    return {
      ...base,
      image_url: req.imageUrl,
      duration: req.duration,
      aspect_ratio: req.aspectRatio,
    }
  }

  if (req.model === 'wan-pro') {
    return {
      ...base,
      image_url: req.imageUrl,
      num_frames: req.duration * 24, // 24fps
      aspect_ratio: req.aspectRatio,
      resolution: '1080p',
    }
  }

  if (req.model === 'luma-dream-machine') {
    return {
      ...base,
      image_url: req.imageUrl,
      duration: `${req.duration}s` as '5s',
      aspect_ratio: req.aspectRatio,
    }
  }

  return { ...base, image_url: req.imageUrl }
}

// ─── Image Generation ─────────────────────────────────────────────────────────

export async function generateImage(req: GenerateImageRequest) {
  const modelEndpoints: Record<string, string> = {
    'flux-pro-ultra': 'fal-ai/flux-pro/v1.1-ultra',
    'flux-realism': 'fal-ai/flux-realism',
    'ideogram-v3': 'fal-ai/ideogram/v3',
    'recraft-v3': 'fal-ai/recraft-v3',
    'flux-dev': 'fal-ai/flux/dev',
    'flux-schnell': 'fal-ai/flux/schnell',
  }

  const endpoint = modelEndpoints[req.model]
  if (!endpoint) throw new Error(`Unknown model: ${req.model}`)

  const [width, height] = aspectRatioToDimensions(req.aspectRatio)

  const input: Record<string, unknown> = {
    prompt: req.prompt,
    num_images: req.numImages ?? 1,
    seed: req.seed,
    image_size: { width, height },
  }

  if (req.negativePrompt) input.negative_prompt = req.negativePrompt
  if (req.guidanceScale) input.guidance_scale = req.guidanceScale

  if (req.model === 'recraft-v3' && req.style) {
    input.style = req.style
  }

  const result = await fal.subscribe(endpoint, {
    input,
    logs: false,
  }) as unknown as { data: FalImageResult; requestId: string }

  return {
    images: result.data.images,
    seed: result.data.seed,
    falRequestId: result.requestId,
  }
}

// ─── Image Editing (Inpainting / Fill) ────────────────────────────────────────

export async function editImage(req: EditImageRequest) {
  const fillInput = {
    prompt: req.prompt,
    image_url: req.imageUrl,
    ...(req.mask ? { mask_url: req.mask } : {}),
    ...(req.strength ? { strength: req.strength } : {}),
  }

  const result = await (fal.subscribe as Function)('fal-ai/flux-pro/v1/fill', {
    input: fillInput,
    logs: false,
  }) as { data: FalImageResult; requestId: string }

  return {
    imageUrl: result.data.images[0]?.url,
    falRequestId: result.requestId,
  }
}

// ─── Image Upscaling ──────────────────────────────────────────────────────────

export async function upscaleImage(imageUrl: string) {
  const result = await fal.subscribe('fal-ai/aura-sr', {
    input: { image_url: imageUrl },
    logs: false,
  }) as unknown as { data: FalAuraSRResult; requestId: string }

  return {
    imageUrl: result.data.image.url,
    width: result.data.image.width,
    height: result.data.image.height,
    falRequestId: result.requestId,
  }
}

// ─── Background Removal ───────────────────────────────────────────────────────

export async function removeBackground(imageUrl: string) {
  const result = await fal.subscribe('fal-ai/imageutils/rembg', {
    input: { image_url: imageUrl },
    logs: false,
  }) as unknown as { data: FalRembgResult; requestId: string }

  return {
    imageUrl: result.data.image.url,
    falRequestId: result.requestId,
  }
}

// ─── Queue Status (for long-running jobs) ─────────────────────────────────────

export async function getQueueStatus(endpoint: string, requestId: string) {
  const status = await fal.queue.status(endpoint, {
    requestId,
    logs: true,
  })
  return status
}

export async function getQueueResult(endpoint: string, requestId: string) {
  const result = await fal.queue.result(endpoint, { requestId })
  return result
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function aspectRatioToDimensions(ratio: string): [number, number] {
  const map: Record<string, [number, number]> = {
    '16:9': [1280, 720],
    '9:16': [720, 1280],
    '1:1': [1024, 1024],
    '4:5': [820, 1024],
    '4:3': [1024, 768],
    '3:4': [768, 1024],
    '21:9': [1680, 720],
  }
  return map[ratio] ?? [1024, 1024]
}

export function estimateCost(model: string, type: 'video' | 'image'): number {
  const costs: Record<string, number> = {
    'minimax-video-01': 0.05,
    'kling-video-v2-master': 0.14,
    'wan-pro': 0.20,
    'luma-dream-machine': 0.10,
    'flux-pro-ultra': 0.006,
    'flux-realism': 0.003,
    'ideogram-v3': 0.008,
    'recraft-v3': 0.004,
  }
  return costs[model] ?? 0.01
}
