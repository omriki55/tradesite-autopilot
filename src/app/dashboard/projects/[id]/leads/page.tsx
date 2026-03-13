'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import { Users, Download, Plus, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

export default function LeadsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: stats } = trpc.leads.getStats.useQuery({ projectId: id })
  const [statusFilter, setStatusFilter] = useState<string>('')
  const { data: leads, refetch } = trpc.leads.list.useQuery({ projectId: id, status: statusFilter || undefined })

  const [showCreate, setShowCreate] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [expandedLead, setExpandedLead] = useState<string | null>(null)

  const createMutation = trpc.leads.create.useMutation({ onSuccess: () => { refetch(); setEmail(''); setName(''); setShowCreate(false) } })
  const updateStatusMutation = trpc.leads.updateStatus.useMutation({ onSuccess: () => refetch() })

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-400',
    contacted: 'bg-yellow-500/20 text-yellow-400',
    qualified: 'bg-purple-500/20 text-purple-400',
    converted: 'bg-green-500/20 text-green-400',
    lost: 'bg-red-500/20 text-red-400',
  }

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Lead Management" subtitle="Track and manage leads from landing pages and contact forms">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Leads', value: stats?.total || 0, color: 'text-foreground' },
          { label: 'New', value: stats?.byStatus?.new || 0, color: 'text-blue-400' },
          { label: 'Qualified', value: stats?.byStatus?.qualified || 0, color: 'text-purple-400' },
          { label: 'Converted', value: stats?.byStatus?.converted || 0, color: 'text-green-400' },
          { label: 'CVR', value: (stats?.conversionRate || 0) + '%', color: 'text-primary' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {['', 'new', 'contacted', 'qualified', 'converted', 'lost'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
              {s || 'All'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex gap-3">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="flex-1 px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name (optional)" className="flex-1 px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button onClick={() => email && createMutation.mutate({ projectId: id, email, name: name || undefined, source: 'manual' })} disabled={!email || createMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
            </button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Source</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads?.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-sm text-muted-foreground">No leads yet</td></tr>
            )}
            {leads?.map(lead => (
              <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{lead.name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground">{lead.source.replace('_', ' ')}</span>
                </td>
                <td className="px-4 py-3">
                  <select value={lead.status} onChange={e => updateStatusMutation.mutate({ id: lead.id, status: e.target.value as 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' })} className={cn('px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer', statusColors[lead.status] || 'bg-muted text-muted-foreground')}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                    {expandedLead === lead.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PhaseLayout>
  )
}
