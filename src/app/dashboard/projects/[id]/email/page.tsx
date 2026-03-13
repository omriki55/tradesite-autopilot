'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import { Mail, Plus, Loader2, Send, Users, BarChart3, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

export default function EmailMarketingPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: stats } = trpc.email.getStats.useQuery({ projectId: id })
  const [tab, setTab] = useState<'templates' | 'campaigns' | 'subscribers'>('templates')

  const { data: templatesData, refetch: refetchTemplates } = trpc.email.getTemplates.useQuery({ projectId: id })
  const templates = templatesData?.templates
  const { data: campaigns, refetch: refetchCampaigns } = trpc.email.getCampaigns.useQuery({ projectId: id })
  const { data: subscribers, refetch: refetchSubscribers } = trpc.email.getSubscribers.useQuery({ projectId: id })

  const [showCreate, setShowCreate] = useState(false)
  const [tplName, setTplName] = useState('')
  const [tplSubject, setTplSubject] = useState('')
  const [tplBody, setTplBody] = useState('')
  const [tplType, setTplType] = useState('custom')

  const createTemplateMutation = trpc.email.createTemplate.useMutation({ onSuccess: () => { refetchTemplates(); setShowCreate(false); setTplName(''); setTplSubject(''); setTplBody('') } })
  const deleteTemplateMutation = trpc.email.deleteTemplate.useMutation({ onSuccess: () => refetchTemplates() })
  const importFromLeadsMutation = trpc.email.importFromLeads.useMutation({ onSuccess: () => refetchSubscribers() })
  const sendTestMutation = trpc.email.sendTest.useMutation()

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Email Marketing" subtitle="Create templates, build campaigns, and manage subscribers">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Subscribers', value: stats?.totalSubscribers || 0, icon: Users },
          { label: 'Active', value: stats?.activeSubscribers || 0, icon: Mail },
          { label: 'Campaigns', value: stats?.totalCampaigns || 0, icon: Send },
          { label: 'Active Campaigns', value: stats?.activeCampaigns || 0, icon: BarChart3 },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><s.icon className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted p-1 rounded-lg w-fit">
        {(['templates', 'campaigns', 'subscribers'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize', tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {t}
          </button>
        ))}
      </div>

      {/* Templates Tab */}
      {tab === 'templates' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{templates?.length || 0} templates</p>
            <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"><Plus className="w-4 h-4" /> New Template</button>
          </div>
          {showCreate && (
            <div className="bg-card border border-border rounded-xl p-6 mb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={tplName} onChange={e => setTplName(e.target.value)} placeholder="Template name" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <select value={tplType} onChange={e => setTplType(e.target.value)} className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="custom">Custom</option>
                    <option value="welcome">Welcome</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="promotion">Promotion</option>
                    <option value="drip">Drip</option>
                    <option value="re_engagement">Re-engagement</option>
                  </select>
                </div>
                <input type="text" value={tplSubject} onChange={e => setTplSubject(e.target.value)} placeholder="Email subject line" className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <textarea value={tplBody} onChange={e => setTplBody(e.target.value)} placeholder="Email body (HTML supported)" rows={6} className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-mono" />
                <button onClick={() => tplName && tplSubject && tplBody && createTemplateMutation.mutate({ projectId: id, name: tplName, subject: tplSubject, body: tplBody, type: tplType })} disabled={!tplName || !tplSubject || createTemplateMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">Save Template</button>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {templates?.map(tpl => (
              <div key={tpl.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between group hover:border-primary/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{tpl.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">{tpl.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tpl.subject}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => sendTestMutation.mutate({ templateId: tpl.id, recipientEmail: 'test@example.com' })} className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-foreground hover:bg-muted/80"><Send className="w-3 h-3 inline mr-1" />Test</button>
                  <button onClick={() => deleteTemplateMutation.mutate({ id: tpl.id })} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {tab === 'campaigns' && (
        <div>
          {campaigns?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Send className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No campaigns yet. Create templates first, then build campaigns.</p>
            </div>
          )}
          {campaigns?.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.type} | {c.status}</p>
                </div>
                <span className={cn('px-2 py-1 rounded text-xs font-medium', c.status === 'active' ? 'bg-success/20 text-success' : c.status === 'paused' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground')}>{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subscribers Tab */}
      {tab === 'subscribers' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{subscribers?.length || 0} subscribers</p>
            <button onClick={() => importFromLeadsMutation.mutate({ projectId: id })} disabled={importFromLeadsMutation.isPending} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {importFromLeadsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
              Import from Leads
            </button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Source</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscribers?.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-sm text-muted-foreground">No subscribers yet. Import from leads or add manually.</td></tr>}
                {subscribers?.map(sub => (
                  <tr key={sub.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-sm text-foreground">{sub.email}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{sub.name || '-'}</td>
                    <td className="px-4 py-3"><span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', sub.status === 'active' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground')}>{sub.status}</span></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{sub.source}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PhaseLayout>
  )
}
