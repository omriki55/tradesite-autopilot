import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { SOCIAL_PROVIDERS, getOAuthUrl, validateConnection } from '@/lib/social-providers'

export const connectionsRouter = router({
  getAll: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const profiles = await ctx.prisma.socialProfile.findMany({
        where: { projectId: input.projectId },
        orderBy: { platform: 'asc' },
      })

      return profiles.map((profile) => ({
        ...profile,
        provider: SOCIAL_PROVIDERS[profile.platform] || null,
      }))
    }),

  connect: protectedProcedure
    .input(z.object({ projectId: z.string(), platform: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: { id: input.projectId, userId: ctx.userId },
      })
      if (!project) throw new Error('Project not found')

      // Generate OAuth state for CSRF protection
      const state = `${input.projectId}_${input.platform}_${Date.now()}_${Math.random().toString(36).slice(2)}`

      await ctx.prisma.oAuthState.create({
        data: {
          projectId: input.projectId,
          platform: input.platform,
          state,
        },
      })

      // In a real app, these would come from env vars
      const clientId = process.env[`${input.platform}_CLIENT_ID`] || 'mock-client-id'
      const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/social/callback`

      const oauthUrl = getOAuthUrl(input.platform, clientId, redirectUri, state)

      // For mock mode, just mark as connected directly
      if (!oauthUrl || clientId === 'mock-client-id') {
        await ctx.prisma.socialProfile.upsert({
          where: { projectId_platform: { projectId: input.projectId, platform: input.platform } },
          create: {
            projectId: input.projectId,
            platform: input.platform,
            connected: true,
            accessToken: `mock_token_${input.platform}_${Date.now()}`,
            status: 'active',
          },
          update: {
            connected: true,
            accessToken: `mock_token_${input.platform}_${Date.now()}`,
            status: 'active',
          },
        })

        return { mode: 'mock', connected: true }
      }

      return { mode: 'oauth', oauthUrl }
    }),

  disconnect: protectedProcedure
    .input(z.object({ projectId: z.string(), platform: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.socialProfile.update({
        where: { projectId_platform: { projectId: input.projectId, platform: input.platform } },
        data: {
          connected: false,
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null,
        },
      })
      return { disconnected: true }
    }),

  test: protectedProcedure
    .input(z.object({ projectId: z.string(), platform: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.socialProfile.findUnique({
        where: { projectId_platform: { projectId: input.projectId, platform: input.platform } },
      })

      if (!profile?.accessToken) {
        return { valid: false, error: 'No access token found' }
      }

      const result = await validateConnection(input.platform, profile.accessToken)
      return result
    }),
})
