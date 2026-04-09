# Social Media Content Factory

AI-powered social media content generation and publishing platform.  
Built with **Next.js 15**, **TypeScript**, **FAL AI**, **Claude API**, **Neon PostgreSQL**, and **Prisma**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| AI — Images & Video | FAL AI (FLUX, Kling, Runway, Luma) |
| AI — Scripts & Prompts | Anthropic Claude (claude-sonnet-4) |
| Database | Neon PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v4 |
| Payments | Paystack (NGN) |
| Job Queue | BullMQ + Upstash Redis |
| File Storage | UploadThing |
| Social APIs | YouTube Data v3, Meta Graph API, Twitter v2 |

---

## Project Structure

```
social-factory/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/
│   │   ├── dashboard/         # Overview & stats
│   │   ├── studio/            # AI content creation
│   │   ├── schedule/          # Post scheduler
│   │   ├── analytics/         # Cross-platform analytics
│   │   ├── social/            # Social account management
│   │   └── pricing/           # Upgrade plans
│   └── api/
│       ├── ai/
│       │   ├── generate-image/ # FAL image generation
│       │   ├── generate-video/ # FAL video generation
│       │   ├── generate-script/ # Claude script generation
│       │   ├── optimize-prompt/ # Claude prompt optimizer
│       │   └── edit-image/     # FAL image editing
│       ├── social/
│       │   ├── connect/[platform]/ # OAuth init
│       │   ├── callback/[platform]/ # OAuth callback
│       │   └── publish/        # Direct publish
│       ├── billing/
│       │   ├── checkout/       # Paystack checkout
│       │   └── webhook/        # Paystack webhook
│       └── webhooks/fal/       # FAL async job completion
├── lib/
│   ├── fal.ts                 # FAL AI client
│   ├── claude.ts              # Anthropic client
│   ├── prisma.ts              # Prisma singleton
│   ├── auth.ts                # NextAuth config
│   ├── pricing.ts             # Plan definitions + usage limits
│   └── social/                # YouTube, Instagram, Twitter
├── components/
│   ├── studio/                # ImageStudio, VideoStudio, etc.
│   └── ui/                    # shadcn components
└── prisma/schema.prisma
```

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/yourname/social-factory.git
cd social-factory
pnpm install

# 2. Copy env template
cp .env.example .env

# 3. Fill in all API keys (see guide below)
# then:

# 4. Set up database
pnpm prisma migrate dev --name init
pnpm prisma generate

# 5. Run dev server
pnpm dev
```

---

## API Key Setup Guide

### 1. FAL AI (Required — image/video generation)

1. Go to **https://fal.ai/dashboard/keys**
2. Create an account or sign in
3. Click **"Add key"**
4. Copy the key → add to `.env` as `FAL_KEY`
5. Fund your account — FAL is pay-per-use (~$0.003/image, ~$0.05/video)

```env
FAL_KEY=fal_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 2. Anthropic Claude (Required — scripts & prompts)

1. Go to **https://console.anthropic.com**
2. **Settings → API Keys → Create Key**
3. Copy immediately — it's only shown once
4. Claude Sonnet 4 costs ~$3/$15 per M input/output tokens

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 3. Neon PostgreSQL (Required — database)

1. Go to **https://neon.tech** → Create account
2. **Create a new project** (free tier available)
3. Copy the **Connection string** (pooled) → `DATABASE_URL`
4. Copy the **Direct URL** → `DATABASE_URL_UNPOOLED`

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/social_factory?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/social_factory?sslmode=require
```

---

### 4. YouTube Data API v3

1. Go to **https://console.cloud.google.com**
2. Create a new project (e.g., "Social Factory")
3. **APIs & Services → Enable APIs → YouTube Data API v3**
4. **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/social/callback/youtube`
   - Add your production URL too when deploying
5. Copy Client ID and Client Secret

