// Static HTML/CSS exporter for trading company websites

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
  content?: string
  items?: Array<{ title?: string; description?: string; label?: string; value?: string }>
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

// ─── Stylesheet ──────────────────────────────────────────

function generateStylesheet(options: ExportOptions): string {
  const nicheColors: Record<string, { primary: string; primaryDark: string; accent: string }> = {
    forex_broker: { primary: '#1a56db', primaryDark: '#1440a0', accent: '#059669' },
    crypto_exchange: { primary: '#7c3aed', primaryDark: '#5b21b6', accent: '#f59e0b' },
    prop_trading: { primary: '#0d9488', primaryDark: '#0f766e', accent: '#2563eb' },
  }
  const c = nicheColors[options.niche] || nicheColors.forex_broker

  return `/* ${options.brandName} — Generated Stylesheet */
:root{--color-primary:${c.primary};--color-primary-dark:${c.primaryDark};--color-accent:${c.accent};--color-bg:#fff;--color-bg-alt:#f8fafc;--color-bg-dark:#0f172a;--color-text:#1e293b;--color-text-light:#64748b;--color-text-inv:#fff;--color-border:#e2e8f0;--font-sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;--max-w:1200px;--radius:8px;--shadow-sm:0 1px 2px rgba(0,0,0,.05);--shadow-md:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);--shadow-lg:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;scroll-behavior:smooth}
body{font-family:var(--font-sans);color:var(--color-text);background:var(--color-bg);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:var(--color-primary);text-decoration:none;transition:color .2s}
a:hover{color:var(--color-primary-dark)}
img{max-width:100%;height:auto}

.navbar{position:sticky;top:0;z-index:100;background:var(--color-bg);border-bottom:1px solid var(--color-border);box-shadow:var(--shadow-sm)}
.navbar-inner{max-width:var(--max-w);margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:64px}
.navbar-brand{font-size:1.25rem;font-weight:700;color:var(--color-primary)}
.navbar-links{display:flex;gap:24px;list-style:none;flex-wrap:wrap}
.navbar-links a{color:var(--color-text);font-size:.875rem;font-weight:500;padding:4px 0}
.navbar-links a:hover,.navbar-links a.active{color:var(--color-primary)}
.navbar-toggle{display:none;background:none;border:none;cursor:pointer;padding:8px}
.navbar-toggle span{display:block;width:24px;height:2px;background:var(--color-text);margin:5px 0}

.hero{background:linear-gradient(135deg,var(--color-bg-dark) 0%,color-mix(in srgb,var(--color-primary) 30%,var(--color-bg-dark)) 100%);color:var(--color-text-inv);padding:80px 24px;text-align:center}
.hero-inner{max-width:800px;margin:0 auto}
.hero h1{font-size:2.75rem;font-weight:800;line-height:1.2;margin-bottom:16px}
.hero p{font-size:1.2rem;opacity:.9;margin-bottom:32px}
.hero .btn-primary{font-size:1.1rem;padding:14px 36px}

.section{padding:64px 24px}
.section-alt{background:var(--color-bg-alt)}
.section-inner{max-width:var(--max-w);margin:0 auto}
.section-title{font-size:2rem;font-weight:700;text-align:center;margin-bottom:40px}

.text-content{max-width:800px;margin:0 auto;font-size:1.05rem;line-height:1.8;color:var(--color-text-light)}
.text-content p{margin-bottom:16px}

.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.feature-card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius);padding:32px 24px;box-shadow:var(--shadow-sm);transition:box-shadow .2s,transform .2s}
.feature-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px)}
.feature-card h3{font-size:1.1rem;font-weight:600;margin-bottom:8px}
.feature-card p{font-size:.95rem;color:var(--color-text-light)}

.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;align-items:start}
.pricing-card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius);padding:32px 24px;text-align:center;box-shadow:var(--shadow-sm);position:relative}
.pricing-card.highlighted{border-color:var(--color-primary);box-shadow:var(--shadow-lg);transform:scale(1.03)}
.pricing-card.highlighted::before{content:'Most Popular';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--color-primary);color:#fff;padding:4px 16px;border-radius:12px;font-size:.75rem;font-weight:600;text-transform:uppercase}
.pricing-card h3{font-size:1.25rem;font-weight:600;margin-bottom:8px}
.pricing-card .price{font-size:2.5rem;font-weight:800;color:var(--color-primary);margin-bottom:4px}
.pricing-card .period{font-size:.875rem;color:var(--color-text-light);margin-bottom:24px}
.pricing-card ul{list-style:none;text-align:left;margin-bottom:24px}
.pricing-card ul li{padding:8px 0;border-bottom:1px solid var(--color-border);font-size:.95rem;color:var(--color-text-light)}
.pricing-card ul li::before{content:'\\2713';color:var(--color-accent);margin-right:8px;font-weight:700}

.content-list{max-width:800px;margin:0 auto;list-style:none}
.content-list li{padding:16px 0;border-bottom:1px solid var(--color-border);display:flex;gap:12px;align-items:flex-start}
.content-list li::before{content:'\\2713';color:var(--color-accent);font-weight:700;flex-shrink:0;margin-top:2px}
.content-list .list-title{font-weight:600}
.content-list .list-desc{color:var(--color-text-light);font-size:.95rem}

.cta-section{background:linear-gradient(135deg,var(--color-primary) 0%,var(--color-primary-dark) 100%);color:var(--color-text-inv);padding:64px 24px;text-align:center}
.cta-section h2{font-size:2rem;font-weight:700;margin-bottom:12px}
.cta-section p{font-size:1.1rem;opacity:.9;margin-bottom:24px;max-width:600px;margin-left:auto;margin-right:auto}

.data-table{width:100%;border-collapse:collapse;background:var(--color-bg);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-sm)}
.data-table th,.data-table td{padding:12px 16px;text-align:left;border-bottom:1px solid var(--color-border);font-size:.95rem}
.data-table th{background:var(--color-bg-alt);font-weight:600;font-size:.85rem;text-transform:uppercase;letter-spacing:.05em}
.data-table td{color:var(--color-text-light)}
.data-table tbody tr:hover{background:var(--color-bg-alt)}

.btn-primary{display:inline-block;background:var(--color-primary);color:var(--color-text-inv);padding:12px 28px;border-radius:var(--radius);font-weight:600;font-size:1rem;border:none;cursor:pointer;transition:background .2s,transform .1s}
.btn-primary:hover{background:var(--color-primary-dark);color:var(--color-text-inv);transform:translateY(-1px)}
.btn-outline{display:inline-block;background:transparent;color:var(--color-text-inv);padding:12px 28px;border-radius:var(--radius);font-weight:600;font-size:1rem;border:2px solid var(--color-text-inv);cursor:pointer;transition:background .2s}
.btn-outline:hover{background:rgba(255,255,255,.1);color:var(--color-text-inv)}

.footer{background:var(--color-bg-dark);color:var(--color-text-inv);padding:48px 24px 24px}
.footer-inner{max-width:var(--max-w);margin:0 auto}
.footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px;margin-bottom:32px}
.footer-col h4{font-size:.9rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:16px;opacity:.7}
.footer-col ul{list-style:none}
.footer-col ul li{margin-bottom:8px}
.footer-col a{color:var(--color-text-inv);opacity:.7;font-size:.9rem;transition:opacity .2s}
.footer-col a:hover{opacity:1;color:var(--color-text-inv)}
.footer-bottom{border-top:1px solid rgba(255,255,255,.1);padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.footer-bottom p{font-size:.8rem;opacity:.5}
.footer-risk{font-size:.75rem;opacity:.4;line-height:1.6;margin-top:16px;max-width:800px}

@media(max-width:768px){.navbar-links{display:none}.navbar-toggle{display:block}.hero h1{font-size:2rem}.hero p{font-size:1rem}.section{padding:40px 16px}.pricing-card.highlighted{transform:none}.footer-bottom{flex-direction:column;text-align:center}}
@media(max-width:480px){.hero{padding:48px 16px}.hero h1{font-size:1.75rem}.features-grid{grid-template-columns:1fr}.pricing-grid{grid-template-columns:1fr}}
`
}

