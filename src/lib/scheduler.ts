// ──────────────────────────────────────────────────────────────
// lib/scheduler.ts — BullMQ post scheduler
// ──────────────────────────────────────────────────────────────
import { Queue, Worker, Job } from 'bullmq'
import IORedis from 'ioredis'
import { prisma } from './db/prisma'
import { publishToplatform } from './social/publishers'
import type { SocialAccount, SocialPlatform } from '../types'

const connection = new IORedis(process.env.REDIS_URL!, { maxRetriesPerRequest: null })

export const publishQueue = new Queue('publish-posts', { connection })

interface PublishJobData {
  publishJobId: string
}

export async function schedulePost(publishJobId: string, scheduledAt: Date) {
  const delay = scheduledAt.getTime() - Date.now()
  if (delay < 0) throw new Error('Scheduled time is in the past')

  await publishQueue.add(
    'publish',
    { publishJobId },
    { delay, attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
  )
}

export function createPublishWorker() {
  return new Worker<PublishJobData>(
    'publish-posts',
    async (job: Job<PublishJobData>) => {
      const { publishJobId } = job.data

      const publishJob = await prisma.publishJob.findUnique({
        where: { id: publishJobId },
        include: { content: true, socialAccount: true },
      })

      if (!publishJob || publishJob.status !== 'scheduled') return

      await prisma.publishJob.update({
        where: { id: publishJobId },
        data: { status: 'publishing' },
      })

      try {
        const mediaUrl = publishJob.content.fileUrl
        if (!mediaUrl) throw new Error('No media URL on content')

        const options = (publishJob.options ?? {}) as Record<string, unknown>

        const result = await publishToplatform(
          publishJob.socialAccount.platform as SocialPlatform,
          publishJob.socialAccount as unknown as SocialAccount,
          {
            caption: publishJob.caption ?? publishJob.content.prompt,
            mediaUrl,
            mediaType: publishJob.content.type === 'video' ? 'video' : 'image',
            options:
              publishJob.socialAccount.platform === 'youtube'
                ? { ...options, videoUrl: mediaUrl }
                : undefined,
          }
        )

        await prisma.publishJob.update({
          where: { id: publishJobId },
          data: {
            status: 'published',
            publishedAt: new Date(),
            platformPostId: result.platformPostId,
          },
        })
      } catch (err) {
        await prisma.publishJob.update({
          where: { id: publishJobId },
          data: {
            status: 'failed',
            errorMessage: String(err),
            retryCount: { increment: 1 },
          },
        })
        throw err // so BullMQ retries
      }
    },
    { connection }
  )
}
