import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateJSONWithAI } from '@/lib/ai'

function generateReferralCode(brandName: string): string {
  const prefix = brandName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)
  const suffix = crypto.randomUUID().slice(0, 8)
  return `${prefix}-${suffix}`
}

export const affiliatesRouter = router({
  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.affiliate.findMany({
        where: { projectId: input.projectId },
        include: {
          _count: { select: { referrals: true } },
        },
        orderBy: { totalEarned: 'desc' },
      })
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.affiliate.findUnique({
        where: { id: input.id },
        include: { referrals: true },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1),
        email: z.string().email(),
        commissionType: z.enum(['cpa', 'revenue_share', 'hybrid']),
        commissionRate: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
      })
      if (!project) throw new Error('Project not found')

      const code = generateReferralCode(project.brandName)

      return ctx.prisma.affiliate.create({
        data: {
          projectId: input.projectId,
          name: input.name,
          email: input.email,
          code,
          commissionType: input.commissionType,
          commissionRate: input.commissionRate,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        commissionType: z.enum(['cpa', 'revenue_share', 'hybrid']).optional(),
        commissionRate: z.number().min(0).optional(),
        status: z.enum(['active', 'suspended', 'pending']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.affiliate.update({
        where: { id },
        data,
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete referrals first (cascade), then affiliate
      await ctx.prisma.referral.deleteMany({
        where: { affiliateId: input.id },
      })
      return ctx.prisma.affiliate.delete({
        where: { id: input.id },
      })
    }),

  getReferrals: protectedProcedure
    .input(z.object({ affiliateId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.referral.findMany({
        where: { affiliateId: input.affiliateId },
        orderBy: { createdAt: 'desc' },
      })
    }),

  createReferral: protectedProcedure
    .input(
      z.object({
        affiliateId: z.string(),
        email: z.string().email(),
        status: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const status = input.status || 'clicked'

      // Determine commission based on status
      let commission = 0
      if (status === 'deposited' || status === 'active') {
        const affiliate = await ctx.prisma.affiliate.findUnique({
          where: { id: input.affiliateId },
        })
        if (affiliate) {
          // Simple commission calc: CPA = flat rate, revenue_share = percentage-based placeholder
          commission = affiliate.commissionType === 'cpa'
            ? affiliate.commissionRate
            : affiliate.commissionRate * 100 // placeholder for revenue share
        }
      }

      const referral = await ctx.prisma.referral.create({
        data: {
          affiliateId: input.affiliateId,
          email: input.email,
          status,
          commission,
        },
      })

      // Increment totalReferrals and add commission to totalEarned
      await ctx.prisma.affiliate.update({
        where: { id: input.affiliateId },
        data: {
          totalReferrals: { increment: 1 },
          ...(commission > 0 ? { totalEarned: { increment: commission } } : {}),
        },
      })

      return referral
    }),

  getStats: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const totalAffiliates = await ctx.prisma.affiliate.count({
        where: { projectId: input.projectId },
      })

      const activeAffiliates = await ctx.prisma.affiliate.count({
        where: { projectId: input.projectId, status: 'active' },
      })

      const affiliates = await ctx.prisma.affiliate.findMany({
        where: { projectId: input.projectId },
        select: { totalReferrals: true, totalEarned: true },
      })

      const totalReferrals = affiliates.reduce((sum, a) => sum + a.totalReferrals, 0)
      const totalCommissions = affiliates.reduce((sum, a) => sum + a.totalEarned, 0)

      const topAffiliates = await ctx.prisma.affiliate.findMany({
        where: { projectId: input.projectId },
        orderBy: { totalEarned: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          code: true,
          totalEarned: true,
          totalReferrals: true,
          status: true,
        },
      })

      return {
        totalAffiliates,
        activeAffiliates,
        totalReferrals,
        totalCommissions,
        topAffiliates,
      }
    }),

  generateMaterials: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
        include: { domain: { select: { selectedDomain: true } } },
      })
      if (!project) throw new Error('Project not found')

      const website = project.domain?.selectedDomain || 'example.com'

      const materials = await generateJSONWithAI<{
        banners: Array<{ headline: string; subtext: string; ctaText: string }>
        socialPosts: Array<{ platform: string; content: string; hashtags: string[] }>
        emailTemplates: Array<{ subject: string; body: string; type: string }>
      }>(
        `Generate affiliate promotional materials for "${project.brandName}", a ${project.niche.replace('_', ' ')} brand.
        Website: ${website}

        Return a JSON object with:
        - banners: array of 3 objects, each with headline (short, punchy), subtext (supporting copy), and ctaText (call-to-action button text)
        - socialPosts: array of 3 objects, each with platform (e.g., "Instagram", "Twitter", "LinkedIn"), content (post text), and hashtags (array of strings)
        - emailTemplates: array of 3 objects, each with subject (email subject line), body (email body text with {{referralLink}} placeholder), and type (e.g., "introduction", "promotion", "follow_up")

        The materials should help affiliates promote the brand and drive sign-ups through their referral links.
        Include {{referralLink}} placeholder in social posts and email bodies.
        Content should be professional, compliant, and include risk disclaimers where appropriate.`,
        `You are a marketing specialist creating affiliate promotional materials for a ${project.niche.replace('_', ' ')}.`
      )

      return materials
    }),
})
