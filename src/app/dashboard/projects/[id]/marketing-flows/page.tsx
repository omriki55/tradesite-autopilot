'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import {
  GitBranch, Users, MessageCircle, Mail, Phone, Plus, Loader2,
  ChevronDown, ChevronRight, ArrowRight, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

const CHANNEL_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  crm: { color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'CRM' },
  whatsapp: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'WhatsApp' },
  sms: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'SMS' },
  email: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Email' },
  call: { color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Call' },
  meta: { color: 'text-sky-400', bg: 'bg-sky-500/20', label: 'Meta Ads' },
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400',
  contacted: 'bg-yellow-500/20 text-yellow-400',
  interested: 'bg-green-500/20 text-green-400',
  not_interested: 'bg-red-500/20 text-red-400',
  converted: 'bg-purple-500/20 text-purple-400',
  lost: 'bg-muted text-muted-foreground',
}

const FLOW_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-green-500/20 text-green-400',
  paused: 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-blue-500/20 text-blue-400',
}

// The reference 14-step affiliate lead flow
const STATIC_FLOW_STEPS = [
  { id: 1, label: 'Affiliate Submits Lead', description: 'Affiliate sends lead data to CRM via API or form.', trigger: 'Affiliate action', channel: 'crm', timing: 'Day 0' },
  { id: 2, label: 'WhatsApp Welcome Template', description: 'Send branded WhatsApp template with welcome message and login button.', trigger: 'Lead enters CRM', channel: 'whatsapp', timing: 'Day 0 — Instant' },
  { id: 3, label: 'Button Press → Login + Qualification', description: 'Login details delivered. 3 qualification questions: Age, Experience, Market preference.', trigger: 'Button press', channel: 'whatsapp', timing: 'Day 0 — On action' },
  { id: 4, label: 'WhatsApp Group Invitation', description: 'Lead automatically invited to brand WhatsApp community group.', trigger: 'Login delivered', channel: 'whatsapp', timing: 'Day 0 — Instant' },
  { id: 5, label: 'Classroom Access Sent', description: 'Link to classroom platform sent via WhatsApp for learning.', trigger: 'Login delivered', channel: 'whatsapp', timing: 'Day 0 — Instant' },
  { id: 6, label: 'Website Visit + Pixel Fire', description: 'Lead visits site. Meta Pixel captures event for retargeting audiences.', trigger: 'Website visit', channel: 'meta', timing: 'Day 0–1' },
  { id: 7, label: 'Agent WhatsApp Follow-Up', description: 'Agent sends personal WhatsApp message, notifies lead of upcoming call.', trigger: 'Agent action', channel: 'whatsapp', timing: 'Day 1' },
  { id: 8, label: 'Outbound Call', description: 'Agent calls lead. If no answer, retry. Notes logged in CRM.', trigger: 'Scheduled or no-reply', channel: 'call', timing: 'Day 1–2' },
  { id: 9, label: 'SMS — Interested Path', description: 'Promotional SMS with discount or urgency offer sent.', trigger: 'Lead = Interested', channel: 'sms', timing: 'Day 3–7' },
  { id: 10, label: 'Email — Interested Path', description: 'Email sequence: welcome, product benefits, success stories, limited-time offer.', trigger: 'Lead = Interested', channel: 'email', timing: 'Day 3–14' },
  { id: 11, label: 'SMS — Not Interested Path', description: 'Re-engagement SMS with different angle, softer tone.', trigger: 'Lead = Not Interested', channel: 'sms', timing: 'Day 5–10' },
  { id: 12, label: 'Email — Not Interested Path', description: 'Educational email series: market insights, free resources, low-commitment CTAs.', trigger: 'Lead = Not Interested', channel: 'email', timing: 'Day 7–20' },
  { id: 13, label: 'Meta Retargeting Ads', description: 'Lead sees targeted ads on Facebook/Instagram based on pixel data.', trigger: 'Pixel event', channel: 'meta', timing: 'Day 1–30' },
  { id: 14, label: 'Final Push — Day 25–30', description: 'Last-chance SMS + email with maximum urgency. Offer expires soon.', trigger: 'Day 25', channel: 'sms', timing: 'Day 25–30' },
]

