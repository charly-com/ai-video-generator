
// ──────────────────────────────────────────────────────────────
// lib/scheduler.ts — BullMQ post scheduler
// ──────────────────────────────────────────────────────────────
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
 
const connection = new IORedis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });
 
export const publishQueue = new Queue('publish-posts', { connection });
 
interface PublishJobData {
  scheduledPostId: string;
}
 
export async function schedulePost(scheduledPostId: string, scheduledAt: Date) {
  const delay = scheduledAt.getTime() - Date.now();
  if (delay < 0) throw new Error('Scheduled time is in the past');
 
  await publishQueue.add(
    'publish',
    { scheduledPostId },
    { delay, attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
  );
}
 
export function createPublishWorker() {
  return new Worker<PublishJobData>(
    'publish-posts',
    async (job: Job<PublishJobData>) => {
      const { scheduledPostId } = job.data;
 
      const post = await prisma.scheduledPost.findUnique({
        where: { id: scheduledPostId },
        include: { content: true, socialAccount: true },
      });
 
      if (!post || post.status !== 'scheduled') return;
 
      await prisma.scheduledPost.update({ where: { id: scheduledPostId }, data: { status: 'publishing' } });
 
      try {
        const mediaUrl = post.content.falOutputUrl ?? post.content.localUrl;
        if (!mediaUrl) throw new Error('No media URL on content');
 
        let platformPostId: string | undefined;
 
        switch (post.socialAccount.platform) {
          case 'youtube': {
            const { uploadYouTubeVideo } = await import('./social/index');
            platformPostId = await uploadYouTubeVideo({
              socialAccountId: post.socialAccountId,
              videoUrl: mediaUrl,
              title: post.content.title ?? 'New video',
              description: post.caption ?? '',
              tags: post.hashtags,
            });
            break;
          }
          case 'instagram': {
            const { publishInstagramMedia } = await import('./social/index');
            const mediaType = post.content.type === 'video' ? 'REELS' : 'IMAGE';
            platformPostId = await publishInstagramMedia({
              socialAccountId: post.socialAccountId,
              mediaUrl,
              mediaType,
              caption: [post.caption, ...post.hashtags.map(h => `#${h}`)].join('\n'),
            });
            break;
          }
          case 'twitter': {
            const { postTweet } = await import('./social/index');
            platformPostId = await postTweet({
              socialAccountId: post.socialAccountId,
              text: `${post.caption ?? ''}\n${post.hashtags.map(h => `#${h}`).join(' ')}`.trim(),
              mediaUrl,
            });
            break;
          }
          default:
            throw new Error(`Platform ${post.socialAccount.platform} not yet supported`);
        }
 
        await prisma.scheduledPost.update({
          where: { id: scheduledPostId },
          data: { status: 'published', publishedAt: new Date(), platformPostId },
        });
 
        await prisma.usageLog.create({
          data: { userId: post.userId, type: 'post_published', metadata: { platform: post.socialAccount.platform } },
        });
      } catch (err) {
        await prisma.scheduledPost.update({
          where: { id: scheduledPostId },
          data: { status: 'failed', error: String(err) },
        });
        throw err; // so BullMQ retries
      }
    },
    { connection }
  );
}
 