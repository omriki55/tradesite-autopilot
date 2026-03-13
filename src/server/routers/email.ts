import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { getEmailTemplateList } from '@/lib/email-templates'

export const emailRouter = router({
  getTemplates: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const templates = await ctx.prisma.emailTemplate.findMany({
        where: { projectId: input.projectId },
        orderBy: { createdAt: 'desc' },
      })

      if (templates.length === 0) {
        const defaults = getEmailTemplateList()
        return {
          templates,
          defaults,
        }
      }

      return {
        templates,
        defaults: [],
      }
    }),

  createTemplate: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1),
        subject: z.string().min(1),
        body: z.string().min(1),
        type: z.string().optional(),
        variables: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.emailTemplate.create({
        data: {
          projectId: input.projectId,
          name: input.name,
          subject: input.subject,
          body: input.body,
          type: input.type || 'custom',
          variables: JSON.stringify(input.variables || []),
        },
      })
    }),

  updateTemplate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        subject: z.string().optional(),
        body: z.string().optional(),
        type: z.string().optional(),
        variables: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, variables, ...rest } = input
      return ctx.prisma.emailTemplate.update({
        where: { id },
        data: {
          ...rest,
          ...(variables !== undefined ? { variables: JSON.stringify(variables) } : {}),
        },
      })
    }),

  deleteTemplate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.emailTemplate.delete({
        where: { id: input.id },
      })
    }),

  getCampaigns: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.emailCampaign.findMany({
        where: { projectId: input.projectId },
        orderBy: { createdAt: 'desc' },
      })
    }),

  createCampaign: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1),
        type: z.enum(['broadcast', 'drip', 'automated']),
        steps: z.string(), // JSON string of step array
        triggerEvent: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.emailCampaign.create({
        data: {
          projectId: input.projectId,
          name: input.name,
          type: input.type,
          steps: input.steps,
          triggerEvent: input.triggerEvent,
        },
      })
    }),

  updateCampaign: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        status: z.enum(['draft', 'active', 'paused', 'completed']).optional(),
        steps: z.string().optional(),
        triggerEvent: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input

      // When activating a campaign, reset stats
      const data: Record<string, unknown> = { ...rest }
      if (input.status === 'active') {
        data.stats = JSON.stringify({ sent: 0, opened: 0, clicked: 0 })
      }

      return ctx.prisma.emailCampaign.update({
        where: { id },
        data,
      })
    }),

  getSubscribers: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        status: z.string().optional(),
        limit: z.number().min(1).max(200).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.emailSubscriber.findMany({
        where: {
          projectId: input.projectId,
          ...(input.status ? { status: input.status } : {}),
        },
        orderBy: { subscribedAt: 'desc' },
        take: input.limit,
        skip: input.offset,
      })
    }),

  importSubscribers: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        subscribers: z.array(
          z.object({
            email: z.string().email(),
            name: z.string().optional(),
            tags: z.array(z.string()).optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let imported = 0
      let skipped = 0

      for (const sub of input.subscribers) {
        try {
          await ctx.prisma.emailSubscriber.upsert({
            where: {
              projectId_email: {
                projectId: input.projectId,
                email: sub.email,
              },
            },
            create: {
              projectId: input.projectId,
              email: sub.email,
              name: sub.name || null,
              tags: JSON.stringify(sub.tags || []),
              source: 'import',
            },
            update: {}, // Skip duplicates — no update
          })
          imported++
        } catch {
          skipped++
        }
      }

      return { imported, skipped }
    }),

  importFromLeads: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const leads = await ctx.prisma.lead.findMany({
        where: { projectId: input.projectId },
      })

      let imported = 0
      let skipped = 0

      for (const lead of leads) {
        try {
          await ctx.prisma.emailSubscriber.upsert({
            where: {
              projectId_email: {
                projectId: input.projectId,
                email: lead.email,
              },
            },
            create: {
              projectId: input.projectId,
              email: lead.email,
              name: lead.name || null,
              source: 'landing_page',
              tags: JSON.stringify([]),
            },
            update: {}, // Skip existing
          })
          imported++
        } catch {
          skipped++
        }
      }

      return { imported, skipped }
    }),

  sendTest: protectedProcedure
    .input(
      z.object({
        templateId: z.string(),
        recipientEmail: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      return {
        success: true,
        message: `Test email sent to ${input.recipientEmail} (mock mode)`,
      }
    }),

  getStats: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const totalSubscribers = await ctx.prisma.emailSubscriber.count({
        where: { projectId: input.projectId },
      })

      const activeSubscribers = await ctx.prisma.emailSubscriber.count({
        where: { projectId: input.projectId, status: 'active' },
      })

      const totalCampaigns = await ctx.prisma.emailCampaign.count({
        where: { projectId: input.projectId },
      })

      const activeCampaigns = await ctx.prisma.emailCampaign.count({
        where: { projectId: input.projectId, status: 'active' },
      })

      return {
        totalSubscribers,
        activeSubscribers,
        totalCampaigns,
        activeCampaigns,
      }
    }),
})
