import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const timelineRouter = router({
  getTimeline: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.timelineEvent.findMany({
        where: { projectId: input.projectId },
        orderBy: { scheduledDate: 'asc' },
      })
    }),

  updateMilestone: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(['pending', 'in_progress', 'completed', 'skipped']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.timelineEvent.update({
        where: { id: input.id },
        data: {
          status: input.status,
          completedDate: input.status === 'completed' ? new Date() : null,
        },
      })
    }),

  getKPIs: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
        include: {
          website: { select: { status: true } },
          seoConfig: { select: { seoScore: true } },
          _count: {
            select: {
              socialProfiles: true,
              socialPosts: { where: { status: 'PUBLISHED' } },
            },
          },
        },
      })

      const milestones = await ctx.prisma.timelineEvent.findMany({
        where: { projectId: input.projectId },
      })
      const completed = milestones.filter((m) => m.status === 'completed').length
      const total = milestones.length

      // Mock analytics data
      const daysSinceCreation = project
        ? Math.floor((Date.now() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        : 0

      return {
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        milestonesCompleted: completed,
        milestonesTotal: total,
        websiteStatus: project?.website?.status || 'PENDING',
        seoScore: project?.seoConfig?.seoScore || 0,
        socialProfiles: project?._count.socialProfiles || 0,
        postsPublished: project?._count.socialPosts || 0,
        daysSinceCreation,
        daysRemaining: Math.max(90 - daysSinceCreation, 0),
        // Mock traffic & leads
        estimatedTraffic: Math.floor(daysSinceCreation * 5.5),
        estimatedLeads: Math.floor(daysSinceCreation * 0.6),
        followerGrowth: Math.floor(daysSinceCreation * 12),
      }
    }),
})
