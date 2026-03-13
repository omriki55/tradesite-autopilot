import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateJSONWithAI } from '@/lib/ai'

export const metaRouter = router({
  listAccounts: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.metaAdAccount.findMany({
        where: { projectId: input.projectId },
        include: { _count: { select: { campaigns: true } } },
        orderBy: { createdAt: 'desc' },
      })
    }),

  createAccount: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      brandName: z.string().min(1),
      accountId: z.string().optional(),
      pixelId: z.string().optional(),
      dailyBudget: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.metaAdAccount.create({ data: input })
    }),

  deleteAccount: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.metaCampaign.deleteMany({ where: { accountId: input.id } })
      return ctx.prisma.metaAdAccount.delete({ where: { id: input.id } })
    }),

  listCampaigns: protectedProcedure
    .input(z.object({ projectId: z.string(), accountId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.metaCampaign.findMany({
        where: {
          account: { projectId: input.projectId },
          ...(input.accountId ? { accountId: input.accountId } : {}),
        },
        include: { account: { select: { brandName: true } } },
        orderBy: { createdAt: 'desc' },
      })
    }),

  createCampaign: protectedProcedure
    .input(z.object({
      adAccountId: z.string(),
      name: z.string().min(1),
      type: z.enum(['retargeting', 'lookalike', 'retention', 'acquisition', 'awareness']),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.metaCampaign.create({
        data: { accountId: input.adAccountId, name: input.name, type: input.type },
      })
    }),

  updateCampaignStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['draft', 'active', 'paused', 'completed']),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.metaCampaign.update({
        where: { id: input.id },
        data: { status: input.status },
      })
    }),

  deleteCampaign: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.metaCampaign.delete({ where: { id: input.id } })
    }),

  getStats: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const accounts = await ctx.prisma.metaAdAccount.count({ where: { projectId: input.projectId } })
      const campaigns = await ctx.prisma.metaCampaign.findMany({
        where: { account: { projectId: input.projectId } },
        select: { impressions: true, clicks: true, conversions: true, spend: true },
      })
      const totalSpend = campaigns.reduce((a, c) => {
        const n = parseFloat((c.spend || '$0').replace(/[$,]/g, ''))
        return a + (isNaN(n) ? 0 : n)
      }, 0)
      return {
        accounts,
        totalCampaigns: campaigns.length,
        totalImpressions: campaigns.reduce((a, c) => a + c.impressions, 0),
        totalClicks: campaigns.reduce((a, c) => a + c.clicks, 0),
        totalConversions: campaigns.reduce((a, c) => a + c.conversions, 0),
        totalSpend,
      }
    }),

  generateCampaignStrategy: protectedProcedure
    .input(z.object({
      brandName: z.string(),
      niche: z.string(),
      campaignType: z.string(),
      budget: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await generateJSONWithAI<{
        campaignName: string
        objective: string
        audienceDescription: string
        targeting: { age: string; interests: string[]; behaviors: string[]; locations: string[] }
        adFormats: string[]
        adCopyVariants: Array<{ headline: string; primaryText: string; cta: string }>
        estimatedReach: string
        estimatedCPC: string
        estimatedROAS: string
        kpis: string[]
        optimizationTips: string[]
      }>(
        `Generate a complete Meta advertising campaign strategy for "${input.brandName}", a ${input.niche} brand.
        Campaign type: ${input.campaignType}. Budget: ${input.budget}.
        Return JSON with: campaignName, objective, audienceDescription, targeting (age, interests[], behaviors[], locations[]), adFormats[], adCopyVariants[{headline, primaryText, cta}], estimatedReach, estimatedCPC, estimatedROAS, kpis[], optimizationTips[].`,
        `You are a Meta advertising expert creating campaign strategies for ${input.niche} businesses.`
      )
      return result
    }),
})
