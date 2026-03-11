// Seeds content bank with best-practice templates on project creation

import { PrismaClient } from '@prisma/client'
import { getTemplatesForNiche, CONTENT_TEMPLATES } from './content-templates'

export async function seedContentBank(prisma: PrismaClient, projectId: string, niche: string) {
  const templates = getTemplatesForNiche(niche)

  // Select ~50 most relevant templates
  const selected = templates.slice(0, 50)

  const data = selected.map((t) => ({
    projectId,
    type: t.subcategory,
    category: t.category,
    title: t.title,
    content: JSON.stringify({
      text: t.content,
      usageHint: t.usageHint,
      platforms: t.platforms,
    }),
    tags: JSON.stringify(t.tags),
    isTemplate: true,
    used: false,
  }))

  await prisma.contentBank.createMany({ data })

  return { count: data.length }
}

export async function seedMockAnalytics(prisma: PrismaClient, projectId: string) {
  const now = new Date()
  const data = []

  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dayFactor = Math.max(0, 30 - i) / 30 // Growth curve

    data.push({
      projectId,
      date,
      traffic: Math.floor(50 + dayFactor * 450 + Math.random() * 100),
      keywordsRanked: Math.floor(5 + dayFactor * 45),
      socialFollowers: Math.floor(100 + dayFactor * 900 + Math.random() * 50),
      leads: Math.floor(dayFactor * 15 + Math.random() * 5),
      data: JSON.stringify({
        sources: {
          organic: Math.floor(30 + Math.random() * 20),
          social: Math.floor(20 + Math.random() * 15),
          direct: Math.floor(15 + Math.random() * 10),
          referral: Math.floor(5 + Math.random() * 10),
        },
        topPages: ['/', '/platforms', '/pricing', '/education', '/markets/forex'],
        bounceRate: Math.round(35 + Math.random() * 20),
        avgSessionDuration: Math.round(120 + Math.random() * 180),
      }),
    })
  }

  // Use upsert-like approach to avoid conflicts
  for (const entry of data) {
    await prisma.analytics.upsert({
      where: {
        projectId_date: {
          projectId: entry.projectId,
          date: entry.date,
        },
      },
      create: entry,
      update: entry,
    })
  }

  return { count: data.length }
}
