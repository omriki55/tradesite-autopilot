// Static HTML/CSS exporter for trading company websites — Premium eToro/Plus500-grade design

export interface ExportPage {
  slug: string
  title: string
  content: string
  metaTitle?: string
  metaDescription?: string
  pageType: string
}

export interface ExportOptions {
  brandName: string
  domain: string
  niche: string
  pages: ExportPage[]
  ga4Id?: string
  gtmId?: string
  chatWidgetProvider?: string
  chatWidgetId?: string
  widgets: string[]
}

export interface ExportFile {
  path: string
  content: string
}

interface ParsedContent {
  heroTitle?: string
  heroSubtitle?: string
  sections?: ParsedSection[]
}

interface ParsedSection {
  type: string
  title?: string
  subtitle?: string
  content?: string
  items?: Array<{ icon?: string; title?: string; description?: string; label?: string; value?: string }>
  tiers?: Array<{
    name: string
    price: string
    period?: string
    features: string[]
    highlighted?: boolean
    ctaText?: string
  }>
  ctaText?: string
  ctaUrl?: string
  columns?: string[]
  rows?: Array<Record<string, string>>
  // New section type fields
  stats?: Array<{ value: string; label: string }>
  steps?: Array<{ title: string; description: string }>
  testimonials?: Array<{ text?: string; quote?: string; author: string; role?: string; rating?: number }>
  iconItems?: Array<{ icon: string; title: string; description?: string }>
  comparisonData?: { usLabel: string; themLabel: string; rows: Array<{ feature: string; us: string; them: string }> }
  bannerType?: 'info' | 'warning' | 'success'
  bannerIcon?: string
  leftContent?: string | { title: string; text: string; bullets?: string[]; ctaText?: string; ctaUrl?: string }
  rightItems?: Array<{ icon?: string; title: string; description: string }>
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ─── Niche-specific content ──────────────────────────────

interface NicheContent {
  heroHeading: string
  heroBadge: string
  heroPills: string[]
  heroMicro: string[]
  heroTrust: string[]
  heroCTAPrimary: string
  heroCTASecondary: string
  trustpilotScore: string
  trustpilotReviews: string
  navSlugs: string[]
  navCTA: string
  loginLabel: string
  mobileCTA: string
  promoHTML: string
  announcementHTML: string
  socialProof: Array<{icon: string; bold: string; text: string}>
  tickerItems: Array<{symbol: string; price: string; change: string; up: boolean}>
  regulationItems: Array<{icon: string; label: string; num: string}>
  mediaLogos: string[]
  awards: Array<{icon: string; name: string; source: string; year: string}>
  perfMetrics: Array<{value: string; unit: string; label: string}>
  securityBadges: Array<{icon: string; label: string; sub: string}>
  fundProtection: {icon: string; title: string; text: string; amounts: Array<{flag: string; label: string}>}
  footerDesc: string
  footerLicenses: Array<{title: string; text: string}>
  footerRegulatory: string[]
  footerPayments: string[]
  footerAddress: string
  footerPhone: string
  footerRisk: string
  liveActivityMsgs: Array<{flag: string; text: string}>
  stickyCTA: string
  faqCTA: string
  mockupRows: Array<{symbol: string; price: string; change: string; up: boolean}>
  mockupLabel: string
  getPageCTAVerb: (slug: string) => string
  getFaqData: () => Record<string, Array<{q: string; a: string}>>
  marketDropdownIcons: Record<string, string>
  marketDropdownDescs: Record<string, string>
}

function getNicheContent(niche: string): NicheContent {
  const forexContent: NicheContent = {
    heroHeading: 'Join 35M+ Traders — Spreads from 0.0 Pips',
    heroBadge: 'Established &amp; Regulated since 2018',
    heroPills: ['Free Demo Account', 'No Platform Fees', '0.0 Pip Spreads', 'Ultra-Fast Execution'],
    heroMicro: ['✓ No credit card required', '✓ $100K free demo', '✓ Instant access'],
    heroTrust: ['FCA Regulated', 'Segregated Funds', '200+ Instruments', '24/5 Support'],
    heroCTAPrimary: 'Open Free Account — 2 Minutes',
    heroCTASecondary: 'Try $100K Demo',
    trustpilotScore: '4.5/5',
    trustpilotReviews: '12,400+ Reviews on Trustpilot',
    navSlugs: ['home', 'about', 'platforms', 'account-types', 'pricing', 'education', 'contact'],
    navCTA: 'Start Trading',
    loginLabel: 'Log In',
    mobileCTA: 'Open Free Account',
    promoHTML: '🎁 <strong>Limited Offer:</strong> Open an account today &amp; get $100,000 Demo Credits + 0% Commission for 30 Days <a href="#">Claim Now &rarr;</a>',
    announcementHTML: 'CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <strong>72% of retail investor accounts lose money when trading CFDs with this provider.</strong> You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.',
    socialProof: [
      {icon: '⭐', bold: '4.5/5', text: 'Trustpilot'},
      {icon: '👥', bold: '35M+', text: 'Active Users'},
      {icon: '🛡️', bold: 'FCA', text: 'Regulated'},
      {icon: '🏆', bold: 'Best Broker', text: '2024'},
      {icon: '📰', bold: 'Bloomberg', text: ', Reuters'},
    ],
    tickerItems: [
      {symbol: 'EUR/USD', price: '1.0842', change: '+0.15%', up: true},
      {symbol: 'BTC/USD', price: '67,240', change: '+2.34%', up: true},
      {symbol: 'Gold', price: '2,342.50', change: '+0.42%', up: true},
      {symbol: 'S&amp;P 500', price: '5,234.18', change: '+0.52%', up: true},
      {symbol: 'GBP/USD', price: '1.2731', change: '-0.08%', up: false},
      {symbol: 'AAPL', price: '189.42', change: '+1.12%', up: true},
    ],
    regulationItems: [
      {icon: '🇬🇧', label: 'FCA (UK)', num: 'Ref. No. 595450'},
      {icon: '🇪🇺', label: 'CySEC (EU)', num: 'License No. 201/13'},
      {icon: '🇦🇪', label: 'DFSA (UAE)', num: 'Ref. No. F003484'},
      {icon: '🇦🇺', label: 'ASIC (AU)', num: 'License No. 443670'},
      {icon: '🛡️', label: 'Segregated Funds', num: 'Barclays &amp; Lloyds Bank'},
    ],
    mediaLogos: ['Bloomberg', 'Reuters', 'Financial Times', 'Forbes', 'CNBC', 'The Wall Street Journal'],
    awards: [
      {icon: '🏆', name: 'Best CFD Broker', source: 'Global Forex Awards', year: '2024'},
      {icon: '⭐', name: 'Best Trading Platform', source: 'ForexBrokers.com', year: '2024'},
      {icon: '🥇', name: 'Most Trusted Broker', source: 'Finance Magnates', year: '2024'},
      {icon: '📱', name: 'Best Mobile App', source: 'Good Money Guide', year: '2024'},
      {icon: '🎓', name: 'Best Education', source: 'Investment Trends', year: '2024'},
      {icon: '💎', name: 'Best Value Broker', source: 'BrokerChooser', year: '2024'},
    ],
    perfMetrics: [
      {value: '0.018', unit: 's', label: 'Avg. Execution Speed'},
      {value: '99.9', unit: '%', label: 'Platform Uptime'},
      {value: '99.3', unit: '%', label: 'Order Fill Rate'},
      {value: '$2.4', unit: 'B+', label: 'Client Assets'},
      {value: '500', unit: 'K+', label: 'Daily Trades'},
    ],
    securityBadges: [
      {icon: '🔒', label: '256-bit SSL', sub: 'Encryption'},
      {icon: '🏦', label: 'Segregated', sub: 'Client Funds'},
      {icon: '🛡️', label: 'Negative Balance', sub: 'Protection'},
      {icon: '📋', label: 'ISO 27001', sub: 'Certified'},
      {icon: '💳', label: 'PCI DSS', sub: 'Compliant'},
      {icon: '🔐', label: '2FA', sub: 'Authentication'},
    ],
    fundProtection: {
      icon: '🛡️',
      title: 'Client Fund Protection',
      text: 'All client funds are held in segregated accounts with tier-1 banks, completely separate from our operational funds. In the unlikely event of insolvency, your funds are protected by regulatory compensation schemes.',
      amounts: [
        {flag: '🇬🇧', label: 'FSCS: up to <strong>&pound;85,000</strong>'},
        {flag: '🇪🇺', label: 'ICF: up to <strong>&euro;20,000</strong>'},
        {flag: '🇨🇭', label: 'esisuisse: up to <strong>CHF 100,000</strong>'},
      ],
    },
    footerDesc: 'Your trusted partner for online trading. Access global markets with institutional-grade technology, tight spreads, and award-winning service.',
    footerLicenses: [
      {title: 'FCA (United Kingdom)', text: ' UK Ltd is authorised and regulated by the Financial Conduct Authority. Ref. No. 595450'},
      {title: 'CySEC (European Union)', text: ' EU Ltd is licensed by the Cyprus Securities and Exchange Commission. License No. 201/13'},
      {title: 'DFSA (UAE)', text: ' MENA Ltd is authorised by the Dubai Financial Services Authority. Ref. No. F003484'},
      {title: 'ASIC (Australia)', text: ' AU Pty Ltd is regulated by the Australian Securities &amp; Investments Commission. License No. 443670'},
    ],
    footerRegulatory: [
      '🛡️ FCA Regulated (UK)',
      '🇪🇺 CySEC Licensed (EU)',
      '🇦🇪 DFSA Authorized (UAE)',
      '🇦🇺 ASIC Licensed (AU)',
      '🔒 256-bit SSL Encryption',
      '🏦 Segregated Client Funds',
    ],
    footerPayments: ['💳 Visa', '💳 Mastercard', '🏦 Wire Transfer', 'Skrill', 'Neteller', 'Apple Pay', 'Google Pay'],
    footerAddress: '110 Bishopsgate, London EC2N 4AY, United Kingdom',
    footerPhone: '+44 20 1234 5678',
    footerRisk: 'Risk Warning: Trading in Contracts for Difference (CFDs) carries a high level of risk and may not be suitable for all investors. You could lose more than your initial investment. <strong>Approximately 72% of retail investor accounts lose money when trading CFDs with this provider.</strong> You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Please ensure you fully understand the risks involved and seek independent advice if necessary. Past performance is not indicative of future results.',
    liveActivityMsgs: [
      {flag: '🇬🇧', text: 'A trader in <strong>London</strong> just opened an account'},
      {flag: '🇩🇪', text: '<strong>148 traders</strong> are viewing this page right now'},
      {flag: '🇦🇺', text: 'A trader in <strong>Sydney</strong> deposited $5,000'},
      {flag: '🇺🇸', text: '<strong>2,847 trades</strong> executed in the last hour'},
      {flag: '🇯🇵', text: 'A trader in <strong>Tokyo</strong> just opened an account'},
      {flag: '🇫🇷', text: '<strong>New:</strong> EUR/USD spread at 0.1 pips right now'},
      {flag: '🇸🇬', text: 'A trader in <strong>Singapore</strong> upgraded to VIP'},
    ],
    stickyCTA: 'Open Free Account — Start Trading',
    faqCTA: 'Open Free Account',
    mockupRows: [
      {symbol: 'EUR/USD', price: '1.0842', change: '+0.15%', up: true},
      {symbol: 'GBP/USD', price: '1.2731', change: '-0.08%', up: false},
      {symbol: 'BTC/USD', price: '67,240', change: '+2.34%', up: true},
      {symbol: 'AAPL', price: '189.42', change: '+1.12%', up: true},
    ],
    mockupLabel: 'Trading Platform',
    getPageCTAVerb: (slug: string) => {
      const map: Record<string, string> = {
        'home': 'Join 35M+ Traders Today',
        'platforms': 'Download Platform &amp; Start Trading',
        'account-types': 'Choose Your Account &amp; Start',
        'pricing': 'Open Account — No Hidden Fees',
        'education': 'Start Learning for Free',
        'contact': 'Open Free Account Instead',
      }
      if (slug.startsWith('markets/')) return 'Trade This Market Now'
      return map[slug] || 'Open Free Account'
    },
    getFaqData: () => ({
      home: [
        { q: 'How long does account verification take?', a: 'Most accounts are verified within 24 hours. You&rsquo;ll need to provide a valid ID and proof of address. In many cases, verification is completed in under 1 hour during business hours.' },
        { q: 'What is the minimum deposit?', a: 'The minimum deposit for a Standard account is $100. You can fund your account using credit/debit card, bank wire, or e-wallets like Skrill and Neteller with no deposit fees.' },
        { q: 'Can I withdraw my funds at any time?', a: 'Yes, you can withdraw your funds at any time with no lock-in period. Withdrawal requests are typically processed within 1&ndash;2 business days depending on the payment method.' },
        { q: 'Is my money protected?', a: 'Absolutely. All client funds are held in segregated accounts with tier-1 banks, separate from company funds. We are regulated by the FCA, CySEC, and DFSA, ensuring the highest level of fund protection.' },
        { q: 'What platforms do you support?', a: 'We offer MetaTrader 4, MetaTrader 5, and our proprietary WebTrader platform. All are available on desktop, web, iOS, and Android &mdash; trade anywhere, anytime.' },
        { q: 'Do I need experience to start trading?', a: 'No prior experience is needed. We offer a free $100,000 demo account, educational resources, and 24/5 support to help you learn at your own pace before trading with real money.' },
      ],
      platforms: [
        { q: 'Which trading platform is best for beginners?', a: 'Our WebTrader platform is ideal for beginners &mdash; it runs in your browser with no download required and features an intuitive interface. For more advanced features, MetaTrader 4 is the industry standard.' },
        { q: 'Can I use multiple platforms with one account?', a: 'Yes. Your single trading account works across all our platforms &mdash; MT4, MT5, WebTrader, and our mobile apps. Switch between them seamlessly.' },
        { q: 'Is there a mobile trading app?', a: 'Yes, our mobile apps for iOS and Android give you full trading functionality on the go, including charts, indicators, one-tap trading, and real-time push notifications.' },
        { q: 'Do you offer API access for automated trading?', a: 'Yes. We provide FIX API access for algorithmic traders and institutional clients. MT4/MT5 also support Expert Advisors (EAs) for automated strategies.' },
      ],
      'account-types': [
        { q: 'Which account type should I choose?', a: 'If you&rsquo;re starting out, our Standard account with a $100 minimum deposit is perfect. Active traders benefit from our Professional account with tighter spreads, while high-volume traders should consider VIP for the best conditions.' },
        { q: 'Can I upgrade my account later?', a: 'Yes. You can upgrade your account type at any time as your trading volume grows. Simply contact your account manager or request an upgrade through your dashboard.' },
        { q: 'What&rsquo;s the difference between Standard and Professional accounts?', a: 'Professional accounts offer tighter spreads (from 0.0 pips vs 1.2), priority support, and higher leverage. They require a $1,000 minimum deposit and are suited for experienced traders.' },
        { q: 'Do you offer Islamic (swap-free) accounts?', a: 'Yes. We offer swap-free Islamic accounts compliant with Sharia law, available across all account types. No overnight interest is charged on positions held past market close.' },
      ],
      pricing: [
        { q: 'Are there any hidden fees?', a: 'No. We believe in full transparency. You&rsquo;ll see the exact spread before you trade, and our fee schedule is published on this page. There are no deposit fees, no inactivity fees for the first 12 months, and no platform fees.' },
        { q: 'How are spreads calculated?', a: 'Our spreads are variable and sourced from 15+ tier-1 liquidity providers. We aggregate the best bid/ask prices to deliver the tightest possible spreads, often as low as 0.0 pips on major pairs.' },
        { q: 'Do you charge commission?', a: 'It depends on your account type. Standard accounts have zero commission with spreads from 1.2 pips. Professional and VIP accounts offer raw spreads from 0.0 pips with a small commission per lot.' },
        { q: 'What are swap/overnight fees?', a: 'Swap fees are applied when positions are held overnight and reflect the interest rate differential between the two currencies in a pair. Swap rates are updated daily and displayed in your platform.' },
      ],
      education: [
        { q: 'Is the education content free?', a: 'Yes, all our educational resources are completely free for registered users. This includes video courses, webinars, eBooks, and daily market analysis.' },
        { q: 'Do you offer live webinars?', a: 'Yes. We host weekly live webinars with professional analysts covering market outlook, trading strategies, and platform tutorials. Recordings are available for on-demand viewing.' },
        { q: 'Is the content suitable for complete beginners?', a: 'Absolutely. Our courses are structured from beginner to advanced level. Start with &ldquo;Trading Fundamentals&rdquo; and progress at your own pace through intermediate and advanced modules.' },
        { q: 'Do I get a certificate after completing courses?', a: 'Yes. Upon completing each course module, you receive a digital certificate of completion that you can add to your LinkedIn profile or professional portfolio.' },
      ],
      contact: [
        { q: 'What are your support hours?', a: 'Our support team is available 24 hours a day, 5 days a week (Monday to Friday). We offer support via live chat, email, and phone in 12 languages.' },
        { q: 'How quickly will I get a response?', a: 'Live chat responses are typically instant during business hours. Email inquiries are answered within 4 hours. Phone support connects you to an agent in under 60 seconds on average.' },
        { q: 'Do you offer a dedicated account manager?', a: 'Yes. Professional and VIP account holders receive a dedicated account manager for personalized support, trading insights, and priority assistance.' },
        { q: 'Can I request a callback?', a: 'Yes. Fill out the callback form on our contact page and one of our specialists will call you back at your preferred time, typically within 30 minutes during business hours.' },
      ],
    }),
    marketDropdownIcons: { 'markets/forex': '💱', 'markets/crypto': '₿', 'markets/commodities': '🥇', 'markets/indices': '📊' },
    marketDropdownDescs: { 'markets/forex': '70+ currency pairs', 'markets/crypto': '30+ cryptocurrencies', 'markets/commodities': 'Gold, Oil &amp; Silver', 'markets/indices': '15+ global indices' },
  }

  if (niche === 'crypto_exchange') {
    return {
      heroHeading: 'Trade 600+ Crypto Assets — Spot, Futures &amp; Earn',
      heroBadge: 'The Most Trusted Crypto Exchange',
      heroPills: ['600+ Tokens', 'Spot &amp; Futures', 'Earn up to 12% APY', 'Instant Deposits'],
      heroMicro: ['✓ No minimum deposit', '✓ Bank-grade security', '✓ 24/7 trading'],
      heroTrust: ['SOC 2 Certified', '98% Cold Storage', '600+ Assets', '24/7 Support'],
      heroCTAPrimary: 'Create Free Account — 30 Seconds',
      heroCTASecondary: 'Explore Markets',
      trustpilotScore: '4.7/5',
      trustpilotReviews: '18,200+ Reviews on App Store',
      navSlugs: ['home', 'about', 'spot-trading', 'futures', 'staking', 'fees', 'contact'],
      navCTA: 'Get Started',
      loginLabel: 'Sign In',
      mobileCTA: 'Create Free Account',
      promoHTML: '🔥 <strong>New Listing:</strong> Trade $SOL, $AVAX &amp; $ARB with 0% maker fees for 7 days <a href="#">Start Trading &rarr;</a>',
      announcementHTML: 'Cryptocurrency trading involves significant risk. Prices can fluctuate widely in short periods. You should not invest more than you can afford to lose. Please read our <a href="risk-warning.html">Risk Warning</a> before trading.',
      socialProof: [
        {icon: '⭐', bold: '4.7/5', text: 'App Store'},
        {icon: '👥', bold: '10M+', text: 'Verified Users'},
        {icon: '🔒', bold: 'SOC 2', text: 'Certified'},
        {icon: '🏆', bold: 'Best Exchange', text: '2024'},
        {icon: '📰', bold: 'CoinDesk', text: ', The Block'},
      ],
      tickerItems: [
        {symbol: 'BTC/USDT', price: '68,420', change: '+2.84%', up: true},
        {symbol: 'ETH/USDT', price: '3,580', change: '+1.92%', up: true},
        {symbol: 'SOL/USDT', price: '152.40', change: '+4.15%', up: true},
        {symbol: 'BNB/USDT', price: '612.30', change: '-0.45%', up: false},
        {symbol: 'XRP/USDT', price: '0.6284', change: '+1.12%', up: true},
        {symbol: 'DOGE/USDT', price: '0.1542', change: '+8.34%', up: true},
      ],
      regulationItems: [
        {icon: '🇺🇸', label: 'FinCEN (US)', num: 'MSB Reg. No. 31000184930425'},
        {icon: '🇪🇺', label: 'VASP (EU)', num: 'MiCA Compliant'},
        {icon: '🇦🇺', label: 'AUSTRAC (AU)', num: 'DCE Reg. 100723058'},
        {icon: '🇸🇬', label: 'MAS (SG)', num: 'License Pending'},
        {icon: '🔐', label: 'Proof of Reserves', num: 'Verified by Armanino LLP'},
      ],
      mediaLogos: ['CoinDesk', 'The Block', 'CoinTelegraph', 'TechCrunch', 'Bloomberg', 'Forbes'],
      awards: [
        {icon: '🏆', name: 'Best Crypto Exchange', source: 'CoinDesk Awards', year: '2024'},
        {icon: '⭐', name: 'Best Trading App', source: 'App Store', year: '2024'},
        {icon: '🥇', name: 'Most Secure Exchange', source: 'CER.live', year: '2024'},
        {icon: '📱', name: 'Best Mobile Experience', source: 'The Block', year: '2024'},
        {icon: '💎', name: 'Best Staking Platform', source: 'DeFi Awards', year: '2024'},
        {icon: '🔒', name: 'Top Security Rating', source: 'CoinGecko Trust', year: '2024'},
      ],
      perfMetrics: [
        {value: '<0.01', unit: 's', label: 'Matching Engine'},
        {value: '99.99', unit: '%', label: 'Platform Uptime'},
        {value: '$12', unit: 'B+', label: '24h Trading Volume'},
        {value: '600', unit: '+', label: 'Trading Pairs'},
        {value: '10', unit: 'M+', label: 'Verified Users'},
      ],
      securityBadges: [
        {icon: '🧊', label: '98% Cold', sub: 'Storage'},
        {icon: '🔒', label: 'SOC 2 Type II', sub: 'Certified'},
        {icon: '🐛', label: 'Bug Bounty', sub: 'Program'},
        {icon: '🔐', label: '2FA + Biometric', sub: 'Auth'},
        {icon: '🛡️', label: '$250M Insurance', sub: 'Fund'},
        {icon: '📊', label: 'Proof of', sub: 'Reserves'},
      ],
      fundProtection: {
        icon: '🛡️',
        title: 'Asset Protection',
        text: 'We store 98% of all digital assets in air-gapped cold storage with multi-signature authorization. Our $250M insurance fund covers potential losses from security breaches. All reserves are independently verified through Proof of Reserves.',
        amounts: [
          {flag: '🧊', label: '98% of assets in <strong>Cold Storage</strong>'},
          {flag: '🛡️', label: '<strong>$250M</strong> Insurance Fund'},
          {flag: '📊', label: '1:1 <strong>Proof of Reserves</strong> — verified monthly'},
        ],
      },
      footerDesc: 'The world\'s most trusted cryptocurrency exchange. Trade 600+ digital assets with institutional-grade security, ultra-low fees, and 24/7 support.',
      footerLicenses: [
        {title: 'FinCEN (United States)', text: ' registered as a Money Services Business. MSB Reg. No. 31000184930425'},
        {title: 'VASP (European Union)', text: ' licensed as a Virtual Asset Service Provider under MiCA regulation.'},
        {title: 'AUSTRAC (Australia)', text: ' registered as a Digital Currency Exchange. DCE Reg. 100723058'},
        {title: 'MAS (Singapore)', text: ' licensed under the Payment Services Act for Digital Payment Token services.'},
      ],
      footerRegulatory: [
        '🇺🇸 FinCEN Registered (US)',
        '🇪🇺 MiCA Compliant (EU)',
        '🇦🇺 AUSTRAC Licensed (AU)',
        '🇸🇬 MAS Licensed (SG)',
        '🔐 Proof of Reserves',
        '🧊 98% Cold Storage',
      ],
      footerPayments: ['₿ Bitcoin', 'Ξ Ethereum', '🏦 Wire Transfer', '💳 Visa', '💳 Mastercard', 'Apple Pay', 'Google Pay'],
      footerAddress: 'CryptoVault Global Ltd, One Raffles Quay, #22-01, Singapore 048583',
      footerPhone: '+65 6123 4567',
      footerRisk: 'Risk Warning: Cryptocurrency trading involves substantial risk of loss and is not suitable for every investor. The value of cryptocurrencies can fluctuate widely and you may lose more than your initial investment. Past performance is not indicative of future results. Please ensure you fully understand the risks involved before trading.',
      liveActivityMsgs: [
        {flag: '🇺🇸', text: 'A user in <strong>New York</strong> just bought 0.5 BTC'},
        {flag: '🇰🇷', text: '<strong>2,847 trades</strong> executed in the last minute'},
        {flag: '🇯🇵', text: 'A user in <strong>Tokyo</strong> started earning 6.2% APY on ETH'},
        {flag: '🇬🇧', text: '<strong>$4.2M</strong> in withdrawals processed in the last hour'},
        {flag: '🇸🇬', text: 'A user in <strong>Singapore</strong> just listed a limit order for SOL'},
        {flag: '🇩🇪', text: '<strong>New listing:</strong> $ARB now available for spot trading'},
        {flag: '🇦🇺', text: 'A user in <strong>Sydney</strong> just completed KYC verification'},
      ],
      stickyCTA: 'Create Free Account — Start Trading Crypto',
      faqCTA: 'Create Free Account',
      mockupRows: [
        {symbol: 'BTC/USDT', price: '68,420', change: '+2.84%', up: true},
        {symbol: 'ETH/USDT', price: '3,580.42', change: '+1.92%', up: true},
        {symbol: 'SOL/USDT', price: '152.40', change: '+4.15%', up: true},
        {symbol: 'DOGE/USDT', price: '0.1542', change: '+8.34%', up: true},
      ],
      mockupLabel: 'Exchange',
      getPageCTAVerb: (slug: string) => {
        const map: Record<string, string> = {
          'home': 'Join 10M+ Crypto Traders',
          'spot-trading': 'Start Spot Trading Now',
          'futures': 'Trade Futures with Up to 125x Leverage',
          'staking': 'Start Earning Crypto Today',
          'fees': 'Create Account — Lowest Fees',
          'education': 'Start Learning for Free',
          'contact': 'Create Free Account Instead',
          'tokens': 'Explore All 600+ Tokens',
          'wallet': 'Secure Your Assets Now',
          'api': 'Get API Access — Free',
        }
        if (slug.startsWith('markets')) return 'Trade This Market Now'
        return map[slug] || 'Create Free Account'
      },
      getFaqData: () => ({
        home: [
          { q: 'How do I create an account?', a: 'Creating an account takes less than 30 seconds. Simply enter your email, create a password, and verify your identity. Basic accounts allow instant trading with limits, while full KYC verification unlocks higher limits within 24 hours.' },
          { q: 'What is the minimum deposit?', a: 'There is no minimum deposit for crypto deposits. For fiat deposits, the minimum is $10 via card or $100 via bank transfer. We support 50+ fiat currencies.' },
          { q: 'How do I buy Bitcoin?', a: 'After creating your account and depositing funds, navigate to the BTC/USDT market, enter the amount you want to buy, and click &ldquo;Buy BTC&rdquo;. You can also use our instant buy feature for one-click purchases.' },
          { q: 'Is my crypto safe?', a: 'We store 98% of all digital assets in air-gapped cold storage with multi-signature authorization. Our platform is SOC 2 Type II certified, has a $250M insurance fund, and publishes monthly Proof of Reserves verified by Armanino LLP.' },
          { q: 'What are your trading fees?', a: 'Spot trading fees start at 0.10% for both maker and taker. VIP tiers offer reduced fees down to 0.01% maker / 0.03% taker. Earn further discounts by holding our native token.' },
          { q: 'Can I earn interest on my crypto?', a: 'Yes! Our Earn program offers flexible and locked staking with APY rates up to 12%. Popular options include ETH staking (4-6% APY), SOL staking (5-8% APY), and stablecoin lending (8-12% APY).' },
        ],
        'spot-trading': [
          { q: 'What order types are available?', a: 'We support market orders, limit orders, stop-limit orders, OCO (one-cancels-other), trailing stops, and iceberg orders. Advanced traders can also use our API for algorithmic trading.' },
          { q: 'How many trading pairs are available?', a: 'We offer 600+ trading pairs across BTC, ETH, USDT, USDC, and BUSD markets. New pairs are added weekly based on community votes and listing criteria.' },
          { q: 'What are the fees for spot trading?', a: 'Maker fees start at 0.10% and taker fees at 0.10%. VIP traders (30-day volume &gt; $1M) enjoy reduced rates. You can also pay fees with our native token for an additional 25% discount.' },
          { q: 'Is there a mobile app for trading?', a: 'Yes. Our iOS and Android apps offer full trading functionality including advanced charts, price alerts, one-tap trading, and biometric security. Rated 4.7/5 on the App Store.' },
        ],
        futures: [
          { q: 'What leverage is available?', a: 'Perpetual futures offer up to 125x leverage on BTC and ETH, up to 75x on major altcoins, and up to 25x on newer tokens. We recommend starting with low leverage and using stop-loss orders.' },
          { q: 'What are funding rates?', a: 'Funding rates are exchanged between long and short positions every 8 hours. Positive rates mean longs pay shorts; negative rates mean shorts pay longs. Current rates are displayed on each contract page.' },
          { q: 'How does liquidation work?', a: 'Positions are liquidated when your margin ratio falls below the maintenance margin. We use a tiered liquidation system that partially reduces positions first. An insurance fund helps prevent socialized losses.' },
          { q: 'Can I use futures for hedging?', a: 'Yes. Many traders use our perpetual contracts to hedge their spot positions. You can simultaneously hold long spot and short futures positions to reduce portfolio risk.' },
        ],
        staking: [
          { q: 'What is crypto staking?', a: 'Staking involves locking your cryptocurrency to support network operations (like validating transactions) in exchange for rewards. It&rsquo;s like earning interest on your crypto holdings.' },
          { q: 'What APY rates do you offer?', a: 'Rates vary by asset: ETH 4-6% APY, SOL 5-8% APY, DOT 10-14% APY, ATOM 8-12% APY. Stablecoin lending offers 8-12% APY. Rates are updated in real-time on our Earn page.' },
          { q: 'Can I unstake at any time?', a: 'Flexible staking allows instant withdrawals. Locked staking offers higher rates but requires a commitment period (30, 60, or 90 days). Early withdrawal from locked staking forfeits pending rewards.' },
          { q: 'Is staking risky?', a: 'Staking carries lower risk than trading but still involves market risk (asset value can decline), slashing risk (validator penalties), and smart contract risk. We only support established, audited protocols.' },
        ],
        fees: [
          { q: 'Are there any hidden fees?', a: 'No. All our fees are transparent and published on this page. There are no deposit fees for crypto, no account maintenance fees, and no platform fees. The only fees are trading commissions and network withdrawal fees.' },
          { q: 'How do VIP tiers work?', a: 'VIP tiers are based on your 30-day trading volume. Higher tiers unlock lower fees, priority support, and exclusive features. VIP 1 starts at $1M monthly volume with 0.08% maker / 0.08% taker fees.' },
          { q: 'What are withdrawal fees?', a: 'Withdrawal fees cover blockchain network costs and vary by asset and network. For example, BTC withdrawal costs ~0.0001 BTC, ETH ~0.001 ETH (ERC-20), and USDT as low as $1 (TRC-20).' },
          { q: 'Do you offer fee discounts?', a: 'Yes! Hold our native token for a 25% fee discount. Referral program participants earn 20% of referred users&rsquo; trading fees. VIP market makers can negotiate custom fee structures.' },
        ],
        contact: [
          { q: 'What are your support hours?', a: 'Our support team is available 24 hours a day, 7 days a week. We offer live chat (instant), email support (under 4 hours), and phone support for VIP clients.' },
          { q: 'How do I report a security issue?', a: 'Security issues should be reported through our Bug Bounty program at security@cryptovault.exchange. We offer rewards up to $250,000 for critical vulnerabilities.' },
          { q: 'Do you have a community?', a: 'Yes! Join our Telegram group (500K+ members), Discord server, Twitter, and Reddit community for announcements, trading discussions, and support.' },
          { q: 'How do I reach VIP support?', a: 'VIP account holders (30-day volume &gt; $1M) get a dedicated account manager, priority live chat, and direct phone support. Contact vip@cryptovault.exchange to apply.' },
        ],
      }),
      marketDropdownIcons: { 'spot-trading': '📈', 'futures': '📊', 'staking': '💰', 'tokens': '🪙', 'wallet': '🔐' },
      marketDropdownDescs: { 'spot-trading': '600+ trading pairs', 'futures': 'Up to 125x leverage', 'staking': 'Earn up to 12% APY', 'tokens': '600+ listed tokens', 'wallet': 'Cold storage security' },
    }
  }

  const propTradingContent: NicheContent = {
    heroHeading: 'Get Funded Up to $200K — Keep 90% of Profits',
    heroBadge: 'Trusted by 50,000+ Traders in 190 Countries',
    heroPills: ['Zero Risk Your Capital', 'Up to $200K Funding', '90% Profit Split', 'Instant Payouts'],
    heroMicro: ['✓ Start from $49', '✓ No time limits', '✓ Free retakes'],
    heroTrust: ['50K+ Funded Traders', 'Instant Payouts', '$25M+ Paid Out', '24/7 Support'],
    heroCTAPrimary: 'Start Your Challenge — From $49',
    heroCTASecondary: 'View All Plans',
    trustpilotScore: '4.8/5',
    trustpilotReviews: '8,200+ Reviews on Trustpilot',
    navSlugs: ['home', 'about', 'challenges', 'pricing', 'how-it-works', 'payouts', 'contact'],
    navCTA: 'Get Funded',
    loginLabel: 'Dashboard',
    mobileCTA: 'Start Challenge',
    promoHTML: '🔥 <strong>Flash Sale:</strong> 20% off all challenges this week! Use code TRADE20 <a href="#">Claim Now &rarr;</a>',
    announcementHTML: 'Trading involves risk. Past performance is not indicative of future results. You should only trade with money you can afford to lose. Please read our <a href="risk-warning.html"><strong>Risk Warning</strong></a> before participating.',
    socialProof: [
      {icon: '⭐', bold: '4.8/5', text: 'Trustpilot'},
      {icon: '👥', bold: '50K+', text: 'Funded Traders'},
      {icon: '💰', bold: '$25M+', text: 'Paid Out'},
      {icon: '🏆', bold: '#1 Prop Firm', text: '2024'},
      {icon: '🌍', bold: '190+', text: 'Countries'},
    ],
    tickerItems: [
      {symbol: 'EUR/USD', price: '1.0842', change: '+0.15%', up: true},
      {symbol: 'GBP/USD', price: '1.2731', change: '-0.08%', up: false},
      {symbol: 'Gold', price: '2,342.50', change: '+0.42%', up: true},
      {symbol: 'NAS100', price: '18,234', change: '+1.24%', up: true},
      {symbol: 'BTC/USD', price: '67,240', change: '+2.34%', up: true},
      {symbol: 'US30', price: '39,120', change: '+0.38%', up: true},
    ],
    regulationItems: [
      {icon: '🇬🇧', label: 'UK Registered', num: 'Company No. 14523890'},
      {icon: '🇺🇸', label: 'US Compliant', num: 'NFA Exempt'},
      {icon: '🇪🇺', label: 'EU Registered', num: 'VAT: EU372891045'},
      {icon: '🛡️', label: 'Insured Payouts', num: "Lloyd's of London"},
      {icon: '✅', label: 'Verified Payouts', num: 'Blockchain Verified'},
    ],
    mediaLogos: ['Forbes', 'Bloomberg', 'Entrepreneur', 'Business Insider', 'Yahoo Finance', 'TechCrunch'],
    awards: [
      {icon: '🏆', name: 'Best Prop Firm', source: 'Prop Firm Awards', year: '2024'},
      {icon: '⭐', name: 'Most Innovative', source: 'FinTech Awards', year: '2024'},
      {icon: '🥇', name: 'Best Payouts', source: 'Traders Union', year: '2024'},
      {icon: '📱', name: 'Best Dashboard', source: 'UX Design Awards', year: '2024'},
      {icon: '🎓', name: 'Best Education', source: 'Trading Education', year: '2024'},
      {icon: '💎', name: 'Most Trusted', source: 'TrustRadius', year: '2024'},
    ],
    perfMetrics: [
      {value: '50', unit: 'K+', label: 'Funded Traders'},
      {value: '99.2', unit: '%', label: 'Payout Rate'},
      {value: '$25', unit: 'M+', label: 'Total Paid Out'},
      {value: '4.2', unit: 'hrs', label: 'Avg. Payout Time'},
      {value: '190', unit: '+', label: 'Countries'},
    ],
    securityBadges: [
      {icon: '🔒', label: '256-bit SSL', sub: 'Encryption'},
      {icon: '💳', label: 'Secure Payments', sub: 'PCI Compliant'},
      {icon: '🛡️', label: 'Insured Payouts', sub: "Lloyd's Backed"},
      {icon: '📋', label: 'Verified', sub: 'Blockchain Proof'},
      {icon: '🔐', label: '2FA', sub: 'Authentication'},
      {icon: '📊', label: 'Real-Time', sub: 'Monitoring'},
    ],
    fundProtection: {
      icon: '💰',
      title: 'Payout Protection Guarantee',
      text: "All trader payouts are backed by Lloyd's of London insurance and processed within 24 hours. We've never missed a payout in our history. Your earnings are guaranteed and verifiable on-chain.",
      amounts: [
        {flag: '💵', label: 'Standard: up to <strong>$10,000</strong> per payout'},
        {flag: '💎', label: 'Pro: up to <strong>$50,000</strong> per payout'},
        {flag: '🏆', label: 'Elite: up to <strong>$200,000</strong> per payout'},
      ],
    },
    footerDesc: "The world's most trusted prop trading firm. Get funded up to $200K, keep 90% of profits, and join a community of 50,000+ successful traders.",
    footerLicenses: [
      {title: 'United Kingdom', text: ' Ltd is registered in England and Wales. Company No. 14523890'},
      {title: 'United States', text: ' LLC is registered in Delaware. NFA Exempt.'},
      {title: 'European Union', text: ' EU is registered under EU business regulations. VAT: EU372891045'},
      {title: 'Insurance', text: " payouts are insured by Lloyd's of London syndicate."},
    ],
    footerRegulatory: [
      '🇬🇧 UK Registered',
      '🇺🇸 US Compliant',
      '🇪🇺 EU Registered',
      '🛡️ Insured Payouts',
      '✅ Verified Payouts',
      '📊 Live Tracking',
    ],
    footerPayments: ['💳 Visa', '💳 Mastercard', '🏦 Wire Transfer', '₿ Bitcoin', 'Ξ Ethereum', '📱 Apple Pay', '📱 Google Pay'],
    footerAddress: 'One Canada Square, Canary Wharf, London E14 5AB, United Kingdom',
    footerPhone: '+44 20 7946 0958',
    footerRisk: "Risk Warning: Trading involves significant risk of loss. Past performance is not indicative of future results. You should not trade with money you cannot afford to lose.",
    liveActivityMsgs: [
      {flag: '🇺🇸', text: 'A trader in <strong>New York</strong> just passed the Challenge'},
      {flag: '🇬🇧', text: 'A trader in <strong>London</strong> received a <strong>$12,400</strong> payout'},
      {flag: '🇩🇪', text: '<strong>2,847</strong> traders active right now'},
      {flag: '🇯🇵', text: 'A trader in <strong>Tokyo</strong> got funded for <strong>$100K</strong>'},
      {flag: '🇦🇺', text: 'A trader in <strong>Sydney</strong> just started a Challenge'},
      {flag: '🇧🇷', text: 'A trader in <strong>São Paulo</strong> hit <strong>$50K</strong> profit target'},
      {flag: '🇮🇳', text: '<strong>148 traders</strong> passed this week'},
      {flag: '🇳🇬', text: 'A trader in <strong>Lagos</strong> received instant payout'},
    ],
    stickyCTA: 'Get Funded Now',
    faqCTA: 'Start Your Challenge',
    mockupRows: [
      {symbol: 'EUR/USD', price: '+$2,340', change: '+4.2%', up: true},
      {symbol: 'Gold', price: '+$1,850', change: '+3.1%', up: true},
      {symbol: 'NAS100', price: '-$420', change: '-1.2%', up: false},
      {symbol: 'GBP/JPY', price: '+$960', change: '+2.8%', up: true},
    ],
    mockupLabel: 'Trading Dashboard',
    getPageCTAVerb: (slug: string) => {
      const map: Record<string, string> = {
        home: 'Start Your Challenge',
        about: 'Join Our Community',
        challenges: 'Choose Your Challenge',
        pricing: 'Get Funded Today',
        'how-it-works': 'Begin Your Journey',
        payouts: 'Start Earning',
        contact: 'Get in Touch',
      }
      return map[slug] || 'Get Funded Now'
    },
    getFaqData: () => ({
      home: [
        {q: 'What is prop trading?', a: "Prop trading (proprietary trading) means trading with a firm's capital instead of your own. You prove your skills through a challenge, get funded with up to $200K, and keep up to 90% of the profits you generate."},
        {q: 'How much does it cost to start?', a: "Challenges start from just $49 for a $10K account. We offer accounts from $10K to $200K with various challenge options. All plans include free retakes if you don't pass on your first attempt."},
        {q: 'How fast are payouts processed?', a: "Payouts are processed within 24 hours on average. We support bank transfers, crypto (BTC/ETH), and digital wallets. All payouts are insured by Lloyd's of London."},
        {q: 'Is there a time limit to pass the challenge?', a: 'No! Unlike other prop firms, we have no time limits on any of our challenges. Take as long as you need to reach the profit target while respecting the drawdown rules.'},
        {q: 'Can I trade any instrument?', a: 'Yes! Trade Forex, Indices, Commodities, Crypto, and Stocks. We provide access to 200+ instruments on MetaTrader 4, MetaTrader 5, and our proprietary platform.'},
        {q: 'What happens if I fail the challenge?', a: "Don't worry — all our plans include free retakes. If you fail, you can restart the challenge at no extra cost. We believe in giving traders every opportunity to succeed."},
      ],
    }),
    marketDropdownIcons: {
      'challenges': '🎯',
      'how-it-works': '📋',
      'payouts': '💰',
      'leaderboard': '🏆',
    },
    marketDropdownDescs: {
      'challenges': 'Choose your funded account size',
      'how-it-works': 'Simple 3-step process',
      'payouts': 'Fast & insured withdrawals',
      'leaderboard': 'Top performing traders',
    },
  }

  const copyTradingContent: NicheContent = {
    heroHeading: 'Copy Top Traders — Earn While They Trade',
    heroBadge: 'The #1 Social Trading Network',
    heroPills: ['Copy with 1 Click', 'Top Trader Rankings', '2M+ Community', 'From $50'],
    heroMicro: ['✓ Free to join', '✓ Copy any trader', '✓ Full control'],
    heroTrust: ['2M+ Traders', 'FCA Regulated', '$4B+ Copied', '24/7 Support'],
    heroCTAPrimary: 'JOIN FREE — START COPYING',
    heroCTASecondary: 'EXPLORE TOP TRADERS',
    trustpilotScore: '4.7/5',
    trustpilotReviews: '15,600+ Reviews on Trustpilot',
    navSlugs: ['home', 'about', 'top-traders', 'how-it-works', 'pricing', 'community', 'contact'],
    navCTA: 'Start Copying',
    loginLabel: 'Log In',
    mobileCTA: 'Join Free',
    promoHTML: '🚀 <strong>New:</strong> Copy the top 100 traders for FREE this month — no minimum deposit! <a href="#">Join Now &rarr;</a>',
    announcementHTML: 'Copy trading involves risk. Past performance of traders is not indicative of future results. You should consider whether you can afford to take the high risk of losing your money. <a href="risk-warning.html"><strong>Read Risk Warning</strong></a>.',
    socialProof: [
      {icon: '⭐', bold: '4.7/5', text: 'Trustpilot'},
      {icon: '👥', bold: '2M+', text: 'Community'},
      {icon: '💰', bold: '$4B+', text: 'Copied'},
      {icon: '🏆', bold: '#1 Social', text: 'Platform'},
      {icon: '🌍', bold: '150+', text: 'Countries'},
    ],
    tickerItems: [
      {symbol: 'BTC/USD', price: '67,240', change: '+2.34%', up: true},
      {symbol: 'AAPL', price: '189.42', change: '+1.12%', up: true},
      {symbol: 'EUR/USD', price: '1.0842', change: '+0.15%', up: true},
      {symbol: 'TSLA', price: '248.50', change: '-0.85%', up: false},
      {symbol: 'Gold', price: '2,342.50', change: '+0.42%', up: true},
      {symbol: 'ETH/USD', price: '3,480', change: '+3.12%', up: true},
    ],
    regulationItems: [
      {icon: '🇬🇧', label: 'FCA (UK)', num: 'Ref. No. 583263'},
      {icon: '🇪🇺', label: 'CySEC (EU)', num: 'License No. 250/14'},
      {icon: '🇦🇺', label: 'ASIC (AU)', num: 'License No. 491139'},
      {icon: '🛡️', label: 'Segregated Funds', num: 'Tier-1 Banks'},
      {icon: '✅', label: 'Investor Protection', num: 'ICF &amp; FSCS'},
    ],
    mediaLogos: ['Forbes', 'TechCrunch', 'Bloomberg', 'Business Insider', 'CNBC', 'The Verge'],
    awards: [
      {icon: '🏆', name: 'Best Social Trading', source: 'FinTech Awards', year: '2024'},
      {icon: '⭐', name: 'Best Copy Platform', source: 'ForexBrokers.com', year: '2024'},
      {icon: '🥇', name: 'Most Innovative', source: 'Finance Magnates', year: '2024'},
      {icon: '📱', name: 'Best Mobile App', source: 'App Store Awards', year: '2024'},
      {icon: '👥', name: 'Best Community', source: 'Social Trading Hub', year: '2024'},
      {icon: '💎', name: 'Most Trusted', source: 'BrokerChooser', year: '2024'},
    ],
    perfMetrics: [
      {value: '2', unit: 'M+', label: 'Active Traders'},
      {value: '$4.2', unit: 'B+', label: 'Total Copied'},
      {value: '89', unit: '%', label: 'Satisfaction Rate'},
      {value: '150', unit: '+', label: 'Countries'},
      {value: '500', unit: 'K+', label: 'Copiers Monthly'},
    ],
    securityBadges: [
      {icon: '🔒', label: '256-bit SSL', sub: 'Encryption'},
      {icon: '🏦', label: 'Segregated', sub: 'Client Funds'},
      {icon: '🛡️', label: 'Negative Balance', sub: 'Protection'},
      {icon: '📋', label: 'FCA Regulated', sub: 'UK Authority'},
      {icon: '💳', label: 'PCI DSS', sub: 'Compliant'},
      {icon: '🔐', label: '2FA', sub: 'Authentication'},
    ],
    fundProtection: {
      icon: '🛡️',
      title: 'Copier Fund Protection',
      text: 'All copier funds are held in segregated accounts with tier-1 banks. You maintain full control — pause, stop, or adjust any copy relationship at any time. Your capital is protected by regulatory compensation schemes.',
      amounts: [
        {flag: '🇬🇧', label: 'FSCS: up to <strong>&pound;85,000</strong>'},
        {flag: '🇪🇺', label: 'ICF: up to <strong>&euro;20,000</strong>'},
        {flag: '🇦🇺', label: 'ASIC: up to <strong>AUD 250,000</strong>'},
      ],
    },
    footerDesc: 'The world\'s leading social trading network. Copy top-performing traders with one click and earn while they trade. Join 2M+ traders in 150+ countries.',
    footerLicenses: [
      {title: 'FCA (United Kingdom)', text: ' UK Ltd is authorised and regulated by the Financial Conduct Authority. Ref. No. 583263'},
      {title: 'CySEC (European Union)', text: ' EU Ltd is licensed by the Cyprus Securities and Exchange Commission. License No. 250/14'},
      {title: 'ASIC (Australia)', text: ' AU Pty Ltd is regulated by the Australian Securities &amp; Investments Commission. License No. 491139'},
      {title: 'Investor Protection', text: ' clients are protected by the ICF (EU) and FSCS (UK) compensation schemes.'},
    ],
    footerRegulatory: [
      '🇬🇧 FCA Regulated',
      '🇪🇺 CySEC Licensed',
      '🇦🇺 ASIC Regulated',
      '🛡️ Segregated Funds',
      '✅ Investor Protection',
      '🔒 SSL Encrypted',
    ],
    footerPayments: ['💳 Visa', '💳 Mastercard', '🏦 Wire Transfer', '📱 Apple Pay', '📱 Google Pay', '₿ Bitcoin', 'Ξ Ethereum'],
    footerAddress: '7 Harp Lane, London EC3R 6DP, United Kingdom',
    footerPhone: '+44 20 3868 0432',
    footerRisk: 'Risk Warning: Copy trading does not amount to investment advice. The value of your investments may go up or down. Your capital is at risk. Past performance is not indicative of future results.',
    liveActivityMsgs: [
      {flag: '🇺🇸', text: 'A trader in <strong>New York</strong> just copied @TraderMax'},
      {flag: '🇬🇧', text: '<strong>$24,500</strong> copied in the last hour'},
      {flag: '🇩🇪', text: '<strong>4,218</strong> copiers online right now'},
      {flag: '🇯🇵', text: 'A trader in <strong>Tokyo</strong> earned <strong>$1,840</strong> from copies'},
      {flag: '🇦🇺', text: 'A trader in <strong>Sydney</strong> just started copying'},
      {flag: '🇧🇷', text: '@CryptoQueen gained <strong>248 new copiers</strong> today'},
      {flag: '🇮🇳', text: '<strong>$180K+</strong> profits distributed today'},
      {flag: '🇳🇬', text: 'A trader in <strong>Lagos</strong> joined the community'},
    ],
    stickyCTA: 'Start Copying Free',
    faqCTA: 'Join the Community',
    mockupRows: [
      {symbol: '@TraderMax', price: '+42.3%', change: '12.4K copiers', up: true},
      {symbol: '@CryptoQueen', price: '+38.7%', change: '8.2K copiers', up: true},
      {symbol: '@ForexPro', price: '+31.2%', change: '6.1K copiers', up: true},
      {symbol: '@IndexQueen', price: '+27.5%', change: '4.8K copiers', up: true},
    ],
    mockupLabel: 'Top Traders',
    getPageCTAVerb: (slug: string) => {
      const map: Record<string, string> = {
        home: 'Start Copying Free',
        about: 'Join Our Community',
        'top-traders': 'Copy Top Traders',
        'how-it-works': 'Get Started Now',
        pricing: 'Join Free Today',
        community: 'Join the Community',
        contact: 'Get in Touch',
        strategies: 'Explore Strategies',
      }
      return map[slug] || 'Start Copying Free'
    },
    getFaqData: () => ({
      home: [
        {q: 'What is copy trading?', a: 'Copy trading lets you automatically replicate the trades of experienced traders in real time. When they trade, you trade — proportionally to your allocated funds. No trading experience needed.'},
        {q: 'How much do I need to start?', a: 'You can start copying traders from just $50. There are no platform fees — you only pay the standard trading spreads. Joining the community is completely free.'},
        {q: 'How do I choose which traders to copy?', a: 'Browse our Top Traders leaderboard, filtered by return, risk score, number of copiers, and trading history. Each trader has a detailed profile with full performance statistics.'},
        {q: 'Can I stop copying at any time?', a: 'Absolutely! You have full control. Pause, stop, or adjust your copy amount at any time. You can also set stop-loss limits on any copy relationship to manage your risk.'},
        {q: 'Is my money safe?', a: 'Yes. We are regulated by the FCA (UK), CySEC (EU), and ASIC (Australia). All client funds are held in segregated accounts with tier-1 banks, and you are protected by investor compensation schemes.'},
        {q: 'Do I need trading experience?', a: "Not at all! That's the beauty of copy trading. You benefit from the expertise of professional traders. However, we recommend learning the basics through our free educational resources."},
      ],
    }),
    marketDropdownIcons: {
      'top-traders': '🏆',
      'strategies': '📊',
      'community': '👥',
    },
    marketDropdownDescs: {
      'top-traders': 'Browse & copy top performers',
      'strategies': 'Pre-built trading strategies',
      'community': 'Connect with 2M+ traders',
    },
  }

  if (niche === 'copy_trading') return copyTradingContent
  if (niche === 'prop_trading') return propTradingContent
  return forexContent
}

// ─── Hero config per page ──────────────────────────────
interface HeroConfig {
  variant: 'platform' | 'market' | 'corporate' | 'tools' | 'legal'
  badge: string
  showMockup: boolean
  visual?: string // custom HTML for right side
  pills?: string[] // Plus500-style feature pills
}

function getHeroConfig(slug: string, niche: string = 'forex_broker', n?: NicheContent): HeroConfig {
  // Crypto exchange niche
  if (niche === 'crypto_exchange' && n) {
    if (slug === 'home') return { variant: 'platform', badge: n.heroBadge, showMockup: true, pills: n.heroPills }
    if (slug === 'spot-trading') return { variant: 'tools', badge: 'Spot Trading', showMockup: false, visual: getToolsVisual('pricing'), pills: ['600+ Pairs', 'Lowest Fees', 'Instant Settlement'] }
    if (slug === 'futures') return { variant: 'tools', badge: 'Crypto Futures', showMockup: false, visual: getToolsVisual('platforms'), pills: ['Up to 125x Leverage', 'Perpetual Contracts', 'Real-Time Funding'] }
    if (slug === 'staking') return { variant: 'tools', badge: 'Earn Crypto', showMockup: false, visual: getToolsVisual('education'), pills: ['Up to 12% APY', 'Flexible &amp; Locked', '30+ Assets'] }
    if (slug === 'tokens') return { variant: 'tools', badge: 'Listed Tokens', showMockup: false, visual: getToolsVisual('platforms'), pills: ['600+ Tokens', 'New Listings Weekly', 'Community Voted'] }
    if (slug === 'wallet') return { variant: 'tools', badge: 'Secure Wallet', showMockup: false, visual: getToolsVisual('contact'), pills: ['98% Cold Storage', 'Multi-Sig', '$250M Insurance'] }
    if (slug === 'fees') return { variant: 'tools', badge: 'Fee Schedule', showMockup: false, visual: getToolsVisual('pricing'), pills: ['Lowest Fees', 'VIP Tiers', 'Token Discounts'] }
    if (['about', 'regulation', 'partners'].includes(slug)) return { variant: 'corporate', badge: slug === 'about' ? 'About Our Exchange' : slug === 'regulation' ? 'Compliance &amp; Licenses' : 'Partnership Programme', showMockup: false }
    if (['terms', 'privacy', 'risk-disclosure', 'risk-warning'].includes(slug)) return { variant: 'legal', badge: '', showMockup: false }
    if (slug === 'contact') return { variant: 'tools', badge: 'Get In Touch', showMockup: false, visual: getToolsVisual('contact'), pills: ['24/7 Live Support', 'Live Chat', 'Email Support'] }
    if (slug === 'education') return { variant: 'tools', badge: 'Learn Crypto', showMockup: false, visual: getToolsVisual('education'), pills: ['Free Courses', 'Trading Guides', 'Video Tutorials'] }
  }

  // Prop trading niche
  if (niche === 'prop_trading' && n) {
    if (slug === 'home') return { variant: 'platform', badge: n.heroBadge, showMockup: true, pills: n.heroPills }
    if (slug === 'challenges') return { variant: 'tools', badge: 'Trading Challenges', showMockup: false, visual: getToolsVisual('account-types'), pills: ['$10K to $200K', '90% Profit Split', 'Free Retakes'] }
    if (slug === 'how-it-works') return { variant: 'tools', badge: 'How It Works', showMockup: false, visual: getToolsVisual('education'), pills: ['3 Simple Steps', 'No Time Limits', 'Get Funded Fast'] }
    if (slug === 'payouts') return { variant: 'tools', badge: 'Payouts', showMockup: false, visual: getToolsVisual('pricing'), pills: ['Instant Payouts', "Lloyd's Insured", 'Crypto & Bank'] }
    if (slug === 'pricing') return { variant: 'tools', badge: 'Challenge Plans', showMockup: false, visual: getToolsVisual('pricing'), pills: ['From $49', 'All Account Sizes', 'No Hidden Fees'] }
    if (['about', 'regulation', 'partners'].includes(slug)) return { variant: 'corporate', badge: slug === 'about' ? 'About Us' : slug === 'regulation' ? 'Compliance' : 'Partners', showMockup: false }
    if (['terms', 'privacy', 'risk-disclosure', 'risk-warning'].includes(slug)) return { variant: 'legal', badge: '', showMockup: false }
    if (slug === 'contact') return { variant: 'tools', badge: 'Get In Touch', showMockup: false, visual: getToolsVisual('contact'), pills: ['24/7 Support', 'Live Chat', 'Discord Community'] }
  }

  // Copy trading niche
  if (niche === 'copy_trading' && n) {
    if (slug === 'home') return { variant: 'platform', badge: n.heroBadge, showMockup: true, pills: n.heroPills }
    if (slug === 'top-traders') return { variant: 'tools', badge: 'Top Traders Leaderboard', showMockup: false, visual: getToolsVisual('account-types'), pills: ['Ranked by ROI', 'Verified Stats', 'Copy with 1 Click'] }
    if (slug === 'how-it-works') return { variant: 'tools', badge: 'How Copy Trading Works', showMockup: false, visual: getToolsVisual('education'), pills: ['3 Simple Steps', 'No Experience Needed', 'Full Control'] }
    if (slug === 'community') return { variant: 'tools', badge: 'Join the Community', showMockup: false, visual: getToolsVisual('contact'), pills: ['2M+ Members', 'Social Feed', 'Live Discussions'] }
    if (slug === 'strategies') return { variant: 'tools', badge: 'Copy Strategies', showMockup: false, visual: getToolsVisual('platforms'), pills: ['Pre-Built Portfolios', 'Auto-Rebalance', 'Risk Managed'] }
    if (slug === 'pricing') return { variant: 'tools', badge: 'Simple Pricing', showMockup: false, visual: getToolsVisual('pricing'), pills: ['No Platform Fees', 'Free to Join', 'Low Spreads'] }
    if (['about', 'regulation', 'partners'].includes(slug)) return { variant: 'corporate', badge: slug === 'about' ? 'About SocialTrade' : slug === 'regulation' ? 'Regulation &amp; Trust' : 'Partner With Us', showMockup: false }
    if (['terms', 'privacy', 'risk-disclosure', 'risk-warning'].includes(slug)) return { variant: 'legal', badge: '', showMockup: false }
    if (slug === 'contact') return { variant: 'tools', badge: 'Get In Touch', showMockup: false, visual: getToolsVisual('contact'), pills: ['24/7 Live Support', 'Live Chat', 'Community Forum'] }
  }

  // Homepage — full platform mockup
  if (slug === 'home') return { variant: 'platform', badge: n ? n.heroBadge : 'Established &amp; Regulated since 2018', showMockup: true, pills: n ? n.heroPills : ['Free Demo Account', 'No Platform Fees', '0.0 Pip Spreads', 'Ultra-Fast Execution'] }

  // Market pages — unique market visuals
  if (slug === 'markets/forex') return { variant: 'market', badge: 'Live Forex Markets', showMockup: false, visual: getMarketVisual('forex'), pills: ['50+ Currency Pairs', 'Spreads from 0.0', '24/5 Trading'] }
  if (slug === 'markets/crypto') return { variant: 'market', badge: 'Live Crypto Markets', showMockup: false, visual: getMarketVisual('crypto'), pills: ['30+ Cryptocurrencies', 'Up to 1:20 Leverage', '24/7 Trading'] }
  if (slug === 'markets/commodities') return { variant: 'market', badge: 'Live Commodity Markets', showMockup: false, visual: getMarketVisual('commodities'), pills: ['Gold, Oil &amp; Silver', 'Low Commissions', 'Deep Liquidity'] }
  if (slug === 'markets/indices') return { variant: 'market', badge: 'Live Index Markets', showMockup: false, visual: getMarketVisual('indices'), pills: ['15+ Global Indices', 'Tight Spreads', 'No Hidden Fees'] }

  // Corporate pages — centered gradient
  if (['about', 'regulation', 'partners'].includes(slug)) return { variant: 'corporate', badge: slug === 'about' ? 'About Our Company' : slug === 'regulation' ? 'Regulatory Framework' : 'Partnership Programme', showMockup: false }

  // Legal pages — minimal
  if (['terms', 'privacy', 'risk-disclosure', 'risk-warning'].includes(slug)) return { variant: 'legal', badge: '', showMockup: false }

  // Tools/service pages — with unique visuals
  const toolsConfig: Record<string, { badge: string; pills: string[]; visual: string }> = {
    'platforms': { badge: 'Trading Technology', pills: ['MetaTrader 4 &amp; 5', 'WebTrader', 'Mobile Apps'], visual: getToolsVisual('platforms') },
    'account-types': { badge: 'Compare Accounts', pills: ['Standard', 'Professional', 'VIP'], visual: getToolsVisual('account-types') },
    'pricing': { badge: 'Transparent Pricing', pills: ['No Hidden Fees', 'Low Commissions', 'Tight Spreads'], visual: getToolsVisual('pricing') },
    'education': { badge: 'Learning Centre', pills: ['Free Courses', 'Live Webinars', '150+ Videos'], visual: getToolsVisual('education') },
    'analysis': { badge: 'Market Intelligence', pills: ['Daily Analysis', 'Economic Calendar', 'Trading Signals'], visual: getToolsVisual('analysis') },
    'contact': { badge: 'Get In Touch', pills: ['24/5 Live Support', 'Live Chat', 'Email Support'], visual: getToolsVisual('contact') },
    'faq': { badge: 'Help Centre', pills: ['Quick Answers', 'Account Help', 'Trading Guide'], visual: getToolsVisual('faq') },
    'promotions': { badge: 'Special Offers', pills: ['Welcome Bonus', 'Referral Rewards'], visual: getToolsVisual('promotions') },
  }
  const cfg = toolsConfig[slug]
  if (cfg) return { variant: 'tools', badge: cfg.badge, showMockup: false, visual: cfg.visual, pills: cfg.pills }
  return { variant: 'tools', badge: '', showMockup: false }
}

// ─── Tools page visuals (unique SVG per page) ──────────
function getToolsVisual(slug: string): string {
  switch (slug) {
    case 'platforms': return `<div class="tools-visual">
      <div class="tv-device tv-laptop">
        <div class="tv-screen">
          <div class="tv-toolbar"><span></span><span></span><span></span></div>
          <div class="tv-chart-area">
            <svg viewBox="0 0 200 60" preserveAspectRatio="none" class="tv-chart-svg">
              <defs><linearGradient id="tvGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0.2"/><stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0"/></linearGradient></defs>
              <polyline points="0,45 20,40 40,42 60,30 80,35 100,20 120,25 140,15 160,18 180,8 200,12" fill="none" stroke="var(--color-accent)" stroke-width="2"/>
              <polygon points="0,45 20,40 40,42 60,30 80,35 100,20 120,25 140,15 160,18 180,8 200,12 200,60 0,60" fill="url(#tvGrad)"/>
            </svg>
          </div>
          <div class="tv-rows"><div class="tv-row"></div><div class="tv-row"></div><div class="tv-row"></div></div>
        </div>
      </div>
      <div class="tv-device tv-phone">
        <div class="tv-phone-notch"></div>
        <div class="tv-phone-screen">
          <div class="tv-phone-balance">$12,840</div>
          <svg viewBox="0 0 80 30" preserveAspectRatio="none" class="tv-phone-chart">
            <polyline points="0,22 10,18 20,20 30,12 40,15 50,8 60,10 70,5 80,7" fill="none" stroke="#10b981" stroke-width="1.5"/>
          </svg>
        </div>
      </div>
    </div>`
    case 'account-types': return `<div class="tools-visual">
      <div class="tv-tier-cards">
        <div class="tv-tier"><div class="tv-tier-name">Standard</div><div class="tv-tier-price">$100</div><div class="tv-tier-feat">1.2 pip spreads</div><div class="tv-tier-feat">200+ instruments</div></div>
        <div class="tv-tier tv-tier-hl"><div class="tv-tier-badge">Popular</div><div class="tv-tier-name">Professional</div><div class="tv-tier-price">$1,000</div><div class="tv-tier-feat">0.6 pip spreads</div><div class="tv-tier-feat">Priority support</div></div>
        <div class="tv-tier"><div class="tv-tier-name">VIP</div><div class="tv-tier-price">$25,000</div><div class="tv-tier-feat">0.0 pip spreads</div><div class="tv-tier-feat">Dedicated manager</div></div>
      </div>
    </div>`
    case 'pricing': return `<div class="tools-visual">
      <div class="tv-spread-card">
        <div class="tv-spread-header">EUR/USD Live Spread</div>
        <div class="tv-spread-row"><span class="tv-bid">BID</span><span class="tv-spread-price">1.0840</span></div>
        <div class="tv-spread-row"><span class="tv-ask">ASK</span><span class="tv-spread-price">1.0842</span></div>
        <div class="tv-spread-val">Spread: <strong>0.2 pips</strong></div>
        <svg viewBox="0 0 160 40" preserveAspectRatio="none" class="tv-spread-chart">
          <polyline points="0,20 15,18 30,22 45,16 60,19 75,14 90,17 105,12 120,15 135,10 160,13" fill="none" stroke="var(--color-accent)" stroke-width="1.5" opacity=".6"/>
          <polyline points="0,24 15,22 30,26 45,20 60,23 75,18 90,21 105,16 120,19 135,14 160,17" fill="none" stroke="#10b981" stroke-width="1.5" opacity=".6"/>
        </svg>
      </div>
    </div>`
    case 'education': return `<div class="tools-visual">
      <div class="tv-edu-card">
        <div class="tv-edu-icon">🎓</div>
        <div class="tv-edu-title">Trading Courses</div>
        <div class="tv-edu-progress"><div class="tv-edu-bar" style="width:85%"></div><span>Beginner — 85%</span></div>
        <div class="tv-edu-progress"><div class="tv-edu-bar" style="width:60%"></div><span>Intermediate — 60%</span></div>
        <div class="tv-edu-progress"><div class="tv-edu-bar" style="width:25%"></div><span>Advanced — 25%</span></div>
        <div class="tv-edu-stats"><span>150+ Videos</span><span>12 Courses</span><span>Free</span></div>
      </div>
    </div>`
    case 'contact': return `<div class="tools-visual">
      <div class="tv-contact-card">
        <div class="tv-contact-icon">💬</div>
        <div class="tv-contact-title">We're here to help</div>
        <div class="tv-contact-methods">
          <div class="tv-contact-method"><span>📧</span> Email Support</div>
          <div class="tv-contact-method"><span>💬</span> Live Chat</div>
          <div class="tv-contact-method"><span>📞</span> Phone Support</div>
        </div>
        <div class="tv-contact-hours">24/5 Support Available</div>
      </div>
    </div>`
    default: return `<div class="tools-visual">
      <div class="tv-generic-card">
        <svg viewBox="0 0 120 80" class="tv-generic-icon"><rect x="10" y="10" width="100" height="60" rx="8" fill="none" stroke="var(--color-accent)" stroke-width="1.5" opacity=".3"/><polyline points="20,55 40,40 60,48 80,25 100,32" fill="none" stroke="var(--color-accent)" stroke-width="2"/></svg>
      </div>
    </div>`
  }
}

function getMarketVisual(market: string): string {
  const cards: Record<string, Array<{ symbol: string; name: string; price: string; change: string; up: boolean }>> = {
    forex: [
      { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: '1.0842', change: '+0.15%', up: true },
      { symbol: 'GBP/JPY', name: 'Pound / Yen', price: '191.34', change: '-0.22%', up: false },
      { symbol: 'USD/CHF', name: 'Dollar / Franc', price: '0.8821', change: '+0.08%', up: true },
    ],
    crypto: [
      { symbol: 'BTC', name: 'Bitcoin', price: '$67,240', change: '+2.34%', up: true },
      { symbol: 'ETH', name: 'Ethereum', price: '$3,482', change: '+1.87%', up: true },
      { symbol: 'SOL', name: 'Solana', price: '$148.20', change: '-0.95%', up: false },
    ],
    commodities: [
      { symbol: 'XAU', name: 'Gold', price: '$2,342', change: '+0.42%', up: true },
      { symbol: 'WTI', name: 'Crude Oil', price: '$78.54', change: '-1.12%', up: false },
      { symbol: 'XAG', name: 'Silver', price: '$27.84', change: '+0.68%', up: true },
    ],
    indices: [
      { symbol: 'SPX', name: 'S&P 500', price: '5,234', change: '+0.52%', up: true },
      { symbol: 'NDX', name: 'NASDAQ 100', price: '18,420', change: '+0.78%', up: true },
      { symbol: 'FTSE', name: 'FTSE 100', price: '8,142', change: '-0.15%', up: false },
    ],
  }
  const items = cards[market] || cards.forex
  const sparkPaths = [
    'M0,20 L8,18 16,22 24,15 32,17 40,10 48,12 56,6 64,8',
    'M0,10 L8,14 16,8 24,16 32,20 40,18 48,22 56,19 64,24',
    'M0,16 L8,12 16,18 24,10 32,14 40,8 48,12 56,5 64,3',
  ]
  return `<div class="market-cards">${items.map((item, i) => `
        <div class="market-card">
          <div class="market-card-top">
            <span class="market-card-symbol">${item.symbol}</span>
            <span class="market-card-change ${item.up ? 'up' : 'down'}">${item.change}</span>
          </div>
          <div class="market-card-name">${item.name}</div>
          <div class="market-card-price">${item.price}</div>
          <svg class="market-card-spark" viewBox="0 0 64 28" preserveAspectRatio="none">
            <polyline points="${sparkPaths[i]}" fill="none" stroke="${item.up ? '#10b981' : '#ef4444'}" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>`).join('')}
      </div>`
}

// ─── Main export function ────────────────────────────────

export function exportProjectAsHTML(options: ExportOptions): ExportFile[] {
  const files: ExportFile[] = []

  files.push({ path: 'style.css', content: generateStylesheet(options) })

  for (const page of options.pages) {
    const filename = page.slug === 'home' ? 'index.html' : `${page.slug.replace(/\//g, '-')}.html`
    files.push({ path: filename, content: generatePageHTML(page, options) })
  }

  files.push({
    path: 'robots.txt',
    content: `User-agent: *\nAllow: /\nSitemap: https://${options.domain}/sitemap.xml`,
  })

  const sitemapEntries = options.pages.map(
    (p) => `  <url><loc>https://${options.domain}/${p.slug === 'home' ? '' : p.slug}</loc><changefreq>weekly</changefreq></url>`
  )
  files.push({
    path: 'sitemap.xml',
    content: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join('\n')}\n</urlset>`,
  })

  return files
}

// ─── Institutional-Grade Stylesheet ──────────────────────

function generateStylesheet(options: ExportOptions): string {
  const nicheColors: Record<string, { primary: string; primaryDark: string; accent: string }> = {
    forex_broker: { primary: '#0a2540', primaryDark: '#061b2e', accent: '#0066ff' },
    crypto_exchange: { primary: '#0c1222', primaryDark: '#070d18', accent: '#10b981' },
    prop_trading: { primary: '#1a1a2e', primaryDark: '#12121f', accent: '#f97316' },
    copy_trading: { primary: '#2d1b4e', primaryDark: '#1a1030', accent: '#a855f7' },
  }
  const c = nicheColors[options.niche] || nicheColors.forex_broker

  return `/* ${options.brandName} — Plus500-Inspired Modern Design */
:root{--color-primary:${c.primary};--color-primary-dark:${c.primaryDark};--color-accent:${c.accent};--color-bg:#ffffff;--color-bg-alt:#f7f8fa;--color-bg-warm:#faf9f7;--color-bg-dark:${c.primary};--color-bg-darker:${c.primaryDark};--color-text:#1a1a2e;--color-text-secondary:#4a5568;--color-text-light:#718096;--color-text-inv:#ffffff;--color-border:#e8eaed;--color-border-light:#f0f1f3;--color-success:#0d9f6e;--color-danger:#dc3545;--color-warning:#e8a317;--color-info:#2b6cb0;--font-heading:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;--font-sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;--max-w:1180px;--radius:6px;--radius-lg:10px;--radius-xl:14px;--shadow-sm:0 1px 2px rgba(0,0,0,.04);--shadow-md:0 2px 8px rgba(0,0,0,.06);--shadow-lg:0 4px 16px rgba(0,0,0,.08);--shadow-xl:0 8px 30px rgba(0,0,0,.1);--transition:.2s ease}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;scroll-behavior:smooth}
body{font-family:var(--font-sans);color:var(--color-text);background:var(--color-bg);line-height:1.7;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
a{color:var(--color-accent);text-decoration:none;transition:color var(--transition)}
a:hover{color:var(--color-primary)}
img{max-width:100%;height:auto}
::selection{background:color-mix(in srgb,var(--color-accent) 25%,white)}
a:focus-visible{outline:2px solid var(--color-accent);outline-offset:2px;border-radius:2px}

/* ─── Breadcrumb ─── */
.breadcrumb{max-width:var(--max-w);margin:0 auto;padding:12px 28px 0;font-size:.74rem;color:var(--color-text-light);display:flex;align-items:center;gap:6px}
.breadcrumb a{color:var(--color-text-secondary);font-weight:500}
.breadcrumb a:hover{color:var(--color-accent)}
.breadcrumb .bc-sep{opacity:.4}
.breadcrumb .bc-current{color:var(--color-text);font-weight:600}
.hero--platform+.social-proof-bar .breadcrumb,.hero--market+.social-proof-bar .breadcrumb{display:none}

/* ─── Language Selector ─── */
.lang-selector{position:relative;display:flex;align-items:center;gap:4px;font-size:.78rem;color:var(--color-text-secondary);cursor:pointer;padding:6px 10px;border-radius:var(--radius);transition:background .15s;border:1px solid transparent}
.lang-selector:hover{background:var(--color-bg-alt);border-color:var(--color-border)}
.lang-selector .lang-flag{font-size:.9rem}
.lang-selector .lang-code{font-weight:600;font-size:.74rem;text-transform:uppercase}
.lang-selector .lang-arrow{font-size:.5rem;opacity:.5}
.lang-dropdown{display:none;position:absolute;top:calc(100% + 4px);right:0;background:#fff;border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:0 8px 24px rgba(0,0,0,.1);padding:6px 0;min-width:140px;z-index:200}
.lang-selector:hover .lang-dropdown{display:block}
.lang-dropdown a{display:flex;align-items:center;gap:8px;padding:8px 14px;font-size:.82rem;color:var(--color-text-secondary);font-weight:500;transition:background .15s}
.lang-dropdown a:hover{background:var(--color-bg-alt);color:var(--color-primary)}
.lang-dropdown a.active{color:var(--color-accent);font-weight:700}

/* ─── Cookie Consent ─── */
.cookie-banner{display:none;position:fixed;bottom:0;left:0;right:0;z-index:300;background:#fff;border-top:1px solid var(--color-border);padding:16px 28px;box-shadow:0 -4px 20px rgba(0,0,0,.08);animation:slideUp .3s ease}
.cookie-banner.show{display:block}
.cookie-inner{max-width:var(--max-w);margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.cookie-text{font-size:.82rem;color:var(--color-text-secondary);line-height:1.6;flex:1;min-width:280px}
.cookie-text a{color:var(--color-accent);text-decoration:underline;font-weight:500}
.cookie-actions{display:flex;gap:10px;flex-shrink:0}
.cookie-actions .btn-cookie{padding:8px 20px;border-radius:50px;font-size:.8rem;font-weight:600;cursor:pointer;border:none;transition:all var(--transition)}
.cookie-actions .btn-accept{background:var(--color-accent);color:#fff}
.cookie-actions .btn-accept:hover{filter:brightness(1.1)}
.cookie-actions .btn-decline{background:var(--color-bg-alt);color:var(--color-text-secondary);border:1px solid var(--color-border)}
.cookie-actions .btn-decline:hover{border-color:var(--color-text-light)}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@media(max-width:768px){.cookie-inner{flex-direction:column;text-align:center}.cookie-actions{width:100%;justify-content:center}}

/* ─── Footer Social & App Links ─── */
.footer-social{display:flex;gap:12px;margin-top:16px}
.footer-social a{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.55);font-size:.85rem;transition:all var(--transition);border:1px solid rgba(255,255,255,.06)}
.footer-social a:hover{background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.15)}
.footer-app-badges{display:flex;gap:10px;margin-top:16px}
.footer-app-badge{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:var(--radius);background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.65);font-size:.72rem;font-weight:500;transition:all var(--transition)}
.footer-app-badge:hover{background:rgba(255,255,255,.12);color:rgba(255,255,255,.9);border-color:rgba(255,255,255,.2)}
.footer-app-badge .fab-icon{font-size:1.1rem}
.footer-app-badge .fab-text{line-height:1.2}
.footer-app-badge .fab-label{display:block;font-size:.6rem;opacity:.7;font-weight:400}
.footer-app-badge .fab-store{display:block;font-weight:700;font-size:.78rem;color:rgba(255,255,255,.85)}

/* ─── Risk Warning Bar ─── */
.announcement-bar{background:var(--color-bg-darker);color:rgba(255,255,255,.75);text-align:center;padding:10px 16px;font-size:.72rem;line-height:1.5;letter-spacing:.01em}
.announcement-bar strong{color:#fff;font-weight:600}
.announcement-bar a{color:rgba(255,255,255,.9);text-decoration:underline;text-underline-offset:2px;margin-left:6px;font-weight:500}
.announcement-bar a:hover{color:#fff}

/* ─── Navbar — Plus500 Inspired ─── */
.navbar{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.97);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--color-border);transition:box-shadow .3s ease}
.navbar.scrolled{box-shadow:0 2px 16px rgba(0,0,0,.08)}
.navbar-inner{max-width:var(--max-w);margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:60px}
.navbar-brand{font-size:1.15rem;font-weight:800;color:var(--color-primary);letter-spacing:-.03em;font-family:var(--font-sans);text-transform:uppercase}
.navbar-links{display:flex;gap:0;list-style:none;align-items:center}
.navbar-links a{color:var(--color-text-secondary);font-size:.8rem;font-weight:500;padding:6px 10px;border-radius:var(--radius);transition:all .15s;letter-spacing:.01em;white-space:nowrap;position:relative}
.navbar-links a:hover{color:var(--color-primary);background:var(--color-bg-alt)}
.navbar-links a.active{color:var(--color-accent);font-weight:700}
.navbar-links a.active::after{content:'';position:absolute;bottom:0;left:10px;right:10px;height:2px;background:var(--color-accent);border-radius:1px}
.navbar-actions{display:flex;align-items:center;gap:10px}
.navbar-login{color:var(--color-text-secondary);font-size:.82rem;font-weight:600;padding:8px 16px;border-radius:50px;transition:all var(--transition);white-space:nowrap;border:1px solid var(--color-border)}
.navbar-login:hover{color:var(--color-primary);border-color:var(--color-text-light);background:var(--color-bg-alt)}
.navbar-cta{display:inline-block;background:var(--color-accent);color:#fff !important;padding:10px 22px;border-radius:50px;font-weight:600;font-size:.82rem;transition:all var(--transition);white-space:nowrap;letter-spacing:.01em;box-shadow:0 2px 8px rgba(0,102,255,.2)}
.navbar-cta:hover{background:var(--color-primary);color:#fff !important;transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,102,255,.3)}
.navbar-toggle{display:none;background:none;border:none;cursor:pointer;padding:8px}
.navbar-toggle span{display:block;width:18px;height:2px;background:var(--color-text);margin:4px 0;border-radius:2px;transition:all .2s}

/* ─── Hero — Plus500 Inspired ─── */
.hero{background:var(--color-bg-dark);color:var(--color-text-inv);padding:80px 28px 72px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 70% 50%,color-mix(in srgb,var(--color-accent) 6%,transparent),transparent);pointer-events:none}
.hero-container{display:flex;align-items:center;gap:48px;max-width:var(--max-w);margin:0 auto;position:relative;z-index:1}
.hero-inner{flex:1;max-width:580px}
.hero-badge{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.2);padding:6px 16px;border-radius:50px;font-size:.72rem;font-weight:600;margin-bottom:24px;color:rgba(255,255,255,.7);letter-spacing:.04em;text-transform:uppercase}
.hero-badge .badge-dot{width:6px;height:6px;background:var(--color-success);border-radius:50%;animation:pulse 2.5s infinite}
.hero h1{font-size:2.8rem;font-weight:800;line-height:1.15;margin-bottom:20px;letter-spacing:-.03em;font-family:var(--font-heading);color:#fff}
.hero p{font-size:1rem;opacity:.7;margin-bottom:28px;line-height:1.7;max-width:500px;font-weight:400}
.hero-pills{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px}
.hero-pill{display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border-radius:50px;font-size:.74rem;font-weight:600;background:rgba(255,255,255,.08);color:rgba(255,255,255,.85);border:1px solid rgba(255,255,255,.1);letter-spacing:.01em}
.hero-pill::before{content:'✓';font-size:.65rem;color:var(--color-success);font-weight:700}
.hero-buttons{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:36px}
.hero .btn-primary{font-size:.9rem;padding:13px 32px;border-radius:50px;background:var(--color-accent);box-shadow:0 4px 14px rgba(0,102,255,.25);font-weight:600}
.hero .btn-primary:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,102,255,.35)}
.hero .btn-outline{font-size:.9rem;padding:13px 28px;border:1px solid rgba(255,255,255,.25);background:transparent;font-weight:500;border-radius:50px}
.hero .btn-outline:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.4)}
.hero-trust{display:flex;gap:24px;flex-wrap:wrap;font-size:.74rem;opacity:.5;border-top:1px solid rgba(255,255,255,.08);padding-top:20px}
.hero-trust span{display:flex;align-items:center;gap:6px;font-weight:500;letter-spacing:.02em}

/* ─── Hero Platform Mockup ─── */
.hero-visual{flex:1;display:flex;justify-content:center;align-items:center}
.hero-mockup{background:rgba(255,255,255,.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);border-radius:var(--radius-xl);padding:0;width:400px;overflow:hidden;box-shadow:0 24px 48px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.05);animation:float 6s ease-in-out infinite}
.mockup-topbar{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid rgba(255,255,255,.06);font-size:.72rem;color:rgba(255,255,255,.4);font-weight:500;letter-spacing:.03em}
.mockup-dots{display:flex;gap:5px}
.mockup-dots span{width:8px;height:8px;border-radius:50%}
.mockup-dots span:nth-child(1){background:#ef4444}
.mockup-dots span:nth-child(2){background:#f59e0b}
.mockup-dots span:nth-child(3){background:#10b981}
.mockup-balance{padding:20px 18px 8px;display:flex;align-items:baseline;gap:10px}
.mockup-amount{font-size:1.7rem;font-weight:800;color:#fff;font-family:var(--font-sans);letter-spacing:-.02em}
.mockup-change{font-size:.78rem;font-weight:600;padding:3px 8px;border-radius:4px}
.mockup-change.up{color:#10b981;background:rgba(16,185,129,.12)}
.mockup-change.down{color:#ef4444;background:rgba(239,68,68,.12)}
.mockup-sublabel{padding:0 18px 14px;font-size:.7rem;color:rgba(255,255,255,.3)}
.mockup-chart{width:100%;height:100px;padding:0 18px;display:block}
.mockup-rows{padding:8px 0 6px}
.mockup-row{display:flex;justify-content:space-between;align-items:center;padding:9px 18px;font-size:.8rem;border-top:1px solid rgba(255,255,255,.04)}
.mockup-row span:first-child{font-weight:600;color:rgba(255,255,255,.7);min-width:72px}
.mockup-row span:nth-child(2){color:rgba(255,255,255,.5);font-family:var(--font-sans);font-variant-numeric:tabular-nums}
.mockup-row .up{color:#10b981;font-weight:600;font-size:.75rem}
.mockup-row .down{color:#ef4444;font-weight:600;font-size:.75rem}

/* ─── Hero Variants ─── */
.hero--platform{}
.hero--market{}
.hero--corporate{text-align:center;background:linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))}
.hero--corporate .hero-container{justify-content:center}
.hero--corporate .hero-inner{max-width:720px;text-align:center}
.hero--corporate .hero-trust{justify-content:center}
.hero--corporate .hero-buttons{justify-content:center}
.hero--tools{background:linear-gradient(135deg,#f8fafc 0%,#eef2f7 50%,#e8edf5 100%);color:var(--color-text);padding:72px 28px 60px;border-bottom:none;position:relative}
.hero--tools::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 80% 40%,color-mix(in srgb,var(--color-accent) 4%,transparent),transparent);pointer-events:none}
.hero--tools .hero-inner{border-left:none;padding-left:0}
.hero--tools h1{color:var(--color-text);font-size:2.4rem;font-weight:800}
.hero--tools p{color:var(--color-text-secondary);opacity:1}
.hero--tools .hero-badge{border-color:color-mix(in srgb,var(--color-accent) 20%,transparent);color:var(--color-accent);background:rgba(255,255,255,.7)}
.hero--tools .hero-badge .badge-dot{background:var(--color-accent)}
.hero--tools .hero-pills .hero-pill{background:rgba(255,255,255,.7);color:var(--color-text);border-color:var(--color-border)}
.hero--tools .hero-pills .hero-pill::before{color:var(--color-accent)}
.hero--tools .btn-primary{box-shadow:0 4px 14px rgba(0,102,255,.2)}
.hero--tools .btn-outline{color:var(--color-text-secondary);border-color:var(--color-border);background:rgba(255,255,255,.6)}
.hero--tools .btn-outline:hover{background:rgba(255,255,255,.9);border-color:var(--color-text-light)}
.hero--tools .hero-trust{opacity:1;color:var(--color-text-light);border-color:var(--color-border-light)}
.hero--legal{background:var(--color-bg-alt);color:var(--color-text);padding:48px 28px 40px}
.hero--legal::before{content:none}
.hero--legal h1{color:var(--color-text);font-size:2rem;margin-bottom:12px;font-weight:700}
.hero--legal p{color:var(--color-text-secondary);opacity:1;font-size:.92rem}
.hero--legal .hero-buttons{display:none}
.hero--legal .hero-trust{display:none}
.hero--legal .hero-pills{display:none}

/* ─── Tools Visual Components ─── */
.tools-visual{position:relative;z-index:1;animation:float 6s ease-in-out infinite}
.tv-device{border-radius:12px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,0,.1),0 0 0 1px rgba(0,0,0,.05)}
.tv-laptop{background:#fff;width:320px;border-radius:12px}
.tv-screen{padding:0}
.tv-toolbar{display:flex;gap:5px;padding:10px 14px;background:#f8f9fa;border-bottom:1px solid #eee}
.tv-toolbar span{width:8px;height:8px;border-radius:50%;background:#ddd}
.tv-toolbar span:nth-child(1){background:#ff6b6b}
.tv-toolbar span:nth-child(2){background:#ffd93d}
.tv-toolbar span:nth-child(3){background:#6bcb77}
.tv-chart-area{padding:16px 14px 8px}
.tv-chart-svg{width:100%;height:50px;display:block}
.tv-rows{padding:4px 14px 10px}
.tv-row{height:8px;background:#f0f1f3;border-radius:4px;margin-bottom:6px}
.tv-row:nth-child(2){width:75%}
.tv-row:nth-child(3){width:50%}
.tv-phone{position:absolute;right:-20px;bottom:-10px;width:120px;background:#fff;border-radius:16px;padding:4px;box-shadow:0 12px 32px rgba(0,0,0,.12)}
.tv-phone-notch{width:40px;height:4px;background:#eee;border-radius:4px;margin:6px auto}
.tv-phone-screen{padding:8px 10px 12px}
.tv-phone-balance{font-size:.85rem;font-weight:700;color:var(--color-text);margin-bottom:6px}
.tv-phone-chart{width:100%;height:24px;display:block}
.tv-tier-cards{display:flex;gap:8px;align-items:flex-end}
.tv-tier{background:#fff;border-radius:10px;padding:16px 14px;width:120px;box-shadow:0 4px 16px rgba(0,0,0,.06);border:1px solid var(--color-border-light);text-align:center;transition:transform .2s}
.tv-tier-hl{transform:translateY(-8px);border-color:var(--color-accent);box-shadow:0 8px 24px rgba(0,102,255,.12);position:relative}
.tv-tier-badge{position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:var(--color-accent);color:#fff;font-size:.6rem;font-weight:700;padding:2px 10px;border-radius:50px;white-space:nowrap}
.tv-tier-name{font-size:.72rem;font-weight:700;color:var(--color-text);margin-bottom:4px}
.tv-tier-price{font-size:1.1rem;font-weight:800;color:var(--color-primary);margin-bottom:8px}
.tv-tier-feat{font-size:.6rem;color:var(--color-text-light);margin-bottom:3px}
.tv-spread-card{background:#fff;border-radius:12px;padding:20px;width:280px;box-shadow:0 8px 24px rgba(0,0,0,.08);border:1px solid var(--color-border-light)}
.tv-spread-header{font-size:.78rem;font-weight:700;color:var(--color-text);margin-bottom:12px;text-transform:uppercase;letter-spacing:.04em}
.tv-spread-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0}
.tv-bid,.tv-ask{font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:4px}
.tv-bid{background:rgba(220,53,69,.08);color:var(--color-danger)}
.tv-ask{background:rgba(13,159,110,.08);color:var(--color-success)}
.tv-spread-price{font-size:1.2rem;font-weight:700;font-variant-numeric:tabular-nums;color:var(--color-text)}
.tv-spread-val{font-size:.75rem;color:var(--color-text-light);margin:10px 0;text-align:center}
.tv-spread-val strong{color:var(--color-accent)}
.tv-spread-chart{width:100%;height:36px;display:block}
.tv-edu-card{background:#fff;border-radius:12px;padding:24px;width:280px;box-shadow:0 8px 24px rgba(0,0,0,.08);border:1px solid var(--color-border-light)}
.tv-edu-icon{font-size:2rem;margin-bottom:8px}
.tv-edu-title{font-size:.88rem;font-weight:700;color:var(--color-text);margin-bottom:16px}
.tv-edu-progress{margin-bottom:10px}
.tv-edu-progress span{font-size:.68rem;color:var(--color-text-light);display:block;margin-bottom:4px}
.tv-edu-bar{height:6px;background:var(--color-accent);border-radius:3px;position:relative}
.tv-edu-bar::after{content:'';position:absolute;inset:0;background:var(--color-bg-alt);border-radius:3px;z-index:-1;width:100%;left:0}
.tv-edu-progress{background:var(--color-bg-alt);border-radius:3px;padding:0;position:relative}
.tv-edu-progress span{padding:0 0 4px;display:block}
.tv-edu-bar{height:6px;background:linear-gradient(90deg,var(--color-accent),color-mix(in srgb,var(--color-accent) 70%,#6366f1));border-radius:3px}
.tv-edu-stats{display:flex;gap:12px;margin-top:14px;font-size:.68rem;font-weight:600;color:var(--color-accent)}
.tv-contact-card{background:#fff;border-radius:12px;padding:24px;width:260px;box-shadow:0 8px 24px rgba(0,0,0,.08);border:1px solid var(--color-border-light);text-align:center}
.tv-contact-icon{font-size:2.2rem;margin-bottom:8px}
.tv-contact-title{font-size:.88rem;font-weight:700;color:var(--color-text);margin-bottom:16px}
.tv-contact-methods{text-align:left}
.tv-contact-method{padding:8px 12px;font-size:.78rem;color:var(--color-text-secondary);border-radius:var(--radius);transition:background .15s;display:flex;align-items:center;gap:8px}
.tv-contact-method:hover{background:var(--color-bg-alt)}
.tv-contact-hours{font-size:.7rem;color:var(--color-accent);font-weight:600;margin-top:12px}
.tv-generic-card{width:200px;height:140px;background:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.08)}
.tv-generic-icon{width:120px;height:80px}

/* ─── Market Cards Visual ─── */
.market-cards{display:flex;flex-direction:column;gap:12px;width:380px;animation:float 6s ease-in-out infinite}
.market-card{background:rgba(255,255,255,.06);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:16px 20px;display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto;gap:2px 16px;transition:border-color .2s}
.market-card:hover{border-color:rgba(255,255,255,.2)}
.market-card-top{display:flex;justify-content:space-between;align-items:center;grid-column:1/-1}
.market-card-symbol{font-weight:700;font-size:.9rem;color:#fff;letter-spacing:.02em}
.market-card-change{font-size:.75rem;font-weight:600;padding:2px 8px;border-radius:4px}
.market-card-change.up{color:#10b981;background:rgba(16,185,129,.12)}
.market-card-change.down{color:#ef4444;background:rgba(239,68,68,.12)}
.market-card-name{font-size:.72rem;color:rgba(255,255,255,.5);grid-column:1}
.market-card-price{font-size:1.3rem;font-weight:700;font-family:var(--font-sans);color:rgba(255,255,255,.85);grid-column:1;margin-top:4px}
.market-card-spark{width:80px;height:28px;grid-column:2;grid-row:2/4;align-self:center}

/* ─── Navbar Dropdown — Mega Menu ─── */
.nav-dropdown{position:relative}
.nav-dropdown>a::after{content:'';display:inline-block;width:4px;height:4px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg);margin-left:5px;vertical-align:middle;opacity:.5;transition:transform .2s}
.nav-dropdown:hover>a::after{transform:rotate(-135deg)}
.nav-dropdown-menu{display:none;position:absolute;top:calc(100% + 4px);left:50%;transform:translateX(-50%);background:#fff;border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:0 12px 32px rgba(0,0,0,.1);padding:12px;min-width:320px;z-index:200}
.nav-dropdown:hover .nav-dropdown-menu{display:block}
.nav-dropdown-menu a{display:flex;align-items:center;gap:10px;padding:10px 14px;font-size:.84rem;color:var(--color-text-secondary);transition:all .15s;font-weight:500;border-radius:var(--radius)}
.nav-dropdown-menu a:hover{background:var(--color-bg-alt);color:var(--color-primary)}
.nav-dropdown-menu a .dd-icon{width:32px;height:32px;border-radius:var(--radius);background:var(--color-bg-alt);display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0}
.nav-dropdown-menu a:hover .dd-icon{background:color-mix(in srgb,var(--color-accent) 10%,white)}
.nav-dropdown-menu a .dd-label{font-weight:600;color:var(--color-text);font-size:.82rem}
.nav-dropdown-menu a .dd-desc{font-size:.72rem;color:var(--color-text-light);font-weight:400;margin-top:1px}
.nav-dropdown-footer{border-top:1px solid var(--color-border-light);margin-top:6px;padding-top:8px}
.nav-dropdown-footer a{font-size:.78rem;color:var(--color-accent) !important;font-weight:600}

/* ─── Mobile Menu ─── */
.navbar-mobile{display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border-bottom:1px solid var(--color-border);padding:12px 20px;box-shadow:0 8px 24px rgba(0,0,0,.08);z-index:99}
.navbar-mobile a{display:block;padding:12px 16px;font-size:.95rem;color:var(--color-text-secondary);border-radius:var(--radius);font-weight:500;transition:all .15s}
.navbar-mobile a:hover,.navbar-mobile a.active{background:var(--color-bg-alt);color:var(--color-primary)}
.navbar-mobile .mobile-divider{height:1px;background:var(--color-border);margin:8px 0}
.navbar-mobile.open{display:block}
.navbar-mobile .mobile-cta-group{padding:8px 16px 4px;display:flex;flex-direction:column;gap:8px}
.navbar-mobile .mobile-cta-group .btn-primary{text-align:center;padding:12px;font-size:.9rem;font-weight:700;border-radius:50px}
.navbar-mobile .mobile-cta-group .navbar-login{display:block;text-align:center;padding:10px;font-size:.88rem}

/* ─── Sections ─── */
.section{padding:72px 28px}
.section-alt{background:var(--color-bg-alt)}
.section-inner{max-width:var(--max-w);margin:0 auto}
.section-title{font-size:1.85rem;font-weight:800;text-align:center;margin-bottom:16px;letter-spacing:-.02em;color:var(--color-text);line-height:1.25;font-family:var(--font-heading)}
.section-title::after{content:none}
.section-subtitle{font-size:.95rem;color:var(--color-text-light);text-align:center;max-width:580px;margin:0 auto 44px;line-height:1.7}

/* ─── Text Content ─── */
.text-content{max-width:720px;margin:0 auto;font-size:1rem;line-height:1.8;color:var(--color-text-secondary)}
.text-content p{margin-bottom:20px}

/* ─── Features Grid — Clean Cards ─── */
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
.feature-card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:32px 28px;transition:all var(--transition);position:relative}
.feature-card:hover{border-color:color-mix(in srgb,var(--color-accent) 30%,var(--color-border));box-shadow:var(--shadow-md)}
.feature-card::before{content:none}
.feature-card-icon{width:48px;height:48px;border-radius:var(--radius);background:var(--color-bg-alt);display:flex;align-items:center;justify-content:center;font-size:1.35rem;margin-bottom:20px}
.feature-card:hover .feature-card-icon{background:color-mix(in srgb,var(--color-accent) 8%,white)}
.feature-card h3{font-size:1.1rem;font-weight:600;margin-bottom:10px;color:var(--color-text)}
.feature-card p{font-size:.88rem;color:var(--color-text-light);line-height:1.7}

/* ─── Pricing Grid ─── */
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;align-items:start}
.pricing-card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:40px 28px;text-align:center;position:relative;transition:all var(--transition)}
.pricing-card:hover{border-color:color-mix(in srgb,var(--color-accent) 25%,var(--color-border))}
.pricing-card.highlighted{border-color:var(--color-accent);box-shadow:var(--shadow-lg)}
.pricing-card.highlighted:hover{box-shadow:var(--shadow-xl)}
.pricing-card.highlighted::before{content:'Recommended';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--color-accent);color:#fff;padding:5px 20px;border-radius:4px;font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em}
.pricing-card h3{font-size:1.15rem;font-weight:600;margin-bottom:12px}
.pricing-card .price{font-size:2.5rem;font-weight:800;color:var(--color-primary);margin-bottom:4px;letter-spacing:-.02em;font-family:var(--font-sans)}
.pricing-card .period{font-size:.85rem;color:var(--color-text-light);margin-bottom:28px}
.pricing-card ul{list-style:none;text-align:left;margin-bottom:28px}
.pricing-card ul li{padding:10px 0;border-bottom:1px solid var(--color-border-light);font-size:.9rem;color:var(--color-text-secondary);display:flex;align-items:center;gap:10px}
.pricing-card ul li::before{content:'\\2713';color:var(--color-success);font-weight:700;font-size:.7rem}

/* ─── Content List ─── */
.content-list{max-width:740px;margin:0 auto;list-style:none}
.content-list li{padding:18px 0;border-bottom:1px solid var(--color-border-light);display:flex;gap:14px;align-items:flex-start}
.content-list li:last-child{border-bottom:none}
.content-list li::before{content:'';width:6px;height:6px;background:var(--color-accent);border-radius:50%;flex-shrink:0;margin-top:8px}
.content-list .list-title{font-weight:600;margin-bottom:4px;color:var(--color-text)}
.content-list .list-desc{color:var(--color-text-light);font-size:.9rem;line-height:1.7}

/* ─── CTA Section ─── */
.cta-section{background:var(--color-bg-dark);color:var(--color-text-inv);padding:80px 28px;text-align:center;position:relative}
.cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 100%,color-mix(in srgb,var(--color-accent) 8%,transparent),transparent 60%);pointer-events:none}
.cta-section::after{content:none}
.cta-section h2{font-size:1.85rem;font-weight:800;margin-bottom:16px;position:relative;font-family:var(--font-heading)}
.cta-section p{font-size:1rem;opacity:.6;margin-bottom:32px;max-width:500px;margin-left:auto;margin-right:auto;position:relative;line-height:1.7}
.cta-section .btn-primary{background:var(--color-accent);color:#fff;font-size:.95rem;padding:14px 36px;box-shadow:0 4px 14px rgba(0,102,255,.3);position:relative;font-weight:600;border-radius:50px}
.cta-section .btn-primary:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,102,255,.4)}

/* ─── Data Table ─── */
.data-table{width:100%;border-collapse:separate;border-spacing:0;background:var(--color-bg);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--color-border)}
.data-table th,.data-table td{padding:13px 20px;text-align:left;border-bottom:1px solid var(--color-border-light);font-size:.88rem}
.data-table th{background:var(--color-bg-alt);color:var(--color-text);font-weight:700;font-size:.82rem;text-transform:uppercase;letter-spacing:.06em}
.data-table td{color:var(--color-text-secondary)}
.data-table tbody tr{transition:background var(--transition)}
.data-table tbody tr:hover{background:var(--color-bg-alt)}
.data-table tbody tr:last-child td{border-bottom:none}
.cell-positive{color:var(--color-success) !important;font-weight:600}
.cell-negative{color:var(--color-danger) !important;font-weight:600}
.cell-badge{display:inline-block;padding:3px 12px;border-radius:4px;font-size:.76rem;font-weight:600;background:color-mix(in srgb,var(--color-accent) 8%,white);color:var(--color-accent)}

/* ─── Stats Bar ─── */
.stats-bar{display:flex;justify-content:center;flex-wrap:wrap;gap:0;padding:0;background:transparent;border:none;box-shadow:none;border-radius:0}
.stat-item{text-align:center;padding:20px 44px;flex:1;min-width:140px}
.stat-value{font-size:2.6rem;font-weight:800;color:var(--color-primary);letter-spacing:-.02em;line-height:1.1;font-family:var(--font-heading)}
.stat-label{font-size:.78rem;color:var(--color-text-light);margin-top:8px;font-weight:500;text-transform:uppercase;letter-spacing:.06em}
.stat-divider{width:1px;background:var(--color-border);align-self:stretch;margin:12px 0}

/* ─── Steps Process ─── */
.steps-grid{display:flex;justify-content:center;gap:0;flex-wrap:wrap;position:relative;counter-reset:step}
.step-item{flex:1;min-width:200px;max-width:280px;text-align:center;padding:28px 24px;position:relative}
.step-number{width:48px;height:48px;border-radius:50%;background:var(--color-bg-dark);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:700;margin-bottom:20px;font-family:var(--font-sans)}
.step-item:hover .step-number{background:var(--color-accent)}
.step-item h3{font-size:.98rem;font-weight:600;margin-bottom:10px;color:var(--color-text)}
.step-item p{font-size:.86rem;color:var(--color-text-light);line-height:1.65}
.step-connector{position:absolute;top:50px;right:-16px;width:32px;height:1px;background:var(--color-border)}
.step-item:last-child .step-connector{display:none}

/* ─── Testimonials ─── */
.testimonials-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.testimonial-card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:32px 28px;position:relative;transition:border-color var(--transition)}
.testimonial-card:hover{border-color:color-mix(in srgb,var(--color-accent) 20%,var(--color-border))}
.testimonial-card::before{content:'\\201C';font-size:4rem;color:var(--color-accent);opacity:.18;position:absolute;top:12px;left:20px;line-height:1;font-family:var(--font-heading)}
.testimonial-rating{color:#e8a317;margin-bottom:12px;letter-spacing:2px;font-size:1rem}
.testimonial-text{font-size:.92rem;line-height:1.8;color:var(--color-text-secondary);margin-bottom:20px;position:relative;z-index:1}
.testimonial-author{font-weight:600;font-size:.9rem;color:var(--color-text)}
.testimonial-role{font-size:.8rem;color:var(--color-text-light);margin-top:3px}

/* ─── Icon Grid ─── */
.icon-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;text-align:center}
.icon-grid-item{padding:28px 14px;border-radius:var(--radius-lg);border:1px solid transparent;transition:all var(--transition)}
.icon-grid-item:hover{border-color:color-mix(in srgb,var(--color-accent) 30%,var(--color-border));background:var(--color-bg);box-shadow:var(--shadow-sm)}
.icon-grid-icon{font-size:2rem;margin-bottom:12px;display:block}
.icon-grid-title{font-weight:600;font-size:.88rem;margin-bottom:4px;color:var(--color-text)}
.icon-grid-desc{font-size:.8rem;color:var(--color-text-light);line-height:1.55}

/* ─── Comparison Table ─── */
.comparison-table{width:100%;border-collapse:separate;border-spacing:0;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--color-border)}
.comparison-table thead th{padding:16px;font-weight:600;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--color-border)}
.comparison-table thead th:first-child{text-align:left;background:var(--color-bg)}
.comparison-table .col-us{background:color-mix(in srgb,var(--color-accent) 4%,white)}
.comparison-table .col-us th{color:var(--color-accent)}
.comparison-table .col-them{background:var(--color-bg-alt)}
.comparison-table td{padding:14px 16px;border-bottom:1px solid var(--color-border-light);text-align:center;font-size:.9rem}
.comparison-table td:first-child{text-align:left;font-weight:500;color:var(--color-text)}
.comparison-table tbody tr:last-child td{border-bottom:none}
.comparison-check{color:var(--color-success);font-weight:700;font-size:1.1rem}
.comparison-cross{color:var(--color-danger);opacity:.35;font-size:1.1rem}

/* ─── Banner ─── */
.banner{border-radius:var(--radius-lg);padding:24px 28px;display:flex;align-items:flex-start;gap:16px;max-width:740px;margin:0 auto}
.banner-info{background:color-mix(in srgb,var(--color-info) 5%,white);border:1px solid color-mix(in srgb,var(--color-info) 12%,white)}
.banner-warning{background:color-mix(in srgb,var(--color-warning) 5%,white);border:1px solid color-mix(in srgb,var(--color-warning) 12%,white)}
.banner-success{background:color-mix(in srgb,var(--color-success) 5%,white);border:1px solid color-mix(in srgb,var(--color-success) 12%,white)}
.banner-icon{font-size:1.3rem;flex-shrink:0;line-height:1}
.banner-content{font-size:.88rem;line-height:1.7;color:var(--color-text-secondary)}
.banner-content strong{display:block;margin-bottom:4px;font-weight:600;color:var(--color-text)}

/* ─── Two Column ─── */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
.two-col-text h3{font-size:1.5rem;font-weight:700;margin-bottom:16px;letter-spacing:-.01em;line-height:1.25;font-family:var(--font-heading)}
.two-col-text p{color:var(--color-text-secondary);line-height:1.8;margin-bottom:16px;font-size:.95rem}
.two-col-text .btn-primary{margin-top:8px}
.two-col-bullets{list-style:none;margin-top:14px}
.two-col-bullets li{padding:7px 0;font-size:.9rem;color:var(--color-text-secondary);display:flex;align-items:center;gap:10px}
.two-col-bullets li::before{content:'\\2713';color:var(--color-success);font-weight:700;font-size:.7rem}
.two-col-features{list-style:none}
.two-col-features li{padding:16px 0;border-bottom:1px solid var(--color-border-light);display:flex;align-items:flex-start;gap:12px}
.two-col-features li:last-child{border-bottom:none}
.two-col-features .feat-icon{font-size:1.2rem;margin-top:2px;flex-shrink:0}
.two-col-features .feat-title{font-weight:600;margin-bottom:4px;color:var(--color-text);font-size:.92rem}
.two-col-features .feat-desc{font-size:.86rem;color:var(--color-text-light);line-height:1.6}

/* ─── Buttons ─── */
.btn-primary{display:inline-block;background:var(--color-accent);color:#fff;padding:12px 28px;border-radius:50px;font-weight:600;font-size:.88rem;border:none;cursor:pointer;transition:all var(--transition);letter-spacing:.01em}
.btn-primary:hover{color:#fff;filter:brightness(1.1);transform:translateY(-1px);box-shadow:var(--shadow-md)}
.btn-primary:focus-visible{outline:2px solid var(--color-accent);outline-offset:2px}
.btn-outline{display:inline-block;background:transparent;color:#fff;padding:12px 28px;border-radius:50px;font-weight:500;font-size:.88rem;border:1px solid rgba(255,255,255,.25);cursor:pointer;transition:all var(--transition)}
.btn-outline:hover{background:rgba(255,255,255,.06);color:#fff;border-color:rgba(255,255,255,.4)}
.btn-outline:focus-visible,.btn-secondary:focus-visible{outline:2px solid var(--color-accent);outline-offset:2px}
.btn-secondary{display:inline-block;background:var(--color-bg);color:var(--color-text);padding:12px 28px;border-radius:50px;font-weight:500;font-size:.88rem;border:1px solid var(--color-border);cursor:pointer;transition:all var(--transition)}
.btn-secondary:hover{border-color:var(--color-accent);color:var(--color-accent)}

/* ─── Footer — Institutional ─── */
.footer{background:var(--color-primary);color:var(--color-text-inv);padding:64px 28px 24px}
.footer::before{content:none}
.footer-inner{max-width:var(--max-w);margin:0 auto}
.footer-grid{display:grid;grid-template-columns:1.4fr repeat(3,1fr) 1fr;gap:36px;margin-bottom:40px}
.footer-col h4{font-size:.76rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin-bottom:18px;color:rgba(255,255,255,.55)}
.footer-col p{font-size:.85rem;color:rgba(255,255,255,.5);line-height:1.7}
.footer-col ul{list-style:none}
.footer-col ul li{margin-bottom:10px}
.footer-col a{color:rgba(255,255,255,.65);font-size:.85rem;transition:color var(--transition)}
.footer-col a:hover{color:rgba(255,255,255,.95)}
.footer-regulatory{border-top:1px solid rgba(255,255,255,.08);padding:20px 0;margin-bottom:20px;display:flex;justify-content:center;gap:28px;flex-wrap:wrap;font-size:.76rem;color:rgba(255,255,255,.45)}
.footer-regulatory span{display:flex;align-items:center;gap:5px}
.footer-payments{display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-bottom:20px;font-size:1.15rem;opacity:.4}
.footer-bottom{border-top:1px solid rgba(255,255,255,.06);padding-top:18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.footer-bottom p{font-size:.76rem;color:rgba(255,255,255,.4)}
.footer-bottom a{color:rgba(255,255,255,.45) !important}
.footer-bottom a:hover{color:rgba(255,255,255,.8) !important}
.footer-risk{font-size:.75rem;color:rgba(255,255,255,.35);line-height:1.75;margin-top:20px;max-width:900px}

/* ─── Trustpilot Bar (in Hero) ─── */
.hero-trustpilot{display:flex;align-items:center;gap:10px;margin-bottom:24px;font-size:.82rem}
.hero-trustpilot .tp-stars{color:#00b67a;font-size:.9rem;letter-spacing:1px}
.hero-trustpilot .tp-text{color:rgba(255,255,255,.65);font-weight:500}
.hero-trustpilot .tp-score{color:#fff;font-weight:700}
.hero--tools .hero-trustpilot .tp-text{color:var(--color-text-secondary)}
.hero--tools .hero-trustpilot .tp-score{color:var(--color-text)}

/* ─── Hero Micro-copy ─── */
.hero-micro{font-size:.74rem;color:rgba(255,255,255,.5);margin-top:-20px;margin-bottom:24px;display:flex;gap:14px;align-items:center}
.hero-micro span{display:flex;align-items:center;gap:4px}
.hero--tools .hero-micro{color:var(--color-text-light)}

/* ─── Social Proof Bar ─── */
.social-proof-bar{background:#fff;border-bottom:1px solid var(--color-border);padding:16px 28px}
.social-proof-inner{max-width:var(--max-w);margin:0 auto;display:flex;justify-content:center;align-items:center;gap:32px;flex-wrap:wrap}
.sp-item{display:flex;align-items:center;gap:8px;font-size:.78rem;color:var(--color-text-secondary);font-weight:500}
.sp-item strong{color:var(--color-text);font-weight:700;font-size:.85rem}
.sp-divider{width:1px;height:24px;background:var(--color-border)}
.sp-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:50px;font-size:.72rem;font-weight:600;background:color-mix(in srgb,var(--color-success) 8%,white);color:var(--color-success);border:1px solid color-mix(in srgb,var(--color-success) 15%,white)}

/* ─── Live Activity Indicator ─── */
.live-activity{position:fixed;bottom:80px;left:20px;z-index:180;background:#fff;border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:12px 16px;box-shadow:0 4px 20px rgba(0,0,0,.1);font-size:.78rem;display:flex;align-items:center;gap:10px;animation:slideInLeft .4s ease;max-width:280px;opacity:0;pointer-events:none;transition:opacity .3s}
.live-activity.show{opacity:1;pointer-events:auto}
.live-activity .la-dot{width:8px;height:8px;border-radius:50%;background:var(--color-success);animation:pulse 2s infinite;flex-shrink:0}
.live-activity .la-text{color:var(--color-text-secondary);line-height:1.4}
.live-activity .la-text strong{color:var(--color-text);font-weight:700}
.live-activity .la-close{position:absolute;top:4px;right:8px;background:none;border:none;font-size:.9rem;color:var(--color-text-light);cursor:pointer;padding:2px}
@keyframes slideInLeft{from{transform:translateX(-20px);opacity:0}to{transform:translateX(0);opacity:1}}
@media(max-width:768px){.live-activity{bottom:70px;left:10px;right:10px;max-width:none}}

/* ─── Media Logos Bar ─── */
.media-bar{padding:20px 28px;background:var(--color-bg-alt);border-bottom:1px solid var(--color-border)}
.media-inner{max-width:var(--max-w);margin:0 auto;text-align:center}
.media-label{font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--color-text-light);font-weight:600;margin-bottom:12px}
.media-logos{display:flex;justify-content:center;align-items:center;gap:32px;flex-wrap:wrap;opacity:.4;filter:grayscale(1)}
.media-logos:hover{opacity:.7;filter:grayscale(0);transition:all .3s}
.media-logo{font-size:.9rem;font-weight:700;color:var(--color-text);letter-spacing:.02em;font-family:var(--font-heading)}

/* ─── Live Market Ticker ─── */
.market-ticker{background:var(--color-bg-darker);padding:8px 0;overflow:hidden;white-space:nowrap}
.ticker-track{display:inline-flex;gap:36px;animation:ticker 30s linear infinite}
.ticker-item{display:inline-flex;align-items:center;gap:8px;font-size:.78rem;color:rgba(255,255,255,.7);font-weight:500}
.ticker-symbol{color:#fff;font-weight:700}
.ticker-price{font-variant-numeric:tabular-nums;color:rgba(255,255,255,.85)}
.ticker-change{font-weight:600;font-size:.72rem;padding:1px 6px;border-radius:3px}
.ticker-change.up{color:#10b981;background:rgba(16,185,129,.12)}
.ticker-change.down{color:#ef4444;background:rgba(239,68,68,.12)}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* ─── Section CTA ─── */
.section-cta{text-align:center;margin-top:36px}
.section-cta .btn-primary{padding:12px 32px;font-size:.88rem}

/* ─── Promo Banner ─── */
.promo-bar{background:linear-gradient(90deg,var(--color-accent),color-mix(in srgb,var(--color-accent) 70%,#6366f1));color:#fff;text-align:center;padding:12px 20px;font-size:.84rem;font-weight:500}
.promo-bar strong{font-weight:700}
.promo-bar a{color:#fff;text-decoration:underline;font-weight:600;margin-left:8px}

/* ─── FAQ Accordion ─── */
.faq-list{max-width:740px;margin:0 auto;list-style:none}
.faq-item{border-bottom:1px solid var(--color-border-light)}
.faq-q{display:flex;justify-content:space-between;align-items:center;padding:20px 0;cursor:pointer;font-weight:600;font-size:.95rem;color:var(--color-text);gap:16px}
.faq-q::after{content:'+';font-size:1.3rem;color:var(--color-text-light);font-weight:300;flex-shrink:0;transition:transform .2s}
.faq-item.open .faq-q::after{content:'−'}
.faq-a{max-height:0;overflow:hidden;transition:max-height .3s ease;font-size:.9rem;color:var(--color-text-secondary);line-height:1.7}
.faq-item.open .faq-a{max-height:300px;padding-bottom:20px}

/* ─── Sticky Mobile CTA ─── */
.sticky-cta{display:none;position:fixed;bottom:0;left:0;right:0;z-index:200;background:rgba(255,255,255,.97);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-top:1px solid var(--color-border);padding:10px 16px;text-align:center;box-shadow:0 -4px 16px rgba(0,0,0,.06)}
.sticky-cta .btn-primary{width:100%;padding:14px;font-size:.92rem;font-weight:700}

/* ─── Regulation License Bar ─── */
.regulation-bar{background:var(--color-bg-alt);border-bottom:1px solid var(--color-border);padding:14px 28px}
.regulation-inner{max-width:var(--max-w);margin:0 auto;display:flex;justify-content:center;align-items:center;gap:24px;flex-wrap:wrap}
.reg-item{display:flex;align-items:center;gap:8px;font-size:.72rem;color:var(--color-text-secondary);font-weight:500}
.reg-item .reg-icon{width:28px;height:28px;border-radius:50%;background:var(--color-bg);border:1px solid var(--color-border);display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:var(--color-accent);flex-shrink:0}
.reg-item .reg-label{font-weight:700;color:var(--color-text);font-size:.74rem}
.reg-item .reg-num{color:var(--color-text-light);font-size:.68rem;font-variant-numeric:tabular-nums}
.reg-divider{width:1px;height:20px;background:var(--color-border)}

/* ─── Awards Section ─── */
.awards-section{padding:56px 28px;background:var(--color-bg)}
.awards-inner{max-width:var(--max-w);margin:0 auto;text-align:center}
.awards-label{font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--color-text-light);font-weight:600;margin-bottom:8px}
.awards-title{font-size:1.5rem;font-weight:800;color:var(--color-text);margin-bottom:36px;font-family:var(--font-heading)}
.awards-grid{display:flex;justify-content:center;gap:20px;flex-wrap:wrap}
.award-card{background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:24px 20px;width:180px;text-align:center;transition:all var(--transition)}
.award-card:hover{border-color:color-mix(in srgb,var(--color-accent) 30%,var(--color-border));box-shadow:var(--shadow-md)}
.award-icon{font-size:2rem;margin-bottom:10px;display:block}
.award-name{font-size:.78rem;font-weight:700;color:var(--color-text);margin-bottom:4px;line-height:1.35}
.award-source{font-size:.68rem;color:var(--color-text-light);font-weight:500}
.award-year{font-size:.65rem;color:var(--color-accent);font-weight:700;margin-top:4px}

/* ─── Performance Metrics Bar ─── */
.perf-bar{background:var(--color-bg-dark);padding:48px 28px;color:var(--color-text-inv)}
.perf-inner{max-width:var(--max-w);margin:0 auto;display:flex;justify-content:center;gap:0;flex-wrap:wrap}
.perf-item{flex:1;min-width:160px;text-align:center;padding:0 28px;border-right:1px solid rgba(255,255,255,.08)}
.perf-item:last-child{border-right:none}
.perf-value{font-size:2rem;font-weight:800;color:#fff;font-family:var(--font-heading);letter-spacing:-.02em;line-height:1.2}
.perf-value .perf-unit{font-size:.9rem;font-weight:600;opacity:.7}
.perf-label{font-size:.72rem;color:rgba(255,255,255,.5);margin-top:6px;font-weight:500;text-transform:uppercase;letter-spacing:.06em}

/* ─── Security Badges ─── */
.security-bar{padding:40px 28px;background:var(--color-bg)}
.security-inner{max-width:var(--max-w);margin:0 auto;text-align:center}
.security-label{font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--color-text-light);font-weight:600;margin-bottom:20px}
.security-badges{display:flex;justify-content:center;gap:32px;flex-wrap:wrap}
.security-badge{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:100px}
.security-badge .sb-icon{width:48px;height:48px;border-radius:50%;background:var(--color-bg-alt);border:1px solid var(--color-border);display:flex;align-items:center;justify-content:center;font-size:1.2rem}
.security-badge .sb-label{font-size:.72rem;font-weight:600;color:var(--color-text);line-height:1.3}
.security-badge .sb-sub{font-size:.65rem;color:var(--color-text-light)}

/* ─── Fund Protection Box ─── */
.fund-protection{background:color-mix(in srgb,var(--color-success) 4%,white);border:1px solid color-mix(in srgb,var(--color-success) 12%,white);border-radius:var(--radius-lg);padding:28px 32px;max-width:740px;margin:32px auto 0;display:flex;gap:16px;align-items:flex-start}
.fund-protection .fp-icon{font-size:1.5rem;flex-shrink:0}
.fund-protection .fp-content{flex:1}
.fund-protection .fp-title{font-weight:700;font-size:.92rem;color:var(--color-text);margin-bottom:6px}
.fund-protection .fp-text{font-size:.84rem;color:var(--color-text-secondary);line-height:1.7}
.fund-protection .fp-amounts{display:flex;gap:20px;margin-top:12px;flex-wrap:wrap}
.fund-protection .fp-amount{background:#fff;border:1px solid color-mix(in srgb,var(--color-success) 15%,white);border-radius:var(--radius);padding:8px 14px;font-size:.78rem}
.fund-protection .fp-amount strong{color:var(--color-success);font-weight:700}

/* ─── Enhanced Footer ─── */
.footer-licenses{border-top:1px solid rgba(255,255,255,.08);padding:20px 0;margin-bottom:16px}
.footer-licenses-title{font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.35);margin-bottom:12px;font-weight:600}
.footer-licenses-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.footer-license-item{font-size:.72rem;color:rgba(255,255,255,.45);line-height:1.5}
.footer-license-item strong{color:rgba(255,255,255,.65);font-weight:600;display:block}
.footer-address{border-top:1px solid rgba(255,255,255,.08);padding:16px 0;font-size:.76rem;color:rgba(255,255,255,.4);display:flex;gap:24px;flex-wrap:wrap;align-items:center}
.footer-address a{color:rgba(255,255,255,.55)}
.footer-address a:hover{color:rgba(255,255,255,.85)}

/* ─── Animations ─── */
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.section{animation:fadeInUp .5s ease both}
@media(prefers-reduced-motion:reduce){.hero-mockup,.market-cards,.tools-visual{animation:none}.hero-badge .badge-dot{animation:none;opacity:.8}.section{animation:none}.ticker-track{animation:none}}

/* ─── Responsive ─── */
@media(max-width:1024px){.footer-grid{grid-template-columns:repeat(2,1fr)}.hero-container{gap:32px}.hero-mockup{width:320px}.market-cards{width:300px}.tv-laptop{width:280px}.tv-phone{width:100px}.tv-tier{width:100px;padding:12px 10px}.tv-spread-card{width:240px}.tv-edu-card{width:240px}.tv-contact-card{width:220px}.nav-dropdown-menu{left:0;transform:none}}
@media(max-width:768px){.sticky-cta{display:block}.navbar-links{display:none}.navbar-actions{display:none}.navbar-toggle{display:block}.social-proof-inner{gap:16px}.sp-divider{display:none}.regulation-inner{gap:12px}.reg-divider{display:none}.awards-grid{gap:12px}.award-card{width:140px;padding:16px 12px}.perf-inner{flex-direction:column;gap:24px}.perf-item{border-right:none;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:20px}.perf-item:last-child{border-bottom:none;padding-bottom:0}.security-badges{gap:20px}.fund-protection{flex-direction:column}.footer-address{flex-direction:column;gap:8px}.hero h1{font-size:2rem}.hero p{font-size:.95rem}.hero{padding:60px 20px 52px;text-align:left}.hero--tools{padding:56px 20px 44px}.hero--legal{padding:36px 20px 28px}.hero-container{flex-direction:column;gap:32px}.hero-visual{width:100%;max-width:360px}.hero-mockup{width:100%}.market-cards{width:100%;max-width:340px}.tools-visual{width:100%;display:flex;justify-content:center}.tv-laptop{width:100%;max-width:320px}.section{padding:60px 20px}.section-title{font-size:1.65rem}.feature-card{padding:28px 24px}.pricing-card{padding:32px 24px}.stat-item{padding:16px 24px}.pricing-card.highlighted{transform:none}.footer{padding:48px 20px 20px}.footer-bottom{flex-direction:column;text-align:center}.two-col{grid-template-columns:1fr;gap:32px}.stats-bar{flex-direction:column;gap:0}.stats-bar .stat-divider{width:60%;height:1px;margin:0 auto}.step-connector{display:none}.steps-grid{gap:8px}.footer-grid{grid-template-columns:1fr 1fr}.footer-regulatory{gap:14px}.hero--corporate .hero-inner{text-align:left}.hero--corporate .hero-trust,.hero--corporate .hero-buttons{justify-content:flex-start}}
@media(max-width:640px){.hero h1{font-size:2rem}.section{padding:52px 16px}.feature-card{padding:24px 20px}.pricing-card{padding:28px 20px}.testimonial-card{padding:24px 20px}.stat-item{padding:14px 16px}.step-item{padding:20px 16px}}
@media(max-width:480px){.hero{padding:52px 16px 40px}.hero h1{font-size:1.8rem}.hero-visual{display:none}.hero-trust{flex-direction:column;gap:8px}.hero-buttons{flex-direction:column}.hero .btn-primary,.hero .btn-outline{width:100%;text-align:center}.features-grid{grid-template-columns:1fr}.pricing-grid{grid-template-columns:1fr}.icon-grid{grid-template-columns:repeat(2,1fr)}.testimonials-grid{grid-template-columns:1fr}.footer{padding:40px 16px 16px}.footer-grid{grid-template-columns:1fr;gap:28px}.section-title{font-size:1.45rem}.stat-value{font-size:2.2rem}.hero--tools .hero-inner{border-left-width:3px;padding-left:20px}}
${options.niche === 'crypto_exchange' ? `
/* ═══ Crypto Exchange — Web3 Dashboard Design ═══ */
:root{--color-accent-light:#34d399;--color-accent-glow:rgba(16,185,129,.35);--color-accent-subtle:rgba(16,185,129,.08);--color-gold:#f59e0b;--color-gold-glow:rgba(245,158,11,.25);--color-neon:#22d3ee;--gradient-accent:linear-gradient(135deg,#059669 0%,#10b981 50%,#34d399 100%);--gradient-hero:linear-gradient(160deg,#070d18 0%,#0c1a2e 40%,#0f2034 100%);--gradient-dark:linear-gradient(180deg,#070d18 0%,#0c1222 100%);--gradient-gold:linear-gradient(135deg,#f59e0b 0%,#fbbf24 100%);--font-mono:'SF Mono',Consolas,'Liberation Mono',monospace}

/* ─── Global overrides — dashboard feel ─── */
body{letter-spacing:-.01em}
h1,h2,h3,.section-title{letter-spacing:-.03em;font-weight:900}
.section-title{font-size:2rem;text-transform:uppercase;letter-spacing:.02em;position:relative;display:inline-block}
.section-title::after{content:'';display:block;width:48px;height:3px;background:var(--gradient-accent);margin-top:12px;border-radius:2px}
.section-subtitle{font-size:.95rem;max-width:560px}
.section-inner{text-align:center}
.section-inner .section-title{margin-left:auto;margin-right:auto}

/* ─── Animations ─── */
@keyframes revealUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes revealLeft{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes revealRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 15px rgba(16,185,129,.2)}50%{box-shadow:0 0 30px rgba(16,185,129,.4)}}
@keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes borderGlow{0%,100%{border-color:rgba(16,185,129,.15)}50%{border-color:rgba(16,185,129,.4)}}
@keyframes slideInLeft{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideInRight{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.section{opacity:0;animation:revealUp .7s ease forwards}
.section:nth-child(odd){animation-delay:.1s}
.section:nth-child(even){animation-delay:.2s}
.section-alt{animation-name:revealUp;animation-delay:.15s}

/* ─── Hero — side-by-side with integrated trader image ─── */
.hero{background:var(--gradient-hero);position:relative;overflow:hidden;padding:80px 28px 60px!important;text-align:left!important}
.hero::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='0.5' fill='%2310b981' fill-opacity='0.08'/%3E%3C/svg%3E");pointer-events:none;background-size:60px 60px}
.hero::after{content:'';position:absolute;top:-200px;right:-100px;width:700px;height:700px;background:radial-gradient(circle,rgba(16,185,129,.1) 0%,rgba(245,158,11,.04) 40%,transparent 70%);pointer-events:none;animation:floatY 8s ease-in-out infinite}
.hero-container{flex-direction:row!important;align-items:center!important;gap:48px!important;max-width:var(--max-w);margin:0 auto}
.hero-inner{max-width:560px!important;text-align:left!important;flex:1}
.hero h1{background:linear-gradient(135deg,#ffffff 0%,#a7f3d0 60%,#6ee7b7 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:3rem!important;line-height:1.1!important;animation:slideInLeft .8s ease .2s both;margin-bottom:20px}
.hero p{animation:slideInLeft .8s ease .4s both;max-width:480px!important;opacity:.8;font-size:1.05rem}
.hero-buttons{animation:slideInLeft .8s ease .6s both;justify-content:flex-start!important;gap:16px}
.hero .btn-primary{background:var(--gradient-accent);box-shadow:0 4px 20px var(--color-accent-glow);border:none;border-radius:8px!important;text-transform:uppercase;letter-spacing:.06em;font-size:.85rem!important;font-weight:800;padding:16px 36px!important;animation:pulseGlow 3s ease-in-out infinite}
.hero .btn-primary:hover{box-shadow:0 8px 32px rgba(16,185,129,.5);transform:translateY(-3px) scale(1.02)}
.hero .btn-outline{border-color:rgba(16,185,129,.3);color:#a7f3d0;border-radius:8px!important;text-transform:uppercase;letter-spacing:.06em;font-size:.85rem!important;font-weight:700;padding:16px 36px!important}
.hero .btn-outline:hover{background:rgba(16,185,129,.1);border-color:rgba(16,185,129,.6);transform:translateY(-2px)}
.hero-badge{background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.25);animation:slideInLeft .6s ease .1s both}
.hero-badge .badge-dot{background:#f59e0b;box-shadow:0 0 8px rgba(245,158,11,.6);animation:pulse 1.5s ease infinite}
.hero-pill{background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);color:#a7f3d0;transition:all .2s;border-radius:8px!important;font-family:var(--font-mono);font-size:.78rem!important;letter-spacing:.02em}
.hero-pill:hover{background:rgba(16,185,129,.2);border-color:rgba(16,185,129,.4)}
.hero-pills{animation:slideInLeft .8s ease .5s both}
.hero-micro span{color:rgba(167,243,208,.5)}
.hero-trust span{color:rgba(167,243,208,.4);border-color:rgba(16,185,129,.15)}
.hero-trustpilot{animation:slideInLeft .6s ease .15s both}
.hero-trustpilot .tp-stars{color:#f59e0b}

/* ─── Hero visual — trader image integrated into dark bg ─── */
.hero-visual{flex-shrink:0!important;width:auto!important;max-width:440px!important;animation:slideInRight .8s ease .3s both!important}
.hero-trader-img{position:relative;max-width:400px;margin:0 auto}
.trader-photo{width:100%;height:auto;border-radius:20px;box-shadow:0 24px 64px rgba(0,0,0,.5),0 0 80px rgba(16,185,129,.06);border:none;object-fit:cover;max-height:500px}
.hero-floating-card{position:absolute;display:flex;align-items:center;gap:10px;background:rgba(12,18,34,.9);backdrop-filter:blur(16px);border:1px solid rgba(16,185,129,.2);border-radius:14px;padding:12px 18px;box-shadow:0 8px 32px rgba(0,0,0,.3);animation:floatY 4s ease-in-out infinite;z-index:2}
.hero-floating-card.card-top{top:8%;right:-48px;animation-delay:0s}
.hero-floating-card.card-bottom{bottom:12%;left:-48px;animation-delay:2s}
.hfc-icon{font-size:1.5rem}
.hfc-label{font-size:.7rem;color:rgba(167,243,208,.5);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.08em}
.hfc-value{font-size:1rem;font-weight:800;color:#d1fae5;font-family:var(--font-mono)}
.hfc-value.up{color:#10b981}

/* ─── Mockup (unused for crypto but kept for fallback) ─── */
.mockup-topbar{border-bottom-color:rgba(16,185,129,.08)}
.mockup-topbar span{color:#6ee7b7}
.mockup-chart polyline{filter:drop-shadow(0 0 6px rgba(16,185,129,.5))}
.mockup-row{transition:background .15s;border-left:2px solid transparent}
.mockup-row:hover{background:rgba(16,185,129,.05);border-left-color:#10b981}
.mockup-row .up{color:#10b981;text-shadow:0 0 10px rgba(16,185,129,.4)}
.mockup-row .down{color:#ef4444;text-shadow:0 0 10px rgba(239,68,68,.4)}
.mockup-amount{color:#f0fdf4;font-family:var(--font-mono)}
.mockup-change.up{background:rgba(16,185,129,.15);color:#10b981}

/* ─── Buttons — SQUARE, uppercase, monospace (totally different from forex rounded pills) ─── */
.btn-primary{border-radius:8px!important;text-transform:uppercase;letter-spacing:.06em;font-weight:800;font-size:.85rem}
.btn-outline{border-radius:8px!important;text-transform:uppercase;letter-spacing:.06em;font-weight:700;font-size:.85rem;border-width:2px}
.btn-secondary{border-radius:8px!important;text-transform:uppercase;letter-spacing:.06em}
.btn-primary:focus-visible,.btn-outline:focus-visible{outline:2px solid var(--color-accent-light);outline-offset:3px}

/* ─── Promo bar — emerald gradient with gold CTA ─── */
.promo-bar{background:linear-gradient(90deg,#047857 0%,#059669 40%,#0d9488 100%);animation:shimmer 8s linear infinite;background-size:200% 100%}
.promo-bar a{color:#fbbf24;font-weight:700;text-decoration:underline;text-underline-offset:3px}
.promo-bar strong{color:#ecfdf5}

/* ─── Social proof — animated items ─── */
.social-proof-bar{background:var(--color-bg);border-bottom:1px solid var(--color-border)}
.sp-item{animation:revealUp .5s ease both}
.sp-item:nth-child(1){animation-delay:.1s}.sp-item:nth-child(3){animation-delay:.2s}.sp-item:nth-child(5){animation-delay:.3s}.sp-item:nth-child(7){animation-delay:.4s}.sp-item:nth-child(9){animation-delay:.5s}
.sp-item strong{color:#059669;font-weight:800}

/* ─── Ticker — dark with emerald/red glow ─── */
.market-ticker{background:#070d18;border-bottom:1px solid rgba(16,185,129,.08)}
.ticker-change.up{color:#10b981;text-shadow:0 0 8px rgba(16,185,129,.4);font-weight:700}
.ticker-change.down{color:#ef4444;text-shadow:0 0 8px rgba(239,68,68,.4);font-weight:700}
.ticker-symbol{color:#a7f3d0;font-weight:700;font-family:var(--font-mono);font-size:.82rem}
.ticker-price{color:#d1fae5;font-family:var(--font-mono)}

/* ─── Regulation bar — dark emerald ─── */
.regulation-bar{background:linear-gradient(180deg,#070d18,#0c1826)}
.reg-label{color:#d1fae5}
.reg-num{color:rgba(167,243,208,.4)}
.reg-item{animation:revealUp .5s ease both}
.reg-item:nth-child(1){animation-delay:.05s}.reg-item:nth-child(3){animation-delay:.1s}.reg-item:nth-child(5){animation-delay:.15s}.reg-item:nth-child(7){animation-delay:.2s}.reg-item:nth-child(9){animation-delay:.25s}

/* ─── Feature cards — BENTO GRID (totally different from forex 3-col uniform) ─── */
.features-grid{display:grid!important;grid-template-columns:repeat(3,1fr)!important;grid-auto-rows:minmax(200px,auto)!important;gap:16px!important}
.feature-card{border:1px solid rgba(16,185,129,.1)!important;background:rgba(16,185,129,.03)!important;backdrop-filter:blur(8px);border-radius:16px!important;transition:all .3s ease;animation:scaleIn .5s ease both;position:relative;overflow:hidden}
.feature-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--gradient-accent);opacity:0;transition:opacity .3s}
.feature-card:hover::before{opacity:1}
.features-grid .feature-card:nth-child(1){grid-column:span 2!important;grid-row:span 2!important}
.features-grid .feature-card:nth-child(1) h3{font-size:1.4rem}
.features-grid .feature-card:nth-child(1) p{font-size:.95rem}
.features-grid .feature-card:nth-child(1) .feature-card-icon{width:72px;height:72px;font-size:2.4rem}
.features-grid .feature-card:nth-child(2){grid-column:span 1}
.features-grid .feature-card:nth-child(3){grid-column:span 1}
.features-grid .feature-card:nth-child(4){grid-column:span 1}
.features-grid .feature-card:nth-child(5){grid-column:span 1}
.features-grid .feature-card:nth-child(6){grid-column:span 1}
.features-grid .feature-card:nth-child(1){animation-delay:.1s}.features-grid .feature-card:nth-child(2){animation-delay:.15s}.features-grid .feature-card:nth-child(3){animation-delay:.2s}.features-grid .feature-card:nth-child(4){animation-delay:.25s}.features-grid .feature-card:nth-child(5){animation-delay:.3s}.features-grid .feature-card:nth-child(6){animation-delay:.35s}
.feature-card:hover{border-color:rgba(16,185,129,.3)!important;box-shadow:0 12px 40px rgba(16,185,129,.1);transform:translateY(-6px)}
.feature-card-icon{font-size:2rem;width:60px;height:60px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(16,185,129,.08),rgba(16,185,129,.18))!important;border-radius:50%!important;margin-bottom:18px;transition:all .3s;border:1px solid rgba(16,185,129,.12)}
.feature-card:hover .feature-card-icon{background:linear-gradient(135deg,rgba(16,185,129,.15),rgba(16,185,129,.3))!important;transform:scale(1.1);border-color:rgba(16,185,129,.3)}
.feature-card h3{color:var(--color-primary);font-weight:800}
.feature-card p{color:var(--color-text-secondary)}

/* ─── Stats — 2x2 GLASS CARD GRID (totally different from forex horizontal bar) ─── */
.stats-bar{display:grid!important;grid-template-columns:repeat(2,1fr)!important;gap:16px!important;flex-direction:unset!important;flex-wrap:unset!important;max-width:700px;margin:0 auto}
.stat-item{background:rgba(16,185,129,.04)!important;border:1px solid rgba(16,185,129,.1)!important;border-radius:16px!important;padding:36px 28px!important;text-align:center;backdrop-filter:blur(8px);transition:all .3s}
.stat-item:hover{border-color:rgba(16,185,129,.25)!important;background:rgba(16,185,129,.08)!important;transform:translateY(-4px)}
.stat-divider{display:none!important}
.stat-value{color:#10b981!important;font-weight:900;font-size:3rem;font-family:var(--font-mono)}
.stat-label{color:var(--color-text-secondary);text-transform:uppercase;font-size:.7rem;letter-spacing:.12em;font-weight:800;margin-top:8px}
.stat-item{animation:countUp .6s ease both}
.stat-item:nth-child(1){animation-delay:.2s}.stat-item:nth-child(2){animation-delay:.35s}.stat-item:nth-child(3){animation-delay:.5s}.stat-item:nth-child(4){animation-delay:.65s}

/* ─── Data table — live exchange feel ─── */
.data-table{border:1px solid rgba(16,185,129,.15);overflow:hidden;border-radius:16px!important}
.data-table th{background:linear-gradient(90deg,#070d18,#0c1826);color:#a7f3d0;border-bottom:2px solid rgba(16,185,129,.2);font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;font-family:var(--font-mono)}
.data-table td{font-family:var(--font-mono);font-size:.85rem;transition:all .15s}
.data-table td:nth-child(3){font-weight:700;color:#059669}
.data-table tbody tr{transition:all .2s;border-left:3px solid transparent}
.data-table tbody tr:hover{background:rgba(16,185,129,.04);border-left-color:#10b981}
.data-table tbody tr:hover td:first-child{color:#059669;font-weight:700}

/* ─── Steps — horizontal timeline (different from forex vertical cards) ─── */
.steps-grid{position:relative}
.step-number{background:var(--gradient-accent);box-shadow:0 4px 16px var(--color-accent-glow);transition:all .3s;font-family:var(--font-mono);font-weight:900}
.step-item{animation:revealUp .6s ease both;border:1px solid rgba(16,185,129,.08);border-radius:16px!important;background:rgba(16,185,129,.02);transition:all .3s}
.step-item:hover{border-color:rgba(16,185,129,.2);background:rgba(16,185,129,.05)}
.step-item:nth-child(1){animation-delay:.1s}.step-item:nth-child(2){animation-delay:.25s}.step-item:nth-child(3){animation-delay:.4s}
.step-item:hover .step-number{transform:scale(1.15) rotate(5deg);box-shadow:0 8px 24px var(--color-accent-glow)}
.step-connector{background:linear-gradient(90deg,#10b981,#34d399);opacity:.25;height:2px}

/* ─── CTA section — dramatic dark with gold button ─── */
.cta-section{background:var(--gradient-hero)!important;position:relative;padding:100px 28px!important}
.cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 100%,rgba(16,185,129,.12),transparent 60%)}
.cta-section::after{content:'';position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:500px;height:500px;background:radial-gradient(circle,rgba(245,158,11,.05) 0%,transparent 70%);pointer-events:none}
.cta-section h2{animation:revealUp .6s ease both;position:relative;color:#fff!important;-webkit-text-fill-color:#fff}
.cta-section h2::after{background:var(--gradient-gold)!important;margin:12px auto 0}
.cta-section p{color:rgba(255,255,255,.7)}
.cta-section .btn-primary{background:var(--gradient-gold)!important;color:#1a1a2e!important;font-weight:900;box-shadow:0 4px 24px var(--color-gold-glow);position:relative;border-radius:8px!important;text-transform:uppercase;letter-spacing:.08em;padding:18px 44px!important;font-size:.9rem!important}
.cta-section .btn-primary:hover{box-shadow:0 8px 36px rgba(245,158,11,.45);transform:translateY(-3px) scale(1.02)}

/* ─── Sections — alternating dark/light for rhythm ─── */
.section{padding:72px 28px}
.section-alt{background:rgba(16,185,129,.015)!important;border-top:1px solid rgba(16,185,129,.04);border-bottom:1px solid rgba(16,185,129,.04)}

/* ─── Awards — horizontal scroll strip (different from forex grid) ─── */
.awards-section{background:var(--gradient-dark)!important;border-top:1px solid rgba(16,185,129,.06);border-bottom:1px solid rgba(16,185,129,.06);padding:48px 28px!important;overflow:hidden}
.awards-inner{max-width:var(--max-w);margin:0 auto}
.awards-label{color:rgba(167,243,208,.4)!important;text-transform:uppercase;letter-spacing:.15em;font-family:var(--font-mono);font-size:.72rem}
.awards-title{color:#d1fae5!important;font-size:1.4rem!important;margin-bottom:32px}
.awards-grid{display:flex!important;overflow-x:auto;gap:12px;padding-bottom:8px;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.awards-grid::-webkit-scrollbar{display:none}
.award-card{border:1px solid rgba(16,185,129,.1)!important;background:rgba(16,185,129,.04)!important;border-radius:12px!important;flex-shrink:0;min-width:180px;transition:all .3s;animation:scaleIn .5s ease both}
.award-card:nth-child(1){animation-delay:.1s}.award-card:nth-child(2){animation-delay:.15s}.award-card:nth-child(3){animation-delay:.2s}.award-card:nth-child(4){animation-delay:.25s}.award-card:nth-child(5){animation-delay:.3s}.award-card:nth-child(6){animation-delay:.35s}
.award-card:hover{border-color:rgba(16,185,129,.3)!important;background:rgba(16,185,129,.08)!important;transform:translateY(-4px)}
.award-icon{font-size:2.4rem}
.award-name{color:#d1fae5!important}
.award-source{color:rgba(167,243,208,.4)!important}
.award-year{color:#10b981!important;font-family:var(--font-mono);font-weight:700}

/* ─── Performance bar — emerald glow with mono numbers ─── */
.perf-bar{background:var(--gradient-dark)}
.perf-item{animation:countUp .5s ease both}
.perf-item:nth-child(1){animation-delay:.1s}.perf-item:nth-child(2){animation-delay:.2s}.perf-item:nth-child(3){animation-delay:.3s}.perf-item:nth-child(4){animation-delay:.4s}.perf-item:nth-child(5){animation-delay:.5s}
.perf-value{color:#fff;font-weight:900;font-family:var(--font-mono)}
.perf-unit{color:#10b981;font-family:var(--font-mono)}
.perf-label{color:rgba(167,243,208,.4);text-transform:uppercase;letter-spacing:.08em;font-size:.68rem}

/* ─── Security badges — glass cards (different from forex boxes) ─── */
.security-bar{background:linear-gradient(180deg,#0c1826 0%,#070d18 100%)}
.security-badge{background:rgba(16,185,129,.04);border:1px solid rgba(16,185,129,.1);border-radius:16px!important;padding:24px 18px;transition:all .3s;animation:scaleIn .4s ease both}
.security-badge:nth-child(1){animation-delay:.05s}.security-badge:nth-child(2){animation-delay:.1s}.security-badge:nth-child(3){animation-delay:.15s}.security-badge:nth-child(4){animation-delay:.2s}.security-badge:nth-child(5){animation-delay:.25s}.security-badge:nth-child(6){animation-delay:.3s}
.security-badge:hover{border-color:rgba(16,185,129,.3);background:rgba(16,185,129,.08);transform:translateY(-4px)}
.sb-icon{font-size:1.7rem}
.sb-label{color:#d1fae5;font-weight:700;font-family:var(--font-mono);font-size:.82rem}
.sb-sub{color:rgba(167,243,208,.4)}

/* ─── Fund protection — emerald accent card ─── */
.fund-protection{border:1px solid rgba(16,185,129,.12);border-left:4px solid #10b981;background:linear-gradient(135deg,rgba(16,185,129,.03),rgba(245,158,11,.02),transparent);animation:revealLeft .6s ease both;border-radius:16px!important}
.fp-title{color:var(--color-primary);font-weight:800}
.fp-amount{background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.12);transition:all .2s;border-radius:10px!important}
.fp-amount:hover{border-color:rgba(16,185,129,.3);background:rgba(16,185,129,.1)}
.fp-amount strong{color:#059669}

/* ─── FAQ — clean expand ─── */
.faq-q{color:var(--color-primary);font-weight:700;transition:color .2s}
.faq-item.open .faq-q{color:#059669}
.faq-q::after{color:#10b981;transition:transform .3s}
.faq-item.open .faq-q::after{transform:rotate(45deg)}
.faq-item{animation:revealUp .4s ease both;border-radius:12px!important}
.faq-item:nth-child(1){animation-delay:.05s}.faq-item:nth-child(2){animation-delay:.1s}.faq-item:nth-child(3){animation-delay:.15s}.faq-item:nth-child(4){animation-delay:.2s}.faq-item:nth-child(5){animation-delay:.25s}.faq-item:nth-child(6){animation-delay:.3s}

/* ─── Section CTAs — gradient with glow ─── */
.section-cta .btn-primary{background:var(--gradient-accent);box-shadow:0 4px 16px var(--color-accent-glow);transition:all .3s;border-radius:8px!important;text-transform:uppercase;letter-spacing:.06em;padding:14px 32px}
.section-cta .btn-primary:hover{box-shadow:0 8px 28px rgba(16,185,129,.4);transform:translateY(-2px) scale(1.02)}

/* ─── Footer — DARK GLASS with centered layout (different from forex 5-col) ─── */
.footer{background:var(--gradient-dark);border-top:1px solid rgba(16,185,129,.06)}
.footer-grid{grid-template-columns:1.5fr 1fr 1fr 1fr!important;gap:40px}
.footer h4{color:#10b981!important;text-transform:uppercase;letter-spacing:.1em;font-size:.78rem!important;font-family:var(--font-mono)}
.footer a{color:rgba(255,255,255,.5)!important}
.footer a:hover{color:#10b981!important}
.footer p{color:rgba(255,255,255,.4)}
.footer-social a{transition:all .2s;width:36px;height:36px;border-radius:50%!important;border:1px solid rgba(16,185,129,.15)!important;display:inline-flex;align-items:center;justify-content:center;font-size:.85rem}
.footer-social a:hover{color:#10b981!important;border-color:rgba(16,185,129,.4)!important;background:rgba(16,185,129,.08);transform:translateY(-2px)}
.footer-licenses{border-color:rgba(16,185,129,.08)}
.footer-licenses-title{color:#34d399;font-weight:700;text-transform:uppercase;letter-spacing:.1em;font-size:.74rem;font-family:var(--font-mono)}
.footer-license-item{border-radius:10px;background:rgba(16,185,129,.02);padding:14px 18px;border:1px solid rgba(16,185,129,.06)}
.footer-license-item strong{color:#a7f3d0}
.footer-regulatory span{background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.1);border-radius:8px!important;padding:6px 14px;font-size:.72rem;transition:all .2s;font-family:var(--font-mono)}
.footer-regulatory span:hover{background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.25)}
.footer-payments span{color:rgba(167,243,208,.4);font-family:var(--font-mono);font-size:.82rem}
.footer-risk{border-top-color:rgba(16,185,129,.08);font-size:.72rem;color:rgba(255,255,255,.25)}
.footer-app-badge{border-color:rgba(16,185,129,.15)!important;border-radius:10px!important}
.footer-app-badge:hover{border-color:rgba(16,185,129,.35)!important;background:rgba(16,185,129,.05)!important}
.footer-bottom{border-top:1px solid rgba(16,185,129,.06);padding-top:24px;margin-top:24px}
.footer-bottom p{text-align:center}
.footer-address{justify-content:center;opacity:.6;font-size:.8rem}

/* ─── Sticky CTA — emerald glow ─── */
.sticky-cta .btn-primary{background:var(--gradient-accent);box-shadow:0 4px 20px var(--color-accent-glow);animation:pulseGlow 3s ease-in-out infinite;border-radius:8px!important;text-transform:uppercase;letter-spacing:.06em}

/* ─── Live activity — emerald pulse with glass ─── */
.live-activity{border:1px solid rgba(16,185,129,.15);box-shadow:0 4px 24px rgba(0,0,0,.3);animation:revealUp .4s ease both;background:rgba(12,18,34,.9)!important;backdrop-filter:blur(16px);border-radius:14px!important}
.la-dot{background:#10b981;box-shadow:0 0 10px rgba(16,185,129,.6);animation:pulse 1.5s ease infinite}

/* ─── Navbar — glass with emerald accent ─── */
.navbar.scrolled{background:rgba(7,13,24,.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(16,185,129,.06)}
.navbar-cta{background:var(--gradient-accent)!important;box-shadow:0 2px 12px var(--color-accent-glow);transition:all .3s!important;border-radius:8px!important;text-transform:uppercase;letter-spacing:.04em;font-size:.78rem!important;font-weight:800}
.navbar-cta:hover{box-shadow:0 4px 20px rgba(16,185,129,.4)!important;transform:translateY(-1px)}
.navbar-brand{font-weight:900;letter-spacing:-.02em;font-family:var(--font-mono)}
.navbar-links a{transition:color .2s;font-size:.85rem;letter-spacing:.01em}
.navbar-links a:hover,.navbar-links a.active{color:#10b981!important}

/* ─── Announcement bar ─── */
.announcement-bar{background:rgba(16,185,129,.04);border-bottom:1px solid rgba(16,185,129,.06);color:var(--color-text-secondary)}
.announcement-bar a{color:#059669;font-weight:700}

/* ─── Traders bar — avatars + live ─── */
.traders-bar{background:linear-gradient(90deg,rgba(16,185,129,.03),rgba(16,185,129,.06),rgba(16,185,129,.03));border-bottom:1px solid rgba(16,185,129,.08);padding:14px 28px}
.traders-inner{max-width:var(--max-w);margin:0 auto;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap}
.traders-avatars{display:flex;align-items:center}
.trader-avatar{width:36px;height:36px;border-radius:50%;border:2px solid rgba(16,185,129,.3);margin-left:-10px;box-shadow:0 2px 8px rgba(0,0,0,.2);object-fit:cover;transition:transform .2s}
.trader-avatar:first-child{margin-left:0}
.trader-avatar:hover{transform:scale(1.15);z-index:2}
.trader-more{background:var(--gradient-accent);color:#fff;font-size:.65rem;font-weight:800;display:flex;align-items:center;justify-content:center;letter-spacing:-.02em}
.traders-text{font-size:.88rem;color:var(--color-text-secondary)}
.traders-text strong{color:#059669}
.traders-dot{width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;margin-right:6px;animation:pulse 1.5s ease infinite;box-shadow:0 0 8px rgba(16,185,129,.5)}
.traders-live{font-size:.78rem;font-weight:700;color:#10b981;display:flex;align-items:center;background:rgba(16,185,129,.08);padding:4px 12px;border-radius:8px;border:1px solid rgba(16,185,129,.15);font-family:var(--font-mono)}

/* ─── Cookie banner ─── */
.btn-accept{background:#10b981!important;border-radius:8px!important}
.btn-accept:hover{background:#059669!important}
.btn-decline{border-radius:8px!important}

/* ─── Media bar ─── */
.media-label{color:var(--color-text-light);text-transform:uppercase;letter-spacing:.15em;font-family:var(--font-mono);font-size:.7rem!important}
.media-logo{color:var(--color-text-secondary);transition:color .2s;font-family:var(--font-mono)}
.media-logo:hover{color:#059669}

/* ─── Testimonials — glass cards ─── */
.testimonial-card{border:1px solid rgba(16,185,129,.08)!important;background:rgba(16,185,129,.02)!important;border-radius:16px!important}
.testimonial-card::before{color:rgba(16,185,129,.15)!important}
.testimonial-card:hover{border-color:rgba(16,185,129,.2)!important}

/* ─── Pricing cards — glass effect ─── */
.pricing-card{border:1px solid rgba(16,185,129,.08)!important;border-radius:16px!important;background:rgba(16,185,129,.02)!important}
.pricing-card.highlighted{border-color:rgba(16,185,129,.25)!important;background:rgba(16,185,129,.04)!important}
.pricing-card.highlighted::before{background:var(--gradient-accent)!important}

/* ═══ RESPONSIVE ═══ */

/* Large desktop (1440+) */
@media(min-width:1440px){
.hero{padding:120px 40px 100px!important}
.hero h1{font-size:4rem!important}
.hero-mockup{max-width:740px!important}
.features-grid{gap:20px!important}
.section{padding:88px 40px}
}

/* Desktop (1024+) */
@media(min-width:1024px){
.hero h1{font-size:3.4rem}
.features-grid{grid-template-columns:repeat(3,1fr)!important;gap:16px!important}
.features-grid .feature-card:nth-child(1){grid-column:span 2!important;grid-row:span 2!important}
.stats-bar{grid-template-columns:repeat(2,1fr)!important;max-width:700px}
.steps-grid{grid-template-columns:repeat(3,1fr);gap:28px}
.step-item{padding:32px 24px}
.data-table td,.data-table th{padding:16px 24px}
.awards-grid{gap:16px}
.traders-inner{gap:20px}
.trader-avatar{width:40px;height:40px;margin-left:-12px}
.social-proof-inner{gap:32px}
.section{padding:80px 28px}
.cta-section{padding:100px 28px}
.cta-section h2{font-size:2.2rem}
.perf-inner{gap:0}
.perf-item{padding:32px 36px}
.security-badges{gap:16px}
.security-badge{padding:24px 18px;min-width:130px}
.fund-protection{padding:40px;gap:24px}
.faq-list{max-width:800px;margin:0 auto}
.footer-grid{grid-template-columns:1.5fr 1fr 1fr 1fr!important}
}

/* Laptop (768-1024) */
@media(min-width:768px) and (max-width:1023px){
.hero{padding:80px 24px 64px!important}
.hero h1{font-size:2.6rem!important}
.hero-mockup{max-width:560px!important}
.features-grid{grid-template-columns:repeat(2,1fr)!important}
.features-grid .feature-card:nth-child(1){grid-column:span 2!important;grid-row:span 1!important}
.feature-card{padding:28px 22px}
.stats-bar{grid-template-columns:repeat(2,1fr)!important;max-width:100%}
.steps-grid{grid-template-columns:repeat(3,1fr);gap:20px}
.data-table{font-size:.82rem}
.traders-inner{gap:14px}
.trader-avatar{width:34px;height:34px}
.awards-grid{gap:12px}
.award-card{min-width:160px}
.footer-grid{grid-template-columns:1fr 1fr!important}
}

/* Mobile */
@media(max-width:767px){
.hero{padding:56px 20px 48px!important}
.hero h1{font-size:2.2rem!important;line-height:1.12!important}
.hero-container{flex-direction:column!important;gap:24px!important;text-align:center!important}
.hero-inner{text-align:center!important}
.hero-buttons{justify-content:center!important}
.hero-pills{justify-content:center!important}
.hero-trust{justify-content:center!important}
.hero-visual{max-width:300px!important;margin:0 auto}
.hero-mockup{max-width:100%!important;border-radius:12px!important}
.hero-trader-img{max-width:260px}
.trader-photo{max-height:320px;border-radius:16px}
.hero-floating-card.card-top{right:-16px;top:8%;padding:8px 12px}
.hero-floating-card.card-bottom{left:-16px;bottom:12%;padding:8px 12px}
.hfc-icon{font-size:1.2rem}
.hfc-label{font-size:.65rem}
.hfc-value{font-size:.85rem}
.hero-pills{flex-wrap:wrap;gap:8px}
.hero-pill{font-size:.75rem;padding:6px 12px}
.features-grid{grid-template-columns:1fr!important;gap:12px!important}
.features-grid .feature-card:nth-child(1){grid-column:span 1!important;grid-row:span 1!important}
.features-grid .feature-card:nth-child(1) h3{font-size:1.1rem}
.features-grid .feature-card:nth-child(1) .feature-card-icon{width:56px;height:56px;font-size:2rem}
.feature-card{padding:24px 20px}
.feature-card-icon{width:52px;height:52px;font-size:1.8rem}
.stats-bar{grid-template-columns:1fr!important;gap:12px!important}
.stat-item{padding:24px 20px!important}
.stat-value{font-size:2.4rem}
.steps-grid{grid-template-columns:1fr;gap:12px}
.data-table td,.data-table th{padding:12px 14px}
.data-table{font-size:.8rem}
.traders-avatars{margin-right:4px}
.trader-avatar{width:30px;height:30px;margin-left:-8px}
.traders-text{font-size:.8rem}
.traders-live{font-size:.72rem;padding:3px 10px}
.cta-section{padding:60px 20px!important}
.cta-section h2{font-size:1.6rem}
.cta-section .btn-primary{padding:14px 28px!important;font-size:.82rem!important}
.awards-section{padding:36px 20px!important}
.awards-grid{gap:10px}
.award-card{min-width:160px;padding:20px 16px}
.security-badges{gap:12px}
.security-badge{padding:14px 10px;min-width:0;border-radius:12px!important}
.fund-protection{padding:24px 20px;border-radius:12px!important}
.perf-inner{flex-direction:column;gap:0}
.perf-item{padding:20px 16px}
.footer-grid{grid-template-columns:1fr!important;gap:28px}
.section-title{font-size:1.5rem}
.section-title::after{width:36px;height:2px;margin-top:8px}
}

/* Reduced motion */
@media(prefers-reduced-motion:reduce){.section,.feature-card,.award-card,.security-badge,.stat-item,.step-item,.faq-item,.perf-item,.sp-item,.reg-item,.hero h1,.hero p,.hero-buttons,.hero-pills,.hero-badge,.hero-trustpilot,.hero-mockup,.hero-visual,.hero-visual *,.live-activity,.fund-protection{animation:none!important;opacity:1!important;transform:none!important}}
` : ''}
${options.niche === 'prop_trading' ? `
/* ═══ Prop Trading — Bright, Young, Animated ═══ */
:root{--color-accent:#f97316;--color-accent-light:#fb923c;--color-accent-glow:rgba(249,115,22,.3);--color-accent-subtle:rgba(249,115,22,.06);--color-secondary:#8b5cf6;--color-secondary-glow:rgba(139,92,246,.25);--color-pink:#ec4899;--gradient-accent:linear-gradient(135deg,#f97316 0%,#f59e0b 50%,#fb923c 100%);--gradient-hero:linear-gradient(135deg,#fff7ed 0%,#fff 40%,#faf5ff 100%);--gradient-fun:linear-gradient(135deg,#f97316 0%,#ec4899 50%,#8b5cf6 100%);--gradient-card:linear-gradient(135deg,#fff 0%,#fffbeb 100%);--radius-fun:20px;--font-display:'Inter',-apple-system,sans-serif}

/* ─── Global — bright, airy, friendly ─── */
body{background:#fff!important;color:#1e1b4b}
h1,h2,h3{font-weight:900;letter-spacing:-.03em;color:#1e1b4b}
.section{background:#fff}
.section-alt{background:linear-gradient(180deg,#fff7ed 0%,#fff 100%)!important}
.section-title{font-size:2.2rem;position:relative;display:inline-block}
.section-title::after{content:'';display:block;width:60px;height:4px;background:var(--gradient-fun);margin:14px auto 0;border-radius:99px}
.section-subtitle{font-size:1rem;color:#64748b;max-width:560px}
.section-inner{text-align:center}

/* ─── Animations — lots of them! ─── */
@keyframes revealUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
@keyframes revealDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
@keyframes revealLeft{from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)}}
@keyframes revealRight{from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
@keyframes bounceIn{0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(.95)}100%{transform:scale(1)}}
@keyframes slideUp{from{opacity:0;transform:translateY(100px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes wiggle{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(249,115,22,.2)}50%{box-shadow:0 0 40px rgba(249,115,22,.4)}}
@keyframes slideInBounce{0%{opacity:0;transform:translateY(40px)}60%{transform:translateY(-8px)}80%{transform:translateY(4px)}100%{opacity:1;transform:translateY(0)}}
@keyframes countUp{from{opacity:0;transform:translateY(15px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes borderDance{0%{border-color:rgba(249,115,22,.15)}33%{border-color:rgba(139,92,246,.15)}66%{border-color:rgba(236,72,153,.15)}100%{border-color:rgba(249,115,22,.15)}}
@keyframes iconBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes fadeInStagger{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}

.section{opacity:0;animation:slideInBounce .8s ease forwards}
.section:nth-child(odd){animation-delay:.1s}
.section:nth-child(even){animation-delay:.2s}
.section-alt{animation-delay:.15s}

/* ─── Hero — BRIGHT WHITE with colorful accents (opposite of both forex/crypto dark heroes) ─── */
.hero{background:var(--gradient-hero)!important;position:relative;overflow:hidden;padding:80px 28px 70px!important}
.hero::before{content:'';position:absolute;top:-200px;right:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(249,115,22,.08) 0%,rgba(236,72,153,.04) 40%,transparent 70%);pointer-events:none;animation:float 8s ease-in-out infinite}
.hero::after{content:'';position:absolute;bottom:-150px;left:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(139,92,246,.06) 0%,transparent 60%);pointer-events:none;animation:float 10s ease-in-out infinite 3s}
.hero h1{color:#1e1b4b!important;-webkit-text-fill-color:#1e1b4b!important;font-size:3.2rem!important;line-height:1.08!important;animation:revealLeft .8s ease .2s both}
.hero h1 strong,.hero h1 em{background:var(--gradient-fun);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-style:normal}
.hero p{color:#475569!important;animation:revealLeft .8s ease .4s both;font-size:1.05rem}
.hero-buttons{animation:revealLeft .8s ease .6s both}
.hero .btn-primary{background:var(--gradient-fun)!important;border:none!important;border-radius:50px!important;padding:16px 40px!important;font-size:.9rem!important;font-weight:800;box-shadow:0 8px 30px var(--color-accent-glow);animation:glow 3s ease-in-out infinite;color:#fff!important}
.hero .btn-primary:hover{box-shadow:0 12px 40px rgba(249,115,22,.45);transform:translateY(-4px) scale(1.03)}
.hero .btn-outline{border-color:#e2e8f0!important;color:#1e1b4b!important;border-radius:50px!important;padding:16px 40px!important;font-size:.9rem!important;font-weight:700;background:#fff!important;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.hero .btn-outline:hover{border-color:#f97316!important;color:#f97316!important;transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.08)}
.hero-badge{background:linear-gradient(135deg,rgba(249,115,22,.08),rgba(236,72,153,.06))!important;border:1px solid rgba(249,115,22,.15)!important;border-radius:50px!important;animation:bounceIn .8s ease .1s both;color:#f97316!important}
.hero-badge .badge-dot{background:var(--gradient-fun);box-shadow:0 0 8px var(--color-accent-glow);animation:pulse 1.5s ease infinite}
.hero-pill{background:#fff!important;border:1px solid #e2e8f0!important;color:#475569!important;border-radius:50px!important;font-size:.82rem!important;box-shadow:0 2px 8px rgba(0,0,0,.03);transition:all .3s}
.hero-pill:hover{border-color:#f97316!important;color:#f97316!important;transform:translateY(-2px);box-shadow:0 4px 12px rgba(249,115,22,.1)}
.hero-pills{animation:revealLeft .8s ease .5s both}
.hero-micro span{color:#94a3b8!important}
.hero-trust span{color:#64748b!important;border-color:#e2e8f0!important}
.hero-trustpilot{animation:revealUp .6s ease .15s both}
.hero-trustpilot .tp-stars{color:#f97316!important}
.hero-trustpilot .tp-score{color:#1e1b4b!important;font-weight:800}
.hero-trustpilot .tp-text{color:#64748b!important}

/* ─── Hero visual — trader image with fun floating cards ─── */
.hero-container{align-items:center!important}
.hero-visual{animation:revealRight .8s ease .3s both!important}
.hero-trader-img{position:relative;max-width:400px;margin:0 auto}
.trader-photo{width:100%;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,.1);border:3px solid #fff;object-fit:cover;max-height:460px}
.hero-floating-card{position:absolute;display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #f1f5f9;border-radius:16px;padding:12px 18px;box-shadow:0 8px 30px rgba(0,0,0,.08);z-index:2}
.hero-floating-card.card-top{top:12%;right:-50px;animation:float 4s ease-in-out infinite}
.hero-floating-card.card-bottom{bottom:18%;left:-50px;animation:float 4s ease-in-out infinite 2s}
.hfc-icon{font-size:1.5rem}
.hfc-label{font-size:.7rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;font-weight:600}
.hfc-value{font-size:1rem;font-weight:800;color:#1e1b4b}
.hfc-value.up{color:#10b981}

/* ─── Mockup — light dashboard (for forex-style hero on prop_trading) ─── */
.hero-mockup{background:#fff!important;border:1px solid #e2e8f0!important;box-shadow:0 20px 60px rgba(0,0,0,.08)!important;border-radius:20px!important;animation:revealRight .8s ease .3s both}
.mockup-topbar{border-bottom-color:#f1f5f9!important}
.mockup-topbar span{color:#f97316!important}
.mockup-amount{color:#1e1b4b!important;font-weight:900}
.mockup-change.up{background:rgba(16,185,129,.1)!important;color:#10b981!important;border-radius:50px}
.mockup-sublabel{color:#94a3b8!important}
.mockup-row{border-left:3px solid transparent;transition:all .2s}
.mockup-row:hover{background:rgba(249,115,22,.04);border-left-color:#f97316}
.mockup-row span:first-child{color:#1e1b4b!important;font-weight:600}
.mockup-row .up{color:#10b981!important}
.mockup-row .down{color:#ef4444!important}

/* ─── Buttons — EXTRA ROUNDED, gradient, playful ─── */
.btn-primary{border-radius:50px!important;font-weight:800;background:var(--gradient-fun)!important;color:#fff!important;box-shadow:0 4px 16px var(--color-accent-glow);transition:all .3s}
.btn-primary:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 8px 24px var(--color-accent-glow)}
.btn-outline{border-radius:50px!important;font-weight:700;border-color:#e2e8f0!important;color:#1e1b4b!important;background:#fff!important}
.btn-outline:hover{border-color:#f97316!important;color:#f97316!important}
.btn-primary:focus-visible,.btn-outline:focus-visible{outline:3px solid #f97316;outline-offset:3px}

/* ─── Promo bar — fun gradient ─── */
.promo-bar{background:var(--gradient-fun)!important;animation:gradientShift 6s ease infinite;background-size:200% 200%!important;font-weight:600}
.promo-bar a{color:#fff!important;text-decoration:underline;font-weight:800}
.promo-bar strong{color:#fff!important}

/* ─── Social proof — colorful ─── */
.social-proof-bar{background:#fff!important;border-bottom:1px solid #f1f5f9}
.sp-item{animation:fadeInStagger .5s ease both}
.sp-item:nth-child(1){animation-delay:.1s}.sp-item:nth-child(3){animation-delay:.2s}.sp-item:nth-child(5){animation-delay:.3s}.sp-item:nth-child(7){animation-delay:.4s}.sp-item:nth-child(9){animation-delay:.5s}
.sp-item strong{color:#f97316!important;font-weight:800}

/* ─── Ticker ─── */
.market-ticker{background:#1e1b4b!important;border-bottom:none}
.ticker-symbol{color:#fb923c!important;font-weight:700}
.ticker-price{color:#e2e8f0}
.ticker-change.up{color:#34d399!important;font-weight:700}
.ticker-change.down{color:#f87171!important;font-weight:700}

/* ─── Regulation ─── */
.regulation-bar{background:linear-gradient(180deg,#1e1b4b,#12121f)!important}
.reg-label{color:#e2e8f0}
.reg-num{color:rgba(251,146,60,.5)}
.reg-item{animation:fadeInStagger .5s ease both}
.reg-item:nth-child(1){animation-delay:.05s}.reg-item:nth-child(3){animation-delay:.1s}.reg-item:nth-child(5){animation-delay:.15s}.reg-item:nth-child(7){animation-delay:.2s}.reg-item:nth-child(9){animation-delay:.25s}

/* ─── Feature cards — WHITE with colorful LEFT BORDER + bounce animation ─── */
.features-grid{grid-template-columns:repeat(3,1fr)!important;gap:20px!important}
.feature-card{background:#fff!important;border:1px solid #f1f5f9!important;border-left:4px solid transparent!important;border-radius:var(--radius-fun)!important;box-shadow:0 4px 16px rgba(0,0,0,.04);transition:all .4s ease;animation:slideInBounce .6s ease both;position:relative;overflow:hidden}
.feature-card::before{content:'';position:absolute;top:0;right:0;width:100px;height:100px;background:radial-gradient(circle,var(--color-accent-subtle),transparent 70%);opacity:0;transition:opacity .3s}
.feature-card:hover::before{opacity:1}
.features-grid .feature-card:nth-child(1){border-left-color:#f97316!important;animation-delay:.1s}
.features-grid .feature-card:nth-child(2){border-left-color:#8b5cf6!important;animation-delay:.2s}
.features-grid .feature-card:nth-child(3){border-left-color:#ec4899!important;animation-delay:.3s}
.features-grid .feature-card:nth-child(4){border-left-color:#10b981!important;animation-delay:.35s}
.features-grid .feature-card:nth-child(5){border-left-color:#3b82f6!important;animation-delay:.4s}
.features-grid .feature-card:nth-child(6){border-left-color:#f59e0b!important;animation-delay:.45s}
.feature-card:hover{transform:translateY(-8px)!important;box-shadow:0 16px 48px rgba(0,0,0,.08)!important;border-left-width:4px!important}
.feature-card-icon{font-size:2.2rem;width:64px;height:64px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#fff7ed,#faf5ff)!important;border-radius:16px!important;margin-bottom:18px;transition:all .3s;animation:iconBounce 3s ease-in-out infinite}
.feature-card:nth-child(2) .feature-card-icon{animation-delay:.5s}
.feature-card:nth-child(3) .feature-card-icon{animation-delay:1s}
.feature-card:nth-child(4) .feature-card-icon{animation-delay:1.5s}
.feature-card:hover .feature-card-icon{transform:scale(1.15) rotate(5deg);animation:wiggle .5s ease}
.feature-card h3{color:#1e1b4b!important;font-weight:800}
.feature-card p{color:#64748b}

/* ─── Stats — HORIZONTAL colorful number cards (different from both forex bar and crypto grid) ─── */
.stats-bar{display:flex!important;flex-wrap:wrap!important;gap:16px!important;justify-content:center}
.stat-item{background:#fff!important;border:1px solid #f1f5f9!important;border-radius:var(--radius-fun)!important;padding:32px 28px!important;flex:1 1 200px;max-width:240px;box-shadow:0 4px 16px rgba(0,0,0,.04);transition:all .4s;animation:bounceIn .6s ease both;text-align:center}
.stat-item:nth-child(1){animation-delay:.2s}.stat-item:nth-child(2){animation-delay:.35s}.stat-item:nth-child(3){animation-delay:.5s}.stat-item:nth-child(4){animation-delay:.65s}
.stat-item:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 12px 36px rgba(249,115,22,.1);border-color:rgba(249,115,22,.2)!important}
.stat-divider{display:none!important}
.stat-value{background:var(--gradient-fun)!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;background-clip:text;font-weight:900;font-size:2.8rem}
.stat-label{color:#64748b!important;text-transform:uppercase;font-size:.7rem;letter-spacing:.1em;font-weight:700;margin-top:6px}

/* ─── Steps — colorful numbered circles ─── */
.step-number{background:var(--gradient-fun)!important;box-shadow:0 6px 20px var(--color-accent-glow);font-weight:900;transition:all .3s}
.step-item{animation:slideInBounce .6s ease both;border:1px solid #f1f5f9;border-radius:var(--radius-fun)!important;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.03);transition:all .4s}
.step-item:hover{transform:translateY(-6px);box-shadow:0 12px 36px rgba(0,0,0,.06);border-color:rgba(249,115,22,.15)}
.step-item:nth-child(1){animation-delay:.15s}.step-item:nth-child(2){animation-delay:.3s}.step-item:nth-child(3){animation-delay:.45s}
.step-item:hover .step-number{transform:scale(1.2) rotate(10deg)!important;box-shadow:0 8px 28px var(--color-accent-glow)}
.step-connector{background:var(--gradient-fun)!important;opacity:.2;height:3px}

/* ─── Data table — clean white ─── */
.data-table{border:1px solid #f1f5f9;border-radius:var(--radius-fun)!important;overflow:hidden}
.data-table th{background:linear-gradient(135deg,#1e1b4b,#312e81)!important;color:#fb923c!important;font-size:.78rem;letter-spacing:.06em}
.data-table td{font-size:.88rem;transition:all .2s}
.data-table td:nth-child(3){font-weight:700;color:#f97316}
.data-table tbody tr{transition:all .2s;border-left:3px solid transparent}
.data-table tbody tr:hover{background:rgba(249,115,22,.03);border-left-color:#f97316}

/* ─── CTA section — gradient party! ─── */
.cta-section{background:var(--gradient-fun)!important;animation:gradientShift 8s ease infinite;background-size:200% 200%!important;position:relative;padding:100px 28px!important;overflow:hidden}
.cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(255,255,255,.15),transparent 60%)}
.cta-section::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(255,255,255,.1),transparent 60%)}
.cta-section h2{color:#fff!important;-webkit-text-fill-color:#fff!important;animation:revealUp .6s ease both;position:relative;z-index:1}
.cta-section h2::after{background:#fff!important;margin:14px auto 0}
.cta-section p{color:rgba(255,255,255,.85)!important;position:relative;z-index:1}
.cta-section .btn-primary{background:#fff!important;color:#f97316!important;box-shadow:0 8px 30px rgba(0,0,0,.15);position:relative;z-index:1;font-weight:900}
.cta-section .btn-primary:hover{transform:translateY(-4px) scale(1.03);box-shadow:0 12px 40px rgba(0,0,0,.2)}

/* ─── Section padding ─── */
.section{padding:72px 28px}

/* ─── Awards — fun bouncy cards ─── */
.awards-section{background:#fff!important;border-top:1px solid #f1f5f9;padding:56px 28px!important}
.awards-label{color:#94a3b8!important;text-transform:uppercase;letter-spacing:.12em;font-size:.74rem;font-weight:700}
.awards-title{color:#1e1b4b!important;font-size:1.5rem!important}
.award-card{border:1px solid #f1f5f9!important;background:#fff!important;border-radius:16px!important;box-shadow:0 2px 8px rgba(0,0,0,.03);transition:all .4s;animation:bounceIn .5s ease both}
.award-card:nth-child(1){animation-delay:.1s}.award-card:nth-child(2){animation-delay:.15s}.award-card:nth-child(3){animation-delay:.2s}.award-card:nth-child(4){animation-delay:.25s}.award-card:nth-child(5){animation-delay:.3s}.award-card:nth-child(6){animation-delay:.35s}
.award-card:hover{transform:translateY(-6px) rotate(-1deg)!important;box-shadow:0 12px 36px rgba(249,115,22,.1)!important;border-color:rgba(249,115,22,.2)!important}
.award-icon{font-size:2.4rem;animation:iconBounce 3s ease-in-out infinite}
.award-name{color:#1e1b4b!important;font-weight:700}
.award-source{color:#94a3b8!important}
.award-year{color:#f97316!important;font-weight:800}

/* ─── Performance bar — dark with orange numbers ─── */
.perf-bar{background:linear-gradient(135deg,#1e1b4b,#312e81)!important}
.perf-value{color:#fff;font-weight:900}
.perf-unit{color:#fb923c!important}
.perf-label{color:rgba(251,146,60,.5)}
.perf-item{animation:countUp .5s ease both}
.perf-item:nth-child(1){animation-delay:.1s}.perf-item:nth-child(2){animation-delay:.2s}.perf-item:nth-child(3){animation-delay:.3s}.perf-item:nth-child(4){animation-delay:.4s}.perf-item:nth-child(5){animation-delay:.5s}

/* ─── Security — light cards with color ─── */
.security-bar{background:linear-gradient(180deg,#1e1b4b,#12121f)!important}
.security-badge{background:rgba(249,115,22,.05)!important;border:1px solid rgba(249,115,22,.1)!important;border-radius:16px!important;padding:22px 16px;transition:all .4s;animation:bounceIn .4s ease both}
.security-badge:nth-child(1){animation-delay:.05s}.security-badge:nth-child(2){animation-delay:.1s}.security-badge:nth-child(3){animation-delay:.15s}.security-badge:nth-child(4){animation-delay:.2s}.security-badge:nth-child(5){animation-delay:.25s}.security-badge:nth-child(6){animation-delay:.3s}
.security-badge:hover{border-color:rgba(249,115,22,.3)!important;background:rgba(249,115,22,.1)!important;transform:translateY(-4px)}
.sb-icon{font-size:1.6rem}
.sb-label{color:#e2e8f0;font-weight:700}
.sb-sub{color:rgba(251,146,60,.4)}

/* ─── Fund protection ─── */
.fund-protection{border:1px solid rgba(249,115,22,.1)!important;border-left:4px solid #f97316!important;background:linear-gradient(135deg,rgba(249,115,22,.03),rgba(139,92,246,.02),transparent)!important;border-radius:var(--radius-fun)!important;animation:revealLeft .6s ease both}
.fp-title{color:#1e1b4b;font-weight:800}
.fp-amount{background:rgba(249,115,22,.04)!important;border:1px solid rgba(249,115,22,.1)!important;border-radius:12px!important;transition:all .2s}
.fp-amount:hover{border-color:rgba(249,115,22,.3)!important;background:rgba(249,115,22,.08)!important;transform:translateX(4px)}
.fp-amount strong{color:#f97316!important}

/* ─── FAQ — playful ─── */
.faq-q{color:#1e1b4b;font-weight:700}
.faq-item.open .faq-q{color:#f97316!important}
.faq-q::after{color:#f97316!important}
.faq-item.open .faq-q::after{transform:rotate(45deg)}
.faq-item{animation:fadeInStagger .4s ease both;border-radius:16px!important;border-color:#f1f5f9!important}
.faq-item:nth-child(1){animation-delay:.05s}.faq-item:nth-child(2){animation-delay:.1s}.faq-item:nth-child(3){animation-delay:.15s}.faq-item:nth-child(4){animation-delay:.2s}.faq-item:nth-child(5){animation-delay:.25s}.faq-item:nth-child(6){animation-delay:.3s}

/* ─── Section CTAs ─── */
.section-cta .btn-primary{background:var(--gradient-fun)!important;box-shadow:0 6px 20px var(--color-accent-glow);border-radius:50px!important;padding:14px 36px;transition:all .3s}
.section-cta .btn-primary:hover{box-shadow:0 10px 32px rgba(249,115,22,.35);transform:translateY(-3px) scale(1.02)}

/* ─── Testimonials — fun cards ─── */
.testimonial-card{border:1px solid #f1f5f9!important;background:#fff!important;border-radius:var(--radius-fun)!important;box-shadow:0 4px 16px rgba(0,0,0,.03);transition:all .4s}
.testimonial-card::before{color:rgba(249,115,22,.15)!important}
.testimonial-card:hover{transform:translateY(-6px);box-shadow:0 12px 36px rgba(0,0,0,.06);border-color:rgba(249,115,22,.15)!important}

/* ─── Pricing — white with gradient highlight ─── */
.pricing-card{border:1px solid #f1f5f9!important;border-radius:var(--radius-fun)!important;background:#fff!important;box-shadow:0 4px 16px rgba(0,0,0,.03);transition:all .4s}
.pricing-card:hover{transform:translateY(-8px);box-shadow:0 16px 48px rgba(0,0,0,.08)}
.pricing-card.highlighted{border-color:rgba(249,115,22,.25)!important;background:linear-gradient(180deg,#fff7ed,#fff)!important;box-shadow:0 8px 32px rgba(249,115,22,.1)}
.pricing-card.highlighted::before{background:var(--gradient-fun)!important}

/* ─── Footer — LIGHT (different from both forex/crypto dark footers) ─── */
.footer{background:#fafafa!important;border-top:1px solid #f1f5f9;color:#475569!important}
.footer h4{color:#1e1b4b!important;font-weight:800;font-size:.85rem!important}
.footer a{color:#64748b!important}
.footer a:hover{color:#f97316!important}
.footer p{color:#94a3b8!important}
.footer-col p{color:#94a3b8!important}
.footer-social a{color:#94a3b8!important;transition:all .3s;width:36px;height:36px;border-radius:50%!important;border:1px solid #e2e8f0!important;display:inline-flex;align-items:center;justify-content:center}
.footer-social a:hover{color:#f97316!important;border-color:#f97316!important;background:rgba(249,115,22,.04);transform:translateY(-3px) rotate(5deg)}
.footer-licenses{border-color:#f1f5f9!important}
.footer-licenses-title{color:#f97316!important;font-weight:700}
.footer-license-item strong{color:#1e1b4b!important}
.footer-license-item{color:#64748b!important}
.footer-regulatory span{background:rgba(249,115,22,.04)!important;border:1px solid rgba(249,115,22,.1)!important;border-radius:50px!important;padding:6px 16px;font-size:.72rem;color:#f97316!important;transition:all .2s}
.footer-regulatory span:hover{background:rgba(249,115,22,.1)!important;transform:translateY(-2px)}
.footer-payments span{color:#94a3b8!important}
.footer-risk{border-top-color:#f1f5f9!important;color:#94a3b8!important}
.footer-bottom p{color:#94a3b8!important}
.footer-bottom a{color:#94a3b8!important}
.footer-bottom a:hover{color:#f97316!important}
.footer-app-badge{border-color:#e2e8f0!important;border-radius:12px!important;background:#fff!important}
.footer-app-badge:hover{border-color:#f97316!important}
.footer-address span,.footer-address a{color:#94a3b8!important}

/* ─── Navbar — white glass ─── */
.navbar{background:#fff!important;border-bottom:1px solid #f1f5f9}
.navbar.scrolled{background:rgba(255,255,255,.95)!important;backdrop-filter:blur(16px);box-shadow:0 2px 16px rgba(0,0,0,.06)}
.navbar-brand{color:#1e1b4b!important;font-weight:900}
.navbar-links a{color:#475569!important;font-weight:500;transition:all .2s}
.navbar-links a:hover,.navbar-links a.active{color:#f97316!important}
.navbar-cta{background:var(--gradient-fun)!important;border-radius:50px!important;font-weight:800;box-shadow:0 4px 16px var(--color-accent-glow);color:#fff!important;transition:all .3s!important}
.navbar-cta:hover{box-shadow:0 6px 24px var(--color-accent-glow)!important;transform:translateY(-2px)}
.navbar-login{color:#475569!important}

/* ─── Announcement bar ─── */
.announcement-bar{background:#fff7ed!important;border-bottom:1px solid rgba(249,115,22,.08);color:#92400e!important}
.announcement-bar a{color:#f97316!important;font-weight:700}

/* ─── Sticky CTA ─── */
.sticky-cta .btn-primary{background:var(--gradient-fun)!important;border-radius:50px!important;box-shadow:0 6px 24px var(--color-accent-glow);animation:glow 3s ease-in-out infinite;color:#fff!important}

/* ─── Live activity ─── */
.live-activity{border:1px solid #f1f5f9!important;box-shadow:0 8px 30px rgba(0,0,0,.08);background:#fff!important;border-radius:16px!important;animation:slideInBounce .4s ease both}
.la-dot{background:#f97316!important;box-shadow:0 0 10px var(--color-accent-glow);animation:pulse 1.5s ease infinite}
.live-activity .la-text{color:#475569!important}
.live-activity .la-text strong{color:#f97316!important}

/* ─── Cookie ─── */
.btn-accept{background:var(--gradient-fun)!important;border-radius:50px!important;color:#fff!important}
.btn-decline{border-radius:50px!important}

/* ─── Media bar ─── */
.media-bar{background:#fff!important}
.media-label{color:#94a3b8!important;text-transform:uppercase;letter-spacing:.12em;font-size:.72rem;font-weight:700}
.media-logo{color:#cbd5e1!important;transition:all .3s}
.media-logo:hover{color:#f97316!important;transform:scale(1.05)}

/* ═══ RESPONSIVE ═══ */
@media(min-width:1440px){
.hero{padding:100px 40px 90px!important}
.hero h1{font-size:3.6rem!important}
.features-grid{gap:24px!important}
.section{padding:88px 40px}
}
@media(min-width:1024px){
.hero h1{font-size:3.2rem}
.features-grid{grid-template-columns:repeat(3,1fr)!important;gap:20px!important}
.stats-bar{flex-wrap:nowrap!important;gap:16px}
.stat-item{max-width:none}
.steps-grid{grid-template-columns:repeat(3,1fr);gap:28px}
.section{padding:80px 28px}
.cta-section{padding:100px 28px!important}
.cta-section h2{font-size:2.2rem}
.footer-grid{grid-template-columns:2fr 1fr 1fr 1fr 1fr!important}
}
@media(min-width:768px) and (max-width:1023px){
.hero{padding:72px 24px 56px!important}
.hero h1{font-size:2.4rem!important}
.features-grid{grid-template-columns:repeat(2,1fr)!important}
.stats-bar{flex-wrap:wrap!important}
.stat-item{flex:1 1 45%}
.footer-grid{grid-template-columns:1fr 1fr!important}
}
@media(max-width:767px){
.hero{padding:56px 20px 48px!important}
.hero h1{font-size:2rem!important;line-height:1.12!important}
.hero-container{flex-direction:column!important;gap:24px}
.hero-visual{width:100%!important}
.hero-trader-img{max-width:260px}
.trader-photo{max-height:320px;border-radius:18px}
.hero-floating-card.card-top{right:-15px;top:10%;padding:8px 12px}
.hero-floating-card.card-bottom{left:-15px;bottom:15%;padding:8px 12px}
.hfc-icon{font-size:1.1rem}
.hfc-label{font-size:.6rem}
.hfc-value{font-size:.8rem}
.features-grid{grid-template-columns:1fr!important;gap:12px!important}
.feature-card{border-left-width:4px!important}
.stats-bar{flex-direction:column!important;gap:12px!important}
.stat-item{max-width:100%!important;flex:1 1 100%}
.stat-value{font-size:2.2rem}
.steps-grid{grid-template-columns:1fr;gap:12px}
.cta-section{padding:56px 20px!important}
.cta-section h2{font-size:1.5rem}
.section-title{font-size:1.5rem}
.footer-grid{grid-template-columns:1fr!important;gap:28px}
}
@media(prefers-reduced-motion:reduce){.section,.feature-card,.award-card,.security-badge,.stat-item,.step-item,.faq-item,.perf-item,.sp-item,.reg-item,.hero h1,.hero p,.hero-buttons,.hero-pills,.hero-badge,.hero-trustpilot,.hero-mockup,.hero-visual,.hero-visual *,.live-activity,.fund-protection,.hero-floating-card,.feature-card-icon,.award-icon{animation:none!important;opacity:1!important;transform:none!important}}
` : ''}
${options.niche === 'copy_trading' ? `
/* ═══ Copy Trading — Social Purple/Pink Dark Theme ═══ */
:root{--color-accent:#a855f7;--color-accent-light:#c084fc;--color-accent-glow:rgba(168,85,247,.35);--color-accent-subtle:rgba(168,85,247,.08);--color-pink:#ec4899;--color-pink-glow:rgba(236,72,153,.25);--color-secondary:#ec4899;--gradient-accent:linear-gradient(135deg,#a855f7 0%,#ec4899 100%);--gradient-hero:linear-gradient(160deg,#1a1030 0%,#2d1b4e 40%,#1a1030 100%);--gradient-dark:linear-gradient(180deg,#1a1030 0%,#0f0a1a 100%);--gradient-card:linear-gradient(135deg,rgba(168,85,247,.06),rgba(236,72,153,.04));--gradient-glass:linear-gradient(135deg,rgba(45,27,78,.6),rgba(26,16,48,.8));--radius-fun:20px;--font-display:'Inter',-apple-system,sans-serif}

/* ─── Global — dark purple, social, friendly ─── */
body{background:#1a1030!important;color:#e2e0ff}
h1,h2,h3{font-weight:800;letter-spacing:-.02em;color:#f0ecff}
a{color:#c084fc}
a:hover{color:#e9d5ff}
::selection{background:rgba(168,85,247,.35)}
.section{background:#1a1030;padding:72px 28px}
.section-alt{background:linear-gradient(180deg,#1f1340 0%,#1a1030 100%)!important}
.section-title{font-size:2.2rem;position:relative;display:inline-block;color:#f0ecff!important}
.section-title::after{content:'';display:block;width:60px;height:4px;background:var(--gradient-accent);margin:14px auto 0;border-radius:99px}
.section-subtitle{font-size:1rem;color:#a99fc4;max-width:560px}
.section-inner{text-align:center}

/* ─── Custom scrollbar — purple theme ─── */
::-webkit-scrollbar{width:8px;height:8px}
::-webkit-scrollbar-track{background:#1a1030}
::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#a855f7,#ec4899);border-radius:99px}
::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#c084fc,#f472b6)}
*{scrollbar-width:thin;scrollbar-color:#a855f7 #1a1030}

/* ─── Animations ─── */
@keyframes fadeInUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeInRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes purpleGlow{0%,100%{box-shadow:0 0 20px rgba(168,85,247,.2)}50%{box-shadow:0 0 40px rgba(168,85,247,.45)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes scaleIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes slideInBounce{0%{opacity:0;transform:translateY(40px)}60%{transform:translateY(-6px)}80%{transform:translateY(3px)}100%{opacity:1;transform:translateY(0)}}
@keyframes bounceIn{0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(.96)}100%{transform:scale(1)}}
@keyframes countUp{from{opacity:0;transform:translateY(12px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes borderGlow{0%{border-color:rgba(168,85,247,.15)}50%{border-color:rgba(236,72,153,.25)}100%{border-color:rgba(168,85,247,.15)}}
@keyframes iconPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes fadeInStagger{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

.section{opacity:0;animation:slideInBounce .8s ease forwards}
.section:nth-child(odd){animation-delay:.1s}
.section:nth-child(even){animation-delay:.2s}
.section-alt{animation-delay:.15s}

/* ─── Hero — dark purple with side-by-side layout ─── */
.hero{background:var(--gradient-hero)!important;position:relative;overflow:hidden;padding:80px 28px 70px!important}
.hero::before{content:'';position:absolute;top:-200px;right:-150px;width:600px;height:600px;background:radial-gradient(circle,rgba(168,85,247,.12) 0%,rgba(236,72,153,.06) 40%,transparent 70%);pointer-events:none;animation:float 10s ease-in-out infinite}
.hero::after{content:'';position:absolute;bottom:-200px;left:-150px;width:500px;height:500px;background:radial-gradient(circle,rgba(236,72,153,.08) 0%,transparent 60%);pointer-events:none;animation:float 12s ease-in-out infinite 4s}
.hero-container{align-items:center!important;gap:48px!important}
.hero h1{color:#f0ecff!important;-webkit-text-fill-color:#f0ecff!important;font-size:3.2rem!important;line-height:1.08!important;animation:fadeInLeft .8s ease .2s both}
.hero h1 strong,.hero h1 em{background:var(--gradient-accent);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-style:normal}
.hero p{color:#a99fc4!important;animation:fadeInLeft .8s ease .4s both;font-size:1.05rem}
.hero-buttons{animation:fadeInLeft .8s ease .6s both}
.hero .btn-primary{background:var(--gradient-accent)!important;border:none!important;border-radius:50px!important;padding:16px 40px!important;font-size:.9rem!important;font-weight:800;box-shadow:0 8px 30px var(--color-accent-glow);animation:purpleGlow 3s ease-in-out infinite;color:#fff!important}
.hero .btn-primary:hover{box-shadow:0 12px 40px rgba(168,85,247,.5);transform:translateY(-4px) scale(1.03)}
.hero .btn-outline{border-color:rgba(168,85,247,.3)!important;color:#e9d5ff!important;border-radius:50px!important;padding:16px 40px!important;font-size:.9rem!important;font-weight:700;background:rgba(168,85,247,.06)!important}
.hero .btn-outline:hover{border-color:#a855f7!important;color:#fff!important;background:rgba(168,85,247,.12)!important;transform:translateY(-3px)}
.hero-badge{background:rgba(168,85,247,.1)!important;border:1px solid rgba(168,85,247,.25)!important;border-radius:50px!important;animation:bounceIn .8s ease .1s both;color:#c084fc!important}
.hero-badge .badge-dot{background:var(--gradient-accent);box-shadow:0 0 8px var(--color-accent-glow);animation:iconPulse 1.5s ease infinite}
.hero-pill{background:rgba(168,85,247,.08)!important;border:1px solid rgba(168,85,247,.15)!important;color:#c084fc!important;border-radius:50px!important;font-size:.82rem!important;transition:all .3s}
.hero-pill:hover{border-color:#a855f7!important;color:#e9d5ff!important;background:rgba(168,85,247,.15)!important;transform:translateY(-2px)}
.hero-pills{animation:fadeInLeft .8s ease .5s both}
.hero-micro span{color:#8b7aad!important}
.hero-trust span{color:#a99fc4!important;border-color:rgba(168,85,247,.15)!important}
.hero-trustpilot{animation:fadeInUp .6s ease .15s both}
.hero-trustpilot .tp-stars{color:#a855f7!important}
.hero-trustpilot .tp-score{color:#f0ecff!important;font-weight:800}
.hero-trustpilot .tp-text{color:#a99fc4!important}

/* ─── Hero Leaderboard Card ─── */
.hero-visual{animation:fadeInRight .8s ease .3s both!important}
.hero-leaderboard{background:rgba(45,27,78,.7)!important;backdrop-filter:blur(20px);border:1px solid rgba(168,85,247,.25);border-radius:24px;padding:24px;min-width:360px;box-shadow:0 20px 60px rgba(0,0,0,.3),0 0 40px rgba(168,85,247,.1);animation:purpleGlow 4s ease-in-out infinite}
.lb-header{display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid rgba(168,85,247,.15)}
.lb-icon{font-size:1.4rem}
.lb-title{font-size:.95rem;font-weight:700;color:#e9d5ff;letter-spacing:-.01em}
.lb-trader{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;background:rgba(168,85,247,.04);border:1px solid rgba(168,85,247,.08);margin-bottom:8px;transition:all .3s}
.lb-trader:last-child{margin-bottom:0}
.lb-trader:hover{background:rgba(168,85,247,.1);border-color:rgba(168,85,247,.25);transform:translateX(4px)}
.lb-avatar{width:40px;height:40px;border-radius:50%;border:2px solid rgba(168,85,247,.3);object-fit:cover;flex-shrink:0}
.lb-info{display:flex;flex-direction:column;flex:1;min-width:0}
.lb-name{font-size:.85rem;font-weight:700;color:#f0ecff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lb-copiers{font-size:.7rem;color:#8b7aad}
.lb-roi{font-size:.9rem;font-weight:800;flex-shrink:0}
.lb-roi.up{color:#34d399}
.lb-roi.down{color:#f87171}
.lb-copy-btn{background:var(--gradient-accent);color:#fff;border:none;border-radius:50px;padding:6px 16px;font-size:.72rem;font-weight:700;cursor:pointer;transition:all .3s;flex-shrink:0;letter-spacing:.02em}
.lb-copy-btn:hover{transform:scale(1.08);box-shadow:0 4px 16px var(--color-accent-glow)}

/* ─── Buttons — pill-shaped, purple-pink gradient ─── */
.btn-primary{border-radius:50px!important;font-weight:800;background:var(--gradient-accent)!important;color:#fff!important;box-shadow:0 4px 16px var(--color-accent-glow);transition:all .3s}
.btn-primary:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 8px 24px var(--color-accent-glow)}
.btn-outline{border-radius:50px!important;font-weight:700;border-color:rgba(168,85,247,.3)!important;color:#e9d5ff!important;background:rgba(168,85,247,.06)!important}
.btn-outline:hover{border-color:#a855f7!important;color:#fff!important;background:rgba(168,85,247,.12)!important}
.btn-primary:focus-visible,.btn-outline:focus-visible{outline:3px solid #a855f7;outline-offset:3px}

/* ─── Promo bar — purple gradient ─── */
.promo-bar{background:var(--gradient-accent)!important;animation:gradientShift 6s ease infinite;background-size:200% 200%!important;font-weight:600}
.promo-bar a{color:#fff!important;text-decoration:underline;font-weight:800}
.promo-bar strong{color:#fff!important}

/* ─── Social proof — dark purple ─── */
.social-proof-bar{background:rgba(45,27,78,.5)!important;border-bottom:1px solid rgba(168,85,247,.1)}
.sp-item{animation:fadeInStagger .5s ease both;color:#c4b5d9}
.sp-item:nth-child(1){animation-delay:.1s}.sp-item:nth-child(3){animation-delay:.2s}.sp-item:nth-child(5){animation-delay:.3s}.sp-item:nth-child(7){animation-delay:.4s}.sp-item:nth-child(9){animation-delay:.5s}
.sp-item strong{color:#c084fc!important;font-weight:800}
.sp-divider{background:rgba(168,85,247,.15)!important}

/* ─── Ticker ─── */
.market-ticker{background:#0f0a1a!important;border-bottom:1px solid rgba(168,85,247,.08)}
.ticker-symbol{color:#c084fc!important;font-weight:700}
.ticker-price{color:#c4b5d9}
.ticker-change.up{color:#34d399!important;font-weight:700}
.ticker-change.down{color:#f87171!important;font-weight:700}

/* ─── Regulation ─── */
.regulation-bar{background:linear-gradient(180deg,#0f0a1a,#1a1030)!important}
.reg-label{color:#c4b5d9}
.reg-num{color:rgba(168,85,247,.4)}
.reg-item{animation:fadeInStagger .5s ease both}
.reg-item:nth-child(1){animation-delay:.05s}.reg-item:nth-child(3){animation-delay:.1s}.reg-item:nth-child(5){animation-delay:.15s}.reg-item:nth-child(7){animation-delay:.2s}.reg-item:nth-child(9){animation-delay:.25s}

/* ─── Feature cards — glassmorphism with purple glow ─── */
.features-grid{grid-template-columns:repeat(3,1fr)!important;gap:20px!important}
.feature-card{background:rgba(45,27,78,.4)!important;backdrop-filter:blur(12px);border:1px solid rgba(168,85,247,.1)!important;border-radius:var(--radius-fun)!important;box-shadow:0 4px 20px rgba(0,0,0,.2);transition:all .4s ease;animation:slideInBounce .6s ease both;position:relative;overflow:hidden}
.feature-card::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg,rgba(168,85,247,.04),rgba(236,72,153,.02));opacity:0;transition:opacity .3s;pointer-events:none}
.feature-card:hover::before{opacity:1}
.features-grid .feature-card:nth-child(1){animation-delay:.1s}
.features-grid .feature-card:nth-child(2){animation-delay:.2s}
.features-grid .feature-card:nth-child(3){animation-delay:.3s}
.features-grid .feature-card:nth-child(4){animation-delay:.35s}
.features-grid .feature-card:nth-child(5){animation-delay:.4s}
.features-grid .feature-card:nth-child(6){animation-delay:.45s}
.feature-card:hover{transform:translateY(-8px)!important;box-shadow:0 16px 48px rgba(0,0,0,.3),0 0 30px rgba(168,85,247,.12)!important;border-color:rgba(168,85,247,.3)!important}
.feature-card-icon{font-size:2.2rem;width:64px;height:64px;display:flex;align-items:center;justify-content:center;background:rgba(168,85,247,.1)!important;border-radius:16px!important;margin-bottom:18px;transition:all .3s;animation:iconPulse 3s ease-in-out infinite}
.feature-card:nth-child(2) .feature-card-icon{animation-delay:.5s}
.feature-card:nth-child(3) .feature-card-icon{animation-delay:1s}
.feature-card:hover .feature-card-icon{transform:scale(1.15);box-shadow:0 0 20px rgba(168,85,247,.2)}
.feature-card h3{color:#f0ecff!important;font-weight:800}
.feature-card p{color:#a99fc4}

/* ─── Stats — 2x2 grid with gradient numbers ─── */
.stats-bar{display:flex!important;flex-wrap:wrap!important;gap:16px!important;justify-content:center}
.stat-item{background:rgba(45,27,78,.5)!important;backdrop-filter:blur(12px);border:1px solid rgba(168,85,247,.12)!important;border-radius:var(--radius-fun)!important;padding:32px 28px!important;flex:1 1 200px;max-width:240px;box-shadow:0 4px 20px rgba(0,0,0,.2);transition:all .4s;animation:bounceIn .6s ease both;text-align:center}
.stat-item:nth-child(1){animation-delay:.2s}.stat-item:nth-child(2){animation-delay:.35s}.stat-item:nth-child(3){animation-delay:.5s}.stat-item:nth-child(4){animation-delay:.65s}
.stat-item:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 12px 36px rgba(168,85,247,.15);border-color:rgba(168,85,247,.3)!important}
.stat-divider{display:none!important}
.stat-value{background:var(--gradient-accent)!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;background-clip:text;font-weight:900;font-size:2.8rem}
.stat-label{color:#8b7aad!important;text-transform:uppercase;font-size:.7rem;letter-spacing:.1em;font-weight:700;margin-top:6px}

/* ─── Steps — purple numbered circles ─── */
.step-number{background:var(--gradient-accent)!important;box-shadow:0 6px 20px var(--color-accent-glow);font-weight:900;transition:all .3s}
.step-item{animation:slideInBounce .6s ease both;border:1px solid rgba(168,85,247,.1);border-radius:var(--radius-fun)!important;background:rgba(45,27,78,.3);box-shadow:0 4px 20px rgba(0,0,0,.15);transition:all .4s}
.step-item:hover{transform:translateY(-6px);box-shadow:0 12px 36px rgba(0,0,0,.2);border-color:rgba(168,85,247,.25)}
.step-item:nth-child(1){animation-delay:.15s}.step-item:nth-child(2){animation-delay:.3s}.step-item:nth-child(3){animation-delay:.45s}
.step-item:hover .step-number{transform:scale(1.2) rotate(10deg)!important;box-shadow:0 8px 28px var(--color-accent-glow)}
.step-item h3{color:#f0ecff!important}
.step-item p{color:#a99fc4}
.step-connector{background:var(--gradient-accent)!important;opacity:.2;height:3px}

/* ─── Data table ─── */
.data-table{border:1px solid rgba(168,85,247,.12);border-radius:var(--radius-fun)!important;overflow:hidden}
.data-table th{background:linear-gradient(135deg,#2d1b4e,#3d2566)!important;color:#c084fc!important;font-size:.78rem;letter-spacing:.06em}
.data-table td{font-size:.88rem;transition:all .2s;color:#c4b5d9;border-color:rgba(168,85,247,.08)!important}
.data-table td:nth-child(3){font-weight:700;color:#a855f7}
.data-table tbody tr{transition:all .2s;border-left:3px solid transparent;background:rgba(45,27,78,.2)}
.data-table tbody tr:hover{background:rgba(168,85,247,.06);border-left-color:#a855f7}

/* ─── CTA section — purple gradient ─── */
.cta-section{background:var(--gradient-accent)!important;animation:gradientShift 8s ease infinite;background-size:200% 200%!important;position:relative;padding:100px 28px!important;overflow:hidden}
.cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(255,255,255,.12),transparent 60%)}
.cta-section::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(255,255,255,.08),transparent 60%)}
.cta-section h2{color:#fff!important;-webkit-text-fill-color:#fff!important;animation:fadeInUp .6s ease both;position:relative;z-index:1}
.cta-section h2::after{background:#fff!important;margin:14px auto 0}
.cta-section p{color:rgba(255,255,255,.85)!important;position:relative;z-index:1}
.cta-section .btn-primary{background:#fff!important;color:#a855f7!important;box-shadow:0 8px 30px rgba(0,0,0,.2);position:relative;z-index:1;font-weight:900}
.cta-section .btn-primary:hover{transform:translateY(-4px) scale(1.03);box-shadow:0 12px 40px rgba(0,0,0,.25)}

/* ─── Awards — dark cards with purple accent ─── */
.awards-section{background:#0f0a1a!important;border-top:1px solid rgba(168,85,247,.08);padding:56px 28px!important}
.awards-label{color:#8b7aad!important;text-transform:uppercase;letter-spacing:.12em;font-size:.74rem;font-weight:700}
.awards-title{color:#f0ecff!important;font-size:1.5rem!important}
.award-card{border:1px solid rgba(168,85,247,.1)!important;background:rgba(45,27,78,.3)!important;border-radius:16px!important;box-shadow:0 2px 12px rgba(0,0,0,.2);transition:all .4s;animation:bounceIn .5s ease both}
.award-card:nth-child(1){animation-delay:.1s}.award-card:nth-child(2){animation-delay:.15s}.award-card:nth-child(3){animation-delay:.2s}.award-card:nth-child(4){animation-delay:.25s}.award-card:nth-child(5){animation-delay:.3s}.award-card:nth-child(6){animation-delay:.35s}
.award-card:hover{transform:translateY(-6px) rotate(-1deg)!important;box-shadow:0 12px 36px rgba(168,85,247,.12)!important;border-color:rgba(168,85,247,.3)!important}
.award-icon{font-size:2.4rem;animation:iconPulse 3s ease-in-out infinite}
.award-name{color:#f0ecff!important;font-weight:700}
.award-source{color:#8b7aad!important}
.award-year{color:#c084fc!important;font-weight:800}

/* ─── Performance bar — deep purple with gradient numbers ─── */
.perf-bar{background:linear-gradient(135deg,#0f0a1a,#1f1340)!important}
.perf-value{color:#fff;font-weight:900}
.perf-unit{color:#c084fc!important}
.perf-label{color:rgba(168,85,247,.4)}
.perf-item{animation:countUp .5s ease both}
.perf-item:nth-child(1){animation-delay:.1s}.perf-item:nth-child(2){animation-delay:.2s}.perf-item:nth-child(3){animation-delay:.3s}.perf-item:nth-child(4){animation-delay:.4s}.perf-item:nth-child(5){animation-delay:.5s}

/* ─── Security — purple glass cards ─── */
.security-bar{background:linear-gradient(180deg,#0f0a1a,#1a1030)!important}
.security-badge{background:rgba(168,85,247,.06)!important;border:1px solid rgba(168,85,247,.12)!important;border-radius:16px!important;padding:22px 16px;transition:all .4s;animation:bounceIn .4s ease both}
.security-badge:nth-child(1){animation-delay:.05s}.security-badge:nth-child(2){animation-delay:.1s}.security-badge:nth-child(3){animation-delay:.15s}.security-badge:nth-child(4){animation-delay:.2s}.security-badge:nth-child(5){animation-delay:.25s}.security-badge:nth-child(6){animation-delay:.3s}
.security-badge:hover{border-color:rgba(168,85,247,.3)!important;background:rgba(168,85,247,.12)!important;transform:translateY(-4px)}
.sb-icon{font-size:1.6rem}
.sb-label{color:#e2e0ff;font-weight:700}
.sb-sub{color:rgba(168,85,247,.4)}

/* ─── Fund protection ─── */
.fund-protection{border:1px solid rgba(168,85,247,.12)!important;border-left:4px solid #a855f7!important;background:rgba(45,27,78,.3)!important;border-radius:var(--radius-fun)!important;animation:fadeInLeft .6s ease both}
.fp-title{color:#f0ecff;font-weight:800}
.fp-text{color:#a99fc4}
.fp-amount{background:rgba(168,85,247,.06)!important;border:1px solid rgba(168,85,247,.12)!important;border-radius:12px!important;transition:all .2s}
.fp-amount:hover{border-color:rgba(168,85,247,.3)!important;background:rgba(168,85,247,.1)!important;transform:translateX(4px)}
.fp-amount strong{color:#c084fc!important}

/* ─── FAQ — purple accent ─── */
.faq-q{color:#f0ecff;font-weight:700}
.faq-item.open .faq-q{color:#c084fc!important}
.faq-q::after{color:#a855f7!important}
.faq-item.open .faq-q::after{transform:rotate(45deg)}
.faq-item{animation:fadeInStagger .4s ease both;border-radius:16px!important;border-color:rgba(168,85,247,.1)!important;background:rgba(45,27,78,.2)}
.faq-item:nth-child(1){animation-delay:.05s}.faq-item:nth-child(2){animation-delay:.1s}.faq-item:nth-child(3){animation-delay:.15s}.faq-item:nth-child(4){animation-delay:.2s}.faq-item:nth-child(5){animation-delay:.25s}.faq-item:nth-child(6){animation-delay:.3s}
.faq-a{color:#a99fc4}

/* ─── Section CTAs ─── */
.section-cta .btn-primary{background:var(--gradient-accent)!important;box-shadow:0 6px 20px var(--color-accent-glow);border-radius:50px!important;padding:14px 36px;transition:all .3s}
.section-cta .btn-primary:hover{box-shadow:0 10px 32px rgba(168,85,247,.4);transform:translateY(-3px) scale(1.02)}

/* ─── Testimonials — purple accent cards ─── */
.testimonial-card{border:1px solid rgba(168,85,247,.1)!important;background:rgba(45,27,78,.3)!important;border-radius:var(--radius-fun)!important;box-shadow:0 4px 20px rgba(0,0,0,.2);transition:all .4s}
.testimonial-card::before{color:rgba(168,85,247,.2)!important}
.testimonial-card:hover{transform:translateY(-6px);box-shadow:0 12px 36px rgba(0,0,0,.25);border-color:rgba(168,85,247,.25)!important}
.testimonial-card p{color:#c4b5d9}
.testimonial-author{color:#f0ecff!important}
.testimonial-role{color:#8b7aad!important}
.testimonial-stars{color:#a855f7!important}

/* ─── Pricing — glass cards with purple highlight ─── */
.pricing-card{border:1px solid rgba(168,85,247,.1)!important;border-radius:var(--radius-fun)!important;background:rgba(45,27,78,.3)!important;box-shadow:0 4px 20px rgba(0,0,0,.2);transition:all .4s}
.pricing-card:hover{transform:translateY(-8px);box-shadow:0 16px 48px rgba(0,0,0,.3)}
.pricing-card.highlighted{border-color:rgba(168,85,247,.35)!important;background:linear-gradient(180deg,rgba(45,27,78,.6),rgba(45,27,78,.3))!important;box-shadow:0 8px 32px rgba(168,85,247,.15)}
.pricing-card.highlighted::before{background:var(--gradient-accent)!important}
.pricing-card h3{color:#f0ecff!important}
.pricing-card .price{color:#c084fc!important}
.pricing-card li{color:#a99fc4}
.pricing-card li::before{color:#a855f7!important}

/* ─── Footer — dark purple theme ─── */
.footer{background:#0f0a1a!important;border-top:1px solid rgba(168,85,247,.08);color:#a99fc4!important}
.footer h4{color:#f0ecff!important;font-weight:800;font-size:.85rem!important}
.footer a{color:#8b7aad!important}
.footer a:hover{color:#c084fc!important}
.footer p{color:#6b5f85!important}
.footer-col p{color:#6b5f85!important}
.footer-social a{color:#8b7aad!important;transition:all .3s;width:36px;height:36px;border-radius:50%!important;border:1px solid rgba(168,85,247,.15)!important;display:inline-flex;align-items:center;justify-content:center}
.footer-social a:hover{color:#c084fc!important;border-color:#a855f7!important;background:rgba(168,85,247,.08);transform:translateY(-3px) rotate(5deg)}
.footer-licenses{border-color:rgba(168,85,247,.08)!important}
.footer-licenses-title{color:#c084fc!important;font-weight:700}
.footer-license-item strong{color:#f0ecff!important}
.footer-license-item{color:#8b7aad!important}
.footer-regulatory span{background:rgba(168,85,247,.06)!important;border:1px solid rgba(168,85,247,.12)!important;border-radius:50px!important;padding:6px 16px;font-size:.72rem;color:#c084fc!important;transition:all .2s}
.footer-regulatory span:hover{background:rgba(168,85,247,.12)!important;transform:translateY(-2px)}
.footer-payments span{color:#8b7aad!important}
.footer-risk{border-top-color:rgba(168,85,247,.08)!important;color:#6b5f85!important}
.footer-bottom p{color:#6b5f85!important}
.footer-bottom a{color:#6b5f85!important}
.footer-bottom a:hover{color:#c084fc!important}
.footer-app-badge{border-color:rgba(168,85,247,.12)!important;border-radius:12px!important;background:rgba(45,27,78,.3)!important}
.footer-app-badge:hover{border-color:#a855f7!important}
.footer-address span,.footer-address a{color:#6b5f85!important}

/* ─── Navbar — dark purple with accent active state ─── */
.navbar{background:#1a1030!important;border-bottom:1px solid rgba(168,85,247,.1)}
.navbar.scrolled{background:rgba(26,16,48,.95)!important;backdrop-filter:blur(16px);box-shadow:0 2px 16px rgba(0,0,0,.3)}
.navbar-brand{color:#f0ecff!important;font-weight:900}
.navbar-links a{color:#a99fc4!important;font-weight:500;transition:all .2s}
.navbar-links a:hover,.navbar-links a.active{color:#c084fc!important}
.navbar-cta{background:var(--gradient-accent)!important;border-radius:50px!important;font-weight:800;box-shadow:0 4px 16px var(--color-accent-glow);color:#fff!important;transition:all .3s!important}
.navbar-cta:hover{box-shadow:0 6px 24px var(--color-accent-glow)!important;transform:translateY(-2px)}
.navbar-login{color:#a99fc4!important}
.navbar-login:hover{color:#c084fc!important}
.nav-dropdown-menu{background:rgba(45,27,78,.95)!important;backdrop-filter:blur(16px);border:1px solid rgba(168,85,247,.15)!important;box-shadow:0 12px 40px rgba(0,0,0,.4)!important}
.nav-dropdown-menu a{color:#c4b5d9!important}
.nav-dropdown-menu a:hover{background:rgba(168,85,247,.1)!important;color:#e9d5ff!important}
.dd-icon{color:#c084fc}
.dd-desc{color:#8b7aad!important}
.nav-dropdown-footer a{color:#c084fc!important}

/* ─── Announcement bar ─── */
.announcement-bar{background:rgba(45,27,78,.6)!important;border-bottom:1px solid rgba(168,85,247,.08);color:#c4b5d9!important}
.announcement-bar a{color:#c084fc!important;font-weight:700}

/* ─── Sticky CTA ─── */
.sticky-cta .btn-primary{background:var(--gradient-accent)!important;border-radius:50px!important;box-shadow:0 6px 24px var(--color-accent-glow);animation:purpleGlow 3s ease-in-out infinite;color:#fff!important}

/* ─── Live activity ─── */
.live-activity{border:1px solid rgba(168,85,247,.15)!important;box-shadow:0 8px 30px rgba(0,0,0,.3);background:rgba(45,27,78,.9)!important;backdrop-filter:blur(12px);border-radius:16px!important;animation:slideInBounce .4s ease both}
.la-dot{background:#a855f7!important;box-shadow:0 0 10px var(--color-accent-glow);animation:iconPulse 1.5s ease infinite}
.live-activity .la-text{color:#c4b5d9!important}
.live-activity .la-text strong{color:#c084fc!important}

/* ─── Cookie ─── */
.cookie-bar{background:rgba(45,27,78,.95)!important;border-top:1px solid rgba(168,85,247,.12);backdrop-filter:blur(12px)}
.cookie-bar p{color:#a99fc4!important}
.btn-accept{background:var(--gradient-accent)!important;border-radius:50px!important;color:#fff!important}
.btn-decline{border-radius:50px!important;color:#a99fc4!important;border-color:rgba(168,85,247,.2)!important}
.btn-decline:hover{border-color:#a855f7!important;color:#e9d5ff!important}

/* ─── Media bar ─── */
.media-bar{background:#0f0a1a!important}
.media-label{color:#6b5f85!important;text-transform:uppercase;letter-spacing:.12em;font-size:.72rem;font-weight:700}
.media-logo{color:#4a3d6b!important;transition:all .3s}
.media-logo:hover{color:#c084fc!important;transform:scale(1.05)}

/* ─── Comparison table ─── */
.comparison-table{border:1px solid rgba(168,85,247,.12)!important;border-radius:var(--radius-fun)!important;overflow:hidden}
.comparison-table th{background:rgba(45,27,78,.5)!important;color:#c084fc!important}
.comparison-table td{color:#c4b5d9;border-color:rgba(168,85,247,.06)!important}

/* ─── Two column layout ─── */
.two-col{color:#c4b5d9}
.two-col h3{color:#f0ecff!important}
.two-col li{color:#a99fc4}

/* ─── Icon grid ─── */
.icon-grid-item{background:rgba(45,27,78,.3)!important;border:1px solid rgba(168,85,247,.08);border-radius:16px!important;transition:all .3s}
.icon-grid-item:hover{border-color:rgba(168,85,247,.25);background:rgba(45,27,78,.5)!important;transform:translateY(-4px)}
.icon-grid-item h4{color:#f0ecff!important}
.icon-grid-item p{color:#a99fc4}

/* ─── Banner section ─── */
.banner-info,.banner-warning,.banner-success{background:rgba(45,27,78,.4)!important;border:1px solid rgba(168,85,247,.12)!important;border-radius:var(--radius-fun)!important;color:#c4b5d9}

/* ─── Mobile menu ─── */
.mobile-menu{background:rgba(26,16,48,.98)!important;backdrop-filter:blur(16px)}
.mobile-menu a{color:#c4b5d9!important;border-color:rgba(168,85,247,.08)!important}
.mobile-menu a:hover,.mobile-menu a.active{color:#c084fc!important;background:rgba(168,85,247,.08)}
.mobile-divider{background:rgba(168,85,247,.1)!important}

/* ═══ RESPONSIVE — Copy Trading ═══ */
@media(min-width:1440px){
.hero{padding:100px 40px 90px!important}
.hero h1{font-size:3.6rem!important}
.features-grid{gap:24px!important}
.section{padding:88px 40px}
.hero-leaderboard{min-width:400px}
}
@media(min-width:1024px){
.hero h1{font-size:3.2rem}
.features-grid{grid-template-columns:repeat(3,1fr)!important;gap:20px!important}
.stats-bar{flex-wrap:nowrap!important;gap:16px}
.stat-item{max-width:none}
.steps-grid{grid-template-columns:repeat(3,1fr);gap:28px}
.section{padding:80px 28px}
.cta-section{padding:100px 28px!important}
.cta-section h2{font-size:2.2rem}
.footer-grid{grid-template-columns:2fr 1fr 1fr 1fr 1fr!important}
}
@media(min-width:768px) and (max-width:1023px){
.hero{padding:72px 24px 56px!important}
.hero h1{font-size:2.4rem!important}
.features-grid{grid-template-columns:repeat(2,1fr)!important}
.stats-bar{flex-wrap:wrap!important}
.stat-item{flex:1 1 45%}
.footer-grid{grid-template-columns:1fr 1fr!important}
.hero-leaderboard{min-width:300px}
}
@media(max-width:767px){
.hero{padding:56px 20px 48px!important}
.hero h1{font-size:2rem!important;line-height:1.12!important}
.hero-container{flex-direction:column!important;gap:24px}
.hero-visual{width:100%!important}
.hero-leaderboard{min-width:0;width:100%}
.lb-trader{padding:10px 12px}
.lb-avatar{width:34px;height:34px}
.lb-name{font-size:.8rem}
.lb-copiers{font-size:.65rem}
.lb-roi{font-size:.8rem}
.lb-copy-btn{padding:5px 12px;font-size:.68rem}
.features-grid{grid-template-columns:1fr!important;gap:12px!important}
.stats-bar{flex-direction:column!important;gap:12px!important}
.stat-item{max-width:100%!important;flex:1 1 100%}
.stat-value{font-size:2.2rem}
.steps-grid{grid-template-columns:1fr;gap:12px}
.cta-section{padding:56px 20px!important}
.cta-section h2{font-size:1.5rem}
.section-title{font-size:1.5rem}
.footer-grid{grid-template-columns:1fr!important;gap:28px}
}
@media(prefers-reduced-motion:reduce){.section,.feature-card,.award-card,.security-badge,.stat-item,.step-item,.faq-item,.perf-item,.sp-item,.reg-item,.hero h1,.hero p,.hero-buttons,.hero-pills,.hero-badge,.hero-trustpilot,.hero-mockup,.hero-visual,.hero-visual *,.live-activity,.fund-protection,.hero-leaderboard,.lb-trader,.lb-copy-btn{animation:none!important;opacity:1!important;transform:none!important}}
` : ''}
`
}

// ─── Page HTML — Premium Template ────────────────────────

function generatePageHTML(page: ExportPage, options: ExportOptions): string {
  const { brandName, domain, pages } = options
  const n = getNicheContent(options.niche)
  const metaTitle = page.metaTitle || `${page.title} | ${brandName}`
  const metaDescription = page.metaDescription || `${page.title} — ${brandName}. Your trusted trading partner at ${domain}.`

  let parsed: ParsedContent = {}
  try {
    parsed = JSON.parse(page.content) as ParsedContent
  } catch {
    parsed = { heroTitle: page.title, heroSubtitle: '', sections: [] }
  }

  const heroTitle = parsed.heroTitle || page.title
  const heroSubtitle = parsed.heroSubtitle || ''
  const rawSections = parsed.sections || []

  // Normalize sections: parse `content` JSON string into typed fields (items, stats, steps, etc.)
  const sections = rawSections.map((s) => {
    if (!s.content || typeof s.content !== 'string') return s
    try {
      const data = JSON.parse(s.content)
      if (s.type === 'features' && Array.isArray(data) && !s.items) {
        return { ...s, items: data }
      }
      if (s.type === 'stats' && Array.isArray(data) && !s.stats) {
        return { ...s, stats: data }
      }
      if (s.type === 'steps' && Array.isArray(data) && !s.steps) {
        return { ...s, steps: data }
      }
      if (s.type === 'testimonials' && Array.isArray(data) && !s.testimonials) {
        return { ...s, testimonials: data }
      }
      if (s.type === 'icon-grid' && Array.isArray(data) && !s.iconItems) {
        return { ...s, iconItems: data }
      }
      if (s.type === 'list' && Array.isArray(data) && !s.items) {
        return { ...s, items: data }
      }
      if (s.type === 'comparison' && data && typeof data === 'object' && !s.comparisonData) {
        // Handle table format: { headers, rows } → render as table
        if (data.headers && data.rows) {
          return { ...s, type: 'table', columns: data.headers, rows: data.rows.map((row: string[]) => {
            const obj: Record<string, string> = {}
            data.headers.forEach((h: string, i: number) => { obj[h] = row[i] || '' })
            return obj
          }) }
        }
        return { ...s, comparisonData: data }
      }
    } catch { /* not valid JSON, keep as-is */ }
    return s
  })
  const heroConfig = getHeroConfig(page.slug, options.niche, n)
  const navSlugs = n.navSlugs
  const navPages = pages.filter((p) => navSlugs.includes(p.slug))
  const cryptoSubPages = ['spot-trading', 'futures', 'staking', 'tokens', 'wallet']
  const copyTradingSubPages = ['top-traders', 'strategies', 'community']
  const marketPagesNav = options.niche === 'crypto_exchange'
    ? pages.filter(p => cryptoSubPages.includes(p.slug))
    : options.niche === 'copy_trading'
    ? pages.filter(p => copyTradingSubPages.includes(p.slug))
    : pages.filter(p => p.slug.startsWith('markets/'))
  const isMarketPage = options.niche === 'crypto_exchange'
    ? cryptoSubPages.includes(page.slug)
    : options.niche === 'copy_trading'
    ? copyTradingSubPages.includes(page.slug)
    : page.slug.startsWith('markets/')

  const navLinks = navPages.map((p) => {
    const href = p.slug === 'home' ? 'index.html' : `${p.slug.replace(/\//g, '-')}.html`
    // Insert Markets dropdown after About
    if (p.slug === 'about' && marketPagesNav.length > 0) {
      const aboutCls = p.slug === page.slug ? ' class="active"' : ''
      const marketsCls = isMarketPage ? ' class="active"' : ''
      const marketIcons: Record<string, string> = n.marketDropdownIcons
      const marketDescs: Record<string, string> = n.marketDropdownDescs
      const dropdownLinks = marketPagesNav.map((mp) => {
        const mpHref = `${mp.slug.replace(/\//g, '-')}.html`
        const icon = marketIcons[mp.slug] || '📈'
        const desc = marketDescs[mp.slug] || ''
        return `            <a href="${mpHref}"><span class="dd-icon">${icon}</span><div><div class="dd-label">${escapeHtml(mp.title)}</div><div class="dd-desc">${desc}</div></div></a>`
      }).join('\n')
      return `        <li><a href="${href}"${aboutCls}>${escapeHtml(p.title)}</a></li>
        <li class="nav-dropdown">
          <a href="#"${marketsCls}>${options.niche === 'crypto_exchange' ? 'Products' : options.niche === 'copy_trading' ? 'Discover' : 'Markets'}</a>
          <div class="nav-dropdown-menu">
${dropdownLinks}
            <div class="nav-dropdown-footer"><a href="#">View All Markets &rarr;</a></div>
          </div>
        </li>`
    }
    const cls = p.slug === page.slug ? ' class="active"' : ''
    return `        <li><a href="${href}"${cls}>${escapeHtml(p.title)}</a></li>`
  }).join('\n')

  // Mobile menu links
  const allMobileLinks = [
    ...navPages.map((p) => {
      const href = p.slug === 'home' ? 'index.html' : `${p.slug.replace(/\//g, '-')}.html`
      const cls = p.slug === page.slug ? ' class="active"' : ''
      return `      <a href="${href}"${cls}>${escapeHtml(p.title)}</a>`
    }),
    ...(marketPagesNav.length > 0 ? [
      '      <div class="mobile-divider"></div>',
      ...marketPagesNav.map((mp) => {
        const href = `${mp.slug.replace(/\//g, '-')}.html`
        const cls = mp.slug === page.slug ? ' class="active"' : ''
        return `      <a href="${href}"${cls}>${escapeHtml(mp.title)}</a>`
      })
    ] : [])
  ].join('\n')

  // Section CTA map — inject CTAs after key sections on ALL pages with contextual copy
  const isLegalPage = heroConfig.variant === 'legal'
  const pageCtaVerb = n.getPageCTAVerb(page.slug)
  const sectionCtaMap: Record<string, string> = isLegalPage ? {} : {
    stats: pageCtaVerb,
    features: page.slug === 'platforms' ? 'Try All Platforms Free' : 'Start Trading Now',
    steps: 'Open Your Account — 2 Minutes',
    comparison: 'Switch to ' + escapeHtml(brandName) + ' Today',
    testimonials: 'Join Thousands of Happy Traders',
    pricing: page.slug === 'pricing' ? 'Start with Zero Commission' : 'Get Started Today',
    list: page.slug === 'education' ? 'Access Free Courses' : 'Learn More',
    'icon-grid': page.slug === 'platforms' ? 'Download for Your Device' : 'Get Started',
    'two-column': pageCtaVerb,
  }

  const sectionBlocks = sections.map((s, i) => {
    const alt = i % 2 === 1 ? ' section-alt' : ''
    const inner = renderSection(s)
    const title = s.title ? `      <h2 class="section-title">${escapeHtml(s.title)}</h2>\n` : ''
    const subtitle = s.subtitle ? `      <p class="section-subtitle">${escapeHtml(s.subtitle)}</p>\n` : ''
    if (s.type === 'cta') {
      return inner
    }
    const ctaLabel = sectionCtaMap[s.type]
    const ctaBlock = ctaLabel ? `\n      <div class="section-cta"><a href="#" class="btn-primary">${ctaLabel}</a></div>` : ''
    return `  <section class="section${alt}">\n    <div class="section-inner">\n${title}${subtitle}${inner}${ctaBlock}\n    </div>\n  </section>`
  }).join('\n\n')

  // FAQ HTML for all non-legal pages — contextual per page type
  const faqData: Record<string, Array<{ q: string; a: string }>> = n.getFaqData()
  // Market pages share generic trading FAQ
  if (options.niche !== 'crypto_exchange') {
    const marketFaq = [
      { q: 'How do I start trading this market?', a: 'Open a free account in 2 minutes, verify your identity, deposit funds (minimum $100), and start trading. You can also practice first with our $100,000 demo account at no cost.' },
      { q: 'What leverage is available?', a: 'Leverage varies by instrument and jurisdiction. Retail clients can access up to 1:30 (EU/UK) or 1:500 (professional clients). Higher leverage amplifies both profits and losses.' },
      { q: 'Are there any overnight fees?', a: 'Swap fees may apply when holding positions overnight. Rates depend on the instrument and direction of your trade. Swap-free Islamic accounts are available upon request.' },
      { q: 'Can I trade on mobile?', a: 'Yes. All our markets are available on our mobile apps for iOS and Android, plus our browser-based WebTrader. Trade from anywhere with full charting and order management.' },
    ]
    if (page.slug.startsWith('markets/')) { faqData[page.slug] = marketFaq }
  }
  // About/regulation share corporate FAQ
  const corporateFaq = options.niche === 'crypto_exchange' ? [
    { q: 'Where is the company headquartered?', a: 'Our global headquarters is located at One Raffles Quay, #22-01, Singapore 048583. We also have offices in New York, London, and Sydney.' },
    { q: 'How long has the exchange been operating?', a: 'We were founded in 2019 and have grown to serve over 10 million verified users in 180+ countries. We are registered with FinCEN, AUSTRAC, and MAS.' },
    { q: 'Is the exchange publicly listed?', a: 'We are a privately held company committed to long-term growth and stability. Our Proof of Reserves is published monthly and audited by Armanino LLP.' },
    { q: 'How are digital assets protected?', a: 'We store 98% of all digital assets in air-gapped cold storage with multi-signature authorization. Our $250M insurance fund and SOC 2 Type II certification provide additional security.' },
  ] : [
    { q: 'Where is the company headquartered?', a: 'Our global headquarters is located at 110 Bishopsgate, London EC2N 4AY, United Kingdom. We also have offices in Dubai, Singapore, and Sydney.' },
    { q: 'How long has the company been operating?', a: 'We were founded in 2018 and have grown to serve over 500,000 traders in 150+ countries. We are regulated by the FCA, CySEC, DFSA, and ASIC.' },
    { q: 'Is the company publicly listed?', a: 'We are a privately held company committed to long-term growth and stability. Our financial reports are available to regulators and audited by a Big Four accounting firm annually.' },
    { q: 'How are client funds protected?', a: 'All client funds are held in segregated accounts at tier-1 banks (Barclays, Lloyds), completely separate from company funds. Clients are protected by regulatory compensation schemes up to &pound;85,000 (FSCS).' },
  ]
  if (['about', 'regulation', 'partners'].includes(page.slug)) { faqData[page.slug] = corporateFaq }

  const pageFaqs = faqData[page.slug]
  const faqHtml = (pageFaqs && !isLegalPage) ? `
  <section class="section section-alt">
    <div class="section-inner">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <p class="section-subtitle">Everything you need to know${page.slug !== 'home' ? ' about ' + escapeHtml(page.title).toLowerCase() : ' to get started'}</p>
      <div class="faq-list">
${pageFaqs.map(f => `        <div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">${f.q}</div><div class="faq-a">${f.a}</div></div>`).join('\n')}
      </div>
      <div class="section-cta"><a href="#" class="btn-primary">${n.faqCTA}</a></div>
    </div>
  </section>` : ''

  const corePages = pages.filter((p) => ['about', 'contact', 'faq', 'education', 'support'].includes(p.slug))
  const legalPages = pages.filter((p) => p.pageType === 'legal' || ['terms', 'privacy', 'risk-disclosure', 'risk-warning', 'regulation'].includes(p.slug))
  const marketPages = pages.filter((p) => p.slug.startsWith('markets/') || ['spot-trading', 'futures', 'staking'].includes(p.slug))
  const year = new Date().getFullYear()

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(metaTitle)}</title>
  <meta name="description" content="${escapeHtml(metaDescription)}">
  <meta property="og:title" content="${escapeHtml(metaTitle)}">
  <meta property="og:description" content="${escapeHtml(metaDescription)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://${escapeHtml(domain)}/${page.slug === 'home' ? '' : page.slug}">
  <meta property="og:site_name" content="${escapeHtml(brandName)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(metaTitle)}">
  <meta name="twitter:description" content="${escapeHtml(metaDescription)}">
  <link rel="canonical" href="https://${escapeHtml(domain)}/${page.slug === 'home' ? '' : page.slug}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
${gtmHead(options)}${ga4Script(options)}</head>
<body>
${gtmBody(options)}${heroConfig.variant !== 'legal' ? `  <div class="promo-bar">
    ${n.promoHTML}
  </div>
` : ''}  <div class="announcement-bar">
    ${n.announcementHTML}
  </div>

  <nav class="navbar">
    <div class="navbar-inner">
      <a href="index.html" class="navbar-brand">${escapeHtml(brandName)}</a>
      <ul class="navbar-links">
${navLinks}
      </ul>
      <div class="navbar-actions">
        <div class="lang-selector">
          <span class="lang-flag">🌐</span>
          <span class="lang-code">EN</span>
          <span class="lang-arrow">▼</span>
          <div class="lang-dropdown">
            <a href="#" class="active">🇬🇧 English</a>
            <a href="#">🇪🇸 Español</a>
            <a href="#">🇩🇪 Deutsch</a>
            <a href="#">🇫🇷 Français</a>
            <a href="#">🇦🇪 العربية</a>
            <a href="#">🇯🇵 日本語</a>
            <a href="#">🇨🇳 中文</a>
          </div>
        </div>
        <a href="#" class="navbar-login">${n.loginLabel}</a>
        <a href="#" class="navbar-cta">${n.navCTA}</a>
      </div>
      <button class="navbar-toggle" onclick="document.getElementById('mobileMenu').classList.toggle('open')" aria-label="Toggle navigation"><span></span><span></span><span></span></button>
    </div>
    <div class="navbar-mobile" id="mobileMenu">
${allMobileLinks}
      <div class="mobile-divider"></div>
      <div class="mobile-cta-group">
        <a href="#" class="btn-primary">${n.mobileCTA}</a>
        <a href="#" class="navbar-login">${n.loginLabel}</a>
      </div>
    </div>
  </nav>

${page.slug !== 'home' && heroConfig.variant !== 'legal' ? `  <div class="breadcrumb">
    <a href="index.html">Home</a>
    <span class="bc-sep">/</span>
${page.slug.startsWith('markets/') ? `    <a href="#">Markets</a>\n    <span class="bc-sep">/</span>\n` : ''}    <span class="bc-current">${escapeHtml(page.title)}</span>
  </div>` : ''}
  <section class="hero hero--${heroConfig.variant}">
    <div class="hero-container">
      <div class="hero-inner">
${heroConfig.badge ? `        <div class="hero-badge"><span class="badge-dot"></span> ${heroConfig.badge}</div>` : ''}
        <div class="hero-trustpilot">
          <span class="tp-stars">★★★★★</span>
          <span class="tp-score">${n.trustpilotScore}</span>
          <span class="tp-text">— ${n.trustpilotReviews}</span>
        </div>
        <h1>${page.slug === 'home' ? n.heroHeading : escapeHtml(heroTitle)}</h1>
${heroSubtitle ? `        <p>${escapeHtml(heroSubtitle)}</p>` : ''}
${heroConfig.pills && heroConfig.pills.length ? `        <div class="hero-pills">${heroConfig.pills.map(p => `<span class="hero-pill">${p}</span>`).join('')}</div>` : ''}
        <div class="hero-buttons">
          <a href="#" class="btn-primary">${n.heroCTAPrimary}</a>
          <a href="#" class="btn-outline">${n.heroCTASecondary}</a>
        </div>
        <div class="hero-micro">${n.heroMicro.map(m => `<span>${m}</span>`).join('')}</div>
        <div class="hero-trust">
${n.heroTrust.map(t => `          <span>${t}</span>`).join('\n')}
        </div>
      </div>
${heroConfig.showMockup ? (options.niche === 'crypto_exchange' ? `      <div class="hero-visual">
        <div class="hero-trader-img">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=620&fit=crop&crop=face&q=80" alt="Smiling crypto trader" class="trader-photo" loading="eager"/>
          <div class="hero-floating-card card-top">
            <span class="hfc-icon">📈</span>
            <div><div class="hfc-label">BTC/USDT</div><div class="hfc-value up">+2.84%</div></div>
          </div>
          <div class="hero-floating-card card-bottom">
            <span class="hfc-icon">💰</span>
            <div><div class="hfc-label">Portfolio</div><div class="hfc-value">$125,430</div></div>
          </div>
        </div>
      </div>` : options.niche === 'prop_trading' ? `      <div class="hero-visual">
        <div class="hero-trader-img">
          <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=700&fit=crop&crop=face" alt="Young funded trader" class="trader-photo" loading="eager"/>
          <div class="hero-floating-card card-top">
            <span class="hfc-icon">🏆</span>
            <div><div class="hfc-label">Challenge</div><div class="hfc-value up">Passed!</div></div>
          </div>
          <div class="hero-floating-card card-bottom">
            <span class="hfc-icon">💰</span>
            <div><div class="hfc-label">Funded</div><div class="hfc-value">$200,000</div></div>
          </div>
        </div>
      </div>` : options.niche === 'copy_trading' ? `      <div class="hero-visual">
        <div class="hero-leaderboard">
          <div class="lb-header">
            <span class="lb-icon">🏆</span>
            <span class="lb-title">Top Traders Leaderboard</span>
          </div>
          <div class="lb-trader">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="TraderMax" class="lb-avatar" loading="eager"/>
            <div class="lb-info">
              <span class="lb-name">@TraderMax</span>
              <span class="lb-copiers">12.4K copiers</span>
            </div>
            <span class="lb-roi up">+42.3%</span>
            <button class="lb-copy-btn">Copy</button>
          </div>
          <div class="lb-trader">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="CryptoQueen" class="lb-avatar" loading="eager"/>
            <div class="lb-info">
              <span class="lb-name">@CryptoQueen</span>
              <span class="lb-copiers">8.2K copiers</span>
            </div>
            <span class="lb-roi up">+38.7%</span>
            <button class="lb-copy-btn">Copy</button>
          </div>
          <div class="lb-trader">
            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="ForexPro" class="lb-avatar" loading="eager"/>
            <div class="lb-info">
              <span class="lb-name">@ForexPro</span>
              <span class="lb-copiers">6.1K copiers</span>
            </div>
            <span class="lb-roi up">+31.2%</span>
            <button class="lb-copy-btn">Copy</button>
          </div>
          <div class="lb-trader">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="IndexQueen" class="lb-avatar" loading="eager"/>
            <div class="lb-info">
              <span class="lb-name">@IndexQueen</span>
              <span class="lb-copiers">4.8K copiers</span>
            </div>
            <span class="lb-roi up">+27.5%</span>
            <button class="lb-copy-btn">Copy</button>
          </div>
        </div>
      </div>` : `      <div class="hero-visual">
        <div class="hero-mockup">
          <div class="mockup-topbar">
            <div class="mockup-dots"><span></span><span></span><span></span></div>
            <span>${n.mockupLabel}</span>
          </div>
          <div class="mockup-balance">
            <span class="mockup-amount">$125,430.00</span>
            <span class="mockup-change up">+2.4%</span>
          </div>
          <div class="mockup-sublabel">Portfolio Value</div>
          <svg class="mockup-chart" viewBox="0 0 340 100" preserveAspectRatio="none">
            <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#10b981" stop-opacity="0.15"/><stop offset="100%" stop-color="#10b981" stop-opacity="0"/></linearGradient></defs>
            <polyline points="0,85 30,78 60,80 90,65 120,68 150,50 180,55 210,38 240,42 270,25 300,28 340,12" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polygon points="0,85 30,78 60,80 90,65 120,68 150,50 180,55 210,38 240,42 270,25 300,28 340,12 340,100 0,100" fill="url(#chartGrad)"/>
          </svg>
          <div class="mockup-rows">
${n.mockupRows.map(r => `            <div class="mockup-row"><span>${r.symbol}</span><span>${r.price}</span><span class="${r.up ? 'up' : 'down'}">${r.change}</span></div>`).join('\n')}
          </div>
        </div>
      </div>`) : heroConfig.visual ? `      <div class="hero-visual">
${heroConfig.visual}
      </div>` : ''}
    </div>
  </section>

${heroConfig.variant !== 'legal' ? `  <div class="social-proof-bar">
    <div class="social-proof-inner">
${n.socialProof.map((sp, i) => `      <div class="sp-item"><span>${sp.icon}</span> <strong>${sp.bold}</strong> ${sp.text}</div>${i < n.socialProof.length - 1 ? '\n      <div class="sp-divider"></div>' : ''}`).join('\n')}
    </div>
  </div>
${options.niche === 'crypto_exchange' ? `
  <div class="traders-bar">
    <div class="traders-inner">
      <div class="traders-avatars">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Trader" class="trader-avatar" loading="lazy"/>
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Trader" class="trader-avatar" loading="lazy"/>
        <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Trader" class="trader-avatar" loading="lazy"/>
        <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Trader" class="trader-avatar" loading="lazy"/>
        <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Trader" class="trader-avatar" loading="lazy"/>
        <span class="trader-avatar trader-more">+9.8K</span>
      </div>
      <div class="traders-text"><strong>10,847 traders</strong> online right now</div>
      <div class="traders-live"><span class="traders-dot"></span>Live</div>
    </div>
  </div>
` : ''}
  <div class="market-ticker">
    <div class="ticker-track">
${n.tickerItems.map(t => `      <span class="ticker-item"><span class="ticker-symbol">${t.symbol}</span> <span class="ticker-price">${t.price}</span> <span class="ticker-change ${t.up ? 'up' : 'down'}">${t.up ? '▲' : '▼'} ${t.change}</span></span>`).join('\n')}
${n.tickerItems.map(t => `      <span class="ticker-item"><span class="ticker-symbol">${t.symbol}</span> <span class="ticker-price">${t.price}</span> <span class="ticker-change ${t.up ? 'up' : 'down'}">${t.up ? '▲' : '▼'} ${t.change}</span></span>`).join('\n')}
    </div>
  </div>

  <div class="regulation-bar">
    <div class="regulation-inner">
${n.regulationItems.map((r, i) => `      <div class="reg-item"><div class="reg-icon">${r.icon}</div><div><div class="reg-label">${r.label}</div><div class="reg-num">${r.num}</div></div></div>${i < n.regulationItems.length - 1 ? '\n      <div class="reg-divider"></div>' : ''}`).join('\n')}
    </div>
  </div>

  <div class="media-bar">
    <div class="media-inner">
      <div class="media-label">As Featured In</div>
      <div class="media-logos">
${n.mediaLogos.map(l => `        <span class="media-logo">${l}</span>`).join('\n')}
      </div>
    </div>
  </div>
` : ''}
${sectionBlocks}

${heroConfig.variant !== 'legal' ? `
  <div class="awards-section">
    <div class="awards-inner">
      <div class="awards-label">Industry Recognition</div>
      <h3 class="awards-title">${options.niche === 'crypto_exchange' ? 'Award-Winning Crypto Exchange' : 'Award-Winning Trading Platform'}</h3>
      <div class="awards-grid">
${n.awards.map(a => `        <div class="award-card"><span class="award-icon">${a.icon}</span><div class="award-name">${a.name}</div><div class="award-source">${a.source}</div><div class="award-year">${a.year}</div></div>`).join('\n')}
      </div>
    </div>
  </div>

  <div class="perf-bar">
    <div class="perf-inner">
${n.perfMetrics.map(p => `      <div class="perf-item"><div class="perf-value">${p.value}<span class="perf-unit">${p.unit}</span></div><div class="perf-label">${p.label}</div></div>`).join('\n')}
    </div>
  </div>

  <div class="security-bar">
    <div class="security-inner">
      <div class="security-label">Your Security Is Our Priority</div>
      <div class="security-badges">
${n.securityBadges.map(b => `        <div class="security-badge"><div class="sb-icon">${b.icon}</div><div class="sb-label">${b.label}</div><div class="sb-sub">${b.sub}</div></div>`).join('\n')}
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-inner">
      <div class="fund-protection">
        <div class="fp-icon">${n.fundProtection.icon}</div>
        <div class="fp-content">
          <div class="fp-title">${n.fundProtection.title}</div>
          <div class="fp-text">${n.fundProtection.text}</div>
          <div class="fp-amounts">
${n.fundProtection.amounts.map(a => `            <div class="fp-amount">${a.flag} ${a.label}</div>`).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </div>
` : ''}
${faqHtml}

  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>${escapeHtml(brandName)}</h4>
          <p>${n.footerDesc}</p>
          <div class="footer-social">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="YouTube">▶</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="TradingView">📊</a>
          </div>
          <div class="footer-app-badges">
            <a href="#" class="footer-app-badge"><span class="fab-icon">🍎</span><span class="fab-text"><span class="fab-label">Download on the</span><span class="fab-store">App Store</span></span></a>
            <a href="#" class="footer-app-badge"><span class="fab-icon">▶️</span><span class="fab-text"><span class="fab-label">Get it on</span><span class="fab-store">Google Play</span></span></a>
          </div>
        </div>
${marketPages.length ? `        <div class="footer-col">\n          <h4>Markets</h4>\n          <ul>\n${marketPages.map((p) => `            <li><a href="${p.slug.replace(/\//g, '-')}.html">${escapeHtml(p.title)}</a></li>`).join('\n')}\n          </ul>\n        </div>` : ''}
${corePages.length ? `        <div class="footer-col">\n          <h4>Company</h4>\n          <ul>\n${corePages.map((p) => `            <li><a href="${p.slug.replace(/\//g, '-')}.html">${escapeHtml(p.title)}</a></li>`).join('\n')}\n          </ul>\n        </div>` : ''}
${legalPages.length ? `        <div class="footer-col">\n          <h4>Legal</h4>\n          <ul>\n${legalPages.map((p) => `            <li><a href="${p.slug.replace(/\//g, '-')}.html">${escapeHtml(p.title)}</a></li>`).join('\n')}\n          </ul>\n        </div>` : ''}
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:support@${escapeHtml(domain)}">support@${escapeHtml(domain)}</a></li>
            <li><a href="https://${escapeHtml(domain)}">${escapeHtml(domain)}</a></li>
            <li style="margin-top:12px;opacity:.5;font-size:.82rem">24/5 Live Support</li>
          </ul>
        </div>
      </div>
      <div class="footer-licenses">
        <div class="footer-licenses-title">Regulatory Licenses</div>
        <div class="footer-licenses-grid">
${n.footerLicenses.map(l => `          <div class="footer-license-item"><strong>${l.title}</strong>${escapeHtml(brandName)}${l.text}</div>`).join('\n')}
        </div>
      </div>
      <div class="footer-regulatory">
${n.footerRegulatory.map(r => `        <span>${r}</span>`).join('\n')}
      </div>
      <div class="footer-payments">
        ${n.footerPayments.map(p => `<span>${p}</span>`).join('')}
      </div>
      <div class="footer-address">
        <span>📍 ${escapeHtml(brandName)}, ${n.footerAddress}</span>
        <a href="tel:${n.footerPhone.replace(/\s/g, '')}">📞 ${n.footerPhone}</a>
        <a href="mailto:support@${escapeHtml(domain)}">📧 support@${escapeHtml(domain)}</a>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${year} ${escapeHtml(brandName)}. All rights reserved.</p>
        <p><a href="terms.html" style="color:inherit;opacity:.6">Terms</a> &middot; <a href="privacy.html" style="color:inherit;opacity:.6">Privacy</a> &middot; <a href="${options.niche === 'crypto_exchange' ? 'risk-warning.html' : 'risk-disclosure.html'}" style="color:inherit;opacity:.6">${options.niche === 'crypto_exchange' ? 'Risk Warning' : 'Risk Disclosure'}</a> &middot; <a href="about.html" style="color:inherit;opacity:.6">About Us</a></p>
      </div>
      <p class="footer-risk">${n.footerRisk} ${escapeHtml(brandName)} is a registered trading name. Company registration no. 12345678.</p>
    </div>
  </footer>
${heroConfig.variant !== 'legal' ? `  <div class="sticky-cta">
    <a href="#" class="btn-primary">${n.stickyCTA}</a>
  </div>
  <div class="live-activity">
    <span class="la-dot"></span>
    <span class="la-text"></span>
    <button class="la-close">&times;</button>
  </div>
` : ''}${chatWidget(options)}
  <div class="cookie-banner" id="cookieBanner">
    <div class="cookie-inner">
      <div class="cookie-text">We use cookies to enhance your trading experience, analyze site traffic, and assist in marketing. By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies. <a href="privacy.html">Privacy Policy</a></div>
      <div class="cookie-actions">
        <button class="btn-cookie btn-decline" onclick="document.getElementById('cookieBanner').classList.remove('show');localStorage.setItem('cookies','declined')">Decline</button>
        <button class="btn-cookie btn-accept" onclick="document.getElementById('cookieBanner').classList.remove('show');localStorage.setItem('cookies','accepted')">Accept All</button>
      </div>
    </div>
  </div>
<script>
// Navbar scroll shadow
window.addEventListener('scroll',function(){document.querySelector('.navbar').classList.toggle('scrolled',window.scrollY>10)});
// Cookie consent
if(!localStorage.getItem('cookies')){setTimeout(function(){var cb=document.getElementById('cookieBanner');if(cb)cb.classList.add('show');},1500);}
// Live activity notifications
(function(){
  var msgs=[
${n.liveActivityMsgs.map(m => `    {flag:'${m.flag}',text:'${m.text.replace(/'/g, "\\'")}'}`).join(',\n')}
  ];
  var el=document.querySelector('.live-activity');
  if(!el)return;
  var textEl=el.querySelector('.la-text');
  var closeBtn=el.querySelector('.la-close');
  var idx=Math.floor(Math.random()*msgs.length);
  var dismissed=false;
  if(closeBtn)closeBtn.addEventListener('click',function(){el.classList.remove('show');dismissed=true;});
  function showNext(){
    if(dismissed)return;
    var m=msgs[idx%msgs.length];
    textEl.innerHTML=m.flag+' '+m.text;
    el.classList.add('show');
    idx++;
    setTimeout(function(){el.classList.remove('show');},5000);
    setTimeout(showNext,12000+Math.random()*8000);
  }
  setTimeout(showNext,4000+Math.random()*3000);
})();
${(options.niche === 'crypto_exchange' || options.niche === 'prop_trading' || options.niche === 'copy_trading') ? `
// Scroll-reveal: animate elements when they enter viewport
(function(){
  var observed=document.querySelectorAll('.section,.feature-card,.award-card,.security-badge,.stat-item,.step-item,.faq-item,.perf-item,.fund-protection');
  if(!observed.length||!('IntersectionObserver' in window))return;
  var viewH=window.innerHeight;
  observed.forEach(function(el){
    var rect=el.getBoundingClientRect();
    // Don't hide elements already visible in viewport on load
    if(rect.top<viewH&&rect.bottom>0){el.style.opacity='1';return;}
    el.style.opacity='0';el.style.animationPlayState='paused';
  });
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.style.opacity='';e.target.style.animationPlayState='running';io.unobserve(e.target);}
    });
  },{threshold:0.08,rootMargin:'0px 0px -60px 0px'});
  observed.forEach(function(el){if(el.style.opacity==='0')io.observe(el);});
})();
// Animated stat counters
(function(){
  var stats=document.querySelectorAll('.stat-value');
  if(!stats.length)return;
  stats.forEach(function(el){
    var text=el.textContent||'';
    var match=text.match(/([\\$]?)([\\d,.]+)(.*)/);
    if(!match)return;
    var prefix=match[1],target=parseFloat(match[2].replace(/,/g,'')),suffix=match[3];
    var hasDecimal=match[2].indexOf('.')!==-1;
    var io2=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting)return;
        io2.unobserve(e.target);
        var start=0,duration=1200,startTime=null;
        function animate(ts){
          if(!startTime)startTime=ts;
          var p=Math.min((ts-startTime)/duration,1);
          var eased=1-Math.pow(1-p,3);
          var val=start+(target-start)*eased;
          var formatted=hasDecimal?val.toFixed(2):Math.floor(val).toLocaleString();
          el.textContent=prefix+formatted+suffix;
          if(p<1)requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
      });
    },{threshold:0.5});
    io2.observe(el);
  });
})();` : ''}
</script>
</body>
</html>`
}

// ─── Section renderer ────────────────────────────────────

function renderSection(s: ParsedSection): string {
  // If content is an array, treat it as items for the appropriate renderer
  if (Array.isArray(s.content)) {
    s.items = s.items || s.content as any
    if (!s.type || s.type === 'text') s.type = 'features'
  }
  switch (s.type) {
    case 'features': return renderFeatures(s)
    case 'pricing': return renderPricing(s)
    case 'list': return renderList(s)
    case 'cta': return renderCta(s)
    case 'table': return renderTable(s)
    case 'stats': return renderStats(s)
    case 'steps': return renderSteps(s)
    case 'testimonials': return renderTestimonials(s)
    case 'icon-grid': return renderIconGrid(s)
    case 'comparison': return renderComparison(s)
    case 'banner': return renderBanner(s)
    case 'two-column': return renderTwoColumn(s)
    case 'faq': return renderFaq(s)
    default: return renderText(s)
  }
}

function renderText(s: ParsedSection): string {
  const c = s.content || ''
  // Guard: if content is not a string, convert it
  const str = typeof c === 'string' ? c : JSON.stringify(c)
  const paras = str.split('\n').filter((l: string) => l.trim()).map((l: string) => `        <p>${escapeHtml(l.trim())}</p>`).join('\n')
  return `      <div class="text-content">\n${paras || `        <p>${escapeHtml(str)}</p>`}\n      </div>`
}

function renderFeatures(s: ParsedSection): string {
  const items = s.items || []
  const cards = items.map((it) => {
    const icon = it.icon ? `          <div class="feature-card-icon">${it.icon}</div>\n` : ''
    return `        <div class="feature-card">\n${icon}          <h3>${escapeHtml(it.title || '')}</h3>\n          <p>${escapeHtml(it.description || '')}</p>\n        </div>`
  }).join('\n')
  return `      <div class="features-grid">\n${cards}\n      </div>`
}

function renderPricing(s: ParsedSection): string {
  const tiers = s.tiers || []
  const cards = tiers.map((t) => {
    const hl = t.highlighted ? ' highlighted' : ''
    const feats = t.features.map((f) => `            <li>${escapeHtml(f)}</li>`).join('\n')
    return `        <div class="pricing-card${hl}">\n          <h3>${escapeHtml(t.name)}</h3>\n          <div class="price">${escapeHtml(t.price)}</div>\n${t.period ? `          <div class="period">${escapeHtml(t.period)}</div>\n` : ''}          <ul>\n${feats}\n          </ul>\n          <a href="#" class="btn-primary">${escapeHtml(t.ctaText || 'Get Started')}</a>\n        </div>`
  }).join('\n')
  return `      <div class="pricing-grid">\n${cards}\n      </div>`
}

function renderList(s: ParsedSection): string {
  const items = s.items || []
  const lis = items.map((it) => {
    if (it.title && it.description) {
      return `        <li><div><div class="list-title">${escapeHtml(it.title)}</div><div class="list-desc">${escapeHtml(it.description)}</div></div></li>`
    }
    return `        <li><div>${escapeHtml(it.title || it.description || it.label || '')}</div></li>`
  }).join('\n')
  return `      <ul class="content-list">\n${lis}\n      </ul>`
}

function renderCta(s: ParsedSection): string {
  const txt = s.ctaText || 'Get Started'
  const url = s.ctaUrl || '#'
  return `  <section class="cta-section">\n    <h2>${escapeHtml(s.title || 'Ready to Start?')}</h2>\n    <p>${escapeHtml(s.content || '')}</p>\n    <a href="${escapeHtml(url)}" class="btn-primary">${escapeHtml(txt)}</a>\n  </section>`
}

function renderTable(s: ParsedSection): string {
  const cols = s.columns || []
  const rows = s.rows || []
  const ths = cols.map((c) => `          <th>${escapeHtml(c)}</th>`).join('\n')
  const trs = rows.map((r) => `        <tr>\n${cols.map((c) => `          <td>${escapeHtml(r[c] || '')}</td>`).join('\n')}\n        </tr>`).join('\n')
  return `      <table class="data-table">\n        <thead><tr>\n${ths}\n        </tr></thead>\n        <tbody>\n${trs}\n        </tbody>\n      </table>`
}

// ─── New section renderers ───────────────────────────────

function renderFaq(s: ParsedSection): string {
  const faqs = s.items || s.content as any || []
  if (!Array.isArray(faqs)) return renderText(s)
  const items = faqs.map((f: any) => {
    return `        <div class="faq-item">\n          <h3 class="faq-question">${escapeHtml(f.question || f.title || '')}</h3>\n          <p class="faq-answer">${escapeHtml(f.answer || f.description || '')}</p>\n        </div>`
  }).join('\n')
  return `      <div class="faq-list">\n${items}\n      </div>`
}

function renderStats(s: ParsedSection): string {
  const stats = s.stats || s.items || s.content as any || []
  if (!Array.isArray(stats)) return renderText(s)
  const items = stats.map((st: any, i: number) => {
    const divider = i < stats.length - 1 ? '\n        <div class="stat-divider"></div>' : ''
    return `        <div class="stat-item">\n          <div class="stat-value">${escapeHtml(st.value)}</div>\n          <div class="stat-label">${escapeHtml(st.label)}</div>\n        </div>${divider}`
  }).join('\n')
  return `      <div class="stats-bar">\n${items}\n      </div>`
}

function renderSteps(s: ParsedSection): string {
  const steps = s.steps || []
  const items = steps.map((st, i) => {
    const connector = i < steps.length - 1 ? '\n          <div class="step-connector"></div>' : ''
    return `        <div class="step-item">\n          <div class="step-number">${i + 1}</div>${connector}\n          <h3>${escapeHtml(st.title)}</h3>\n          <p>${escapeHtml(st.description)}</p>\n        </div>`
  }).join('\n')
  return `      <div class="steps-grid">\n${items}\n      </div>`
}

function renderTestimonials(s: ParsedSection): string {
  const testimonials = s.testimonials || []
  const cards = testimonials.map((t) => {
    const stars = t.rating ? `          <div class="testimonial-rating">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>\n` : ''
    const role = t.role ? `\n          <div class="testimonial-role">${escapeHtml(t.role)}</div>` : ''
    const text = t.text || t.quote || ''
    return `        <div class="testimonial-card">\n${stars}          <div class="testimonial-text">${escapeHtml(text)}</div>\n          <div class="testimonial-author">${escapeHtml(t.author)}</div>${role}\n        </div>`
  }).join('\n')
  return `      <div class="testimonials-grid">\n${cards}\n      </div>`
}

function renderIconGrid(s: ParsedSection): string {
  const items = s.iconItems || []
  const cards = items.map((it) => {
    const desc = it.description ? `\n          <div class="icon-grid-desc">${escapeHtml(it.description)}</div>` : ''
    return `        <div class="icon-grid-item">\n          <span class="icon-grid-icon">${it.icon}</span>\n          <div class="icon-grid-title">${escapeHtml(it.title)}</div>${desc}\n        </div>`
  }).join('\n')
  return `      <div class="icon-grid">\n${cards}\n      </div>`
}

function renderComparison(s: ParsedSection): string {
  const data = s.comparisonData
  if (!data) return ''
  const headerRow = `        <thead><tr>\n          <th>Feature</th>\n          <th class="col-us">${escapeHtml(data.usLabel)}</th>\n          <th class="col-them">${escapeHtml(data.themLabel)}</th>\n        </tr></thead>`
  const bodyRows = data.rows.map((r) => {
    const usCell = r.us === '✓' ? '<span class="comparison-check">✓</span>' : r.us === '✗' ? '<span class="comparison-cross">✗</span>' : escapeHtml(r.us)
    const themCell = r.them === '✓' ? '<span class="comparison-check">✓</span>' : r.them === '✗' ? '<span class="comparison-cross">✗</span>' : escapeHtml(r.them)
    return `        <tr>\n          <td>${escapeHtml(r.feature)}</td>\n          <td class="col-us">${usCell}</td>\n          <td class="col-them">${themCell}</td>\n        </tr>`
  }).join('\n')
  return `      <table class="comparison-table">\n${headerRow}\n        <tbody>\n${bodyRows}\n        </tbody>\n      </table>`
}

function renderBanner(s: ParsedSection): string {
  const type = s.bannerType || 'info'
  const icon = s.bannerIcon || (type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️')
  const title = s.title ? `<strong>${escapeHtml(s.title)}</strong>` : ''
  return `      <div class="banner banner-${type}">\n        <span class="banner-icon">${icon}</span>\n        <div class="banner-content">${title}${escapeHtml(s.content || '')}</div>\n      </div>`
}

function renderTwoColumn(s: ParsedSection): string {
  const left = s.leftContent
  const rightItems = s.rightItems || []

  let leftHtml = ''
  if (left) {
    if (typeof left === 'string') {
      leftHtml = `        <div class="two-col-text">\n          <p>${escapeHtml(left)}</p>\n        </div>`
    } else {
      const bullets = left.bullets ? `\n          <ul class="two-col-bullets">\n${left.bullets.map((b: string) => `            <li>${escapeHtml(b)}</li>`).join('\n')}\n          </ul>` : ''
      const cta = left.ctaText ? `\n          <a href="${escapeHtml(left.ctaUrl || '#')}" class="btn-primary">${escapeHtml(left.ctaText)}</a>` : ''
      leftHtml = `        <div class="two-col-text">\n          <h3>${escapeHtml(left.title)}</h3>\n          <p>${escapeHtml(left.text)}</p>${bullets}${cta}\n        </div>`
    }
  }

  let rightHtml = ''
  if (rightItems.length) {
    const items = rightItems.map((it) => {
      const icon = it.icon ? `<span class="feat-icon">${it.icon}</span>` : ''
      return `            <li>${icon}<div><div class="feat-title">${escapeHtml(it.title)}</div><div class="feat-desc">${escapeHtml(it.description)}</div></div></li>`
    }).join('\n')
    rightHtml = `        <div>\n          <ul class="two-col-features">\n${items}\n          </ul>\n        </div>`
  }

  return `      <div class="two-col">\n${leftHtml}\n${rightHtml}\n      </div>`
}

// ─── Analytics & widgets ─────────────────────────────────

function ga4Script(o: ExportOptions): string {
  if (!o.ga4Id) return ''
  return `  <script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(o.ga4Id)}"></script>\n  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${escapeHtml(o.ga4Id)}');</script>\n`
}

function gtmHead(o: ExportOptions): string {
  if (!o.gtmId) return ''
  return `  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${escapeHtml(o.gtmId)}');</script>\n`
}

function gtmBody(o: ExportOptions): string {
  if (!o.gtmId) return ''
  return `  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${escapeHtml(o.gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n`
}

function chatWidget(o: ExportOptions): string {
  if (!o.chatWidgetProvider || !o.chatWidgetId) return ''
  const id = escapeHtml(o.chatWidgetId)
  switch (o.chatWidgetProvider.toLowerCase()) {
    case 'tawk': return `  <script>var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src='https://embed.tawk.to/${id}/default';s1.charset='UTF-8';s0.parentNode.insertBefore(s1,s0);})();</script>\n`
    case 'intercom': return `  <script>window.intercomSettings={api_base:"https://api-iam.intercom.io",app_id:"${id}"};(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(a){i.q.push(a);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${id}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else{w.addEventListener('load',l,false);}}})();</script>\n`
    case 'crisp': return `  <script>window.$crisp=[];window.CRISP_WEBSITE_ID="${id}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>\n`
    case 'livechat': return `  <script>window.__lc=window.__lc||{};window.__lc.license=${id};(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])}};var s=t.createElement("script");s.async=!0;s.src="https://cdn.livechatinc.com/tracking.js";t.head.appendChild(s);window.LiveChatWidget=e}(window,document,[].slice));</script>\n`
    case 'zendesk': return `  <script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=${id}"></script>\n`
    default: return `  <!-- Chat widget: ${escapeHtml(o.chatWidgetProvider)} (ID: ${id}) -->\n`
  }
}
