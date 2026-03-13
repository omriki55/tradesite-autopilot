import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateJSONWithAI } from '@/lib/ai'
import { getLandingTemplateList } from '@/lib/landing-templates'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const landingRouter = router({
  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.landingPage.findMany({
        where: { projectId: input.projectId },
        include: {
          _count: { select: { leads: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const page = await ctx.prisma.landingPage.findFirst({
        where: { id: input.id },
        include: { leads: { orderBy: { createdAt: 'desc' } } },
      })
      if (!page) throw new Error('Landing page not found')
      return page
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string().min(1),
        template: z.string(),
        headline: z.string().min(1),
        subheadline: z.string().optional(),
        formFields: z.array(
          z.object({
            name: z.string(),
            type: z.string(),
            required: z.boolean(),
            placeholder: z.string().optional(),
          })
        ).optional(),
        ctaText: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = generateSlug(input.title)

      return ctx.prisma.landingPage.create({
        data: {
          projectId: input.projectId,
          title: input.title,
          slug,
          template: input.template,
          headline: input.headline,
          subheadline: input.subheadline,
          formFields: JSON.stringify(input.formFields ?? []),
          ctaText: input.ctaText ?? 'Get Started',
          status: 'draft',
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        headline: z.string().optional(),
        subheadline: z.string().optional(),
        content: z.string().optional(),
        formFields: z.array(
          z.object({
            name: z.string(),
            type: z.string(),
            required: z.boolean(),
            placeholder: z.string().optional(),
          })
        ).optional(),
        ctaText: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, formFields, content, ...rest } = input

      const existing = await ctx.prisma.landingPage.findFirst({
        where: { id },
      })
      if (!existing) throw new Error('Landing page not found')

      const data: Record<string, unknown> = { ...rest }

      if (formFields !== undefined) {
        data.formFields = JSON.stringify(formFields)
      }

      if (content !== undefined) {
        data.content = content
      }

      if (input.status === 'published' && existing.status !== 'published') {
        data.publishedAt = new Date()
      }

      return ctx.prisma.landingPage.update({
        where: { id },
        data,
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete associated leads first, then the landing page
      await ctx.prisma.lead.deleteMany({
        where: { landingPageId: input.id },
      })

      return ctx.prisma.landingPage.delete({
        where: { id: input.id },
      })
    }),

  getTemplates: protectedProcedure
    .query(async () => {
      return getLandingTemplateList()
    }),

  generateContent: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        template: z.string(),
        headline: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
      })
      if (!project) throw new Error('Project not found')

      const templateDescriptions: Record<string, string> = {
        lead_magnet: 'a lead magnet page offering a free resource (e.g., ebook, guide, checklist) in exchange for contact info',
        webinar: 'a webinar registration page with event details, speaker info, and signup form',
        demo: 'a product demo request page showcasing key features and benefits',
        promotion: 'a promotional landing page with a special offer, urgency elements, and CTA',
        contest: 'a contest/giveaway page with prize details, rules, and entry form',
        comparison: 'a comparison page showing how the product stacks up against competitors',
      }

      const templateContext = templateDescriptions[input.template] || `a ${input.template} landing page`

      const content = await generateJSONWithAI<{
        hero: { title: string; subtitle: string; ctaText: string }
        sections: Array<{
          type: string
          title: string
          content: string
          items?: Array<{ title: string; description: string }>
        }>
        socialProof?: { headline: string; items: Array<{ text: string; author: string }> }
        faq?: Array<{ question: string; answer: string }>
        finalCta: { headline: string; subtext: string; buttonText: string }
      }>(
        `Generate landing page content for ${templateContext} with the headline: "${input.headline}"

        This is for a ${project.niche.replace('_', ' ')} called "${project.brandName}".

        Return a JSON object with:
        - hero: { title, subtitle, ctaText }
        - sections: array of 3-4 content sections, each with { type ("features"|"benefits"|"how-it-works"|"pricing"|"testimonials"), title, content (paragraph text), items (optional array of { title, description }) }
        - socialProof: { headline, items: [{ text, author }] } (2-3 testimonials)
        - faq: array of 3-4 { question, answer } pairs
        - finalCta: { headline, subtext, buttonText }

        Make the content compelling, conversion-focused, and specific to the trading/finance niche.`,
        'You are a conversion rate optimization expert specializing in landing pages for trading and finance companies.'
      )

      return content
    }),
})
