import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const leadsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        status: z.string().optional(),
        source: z.string().optional(),
        limit: z.number().min(1).max(500).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.lead.findMany({
        where: {
          projectId: input.projectId,
          ...(input.status ? { status: input.status } : {}),
          ...(input.source ? { source: input.source } : {}),
        },
        include: {
          landingPage: {
            select: { id: true, title: true, slug: true, template: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.offset,
      })
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.findFirst({
        where: { id: input.id },
        include: {
          landingPage: {
            select: { id: true, title: true, slug: true, template: true },
          },
        },
      })
      if (!lead) throw new Error('Lead not found')
      return lead
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        email: z.string().email(),
        name: z.string().optional(),
        phone: z.string().optional(),
        source: z.string().optional(),
        landingPageId: z.string().optional(),
        data: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.create({
        data: {
          projectId: input.projectId,
          email: input.email,
          name: input.name,
          phone: input.phone,
          source: input.source ?? 'manual',
          landingPageId: input.landingPageId,
          data: JSON.stringify(input.data ?? {}),
          status: 'new',
        },
      })

      if (input.landingPageId) {
        await ctx.prisma.landingPage.update({
          where: { id: input.landingPageId },
          data: { conversions: { increment: 1 } },
        })
      }

      return lead
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.lead.update({
        where: { id: input.id },
        data: { status: input.status },
      })
    }),

  addNote: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        notes: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.findFirst({
        where: { id: input.id },
      })
      if (!lead) throw new Error('Lead not found')

      const timestamp = new Date().toISOString()
      const newNote = `[${timestamp}] ${input.notes}`
      const updatedNotes = lead.notes
        ? `${lead.notes}\n${newNote}`
        : newNote

      return ctx.prisma.lead.update({
        where: { id: input.id },
        data: { notes: updatedNotes },
      })
    }),

  setFollowUp: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        followUpDate: z.string().datetime(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.lead.update({
        where: { id: input.id },
        data: { followUpDate: new Date(input.followUpDate) },
      })
    }),

  export: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const leads = await ctx.prisma.lead.findMany({
        where: { projectId: input.projectId },
        include: {
          landingPage: {
            select: { title: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return leads.map((lead) => ({
        id: lead.id,
        email: lead.email,
        name: lead.name ?? '',
        phone: lead.phone ?? '',
        source: lead.source,
        status: lead.status,
        landingPage: lead.landingPage?.title ?? '',
        landingPageSlug: lead.landingPage?.slug ?? '',
        notes: lead.notes ?? '',
        followUpDate: lead.followUpDate?.toISOString() ?? '',
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
      }))
    }),

  getStats: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const now = new Date()
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startOfWeek = new Date(startOfToday)
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

      const [total, byStatusRaw, todayCount, thisWeekCount] = await Promise.all([
        ctx.prisma.lead.count({
          where: { projectId: input.projectId },
        }),
        ctx.prisma.lead.groupBy({
          by: ['status'],
          where: { projectId: input.projectId },
          _count: { status: true },
        }),
        ctx.prisma.lead.count({
          where: {
            projectId: input.projectId,
            createdAt: { gte: startOfToday },
          },
        }),
        ctx.prisma.lead.count({
          where: {
            projectId: input.projectId,
            createdAt: { gte: startOfWeek },
          },
        }),
      ])

      const statusMap: Record<string, number> = {
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0,
        lost: 0,
      }

      for (const row of byStatusRaw) {
        statusMap[row.status] = row._count.status
      }

      const conversionRate = total > 0
        ? Math.round((statusMap.converted / total) * 10000) / 100
        : 0

      return {
        total,
        byStatus: statusMap as {
          new: number
          contacted: number
          qualified: number
          converted: number
          lost: number
        },
        todayCount,
        thisWeekCount,
        conversionRate,
      }
    }),
})