```env
YOUTUBE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:** YouTube requires OAuth verification to access other users' channels. For your own channel, you can use test mode.

---

### 5. Instagram / Meta Graph API

1. Go to **https://developers.facebook.com**
2. **My Apps → Create App → Business**
3. Add product: **Instagram Graph API**
4. Settings → Basic → copy App ID and App Secret
5. Add OAuth Redirect URI: `http://localhost:3000/api/social/callback/instagram`
6. Required permissions: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`

```env
META_APP_ID=1234567890123456
META_APP_SECRET=abcdef1234567890abcdef1234567890
```

**Note:** You need an Instagram Business or Creator account connected to a Facebook Page.

---

### 6. Twitter / X API v2

1. Go to **https://developer.twitter.com**
2. Create a project and app (requires phone number verification)
3. **Free tier** allows read-only. For posting you need **Basic ($100/month)** or apply for elevated access
4. App Settings → **User authentication settings**:
   - Enable OAuth 2.0
   - App type: Web App
   - Callback URI: `http://localhost:3000/api/social/callback/twitter`
   - Required scopes: `tweet.write`, `media.write`, `users.read`, `offline.access`
5. Copy Client ID and Client Secret (OAuth 2.0)

```env
TWITTER_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxx
TWITTER_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 7. Paystack (Nigerian payments)

1. Go to **https://dashboard.paystack.com**
2. Create an account (Nigerian business recommended)
3. **Settings → API Keys & Webhooks**
4. Copy Secret Key and Public Key
5. Create subscription plans matching your pricing tiers
6. Add webhook URL: `https://your-domain.com/api/billing/webhook`

```env
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_PLAN_BASIC=PLN_xxxxxxxxxx
PAYSTACK_PLAN_PRO=PLN_xxxxxxxxxx
PAYSTACK_PLAN_BUSINESS=PLN_xxxxxxxxxx
```

---

### 8. Upstash Redis (BullMQ job queue for scheduled posts)

1. Go to **https://console.upstash.com**
2. Create a Redis database (free tier: 10K commands/day)
3. Copy the Redis URL

```env
REDIS_URL=redis://default:xxxxxxxxxx@xxxxxxxx.upstash.io:6379
```

---

## FAL AI Models Used

| Feature | Model |
|---|---|
| Image (best quality) | `fal-ai/flux/dev` |
| Image (fastest) | `fal-ai/flux/schnell` |
| Image (premium) | `fal-ai/flux-pro` |
| Video (text-to-video) | `fal-ai/kling-video/v1.6/standard/text-to-video` |
| Video (pro, longer) | `fal-ai/kling-video/v1.6/pro/text-to-video` |
| Video (cinematic) | `fal-ai/runway-gen3/turbo/text-to-video` |
| Background removal | `fal-ai/birefnet` |
| Inpainting | `fal-ai/flux/fill` |
| Upscaling | `fal-ai/clarity-upscaler` |

---

## Pricing Plans (NGN)

| Tier | Monthly | Yearly | Videos | Images | Accounts |
|---|---|---|---|---|---|
| Free | ₦0 | ₦0 | 10 | 30 | 2 |
| Basic | ₦10,000 | ₦100,000 | 50 | 200 | 5 |
| Pro | ₦25,000 | ₦250,000 | 150 | Unlimited | 10 |
| Business | ₦65,000 | ₦650,000 | Unlimited | Unlimited | Unlimited |

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Set environment variables
vercel env add FAL_KEY
vercel env add ANTHROPIC_API_KEY
# ... add all from .env.example

# Run migrations against production
DATABASE_URL=your_prod_url pnpm prisma migrate deploy
```

For the BullMQ worker (scheduled posts), deploy as a separate long-running service on **Railway** or **Fly.io** — Vercel serverless functions time out at 60s.

---

## Key Architecture Decisions

**Video generation is async** — FAL AI videos take 1–3 minutes. The API route submits a job and returns a `requestId`. FAL calls your webhook at `/api/webhooks/fal` when complete, which updates the database. The frontend polls `/api/content/[id]` every 5 seconds.

**Scheduled posts use BullMQ** — A Bull job is created with a `delay` matching the scheduled time. The worker process (separate from Next.js) consumes the queue and calls the appropriate social platform API.

**Token storage** — OAuth access tokens are encrypted with `@prisma/extension-accelerate` field-level encryption before storage. Never log tokens.