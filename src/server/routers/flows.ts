import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateJSONWithAI } from '@/lib/ai'

export const flowsRouter = router({
  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.marketingFlow.findMany({
        where: { projectId: input.projectId },
        include: { _count: { select: { leads: true } } },
        orderBy: { createdAt: 'desc' },
      })
    }),

  create: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      name: z.string().min(1),
      flowType: z.enum(['affiliate_lead', 'whatsapp_sequence', 'email_nurture', 'sms_campaign']),
      totalDays: z.number().default(30),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.marketingFlow.create({ data: input })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.flowLead.deleteMany({ where: { flowId: input.id } })
      return ctx.prisma.marketingFlow.delete({ where: { id: input.id } })
    }),

  getStats: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const flows = await ctx.prisma.marketingFlow.findMany({
        where: { projectId: input.projectId },
      })
      const leads = await ctx.prisma.flowLead.findMany({
        where: { flow: { projectId: input.projectId } },
        select: { status: true },
      })
      return {
        totalFlows: flows.length,
        activeFlows: flows.filter(f => f.status === 'active').length,
        totalLeads: leads.length,
        interested: leads.filter(l => l.status === 'interested').length,
        converted: leads.filter(l => l.status === 'converted').length,
      }
    }),

  listLeads: protectedProcedure
    .input(z.object({ flowId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.flowLead.findMany({
        where: { flowId: input.flowId },
        orderBy: { createdAt: 'desc' },
      })
    }),

  addLead: protectedProcedure
    .input(z.object({
      flowId: z.string(),
      name: z.string().min(1),
      phone: z.string().optional(),
      email: z.string().optional(),
      source: z.string().default('affiliate'),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.flowLead.create({ data: input })
    }),

  updateLeadStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['new', 'contacted', 'interested', 'not_interested', 'converted', 'lost']),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.flowLead.update({
        where: { id: input.id },
        data: { status: input.status },
      })
    }),

  generateFlow: protectedProcedure
    .input(z.object({
      flowId: z.string(),
      brandName: z.string(),
      flowType: z.string(),
      niche: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await generateJSONWithAI<{ steps: Array<{ day: number; channel: string; action: string; description: string }> }>(
        `Generate a 30-day marketing flow for "${input.brandName}", a ${input.niche} brand.
        Flow type: ${input.flowType.replace('_', ' ')}.
        Return JSON: { "steps": [{ "day": 0, "channel": "whatsapp|email|sms|call|crm|meta", "action": "short action title", "description": "detailed description" }] }
        Include 10-14 steps covering: welcome, qualification, follow-up, nurturing, retargeting, and final push.`,
        `You are a marketing automation expert designing lead nurturing flows for ${input.niche} companies.`
      )

      await ctx.prisma.marketingFlow.update({
        where: { id: input.flowId },
        data: { steps: JSON.stringify(result.steps), status: 'active' },
      })

      return result
    }),
})