export default function MarketingFlowsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: stats } = trpc.flows.getStats.useQuery({ projectId: id })
  const { data: flows, refetch: refetchFlows } = trpc.flows.list.useQuery({ projectId: id })

  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [selectedFlowId, setSelectedFlowId] = useState('')
  const [showCreateFlow, setShowCreateFlow] = useState(false)
  const [showAddLead, setShowAddLead] = useState(false)
  const [newFlowName, setNewFlowName] = useState('')
  const [newFlowType, setNewFlowType] = useState<'affiliate_lead' | 'whatsapp_sequence' | 'email_nurture' | 'sms_campaign'>('affiliate_lead')
  const [newFlowNiche, setNewFlowNiche] = useState('')
  const [newLeadName, setNewLeadName] = useState('')
  const [newLeadPhone, setNewLeadPhone] = useState('')
  const [newLeadEmail, setNewLeadEmail] = useState('')
  const [newLeadSource, setNewLeadSource] = useState('Affiliate A')

  const selectedFlow = flows?.find(f => f.id === selectedFlowId)
  const { data: leads, refetch: refetchLeads } = trpc.flows.listLeads.useQuery(
    { flowId: selectedFlowId },
    { enabled: !!selectedFlowId }
  )

  const createFlowMutation = trpc.flows.create.useMutation({
    onSuccess: () => { refetchFlows(); setShowCreateFlow(false); setNewFlowName('') },
  })
  const generateFlowMutation = trpc.flows.generateFlow.useMutation({
    onSuccess: () => refetchFlows(),
  })
  const addLeadMutation = trpc.flows.addLead.useMutation({
    onSuccess: () => { refetchLeads(); setShowAddLead(false); setNewLeadName('') },
  })
  const updateLeadMutation = trpc.flows.updateLeadStatus.useMutation({
    onSuccess: () => refetchLeads(),
  })

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Marketing Flows" subtitle="Full 30-day automated lead journey — from affiliate submission to conversion via WhatsApp, Call, SMS, and Email">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Flow Steps', value: STATIC_FLOW_STEPS.length, color: 'text-primary' },
          { label: 'Active Flows', value: stats?.activeFlows || 0, color: 'text-foreground' },
          { label: 'Leads in Flows', value: stats?.totalLeads || 0, color: 'text-foreground' },
          { label: 'Interested', value: stats?.interested || 0, color: 'text-green-400' },
          { label: 'Converted', value: stats?.converted || 0, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Flow Manager */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Flow Manager</h2>
        <button onClick={() => setShowCreateFlow(!showCreateFlow)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> New Flow
        </button>
      </div>

      {showCreateFlow && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={newFlowName} onChange={e => setNewFlowName(e.target.value)} placeholder="Flow name (e.g. TradeVault Affiliate Flow)" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <select value={newFlowType} onChange={e => setNewFlowType(e.target.value as typeof newFlowType)} className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="affiliate_lead">Affiliate Lead</option>
              <option value="whatsapp_sequence">WhatsApp Sequence</option>
              <option value="email_nurture">Email Nurture</option>
              <option value="sms_campaign">SMS Campaign</option>
            </select>
            <input type="text" value={newFlowNiche} onChange={e => setNewFlowNiche(e.target.value)} placeholder="Niche (for AI generation)" className="col-span-2 px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => newFlowName && createFlowMutation.mutate({ projectId: id, name: newFlowName, flowType: newFlowType })} disabled={!newFlowName || createFlowMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {createFlowMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Flow'}
            </button>
            <button onClick={() => setShowCreateFlow(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {/* Flows list */}
      {flows?.length ? (
        <div className="grid gap-2 mb-6">
          {flows.map(flow => (
            <div key={flow.id} onClick={() => setSelectedFlowId(flow.id)} className={cn('bg-card border rounded-xl p-4 cursor-pointer transition-all', selectedFlowId === flow.id ? 'border-primary/40' : 'border-border hover:border-border/80')}>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-foreground">{flow.name}</span>
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', FLOW_STATUS_COLORS[flow.status])}>{flow.status}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">{flow.flowType.replace('_', ' ')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{flow.totalDays}-day flow • {flow._count.leads} leads</p>
                </div>
                {flow.status === 'draft' && (
                  <button onClick={e => { e.stopPropagation(); generateFlowMutation.mutate({ flowId: flow.id, brandName: flow.name, flowType: flow.flowType, niche: newFlowNiche || 'trading' }) }} disabled={generateFlowMutation.isPending} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted">
                    {generateFlowMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : '✨ AI Generate'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-xl mb-6">
          <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Flows Yet</h3>
          <p className="text-muted-foreground">Create your first 30-day marketing automation flow</p>
        </div>
      )}

      {/* The 30-Day Flow Reference */}
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">The 30-Day Flow Reference</h2>
      <div className="space-y-1.5 mb-6">
        {STATIC_FLOW_STEPS.map((step, idx) => {
          const conf = CHANNEL_CONFIG[step.channel] || CHANNEL_CONFIG.crm
          const isExpanded = expandedStep === step.id
          const isConditional = step.trigger.startsWith('Lead =')
          return (
            <div key={step.id}>
              <button className="w-full text-left" onClick={() => setExpandedStep(isExpanded ? null : step.id)}>
                <div className={cn('bg-card border rounded-xl p-3 transition-all', isExpanded ? 'border-primary/30' : 'border-border')}>
                  <div className="flex items-center gap-3">
                    <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0', conf.bg, conf.color)}>
                      {step.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-foreground">{step.label}</span>
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', conf.bg, conf.color)}>{conf.label}</span>
                        {isConditional && <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-400">Conditional</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.timing}</p>
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                  </div>
                </div>
              </button>
              {isExpanded && (
                <div className="ml-10 pl-3 border-l border-primary/20 py-2 space-y-1.5">
                  <p className="text-sm text-foreground/80">{step.description}</p>
                  <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground/60">Trigger:</span> {step.trigger}</p>
                </div>
              )}
              {idx < STATIC_FLOW_STEPS.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 rotate-90" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Leads in selected flow */}
      {selectedFlowId && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Leads — {selectedFlow?.name}
            </h2>
            <button onClick={() => setShowAddLead(!showAddLead)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">
              <Plus className="w-4 h-4" /> Add Lead
            </button>
          </div>

          {showAddLead && (
            <div className="bg-card border border-border rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={newLeadName} onChange={e => setNewLeadName(e.target.value)} placeholder="Lead Name" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="text" value={newLeadPhone} onChange={e => setNewLeadPhone(e.target.value)} placeholder="Phone" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="email" value={newLeadEmail} onChange={e => setNewLeadEmail(e.target.value)} placeholder="Email" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="text" value={newLeadSource} onChange={e => setNewLeadSource(e.target.value)} placeholder="Source (e.g. Affiliate A)" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => newLeadName && addLeadMutation.mutate({ flowId: selectedFlowId, name: newLeadName, phone: newLeadPhone || undefined, email: newLeadEmail || undefined, source: newLeadSource })} disabled={!newLeadName || addLeadMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {addLeadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Lead'}
                </button>
                <button onClick={() => setShowAddLead(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
              </div>
            </div>
          )}

          {!leads?.length ? (
            <div className="text-center py-10 bg-card border border-border rounded-xl">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No leads in this flow yet</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Lead</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Source</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Step</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{lead.name || 'Unknown'}</td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-muted-foreground">
                          {lead.phone && <span className="block">{lead.phone}</span>}
                          {lead.email && <span className="block">{lead.email}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{lead.source}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><Zap className="w-3 h-3" />Step {lead.currentStep}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select value={lead.status} onChange={e => updateLeadMutation.mutate({ id: lead.id, status: e.target.value as 'new' | 'contacted' | 'interested' | 'not_interested' | 'converted' | 'lost' })} className={cn('px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer', STATUS_COLORS[lead.status] || 'bg-muted text-muted-foreground')}>
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="interested">Interested</option>
                          <option value="not_interested">Not Interested</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </PhaseLayout>
  )
}
