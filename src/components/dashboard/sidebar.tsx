'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { trpc } from '@/trpc/client'
import {
  LayoutDashboard,
  FolderPlus,
  Settings,
  LogOut,
  Globe,
  Layout,
  Search,
  Share2,
  Calendar,
  Flag,
  Rocket,
  ChevronLeft,
  Check,
  BookOpen,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mainNav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/projects/new', label: 'New Project', icon: FolderPlus },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const phases = [
  { num: 1, label: 'Domain', icon: Globe, href: 'domain' },
  { num: 2, label: 'Website', icon: Layout, href: 'website' },
  { num: 3, label: 'SEO & GEO', icon: Search, href: 'seo' },
  { num: 4, label: 'Social Media', icon: Share2, href: 'social' },
  { num: 5, label: 'Daily Posting', icon: Calendar, href: 'posting' },
  { num: 6, label: 'Timeline', icon: Flag, href: 'timeline' },
]

const extraPages = [
  { label: 'Content Library', icon: BookOpen, href: 'content' },
  { label: 'Analytics', icon: BarChart3, href: 'analytics' },
]

export function Sidebar() {
  const pathname = usePathname()
  const params = useParams()
  const projectId = params?.id as string | undefined

  // Only fetch project data when we're inside a project page
  const isProjectPage = pathname.includes('/dashboard/projects/') && projectId && projectId !== 'new'
  const { data: project } = trpc.project.getById.useQuery(
    { id: projectId! },
    { enabled: !!isProjectPage }
  )

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Rocket className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg text-foreground">Tradesite</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">Autopilot Platform</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {isProjectPage && project ? (
          <>
            {/* Back to dashboard */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mb-1"
            >
              <ChevronLeft className="w-4 h-4" />
              All Projects
            </Link>

            {/* Project name + overview link */}
            <Link
              href={`/dashboard/projects/${projectId}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors mb-3',
                pathname === `/dashboard/projects/${projectId}`
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Rocket className="w-4 h-4" />
              {project.name}
            </Link>

            {/* Phase navigation */}
            <div className="px-3 mb-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Phases</p>
            </div>
            <div className="space-y-0.5">
              {phases.map((phase) => {
                const Icon = phase.icon
                const phaseHref = `/dashboard/projects/${projectId}/${phase.href}`
                const isActive = pathname === phaseHref
                const isComplete = phase.num < project.currentPhase
                const isCurrent = phase.num === project.currentPhase

                return (
                  <Link
                    key={phase.num}
                    href={phaseHref}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      isComplete ? 'bg-success/20 text-success' :
                      isCurrent ? 'bg-primary/20 text-primary' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {isComplete ? <Check className="w-3 h-3" /> : phase.num}
                    </div>
                    <span className="truncate">{phase.label}</span>
                    {isCurrent && !isActive && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        Current
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Extra pages */}
            <div className="px-3 mt-4 mb-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Tools</p>
            </div>
            <div className="space-y-0.5">
              {extraPages.map((page) => {
                const Icon = page.icon
                const pageHref = `/dashboard/projects/${projectId}/${page.href}`
                const isActive = pathname === pageHref

                return (
                  <Link
                    key={page.href}
                    href={pageHref}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{page.label}</span>
                  </Link>
                )
              })}
            </div>
          </>
        ) : (
          <div className="space-y-0.5">
            {mainNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
