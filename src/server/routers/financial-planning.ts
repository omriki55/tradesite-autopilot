import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const financialPlanningRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        status: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.financialPlanningClient.findMany({
        where: {
          projectId: input.projectId,
          ...(input.status ? { status: input.status } : {}),
        },
        orderBy: { createdAt: 'desc' },
      })
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const client = await ctx.prisma.financialPlanningClient.findFirst({
        where: { id: input.id },
      })
      if (!client) throw new Error('Client not found')
      return client
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.financialPlanningClient.create({
        data: {
          projectId: input.projectId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          phase: 1,
          status: 'active',
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        email: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        notes: z.string().optional().nullable(),
        phase: z.number().min(1).max(3).optional(),
        status: z.enum(['active', 'completed', 'paused']).optional(),
        cashFlow: z.string().optional().nullable(),
        balanceSheet: z.string().optional().nullable(),
        pensionData: z.string().optional().nullable(),
        wealthProjection: z.string().optional().nullable(),
        educationProgress: z.string().optional().nullable(),
        assetAllocation: z.string().optional().nullable(),
        meetingNotes: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.financialPlanningClient.update({
        where: { id },
        data,
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.financialPlanningClient.delete({
        where: { id: input.id },
      })
    }),

  getStats: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [total, phase1, phase2, phase3, completed] = await Promise.all([
        ctx.prisma.financialPlanningClient.count({
          where: { projectId: input.projectId },
        }),
        ctx.prisma.financialPlanningClient.count({
          where: { projectId: input.projectId, phase: 1 },
        }),
        ctx.prisma.financialPlanningClient.count({
          where: { projectId: input.projectId, phase: 2 },
        }),
        ctx.prisma.financialPlanningClient.count({
          where: { projectId: input.projectId, phase: 3 },
        }),
        ctx.prisma.financialPlanningClient.count({
          where: { projectId: input.projectId, status: 'completed' },
        }),
      ])

      return { total, phase1, phase2, phase3, completed }
    }),
})
