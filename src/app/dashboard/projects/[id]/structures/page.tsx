'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import {
  Layers, Plus, Copy, Trash2, FileText, Layout, Search, Loader2, Check, Eye,
  ChevronDown, ChevronUp, GripVertical, Code, Type, Image, List,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

interface PageBlock {
  id: string
  type: 'hero' | 'features' | 'pricing' | 'cta' | 'stats' | 'testimonials' | 'faq' | 'steps' | 'comparison' | 'text'
  label: string
}

interface SiteStructure {
  id: string
  name: string
  description: string
  pages: { slug: string; title: string; blocks: PageBlock[] }[]
  seoKeywords: string[]
  ctaLocations: string[]
  blogEnabled: boolean
  status: 'draft' | 'ready' | 'in_use'
  createdAt: string
}

const defaultStructures: SiteStructure[] = [
  {
    id: 'tpl-forex-pro',
    name: 'Forex Broker Pro',
    description: 'Full-featured forex broker template with 18 pages, trading tools, and regulatory compliance sections',
    pages: [
      { slug: 'home', title: 'Homepage', blocks: [{ id: '1', type: 'hero', label: 'Hero Banner' }, { id: '2', type: 'features', label: 'Key Features' }, { id: '3', type: 'stats', label: 'Trading Stats' }, { id: '4', type: 'testimonials', label: 'Reviews' }, { id: '5', type: 'cta', label: 'CTA Section' }] },
      { slug: 'about', title: 'About Us', blocks: [{ id: '6', type: 'hero', label: 'Company Hero' }, { id: '7', type: 'stats', label: 'Company Stats' }, { id: '8', type: 'steps', label: 'Our Story' }] },
      { slug: 'platforms', title: 'Trading Platforms', blocks: [{ id: '9', type: 'hero', label: 'Platform Hero' }, { id: '10', type: 'features', label: 'Platform Features' }, { id: '11', type: 'comparison', label: 'Platform Compare' }] },
      { slug: 'account-types', title: 'Account Types', blocks: [{ id: '12', type: 'pricing', label: 'Account Tiers' }, { id: '13', type: 'comparison', label: 'Account Compare' }] },
      { slug: 'pricing', title: 'Pricing', blocks: [{ id: '14', type: 'pricing', label: 'Fee Structure' }, { id: '15', type: 'faq', label: 'Pricing FAQ' }] },
      { slug: 'markets/forex', title: 'Forex Trading', blocks: [{ id: '16', type: 'hero', label: 'Forex Hero' }, { id: '17', type: 'features', label: 'Forex Features' }] },
      { slug: 'markets/crypto', title: 'Crypto Trading', blocks: [{ id: '18', type: 'hero', label: 'Crypto Hero' }, { id: '19', type: 'features', label: 'Crypto Features' }] },
      { slug: 'markets/commodities', title: 'Commodities', blocks: [{ id: '20', type: 'hero', label: 'Commodities Hero' }] },
      { slug: 'markets/indices', title: 'Indices', blocks: [{ id: '21', type: 'hero', label: 'Indices Hero' }] },
      { slug: 'education', title: 'Education Centre', blocks: [{ id: '22', type: 'hero', label: 'Education Hero' }, { id: '23', type: 'features', label: 'Courses' }] },
      { slug: 'contact', title: 'Contact', blocks: [{ id: '24', type: 'hero', label: 'Contact Hero' }, { id: '25', type: 'text', label: 'Contact Form' }] },
      { slug: 'regulation', title: 'Regulation', blocks: [{ id: '26', type: 'text', label: 'Regulatory Info' }] },
      { slug: 'partners', title: 'Partners', blocks: [{ id: '27', type: 'hero', label: 'Partners Hero' }, { id: '28', type: 'steps', label: 'How It Works' }] },
      { slug: 'terms', title: 'Terms of Service', blocks: [{ id: '29', type: 'text', label: 'Legal Text' }] },
      { slug: 'privacy', title: 'Privacy Policy', blocks: [{ id: '30', type: 'text', label: 'Privacy Text' }] },
      { slug: 'risk-disclosure', title: 'Risk Disclosure', blocks: [{ id: '31', type: 'text', label: 'Risk Warning' }] },
    ],
    seoKeywords: ['forex trading', 'online broker', 'CFD trading', 'forex platform', 'currency trading'],
    ctaLocations: ['hero', 'sticky_bar', 'inline', 'exit_intent'],
    blogEnabled: true,
    status: 'in_use',
    createdAt: '2024-12-15',
  },
  {
    id: 'tpl-crypto-exchange',
    name: 'Crypto Exchange',
    description: 'Cryptocurrency-focused template with wallet integration pages and token listing sections',
    pages: [
      { slug: 'home', title: 'Homepage', blocks: [{ id: '40', type: 'hero', label: 'Hero' }, { id: '41', type: 'stats', label: 'Live Prices' }, { id: '42', type: 'features', label: 'Features' }] },
      { slug: 'markets', title: 'Markets', blocks: [{ id: '43', type: 'hero', label: 'Market Overview' }] },
      { slug: 'earn', title: 'Earn', blocks: [{ id: '44', type: 'pricing', label: 'Staking Rates' }] },
      { slug: 'security', title: 'Security', blocks: [{ id: '45', type: 'features', label: 'Security Features' }] },
    ],
    seoKeywords: ['crypto exchange', 'buy bitcoin', 'cryptocurrency trading', 'crypto wallet'],
    ctaLocations: ['hero', 'sticky_bar', 'inline'],
    blogEnabled: true,
    status: 'ready',
    createdAt: '2025-01-20',
  },
  {
    id: 'tpl-multi-asset',
    name: 'Multi-Asset Broker',
    description: 'General-purpose broker template covering stocks, forex, crypto, and commodities',
    pages: [
      { slug: 'home', title: 'Homepage', blocks: [{ id: '50', type: 'hero', label: 'Hero' }, { id: '51', type: 'features', label: 'Asset Classes' }] },
      { slug: 'invest', title: 'Invest', blocks: [{ id: '52', type: 'features', label: 'Investment Options' }] },
      { slug: 'tools', title: 'Tools', blocks: [{ id: '53', type: 'features', label: 'Trading Tools' }] },
    ],
    seoKeywords: ['online trading', 'stock trading', 'investment platform', 'multi-asset broker'],
    ctaLocations: ['hero', 'inline'],
    blogEnabled: false,
    status: 'draft',
    createdAt: '2025-02-10',
  },
]

