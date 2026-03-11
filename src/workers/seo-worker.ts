import { Worker } from 'bullmq'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const connection = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'localhost',
  port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port || '6379') : 6379,
}

const worker = new Worker(
  'seo-audit',
  async (job) => {
    const { projectId } = job.data

    console.log(`Running SEO audit for project ${projectId}...`)

    // Mock audit results
    const audit = {
      coreWebVitals: {
        lcp: +(Math.random() * 2 + 1).toFixed(1),
        fid: Math.floor(Math.random() * 80 + 20),
        cls: +(Math.random() * 0.1).toFixed(2),
        score: Math.floor(Math.random() * 15 + 85),
      },
      mobileScore: Math.floor(Math.random() * 10 + 90),
      pageSpeed: {
        mobile: Math.floor(Math.random() * 15 + 80),
        desktop: Math.floor(Math.random() * 8 + 92),
      },
      issues: [],
      sslValid: true,
      robotsTxt: true,
      sitemapFound: true,
      canonicalTags: true,
      structuredData: true,
    }

    const seoScore = Math.floor(
      (audit.coreWebVitals.score + audit.mobileScore + audit.pageSpeed.desktop) / 3
    )

    await prisma.seoConfig.update({
      where: { projectId },
      data: { technicalAudit: JSON.stringify(audit), seoScore },
    })

    console.log(`SEO audit complete for project ${projectId}. Score: ${seoScore}`)
  },
  { connection }
)

worker.on('completed', (job) => {
  console.log(`SEO job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`SEO job ${job?.id} failed:`, err)
})

export default worker
