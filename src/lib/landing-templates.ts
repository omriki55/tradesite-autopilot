// Landing page template definitions for trading company campaigns

export interface LandingTemplateField {
  name: string
  type: 'text' | 'email' | 'tel' | 'select'
  required: boolean
  placeholder: string
}

export interface LandingTemplateSection {
  id: string
  title: string
  type: string
  defaultContent: string
}

export interface LandingTemplate {
  id: string
  name: string
  description: string
  icon: string
  defaultHeadline: string
  defaultSubheadline: string
  defaultCtaText: string
  defaultFields: LandingTemplateField[]
  sections: LandingTemplateSection[]
}

export const LANDING_TEMPLATES: LandingTemplate[] = [
  {
    id: 'webinar',
    name: 'Webinar Registration',
    description: 'Capture registrations for live trading webinars with speaker details, agenda, and key takeaways.',
    icon: 'Video',
    defaultHeadline: 'Join Our Live Trading Webinar',
    defaultSubheadline: 'Learn proven strategies from industry experts — live Q&A included.',
    defaultCtaText: 'Reserve My Spot',
    defaultFields: [
      { name: 'email', type: 'email', required: true, placeholder: 'Enter your email address' },
      { name: 'name', type: 'text', required: true, placeholder: 'Your full name' },
      { name: 'phone', type: 'tel', required: false, placeholder: 'Phone number (optional)' },
    ],
    sections: [
      {
        id: 'speaker_bio',
        title: 'Meet Your Host',
        type: 'speaker',
        defaultContent: JSON.stringify({
          name: 'John Smith',
          title: 'Senior Market Analyst',
          bio: 'With over 15 years of experience in forex and commodities trading, John has helped thousands of traders develop profitable strategies. Former head of trading at a tier-1 investment bank.',
          imagePlaceholder: true,
        }),
      },
      {
        id: 'agenda',
        title: 'What You Will Learn',
        type: 'agenda',
        defaultContent: JSON.stringify({
          items: [
            { time: '10:00 AM', topic: 'Welcome and market overview' },
            { time: '10:15 AM', topic: 'Identifying high-probability setups' },
            { time: '10:45 AM', topic: 'Risk management in volatile markets' },
            { time: '11:15 AM', topic: 'Live chart analysis and trade ideas' },
            { time: '11:45 AM', topic: 'Q&A session with the analyst' },
          ],
        }),
      },
      {
        id: 'date_time',
        title: 'Event Details',
        type: 'event_info',
        defaultContent: JSON.stringify({
          date: 'Thursday, March 20, 2025',
          time: '10:00 AM - 12:00 PM EST',
          duration: '2 hours',
          format: 'Live online (Zoom)',
          replay: 'Recording available for 48 hours',
        }),
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        type: 'list',
        defaultContent: JSON.stringify({
          items: [
            'Actionable strategies you can implement immediately',
            'Understanding market structure and order flow',
            'Risk management framework used by professional traders',
            'Exclusive access to our proprietary trading indicators',
            'Certificate of completion for all attendees',
          ],
        }),
      },
    ],
  },
  {
    id: 'demo',
    name: 'Demo Account',
    description: 'Drive demo account signups with platform benefits, screenshots, and quick-start steps.',
    icon: 'Monitor',
    defaultHeadline: 'Open Your Free Demo Account',
    defaultSubheadline: 'Practice trading with $100,000 in virtual funds — zero risk, real market conditions.',
    defaultCtaText: 'Start Trading Now',
    defaultFields: [
      { name: 'email', type: 'email', required: true, placeholder: 'Enter your email address' },
    ],
    sections: [
      {
        id: 'benefits',
        title: 'Why Start With a Demo?',
        type: 'benefits',
        defaultContent: JSON.stringify({
          items: [
            { title: 'Risk-Free Practice', description: 'Trade with virtual funds in real market conditions without risking a single dollar.' },
            { title: 'Full Platform Access', description: 'Get unrestricted access to all trading tools, charts, indicators, and order types.' },
            { title: 'Real-Time Market Data', description: 'Practice with live prices across forex, crypto, commodities, and indices.' },
            { title: 'No Time Limit', description: 'Take as long as you need to build confidence — your demo never expires.' },
            { title: 'Seamless Transition', description: 'Switch to a live account in one click when you are ready. Your settings carry over.' },
          ],
        }),
      },
      {
        id: 'platform_screenshot',
        title: 'Professional Trading Platform',
        type: 'screenshot',
        defaultContent: JSON.stringify({
          imagePlaceholder: true,
          caption: 'Advanced charting, one-click trading, and 50+ technical indicators — all in your browser.',
          features: ['Multi-chart layout', 'One-click execution', '50+ indicators', 'Custom alerts'],
        }),
      },
      {
        id: 'quick_start',
        title: 'Get Started in 3 Steps',
        type: 'steps',
        defaultContent: JSON.stringify({
          steps: [
            { number: 1, title: 'Enter Your Email', description: 'Sign up with just your email address — no credit card required.' },
            { number: 2, title: 'Access Your Platform', description: 'Log in instantly to our web-based trading platform.' },
            { number: 3, title: 'Start Trading', description: 'Place your first trade with $100,000 in virtual funds.' },
          ],
        }),
      },
    ],
  },
  {
    id: 'promotion',
    name: 'Special Promotion',
    description: 'Time-sensitive promotional landing page with countdown, offer details, and bonus description.',
    icon: 'Gift',
    defaultHeadline: 'Limited Time Offer',
    defaultSubheadline: 'Boost your trading power with an exclusive deposit bonus — available for a limited time only.',
    defaultCtaText: 'Claim My Bonus',
    defaultFields: [
      { name: 'email', type: 'email', required: true, placeholder: 'Enter your email address' },
      { name: 'name', type: 'text', required: true, placeholder: 'Your full name' },
    ],
    sections: [
      {
        id: 'offer_details',
        title: 'The Offer',
        type: 'offer',
        defaultContent: JSON.stringify({
          headline: '100% Deposit Bonus',
          description: 'Double your first deposit up to $5,000. Deposit $500, trade with $1,000. Deposit $5,000, trade with $10,000.',
          highlights: [
            'Available on all account types',
            'Bonus credited instantly',
            'Trade any instrument',
            'Withdrawable after meeting volume requirements',
          ],
        }),
      },
      {
        id: 'countdown',
        title: 'Offer Expires In',
        type: 'countdown',
        defaultContent: JSON.stringify({
          endDate: '2025-04-01T23:59:59Z',
          expiredMessage: 'This offer has expired. Contact support for current promotions.',
          urgencyText: 'Only 48 hours remaining — act now before this offer disappears.',
        }),
      },
      {
        id: 'terms',
        title: 'Terms & Conditions',
        type: 'terms',
        defaultContent: JSON.stringify({
          items: [
            'Minimum deposit of $100 required to qualify.',
            'Maximum bonus amount is $5,000.',
            'Bonus requires 30 standard lots of trading volume before withdrawal.',
            'Offer valid for new deposits only — one per client.',
            'The company reserves the right to withdraw the offer at any time.',
            'Standard risk disclaimer applies. Trading involves risk.',
          ],
        }),
      },
      {
        id: 'bonus_description',
        title: 'How It Works',
        type: 'steps',
        defaultContent: JSON.stringify({
          steps: [
            { number: 1, title: 'Register', description: 'Open a live trading account or log into your existing account.' },
            { number: 2, title: 'Deposit', description: 'Make a qualifying deposit of $100 or more using any payment method.' },
            { number: 3, title: 'Receive Bonus', description: 'Your 100% bonus is credited instantly to your trading account.' },
            { number: 4, title: 'Trade & Profit', description: 'Trade with double the capital and maximize your opportunities.' },
          ],
        }),
      },
    ],
  },
  {
    id: 'contest',
    name: 'Trading Contest',
    description: 'Drive contest registrations with prize tables, rules, timelines, and a live leaderboard placeholder.',
    icon: 'Trophy',
    defaultHeadline: 'Join Our Trading Competition',
    defaultSubheadline: 'Compete against traders worldwide for cash prizes totaling $50,000.',
    defaultCtaText: 'Enter the Competition',
    defaultFields: [
      { name: 'email', type: 'email', required: true, placeholder: 'Enter your email address' },
      { name: 'name', type: 'text', required: true, placeholder: 'Your full name' },
      { name: 'account_id', type: 'text', required: false, placeholder: 'Trading account ID (if existing)' },
    ],
    sections: [
      {
        id: 'prize_table',
        title: 'Prize Pool — $50,000',
        type: 'prize_table',
        defaultContent: JSON.stringify({
          prizes: [
            { place: '1st Place', prize: '$20,000 Cash', icon: 'gold' },
            { place: '2nd Place', prize: '$10,000 Cash', icon: 'silver' },
            { place: '3rd Place', prize: '$5,000 Cash', icon: 'bronze' },
            { place: '4th-10th Place', prize: '$1,500 Trading Credit each', icon: 'medal' },
            { place: '11th-25th Place', prize: '$200 Trading Credit each', icon: 'star' },
          ],
          totalPool: '$50,000',
        }),
      },
      {
        id: 'rules',
        title: 'Contest Rules',
        type: 'rules',
        defaultContent: JSON.stringify({
          items: [
            'Open to all verified account holders aged 18 and above.',
            'Minimum starting balance of $500 required.',
            'All trading instruments are eligible.',
            'Rankings based on percentage return, not absolute profit.',
            'Maximum leverage limited to 1:100 during the contest.',
            'No hedging between accounts. One entry per person.',
            'Winners must verify identity before prize distribution.',
            'The company reserves the right to disqualify suspicious activity.',
          ],
        }),
      },
      {
        id: 'timeline',
        title: 'Contest Timeline',
        type: 'timeline',
        defaultContent: JSON.stringify({
          events: [
            { date: 'March 1', label: 'Registration Opens', description: 'Sign up and fund your contest account.' },
            { date: 'March 15', label: 'Trading Begins', description: 'Contest officially starts at market open.' },
            { date: 'April 15', label: 'Trading Ends', description: 'All positions must be closed by 5 PM EST.' },
            { date: 'April 20', label: 'Winners Announced', description: 'Results verified and winners contacted.' },
            { date: 'April 30', label: 'Prizes Distributed', description: 'Cash and credits deposited to winning accounts.' },
          ],
        }),
      },
      {
        id: 'leaderboard',
        title: 'Live Leaderboard',
        type: 'leaderboard',
        defaultContent: JSON.stringify({
          placeholder: true,
          message: 'Leaderboard updates every 15 minutes during contest hours.',
          columns: ['Rank', 'Trader', 'Return %', 'Trades', 'Win Rate'],
          sampleRows: [
            { rank: 1, trader: 'TraderX_92', return: '+42.3%', trades: 87, winRate: '68%' },
            { rank: 2, trader: 'FX_Master', return: '+38.1%', trades: 124, winRate: '61%' },
            { rank: 3, trader: 'AlphaSignals', return: '+35.7%', trades: 56, winRate: '73%' },
          ],
        }),
      },
    ],
  },
  {
    id: 'lead_magnet',
    name: 'Free Trading Guide',
    description: 'Generate leads by offering a free trading guide with preview, table of contents, and social proof.',
    icon: 'BookOpen',
    defaultHeadline: 'Download Your Free Trading Guide',
    defaultSubheadline: 'Master the fundamentals of profitable trading with our comprehensive 50-page guide.',
    defaultCtaText: 'Download Free Guide',
    defaultFields: [
      { name: 'email', type: 'email', required: true, placeholder: 'Enter your email to download' },
    ],
    sections: [
      {
        id: 'guide_preview',
        title: 'What Is Inside',
        type: 'preview',
        defaultContent: JSON.stringify({
          title: 'The Complete Trading Blueprint',
          subtitle: 'From Beginner to Confident Trader',
          pages: 50,
          format: 'PDF',
          imagePlaceholder: true,
          highlights: [
            'Written by professional traders with 20+ years of combined experience',
            'Actionable strategies with real chart examples',
            'Risk management frameworks used by institutional traders',
            'Includes printable cheat sheets and checklists',
          ],
        }),
      },
      {
        id: 'table_of_contents',
        title: 'Table of Contents',
        type: 'toc',
        defaultContent: JSON.stringify({
          chapters: [
            { number: 1, title: 'Understanding the Markets', pages: '1-8', description: 'How financial markets work, key participants, and market structure.' },
            { number: 2, title: 'Technical Analysis Fundamentals', pages: '9-18', description: 'Chart patterns, support/resistance, and candlestick analysis.' },
            { number: 3, title: 'Building a Trading Strategy', pages: '19-28', description: 'Entry and exit rules, backtesting, and strategy optimization.' },
            { number: 4, title: 'Risk Management Mastery', pages: '29-36', description: 'Position sizing, stop-loss placement, and the 1% rule.' },
            { number: 5, title: 'Trading Psychology', pages: '37-44', description: 'Controlling emotions, building discipline, and developing a winning mindset.' },
            { number: 6, title: 'Your First 30 Days Plan', pages: '45-50', description: 'Day-by-day action plan to start trading with confidence.' },
          ],
        }),
      },
      {
        id: 'testimonials',
        title: 'What Traders Are Saying',
        type: 'testimonials',
        defaultContent: JSON.stringify({
          items: [
            { quote: 'This guide completely changed how I approach the markets. The risk management chapter alone is worth its weight in gold.', author: 'Sarah M.', role: 'Swing Trader', rating: 5 },
            { quote: 'Clear, practical, and straight to the point. I wish I had this when I started trading three years ago.', author: 'David K.', role: 'Day Trader', rating: 5 },
            { quote: 'The 30-day plan gave me the structure I needed. I went from confused to confident in just a month.', author: 'Priya R.', role: 'Beginner Trader', rating: 5 },
          ],
        }),
      },
    ],
  },
  {
    id: 'comparison',
    name: 'Broker Comparison',
    description: 'Convert comparison shoppers with a side-by-side feature table, switching CTA, and advantages list.',
    icon: 'BarChart3',
    defaultHeadline: 'See How We Compare',
    defaultSubheadline: 'Transparent comparison — see why thousands of traders are making the switch.',
    defaultCtaText: 'Switch to Us Today',
    defaultFields: [
      { name: 'email', type: 'email', required: true, placeholder: 'Enter your email address' },
      { name: 'name', type: 'text', required: false, placeholder: 'Your name (optional)' },
    ],
    sections: [
      {
        id: 'comparison_table',
        title: 'Feature Comparison',
        type: 'comparison_table',
        defaultContent: JSON.stringify({
          ourBrand: 'Our Platform',
          competitors: ['Competitor A', 'Competitor B'],
          features: [
            { feature: 'Minimum Spread', us: 'From 0.0 pips', competitorA: 'From 0.6 pips', competitorB: 'From 1.0 pips' },
            { feature: 'Commission', us: '$3.50 per lot', competitorA: '$7.00 per lot', competitorB: 'Spread only' },
            { feature: 'Minimum Deposit', us: '$50', competitorA: '$200', competitorB: '$100' },
            { feature: 'Max Leverage', us: '1:500', competitorA: '1:200', competitorB: '1:400' },
            { feature: 'Instruments', us: '250+', competitorA: '120+', competitorB: '80+' },
            { feature: 'Execution Speed', us: '<30ms', competitorA: '<100ms', competitorB: '<200ms' },
            { feature: 'Platforms', us: 'MT4, MT5, Web, Mobile', competitorA: 'MT4, Web', competitorB: 'Proprietary' },
            { feature: 'Regulation', us: 'CySEC, FCA, ASIC', competitorA: 'CySEC', competitorB: 'FSA' },
            { feature: 'Negative Balance Protection', us: 'Yes', competitorA: 'Yes', competitorB: 'No' },
            { feature: '24/7 Support', us: 'Yes', competitorA: 'Business hours only', competitorB: 'Yes' },
          ],
        }),
      },
      {
        id: 'switch_cta',
        title: 'Ready to Switch?',
        type: 'cta_section',
        defaultContent: JSON.stringify({
          headline: 'Switching Is Easy',
          description: 'Transfer your trading to us in under 5 minutes. We will even cover your transfer fees up to $500.',
          steps: ['Open your free account in 2 minutes', 'Verify your identity (usually instant)', 'Fund your account and start trading'],
          badge: 'Transfer fees covered up to $500',
        }),
      },
      {
        id: 'advantages',
        title: 'Why Traders Choose Us',
        type: 'advantages',
        defaultContent: JSON.stringify({
          items: [
            { title: 'Tightest Spreads in the Industry', description: 'Raw spreads from 0.0 pips with no hidden markups. Aggregated from 20+ tier-1 liquidity providers.' },
            { title: 'Lightning-Fast Execution', description: 'Average execution under 30ms with no requotes. Equinix data centers in London, New York, and Tokyo.' },
            { title: 'Multi-Regulated & Trusted', description: 'Licensed by CySEC, FCA, and ASIC. Client funds held in segregated accounts at tier-1 banks.' },
            { title: 'Transparent Pricing', description: 'No hidden fees, no withdrawal charges, no inactivity penalties. What you see is what you pay.' },
            { title: 'Award-Winning Support', description: 'Dedicated account managers and 24/7 multilingual support via live chat, email, and phone.' },
            { title: 'Advanced Trading Tools', description: 'AutoChartist, Trading Central, VPS hosting, and a full suite of professional analysis tools included free.' },
          ],
        }),
      },
    ],
  },
]

export function getLandingTemplate(id: string): LandingTemplate | undefined {
  return LANDING_TEMPLATES.find((t) => t.id === id)
}

export function getLandingTemplateList(): Array<{ id: string; name: string; description: string; icon: string }> {
  return LANDING_TEMPLATES.map(({ id, name, description, icon }) => ({ id, name, description, icon }))
}
