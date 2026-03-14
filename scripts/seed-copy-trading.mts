import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BRAND = {
  name: 'SocialTrade Copy Trading',
  brandName: 'SocialTrade',
  niche: 'copy_trading',
  domain: 'socialtrade.io',
  userId: 'cmmmdlchm0000vhqv11potie3', // admin@tradesite.com
  brandColors: JSON.stringify({ primary: '#a855f7', secondary: '#2d1b4e', accent: '#ec4899' }),
  targetMarkets: JSON.stringify(['Global', 'Europe', 'North America', 'Asia']),
}

const PAGES = [
  {
    slug: 'home',
    title: 'Homepage',
    pageType: 'homepage',
    order: 0,
    content: {
      heroTitle: 'Copy the Best. Earn Together.',
      heroSubtitle: 'Follow top-performing traders and automatically mirror their trades in real time. No experience needed — let the pros trade for you while you learn and earn.',
      sections: [
        {
          title: 'Why Traders Love SocialTrade',
          type: 'features',
          content: JSON.stringify([
            { title: 'One-Click Copy Trading', description: 'Browse our leaderboard, find a trader you trust, and copy their trades automatically. Every position they open, you open — in real time.', icon: '📋' },
            { title: 'Verified Track Records', description: 'Every trader on our platform has a verified, transparent performance history. No fake results, no hidden losses — just real data.', icon: '✅' },
            { title: 'Smart Risk Controls', description: 'Set your own stop-loss, max drawdown, and position limits. You\'re always in control even when copying someone else.', icon: '🛡️' },
            { title: 'Social Trading Feed', description: 'See what top traders are thinking. Follow their analysis, market commentary, and trade ideas in a real-time social feed.', icon: '📱' },
            { title: 'Strategy Marketplace', description: 'Discover and subscribe to proven trading strategies. From scalping to swing trading, find what fits your goals.', icon: '🏪' },
            { title: 'Community & Chat', description: 'Join trading rooms, discuss markets, and learn from 100,000+ traders worldwide. Trading is better together.', icon: '💬' },
          ]),
        },
        {
          title: 'The Numbers Speak',
          type: 'stats',
          content: JSON.stringify([
            { value: '100K+', label: 'Active Copiers' },
            { value: '5,000+', label: 'Verified Traders' },
            { value: '$180M+', label: 'Total Copied Volume' },
            { value: '78%', label: 'Copiers in Profit' },
          ]),
        },
        {
          title: 'How Copy Trading Works',
          type: 'steps',
          content: JSON.stringify([
            { step: 1, title: 'Browse Top Traders', description: 'Explore our leaderboard of verified traders. Filter by returns, risk score, asset class, and trading style.' },
            { step: 2, title: 'Copy Automatically', description: 'Hit the Copy button, set your budget and risk limits, and every trade is mirrored to your account instantly.' },
            { step: 3, title: 'Earn Together', description: 'Watch your portfolio grow as top traders execute winning strategies. Withdraw your profits anytime.' },
          ]),
        },
        {
          title: 'What Our Community Says',
          type: 'testimonials',
          content: JSON.stringify([
            { quote: 'I had zero trading experience but I\'ve been consistently profitable for 6 months just by copying two traders on SocialTrade. It literally changed my financial life.', author: 'Elena M.', role: 'Copier, 6 months', rating: 5 },
            { quote: 'As a signal provider, SocialTrade lets me monetize my skills. I have 2,000+ copiers and earn performance fees on top of my own profits.', author: 'David R.', role: 'Top Trader, 2,300 copiers', rating: 5 },
            { quote: 'The social feed is what sets this apart. I learn so much from following top traders\' analysis. It\'s like a trading masterclass every day.', author: 'Priya S.', role: 'Copier & Learner', rating: 5 },
          ]),
        },
      ],
      metaTitle: 'SocialTrade — Copy Top Traders Automatically | Social Trading Platform',
      metaDescription: 'Copy the best traders in one click. SocialTrade lets you automatically mirror top-performing traders, learn from the community, and earn together. Join 100K+ copiers today.',
    },
  },
  {
    slug: 'about',
    title: 'About Us',
    pageType: 'about',
    order: 1,
    content: {
      heroTitle: 'Trading is Better Together',
      heroSubtitle: 'SocialTrade was built on a simple idea: everyone deserves access to expert-level trading. We connect skilled traders with people who want to follow their success.',
      sections: [
        {
          title: 'Our Values',
          type: 'features',
          content: JSON.stringify([
            { title: 'Radical Transparency', description: 'Every trader\'s performance is verified and public. No cherry-picked stats, no hidden drawdowns. What you see is what you get.', icon: '🔍' },
            { title: 'Community First', description: 'We believe the best trading happens in communities. Our platform is built around sharing knowledge, strategies, and success.', icon: '🤝' },
            { title: 'Accessible to Everyone', description: 'You don\'t need years of experience or a finance degree. Copy trading makes professional-grade strategies available to anyone.', icon: '🌍' },
            { title: 'Aligned Incentives', description: 'Traders earn performance fees only when their copiers profit. Everyone wins together or no one does.', icon: '⚖️' },
          ]),
        },
      ],
      metaTitle: 'About SocialTrade — Our Mission & Story',
      metaDescription: 'SocialTrade connects expert traders with copiers worldwide. Learn about our mission to make professional trading accessible to everyone through social copy trading.',
    },
  },
  {
    slug: 'top-traders',
    title: 'Top Traders',
    pageType: 'top-traders',
    order: 2,
    content: {
      heroTitle: 'Top Traders Leaderboard',
      heroSubtitle: 'Explore our highest-performing traders with verified track records. Find the perfect trader to copy based on returns, risk, and trading style.',
      sections: [
        {
          title: 'Featured Traders',
          type: 'features',
          content: JSON.stringify([
            { title: 'AlphaFX_Pro', description: 'Forex specialist with 34% annual return and a conservative risk score. 3,200 copiers. Focuses on major pairs with a swing trading approach.', icon: '🥇' },
            { title: 'CryptoSage', description: 'Crypto and DeFi expert with 52% annual return. 2,800 copiers. Combines technical analysis with on-chain data for high-conviction trades.', icon: '🥈' },
            { title: 'IndexQueen', description: 'Index and equity trader with 28% annual return and ultra-low drawdown. 4,100 copiers. Known for steady, consistent gains with minimal volatility.', icon: '🥉' },
            { title: 'ScalpMaster_UK', description: 'Day trader specializing in scalping Forex and Gold. 41% annual return. 1,900 copiers. High win rate with tight stop-losses.', icon: '⚡' },
            { title: 'SwingTraderPro', description: 'Multi-asset swing trader with 31% annual return. 2,500 copiers. Holds positions for days to weeks, ideal for passive copiers.', icon: '📊' },
            { title: 'MacroVision', description: 'Macro strategist trading commodities and bonds. 25% annual return. 1,600 copiers. Thesis-driven trades based on global economic trends.', icon: '🌐' },
          ]),
        },
      ],
      metaTitle: 'Top Traders Leaderboard — Copy the Best | SocialTrade',
      metaDescription: 'Browse SocialTrade\'s leaderboard of verified top traders. See real performance data, risk scores, and copier counts. Find the perfect trader to copy today.',
    },
  },
  {
    slug: 'how-it-works',
    title: 'How It Works',
    pageType: 'how-it-works',
    order: 3,
    content: {
      heroTitle: 'How Copy Trading Works',
      heroSubtitle: 'Start copying top traders in minutes. No trading experience required.',
      sections: [
        {
          title: 'Your Journey to Smarter Trading',
          type: 'steps',
          content: JSON.stringify([
            { step: 1, title: 'Browse Top Traders', description: 'Explore our leaderboard of 5,000+ verified traders. Filter by returns, risk level, asset class, trading style, and copier reviews. Every stat is real and audited.' },
            { step: 2, title: 'Copy Automatically', description: 'Found a trader you like? Hit Copy, set your budget and risk limits, and you\'re done. Every trade they make is instantly mirrored in your account — proportional to your allocation.' },
            { step: 3, title: 'Earn Together', description: 'Watch your portfolio grow alongside the trader you\'re copying. Monitor performance in real time, adjust your settings anytime, and withdraw profits whenever you want.' },
          ]),
        },
      ],
      metaTitle: 'How Copy Trading Works — 3 Simple Steps | SocialTrade',
      metaDescription: 'Copy trading made simple: browse top traders, copy automatically, and earn together. No experience needed. Start in minutes with SocialTrade.',
    },
  },
  {
    slug: 'pricing',
    title: 'Pricing',
    pageType: 'pricing',
    order: 4,
    content: {
      heroTitle: 'Simple, Transparent Pricing',
      heroSubtitle: 'Choose the plan that fits your trading goals. Upgrade or downgrade anytime.',
      sections: [
        {
          title: 'Copy Trading Plans',
          type: 'pricing',
          content: JSON.stringify([
            {
              name: 'Free',
              price: '$0/mo',
              highlighted: false,
              features: ['Copy up to 1 Trader', 'Basic Social Feed', 'Community Chat Access', 'Standard Execution Speed', 'Email Support', 'Basic Analytics'],
            },
            {
              name: 'Pro',
              price: '$29/mo',
              highlighted: true,
              features: ['Copy up to 10 Traders', 'Full Social Feed & Alerts', 'Private Trading Rooms', 'Priority Execution Speed', 'Strategy Marketplace Access', 'Advanced Analytics & Reports', 'Priority Support'],
            },
            {
              name: 'Elite',
              price: '$79/mo',
              highlighted: false,
              features: ['Unlimited Copy Trading', 'Full Social Feed & Alerts', 'VIP Trading Rooms', 'Fastest Execution Speed', 'Full Strategy Marketplace', 'Premium Analytics & API', 'Dedicated Account Manager', '1-on-1 Strategy Sessions'],
            },
          ]),
        },
      ],
      metaTitle: 'Pricing — Copy Trading Plans | SocialTrade',
      metaDescription: 'SocialTrade pricing: Free, Pro ($29/mo), and Elite ($79/mo). Copy top traders, access the strategy marketplace, and join premium trading rooms.',
    },
  },
  {
    slug: 'community',
    title: 'Community',
    pageType: 'community',
    order: 5,
    content: {
      heroTitle: 'Join the SocialTrade Community',
      heroSubtitle: 'Connect with 100,000+ traders worldwide. Share ideas, discuss markets, and grow together in the most active social trading community.',
      sections: [
        {
          title: 'Community Features',
          type: 'features',
          content: JSON.stringify([
            { title: 'Live Social Feed', description: 'See real-time posts from top traders — their market analysis, trade ideas, and commentary. Like, comment, and share insights with the community.', icon: '📱' },
            { title: 'Trading Rooms', description: 'Join topic-specific chat rooms: Forex, Crypto, Stocks, Indices, and more. Discuss live markets with traders at every level.', icon: '🏠' },
            { title: 'Trader Profiles', description: 'Build your reputation with a public profile showing your track record, strategy, and follower count. Become a top trader others want to copy.', icon: '👤' },
            { title: 'Weekly Competitions', description: 'Compete in weekly trading challenges with real prizes. Climb the leaderboard and earn recognition as a top performer.', icon: '🏆' },
          ]),
        },
      ],
      metaTitle: 'Community Hub — Social Trading Community | SocialTrade',
      metaDescription: 'Join 100,000+ traders in the SocialTrade community. Live social feed, trading rooms, competitions, and more. Trading is better together.',
    },
  },
  {
    slug: 'strategies',
    title: 'Strategies',
    pageType: 'strategies',
    order: 6,
    content: {
      heroTitle: 'Strategy Marketplace',
      heroSubtitle: 'Discover, subscribe to, and deploy proven trading strategies built by expert traders. From conservative income plays to aggressive growth — find your edge.',
      sections: [
        {
          title: 'Popular Strategy Categories',
          type: 'features',
          content: JSON.stringify([
            { title: 'Forex Majors', description: 'Strategies focused on EUR/USD, GBP/USD, USD/JPY and other major currency pairs. Lower volatility, consistent returns, and deep liquidity.', icon: '💱' },
            { title: 'Crypto Momentum', description: 'Capitalize on crypto market trends with momentum-based strategies. Automated entries and exits based on technical signals and volume.', icon: '🪙' },
            { title: 'Index Swing Trading', description: 'Capture multi-day moves in S&P 500, NASDAQ, and global indices. Ideal for traders who prefer fewer, higher-conviction trades.', icon: '📈' },
            { title: 'Gold & Commodities', description: 'Trade gold, oil, and agricultural commodities with macro-driven strategies. Perfect for portfolio diversification and inflation hedging.', icon: '🥇' },
            { title: 'Scalping Bots', description: 'High-frequency strategies executing dozens of trades per day. Small profits per trade, high win rates, and automated execution.', icon: '🤖' },
            { title: 'Multi-Asset Balanced', description: 'Diversified strategies spanning Forex, stocks, crypto, and commodities. Designed for steady growth with controlled drawdowns.', icon: '⚖️' },
          ]),
        },
      ],
      metaTitle: 'Strategy Marketplace — Proven Trading Strategies | SocialTrade',
      metaDescription: 'Browse and subscribe to proven trading strategies on SocialTrade. Forex, crypto, indices, commodities — find expert strategies that match your goals.',
    },
  },
  {
    slug: 'education',
    title: 'Education',
    pageType: 'education',
    order: 7,
    content: {
      heroTitle: 'SocialTrade Academy',
      heroSubtitle: 'Learn to trade smarter — whether you\'re a complete beginner or looking to sharpen your edge. Free courses, live webinars, and community mentorship.',
      sections: [
        {
          title: 'Learning Resources',
          type: 'features',
          content: JSON.stringify([
            { title: 'Copy Trading 101', description: 'New to copy trading? Start here. Learn how to choose traders, manage risk, diversify your copy portfolio, and maximize returns.', icon: '🎓' },
            { title: 'Trading Fundamentals', description: 'Master the basics: technical analysis, chart patterns, risk management, and market psychology. 50+ video lessons with quizzes.', icon: '📚' },
            { title: 'Live Webinars', description: 'Join weekly live sessions with top traders. Watch them analyze markets in real time, explain their strategies, and answer your questions.', icon: '🎥' },
            { title: 'Strategy Guides', description: 'In-depth guides on specific strategies: scalping, swing trading, position trading, and algorithmic approaches. Learn to build your own.', icon: '📖' },
          ]),
        },
      ],
      metaTitle: 'SocialTrade Academy — Free Trading Education',
      metaDescription: 'Learn copy trading and market analysis with SocialTrade Academy. Free courses, live webinars, and expert guides for beginners and advanced traders.',
    },
  },
  {
    slug: 'contact',
    title: 'Contact Us',
    pageType: 'contact',
    order: 8,
    content: {
      heroTitle: 'Contact Us',
      heroSubtitle: 'Our team is here to help you 24/7. Reach out through any channel.',
      sections: [
        {
          title: 'Get in Touch',
          type: 'features',
          content: JSON.stringify([
            { title: 'Live Chat', description: 'Get instant answers from our support team. Available 24/7 on our website and mobile app.', icon: '💬' },
            { title: 'Email Support', description: 'Send us a detailed message at support@socialtrade.io. We respond within 2 hours during business hours.', icon: '📧' },
            { title: 'Community Discord', description: 'Join our Discord server with 100,000+ traders. Get help from both the community and our support team.', icon: '🎮' },
            { title: 'Help Center', description: 'Browse our comprehensive knowledge base with 300+ articles covering copy trading, account setup, payouts, and more.', icon: '📚' },
          ]),
        },
      ],
      metaTitle: 'Contact Us — 24/7 Support | SocialTrade',
      metaDescription: 'Contact SocialTrade via live chat, email, or Discord. 24/7 support for all traders and copiers. Average response time under 2 hours.',
    },
  },
  {
    slug: 'faq',
    title: 'FAQ',
    pageType: 'faq',
    order: 9,
    content: {
      heroTitle: 'Frequently Asked Questions',
      heroSubtitle: 'Everything you need to know about copy trading on SocialTrade.',
      sections: [
        {
          title: 'Frequently Asked Questions',
          type: 'text',
          content: 'What is copy trading? Copy trading allows you to automatically replicate the trades of experienced traders in real time. When they open or close a position, the same action happens in your account proportionally to your allocated funds.\n\nHow do I choose a trader to copy? Browse our leaderboard and filter by annual return, risk score, asset class, trading style, and copier count. Each trader has a detailed profile with verified performance history, drawdown stats, and copier reviews.\n\nIs copy trading risky? All trading involves risk. However, SocialTrade provides tools to manage your risk: set maximum drawdown limits, stop-loss per trader, and diversify across multiple traders. You can stop copying at any time.\n\nHow much money do I need to start? You can start copy trading with as little as $50. We recommend starting with at least $200 to allow proper diversification across multiple traders.\n\nHow do traders earn on SocialTrade? Top traders earn performance fees (typically 10-20% of profits generated for their copiers) plus they trade their own capital. This ensures their incentives are aligned with yours.\n\nCan I become a trader others can copy? Yes. Create a trader profile, build a track record, and once you meet our minimum requirements (3 months history, positive returns), you\'ll appear on the leaderboard for others to copy.\n\nHow do withdrawals work? You can withdraw your funds at any time. We support bank transfers, crypto wallets, and digital payment methods. Withdrawals are processed within 24 hours.',
        },
      ],
      metaTitle: 'FAQ — Copy Trading Questions Answered | SocialTrade',
      metaDescription: 'Get answers to common questions about copy trading on SocialTrade. Learn about choosing traders, managing risk, fees, withdrawals, and more.',
    },
  },
  {
    slug: 'promotions',
    title: 'Promotions',
    pageType: 'promotions',
    order: 10,
    content: {
      heroTitle: 'Current Promotions',
      heroSubtitle: 'Take advantage of our latest offers and start copy trading with a boost.',
      sections: [
        {
          title: 'Active Promotions',
          type: 'features',
          content: JSON.stringify([
            { title: '30-Day Pro Free Trial', description: 'New to SocialTrade? Try our Pro plan free for 30 days. Copy up to 10 traders, access the strategy marketplace, and join premium trading rooms — no credit card required.', icon: '🎁' },
            { title: 'Refer a Friend — Earn $50', description: 'Invite friends to SocialTrade and earn $50 in trading credit for each friend who signs up and funds their account. No limit on referrals.', icon: '👥' },
            { title: 'Top Trader Bonus', description: 'Signal providers who attract 500+ copiers earn a monthly bonus on top of their performance fees. Build your following and earn more.', icon: '🏆' },
            { title: 'First Deposit Match', description: 'Fund your account for the first time and get a 20% deposit match up to $500. Extra capital means more copying power.', icon: '💰' },
          ]),
        },
      ],
      metaTitle: 'Promotions — Current Offers | SocialTrade',
      metaDescription: 'SocialTrade promotions: free Pro trial, referral bonuses, deposit match, and trader rewards. Start copy trading with exclusive offers.',
    },
  },
  {
    slug: 'partners',
    title: 'Partners',
    pageType: 'partners',
    order: 11,
    content: {
      heroTitle: 'Partnership Program',
      heroSubtitle: 'Grow with SocialTrade. Whether you\'re an influencer, affiliate, or institutional partner, we have a program for you.',
      sections: [
        {
          title: 'Partnership Options',
          type: 'features',
          content: JSON.stringify([
            { title: 'Affiliate Program', description: 'Earn up to 30% revenue share for every user you refer. Lifetime commissions, real-time tracking dashboard, and dedicated affiliate manager.', icon: '🤝' },
            { title: 'Influencer Program', description: 'Trading content creators get exclusive perks: co-branded campaigns, sponsored content opportunities, and access to our top traders for interviews.', icon: '📣' },
            { title: 'White Label Solution', description: 'Launch your own copy trading platform powered by SocialTrade technology. Full customization, your brand, our infrastructure.', icon: '🏷️' },
            { title: 'Institutional Partners', description: 'Fund managers and institutions can integrate our copy trading technology via API. Offer social trading features to your existing client base.', icon: '🏛️' },
          ]),
        },
      ],
      metaTitle: 'Partnership Program — Affiliate & White Label | SocialTrade',
      metaDescription: 'Partner with SocialTrade: affiliate program, influencer partnerships, white label solutions, and institutional API access. Earn up to 30% revenue share.',
    },
  },
  {
    slug: 'regulation',
    title: 'Regulation',
    pageType: 'regulation',
    order: 12,
    content: {
      heroTitle: 'Regulatory Information',
      heroSubtitle: 'SocialTrade is committed to operating transparently and within regulatory frameworks worldwide.',
      sections: [
        {
          title: 'Regulatory Information',
          type: 'text',
          content: 'SocialTrade operates under strict regulatory oversight to ensure the safety and security of our users\' funds and data. We hold licenses and registrations in multiple jurisdictions and comply with local financial regulations in every market we serve. Our platform implements robust KYC (Know Your Customer) and AML (Anti-Money Laundering) procedures. All client funds are held in segregated accounts with tier-1 banking partners. We undergo regular third-party audits of our technology, financial practices, and risk management systems. SocialTrade\'s copy trading technology is designed to comply with investment advice regulations by providing tools and information rather than personalized financial advice. Traders on our platform operate independently, and copiers make their own decisions about who to follow. For specific regulatory information related to your jurisdiction, please contact our compliance team at compliance@socialtrade.io.',
        },
      ],
      metaTitle: 'Regulatory Information | SocialTrade',
      metaDescription: 'SocialTrade regulatory information. Learn about our licenses, compliance practices, fund segregation, and commitment to regulatory standards.',
    },
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    pageType: 'legal',
    order: 13,
    content: {
      heroTitle: 'Terms of Service',
      heroSubtitle: 'Please read these terms carefully before using our services.',
      sections: [
        {
          title: 'Terms of Service',
          type: 'text',
          content: 'By accessing and using the SocialTrade platform, you agree to be bound by these Terms of Service. SocialTrade provides a social copy trading platform that allows users to follow and automatically replicate the trades of other users. Copy trading involves risk and past performance of any trader does not guarantee future results. You are solely responsible for your decision to copy any trader and for managing your risk settings. SocialTrade does not provide investment advice; the platform is a tool that connects traders and copiers. All fees, including subscription fees and performance fees, are outlined in your account dashboard and are subject to change with 30 days notice. You must be at least 18 years old and comply with your local jurisdiction\'s laws regarding financial trading. SocialTrade reserves the right to suspend or terminate accounts that violate these terms, engage in market manipulation, or provide misleading performance data. Withdrawals are processed within 24 hours subject to identity verification requirements.',
        },
      ],
      metaTitle: 'Terms of Service | SocialTrade',
      metaDescription: 'SocialTrade Terms of Service. Read our terms and conditions for using the SocialTrade copy trading platform.',
    },
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    pageType: 'legal',
    order: 14,
    content: {
      heroTitle: 'Privacy Policy',
      heroSubtitle: 'Your privacy is important to us. This policy explains how we collect, use, and protect your data.',
      sections: [
        {
          title: 'Privacy Policy',
          type: 'text',
          content: 'SocialTrade collects personal information including name, email, payment details, trading activity, and social interactions on our platform to provide and improve our services. We use industry-standard encryption and security measures to protect your data. Your trading performance data may be displayed publicly if you opt in as a signal provider on our leaderboard. We do not sell your personal information to third parties. We may share data with payment processors, identity verification providers, and regulatory authorities as required by law. We use cookies and analytics to improve our platform experience. You have the right to access, correct, or delete your personal data at any time. You can control the visibility of your profile and trading activity through your privacy settings. For data deletion requests or privacy concerns, contact privacy@socialtrade.io. This policy complies with GDPR, CCPA, and other applicable data protection regulations.',
        },
      ],
      metaTitle: 'Privacy Policy | SocialTrade',
      metaDescription: 'SocialTrade Privacy Policy. Learn how we collect, use, and protect your personal and trading data on our social copy trading platform.',
    },
  },
  {
    slug: 'risk-disclosure',
    title: 'Risk Disclosure',
    pageType: 'legal',
    order: 15,
    content: {
      heroTitle: 'Risk Disclosure',
      heroSubtitle: 'Important information about the risks associated with copy trading.',
      sections: [
        {
          title: 'Risk Disclosure',
          type: 'text',
          content: 'Copy trading and social trading involve significant risks. Past performance of any trader on the SocialTrade platform is not indicative of future results. When you copy a trader, you are exposing your capital to the same market risks they face. Markets can be volatile, and losses can exceed your initial investment. The fact that a trader has a profitable track record does not guarantee continued profitability. Market conditions change, and strategies that worked in the past may not work in the future. You should only invest money you can afford to lose. SocialTrade provides risk management tools including stop-loss settings, maximum drawdown limits, and diversification features, but these cannot eliminate risk entirely. You are solely responsible for your investment decisions, including the choice of which traders to copy and how much capital to allocate. SocialTrade does not provide personalized investment advice. We strongly recommend educating yourself about financial markets and risk management before engaging in copy trading. If you are unsure whether copy trading is appropriate for you, seek independent financial advice.',
        },
      ],
      metaTitle: 'Risk Disclosure | SocialTrade',
      metaDescription: 'Important risk disclosure for SocialTrade users. Understand the risks of copy trading and social trading before investing.',
    },
  },
  {
    slug: 'risk-warning',
    title: 'Risk Warning',
    pageType: 'legal',
    order: 16,
    content: {
      heroTitle: 'Risk Warning',
      heroSubtitle: 'Trading involves significant risk. Please read this warning carefully.',
      sections: [
        {
          title: 'Risk Warning',
          type: 'text',
          content: 'Trading financial instruments including Forex, CFDs, indices, commodities, and cryptocurrencies carries a high level of risk and may not be suitable for all investors. You should carefully consider your investment objectives, level of experience, and risk appetite before engaging in copy trading or any form of trading. There is a possibility that you may sustain a loss equal to or greater than your entire investment. Copy trading does not eliminate market risk — when the trader you copy loses money, you lose money proportionally. SocialTrade does not guarantee any returns or profits. The performance statistics displayed on our platform reflect historical results and are not a promise of future performance. Leverage can amplify both profits and losses. You should not invest money that you cannot afford to lose. SocialTrade is not responsible for any trading losses incurred through copy trading or independent trading on our platform. If you do not understand the risks involved, please seek advice from an independent financial advisor before using our services.',
        },
      ],
      metaTitle: 'Risk Warning | SocialTrade',
      metaDescription: 'Important risk warning for SocialTrade users. Trading and copy trading involve significant risk of loss. Read our full risk warning.',
    },
  },
  {
    slug: 'aml-policy',
    title: 'AML Policy',
    pageType: 'legal',
    order: 17,
    content: {
      heroTitle: 'Anti-Money Laundering Policy',
      heroSubtitle: 'SocialTrade is committed to preventing money laundering and terrorist financing.',
      sections: [
        {
          title: 'AML Policy',
          type: 'text',
          content: 'SocialTrade maintains a comprehensive Anti-Money Laundering (AML) and Counter-Terrorist Financing (CTF) program in compliance with international regulations. All users must complete identity verification (KYC) before depositing funds, copying traders, or withdrawing profits. We require government-issued photo identification, proof of address, and source of funds documentation for larger deposits. Our compliance team monitors transactions for suspicious activity using automated systems and manual review. We report suspicious transactions to relevant financial authorities as required by law. SocialTrade reserves the right to freeze accounts, delay withdrawals, and request additional documentation if suspicious activity is detected. We maintain records of all transactions and identity verification documents for the period required by applicable regulations. Third-party payment processors used by SocialTrade are also required to comply with AML regulations. Users who attempt to use our platform for money laundering, terrorist financing, or any other illegal activity will have their accounts immediately terminated and reported to authorities. For questions about our AML procedures, contact compliance@socialtrade.io.',
        },
      ],
      metaTitle: 'AML Policy | SocialTrade',
      metaDescription: 'SocialTrade Anti-Money Laundering policy. Learn about our KYC requirements, transaction monitoring, and commitment to preventing financial crime.',
    },
  },
  {
    slug: 'careers',
    title: 'Careers',
    pageType: 'careers',
    order: 18,
    content: {
      heroTitle: 'Join the SocialTrade Team',
      heroSubtitle: 'Help us build the future of social trading. We\'re hiring passionate people who want to make financial markets accessible to everyone.',
      sections: [
        {
          title: 'Why Work at SocialTrade',
          type: 'features',
          content: JSON.stringify([
            { title: 'Remote-First Culture', description: 'Work from anywhere in the world. Our team spans 20+ countries and we believe great talent isn\'t limited by geography.', icon: '🌍' },
            { title: 'Cutting-Edge Tech', description: 'Build with the latest: real-time trading infrastructure, social platform at scale, machine learning for trader matching, and more.', icon: '🚀' },
            { title: 'Competitive Compensation', description: 'Top-of-market salary, equity options, annual bonuses, and a generous benefits package including health, wellness, and learning budgets.', icon: '💰' },
            { title: 'Impact at Scale', description: 'Your work directly impacts 100,000+ traders worldwide. Build products that democratize access to financial markets.', icon: '📈' },
          ]),
        },
      ],
      metaTitle: 'Careers at SocialTrade — Join Our Team',
      metaDescription: 'Join SocialTrade and help build the future of social trading. Remote-first, competitive pay, cutting-edge tech. See open positions.',
    },
  },
  {
    slug: 'app',
    title: 'Mobile App',
    pageType: 'app',
    order: 19,
    content: {
      heroTitle: 'Trade Socially, Anywhere',
      heroSubtitle: 'The full power of SocialTrade in your pocket. Copy traders, follow the social feed, and manage your portfolio — all from your phone.',
      sections: [
        {
          title: 'App Features',
          type: 'features',
          content: JSON.stringify([
            { title: 'One-Tap Copy Trading', description: 'Browse the leaderboard, tap to copy, and you\'re done. Manage all your copied traders and risk settings from the app.', icon: '📱' },
            { title: 'Real-Time Social Feed', description: 'Stay connected to the community. See trader posts, market analysis, and trade ideas in a scrollable social feed — like Instagram for traders.', icon: '📲' },
            { title: 'Instant Notifications', description: 'Get push alerts when your copied traders open positions, when you hit profit milestones, or when top traders post new analysis.', icon: '🔔' },
            { title: 'Portfolio Dashboard', description: 'Track your overall performance, individual trader allocations, and P&L in a beautiful, intuitive dashboard designed for mobile.', icon: '📊' },
          ]),
        },
      ],
      metaTitle: 'SocialTrade Mobile App — Copy Trade on the Go',
      metaDescription: 'Download the SocialTrade app for iOS and Android. Copy top traders, follow the social feed, and manage your portfolio anywhere. Free download.',
    },
  },
]

