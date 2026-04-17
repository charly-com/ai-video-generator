// ─── Pricing & Plans ─────────────────────────────────────────────────────────

export type PlanName = 'free' | 'basic' | 'pro' | 'agency'
export type BillingCycle = 'monthly' | 'yearly'
export type Currency = 'NGN'

export interface PlanLimits {
  videosPerMonth: number | null    // null = unlimited
  imagesPerMonth: number | null
  accounts: number
  storageGB: number
  teamMembers: number
  apiAccess: boolean
  whiteLabel: boolean
  priorityQueue: boolean
}

export interface PricingTier {
  name: PlanName
  displayName: string
  priceMonthly: number
  priceYearly: number
  currency: Currency
  features: string[]
  limits: PlanLimits
  popular?: boolean
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'free',
    displayName: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'NGN',
    features: [
      '10 AI-generated videos/month',
      '50 AI-generated images/month',
      '2 social accounts',
      'Basic templates',
      'Manual publishing',
      'Standard quality (720p)',
    ],
    limits: {
      videosPerMonth: 10,
      imagesPerMonth: 50,
      accounts: 2,
      storageGB: 1,
      teamMembers: 1,
      apiAccess: false,
      whiteLabel: false,
      priorityQueue: false,
    },
  },
  {
    name: 'basic',
    displayName: 'Basic',
    priceMonthly: 10000,
    priceYearly: 100000,
    currency: 'NGN',
    popular: true,
    features: [
      '50 AI-generated videos/month',
      '300 AI-generated images/month',
      '5 social accounts',
      'Premium templates',
      'Scheduled publishing',
      'Basic analytics',
      'HD quality (1080p)',
      'YouTube direct upload',
    ],
    limits: {
      videosPerMonth: 50,
      imagesPerMonth: 300,
      accounts: 5,
      storageGB: 10,
      teamMembers: 1,
      apiAccess: false,
      whiteLabel: false,
      priorityQueue: false,
    },
  },
  {
    name: 'pro',
    displayName: 'Pro',
    priceMonthly: 25000,
    priceYearly: 250000,
    currency: 'NGN',
    features: [
      'Unlimited AI videos',
      'Unlimited AI images',
      '15 social accounts',
      'All templates + custom',
      'Advanced analytics',
      '4K quality',
      'White-label export',
      'Priority GPU queue',
      'API access',
      '3 team members',
    ],
    limits: {
      videosPerMonth: null,
      imagesPerMonth: null,
      accounts: 15,
      storageGB: 100,
      teamMembers: 3,
      apiAccess: true,
      whiteLabel: true,
      priorityQueue: true,
    },
  },
  {
    name: 'agency',
    displayName: 'Agency',
    priceMonthly: 75000,
    priceYearly: 750000,
    currency: 'NGN',
    features: [
      'Unlimited everything',
      'Unlimited social accounts',
      'Full white-label',
      'Dedicated GPU',
      'Custom AI model fine-tuning',
      'Unlimited team members',
      'Priority support',
      'Custom integrations',
      'SLA guarantee',
    ],
    limits: {
      videosPerMonth: null,
      imagesPerMonth: null,
      accounts: 999,
      storageGB: 1000,
      teamMembers: 999,
      apiAccess: true,
      whiteLabel: true,
      priorityQueue: true,
    },
  },
]

// ─── FAL AI Models ────────────────────────────────────────────────────────────

export interface FalVideoModel {
  id: string
  name: string
  description: string
  maxDuration: number    // seconds
  supportedAspectRatios: string[]
  tier: 'free' | 'basic' | 'pro'
  endpoint: string
}

export interface FalImageModel {
  id: string
  name: string
  description: string
  maxResolution: string
  styles: string[]
  tier: 'free' | 'basic' | 'pro'
  endpoint: string
}

export const FAL_VIDEO_MODELS: FalVideoModel[] = [
  {
    id: 'minimax-video-01',
    name: 'MiniMax Video-01',
    description: 'Fast, high-quality video generation',
    maxDuration: 6,
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    tier: 'free',
    endpoint: 'fal-ai/minimax-video/image-to-video',
  },
  {
    id: 'kling-video-v2-master',
    name: 'Kling v2 Master',
    description: 'Premium cinematic quality video',
    maxDuration: 10,
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    tier: 'basic',
    endpoint: 'fal-ai/kling-video/v2/master/image-to-video',
  },
  {
    id: 'wan-pro',
    name: 'Wan 2.1 Pro',
    description: 'Maximum quality, longest duration',
    maxDuration: 15,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:3'],
    tier: 'pro',
    endpoint: 'fal-ai/wan/v2.2/1080p',
  },
  {
    id: 'luma-dream-machine',
    name: 'Luma Dream Machine',
    description: 'Hyper-realistic motion',
    maxDuration: 5,
    supportedAspectRatios: ['16:9', '9:16', '1:1', '4:3', '3:4'],
    tier: 'pro',
    endpoint: 'fal-ai/luma-dream-machine',
  },
]

