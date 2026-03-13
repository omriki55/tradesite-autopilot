'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import {
  Handshake, Plus, Loader2, Trash2, Copy, ChevronDown, ChevronUp, Users, DollarSign, BarChart3, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

const commissionTypeLabels: Record<string, string> = {
  cpa: 'CPA (Cost per Acquisition)',
  revenue_share: 'Revenue Share',
  hybrid: 'Hybrid',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  suspended: 'bg-red-500/20 text-red-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
}

const referralStatusColors: Record<string, string> = {
  clicked: 'bg-muted text-muted-foreground',
  registered: 'bg-blue-500/20 text-blue-400',
  deposited: 'bg-purple-500/20 text-purple-400',
  active: 'bg-green-500/20 text-green-400',
}

export default function AffiliatesPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: stats } = trpc.affiliates.getStats.useQuery({ projectId: id })
  const { data: affiliates, refetch: refetchAffiliates } = trpc.affiliates.list.useQuery({ projectId: id })

  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newType, setNewType] = useState<'cpa' | 'revenue_share' | 'hybrid'>('cpa')
  const [newRate, setNewRate] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [showMaterials, setShowMaterials] = useState(false)

  const createMutation = trpc.affiliates.create.useMutation({
    onSuccess: () => {
      refetchAffiliates()
      setShowAdd(false)
      setNewName('')
      setNewEmail('')
      setNewRate('')
    },
  })
  const deleteMutation = trpc.affiliates.delete.useMutation({ onSuccess: () => refetchAffiliates() })
  const updateMutation = trpc.affiliates.update.useMutation({ onSuccess: () => refetchAffiliates() })
  const generateMaterialsMutation = trpc.affiliates.generateMaterials.useMutation({
    onSuccess: () => setShowMaterials(true),
  })

  const domain = project?.domain?.selectedDomain || 'example.com'

  function copyCode(code: string) {
    const link = `https://${domain}?ref=${code}`
    navigator.clipboard.writeText(link)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Affiliates / IB Portal" subtitle="Manage affiliates, referral codes, commissions, and promotional materials">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Affiliates', value: stats?.totalAffiliates || 0, icon: Users, color: 'text-foreground' },
          { label: 'Active', value: stats?.activeAffiliates || 0, icon: Handshake, color: 'text-green-400' },
          { label: 'Total Referrals', value: stats?.totalReferrals || 0, icon: BarChart3, color: 'text-blue-400' },
          { label: 'Commissions Paid', value: `$${(stats?.totalCommissions || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <s.icon className={cn('w-5 h-5 mx-auto mb-1', s.color)} />
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Affiliates</h2>
        <div className="flex gap-2">
          <button
            onClick={() => generateMaterialsMutation.mutate({ projectId: id })}
            disabled={generateMaterialsMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
          >
            {generateMaterialsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Materials
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add Affiliate
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text" value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Affiliate Name"
              className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
              placeholder="Email Address"
              className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <select
              value={newType} onChange={e => setNewType(e.target.value as typeof newType)}
              className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="cpa">CPA (Cost per Acquisition)</option>
              <option value="revenue_share">Revenue Share</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <input
              type="number" value={newRate} onChange={e => setNewRate(e.target.value)}
              placeholder="Commission Rate ($)"
              className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => newName && newEmail && createMutation.mutate({
                projectId: id,
                name: newName,
                email: newEmail,
                commissionType: newType,
                commissionRate: parseFloat(newRate) || 0,
              })}
              disabled={!newName || !newEmail || createMutation.isPending}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Affiliate'}
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {/* Generated Materials */}
      {showMaterials && generateMaterialsMutation.data && (
        <div className="bg-card border border-primary/30 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> AI-Generated Promotional Materials</h3>
            <button onClick={() => setShowMaterials(false)} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
          </div>

          {/* Banners */}
          {generateMaterialsMutation.data.banners && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Banner Copies</h4>
              <div className="grid gap-2">
                {generateMaterialsMutation.data.banners.map((b, i) => (
                  <div key={i} className="bg-background rounded-lg p-3 border border-border">
                    <p className="font-semibold text-sm text-foreground">{b.headline}</p>
                    <p className="text-xs text-muted-foreground mt-1">{b.subtext}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded bg-primary/10 text-primary text-xs font-medium">{b.ctaText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Posts */}
          {generateMaterialsMutation.data.socialPosts && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Social Media Posts</h4>
              <div className="grid gap-2">
                {generateMaterialsMutation.data.socialPosts.map((p, i) => (
                  <div key={i} className="bg-background rounded-lg p-3 border border-border">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-400 mb-1 inline-block">{p.platform}</span>
                    <p className="text-sm text-foreground mt-1">{p.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{p.hashtags?.map(h => `#${h}`).join(' ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Templates */}
          {generateMaterialsMutation.data.emailTemplates && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Templates</h4>
              <div className="grid gap-2">
                {generateMaterialsMutation.data.emailTemplates.map((e, i) => (
                  <div key={i} className="bg-background rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/20 text-purple-400">{e.type}</span>
                      <p className="font-semibold text-sm text-foreground">{e.subject}</p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-pre-line">{e.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Affiliates List */}
      {!affiliates?.length ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl mb-6">
          <Handshake className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Affiliates Yet</h3>
          <p className="text-muted-foreground">Add your first affiliate partner to start the referral program</p>
        </div>
      ) : (
        <div className="grid gap-3 mb-6">
          {affiliates.map(a => (
            <div key={a.id} className="bg-card border border-border rounded-xl">
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Handshake className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-foreground">{a.name}</span>
                      <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', statusColors[a.status])}>{a.status}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">{commissionTypeLabels[a.commissionType] || a.commissionType}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{a.email}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{a._count.referrals} referrals</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${a.totalEarned.toFixed(2)} earned</span>
                      <span>Rate: ${a.commissionRate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyCode(a.code)}
                      className={cn('flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted', copied === a.code && 'bg-green-500/10 border-green-500/30 text-green-400')}
                    >
                      <Copy className="w-3 h-3" /> {copied === a.code ? 'Copied!' : a.code}
                    </button>
                    {a.status === 'active' ? (
                      <button onClick={() => updateMutation.mutate({ id: a.id, status: 'suspended' })} className="px-3 py-1.5 rounded-lg text-xs font-medium text-yellow-400 hover:bg-yellow-500/10">Suspend</button>
                    ) : (
                      <button onClick={() => updateMutation.mutate({ id: a.id, status: 'active' })} className="px-3 py-1.5 rounded-lg text-xs font-medium text-green-400 hover:bg-green-500/10">Activate</button>
                    )}
                    <button onClick={() => setExpandedId(expandedId === a.id ? null : a.id)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted">
                      {expandedId === a.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button onClick={() => deleteMutation.mutate({ id: a.id })} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Referrals */}
              {expandedId === a.id && <AffiliateReferrals affiliateId={a.id} />}
            </div>
          ))}
        </div>
      )}
    </PhaseLayout>
  )
}

function AffiliateReferrals({ affiliateId }: { affiliateId: string }) {
  const { data: referrals } = trpc.affiliates.getReferrals.useQuery({ affiliateId })

  if (!referrals?.length) {
    return (
      <div className="border-t border-border px-4 py-3 text-center text-sm text-muted-foreground">
        No referrals yet for this affiliate
      </div>
    )
  }

  return (
    <div className="border-t border-border">
      <div className="px-4 py-2 bg-muted/30">
        <div className="grid grid-cols-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Email</span>
          <span>Status</span>
          <span>Commission</span>
          <span>Date</span>
        </div>
      </div>
      {referrals.map(r => (
        <div key={r.id} className="px-4 py-2 border-t border-border/50 grid grid-cols-4 text-sm items-center">
          <span className="text-foreground truncate">{r.email}</span>
          <span><span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', referralStatusColors[r.status] || 'bg-muted text-muted-foreground')}>{r.status}</span></span>
          <span className="text-foreground">${r.commission.toFixed(2)}</span>
          <span className="text-muted-foreground text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  )
}
