import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateWithAI, generateJSONWithAI } from '@/lib/ai'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const blogRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        status: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.blogPost.findMany({
        where: {
          projectId: input.projectId,
          ...(input.status ? { status: input.status } : {}),
          ...(input.category ? { category: input.category } : {}),
        },
        orderBy: { createdAt: 'desc' },
      })
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.blogPost.findFirst({
        where: { id: input.id },
      })
      if (!post) throw new Error('Blog post not found')
      return post
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        status: z.string().optional(),
        scheduledAt: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = generateSlug(input.title)

      return ctx.prisma.blogPost.create({
        data: {
          projectId: input.projectId,
          title: input.title,
          slug,
          content: input.content,
          excerpt: input.excerpt,
          category: input.category ?? 'general',
          tags: JSON.stringify(input.tags ?? []),
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          status: input.status ?? 'draft',
          scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
          publishedAt: input.status === 'published' ? new Date() : undefined,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        featuredImage: z.string().optional(),
        status: z.string().optional(),
        scheduledAt: z.string().datetime().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tags, scheduledAt, ...rest } = input

      const existing = await ctx.prisma.blogPost.findFirst({
        where: { id },
      })
      if (!existing) throw new Error('Blog post not found')

      const data: Record<string, unknown> = { ...rest }

      if (input.title) {
        data.slug = generateSlug(input.title)
      }

      if (tags !== undefined) {
        data.tags = JSON.stringify(tags)
      }

      if (scheduledAt !== undefined) {
        data.scheduledAt = scheduledAt ? new Date(scheduledAt) : null
      }

      if (input.status === 'published' && existing.status !== 'published') {
        data.publishedAt = new Date()
      }

      return ctx.prisma.blogPost.update({
        where: { id },
        data,
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.blogPost.delete({
        where: { id: input.id },
      })
    }),

  generateWithAI: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        topic: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
      })
      if (!project) throw new Error('Project not found')

      const generated = await generateJSONWithAI<{
        title: string
        content: string
        excerpt: string
        category: string
        metaTitle: string
        metaDescription: string
      }>(
        `Write a full blog post about "${input.topic}" for a ${project.niche.replace('_', ' ')} called "${project.brandName}".

        The blog post should be written in markdown format, approximately 800 words, targeting the trading/finance niche.
        The tone should be professional yet accessible.
        Include relevant trading/finance terminology.

        Return a JSON object with:
        - title: compelling blog post title (SEO-friendly)
        - content: full blog post in markdown (~800 words, include headers, paragraphs, bullet points where appropriate)
        - excerpt: a 1-2 sentence summary (max 160 characters)
        - category: one of "market-analysis", "education", "trading-strategies", "industry-news", "platform-updates", "general"
        - metaTitle: SEO meta title (max 60 characters)
        - metaDescription: SEO meta description (max 160 characters)`,
        'You are an expert financial content writer specializing in trading and forex education.'
      )

      const slug = generateSlug(generated.title)

      const post = await ctx.prisma.blogPost.create({
        data: {
          projectId: input.projectId,
          title: generated.title,
          slug,
          content: generated.content,
          excerpt: generated.excerpt,
          category: generated.category,
          metaTitle: generated.metaTitle,
          metaDescription: generated.metaDescription,
          author: 'AI',
          status: 'draft',
        },
      })

      return {
        ...post,
        title: generated.title,
        content: generated.content,
        excerpt: generated.excerpt,
        category: generated.category,
        metaTitle: generated.metaTitle,
        metaDescription: generated.metaDescription,
      }
    }),

  generateMeta: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.blogPost.findFirst({
        where: { id: input.id },
      })
      if (!post) throw new Error('Blog post not found')

      const meta = await generateJSONWithAI<{
        metaTitle: string
        metaDescription: string
      }>(
        `Generate SEO meta tags for this blog post:

        Title: "${post.title}"
        Content excerpt: "${post.content.substring(0, 500)}"

        Return a JSON object with:
        - metaTitle: SEO-optimized title tag (max 60 characters, include primary keyword)
        - metaDescription: compelling meta description (max 160 characters, include call-to-action)`,
        'You are an SEO specialist for trading and finance websites.'
      )

      return ctx.prisma.blogPost.update({
        where: { id: input.id },
        data: {
          metaTitle: meta.metaTitle,
          metaDescription: meta.metaDescription,
        },
      })
    }),

  getCategories: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.blogPost.findMany({
        where: { projectId: input.projectId },
        select: { category: true },
        distinct: ['category'],
      })
      return posts.map((p) => p.category)
    }),
})
