import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateJSONWithAI } from '@/lib/ai'
import { advancePhase } from '@/lib/phase-advance'

const PAGE_DEFINITIONS = [
  { slug: 'home', title: 'Homepage', pageType: 'homepage', order: 0 },
  { slug: 'about', title: 'About Us', pageType: 'about', order: 1 },
  { slug: 'platforms', title: 'Trading Platforms', pageType: 'platforms', order: 2 },
  { slug: 'account-types', title: 'Account Types', pageType: 'account_types', order: 3 },
  { slug: 'markets/forex', title: 'Forex Markets', pageType: 'markets', order: 4 },
  { slug: 'markets/crypto', title: 'Crypto Markets', pageType: 'markets', order: 5 },
  { slug: 'markets/commodities', title: 'Commodities', pageType: 'markets', order: 6 },
  { slug: 'markets/indices', title: 'Indices', pageType: 'markets', order: 7 },
  { slug: 'pricing', title: 'Pricing & Spreads', pageType: 'pricing', order: 8 },
  { slug: 'education', title: 'Education Center', pageType: 'education', order: 9 },
  { slug: 'contact', title: 'Contact Us', pageType: 'contact', order: 10 },
  { slug: 'partners', title: 'Partners & Affiliates', pageType: 'partners', order: 11 },
  { slug: 'promotions', title: 'Promotions', pageType: 'promotions', order: 12 },
  { slug: 'analysis', title: 'Market Analysis', pageType: 'analysis', order: 13 },
  { slug: 'faq', title: 'FAQ', pageType: 'faq', order: 14 },
  { slug: 'terms', title: 'Terms & Conditions', pageType: 'legal', order: 15 },
  { slug: 'privacy', title: 'Privacy Policy', pageType: 'legal', order: 16 },
  { slug: 'risk-disclosure', title: 'Risk Disclosure', pageType: 'legal', order: 17 },
]

export const websiteRouter = router({
  get: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.website.findUnique({
        where: { projectId: input.projectId },
        include: { pages: { orderBy: { order: 'asc' } } },
      })
    }),

  generate: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
        include: { domain: true },
      })
      if (!project) throw new Error('Project not found')

      await ctx.prisma.website.update({
        where: { projectId: input.projectId },
        data: { status: 'GENERATING' },
      })

      // Generate pages
      for (const pageDef of PAGE_DEFINITIONS) {
        const content = await generateJSONWithAI(
          `Generate website page content for a ${project.niche.replace('_', ' ')} company called "${project.brandName}".

          Page: ${pageDef.title} (${pageDef.pageType})
          Domain: ${project.domain?.selectedDomain || 'example.com'}

          Return a JSON object with:
          - heroTitle: main heading (string)
          - heroSubtitle: subtitle text (string)
          - sections: array of { title: string, content: string, type: "text"|"list"|"table"|"cta" }
          - metaTitle: SEO title (60 chars max)
          - metaDescription: SEO description (160 chars max)

          Make the content professional, detailed, and specific to the trading industry.
          Include relevant trading terminology and compliance language where appropriate.`,
          `You are a professional trading company website copywriter. Write compelling, compliant content for ${project.niche.replace('_', ' ')} companies.`
        )

        let parsed
        try {
          parsed = typeof content === 'string' ? JSON.parse(content) : content
        } catch {
          parsed = {
            heroTitle: pageDef.title,
            heroSubtitle: `Welcome to ${project.brandName}`,
            sections: [{ title: pageDef.title, content: 'Content generation in progress...', type: 'text' }],
            metaTitle: `${pageDef.title} | ${project.brandName}`,
            metaDescription: `${pageDef.title} page for ${project.brandName} - professional trading services.`,
          }
        }

        await ctx.prisma.websitePage.create({
          data: {
            websiteId: (await ctx.prisma.website.findUnique({ where: { projectId: input.projectId } }))!.id,
            slug: pageDef.slug,
            title: pageDef.title,
            pageType: pageDef.pageType,
            content: JSON.stringify(parsed),
            metaTitle: parsed.metaTitle || `${pageDef.title} | ${project.brandName}`,
            metaDescription: parsed.metaDescription || '',
            status: 'generated',
            order: pageDef.order,
          },
        })
      }

      await ctx.prisma.website.update({
        where: { projectId: input.projectId },
        data: { status: 'GENERATED' },
      })

      return { success: true, pageCount: PAGE_DEFINITIONS.length }
    }),

  getPage: protectedProcedure
    .input(z.object({ pageId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.websitePage.findUnique({ where: { id: input.pageId } })
    }),

  updatePage: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
        content: z.any().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { pageId, content, ...rest } = input
      const data: Record<string, unknown> = { ...rest }
      if (content !== undefined) {
        data.content = typeof content === 'string' ? content : JSON.stringify(content)
      }
      return ctx.prisma.websitePage.update({ where: { id: pageId }, data })
    }),

  deploy: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
        include: { domain: true },
      })

      // Mock deployment
      await new Promise((r) => setTimeout(r, 1000))
      const domain = project?.domain?.selectedDomain || 'example.com'

      const result = await ctx.prisma.website.update({
        where: { projectId: input.projectId },
        data: {
          status: 'DEPLOYED',
          deployUrl: `https://${domain}`,
          cmsUrl: `https://cms.${domain}`,
        },
      })

      // Website deployed → advance to Phase 3
      await advancePhase(ctx.prisma, input.projectId, 2)

      return result
    }),
})
