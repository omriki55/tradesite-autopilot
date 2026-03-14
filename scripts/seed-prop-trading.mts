import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BRAND = {
  name: 'TradeUp Prop Trading',
  brandName: 'TradeUp',
  niche: 'prop_trading',
  domain: 'tradeup.io',
  userId: 'cmmmdlchm0000vhqv11potie3', // admin@tradesite.com
  brandColors: JSON.stringify({ primary: '#10b981', secondary: '#064e3b', accent: '#f59e0b' }),
  targetMarkets: JSON.stringify(['Global', 'Europe', 'North America', 'Asia']),
}

const PAGES = [
  {
    slug: 'home',
    title: 'Homepage',
    pageType: 'homepage',
    order: 0,
    content: {
      heroTitle: 'Get Funded Up to $200K',
      heroSubtitle: 'Prove your trading skills, get funded with real capital, and keep up to 90% of the profits. No risk to your own money. Start from just $49.',
      sections: [
        {
          title: 'Why Traders Choose TradeUp',
          type: 'features',
          content: JSON.stringify([
            { title: 'Challenge System', description: 'Pass our simple 2-phase challenge and get funded. No time limits, no pressure. Trade at your own pace.', icon: '🎯' },
            { title: '90% Profit Split', description: 'Keep up to 90% of every dollar you earn. The industry\'s most generous profit sharing.', icon: '💰' },
            { title: 'Instant Payouts', description: 'Request your payout and receive it within 24 hours. Bank transfer, crypto, or digital wallet.', icon: '⚡' },
            { title: '200+ Instruments', description: 'Trade Forex, Indices, Commodities, Crypto, and Stocks. All from one powerful dashboard.', icon: '📊' },
            { title: 'Free Education', description: 'Access our trading academy with 100+ video courses, live webinars, and 1-on-1 mentoring.', icon: '🎓' },
            { title: 'Global Community', description: 'Join 50,000+ funded traders from 190 countries. Share strategies, compete, and grow together.', icon: '🌍' },
          ]),
        },
        {
          title: 'Trusted by Millions',
          type: 'stats',
          content: JSON.stringify([
            { value: '50K+', label: 'Funded Traders' },
            { value: '$25M+', label: 'Total Paid Out' },
            { value: '190+', label: 'Countries' },
            { value: '24hrs', label: 'Avg. Payout Time' },
          ]),
        },
        {
          title: 'How It Works',
          type: 'steps',
          content: JSON.stringify([
            { step: 1, title: 'Choose Your Challenge', description: 'Pick your account size from $10K to $200K. Start from just $49.' },
            { step: 2, title: 'Prove Your Skills', description: 'Hit the profit target while staying within drawdown limits. No time pressure.' },
            { step: 3, title: 'Get Funded & Earn', description: 'Pass the challenge, receive your funded account, and keep 90% of profits.' },
          ]),
        },
        {
          title: 'What Our Traders Say',
          type: 'testimonials',
          content: JSON.stringify([
            { quote: 'I went from demo trading to managing a $100K funded account in just 3 weeks. The challenge was fair and the payout was instant.', author: 'Marcus K.', role: 'Funded Trader, $100K Account', rating: 5 },
            { quote: 'Best prop firm I\'ve ever tried. No time limits, free retakes, and the 90% profit split is unbeatable.', author: 'Sarah L.', role: 'Funded Trader, $50K Account', rating: 5 },
            { quote: 'TradeUp changed my life. I\'m now earning a full-time income from trading without risking my own capital.', author: 'James O.', role: 'Funded Trader, $200K Account', rating: 5 },
          ]),
        },
      ],
      metaTitle: 'TradeUp — Get Funded Up to $200K | Prop Trading',
      metaDescription: 'Prove your trading skills and get funded with up to $200K in real capital. Keep up to 90% of profits. No risk to your own money. Start from $49.',
    },
  },
  {
    slug: 'about',
    title: 'About Us',
    pageType: 'about',
    order: 1,
    content: {
      heroTitle: 'Our Mission',
      heroSubtitle: 'We believe talented traders deserve access to capital. TradeUp was founded to democratize trading by removing the biggest barrier — money.',
      sections: [
        {
          title: 'Our Values',
          type: 'features',
          content: JSON.stringify([
            { title: 'Trader First', description: 'Every decision we make starts with one question: does this help our traders succeed? From fair challenge rules to instant payouts, traders always come first.', icon: '🤝' },
            { title: 'Transparency', description: 'No hidden rules, no surprise fees. Our challenge parameters, profit splits, and payout policies are clear and publicly available.', icon: '🔍' },
            { title: 'Innovation', description: 'We continuously improve our platform, tools, and education to give traders every possible edge in the markets.', icon: '🚀' },
            { title: 'Community', description: 'Trading doesn\'t have to be lonely. We\'ve built a global community of 50,000+ traders who learn, share, and grow together.', icon: '🌐' },
          ]),
        },
      ],
      metaTitle: 'About TradeUp — Our Mission & Values',
      metaDescription: 'TradeUp was founded to democratize trading by giving talented traders access to capital. Learn about our mission, values, and team.',
    },
  },
  {
    slug: 'challenges',
    title: 'Trading Challenges',
    pageType: 'challenges',
    order: 2,
    content: {
      heroTitle: 'Trading Challenges',
      heroSubtitle: 'Choose your account size and prove your skills. No time limits. Free retakes included.',
      sections: [
        {
          title: 'Choose Your Challenge',
          type: 'pricing',
          content: JSON.stringify([
            {
              name: 'Starter ($10K)',
              price: '$49',
              highlighted: false,
              features: ['$10K Funded Account', '10% Profit Target', '5% Max Drawdown', 'No Time Limit', 'Free Retake', '80% Profit Split'],
            },
            {
              name: 'Pro ($50K)',
              price: '$149',
              highlighted: true,
              features: ['$50K Funded Account', '8% Profit Target', '5% Max Drawdown', 'No Time Limit', 'Free Retake', '85% Profit Split', 'Priority Support'],
            },
            {
              name: 'Elite ($200K)',
              price: '$349',
              highlighted: false,
              features: ['$200K Funded Account', '8% Profit Target', '5% Max Drawdown', 'No Time Limit', 'Free Retake', '90% Profit Split', 'Priority Support', '1-on-1 Mentoring'],
            },
          ]),
        },
      ],
      metaTitle: 'Trading Challenges — Get Funded from $49 | TradeUp',
      metaDescription: 'Choose your challenge: $10K, $50K, or $200K funded account. No time limits, free retakes, up to 90% profit split. Start from just $49.',
    },
  },
  {
    slug: 'pricing',
    title: 'Pricing',
    pageType: 'pricing',
    order: 3,
    content: {
      heroTitle: 'Trading Challenges',
      heroSubtitle: 'Choose your account size and prove your skills. No time limits. Free retakes included.',
      sections: [
        {
          title: 'Choose Your Challenge',
          type: 'pricing',
          content: JSON.stringify([
            {
              name: 'Starter ($10K)',
              price: '$49',
              highlighted: false,
              features: ['$10K Funded Account', '10% Profit Target', '5% Max Drawdown', 'No Time Limit', 'Free Retake', '80% Profit Split'],
            },
            {
              name: 'Pro ($50K)',
              price: '$149',
              highlighted: true,
              features: ['$50K Funded Account', '8% Profit Target', '5% Max Drawdown', 'No Time Limit', 'Free Retake', '85% Profit Split', 'Priority Support'],
            },
            {
              name: 'Elite ($200K)',
              price: '$349',
              highlighted: false,
              features: ['$200K Funded Account', '8% Profit Target', '5% Max Drawdown', 'No Time Limit', 'Free Retake', '90% Profit Split', 'Priority Support', '1-on-1 Mentoring'],
            },
          ]),
        },
      ],
      metaTitle: 'Pricing — Prop Trading Challenges | TradeUp',
      metaDescription: 'TradeUp challenge pricing: Starter $49, Pro $149, Elite $349. No time limits, free retakes, up to 90% profit split.',
    },
  },
  {
    slug: 'how-it-works',
    title: 'How It Works',
    pageType: 'how-it-works',
    order: 4,
    content: {
      heroTitle: 'How It Works',
      heroSubtitle: 'Getting funded is simple. Follow these 3 steps and start earning.',
      sections: [
        {
          title: 'Your Path to Funding',
          type: 'steps',
          content: JSON.stringify([
            { step: 1, title: 'Choose Your Challenge', description: 'Pick your account size from $10K to $200K. Start from just $49. No hidden fees.' },
            { step: 2, title: 'Prove Your Skills', description: 'Trade with our simulated capital. Hit the profit target while respecting drawdown limits. Take as long as you need.' },
            { step: 3, title: 'Get Funded & Earn', description: 'Pass both phases, receive your funded account, and start earning real money. Keep up to 90% of every profit.' },
          ]),
        },
      ],
      metaTitle: 'How It Works — 3 Steps to Get Funded | TradeUp',
      metaDescription: 'Getting funded with TradeUp is simple: choose your challenge, prove your skills, and start earning up to 90% profit split.',
    },
  },
  {
    slug: 'payouts',
    title: 'Payouts',
    pageType: 'payouts',
    order: 5,
    content: {
      heroTitle: 'Payouts',
      heroSubtitle: 'Fast, secure, and guaranteed. Every time.',
      sections: [
        {
          title: 'Payout Methods',
          type: 'features',
          content: JSON.stringify([
            { title: 'Bank Transfer', description: 'Direct bank wire to your account in any currency. Available in 190+ countries with no transfer fees.', icon: '🏦' },
            { title: 'Cryptocurrency', description: 'Receive payouts in BTC, ETH, or USDT. Processed within 2 hours to your crypto wallet.', icon: '₿' },
            { title: 'Digital Wallets', description: 'PayPal, Skrill, Neteller, and more. Instant processing for maximum convenience.', icon: '💳' },
            { title: '24-Hour Guarantee', description: 'All payout requests are processed within 24 hours. No delays, no excuses, no minimum withdrawal.', icon: '⏱️' },
          ]),
        },
      ],
      metaTitle: 'Payouts — Fast & Secure Withdrawals | TradeUp',
      metaDescription: 'TradeUp payouts processed within 24 hours. Bank transfer, crypto, or digital wallet. No minimum withdrawal, no fees.',
    },
  },
  {
    slug: 'contact',
    title: 'Contact Us',
    pageType: 'contact',
    order: 6,
    content: {
      heroTitle: 'Contact Us',
      heroSubtitle: 'We\'re here to help 24/7',
      sections: [
        {
          title: 'Get in Touch',
          type: 'features',
          content: JSON.stringify([
            { title: 'Live Chat', description: 'Get instant answers from our support team. Available 24/7 on our website and app.', icon: '💬' },
            { title: 'Email Support', description: 'Send us a detailed message at support@tradeup.io. We respond within 2 hours.', icon: '📧' },
            { title: 'Discord Community', description: 'Join our Discord server with 50,000+ traders. Get help from the community and our team.', icon: '🎮' },
            { title: 'FAQ & Help Center', description: 'Browse our comprehensive knowledge base with 200+ articles covering every topic.', icon: '📚' },
          ]),
        },
      ],
      metaTitle: 'Contact Us — 24/7 Support | TradeUp',
      metaDescription: 'Contact TradeUp via live chat, email, or Discord. 24/7 support for all traders. Average response time under 2 hours.',
    },
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    pageType: 'legal',
    order: 7,
    content: {
      heroTitle: 'Terms of Service',
      heroSubtitle: 'Please read these terms carefully before using our services.',
      sections: [
        {
          title: 'Terms of Service',
          type: 'text',
          content: 'By accessing and using the TradeUp platform, you agree to be bound by these Terms of Service. TradeUp provides simulated trading challenges and funded trading accounts. All challenge fees are non-refundable unless otherwise stated in our refund policy. Traders must comply with all trading rules including drawdown limits, profit targets, and prohibited trading strategies. TradeUp reserves the right to terminate accounts that violate these terms. Funded accounts are subject to ongoing compliance with our risk management rules. Profit splits are paid according to the schedule outlined in your challenge tier. TradeUp is not a broker and does not provide financial advice. All trading involves risk and past performance does not guarantee future results.',
        },
      ],
      metaTitle: 'Terms of Service | TradeUp',
      metaDescription: 'TradeUp Terms of Service. Read our terms and conditions for using the TradeUp prop trading platform.',
    },
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    pageType: 'legal',
    order: 8,
    content: {
      heroTitle: 'Privacy Policy',
      heroSubtitle: 'Your privacy is important to us. This policy explains how we collect, use, and protect your data.',
      sections: [
        {
          title: 'Privacy Policy',
          type: 'text',
          content: 'TradeUp collects personal information including name, email, payment details, and trading data to provide our services. We use industry-standard encryption and security measures to protect your data. We do not sell your personal information to third parties. We may share data with payment processors and identity verification providers as necessary to deliver our services. You have the right to access, correct, or delete your personal data at any time. We use cookies and analytics to improve our platform. By using TradeUp, you consent to our data collection practices as described in this policy. For data deletion requests or privacy concerns, contact privacy@tradeup.io.',
        },
      ],
      metaTitle: 'Privacy Policy | TradeUp',
      metaDescription: 'TradeUp Privacy Policy. Learn how we collect, use, and protect your personal data.',
    },
  },
  {
    slug: 'risk-warning',
    title: 'Risk Warning',
    pageType: 'legal',
    order: 9,
    content: {
      heroTitle: 'Risk Warning',
      heroSubtitle: 'Trading involves significant risk. Please read this warning carefully.',
      sections: [
        {
          title: 'Risk Disclosure',
          type: 'text',
          content: 'Trading financial instruments including Forex, CFDs, indices, commodities, and cryptocurrencies carries a high level of risk and may not be suitable for all investors. You should carefully consider your investment objectives, level of experience, and risk appetite before trading. There is a possibility that you may sustain a loss equal to or greater than your entire investment. TradeUp challenge accounts use simulated capital during the evaluation phase. However, funded accounts involve real market exposure and real profits/losses. Past performance is not indicative of future results. You should not invest money that you cannot afford to lose. TradeUp is not responsible for any trading losses incurred on funded accounts.',
        },
      ],
      metaTitle: 'Risk Warning | TradeUp',
      metaDescription: 'Important risk warning for TradeUp traders. Trading involves significant risk of loss. Read our full risk disclosure.',
    },
  },
]

async function main() {
  console.log('Seeding TradeUp Prop Trading project...')

  // 1. Delete existing project with domain tradeup.io
  const existingDomain = await prisma.domain.findFirst({
    where: { selectedDomain: 'tradeup.io' },
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
        { domain: 'tradeup.io', score: 90, available: true, price: 39.99 },
        { domain: 'tradeup.com', score: 95, available: false, price: 0 },
        { domain: 'tradeup.co', score: 85, available: true, price: 29.99 },
      ]),
    },
  })
  console.log('Domain created')

  // 4. Create website + pages
  const website = await prisma.website.create({
    data: {
      projectId: project.id,
      templateType: 'Prop Trading',
      templateId: 'prop-trading',
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

  console.log('\n✅ TradeUp Prop Trading project created successfully!')
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
