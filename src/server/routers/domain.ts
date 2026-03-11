import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateJSONWithAI } from '@/lib/ai'
import { advancePhase } from '@/lib/phase-advance'

interface DomainSuggestion {
  domain: string
  score: number
  available: boolean
  tld: string
  price: number
  keywordRelevance: number
  brandability: number
  lengthPenalty: number
  seoScore: number
}

export const domainRouter = router({
  getSuggestions: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const domain = await ctx.prisma.domain.findUnique({
        where: { projectId: input.projectId },
      })
      return domain
    }),

  generateSuggestions: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        brandName: z.string(),
        niche: z.string(),
        targetMarkets: z.array(z.string()),
        budgetMax: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.domain.update({
        where: { projectId: input.projectId },
        data: { status: 'SEARCHING' },
      })

      const suggestions = await generateJSONWithAI<DomainSuggestion[]>(
        `Generate 15 domain name suggestions for a ${input.niche.replace('_', ' ')} company called "${input.brandName}" targeting ${input.targetMarkets.join(', ')}.

        For each domain, provide:
        - domain: full domain including TLD
        - score: overall score 0-100
        - available: boolean (randomly true for ~70%)
        - tld: the TLD used
        - price: realistic price in USD
        - keywordRelevance: score 0-100
        - brandability: score 0-100
        - lengthPenalty: 0-20 (higher = worse, for long domains)
        - seoScore: score 0-100

        Use TLDs: .com, .io, .trade, .finance, .net, .co
        Prioritize .com domains. Mix brand-exact, keyword-rich, and creative options.
        Return a JSON array.`,
        'You are a domain name expert specializing in the trading and finance industry.'
      )

      const sorted = suggestions.sort((a, b) => b.score - a.score)

      await ctx.prisma.domain.update({
        where: { projectId: input.projectId },
        data: {
          suggestions: JSON.stringify(sorted),
          status: 'FOUND',
        },
      })

      return sorted
    }),

  checkAvailability: protectedProcedure
    .input(z.object({ domain: z.string() }))
    .mutation(async () => {
      // Mock WHOIS check
      await new Promise((r) => setTimeout(r, 500))
      return {
        available: Math.random() > 0.3,
        registrar: null,
        expiresAt: null,
        blacklisted: false,
        spamScore: Math.floor(Math.random() * 10),
      }
    }),

  selectDomain: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        domain: z.string(),
        score: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.domain.update({
        where: { projectId: input.projectId },
        data: {
          selectedDomain: input.domain,
          score: input.score,
          status: 'REGISTERED',
          registrar: 'mock-registrar',
          registeredAt: new Date(),
        },
      })

      // Domain selected → advance to Phase 2
      await advancePhase(ctx.prisma, input.projectId, 1)

      return result
    }),
})
