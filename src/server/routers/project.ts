import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { seedContentBank, seedMockAnalytics } from '@/lib/content-seeder'

export const projectRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.project.findMany({
      where: { userId: ctx.userId },
      include: {
        domain: { select: { selectedDomain: true, status: true } },
        website: { select: { status: true, deployUrl: true, templateId: true } },
        seoConfig: { select: { seoScore: true, status: true } },
        _count: { select: { socialProfiles: true, socialPosts: true, contentBank: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.id, userId: ctx.userId },
        include: {
          domain: true,
          website: { include: { pages: { orderBy: { order: 'asc' } } } },
          seoConfig: true,
          socialProfiles: true,
          timeline: { orderBy: { scheduledDate: 'asc' } },
          _count: { select: { socialPosts: true, contentBank: true } },
        },
      })
      if (!project) throw new Error('Project not found')
      return project
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        brandName: z.string().min(1),
        niche: z.string(),
        targetMarkets: z.array(z.string()),
        brandColors: z.object({
          primary: z.string(),
          secondary: z.string(),
          accent: z.string(),
        }).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: {
          name: input.name,
          brandName: input.brandName,
          niche: input.niche,
          targetMarkets: JSON.stringify(input.targetMarkets),
          userId: ctx.userId,
          brandColors: JSON.stringify(input.brandColors || { primary: '#1E40AF', secondary: '#1E293B', accent: '#F59E0B' }),
        },
      })

      // Create related records
      await Promise.all([
        ctx.prisma.domain.create({ data: { projectId: project.id } }),
        ctx.prisma.website.create({ data: { projectId: project.id, templateType: input.niche } }),
        ctx.prisma.seoConfig.create({ data: { projectId: project.id } }),
      ])

      // Create 90-day timeline
      const milestones = [
        { phase: 1, milestone: 'Domain search & scoring', day: 1 },
        { phase: 1, milestone: 'Domain registration', day: 2 },
        { phase: 2, milestone: 'Website template selected', day: 3 },
        { phase: 2, milestone: 'Website generation started', day: 4 },
        { phase: 2, milestone: 'All pages generated', day: 5 },
        { phase: 2, milestone: 'Website deployed & live', day: 7 },
        { phase: 3, milestone: 'SEO audit complete', day: 8 },
        { phase: 3, milestone: 'Keyword strategy mapped', day: 10 },
        { phase: 3, milestone: 'GEO pages created', day: 12 },
        { phase: 3, milestone: 'Search Console connected', day: 14 },
        { phase: 4, milestone: 'Social profiles created', day: 15 },
        { phase: 4, milestone: 'Social accounts connected', day: 17 },
        { phase: 4, milestone: 'Content bank generated', day: 18 },
        { phase: 4, milestone: 'Profiles fully configured', day: 21 },
        { phase: 5, milestone: 'Daily posting begins', day: 22 },
        { phase: 5, milestone: 'First engagement report', day: 30 },
        { phase: 5, milestone: 'Content optimization round 1', day: 45 },
        { phase: 6, milestone: 'Growth phase midpoint', day: 60 },
        { phase: 6, milestone: 'A/B testing initiated', day: 70 },
        { phase: 6, milestone: 'Final performance report', day: 85 },
        { phase: 6, milestone: 'Client handoff complete', day: 90 },
      ]

      const now = new Date()
      await ctx.prisma.timelineEvent.createMany({
        data: milestones.map((m, i) => ({
          projectId: project.id,
          phase: m.phase,
          milestone: m.milestone,
          scheduledDate: new Date(now.getTime() + m.day * 24 * 60 * 60 * 1000),
          order: i,
        })),
      })

      // Seed content bank with best-practice templates
      try {
        await seedContentBank(ctx.prisma, project.id, input.niche)
      } catch {
        // Non-critical — don't fail project creation
      }

      // Seed mock analytics data
      try {
        await seedMockAnalytics(ctx.prisma, project.id)
      } catch {
        // Non-critical
      }

      return project
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        brandName: z.string().optional(),
        status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED']).optional(),
        currentPhase: z.number().min(1).max(6).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.project.update({
        where: { id, userId: ctx.userId },
        data,
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.project.delete({
        where: { id: input.id, userId: ctx.userId },
      })
    }),
})
