'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import {
  Database, Plus, Globe, Search, Shield, ExternalLink, Trash2,
  CheckCircle2, Clock, AlertCircle, FileText, BarChart3, Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

interface AgedDomain {
  id: string
  domain: string
  age: string
  da: number
  niche: string
  status: 'queued' | 'warming' | 'ready' | 'deployed' | 'flagged'
  articles: { written: number; total: number }
  backlinks: number
  history: 'clean' | 'minor_issues' | 'flagged'
  purchaseDate: string
  cost: number
}

const sampleDomains: AgedDomain[] = [
  { id: '1', domain: 'tradepro-fx.com', age: '4 years', da: 32, niche: 'Forex Trading', status: 'ready', articles: { written: 5, total: 5 }, backlinks: 45, history: 'clean', purchaseDate: '2024-08-15', cost: 280 },
  { id: '2', domain: 'cryptovault-io.com', age: '3 years', da: 28, niche: 'Crypto Platform', status: 'deployed', articles: { written: 5, total: 5 }, backlinks: 38, history: 'clean', purchaseDate: '2024-09-02', cost: 220 },
  { id: '3', domain: 'investnow-hub.com', age: '2 years', da: 24, niche: 'Investment', status: 'warming', articles: { written: 3, total: 5 }, backlinks: 22, history: 'clean', purchaseDate: '2024-10-10', cost: 180 },
  { id: '4', domain: 'stockedge-pro.com', age: '5 years', da: 41, niche: 'Stock Trading', status: 'ready', articles: { written: 5, total: 5 }, backlinks: 67, history: 'clean', purchaseDate: '2024-07-20', cost: 450 },
  { id: '5', domain: 'binaryboost-fx.com', age: '3 years', da: 19, niche: 'Options Trading', status: 'queued', articles: { written: 0, total: 5 }, backlinks: 12, history: 'minor_issues', purchaseDate: '2024-11-05', cost: 150 },
  { id: '6', domain: 'alphatrade-zone.com', age: '4 years', da: 35, niche: 'Multi-Asset', status: 'deployed', articles: { written: 5, total: 5 }, backlinks: 53, history: 'clean', purchaseDate: '2024-08-28', cost: 320 },
  { id: '7', domain: 'primefx-capital.com', age: '6 years', da: 44, niche: 'Forex Trading', status: 'ready', articles: { written: 5, total: 5 }, backlinks: 89, history: 'clean', purchaseDate: '2024-06-12', cost: 520 },
  { id: '8', domain: 'cointrader-hub.net', age: '2 years', da: 21, niche: 'Crypto Exchange', status: 'warming', articles: { written: 2, total: 5 }, backlinks: 18, history: 'clean', purchaseDate: '2024-11-22', cost: 160 },
]

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  queued: { color: 'bg-muted text-muted-foreground', icon: <Clock className="w-3 h-3" />, label: 'Queued' },
  warming: { color: 'bg-yellow-500/20 text-yellow-400', icon: <Loader2 className="w-3 h-3 animate-spin" />, label: 'Warming' },
  ready: { color: 'bg-blue-500/20 text-blue-400', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Ready' },
  deployed: { color: 'bg-green-500/20 text-green-400', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Deployed' },
  flagged: { color: 'bg-red-500/20 text-red-400', icon: <AlertCircle className="w-3 h-3" />, label: 'Flagged' },
}

const historyColors: Record<string, string> = {
  clean: 'text-green-400',
  minor_issues: 'text-yellow-400',
  flagged: 'text-red-400',
}

export default function AgedDomainsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const [domains] = useState<AgedDomain[]>(sampleDomains)
  const [filter, setFilter] = useState<string>('all')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = filter === 'all' ? domains : domains.filter(d => d.status === filter)
  const totalArticles = domains.reduce((sum, d) => sum + d.articles.written, 0)
  const totalBacklinks = domains.reduce((sum, d) => sum + d.backlinks, 0)
  const avgDA = Math.round(domains.reduce((sum, d) => sum + d.da, 0) / domains.length)

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Aged Domains" subtitle="Pre-purchased domain arsenal — aged, warmed up, and ready for deployment with SEO authority from Day 1">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Domains', value: domains.length, color: 'text-foreground' },
          { label: 'Ready', value: domains.filter(d => d.status === 'ready').length, color: 'text-blue-400' },
          { label: 'Deployed', value: domains.filter(d => d.status === 'deployed').length, color: 'text-green-400' },
          { label: 'Articles Written', value: totalArticles, color: 'text-purple-400' },
          { label: 'Avg. DA Score', value: avgDA, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter & Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {['all', 'queued', 'warming', 'ready', 'deployed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted')}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} {f !== 'all' && `(${domains.filter(d => d.status === f).length})`}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Domain
        </button>
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input type="text" placeholder="Domain name" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="text" placeholder="Niche" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="number" placeholder="DA Score" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="number" placeholder="Cost ($)" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Add Domain</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {/* Domain Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Domain</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Age</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">DA</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Niche</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Articles</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Backlinks</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">History</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(domain => {
                const status = statusConfig[domain.status]
                return (
                  <tr key={domain.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm text-foreground">{domain.domain}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{domain.age}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-sm font-bold', domain.da >= 40 ? 'text-green-400' : domain.da >= 25 ? 'text-blue-400' : 'text-muted-foreground')}>
                        {domain.da}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{domain.niche}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(domain.articles.written / domain.articles.total) * 100}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{domain.articles.written}/{domain.articles.total}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{domain.backlinks}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-medium', historyColors[domain.history])}>
                        {domain.history === 'clean' ? 'Clean' : domain.history === 'minor_issues' ? 'Minor' : 'Flagged'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium w-fit', status.color)}>
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Domain Selection Criteria</p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-green-400" /> Aged & Clean History</div>
            <div className="flex items-center gap-2"><Search className="w-3.5 h-3.5 text-blue-400" /> Low Keyword Competition</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Brand-Safe Reputation</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Per-Domain Content</p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> 1x Pillar Article (2,000+ words)</div>
            <div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> 2x Supporting Blog Posts</div>
            <div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> 1x Comparison / Review</div>
            <div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> 1x FAQ Landing Page</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Investment Summary</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Total Spent</span><span className="text-foreground font-medium">${domains.reduce((s, d) => s + d.cost, 0).toLocaleString()}</span></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Avg. Cost/Domain</span><span className="text-foreground font-medium">${Math.round(domains.reduce((s, d) => s + d.cost, 0) / domains.length)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Total Backlinks</span><span className="text-foreground font-medium">{totalBacklinks}</span></div>
          </div>
        </div>
      </div>
    </PhaseLayout>
  )
}
