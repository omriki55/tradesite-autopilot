'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const phases = [
  { num: 1, label: 'Domain', href: 'domain' },
  { num: 2, label: 'Website', href: 'website' },
  { num: 3, label: 'SEO', href: 'seo' },
  { num: 4, label: 'Social', href: 'social' },
  { num: 5, label: 'Posting', href: 'posting' },
  { num: 6, label: 'Timeline', href: 'timeline' },
]

interface PhaseLayoutProps {
  projectId: string
  projectName?: string
  phaseNum: number
  title: string
  subtitle: string
  isComplete?: boolean
  headerAction?: React.ReactNode
  children: React.ReactNode
}

export function PhaseLayout({
  projectId,
  projectName,
  phaseNum,
  title,
  subtitle,
  isComplete,
  headerAction,
  children,
}: PhaseLayoutProps) {
  const prevPhase = phases[phaseNum - 2]
  const nextPhase = phases[phaseNum]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href={`/dashboard/projects/${projectId}`} className="hover:text-foreground transition-colors">
          {projectName || 'Project'}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Phase {phaseNum}</span>
      </div>

      {/* Phase header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {isComplete && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                <Check className="w-3 h-3" /> Complete
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
        {headerAction}
      </div>

      {/* Content */}
      <div className="mb-8">
        {children}
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        {prevPhase ? (
          <Link
            href={`/dashboard/projects/${projectId}/${prevPhase.href}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Phase {prevPhase.num}: {prevPhase.label}
          </Link>
        ) : (
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Overview
          </Link>
        )}
        {nextPhase ? (
          <Link
            href={`/dashboard/projects/${projectId}/${nextPhase.href}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Phase {nextPhase.num}: {nextPhase.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Back to Overview
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
