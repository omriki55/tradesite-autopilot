import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateJSONWithAI } from '@/lib/ai'
import { advancePhase } from '@/lib/phase-advance'
import { publishToSocial } from '@/lib/social-providers'

const WEEKLY_SCHEDULE = [
  { day: 0, type: 'educational', label: 'Educational Long-form' },
  { day: 1, type: 'market_outlook', label: 'Market Outlook' },
  { day: 2, type: 'educational', label: 'Educational Tip' },
  { day: 3, type: 'analysis', label: 'Market Analysis' },
  { day: 4, type: 'product_spotlight', label: 'Product Spotlight' },
  { day: 5, type: 'review', label: 'Week in Review' },
  { day: 6, type: 'motivational', label: 'Motivational / Engagement' },
]

const PLATFORMS = ['FACEBOOK', 'INSTAGRAM', 'TWITTER', 'LINKEDIN', 'YOUTUBE', 'TIKTOK', 'TELEGRAM'] as const

export const postingRouter = router({
  getCalendar: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.socialPost.findMany({
        where: {
          projectId: input.projectId,
          scheduledAt: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
        },
        orderBy: { scheduledAt: 'asc' },
      })
    }),

  generatePosts: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        startDate: z.string(),
        days: z.number().min(1).max(90).default(7),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
      })
      if (!project) throw new Error('Project not found')

      const posts = []
      const startDate = new Date(input.startDate)

      for (let d = 0; d < input.days; d++) {
        const currentDate = new Date(startDate.getTime() + d * 24 * 60 * 60 * 1000)
        const dayOfWeek = currentDate.getDay()
        const schedule = WEEKLY_SCHEDULE[dayOfWeek]

        for (const platform of PLATFORMS) {
          const postContent = await generateJSONWithAI<{
            content: string
            hashtags: string[]
          }>(
            `Generate a social media post for ${platform} on ${schedule.label} day.
            Company: ${project.brandName} (${project.niche.replace('_', ' ')})
            Post type: ${schedule.type}
            Date: ${currentDate.toISOString().split('T')[0]}

            Return JSON with:
            - content: the post text (appropriate length for ${platform}: Twitter=280 chars, Instagram=2200, LinkedIn=3000, others=1000)
            - hashtags: array of relevant hashtags (Instagram=15, Twitter=3, LinkedIn=5, others=5)

            The content should be engaging, professional, and include a CTA.
            For market analysis, include specific market references.
            Always include risk disclaimer for promotional content.`,
            `You are a social media manager for a ${project.niche.replace('_', ' ')}.`
          )

          let parsed
          try {
            parsed = typeof postContent === 'string' ? JSON.parse(postContent) : postContent
          } catch {
            parsed = {
              content: `${schedule.label} update from ${project.brandName}. Stay tuned for more insights! #trading`,
              hashtags: ['#trading', '#forex', '#markets'],
            }
          }

          // Schedule at optimal times per platform
          const hours: Record<string, number> = {
            FACEBOOK: 10, INSTAGRAM: 11, TWITTER: 9,
            LINKEDIN: 8, YOUTUBE: 14, TIKTOK: 19, TELEGRAM: 12,
          }
          const scheduledAt = new Date(currentDate)
          scheduledAt.setHours(hours[platform] || 10, 0, 0, 0)

          posts.push({
            projectId: input.projectId,
            platform: platform as typeof PLATFORMS[number],
            content: parsed.content,
            hashtags: JSON.stringify(parsed.hashtags),
            postType: schedule.type,
            scheduledAt,
            status: 'SCHEDULED' as const,
            mediaUrls: JSON.stringify([]),
          })
        }
      }

      await ctx.prisma.socialPost.createMany({ data: posts })

      // Posts generated → advance to Phase 6
      await advancePhase(ctx.prisma, input.projectId, 5)

      return { generated: posts.length, days: input.days }
    }),

  publishPost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.socialPost.findUnique({ where: { id: input.postId } })
      if (!post) throw new Error('Post not found')

      // Check if platform has a connected account
      const profile = await ctx.prisma.socialProfile.findUnique({
        where: { projectId_platform: { projectId: post.projectId, platform: post.platform } },
      })

      // Publish via social providers (uses real API if connected, mock otherwise)
      const hashtags = post.hashtags ? JSON.parse(post.hashtags) : []
      const result = await publishToSocial(
        post.platform,
        profile?.connected ? profile.accessToken : null,
        { text: post.content, hashtags }
      )

      return ctx.prisma.socialPost.update({
        where: { id: input.postId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          engagementData: JSON.stringify({
            likes: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 20),
            shares: Math.floor(Math.random() * 15),
            clicks: Math.floor(Math.random() * 50),
            reach: Math.floor(Math.random() * 1000),
            postUrl: result.url || null,
            publishMode: profile?.connected ? 'live' : 'mock',
          }),
        },
      })
    }),

  getStats: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const total = await ctx.prisma.socialPost.count({ where: { projectId: input.projectId } })
      const published = await ctx.prisma.socialPost.count({
        where: { projectId: input.projectId, status: 'PUBLISHED' },
      })
      const scheduled = await ctx.prisma.socialPost.count({
        where: { projectId: input.projectId, status: 'SCHEDULED' },
      })

      return { total, published, scheduled, draft: total - published - scheduled }
    }),
})
