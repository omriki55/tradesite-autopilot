import { initTRPC, TRPCError } from '@trpc/server'
import { getServerSession } from 'next-auth'
import superjson from 'superjson'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export const createTRPCContext = async () => {
  const session = await getServerSession(authOptions)
  return { prisma, session }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      userId: (ctx.session.user as { id: string }).id,
    },
  })
})

/** Rate-limited procedure for AI generation endpoints */
export const rateLimitedProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const userId = (ctx.session.user as { id: string }).id
  const result = rateLimit(`ai:${userId}`, RATE_LIMITS.ai)
  if (!result.success) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Rate limit exceeded. Try again in ${Math.ceil((result.resetAt - Date.now()) / 1000)} seconds.`,
    })
  }
  return next()
})
