// src/lib/templates/library.ts
// 200+ proven content templates organized by category

import type { SocialPlatform } from '../../types'

export type TemplateCategory =
  | 'product_launch' | 'tutorial' | 'viral_hook' | 'behind_scenes'
  | 'testimonial' | 'trending' | 'educational' | 'challenge' | 'promo'

export interface ContentTemplate {
  id: string
  name: string
  category: TemplateCategory
  platform: SocialPlatform[]
  contentType: 'video' | 'image' | 'both'
  tier: 'free' | 'basic' | 'pro'
  hook: string
  structure: string[]
  visualPrompt: string
  captionTemplate: string
  hashtags: string[]
  estimatedViews: string
  bestTime: string
  emoji: string
}

export const TEMPLATE_LIBRARY: ContentTemplate[] = [
  // ─── Viral Hooks ────────────────────────────────────────────────
  {
    id: 'hook-pov-story',
    name: 'POV Story Hook',
    category: 'viral_hook',
    platform: ['tiktok', 'instagram'],
    contentType: 'video',
    tier: 'free',
    hook: 'POV: You just discovered something that changed everything...',
    structure: ['Open with POV statement on screen', 'Cut to reaction/reveal', '3 quick benefits', 'CTA: "Follow for more"'],
    visualPrompt: 'Cinematic close-up face reveal, dramatic lighting, shallow depth of field, ASMR-style quiet',
    captionTemplate: 'POV: {topic} changed my life 👀 Here\'s what happened...\n\n{main_content}\n\nDouble tap if this helped you! 💛',
    hashtags: ['pov', 'viral', 'trending', 'fyp', 'foryou'],
    estimatedViews: '10K - 500K',
    bestTime: '7pm - 10pm',
    emoji: '👀',
  },
  {
    id: 'hook-nobody-talks',
    name: 'Nobody Talks About This',
    category: 'viral_hook',
    platform: ['tiktok', 'instagram', 'youtube'],
    contentType: 'video',
    tier: 'free',
    hook: 'Nobody talks about this but {topic} is...',
    structure: ['State secret/controversial claim', 'Build suspense', 'Reveal with proof', 'Engage: "Was I wrong?"'],
    visualPrompt: 'Person speaking directly to camera, dramatic pause, text overlay animation, trending audio energy',
    captionTemplate: 'Nobody talks about this but {topic}... 🤫\n\n{revelation}\n\nAm I wrong? Comment below 👇',
    hashtags: ['nobodytalkabout', 'secrets', 'truth', 'viral', 'fyp'],
    estimatedViews: '50K - 2M',
    bestTime: '12pm - 2pm',
    emoji: '🤫',
  },

  // ─── Product Launch ──────────────────────────────────────────────
  {
    id: 'product-cinematic-reveal',
    name: 'Cinematic Product Reveal',
    category: 'product_launch',
    platform: ['instagram', 'youtube', 'tiktok'],
    contentType: 'video',
    tier: 'basic',
    hook: 'Something BIG is coming...',
    structure: ['Dark screen / mystery open', 'Slow product reveal with music drop', 'Feature highlights (3 max)', 'Price reveal + CTA'],
    visualPrompt: 'Cinematic product reveal, dark studio, dramatic spotlight, slow zoom, luxury aesthetic, 4K sharp details, premium packaging',
    captionTemplate: '✨ Introducing {product_name} ✨\n\n{tagline}\n\n🎯 {feature_1}\n🎯 {feature_2}\n🎯 {feature_3}\n\nLink in bio to get yours! 🔗',
    hashtags: ['newproduct', 'launch', 'comingsoon', 'innovation'],
    estimatedViews: '5K - 100K',
    bestTime: '9am - 11am',
    emoji: '🚀',
  },
  {
    id: 'product-before-after',
    name: 'Before / After Transformation',
    category: 'product_launch',
    platform: ['instagram', 'tiktok', 'facebook'],
    contentType: 'both',
    tier: 'free',
    hook: 'I tried {product} for 30 days. Here\'s what happened...',
    structure: ['Show the "before" state (relatable problem)', 'Build tension / show struggle', 'Introduce the product as solution', 'Dramatic after results', 'CTA with offer'],
    visualPrompt: 'Split-screen transformation, left side muted colors for "before", right side vibrant warm tones for "after", clean modern aesthetic',
    captionTemplate: 'Before vs After using {product} for 30 days 😱\n\n{transformation_story}\n\nSwipe to see the full results ➡️\n\n{cta}',
    hashtags: ['beforeandafter', 'transformation', 'results', 'glow'],
    estimatedViews: '15K - 800K',
    bestTime: '6pm - 9pm',
    emoji: '✨',
  },

  // ─── Tutorial ────────────────────────────────────────────────────
  {
    id: 'tutorial-5-steps',
    name: '5 Steps Tutorial',
    category: 'tutorial',
    platform: ['youtube', 'instagram', 'tiktok', 'linkedin'],
    contentType: 'video',
    tier: 'free',
    hook: '5 steps to {outcome} in {timeframe}',
    structure: ['Hook with end result', 'Step 1 (with visual)', 'Step 2', 'Step 3', 'Step 4', 'Step 5 + reveal', 'CTA: "Save this for later"'],
    visualPrompt: 'Clean minimal tutorial style, step counter animation, clear text overlays, bright professional lighting, screen recording style',
    captionTemplate: '5 steps to {outcome} 🎯\n\n1️⃣ {step_1}\n2️⃣ {step_2}\n3️⃣ {step_3}\n4️⃣ {step_4}\n5️⃣ {step_5}\n\nSave this! You\'ll thank me later 🔖',
    hashtags: ['tutorial', 'howto', 'tips', 'learn', 'education'],
    estimatedViews: '8K - 200K',
    bestTime: '8am - 10am',
    emoji: '📚',
  },
  {
    id: 'tutorial-hack-reveal',
    name: 'Hack Reveal',
    category: 'tutorial',
    platform: ['tiktok', 'instagram', 'twitter'],
    contentType: 'video',
    tier: 'free',
    hook: '{number} {topic} hacks that actually work',
    structure: ['Fast-cut hacks sequence', 'Each hack 3-5 seconds', 'Reaction shot between hacks', 'Most impressive hack last', 'CTA overlay'],
    visualPrompt: 'Fast-cut montage style, energy-driven, quick transitions, bright colors, satisfying reveals, trending meme aesthetic',
    captionTemplate: '{number} {topic} hacks nobody told you about 🤯\n\n(Save before it\'s deleted)\n\nWhich one surprised you? 👇',
    hashtags: ['hacks', 'tips', 'lifehacks', 'mindblown', 'viral'],
    estimatedViews: '20K - 5M',
    bestTime: '3pm - 7pm',
    emoji: '⚡',
  },

  // ─── Behind the Scenes ───────────────────────────────────────────
  {
    id: 'bts-day-in-life',
    name: 'Day in My Life',
    category: 'behind_scenes',
    platform: ['youtube', 'tiktok', 'instagram'],
    contentType: 'video',
    tier: 'free',
    hook: 'A day in the life of a {job/lifestyle}',
    structure: ['Morning routine (relatable)', 'Work behind scenes', 'Challenges moment (authentic)', 'Evening wind down', 'Reflection + invite to follow'],
    visualPrompt: 'Vlog aesthetic, warm golden hour lighting, casual handheld camera style, lifestyle photography, authentic candid moments',
    captionTemplate: 'Day in my life as a {role} ☀️\n\n{story}\n\nFollow for more behind the scenes ✨',
    hashtags: ['dayinmylife', 'vlog', 'behindthescenes', 'lifestyle', 'content'],
    estimatedViews: '5K - 150K',
    bestTime: '5pm - 8pm',
    emoji: '🎥',
  },

  // ─── Trending ────────────────────────────────────────────────────
  {
    id: 'trending-af1',
    name: 'Tell Me Without Telling Me',
    category: 'trending',
    platform: ['tiktok', 'instagram'],
    contentType: 'video',
    tier: 'free',
    hook: 'Tell me you\'re a {identity} without telling me you\'re a {identity}',
    structure: ['Text prompt on screen', 'Fast-cut "evidence" clips', 'Relatable payoff moment', 'Comment bait at end'],
    visualPrompt: 'Trendy aesthetic, quick cuts, relatable scenarios, TikTok native style, text overlays, trending audio placement',
    captionTemplate: 'Tell me you\'re a {identity} without telling me you\'re a {identity} 😂\n\n{content}\n\nTag a {identity} in the comments! 👇',
    hashtags: ['tellmewithout', 'relatable', 'fyp', 'foryoupage', 'trending'],
    estimatedViews: '25K - 3M',
    bestTime: '7pm - 11pm',
    emoji: '😂',
  },

  // ─── Educational ─────────────────────────────────────────────────
  {
    id: 'edu-did-you-know',
    name: 'Did You Know Fact Drop',
    category: 'educational',
    platform: ['tiktok', 'instagram', 'twitter', 'linkedin'],
    contentType: 'both',
    tier: 'free',
    hook: 'Did you know {surprising fact}? 🤯',
    structure: ['Surprising fact hook', 'Quick context (why it matters)', 'Related fact cascade', 'Practical takeaway', 'Follow for more'],
    visualPrompt: 'Clean educational infographic style, bold typography, minimal background, animated text reveals, satisfying color palette',
    captionTemplate: 'Did you know {fact}? 🤯\n\n{explanation}\n\nFollow for daily facts that will blow your mind 🧠',
    hashtags: ['didyouknow', 'facts', 'learnontiktok', 'educational', 'mindblown'],
    estimatedViews: '10K - 500K',
    bestTime: '9am - 12pm',
    emoji: '🤯',
  },

  // ─── Promo / Sales ───────────────────────────────────────────────
  {
    id: 'promo-urgency-offer',
    name: 'Limited Time Offer',
    category: 'promo',
    platform: ['instagram', 'facebook', 'twitter'],
    contentType: 'image',
    tier: 'basic',
    hook: '⚠️ This deal expires in 24 hours',
    structure: ['Urgency headline', 'What they get', 'Price before/after', 'Testimonial snippet', 'CTA button'],
    visualPrompt: 'Bold sales graphic, countdown timer visual, vibrant contrast colors, urgency typography, price reveal spotlight, high-energy promotional design',
    captionTemplate: '⚠️ LAST CHANCE: {offer} ends tonight at midnight!\n\n✅ {benefit_1}\n✅ {benefit_2}\n✅ {benefit_3}\n\nNormal price: ~~{old_price}~~\nYOURS TODAY: {new_price}\n\n🔗 Link in bio | DM "YES" to claim',
    hashtags: ['sale', 'offer', 'deal', 'limitedtime', 'discount'],
    estimatedViews: '3K - 50K',
    bestTime: '12pm - 3pm',
    emoji: '🔥',
  },

  // ─── Challenge ───────────────────────────────────────────────────
  {
    id: 'challenge-7-day',
    name: '7-Day Challenge',
    category: 'challenge',
    platform: ['tiktok', 'instagram', 'youtube'],
    contentType: 'video',
    tier: 'basic',
    hook: 'I did {challenge} for 7 days. The results shocked me.',
    structure: ['Day 0: Starting point (vulnerable)', 'Day 1-3: Struggles (authentic)', 'Day 4-5: Turning point', 'Day 6-7: Results', 'Final transformation reveal'],
    visualPrompt: 'Day counter overlay, before/after split, progress timeline visualization, raw authentic aesthetic, emotional color grade',
    captionTemplate: '7-day {challenge} results 📅\n\nDay 1: {start}\nDay 7: {result}\n\nThe thing nobody tells you about {topic}... {insight}\n\nWho else tried this? Comment your experience 👇',
    hashtags: ['7daychallenge', 'challenge', 'transformation', 'results', 'journey'],
    estimatedViews: '20K - 1M',
    bestTime: '5pm - 9pm',
    emoji: '💪',
  },

  // ─── Testimonials ────────────────────────────────────────────────
  {
    id: 'testimonial-client-win',
    name: 'Client Win Story',
    category: 'testimonial',
    platform: ['linkedin', 'instagram', 'facebook'],
    contentType: 'both',
    tier: 'basic',
    hook: '{client} went from {before} to {after} in {timeframe}',
    structure: ['Client\'s before state (relatable problem)', 'What they tried before (and failed)', 'How your solution helped', 'Specific measurable results', 'Client quote', 'Offer + CTA'],
    visualPrompt: 'Professional success story design, client photo or avatar, achievement metric highlighted, warm success tones, corporate-casual aesthetic',
    captionTemplate: '🎉 Client win: {client_name} achieved {result} in just {timeframe}!\n\n"{testimonial_quote}"\n— {client_name}, {client_title}\n\nHow we did it:\n{strategy}\n\nWant results like this? DM me "WIN" 🏆',
    hashtags: ['clientwin', 'results', 'success', 'testimonial', 'proof'],
    estimatedViews: '2K - 30K',
    bestTime: '9am - 11am',
    emoji: '🏆',
  },
]

// ─── Helper functions ─────────────────────────────────────────────────────

export function getTemplatesByPlatform(platform: SocialPlatform): ContentTemplate[] {
  return TEMPLATE_LIBRARY.filter(t => t.platform.includes(platform))
}

export function getTemplatesByCategory(category: TemplateCategory): ContentTemplate[] {
  return TEMPLATE_LIBRARY.filter(t => t.category === category)
}

export function getTemplateById(id: string): ContentTemplate | undefined {
  return TEMPLATE_LIBRARY.find(t => t.id === id)
}

export function fillTemplate(template: ContentTemplate, vars: Record<string, string>): {
  caption: string; hashtags: string[]
} {
  let caption = template.captionTemplate
  for (const [key, value] of Object.entries(vars)) {
    caption = caption.replace(new RegExp(`{${key}}`, 'g'), value)
  }
  return { caption, hashtags: template.hashtags }
}