'use client'

import Link from 'next/link'
import { Globe, Layout, BarChart3, Users, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProjectCardProps {
  id: string
  name: string
  brandName: string
  niche: string
  status: string
  currentPhase: number
  domain?: { selectedDomain: string | null; status: string } | null
  website?: { status: string; deployUrl: string | null } | null
  seoConfig?: { seoScore: number | null; status: string } | null
  _count?: { socialProfiles: number; socialPosts: number }
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-muted-foreground/20 text-muted-foreground',
  ACTIVE: 'bg-primary/20 text-primary',
  PAUSED: 'bg-accent/20 text-accent',
  COMPLETED: 'bg-success/20 text-success',
}

const nicheLabels: Record<string, string> = {
  forex_broker: 'Forex Broker',
  crypto_exchange: 'Crypto Exchange',
  prop_trading: 'Prop Trading',
  commodities_broker: 'Commodities Broker',
  investment_fund: 'Investment Fund',
  copy_trading: 'Copy Trading',
}

const phaseNames = ['Domain', 'Website', 'SEO', 'Social', 'Posting', 'Timeline']

export function ProjectCard({ id, name, brandName, niche, status, currentPhase, domain, website, seoConfig, _count }: ProjectCardProps) {
  const progressPercent = Math.round(((currentPhase - 1) / 6) * 100)

  return (
    <Link
      href={`/dashboard/projects/${id}`}
      className="block bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{brandName} &middot; {nicheLabels[niche] || niche}</p>
        </div>
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', statusColors[status] || statusColors.DRAFT)}>
          {status}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">Phase {currentPhase}: {phaseNames[currentPhase - 1] || 'Done'}</span>
          <span className="text-xs font-medium text-primary">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {phaseNames.map((pName, i) => (
            <span
              key={pName}
              className={cn(
                'text-[10px]',
                i + 1 < currentPhase ? 'text-success' : i + 1 === currentPhase ? 'text-primary' : 'text-muted-foreground/50'
              )}
            >
              {pName}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Globe className="w-3 h-3" />
          <span>{domain?.selectedDomain ? 'Set' : 'Pending'}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Layout className="w-3 h-3" />
          <span>{website?.status === 'DEPLOYED' ? 'Live' : website?.status || 'Pending'}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <BarChart3 className="w-3 h-3" />
          <span>SEO: {seoConfig?.seoScore || '--'}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{_count?.socialProfiles || 0} profiles</span>
        </div>
      </div>
    </Link>
  )
}

export function ProjectListTable({ projects }: { projects: ProjectCardProps[] }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Website</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Domain</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Progress</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">SEO</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Social</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Posts</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const progressPercent = Math.round(((project.currentPhase - 1) / 6) * 100)
            return (
              <tr key={project.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/dashboard/projects/${project.id}`} className="hover:text-primary transition-colors">
                    <div className="font-medium text-foreground">{project.name}</div>
                    <div className="text-xs text-muted-foreground">{project.brandName} &middot; {nicheLabels[project.niche] || project.niche}</div>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {project.domain?.selectedDomain ? (
                    <span className="text-foreground flex items-center gap-1">
                      {project.domain.selectedDomain}
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[project.status] || statusColors.DRAFT)}>
                    {project.status}
                  </span>
                </td>
                <td className="px-4 py-3 min-w-[160px]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{progressPercent}% &middot; Phase {project.currentPhase}/6</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'text-xs font-medium',
                    (project.seoConfig?.seoScore || 0) >= 80 ? 'text-success' :
                    (project.seoConfig?.seoScore || 0) >= 50 ? 'text-accent' : 'text-muted-foreground'
                  )}>
                    {project.seoConfig?.seoScore || '--'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {project._count?.socialProfiles || 0}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {project._count?.socialPosts || 0}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