// ─── Page HTML ───────────────────────────────────────────

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
    return `      <li><a href="${href}"${cls}>${escapeHtml(p.title)}</a></li>`
  }).join('\n')

  const sectionBlocks = sections.map((s, i) => {
    const alt = i % 2 === 1 ? ' section-alt' : ''
    const inner = renderSection(s)
    const title = s.title ? `      <h2 class="section-title">${escapeHtml(s.title)}</h2>\n` : ''
    return `  <section class="section${alt}">\n    <div class="section-inner">\n${title}${inner}\n    </div>\n  </section>`
  }).join('\n\n')

  const corePages = pages.filter((p) => ['about', 'contact', 'faq', 'education', 'support'].includes(p.slug))
  const legalPages = pages.filter((p) => p.pageType === 'legal' || ['terms', 'privacy', 'risk-disclosure', 'risk-warning', 'regulation'].includes(p.slug))
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
${gtmHead(options)}${ga4Script(options)}</head>
<body>
${gtmBody(options)}  <nav class="navbar">
    <div class="navbar-inner">
      <a href="index.html" class="navbar-brand">${escapeHtml(brandName)}</a>
      <ul class="navbar-links">
${navLinks}
      </ul>
      <button class="navbar-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-inner">
      <h1>${escapeHtml(heroTitle)}</h1>
