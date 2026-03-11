import { Worker } from 'bullmq'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const connection = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'localhost',
  port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port || '6379') : 6379,
}

const worker = new Worker(
  'social-posting',
  async (job) => {
    const { postId } = job.data

    console.log(`Publishing post ${postId}...`)

    // Mock publish — in production, call social media APIs
    await prisma.socialPost.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        engagementData: JSON.stringify({
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 15),
          clicks: Math.floor(Math.random() * 50),
          reach: Math.floor(Math.random() * 1000),
        }),
      },
    })

    console.log(`Post ${postId} published successfully`)
  },
  { connection }
)

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err)
})

export default worker
