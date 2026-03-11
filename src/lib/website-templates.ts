// Website template definitions — 3 industry-specific templates

export interface PageDefinition {
  slug: string
  title: string
  pageType: string
  category: string
  contentPrompt: string
  order: number
}

export interface WebsiteTemplate {
  id: string
  name: string
  description: string
  icon: string
  pageCount: number
  features: string[]
  pages: PageDefinition[]
}

export const WEBSITE_TEMPLATES: WebsiteTemplate[] = [
  {
    id: 'forex-broker',
    name: 'Forex Broker',
    description: 'Complete website for forex & CFD brokers with regulation pages, trading platforms, and account types.',
    icon: '💱',
    pageCount: 20,
    features: ['MT4/MT5 Integration', 'Regulation Pages', 'Live Spreads', 'Account Comparison', 'Education Center'],
    pages: [
      { slug: 'home', title: 'Homepage', pageType: 'homepage', category: 'core', order: 0, contentPrompt: 'Create a professional forex broker homepage with a hero section about trading global markets, tight spreads, and fast execution. Include sections for key features, supported platforms, and regulatory info.' },
      { slug: 'about', title: 'About Us', pageType: 'about', category: 'core', order: 1, contentPrompt: 'Write an about page for a regulated forex broker. Include company history, mission statement, team section, and regulatory licenses.' },
      { slug: 'platforms', title: 'Trading Platforms', pageType: 'platforms', category: 'core', order: 2, contentPrompt: 'Describe available trading platforms: MetaTrader 4, MetaTrader 5, and Web Trader. Include features, system requirements, and download links.' },
      { slug: 'account-types', title: 'Account Types', pageType: 'account_types', category: 'core', order: 3, contentPrompt: 'Create a comparison of account types: Standard (from $100), Premium ($1,000), and VIP ($10,000). Compare spreads, leverage, commissions, and features.' },
      { slug: 'markets/forex', title: 'Forex Trading', pageType: 'markets', category: 'markets', order: 4, contentPrompt: 'Detail forex trading offerings: 60+ currency pairs, spreads from 0.0 pips, leverage up to 1:500, and 24/5 market access.' },
      { slug: 'markets/crypto', title: 'Crypto CFDs', pageType: 'markets', category: 'markets', order: 5, contentPrompt: 'Describe cryptocurrency CFD trading: Bitcoin, Ethereum, and 30+ altcoins. Include trading hours, leverage, and risk warnings.' },
      { slug: 'markets/commodities', title: 'Commodities', pageType: 'markets', category: 'markets', order: 6, contentPrompt: 'Cover commodity trading: Gold, Silver, Oil, Natural Gas. Include contract specs, trading hours, and margin requirements.' },
      { slug: 'markets/indices', title: 'Indices', pageType: 'markets', category: 'markets', order: 7, contentPrompt: 'Detail index CFD trading: S&P 500, NASDAQ, FTSE 100, DAX 40. Include trading conditions and market hours.' },
      { slug: 'pricing', title: 'Pricing & Spreads', pageType: 'pricing', category: 'core', order: 8, contentPrompt: 'Create a transparent pricing page with live spread tables, commission structure, swap rates, and fee comparison.' },
      { slug: 'education', title: 'Education Center', pageType: 'education', category: 'resources', order: 9, contentPrompt: 'Build an education hub with sections for beginner, intermediate, and advanced traders. Include webinars, ebooks, and video tutorials.' },
      { slug: 'analysis', title: 'Market Analysis', pageType: 'analysis', category: 'resources', order: 10, contentPrompt: 'Create a market analysis page with daily outlook, technical analysis, fundamental analysis, and economic calendar integration.' },
      { slug: 'tools/calculator', title: 'Trading Calculator', pageType: 'tools', category: 'resources', order: 11, contentPrompt: 'Describe trading calculators: pip calculator, margin calculator, profit/loss calculator, and position size calculator.' },
      { slug: 'partners', title: 'Partners & Affiliates', pageType: 'partners', category: 'business', order: 12, contentPrompt: 'Create an affiliate/IB program page with commission structures, marketing materials, and registration CTA.' },
      { slug: 'promotions', title: 'Promotions', pageType: 'promotions', category: 'business', order: 13, contentPrompt: 'Showcase current promotions: welcome bonus, deposit bonus, cashback program, and referral rewards. Include terms and conditions.' },
      { slug: 'contact', title: 'Contact Us', pageType: 'contact', category: 'core', order: 14, contentPrompt: 'Build a contact page with office addresses, phone numbers, email, live chat widget, and a contact form with fields for name, email, phone, and message.' },
      { slug: 'faq', title: 'FAQ', pageType: 'faq', category: 'resources', order: 15, contentPrompt: 'Create a comprehensive FAQ covering account opening, deposits/withdrawals, trading conditions, platforms, and regulations.' },
      { slug: 'regulation', title: 'Regulation & Licenses', pageType: 'legal', category: 'legal', order: 16, contentPrompt: 'Detail regulatory compliance: licensing authorities (CySEC, FCA, ASIC), client fund segregation, and investor protection schemes.' },
      { slug: 'terms', title: 'Terms & Conditions', pageType: 'legal', category: 'legal', order: 17, contentPrompt: 'Create professional terms of service covering account terms, trading rules, liability limitations, and dispute resolution.' },
      { slug: 'privacy', title: 'Privacy Policy', pageType: 'legal', category: 'legal', order: 18, contentPrompt: 'Write a GDPR-compliant privacy policy covering data collection, usage, storage, cookies, and user rights.' },
      { slug: 'risk-disclosure', title: 'Risk Disclosure', pageType: 'legal', category: 'legal', order: 19, contentPrompt: 'Create a comprehensive risk disclosure statement for CFD trading including leverage risks, market volatility, and potential losses.' },
    ],
  },
  {
    id: 'crypto-exchange',
    name: 'Crypto Exchange',
    description: 'Full website for cryptocurrency exchanges with token listings, staking, and wallet features.',
    icon: '🪙',
    pageCount: 18,
    features: ['Token Listings', 'Staking/Earn', 'Wallet Security', 'API Documentation', 'DeFi Integration'],
    pages: [
      { slug: 'home', title: 'Homepage', pageType: 'homepage', category: 'core', order: 0, contentPrompt: 'Create a crypto exchange homepage with hero about trading 200+ cryptocurrencies, low fees, and institutional-grade security. Include live price ticker section and key stats.' },
      { slug: 'about', title: 'About Us', pageType: 'about', category: 'core', order: 1, contentPrompt: 'Write about page for a crypto exchange: founding story, mission to democratize finance, team backgrounds, and security-first philosophy.' },
      { slug: 'markets', title: 'Markets Overview', pageType: 'markets', category: 'core', order: 2, contentPrompt: 'Create a markets page showing top trading pairs (BTC/USDT, ETH/USDT, etc.), 24h volume, and price change. Include spot and futures sections.' },
      { slug: 'spot-trading', title: 'Spot Trading', pageType: 'trading', category: 'trading', order: 3, contentPrompt: 'Detail spot trading features: advanced order types (limit, market, stop-loss, OCO), real-time charts, order book depth, and low maker/taker fees.' },
      { slug: 'futures', title: 'Futures Trading', pageType: 'trading', category: 'trading', order: 4, contentPrompt: 'Describe futures/derivatives trading: perpetual contracts, up to 125x leverage, funding rates, and risk management tools.' },
      { slug: 'staking', title: 'Staking & Earn', pageType: 'earn', category: 'products', order: 5, contentPrompt: 'Create staking page: flexible and locked staking options, APY rates for top tokens (ETH 4-6%, SOL 5-8%, DOT 10-14%), and DeFi yield products.' },
      { slug: 'wallet', title: 'Wallet & Security', pageType: 'security', category: 'products', order: 6, contentPrompt: 'Detail wallet security: cold storage (95% of funds), multi-sig technology, 2FA, biometric auth, withdrawal whitelist, and insurance fund.' },
      { slug: 'tokens', title: 'Token Listings', pageType: 'listings', category: 'products', order: 7, contentPrompt: 'Create token listing page: supported assets (200+), listing criteria, new listings section, and delisting policy.' },
      { slug: 'fees', title: 'Fees & Limits', pageType: 'pricing', category: 'core', order: 8, contentPrompt: 'Transparent fee structure: spot trading (0.1% maker/taker), futures fees, VIP tiers with reduced rates, deposit/withdrawal fees by network.' },
      { slug: 'api', title: 'API Documentation', pageType: 'developer', category: 'resources', order: 9, contentPrompt: 'API overview page: REST and WebSocket APIs, rate limits, authentication, code examples in Python/JavaScript, and sandbox environment.' },
      { slug: 'education', title: 'Learn Crypto', pageType: 'education', category: 'resources', order: 10, contentPrompt: 'Crypto education hub: blockchain basics, how to buy your first crypto, DeFi explained, NFT guide, and trading strategies.' },
      { slug: 'blog', title: 'Blog & News', pageType: 'blog', category: 'resources', order: 11, contentPrompt: 'Blog landing page with categories: market analysis, project reviews, industry news, tutorials, and company updates.' },
      { slug: 'support', title: 'Help Center', pageType: 'support', category: 'core', order: 12, contentPrompt: 'Help center with categories: getting started, account verification, deposits & withdrawals, trading guide, and security tips.' },
      { slug: 'contact', title: 'Contact Us', pageType: 'contact', category: 'core', order: 13, contentPrompt: 'Contact page with 24/7 live chat, support ticket system, email support, and community channels (Telegram, Discord).' },
      { slug: 'careers', title: 'Careers', pageType: 'company', category: 'business', order: 14, contentPrompt: 'Careers page: company culture, benefits, open positions in engineering, compliance, marketing, and customer support.' },
      { slug: 'terms', title: 'Terms of Service', pageType: 'legal', category: 'legal', order: 15, contentPrompt: 'Terms of service for crypto exchange: account requirements, prohibited activities, trading rules, and jurisdiction limitations.' },
      { slug: 'privacy', title: 'Privacy Policy', pageType: 'legal', category: 'legal', order: 16, contentPrompt: 'Privacy policy covering KYC data handling, blockchain transaction data, cookie policy, and user data rights.' },
      { slug: 'risk-warning', title: 'Risk Warning', pageType: 'legal', category: 'legal', order: 17, contentPrompt: 'Risk warning for crypto trading: volatility risks, regulatory risks, technology risks, and past performance disclaimers.' },
    ],
  },
  {
    id: 'prop-trading',
    name: 'Prop Trading Firm',
    description: 'Website for proprietary trading firms with evaluation challenges, funded accounts, and leaderboards.',
    icon: '🏆',
    pageCount: 16,
    features: ['Challenge Programs', 'Funded Accounts', 'Trader Leaderboard', 'Profit Splits', 'Risk Rules'],
    pages: [
      { slug: 'home', title: 'Homepage', pageType: 'homepage', category: 'core', order: 0, contentPrompt: 'Create prop firm homepage with hero about getting funded up to $200K, 80% profit split, and fast evaluation. Include stats: funded traders count, total payouts, and average evaluation time.' },
      { slug: 'about', title: 'About Us', pageType: 'about', category: 'core', order: 1, contentPrompt: 'About page for prop trading firm: mission to fund talented traders, founding story, key metrics (total funded, payouts), and team profiles.' },
      { slug: 'challenges', title: 'Challenge Programs', pageType: 'challenges', category: 'core', order: 2, contentPrompt: 'Detail evaluation challenges: 1-Step and 2-Step programs, account sizes ($10K-$200K), profit targets (8-10%), max drawdown rules, and pricing.' },
      { slug: 'evaluation-rules', title: 'Evaluation Rules', pageType: 'rules', category: 'core', order: 3, contentPrompt: 'Comprehensive rules page: profit targets, daily drawdown limit (5%), overall drawdown limit (10%), minimum trading days, weekend holding rules, and news trading policy.' },
      { slug: 'funded-accounts', title: 'Funded Accounts', pageType: 'funded', category: 'core', order: 4, contentPrompt: 'Detail funded account benefits: 80% profit split (scaling to 90%), bi-weekly payouts, no time limits, account scaling plan, and trading instruments available.' },
      { slug: 'pricing', title: 'Pricing', pageType: 'pricing', category: 'core', order: 5, contentPrompt: 'Pricing table for all challenge sizes: $10K ($99), $25K ($199), $50K ($299), $100K ($499), $200K ($999). Include refundable fee policy and discount codes.' },
      { slug: 'leaderboard', title: 'Trader Leaderboard', pageType: 'leaderboard', category: 'community', order: 6, contentPrompt: 'Leaderboard page showing top funded traders: ranking, profit %, account size, trading style, and country. Include monthly and all-time views.' },
      { slug: 'payouts', title: 'Payout Proofs', pageType: 'social_proof', category: 'community', order: 7, contentPrompt: 'Payout proof page with verified withdrawal records, total payouts to date, average payout amount, and trader testimonials.' },
      { slug: 'platforms', title: 'Trading Platforms', pageType: 'platforms', category: 'core', order: 8, contentPrompt: 'Supported platforms: MetaTrader 4, MetaTrader 5, with details on allowed EAs, copy trading policy, and platform-specific rules.' },
      { slug: 'education', title: 'Trading Academy', pageType: 'education', category: 'resources', order: 9, contentPrompt: 'Free education for prop traders: risk management courses, trading psychology, strategy development, and funded trader interviews.' },
      { slug: 'faq', title: 'FAQ', pageType: 'faq', category: 'resources', order: 10, contentPrompt: 'FAQ covering: how challenges work, payout process, allowed trading styles, prohibited strategies (martingale, grid), and account management.' },
      { slug: 'blog', title: 'Blog', pageType: 'blog', category: 'resources', order: 11, contentPrompt: 'Blog with categories: trading tips, funded trader stories, market analysis, platform updates, and prop trading industry news.' },
      { slug: 'contact', title: 'Contact & Support', pageType: 'contact', category: 'core', order: 12, contentPrompt: 'Contact page with live chat, Discord community, email support, and ticket system. Include response time guarantees.' },
      { slug: 'affiliate', title: 'Affiliate Program', pageType: 'partners', category: 'business', order: 13, contentPrompt: 'Affiliate program: 15% recurring commission, custom referral links, real-time tracking dashboard, and monthly payouts.' },
      { slug: 'terms', title: 'Terms & Conditions', pageType: 'legal', category: 'legal', order: 14, contentPrompt: 'Terms covering challenge rules, refund policy, payout terms, prohibited trading behavior, and account termination conditions.' },
      { slug: 'privacy', title: 'Privacy Policy', pageType: 'legal', category: 'legal', order: 15, contentPrompt: 'Privacy policy covering KYC requirements, trading data collection, payment processing data, and GDPR compliance.' },
    ],
  },
]

export function getTemplateById(templateId: string): WebsiteTemplate | undefined {
  return WEBSITE_TEMPLATES.find((t) => t.id === templateId)
}

export function getTemplatePages(templateId: string): PageDefinition[] {
  return getTemplateById(templateId)?.pages || []
}