${heroSubtitle ? `      <p>${escapeHtml(heroSubtitle)}</p>` : ''}
      <a href="#" class="btn-primary">Get Started</a>
    </div>
  </section>

${sectionBlocks}

  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>${escapeHtml(brandName)}</h4>
          <p style="font-size:.9rem;opacity:.7;line-height:1.6;">Your trusted partner for online trading. Trade global markets with confidence.</p>
        </div>
${corePages.length ? `        <div class="footer-col">\n          <h4>Company</h4>\n          <ul>\n${corePages.map((p) => `            <li><a href="${p.slug.replace(/\//g, '-')}.html">${escapeHtml(p.title)}</a></li>`).join('\n')}\n          </ul>\n        </div>` : ''}
${legalPages.length ? `        <div class="footer-col">\n          <h4>Legal</h4>\n          <ul>\n${legalPages.map((p) => `            <li><a href="${p.slug.replace(/\//g, '-')}.html">${escapeHtml(p.title)}</a></li>`).join('\n')}\n          </ul>\n        </div>` : ''}
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:support@${escapeHtml(domain)}">support@${escapeHtml(domain)}</a></li>
            <li><a href="https://${escapeHtml(domain)}">${escapeHtml(domain)}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${year} ${escapeHtml(brandName)}. All rights reserved.</p>
        <p><a href="terms.html" style="color:inherit;opacity:.7">Terms</a> &middot; <a href="privacy.html" style="color:inherit;opacity:.7">Privacy</a></p>
      </div>
      <p class="footer-risk">Trading in financial instruments carries a high level of risk and may not be suitable for all investors. Past performance is not indicative of future results. Please ensure you fully understand the risks involved before trading.</p>
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
  const cards = items.map((it) => `        <div class="feature-card">\n          <h3>${escapeHtml(it.title || '')}</h3>\n          <p>${escapeHtml(it.description || '')}</p>\n        </div>`).join('\n')
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
  return `    </div>\n  </section>\n  <section class="cta-section">\n    <h2>${escapeHtml(s.title || 'Ready to Start?')}</h2>\n    <p>${escapeHtml(s.content || '')}</p>\n    <a href="${escapeHtml(url)}" class="btn-primary">${escapeHtml(txt)}</a>`
}

function renderTable(s: ParsedSection): string {
  const cols = s.columns || []
  const rows = s.rows || []
  const ths = cols.map((c) => `          <th>${escapeHtml(c)}</th>`).join('\n')
  const trs = rows.map((r) => `        <tr>\n${cols.map((c) => `          <td>${escapeHtml(r[c] || '')}</td>`).join('\n')}\n        </tr>`).join('\n')
  return `      <table class="data-table">\n        <thead><tr>\n${ths}\n        </tr></thead>\n        <tbody>\n${trs}\n        </tbody>\n      </table>`
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
