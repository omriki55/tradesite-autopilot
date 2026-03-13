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
import { blogRouter } from './routers/blog'
import { landingRouter } from './routers/landing'
import { leadsRouter } from './routers/leads'
import { emailRouter } from './routers/email'
import { affiliatesRouter } from './routers/affiliates'
import { communitiesRouter } from './routers/communities'
import { flowsRouter } from './routers/flows'
import { metaRouter } from './routers/meta'

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
  blog: blogRouter,
  landing: landingRouter,
  leads: leadsRouter,
  email: emailRouter,
  affiliates: affiliatesRouter,
  communities: communitiesRouter,
  flows: flowsRouter,
  meta: metaRouter,
})

export type AppRouter = typeof appRouter
