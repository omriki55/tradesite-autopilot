import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { generateJSONWithAI } from '@/lib/ai'

export const communitiesRouter = router({
  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.community.findMany({
        where: { projectId: input.projectId },
        include: { _count: { select: { posts: true } } },
        orderBy: { createdAt: 'desc' },
      })
    }),

  create: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      name: z.string().min(1),
      brandName: z.string().min(1),
      type: z.enum(['whatsapp_group', 'youtube_community', 'telegram']),
      url: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.community.create({ data: input })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.communityPost.deleteMany({ where: { communityId: input.id } })
      return ctx.prisma.community.delete({ where: { id: input.id } })
    }),

  getStats: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const communities = await ctx.prisma.community.findMany({
        where: { projectId: input.projectId },
        select: { membersCount: true, status: true },
      })
      const posts = await ctx.prisma.communityPost.count({
        where: { community: { projectId: input.projectId }, status: { in: ['draft', 'approved'] } },
      })
      return {
        total: communities.length,
        totalMembers: communities.reduce((a, c) => a + c.membersCount, 0),
        active: communities.filter(c => c.status === 'active').length,
        queuedPosts: posts,
      }
    }),

  listPosts: protectedProcedure
    .input(z.object({ projectId: z.string(), communityId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.communityPost.findMany({
        where: {
          community: { projectId: input.projectId },
          ...(input.communityId ? { communityId: input.communityId } : {}),
        },
        include: { community: { select: { name: true, brandName: true, type: true } } },
        orderBy: { scheduledAt: 'asc' },
      })
    }),

  schedulePost: protectedProcedure
    .input(z.object({
      communityId: z.string(),
      content: z.string().min(1),
      platform: z.string(),
      scheduledDate: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.communityPost.create({
        data: {
          communityId: input.communityId,
          content: input.content,
          platform: input.platform,
          scheduledAt: new Date(input.scheduledDate),
        },
      })
    }),

  approvePost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.communityPost.update({ where: { id: input.id }, data: { status: 'approved' } })
    }),

  markPostSent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.communityPost.update({
        where: { id: input.id },
        data: { status: 'published', publishedAt: new Date() },
      })
    }),

  generatePost: protectedProcedure
    .input(z.object({ niche: z.string(), platform: z.string(), brand: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await generateJSONWithAI<{ content: string }>(
        `Generate a single engaging community post for a ${input.platform.replace('_', ' ')} in the ${input.niche} niche, brand: "${input.brand}".
        Return JSON: { "content": "the post text" }
        The post should be conversational, drive engagement, and be appropriate for the ${input.platform} format.`,
        `You are a community manager creating content for ${input.niche} communities.`
      )
      return result
    }),
})
