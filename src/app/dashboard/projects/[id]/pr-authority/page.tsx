'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import {
  Award, Plus, ExternalLink, Globe, CheckCircle2, Clock, FileText,
  BarChart3, ArrowUpRight, Send, Star, Newspaper, BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

interface AuthoritySite {
  id: string
  name: string
  url: string
  da: number
  type: 'news' | 'blog' | 'directory' | 'press'
  niche: string
  status: 'available' | 'published' | 'pending' | 'expired'
  cost: number
  articlesPlaced: number
}

interface PressRelease {
  id: string
  title: string
  targetDomain: string
  distributionSites: number
  status: 'draft' | 'submitted' | 'published' | 'syndicated'
  publishDate: string
  impressions: string
}

const sampleSites: AuthoritySite[] = [
  { id: '1', name: 'FinanceWeekly', url: 'financeweekly.com', da: 52, type: 'news', niche: 'Finance', status: 'published', cost: 350, articlesPlaced: 4 },
  { id: '2', name: 'TradingBlogger', url: 'tradingblogger.net', da: 44, type: 'blog', niche: 'Trading', status: 'published', cost: 200, articlesPlaced: 6 },
  { id: '3', name: 'InvestorDirectory', url: 'investordirectory.org', da: 48, type: 'directory', niche: 'Investment', status: 'published', cost: 120, articlesPlaced: 3 },
  { id: '4', name: 'CryptoNewsHub', url: 'cryptonewshub.io', da: 41, type: 'news', niche: 'Crypto', status: 'available', cost: 280, articlesPlaced: 0 },
  { id: '5', name: 'ForexInsider', url: 'forexinsider.com', da: 46, type: 'blog', niche: 'Forex', status: 'published', cost: 250, articlesPlaced: 5 },
  { id: '6', name: 'BrokerReview Pro', url: 'brokerreviewpro.com', da: 39, type: 'directory', niche: 'Broker Review', status: 'pending', cost: 180, articlesPlaced: 1 },
  { id: '7', name: 'MarketPulse Daily', url: 'marketpulsedaily.com', da: 55, type: 'news', niche: 'Markets', status: 'published', cost: 450, articlesPlaced: 3 },
  { id: '8', name: 'PRNewsDistro', url: 'prnewsdistro.com', da: 62, type: 'press', niche: 'General', status: 'published', cost: 500, articlesPlaced: 2 },
]

const samplePR: PressRelease[] = [
  { id: '1', title: 'TradePro FX Launches Zero-Commission Trading for Retail Investors', targetDomain: 'tradepro-fx.com', distributionSites: 45, status: 'syndicated', publishDate: '2025-02-15', impressions: '125K' },
  { id: '2', title: 'CryptoVault Achieves Major Security Certification for Exchange Platform', targetDomain: 'cryptovault-io.com', distributionSites: 38, status: 'published', publishDate: '2025-03-01', impressions: '89K' },
  { id: '3', title: 'AlphaTrade Zone Expands to 15 New Markets Across Southeast Asia', targetDomain: 'alphatrade-zone.com', distributionSites: 0, status: 'draft', publishDate: '2025-03-20', impressions: '—' },
]

const typeIcons: Record<string, React.ReactNode> = {
  news: <Newspaper className="w-5 h-5 text-blue-400" />,
  blog: <BookOpen className="w-5 h-5 text-orange-400" />,
  directory: <Globe className="w-5 h-5 text-purple-400" />,
  press: <Send className="w-5 h-5 text-emerald-400" />,
}

const statusColors: Record<string, string> = {
  available: 'bg-blue-500/20 text-blue-400',
  published: 'bg-green-500/20 text-green-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  expired: 'bg-red-500/20 text-red-400',
  draft: 'bg-muted text-muted-foreground',
  submitted: 'bg-yellow-500/20 text-yellow-400',
  syndicated: 'bg-emerald-500/20 text-emerald-400',
}

export default function PRAuthorityPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const [sites] = useState(sampleSites)
  const [pressReleases] = useState(samplePR)
  const [view, setView] = useState<'sites' | 'press'>('sites')

  const publishedSites = sites.filter(s => s.status === 'published')
  const avgDA = Math.round(publishedSites.reduce((s, site) => s + site.da, 0) / (publishedSites.length || 1))
  const totalPlacements = sites.reduce((s, site) => s + site.articlesPlaced, 0)
  const totalSpent = sites.reduce((s, site) => s + (site.articlesPlaced > 0 ? site.cost * site.articlesPlaced : 0), 0)

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="PR & Authority" subtitle="High-DA paid placements, niche directories, and press release distribution for instant SEO authority">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Authority Sites', value: sites.length, color: 'text-foreground' },
          { label: 'Avg. DA', value: `${avgDA}+`, color: 'text-blue-400' },
          { label: 'Total Placements', value: totalPlacements, color: 'text-green-400' },
          { label: 'Press Releases', value: pressReleases.length, color: 'text-purple-400' },
          { label: 'Total Invested', value: `$${(totalSpent / 1000).toFixed(1)}K`, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {(['sites', 'press'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-colors', view === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
              {v === 'sites' ? 'Authority Sites' : 'Press Releases'}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> {view === 'sites' ? 'Add Site' : 'New Press Release'}
        </button>
      </div>

      {view === 'sites' ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Site</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Type</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">DA</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Niche</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Articles</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Cost/Article</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {sites.map(site => (
                <tr key={site.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {typeIcons[site.type]}
                      <div>
                        <p className="text-sm font-medium text-foreground">{site.name}</p>
                        <p className="text-xs text-muted-foreground">{site.url}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{site.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className={cn('text-sm font-bold', site.da >= 50 ? 'text-green-400' : site.da >= 40 ? 'text-blue-400' : 'text-muted-foreground')}>{site.da}</span>
                      {site.da >= 50 && <Star className="w-3 h-3 text-yellow-400" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{site.niche}</td>
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{site.articlesPlaced}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">${site.cost}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', statusColors[site.status])}>{site.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-3">
          {pressReleases.map(pr => (
            <div key={pr.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Send className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground mb-0.5">{pr.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {pr.targetDomain}</span>
                    <span>{pr.distributionSites} distribution sites</span>
                    <span>{pr.publishDate}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{pr.impressions}</p>
                  <p className="text-xs text-muted-foreground">Impressions</p>
                </div>
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', statusColors[pr.status])}>{pr.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Placement Strategy */}
      <div className="mt-6 bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Placement Strategy</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { title: 'Blogger Texts', desc: 'Pre-written articles agreed with bloggers, ready to publish on command', count: `${sites.filter(s => s.type === 'blog').length} sites` },
            { title: 'High-DA Sites', desc: 'Placements on established sites with DA 40+ in finance niche', count: `${sites.filter(s => s.da >= 40).length} sites` },
            { title: 'Niche Directories', desc: 'Listings in financial and trading directories for citation signals', count: `${sites.filter(s => s.type === 'directory').length} sites` },
            { title: 'Press Distribution', desc: 'Syndicated press releases on launch day to news aggregators', count: `${pressReleases.filter(p => p.status === 'syndicated').length} active` },
          ].map(item => (
            <div key={item.title} className="text-center">
              <p className="text-sm font-medium text-foreground mb-1">{item.title}</p>
              <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
              <span className="px-2 py-0.5 bg-primary/10 rounded text-[11px] text-primary font-medium">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </PhaseLayout>
  )
}
