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

// ─── Unique page content per page type ──────────────────────────────

function getPageContentByType(prompt: string) {
  // Homepage — check first since it's the default
  if (prompt.includes('(homepage)')) {
    return {
      heroTitle: 'Trade Smarter with Advanced Technology',
      heroSubtitle: 'Access global markets with institutional-grade tools, tight spreads, and lightning-fast execution.',
      sections: [
        { title: 'Why Choose Us', type: 'features', items: [
          { title: 'Tight Spreads', description: 'Spreads from 0.0 pips on major forex pairs with no hidden markups.' },
          { title: 'Fast Execution', description: 'Average execution speed under 30ms from Equinix data centers.' },
          { title: '200+ Instruments', description: 'Forex, crypto, commodities, indices, and stocks in one account.' },
          { title: '24/5 Support', description: 'Multilingual support team available around the clock.' },
        ]},
        { title: 'Trading Platforms', type: 'features', items: [
          { title: 'MetaTrader 4', description: 'The world\'s most popular forex trading platform with Expert Advisors.' },
          { title: 'MetaTrader 5', description: 'Multi-asset platform with advanced charting and analysis.' },
          { title: 'WebTrader', description: 'Trade from any browser — no download required.' },
        ]},
        { title: 'Account Types', type: 'pricing', tiers: [
          { name: 'Standard', price: '$100', period: 'Min. Deposit', features: ['Spreads from 1.2 pips', 'No commission', 'Leverage 1:500'], ctaText: 'Open Account' },
          { name: 'Premium', price: '$1,000', period: 'Min. Deposit', features: ['Spreads from 0.6 pips', '$3.50/lot', 'Free VPS'], highlighted: true, ctaText: 'Open Account' },
          { name: 'VIP', price: '$25,000', period: 'Min. Deposit', features: ['Spreads from 0.0 pips', '$2.50/lot', 'Personal Manager'], ctaText: 'Contact Us' },
        ]},
        { title: 'Market Analysis', content: 'Daily market insights from our team of expert analysts. Technical analysis, fundamental reports, and trading signals.', type: 'text' },
      ],
      metaTitle: 'Trade with the Best — Regulated Forex Broker',
      metaDescription: 'Trade Forex, Crypto & CFDs with tight spreads and fast execution. Regulated broker with 24/7 support. Open a free account today.',
    }
  }

  // About page
  if (prompt.includes('(about)') || prompt.includes('about us')) {
    return {
      heroTitle: 'About Our Company',
      heroSubtitle: 'A trusted name in online trading since 2018. Regulated, transparent, and committed to your success.',
      sections: [
        { title: 'Our Story', content: 'Founded by a team of experienced traders and fintech professionals, we set out to create a trading platform that puts clients first. With over 500,000 active traders in 150+ countries, we have grown into one of the most trusted names in online trading.', type: 'text' },
        { title: 'Our Mission & Values', type: 'features', items: [
          { title: 'Transparency', description: 'No hidden fees, no re-quotes. What you see is what you get.' },
          { title: 'Innovation', description: 'Cutting-edge technology powering lightning-fast execution under 30ms.' },
          { title: 'Security', description: 'Client funds held in segregated accounts at top-tier banks.' },
          { title: 'Education', description: 'Free courses, webinars, and daily market analysis for all clients.' },
        ]},
        { title: 'Global Presence', content: 'Offices in London, Dubai, Sydney, and Singapore. Licensed and regulated by multiple financial authorities worldwide. Our multilingual support team is available 24/5 to assist you.', type: 'text' },
        { title: 'Awards & Recognition', type: 'list', items: [
          { title: 'Best Forex Broker 2025', description: 'Awarded by International Finance Awards' },
          { title: 'Most Transparent Broker', description: 'Global Forex Awards 2025' },
          { title: 'Best Trading Platform', description: 'FinanceMagnates Summit 2024' },
        ]},
      ],
      metaTitle: 'About Us — Trusted Regulated Online Broker',
      metaDescription: 'Learn about our company, mission, and values. Regulated broker serving 500K+ traders in 150+ countries since 2018.',
    }
  }

  // Trading Platforms page
  if (prompt.includes('(platforms)') || prompt.includes('trading platform')) {
    return {
      heroTitle: 'World-Class Trading Platforms',
      heroSubtitle: 'Trade on your terms with MetaTrader 4, MetaTrader 5, and our proprietary WebTrader — available on every device.',
      sections: [
        { title: 'Our Platforms', type: 'features', items: [
          { title: 'MetaTrader 4', description: 'The industry standard for forex trading. Expert Advisors, custom indicators, and one-click trading. Available on desktop, iOS, and Android.' },
          { title: 'MetaTrader 5', description: 'Multi-asset trading with advanced charting, depth of market, and hedging support. Trade forex, stocks, and futures from one account.' },
          { title: 'WebTrader', description: 'No download needed. Trade directly from your browser with real-time charts, technical analysis tools, and a clean interface.' },
          { title: 'Mobile Trading', description: 'Full-featured mobile apps for iOS and Android. Manage positions, set alerts, and trade on the go.' },
        ]},
        { title: 'Platform Comparison', type: 'table', columns: ['Feature', 'MT4', 'MT5', 'WebTrader'], rows: [
          { 'Feature': 'One-Click Trading', 'MT4': '✓', 'MT5': '✓', 'WebTrader': '✓' },
          { 'Feature': 'Expert Advisors', 'MT4': '✓', 'MT5': '✓', 'WebTrader': '—' },
          { 'Feature': 'Custom Indicators', 'MT4': '30+', 'MT5': '38+', 'WebTrader': '25+' },
          { 'Feature': 'Timeframes', 'MT4': '9', 'MT5': '21', 'WebTrader': '15' },
          { 'Feature': 'Pending Order Types', 'MT4': '4', 'MT5': '6', 'WebTrader': '4' },
        ]},
        { title: 'Execution Technology', content: 'Ultra-low latency execution powered by Equinix data centers in London and New York. Average execution speed under 30 milliseconds with 99.9% uptime.', type: 'text' },
        { title: 'Start Trading Now', content: 'Download your preferred platform and start trading in minutes. Free demo accounts available with $100,000 virtual funds.', type: 'cta', ctaText: 'Download Platform', ctaUrl: '#' },
      ],
      metaTitle: 'Trading Platforms — MT4, MT5 & WebTrader',
      metaDescription: 'Trade on MetaTrader 4, MetaTrader 5, or WebTrader. Ultra-fast execution, advanced charting, and mobile trading apps.',
    }
  }

  // Account Types page
  if (prompt.includes('(account_types)') || prompt.includes('account type')) {
    return {
      heroTitle: 'Choose Your Trading Account',
      heroSubtitle: 'Flexible account types designed for every level of trader — from beginners to professionals.',
      sections: [
        { title: 'Account Types', type: 'pricing', tiers: [
          { name: 'Standard', price: '$100', period: 'Min. Deposit', features: ['Spreads from 1.2 pips', 'No commission', 'Leverage up to 1:500', '200+ instruments', '24/5 support', 'Free education'], ctaText: 'Open Account' },
          { name: 'Premium', price: '$1,000', period: 'Min. Deposit', features: ['Spreads from 0.6 pips', '$3.50/lot commission', 'Leverage up to 1:500', '200+ instruments', 'Priority support', 'Free VPS', 'Daily analysis'], highlighted: true, ctaText: 'Open Account' },
          { name: 'VIP', price: '$25,000', period: 'Min. Deposit', features: ['Spreads from 0.0 pips', '$2.50/lot commission', 'Leverage up to 1:500', '200+ instruments', 'Personal manager', 'Free VPS', 'Custom liquidity'], ctaText: 'Contact Us' },
        ]},
        { title: 'All Accounts Include', type: 'features', items: [
          { title: 'Segregated Funds', description: 'Your funds are held in segregated accounts at top-tier banks.' },
          { title: 'Negative Balance Protection', description: 'You can never lose more than your account balance.' },
          { title: 'Free Demo Account', description: 'Practice risk-free with $100,000 in virtual funds.' },
          { title: 'Instant Deposits', description: 'Fund your account via bank transfer, card, or e-wallet.' },
        ]},
      ],
      metaTitle: 'Account Types — Standard, Premium & VIP',
      metaDescription: 'Compare trading account types. Spreads from 0.0 pips, leverage up to 1:500, and 200+ instruments. Open a free account today.',
    }
  }

  // Pricing & Spreads page — ONLY match (pricing) pageType, not the word "pricing" which appears in all prompts
  if (prompt.includes('(pricing)')) {
    return {
      heroTitle: 'Transparent Pricing & Tight Spreads',
      heroSubtitle: 'No hidden fees. No re-quotes. Competitive spreads starting from 0.0 pips.',
      sections: [
        { title: 'Live Spreads', type: 'table', columns: ['Instrument', 'Standard', 'Premium', 'VIP'], rows: [
          { 'Instrument': 'EUR/USD', 'Standard': '1.2 pips', 'Premium': '0.6 pips', 'VIP': '0.0 pips' },
          { 'Instrument': 'GBP/USD', 'Standard': '1.5 pips', 'Premium': '0.8 pips', 'VIP': '0.1 pips' },
          { 'Instrument': 'USD/JPY', 'Standard': '1.3 pips', 'Premium': '0.7 pips', 'VIP': '0.1 pips' },
          { 'Instrument': 'Gold', 'Standard': '2.5 pips', 'Premium': '1.5 pips', 'VIP': '0.5 pips' },
          { 'Instrument': 'BTC/USD', 'Standard': '$35', 'Premium': '$20', 'VIP': '$10' },
        ]},
        { title: 'Commission Structure', type: 'features', items: [
          { title: 'Standard Account', description: 'Zero commission — costs built into the spread.' },
          { title: 'Premium Account', description: '$3.50 per lot per side. Raw spreads from 0.6 pips.' },
          { title: 'VIP Account', description: '$2.50 per lot per side. Institutional-grade spreads from 0.0 pips.' },
        ]},
        { title: 'No Hidden Fees', content: 'We believe in full transparency. No deposit fees, no withdrawal fees on standard methods, and no inactivity charges for the first 12 months. Swap rates published daily.', type: 'text' },
        { title: 'Deposit & Withdrawal', type: 'table', columns: ['Method', 'Min Deposit', 'Processing Time', 'Fee'], rows: [
          { 'Method': 'Bank Transfer', 'Min Deposit': '$100', 'Processing Time': '1-3 business days', 'Fee': 'Free' },
          { 'Method': 'Credit/Debit Card', 'Min Deposit': '$50', 'Processing Time': 'Instant', 'Fee': 'Free' },
          { 'Method': 'Skrill / Neteller', 'Min Deposit': '$50', 'Processing Time': 'Instant', 'Fee': 'Free' },
          { 'Method': 'Crypto (USDT)', 'Min Deposit': '$50', 'Processing Time': '10-30 minutes', 'Fee': 'Free' },
        ]},
      ],
      metaTitle: 'Pricing & Spreads — Competitive Trading Costs',
      metaDescription: 'Transparent pricing with spreads from 0.0 pips. No hidden fees, no re-quotes. Compare our trading costs and deposit methods.',
    }
  }

  // Education page
  if (prompt.includes('(education)') || prompt.includes('education center')) {
    return {
      heroTitle: 'Trading Education Center',
      heroSubtitle: 'From beginner basics to advanced strategies — free courses, webinars, and tutorials to sharpen your trading skills.',
      sections: [
        { title: 'Learning Paths', type: 'features', items: [
          { title: 'Beginner Course', description: 'Introduction to forex, reading charts, placing your first trade, and basic risk management. 12 lessons.' },
          { title: 'Intermediate Course', description: 'Technical analysis, candlestick patterns, support & resistance, and building a trading plan. 18 lessons.' },
          { title: 'Advanced Strategies', description: 'Price action, harmonic patterns, algorithmic trading, and portfolio management. 15 lessons.' },
          { title: 'Live Webinars', description: 'Weekly live sessions with professional analysts. Market analysis, Q&A, and real-time trade setups.' },
        ]},
        { title: 'Trading Glossary', type: 'list', items: [
          { title: 'Pip', description: 'The smallest price movement in a currency pair, typically 0.0001 for most pairs.' },
          { title: 'Spread', description: 'The difference between the bid and ask price of an instrument.' },
          { title: 'Leverage', description: 'Borrowed capital that allows you to control a larger position with a smaller deposit.' },
          { title: 'Stop Loss', description: 'An order that automatically closes a trade at a predetermined loss level.' },
          { title: 'Margin', description: 'The amount of money required to open and maintain a leveraged position.' },
        ]},
        { title: 'Video Tutorials', content: 'Over 100 video tutorials covering platform setup, order types, technical analysis, fundamental analysis, and risk management. New content added weekly.', type: 'text' },
        { title: 'Start Learning Today', content: 'All educational resources are free for registered clients. Open a demo account and practice while you learn.', type: 'cta', ctaText: 'Open Free Demo', ctaUrl: '#' },
      ],
      metaTitle: 'Education Center — Free Trading Courses & Webinars',
      metaDescription: 'Free trading courses for all levels. Beginner to advanced strategies, live webinars, video tutorials, and trading glossary.',
    }
  }

  // Forex Trading page
  if (prompt.includes('forex trading') || prompt.includes('markets/forex') || (prompt.includes('(markets)') && prompt.includes('forex'))) {
    return {
      heroTitle: 'Trade Forex — The World\'s Largest Market',
      heroSubtitle: 'Access 70+ currency pairs with tight spreads, fast execution, and leverage up to 1:500.',
      sections: [
        { title: 'Why Trade Forex With Us', type: 'features', items: [
          { title: '70+ Currency Pairs', description: 'Major, minor, and exotic pairs including EUR/USD, GBP/JPY, USD/ZAR, and more.' },
          { title: 'Spreads from 0.0 pips', description: 'Institutional-grade pricing with raw spreads on premium accounts.' },
          { title: '24/5 Market Access', description: 'Trade around the clock from Sydney open to New York close.' },
          { title: 'Deep Liquidity', description: 'Aggregated pricing from tier-1 banks ensures minimal slippage.' },
        ]},
        { title: 'Popular Forex Pairs', type: 'table', columns: ['Pair', 'Spread From', 'Leverage', 'Trading Hours'], rows: [
          { 'Pair': 'EUR/USD', 'Spread From': '0.0 pips', 'Leverage': '1:500', 'Trading Hours': '24/5' },
          { 'Pair': 'GBP/USD', 'Spread From': '0.1 pips', 'Leverage': '1:500', 'Trading Hours': '24/5' },
          { 'Pair': 'USD/JPY', 'Spread From': '0.1 pips', 'Leverage': '1:500', 'Trading Hours': '24/5' },
          { 'Pair': 'AUD/USD', 'Spread From': '0.2 pips', 'Leverage': '1:500', 'Trading Hours': '24/5' },
        ]},
        { title: 'Forex Trading Basics', content: 'Forex (Foreign Exchange) is the global marketplace for trading currencies. With a daily volume exceeding $7 trillion, it is the most liquid market in the world. Traders profit from changes in exchange rates between currency pairs.', type: 'text' },
      ],
      metaTitle: 'Forex Trading — 70+ Currency Pairs from 0.0 Pips',
      metaDescription: 'Trade 70+ forex currency pairs with spreads from 0.0 pips and leverage up to 1:500. 24/5 market access with fast execution.',
    }
  }

  // Crypto page
  if (prompt.includes('crypto') || (prompt.includes('(markets)') && !prompt.includes('forex') && !prompt.includes('commod') && !prompt.includes('indic'))) {
    return {
      heroTitle: 'Trade Crypto CFDs',
      heroSubtitle: 'Trade Bitcoin, Ethereum, and 30+ cryptocurrencies as CFDs — go long or short with leverage.',
      sections: [
        { title: 'Why Trade Crypto With Us', type: 'features', items: [
          { title: '30+ Crypto Pairs', description: 'BTC, ETH, SOL, XRP, DOGE, and many more against USD and EUR.' },
          { title: 'Leverage Up to 1:20', description: 'Amplify your crypto exposure without holding the underlying asset.' },
          { title: '24/7 Trading', description: 'Crypto markets never sleep. Trade any time, day or night.' },
          { title: 'No Wallet Needed', description: 'Trade crypto CFDs without the complexity of wallets and private keys.' },
        ]},
        { title: 'Available Crypto Assets', type: 'table', columns: ['Asset', 'Symbol', 'Spread From', 'Leverage'], rows: [
          { 'Asset': 'Bitcoin', 'Symbol': 'BTC/USD', 'Spread From': '$15', 'Leverage': '1:20' },
          { 'Asset': 'Ethereum', 'Symbol': 'ETH/USD', 'Spread From': '$2', 'Leverage': '1:20' },
          { 'Asset': 'Solana', 'Symbol': 'SOL/USD', 'Spread From': '$0.10', 'Leverage': '1:10' },
          { 'Asset': 'Ripple', 'Symbol': 'XRP/USD', 'Spread From': '$0.005', 'Leverage': '1:10' },
        ]},
        { title: 'Risk Warning', content: 'Cryptocurrency CFDs are highly volatile instruments. Prices can swing 10-20% in a single day. Only trade with capital you can afford to lose and always use stop-loss orders.', type: 'text' },
      ],
      metaTitle: 'Crypto CFD Trading — Bitcoin, Ethereum & 30+ Coins',
      metaDescription: 'Trade crypto CFDs with leverage. Bitcoin, Ethereum, Solana, and 30+ cryptocurrencies. No wallet needed. 24/7 trading.',
    }
  }

  // Commodities page
  if (prompt.includes('commod')) {
    return {
      heroTitle: 'Trade Commodities',
      heroSubtitle: 'Access global commodity markets — gold, silver, oil, natural gas, and agricultural products.',
      sections: [
        { title: 'Available Commodities', type: 'features', items: [
          { title: 'Precious Metals', description: 'Gold (XAU/USD), Silver (XAG/USD), Platinum, and Palladium with tight spreads.' },
          { title: 'Energy', description: 'Crude Oil (WTI & Brent), Natural Gas, and Heating Oil futures CFDs.' },
          { title: 'Agriculture', description: 'Coffee, Cocoa, Sugar, Wheat, Corn, and Soybeans.' },
        ]},
        { title: 'Commodity Spreads', type: 'table', columns: ['Commodity', 'Symbol', 'Spread From', 'Leverage'], rows: [
          { 'Commodity': 'Gold', 'Symbol': 'XAU/USD', 'Spread From': '0.25 pips', 'Leverage': '1:200' },
          { 'Commodity': 'Silver', 'Symbol': 'XAG/USD', 'Spread From': '0.02 pips', 'Leverage': '1:100' },
          { 'Commodity': 'Crude Oil (WTI)', 'Symbol': 'CL', 'Spread From': '0.03', 'Leverage': '1:100' },
          { 'Commodity': 'Natural Gas', 'Symbol': 'NG', 'Spread From': '0.005', 'Leverage': '1:50' },
        ]},
        { title: 'Why Trade Commodities', content: 'Commodities offer portfolio diversification and a hedge against inflation. Gold and oil are among the most actively traded assets globally, providing ample liquidity and trading opportunities.', type: 'text' },
      ],
      metaTitle: 'Commodities Trading — Gold, Oil & More',
      metaDescription: 'Trade gold, silver, oil, and agricultural commodities. Tight spreads, leverage up to 1:200, and fast execution.',
    }
  }

  // Indices page
  if (prompt.includes('indic')) {
    return {
      heroTitle: 'Trade Global Indices',
      heroSubtitle: 'Trade the world\'s top stock indices — S&P 500, NASDAQ, FTSE 100, DAX, and Nikkei 225.',
      sections: [
        { title: 'Available Indices', type: 'table', columns: ['Index', 'Symbol', 'Spread From', 'Trading Hours'], rows: [
          { 'Index': 'S&P 500', 'Symbol': 'US500', 'Spread From': '0.4 pts', 'Trading Hours': '23/5' },
          { 'Index': 'NASDAQ 100', 'Symbol': 'USTEC', 'Spread From': '1.0 pts', 'Trading Hours': '23/5' },
          { 'Index': 'FTSE 100', 'Symbol': 'UK100', 'Spread From': '1.0 pts', 'Trading Hours': '08:00-16:30 GMT' },
          { 'Index': 'DAX 40', 'Symbol': 'GER40', 'Spread From': '1.2 pts', 'Trading Hours': '08:00-22:00 GMT' },
          { 'Index': 'Nikkei 225', 'Symbol': 'JP225', 'Spread From': '7.0 pts', 'Trading Hours': '00:00-06:30 GMT' },
        ]},
        { title: 'Why Trade Indices', type: 'features', items: [
          { title: 'Diversified Exposure', description: 'A single trade gives you exposure to a basket of top companies.' },
          { title: 'Low Margins', description: 'Trade with leverage up to 1:200 on major indices.' },
          { title: 'No Overnight Fees', description: 'Competitive swap rates on index positions held overnight.' },
        ]},
        { title: 'Start Trading Indices', content: 'Index CFDs let you speculate on the direction of global equity markets without owning individual stocks. Go long in bull markets or short in bear markets.', type: 'cta', ctaText: 'Open Account', ctaUrl: '#' },
      ],
      metaTitle: 'Index Trading — S&P 500, NASDAQ, DAX & More',
      metaDescription: 'Trade global stock indices with tight spreads. S&P 500, NASDAQ, FTSE 100, DAX, and more. Leverage up to 1:200.',
    }
  }

  // Market Analysis page
  if (prompt.includes('(analysis)') || prompt.includes('market analysis')) {
    return {
      heroTitle: 'Market Analysis & Insights',
      heroSubtitle: 'Daily analysis from our team of professional analysts. Technical reports, fundamental insights, and trade ideas.',
      sections: [
        { title: 'Today\'s Market Overview', content: 'Markets remain focused on central bank policy decisions and key economic data. The US Dollar holds firm ahead of this week\'s FOMC minutes, while the Euro finds support near key technical levels. Gold continues to consolidate above $2,000 as geopolitical tensions provide a floor.', type: 'text' },
        { title: 'Analysis Types', type: 'features', items: [
          { title: 'Technical Analysis', description: 'Chart patterns, support/resistance levels, indicators, and price action setups updated daily.' },
          { title: 'Fundamental Analysis', description: 'Economic calendar coverage, central bank decisions, GDP, employment, and inflation reports.' },
          { title: 'Trading Signals', description: 'Actionable trade ideas with entry, stop-loss, and take-profit levels from our analysts.' },
          { title: 'Weekly Webinars', description: 'Live market review sessions every Monday and Wednesday at 14:00 GMT.' },
        ]},
        { title: 'Economic Calendar', content: 'Stay ahead of market-moving events. Our economic calendar highlights key data releases including Non-Farm Payrolls, CPI, GDP, interest rate decisions, and PMI data across major economies.', type: 'text' },
      ],
      metaTitle: 'Market Analysis — Daily Forex & Trading Insights',
      metaDescription: 'Free daily market analysis, trading signals, and economic calendar. Technical and fundamental analysis from professional analysts.',
    }
  }

  // Contact page
  if (prompt.includes('(contact)') || prompt.includes('contact us')) {
    return {
      heroTitle: 'Get in Touch',
      heroSubtitle: 'Our support team is available 24/5 to help you with any questions or concerns.',
      sections: [
        { title: 'Contact Methods', type: 'features', items: [
          { title: 'Live Chat', description: 'Chat with our support team directly from the platform. Average response time: under 2 minutes.' },
          { title: 'Email Support', description: 'Send us an email at support@novamarkets.com. We respond within 4 hours during business days.' },
          { title: 'Phone Support', description: 'Call us at +44 20 1234 5678 (UK) or +971 4 123 4567 (Dubai). Available 24/5.' },
          { title: 'Office Visits', description: 'Visit us at our offices in London, Dubai, or Singapore by appointment.' },
        ]},
        { title: 'Office Locations', type: 'list', items: [
          { title: 'London (HQ)', description: '123 Financial Street, Canary Wharf, London E14 5AB, United Kingdom' },
          { title: 'Dubai', description: 'Suite 2501, DIFC Gate Building, Dubai International Financial Centre, UAE' },
          { title: 'Singapore', description: '80 Robinson Road, #08-01, Singapore 068898' },
        ]},
        { title: 'Frequently Asked Questions', content: 'Before reaching out, check our FAQ section for answers to common questions about account opening, deposits, withdrawals, and platform setup.', type: 'cta', ctaText: 'Visit FAQ', ctaUrl: '#' },
      ],
      metaTitle: 'Contact Us — 24/5 Customer Support',
      metaDescription: 'Get in touch with our 24/5 support team via live chat, email, or phone. Offices in London, Dubai, and Singapore.',
    }
  }

  // FAQ page
  if (prompt.includes('(faq)')) {
    return {
      heroTitle: 'Frequently Asked Questions',
      heroSubtitle: 'Find answers to the most common questions about trading, accounts, and our platform.',
      sections: [
        { title: 'Account & Registration', type: 'list', items: [
          { title: 'How do I open an account?', description: 'Click "Open Account", fill in the registration form, verify your identity (passport or ID + proof of address), and fund your account. The process takes under 10 minutes.' },
          { title: 'What documents do I need?', description: 'A valid government-issued ID (passport, driving license, or national ID) and a recent proof of address (utility bill or bank statement, not older than 3 months).' },
          { title: 'Can I have multiple accounts?', description: 'Yes, you can open multiple trading accounts under one profile. Each can have a different account type or base currency.' },
        ]},
        { title: 'Trading', type: 'list', items: [
          { title: 'What is the minimum deposit?', description: 'Standard accounts start at $100. Premium accounts require $1,000 and VIP accounts require $25,000.' },
          { title: 'What leverage do you offer?', description: 'Up to 1:500 for forex, 1:200 for metals, 1:100 for indices, and 1:20 for crypto. Professional clients may qualify for higher leverage.' },
          { title: 'Do you allow hedging and scalping?', description: 'Yes, we support all trading strategies including hedging, scalping, and automated trading with Expert Advisors.' },
        ]},
        { title: 'Deposits & Withdrawals', type: 'list', items: [
          { title: 'How do I deposit funds?', description: 'Log into your client portal, click "Deposit", and choose from bank transfer, credit/debit card, or e-wallets (Skrill, Neteller).' },
          { title: 'How long do withdrawals take?', description: 'Withdrawal requests are processed within 24 hours. Card withdrawals take 1-3 business days; e-wallets are instant; bank transfers take 3-5 business days.' },
          { title: 'Are there any fees?', description: 'We do not charge deposit or withdrawal fees on standard methods. Third-party payment providers may apply their own fees.' },
        ]},
      ],
      metaTitle: 'FAQ — Frequently Asked Questions',
      metaDescription: 'Answers to common questions about account opening, deposits, withdrawals, trading platforms, and more.',
    }
  }

  // Partners page
  if (prompt.includes('(partners)') || prompt.includes('affiliate')) {
    return {
      heroTitle: 'Partnership Programs',
      heroSubtitle: 'Earn competitive commissions as an Introducing Broker or Affiliate. Join our global network of partners.',
      sections: [
        { title: 'Partnership Options', type: 'features', items: [
          { title: 'Introducing Broker (IB)', description: 'Earn up to $15 per lot from your referred clients. Multi-tier commissions, real-time tracking, and dedicated IB manager.' },
          { title: 'Affiliate Program', description: 'Earn up to $600 CPA per qualified referral. Marketing materials, tracking links, and monthly payouts.' },
          { title: 'White Label', description: 'Launch your own branded trading platform powered by our technology. Full customization, liquidity, and back-office support.' },
        ]},
        { title: 'Why Partner With Us', type: 'list', items: [
          { title: 'Competitive Commissions', description: 'Industry-leading rates with lifetime revenue sharing.' },
          { title: 'Real-Time Dashboard', description: 'Track referrals, commissions, and performance in real-time.' },
          { title: 'Marketing Support', description: 'Banners, landing pages, and promotional materials provided.' },
          { title: 'Fast Payouts', description: 'Monthly payouts via bank transfer, e-wallet, or crypto.' },
        ]},
        { title: 'Become a Partner', content: 'Join our network of 5,000+ partners worldwide. Apply today and start earning from your first referral.', type: 'cta', ctaText: 'Apply Now', ctaUrl: '#' },
      ],
      metaTitle: 'Partnership Programs — IB & Affiliate',
      metaDescription: 'Earn up to $15/lot as an IB or $600 CPA as an affiliate. Real-time tracking, marketing support, and fast payouts.',
    }
  }

  // Promotions page
  if (prompt.includes('(promotions)')) {
    return {
      heroTitle: 'Current Promotions',
      heroSubtitle: 'Take advantage of our latest offers and bonuses designed to boost your trading.',
      sections: [
        { title: 'Active Offers', type: 'features', items: [
          { title: '100% Welcome Bonus', description: 'Get a 100% deposit bonus on your first deposit up to $5,000. Trade with double your capital. T&Cs apply.' },
          { title: 'Refer a Friend', description: 'Earn $50 for every friend you refer who opens and funds a live account. No limit on referrals.' },
          { title: 'Cashback Program', description: 'Earn up to $5 cashback per lot traded. Automatically credited to your account daily.' },
          { title: 'Free VPS', description: 'Qualified accounts receive a free Virtual Private Server for 24/7 automated trading.' },
        ]},
        { title: 'Terms & Conditions', content: 'All promotions are subject to terms and conditions. Bonus funds may have trading volume requirements before withdrawal. Promotions may be modified or discontinued at any time. Full terms available in the client portal.', type: 'text' },
        { title: 'Claim Your Bonus', content: 'Register or log in to your client portal to activate available promotions.', type: 'cta', ctaText: 'Get Started', ctaUrl: '#' },
      ],
      metaTitle: 'Trading Promotions & Bonuses',
      metaDescription: 'Current trading promotions: 100% welcome bonus, cashback, refer a friend, and free VPS. Terms & conditions apply.',
    }
  }

  // Trading Calculator page
  if (prompt.includes('(tools)') || prompt.includes('calculator')) {
    return {
      heroTitle: 'Trading Calculators',
      heroSubtitle: 'Plan your trades with precision using our free forex and CFD calculators.',
      sections: [
        { title: 'Available Calculators', type: 'features', items: [
          { title: 'Pip Calculator', description: 'Calculate the value of a pip for any currency pair and position size. Essential for risk management.' },
          { title: 'Margin Calculator', description: 'Determine the required margin for a position based on your leverage and account currency.' },
          { title: 'Profit/Loss Calculator', description: 'Estimate potential profit or loss before entering a trade. Input entry, exit, and lot size.' },
          { title: 'Swap Calculator', description: 'Check overnight swap fees for holding positions. Varies by instrument and direction.' },
        ]},
        { title: 'How to Use', content: 'Select the calculator you need, input your trade parameters (instrument, lot size, entry/exit price, leverage), and get instant results. All calculations are based on real-time pricing.', type: 'text' },
      ],
      metaTitle: 'Trading Calculators — Pip, Margin & Profit',
      metaDescription: 'Free trading calculators: pip value, margin requirement, profit/loss, and swap rates. Plan your trades with precision.',
    }
  }

  // Regulation page
  if (prompt.includes('regulation') && prompt.includes('(legal)')) {
    return {
      heroTitle: 'Regulation & Licenses',
      heroSubtitle: 'We are regulated by leading financial authorities to ensure the safety of your funds and the integrity of our services.',
      sections: [
        { title: 'Our Regulatory Framework', type: 'features', items: [
          { title: 'FCA Regulated', description: 'Authorized and regulated by the Financial Conduct Authority (UK). Registration No. 123456.' },
          { title: 'CySEC Licensed', description: 'Licensed by the Cyprus Securities and Exchange Commission. License No. 789/01.' },
          { title: 'DFSA Authorized', description: 'Regulated by the Dubai Financial Services Authority for Middle East operations.' },
        ]},
        { title: 'Client Protection', type: 'list', items: [
          { title: 'Segregated Client Funds', description: 'All client funds are held in segregated accounts at top-tier European banks, completely separate from company funds.' },
          { title: 'Investor Compensation', description: 'Eligible clients are covered by the Investor Compensation Fund (ICF) up to EUR 20,000.' },
          { title: 'Negative Balance Protection', description: 'Retail clients are protected from losses exceeding their account balance.' },
          { title: 'Regular Audits', description: 'Our financials are audited annually by Big Four accounting firms.' },
        ]},
        { title: 'Compliance', content: 'We implement strict Anti-Money Laundering (AML) and Know Your Customer (KYC) procedures in accordance with international regulations. All clients must verify their identity before trading.', type: 'text' },
      ],
      metaTitle: 'Regulation & Licenses — FCA, CySEC, DFSA',
      metaDescription: 'Regulated by FCA, CySEC, and DFSA. Segregated funds, investor compensation, and negative balance protection for all clients.',
    }
  }

  // Terms & Conditions page
  if (prompt.includes('terms') && prompt.includes('(legal)')) {
    return {
      heroTitle: 'Terms & Conditions',
      heroSubtitle: 'Please read these terms carefully before using our trading services and platform.',
      sections: [
        { title: 'General Terms', content: 'These Terms and Conditions govern your use of our trading platform and services. By opening an account and using our services, you agree to be bound by these terms. We reserve the right to update these terms at any time with reasonable notice to clients.', type: 'text' },
        { title: 'Account Terms', type: 'list', items: [
          { title: 'Eligibility', description: 'You must be at least 18 years old and a legal resident of a supported jurisdiction to open an account.' },
          { title: 'Account Verification', description: 'All accounts must complete KYC verification with a valid government ID and proof of address before withdrawals are processed.' },
          { title: 'One Account Per Person', description: 'Each individual may maintain one account unless otherwise authorized. Duplicate accounts may be closed.' },
        ]},
        { title: 'Trading Rules', type: 'list', items: [
          { title: 'Order Execution', description: 'Orders are executed at the best available price. Market conditions may cause slippage during volatile periods.' },
          { title: 'Leverage & Margin', description: 'Leveraged trading carries significant risk. Positions may be automatically closed if margin requirements are not maintained.' },
          { title: 'Prohibited Activities', description: 'Manipulation, abuse of pricing errors, and use of insider information are strictly prohibited and may result in account termination.' },
        ]},
        { title: 'Liability & Disputes', content: 'Our liability is limited to the funds held in your trading account. Any disputes shall be resolved through the regulatory body in the applicable jurisdiction. These terms are governed by the laws of England and Wales.', type: 'text' },
      ],
      metaTitle: 'Terms & Conditions',
      metaDescription: 'Read our terms and conditions covering account usage, trading rules, liability, and dispute resolution for our trading services.',
    }
  }

  // Privacy Policy page
  if (prompt.includes('privacy') && prompt.includes('(legal)')) {
    return {
      heroTitle: 'Privacy Policy',
      heroSubtitle: 'We are committed to protecting your personal data and privacy in compliance with GDPR and applicable regulations.',
      sections: [
        { title: 'Data We Collect', type: 'list', items: [
          { title: 'Personal Information', description: 'Name, email, phone number, date of birth, and address provided during registration.' },
          { title: 'Identification Documents', description: 'Government-issued ID and proof of address for KYC/AML compliance.' },
          { title: 'Trading Activity', description: 'Order history, account balances, deposit/withdrawal records, and platform usage data.' },
          { title: 'Technical Data', description: 'IP address, browser type, device information, and cookies for security and analytics.' },
        ]},
        { title: 'How We Use Your Data', content: 'We use your personal data to provide our trading services, comply with regulatory requirements (KYC/AML), improve our platform, send important account notifications, and provide customer support. We do not sell your personal data to third parties.', type: 'text' },
        { title: 'Your Rights', type: 'features', items: [
          { title: 'Access', description: 'Request a copy of all personal data we hold about you.' },
          { title: 'Rectification', description: 'Correct any inaccurate or incomplete personal data.' },
          { title: 'Erasure', description: 'Request deletion of your data, subject to regulatory retention requirements.' },
          { title: 'Portability', description: 'Receive your data in a structured, machine-readable format.' },
        ]},
        { title: 'Cookies', content: 'We use essential cookies for platform functionality, analytics cookies to improve our service, and marketing cookies with your consent. You can manage cookie preferences through your browser settings.', type: 'text' },
      ],
      metaTitle: 'Privacy Policy — Data Protection & GDPR',
      metaDescription: 'Our privacy policy explains how we collect, use, and protect your personal data. GDPR compliant with full data subject rights.',
    }
  }

  // Risk Disclosure page
  if (prompt.includes('risk') && prompt.includes('(legal)')) {
    return {
      heroTitle: 'Risk Disclosure Statement',
      heroSubtitle: 'Trading CFDs and forex involves significant risk. Please ensure you understand these risks before trading.',
      sections: [
        { title: 'General Risk Warning', content: 'Contracts for Difference (CFDs) and forex trading are complex instruments that carry a high level of risk. Approximately 70-80% of retail investor accounts lose money when trading CFDs. You should consider whether you understand how these instruments work and whether you can afford to take the high risk of losing your money.', type: 'text' },
        { title: 'Key Risks', type: 'list', items: [
          { title: 'Leverage Risk', description: 'Leverage amplifies both potential profits and losses. A small market movement can result in large gains or losses relative to your initial deposit.' },
          { title: 'Market Volatility', description: 'Prices can move rapidly due to economic events, news, and market conditions. Gaps and slippage may occur during volatile periods.' },
          { title: 'Liquidity Risk', description: 'Under certain market conditions, it may be difficult or impossible to close a position at your desired price.' },
          { title: 'Technology Risk', description: 'Internet connectivity issues, platform outages, and hardware failures may prevent timely order execution.' },
          { title: 'Regulatory Risk', description: 'Changes in regulations or laws may affect trading conditions, leverage limits, or available instruments.' },
        ]},
        { title: 'Your Responsibilities', content: 'You should never trade with money you cannot afford to lose. Always use risk management tools such as stop-loss orders. Educate yourself thoroughly before trading with real money. Past performance is not indicative of future results.', type: 'text' },
      ],
      metaTitle: 'Risk Disclosure — CFD & Forex Trading Risks',
      metaDescription: 'Important risk disclosure for CFD and forex trading. Understand leverage risks, market volatility, and potential losses before trading.',
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
    heroTitle: 'Trade Smarter with Advanced Technology',
    heroSubtitle: 'Access global markets with institutional-grade tools, tight spreads, and lightning-fast execution.',
    sections: [
      { title: 'Why Choose Us', content: 'Industry-leading spreads starting from 0.0 pips, 24/7 customer support, and advanced charting tools. Regulated and trusted by thousands of traders worldwide.', type: 'features', items: [
        { title: 'Tight Spreads', description: 'Spreads from 0.0 pips on major forex pairs with no hidden markups.' },
        { title: 'Fast Execution', description: 'Average execution speed under 30ms from Equinix data centers.' },
        { title: '200+ Instruments', description: 'Forex, crypto, commodities, indices, and stocks in one account.' },
        { title: '24/5 Support', description: 'Multilingual support team available around the clock.' },
      ]},
      { title: 'Trading Platforms', content: 'Trade on MetaTrader 4, MetaTrader 5, or our proprietary web platform. Available on desktop, mobile, and tablet.', type: 'features', items: [
        { title: 'MetaTrader 4', description: 'The world\'s most popular forex trading platform with Expert Advisors.' },
        { title: 'MetaTrader 5', description: 'Multi-asset platform with advanced charting and analysis.' },
        { title: 'WebTrader', description: 'Trade from any browser — no download required.' },
      ]},
      { title: 'Account Types', type: 'pricing', tiers: [
        { name: 'Standard', price: '$100', period: 'Min. Deposit', features: ['Spreads from 1.2 pips', 'No commission', 'Leverage 1:500'], ctaText: 'Open Account' },
        { name: 'Premium', price: '$1,000', period: 'Min. Deposit', features: ['Spreads from 0.6 pips', '$3.50/lot', 'Free VPS'], highlighted: true, ctaText: 'Open Account' },
        { name: 'VIP', price: '$25,000', period: 'Min. Deposit', features: ['Spreads from 0.0 pips', '$2.50/lot', 'Personal Manager'], ctaText: 'Contact Us' },
      ]},
      { title: 'Market Analysis', content: 'Daily market insights from our team of expert analysts. Technical analysis, fundamental reports, and trading signals.', type: 'text' },
    ],
    metaTitle: 'Trade with the Best — Regulated Forex Broker',
    metaDescription: 'Trade Forex, Crypto & CFDs with tight spreads and fast execution. Regulated broker with 24/7 support. Open a free account today.',
  }
}
