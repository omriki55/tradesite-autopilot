import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { seedMockAnalytics } from '@/lib/content-seeder'

export const analyticsRouter = router({
  getDashboard: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Get latest analytics entries
      const latest = await ctx.prisma.analytics.findMany({
        where: { projectId: input.projectId },
        orderBy: { date: 'desc' },
        take: 30,
      })

      if (!latest.length) {
        return {
          totalTraffic: 0,
          totalLeads: 0,
          avgKeywords: 0,
          totalFollowers: 0,
          trend: 'flat' as const,
          hasData: false,
        }
      }

      const totalTraffic = latest.reduce((sum, a) => sum + a.traffic, 0)
      const totalLeads = latest.reduce((sum, a) => sum + a.leads, 0)
      const avgKeywords = Math.round(latest.reduce((sum, a) => sum + a.keywordsRanked, 0) / latest.length)
      const totalFollowers = latest[0]?.socialFollowers || 0

      // Determine trend: compare first half vs second half
      const mid = Math.floor(latest.length / 2)
      const recentTraffic = latest.slice(0, mid).reduce((s, a) => s + a.traffic, 0)
      const olderTraffic = latest.slice(mid).reduce((s, a) => s + a.traffic, 0)
      const trend = recentTraffic > olderTraffic ? 'up' : recentTraffic < olderTraffic ? 'down' : 'flat'

      return {
        totalTraffic,
        totalLeads,
        avgKeywords,
        totalFollowers,
        trend: trend as 'up' | 'down' | 'flat',
        hasData: true,
      }
    }),

  getTrafficData: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      days: z.number().min(7).max(90).default(30),
    }))
    .query(async ({ ctx, input }) => {
      const since = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000)

      const data = await ctx.prisma.analytics.findMany({
        where: {
          projectId: input.projectId,
          date: { gte: since },
        },
        orderBy: { date: 'asc' },
      })

      return data.map((d) => ({
        date: d.date.toISOString().split('T')[0],
        traffic: d.traffic,
        leads: d.leads,
        keywords: d.keywordsRanked,
        followers: d.socialFollowers,
      }))
    }),

  getSocialMetrics: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const profiles = await ctx.prisma.socialProfile.findMany({
        where: { projectId: input.projectId },
      })

      const posts = await ctx.prisma.socialPost.findMany({
        where: { projectId: input.projectId, status: 'PUBLISHED' },
      })

      const platformMetrics = profiles.map((profile) => {
        const platformPosts = posts.filter((p) => p.platform === profile.platform)
        const totalEngagement = platformPosts.reduce((sum, p) => {
          const data = p.engagementData ? JSON.parse(p.engagementData) : {}
          return sum + (data.likes || 0) + (data.comments || 0) + (data.shares || 0)
        }, 0)

        return {
          platform: profile.platform,
          username: profile.username,
          connected: profile.connected,
          postCount: platformPosts.length,
          totalEngagement,
          avgEngagement: platformPosts.length ? Math.round(totalEngagement / platformPosts.length) : 0,
        }
      })

      return {
        platforms: platformMetrics,
        totalPosts: posts.length,
        totalEngagement: platformMetrics.reduce((s, p) => s + p.totalEngagement, 0),
      }
    }),

  seedMockData: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
      })
      if (!project) throw new Error('Project not found')

      return seedMockAnalytics(ctx.prisma, input.projectId)
    }),
})
