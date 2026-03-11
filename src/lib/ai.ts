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

  // Crypto Exchange template-specific page content
  if (p.includes('crypto exchange') && (p.includes('page') || p.includes('content'))) {
    return JSON.stringify({
      heroTitle: 'Trade 200+ Cryptocurrencies with Confidence',
      heroSubtitle: 'Institutional-grade security, low fees, and lightning-fast execution. Buy, sell, and trade crypto with the platform trusted by millions.',
      sections: [
        { title: 'Why Trade With Us', content: 'Industry-lowest fees starting at 0.1%, cold storage for 95% of assets, and 24/7 customer support. Over $2B in daily trading volume across spot and futures markets.', type: 'features' },
        { title: 'Spot & Futures Trading', content: 'Trade spot markets with instant settlement or leverage up to 125x on perpetual futures. Advanced order types, real-time charts, and deep liquidity across all pairs.', type: 'list' },
        { title: 'Staking & Earn', content: 'Put your crypto to work. Earn up to 14% APY through flexible and locked staking programs. DeFi yield products and savings accounts available.', type: 'pricing' },
        { title: 'Enterprise-Grade Security', content: 'Multi-signature cold wallets, 2FA authentication, withdrawal whitelist, and $100M insurance fund. Your assets are protected by industry-leading security protocols.', type: 'text' },
      ],
      metaTitle: 'Buy & Trade Crypto — Secure Exchange',
      metaDescription: 'Trade 200+ cryptocurrencies with low fees and institutional-grade security. Spot trading, futures, staking, and DeFi products. Start trading today.',
    })
  }

  // Prop Trading template-specific page content
  if (p.includes('prop trad') && (p.includes('page') || p.includes('content'))) {
    return JSON.stringify({
      heroTitle: 'Get Funded Up to $200,000',
      heroSubtitle: 'Prove your trading skills and access institutional capital. Keep up to 90% of profits with our industry-leading funded trading program.',
      sections: [
        { title: 'How It Works', content: 'Pass our evaluation challenge by hitting the profit target while staying within risk limits. Once funded, trade with our capital and keep up to 90% of the profits. No time limits on funded accounts.', type: 'features' },
        { title: 'Challenge Programs', content: 'Choose your path: 1-Step Instant Funding or 2-Step Standard Evaluation. Account sizes from $10K to $200K. Competitive pricing with refundable fees.', type: 'pricing' },
        { title: 'Payout Proofs', content: 'Over $10M paid out to funded traders worldwide. Bi-weekly payouts via bank transfer, crypto, or e-wallet. Average payout processing time: 24 hours.', type: 'text' },
        { title: 'Join Our Community', content: '50,000+ traders in our Discord community. Free education, daily market analysis, and funded trader interviews. Your success is our mission.', type: 'cta' },
      ],
      metaTitle: 'Prop Trading — Get Funded Today',
      metaDescription: 'Get funded up to $200K with our prop trading evaluation. 80-90% profit split, no time limits, bi-weekly payouts. Start your challenge today.',
    })
  }

  // Website page content (default / forex broker)
  if (p.includes('page') && (p.includes('generate') || p.includes('content') || p.includes('home') || p.includes('about'))) {
    return JSON.stringify({
      heroTitle: 'Trade Smarter with Advanced Technology',
      heroSubtitle: 'Access global markets with institutional-grade tools, tight spreads, and lightning-fast execution.',
      sections: [
        { title: 'Why Choose Us', content: 'Industry-leading spreads starting from 0.0 pips, 24/7 customer support, and advanced charting tools. Regulated and trusted by thousands of traders worldwide.', type: 'features' },
        { title: 'Trading Platforms', content: 'Trade on MetaTrader 4, MetaTrader 5, or our proprietary web platform. Available on desktop, mobile, and tablet.', type: 'list' },
        { title: 'Account Types', content: 'Choose from Standard, Premium, or VIP accounts. Each designed to match your trading style and experience level.', type: 'pricing' },
        { title: 'Market Analysis', content: 'Daily market insights from our team of expert analysts. Technical analysis, fundamental reports, and trading signals.', type: 'text' },
      ],
      metaTitle: 'Trade with the Best — Regulated Forex Broker',
      metaDescription: 'Trade Forex, Crypto & CFDs with tight spreads and fast execution. Regulated broker with 24/7 support. Open a free account today.',
    })
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
      heroTitle: 'Understanding Market Volatility: A Trader\'s Guide',
      heroSubtitle: 'Learn how to navigate volatile markets and turn uncertainty into opportunity with proven risk management strategies.',
      sections: [
        { title: 'What Causes Market Volatility?', content: 'Market volatility is driven by economic data releases, geopolitical events, central bank decisions, and shifts in investor sentiment. Understanding these drivers helps traders anticipate and prepare for large price movements.', type: 'text' },
        { title: 'Managing Risk During Volatile Periods', content: 'Key strategies include reducing position sizes, widening stop-losses to account for larger swings, avoiding over-leveraging, and focusing on major currency pairs with higher liquidity.', type: 'text' },
        { title: 'Opportunities in Volatile Markets', content: 'Volatility creates opportunities for breakout trades, momentum strategies, and options traders who can benefit from increased premium values. The key is having a clear plan before entering any trade.', type: 'text' },
      ],
      metaTitle: 'Market Volatility Guide — Trading Strategies & Tips',
      metaDescription: 'Learn how to navigate volatile markets with proven strategies. Understand causes of volatility and turn uncertainty into trading opportunities.',
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
