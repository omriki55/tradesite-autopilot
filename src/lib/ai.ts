import Anthropic from '@anthropic-ai/sdk'
import { errorTracker } from './sentry'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function generateWithAI(prompt: string, systemPrompt?: string): Promise<string> {
  // Try Anthropic first
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt || 'You are an expert in trading company marketing and web development.',
        messages: [{ role: 'user', content: prompt }],
      })
      const block = response.content[0]
      return block.type === 'text' ? block.text : ''
    } catch (error) {
      errorTracker.captureException(error instanceof Error ? error : new Error(String(error)), { action: 'anthropic_generate' })
      console.error('[AI] Anthropic API error, falling back:', error)
    }
  }

  // Try OpenAI as fallback
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt || 'You are an expert in trading company marketing and web development.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 4096,
          temperature: 0.7,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        return data.choices?.[0]?.message?.content || ''
      }
    } catch (error) {
      errorTracker.captureException(error instanceof Error ? error : new Error(String(error)), { action: 'openai_generate' })
      console.error('[AI] OpenAI API error, falling back to mock:', error)
    }
  }

  // Fall back to mock
  return generateMockResponse(prompt)
}

export async function generateJSONWithAI<T>(prompt: string, systemPrompt?: string): Promise<T> {
  const fullPrompt = `${prompt}\n\nRespond ONLY with valid JSON. No markdown, no code blocks, no explanation.`
  const result = await generateWithAI(fullPrompt, systemPrompt)

  const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned) as T
}

function generateMockResponse(prompt: string): string {
  const p = prompt.toLowerCase()

  // Keyword research (must come before 'page' check since keyword prompts contain 'mappedPage')
  if (p.includes('keyword') && (p.includes('volume') || p.includes('difficulty'))) {
    return JSON.stringify([
      { keyword: 'best forex broker', volume: 12000, difficulty: 78, intent: 'transactional', mappedPage: 'home' },
      { keyword: 'forex trading platform', volume: 8500, difficulty: 72, intent: 'navigational', mappedPage: 'platforms' },
      { keyword: 'how to trade forex', volume: 22000, difficulty: 45, intent: 'informational', mappedPage: 'education' },
      { keyword: 'forex broker review', volume: 6500, difficulty: 65, intent: 'informational', mappedPage: 'about' },
      { keyword: 'open forex account', volume: 4200, difficulty: 58, intent: 'transactional', mappedPage: 'register' },
      { keyword: 'forex spreads comparison', volume: 3800, difficulty: 52, intent: 'commercial', mappedPage: 'pricing' },
      { keyword: 'MT4 forex broker', volume: 5200, difficulty: 68, intent: 'navigational', mappedPage: 'platforms' },
      { keyword: 'regulated forex broker', volume: 7100, difficulty: 71, intent: 'transactional', mappedPage: 'regulation' },
      { keyword: 'forex demo account', volume: 9500, difficulty: 40, intent: 'transactional', mappedPage: 'demo' },
      { keyword: 'forex trading signals', volume: 6800, difficulty: 55, intent: 'informational', mappedPage: 'signals' },
      { keyword: 'best forex broker in UAE', volume: 3200, difficulty: 35, intent: 'transactional', mappedPage: 'geo/uae' },
      { keyword: 'forex broker low spreads', volume: 4800, difficulty: 62, intent: 'commercial', mappedPage: 'pricing' },
      { keyword: 'copy trading platform', volume: 7200, difficulty: 58, intent: 'navigational', mappedPage: 'platforms' },
      { keyword: 'forex trading for beginners', volume: 18000, difficulty: 38, intent: 'informational', mappedPage: 'education' },
      { keyword: 'crypto trading broker', volume: 5500, difficulty: 64, intent: 'transactional', mappedPage: 'markets/crypto' },
    ])
  }

  // Domain suggestions
  if (p.includes('domain') && p.includes('suggest')) {
    return JSON.stringify([
      { domain: 'alphatrading.com', score: 92, available: true, tld: '.com', price: 12.99, keywordRelevance: 88, brandability: 95, lengthPenalty: 2, seoScore: 90 },
      { domain: 'alphatrading.io', score: 88, available: true, tld: '.io', price: 29.99, keywordRelevance: 85, brandability: 90, lengthPenalty: 2, seoScore: 85 },
      { domain: 'alphatrade.finance', score: 85, available: true, tld: '.finance', price: 39.99, keywordRelevance: 90, brandability: 80, lengthPenalty: 5, seoScore: 82 },
      { domain: 'alphatrading.net', score: 82, available: false, tld: '.net', price: 11.99, keywordRelevance: 82, brandability: 88, lengthPenalty: 2, seoScore: 78 },
      { domain: 'alpha-trading.com', score: 78, available: true, tld: '.com', price: 12.99, keywordRelevance: 75, brandability: 72, lengthPenalty: 8, seoScore: 76 },
      { domain: 'tradealphagroup.com', score: 75, available: true, tld: '.com', price: 12.99, keywordRelevance: 70, brandability: 68, lengthPenalty: 10, seoScore: 72 },
      { domain: 'alphatradingpro.com', score: 72, available: true, tld: '.com', price: 12.99, keywordRelevance: 78, brandability: 65, lengthPenalty: 10, seoScore: 70 },
      { domain: 'alphatrading.co', score: 70, available: true, tld: '.co', price: 24.99, keywordRelevance: 80, brandability: 85, lengthPenalty: 2, seoScore: 68 },
    ])
  }

  // ─── Page-specific content generation (unique per page type) ─────────
  if (p.includes('page') && p.includes('generate')) {
    return JSON.stringify(getPageContentByType(p))
  }

  // Keyword research (fallback)
  if (p.includes('keyword')) {
    return JSON.stringify([
      { keyword: 'best forex broker', volume: 12000, difficulty: 78, intent: 'transactional', mappedPage: 'home' },
      { keyword: 'forex trading platform', volume: 8500, difficulty: 72, intent: 'navigational', mappedPage: 'platforms' },
      { keyword: 'how to trade forex', volume: 22000, difficulty: 45, intent: 'informational', mappedPage: 'education' },
    ])
  }

  // Social profile bios — multi-platform
  if ((p.includes('bio') || p.includes('profile')) && p.includes('platform')) {
    return JSON.stringify({
      FACEBOOK: { bio: 'Your trusted trading partner. Trade Forex, Crypto & CFDs with tight spreads and expert support. Join 500K+ traders worldwide.', username: 'alphatrading' },
      INSTAGRAM: { bio: 'Trade Forex | Crypto | CFDs\nSpreads from 0.0 pips\nRegulated & Trusted\nStart trading below', username: 'alphatrading' },
      TWITTER: { bio: 'Regulated online broker. Trade 200+ instruments with tight spreads. Market analysis, trading tips & news. Trade responsibly.', username: 'alphatrading' },
      LINKEDIN: { bio: 'Leading online trading platform providing access to global financial markets. Regulated, secure, and trusted by institutional and retail traders.', username: 'alpha-trading' },
      YOUTUBE: { bio: 'Daily market analysis, trading tutorials, and platform guides. Learn to trade with the professionals. Subscribe for daily content.', username: 'AlphaTrading' },
      TIKTOK: { bio: 'Trading tips & market updates. Learn forex, crypto & CFDs. Not financial advice.', username: 'alphatrading' },
      TELEGRAM: { bio: 'Official channel for market signals, daily analysis, and exclusive trading content. Join our community of 50K+ traders.', username: 'alphatrading_official' },
    })
  }

  // Social profile bios — single
  if (p.includes('bio') || p.includes('profile')) {
    return JSON.stringify({
      username: 'alphatrading',
      bio: 'Your gateway to global markets. Advanced trading tools, tight spreads, and expert support. Trade Forex, Crypto & CFDs. Regulated broker.',
    })
  }

  // Content bank
  if (p.includes('content bank') || p.includes('25 content')) {
    return JSON.stringify([
      { type: 'caption', category: 'educational', content: { text: 'Understanding support and resistance levels is key to successful trading. These price levels act as barriers where buying or selling pressure can reverse market direction.', hashtags: ['#trading', '#forex', '#education', '#technicalanalysis'] } },
      { type: 'carousel', category: 'educational', content: { slides: [{ title: 'What is Forex Trading?', body: 'The global market for exchanging currencies' }, { title: 'How It Works', body: 'Buy one currency while selling another' }, { title: 'Why Trade Forex?', body: '24/5 market with high liquidity' }] } },
      { type: 'video_script', category: 'promotional', content: { hook: 'Still paying high spreads?', body: 'Switch to our platform and enjoy spreads starting from 0.0 pips. Advanced charting, fast execution, and 24/7 support.', cta: 'Open your free account today — link in bio!', duration: '30s' } },
      { type: 'image', category: 'analysis', content: { headline: 'EUR/USD Weekly Outlook', subtext: 'Key resistance at 1.0950 — will bulls break through?', style: 'chart-overlay' } },
      { type: 'hashtag_set', category: 'educational', content: { platform: 'instagram', hashtags: ['#forextrading', '#daytrader', '#tradinglife', '#forexeducation', '#currencytrading', '#technicalanalysis', '#priceaction', '#tradingmindset', '#forexsignals', '#tradingcommunity'] } },
      { type: 'caption', category: 'promotional', content: { text: 'Trade with confidence. Our platform offers institutional-grade execution, advanced risk management, and award-winning customer support. Start with as little as $100.', hashtags: ['#forex', '#trading', '#broker', '#invest'] } },
      { type: 'caption', category: 'motivational', content: { text: 'The market rewards patience and discipline. Every successful trader was once a beginner. Keep learning, keep growing, keep trading.', hashtags: ['#tradingmotivation', '#mindset', '#success'] } },
      { type: 'image', category: 'promotional', content: { headline: 'Zero Commission Trading', subtext: 'Trade major pairs with no hidden fees', style: 'gradient-banner' } },
      { type: 'video_script', category: 'educational', content: { hook: 'Most traders lose money because of this one mistake...', body: 'They trade without a plan. Here are 3 things every trading plan needs: entry criteria, exit strategy, and risk management rules.', cta: 'Follow for more trading tips!', duration: '45s' } },
      { type: 'caption', category: 'analysis', content: { text: 'Gold tests $2,000 support as Dollar strengthens. Watch for a potential breakout above $2,050 for bullish confirmation. Risk: CPI data release on Friday.', hashtags: ['#gold', '#XAUUSD', '#commodities', '#trading'] } },
    ])
  }

  // Blog post generation
  if (p.includes('blog') && (p.includes('write') || p.includes('post'))) {
    return JSON.stringify({
      title: 'Understanding Market Volatility: A Trader\'s Guide',
      content: '## What Causes Market Volatility?\n\nMarket volatility is driven by economic data releases, geopolitical events, central bank decisions, and shifts in investor sentiment. Understanding these drivers helps traders anticipate and prepare for large price movements.\n\n## Managing Risk During Volatile Periods\n\nKey strategies include:\n\n- Reducing position sizes during high-impact news events\n- Widening stop-losses to account for larger price swings\n- Avoiding over-leveraging your trading account\n- Focusing on major currency pairs with higher liquidity\n\n## Opportunities in Volatile Markets\n\nVolatility creates opportunities for breakout trades, momentum strategies, and options traders who can benefit from increased premium values. The key is having a clear plan before entering any trade.\n\n## Risk Disclaimer\n\nTrading involves significant risk. Past performance is not indicative of future results. Always trade responsibly.',
      excerpt: 'Learn how to navigate volatile markets and turn uncertainty into opportunity with proven risk management strategies.',
      category: 'education',
      metaTitle: 'Market Volatility Guide — Trading Strategies & Tips',
      metaDescription: 'Learn how to navigate volatile markets with proven strategies. Understand causes of volatility and turn uncertainty into trading opportunities.',
    })
  }

  // Community post generation
  if (p.includes('community') && (p.includes('post') || p.includes('engaging'))) {
    return JSON.stringify({ content: "🚀 Markets are heating up this week! What's your top pick — Forex, Crypto, or Stocks? Drop your answer below and let's discuss! Remember: smart trading starts with education. Check our classroom link for free courses. 📚💰" })
  }

  // Marketing flow generation
  if (p.includes('marketing flow') || (p.includes('30-day') && p.includes('flow')) || (p.includes('flow') && p.includes('nurtur'))) {
    return JSON.stringify({
      steps: [
        { day: 0, channel: 'crm', action: 'Lead Entry', description: 'Affiliate submits lead to CRM via API or form.' },
        { day: 0, channel: 'whatsapp', action: 'Welcome Template', description: 'Branded WhatsApp welcome message with login credentials.' },
        { day: 0, channel: 'whatsapp', action: 'Qualification', description: 'Age, Experience, Market preference questions.' },
        { day: 0, channel: 'whatsapp', action: 'Community Invite', description: 'Auto-invite to brand WhatsApp community group.' },
        { day: 1, channel: 'meta', action: 'Pixel Fire', description: 'Website visit triggers Meta Pixel for retargeting.' },
        { day: 1, channel: 'whatsapp', action: 'Agent Follow-Up', description: 'Personal WhatsApp from agent, announcing call.' },
        { day: 2, channel: 'call', action: 'Outbound Call', description: 'Agent calls lead. Retry if no answer.' },
        { day: 5, channel: 'sms', action: 'Interested: Promo SMS', description: 'Limited-time discount or urgency offer.' },
        { day: 7, channel: 'email', action: 'Interested: Email Series', description: 'Welcome, benefits, success stories, offer.' },
        { day: 7, channel: 'sms', action: 'Not Interested: Re-engage', description: 'Soft re-engagement with different angle.' },
        { day: 10, channel: 'email', action: 'Not Interested: Education', description: 'Market insights, free resources, low-commitment CTAs.' },
        { day: 1, channel: 'meta', action: 'Retargeting Ads', description: 'Targeted FB/IG ads based on pixel data.' },
        { day: 25, channel: 'sms', action: 'Final Push', description: 'Last-chance SMS + email. Offer expires soon.' },
      ]
    })
  }

  // Campaign strategy generation
  if (p.includes('campaign strategy') || (p.includes('advertising') && p.includes('campaign'))) {
    return JSON.stringify({
      campaignName: 'Retargeting — Website Visitors Q1',
      objective: 'Convert website visitors into active traders',
      audienceDescription: 'Males 25-45 interested in trading, who visited website but did not register.',
      targeting: { age: '25-45', interests: ['Forex trading', 'Cryptocurrency'], behaviors: ['Financial website visitors'], locations: ['UAE', 'UK', 'Germany'] },
      adFormats: ['Carousel', 'Video', 'Single Image'],
      adCopyVariants: [
        { headline: 'Still Thinking About Trading?', primaryText: 'Join 500K+ traders. Spreads from 0.0 pips.', cta: 'Sign Up Now' },
        { headline: 'Your Free Demo Awaits', primaryText: 'Practice with $100K virtual funds. Zero risk.', cta: 'Try Free Demo' },
      ],
      estimatedReach: '150K-300K', estimatedCPC: '$0.45-$0.85', estimatedROAS: '3.2x-5.5x',
      kpis: ['CTR > 2%', 'CPA < $25', 'ROAS > 3x'],
      optimizationTips: ['Use lookalike audiences from best converters', 'A/B test video vs carousel', 'Exclude existing customers', 'Schedule for peak trading hours'],
    })
  }

  // Social posts
  if (p.includes('social') || p.includes('post')) {
    return JSON.stringify({
      content: 'Markets are moving! Here is your weekly outlook for the major currency pairs. EUR/USD tests key resistance at 1.0950 while GBP/USD consolidates above 1.2700. Stay ahead of the markets with our advanced trading tools.',
      hashtags: ['#forex', '#trading', '#markets', '#EURUSD', '#GBPUSD'],
    })
  }

  // SEO meta tags
  if (p.includes('meta') || p.includes('seo')) {
    return JSON.stringify({
      metaTitle: 'Alpha Trading — Best Online Forex Broker',
      metaDescription: 'Trade Forex, Crypto & CFDs with tight spreads and fast execution. Regulated broker with 24/7 support. Open a free demo account today.',
    })
  }

  return JSON.stringify({ message: 'Mock AI response — set ANTHROPIC_API_KEY for real content generation' })
}

