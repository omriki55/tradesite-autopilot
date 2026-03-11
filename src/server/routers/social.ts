import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateJSONWithAI } from '@/lib/ai'
import { advancePhase } from '@/lib/phase-advance'

const PLATFORMS = ['FACEBOOK', 'INSTAGRAM', 'TWITTER', 'LINKEDIN', 'YOUTUBE', 'TIKTOK', 'TELEGRAM'] as const

export const socialRouter = router({
  getProfiles: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.socialProfile.findMany({
        where: { projectId: input.projectId },
        orderBy: { platform: 'asc' },
      })
    }),

  createProfiles: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
        include: { domain: true },
      })
      if (!project) throw new Error('Project not found')

      const bios = await generateJSONWithAI<Record<string, { bio: string; username: string }>>(
        `Generate social media profile bios and usernames for a ${project.niche.replace('_', ' ')} called "${project.brandName}".

        Generate for these platforms: ${PLATFORMS.join(', ')}

        Return a JSON object where each key is the platform name, and value has:
        - bio: platform-appropriate bio (Instagram max 150 chars, Twitter max 160, others up to 250)
        - username: suggested username (lowercase, no spaces)

        Include relevant keywords, a CTA, and the website URL: ${project.domain?.selectedDomain || 'example.com'}`,
        'You are a social media strategist for trading companies.'
      )

      const profiles = []
      for (const platform of PLATFORMS) {
        const bio = bios[platform] || { bio: `${project.brandName} - Professional Trading`, username: project.brandName.toLowerCase().replace(/\s+/g, '') }

        const profile = await ctx.prisma.socialProfile.upsert({
          where: { projectId_platform: { projectId: input.projectId, platform } },
          create: {
            projectId: input.projectId,
            platform,
            username: bio.username,
            bio: bio.bio,
            profileUrl: `https://${platform.toLowerCase()}.com/${bio.username}`,
            configured: true,
            status: 'active',
          },
          update: {
            username: bio.username,
            bio: bio.bio,
            profileUrl: `https://${platform.toLowerCase()}.com/${bio.username}`,
            configured: true,
            status: 'active',
          },
        })
        profiles.push(profile)
      }

      return profiles
    }),

  generateContentBank: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
      })
      if (!project) throw new Error('Project not found')

      const categories = ['educational', 'promotional', 'analysis', 'motivational', 'behind_the_scenes']
      const types = ['caption', 'carousel', 'video_script', 'image', 'hashtag_set']

      const items = await generateJSONWithAI<Array<{ type: string; category: string; content: Record<string, unknown> }>>(
        `Generate 25 content bank items for a ${project.niche.replace('_', ' ')} called "${project.brandName}".

        Categories: ${categories.join(', ')}
        Types: ${types.join(', ')}

        Return a JSON array where each item has:
        - type: one of the types listed
        - category: one of the categories listed
        - content: object with relevant fields based on type:
          - caption: { text: string, hashtags: string[] }
          - carousel: { slides: Array<{ title: string, body: string }> }
          - video_script: { hook: string, body: string, cta: string, duration: string }
          - image: { headline: string, subtext: string, style: string }
          - hashtag_set: { platform: string, hashtags: string[] }

        Mix types and categories evenly. Content should be trading-industry specific.`,
        'You are a social media content creator for trading and finance brands.'
      )

      await ctx.prisma.contentBank.deleteMany({ where: { projectId: input.projectId } })

      await ctx.prisma.contentBank.createMany({
        data: items.map((item) => ({
          projectId: input.projectId,
          type: item.type,
          category: item.category,
          content: JSON.stringify(item.content),
        })),
      })

      // Content bank generated → advance to Phase 5
      await advancePhase(ctx.prisma, input.projectId, 4)

      return { count: items.length }
    }),

  getContentBank: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        category: z.string().optional(),
        type: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.contentBank.findMany({
        where: {
          projectId: input.projectId,
          ...(input.category ? { category: input.category } : {}),
          ...(input.type ? { type: input.type } : {}),
        },
        orderBy: { createdAt: 'desc' },
      })
    }),
})
