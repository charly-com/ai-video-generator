// src/app/api/cron/publish/route.ts
// Called every minute by Vercel Cron or external cron service

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db/prisma'
import { publishToplatform } from '../../../../lib/social/publishers';
import type { SocialPlatform } from '../../../../types/index';

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  // Find all jobs scheduled for the past or present (overdue included)
  const dueJobs = await prisma.publishJob.findMany({
    where: {
      status: 'scheduled',
      scheduledFor: { lte: now },
    },
    include: {
      content: true,
      socialAccount: true,
    },
    take: 20, // process up to 20 jobs per cron tick
  })

  console.log(`[cron/publish] Processing ${dueJobs.length} due jobs`)

  const results = await Promise.allSettled(
    dueJobs.map(async (job: any) => {
      // Mark as publishing to prevent duplicate execution
      await prisma.publishJob.update({
        where: { id: job.id },
        data: { status: 'publishing' },
      })

      try {
        const result = await publishToplatform(
          job.socialAccount.platform as SocialPlatform,
          job.socialAccount,
          {
            caption: job.caption ?? job.content.prompt,
            mediaUrl: job.content.fileUrl!,
            mediaType: job.content.type === 'video' ? 'video' : 'image',
            options: job.options as Record<string, unknown> ?? undefined,
          }
        )

        await prisma.publishJob.update({
          where: { id: job.id },
          data: {
            status: 'published',
            publishedAt: now,
            platformPostId: result.platformPostId,
          },
        })

        // Create success notification
        await prisma.notification.create({
          data: {
            userId: job.userId,
            type: 'publish_success',
            title: 'Post published! 🎉',
            message: `Your content was published to ${job.socialAccount.platform}`,
            emoji: '✅',
          },
        })

        return { jobId: job.id, status: 'published' }
      } catch (error) {
        const errorMessage = String(error)
        const newRetryCount = job.retryCount + 1

        if (newRetryCount >= 3) {
          // Give up after 3 retries
          await prisma.publishJob.update({
            where: { id: job.id },
            data: { status: 'failed', errorMessage, retryCount: newRetryCount },
          })

          await prisma.notification.create({
            data: {
              userId: job.userId,
              type: 'publish_failed',
              title: 'Publish failed ❌',
              message: `Failed to publish to ${job.socialAccount.platform}: ${errorMessage.slice(0, 100)}`,
              emoji: '❌',
            },
          })
        } else {
          // Retry in 5 minutes
          const retryAt = new Date(now.getTime() + 5 * 60 * 1000)
          await prisma.publishJob.update({
            where: { id: job.id },
            data: {
              status: 'scheduled',
              scheduledFor: retryAt,
              retryCount: newRetryCount,
              errorMessage,
            },
          })
        }

        return { jobId: job.id, status: 'failed', error: errorMessage }
      }
    })
  )

  const published = results.filter(r => r.status === 'fulfilled' && (r.value as Record<string,string>).status === 'published').length
  const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && (r.value as Record<string,string>).status === 'failed')).length

  return NextResponse.json({
    processed: dueJobs.length,
    published,
    failed,
    timestamp: now.toISOString(),
  })
}