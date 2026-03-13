import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateJSONWithAI } from '@/lib/ai'
import { advancePhase } from '@/lib/phase-advance'
import { WEBSITE_TEMPLATES, getTemplateById, getTemplatePages } from '@/lib/website-templates'
import { getComplianceTemplate, fillTemplate } from '@/lib/compliance-templates'
import type { CompliancePageType } from '@/lib/compliance-templates'
import { TRADING_WIDGETS } from '@/lib/trading-widgets'
import { exportProjectAsHTML } from '@/lib/html-exporter'

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

  generateCompliancePage: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        pageType: z.enum(['terms_of_service', 'privacy_policy', 'risk_disclosure', 'aml_policy', 'cookie_policy']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
        include: { domain: true, website: true },
      })
      if (!project?.website) throw new Error('Project or website not found')

      const domain = project.domain?.selectedDomain || 'example.com'
      const rawTemplate = getComplianceTemplate(input.pageType as CompliancePageType)
      if (!rawTemplate) throw new Error('Compliance template not found')

      const template = fillTemplate(rawTemplate, {
        brandName: project.brandName,
        domain,
        jurisdiction: 'the applicable jurisdiction',
        niche: project.niche.replace(/_/g, ' '),
      })

      // Split the filled content into sections by numbered headings
      const paragraphs = template.content.split(/\n\n+/).filter(Boolean)
      const sections = paragraphs.map((p) => ({
        title: '',
        content: p.trim(),
        type: 'text' as const,
      }))

      const slug = template.pageType.replace(/_/g, '-')

      const content = JSON.stringify({
        heroTitle: template.title,
        heroSubtitle: template.description,
        sections,
        metaTitle: `${template.title} | ${project.brandName}`,
        metaDescription: template.description,
      })

      const page = await ctx.prisma.websitePage.upsert({
        where: {
          websiteId_slug: {
            websiteId: project.website.id,
            slug,
          },
        },
        update: {
          title: template.title,
          content,
          metaTitle: `${template.title} | ${project.brandName}`,
          metaDescription: template.description,
          status: 'generated',
        },
        create: {
          websiteId: project.website.id,
          slug,
          title: template.title,
          pageType: 'legal',
          content,
          metaTitle: `${template.title} | ${project.brandName}`,
          metaDescription: template.description,
          status: 'generated',
          order: 900,
        },
      })

      return page
    }),

  getCompliancePages: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const website = await ctx.prisma.website.findUnique({
        where: { projectId: input.projectId },
      })
      if (!website) return []

      return ctx.prisma.websitePage.findMany({
        where: { websiteId: website.id, pageType: 'legal' },
        orderBy: { order: 'asc' },
      })
    }),

  getWidgets: protectedProcedure.query(() => {
    return TRADING_WIDGETS.map((w) => ({
      id: w.id,
      name: w.name,
      type: w.type,
      description: w.description,
      icon: w.icon,
    }))
  }),

  toggleWidget: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        widgetId: z.string(),
        enabled: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
      })
      if (!project) throw new Error('Project not found')

      let widgets: string[] = []
      try {
        widgets = JSON.parse(project.widgets || '[]')
      } catch {
        widgets = []
      }

      if (input.enabled) {
        if (!widgets.includes(input.widgetId)) {
          widgets.push(input.widgetId)
        }
      } else {
        widgets = widgets.filter((id) => id !== input.widgetId)
      }

      return ctx.prisma.project.update({
        where: { id: input.projectId },
        data: { widgets: JSON.stringify(widgets) },
      })
    }),

  getActiveWidgets: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
      })
      if (!project) throw new Error('Project not found')

      let widgetIds: string[] = []
      try {
        widgetIds = JSON.parse(project.widgets || '[]')
      } catch {
        widgetIds = []
      }

      return TRADING_WIDGETS.filter((w) => widgetIds.includes(w.id))
    }),

  updatePageContent: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
        content: z.string(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { pageId, ...data } = input
      return ctx.prisma.websitePage.update({
        where: { id: pageId },
        data,
      })
    }),

  exportHTML: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
        include: { domain: true, website: { include: { pages: { orderBy: { order: 'asc' } } } } },
      })
      if (!project?.website) throw new Error('Project or website not found')

      let brandColors = { primary: '#1E40AF', secondary: '#1E293B', accent: '#F59E0B' }
      try {
        if (project.brandColors) {
          brandColors = JSON.parse(project.brandColors)
        }
      } catch {
        // use defaults
      }

      let widgetIds: string[] = []
      try {
        widgetIds = JSON.parse(project.widgets || '[]')
      } catch {
        widgetIds = []
      }

      const domain = project.domain?.selectedDomain || 'example.com'
      const pages = (project.website.pages as Array<{ slug: string; title: string; content: string; metaTitle?: string; metaDescription?: string; pageType: string }>).map(p => ({
        slug: p.slug || 'home',
        title: p.title || '',
        content: typeof p.content === 'string' ? p.content : JSON.stringify(p.content || {}),
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        pageType: p.pageType || 'page',
      }))

      const files = exportProjectAsHTML({
        brandName: project.brandName,
        domain,
        niche: project.niche || 'forex_broker',
        pages,
        ga4Id: project.ga4Id || undefined,
        gtmId: project.gtmId || undefined,
        chatWidgetProvider: project.chatWidgetProvider || undefined,
        chatWidgetId: project.chatWidgetId || undefined,
        widgets: widgetIds,
      })

      return files
    }),
})
