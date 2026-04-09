// src/app/api/billing/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'
import type { ApiResponse, PlanName, BillingCycle } from '@/types'
import { PRICING_TIERS } from '@/types'

// Paystack plan codes — create these in your Paystack dashboard
const PAYSTACK_PLAN_CODES: Record<PlanName, Record<BillingCycle, string | null>> = {
  free: { monthly: null, yearly: null },
  basic: {
    monthly: process.env.PAYSTACK_BASIC_MONTHLY_CODE!,
    yearly: process.env.PAYSTACK_BASIC_YEARLY_CODE!,
  },
  pro: {
    monthly: process.env.PAYSTACK_PRO_MONTHLY_CODE!,
    yearly: process.env.PAYSTACK_PRO_YEARLY_CODE!,
  },
  agency: {
    monthly: process.env.PAYSTACK_AGENCY_MONTHLY_CODE!,
    yearly: process.env.PAYSTACK_AGENCY_YEARLY_CODE!,
  },
}

// ─── Initialize payment ───────────────────────────────────────────────────────

const InitPaymentSchema = z.object({
  plan: z.enum(['basic', 'pro', 'agency']),
  billingCycle: z.enum(['monthly', 'yearly']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { action } = body

    if (action === 'initialize') {
      return handleInitializePayment(session.user, body)
    }

    if (action === 'cancel') {
      return handleCancelSubscription(session.user.id)
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('[billing] Error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

async function handleInitializePayment(user: { id: string; email?: string | null }, body: unknown) {
  const parsed = InitPaymentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 })
  }

  const { plan, billingCycle } = parsed.data
  const tier = PRICING_TIERS.find(t => t.name === plan)!
  const amount = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly

  // Initialize Paystack transaction
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: user.email,
      amount: amount * 100, // Paystack uses kobo (NGN cents)
      currency: 'NGN',
      reference: `sf_${user.id}_${plan}_${Date.now()}`,
      callback_url: `${process.env.NEXTAUTH_URL}/api/billing/verify`,
      metadata: {
        userId: user.id,
        plan,
        billingCycle,
        custom_fields: [
          { display_name: 'Plan', variable_name: 'plan', value: plan },
          { display_name: 'Billing', variable_name: 'billing_cycle', value: billingCycle },
        ],
      },
      // Use subscription plan if it exists for recurring billing
      ...(PAYSTACK_PLAN_CODES[plan as PlanName][billingCycle]
        ? { plan: PAYSTACK_PLAN_CODES[plan as PlanName][billingCycle] }
        : {}),
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Paystack init failed: ${err}`)
  }

  const { data } = await response.json()

  return NextResponse.json<ApiResponse<{ authorizationUrl: string; reference: string }>>({
    success: true,
    data: {
      authorizationUrl: data.authorization_url,
      reference: data.reference,
    },
  })
}

async function handleCancelSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({ where: { userId } })

  if (!subscription?.paystackSubscriptionCode) {
    return NextResponse.json({ success: false, error: 'No active subscription found' }, { status: 404 })
  }

  const response = await fetch(
    `https://api.paystack.co/subscription/disable`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: subscription.paystackSubscriptionCode,
        token: subscription.paystackAuthCode,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to cancel Paystack subscription')
  }

  await prisma.subscription.update({
    where: { userId },
    data: { status: 'cancelled' },
  })

  return NextResponse.json({ success: true, data: { cancelled: true } })
}

// ─── GET current subscription info ───────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const [subscription, usage] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.usageRecord.findFirst({
      where: { userId, periodEnd: { gte: new Date() } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const plan = subscription?.plan ?? 'free'
  const tier = PRICING_TIERS.find(t => t.name === plan)!

  return NextResponse.json({
    success: true,
    data: {
      subscription,
      tier,
      usage: {
        videosGenerated: usage?.videosUsed ?? 0,
        imagesGenerated: usage?.imagesUsed ?? 0,
        videosLimit: tier.limits.videosPerMonth,
        imagesLimit: tier.limits.imagesPerMonth,
        periodStart: usage?.periodStart,
        periodEnd: usage?.periodEnd,
      },
    },
  })
}