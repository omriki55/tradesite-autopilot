'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import { Calendar, Loader2, Send, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseJson } from '@/lib/json-helpers'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

const platformColors: Record<string, string> = {
  FACEBOOK: 'bg-blue-500/10 text-blue-400',
  INSTAGRAM: 'bg-pink-500/10 text-pink-400',
  TWITTER: 'bg-sky-500/10 text-sky-400',
  LINKEDIN: 'bg-blue-700/10 text-blue-300',
  YOUTUBE: 'bg-red-500/10 text-red-400',
  TIKTOK: 'bg-purple-500/10 text-purple-400',
  TELEGRAM: 'bg-cyan-500/10 text-cyan-400',
}

export default function PostingPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const [days, setDays] = useState(7)
  const today = new Date().toISOString().split('T')[0]

  const { data: posts, refetch } = trpc.posting.getCalendar.useQuery({
    projectId: id,
    startDate: today,
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  })
  const { data: stats } = trpc.posting.getStats.useQuery({ projectId: id })

  const generateMutation = trpc.posting.generatePosts.useMutation({ onSuccess: () => refetch() })
  const publishMutation = trpc.posting.publishPost.useMutation({ onSuccess: () => refetch() })

  // Group posts by date
  const grouped = (posts || []).reduce((acc, post) => {
    const date = new Date(post.scheduledAt).toLocaleDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(post)
    return acc
  }, {} as Record<string, typeof posts>)

  return (
    <PhaseLayout
      projectId={id}
      projectName={project?.name}
      phaseNum={6}
      title="Daily Posting"
      subtitle="Automated content publishing across all platforms"
    >
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Posts</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-success">{stats.published}</p>
            <p className="text-xs text-muted-foreground">Published</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.scheduled}</p>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{stats.draft}</p>
            <p className="text-xs text-muted-foreground">Drafts</p>
          </div>
        </div>
      )}

      {/* Generate controls */}
      <div className="flex items-center gap-3 mb-6">
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm"
        >
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
        </select>
        <button
          onClick={() => generateMutation.mutate({ projectId: id, startDate: today, days })}
          disabled={generateMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {generateMutation.isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating {days * 7} posts...</>
          ) : (
            <><Calendar className="w-4 h-4" /> Generate {days} Days</>
          )}
        </button>
      </div>

      {/* Calendar view */}
      {Object.keys(grouped).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(grouped).slice(0, 14).map(([date, datePosts]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
              <div className="space-y-2">
                {datePosts!.map((post) => (
                  <div key={post.id} className="bg-card border border-border rounded-lg p-4 flex items-start gap-3">
                    <span className={cn('px-2 py-1 rounded text-xs font-medium', platformColors[post.platform] || 'bg-muted text-muted-foreground')}>
                      {post.platform}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground capitalize">{post.postType.replace('_', ' ')}</span>
                        <span className="text-xs text-muted-foreground">&middot;</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {(() => {
                          const tags = parseJson<string[]>(post.hashtags as string, [])
                          return tags.length > 0 ? (
                            <span className="text-xs text-primary">{tags.slice(0, 3).join(' ')}</span>
                          ) : null
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.status === 'PUBLISHED' ? (
                        <span className="text-xs text-success flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          {parseJson<{ likes?: number }>(post.engagementData as string | null, {}).likes || 0} likes
                        </span>
                      ) : (
                        <button
                          onClick={() => publishMutation.mutate({ postId: post.id })}
                          disabled={publishMutation.isPending}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-success/10 text-success text-xs font-medium hover:bg-success/20"
                        >
                          <Send className="w-3 h-3" /> Publish
                        </button>
                      )}
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded capitalize',
                        post.status === 'PUBLISHED' ? 'bg-success/10 text-success' :
                        post.status === 'SCHEDULED' ? 'bg-primary/10 text-primary' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {post.status.toLowerCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Posts Scheduled</h3>
          <p className="text-muted-foreground">Generate posts to fill your content calendar</p>
        </div>
      )}
    </PhaseLayout>
  )
}