// ─── Unique page content per page type — Premium eToro/Plus500-grade ──────────

function getPageContentByType(prompt: string) {
  // Homepage — check first since it's the default
  if (prompt.includes('(homepage)')) {
    return {
      heroTitle: 'Trade Global Markets with Confidence',
      heroSubtitle: 'Access 200+ instruments across Forex, Crypto, Commodities & Indices — with spreads from 0.0 pips and ultra-fast execution under 30ms.',
      sections: [
        { title: 'Trusted by Traders Worldwide', type: 'stats', stats: [
          { value: '35M+', label: 'Active Traders' },
          { value: '200+', label: 'Instruments' },
          { value: '0.0', label: 'Pips Spread From' },
          { value: '<30ms', label: 'Execution Speed' },
        ]},
        { title: 'Why Choose Us', type: 'features', items: [
          { title: 'Tight Spreads', description: 'Institutional-grade spreads from 0.0 pips on majors with no hidden markups or re-quotes.' },
          { title: 'Ultra-Fast Execution', description: 'Average execution under 30ms powered by Equinix LD4 & NY5 data centers with 99.99% uptime.' },
          { title: '200+ Instruments', description: 'Forex, crypto, commodities, indices, and shares — all from a single multi-asset account.' },
          { title: 'Regulated & Secure', description: 'Licensed by FCA, CySEC & DFSA. Client funds held in segregated tier-1 bank accounts.' },
          { title: '24/5 Expert Support', description: 'Multilingual support team of trading specialists available around the clock via live chat, phone & email.' },
          { title: 'Free Education', description: 'Comprehensive learning center with courses, webinars, daily analysis, and a $100K demo account.' },
        ]},
        { title: 'Get Started in 3 Simple Steps', type: 'steps', steps: [
          { step: 1, title: 'Open Your Account', description: 'Complete our quick online application in under 2 minutes. Verify your identity with a valid ID.' },
          { step: 2, title: 'Fund Your Account', description: 'Deposit via bank transfer, credit card, or e-wallet. Minimum deposit starts at just $100.' },
          { step: 3, title: 'Start Trading', description: 'Download MT4/MT5 or use WebTrader. Access 200+ instruments and trade instantly.' },
        ]},
        { title: 'Account Types', type: 'pricing', tiers: [
          { name: 'Standard', price: '$100', period: 'Min. Deposit', features: ['Spreads from 1.2 pips', 'No commission', 'Leverage up to 1:500', '200+ instruments', '24/5 support', 'Free education'], ctaText: 'Open Account' },
          { name: 'Premium', price: '$1,000', period: 'Min. Deposit', features: ['Spreads from 0.6 pips', '$3.50/lot commission', 'Leverage up to 1:500', 'Free VPS hosting', 'Priority support', 'Daily analysis'], highlighted: true, ctaText: 'Open Account' },
          { name: 'VIP', price: '$25,000', period: 'Min. Deposit', features: ['Raw spreads from 0.0 pips', '$2.50/lot commission', 'Leverage up to 1:500', 'Personal account manager', 'Custom liquidity', 'Institutional tools'], ctaText: 'Contact Us' },
        ]},
        { title: 'How We Compare', type: 'comparison', comparisonData: {
          usLabel: 'Nova Markets', themLabel: 'Industry Average',
          rows: [
            { feature: 'EUR/USD Spread', us: 'From 0.0 pips', them: '1.0–1.5 pips' },
            { feature: 'Execution Speed', us: 'Under 30ms', them: '100–500ms' },
            { feature: 'Commission (ECN)', us: '$2.50/lot', them: '$5–7/lot' },
            { feature: 'Instruments', us: '200+', them: '50–100' },
            { feature: 'Minimum Deposit', us: '$100', them: '$200–500' },
            { feature: 'Negative Balance Protection', us: '✓ All accounts', them: 'Retail only' },
          ],
        }},
        { title: 'What Our Traders Say', type: 'testimonials', testimonials: [
          { quote: 'The execution speed and tight spreads have transformed my scalping strategy. Best broker I have used in 10 years of trading.', author: 'James T.', role: 'Professional Trader, London', rating: 5 },
          { quote: 'As a beginner, the education center and demo account gave me the confidence to start trading. The support team is incredibly responsive.', author: 'Sarah M.', role: 'Retail Trader, Dubai', rating: 5 },
          { quote: 'Moving from my previous broker was the best decision. Raw spreads on VIP are genuinely institutional-grade.', author: 'Michael K.', role: 'Fund Manager, Singapore', rating: 5 },
        ]},
        { title: 'Trade Anywhere, Anytime', type: 'icon-grid', iconItems: [
          { icon: '💻', title: 'Desktop', description: 'MT4 & MT5 for Windows and macOS' },
          { icon: '📱', title: 'Mobile', description: 'Full-featured iOS & Android apps' },
          { icon: '🌐', title: 'WebTrader', description: 'Trade from any browser, no install' },
          { icon: '🤖', title: 'API Trading', description: 'FIX API for algorithmic strategies' },
        ]},
        { title: 'Ready to Start Trading?', content: 'Open a free account in minutes and access 200+ instruments with award-winning conditions.', type: 'cta', ctaText: 'Open Live Account', ctaUrl: '#' },
      ],
      metaTitle: 'Trade with the Best — Regulated Forex & CFD Broker',
      metaDescription: 'Trade Forex, Crypto & CFDs with spreads from 0.0 pips and execution under 30ms. FCA, CySEC & DFSA regulated. Open a free account today.',
    }
  }

  // About page
  if (prompt.includes('(about)') || prompt.includes('about us')) {
    return {
      heroTitle: 'About Our Company',
      heroSubtitle: 'A trusted name in online trading since 2018. Regulated, transparent, and committed to your success across 150+ countries.',
      sections: [
        { title: 'Our Global Impact', type: 'stats', stats: [
          { value: '500K+', label: 'Active Traders' },
          { value: '150+', label: 'Countries Served' },
          { value: '$2.8B+', label: 'Monthly Volume' },
          { value: '2018', label: 'Year Founded' },
        ]},
        { title: 'Our Story', content: 'Founded by a team of experienced traders and fintech professionals in London, we set out to create a trading platform that puts clients first. What began as a small team of 12 passionate individuals has grown into a global operation with 400+ employees across four continents. Our mission remains the same: deliver institutional-grade trading conditions to every trader, regardless of account size.', type: 'text' },
        { title: 'Our Core Values', type: 'features', items: [
          { title: 'Radical Transparency', description: 'No hidden fees, no re-quotes, no dealing desk. Real-time spread data published publicly for full accountability.' },
          { title: 'Technology First', description: 'Over $15M invested in infrastructure. Equinix LD4 & NY5 data centers deliver sub-30ms execution with 99.99% uptime.' },
          { title: 'Client Security', description: 'Segregated accounts at Barclays and Deutsche Bank. ICF coverage up to €20,000 per eligible client.' },
          { title: 'Education & Empowerment', description: 'Free academy with 150+ video lessons, weekly live webinars, and daily analyst reports for all clients.' },
        ]},
        { title: 'Global Presence', type: 'two-column', leftContent: 'With offices in London, Dubai, Singapore, and Sydney, we provide localized service across every major timezone. Our multilingual team speaks 15+ languages, ensuring every client receives support in their preferred language. Each regional office is staffed with licensed professionals and local compliance officers.',
          rightItems: [
            { title: 'London (HQ)', description: 'Canary Wharf — FCA regulated operations center' },
            { title: 'Dubai', description: 'DIFC — DFSA regulated Middle East & Africa hub' },
            { title: 'Singapore', description: 'Robinson Road — Asia-Pacific operations' },
            { title: 'Sydney', description: 'Martin Place — Oceania client services' },
          ],
        },
        { title: 'Our Journey', type: 'steps', steps: [
          { step: 1, title: '2018 — Founded', description: 'Launched in London with MT4, 50 instruments, and a vision to democratize institutional trading.' },
          { step: 2, title: '2020 — Global Expansion', description: 'Opened Dubai & Singapore offices. Surpassed 100K active traders and added MT5 platform.' },
          { step: 3, title: '2022 — Technology Leap', description: 'Deployed Equinix infrastructure, launched WebTrader, and achieved sub-30ms execution.' },
          { step: 4, title: '2025 — Industry Leader', description: '500K+ traders, 200+ instruments, 3 regulatory licenses, and multiple industry awards.' },
        ]},
        { title: 'Awards & Recognition', type: 'list', items: [
          { title: 'Best Forex Broker 2025', description: 'International Finance Awards — Recognized for outstanding trading conditions and client service.' },
          { title: 'Most Transparent Broker 2025', description: 'Global Forex Awards — Awarded for pricing transparency and published execution statistics.' },
          { title: 'Best Trading Platform 2024', description: 'FinanceMagnates Summit — Recognized for our WebTrader and mobile trading experience.' },
          { title: 'Best Client Education 2024', description: 'ForexBrokers.com — Awarded for comprehensive free education center and webinar program.' },
          { title: 'Fastest Growing Broker 2023', description: 'World Finance — Recognized for 200% year-over-year client growth across MENA region.' },
        ]},
        { title: 'Join 500,000+ Traders Worldwide', content: 'Experience the difference of trading with a regulated, award-winning broker committed to your success.', type: 'cta', ctaText: 'Open Free Account', ctaUrl: '#' },
      ],
      metaTitle: 'About Us — Trusted Regulated Online Broker Since 2018',
      metaDescription: 'Learn about our company, mission, and values. FCA, CySEC & DFSA regulated broker serving 500K+ traders in 150+ countries since 2018.',
    }
  }

  // Trading Platforms page
  if (prompt.includes('(platforms)') || prompt.includes('trading platform')) {
    return {
      heroTitle: 'World-Class Trading Platforms',
      heroSubtitle: 'Trade on your terms with MetaTrader 4, MetaTrader 5, and our proprietary WebTrader — available on every device, anywhere in the world.',
      sections: [
        { title: 'Platform Performance', type: 'stats', stats: [
          { value: '<30ms', label: 'Avg Execution' },
          { value: '99.99%', label: 'Uptime SLA' },
          { value: '4', label: 'Platform Options' },
          { value: '38+', label: 'Technical Indicators' },
        ]},
        { title: 'Our Trading Platforms', type: 'features', items: [
          { title: 'MetaTrader 4', description: 'The gold standard for forex trading. Expert Advisors, 30+ indicators, one-click trading, and MQL4 scripting. Desktop, iOS & Android.' },
          { title: 'MetaTrader 5', description: 'Next-gen multi-asset trading with 21 timeframes, depth of market, built-in economic calendar, and MQL5 marketplace. Hedging & netting modes.' },
          { title: 'WebTrader', description: 'Zero-installation browser-based platform with real-time charts, 25+ indicators, risk management tools, and a clean responsive interface.' },
          { title: 'Mobile Trading', description: 'Full-featured mobile apps for iOS and Android. Push notifications, biometric login, position management, and live price alerts on the go.' },
        ]},
        { title: 'Platform Comparison', type: 'table', columns: ['Feature', 'MT4', 'MT5', 'WebTrader'], rows: [
          { 'Feature': 'One-Click Trading', 'MT4': '✓', 'MT5': '✓', 'WebTrader': '✓' },
          { 'Feature': 'Expert Advisors / Algo', 'MT4': 'MQL4', 'MT5': 'MQL5', 'WebTrader': '—' },
          { 'Feature': 'Built-in Indicators', 'MT4': '30+', 'MT5': '38+', 'WebTrader': '25+' },
          { 'Feature': 'Timeframes', 'MT4': '9', 'MT5': '21', 'WebTrader': '15' },
          { 'Feature': 'Pending Order Types', 'MT4': '4', 'MT5': '6', 'WebTrader': '4' },
          { 'Feature': 'Depth of Market', 'MT4': '—', 'MT5': '✓', 'WebTrader': '—' },
          { 'Feature': 'Economic Calendar', 'MT4': '—', 'MT5': '✓', 'WebTrader': '✓' },
          { 'Feature': 'Hedging Support', 'MT4': '✓', 'MT5': '✓', 'WebTrader': '✓' },
        ]},
        { title: 'Execution Technology', type: 'two-column', leftContent: 'Our execution infrastructure is built for speed and reliability. Co-located servers at Equinix LD4 (London) and NY5 (New York) ensure the lowest possible latency to major liquidity providers. Aggregated pricing from 15+ tier-1 banks and non-bank market makers delivers deep liquidity and minimal slippage even during high-impact news events.',
          rightItems: [
            { title: 'Equinix Co-Location', description: 'LD4 London & NY5 New York data centers for institutional-grade speed' },
            { title: '15+ Liquidity Providers', description: 'Tier-1 banks including JP Morgan, Barclays, Citi, and UBS' },
            { title: '99.99% Uptime', description: 'Redundant infrastructure with automatic failover and DDoS protection' },
            { title: 'FIX API Access', description: 'Direct market access for algorithmic and high-frequency strategies' },
          ],
        },
        { title: 'Get Started in Minutes', type: 'steps', steps: [
          { step: 1, title: 'Choose Your Platform', description: 'Select MT4, MT5, or WebTrader based on your trading style and preferences.' },
          { step: 2, title: 'Download & Install', description: 'Download for desktop/mobile or launch WebTrader directly in your browser — no installation needed.' },
          { step: 3, title: 'Login & Configure', description: 'Enter your credentials, set up your charts and watchlist, and customize your workspace.' },
          { step: 4, title: 'Start Trading', description: 'Access 200+ instruments instantly with real-time pricing and one-click execution.' },
        ]},
        { title: 'Available On Every Device', type: 'icon-grid', iconItems: [
          { icon: '🖥️', title: 'Windows', description: 'MT4 & MT5 desktop for Windows 7/10/11' },
          { icon: '🍎', title: 'macOS', description: 'Native MT4 & MT5 for Apple Silicon & Intel Macs' },
          { icon: '📱', title: 'iOS', description: 'iPhone & iPad apps on the App Store' },
          { icon: '🤖', title: 'Android', description: 'Phone & tablet apps on Google Play' },
          { icon: '🌐', title: 'Web Browser', description: 'Chrome, Safari, Firefox, Edge — any browser' },
          { icon: '⚡', title: 'FIX API', description: 'Direct connectivity for algo trading systems' },
        ]},
        { title: 'Download Your Platform Now', content: 'Get started with a free demo account and $100,000 in virtual funds. Practice risk-free on any platform.', type: 'cta', ctaText: 'Download Platform', ctaUrl: '#' },
      ],
      metaTitle: 'Trading Platforms — MT4, MT5 & WebTrader',
      metaDescription: 'Trade on MetaTrader 4, MetaTrader 5, or WebTrader. Sub-30ms execution, 38+ indicators, and mobile apps for iOS & Android.',
    }
  }

  // Account Types page
  if (prompt.includes('(account_types)') || prompt.includes('account type')) {
    return {
      heroTitle: 'Choose Your Trading Account',
      heroSubtitle: 'Flexible account types designed for every level of trader — from beginners to institutional professionals.',
      sections: [
        { title: 'Account Overview', type: 'stats', stats: [
          { value: '3', label: 'Account Tiers' },
          { value: '$100', label: 'Min. Deposit' },
          { value: '1:500', label: 'Max Leverage' },
          { value: '0.0', label: 'Pips Spread From' },
        ]},
        { title: 'Compare Account Types', type: 'pricing', tiers: [
          { name: 'Standard', price: '$100', period: 'Min. Deposit', features: ['Spreads from 1.2 pips', 'Zero commission', 'Leverage up to 1:500', '200+ instruments', '24/5 support', 'Free education center', 'All platforms included'], ctaText: 'Open Account' },
          { name: 'Premium', price: '$1,000', period: 'Min. Deposit', features: ['Spreads from 0.6 pips', '$3.50/lot commission', 'Leverage up to 1:500', '200+ instruments', 'Priority support queue', 'Free VPS hosting', 'Daily analyst reports', 'SMS trade alerts'], highlighted: true, ctaText: 'Open Account' },
          { name: 'VIP', price: '$25,000', period: 'Min. Deposit', features: ['Raw spreads from 0.0 pips', '$2.50/lot commission', 'Leverage up to 1:500', '200+ instruments', 'Dedicated account manager', 'Free VPS hosting', 'Custom liquidity pool', 'Institutional tools & FIX API'], ctaText: 'Contact Us' },
        ]},
        { title: 'Account Comparison', type: 'comparison', comparisonData: {
          usLabel: 'Nova Markets', themLabel: 'Industry Average',
          rows: [
            { feature: 'Standard Min. Deposit', us: '$100', them: '$200–500' },
            { feature: 'Standard Spread (EUR/USD)', us: '1.2 pips', them: '1.5–2.0 pips' },
            { feature: 'ECN Commission', us: 'From $2.50/lot', them: '$5–7/lot' },
            { feature: 'Leverage', us: 'Up to 1:500', them: 'Up to 1:200' },
            { feature: 'Free VPS', us: '✓ Premium & VIP', them: 'VIP only (if any)' },
            { feature: 'Negative Balance Protection', us: '✓ All accounts', them: 'Retail only' },
          ],
        }},
        { title: 'Every Account Includes', type: 'features', items: [
          { title: 'Segregated Funds', description: 'Your money is held in segregated accounts at Barclays and Deutsche Bank — completely separate from company funds.' },
          { title: 'Negative Balance Protection', description: 'You can never lose more than your deposited balance. Guaranteed for all retail clients across every account type.' },
          { title: 'Free Demo Account', description: 'Practice risk-free with $100,000 in virtual funds. Unlimited duration with real market conditions and pricing.' },
          { title: 'Instant Deposits', description: 'Fund your account instantly via credit/debit card, Skrill, Neteller, or crypto (USDT). Bank transfers processed within 24h.' },
          { title: 'All Platforms Included', description: 'Access MT4, MT5, and WebTrader with every account type. Mobile apps included for iOS and Android.' },
          { title: 'Islamic (Swap-Free) Option', description: 'Swap-free accounts available for all tiers upon request. Compliant with Sharia principles.' },
        ]},
        { title: 'Open Your Account in Minutes', type: 'steps', steps: [
          { step: 1, title: 'Register Online', description: 'Complete the application form in under 2 minutes with your email and basic details.' },
          { step: 2, title: 'Verify Identity', description: 'Upload your ID and proof of address. Most verifications are approved within 1 hour.' },
          { step: 3, title: 'Fund & Trade', description: 'Make your first deposit and start trading on your preferred platform immediately.' },
        ]},
        { title: 'Important Information', type: 'banner', bannerType: 'info', bannerIcon: 'ℹ️', content: 'Not sure which account is right for you? Start with a free demo account to test all features, or contact our team for a personalized recommendation based on your trading experience and goals.' },
        { title: 'Get Started Today', content: 'Open your account in minutes with our streamlined onboarding process. No hidden fees, no commitments.', type: 'cta', ctaText: 'Open Live Account', ctaUrl: '#' },
      ],
      metaTitle: 'Account Types — Standard, Premium & VIP Trading Accounts',
      metaDescription: 'Compare Standard, Premium & VIP trading accounts. Spreads from 0.0 pips, leverage up to 1:500, and 200+ instruments. Open a free account today.',
    }
  }

  // Pricing & Spreads page — ONLY match (pricing) pageType, not the word "pricing" which appears in all prompts
  if (prompt.includes('(pricing)')) {
    return {
      heroTitle: 'Transparent Pricing & Tight Spreads',
      heroSubtitle: 'No hidden fees. No re-quotes. No dealing desk. Competitive spreads starting from 0.0 pips with full cost transparency.',
      sections: [
        { title: 'Pricing at a Glance', type: 'stats', stats: [
          { value: '0.0', label: 'Pips From (EUR/USD)' },
          { value: '$0', label: 'Deposit Fees' },
          { value: '$0', label: 'Withdrawal Fees' },
          { value: '24h', label: 'Withdrawal Processing' },
        ]},
        { title: 'Live Spreads by Account Type', type: 'table', columns: ['Instrument', 'Standard', 'Premium', 'VIP'], rows: [
          { 'Instrument': 'EUR/USD', 'Standard': '1.2 pips', 'Premium': '0.6 pips', 'VIP': '0.0 pips' },
          { 'Instrument': 'GBP/USD', 'Standard': '1.5 pips', 'Premium': '0.8 pips', 'VIP': '0.1 pips' },
          { 'Instrument': 'USD/JPY', 'Standard': '1.3 pips', 'Premium': '0.7 pips', 'VIP': '0.1 pips' },
          { 'Instrument': 'AUD/USD', 'Standard': '1.4 pips', 'Premium': '0.7 pips', 'VIP': '0.2 pips' },
          { 'Instrument': 'Gold (XAU/USD)', 'Standard': '2.5 pips', 'Premium': '1.5 pips', 'VIP': '0.5 pips' },
          { 'Instrument': 'BTC/USD', 'Standard': '$35', 'Premium': '$20', 'VIP': '$10' },
          { 'Instrument': 'US500 (S&P)', 'Standard': '0.5 pts', 'Premium': '0.4 pts', 'VIP': '0.3 pts' },
        ]},
        { title: 'Commission Structure', type: 'features', items: [
          { title: 'Standard — Zero Commission', description: 'All costs built into the spread. No per-trade fees. Ideal for beginners and swing traders.' },
          { title: 'Premium — $3.50/lot', description: 'Per side commission with raw spreads from 0.6 pips. Best value for active day traders.' },
          { title: 'VIP — $2.50/lot', description: 'Per side commission with institutional raw spreads from 0.0 pips. Designed for professional and high-volume traders.' },
        ]},
        { title: 'Our Pricing vs Industry', type: 'comparison', comparisonData: {
          usLabel: 'Nova Markets', themLabel: 'Industry Average',
          rows: [
            { feature: 'EUR/USD Spread (ECN)', us: 'From 0.0 pips', them: '0.2–0.5 pips' },
            { feature: 'Commission per lot', us: 'From $2.50', them: '$5.00–7.00' },
            { feature: 'Deposit Fee', us: '$0 — Always Free', them: '0–2%' },
            { feature: 'Withdrawal Fee', us: '$0 — Always Free', them: '$5–25' },
            { feature: 'Inactivity Fee', us: 'None for 12 months', them: '$5–15/month' },
            { feature: 'Swap Transparency', us: 'Published daily', them: 'Often hidden' },
          ],
        }},
        { title: 'Deposit & Withdrawal Methods', type: 'table', columns: ['Method', 'Min Deposit', 'Processing', 'Fee'], rows: [
          { 'Method': 'Bank Wire Transfer', 'Min Deposit': '$100', 'Processing': '1-3 business days', 'Fee': 'Free' },
          { 'Method': 'Visa / Mastercard', 'Min Deposit': '$50', 'Processing': 'Instant', 'Fee': 'Free' },
          { 'Method': 'Skrill', 'Min Deposit': '$50', 'Processing': 'Instant', 'Fee': 'Free' },
          { 'Method': 'Neteller', 'Min Deposit': '$50', 'Processing': 'Instant', 'Fee': 'Free' },
          { 'Method': 'Crypto (USDT/BTC)', 'Min Deposit': '$50', 'Processing': '10-30 minutes', 'Fee': 'Free' },
          { 'Method': 'Local Bank Transfer', 'Min Deposit': '$100', 'Processing': 'Same day', 'Fee': 'Free' },
        ]},
        { title: 'Fee Transparency Commitment', type: 'banner', bannerType: 'info', bannerIcon: '💡', content: 'We publish real-time spread data and full fee schedules publicly. No hidden charges, no surprise costs. Swap rates updated daily in your trading platform. Inactivity fee of $10/month applies only after 12 consecutive months of inactivity.' },
        { title: 'Start Trading with Transparent Pricing', content: 'Open an account and experience truly competitive pricing with no hidden costs.', type: 'cta', ctaText: 'Open Account', ctaUrl: '#' },
      ],
      metaTitle: 'Pricing & Spreads — Transparent Trading Costs from 0.0 Pips',
      metaDescription: 'Transparent pricing with spreads from 0.0 pips. Zero deposit and withdrawal fees. Compare our spreads, commissions, and payment methods.',
    }
  }

  // Education page
  if (prompt.includes('(education)') || prompt.includes('education center')) {
    return {
      heroTitle: 'Trading Education Center',
      heroSubtitle: 'From beginner basics to advanced strategies — free courses, live webinars, and 150+ video tutorials to sharpen your edge.',
      sections: [
        { title: 'Education by the Numbers', type: 'stats', stats: [
          { value: '150+', label: 'Video Lessons' },
          { value: '45+', label: 'Course Modules' },
          { value: '3', label: 'Skill Levels' },
          { value: '100%', label: 'Free Access' },
        ]},
        { title: 'Learning Paths', type: 'features', items: [
          { title: 'Beginner Course (12 Lessons)', description: 'Introduction to forex and CFDs, reading charts, placing your first trade, understanding pips/lots, and essential risk management.' },
          { title: 'Intermediate Course (18 Lessons)', description: 'Technical analysis deep dive: candlestick patterns, support & resistance, Fibonacci, moving averages, and building a trading plan.' },
          { title: 'Advanced Strategies (15 Lessons)', description: 'Price action mastery, harmonic patterns, multi-timeframe analysis, algorithmic trading with MQL, and portfolio management.' },
          { title: 'Live Webinars (Weekly)', description: 'Live sessions every Monday & Wednesday at 14:00 GMT with professional analysts. Real-time market analysis, trade setups, and Q&A.' },
        ]},
        { title: 'Your Learning Journey', type: 'steps', steps: [
          { step: 1, title: 'Open a Free Demo', description: 'Create a demo account with $100,000 virtual funds — practice everything you learn risk-free.' },
          { step: 2, title: 'Choose Your Level', description: 'Start with Beginner, Intermediate, or Advanced courses based on your experience.' },
          { step: 3, title: 'Learn & Practice', description: 'Watch video lessons, complete quizzes, and apply strategies on your demo account in real market conditions.' },
          { step: 4, title: 'Go Live When Ready', description: 'Transition to a live account when confident. Start small and scale up as your skills grow.' },
        ]},
        { title: 'Educational Resources', type: 'icon-grid', iconItems: [
          { icon: '🎥', title: 'Video Tutorials', description: '150+ on-demand lessons covering all topics' },
          { icon: '📊', title: 'Market Analysis', description: 'Daily technical & fundamental reports' },
          { icon: '🎙️', title: 'Live Webinars', description: 'Weekly sessions with pro analysts' },
          { icon: '📖', title: 'Trading eBooks', description: 'Downloadable guides and strategy PDFs' },
          { icon: '📰', title: 'Economic Calendar', description: 'Track market-moving events in real time' },
          { icon: '🏆', title: 'Trading Quizzes', description: 'Test your knowledge after each module' },
        ]},
        { title: 'Trading Glossary', type: 'list', items: [
          { title: 'Pip', description: 'The smallest price movement in a currency pair, typically 0.0001 for most pairs (0.01 for JPY pairs).' },
          { title: 'Spread', description: 'The difference between the bid (sell) and ask (buy) price. Your primary trading cost on Standard accounts.' },
          { title: 'Leverage', description: 'Borrowed capital that magnifies your market exposure. 1:500 leverage means $1 controls $500 of market value.' },
          { title: 'Stop Loss', description: 'A risk management order that automatically closes your trade at a predetermined loss level to limit downside.' },
          { title: 'Margin', description: 'The collateral deposit required to open and maintain a leveraged position. Varies by instrument and leverage.' },
          { title: 'Lot', description: 'A standardized unit of trading. 1 standard lot = 100,000 units. Mini lots (10K) and micro lots (1K) also available.' },
          { title: 'Swap', description: 'The overnight interest charge or credit applied when holding positions past the daily rollover time (typically 5pm EST).' },
        ]},
        { title: 'What Our Students Say', type: 'testimonials', testimonials: [
          { quote: 'The beginner course gave me the foundations I needed. Within 3 months of studying and demo trading, I opened my first live account with confidence.', author: 'David R.', role: 'Beginner Trader, Germany', rating: 5 },
          { quote: 'The live webinars are incredibly valuable. Being able to ask questions in real-time and see professional analysis has accelerated my learning dramatically.', author: 'Amina K.', role: 'Intermediate Trader, UAE', rating: 5 },
        ]},
        { title: 'Start Learning Today — 100% Free', content: 'All educational resources are completely free for registered clients. Open a demo account and begin your trading education journey.', type: 'cta', ctaText: 'Open Free Demo', ctaUrl: '#' },
      ],
      metaTitle: 'Education Center — Free Trading Courses, Webinars & Tutorials',
      metaDescription: 'Free trading courses for all levels: 150+ video lessons, live webinars, eBooks, and trading glossary. Learn to trade forex and CFDs.',
    }
  }

  // Forex Trading page — don't use broad 'forex' check since niche 'forex broker' appears in all prompts
  if (prompt.includes('forex trading') || prompt.includes('markets/forex') || prompt.includes('currency pair')) {
    return {
      heroTitle: 'Trade Forex — The World\'s Largest Market',
      heroSubtitle: 'Access 70+ currency pairs with spreads from 0.0 pips, leverage up to 1:500, and execution under 30ms.',
      sections: [
        { title: 'Forex at a Glance', type: 'stats', stats: [
          { value: '70+', label: 'Currency Pairs' },
          { value: '0.0', label: 'Pips Spread From' },
          { value: '1:500', label: 'Max Leverage' },
          { value: '$7T+', label: 'Daily Market Volume' },
        ]},
        { title: 'Why Trade Forex With Us', type: 'features', items: [
          { title: '70+ Currency Pairs', description: 'Comprehensive coverage of majors, minors, and exotics including EUR/USD, GBP/JPY, USD/ZAR, EUR/TRY, and more.' },
          { title: 'Raw Spreads from 0.0', description: 'Institutional-grade pricing aggregated from 15+ tier-1 liquidity providers. No dealing desk, no re-quotes.' },
          { title: '24/5 Market Access', description: 'Trade around the clock from Sydney open (22:00 GMT Sunday) to New York close (22:00 GMT Friday).' },
          { title: 'Deep Liquidity Pool', description: 'Aggregated pricing from JP Morgan, Barclays, Citi, UBS, and 11+ more providers ensures minimal slippage.' },
          { title: 'Advanced Order Types', description: 'Market, limit, stop, trailing stop, and OCO orders. Partial fills and instant execution supported.' },
          { title: 'Hedging Allowed', description: 'Open both long and short positions on the same pair simultaneously. Full hedging support on all accounts.' },
        ]},
        { title: 'Popular Forex Pairs', type: 'table', columns: ['Pair', 'Spread From', 'Leverage', 'Swap Long', 'Swap Short'], rows: [
          { 'Pair': 'EUR/USD', 'Spread From': '0.0 pips', 'Leverage': '1:500', 'Swap Long': '-6.5', 'Swap Short': '+1.2' },
          { 'Pair': 'GBP/USD', 'Spread From': '0.1 pips', 'Leverage': '1:500', 'Swap Long': '-5.8', 'Swap Short': '+0.9' },
          { 'Pair': 'USD/JPY', 'Spread From': '0.1 pips', 'Leverage': '1:500', 'Swap Long': '+4.2', 'Swap Short': '-8.1' },
          { 'Pair': 'AUD/USD', 'Spread From': '0.2 pips', 'Leverage': '1:500', 'Swap Long': '-3.2', 'Swap Short': '+0.5' },
          { 'Pair': 'USD/CAD', 'Spread From': '0.3 pips', 'Leverage': '1:500', 'Swap Long': '+1.8', 'Swap Short': '-5.4' },
          { 'Pair': 'EUR/GBP', 'Spread From': '0.3 pips', 'Leverage': '1:500', 'Swap Long': '-4.1', 'Swap Short': '+0.3' },
        ]},
        { title: 'Understanding Forex Trading', type: 'two-column', leftContent: 'Forex (Foreign Exchange) is the global marketplace for trading currencies. With a daily volume exceeding $7 trillion, it is the most liquid financial market in the world. Traders profit from changes in exchange rates between currency pairs. The market operates 24 hours a day, 5 days a week, across major financial centers in London, New York, Tokyo, and Sydney.',
          rightItems: [
            { title: 'Major Pairs', description: 'EUR/USD, GBP/USD, USD/JPY, USD/CHF — highest liquidity, tightest spreads' },
            { title: 'Minor Pairs', description: 'EUR/GBP, AUD/NZD, GBP/JPY — good liquidity, moderate spreads' },
            { title: 'Exotic Pairs', description: 'USD/ZAR, EUR/TRY, USD/MXN — higher volatility, wider spreads' },
          ],
        },
        { title: 'Start Trading Forex in 3 Steps', type: 'steps', steps: [
          { step: 1, title: 'Open & Verify', description: 'Complete registration and KYC verification in under 10 minutes.' },
          { step: 2, title: 'Fund Your Account', description: 'Deposit from $100 via card, bank, e-wallet, or crypto.' },
          { step: 3, title: 'Trade 70+ Pairs', description: 'Launch MT4/MT5/WebTrader and access the forex market instantly.' },
        ]},
        { title: 'Risk Warning', type: 'banner', bannerType: 'warning', bannerIcon: '⚠️', content: 'Forex trading involves significant risk of loss. Leverage amplifies both profits and losses. Approximately 70-80% of retail CFD accounts lose money. Ensure you understand the risks and only trade with capital you can afford to lose.' },
        { title: 'Open Your Forex Trading Account', content: 'Start trading 70+ currency pairs with institutional-grade conditions. Free demo available with $100K virtual funds.', type: 'cta', ctaText: 'Start Forex Trading', ctaUrl: '#' },
      ],
      metaTitle: 'Forex Trading — 70+ Currency Pairs from 0.0 Pips',
      metaDescription: 'Trade 70+ forex pairs with raw spreads from 0.0 pips and leverage up to 1:500. Deep liquidity from 15+ tier-1 banks. Start trading today.',
    }
  }

  // Crypto page
  if (prompt.includes('crypto') || prompt.includes('bitcoin')) {
    return {
      heroTitle: 'Trade Crypto CFDs — Go Long or Short',
      heroSubtitle: 'Trade Bitcoin, Ethereum, and 30+ cryptocurrencies as CFDs with leverage up to 1:20. No wallet needed. 24/7 markets.',
      sections: [
        { title: 'Crypto Trading Overview', type: 'stats', stats: [
          { value: '30+', label: 'Crypto Pairs' },
          { value: '1:20', label: 'Max Leverage' },
          { value: '24/7', label: 'Market Access' },
          { value: '$0', label: 'Wallet Fees' },
        ]},
        { title: 'Why Trade Crypto CFDs With Us', type: 'features', items: [
          { title: '30+ Crypto Pairs', description: 'BTC, ETH, SOL, XRP, DOGE, ADA, AVAX, MATIC, LINK, DOT and more — paired against USD and EUR.' },
          { title: 'Leverage Up to 1:20', description: 'Amplify your crypto exposure without holding the underlying asset. Go long or short on any crypto pair.' },
          { title: '24/7 Market Access', description: 'Crypto markets never close. Trade Bitcoin and altcoins any time — including weekends and holidays.' },
          { title: 'No Wallet Required', description: 'Trade crypto price movements as CFDs. No wallets, no private keys, no blockchain complexity.' },
          { title: 'Tight Spreads', description: 'Competitive crypto spreads starting from $10 on BTC/USD. No hidden fees or markups on crypto pairs.' },
          { title: 'Risk Management Tools', description: 'Stop loss, take profit, and trailing stop orders. Negative balance protection on all crypto positions.' },
        ]},
        { title: 'Available Crypto Assets', type: 'table', columns: ['Asset', 'Symbol', 'Spread From', 'Leverage', 'Trading'], rows: [
          { 'Asset': 'Bitcoin', 'Symbol': 'BTC/USD', 'Spread From': '$15', 'Leverage': '1:20', 'Trading': '24/7' },
          { 'Asset': 'Ethereum', 'Symbol': 'ETH/USD', 'Spread From': '$2', 'Leverage': '1:20', 'Trading': '24/7' },
          { 'Asset': 'Solana', 'Symbol': 'SOL/USD', 'Spread From': '$0.10', 'Leverage': '1:10', 'Trading': '24/7' },
          { 'Asset': 'Ripple (XRP)', 'Symbol': 'XRP/USD', 'Spread From': '$0.005', 'Leverage': '1:10', 'Trading': '24/7' },
          { 'Asset': 'Cardano', 'Symbol': 'ADA/USD', 'Spread From': '$0.003', 'Leverage': '1:10', 'Trading': '24/7' },
          { 'Asset': 'Dogecoin', 'Symbol': 'DOGE/USD', 'Spread From': '$0.001', 'Leverage': '1:10', 'Trading': '24/7' },
          { 'Asset': 'Avalanche', 'Symbol': 'AVAX/USD', 'Spread From': '$0.08', 'Leverage': '1:10', 'Trading': '24/7' },
          { 'Asset': 'Polkadot', 'Symbol': 'DOT/USD', 'Spread From': '$0.02', 'Leverage': '1:10', 'Trading': '24/7' },
        ]},
        { title: 'Crypto CFDs vs. Exchange Trading', type: 'two-column', leftContent: 'With crypto CFDs, you trade the price movement without owning the underlying asset. This means no blockchain fees, no wallet security concerns, and the ability to profit from both rising and falling prices using leverage. All positions are settled in your account currency (USD/EUR) with instant execution.',
          rightItems: [
            { title: 'Go Long & Short', description: 'Profit from both bull and bear markets — short Bitcoin as easily as going long' },
            { title: 'Use Leverage', description: 'Control $20,000 of Bitcoin with just $1,000 using 1:20 leverage' },
            { title: 'No Blockchain Fees', description: 'Zero gas fees, zero network fees. Only the spread and swap apply' },
            { title: 'Instant Settlement', description: 'Profits credited to your account immediately. No blockchain confirmation wait' },
          ],
        },
        { title: 'What Our Crypto Traders Say', type: 'testimonials', testimonials: [
          { quote: 'Being able to short crypto during the bear market was a game-changer. The tight spreads on BTC and ETH are genuinely competitive with top crypto brokers.', author: 'Alex P.', role: 'Crypto Trader, UK', rating: 5 },
          { quote: 'No wallet setup, no gas fees, no exchange hacks to worry about. Trading crypto as CFDs is so much simpler, and the leverage allows me to be more capital efficient.', author: 'Yuki T.', role: 'Day Trader, Japan', rating: 5 },
        ]},
        { title: 'Crypto Risk Warning', type: 'banner', bannerType: 'warning', bannerIcon: '⚠️', content: 'Cryptocurrency CFDs are highly volatile instruments. Prices can swing 10-20% in a single day. Only trade with capital you can afford to lose and always use stop-loss orders. Leverage magnifies both potential profits and losses.' },
        { title: 'Start Trading Crypto', content: 'Access 30+ crypto pairs 24/7 with leverage. No wallet needed — trade from MT4, MT5, or WebTrader.', type: 'cta', ctaText: 'Trade Crypto Now', ctaUrl: '#' },
      ],
      metaTitle: 'Crypto CFD Trading — Bitcoin, Ethereum & 30+ Coins',
      metaDescription: 'Trade 30+ crypto CFDs with leverage up to 1:20. Bitcoin, Ethereum, Solana, XRP, and more. 24/7 trading, no wallet needed.',
    }
  }

  // Commodities page
  if (prompt.includes('commod')) {
    return {
      heroTitle: 'Trade Commodities — Gold, Oil & More',
      heroSubtitle: 'Access global commodity markets — precious metals, energy, and agriculture with tight spreads and leverage up to 1:200.',
      sections: [
        { title: 'Commodities Overview', type: 'stats', stats: [
          { value: '20+', label: 'Commodity CFDs' },
          { value: '1:200', label: 'Max Leverage' },
          { value: '0.25', label: 'Gold Spread From' },
          { value: '23/5', label: 'Trading Hours' },
        ]},
        { title: 'Commodity Categories', type: 'features', items: [
          { title: 'Precious Metals', description: 'Gold (XAU/USD), Silver (XAG/USD), Platinum (XPT/USD), and Palladium (XPD/USD). Tight spreads and deep liquidity.' },
          { title: 'Energy Markets', description: 'WTI Crude Oil, Brent Crude, Natural Gas, and Heating Oil. Trade the world\'s most important energy benchmarks.' },
          { title: 'Agricultural Products', description: 'Coffee, Cocoa, Sugar, Cotton, Wheat, Corn, and Soybeans. Diversify into soft and hard agricultural commodities.' },
          { title: 'Industrial Metals', description: 'Copper, Aluminium, and Zinc CFDs. Track global industrial demand and supply dynamics.' },
        ]},
        { title: 'Commodity Spreads & Leverage', type: 'table', columns: ['Commodity', 'Symbol', 'Spread From', 'Leverage', 'Hours'], rows: [
          { 'Commodity': 'Gold', 'Symbol': 'XAU/USD', 'Spread From': '0.25 pips', 'Leverage': '1:200', 'Hours': '23/5' },
          { 'Commodity': 'Silver', 'Symbol': 'XAG/USD', 'Spread From': '0.02 pips', 'Leverage': '1:100', 'Hours': '23/5' },
          { 'Commodity': 'WTI Crude Oil', 'Symbol': 'CL', 'Spread From': '0.03 pts', 'Leverage': '1:100', 'Hours': '23/5' },
          { 'Commodity': 'Brent Crude', 'Symbol': 'BRENT', 'Spread From': '0.04 pts', 'Leverage': '1:100', 'Hours': '01:00-23:00' },
          { 'Commodity': 'Natural Gas', 'Symbol': 'NG', 'Spread From': '0.005', 'Leverage': '1:50', 'Hours': '23/5' },
          { 'Commodity': 'Copper', 'Symbol': 'COPPER', 'Spread From': '0.004', 'Leverage': '1:50', 'Hours': '23/5' },
          { 'Commodity': 'Coffee', 'Symbol': 'COFFEE', 'Spread From': '0.5', 'Leverage': '1:20', 'Hours': '09:15-18:30' },
        ]},
        { title: 'Why Trade Commodities', type: 'two-column', leftContent: 'Commodities are a cornerstone of portfolio diversification and an effective hedge against inflation. Gold alone sees over $150 billion in daily trading volume. Oil prices influence global economic activity, making energy CFDs essential for macro traders. Agricultural commodities offer seasonal patterns and unique supply-demand dynamics.',
          rightItems: [
            { title: 'Inflation Hedge', description: 'Gold and silver historically rise during inflationary periods, protecting purchasing power' },
            { title: 'Portfolio Diversification', description: 'Low correlation with equities makes commodities ideal for balanced portfolios' },
            { title: 'Geopolitical Exposure', description: 'Oil and gas prices respond to geopolitical events, offering trading opportunities' },
            { title: 'Seasonal Patterns', description: 'Agricultural commodities follow planting and harvest cycles with predictable volatility' },
          ],
        },
        { title: 'Start Trading in 3 Steps', type: 'steps', steps: [
          { step: 1, title: 'Open Your Account', description: 'Register and verify in under 10 minutes. Fund with just $100 to start.' },
          { step: 2, title: 'Choose Your Commodity', description: 'Select from 20+ commodity CFDs across metals, energy, and agriculture.' },
          { step: 3, title: 'Execute Your Trade', description: 'Go long or short with leverage. Set stop-loss and take-profit to manage risk.' },
        ]},
        { title: 'Trade Commodities with Confidence', content: 'Access 20+ commodity CFDs with institutional conditions, deep liquidity, and fast execution.', type: 'cta', ctaText: 'Start Trading', ctaUrl: '#' },
      ],
      metaTitle: 'Commodities Trading — Gold, Oil, Silver & Agriculture',
      metaDescription: 'Trade 20+ commodity CFDs: gold, silver, oil, natural gas, and agricultural products. Spreads from 0.25 pips, leverage up to 1:200.',
    }
  }

  // Indices page
  if (prompt.includes('indic')) {
    return {
      heroTitle: 'Trade Global Stock Indices',
      heroSubtitle: 'Speculate on the world\'s top stock indices — S&P 500, NASDAQ 100, FTSE 100, DAX 40, and Nikkei 225 with tight spreads.',
      sections: [
        { title: 'Index Trading Overview', type: 'stats', stats: [
          { value: '15+', label: 'Global Indices' },
          { value: '1:200', label: 'Max Leverage' },
          { value: '0.4 pts', label: 'S&P 500 From' },
          { value: '23/5', label: 'Trading Hours' },
        ]},
        { title: 'Available Indices', type: 'table', columns: ['Index', 'Symbol', 'Spread From', 'Leverage', 'Hours'], rows: [
          { 'Index': 'S&P 500', 'Symbol': 'US500', 'Spread From': '0.4 pts', 'Leverage': '1:200', 'Hours': '23/5' },
          { 'Index': 'NASDAQ 100', 'Symbol': 'USTEC', 'Spread From': '1.0 pts', 'Leverage': '1:200', 'Hours': '23/5' },
          { 'Index': 'Dow Jones 30', 'Symbol': 'US30', 'Spread From': '1.5 pts', 'Leverage': '1:200', 'Hours': '23/5' },
          { 'Index': 'FTSE 100', 'Symbol': 'UK100', 'Spread From': '1.0 pts', 'Leverage': '1:200', 'Hours': '08:00-16:30' },
          { 'Index': 'DAX 40', 'Symbol': 'GER40', 'Spread From': '1.2 pts', 'Leverage': '1:200', 'Hours': '08:00-22:00' },
          { 'Index': 'Nikkei 225', 'Symbol': 'JP225', 'Spread From': '7.0 pts', 'Leverage': '1:100', 'Hours': '00:00-06:30' },
          { 'Index': 'ASX 200', 'Symbol': 'AUS200', 'Spread From': '2.0 pts', 'Leverage': '1:100', 'Hours': '00:00-06:00' },
          { 'Index': 'Euro Stoxx 50', 'Symbol': 'EU50', 'Spread From': '1.5 pts', 'Leverage': '1:200', 'Hours': '08:00-22:00' },
        ]},
        { title: 'Why Trade Indices With Us', type: 'features', items: [
          { title: 'Instant Diversification', description: 'A single trade gives exposure to a basket of top companies. S&P 500 covers 500 of America\'s largest corporations.' },
          { title: 'Low Margins', description: 'Trade major indices with leverage up to 1:200. Control $200,000 of index exposure with just $1,000.' },
          { title: 'Go Long & Short', description: 'Profit from both rising and falling markets. Short indices during downturns as easily as going long in rallies.' },
          { title: 'Competitive Swap Rates', description: 'Transparent overnight financing with competitive swap rates published daily for all index positions.' },
        ]},
        { title: 'Understanding Index CFDs', type: 'two-column', leftContent: 'Index CFDs let you speculate on the direction of global equity markets without owning individual stocks. Each index tracks the performance of a group of shares — the S&P 500 tracks 500 large US companies, while the FTSE 100 tracks the 100 largest UK-listed firms. Index trading is popular for macro traders who follow economic cycles, central bank decisions, and earnings seasons.',
          rightItems: [
            { title: 'US Markets', description: 'S&P 500, NASDAQ 100, Dow Jones 30 — world\'s most liquid indices' },
            { title: 'European Markets', description: 'DAX 40, FTSE 100, Euro Stoxx 50, CAC 40' },
            { title: 'Asian Markets', description: 'Nikkei 225, Hang Seng, ASX 200' },
          ],
        },
        { title: 'Trading Tip', type: 'banner', bannerType: 'info', bannerIcon: '💡', content: 'Index markets are heavily influenced by macroeconomic events. Follow the economic calendar for Non-Farm Payrolls, GDP, CPI data, and central bank interest rate decisions — these events drive major index movements.' },
        { title: 'Start Trading Global Indices', content: 'Access 15+ global stock indices with leverage up to 1:200 and spreads from 0.4 points.', type: 'cta', ctaText: 'Open Account', ctaUrl: '#' },
      ],
      metaTitle: 'Index Trading — S&P 500, NASDAQ, DAX, FTSE & More',
      metaDescription: 'Trade 15+ global stock indices with spreads from 0.4 points and leverage up to 1:200. S&P 500, NASDAQ, FTSE 100, DAX 40, and more.',
    }
  }

  // Market Analysis page
  if (prompt.includes('(analysis)') || prompt.includes('market analysis')) {
    return {
      heroTitle: 'Market Analysis & Insights',
      heroSubtitle: 'Daily analysis from our team of 12 professional analysts. Technical reports, fundamental insights, and actionable trade ideas — all free.',
      sections: [
        { title: 'Analysis Resources', type: 'stats', stats: [
          { value: '12', label: 'Professional Analysts' },
          { value: '5x', label: 'Reports Per Day' },
          { value: '100+', label: 'Monthly Trade Ideas' },
          { value: '100%', label: 'Free Access' },
        ]},
        { title: 'Today\'s Market Overview', content: 'Markets remain focused on central bank policy decisions and key economic data releases. The US Dollar holds firm ahead of this week\'s FOMC meeting minutes, while the Euro finds support near key technical levels around 1.0850. Gold consolidates above $2,300 as geopolitical tensions and rate cut expectations provide a solid floor. Crude oil trades near $78 as OPEC+ production cuts offset demand concerns.', type: 'text' },
        { title: 'Analysis Categories', type: 'features', items: [
          { title: 'Daily Technical Analysis', description: 'Chart patterns, support/resistance levels, Fibonacci, moving averages, and price action setups. Updated every morning before the London session.' },
          { title: 'Fundamental Research', description: 'In-depth coverage of economic calendar events, central bank decisions, GDP, NFP, CPI, and PMI data across G10 economies.' },
          { title: 'Actionable Trading Signals', description: 'Entry, stop-loss, and take-profit levels from our analysts. Average of 5 signals per day across forex, gold, and indices.' },
          { title: 'Live Webinars', description: 'Live market review sessions every Monday & Wednesday at 14:00 GMT. Real-time analysis, trade setups, and Q&A with pro analysts.' },
          { title: 'Weekly Outlook Report', description: 'Comprehensive PDF report every Sunday with the key themes, levels, and trading opportunities for the week ahead.' },
          { title: 'Economic Calendar', description: 'Real-time calendar highlighting NFP, CPI, GDP, interest rate decisions, and PMI data with impact ratings and forecasts.' },
        ]},
        { title: 'Analysis Tools & Resources', type: 'icon-grid', iconItems: [
          { icon: '📊', title: 'Technical Charts', description: 'Daily chart analysis with key levels' },
          { icon: '📰', title: 'Fundamental News', description: 'Breaking market news and analysis' },
          { icon: '🎯', title: 'Trade Signals', description: '5+ actionable ideas per day' },
          { icon: '📅', title: 'Economic Calendar', description: 'All major data releases and events' },
          { icon: '🎙️', title: 'Live Webinars', description: 'Twice-weekly live sessions' },
          { icon: '📄', title: 'Weekly Reports', description: 'PDF outlook every Sunday' },
        ]},
        { title: 'How to Use Our Analysis', type: 'steps', steps: [
          { step: 1, title: 'Check the Daily Overview', description: 'Read the morning briefing to understand the key themes, levels, and sentiment for the day.' },
          { step: 2, title: 'Review Technical Levels', description: 'Check support/resistance levels and chart patterns on your preferred instruments.' },
          { step: 3, title: 'Follow Trade Signals', description: 'Review analyst signals with entry, stop-loss, and take-profit levels. Adapt to your own risk tolerance.' },
          { step: 4, title: 'Watch the Calendar', description: 'Prepare for high-impact events like NFP, CPI, and rate decisions that move markets.' },
        ]},
        { title: 'Access Free Market Analysis', content: 'All analysis resources are completely free for registered clients. Open an account and receive daily insights from our professional team.', type: 'cta', ctaText: 'Get Free Analysis', ctaUrl: '#' },
      ],
      metaTitle: 'Market Analysis — Daily Forex, Gold & Trading Insights',
      metaDescription: 'Free daily market analysis, trading signals, and economic calendar. Technical and fundamental analysis from 12 professional analysts.',
    }
  }

  // Contact page
  if (prompt.includes('(contact)') || prompt.includes('contact us')) {
    return {
      heroTitle: 'Get in Touch',
      heroSubtitle: 'Our multilingual support team is available 24/5 to help you in 15+ languages via live chat, email, and phone.',
      sections: [
        { title: 'Support at a Glance', type: 'stats', stats: [
          { value: '<2 min', label: 'Chat Response' },
          { value: '24/5', label: 'Availability' },
          { value: '15+', label: 'Languages' },
          { value: '4', label: 'Global Offices' },
        ]},
        { title: 'Contact Methods', type: 'features', items: [
          { title: 'Live Chat', description: 'Chat with our support team directly from the platform or website. Average response time under 2 minutes. Available 24/5.' },
          { title: 'Email Support', description: 'Send us a message at support@novamarkets.com. We respond within 4 hours during business days, usually much faster.' },
          { title: 'Phone Support', description: 'Call us at +44 20 1234 5678 (UK), +971 4 123 4567 (Dubai), or +65 6789 0123 (Singapore). Available 24/5.' },
          { title: 'WhatsApp', description: 'Message us on WhatsApp for quick support. Send documents, screenshots, and get instant help on the go.' },
        ]},
        { title: 'Dedicated Departments', type: 'two-column', leftContent: 'For specialized assistance, you can reach our dedicated departments directly. Each department is staffed with qualified professionals who can handle specific inquiries efficiently.',
          rightItems: [
            { title: 'General Support', description: 'support@novamarkets.com — Account questions, platform help, deposits & withdrawals' },
            { title: 'Compliance & KYC', description: 'compliance@novamarkets.com — Document verification, regulatory inquiries' },
            { title: 'Partnerships', description: 'partners@novamarkets.com — IB, affiliate, and white label inquiries' },
            { title: 'Institutional Sales', description: 'institutional@novamarkets.com — Prime brokerage, FIX API, custom liquidity' },
          ],
        },
        { title: 'We Speak Your Language', type: 'icon-grid', iconItems: [
          { icon: '🇬🇧', title: 'English', description: '24/5 support' },
          { icon: '🇦🇪', title: 'Arabic', description: '24/5 support' },
          { icon: '🇪🇸', title: 'Spanish', description: 'Business hours' },
          { icon: '🇫🇷', title: 'French', description: 'Business hours' },
          { icon: '🇩🇪', title: 'German', description: 'Business hours' },
          { icon: '🇨🇳', title: 'Chinese', description: 'Asia hours' },
          { icon: '🇯🇵', title: 'Japanese', description: 'Asia hours' },
          { icon: '🇵🇹', title: 'Portuguese', description: 'Business hours' },
        ]},
        { title: 'Office Locations', type: 'list', items: [
          { title: 'London (HQ)', description: '123 Financial Street, Canary Wharf, London E14 5AB, United Kingdom — +44 20 1234 5678' },
          { title: 'Dubai', description: 'Suite 2501, DIFC Gate Building, Dubai International Financial Centre, UAE — +971 4 123 4567' },
          { title: 'Singapore', description: '80 Robinson Road, #08-01, Singapore 068898 — +65 6789 0123' },
          { title: 'Sydney', description: '1 Martin Place, Level 12, Sydney NSW 2000, Australia — +61 2 9876 5432' },
        ]},
        { title: 'Check Our FAQ First', content: 'Many questions are answered instantly in our FAQ section. Find help with account opening, deposits, withdrawals, platform setup, and more.', type: 'cta', ctaText: 'Visit FAQ', ctaUrl: '#' },
      ],
      metaTitle: 'Contact Us — 24/5 Multilingual Customer Support',
      metaDescription: 'Get in touch with our 24/5 multilingual support team via live chat, email, phone, or WhatsApp. Offices in London, Dubai, Singapore & Sydney.',
    }
  }

  // FAQ page
  if (prompt.includes('(faq)')) {
    return {
      heroTitle: 'Frequently Asked Questions',
      heroSubtitle: 'Find answers to the most common questions about trading, accounts, deposits, withdrawals, and our platforms.',
      sections: [
        { title: 'Quick Answers', type: 'stats', stats: [
          { value: '$100', label: 'Min. Deposit' },
          { value: '<10 min', label: 'Account Opening' },
          { value: '24h', label: 'Withdrawal Processing' },
          { value: '24/5', label: 'Support Available' },
        ]},
        { title: 'Account & Registration', type: 'list', items: [
          { title: 'How do I open an account?', description: 'Click "Open Account", complete the registration form (2 minutes), verify your identity by uploading a government ID and proof of address, then fund your account. Most verifications are approved within 1 hour.' },
          { title: 'What documents do I need for verification?', description: 'A valid government-issued photo ID (passport, driving license, or national ID card) and a recent proof of address (utility bill, bank statement, or tax document dated within the last 3 months).' },
          { title: 'Can I have multiple trading accounts?', description: 'Yes, you can open multiple trading accounts under one client profile. Each account can have a different type (Standard/Premium/VIP), base currency, or leverage setting.' },
          { title: 'Is there a demo account available?', description: 'Yes, free demo accounts are available with $100,000 in virtual funds. Demo accounts replicate live market conditions and never expire. Open one from the registration page or client portal.' },
          { title: 'Do you offer Islamic (swap-free) accounts?', description: 'Yes, swap-free accounts are available for all account tiers upon request. Contact support after registration to convert your account to Islamic mode.' },
        ]},
        { title: 'Trading Questions', type: 'list', items: [
          { title: 'What is the minimum deposit?', description: 'Standard: $100, Premium: $1,000, VIP: $25,000. You can fund with bank transfer, credit/debit card, e-wallets (Skrill, Neteller), or crypto (USDT).' },
          { title: 'What leverage do you offer?', description: 'Forex: up to 1:500, Metals: up to 1:200, Indices: up to 1:200, Commodities: up to 1:100, Crypto: up to 1:20. Professional clients may qualify for higher leverage.' },
          { title: 'Do you allow hedging, scalping, and EAs?', description: 'Yes, we support all trading strategies including hedging, scalping, news trading, and automated trading with Expert Advisors (EAs). No restrictions on trade duration or frequency.' },
          { title: 'What platforms are available?', description: 'MetaTrader 4, MetaTrader 5, and WebTrader (browser-based). All platforms available on desktop, iOS, and Android. FIX API available for institutional clients.' },
          { title: 'What are your trading hours?', description: 'Forex: 24/5 (Sunday 22:00 to Friday 22:00 GMT). Crypto: 24/7. Indices and commodities vary by instrument — check the platform for specific hours.' },
        ]},
        { title: 'Deposits & Withdrawals', type: 'list', items: [
          { title: 'How do I deposit funds?', description: 'Log into your client portal, click "Deposit", select your preferred method (bank transfer, Visa/Mastercard, Skrill, Neteller, or crypto USDT/BTC), enter the amount, and confirm.' },
          { title: 'How long do withdrawals take?', description: 'All withdrawal requests are processed within 24 hours. E-wallets: instant. Credit/debit cards: 1-3 business days. Bank transfers: 3-5 business days. Crypto: 10-30 minutes after processing.' },
          { title: 'Are there deposit or withdrawal fees?', description: 'We do not charge any fees for deposits or withdrawals on standard methods. Third-party payment providers may apply their own fees for certain payment methods.' },
          { title: 'What currencies can I fund in?', description: 'USD, EUR, GBP, AUD, and AED are supported as base currencies. Deposits in other currencies are automatically converted at competitive exchange rates.' },
          { title: 'Is there a maximum withdrawal limit?', description: 'No maximum limit for bank transfers. Card withdrawals are limited to the total amount deposited via card. E-wallet withdrawals have no limits. VIP clients enjoy priority processing.' },
        ]},
        { title: 'Still Have Questions?', content: 'Our support team is available 24/5 via live chat, email, and phone to answer any questions not covered here.', type: 'cta', ctaText: 'Contact Support', ctaUrl: '#' },
      ],
      metaTitle: 'FAQ — Frequently Asked Questions About Trading',
      metaDescription: 'Answers to common questions about account opening, deposits, withdrawals, trading platforms, leverage, and more. 24/5 support available.',
    }
  }

  // Partners page
  if (prompt.includes('(partners)') || prompt.includes('affiliate')) {
    return {
      heroTitle: 'Partnership Programs',
      heroSubtitle: 'Earn competitive commissions as an Introducing Broker, Affiliate, or White Label partner. Join our global network of 5,000+ partners.',
      sections: [
        { title: 'Partner Network', type: 'stats', stats: [
          { value: '5,000+', label: 'Active Partners' },
          { value: '$15/lot', label: 'Max IB Commission' },
          { value: '$600', label: 'Max CPA Payout' },
          { value: '85%', label: 'RevShare Option' },
        ]},
        { title: 'Partnership Options', type: 'features', items: [
          { title: 'Introducing Broker (IB)', description: 'Earn up to $15 per lot from your referred clients. Multi-tier sub-IB commissions, real-time reporting, and a dedicated IB relationship manager.' },
          { title: 'Affiliate Program', description: 'Earn up to $600 CPA per qualified lead, or choose revenue share up to 85%. Premium marketing materials, pixel tracking, and monthly payouts.' },
          { title: 'White Label Solution', description: 'Launch your own branded trading platform on our infrastructure. Full customization, your own liquidity settings, back-office, and dedicated tech support.' },
          { title: 'Regional Representative', description: 'Become our local representative in your country. Exclusive territory, marketing budget, and enhanced commission tiers.' },
        ]},
        { title: 'Our Commissions vs Industry', type: 'comparison', comparisonData: {
          usLabel: 'Nova Markets', themLabel: 'Industry Average',
          rows: [
            { feature: 'IB Commission / Lot', us: 'Up to $15', them: '$5–10' },
            { feature: 'CPA per Lead', us: 'Up to $600', them: '$200–400' },
            { feature: 'Revenue Share', us: 'Up to 85%', them: '30–50%' },
            { feature: 'Sub-IB Tiers', us: '3 levels', them: '1–2 levels' },
            { feature: 'Payout Frequency', us: 'Monthly (15th)', them: 'Monthly or Net 30' },
            { feature: 'Min. Payout', us: '$50', them: '$100–500' },
          ],
        }},
        { title: 'How It Works', type: 'steps', steps: [
          { step: 1, title: 'Apply Online', description: 'Complete the partnership application form — takes under 5 minutes. Tell us about your audience and marketing channels.' },
          { step: 2, title: 'Get Approved', description: 'Our partnerships team reviews your application within 24 hours. Most applicants are approved the same business day.' },
          { step: 3, title: 'Start Promoting', description: 'Access your partner dashboard with tracking links, banners, landing pages, and real-time reporting tools.' },
          { step: 4, title: 'Earn Commissions', description: 'Earn commissions from day one. Payouts processed on the 15th of every month via bank, e-wallet, or crypto.' },
        ]},
        { title: 'Partner Benefits', type: 'list', items: [
          { title: 'Real-Time Partner Dashboard', description: 'Track clicks, registrations, deposits, trading volume, and commissions in real-time with detailed analytics and reporting.' },
          { title: 'Marketing Materials Library', description: 'Professional banners (20+ sizes), landing pages, email templates, and video content in 10+ languages — all ready to use.' },
          { title: 'Dedicated Partner Manager', description: 'Every partner gets a dedicated relationship manager for strategy, optimization, and priority support.' },
          { title: 'Fast & Flexible Payouts', description: 'Monthly payouts via bank transfer, Skrill, Neteller, or crypto (USDT). Minimum payout just $50.' },
          { title: 'Multi-Tier Sub-IB System', description: 'Earn commissions from your own sub-IBs up to 3 levels deep. Build your own referral network and multiply your earnings.' },
        ]},
        { title: 'What Our Partners Say', type: 'testimonials', testimonials: [
          { quote: 'The IB commissions are the best in the industry. With $15/lot and the multi-tier system, I earn a substantial passive income from my network of referred traders.', author: 'Carlos G.', role: 'Introducing Broker, Spain', rating: 5 },
          { quote: 'The marketing materials and dedicated manager make a real difference. My conversion rate doubled after switching from my previous broker partnership.', author: 'Ahmed H.', role: 'Affiliate Partner, UAE', rating: 5 },
        ]},
        { title: 'Join Our Partner Network Today', content: 'Apply now and start earning industry-leading commissions from your first referral. 5,000+ partners already trust us.', type: 'cta', ctaText: 'Apply Now', ctaUrl: '#' },
      ],
      metaTitle: 'Partnership Programs — IB, Affiliate & White Label',
      metaDescription: 'Earn up to $15/lot as IB or $600 CPA as affiliate. Real-time dashboard, marketing materials, and fast monthly payouts. Apply today.',
    }
  }

  // Promotions page
  if (prompt.includes('(promotions)')) {
    return {
      heroTitle: 'Current Promotions & Bonuses',
      heroSubtitle: 'Take advantage of our latest offers and bonuses designed to boost your trading capital and rewards.',
      sections: [
        { title: 'Limited Time Offers', type: 'banner', bannerType: 'success', bannerIcon: '🎉', content: 'New clients: Get a 100% deposit bonus on your first deposit up to $5,000! Double your trading capital from day one. Offer valid for a limited time — terms and conditions apply.' },
        { title: 'Active Promotions', type: 'features', items: [
          { title: '100% Welcome Bonus', description: 'Get a 100% deposit match on your first deposit up to $5,000. Deposit $1,000, trade with $2,000. Requires 10 lots per $100 bonus before withdrawal.' },
          { title: 'Refer a Friend — Earn $50', description: 'Earn $50 for every friend who opens and funds a live account with at least $100. No limit on referrals. Both you and your friend receive the bonus.' },
          { title: 'Cashback Rebate Program', description: 'Earn up to $5 cashback per lot traded on all instruments. Automatically credited to your account daily. No volume caps.' },
          { title: 'Free VPS Hosting', description: 'Qualified Premium and VIP accounts receive a free Virtual Private Server. Run Expert Advisors 24/7 with ultra-low latency.' },
          { title: 'Deposit Bonus — Every Deposit', description: 'Get a 30% bonus on every subsequent deposit up to $2,000 per deposit. Stackable with cashback. T&Cs apply.' },
          { title: 'Trading Competition', description: 'Monthly trading competition with $10,000 prize pool. Top 10 traders win cash prizes. Free entry for all live account holders.' },
        ]},
        { title: 'How to Claim Your Bonus', type: 'steps', steps: [
          { step: 1, title: 'Open an Account', description: 'Register for a free live trading account in under 2 minutes.' },
          { step: 2, title: 'Verify & Deposit', description: 'Complete KYC verification and make your first deposit of at least $100.' },
          { step: 3, title: 'Activate Promotion', description: 'Go to the Promotions tab in your client portal and activate your chosen bonus.' },
          { step: 4, title: 'Start Trading', description: 'Your bonus is credited instantly. Start trading with boosted capital right away.' },
        ]},
        { title: 'Promotion Features', type: 'icon-grid', iconItems: [
          { icon: '💰', title: 'Welcome Bonus', description: '100% up to $5,000' },
          { icon: '👥', title: 'Refer a Friend', description: '$50 per referral' },
          { icon: '💸', title: 'Cashback', description: 'Up to $5/lot daily' },
          { icon: '🖥️', title: 'Free VPS', description: 'For qualified accounts' },
          { icon: '📈', title: 'Deposit Bonus', description: '30% every deposit' },
          { icon: '🏆', title: 'Competitions', description: '$10K monthly prizes' },
        ]},
        { title: 'Terms & Conditions', content: 'All promotions are subject to specific terms and conditions. Welcome Bonus requires 10 standard lots per $100 bonus before withdrawal. Bonus funds are credited as trading credit and cannot be withdrawn directly. Promotions may be modified or discontinued at any time at our sole discretion. Trading volume requirements must be met within 90 days of activation. Full detailed terms for each promotion are available in the client portal. Promotions are not available in all jurisdictions.', type: 'text' },
        { title: 'Claim Your Bonus Now', content: 'Open a free account and activate your promotions from the client portal.', type: 'cta', ctaText: 'Get Started', ctaUrl: '#' },
      ],
      metaTitle: 'Trading Promotions — 100% Welcome Bonus, Cashback & More',
      metaDescription: 'Current promotions: 100% welcome bonus up to $5,000, $5/lot cashback, refer a friend, free VPS, and monthly competitions. T&Cs apply.',
    }
  }

  // Trading Calculator page
  if (prompt.includes('(tools)') || prompt.includes('calculator')) {
    return {
      heroTitle: 'Trading Calculators & Tools',
      heroSubtitle: 'Plan your trades with precision using our free forex and CFD calculators. Essential tools for risk management and trade planning.',
      sections: [
        { title: 'Calculator Tools', type: 'stats', stats: [
          { value: '4', label: 'Free Calculators' },
          { value: 'Real-Time', label: 'Pricing Data' },
          { value: '200+', label: 'Instruments Covered' },
          { value: '100%', label: 'Free to Use' },
        ]},
        { title: 'Available Calculators', type: 'features', items: [
          { title: 'Pip Value Calculator', description: 'Calculate the exact monetary value of a pip for any currency pair, position size, and account currency. Essential for precise risk management.' },
          { title: 'Margin Calculator', description: 'Determine the required margin to open a position based on instrument, lot size, leverage, and account currency. Know your margin before you trade.' },
          { title: 'Profit/Loss Calculator', description: 'Estimate your potential profit or loss before entering a trade. Input entry price, exit price, lot size, and direction (long/short).' },
          { title: 'Swap Calculator', description: 'Check overnight swap fees for holding positions past the daily rollover. Rates vary by instrument, direction, and day of week.' },
        ]},
        { title: 'How to Use the Calculators', type: 'steps', steps: [
          { step: 1, title: 'Select Your Calculator', description: 'Choose pip, margin, profit/loss, or swap calculator based on what you need to calculate.' },
          { step: 2, title: 'Input Trade Parameters', description: 'Enter instrument, lot size, entry/exit price, leverage, and account currency.' },
          { step: 3, title: 'Get Instant Results', description: 'Results are calculated in real-time using live market pricing. Adjust parameters to compare scenarios.' },
        ]},
        { title: 'Risk Management Best Practices', type: 'two-column', leftContent: 'Successful trading starts with proper risk management. Our calculators help you determine the right position size, understand margin requirements, and estimate potential outcomes before you commit capital. Professional traders recommend risking no more than 1-2% of your account balance per trade.',
          rightItems: [
            { title: '1-2% Risk Rule', description: 'Never risk more than 1-2% of your total balance on a single trade' },
            { title: 'Position Sizing', description: 'Use the pip calculator to determine the correct lot size for your risk' },
            { title: 'Margin Awareness', description: 'Always check margin requirements before opening large positions' },
            { title: 'Plan Every Trade', description: 'Know your entry, stop-loss, take-profit, and position size before executing' },
          ],
        },
        { title: 'Pro Tip', type: 'banner', bannerType: 'info', bannerIcon: '💡', content: 'Use the pip calculator to determine your position size based on your stop-loss distance and risk percentage. Example: If your account is $10,000, you want to risk 1% ($100), and your stop-loss is 50 pips, you need $2 per pip — which is 0.2 standard lots on EUR/USD.' },
        { title: 'Start Planning Your Trades', content: 'Open a free account and access all calculators with real-time pricing on 200+ instruments.', type: 'cta', ctaText: 'Open Free Account', ctaUrl: '#' },
      ],
      metaTitle: 'Trading Calculators — Pip, Margin, Profit & Swap Tools',
      metaDescription: 'Free trading calculators: pip value, margin requirement, profit/loss estimator, and swap rates. Plan trades with real-time pricing on 200+ instruments.',
    }
  }

  // Regulation page
  if (prompt.includes('regulation') && prompt.includes('(legal)')) {
    return {
      heroTitle: 'Regulation & Licenses',
      heroSubtitle: 'We are regulated by leading financial authorities across 3 jurisdictions to ensure the safety of your funds and the integrity of our services.',
      sections: [
        { title: 'Regulatory Overview', type: 'stats', stats: [
          { value: '3', label: 'Regulatory Licenses' },
          { value: '€20K', label: 'ICF Coverage' },
          { value: '100%', label: 'Segregated Funds' },
          { value: 'Big Four', label: 'Annual Auditor' },
        ]},
        { title: 'Our Regulatory Licenses', type: 'icon-grid', iconItems: [
          { icon: '🇬🇧', title: 'FCA (UK)', description: 'Financial Conduct Authority — Reg. No. 123456' },
          { icon: '🇨🇾', title: 'CySEC (EU)', description: 'Cyprus Securities & Exchange Commission — License 789/01' },
          { icon: '🇦🇪', title: 'DFSA (Dubai)', description: 'Dubai Financial Services Authority — License F-004321' },
        ]},
        { title: 'What Our Regulation Means for You', type: 'features', items: [
          { title: 'Segregated Client Funds', description: 'All client money held in segregated accounts at Barclays (UK) and Deutsche Bank (EU), completely separate from company operational funds.' },
          { title: 'Investor Compensation Fund', description: 'Eligible clients covered by the ICF up to €20,000 per person in the unlikely event of company insolvency.' },
          { title: 'Negative Balance Protection', description: 'Guaranteed for all retail clients across all account types. You can never owe more than your deposited balance.' },
          { title: 'Annual External Audits', description: 'Financial statements audited annually by Deloitte. Regulatory reporting submitted quarterly to all three regulators.' },
          { title: 'Best Execution Policy', description: 'We are legally required to execute your orders at the best available price. Execution quality reports published quarterly.' },
          { title: 'Conflict of Interest Policy', description: 'Strict policies in place to identify, manage, and disclose any potential conflicts of interest between us and our clients.' },
        ]},
        { title: 'Client Protection Measures', type: 'list', items: [
          { title: 'Segregation of Funds', description: 'Client funds are held in segregated accounts at regulated, tier-1 European banks. These funds cannot be used for company operations and are protected in the event of insolvency.' },
          { title: 'KYC & AML Compliance', description: 'We implement strict Know Your Customer (KYC) and Anti-Money Laundering (AML) procedures. All clients must verify identity before deposits or trading.' },
          { title: 'Data Protection (GDPR)', description: 'Full compliance with GDPR and applicable data protection regulations. Client data encrypted in transit and at rest. Privacy policy published and regularly updated.' },
          { title: 'Risk Disclosures', description: 'Clear and prominent risk warnings provided during registration and on all marketing materials. Appropriateness and suitability assessments conducted for all retail clients.' },
          { title: 'Complaints Procedure', description: 'Formal complaints procedure in place with escalation to the Financial Ombudsman Service (UK) or CySEC for unresolved disputes.' },
        ]},
        { title: 'Regulatory Framework', type: 'two-column', leftContent: 'Our multi-jurisdictional regulatory structure ensures that clients in every region receive the highest level of protection under their local financial laws. Each entity operates independently with its own compliance team, capital requirements, and regulatory reporting obligations.',
          rightItems: [
            { title: 'UK Clients', description: 'Served by our FCA-regulated entity. FSCS protection up to £85,000 for eligible claims.' },
            { title: 'EU/EEA Clients', description: 'Served by our CySEC-regulated entity. ICF protection up to €20,000.' },
            { title: 'MENA Clients', description: 'Served by our DFSA-regulated entity in the DIFC, Dubai.' },
            { title: 'International Clients', description: 'Served by the entity best suited to their jurisdiction with appropriate regulatory oversight.' },
          ],
        },
        { title: 'Regulatory Commitment', type: 'banner', bannerType: 'info', bannerIcon: '🛡️', content: 'Regulation is not just a legal requirement for us — it is a core value. We voluntarily exceed minimum regulatory requirements in areas including capital adequacy, client fund segregation, and execution quality reporting. Our commitment to transparency and client protection is what sets us apart.' },
        { title: 'Compliance Contacts', content: 'For regulatory inquiries, compliance questions, or to submit a formal complaint, contact our compliance team at compliance@novamarkets.com. We aim to acknowledge all complaints within 24 hours and provide a final resolution within 8 weeks, in accordance with FCA guidelines.', type: 'text' },
      ],
      metaTitle: 'Regulation & Licenses — FCA, CySEC & DFSA Regulated Broker',
      metaDescription: 'Regulated by FCA (UK), CySEC (EU), and DFSA (Dubai). Segregated funds at tier-1 banks, ICF coverage up to €20K, and negative balance protection.',
    }
  }

  // Terms & Conditions page
  if (prompt.includes('terms') && prompt.includes('(legal)')) {
    return {
      heroTitle: 'Terms & Conditions',
      heroSubtitle: 'Please read these terms carefully before using our trading services and platform. Last updated: January 2026.',
      sections: [
        { title: 'General Terms', content: 'These Terms and Conditions ("Terms") govern your use of our trading platform, website, and financial services. By opening an account, accessing our platform, or using our services in any way, you agree to be bound by these Terms. We reserve the right to update these Terms at any time, with at least 30 days notice provided via email and platform notification. Continued use of our services after notification constitutes acceptance of the updated Terms. If you do not agree to any changes, you may close your account without penalty.', type: 'text' },
        { title: 'Account Terms', type: 'list', items: [
          { title: 'Eligibility', description: 'You must be at least 18 years old (or the age of majority in your jurisdiction) and a legal resident of a supported country to open an account. Residents of the United States, Iran, North Korea, and other sanctioned jurisdictions are not eligible.' },
          { title: 'Account Verification (KYC)', description: 'All accounts must complete Know Your Customer verification with a valid government-issued photo ID and recent proof of address (within 3 months). Withdrawals are not processed until verification is complete.' },
          { title: 'Account Limits', description: 'Each individual may maintain one client profile with up to 5 sub-accounts unless otherwise authorized in writing. Duplicate profiles detected through our systems may be merged or closed at our discretion.' },
          { title: 'Account Dormancy', description: 'Accounts with no trading activity for 12 consecutive months are considered dormant. A monthly inactivity fee of $10 may apply to dormant accounts with remaining balances. Dormant accounts may be closed after 24 months of inactivity.' },
          { title: 'Account Closure', description: 'You may request account closure at any time by contacting support. All open positions must be closed and pending withdrawals processed before closure. We reserve the right to close accounts that violate these Terms.' },
        ]},
        { title: 'Trading Rules', type: 'list', items: [
          { title: 'Order Execution', description: 'Orders are executed at the best available price under our Best Execution Policy. Market orders may experience slippage during volatile conditions or low-liquidity periods. We do not guarantee execution at the displayed price.' },
          { title: 'Leverage & Margin', description: 'Leveraged trading carries significant risk of loss. Positions may be automatically closed (margin call) if account equity falls below the required margin maintenance level (50% for retail clients). It is your responsibility to monitor margin levels.' },
          { title: 'Prohibited Activities', description: 'Market manipulation, latency arbitrage, abuse of pricing errors, use of insider information, and coordinated trading schemes are strictly prohibited. Violations may result in profit reversal, account termination, and reporting to regulatory authorities.' },
          { title: 'Corporate Actions & Market Events', description: 'We reserve the right to adjust positions, leverage, or margin requirements in response to extraordinary market events, corporate actions (dividends, splits), or regulatory changes. Clients will be notified in advance when practicable.' },
        ]},
        { title: 'Financial Terms', type: 'list', items: [
          { title: 'Deposits & Withdrawals', description: 'Deposits are credited upon receipt of cleared funds. Withdrawals are processed within 24 business hours. We may request additional verification for large withdrawals exceeding $50,000. Withdrawals must be made to the original funding source where possible.' },
          { title: 'Fees & Charges', description: 'Applicable fees include spreads, commissions (per account type), overnight swap charges, and currency conversion fees. A complete and current fee schedule is maintained on our Pricing page and within the trading platform.' },
          { title: 'Bonuses & Promotions', description: 'Promotional credits are subject to individual promotion terms, including trading volume requirements. Bonus funds cannot be withdrawn directly and may be removed if terms are not met within the specified timeframe.' },
        ]},
        { title: 'Liability, Disputes & Governing Law', content: 'Our maximum liability to you is limited to the funds held in your trading account at the time of any claim. We are not liable for losses arising from market movements, technology failures beyond our reasonable control, or third-party service interruptions. Disputes should first be directed to our complaints team at complaints@novamarkets.com. Unresolved disputes may be escalated to the Financial Ombudsman Service (UK clients) or CySEC (EU clients). These Terms are governed by the laws of England and Wales, and you submit to the exclusive jurisdiction of the courts of England and Wales for dispute resolution.', type: 'text' },
      ],
      metaTitle: 'Terms & Conditions — Trading Services Agreement',
      metaDescription: 'Read our terms and conditions covering account usage, trading rules, fees, liability, and dispute resolution for our regulated trading services.',
    }
  }

  // Privacy Policy page
  if (prompt.includes('privacy') && prompt.includes('(legal)')) {
    return {
      heroTitle: 'Privacy Policy',
      heroSubtitle: 'We are committed to protecting your personal data and privacy in full compliance with GDPR, CCPA, and applicable data protection regulations. Last updated: January 2026.',
      sections: [
        { title: 'Our Commitment', content: 'This Privacy Policy describes how we collect, use, store, and protect your personal data when you use our website, trading platforms, and services. We are committed to processing your data lawfully, fairly, and transparently. We never sell your personal data to third parties. This policy applies to all users of our services, including visitors, prospective clients, active traders, and partners.', type: 'text' },
        { title: 'Data We Collect', type: 'list', items: [
          { title: 'Personal Information', description: 'Full name, email address, phone number, date of birth, nationality, tax residency, and residential address — provided during account registration.' },
          { title: 'Identification Documents', description: 'Government-issued photo ID (passport, driving license) and proof of address (utility bill, bank statement) — required for KYC/AML compliance. Documents stored encrypted.' },
          { title: 'Financial Information', description: 'Employment status, annual income range, trading experience level, and source of funds — required for regulatory suitability assessments.' },
          { title: 'Trading Activity', description: 'Order history, trade records, account balances, deposit/withdrawal history, platform usage patterns, and login timestamps.' },
          { title: 'Technical Data', description: 'IP address, browser type and version, operating system, device identifiers, referral URLs, and session cookies for security, fraud prevention, and analytics.' },
          { title: 'Communication Data', description: 'Support chat transcripts, email correspondence, phone call recordings (where disclosed), and feedback/survey responses.' },
        ]},
        { title: 'How We Use Your Data', content: 'We process your personal data for the following lawful purposes: (1) To provide and administer our trading services, including account management, order execution, and customer support. (2) To comply with legal and regulatory obligations including KYC, AML, tax reporting, and regulatory filings to the FCA, CySEC, and DFSA. (3) To protect the security of our platform through fraud detection, risk management, and abuse prevention. (4) To improve our services through analytics, product development, and user experience optimization. (5) To communicate with you about account activity, service changes, and — with your consent — marketing and promotional offers.', type: 'text' },
        { title: 'Your Data Protection Rights', type: 'features', items: [
          { title: 'Right of Access', description: 'Request a copy of all personal data we hold about you. We respond within 30 days as required by GDPR.' },
          { title: 'Right to Rectification', description: 'Correct any inaccurate or incomplete personal data. Submit corrections through your client portal or via email.' },
          { title: 'Right to Erasure', description: 'Request deletion of your data, subject to regulatory retention requirements (minimum 5 years for financial records).' },
          { title: 'Right to Portability', description: 'Receive your data in a structured, machine-readable format (JSON/CSV) for transfer to another service provider.' },
          { title: 'Right to Object', description: 'Object to processing of your data for marketing purposes at any time. Opt out via email preferences or by contacting support.' },
          { title: 'Right to Restrict', description: 'Request restriction of processing while we verify accuracy of data or assess your objection to processing.' },
        ]},
        { title: 'Data Security & Retention', content: 'We implement industry-standard security measures including AES-256 encryption for data at rest, TLS 1.3 for data in transit, multi-factor authentication, intrusion detection systems, and regular penetration testing. Access to personal data is restricted to authorized personnel on a need-to-know basis. Personal data is retained for the minimum period required by applicable regulations: financial records for 5 years after account closure (FCA/CySEC requirement), KYC documents for 5 years, and marketing consent records for 2 years after withdrawal of consent.', type: 'text' },
        { title: 'Cookies & Tracking', type: 'banner', bannerType: 'info', bannerIcon: '🍪', content: 'We use essential cookies for platform functionality and security (always active), analytics cookies (Google Analytics, Hotjar) to understand usage patterns and improve our service, and marketing cookies (with your explicit consent) for retargeting and advertising. You can manage cookie preferences at any time through our cookie banner or browser settings. Refusing non-essential cookies does not affect your ability to use our trading platform.' },
      ],
      metaTitle: 'Privacy Policy — Data Protection, GDPR & Your Rights',
      metaDescription: 'Our privacy policy explains how we collect, use, and protect your personal data. GDPR and CCPA compliant with full data subject rights.',
    }
  }

  // Risk Disclosure page
  if (prompt.includes('risk') && prompt.includes('(legal)')) {
    return {
      heroTitle: 'Risk Disclosure Statement',
      heroSubtitle: 'Trading CFDs and forex involves significant risk of loss. Please read this document carefully and ensure you fully understand the risks before trading.',
      sections: [
        { title: 'Important Risk Warning', type: 'banner', bannerType: 'warning', bannerIcon: '⚠️', content: 'CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Approximately 72.6% of retail investor accounts lose money when trading CFDs with this provider. You should consider whether you understand how CFDs work, and whether you can afford to take the high risk of losing your money. This is not investment advice.' },
        { title: 'General Risk Warning', content: 'Contracts for Difference (CFDs), forex, and other leveraged financial products are complex instruments that carry a high level of risk to your invested capital. Trading these products may not be suitable for all investors. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. You could sustain a loss of some or all of your invested capital. You should not invest money that you cannot afford to lose. You should be aware of all the risks associated with trading on margin, and seek advice from an independent financial advisor if you have any doubts.', type: 'text' },
        { title: 'Specific Risk Factors', type: 'list', items: [
          { title: 'Leverage Risk', description: 'Leverage amplifies both potential profits and losses. With 1:500 leverage, a 0.2% adverse market movement can result in a 100% loss of your deposited margin. Leverage should be used with extreme caution, especially by less experienced traders.' },
          { title: 'Market Volatility Risk', description: 'Financial markets can experience rapid price movements due to economic data releases, geopolitical events, central bank decisions, and unexpected news. Price gaps may occur, particularly at market open and during high-impact events, potentially resulting in slippage beyond your stop-loss level.' },
          { title: 'Liquidity Risk', description: 'Under certain market conditions (e.g., flash crashes, market holidays, exotic instruments), liquidity may be reduced or unavailable. This may result in wider spreads, delayed execution, or inability to close positions at your desired price.' },
          { title: 'Counterparty Risk', description: 'When trading CFDs, your counterparty is the CFD provider. If the provider becomes insolvent, you may not recover your funds in full, though regulatory protections (ICF, FSCS) may provide partial coverage for eligible clients.' },
          { title: 'Technology & Connectivity Risk', description: 'Internet disruptions, platform outages, hardware failures, and cyber attacks may prevent order execution, modification, or cancellation. Use of mobile networks and shared connections increases this risk.' },
          { title: 'Regulatory & Legal Risk', description: 'Changes in laws, regulations, or tax treatment may adversely affect trading conditions, available leverage, or access to certain instruments or markets. Such changes may be applied retroactively.' },
          { title: 'Currency Risk', description: 'If you trade instruments denominated in a currency other than your account base currency, exchange rate fluctuations may affect your profit/loss independently of the underlying instrument movement.' },
          { title: 'Weekend & Gap Risk', description: 'Positions held over weekends or holidays are exposed to gap risk. Markets may open at significantly different levels than the previous close, potentially bypassing stop-loss orders.' },
        ]},
        { title: 'Risk Mitigation Recommendations', content: 'We strongly recommend the following risk management practices: (1) Never trade with money you cannot afford to lose. (2) Always use stop-loss orders on every trade. (3) Limit your risk per trade to 1-2% of your account balance. (4) Diversify across multiple instruments rather than concentrating risk. (5) Educate yourself thoroughly using our free education center before trading with real money. (6) Start with a demo account to practice strategies risk-free. (7) Avoid over-leveraging — use lower leverage than the maximum available. (8) Keep a trading journal to track and improve your decision-making.', type: 'text' },
        { title: 'Acknowledgment', content: 'By opening an account and using our services, you acknowledge that you have read, understood, and accepted this Risk Disclosure Statement. You confirm that you are aware of the risks involved in trading CFDs and forex, and that you are prepared to accept these risks. This risk disclosure does not disclose all risks associated with CFDs and forex trading, and you should seek independent professional advice if you are in any doubt. Past performance is not indicative of future results. No representation or guarantee is made regarding the future performance of any account or trading strategy.', type: 'text' },
      ],
      metaTitle: 'Risk Disclosure — CFD & Forex Trading Risks Explained',
      metaDescription: 'Important risk disclosure for CFD and forex trading. Understand leverage risks, market volatility, liquidity risks, and potential losses before trading.',
    }
  }

  // Catch-all legal page
  if (prompt.includes('(legal)')) {
    return {
      heroTitle: 'Legal Information',
      heroSubtitle: 'Important legal documents and regulatory information.',
      sections: [
        { title: 'Regulatory Compliance', content: 'We operate in compliance with all applicable laws and regulations. Our services are provided under the licenses and authorizations granted by our regulatory authorities.', type: 'text' },
      ],
      metaTitle: 'Legal Information',
      metaDescription: 'Legal documents and regulatory information for our trading services.',
    }
  }

  // Default homepage content
  return {
    heroTitle: 'Trade Global Markets with Confidence',
    heroSubtitle: 'Access 200+ instruments across Forex, Crypto, Commodities & Indices — with spreads from 0.0 pips and ultra-fast execution under 30ms.',
    sections: [
      { title: 'Trusted by Traders Worldwide', type: 'stats', stats: [
        { value: '35M+', label: 'Active Traders' },
        { value: '200+', label: 'Instruments' },
        { value: '0.0', label: 'Pips Spread From' },
        { value: '<30ms', label: 'Execution Speed' },
      ]},
      { title: 'Why Choose Us', type: 'features', items: [
        { title: 'Tight Spreads', description: 'Institutional-grade spreads from 0.0 pips on majors with no hidden markups or re-quotes.' },
        { title: 'Ultra-Fast Execution', description: 'Average execution under 30ms powered by Equinix LD4 & NY5 data centers.' },
        { title: '200+ Instruments', description: 'Forex, crypto, commodities, indices, and shares — all from one account.' },
        { title: 'Regulated & Secure', description: 'Licensed by FCA, CySEC & DFSA. Client funds held in segregated tier-1 bank accounts.' },
      ]},
      { title: 'Account Types', type: 'pricing', tiers: [
        { name: 'Standard', price: '$100', period: 'Min. Deposit', features: ['Spreads from 1.2 pips', 'No commission', 'Leverage 1:500', '200+ instruments'], ctaText: 'Open Account' },
        { name: 'Premium', price: '$1,000', period: 'Min. Deposit', features: ['Spreads from 0.6 pips', '$3.50/lot', 'Free VPS', 'Priority support'], highlighted: true, ctaText: 'Open Account' },
        { name: 'VIP', price: '$25,000', period: 'Min. Deposit', features: ['Spreads from 0.0 pips', '$2.50/lot', 'Personal Manager', 'Custom liquidity'], ctaText: 'Contact Us' },
      ]},
      { title: 'Ready to Start Trading?', content: 'Open a free account in minutes and access 200+ instruments with award-winning conditions.', type: 'cta', ctaText: 'Open Live Account', ctaUrl: '#' },
    ],
    metaTitle: 'Trade with the Best — Regulated Forex & CFD Broker',
    metaDescription: 'Trade Forex, Crypto & CFDs with spreads from 0.0 pips and execution under 30ms. FCA, CySEC & DFSA regulated. Open a free account today.',
  }
}
