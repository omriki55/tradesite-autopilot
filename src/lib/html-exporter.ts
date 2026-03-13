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
  testimonials?: Array<{ text: string; author: string; role?: string; rating?: number }>
  iconItems?: Array<{ icon: string; title: string; description?: string }>
  comparisonData?: { usLabel: string; themLabel: string; rows: Array<{ feature: string; us: string; them: string }> }
  bannerType?: 'info' | 'warning' | 'success'
  bannerIcon?: string
  leftContent?: { title: string; text: string; bullets?: string[]; ctaText?: string; ctaUrl?: string }
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

// ─── Premium Stylesheet ──────────────────────────────────

function generateStylesheet(options: ExportOptions): string {
  const nicheColors: Record<string, { primary: string; primaryDark: string; accent: string }> = {
    forex_broker: { primary: '#1a56db', primaryDark: '#1440a0', accent: '#059669' },
    crypto_exchange: { primary: '#7c3aed', primaryDark: '#5b21b6', accent: '#f59e0b' },
    prop_trading: { primary: '#0d9488', primaryDark: '#0f766e', accent: '#2563eb' },
  }
  const c = nicheColors[options.niche] || nicheColors.forex_broker

  return `/* ${options.brandName} — Premium Generated Stylesheet */
:root{--color-primary:${c.primary};--color-primary-dark:${c.primaryDark};--color-accent:${c.accent};--color-bg:#ffffff;--color-bg-alt:#f8fafc;--color-bg-dark:#0f172a;--color-text:#1e293b;--color-text-light:#64748b;--color-text-inv:#ffffff;--color-border:#e2e8f0;--color-success:#10b981;--color-danger:#ef4444;--color-warning:#f59e0b;--color-info:#3b82f6;--font-sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;--max-w:1200px;--radius:10px;--radius-lg:16px;--shadow-sm:0 1px 2px rgba(0,0,0,.05);--shadow-md:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);--shadow-lg:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);--shadow-xl:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;scroll-behavior:smooth}
body{font-family:var(--font-sans);color:var(--color-text);background:var(--color-bg);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:var(--color-primary);text-decoration:none;transition:color .2s}
a:hover{color:var(--color-primary-dark)}
img{max-width:100%;height:auto}

/* ─── Announcement Bar ─── */
.announcement-bar{background:var(--color-primary);color:#fff;text-align:center;padding:10px 16px;font-size:.8rem;font-weight:500;letter-spacing:.01em}
.announcement-bar a{color:#fff;text-decoration:underline;font-weight:600;margin-left:8px}

/* ─── Navbar — Glass Effect ─── */
.navbar{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.97);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--color-border);box-shadow:var(--shadow-sm)}
.navbar-inner{max-width:var(--max-w);margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:72px}
.navbar-brand{font-size:1.35rem;font-weight:800;color:var(--color-primary);letter-spacing:-.02em}
.navbar-links{display:flex;gap:28px;list-style:none;flex-wrap:wrap;align-items:center}
.navbar-links a{color:var(--color-text);font-size:.875rem;font-weight:500;padding:4px 0;transition:color .2s}
.navbar-links a:hover,.navbar-links a.active{color:var(--color-primary)}
.navbar-cta{display:inline-block;background:var(--color-primary);color:#fff !important;padding:10px 24px;border-radius:var(--radius);font-weight:600;font-size:.875rem;transition:background .2s,transform .1s;white-space:nowrap}
.navbar-cta:hover{background:var(--color-primary-dark);transform:translateY(-1px)}
.navbar-toggle{display:none;background:none;border:none;cursor:pointer;padding:8px}
.navbar-toggle span{display:block;width:24px;height:2px;background:var(--color-text);margin:5px 0;transition:transform .2s}

/* ─── Hero — Premium Gradient ─── */
.hero{background:linear-gradient(135deg,var(--color-bg-dark) 0%,color-mix(in srgb,var(--color-primary) 35%,var(--color-bg-dark)) 50%,color-mix(in srgb,var(--color-primary-dark) 20%,var(--color-bg-dark)) 100%);color:var(--color-text-inv);padding:100px 24px 90px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 20% 80%,rgba(255,255,255,.03) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(255,255,255,.04) 0%,transparent 50%);pointer-events:none}
.hero-inner{max-width:820px;margin:0 auto;position:relative;z-index:1}
.hero h1{font-size:3.25rem;font-weight:900;line-height:1.12;margin-bottom:18px;letter-spacing:-.03em}
.hero p{font-size:1.2rem;opacity:.88;margin-bottom:36px;line-height:1.6;max-width:600px;margin-left:auto;margin-right:auto}
.hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:32px}
.hero .btn-primary{font-size:1.1rem;padding:16px 40px;border-radius:var(--radius);box-shadow:0 4px 14px rgba(0,0,0,.25)}
.hero .btn-outline{font-size:1.05rem;padding:15px 36px}
.hero-trust{display:flex;justify-content:center;gap:32px;flex-wrap:wrap;font-size:.85rem;opacity:.75;margin-top:8px}
.hero-trust span{display:flex;align-items:center;gap:6px}

/* ─── Sections ─── */
.section{padding:80px 24px}
.section-alt{background:var(--color-bg-alt)}
.section-inner{max-width:var(--max-w);margin:0 auto}
.section-title{font-size:2.25rem;font-weight:800;text-align:center;margin-bottom:16px;letter-spacing:-.02em;position:relative}
.section-subtitle{font-size:1.05rem;color:var(--color-text-light);text-align:center;max-width:620px;margin:-4px auto 48px;line-height:1.6}

/* ─── Text Content ─── */
.text-content{max-width:800px;margin:0 auto;font-size:1.05rem;line-height:1.85;color:var(--color-text-light)}
.text-content p{margin-bottom:18px}

/* ─── Features Grid — Cards with Icons ─── */
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:28px}
.feature-card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:36px 28px;box-shadow:var(--shadow-sm);transition:all .25s ease;border-left:3px solid transparent}
.feature-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-3px);border-left-color:var(--color-primary)}
.feature-card-icon{width:52px;height:52px;border-radius:14px;background:color-mix(in srgb,var(--color-primary) 10%,white);display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:18px}
.feature-card h3{font-size:1.1rem;font-weight:700;margin-bottom:10px;color:var(--color-text)}
.feature-card p{font-size:.935rem;color:var(--color-text-light);line-height:1.65}

/* ─── Pricing Grid ─── */
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:28px;align-items:start}
.pricing-card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:36px 28px;text-align:center;box-shadow:var(--shadow-sm);position:relative;transition:box-shadow .2s,transform .2s}
.pricing-card:hover{box-shadow:var(--shadow-md)}
.pricing-card.highlighted{border-color:var(--color-primary);box-shadow:var(--shadow-xl);transform:scale(1.04)}
.pricing-card.highlighted::before{content:'Most Popular';position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--color-primary),var(--color-primary-dark));color:#fff;padding:5px 20px;border-radius:20px;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
.pricing-card h3{font-size:1.3rem;font-weight:700;margin-bottom:10px}
.pricing-card .price{font-size:2.75rem;font-weight:900;color:var(--color-primary);margin-bottom:4px;letter-spacing:-.02em}
.pricing-card .period{font-size:.875rem;color:var(--color-text-light);margin-bottom:28px}
.pricing-card ul{list-style:none;text-align:left;margin-bottom:28px}
.pricing-card ul li{padding:10px 0;border-bottom:1px solid var(--color-border);font-size:.935rem;color:var(--color-text-light)}
.pricing-card ul li::before{content:'\\2713';color:var(--color-accent);margin-right:10px;font-weight:700}

/* ─── Content List ─── */
.content-list{max-width:800px;margin:0 auto;list-style:none}
.content-list li{padding:18px 0;border-bottom:1px solid var(--color-border);display:flex;gap:14px;align-items:flex-start}
.content-list li::before{content:'\\2713';color:var(--color-accent);font-weight:700;flex-shrink:0;margin-top:2px;width:22px;height:22px;background:color-mix(in srgb,var(--color-accent) 12%,white);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem}
.content-list .list-title{font-weight:700;margin-bottom:2px}
.content-list .list-desc{color:var(--color-text-light);font-size:.935rem;line-height:1.6}

/* ─── CTA Section ─── */
.cta-section{background:linear-gradient(135deg,var(--color-primary) 0%,var(--color-primary-dark) 100%);color:var(--color-text-inv);padding:80px 24px;text-align:center;position:relative;overflow:hidden}
.cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(255,255,255,.08),transparent 70%);pointer-events:none}
.cta-section h2{font-size:2.25rem;font-weight:800;margin-bottom:14px;position:relative}
.cta-section p{font-size:1.1rem;opacity:.9;margin-bottom:28px;max-width:600px;margin-left:auto;margin-right:auto;position:relative}
.cta-section .btn-primary{background:#fff;color:var(--color-primary);font-size:1.1rem;padding:16px 40px;box-shadow:0 4px 14px rgba(0,0,0,.15);position:relative}
.cta-section .btn-primary:hover{background:#f0f0f0;color:var(--color-primary-dark);transform:translateY(-2px)}

/* ─── Data Table — Enhanced ─── */
.data-table{width:100%;border-collapse:collapse;background:var(--color-bg);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-md)}
.data-table th,.data-table td{padding:14px 18px;text-align:left;border-bottom:1px solid var(--color-border);font-size:.935rem}
.data-table th{background:var(--color-bg-dark);color:var(--color-text-inv);font-weight:600;font-size:.82rem;text-transform:uppercase;letter-spacing:.06em}
.data-table td{color:var(--color-text-light)}
.data-table tbody tr{transition:background .15s}
.data-table tbody tr:hover{background:color-mix(in srgb,var(--color-primary) 4%,white)}
.cell-positive{color:var(--color-success) !important;font-weight:600}
.cell-negative{color:var(--color-danger) !important;font-weight:600}
.cell-badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:.8rem;font-weight:600;background:color-mix(in srgb,var(--color-primary) 10%,white);color:var(--color-primary)}

/* ─── Stats Bar ─── */
.stats-bar{display:flex;justify-content:center;flex-wrap:wrap;gap:48px;padding:12px 0}
.stat-item{text-align:center;min-width:120px}
.stat-value{font-size:2.75rem;font-weight:900;color:var(--color-primary);letter-spacing:-.03em;line-height:1.1}
.stat-label{font-size:.85rem;color:var(--color-text-light);margin-top:6px;font-weight:500}
.stat-divider{width:1px;background:var(--color-border);align-self:stretch}

/* ─── Steps Process ─── */
.steps-grid{display:flex;justify-content:center;gap:0;flex-wrap:wrap;position:relative}
.step-item{flex:1;min-width:180px;max-width:280px;text-align:center;padding:24px 20px;position:relative}
.step-number{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--color-primary),var(--color-primary-dark));color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:1.35rem;font-weight:800;margin-bottom:18px;box-shadow:0 4px 12px color-mix(in srgb,var(--color-primary) 30%,transparent)}
.step-item h3{font-size:1rem;font-weight:700;margin-bottom:8px;color:var(--color-text)}
.step-item p{font-size:.88rem;color:var(--color-text-light);line-height:1.55}
.step-connector{position:absolute;top:52px;right:-16px;width:32px;height:2px;background:linear-gradient(90deg,var(--color-primary),var(--color-border))}
.step-item:last-child .step-connector{display:none}

/* ─── Testimonials ─── */
.testimonials-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:28px}
.testimonial-card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:36px 32px;position:relative;transition:box-shadow .2s}
.testimonial-card:hover{box-shadow:var(--shadow-md)}
.testimonial-card::before{content:'\\201C';font-size:5rem;color:var(--color-primary);opacity:.1;position:absolute;top:8px;left:20px;line-height:1;font-family:Georgia,serif}
.testimonial-rating{color:#f59e0b;margin-bottom:14px;letter-spacing:3px;font-size:1.1rem}
.testimonial-text{font-size:1rem;line-height:1.75;color:var(--color-text);margin-bottom:22px;position:relative;z-index:1}
.testimonial-author{font-weight:700;font-size:.95rem;color:var(--color-text)}
.testimonial-role{font-size:.85rem;color:var(--color-text-light);margin-top:2px}

/* ─── Icon Grid ─── */
.icon-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:28px;text-align:center}
.icon-grid-item{padding:28px 16px;border-radius:var(--radius-lg);transition:background .2s}
.icon-grid-item:hover{background:var(--color-bg-alt)}
.icon-grid-icon{font-size:2.25rem;margin-bottom:14px;display:block}
.icon-grid-title{font-weight:700;font-size:.95rem;margin-bottom:4px;color:var(--color-text)}
.icon-grid-desc{font-size:.82rem;color:var(--color-text-light);line-height:1.5}

/* ─── Comparison Table ─── */
.comparison-table{width:100%;border-collapse:collapse;border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-md)}
.comparison-table thead th{padding:16px;font-weight:700;font-size:.9rem;text-transform:uppercase;letter-spacing:.04em;border-bottom:2px solid var(--color-border)}
.comparison-table thead th:first-child{text-align:left;background:var(--color-bg-alt)}
.comparison-table .col-us{background:color-mix(in srgb,var(--color-primary) 6%,white)}
.comparison-table .col-us th{color:var(--color-primary)}
.comparison-table .col-them{background:var(--color-bg-alt)}
.comparison-table td{padding:14px 16px;border-bottom:1px solid var(--color-border);text-align:center;font-size:.935rem}
.comparison-table td:first-child{text-align:left;font-weight:500;color:var(--color-text)}
.comparison-check{color:var(--color-success);font-weight:700;font-size:1.1rem}
.comparison-cross{color:var(--color-danger);opacity:.5;font-size:1.1rem}

/* ─── Banner ─── */
.banner{border-radius:var(--radius-lg);padding:28px 32px;display:flex;align-items:flex-start;gap:18px;max-width:800px;margin:0 auto}
.banner-info{background:color-mix(in srgb,var(--color-info) 8%,white);border:1px solid color-mix(in srgb,var(--color-info) 20%,white)}
.banner-warning{background:color-mix(in srgb,var(--color-warning) 8%,white);border:1px solid color-mix(in srgb,var(--color-warning) 20%,white)}
.banner-success{background:color-mix(in srgb,var(--color-success) 8%,white);border:1px solid color-mix(in srgb,var(--color-success) 20%,white)}
.banner-icon{font-size:1.6rem;flex-shrink:0;line-height:1}
.banner-content{font-size:.935rem;line-height:1.65;color:var(--color-text)}
.banner-content strong{display:block;margin-bottom:4px;font-weight:700}

/* ─── Two Column ─── */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.two-col-text h3{font-size:1.65rem;font-weight:800;margin-bottom:16px;letter-spacing:-.02em}
.two-col-text p{color:var(--color-text-light);line-height:1.75;margin-bottom:16px;font-size:1.02rem}
.two-col-text .btn-primary{margin-top:8px}
.two-col-bullets{list-style:none;margin-top:12px}
.two-col-bullets li{padding:6px 0;font-size:.935rem;color:var(--color-text-light);display:flex;align-items:center;gap:10px}
.two-col-bullets li::before{content:'\\2713';color:var(--color-accent);font-weight:700;font-size:.8rem;width:20px;height:20px;background:color-mix(in srgb,var(--color-accent) 12%,white);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.two-col-features{list-style:none}
.two-col-features li{padding:18px 0;border-bottom:1px solid var(--color-border)}
.two-col-features li:last-child{border-bottom:none}
.two-col-features .feat-icon{font-size:1.3rem;margin-right:10px}
.two-col-features .feat-title{font-weight:700;margin-bottom:4px}
.two-col-features .feat-desc{font-size:.9rem;color:var(--color-text-light);line-height:1.55}

/* ─── Buttons ─── */
.btn-primary{display:inline-block;background:var(--color-primary);color:var(--color-text-inv);padding:14px 32px;border-radius:var(--radius);font-weight:700;font-size:1rem;border:none;cursor:pointer;transition:all .2s;letter-spacing:.01em}
.btn-primary:hover{background:var(--color-primary-dark);color:var(--color-text-inv);transform:translateY(-2px);box-shadow:var(--shadow-md)}
.btn-outline{display:inline-block;background:transparent;color:var(--color-text-inv);padding:14px 32px;border-radius:var(--radius);font-weight:600;font-size:1rem;border:2px solid rgba(255,255,255,.5);cursor:pointer;transition:all .2s}
.btn-outline:hover{background:rgba(255,255,255,.12);color:var(--color-text-inv);border-color:rgba(255,255,255,.8)}

/* ─── Footer — Premium ─── */
.footer{background:var(--color-bg-dark);color:var(--color-text-inv);padding:64px 24px 28px}
.footer-inner{max-width:var(--max-w);margin:0 auto}
.footer-grid{display:grid;grid-template-columns:1.5fr repeat(3,1fr) 1fr;gap:36px;margin-bottom:40px}
.footer-col h4{font-size:.85rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:18px;opacity:.6}
.footer-col p{font-size:.88rem;opacity:.65;line-height:1.65}
.footer-col ul{list-style:none}
.footer-col ul li{margin-bottom:10px}
.footer-col a{color:var(--color-text-inv);opacity:.65;font-size:.88rem;transition:opacity .2s}
.footer-col a:hover{opacity:1;color:var(--color-text-inv)}
.footer-regulatory{border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);padding:20px 0;margin-bottom:24px;display:flex;justify-content:center;gap:36px;flex-wrap:wrap;font-size:.82rem;opacity:.5}
.footer-regulatory span{display:flex;align-items:center;gap:6px}
.footer-payments{display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-bottom:24px;font-size:1.3rem;opacity:.4}
.footer-bottom{border-top:1px solid rgba(255,255,255,.08);padding-top:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.footer-bottom p{font-size:.8rem;opacity:.45}
.footer-risk{font-size:.73rem;opacity:.35;line-height:1.7;margin-top:20px;max-width:900px}

/* ─── Animations ─── */
@keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.section,.cta-section{animation:fadeInUp .5s ease-out both}

/* ─── Responsive ─── */
@media(max-width:1024px){.footer-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.navbar-links{display:none}.navbar-cta{display:none}.navbar-toggle{display:block}.hero h1{font-size:2.25rem}.hero p{font-size:1rem}.hero{padding:64px 20px 56px}.section{padding:56px 20px}.pricing-card.highlighted{transform:none}.footer-bottom{flex-direction:column;text-align:center}.two-col{grid-template-columns:1fr;gap:32px}.stats-bar{gap:24px}.stats-bar .stat-divider{display:none}.step-connector{display:none}.steps-grid{gap:8px}.footer-grid{grid-template-columns:1fr 1fr}.footer-regulatory{gap:20px}}
@media(max-width:480px){.hero{padding:48px 16px 40px}.hero h1{font-size:1.85rem}.hero-trust{flex-direction:column;gap:8px}.features-grid{grid-template-columns:1fr}.pricing-grid{grid-template-columns:1fr}.stats-bar{flex-direction:column;gap:20px}.stat-value{font-size:2rem}.icon-grid{grid-template-columns:repeat(2,1fr)}.testimonials-grid{grid-template-columns:1fr}.footer-grid{grid-template-columns:1fr}.comparison-table{font-size:.85rem}}
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
    Trade with confidence &mdash; Regulated by FCA, CySEC &amp; DFSA &nbsp;|&nbsp; Segregated client funds &nbsp;|&nbsp; 24/5 Support<a href="#">Open Account</a>
  </div>

  <nav class="navbar">
    <div class="navbar-inner">
      <a href="index.html" class="navbar-brand">${escapeHtml(brandName)}</a>
      <ul class="navbar-links">
${navLinks}
      </ul>
      <a href="#" class="navbar-cta">Open Account</a>
      <button class="navbar-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-inner">
      <h1>${escapeHtml(heroTitle)}</h1>
${heroSubtitle ? `      <p>${escapeHtml(heroSubtitle)}</p>` : ''}
      <div class="hero-buttons">
        <a href="#" class="btn-primary">Open Free Account</a>
        <a href="#" class="btn-outline">Try Demo</a>
      </div>
      <div class="hero-trust">
        <span>🛡️ FCA Regulated</span>
        <span>🔒 Segregated Funds</span>
        <span>⚡ Ultra-Fast Execution</span>
        <span>📊 200+ Instruments</span>
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
        <span>🛡️ FCA Regulated (UK)</span>
        <span>🇪🇺 CySEC Licensed (EU)</span>
        <span>🇦🇪 DFSA Authorized (UAE)</span>
        <span>🔒 256-bit SSL Encryption</span>
        <span>💰 Segregated Client Funds</span>
      </div>
      <div class="footer-payments">
        <span>💳</span><span>🏦</span><span>📱</span><span title="Visa">VISA</span><span title="Mastercard">MC</span><span title="Wire Transfer">WIRE</span>
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
    return `        <div class="testimonial-card">\n${stars}          <div class="testimonial-text">${escapeHtml(t.text)}</div>\n          <div class="testimonial-author">${escapeHtml(t.author)}</div>${role}\n        </div>`
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
    const bullets = left.bullets ? `\n          <ul class="two-col-bullets">\n${left.bullets.map((b) => `            <li>${escapeHtml(b)}</li>`).join('\n')}\n          </ul>` : ''
    const cta = left.ctaText ? `\n          <a href="${escapeHtml(left.ctaUrl || '#')}" class="btn-primary">${escapeHtml(left.ctaText)}</a>` : ''
    leftHtml = `        <div class="two-col-text">\n          <h3>${escapeHtml(left.title)}</h3>\n          <p>${escapeHtml(left.text)}</p>${bullets}${cta}\n        </div>`
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
