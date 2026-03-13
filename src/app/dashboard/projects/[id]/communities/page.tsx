'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import {
  Users, Plus, MessageCircle, Loader2, Send, Calendar, Trash2, Hash, CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

const platformIcons: Record<string, React.ReactNode> = {
  whatsapp_group: <MessageCircle className="w-5 h-5 text-emerald-400" />,
  youtube_community: <span className="text-lg">🎥</span>,
  telegram: <Hash className="w-5 h-5 text-blue-400" />,
}

const statusColors: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  creating: 'bg-yellow-500/20 text-yellow-400',
  active: 'bg-green-500/20 text-green-400',
  paused: 'bg-muted text-muted-foreground',
}

const postStatusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  approved: 'bg-blue-500/20 text-blue-400',
  scheduled: 'bg-purple-500/20 text-purple-400',
  published: 'bg-green-500/20 text-green-400',
}

export default function CommunitiesPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: stats } = trpc.communities.getStats.useQuery({ projectId: id })
  const { data: communities, refetch: refetchCommunities } = trpc.communities.list.useQuery({ projectId: id })
  const { data: posts, refetch: refetchPosts } = trpc.communities.listPosts.useQuery({ projectId: id })

  const [showAdd, setShowAdd] = useState(false)
  const [showPostForm, setShowPostForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newBrand, setNewBrand] = useState('')
  const [newType, setNewType] = useState<'whatsapp_group' | 'youtube_community' | 'telegram'>('whatsapp_group')
  const [newUrl, setNewUrl] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postDate, setPostDate] = useState(new Date().toISOString().split('T')[0])
  const [postCommunityId, setPostCommunityId] = useState('')

  const createMutation = trpc.communities.create.useMutation({
    onSuccess: () => { refetchCommunities(); setShowAdd(false); setNewName(''); setNewBrand(''); setNewUrl('') },
  })
  const deleteMutation = trpc.communities.delete.useMutation({ onSuccess: () => refetchCommunities() })
  const schedulePostMutation = trpc.communities.schedulePost.useMutation({
    onSuccess: () => { refetchPosts(); setShowPostForm(false); setPostContent('') },
  })
  const approvePostMutation = trpc.communities.approvePost.useMutation({ onSuccess: () => refetchPosts() })
  const markSentMutation = trpc.communities.markPostSent.useMutation({ onSuccess: () => refetchPosts() })
  const generatePostMutation = trpc.communities.generatePost.useMutation({
    onSuccess: (data) => setPostContent(data.content),
  })

  const selectedCommunity = communities?.find(c => c.id === postCommunityId)

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Communities" subtitle="Manage WhatsApp groups, YouTube communities, and Telegram channels per brand">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Communities', value: stats?.total || 0, color: 'text-foreground' },
          { label: 'Active', value: stats?.active || 0, color: 'text-green-400' },
          { label: 'Total Members', value: (stats?.totalMembers || 0).toLocaleString(), color: 'text-emerald-400' },
          { label: 'Posts in Queue', value: stats?.queuedPosts || 0, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Add Community */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Communities</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Community
        </button>
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Community Name" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="text" value={newBrand} onChange={e => setNewBrand(e.target.value)} placeholder="Brand Name" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <select value={newType} onChange={e => setNewType(e.target.value as typeof newType)} className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="whatsapp_group">WhatsApp Group</option>
              <option value="youtube_community">YouTube Community</option>
              <option value="telegram">Telegram Channel</option>
            </select>
            <input type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="Invite Link (optional)" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => newName && newBrand && createMutation.mutate({ projectId: id, name: newName, brandName: newBrand, type: newType, url: newUrl || undefined })} disabled={!newName || !newBrand || createMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {/* Communities list */}
      {!communities?.length ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl mb-6">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Communities Yet</h3>
          <p className="text-muted-foreground">Add your first WhatsApp group, YouTube channel, or Telegram community</p>
        </div>
      ) : (
        <div className="grid gap-3 mb-6">
          {communities.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', c.type === 'whatsapp_group' ? 'bg-emerald-500/10' : c.type === 'youtube_community' ? 'bg-red-500/10' : 'bg-blue-500/10')}>
                  {platformIcons[c.type]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-foreground">{c.name}</span>
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', statusColors[c.status])}>{c.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{c.brandName}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.membersCount} members</span>
                    <span>{c._count.posts} posts</span>
                  </div>
                </div>
                <button onClick={() => deleteMutation.mutate({ id: c.id })} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Queue */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Content Queue</h2>
        <button onClick={() => setShowPostForm(!showPostForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">
          <Plus className="w-4 h-4" /> Schedule Post
        </button>
      </div>

      {showPostForm && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <select value={postCommunityId} onChange={e => setPostCommunityId(e.target.value)} className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select community...</option>
              {communities?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="date" value={postDate} onChange={e => setPostDate(e.target.value)} className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground">Post Content</label>
            <button onClick={() => selectedCommunity && generatePostMutation.mutate({ niche: project?.niche?.replace('_', ' ') || 'trading', platform: selectedCommunity.type, brand: selectedCommunity.brandName })} disabled={!postCommunityId || generatePostMutation.isPending} className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs text-primary hover:bg-primary/10">
              {generatePostMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : '✨'} AI Generate
            </button>
          </div>
          <textarea value={postContent} onChange={e => setPostContent(e.target.value)} placeholder="Write your post..." rows={3} className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3" />
          <div className="flex gap-2">
            <button onClick={() => postContent && postCommunityId && schedulePostMutation.mutate({ communityId: postCommunityId, content: postContent, platform: selectedCommunity?.type || 'whatsapp_group', scheduledDate: postDate })} disabled={!postContent || !postCommunityId || schedulePostMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {schedulePostMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Schedule'}
            </button>
            <button onClick={() => setShowPostForm(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {!posts?.length ? (
        <div className="text-center py-10 bg-card border border-border rounded-xl">
          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No posts scheduled yet</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {posts.map(post => (
            <div key={post.id} className={cn('bg-card border border-border rounded-xl p-4', post.status === 'published' && 'opacity-50')}>
              <div className="flex items-start gap-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mt-0.5', post.community.type === 'whatsapp_group' ? 'bg-emerald-500/10' : post.community.type === 'youtube_community' ? 'bg-red-500/10' : 'bg-blue-500/10')}>
                  {platformIcons[post.community.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{post.scheduledAt ? new Date(post.scheduledAt).toLocaleDateString() : '—'}</span>
                    <span className="text-xs text-muted-foreground">{post.community.name}</span>
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', postStatusColors[post.status])}>{post.status}</span>
                  </div>
                  <p className="text-sm text-foreground/90 line-clamp-2">{post.content}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {post.status === 'draft' && (
                    <button onClick={() => approvePostMutation.mutate({ id: post.id })} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted">
                      <CheckCircle2 className="w-3 h-3" /> Approve
                    </button>
                  )}
                  {post.status === 'approved' && (
                    <button onClick={() => markSentMutation.mutate({ id: post.id })} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700">
                      <Send className="w-3 h-3" /> Publish
                    </button>
                  )}
                  {post.status === 'published' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PhaseLayout>
  )
}