export const FAL_IMAGE_MODELS: FalImageModel[] = [
  {
    id: 'flux-pro-ultra',
    name: 'FLUX 1.1 Pro Ultra',
    description: 'Best quality for professional use',
    maxResolution: '2048x2048',
    styles: ['photorealistic', 'cinematic', 'editorial'],
    tier: 'basic',
    endpoint: 'fal-ai/flux-pro/v1.1-ultra',
  },
  {
    id: 'flux-realism',
    name: 'FLUX Realism LoRA',
    description: 'Hyper-realistic photographs',
    maxResolution: '1440x1440',
    styles: ['photorealistic'],
    tier: 'free',
    endpoint: 'fal-ai/flux-realism',
  },
  {
    id: 'ideogram-v3',
    name: 'Ideogram v3',
    description: 'Best for text-in-image generation',
    maxResolution: '1024x1024',
    styles: ['design', 'graphic', 'typography'],
    tier: 'basic',
    endpoint: 'fal-ai/ideogram/v3',
  },
  {
    id: 'recraft-v3',
    name: 'Recraft v3',
    description: 'Vector illustrations & brand assets',
    maxResolution: '1024x1024',
    styles: ['vector', 'illustration', 'brand'],
    tier: 'basic',
    endpoint: 'fal-ai/recraft-v3',
  },
  {
    id: 'aura-sr',
    name: 'AuraSR Upscaler',
    description: '4x AI upscaling',
    maxResolution: '4096x4096',
    styles: [],
    tier: 'free',
    endpoint: 'fal-ai/aura-sr',
  },
  {
    id: 'flux-inpainting',
    name: 'FLUX Inpainting',
    description: 'AI-powered image editing',
    maxResolution: '1024x1024',
    styles: ['editing'],
    tier: 'basic',
    endpoint: 'fal-ai/flux-pro/v1/fill',
  },
]

// ─── Social Platforms ─────────────────────────────────────────────────────────

export type SocialPlatform = 'youtube' | 'instagram' | 'twitter' | 'tiktok' | 'linkedin' | 'facebook'

export interface SocialAccount {
  id: string
  platform: SocialPlatform
  platformUserId: string
  username: string
  displayName: string
  profileImageUrl?: string
  accessToken: string   // encrypted in DB
  refreshToken?: string // encrypted in DB
  tokenExpiresAt?: Date
  followers?: number
  isActive: boolean
  createdAt: Date
  userId: string
}

export interface PublishPayload {
  contentId: string
  platforms: SocialPlatform[]
  caption?: string
  hashtags?: string[]
  scheduledFor?: Date
  youtubeOptions?: {
    title: string
    description: string
    tags: string[]
    categoryId: string
    privacyStatus: 'public' | 'private' | 'unlisted'
  }
  instagramOptions?: {
    caption: string
    locationId?: string
    userTags?: string[]
  }
}

// ─── Content ──────────────────────────────────────────────────────────────────

export type ContentType = 'video' | 'image' | 'image_edit' | 'video_edit'
export type ContentStatus = 'pending' | 'generating' | 'ready' | 'failed' | 'published'
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '4:3' | '3:4'

export interface GeneratedContent {
  id: string
  type: ContentType
  status: ContentStatus
  prompt: string
  model: string
  fileUrl?: string
  thumbnailUrl?: string
  duration?: number       // seconds (video)
  width?: number
  height?: number
  aspectRatio: AspectRatio
  falRequestId?: string
  falJobId?: string
  metadata?: Record<string, unknown>
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface GenerateVideoRequest {
  prompt: string
  model: string
  aspectRatio: AspectRatio
  duration: number
  imageUrl?: string       // for image-to-video
  negativePrompt?: string
  seed?: number
  addAudio?: boolean      // default true — post-process video to add AI audio
  audioPrompt?: string    // overrides the audio prompt (defaults to video prompt)
}

export interface GenerateImageRequest {
  prompt: string
  model: string
  aspectRatio: AspectRatio
  numImages?: number
  seed?: number
  negativePrompt?: string
  guidanceScale?: number
  style?: string
}

export interface EditImageRequest {
  imageUrl: string
  mask?: string           // base64 mask for inpainting
  prompt: string
  model: string
  strength?: number
}

// ─── Script Generation ────────────────────────────────────────────────────────

export interface ScriptGenerationRequest {
  topic: string
  platform: SocialPlatform
  duration: number        // target seconds
  tone: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational'
  audience?: string
  brandVoice?: string
  keywords?: string[]
}

export interface GeneratedScript {
  title: string
  hook: string            // opening line to grab attention
  body: string
  callToAction: string
  hashtags: string[]
  visualPrompt: string    // fal.ai prompt derived from script
  estimatedDuration: number
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface ContentAnalytics {
  contentId: string
  platform: SocialPlatform
  views: number
  likes: number
  comments: number
  shares: number
  reach: number
  impressions: number
  engagementRate: number
  clickThroughRate?: number
  watchTime?: number      // video only, seconds
  recordedAt: Date
}

// ─── User & Subscription ──────────────────────────────────────────────────────

export interface UserSubscription {
  id: string
  userId: string
  plan: PlanName
  billingCycle: BillingCycle
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  paystackCustomerId?: string
  paystackSubscriptionCode?: string
}

export interface UsageStats {
  videosGenerated: number
  imagesGenerated: number
  videosLimit: number | null
  imagesLimit: number | null
  accountsConnected: number
  accountsLimit: number
  periodStart: Date
  periodEnd: Date
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: unknown
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}