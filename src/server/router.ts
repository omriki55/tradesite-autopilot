import { router } from './trpc'
import { projectRouter } from './routers/project'
import { domainRouter } from './routers/domain'
import { websiteRouter } from './routers/website'
import { seoRouter } from './routers/seo'
import { socialRouter } from './routers/social'
import { postingRouter } from './routers/posting'
import { timelineRouter } from './routers/timeline'

export const appRouter = router({
  project: projectRouter,
  domain: domainRouter,
  website: websiteRouter,
  seo: seoRouter,
  social: socialRouter,
  posting: postingRouter,
  timeline: timelineRouter,
})

export type AppRouter = typeof appRouter