async function main() {
  console.log('Seeding SocialTrade Copy Trading project...')

  // 1. Delete existing project with domain socialtrade.io
  const existingDomain = await prisma.domain.findFirst({
    where: { selectedDomain: 'socialtrade.io' },
  })
  if (existingDomain) {
    console.log(`Found existing project ${existingDomain.projectId}, deleting...`)
    await prisma.project.delete({ where: { id: existingDomain.projectId } })
    console.log('Existing project deleted')
  }

  // 2. Create the project
  const project = await prisma.project.create({
    data: {
      name: BRAND.name,
      brandName: BRAND.brandName,
      niche: BRAND.niche,
      userId: BRAND.userId,
      targetMarkets: BRAND.targetMarkets,
      brandColors: BRAND.brandColors,
      status: 'ACTIVE',
      currentPhase: 6,
    },
  })
  console.log(`Project created: ${project.id}`)

  // 3. Create domain
  await prisma.domain.create({
    data: {
      projectId: project.id,
      selectedDomain: BRAND.domain,
      score: 90,
      status: 'REGISTERED',
      suggestions: JSON.stringify([
        { domain: 'socialtrade.io', score: 90, available: true, price: 39.99 },
        { domain: 'socialtrade.com', score: 95, available: false, price: 0 },
        { domain: 'socialtrade.co', score: 85, available: true, price: 29.99 },
      ]),
    },
  })
  console.log('Domain created')

  // 4. Create website + pages
  const website = await prisma.website.create({
    data: {
      projectId: project.id,
      templateType: 'Copy Trading',
      templateId: 'copy-trading',
      status: 'GENERATED',
    },
  })
  console.log('Website created')

  for (const page of PAGES) {
    await prisma.websitePage.create({
      data: {
        websiteId: website.id,
        slug: page.slug,
        title: page.title,
        pageType: page.pageType,
        content: JSON.stringify(page.content),
        metaTitle: page.content.metaTitle,
        metaDescription: page.content.metaDescription,
        status: 'generated',
        order: page.order,
      },
    })
  }
  console.log(`${PAGES.length} pages created`)

  console.log('\n✅ SocialTrade Copy Trading project created successfully!')
  console.log(`📌 Project ID: ${project.id}`)
  console.log(`🌐 Site URL: https://tradesite-autopilot.vercel.app/site/${project.id}`)
  console.log(`📊 Dashboard URL: https://tradesite-autopilot.vercel.app/dashboard/projects/${project.id}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
