'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import {
  ShoppingBag, Plus, Trash2, ExternalLink, Users, Heart, Eye,
  CheckCircle2, Clock, Facebook, Instagram, Youtube, Hash,
  Calendar, BarChart3, Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

interface SocialAsset {
  id: string
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube'
  pageName: string
  url: string
  followers: number
  accountAge: string
  postHistory: number
  niche: string
  assignedDomain: string | null
  status: 'available' | 'rebranding' | 'active' | 'paused'
  purchaseCost: number
  purchaseDate: string
  engagement: string
}

const sampleAssets: SocialAsset[] = [
  { id: '1', platform: 'facebook', pageName: 'ForexTrading Daily', url: '#', followers: 5200, accountAge: '4 years', postHistory: 320, niche: 'Forex', assignedDomain: 'tradepro-fx.com', status: 'active', purchaseCost: 400, purchaseDate: '2024-09-15', engagement: '3.2%' },
  { id: '2', platform: 'instagram', pageName: '@crypto_insights', url: '#', followers: 8100, accountAge: '3 years', postHistory: 450, niche: 'Crypto', assignedDomain: 'cryptovault-io.com', status: 'active', purchaseCost: 550, purchaseDate: '2024-10-02', engagement: '4.1%' },
  { id: '3', platform: 'tiktok', pageName: '@tradingtips_pro', url: '#', followers: 12300, accountAge: '2 years', postHistory: 180, niche: 'Trading', assignedDomain: null, status: 'available', purchaseCost: 700, purchaseDate: '2024-11-20', engagement: '6.8%' },
  { id: '4', platform: 'facebook', pageName: 'Investment Hub', url: '#', followers: 3400, accountAge: '5 years', postHistory: 280, niche: 'Investment', assignedDomain: 'investnow-hub.com', status: 'rebranding', purchaseCost: 350, purchaseDate: '2024-08-30', engagement: '2.8%' },
  { id: '5', platform: 'instagram', pageName: '@stockmarket_daily', url: '#', followers: 6700, accountAge: '3 years', postHistory: 390, niche: 'Stocks', assignedDomain: 'stockedge-pro.com', status: 'active', purchaseCost: 480, purchaseDate: '2024-09-25', engagement: '3.9%' },
  { id: '6', platform: 'youtube', pageName: 'Trading Mastery', url: '#', followers: 2100, accountAge: '4 years', postHistory: 85, niche: 'Education', assignedDomain: null, status: 'available', purchaseCost: 600, purchaseDate: '2024-12-05', engagement: '5.2%' },
  { id: '7', platform: 'tiktok', pageName: '@forex_signals_live', url: '#', followers: 15600, accountAge: '2 years', postHistory: 220, niche: 'Forex Signals', assignedDomain: 'alphatrade-zone.com', status: 'active', purchaseCost: 900, purchaseDate: '2024-07-18', engagement: '7.4%' },
]

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook className="w-5 h-5 text-blue-500" />,
  instagram: <Instagram className="w-5 h-5 text-pink-500" />,
  tiktok: <Hash className="w-5 h-5 text-foreground" />,
  youtube: <Youtube className="w-5 h-5 text-red-500" />,
}

const platformColors: Record<string, string> = {
  facebook: 'bg-blue-500/10',
  instagram: 'bg-pink-500/10',
  tiktok: 'bg-foreground/10',
  youtube: 'bg-red-500/10',
}

const statusColors: Record<string, string> = {
  available: 'bg-blue-500/20 text-blue-400',
  rebranding: 'bg-yellow-500/20 text-yellow-400',
  active: 'bg-green-500/20 text-green-400',
  paused: 'bg-muted text-muted-foreground',
}

export default function SocialAssetsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const [assets] = useState(sampleAssets)
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? assets : assets.filter(a => a.platform === filter)
  const totalFollowers = assets.reduce((s, a) => s + a.followers, 0)
  const totalInvested = assets.reduce((s, a) => s + a.purchaseCost, 0)
  const activeAssets = assets.filter(a => a.status === 'active').length

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Social Assets" subtitle="Pre-purchased aged social media pages with real followers — instant credibility and algorithm trust">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Assets', value: assets.length, color: 'text-foreground' },
          { label: 'Active', value: activeAssets, color: 'text-green-400' },
          { label: 'Total Followers', value: `${(totalFollowers / 1000).toFixed(1)}K`, color: 'text-blue-400' },
          { label: 'Avg. Engagement', value: `${(assets.reduce((s, a) => s + parseFloat(a.engagement), 0) / assets.length).toFixed(1)}%`, color: 'text-purple-400' },
          { label: 'Total Invested', value: `$${(totalInvested / 1000).toFixed(1)}K`, color: 'text-emerald-400' },
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
          {['all', 'facebook', 'instagram', 'tiktok', 'youtube'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === f ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted')}>
              {f !== 'all' && platformIcons[f]}
              {f === 'all' ? `All (${assets.length})` : assets.filter(a => a.platform === f).length}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {filtered.map(asset => (
          <div key={asset.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', platformColors[asset.platform])}>
                {platformIcons[asset.platform]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{asset.pageName}</span>
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', statusColors[asset.status])}>{asset.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Followers</p>
                    <p className="font-medium text-foreground">{asset.followers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account Age</p>
                    <p className="font-medium text-foreground">{asset.accountAge}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-medium text-foreground">{asset.engagement}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Post History</p>
                    <p className="font-medium text-foreground">{asset.postHistory} posts</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Niche</p>
                    <p className="font-medium text-foreground">{asset.niche}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Assigned To</p>
                    <p className="font-medium text-foreground">{asset.assignedDomain || '—'}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">${asset.purchaseCost}</span>
                <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Acquisition Criteria */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Acquisition Criteria</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Account Age', value: '12+ months', req: 'REQUIRED' },
            { label: 'Followers', value: '1,000+', req: 'REQUIRED' },
            { label: 'Post History', value: '50+ posts', req: 'REQUIRED' },
            { label: 'Niche Relevance', value: 'Finance / Trading', req: 'PREFERRED' },
          ].map(criteria => (
            <div key={criteria.label} className="text-center">
              <p className="text-lg font-bold text-foreground">{criteria.value}</p>
              <p className="text-xs text-muted-foreground mb-1">{criteria.label}</p>
              <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', criteria.req === 'REQUIRED' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>{criteria.req}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { step: '1', title: 'Acquire Aged Pages', desc: 'Buy pre-purchased accounts with history & followers for instant trust', icon: <ShoppingBag className="w-5 h-5 text-blue-400" /> },
          { step: '2', title: 'Setup & Assignment', desc: 'Pages are rebranded and assigned to the new website entity', icon: <CheckCircle2 className="w-5 h-5 text-yellow-400" /> },
          { step: '3', title: 'AI Daily Management', desc: 'AI generates and schedules 30 days of content in advance', icon: <Calendar className="w-5 h-5 text-green-400" /> },
        ].map(s => (
          <div key={s.step} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">{s.icon}</div>
            <p className="text-sm font-medium text-foreground mb-1">Phase {s.step}: {s.title}</p>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </PhaseLayout>
  )
}
