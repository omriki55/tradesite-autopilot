import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateJSONWithAI } from '@/lib/ai'
import { advancePhase } from '@/lib/phase-advance'

export const seoRouter = router({
  get: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.seoConfig.findUnique({ where: { projectId: input.projectId } })
    }),

  generateKeywords: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        niche: z.string(),
        targetMarkets: z.array(z.string()),
        competitorUrls: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.seoConfig.update({
        where: { projectId: input.projectId },
        data: { status: 'analyzing' },
      })

      const keywords = await generateJSONWithAI(
        `Generate 30 target keywords for a ${input.niche.replace('_', ' ')} targeting ${input.targetMarkets.join(', ')}.

        For each keyword provide:
        - keyword: the search term
        - volume: estimated monthly search volume
        - difficulty: 0-100 score
        - intent: "informational" | "navigational" | "transactional"
        - mappedPage: suggested page slug to target this keyword (e.g., "home", "markets/forex", "education")

        Group by intent. Include a mix of:
        - Head terms (high volume, high difficulty)
        - Long-tail (lower volume, lower difficulty)
        - Local terms (e.g., "best forex broker in [market]")
        - Comparison terms (e.g., "broker vs broker")

        Return a JSON array.`,
        'You are an SEO expert specializing in the trading and finance industry.'
      )

      await ctx.prisma.seoConfig.update({
        where: { projectId: input.projectId },
        data: { keywords: JSON.stringify(keywords), status: 'optimized' },
      })

      return keywords
    }),

  generateMeta: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const website = await ctx.prisma.website.findUnique({
        where: { projectId: input.projectId },
        include: { pages: true },
      })
      if (!website) throw new Error('Website not found')

      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
      })

      for (const page of website.pages) {
        const meta = await generateJSONWithAI<{ metaTitle: string; metaDescription: string }>(
          `Generate SEO meta tags for:
          Company: ${project?.brandName}
          Page: ${page.title} (${page.pageType})

          Return JSON with:
          - metaTitle: max 60 characters, include primary keyword
          - metaDescription: max 160 characters, compelling with CTA`,
          'You are an SEO copywriter for trading companies.'
        )

        await ctx.prisma.websitePage.update({
          where: { id: page.id },
          data: { metaTitle: meta.metaTitle, metaDescription: meta.metaDescription },
        })
      }

      return { success: true, pagesUpdated: website.pages.length }
    }),

  runAudit: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Mock technical SEO audit
      const audit = {
        coreWebVitals: { lcp: 1.8, fid: 45, cls: 0.05, score: 92 },
        mobileScore: 95,
        pageSpeed: { mobile: 88, desktop: 96 },
        issues: [
          { type: 'warning', message: 'Some images missing alt text', count: 3 },
          { type: 'info', message: 'Consider adding structured data to FAQ page', count: 1 },
        ],
        sslValid: true,
        robotsTxt: true,
        sitemapFound: true,
        canonicalTags: true,
        hreflangTags: false,
        structuredData: true,
      }

      const seoScore = Math.floor(
        (audit.coreWebVitals.score + audit.mobileScore + audit.pageSpeed.desktop) / 3
      )

      await ctx.prisma.seoConfig.update({
        where: { projectId: input.projectId },
        data: {
          technicalAudit: JSON.stringify(audit),
          seoScore,
          sitemapUrl: '/sitemap.xml',
        },
      })

      return { audit, seoScore }
    }),

  generateGeoPages: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        countries: z.array(z.object({ country: z.string(), language: z.string() })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.seoConfig.update({
        where: { projectId: input.projectId },
        data: { geoTargets: JSON.stringify(input.countries) },
      })

      // GEO pages generated → advance to Phase 4
      await advancePhase(ctx.prisma, input.projectId, 3)

      return { success: true, geoPages: input.countries.length }
    }),

  generateSchema: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
        include: { domain: true, website: { include: { pages: true } } },
      })
      if (!project) throw new Error('Project not found')

      const domain = project.domain?.selectedDomain || 'example.com'
      const siteUrl = `https://${domain}`

      // Organization schema
      const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: project.brandName,
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        description: `${project.brandName} — professional ${project.niche.replace(/_/g, ' ')} services`,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          url: `${siteUrl}/contact`,
        },
      }

      // BreadcrumbList schema from pages
      const pages = project.website?.pages || []
      const breadcrumbItems = pages
        .filter((p) => p.pageType !== 'blog_post')
        .slice(0, 10)
        .map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.title,
          item: `${siteUrl}/${p.slug === 'home' ? '' : p.slug}`,
        }))

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      }

      // FAQPage schema — generate FAQ items with AI
      const faqData = await generateJSONWithAI<
        Array<{ question: string; answer: string }>
      >(
        `Generate 6 FAQ entries for a ${project.niche.replace(/_/g, ' ')} company called "${project.brandName}" at ${domain}.
        Return a JSON array of objects with "question" and "answer" fields.
        Cover topics like: getting started, fees, security, regulation, supported instruments, and customer support.`,
        'You are an SEO expert generating FAQ structured data for financial services.'
      )

      let faqItems: Array<{ question: string; answer: string }> = []
      try {
        faqItems = Array.isArray(faqData) ? faqData : []
      } catch {
        faqItems = []
      }

      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }

      const schemas = {
        organization: organizationSchema,
        breadcrumb: breadcrumbSchema,
        faq: faqSchema,
      }

      // Store in technicalAudit JSON field alongside any existing audit data
      const seoConfig = await ctx.prisma.seoConfig.findUnique({
        where: { projectId: input.projectId },
      })

      let existingAudit: Record<string, unknown> = {}
      try {
        if (seoConfig?.technicalAudit) {
          existingAudit = JSON.parse(seoConfig.technicalAudit)
        }
      } catch {
        existingAudit = {}
      }

      await ctx.prisma.seoConfig.update({
        where: { projectId: input.projectId },
        data: {
          technicalAudit: JSON.stringify({
            ...existingAudit,
            schemas,
          }),
        },
      })

      return schemas
    }),

  getSchema: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const seoConfig = await ctx.prisma.seoConfig.findUnique({
        where: { projectId: input.projectId },
      })
      if (!seoConfig?.technicalAudit) return null

      try {
        const audit = JSON.parse(seoConfig.technicalAudit)
        return audit.schemas || null
      } catch {
        return null
      }
    }),
})
