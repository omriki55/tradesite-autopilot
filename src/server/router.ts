import { router } from './trpc'
import { projectRouter } from './routers/project'
import { domainRouter } from './routers/domain'
import { websiteRouter } from './routers/website'
import { seoRouter } from './routers/seo'
import { socialRouter } from './routers/social'
import { postingRouter } from './routers/posting'
import { timelineRouter } from './routers/timeline'
import { connectionsRouter } from './routers/connections'
import { analyticsRouter } from './routers/analytics'

export const appRouter = router({
  project: projectRouter,
  domain: domainRouter,
  website: websiteRouter,
  seo: seoRouter,
  social: socialRouter,
  posting: postingRouter,
  timeline: timelineRouter,
  connections: connectionsRouter,
  analytics: analyticsRouter,
})

export type AppRouter = typeof appRouter
