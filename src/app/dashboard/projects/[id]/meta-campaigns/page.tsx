'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import {
  Target, Plus, Activity, TrendingUp, DollarSign, Eye, MousePointerClick,
  Loader2, Trash2, CheckCircle2, AlertCircle, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

const ACCOUNT_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  active: 'bg-green-500/20 text-green-400',
  paused: 'bg-muted text-muted-foreground',
  suspended: 'bg-red-500/20 text-red-400',
}

const CAMPAIGN_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-green-500/20 text-green-400',
  paused: 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-blue-500/20 text-blue-400',
}

const CAMPAIGN_TYPE_COLORS: Record<string, string> = {
  retargeting: 'bg-purple-500/20 text-purple-400',
  retention: 'bg-blue-500/20 text-blue-400',
  lookalike: 'bg-cyan-500/20 text-cyan-400',
  acquisition: 'bg-green-500/20 text-green-400',
  awareness: 'bg-yellow-500/20 text-yellow-400',
}

type Strategy = {
  campaignName?: string
  objective?: string
  audienceDescription?: string
  targeting?: { age?: string; interests?: string[]; behaviors?: string[]; locations?: string[] }
  adFormats?: string[]
  adCopyVariants?: { headline?: string; primaryText?: string; cta?: string }[]
  estimatedReach?: string
  estimatedCPC?: string
  estimatedROAS?: string
  kpis?: string[]
  optimizationTips?: string[]
}

