// src/app/api/billing/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-paystack-signature')

  // Verify webhook signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex')

  if (hash !== signature) {
    console.error('[webhook] Invalid Paystack signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)
  console.log('[webhook] Paystack event:', event.event)

  try {
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data)
        break

      case 'subscription.create':
        await handleSubscriptionCreate(event.data)
        break

      case 'subscription.disable':
        await handleSubscriptionDisable(event.data)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data)
        break

      case 'invoice.update':
        // Renewal
        if (event.data.paid) {
          await handleInvoiceRenewal(event.data)
        }
        break

      default:
        console.log(`[webhook] Unhandled event: ${event.event}`)
    }
  } catch (error) {
    console.error('[webhook] Handler error:', error)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleChargeSuccess(data: {
  reference: string
  customer: { email: string }
  metadata: { userId: string; plan: string; billingCycle: string }
  authorization: { authorization_code: string }
  subscription?: { subscription_code: string }
}) {
  const { userId, plan, billingCycle } = data.metadata
  if (!userId || !plan) return

  const now = new Date()
  const periodEnd = new Date(now)
  if (billingCycle === 'yearly') {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1)
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1)
  }

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan,
      billingCycle: billingCycle ?? 'monthly',
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      paystackAuthCode: data.authorization?.authorization_code,
    },
    update: {
      plan,
      billingCycle: billingCycle ?? 'monthly',
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      paystackAuthCode: data.authorization?.authorization_code,
    },
  })

  // Reset usage for new period
  await prisma.usageRecord.create({
    data: {
      userId,
      videosUsed: 0,
      imagesUsed: 0,
      periodStart: now,
      periodEnd,
    },
  })
}

async function handleSubscriptionCreate(data: {
  customer: { metadata: { userId: string } }
  subscription_code: string
}) {
  const userId = data.customer?.metadata?.userId
  if (!userId) return

  await prisma.subscription.update({
    where: { userId },
    data: { paystackSubscriptionCode: data.subscription_code },
  })
}

async function handleSubscriptionDisable(data: {
  customer: { metadata: { userId: string } }
}) {
  const userId = data.customer?.metadata?.userId
  if (!userId) return

  await prisma.subscription.update({
    where: { userId },
    data: { status: 'cancelled' },
  })
}

async function handlePaymentFailed(data: {
  customer: { metadata: { userId: string } }
}) {
  const userId = data.customer?.metadata?.userId
  if (!userId) return

  await prisma.subscription.update({
    where: { userId },
    data: { status: 'past_due' },
  })
}

async function handleInvoiceRenewal(data: {
  subscription: { customer: string }
  period_start: string
  period_end: string
}) {
  // Find user by Paystack customer code
  const subscription = await prisma.subscription.findFirst({
    where: { paystackSubscriptionCode: data.subscription?.customer },
  })
  if (!subscription) return

  const periodStart = new Date(Number(data.period_start) * 1000)
  const periodEnd = new Date(Number(data.period_end) * 1000)
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: 'active',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
  })

  await prisma.usageRecord.create({
    data: {
      userId: subscription.userId,
      videosUsed: 0,
      imagesUsed: 0,
      periodStart,
      periodEnd,
    },
  })
}
