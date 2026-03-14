import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addPages() {
  const cryptoSite = await prisma.website.findFirst({ where: { projectId: 'cmmq5iv4x0001mdzq18nkeq40' } });
  const propSite = await prisma.website.findFirst({ where: { projectId: 'cmmqly8gk00017aiap34fg978' } });

  if (!cryptoSite || !propSite) {
    console.log('Sites not found');
    return;
  }

  // CryptoVault needs 2 more pages (18 → 20)
  const cryptoPages = [
    {
      websiteId: cryptoSite.id, slug: 'referral', title: 'Referral Program', pageType: 'content', status: 'published', order: 18,
      metaTitle: 'CryptoVault Referral Program — Earn Up to 40% Commission',
      metaDescription: 'Invite friends to CryptoVault and earn up to 40% trading fee commission.',
      content: JSON.stringify({
        heroTitle: 'Earn While You Share',
        heroSubtitle: 'Invite friends to CryptoVault and earn up to 40% of their trading fees. Unlimited referrals, instant payouts, and a real-time tracking dashboard.',
        sections: [
          { title: 'How It Works', type: 'steps', content: [
            { step: 1, title: 'Get Your Referral Link', description: 'Generate a unique referral link from your dashboard. Share it on social media, blogs, or directly with friends.' },
            { step: 2, title: 'Friends Sign Up & Trade', description: 'When someone registers using your link and starts trading, you automatically become their referrer.' },
            { step: 3, title: 'Earn Commissions', description: 'Earn up to 40% of their trading fees — paid instantly to your account. No caps, no limits.' }
          ]},
          { title: 'Commission Tiers', type: 'pricing', content: [
            { tier: 'Bronze', referrals: '1-10', commission: '20%' },
            { tier: 'Silver', referrals: '11-50', commission: '30%' },
            { tier: 'Gold', referrals: '51-100', commission: '35%' },
            { tier: 'Diamond', referrals: '100+', commission: '40%' }
          ]},
          { title: 'Why Refer CryptoVault?', type: 'features', content: [
            { title: 'Instant Payouts', description: 'Commissions credited to your account in real-time. Withdraw anytime.', icon: '⚡' },
            { title: 'Lifetime Attribution', description: 'Once someone signs up with your link, you earn from their trades forever.', icon: '♾️' },
            { title: 'Marketing Materials', description: 'Access banners, landing pages, and social media assets to boost conversions.', icon: '🎨' },
            { title: 'Real-Time Dashboard', description: 'Track clicks, signups, trades, and earnings with our live analytics dashboard.', icon: '📊' }
          ]}
        ],
        metaTitle: 'CryptoVault Referral Program — Earn Up to 40% Commission',
        metaDescription: 'Invite friends to CryptoVault and earn up to 40% trading fee commission.'
      })
    },
    {
      websiteId: cryptoSite.id, slug: 'compliance', title: 'Compliance & Regulation', pageType: 'legal', status: 'published', order: 19,
      metaTitle: 'CryptoVault Compliance & Regulation — Licensed Exchange',
      metaDescription: 'CryptoVault operates under multiple global regulatory frameworks.',
      content: JSON.stringify({
        heroTitle: 'Compliance & Regulation',
        heroSubtitle: 'CryptoVault is committed to the highest standards of regulatory compliance, operating under multiple jurisdictions.',
        sections: [
          { title: 'Our Licenses', type: 'features', content: [
            { title: 'FinCEN (United States)', description: 'Registered Money Services Business. Reg No. 31000184930425.', icon: '🇺🇸' },
            { title: 'VASP (European Union)', description: 'MiCA-compliant Virtual Asset Service Provider across all EU member states.', icon: '🇪🇺' },
            { title: 'AUSTRAC (Australia)', description: 'Registered Digital Currency Exchange. Reg No. 100723058.', icon: '🇦🇺' },
            { title: 'Armanino LLP Audit', description: 'Monthly proof-of-reserves audit ensuring 1:1 backing of all customer assets.', icon: '🔍' }
          ]},
          { title: 'Security Measures', type: 'features', content: [
            { title: 'Cold Storage', description: '95% of customer assets in air-gapped cold wallets with multi-sig.', icon: '🔐' },
            { title: '$250M Insurance Fund', description: 'Covering security breaches, system failures, and unauthorized access.', icon: '🛡️' },
            { title: 'SOC 2 Type II', description: 'Annual certification for enterprise-grade security controls.', icon: '✅' },
            { title: 'Anti-Phishing Codes', description: 'Unique codes on all emails to protect against social engineering.', icon: '🎣' }
          ]}
        ],
        metaTitle: 'CryptoVault Compliance & Regulation — Licensed Exchange',
        metaDescription: 'CryptoVault operates under multiple global regulatory frameworks.'
      })
    }
  ];

  // TradeUp needs 10 more pages (10 → 20)
  const propPages = [
    {
      websiteId: propSite.id, slug: 'platforms', title: 'Trading Platforms', pageType: 'content', status: 'published', order: 10,
      metaTitle: 'TradeUp Trading Platforms — MT4, MT5 & WebTrader',
      metaDescription: 'Trade on MetaTrader 4, MetaTrader 5, or our proprietary TradeUp platform.',
      content: JSON.stringify({
        heroTitle: 'Professional Trading Platforms',
        heroSubtitle: 'Choose your weapon. Trade on industry-standard MetaTrader platforms or our proprietary TradeUp platform.',
        sections: [
          { title: 'Available Platforms', type: 'features', content: [
            { title: 'MetaTrader 5', description: 'Industry standard with 80+ indicators, algorithmic trading, and multi-asset support.', icon: '📊' },
            { title: 'MetaTrader 4', description: 'Classic reliability with Expert Advisors, custom indicators, and one-click trading.', icon: '📈' },
            { title: 'TradeUp WebTrader', description: 'Browser-based with TradingView charts, AI insights, and social trading.', icon: '🌐' },
            { title: 'Mobile Apps', description: 'Full-featured iOS and Android apps with push notifications and biometric login.', icon: '📱' }
          ]}
        ]
      })
    },
    {
      websiteId: propSite.id, slug: 'education', title: 'Education Center', pageType: 'content', status: 'published', order: 11,
      metaTitle: 'TradeUp Education — Free Trading Courses',
      metaDescription: 'Learn to trade with free courses, webinars, and resources.',
      content: JSON.stringify({
        heroTitle: 'Learn. Trade. Succeed.',
        heroSubtitle: 'Comprehensive education center with courses and resources to help you pass your challenge.',
        sections: [
          { title: 'Course Library', type: 'features', content: [
            { title: 'Prop Trading Fundamentals', description: '12-lesson course on risk management, position sizing, and challenge strategies.', icon: '📚' },
            { title: 'Technical Analysis', description: 'Advanced chart patterns, volume analysis, and multi-timeframe techniques.', icon: '📊' },
            { title: 'Trading Psychology', description: 'Master your emotions and build discipline for funded trading.', icon: '🧠' },
            { title: 'Strategy Workshop', description: 'Hands-on developing and backtesting profitable strategies.', icon: '🎯' }
          ]}
        ]
      })
    },
    {
      websiteId: propSite.id, slug: 'faq', title: 'FAQ', pageType: 'content', status: 'published', order: 12,
      metaTitle: 'TradeUp FAQ — Common Questions',
      metaDescription: 'Answers to common questions about TradeUp prop trading challenges and funded accounts.',
      content: JSON.stringify({
        heroTitle: 'Frequently Asked Questions',
        heroSubtitle: 'Everything you need to know about challenges, funded accounts, and trading rules.',
        sections: [
          { title: 'General Questions', type: 'faq', content: [
            { question: 'What is prop trading?', answer: 'Trading with a firm\'s capital. Pass our evaluation and trade with up to $200,000.' },
            { question: 'How do I get started?', answer: 'Choose a challenge tier ($10K to $200K), hit the profit target, and get funded.' },
            { question: 'What instruments can I trade?', answer: 'Forex pairs, indices, commodities, and crypto CFDs.' },
            { question: 'Is there a time limit?', answer: 'No time restrictions on Phase 1 or Phase 2.' },
            { question: 'What is the profit split?', answer: 'Up to 90% of all profits. Payouts bi-weekly or on-demand.' },
            { question: 'Can I use Expert Advisors?', answer: 'Yes, all styles welcome — EAs, scalping, swing trading, news trading.' }
          ]}
        ]
      })
    },
    {
      websiteId: propSite.id, slug: 'markets', title: 'Markets', pageType: 'content', status: 'published', order: 13,
      metaTitle: 'TradeUp Markets — 200+ Instruments',
      metaDescription: 'Trade forex, indices, commodities, and crypto with competitive spreads.',
      content: JSON.stringify({
        heroTitle: 'Trade Global Markets',
        heroSubtitle: '200+ instruments across forex, indices, commodities, and cryptocurrencies.',
        sections: [
          { title: 'Available Markets', type: 'features', content: [
            { title: 'Forex', description: '60+ pairs including majors, minors, and exotics. Spreads from 0.0 pips.', icon: '💱' },
            { title: 'Indices', description: 'S&P 500, NASDAQ, DAX, FTSE, and 15+ global indices.', icon: '📈' },
            { title: 'Commodities', description: 'Gold, silver, oil, natural gas, and agricultural commodities.', icon: '🪙' },
            { title: 'Crypto', description: 'Bitcoin, Ethereum, and 20+ crypto CFDs. 24/7 trading.', icon: '₿' }
          ]}
        ]
      })
    },
    {
      websiteId: propSite.id, slug: 'blog', title: 'Blog & News', pageType: 'content', status: 'published', order: 14,
      metaTitle: 'TradeUp Blog — Trading Insights & Analysis',
      metaDescription: 'Trading insights, market analysis, and prop trading tips.',
      content: JSON.stringify({
        heroTitle: 'Blog & Market Insights',
        heroSubtitle: 'Stay ahead with daily analysis and trading tips from our funded traders.',
        sections: [
          { title: 'Latest Posts', type: 'features', content: [
            { title: '5 Risk Management Rules for Prop Traders', description: 'The difference between passing and failing often comes down to risk management.', icon: '📝' },
            { title: 'Market Outlook: Q2 2026', description: 'Key themes, economic events, and trading opportunities for the quarter.', icon: '📊' },
            { title: 'How to Build a Trading Journal', description: 'A step-by-step guide to identify patterns and fix mistakes.', icon: '📓' }
          ]}
        ]
      })
    },
    {
      websiteId: propSite.id, slug: 'affiliates', title: 'Affiliate Program', pageType: 'content', status: 'published', order: 15,
      metaTitle: 'TradeUp Affiliates — Earn Up to $500 Per Referral',
      metaDescription: 'Earn up to $500 CPA per referral with our affiliate program.',
      content: JSON.stringify({
        heroTitle: 'Earn With Every Referral',
        heroSubtitle: 'Up to $500 per referral with real-time tracking and weekly payouts.',
        sections: [
          { title: 'Why Partner With TradeUp?', type: 'features', content: [
            { title: 'Industry-Leading CPA', description: 'Up to $500 per qualified referral.', icon: '💰' },
            { title: 'Weekly Payouts', description: 'Paid every Friday. No minimums, no holdbacks.', icon: '⚡' },
            { title: 'Marketing Materials', description: 'Banners, landing pages, email templates ready to deploy.', icon: '🎨' },
            { title: 'Dedicated Manager', description: 'Personal affiliate manager for strategy and support.', icon: '🤝' }
          ]}
        ]
      })
    },
    {
      websiteId: propSite.id, slug: 'leaderboard', title: 'Leaderboard', pageType: 'content', status: 'published', order: 16,
      metaTitle: 'TradeUp Leaderboard — Top Funded Traders',
      metaDescription: 'See our top performing funded traders with real results.',
      content: JSON.stringify({
        heroTitle: 'Top Traders Leaderboard',
        heroSubtitle: 'Real-time performance. Transparent results. Verified payouts.',
        sections: [
          { title: 'All-Time Stats', type: 'stats', content: [
            { label: 'Total Payouts', value: '$2.4M+' },
            { label: 'Funded Traders', value: '1,200+' },
            { label: 'Avg. Monthly Profit', value: '$4,200' },
            { label: 'Success Rate', value: '23%' }
          ]}
        ]
      })
    },
    {
      websiteId: propSite.id, slug: 'rules', title: 'Trading Rules', pageType: 'content', status: 'published', order: 17,
      metaTitle: 'TradeUp Trading Rules — Challenge Guidelines',
      metaDescription: 'Complete trading rules for challenges and funded accounts.',
      content: JSON.stringify({
        heroTitle: 'Trading Rules & Guidelines',
        heroSubtitle: 'Clear, fair, and transparent rules. No hidden conditions.',
        sections: [
          { title: 'Challenge Rules', type: 'features', content: [
            { title: 'Profit Target', description: 'Phase 1: 8%. Phase 2: 5%. No time limit.', icon: '🎯' },
            { title: 'Daily Drawdown', description: 'Max 5% daily drawdown. Resets at midnight.', icon: '📉' },
            { title: 'Max Drawdown', description: 'Max 10% overall drawdown from initial balance.', icon: '⚠️' },
            { title: 'Min Trading Days', description: 'At least 5 days per phase. No min lot size.', icon: '📅' }
          ]},
          { title: 'Funded Account', type: 'features', content: [
            { title: 'All Strategies Allowed', description: 'Scalping, day trading, swing, EAs, news — all welcome.', icon: '✅' },
            { title: 'Up to 90% Profit Split', description: 'Bi-weekly payouts or on-demand for premium tiers.', icon: '💰' },
            { title: 'Scaling Plan', description: 'Grow 25% every 3 months of consistent profitability. Up to $2M.', icon: '📈' }
          ]}
        ]
      })
    },
    {
      websiteId: propSite.id, slug: 'support', title: 'Support Center', pageType: 'content', status: 'published', order: 18,
      metaTitle: 'TradeUp Support — 24/7 Help Center',
      metaDescription: 'Get help with your account, challenges, payouts, or platforms.',
      content: JSON.stringify({
        heroTitle: '24/7 Support Center',
        heroSubtitle: 'Dedicated support team. Average response under 2 hours.',
        sections: [
          { title: 'Contact Channels', type: 'features', content: [
            { title: 'Live Chat', description: '24/7 via website widget. Under 2 min response.', icon: '💬' },
            { title: 'Email', description: 'support@tradeup.io — within 2 business hours.', icon: '📧' },
            { title: 'Discord', description: '10,000+ traders community with peer support.', icon: '🎮' },
            { title: 'Knowledge Base', description: '200+ articles on setup, guides, and troubleshooting.', icon: '📚' }
          ]}
        ]
      })
    },
    {
      websiteId: propSite.id, slug: 'aml-policy', title: 'AML Policy', pageType: 'legal', status: 'published', order: 19,
      metaTitle: 'TradeUp AML Policy — Anti-Money Laundering',
      metaDescription: 'TradeUp AML/KYC procedures and compliance commitment.',
      content: JSON.stringify({
        heroTitle: 'Anti-Money Laundering Policy',
        heroSubtitle: 'Our commitment to preventing financial crime and maintaining regulatory compliance.',
        sections: [
          { title: 'KYC Requirements', type: 'features', content: [
            { title: 'Identity Verification', description: 'Government-issued photo ID required for all accounts.', icon: '🪪' },
            { title: 'Address Verification', description: 'Proof of address dated within the last 3 months.', icon: '🏠' },
            { title: 'Source of Funds', description: 'Documentation may be required for accounts over $50K.', icon: '💼' },
            { title: 'Ongoing Monitoring', description: 'Continuous transaction monitoring and periodic re-verification.', icon: '🔍' }
          ]}
        ]
      })
    }
  ];

  for (const page of cryptoPages) {
    await prisma.websitePage.create({ data: page });
    console.log('Created crypto page: ' + page.slug);
  }

  for (const page of propPages) {
    await prisma.websitePage.create({ data: page });
    console.log('Created prop page: ' + page.slug);
  }

  // Verify
  const cryptoCount = await prisma.websitePage.count({ where: { websiteId: cryptoSite.id } });
  const propCount = await prisma.websitePage.count({ where: { websiteId: propSite.id } });
  const forexSite = await prisma.website.findFirst({ where: { projectId: 'cmmp0q7p90001sbkisaxts1fz' } });
  const forexCount = forexSite ? await prisma.websitePage.count({ where: { websiteId: forexSite.id } }) : 0;

  console.log('\n✅ Final page counts:');
  console.log('Nova Markets (Forex):', forexCount);
  console.log('CryptoVault (Crypto):', cryptoCount);
  console.log('TradeUp (Prop):', propCount);

  await prisma.$disconnect();
}

addPages();
