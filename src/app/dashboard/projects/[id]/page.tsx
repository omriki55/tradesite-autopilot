'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/trpc/client'
import { StatsGrid, StatCard } from '@/components/dashboard/stats-cards'
import {
  Globe, Layout, Search, Share2, Calendar, Flag,
  ArrowRight, Check, Clock, TrendingUp, Zap, Play,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const phaseConfig = [
  {
    num: 1,
    label: 'Domain Intelligence',
    icon: Globe,
    href: 'domain',
    description: 'Find & register the perfect domain',
    action: 'Find Domain',
  },
  {
    num: 2,
    label: 'Website Factory',
    icon: Layout,
    href: 'website',
    description: 'Generate 18 professional pages',
    action: 'Build Website',
  },
  {
    num: 3,
    label: 'SEO & GEO',
    icon: Search,
    href: 'seo',
    description: 'Optimize for search engines',
    action: 'Optimize SEO',
  },
  {
    num: 4,
    label: 'Social Media',
    icon: Share2,
    href: 'social',
    description: 'Create profiles on 7 platforms',
    action: 'Setup Profiles',
  },
  {
    num: 5,
    label: 'Daily Posting',
    icon: Calendar,
    href: 'posting',
    description: 'Automate content publishing',
    action: 'Start Posting',
  },
  {
    num: 6,
    label: '90-Day Timeline',
    icon: Flag,
    href: 'timeline',
    description: 'Track your launch progress',
    action: 'View Timeline',
  },
]

export default function ProjectOverviewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: project, isLoading } = trpc.project.getById.useQuery({ id })
  const { data: kpis } = trpc.timeline.getKPIs.useQuery({ projectId: id })

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded" />
          <div className="grid grid-cols-4 gap-4 mt-8">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-muted rounded-xl" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!project) return <div className="text-destructive">Project not found</div>

  const progressPercent = Math.round(((project.currentPhase - 1) / 6) * 100)

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.brandName}</p>
        </div>
        <button
          onClick={() => router.push(`/dashboard/projects/${id}/${phaseConfig[project.currentPhase - 1]?.href || 'domain'}`)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          <Play className="w-4 h-4" />
          Continue Phase {project.currentPhase}
        </button>
      </div>

      {/* Overall progress */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground">Overall Progress</h2>
          <span className="text-sm font-bold text-primary">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-border rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700"
            style={{ width: `${Math.max(progressPercent, 2)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-muted-foreground">
          {phaseConfig.map((p) => (
            <span key={p.num} className={cn(
              p.num < project.currentPhase ? 'text-success' :
              p.num === project.currentPhase ? 'text-primary font-medium' :
              'text-muted-foreground/50'
            )}>
              {p.num}. {p.label.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <StatsGrid>
        <StatCard
          title="Domain"
          value={project.domain?.selectedDomain || 'Not set'}
          icon={<Globe className="w-4 h-4" />}
        />
        <StatCard
          title="Website Pages"
          value={project.website?.pages?.length || 0}
          icon={<Layout className="w-4 h-4" />}
          subtitle={project.website?.status || 'Pending'}
        />
        <StatCard
          title="SEO Score"
          value={project.seoConfig?.seoScore || '--'}
          icon={<Search className="w-4 h-4" />}
        />
        <StatCard
          title="Social Profiles"
          value={project.socialProfiles?.length || 0}
          icon={<Share2 className="w-4 h-4" />}
          subtitle={`${project._count?.socialPosts || 0} posts`}
        />
      </StatsGrid>

      {/* Phase cards — the main action area */}
      <h2 className="text-lg font-semibold text-foreground mt-8 mb-4">Phases</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {phaseConfig.map((phase) => {
          const Icon = phase.icon
          const isComplete = phase.num < project.currentPhase
          const isCurrent = phase.num === project.currentPhase
          const isLocked = phase.num > project.currentPhase

          return (
            <Link
              key={phase.num}
              href={`/dashboard/projects/${id}/${phase.href}`}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border transition-all group',
                isCurrent && 'bg-primary/5 border-primary/30 hover:border-primary/50',
                isComplete && 'bg-success/5 border-success/20 hover:border-success/40',
                isLocked && 'bg-card border-border hover:border-border opacity-60 hover:opacity-80',
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                isComplete && 'bg-success/20 text-success',
                isCurrent && 'bg-primary/20 text-primary',
                isLocked && 'bg-muted text-muted-foreground',
              )}>
                {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    Phase {phase.num}: {phase.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{phase.description}</p>
              </div>
              <div className="shrink-0">
                {isCurrent ? (
                  <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    {phase.action} <ArrowRight className="w-4 h-4" />
                  </span>
                ) : isComplete ? (
                  <span className="text-xs text-success font-medium">Done</span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* KPIs */}
      {kpis && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">90-Day KPIs</h2>
          <StatsGrid>
            <StatCard title="Progress" value={`${kpis.progress}%`} icon={<TrendingUp className="w-4 h-4" />} />
            <StatCard title="Day" value={`${kpis.daysSinceCreation}/90`} subtitle={`${kpis.daysRemaining} days left`} icon={<Clock className="w-4 h-4" />} />
            <StatCard title="Est. Traffic" value={kpis.estimatedTraffic} subtitle="Monthly visitors" trend="up" />
            <StatCard title="Est. Leads" value={kpis.estimatedLeads} trend="up" />
          </StatsGrid>
        </div>
      )}
    </div>
  )
}
