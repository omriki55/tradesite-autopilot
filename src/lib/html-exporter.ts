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

// ─── Hero config per page ──────────────────────────────
interface HeroConfig {
  variant: 'platform' | 'market' | 'corporate' | 'tools' | 'legal'
  badge: string
  showMockup: boolean
  visual?: string // custom HTML for right side
  pills?: string[] // Plus500-style feature pills
}

function getHeroConfig(slug: string): HeroConfig {
  // Homepage — full platform mockup
  if (slug === 'home') return { variant: 'platform', badge: 'Established &amp; Regulated since 2018', showMockup: true, pills: ['Free Demo Account', 'No Platform Fees', '0.0 Pip Spreads', 'Ultra-Fast Execution'] }

  // Market pages — unique market visuals
  if (slug === 'markets/forex') return { variant: 'market', badge: 'Live Forex Markets', showMockup: false, visual: getMarketVisual('forex'), pills: ['50+ Currency Pairs', 'Spreads from 0.0', '24/5 Trading'] }
  if (slug === 'markets/crypto') return { variant: 'market', badge: 'Live Crypto Markets', showMockup: false, visual: getMarketVisual('crypto'), pills: ['30+ Cryptocurrencies', 'Up to 1:20 Leverage', '24/7 Trading'] }
  if (slug === 'markets/commodities') return { variant: 'market', badge: 'Live Commodity Markets', showMockup: false, visual: getMarketVisual('commodities'), pills: ['Gold, Oil &amp; Silver', 'Low Commissions', 'Deep Liquidity'] }
  if (slug === 'markets/indices') return { variant: 'market', badge: 'Live Index Markets', showMockup: false, visual: getMarketVisual('indices'), pills: ['15+ Global Indices', 'Tight Spreads', 'No Hidden Fees'] }

  // Corporate pages — centered gradient
  if (['about', 'regulation', 'partners'].includes(slug)) return { variant: 'corporate', badge: slug === 'about' ? 'About Our Company' : slug === 'regulation' ? 'Regulatory Framework' : 'Partnership Programme', showMockup: false }

  // Legal pages — minimal
  if (['terms', 'privacy', 'risk-disclosure'].includes(slug)) return { variant: 'legal', badge: '', showMockup: false }

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
    crypto_exchange: { primary: '#1a1a2e', primaryDark: '#0f0f1a', accent: '#6366f1' },
    prop_trading: { primary: '#0c3547', primaryDark: '#082530', accent: '#0891b2' },
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

/* ─── Risk Warning Bar ─── */
.announcement-bar{background:var(--color-bg-darker);color:rgba(255,255,255,.75);text-align:center;padding:10px 16px;font-size:.72rem;line-height:1.5;letter-spacing:.01em}
.announcement-bar strong{color:#fff;font-weight:600}
.announcement-bar a{color:rgba(255,255,255,.9);text-decoration:underline;text-underline-offset:2px;margin-left:6px;font-weight:500}
.announcement-bar a:hover{color:#fff}

/* ─── Navbar — Plus500 Inspired ─── */
.navbar{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.97);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--color-border);transition:box-shadow var(--transition)}
.navbar-inner{max-width:var(--max-w);margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:60px}
.navbar-brand{font-size:1.15rem;font-weight:800;color:var(--color-primary);letter-spacing:-.03em;font-family:var(--font-sans);text-transform:uppercase}
.navbar-links{display:flex;gap:0;list-style:none;align-items:center}
.navbar-links a{color:var(--color-text-secondary);font-size:.8rem;font-weight:500;padding:6px 10px;border-radius:var(--radius);transition:all .15s;letter-spacing:.01em;white-space:nowrap}
.navbar-links a:hover{color:var(--color-primary);background:var(--color-bg-alt)}
.navbar-links a.active{color:var(--color-primary);font-weight:700}
.navbar-cta{display:inline-block;background:var(--color-accent);color:#fff !important;padding:10px 22px;border-radius:50px;font-weight:600;font-size:.82rem;transition:all var(--transition);white-space:nowrap;letter-spacing:.01em}
.navbar-cta:hover{background:var(--color-primary);color:#fff !important;transform:translateY(-1px);box-shadow:var(--shadow-md)}
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

/* ─── Navbar Dropdown ─── */
.nav-dropdown{position:relative}
.nav-dropdown>a::after{content:'';display:inline-block;width:4px;height:4px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg);margin-left:5px;vertical-align:middle;opacity:.5;transition:transform .2s}
.nav-dropdown:hover>a::after{transform:rotate(-135deg)}
.nav-dropdown-menu{display:none;position:absolute;top:calc(100% + 4px);left:50%;transform:translateX(-50%);background:#fff;border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:0 12px 32px rgba(0,0,0,.1);padding:8px 0;min-width:190px;z-index:200}
.nav-dropdown:hover .nav-dropdown-menu{display:block}
.nav-dropdown-menu a{display:block;padding:9px 20px;font-size:.84rem;color:var(--color-text-secondary);transition:all .15s;font-weight:500}
.nav-dropdown-menu a:hover{background:var(--color-bg-alt);color:var(--color-primary)}

/* ─── Mobile Menu ─── */
.navbar-mobile{display:none;position:absolute;top:100%;left:0;right:0;background:#fff;border-bottom:1px solid var(--color-border);padding:12px 20px;box-shadow:0 8px 24px rgba(0,0,0,.08);z-index:99}
.navbar-mobile a{display:block;padding:12px 16px;font-size:.95rem;color:var(--color-text-secondary);border-radius:var(--radius);font-weight:500;transition:all .15s}
.navbar-mobile a:hover,.navbar-mobile a.active{background:var(--color-bg-alt);color:var(--color-primary)}
.navbar-mobile .mobile-divider{height:1px;background:var(--color-border);margin:8px 0}
.navbar-mobile.open{display:block}

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

/* ─── Animations ─── */
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.section{animation:fadeInUp .5s ease both}
@media(prefers-reduced-motion:reduce){.hero-mockup,.market-cards,.tools-visual{animation:none}.hero-badge .badge-dot{animation:none;opacity:.8}.section{animation:none}.ticker-track{animation:none}}

/* ─── Responsive ─── */
@media(max-width:1024px){.footer-grid{grid-template-columns:repeat(2,1fr)}.hero-container{gap:32px}.hero-mockup{width:320px}.market-cards{width:300px}.tv-laptop{width:280px}.tv-phone{width:100px}.tv-tier{width:100px;padding:12px 10px}.tv-spread-card{width:240px}.tv-edu-card{width:240px}.tv-contact-card{width:220px}.nav-dropdown-menu{left:0;transform:none}}
@media(max-width:768px){.sticky-cta{display:block}.navbar-links{display:none}.navbar-cta{display:none}.navbar-toggle{display:block}.social-proof-inner{gap:16px}.sp-divider{display:none}.hero h1{font-size:2rem}.hero p{font-size:.95rem}.hero{padding:60px 20px 52px;text-align:left}.hero--tools{padding:56px 20px 44px}.hero--legal{padding:36px 20px 28px}.hero-container{flex-direction:column;gap:32px}.hero-visual{width:100%;max-width:360px}.hero-mockup{width:100%}.market-cards{width:100%;max-width:340px}.tools-visual{width:100%;display:flex;justify-content:center}.tv-laptop{width:100%;max-width:320px}.section{padding:60px 20px}.section-title{font-size:1.65rem}.feature-card{padding:28px 24px}.pricing-card{padding:32px 24px}.stat-item{padding:16px 24px}.pricing-card.highlighted{transform:none}.footer{padding:48px 20px 20px}.footer-bottom{flex-direction:column;text-align:center}.two-col{grid-template-columns:1fr;gap:32px}.stats-bar{flex-direction:column;gap:0}.stats-bar .stat-divider{width:60%;height:1px;margin:0 auto}.step-connector{display:none}.steps-grid{gap:8px}.footer-grid{grid-template-columns:1fr 1fr}.footer-regulatory{gap:14px}.hero--corporate .hero-inner{text-align:left}.hero--corporate .hero-trust,.hero--corporate .hero-buttons{justify-content:flex-start}}
@media(max-width:640px){.hero h1{font-size:2rem}.section{padding:52px 16px}.feature-card{padding:24px 20px}.pricing-card{padding:28px 20px}.testimonial-card{padding:24px 20px}.stat-item{padding:14px 16px}.step-item{padding:20px 16px}}
@media(max-width:480px){.hero{padding:52px 16px 40px}.hero h1{font-size:1.8rem}.hero-visual{display:none}.hero-trust{flex-direction:column;gap:8px}.hero-buttons{flex-direction:column}.hero .btn-primary,.hero .btn-outline{width:100%;text-align:center}.features-grid{grid-template-columns:1fr}.pricing-grid{grid-template-columns:1fr}.icon-grid{grid-template-columns:repeat(2,1fr)}.testimonials-grid{grid-template-columns:1fr}.footer{padding:40px 16px 16px}.footer-grid{grid-template-columns:1fr;gap:28px}.section-title{font-size:1.45rem}.stat-value{font-size:2.2rem}.hero--tools .hero-inner{border-left-width:3px;padding-left:20px}}
`
}

// ─── Page HTML — Premium Template ────────────────────────

function generatePageHTML(page: ExportPage, options: ExportOptions): string {
  const { brandName, domain, pages } = options
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
  const sections = parsed.sections || []
  const heroConfig = getHeroConfig(page.slug)
  const navSlugs = ['home', 'about', 'platforms', 'account-types', 'pricing', 'education', 'contact']
  const navPages = pages.filter((p) => navSlugs.includes(p.slug))
  const marketPagesNav = pages.filter((p) => p.slug.startsWith('markets/'))
  const isMarketPage = page.slug.startsWith('markets/')

  const navLinks = navPages.map((p) => {
    const href = p.slug === 'home' ? 'index.html' : `${p.slug.replace(/\//g, '-')}.html`
    // Insert Markets dropdown after About
    if (p.slug === 'about' && marketPagesNav.length > 0) {
      const aboutCls = p.slug === page.slug ? ' class="active"' : ''
      const marketsCls = isMarketPage ? ' class="active"' : ''
      const dropdownLinks = marketPagesNav.map((mp) => {
        const mpHref = `${mp.slug.replace(/\//g, '-')}.html`
        return `            <a href="${mpHref}">${escapeHtml(mp.title)}</a>`
      }).join('\n')
      return `        <li><a href="${href}"${aboutCls}>${escapeHtml(p.title)}</a></li>
        <li class="nav-dropdown">
          <a href="#"${marketsCls}>Markets</a>
          <div class="nav-dropdown-menu">
${dropdownLinks}
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

  // Section CTA map — inject CTAs after key sections on homepage
  const sectionCtaMap: Record<string, string> = page.slug === 'home' ? {
    stats: 'Join 35M+ Traders Today',
    features: 'Start Trading Now',
    steps: 'Open Your Account',
    comparison: 'Switch to ' + escapeHtml(brandName),
    testimonials: 'Join Thousands of Happy Traders',
  } : {}

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

  // FAQ HTML for homepage
  const faqHtml = page.slug === 'home' ? `
  <section class="section section-alt">
    <div class="section-inner">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <p class="section-subtitle">Everything you need to know to get started</p>
      <div class="faq-list">
        <div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">How long does account verification take?</div><div class="faq-a">Most accounts are verified within 24 hours. You&rsquo;ll need to provide a valid ID and proof of address. In many cases, verification is completed in under 1 hour during business hours.</div></div>
        <div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">What is the minimum deposit?</div><div class="faq-a">The minimum deposit for a Standard account is $100. You can fund your account using credit/debit card, bank wire, or e-wallets like Skrill and Neteller with no deposit fees.</div></div>
        <div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">Can I withdraw my funds at any time?</div><div class="faq-a">Yes, you can withdraw your funds at any time with no lock-in period. Withdrawal requests are typically processed within 1&ndash;2 business days depending on the payment method.</div></div>
        <div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">Is my money protected?</div><div class="faq-a">Absolutely. All client funds are held in segregated accounts with tier-1 banks, separate from company funds. We are regulated by the FCA, CySEC, and DFSA, ensuring the highest level of fund protection.</div></div>
        <div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">What platforms do you support?</div><div class="faq-a">We offer MetaTrader 4, MetaTrader 5, and our proprietary WebTrader platform. All are available on desktop, web, iOS, and Android &mdash; trade anywhere, anytime.</div></div>
        <div class="faq-item"><div class="faq-q" onclick="this.parentElement.classList.toggle('open')">Do I need experience to start trading?</div><div class="faq-a">No prior experience is needed. We offer a free $100,000 demo account, educational resources, and 24/5 support to help you learn at your own pace before trading with real money.</div></div>
      </div>
      <div class="section-cta"><a href="#" class="btn-primary">Open Free Account</a></div>
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
${gtmBody(options)}${page.slug === 'home' ? `  <div class="promo-bar">
    🎁 <strong>Limited Offer:</strong> Open an account today &amp; get $100,000 Demo Credits + 0% Commission for 30 Days <a href="#">Claim Now &rarr;</a>
  </div>
` : ''}  <div class="announcement-bar">
    CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <strong>72% of retail investor accounts lose money when trading CFDs with this provider.</strong> You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
  </div>

  <nav class="navbar">
    <div class="navbar-inner">
      <a href="index.html" class="navbar-brand">${escapeHtml(brandName)}</a>
      <ul class="navbar-links">
${navLinks}
      </ul>
      <a href="#" class="navbar-cta">Start Trading</a>
      <button class="navbar-toggle" onclick="document.getElementById('mobileMenu').classList.toggle('open')" aria-label="Toggle navigation"><span></span><span></span><span></span></button>
    </div>
    <div class="navbar-mobile" id="mobileMenu">
${allMobileLinks}
    </div>
  </nav>

  <section class="hero hero--${heroConfig.variant}">
    <div class="hero-container">
      <div class="hero-inner">
${heroConfig.badge ? `        <div class="hero-badge"><span class="badge-dot"></span> ${heroConfig.badge}</div>` : ''}
        <div class="hero-trustpilot">
          <span class="tp-stars">★★★★★</span>
          <span class="tp-score">4.5/5</span>
          <span class="tp-text">— 12,400+ Reviews on Trustpilot</span>
        </div>
        <h1>${page.slug === 'home' ? 'Join 35M+ Traders — Spreads from 0.0 Pips' : escapeHtml(heroTitle)}</h1>
${heroSubtitle ? `        <p>${escapeHtml(heroSubtitle)}</p>` : ''}
${heroConfig.pills && heroConfig.pills.length ? `        <div class="hero-pills">${heroConfig.pills.map(p => `<span class="hero-pill">${p}</span>`).join('')}</div>` : ''}
        <div class="hero-buttons">
          <a href="#" class="btn-primary">Open Free Account — 2 Minutes</a>
          <a href="#" class="btn-outline">Try $100K Demo</a>
        </div>
        <div class="hero-micro"><span>✓ No credit card required</span><span>✓ $100K free demo</span><span>✓ Instant access</span></div>
        <div class="hero-trust">
          <span>FCA Regulated</span>
          <span>Segregated Funds</span>
          <span>200+ Instruments</span>
          <span>24/5 Support</span>
        </div>
      </div>
${heroConfig.showMockup ? `      <div class="hero-visual">
        <div class="hero-mockup">
          <div class="mockup-topbar">
            <div class="mockup-dots"><span></span><span></span><span></span></div>
            <span>Trading Platform</span>
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
            <div class="mockup-row"><span>EUR/USD</span><span>1.0842</span><span class="up">+0.15%</span></div>
            <div class="mockup-row"><span>GBP/USD</span><span>1.2731</span><span class="down">-0.08%</span></div>
            <div class="mockup-row"><span>BTC/USD</span><span>67,240</span><span class="up">+2.34%</span></div>
            <div class="mockup-row"><span>AAPL</span><span>189.42</span><span class="up">+1.12%</span></div>
          </div>
        </div>
      </div>` : heroConfig.visual ? `      <div class="hero-visual">
${heroConfig.visual}
      </div>` : ''}
    </div>
  </section>

${page.slug === 'home' ? `  <div class="social-proof-bar">
    <div class="social-proof-inner">
      <div class="sp-item"><span>⭐</span> <strong>4.5/5</strong> Trustpilot</div>
      <div class="sp-divider"></div>
      <div class="sp-item"><span>👥</span> <strong>35M+</strong> Active Users</div>
      <div class="sp-divider"></div>
      <div class="sp-item"><span>🛡️</span> <strong>FCA</strong> Regulated</div>
      <div class="sp-divider"></div>
      <div class="sp-item"><span>🏆</span> <strong>Best Broker</strong> 2024</div>
      <div class="sp-divider"></div>
      <div class="sp-item"><span>📰</span> As seen in <strong>Bloomberg</strong>, <strong>Reuters</strong></div>
    </div>
  </div>

  <div class="market-ticker">
    <div class="ticker-track">
      <span class="ticker-item"><span class="ticker-symbol">EUR/USD</span> <span class="ticker-price">1.0842</span> <span class="ticker-change up">▲ +0.15%</span></span>
      <span class="ticker-item"><span class="ticker-symbol">BTC/USD</span> <span class="ticker-price">67,240</span> <span class="ticker-change up">▲ +2.34%</span></span>
      <span class="ticker-item"><span class="ticker-symbol">Gold</span> <span class="ticker-price">2,342.50</span> <span class="ticker-change up">▲ +0.42%</span></span>
      <span class="ticker-item"><span class="ticker-symbol">S&amp;P 500</span> <span class="ticker-price">5,234.18</span> <span class="ticker-change up">▲ +0.52%</span></span>
      <span class="ticker-item"><span class="ticker-symbol">GBP/USD</span> <span class="ticker-price">1.2731</span> <span class="ticker-change down">▼ -0.08%</span></span>
      <span class="ticker-item"><span class="ticker-symbol">AAPL</span> <span class="ticker-price">189.42</span> <span class="ticker-change up">▲ +1.12%</span></span>
      <span class="ticker-item"><span class="ticker-symbol">EUR/USD</span> <span class="ticker-price">1.0842</span> <span class="ticker-change up">▲ +0.15%</span></span>
      <span class="ticker-item"><span class="ticker-symbol">BTC/USD</span> <span class="ticker-price">67,240</span> <span class="ticker-change up">▲ +2.34%</span></span>
      <span class="ticker-item"><span class="ticker-symbol">Gold</span> <span class="ticker-price">2,342.50</span> <span class="ticker-change up">▲ +0.42%</span></span>
      <span class="ticker-item"><span class="ticker-symbol">S&amp;P 500</span> <span class="ticker-price">5,234.18</span> <span class="ticker-change up">▲ +0.52%</span></span>
      <span class="ticker-item"><span class="ticker-symbol">GBP/USD</span> <span class="ticker-price">1.2731</span> <span class="ticker-change down">▼ -0.08%</span></span>
      <span class="ticker-item"><span class="ticker-symbol">AAPL</span> <span class="ticker-price">189.42</span> <span class="ticker-change up">▲ +1.12%</span></span>
    </div>
  </div>
` : ''}
${sectionBlocks}

${faqHtml}

  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>${escapeHtml(brandName)}</h4>
          <p>Your trusted partner for online trading. Access global markets with institutional-grade technology, tight spreads, and award-winning service.</p>
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
      <div class="footer-regulatory">
        <span>FCA Regulated (UK)</span>
        <span>CySEC Licensed (EU)</span>
        <span>DFSA Authorized (UAE)</span>
        <span>256-bit SSL Encryption</span>
        <span>Segregated Client Funds</span>
      </div>
      <div class="footer-payments">
        <span>Visa</span><span>Mastercard</span><span>Wire Transfer</span><span>Skrill</span><span>Neteller</span>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${year} ${escapeHtml(brandName)}. All rights reserved.</p>
        <p><a href="terms.html" style="color:inherit;opacity:.6">Terms</a> &middot; <a href="privacy.html" style="color:inherit;opacity:.6">Privacy</a> &middot; <a href="risk-disclosure.html" style="color:inherit;opacity:.6">Risk Disclosure</a></p>
      </div>
      <p class="footer-risk">Risk Warning: Trading in Contracts for Difference (CFDs) carries a high level of risk and may not be suitable for all investors. You could lose more than your initial investment. Approximately 72% of retail investor accounts lose money when trading CFDs. Please ensure you fully understand the risks involved and seek independent advice if necessary. Past performance is not indicative of future results.</p>
    </div>
  </footer>
${page.slug === 'home' ? `  <div class="sticky-cta">
    <a href="#" class="btn-primary">Open Free Account — Start Trading</a>
  </div>
` : ''}${chatWidget(options)}
</body>
</html>`
}

// ─── Section renderer ────────────────────────────────────

function renderSection(s: ParsedSection): string {
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
    default: return renderText(s)
  }
}

function renderText(s: ParsedSection): string {
  const c = s.content || ''
  const paras = c.split('\n').filter((l) => l.trim()).map((l) => `        <p>${escapeHtml(l.trim())}</p>`).join('\n')
  return `      <div class="text-content">\n${paras || `        <p>${escapeHtml(c)}</p>`}\n      </div>`
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

function renderStats(s: ParsedSection): string {
  const stats = s.stats || []
  const items = stats.map((st, i) => {
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
