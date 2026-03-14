import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BRAND = {
  name: 'CryptoVault Exchange Demo',
  brandName: 'CryptoVault',
  niche: 'crypto_exchange',
  domain: 'cryptovault.exchange',
  userId: 'cmmmdlchm0000vhqv11potie3', // admin@tradesite.com
  brandColors: JSON.stringify({ primary: '#6366f1', secondary: '#1e1b4b', accent: '#f59e0b' }),
  targetMarkets: JSON.stringify(['Global', 'Asia', 'Europe', 'North America']),
}

// Full page content for 18 crypto exchange pages
const PAGES = [
  {
    slug: 'home',
    title: 'Homepage',
    pageType: 'homepage',
    order: 0,
    content: {
      heroTitle: 'Buy, Sell & Trade 500+ Cryptocurrencies',
      heroSubtitle: 'The world\'s most trusted crypto exchange — institutional-grade security, lightning-fast execution, and fees starting at 0.01%. Join 8M+ verified traders in 180+ countries.',
      sections: [
        {
          title: 'Why CryptoVault?',
          type: 'features',
          content: JSON.stringify([
            { title: '500+ Tokens', description: 'Trade Bitcoin, Ethereum, Solana, and 500+ altcoins across spot, futures, and margin markets.', icon: '🪙' },
            { title: 'Ultra-Low Fees', description: 'Maker fees from 0.01% and taker fees from 0.05%. VIP tiers unlock even deeper discounts.', icon: '💰' },
            { title: 'Military-Grade Security', description: '95% cold storage, multi-sig wallets, $250M insurance fund, and SOC 2 Type II certified.', icon: '🔒' },
            { title: 'Instant Settlement', description: 'Deposits credited in under 60 seconds. Withdrawals processed 24/7 with zero delays.', icon: '⚡' },
            { title: 'Advanced Trading', description: 'Professional charts, 50+ order types, grid bots, copy trading, and FIX API for institutions.', icon: '📊' },
            { title: '24/7 Support', description: 'Multilingual support team available around the clock via live chat, email, and Telegram.', icon: '🌐' },
          ]),
        },
        {
          title: 'Trusted by Millions',
          type: 'stats',
          content: JSON.stringify([
            { value: '8M+', label: 'Verified Users' },
            { value: '$12B', label: '24h Trading Volume' },
            { value: '500+', label: 'Listed Tokens' },
            { value: '180+', label: 'Countries Supported' },
          ]),
        },
        {
          title: 'Popular Markets',
          type: 'comparison',
          content: JSON.stringify({
            headers: ['Pair', 'Price', '24h Change', '24h Volume'],
            rows: [
              ['BTC/USDT', '$67,240', '+2.34%', '$4.2B'],
              ['ETH/USDT', '$3,580', '+1.87%', '$2.1B'],
              ['SOL/USDT', '$148.30', '+5.12%', '$890M'],
              ['BNB/USDT', '$612.50', '+0.95%', '$560M'],
              ['XRP/USDT', '$0.6240', '+3.41%', '$420M'],
              ['ADA/USDT', '$0.4850', '+2.78%', '$310M'],
            ],
          }),
        },
        {
          title: 'Start Trading in 3 Steps',
          type: 'steps',
          content: JSON.stringify([
            { step: 1, title: 'Create Your Account', description: 'Sign up in 30 seconds with just an email. Complete KYC verification for full access.' },
            { step: 2, title: 'Deposit Funds', description: 'Fund your account instantly via bank transfer, credit card, Apple Pay, or crypto deposit.' },
            { step: 3, title: 'Start Trading', description: 'Buy your first crypto or use advanced tools — spot, futures, staking, and DeFi — all in one place.' },
          ]),
        },
        {
          title: 'Ready to Start Your Crypto Journey?',
          type: 'cta',
          content: 'Join 8M+ traders worldwide. Create your free account in 30 seconds — no minimum deposit required.',
        },
      ],
      metaTitle: 'CryptoVault Exchange — Buy, Sell & Trade 500+ Cryptocurrencies',
      metaDescription: 'Trade Bitcoin, Ethereum, Solana, and 500+ tokens with ultra-low fees. Institutional-grade security, $250M insurance fund. Join 8M+ traders.',
    },
  },
  {
    slug: 'about',
    title: 'About Us',
    pageType: 'about',
    order: 1,
    content: {
      heroTitle: 'Building the Future of Finance',
      heroSubtitle: 'Founded in 2019, CryptoVault is on a mission to make cryptocurrency accessible, secure, and profitable for everyone — from first-time buyers to institutional traders.',
      sections: [
        {
          title: 'Our Story',
          type: 'text',
          content: 'CryptoVault was born out of frustration with existing exchanges — clunky interfaces, hidden fees, and questionable security practices. Our founders, a team of ex-Goldman Sachs engineers and blockchain researchers, set out to build the exchange they always wanted: one that combines the reliability of traditional finance with the innovation of Web3. Today, CryptoVault processes over $12 billion in daily volume and serves 8 million verified users across 180+ countries.',
        },
        {
          title: 'Our Mission',
          type: 'features',
          content: JSON.stringify([
            { title: 'Democratize Finance', description: 'Make crypto trading accessible to everyone, regardless of experience or geography.', icon: '🌍' },
            { title: 'Security First', description: 'Protect every dollar with military-grade infrastructure and a $250M insurance fund.', icon: '🛡️' },
            { title: 'Radical Transparency', description: 'Publish monthly proof-of-reserves and maintain real-time on-chain audits.', icon: '📋' },
            { title: 'Continuous Innovation', description: 'Ship new features weekly — from DeFi integrations to AI-powered trading tools.', icon: '🚀' },
          ]),
        },
        {
          title: 'By the Numbers',
          type: 'stats',
          content: JSON.stringify([
            { value: '2019', label: 'Founded' },
            { value: '850+', label: 'Team Members' },
            { value: '14', label: 'Global Offices' },
            { value: '$2.1B', label: 'Funding Raised' },
          ]),
        },
        {
          title: 'Regulatory Compliance',
          type: 'list',
          content: JSON.stringify([
            'Licensed by the Monetary Authority of Singapore (MAS)',
            'Registered with FinCEN (USA) as a Money Services Business',
            'FCA Registered (United Kingdom) for crypto asset activities',
            'VASP Licensed in the European Union under MiCA framework',
            'ADGM Licensed (Abu Dhabi Global Market)',
            'SOC 2 Type II certified infrastructure',
          ]),
        },
      ],
      metaTitle: 'About CryptoVault — Our Mission, Team & Story',
      metaDescription: 'Learn about CryptoVault: founded in 2019, 850+ team members, 14 global offices, and $2.1B in funding. Building the future of crypto trading.',
    },
  },
  {
    slug: 'markets',
    title: 'Markets Overview',
    pageType: 'markets',
    order: 2,
    content: {
      heroTitle: 'Explore 500+ Crypto Markets',
      heroSubtitle: 'From Bitcoin to emerging DeFi tokens — trade spot, futures, and margin across the deepest liquidity pools in the industry.',
      sections: [
        {
          title: 'Top Markets by Volume',
          type: 'comparison',
          content: JSON.stringify({
            headers: ['Asset', 'Price (USD)', '24h Change', 'Market Cap', '24h Volume'],
            rows: [
              ['Bitcoin (BTC)', '$67,240', '+2.34%', '$1.32T', '$42B'],
              ['Ethereum (ETH)', '$3,580', '+1.87%', '$430B', '$18B'],
              ['Solana (SOL)', '$148.30', '+5.12%', '$65B', '$4.2B'],
              ['BNB', '$612.50', '+0.95%', '$94B', '$2.8B'],
              ['XRP', '$0.6240', '+3.41%', '$35B', '$2.1B'],
              ['Cardano (ADA)', '$0.4850', '+2.78%', '$17B', '$890M'],
              ['Avalanche (AVAX)', '$38.20', '+4.56%', '$14B', '$720M'],
              ['Polkadot (DOT)', '$7.85', '+1.23%', '$10B', '$480M'],
            ],
          }),
        },
        {
          title: 'Market Categories',
          type: 'features',
          content: JSON.stringify([
            { title: 'Layer 1 Protocols', description: 'BTC, ETH, SOL, ADA, AVAX, DOT — the foundational blockchains powering Web3.', icon: '🏗️' },
            { title: 'DeFi Tokens', description: 'UNI, AAVE, MKR, COMP, CRV — decentralized finance protocols reshaping lending and trading.', icon: '🏦' },
            { title: 'Memecoins', description: 'DOGE, SHIB, PEPE, WIF — community-driven tokens with explosive growth potential.', icon: '🐕' },
            { title: 'AI & Data', description: 'FET, RNDR, TAO, OCEAN — artificial intelligence tokens at the frontier of crypto innovation.', icon: '🤖' },
            { title: 'Gaming & NFTs', description: 'AXS, SAND, MANA, IMX — play-to-earn gaming and digital collectible ecosystems.', icon: '🎮' },
            { title: 'Stablecoins', description: 'USDT, USDC, DAI, FDUSD — dollar-pegged tokens for risk-free value transfer and DeFi yield.', icon: '💵' },
          ]),
        },
        {
          title: 'Trade with Confidence',
          type: 'cta',
          content: 'Access the deepest liquidity pools and tightest spreads in crypto. Start trading 500+ markets today.',
        },
      ],
      metaTitle: 'Crypto Markets — 500+ Tokens, Live Prices & Volume | CryptoVault',
      metaDescription: 'Explore 500+ cryptocurrency markets on CryptoVault. Live prices, 24h volume, and market caps for Bitcoin, Ethereum, Solana, and more.',
    },
  },
  {
    slug: 'spot-trading',
    title: 'Spot Trading',
    pageType: 'trading',
    order: 3,
    content: {
      heroTitle: 'Professional Spot Trading',
      heroSubtitle: 'Buy and sell 500+ cryptocurrencies with advanced order types, real-time charts, and industry-leading execution speed.',
      sections: [
        {
          title: 'Trading Features',
          type: 'features',
          content: JSON.stringify([
            { title: 'Advanced Order Types', description: 'Limit, market, stop-loss, take-profit, OCO, trailing stop, and iceberg orders.', icon: '📋' },
            { title: 'TradingView Charts', description: 'Professional charting with 100+ technical indicators, drawing tools, and custom timeframes.', icon: '📈' },
            { title: 'Order Book Depth', description: 'Full Level 2 order book visibility with real-time bid/ask updates and trade history.', icon: '📊' },
            { title: 'Ultra-Low Latency', description: 'Matching engine processes 1.4M orders per second with sub-millisecond latency.', icon: '⚡' },
            { title: 'Grid Trading Bots', description: 'Automated grid and DCA bots that trade 24/7 — no coding required.', icon: '🤖' },
            { title: 'Copy Trading', description: 'Follow top-performing traders and automatically replicate their strategies.', icon: '👥' },
          ]),
        },
        {
          title: 'Fee Structure',
          type: 'pricing',
          content: JSON.stringify([
            { name: 'Standard', price: '0.10%', period: 'maker / 0.10% taker', features: ['< $50K monthly volume', 'All spot pairs', 'Basic API access', '10 open orders'], cta: 'Start Trading' },
            { name: 'VIP 1', price: '0.08%', period: 'maker / 0.09% taker', features: ['$50K–$500K monthly', '50+ order types', 'Priority API', '200 open orders'], cta: 'Upgrade', highlighted: false },
            { name: 'VIP 5', price: '0.02%', period: 'maker / 0.04% taker', features: ['$50M+ monthly', 'Custom liquidity', 'Dedicated server', 'Unlimited orders'], cta: 'Contact Us', highlighted: true },
          ]),
        },
      ],
      metaTitle: 'Spot Trading — Buy & Sell 500+ Cryptos | CryptoVault',
      metaDescription: 'Trade crypto spot markets with advanced charts, 50+ order types, and fees from 0.01%. Grid bots, copy trading, and institutional-grade execution.',
    },
  },
  {
    slug: 'futures',
    title: 'Futures Trading',
    pageType: 'trading',
    order: 4,
    content: {
      heroTitle: 'Crypto Futures & Perpetuals',
      heroSubtitle: 'Trade perpetual contracts with up to 125x leverage on 200+ pairs. Institutional-grade risk management and the deepest derivatives liquidity.',
      sections: [
        {
          title: 'Futures Features',
          type: 'features',
          content: JSON.stringify([
            { title: 'Up to 125x Leverage', description: 'Maximize your exposure with adjustable leverage from 1x to 125x on BTC/USDT perpetuals.', icon: '🔥' },
            { title: 'Perpetual Contracts', description: 'No expiry dates — hold positions as long as you want with competitive funding rates.', icon: '♾️' },
            { title: 'Cross & Isolated Margin', description: 'Choose between cross-margin (shared collateral) and isolated margin (per-position risk).', icon: '⚖️' },
            { title: 'Insurance Fund', description: '$250M insurance fund protects traders from auto-deleveraging and socialized losses.', icon: '🛡️' },
            { title: 'Liquidation Engine', description: 'Advanced liquidation engine with partial liquidations to minimize losses.', icon: '⚙️' },
            { title: 'Portfolio Margin', description: 'Unified margin across spot and futures for capital-efficient trading.', icon: '💼' },
          ]),
        },
        {
          title: 'Top Futures Markets',
          type: 'comparison',
          content: JSON.stringify({
            headers: ['Contract', 'Mark Price', '24h Change', 'Open Interest', 'Funding Rate'],
            rows: [
              ['BTC-PERP', '$67,240', '+2.34%', '$8.4B', '0.01%'],
              ['ETH-PERP', '$3,580', '+1.87%', '$4.2B', '0.008%'],
              ['SOL-PERP', '$148.30', '+5.12%', '$1.8B', '0.015%'],
              ['BNB-PERP', '$612.50', '+0.95%', '$780M', '0.005%'],
              ['DOGE-PERP', '$0.1242', '+4.23%', '$420M', '0.02%'],
            ],
          }),
        },
        {
          title: 'Risk Warning',
          type: 'banner',
          content: JSON.stringify({ type: 'warning', text: 'Futures trading involves significant risk. Leverage amplifies both gains and losses. You may lose more than your initial margin. Only trade with funds you can afford to lose.' }),
        },
      ],
      metaTitle: 'Crypto Futures — Up to 125x Leverage on 200+ Pairs | CryptoVault',
      metaDescription: 'Trade crypto perpetual futures with up to 125x leverage. BTC, ETH, SOL futures with deep liquidity, $250M insurance fund, and advanced risk tools.',
    },
  },
  {
    slug: 'staking',
    title: 'Staking & Earn',
    pageType: 'earn',
    order: 5,
    content: {
      heroTitle: 'Earn Up to 18% APY on Your Crypto',
      heroSubtitle: 'Put your crypto to work with flexible staking, locked staking, and DeFi yield products — all from a single, insured platform.',
      sections: [
        {
          title: 'Staking Products',
          type: 'pricing',
          content: JSON.stringify([
            { name: 'Flexible Staking', price: 'Up to 6%', period: 'APY', features: ['Withdraw anytime', 'Daily rewards', '30+ supported tokens', 'No minimum stake', 'Auto-compound'], cta: 'Start Earning' },
            { name: 'Locked Staking', price: 'Up to 12%', period: 'APY', features: ['30/60/90-day terms', 'Higher yields', '50+ supported tokens', 'Min. $100 stake', 'Bonus rewards'], cta: 'Lock & Earn', highlighted: true },
            { name: 'DeFi Yield', price: 'Up to 18%', period: 'APY', features: ['Liquidity pools', 'Yield farming', 'Auto-harvest', 'Risk scoring', 'Impermanent loss protection'], cta: 'Explore DeFi' },
          ]),
        },
        {
          title: 'Top Staking Assets',
          type: 'comparison',
          content: JSON.stringify({
            headers: ['Asset', 'Flexible APY', 'Locked (90d) APY', 'Total Staked'],
            rows: [
              ['Ethereum (ETH)', '3.8%', '5.2%', '$2.4B'],
              ['Solana (SOL)', '5.5%', '8.1%', '$890M'],
              ['Polkadot (DOT)', '8.2%', '12.5%', '$420M'],
              ['Cardano (ADA)', '4.1%', '6.8%', '$380M'],
              ['Cosmos (ATOM)', '9.5%', '14.2%', '$210M'],
              ['Tezos (XTZ)', '5.8%', '9.4%', '$150M'],
            ],
          }),
        },
        {
          title: 'How Staking Works',
          type: 'steps',
          content: JSON.stringify([
            { step: 1, title: 'Choose Your Asset', description: 'Select from 50+ stakable tokens and pick a flexible or locked term.' },
            { step: 2, title: 'Stake Your Crypto', description: 'Confirm the amount and term. Your crypto is secured in insured smart contracts.' },
            { step: 3, title: 'Earn Daily Rewards', description: 'Watch your rewards accumulate daily. Auto-compound for maximum returns.' },
          ]),
        },
      ],
      metaTitle: 'Crypto Staking — Earn Up to 18% APY | CryptoVault',
      metaDescription: 'Stake 50+ cryptocurrencies and earn up to 18% APY. Flexible & locked staking, DeFi yield products, and daily reward payouts on CryptoVault.',
    },
  },
  {
    slug: 'wallet',
    title: 'Wallet & Security',
    pageType: 'security',
    order: 6,
    content: {
      heroTitle: 'Your Crypto, Fort Knox Protected',
      heroSubtitle: 'Industry-leading security infrastructure with 95% cold storage, multi-signature wallets, and a $250M insurance fund.',
      sections: [
        {
          title: 'Security Features',
          type: 'features',
          content: JSON.stringify([
            { title: '95% Cold Storage', description: 'The vast majority of user funds are stored in air-gapped, geographically distributed cold wallets.', icon: '🏔️' },
            { title: 'Multi-Signature', description: 'Every withdrawal requires 3-of-5 multi-sig approval from geographically separated key holders.', icon: '🔑' },
            { title: '$250M Insurance', description: 'Our insurance fund covers losses from security breaches, covering both hot and cold wallet holdings.', icon: '🛡️' },
            { title: 'Real-Time Monitoring', description: '24/7 AI-powered threat detection with automated transaction flagging and human review.', icon: '👁️' },
            { title: 'Withdrawal Whitelist', description: 'Lock withdrawals to pre-approved addresses only. 24-hour cooling period for new addresses.', icon: '📝' },
            { title: 'SOC 2 Type II', description: 'Independently audited security controls meeting the highest enterprise compliance standards.', icon: '✅' },
          ]),
        },
        {
          title: 'Account Protection',
          type: 'list',
          content: JSON.stringify([
            'Two-Factor Authentication (Google Authenticator, YubiKey, SMS)',
            'Biometric login (Face ID, fingerprint) on mobile apps',
            'Anti-phishing code for all CryptoVault emails',
            'Login notifications with IP, device, and location details',
            'Session management with automatic timeout',
            'Hardware security key support (FIDO2/WebAuthn)',
          ]),
        },
        {
          title: 'Proof of Reserves',
          type: 'banner',
          content: JSON.stringify({ type: 'info', text: 'CryptoVault publishes monthly proof-of-reserves reports audited by Deloitte. Our reserve ratio consistently exceeds 100%, meaning every user dollar is fully backed.' }),
        },
      ],
      metaTitle: 'Wallet Security — 95% Cold Storage & $250M Insurance | CryptoVault',
      metaDescription: 'Your crypto is protected by 95% cold storage, multi-sig wallets, $250M insurance fund, and SOC 2 Type II certified infrastructure.',
    },
  },
  {
    slug: 'tokens',
    title: 'Token Listings',
    pageType: 'listings',
    order: 7,
    content: {
      heroTitle: '500+ Listed Tokens & Growing',
      heroSubtitle: 'From blue-chip cryptocurrencies to promising new projects — discover, research, and trade the full spectrum of digital assets.',
      sections: [
        {
          title: 'Recently Listed',
          type: 'features',
          content: JSON.stringify([
            { title: 'Jupiter (JUP)', description: 'Leading Solana DEX aggregator. Listed March 2026.', icon: '🪐' },
            { title: 'Ethena (ENA)', description: 'Synthetic dollar protocol on Ethereum. Listed February 2026.', icon: '💎' },
            { title: 'Wormhole (W)', description: 'Cross-chain messaging and bridging protocol. Listed February 2026.', icon: '🌀' },
            { title: 'Starknet (STRK)', description: 'Ethereum L2 scaling with zero-knowledge proofs. Listed January 2026.', icon: '⭐' },
          ]),
        },
        {
          title: 'Listing Criteria',
          type: 'steps',
          content: JSON.stringify([
            { step: 1, title: 'Application Review', description: 'Projects submit technical documentation, audit reports, and tokenomics details.' },
            { step: 2, title: 'Due Diligence', description: 'Our team evaluates security, team background, community, and regulatory compliance.' },
            { step: 3, title: 'Community Vote', description: 'CVT token holders vote on promising projects. Top-voted tokens fast-track to listing.' },
            { step: 4, title: 'Launch & Monitor', description: 'Tokens go live with market maker support and ongoing compliance monitoring.' },
          ]),
        },
        {
          title: 'Want to List Your Token?',
          type: 'cta',
          content: 'Submit your listing application today. We review every project within 14 business days.',
        },
      ],
      metaTitle: 'Token Listings — 500+ Cryptocurrencies | CryptoVault',
      metaDescription: 'Discover 500+ listed tokens on CryptoVault. See recently listed projects, listing criteria, and how to apply for your token listing.',
    },
  },
  {
    slug: 'fees',
    title: 'Fees & Limits',
    pageType: 'pricing',
    order: 8,
    content: {
      heroTitle: 'Transparent Fees, No Hidden Costs',
      heroSubtitle: 'Simple, competitive pricing with VIP tiers that reward your volume. What you see is what you pay.',
      sections: [
        {
          title: 'Trading Fees',
          type: 'comparison',
          content: JSON.stringify({
            headers: ['Tier', '30d Volume', 'Spot Maker', 'Spot Taker', 'Futures Maker', 'Futures Taker'],
            rows: [
              ['Standard', '< $50K', '0.10%', '0.10%', '0.02%', '0.05%'],
              ['VIP 1', '$50K–$500K', '0.08%', '0.09%', '0.018%', '0.04%'],
              ['VIP 2', '$500K–$2M', '0.06%', '0.08%', '0.015%', '0.035%'],
              ['VIP 3', '$2M–$10M', '0.04%', '0.06%', '0.012%', '0.03%'],
              ['VIP 4', '$10M–$50M', '0.02%', '0.05%', '0.01%', '0.025%'],
              ['VIP 5', '$50M+', '0.01%', '0.04%', '0.008%', '0.02%'],
            ],
          }),
        },
        {
          title: 'Deposit & Withdrawal Fees',
          type: 'comparison',
          content: JSON.stringify({
            headers: ['Method', 'Deposit Fee', 'Withdrawal Fee', 'Processing Time'],
            rows: [
              ['Crypto (BTC)', 'Free', 'Network fee', '10–30 min'],
              ['Crypto (ETH/ERC-20)', 'Free', 'Network fee', '5–15 min'],
              ['Crypto (SOL/SPL)', 'Free', '0.001 SOL', '< 1 min'],
              ['Bank Transfer (SWIFT)', 'Free', '$25', '1–3 business days'],
              ['Credit/Debit Card', '1.5%', 'N/A', 'Instant'],
              ['Apple Pay / Google Pay', '1.5%', 'N/A', 'Instant'],
            ],
          }),
        },
      ],
      metaTitle: 'Fees & Limits — Transparent Pricing | CryptoVault',
      metaDescription: 'CryptoVault fees: spot trading from 0.01% maker, futures from 0.008%. Transparent VIP tiers, deposit/withdrawal fees, and zero hidden costs.',
    },
  },
  {
    slug: 'api',
    title: 'API Documentation',
    pageType: 'developer',
    order: 9,
    content: {
      heroTitle: 'Build on CryptoVault API',
      heroSubtitle: 'REST and WebSocket APIs with 99.99% uptime, sub-5ms latency, and comprehensive documentation for algorithmic traders and developers.',
      sections: [
        {
          title: 'API Features',
          type: 'features',
          content: JSON.stringify([
            { title: 'REST API v3', description: 'Full trading, account, and market data endpoints with OpenAPI 3.0 specification.', icon: '🔌' },
            { title: 'WebSocket Streams', description: 'Real-time order book, trades, klines, and account updates with sub-millisecond delivery.', icon: '📡' },
            { title: 'FIX Protocol', description: 'Institutional-grade FIX 4.4 connectivity for high-frequency trading systems.', icon: '🏛️' },
            { title: 'Sandbox Environment', description: 'Full-featured testnet with fake funds for development and strategy testing.', icon: '🧪' },
          ]),
        },
        {
          title: 'Rate Limits',
          type: 'comparison',
          content: JSON.stringify({
            headers: ['Tier', 'REST Requests/min', 'WebSocket Streams', 'Order Rate/sec'],
            rows: [
              ['Standard', '1,200', '10', '10'],
              ['VIP 1–2', '2,400', '25', '20'],
              ['VIP 3–4', '6,000', '50', '40'],
              ['VIP 5 / Institutional', '12,000', '100', '100'],
            ],
          }),
        },
        {
          title: 'Get Your API Key',
          type: 'cta',
          content: 'Generate your API key in seconds from your dashboard. Full documentation and SDKs available in Python, JavaScript, Java, and Go.',
        },
      ],
      metaTitle: 'API Documentation — REST, WebSocket & FIX | CryptoVault',
      metaDescription: 'CryptoVault API: REST, WebSocket, and FIX protocol with 99.99% uptime. SDKs for Python, JavaScript, Java, and Go. Full sandbox environment.',
    },
  },
  {
    slug: 'education',
    title: 'Learn Crypto',
    pageType: 'education',
    order: 10,
    content: {
      heroTitle: 'Learn Crypto from Zero to Pro',
      heroSubtitle: 'Free courses, guides, and tutorials covering everything from buying your first Bitcoin to advanced DeFi strategies.',
      sections: [
        {
          title: 'Learning Paths',
          type: 'features',
          content: JSON.stringify([
            { title: 'Crypto Basics', description: 'What is blockchain? How to buy Bitcoin. Understanding wallets, keys, and transactions.', icon: '🎓' },
            { title: 'Trading Fundamentals', description: 'Charts, candlesticks, support/resistance, and how to place your first trade.', icon: '📊' },
            { title: 'DeFi & Web3', description: 'Decentralized finance explained: lending, yield farming, liquidity pools, and DAOs.', icon: '🏦' },
            { title: 'Advanced Strategies', description: 'Technical analysis, algorithmic trading, risk management, and portfolio optimization.', icon: '🧠' },
            { title: 'NFTs & Gaming', description: 'Understanding NFTs, play-to-earn gaming, metaverse economies, and digital collectibles.', icon: '🎮' },
            { title: 'Security Best Practices', description: 'Protecting your assets: hardware wallets, seed phrases, avoiding scams, and operational security.', icon: '🔐' },
          ]),
        },
        {
          title: 'Free Resources',
          type: 'stats',
          content: JSON.stringify([
            { value: '200+', label: 'Video Tutorials' },
            { value: '85', label: 'Written Guides' },
            { value: '12', label: 'Interactive Courses' },
            { value: '50K+', label: 'Students Enrolled' },
          ]),
        },
      ],
      metaTitle: 'Learn Crypto — Free Courses & Guides | CryptoVault Academy',
      metaDescription: 'Free crypto education: 200+ video tutorials, 85 guides, and 12 interactive courses. Learn trading, DeFi, NFTs, and security from experts.',
    },
  },
  {
    slug: 'blog',
    title: 'Blog & News',
    pageType: 'blog',
    order: 11,
    content: {
      heroTitle: 'CryptoVault Blog & News',
      heroSubtitle: 'Market analysis, industry insights, product updates, and educational content from our team of crypto experts.',
      sections: [
        {
          title: 'Categories',
          type: 'features',
          content: JSON.stringify([
            { title: 'Market Analysis', description: 'Daily and weekly market outlook, technical analysis, and price predictions.', icon: '📈' },
            { title: 'Industry News', description: 'Breaking news, regulatory updates, and major developments in the crypto space.', icon: '📰' },
            { title: 'Product Updates', description: 'New features, token listings, API updates, and platform improvements.', icon: '🔔' },
            { title: 'Research Reports', description: 'Deep dives into protocols, tokenomics, and emerging blockchain technologies.', icon: '🔬' },
            { title: 'Tutorials', description: 'Step-by-step guides for trading strategies, DeFi protocols, and platform features.', icon: '📝' },
            { title: 'Community', description: 'Trader spotlights, AMA recaps, and community event coverage.', icon: '👥' },
          ]),
        },
      ],
      metaTitle: 'Blog & News — Market Analysis & Updates | CryptoVault',
      metaDescription: 'CryptoVault blog: daily market analysis, industry news, research reports, and product updates. Stay informed with our expert insights.',
    },
  },
  {
    slug: 'support',
    title: 'Help Center',
    pageType: 'support',
    order: 12,
    content: {
      heroTitle: '24/7 Help Center',
      heroSubtitle: 'Find answers to common questions, submit support tickets, or chat with our multilingual team around the clock.',
      sections: [
        {
          title: 'Help Categories',
          type: 'features',
          content: JSON.stringify([
            { title: 'Getting Started', description: 'Account creation, KYC verification, first deposit, and platform navigation.', icon: '🚀' },
            { title: 'Deposits & Withdrawals', description: 'Supported methods, processing times, fees, and troubleshooting failed transactions.', icon: '💳' },
            { title: 'Trading Guide', description: 'Placing orders, reading charts, margin trading, and using trading bots.', icon: '📊' },
            { title: 'Security', description: '2FA setup, API key management, withdrawal whitelist, and account recovery.', icon: '🔒' },
            { title: 'Staking & Earn', description: 'How staking works, reward calculation, lock periods, and redemption process.', icon: '💰' },
            { title: 'API & Integrations', description: 'API key generation, rate limits, WebSocket connections, and SDK usage.', icon: '🔌' },
          ]),
        },
        {
          title: 'Contact Support',
          type: 'stats',
          content: JSON.stringify([
            { value: '< 2 min', label: 'Avg. Response Time' },
            { value: '24/7', label: 'Live Chat' },
            { value: '15+', label: 'Languages' },
            { value: '98.5%', label: 'Satisfaction Rate' },
          ]),
        },
      ],
      metaTitle: '24/7 Help Center — Support & FAQ | CryptoVault',
      metaDescription: 'CryptoVault help center: 24/7 live chat, support tickets, and comprehensive guides. Average response time under 2 minutes.',
    },
  },
  {
    slug: 'contact',
    title: 'Contact Us',
    pageType: 'contact',
    order: 13,
    content: {
      heroTitle: 'Get in Touch',
      heroSubtitle: 'Our global support team is available 24/7 via live chat, email, and community channels.',
      sections: [
        {
          title: 'Contact Channels',
          type: 'features',
          content: JSON.stringify([
            { title: 'Live Chat', description: 'Instant support available 24/7 directly from your dashboard or our website.', icon: '💬' },
            { title: 'Email Support', description: 'support@cryptovault.exchange — average response within 4 hours.', icon: '📧' },
            { title: 'Telegram Community', description: 'Join 250K+ members in our official Telegram group for real-time help and discussions.', icon: '✈️' },
            { title: 'Discord Server', description: 'Connect with traders, developers, and the CryptoVault team on our Discord.', icon: '🎮' },
          ]),
        },
        {
          title: 'Global Offices',
          type: 'list',
          content: JSON.stringify([
            '🇸🇬 Singapore (HQ): 1 Raffles Place, Tower 2, #38-01, Singapore 048616',
            '🇬🇧 London: 25 Old Broad Street, London EC2N 1HN, United Kingdom',
            '🇦🇪 Dubai: DIFC Gate Building, Level 15, Dubai, UAE',
            '🇺🇸 New York: 120 Broadway, Suite 3200, New York, NY 10271',
            '🇯🇵 Tokyo: Ark Hills South Tower, 1-4-5 Roppongi, Minato-ku',
          ]),
        },
      ],
      metaTitle: 'Contact Us — 24/7 Support | CryptoVault',
      metaDescription: 'Contact CryptoVault: 24/7 live chat, email support, Telegram community. Global offices in Singapore, London, Dubai, New York, and Tokyo.',
    },
  },
  {
    slug: 'careers',
    title: 'Careers',
    pageType: 'company',
    order: 14,
    content: {
      heroTitle: 'Join the CryptoVault Team',
      heroSubtitle: 'We\'re building the future of finance. Join 850+ brilliant minds across 14 offices worldwide.',
      sections: [
        {
          title: 'Why Work at CryptoVault',
          type: 'features',
          content: JSON.stringify([
            { title: 'Remote-First', description: 'Work from anywhere. 65% of our team works remotely across 40+ countries.', icon: '🌍' },
            { title: 'Competitive Comp', description: 'Top-of-market salary, equity/token grants, and annual performance bonuses.', icon: '💰' },
            { title: 'Learning Budget', description: '$5,000/year learning stipend for courses, conferences, and professional development.', icon: '📚' },
            { title: 'Crypto Benefits', description: 'Choose to receive salary in crypto. Trading fee discounts and staking bonuses for employees.', icon: '🪙' },
          ]),
        },
        {
          title: 'Open Positions',
          type: 'comparison',
          content: JSON.stringify({
            headers: ['Role', 'Department', 'Location', 'Level'],
            rows: [
              ['Senior Rust Engineer', 'Engineering', 'Remote', 'Senior'],
              ['Blockchain Security Auditor', 'Security', 'Singapore / Remote', 'Senior'],
              ['Product Designer', 'Design', 'London / Remote', 'Mid-Senior'],
              ['Compliance Officer', 'Legal', 'Dubai / Singapore', 'Senior'],
              ['Community Manager', 'Marketing', 'Remote', 'Mid'],
              ['Data Scientist', 'Analytics', 'New York / Remote', 'Senior'],
            ],
          }),
        },
      ],
      metaTitle: 'Careers at CryptoVault — Join Our Team',
      metaDescription: 'Join CryptoVault: 850+ team members, 14 offices, remote-first culture. Open positions in engineering, security, design, and more.',
    },
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    pageType: 'legal',
    order: 15,
    content: {
      heroTitle: 'Terms of Service',
      heroSubtitle: 'These Terms of Service govern your use of the CryptoVault platform and services. Last updated: March 2026.',
      sections: [
        {
          title: 'Terms of Service',
          type: 'text',
          content: '1. Acceptance of Terms\n\nBy accessing or using CryptoVault ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all Terms, do not use the Platform.\n\n2. Eligibility\n\nYou must be at least 18 years old and reside in a jurisdiction where cryptocurrency trading is permitted. Users from restricted jurisdictions (as listed on our website) are prohibited from using the Platform.\n\n3. Account Requirements\n\nYou must complete identity verification (KYC) to access trading features. You are responsible for maintaining the security of your account credentials. You must immediately notify CryptoVault of any unauthorized account access.\n\n4. Trading Rules\n\nAll trades are executed at prevailing market prices. CryptoVault does not guarantee order execution at a specific price. Market manipulation, wash trading, and spoofing are strictly prohibited.\n\n5. Fees\n\nTrading fees, withdrawal fees, and other charges are published on our Fees page and may be updated with 7 days\' prior notice.\n\n6. Limitation of Liability\n\nCryptoVault shall not be liable for losses resulting from market volatility, system outages beyond our control, or unauthorized account access due to user negligence.',
        },
      ],
      metaTitle: 'Terms of Service | CryptoVault',
      metaDescription: 'CryptoVault Terms of Service: account requirements, trading rules, fees, intellectual property, and liability limitations.',
    },
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    pageType: 'legal',
    order: 16,
    content: {
      heroTitle: 'Privacy Policy',
      heroSubtitle: 'CryptoVault is committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information.',
      sections: [
        {
          title: 'Privacy Policy',
          type: 'text',
          content: '1. Data We Collect\n\nPersonal identification data (name, email, phone, government ID) for KYC compliance. Transaction data including trade history, deposits, and withdrawals. Technical data such as IP address, device information, and browser type. Usage data including pages visited, features used, and session duration.\n\n2. How We Use Your Data\n\nTo verify your identity and comply with anti-money laundering regulations. To process transactions and maintain your account. To improve our services and develop new features. To communicate important updates and security alerts.\n\n3. Data Protection\n\nAll personal data is encrypted at rest (AES-256) and in transit (TLS 1.3). Access to personal data is restricted to authorized personnel on a need-to-know basis. We conduct regular security audits and penetration testing.\n\n4. Your Rights\n\nUnder GDPR and applicable privacy laws, you have the right to: access your personal data, request correction of inaccurate data, request deletion of your data (subject to regulatory retention requirements), object to data processing, and data portability.\n\n5. Data Retention\n\nWe retain personal data for the duration of your account relationship plus 5 years for regulatory compliance. Transaction records are retained for 7 years as required by financial regulations.',
        },
      ],
      metaTitle: 'Privacy Policy | CryptoVault',
      metaDescription: 'CryptoVault Privacy Policy: how we collect, use, and protect your personal data. GDPR compliant with full data rights.',
    },
  },
  {
    slug: 'risk-warning',
    title: 'Risk Warning',
    pageType: 'legal',
    order: 17,
    content: {
      heroTitle: 'Risk Warning',
      heroSubtitle: 'Trading cryptocurrencies involves significant risk. Please read this warning carefully before using our services.',
      sections: [
        {
          title: 'Risk Warning',
          type: 'text',
          content: '1. Market Risk\n\nCryptocurrency prices are highly volatile and can experience significant price swings within minutes. You may lose some or all of your invested capital. Past performance is not indicative of future results.\n\n2. Leverage Risk\n\nFutures and margin trading involve leverage, which amplifies both potential profits and losses. You may lose more than your initial margin deposit. Leverage should only be used by experienced traders who understand the risks.\n\n3. Liquidity Risk\n\nSome cryptocurrencies may have limited liquidity, making it difficult to execute large orders without significant price impact. Newly listed tokens may have wider spreads and lower trading volumes.\n\n4. Technology Risk\n\nBlockchain networks may experience congestion, forks, or technical failures that affect transaction processing. Smart contract vulnerabilities could result in loss of staked or deposited funds.\n\n5. Regulatory Risk\n\nCryptocurrency regulations vary by jurisdiction and are evolving rapidly. Changes in law or regulation may adversely affect the value of your holdings or your ability to use the Platform.\n\n6. General Warning\n\nOnly trade with funds you can afford to lose. Cryptocurrency trading is not suitable for all investors. We strongly recommend that you seek independent financial advice before trading.',
        },
      ],
      metaTitle: 'Risk Warning — Important Disclosures | CryptoVault',
      metaDescription: 'CryptoVault risk warning: understand the risks of cryptocurrency trading including market volatility, leverage, liquidity, and regulatory risks.',
    },
  },
]

