'use client'

import { useState } from 'react'
import { trpc } from '@/trpc/client'
import { ProjectCard, ProjectListTable } from '@/components/dashboard/project-card'
import { StatsGrid, StatCard } from '@/components/dashboard/stats-cards'
import { FolderPlus, Rocket, Globe, BarChart3, LayoutGrid, List } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { data: projects, isLoading } = trpc.project.list.useQuery()
  const [view, setView] = useState<'grid' | 'list'>('list')

  const activeCount = projects?.filter((p) => p.status === 'ACTIVE').length || 0
  const totalPosts = projects?.reduce((sum, p) => sum + (p._count?.socialPosts || 0), 0) || 0

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Manage your trading company websites</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          <FolderPlus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      <StatsGrid>
        <StatCard title="Total Projects" value={projects?.length || 0} icon={<Rocket className="w-4 h-4" />} />
        <StatCard title="Active Projects" value={activeCount} icon={<Globe className="w-4 h-4" />} subtitle="Currently running" />
        <StatCard title="Total Posts" value={totalPosts} icon={<BarChart3 className="w-4 h-4" />} subtitle="Across all projects" />
        <StatCard title="Avg. SEO Score" value={
          projects?.length
            ? Math.round(projects.reduce((sum, p) => sum + (p.seoConfig?.seoScore || 0), 0) / projects.length)
            : '--'
        } />
      </StatsGrid>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Websites</h2>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setView('list')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                view === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('grid')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                view === 'grid' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Loading projects...</div>
        ) : !projects?.length ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <Rocket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No websites yet</h3>
            <p className="text-muted-foreground mb-4">Create your first trading company website</p>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90"
            >
              <FolderPlus className="w-4 h-4" />
              Create Project
            </Link>
          </div>
        ) : view === 'list' ? (
          <ProjectListTable projects={projects} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
