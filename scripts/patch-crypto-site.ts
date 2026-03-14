import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PROJECT_ID = 'cmmq5iv4x0001mdzq18nkeq40'
const BRAND_NAME = 'CryptoVault'

async function main() {
  // Verify project exists
  const project = await prisma.project.findUnique({ where: { id: PROJECT_ID } })
  if (!project) throw new Error('Project not found — run full seed first')
  console.log(`Found project: ${project.brandName} (${PROJECT_ID})`)

  // 1. Social profiles
  const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'telegram']
  for (const platform of platforms) {
    await prisma.socialProfile.upsert({
      where: { projectId_platform: { projectId: PROJECT_ID, platform } },
      update: {},
      create: {
        projectId: PROJECT_ID,
        platform,
        username: '@cryptovault',
        profileUrl: `https://${platform}.com/cryptovault`,
        bio: `${BRAND_NAME} — Trade 500+ Cryptocurrencies`,
        status: 'active',
        configured: true,
      },
    })
  }
  console.log('7 social profiles created')

  // 2. Social posts (49 scheduled — 7 days × 7 platforms)
  const postTypes = ['Motivational', 'Educational', 'Market Update', 'Product Feature', 'Community']
  const now = new Date()
  for (let day = 0; day < 7; day++) {
    for (const platform of platforms) {
      const postDate = new Date(now.getTime() + day * 24 * 60 * 60 * 1000)
      const pType = postTypes[day % postTypes.length]
      await prisma.socialPost.create({
        data: {
          projectId: PROJECT_ID,
          platform,
          content: `[${pType}] CryptoVault update for ${platform}. Trade 500+ tokens with fees from 0.01%. #crypto #bitcoin #trading`,
          postType: pType,
          scheduledAt: postDate,
          status: 'scheduled',
          hashtags: JSON.stringify(['#crypto', '#bitcoin', '#trading', '#defi', '#web3']),
        },
      })
    }
  }
  console.log('49 social posts created')

  // 3. Timeline events
  const milestones = [
    { phase: 1, milestone: 'Domain search & scoring', day: 1 },
    { phase: 1, milestone: 'Domain registration', day: 2 },
    { phase: 2, milestone: 'Website template selected', day: 3 },
    { phase: 2, milestone: 'Website generation started', day: 4 },
    { phase: 2, milestone: 'All pages generated', day: 5 },
    { phase: 2, milestone: 'Website deployed & live', day: 7 },
    { phase: 3, milestone: 'SEO audit complete', day: 8 },
    { phase: 3, milestone: 'Keyword strategy mapped', day: 10 },
    { phase: 3, milestone: 'GEO pages created', day: 12 },
    { phase: 3, milestone: 'Search Console connected', day: 14 },
    { phase: 4, milestone: 'Social profiles created', day: 15 },
    { phase: 4, milestone: 'Social accounts connected', day: 17 },
    { phase: 4, milestone: 'Content bank generated', day: 18 },
    { phase: 4, milestone: 'Profiles fully configured', day: 21 },
    { phase: 5, milestone: 'Daily posting begins', day: 22 },
    { phase: 5, milestone: 'First engagement report', day: 30 },
    { phase: 5, milestone: 'Content optimization round 1', day: 45 },
    { phase: 6, milestone: 'Growth phase midpoint', day: 60 },
    { phase: 6, milestone: 'A/B testing initiated', day: 70 },
    { phase: 6, milestone: 'Final performance report', day: 85 },
    { phase: 6, milestone: 'Client handoff complete', day: 90 },
  ]
  await prisma.timelineEvent.createMany({
    data: milestones.map((m, i) => ({
      projectId: PROJECT_ID,
      phase: m.phase,
      milestone: m.milestone,
      scheduledDate: new Date(now.getTime() + m.day * 24 * 60 * 60 * 1000),
      status: m.day <= 21 ? 'completed' : 'pending',
      order: i,
    })),
  })
  console.log('21 timeline events created')

  // 4. Blog post
  await prisma.blogPost.create({
    data: {
      projectId: PROJECT_ID,
      title: 'Bitcoin Halving 2026: What Traders Need to Know',
      slug: 'bitcoin-halving-2026-guide',
      content: 'The Bitcoin halving is approaching. This comprehensive guide covers the expected impact on BTC price, mining economics, and trading strategies for the months ahead. Whether you are a long-term HODLer or an active trader, understanding the halving cycle is crucial for positioning your portfolio.',
      excerpt: 'Everything you need to know about the upcoming Bitcoin halving event and its impact on the crypto market.',
      category: 'market-analysis',
      status: 'published',
      publishedAt: new Date(),
    },
  })
  console.log('Blog post created')

  // 5. Email template
  await prisma.emailTemplate.create({
    data: {
      projectId: PROJECT_ID,
      name: 'Welcome to CryptoVault',
      type: 'welcome',
      subject: 'Welcome to CryptoVault — Your Crypto Journey Starts Here',
      body: 'Hi {{name}},\n\nWelcome to CryptoVault! You\'ve joined 8M+ traders worldwide.\n\nHere\'s how to get started:\n1. Complete KYC verification\n2. Make your first deposit\n3. Start trading 500+ tokens\n\nHappy trading!\nThe CryptoVault Team',
    },
  })
  console.log('Email template created')

  // 6. Landing page
  await prisma.landingPage.create({
    data: {
      projectId: PROJECT_ID,
      title: 'Earn 18% APY on Your Crypto',
      slug: 'crypto-staking-offer',
      template: 'lead_magnet',
      headline: 'Earn Up to 18% APY — Start Staking Today',
      subheadline: 'Put your crypto to work with CryptoVault Staking.',
      ctaText: 'Start Earning Now',
      status: 'draft',
      content: JSON.stringify({
        sections: [
          { title: 'Why Stake with CryptoVault?', content: 'Industry-leading APY rates, flexible lock periods, and instant rewards.' },
        ],
      }),
    },
  })
  console.log('Landing page created')

  // 7. Affiliate
  await prisma.affiliate.create({
    data: {
      projectId: PROJECT_ID,
      name: 'CryptoInfluencer',
      email: 'partner@cryptoinfluencer.com',
      code: `cvault-${PROJECT_ID.slice(-8)}`,
      commissionType: 'revenue_share',
      commissionRate: 30,
      status: 'active',
    },
  })
  console.log('Affiliate created')

  // 8. Analytics (30 days)
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000)
    date.setHours(0, 0, 0, 0)
    await prisma.analytics.upsert({
      where: { projectId_date: { projectId: PROJECT_ID, date } },
      update: {},
      create: {
        projectId: PROJECT_ID,
        date,
        traffic: Math.floor(200 + Math.random() * 400),
        leads: Math.floor(5 + Math.random() * 15),
        keywordsRanked: Math.floor(20 + Math.random() * 30),
        socialFollowers: Math.floor(500 + i * 50 + Math.random() * 100),
        data: JSON.stringify({
          pageViews: Math.floor(500 + Math.random() * 1000),
          bounceRate: Number((30 + Math.random() * 20).toFixed(1)),
          avgSessionDuration: Number((120 + Math.random() * 180).toFixed(0)),
        }),
      },
    })
  }
  console.log('30 days analytics seeded')

  // Update project phase to 5 (active posting)
  await prisma.project.update({
    where: { id: PROJECT_ID },
    data: { currentPhase: 5, status: 'ACTIVE' },
  })

  // Update website status to DEPLOYED
  await prisma.website.update({
    where: { projectId: PROJECT_ID },
    data: {
      status: 'DEPLOYED',
      deployUrl: 'https://cryptovault.exchange',
      cmsUrl: 'https://cms.cryptovault.exchange',
    },
  })

  // Update domain status
  await prisma.domain.update({
    where: { projectId: PROJECT_ID },
    data: { status: 'REGISTERED', selectedDomain: 'cryptovault.exchange' },
  })

  console.log('\n✅ CryptoVault patch complete!')
  console.log(`🌐 Site: https://tradesite-autopilot.vercel.app/site/${PROJECT_ID}`)
  console.log(`📊 Dashboard: https://tradesite-autopilot.vercel.app/dashboard/projects/${PROJECT_ID}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