const blockIcons: Record<string, React.ReactNode> = {
  hero: <Layout className="w-3.5 h-3.5" />,
  features: <List className="w-3.5 h-3.5" />,
  pricing: <FileText className="w-3.5 h-3.5" />,
  cta: <Type className="w-3.5 h-3.5" />,
  stats: <Code className="w-3.5 h-3.5" />,
  testimonials: <Image className="w-3.5 h-3.5" />,
  faq: <ChevronDown className="w-3.5 h-3.5" />,
  steps: <GripVertical className="w-3.5 h-3.5" />,
  comparison: <Layers className="w-3.5 h-3.5" />,
  text: <Type className="w-3.5 h-3.5" />,
}

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  ready: 'bg-blue-500/20 text-blue-400',
  in_use: 'bg-green-500/20 text-green-400',
}

export default function StructuresPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const [structures] = useState<SiteStructure[]>(defaultStructures)
  const [selected, setSelected] = useState<string | null>(null)
  const [expandedPage, setExpandedPage] = useState<string | null>(null)

  const selectedStructure = structures.find(s => s.id === selected)

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={2} title="Site Structures" subtitle="Define reusable site blueprints — pages, CTAs, SEO requirements, and content structure">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Templates', value: structures.length, color: 'text-foreground' },
          { label: 'Ready', value: structures.filter(s => s.status === 'ready').length, color: 'text-blue-400' },
          { label: 'In Use', value: structures.filter(s => s.status === 'in_use').length, color: 'text-green-400' },
          { label: 'Total Pages', value: structures.reduce((sum, s) => sum + s.pages.length, 0), color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Structure Library</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> New Structure
        </button>
      </div>

      {/* Structure Cards */}
      <div className="grid gap-3 mb-6">
        {structures.map(structure => (
          <div
            key={structure.id}
            onClick={() => setSelected(selected === structure.id ? null : structure.id)}
            className={cn(
              'bg-card border rounded-xl p-4 cursor-pointer transition-all',
              selected === structure.id ? 'border-primary ring-1 ring-primary/20' : 'border-border hover:border-primary/30'
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-foreground">{structure.name}</span>
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', statusColors[structure.status])}>
                    {structure.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{structure.description}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{structure.pages.length} pages</span>
                <span>{structure.seoKeywords.length} keywords</span>
                <span>{structure.ctaLocations.length} CTAs</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expanded Detail */}
            {selected === structure.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">SEO Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {structure.seoKeywords.map(kw => (
                        <span key={kw} className="px-2 py-0.5 bg-muted rounded text-[11px] text-foreground">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">CTA Zones</p>
                    <div className="flex flex-wrap gap-1.5">
                      {structure.ctaLocations.map(loc => (
                        <span key={loc} className="px-2 py-0.5 bg-primary/10 rounded text-[11px] text-primary">{loc.replace('_', ' ')}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Configuration</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">{structure.blogEnabled ? <Check className="w-3 h-3 text-green-400" /> : <span className="w-3 h-3 rounded-full bg-muted" />} Blog</span>
                    </div>
                  </div>
                </div>

                {/* Page Map */}
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Page Map</p>
                <div className="grid gap-1.5">
                  {structure.pages.map(page => (
                    <div key={page.slug}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedPage(expandedPage === page.slug ? null : page.slug) }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-background hover:bg-muted text-sm transition-colors"
                      >
                        {expandedPage === page.slug ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                        <span className="font-medium text-foreground">{page.title}</span>
                        <span className="text-muted-foreground text-xs">/{page.slug}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{page.blocks.length} blocks</span>
                      </button>
                      {expandedPage === page.slug && (
                        <div className="ml-6 mt-1 mb-2 flex flex-wrap gap-1.5">
                          {page.blocks.map(block => (
                            <span key={block.id} className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-[11px] text-foreground">
                              {blockIcons[block.type]} {block.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Blueprint Schema Preview */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Blueprint Schema</h3>
        </div>
        <pre className="text-xs text-muted-foreground bg-background rounded-lg p-3 overflow-x-auto">
{`{
  "template": "${selectedStructure?.name || 'Select a template'}",
  "pages": ${selectedStructure?.pages.length || 0},
  "cta_zones": ${selectedStructure?.ctaLocations.length || 0},
  "blog_enabled": ${selectedStructure?.blogEnabled ?? false},
  "keywords": ${selectedStructure?.seoKeywords.length || 0},
  "schema_types": ["Organization", "Article", "FAQ"],
  "status": "${selectedStructure?.status || 'none'}"
}`}
        </pre>
      </div>
    </PhaseLayout>
  )
}
