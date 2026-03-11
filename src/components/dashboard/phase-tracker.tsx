'use client'

import { cn } from '@/lib/utils'
import { Globe, Layout, Search, Share2, Calendar, Flag } from 'lucide-react'
import Link from 'next/link'

const phases = [
  { num: 1, label: 'Domain', icon: Globe, href: 'domain' },
  { num: 2, label: 'Website', icon: Layout, href: 'website' },
  { num: 3, label: 'SEO', icon: Search, href: 'seo' },
  { num: 4, label: 'Social', icon: Share2, href: 'social' },
  { num: 5, label: 'Posting', icon: Calendar, href: 'posting' },
  { num: 6, label: 'Timeline', icon: Flag, href: 'timeline' },
]

export function PhaseTracker({ currentPhase, projectId }: { currentPhase: number; projectId: string }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {phases.map((phase, i) => {
        const Icon = phase.icon
        const isActive = phase.num === currentPhase
        const isComplete = phase.num < currentPhase
        return (
          <div key={phase.num} className="flex items-center">
            <Link
              href={`/dashboard/projects/${projectId}/${phase.href}`}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                isActive && 'bg-primary text-primary-foreground',
                isComplete && 'bg-success/10 text-success',
                !isActive && !isComplete && 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>Phase {phase.num}: {phase.label}</span>
            </Link>
            {i < phases.length - 1 && (
              <div className={cn('w-8 h-0.5 mx-1', isComplete ? 'bg-success' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