async function main() {
  console.log('Creating CryptoVault Exchange project...')

  // 1. Create the project
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

  // 2. Create domain
  await prisma.domain.create({
    data: {
      projectId: project.id,
      selectedDomain: BRAND.domain,
      score: 88,
      status: 'REGISTERED',
      suggestions: JSON.stringify([
        { domain: 'cryptovault.exchange', score: 88, available: true, price: 49.99 },
        { domain: 'cryptovault.io', score: 85, available: true, price: 39.99 },
        { domain: 'cryptovault.com', score: 92, available: false, price: 0 },
      ]),
    },
  })
  console.log('Domain created')

  // 3. Create website + pages
  const website = await prisma.website.create({
    data: {
      projectId: project.id,
      templateType: 'Crypto Exchange',
      templateId: 'crypto-exchange',
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

  // 4. Create SEO config
  await prisma.seoConfig.create({
    data: {
      projectId: project.id,
      status: 'complete',
      seoScore: 85,
      keywords: JSON.stringify([
        { keyword: 'buy bitcoin', volume: 135000, difficulty: 82, intent: 'Transactional', mappedPage: '/home' },
        { keyword: 'crypto exchange', volume: 90500, difficulty: 75, intent: 'Navigational', mappedPage: '/home' },
        { keyword: 'best crypto exchange', volume: 74000, difficulty: 78, intent: 'Transactional', mappedPage: '/home' },
        { keyword: 'crypto staking', volume: 49500, difficulty: 55, intent: 'Informational', mappedPage: '/staking' },
        { keyword: 'buy ethereum', volume: 60500, difficulty: 70, intent: 'Transactional', mappedPage: '/markets' },
        { keyword: 'crypto futures trading', volume: 33100, difficulty: 62, intent: 'Transactional', mappedPage: '/futures' },
        { keyword: 'crypto wallet security', volume: 22000, difficulty: 45, intent: 'Informational', mappedPage: '/wallet' },
        { keyword: 'crypto trading fees', volume: 27100, difficulty: 50, intent: 'Commercial', mappedPage: '/fees' },
        { keyword: 'learn crypto trading', volume: 40500, difficulty: 42, intent: 'Informational', mappedPage: '/education' },
        { keyword: 'crypto api trading', volume: 18200, difficulty: 38, intent: 'Navigational', mappedPage: '/api' },
      ]),
    },
  })
  console.log('SEO config created')

  // 5. Create social profiles
  const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'telegram']
  for (const platform of platforms) {
    await prisma.socialProfile.create({
      data: {
        projectId: project.id,
        platform,
        username: '@cryptovault',
        profileUrl: `https://${platform}.com/cryptovault`,
        bio: `${BRAND.brandName} — Trade 500+ Cryptocurrencies`,
        status: 'active',
      },
    })
  }
  console.log('7 social profiles created')

  // 6. Create social posts (49 scheduled)
  const postTypes = ['Motivational', 'Educational', 'Market Update', 'Product Feature', 'Community']
  const now = new Date()
  for (let day = 0; day < 7; day++) {
    for (const platform of platforms) {
      const postDate = new Date(now.getTime() + day * 24 * 60 * 60 * 1000)
      const type = postTypes[day % postTypes.length]
      await prisma.socialPost.create({
        data: {
          projectId: project.id,
          platform,
          content: `[${type}] CryptoVault update for ${platform}. Trade 500+ tokens with fees from 0.01%. #crypto #bitcoin #trading`,
          type,
          scheduledFor: postDate,
          status: 'scheduled',
          hashtags: JSON.stringify(['#crypto', '#bitcoin', '#trading', '#defi', '#web3']),
        },
      })
    }
  }
  console.log('49 social posts created')

  // 7. Create timeline events
  const milestones = [
    { phase: 1, milestone: 'Domain search & scoring', day: 1 },
    { phase: 1, milestone: 'Domain registration', day: 2 },
    { phase: 2, milestone: 'Website template selected', day: 3 },
    { phase: 2, milestone: 'Website generation started', day: 4 },
    { phase: 2, milestone: 'All pages generated', day: 5 },
    { phase: 2, milestone: 'Website deployed & live', day: 7 },
    { phase: 3, milestone: 'SEO audit complete', day: 8 },
    { phase: 3, milestone: 'Keyword strategy mapped', day: 10 },
    { phase: 3, milestone: 'GEO pages created', day: 12 },
    { phase: 3, milestone: 'Search Console connected', day: 14 },
    { phase: 4, milestone: 'Social profiles created', day: 15 },
    { phase: 4, milestone: 'Social accounts connected', day: 17 },
    { phase: 4, milestone: 'Content bank generated', day: 18 },
    { phase: 4, milestone: 'Profiles fully configured', day: 21 },
    { phase: 5, milestone: 'Daily posting begins', day: 22 },
    { phase: 5, milestone: 'First engagement report', day: 30 },
    { phase: 5, milestone: 'Content optimization round 1', day: 45 },
    { phase: 6, milestone: 'Growth phase midpoint', day: 60 },
    { phase: 6, milestone: 'A/B testing initiated', day: 70 },
    { phase: 6, milestone: 'Final performance report', day: 85 },
    { phase: 6, milestone: 'Client handoff complete', day: 90 },
  ]
  await prisma.timelineEvent.createMany({
    data: milestones.map((m, i) => ({
      projectId: project.id,
      phase: m.phase,
      milestone: m.milestone,
      scheduledDate: new Date(now.getTime() + m.day * 24 * 60 * 60 * 1000),
      status: m.day <= 21 ? 'completed' : 'pending',
      order: i,
    })),
  })
  console.log('21 timeline events created')

  // 8. Create blog post
  await prisma.blogPost.create({
    data: {
      projectId: project.id,
      title: 'Bitcoin Halving 2026: What Traders Need to Know',
      slug: 'bitcoin-halving-2026-guide',
      content: 'The Bitcoin halving is approaching. This comprehensive guide covers the expected impact on BTC price, mining economics, and trading strategies for the months ahead.',
      excerpt: 'Everything you need to know about the upcoming Bitcoin halving event and its impact on the crypto market.',
      category: 'market-analysis',
      status: 'published',
      wordCount: 2500,
      publishedAt: new Date(),
    },
  })
  console.log('Blog post created')

  // 9. Create email template
  await prisma.emailTemplate.create({
    data: {
      projectId: project.id,
      name: 'Welcome to CryptoVault',
      type: 'welcome',
      subject: 'Welcome to CryptoVault — Your Crypto Journey Starts Here',
      body: 'Hi {{name}},\n\nWelcome to CryptoVault! You\'ve joined 8M+ traders worldwide.\n\nHere\'s how to get started:\n1. Complete KYC verification\n2. Make your first deposit\n3. Start trading 500+ tokens\n\nHappy trading!\nThe CryptoVault Team',
    },
  })
  console.log('Email template created')

  // 10. Create landing page
  await prisma.landingPage.create({
    data: {
      projectId: project.id,
      title: 'Earn 18% APY on Your Crypto',
      slug: 'crypto-staking-offer',
      type: 'lead_magnet',
      status: 'draft',
      content: JSON.stringify({
        headline: 'Earn Up to 18% APY — Start Staking Today',
        subheadline: 'Put your crypto to work with CryptoVault Staking.',
        cta: 'Start Earning Now',
      }),
    },
  })
  console.log('Landing page created')

  // 11. Create affiliate
  await prisma.affiliate.create({
    data: {
      projectId: project.id,
      name: 'CryptoInfluencer',
      email: 'partner@cryptoinfluencer.com',
      referralCode: `cvault-${project.id.slice(-8)}`,
      commissionType: 'Revenue Share',
      commissionRate: 30,
      status: 'active',
    },
  })
  console.log('Affiliate created')

  // 12. Seed mock analytics
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000)
    await prisma.analytics.create({
      data: {
        projectId: project.id,
        date,
        visitors: Math.floor(200 + Math.random() * 400),
        pageViews: Math.floor(500 + Math.random() * 1000),
        leads: Math.floor(5 + Math.random() * 15),
        bounceRate: Number((30 + Math.random() * 20).toFixed(1)),
        avgSessionDuration: Number((120 + Math.random() * 180).toFixed(0)),
      },
    })
  }
  console.log('30 days analytics seeded')

  console.log('\n✅ CryptoVault Exchange project created successfully!')
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
