import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateJSONWithAI } from '@/lib/ai'
import { advancePhase } from '@/lib/phase-advance'
import { WEBSITE_TEMPLATES, getTemplateById, getTemplatePages } from '@/lib/website-templates'

export const websiteRouter = router({
  getTemplates: protectedProcedure.query(() => {
    return WEBSITE_TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      icon: t.icon,
      pageCount: t.pageCount,
      features: t.features,
    }))
  }),

  selectTemplate: protectedProcedure
    .input(z.object({ projectId: z.string(), templateId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const template = getTemplateById(input.templateId)
      if (!template) throw new Error('Template not found')

      return ctx.prisma.website.update({
        where: { projectId: input.projectId },
        data: { templateId: input.templateId, templateType: template.name },
      })
    }),

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
        include: { domain: true, website: true },
      })
      if (!project) throw new Error('Project not found')

      const templateId = project.website?.templateId || 'forex-broker'
      const template = getTemplateById(templateId)
      const pages = template?.pages || getTemplatePages('forex-broker')

      await ctx.prisma.website.update({
        where: { projectId: input.projectId },
        data: { status: 'GENERATING' },
      })

      // Delete existing pages if regenerating
      const website = await ctx.prisma.website.findUnique({ where: { projectId: input.projectId } })
      if (website) {
        await ctx.prisma.websitePage.deleteMany({ where: { websiteId: website.id } })
      }

      // Generate pages from template
      for (const pageDef of pages) {
        const content = await generateJSONWithAI(
          `Generate website page content for a ${project.niche.replace('_', ' ')} company called "${project.brandName}".
          Template: ${template?.name || 'Forex Broker'}
          Page: ${pageDef.title} (${pageDef.pageType})
          Domain: ${project.domain?.selectedDomain || 'example.com'}

          ${pageDef.contentPrompt}

          Return a JSON object with:
          - heroTitle: main heading (string)
          - heroSubtitle: subtitle text (string)
          - sections: array of { title: string, content: string, type: "text"|"features"|"list"|"table"|"pricing"|"cta" }
          - metaTitle: SEO title (60 chars max)
          - metaDescription: SEO description (160 chars max)

          Make the content professional, detailed, and specific to the ${template?.name || 'trading'} industry.`,
          `You are a professional ${template?.name || 'trading'} company website copywriter. Write compelling, compliant content.`
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
            websiteId: website!.id,
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

      return { success: true, pageCount: pages.length }
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

  generateBlogPost: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      topic: z.string(),
      category: z.string().default('market_analysis'),
    }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
        include: { website: true },
      })
      if (!project?.website) throw new Error('Website not found')

      const content = await generateJSONWithAI(
        `Write a blog post for a ${project.niche.replace('_', ' ')} company called "${project.brandName}".
        Topic: ${input.topic}
        Category: ${input.category}

        Return JSON with:
        - heroTitle: post title
        - heroSubtitle: post excerpt (2 sentences)
        - sections: array of { title: string, content: string, type: "text" }
        - metaTitle: SEO title
        - metaDescription: SEO description`,
        `You are a financial content writer specializing in trading industry blogs.`
      )

      let parsed
      try {
        parsed = typeof content === 'string' ? JSON.parse(content) : content
      } catch {
        parsed = {
          heroTitle: input.topic,
          heroSubtitle: 'Read our latest market insights.',
          sections: [{ title: input.topic, content: 'Blog content coming soon...', type: 'text' }],
        }
      }

      const slug = `blog/${input.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`
      const existingCount = await ctx.prisma.websitePage.count({
        where: { websiteId: project.website.id, pageType: 'blog_post' },
      })

      return ctx.prisma.websitePage.create({
        data: {
          websiteId: project.website.id,
          slug,
          title: parsed.heroTitle || input.topic,
          pageType: 'blog_post',
          content: JSON.stringify(parsed),
          metaTitle: parsed.metaTitle || `${input.topic} | ${project.brandName}`,
          metaDescription: parsed.metaDescription || '',
          status: 'generated',
          order: 100 + existingCount,
        },
      })
    }),

  getBlogPosts: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const website = await ctx.prisma.website.findUnique({ where: { projectId: input.projectId } })
      if (!website) return []

      return ctx.prisma.websitePage.findMany({
        where: { websiteId: website.id, pageType: 'blog_post' },
        orderBy: { createdAt: 'desc' },
      })
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
