'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { BarChart3, TrendingUp, Users, Target, Globe, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function MiniChart({ data, color = 'primary' }: { data: number[]; color?: string }) {
  if (!data.length) return null
  const max = Math.max(...data, 1)
  const colorClass = color === 'success' ? 'bg-success' : color === 'warning' ? 'bg-yellow-500' : 'bg-primary'

  return (
    <div className="flex items-end gap-px h-10">
      {data.slice(-14).map((val, i) => (
        <div
          key={i}
          className={cn('flex-1 rounded-t-sm min-w-[3px]', colorClass)}
          style={{ height: `${Math.max((val / max) * 100, 4)}%`, opacity: 0.4 + (i / data.length) * 0.6 }}
        />
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: dashboard } = trpc.analytics.getDashboard.useQuery({ projectId: id })
  const { data: trafficData } = trpc.analytics.getTrafficData.useQuery({ projectId: id, days: 30 })
  const { data: socialMetrics } = trpc.analytics.getSocialMetrics.useQuery({ projectId: id })
  const seedMutation = trpc.analytics.seedMockData.useMutation({
    onSuccess: () => {
      window.location.reload()
    },
  })

  const platformIcons: Record<string, string> = {
    FACEBOOK: '📘', INSTAGRAM: '📸', TWITTER: '🐦', LINKEDIN: '💼',
    YOUTUBE: '🎥', TIKTOK: '🎵', TELEGRAM: '✈️',
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Dashboard</span><span>/</span>
        <span>{project?.name || 'Project'}</span><span>/</span>
        <span className="text-foreground font-medium">Analytics</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6" /> Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Track your website traffic, SEO performance, and social metrics</p>
        </div>
        {!dashboard?.hasData && (
          <button
            onClick={() => seedMutation.mutate({ projectId: id })}
            disabled={seedMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {seedMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
            Generate Mock Data
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-medium">Total Traffic</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{dashboard?.totalTraffic?.toLocaleString() || '—'}</p>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          {trafficData && <MiniChart data={trafficData.map((d) => d.traffic)} />}
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium">Total Leads</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{dashboard?.totalLeads?.toLocaleString() || '—'}</p>
          <p className="text-xs text-muted-foreground mt-1">Conversions</p>
          {trafficData && <MiniChart data={trafficData.map((d) => d.leads)} color="success" />}
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Keywords Ranked</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{dashboard?.avgKeywords || '—'}</p>
          <p className="text-xs text-muted-foreground mt-1">Avg. position</p>
          {trafficData && <MiniChart data={trafficData.map((d) => d.keywords)} color="warning" />}
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Social Followers</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{dashboard?.totalFollowers?.toLocaleString() || '—'}</p>
          <p className="text-xs text-muted-foreground mt-1">Across platforms</p>
          {trafficData && <MiniChart data={trafficData.map((d) => d.followers)} />}
        </div>
      </div>

      {/* Traffic Chart (table view) */}
      {trafficData && trafficData.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Daily Traffic (Last 30 Days)</h2>
          <div className="flex items-end gap-1 h-40">
            {trafficData.map((day, i) => {
              const maxTraffic = Math.max(...trafficData.map((d) => d.traffic), 1)
              const height = (day.traffic / maxTraffic) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  <div
                    className="w-full bg-primary/80 rounded-t-sm hover:bg-primary transition-colors cursor-default min-h-[2px]"
                    style={{ height: `${Math.max(height, 1)}%` }}
                  />
                  <div className="absolute -top-8 bg-card border border-border rounded px-2 py-1 text-xs hidden group-hover:block whitespace-nowrap z-10">
                    {day.date}: {day.traffic} visits
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>{trafficData[0]?.date}</span>
            <span>{trafficData[trafficData.length - 1]?.date}</span>
          </div>
        </div>
      )}

      {/* Social Media Metrics */}
      {socialMetrics && socialMetrics.platforms.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Social Media Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {socialMetrics.platforms.map((platform) => (
              <div key={platform.platform} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <span className="text-2xl">{platformIcons[platform.platform] || '🌐'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{platform.platform}</span>
                    {platform.connected && (
                      <span className="w-2 h-2 rounded-full bg-success" title="Connected" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">@{platform.username || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{platform.postCount}</p>
                  <p className="text-[10px] text-muted-foreground">posts</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{platform.totalEngagement}</p>
                  <p className="text-[10px] text-muted-foreground">engagements</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">Total Posts</span>
              <p className="text-lg font-bold text-foreground">{socialMetrics.totalPosts}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Total Engagement</span>
              <p className="text-lg font-bold text-foreground">{socialMetrics.totalEngagement.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Conversion Funnel */}
      {dashboard?.hasData && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Conversion Funnel</h2>
          <div className="space-y-3">
            {[
              { label: 'Website Visitors', value: dashboard.totalTraffic, color: 'bg-primary', width: 100 },
              { label: 'Engaged Users', value: Math.round(dashboard.totalTraffic * 0.35), color: 'bg-primary/80', width: 35 },
              { label: 'Lead Captures', value: dashboard.totalLeads, color: 'bg-primary/60', width: Math.max((dashboard.totalLeads / Math.max(dashboard.totalTraffic, 1)) * 100 * 10, 5) },
              { label: 'Account Signups', value: Math.round(dashboard.totalLeads * 0.4), color: 'bg-success', width: Math.max((dashboard.totalLeads * 0.4 / Math.max(dashboard.totalTraffic, 1)) * 100 * 10, 3) },
            ].map((step) => (
              <div key={step.label} className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-36 shrink-0">{step.label}</span>
                <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className={cn('h-full rounded-lg flex items-center justify-end pr-3', step.color)}
                    style={{ width: `${Math.min(step.width, 100)}%` }}
                  >
                    <span className="text-xs font-bold text-white">{step.value.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!dashboard?.hasData && !seedMutation.isPending && (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Analytics Data</h3>
          <p className="text-muted-foreground mb-4">Generate mock analytics data to see your dashboard</p>
        </div>
      )}
    </div>
  )
}