export default function MetaCampaignsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: stats } = trpc.meta.getStats.useQuery({ projectId: id })
  const { data: accounts, refetch: refetchAccounts } = trpc.meta.listAccounts.useQuery({ projectId: id })
  const { data: campaigns, refetch: refetchCampaigns } = trpc.meta.listCampaigns.useQuery({ projectId: id })

  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showAddCampaign, setShowAddCampaign] = useState(false)
  const [showStrategy, setShowStrategy] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [newBrand, setNewBrand] = useState('')
  const [newAccountId, setNewAccountId] = useState('')
  const [newPixelId, setNewPixelId] = useState('')
  const [newBudget, setNewBudget] = useState('50')
  const [newCampaignName, setNewCampaignName] = useState('')
  const [newCampaignType, setNewCampaignType] = useState<'retargeting' | 'lookalike' | 'retention' | 'acquisition' | 'awareness'>('retargeting')
  const [strategyNiche, setStrategyNiche] = useState('')
  const [strategy, setStrategy] = useState<Strategy | null>(null)

  const selectedAccount = accounts?.find(a => a.id === selectedAccountId)

  const createAccountMutation = trpc.meta.createAccount.useMutation({
    onSuccess: () => { refetchAccounts(); setShowAddAccount(false); setNewBrand('') },
  })
  const createCampaignMutation = trpc.meta.createCampaign.useMutation({
    onSuccess: () => { refetchCampaigns(); setShowAddCampaign(false); setNewCampaignName('') },
  })
  const updateCampaignMutation = trpc.meta.updateCampaignStatus.useMutation({
    onSuccess: () => refetchCampaigns(),
  })
  const deleteCampaignMutation = trpc.meta.deleteCampaign.useMutation({
    onSuccess: () => refetchCampaigns(),
  })
  const generateStrategyMutation = trpc.meta.generateCampaignStrategy.useMutation({
    onSuccess: (data) => { setStrategy(data); },
  })

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Meta Campaigns" subtitle="Manage ad accounts, pixel tracking, retargeting campaigns, and AI-generated strategies across all brands">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Spend', value: `$${(stats?.totalSpend || 0).toLocaleString()}`, color: 'text-amber-400', icon: DollarSign },
          { label: 'Impressions', value: (stats?.totalImpressions || 0).toLocaleString(), color: 'text-blue-400', icon: Eye },
          { label: 'Clicks', value: (stats?.totalClicks || 0).toLocaleString(), color: 'text-purple-400', icon: MousePointerClick },
          { label: 'Conversions', value: (stats?.totalConversions || 0).toLocaleString(), color: 'text-green-400', icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <s.icon className={cn('w-4 h-4', s.color)} />
            </div>
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Ad Accounts */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Ad Accounts</h2>
        <button onClick={() => setShowAddAccount(!showAddAccount)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Account
        </button>
      </div>

      {showAddAccount && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={newBrand} onChange={e => setNewBrand(e.target.value)} placeholder="Brand Name" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="text" value={newAccountId} onChange={e => setNewAccountId(e.target.value)} placeholder="Meta Account ID (act_...)" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="text" value={newPixelId} onChange={e => setNewPixelId(e.target.value)} placeholder="Pixel ID" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="text" value={newBudget} onChange={e => setNewBudget(e.target.value)} placeholder="Daily Budget ($)" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => newBrand && createAccountMutation.mutate({ projectId: id, brandName: newBrand, accountId: newAccountId || undefined, pixelId: newPixelId || undefined, dailyBudget: newBudget ? `$${newBudget}` : undefined })} disabled={!newBrand || createAccountMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {createAccountMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Account'}
            </button>
            <button onClick={() => setShowAddAccount(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {!accounts?.length ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl mb-6">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Ad Accounts Yet</h3>
          <p className="text-muted-foreground">Add your first Meta ad account to start managing campaigns</p>
        </div>
      ) : (
        <div className="grid gap-2 mb-6">
          {accounts.map(acc => (
            <div key={acc.id} onClick={() => setSelectedAccountId(acc.id)} className={cn('bg-card border rounded-xl p-4 cursor-pointer transition-all', selectedAccountId === acc.id ? 'border-primary/40' : 'border-border')}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-foreground">{acc.brandName}</span>
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', ACCOUNT_STATUS_COLORS[acc.status])}>{acc.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {acc.accountId && <span className="font-mono">{acc.accountId}</span>}
                    {acc.pixelId && <span className="flex items-center gap-1"><Activity className="w-3 h-3" />Pixel: {acc.pixelId}</span>}
                    {acc.dailyBudget && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{acc.dailyBudget}/day</span>}
                    <span>{acc._count.campaigns} campaigns</span>
                  </div>
                </div>
                {acc.status === 'active' ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaigns */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Campaigns</h2>
        <button onClick={() => setShowAddCampaign(!showAddCampaign)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      {showAddCampaign && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={newCampaignName} onChange={e => setNewCampaignName(e.target.value)} placeholder="Campaign Name" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <select value={newCampaignType} onChange={e => setNewCampaignType(e.target.value as typeof newCampaignType)} className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="retargeting">Retargeting</option>
              <option value="lookalike">Lookalike</option>
              <option value="retention">Retention</option>
              <option value="acquisition">Acquisition</option>
              <option value="awareness">Awareness</option>
            </select>
            <select value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)} className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select account...</option>
              {accounts?.map(a => <option key={a.id} value={a.id}>{a.brandName}</option>)}
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => newCampaignName && selectedAccountId && createCampaignMutation.mutate({ adAccountId: selectedAccountId, name: newCampaignName, type: newCampaignType })} disabled={!newCampaignName || !selectedAccountId || createCampaignMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {createCampaignMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Campaign'}
            </button>
            <button onClick={() => setShowAddCampaign(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {!campaigns?.length ? (
        <div className="text-center py-10 bg-card border border-border rounded-xl mb-6">
          <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No campaigns yet — create your first campaign</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Campaign</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Impressions</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Clicks</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Conv.</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Spend</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => {
                const ctr = c.impressions && c.clicks ? ((c.clicks / c.impressions) * 100).toFixed(2) : '0.00'
                return (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', CAMPAIGN_STATUS_COLORS[c.status])}>{c.status}</span>
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', CAMPAIGN_TYPE_COLORS[c.type])}>{c.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.clicks.toLocaleString()} ({ctr}%)</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.conversions}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.spend}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        {c.status === 'draft' && (
                          <button onClick={() => updateCampaignMutation.mutate({ id: c.id, status: 'active' })} className="px-3 py-1 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700">
                            <Zap className="w-3 h-3 inline mr-1" />Activate
                          </button>
                        )}
                        {c.status === 'active' && (
                          <button onClick={() => updateCampaignMutation.mutate({ id: c.id, status: 'paused' })} className="px-3 py-1 rounded-lg text-xs font-medium border border-border hover:bg-muted">Pause</button>
                        )}
                        {c.status === 'paused' && (
                          <button onClick={() => updateCampaignMutation.mutate({ id: c.id, status: 'active' })} className="px-3 py-1 rounded-lg text-xs font-medium border border-border hover:bg-muted">Resume</button>
                        )}
                        <button onClick={() => deleteCampaignMutation.mutate({ id: c.id })} className="p-1 rounded text-muted-foreground hover:text-red-400">
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
      )}

      {/* AI Campaign Strategy */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Campaign Strategy</h2>
        <button onClick={() => setShowStrategy(!showStrategy)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">
          ✨ Generate Strategy
        </button>
      </div>

      {showStrategy && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <select value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)} className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select account...</option>
              {accounts?.map(a => <option key={a.id} value={a.id}>{a.brandName}</option>)}
            </select>
            <input type="text" value={strategyNiche} onChange={e => setStrategyNiche(e.target.value)} placeholder="Niche (e.g. forex trading)" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <select value={newCampaignType} onChange={e => setNewCampaignType(e.target.value as typeof newCampaignType)} className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="retargeting">Retargeting</option>
              <option value="lookalike">Lookalike</option>
              <option value="retention">Retention</option>
              <option value="acquisition">Acquisition</option>
              <option value="awareness">Awareness</option>
            </select>
            <input type="text" value={newBudget} onChange={e => setNewBudget(e.target.value)} placeholder="Daily Budget ($)" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button onClick={() => strategyNiche && generateStrategyMutation.mutate({ brandName: selectedAccount?.brandName || 'Brand', niche: strategyNiche, campaignType: newCampaignType, budget: `$${newBudget}/day` })} disabled={!strategyNiche || generateStrategyMutation.isPending} className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
            {generateStrategyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : '✨'} Generate Strategy
          </button>
        </div>
      )}

      {strategy && (
        <div className="bg-card border border-primary/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">{strategy.campaignName}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Est. Reach', value: strategy.estimatedReach },
              { label: 'Est. CPC', value: strategy.estimatedCPC },
              { label: 'Est. ROAS', value: strategy.estimatedROAS },
            ].map(m => (
              <div key={m.label} className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                <p className="font-bold text-sm">{m.value || '—'}</p>
              </div>
            ))}
          </div>
          {strategy.audienceDescription && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Target Audience</p>
              <p className="text-sm text-foreground/80">{strategy.audienceDescription}</p>
            </div>
          )}
          {strategy.adCopyVariants?.length ? (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Ad Copy Variants</p>
              <div className="space-y-2">
                {strategy.adCopyVariants.slice(0, 2).map((v, i) => (
                  <div key={i} className="bg-muted/30 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-semibold text-foreground">{v.headline}</p>
                    <p className="text-xs text-muted-foreground">{v.primaryText}</p>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary">{v.cta}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {strategy.optimizationTips?.length ? (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Optimization Tips</p>
              <ul className="space-y-1">
                {strategy.optimizationTips.map((tip, i) => (
                  <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </PhaseLayout>
  )
}
