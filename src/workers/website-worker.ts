import { Worker } from 'bullmq'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const connection = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'localhost',
  port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port || '6379') : 6379,
}

const worker = new Worker(
  'website-generation',
  async (job) => {
    const { projectId } = job.data

    console.log(`Generating website for project ${projectId}...`)

    await prisma.website.update({
      where: { projectId },
      data: { status: 'GENERATING' },
    })

    // In production, this would call the AI content generation
    // For now, mark as generated after a delay
    await new Promise((r) => setTimeout(r, 2000))

    await prisma.website.update({
      where: { projectId },
      data: { status: 'GENERATED' },
    })

    console.log(`Website generation complete for project ${projectId}`)
  },
  { connection }
)

worker.on('completed', (job) => {
  console.log(`Website job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`Website job ${job?.id} failed:`, err)
})

export default worker
