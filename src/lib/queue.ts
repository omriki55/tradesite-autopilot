// Queue utilities — requires Redis (only used in local dev with docker-compose)
// Safe no-op in serverless environments (Vercel) where Redis isn't available

let postingQueue: any = null
let seoQueue: any = null
let websiteQueue: any = null

function getQueues() {
  if (postingQueue) return { postingQueue, seoQueue, websiteQueue }

  try {
    // Dynamic import to avoid crashing in serverless
    const { Queue } = require('bullmq')
    const connection = {
      host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'localhost',
      port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port || '6379') : 6379,
    }
    postingQueue = new Queue('social-posting', { connection })
    seoQueue = new Queue('seo-audit', { connection })
    websiteQueue = new Queue('website-generation', { connection })
  } catch {
    // Redis not available — use no-op queues
    const noopQueue = { add: async () => ({}) }
    postingQueue = noopQueue
    seoQueue = noopQueue
    websiteQueue = noopQueue
  }

  return { postingQueue, seoQueue, websiteQueue }
}

export async function schedulePost(projectId: string, postId: string, scheduledAt: Date) {
  const { postingQueue } = getQueues()
  const delay = scheduledAt.getTime() - Date.now()
  await postingQueue.add(
    'publish-post',
    { projectId, postId },
    { delay: Math.max(delay, 0), removeOnComplete: true }
  )
}

export async function scheduleWebsiteGeneration(projectId: string) {
  const { websiteQueue } = getQueues()
  await websiteQueue.add('generate-website', { projectId }, { removeOnComplete: true })
}

export async function scheduleSeoAudit(projectId: string) {
  const { seoQueue } = getQueues()
  await seoQueue.add('run-audit', { projectId }, { removeOnComplete: true })
}

export { getQueues }
