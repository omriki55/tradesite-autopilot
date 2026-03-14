'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { cn } from '@/lib/utils'
import { Flag, Clock, TrendingUp, Users, BarChart3, Globe } from 'lucide-react'
import { StatsGrid, StatCard } from '@/components/dashboard/stats-cards'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

const phaseLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Domain Intelligence', color: 'bg-blue-500' },
  2: { label: 'Website Factory', color: 'bg-purple-500' },
  3: { label: 'SEO & GEO', color: 'bg-green-500' },
  4: { label: 'Social Media', color: 'bg-pink-500' },
  5: { label: 'Daily Posting', color: 'bg-orange-500' },
  6: { label: 'Optimization', color: 'bg-cyan-500' },
}

export default function TimelinePage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: timeline, refetch } = trpc.timeline.getTimeline.useQuery({ projectId: id })
  const { data: kpis } = trpc.timeline.getKPIs.useQuery({ projectId: id })
  const updateMutation = trpc.timeline.updateMilestone.useMutation({ onSuccess: () => refetch() })

  const groupedByPhase = (timeline || []).reduce((acc, event) => {
    if (!acc[event.phase]) acc[event.phase] = []
    acc[event.phase]!.push(event)
    return acc
  }, {} as Record<number, NonNullable<typeof timeline>>)

  return (
    <PhaseLayout
      projectId={id}
      projectName={project?.name}
      phaseNum={7}
      title="90-Day Timeline"
      subtitle="Track progress across all phases"
    >
      {kpis && (
        <StatsGrid>
          <StatCard title="Overall Progress" value={`${kpis.progress}%`} icon={<TrendingUp className="w-4 h-4" />} />
          <StatCard title="Days Remaining" value={kpis.daysRemaining} subtitle={`Day ${kpis.daysSinceCreation} of 90`} icon={<Clock className="w-4 h-4" />} />
          <StatCard title="Posts Published" value={kpis.postsPublished} icon={<BarChart3 className="w-4 h-4" />} />
          <StatCard title="Est. Leads" value={kpis.estimatedLeads} subtitle={`${kpis.estimatedTraffic} visitors`} icon={<Users className="w-4 h-4" />} trend="up" />
        </StatsGrid>
      )}

      {/* Progress bar */}
      {kpis && (
        <div className="mt-6 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">90-Day Progress</span>
            <span className="text-sm text-muted-foreground">{kpis.milestonesCompleted}/{kpis.milestonesTotal} milestones</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${kpis.progress}%` }} />
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="mt-8 space-y-8">
        {Object.entries(groupedByPhase).map(([phase, events]) => {
          const phaseNum = Number(phase)
          const info = phaseLabels[phaseNum] || { label: `Phase ${phase}`, color: 'bg-gray-500' }
          const completed = events!.filter((e) => e.status === 'completed').length
          const total = events!.length

          return (
            <div key={phase}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn('w-3 h-3 rounded-full', info.color)} />
                <h2 className="text-lg font-semibold text-foreground">Phase {phase}: {info.label}</h2>
                <span className="text-sm text-muted-foreground">({completed}/{total})</span>
              </div>

              <div className="ml-1.5 border-l-2 border-border pl-6 space-y-3">
                {events!.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                    <button
                      onClick={() => updateMutation.mutate({
                        id: event.id,
                        status: event.status === 'completed' ? 'pending' : 'completed',
                      })}
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                        event.status === 'completed'
                          ? 'bg-success border-success text-white'
                          : event.status === 'in_progress'
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary'
                      )}
                    >
                      {event.status === 'completed' && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={cn('text-sm font-medium', event.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground')}>
                        {event.milestone}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {event.completedDate && ` — Completed ${new Date(event.completedDate).toLocaleDateString()}`}
                      </p>
                    </div>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded capitalize',
                      event.status === 'completed' ? 'bg-success/10 text-success' :
                      event.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {event.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </PhaseLayout>
  )
}
