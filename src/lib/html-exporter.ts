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

  return `/* ${options.brandName} — Institutional Grade Stylesheet */
:root{--color-primary:${c.primary};--color-primary-dark:${c.primaryDark};--color-accent:${c.accent};--color-bg:#ffffff;--color-bg-alt:#f7f8fa;--color-bg-warm:#faf9f7;--color-bg-dark:${c.primary};--color-bg-darker:${c.primaryDark};--color-text:#1a1a2e;--color-text-secondary:#4a5568;--color-text-light:#718096;--color-text-inv:#ffffff;--color-border:#e8eaed;--color-border-light:#f0f1f3;--color-success:#0d9f6e;--color-danger:#dc3545;--color-warning:#e8a317;--color-info:#2b6cb0;--font-heading:'Georgia','Times New Roman',serif;--font-sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;--max-w:1180px;--radius:6px;--radius-lg:10px;--radius-xl:14px;--shadow-sm:0 1px 2px rgba(0,0,0,.04);--shadow-md:0 2px 8px rgba(0,0,0,.06);--shadow-lg:0 4px 16px rgba(0,0,0,.08);--shadow-xl:0 8px 30px rgba(0,0,0,.1);--transition:.2s ease}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;scroll-behavior:smooth}
body{font-family:var(--font-sans);color:var(--color-text);background:var(--color-bg);line-height:1.65;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
a{color:var(--color-accent);text-decoration:none;transition:color var(--transition)}
a:hover{color:var(--color-primary)}
img{max-width:100%;height:auto}
::selection{background:color-mix(in srgb,var(--color-accent) 15%,white)}

/* ─── Risk Warning Bar ─── */
.announcement-bar{background:var(--color-bg-darker);color:rgba(255,255,255,.75);text-align:center;padding:10px 16px;font-size:.72rem;line-height:1.5;letter-spacing:.01em}
.announcement-bar strong{color:#fff;font-weight:600}
.announcement-bar a{color:rgba(255,255,255,.9);text-decoration:underline;text-underline-offset:2px;margin-left:6px;font-weight:500}
.announcement-bar a:hover{color:#fff}

/* ─── Navbar — Clean Institutional ─── */
.navbar{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid var(--color-border);transition:box-shadow var(--transition)}
.navbar-inner{max-width:var(--max-w);margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;height:64px}
.navbar-brand{font-size:1.25rem;font-weight:700;color:var(--color-primary);letter-spacing:-.02em;font-family:var(--font-heading)}
.navbar-links{display:flex;gap:4px;list-style:none;align-items:center}
.navbar-links a{color:var(--color-text-secondary);font-size:.85rem;font-weight:500;padding:8px 14px;transition:color var(--transition);letter-spacing:.01em}
.navbar-links a:hover{color:var(--color-primary)}
.navbar-links a.active{color:var(--color-primary);font-weight:600}
.navbar-cta{display:inline-block;background:var(--color-accent);color:#fff !important;padding:9px 24px;border-radius:var(--radius);font-weight:600;font-size:.85rem;transition:all var(--transition);white-space:nowrap}
.navbar-cta:hover{background:var(--color-primary);color:#fff !important}
.navbar-toggle{display:none;background:none;border:none;cursor:pointer;padding:8px}
.navbar-toggle span{display:block;width:20px;height:1.5px;background:var(--color-text);margin:5px 0;border-radius:1px}

/* ─── Hero — Institutional Authority ─── */
.hero{background:var(--color-bg-dark);color:var(--color-text-inv);padding:100px 28px 88px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 70% 50%,color-mix(in srgb,var(--color-accent) 6%,transparent),transparent);pointer-events:none}
.hero-inner{max-width:680px;position:relative;z-index:1}
.hero-badge{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.15);padding:7px 18px;border-radius:4px;font-size:.78rem;font-weight:500;margin-bottom:32px;color:rgba(255,255,255,.7);letter-spacing:.03em;text-transform:uppercase}
.hero-badge .badge-dot{width:6px;height:6px;background:var(--color-success);border-radius:50%;animation:pulse 2.5s infinite}
.hero h1{font-size:3.2rem;font-weight:400;line-height:1.15;margin-bottom:24px;letter-spacing:-.02em;font-family:var(--font-heading);color:#fff}
.hero p{font-size:1.1rem;opacity:.65;margin-bottom:40px;line-height:1.75;max-width:540px;font-weight:400}
.hero-buttons{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:48px}
.hero .btn-primary{font-size:.95rem;padding:14px 36px;border-radius:var(--radius);background:var(--color-accent);box-shadow:none;font-weight:600}
.hero .btn-primary:hover{filter:brightness(1.1);transform:translateY(-1px)}
.hero .btn-outline{font-size:.95rem;padding:13px 34px;border:1px solid rgba(255,255,255,.25);background:transparent;font-weight:500}
.hero .btn-outline:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.4)}
.hero-trust{display:flex;gap:32px;flex-wrap:wrap;font-size:.78rem;opacity:.4;border-top:1px solid rgba(255,255,255,.08);padding-top:24px}
.hero-trust span{display:flex;align-items:center;gap:6px;font-weight:500;letter-spacing:.02em}

/* ─── Sections ─── */
.section{padding:88px 28px}
.section-alt{background:var(--color-bg-alt)}
.section-inner{max-width:var(--max-w);margin:0 auto}
.section-title{font-size:2rem;font-weight:400;text-align:center;margin-bottom:16px;letter-spacing:-.01em;color:var(--color-text);line-height:1.25;font-family:var(--font-heading)}
.section-title::after{content:none}
.section-subtitle{font-size:.95rem;color:var(--color-text-light);text-align:center;max-width:580px;margin:0 auto 56px;line-height:1.75}

/* ─── Text Content ─── */
.text-content{max-width:720px;margin:0 auto;font-size:1rem;line-height:1.85;color:var(--color-text-secondary)}
.text-content p{margin-bottom:20px}

/* ─── Features Grid — Clean Cards ─── */
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.feature-card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:32px 28px;transition:all var(--transition);position:relative}
.feature-card:hover{border-color:color-mix(in srgb,var(--color-accent) 30%,var(--color-border));box-shadow:var(--shadow-md)}
.feature-card::before{content:none}
.feature-card-icon{width:48px;height:48px;border-radius:var(--radius);background:var(--color-bg-alt);display:flex;align-items:center;justify-content:center;font-size:1.35rem;margin-bottom:20px}
.feature-card:hover .feature-card-icon{background:color-mix(in srgb,var(--color-accent) 8%,white)}
.feature-card h3{font-size:1.05rem;font-weight:600;margin-bottom:10px;color:var(--color-text)}
.feature-card p{font-size:.9rem;color:var(--color-text-light);line-height:1.7}

/* ─── Pricing Grid ─── */
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;align-items:start}
.pricing-card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:40px 28px;text-align:center;position:relative;transition:all var(--transition)}
.pricing-card:hover{border-color:color-mix(in srgb,var(--color-accent) 25%,var(--color-border))}
.pricing-card.highlighted{border-color:var(--color-accent);box-shadow:var(--shadow-lg)}
.pricing-card.highlighted:hover{box-shadow:var(--shadow-xl)}
.pricing-card.highlighted::before{content:'Recommended';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--color-accent);color:#fff;padding:5px 20px;border-radius:4px;font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em}
.pricing-card h3{font-size:1.15rem;font-weight:600;margin-bottom:12px}
.pricing-card .price{font-size:2.5rem;font-weight:700;color:var(--color-primary);margin-bottom:4px;letter-spacing:-.02em;font-family:var(--font-heading)}
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
.cta-section h2{font-size:2rem;font-weight:400;margin-bottom:16px;position:relative;font-family:var(--font-heading)}
.cta-section p{font-size:1rem;opacity:.6;margin-bottom:32px;max-width:500px;margin-left:auto;margin-right:auto;position:relative;line-height:1.7}
.cta-section .btn-primary{background:var(--color-accent);color:#fff;font-size:1rem;padding:14px 40px;box-shadow:none;position:relative;font-weight:600}
.cta-section .btn-primary:hover{filter:brightness(1.1);transform:translateY(-1px)}

/* ─── Data Table ─── */
.data-table{width:100%;border-collapse:separate;border-spacing:0;background:var(--color-bg);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--color-border)}
.data-table th,.data-table td{padding:13px 20px;text-align:left;border-bottom:1px solid var(--color-border-light);font-size:.88rem}
.data-table th{background:var(--color-bg-alt);color:var(--color-text);font-weight:600;font-size:.78rem;text-transform:uppercase;letter-spacing:.06em}
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
.stat-value{font-size:2.8rem;font-weight:400;color:var(--color-primary);letter-spacing:-.02em;line-height:1.1;font-family:var(--font-heading)}
.stat-label{font-size:.78rem;color:var(--color-text-light);margin-top:8px;font-weight:500;text-transform:uppercase;letter-spacing:.06em}
.stat-divider{width:1px;background:var(--color-border);align-self:stretch;margin:12px 0}

/* ─── Steps Process ─── */
.steps-grid{display:flex;justify-content:center;gap:0;flex-wrap:wrap;position:relative;counter-reset:step}
.step-item{flex:1;min-width:200px;max-width:280px;text-align:center;padding:28px 24px;position:relative}
.step-number{width:52px;height:52px;border-radius:50%;background:var(--color-bg-dark);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:1.15rem;font-weight:600;margin-bottom:20px;font-family:var(--font-heading)}
.step-item:hover .step-number{background:var(--color-accent)}
.step-item h3{font-size:.98rem;font-weight:600;margin-bottom:10px;color:var(--color-text)}
.step-item p{font-size:.86rem;color:var(--color-text-light);line-height:1.65}
.step-connector{position:absolute;top:50px;right:-16px;width:32px;height:1px;background:var(--color-border)}
.step-item:last-child .step-connector{display:none}

/* ─── Testimonials ─── */
.testimonials-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.testimonial-card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:32px 28px;position:relative;transition:border-color var(--transition)}
.testimonial-card:hover{border-color:color-mix(in srgb,var(--color-accent) 20%,var(--color-border))}
.testimonial-card::before{content:'\\201C';font-size:4rem;color:var(--color-accent);opacity:.12;position:absolute;top:12px;left:20px;line-height:1;font-family:var(--font-heading)}
.testimonial-rating{color:#e8a317;margin-bottom:12px;letter-spacing:2px;font-size:1rem}
.testimonial-text{font-size:.92rem;line-height:1.8;color:var(--color-text-secondary);margin-bottom:20px;position:relative;z-index:1}
.testimonial-author{font-weight:600;font-size:.9rem;color:var(--color-text)}
.testimonial-role{font-size:.8rem;color:var(--color-text-light);margin-top:3px}

/* ─── Icon Grid ─── */
.icon-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;text-align:center}
.icon-grid-item{padding:28px 14px;border-radius:var(--radius-lg);border:1px solid transparent;transition:all var(--transition)}
.icon-grid-item:hover{border-color:var(--color-border);background:var(--color-bg)}
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
.two-col-text h3{font-size:1.6rem;font-weight:400;margin-bottom:16px;letter-spacing:-.01em;line-height:1.25;font-family:var(--font-heading)}
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
.btn-primary{display:inline-block;background:var(--color-accent);color:#fff;padding:13px 32px;border-radius:var(--radius);font-weight:600;font-size:.95rem;border:none;cursor:pointer;transition:all var(--transition);letter-spacing:.01em}
.btn-primary:hover{color:#fff;filter:brightness(1.1);transform:translateY(-1px)}
.btn-outline{display:inline-block;background:transparent;color:#fff;padding:12px 30px;border-radius:var(--radius);font-weight:500;font-size:.95rem;border:1px solid rgba(255,255,255,.25);cursor:pointer;transition:all var(--transition)}
.btn-outline:hover{background:rgba(255,255,255,.06);color:#fff;border-color:rgba(255,255,255,.4)}
.btn-secondary{display:inline-block;background:var(--color-bg);color:var(--color-text);padding:13px 32px;border-radius:var(--radius);font-weight:500;font-size:.95rem;border:1px solid var(--color-border);cursor:pointer;transition:all var(--transition)}
.btn-secondary:hover{border-color:var(--color-accent);color:var(--color-accent)}

/* ─── Footer — Institutional ─── */
.footer{background:var(--color-primary);color:var(--color-text-inv);padding:64px 28px 24px}
.footer::before{content:none}
.footer-inner{max-width:var(--max-w);margin:0 auto}
.footer-grid{display:grid;grid-template-columns:1.4fr repeat(3,1fr) 1fr;gap:36px;margin-bottom:40px}
.footer-col h4{font-size:.76rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin-bottom:18px;color:rgba(255,255,255,.35)}
.footer-col p{font-size:.85rem;color:rgba(255,255,255,.5);line-height:1.7}
.footer-col ul{list-style:none}
.footer-col ul li{margin-bottom:10px}
.footer-col a{color:rgba(255,255,255,.5);font-size:.85rem;transition:color var(--transition)}
.footer-col a:hover{color:#fff}
.footer-regulatory{border-top:1px solid rgba(255,255,255,.06);padding:20px 0;margin-bottom:20px;display:flex;justify-content:center;gap:28px;flex-wrap:wrap;font-size:.76rem;color:rgba(255,255,255,.3)}
.footer-regulatory span{display:flex;align-items:center;gap:5px}
.footer-payments{display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-bottom:20px;font-size:1.15rem;opacity:.25}
.footer-bottom{border-top:1px solid rgba(255,255,255,.06);padding-top:18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.footer-bottom p{font-size:.76rem;color:rgba(255,255,255,.3)}
.footer-bottom a{color:rgba(255,255,255,.35) !important}
.footer-bottom a:hover{color:rgba(255,255,255,.7) !important}
.footer-risk{font-size:.7rem;color:rgba(255,255,255,.2);line-height:1.75;margin-top:20px;max-width:900px}

/* ─── Animations ─── */
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}

/* ─── Responsive ─── */
@media(max-width:1024px){.footer-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.navbar-links{display:none}.navbar-cta{display:none}.navbar-toggle{display:block}.hero h1{font-size:2.2rem}.hero p{font-size:1rem}.hero{padding:72px 20px 60px;text-align:left}.section{padding:60px 20px}.section-title{font-size:1.65rem}.pricing-card.highlighted{transform:none}.footer-bottom{flex-direction:column;text-align:center}.two-col{grid-template-columns:1fr;gap:32px}.stats-bar{flex-direction:column;gap:0}.stats-bar .stat-divider{width:60%;height:1px;margin:0 auto}.stat-item{padding:14px 20px}.step-connector{display:none}.steps-grid{gap:8px}.footer-grid{grid-template-columns:1fr 1fr}.footer-regulatory{gap:14px}}
@media(max-width:480px){.hero{padding:52px 16px 40px}.hero h1{font-size:1.8rem}.hero-trust{flex-direction:column;gap:8px}.hero-buttons{flex-direction:column}.hero .btn-primary,.hero .btn-outline{width:100%;text-align:center}.features-grid{grid-template-columns:1fr}.pricing-grid{grid-template-columns:1fr}.icon-grid{grid-template-columns:repeat(2,1fr)}.testimonials-grid{grid-template-columns:1fr}.footer-grid{grid-template-columns:1fr}.section-title{font-size:1.45rem}.stat-value{font-size:2.2rem}}
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
  const navPages = pages.filter((p) => ['home', 'about', 'platforms', 'account-types', 'pricing', 'education', 'contact'].includes(p.slug)).slice(0, 7)

  const navLinks = navPages.map((p) => {
    const href = p.slug === 'home' ? 'index.html' : `${p.slug.replace(/\//g, '-')}.html`
    const cls = p.slug === page.slug ? ' class="active"' : ''
    return `        <li><a href="${href}"${cls}>${escapeHtml(p.title)}</a></li>`
  }).join('\n')

  const sectionBlocks = sections.map((s, i) => {
    const alt = i % 2 === 1 ? ' section-alt' : ''
    const inner = renderSection(s)
    const title = s.title ? `      <h2 class="section-title">${escapeHtml(s.title)}</h2>\n` : ''
    const subtitle = s.subtitle ? `      <p class="section-subtitle">${escapeHtml(s.subtitle)}</p>\n` : ''
    if (s.type === 'cta') {
      return inner
    }
    return `  <section class="section${alt}">\n    <div class="section-inner">\n${title}${subtitle}${inner}\n    </div>\n  </section>`
  }).join('\n\n')

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
${gtmBody(options)}  <div class="announcement-bar">
    CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <strong>72% of retail investor accounts lose money when trading CFDs with this provider.</strong> You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
  </div>

  <nav class="navbar">
    <div class="navbar-inner">
      <a href="index.html" class="navbar-brand">${escapeHtml(brandName)}</a>
      <ul class="navbar-links">
${navLinks}
      </ul>
      <a href="#" class="navbar-cta">Open account</a>
      <button class="navbar-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-inner">
      <div class="hero-badge"><span class="badge-dot"></span> Established &amp; Regulated since 2018</div>
      <h1>${escapeHtml(heroTitle)}</h1>
${heroSubtitle ? `      <p>${escapeHtml(heroSubtitle)}</p>` : ''}
      <div class="hero-buttons">
        <a href="#" class="btn-primary">Open account</a>
        <a href="#" class="btn-outline">Log in</a>
      </div>
      <div class="hero-trust">
        <span>FCA Regulated</span>
        <span>Segregated Funds</span>
        <span>200+ Instruments</span>
        <span>24/5 Support</span>
      </div>
    </div>
  </section>

${sectionBlocks}

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
${chatWidget(options)}
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
