import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function generateWithAI(prompt: string, systemPrompt?: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return generateMockResponse(prompt)
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt || 'You are an expert in trading company marketing and web development.',
    messages: [{ role: 'user', content: prompt }],
  })

  const block = response.content[0]
  return block.type === 'text' ? block.text : ''
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

  // Website page content
  if (p.includes('page') && (p.includes('generate') || p.includes('content') || p.includes('home') || p.includes('about'))) {
    return JSON.stringify({
      heroTitle: 'Trade Smarter with Advanced Technology',
      heroSubtitle: 'Access global markets with institutional-grade tools, tight spreads, and lightning-fast execution.',
      sections: [
        { title: 'Why Choose Us', content: 'Industry-leading spreads starting from 0.0 pips, 24/7 customer support, and advanced charting tools. Regulated and trusted by thousands of traders worldwide.', type: 'features' },
        { title: 'Trading Platforms', content: 'Trade on MetaTrader 4, MetaTrader 5, or our proprietary web platform. Available on desktop, mobile, and tablet.', type: 'platforms' },
        { title: 'Account Types', content: 'Choose from Standard, Premium, or VIP accounts. Each designed to match your trading style and experience level.', type: 'pricing' },
        { title: 'Market Analysis', content: 'Daily market insights from our team of expert analysts. Technical analysis, fundamental reports, and trading signals.', type: 'content' },
      ],
      cta: { text: 'Open Free Account', url: '/register' },
    })
  }

  // Keyword research (fallback — simple keyword check)
  if (p.includes('keyword')) {
    return JSON.stringify([
      { keyword: 'best forex broker', volume: 12000, difficulty: 78, intent: 'transactional', mappedPage: 'home' },
      { keyword: 'forex trading platform', volume: 8500, difficulty: 72, intent: 'navigational', mappedPage: 'platforms' },
      { keyword: 'how to trade forex', volume: 22000, difficulty: 45, intent: 'informational', mappedPage: 'education' },
    ])
  }

  // Social profile bios
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
