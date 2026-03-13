'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import { Target, Plus, Loader2, Eye, Trash2, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

export default function LandingPagesPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: pages, refetch } = trpc.landing.list.useQuery({ projectId: id })
  const { data: templates } = trpc.landing.getTemplates.useQuery()

  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [template, setTemplate] = useState('lead_magnet')
  const [headline, setHeadline] = useState('')

  const createMutation = trpc.landing.create.useMutation({ onSuccess: () => { refetch(); setShowCreate(false); setTitle(''); setHeadline('') } })
  const deleteMutation = trpc.landing.delete.useMutation({ onSuccess: () => refetch() })
  const updateMutation = trpc.landing.update.useMutation({ onSuccess: () => refetch() })

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Landing Pages" subtitle="Create high-converting landing pages for campaigns and lead generation">
      {/* Template Selection */}
      {!showCreate && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{pages?.length || 0} landing pages created</p>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            <Plus className="w-4 h-4" /> New Landing Page
          </button>
        </div>
      )}

      {showCreate && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Create Landing Page</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Page Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Free Trading Guide Download" className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Template</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {templates?.map(t => (
                  <button key={t.id} onClick={() => setTemplate(t.id)} className={cn('p-3 rounded-lg border text-left text-sm transition-colors', template === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30')}>
                    <p className="font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Headline</label>
              <input type="text" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Main headline for the page" className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => title && headline && createMutation.mutate({ projectId: id, title, template, headline })} disabled={!title || !headline || createMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Page'}
              </button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Pages List */}
      <div className="space-y-3">
        {pages?.length === 0 && !showCreate && (
          <div className="text-center py-12 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No landing pages yet. Create one from a template.</p>
          </div>
        )}
        {pages?.map(page => (
          <div key={page.id} className="bg-card border border-border rounded-xl p-5 group hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground">{page.title}</h3>
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', page.status === 'published' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground')}>{page.status}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">{page.template}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{page.headline}</p>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{page.views}</p>
                  <p className="text-[10px] text-muted-foreground">Views</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-success">{page.conversions}</p>
                  <p className="text-[10px] text-muted-foreground">Leads</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{page.views > 0 ? ((page.conversions / page.views) * 100).toFixed(1) : '0'}%</p>
                  <p className="text-[10px] text-muted-foreground">CVR</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
              {page.status === 'draft' && (
                <button onClick={() => updateMutation.mutate({ id: page.id, status: 'published' })} className="px-3 py-1.5 rounded-lg bg-success/20 text-success text-xs font-medium hover:bg-success/30">Publish</button>
              )}
              <button onClick={() => deleteMutation.mutate({ id: page.id })} className="px-3 py-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </PhaseLayout>
  )
}
