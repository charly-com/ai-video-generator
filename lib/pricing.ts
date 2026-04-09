

// lib/pricing.ts
// ──────────────────────────────────────────────────────────────
// PLAN DEFINITIONS
// ──────────────────────────────────────────────────────────────
 
export const PLANS = {
  free: {
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'NGN',
    paystackPlanCode: null,
    features: [
      '10 AI-generated videos/month',
      '30 AI images/month',
      '2 social accounts',
      'Basic templates',
      'Manual publishing',
    ],
    limits: {
      videosPerMonth: 10,
      imagesPerMonth: 30,
      accounts: 2,
      scheduledPosts: 0,
      teamSeats: 1,
    },
  },
  basic: {
    name: 'Basic',
    priceMonthly: 10_000,
    priceYearly: 100_000,
    currency: 'NGN',
    paystackPlanCode: process.env.PAYSTACK_PLAN_BASIC ?? 'PLN_xxx',
    features: [
      '50 AI-generated videos/month',
      '200 AI images/month',
      '5 social accounts',
      'Premium templates',
      'Scheduled publishing',
      'Basic analytics',
    ],
    limits: {
      videosPerMonth: 50,
      imagesPerMonth: 200,
      accounts: 5,
      scheduledPosts: 100,
      teamSeats: 1,
    },
  },
  pro: {
    name: 'Pro',
    priceMonthly: 25_000,
    priceYearly: 250_000,
    currency: 'NGN',
    paystackPlanCode: process.env.PAYSTACK_PLAN_PRO ?? 'PLN_yyy',
    popular: true,
    features: [
      '150 AI-generated videos/month',
      'Unlimited AI images',
      '10 social accounts',
      'All platforms',
      'Advanced analytics',
      'Team (3 seats)',
      'Priority generation',
    ],
    limits: {
      videosPerMonth: 150,
      imagesPerMonth: -1, // unlimited
      accounts: 10,
      scheduledPosts: -1,
      teamSeats: 3,
    },
  },
  business: {
    name: 'Business',
    priceMonthly: 65_000,
    priceYearly: 650_000,
    currency: 'NGN',
    paystackPlanCode: process.env.PAYSTACK_PLAN_BUSINESS ?? 'PLN_zzz',
    features: [
      'Unlimited videos',
      'Unlimited images',
      'Unlimited accounts',
      'White-label option',
      'Custom AI models',
      '10 team seats',
      'Dedicated support',
    ],
    limits: {
      videosPerMonth: -1,
      imagesPerMonth: -1,
      accounts: -1,
      scheduledPosts: -1,
      teamSeats: 10,
    },
  },
} as const;
 
export type PlanTierKey = keyof typeof PLANS;
 
export function getPlanLimits(tier: PlanTierKey) {
  return PLANS[tier].limits;
}
 
