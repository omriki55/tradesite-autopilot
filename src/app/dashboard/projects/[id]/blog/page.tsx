'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import { FileText, Plus, Sparkles, Loader2, Eye, Trash2, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

export default function BlogPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: posts, refetch } = trpc.blog.list.useQuery({ projectId: id })
  const { data: categories } = trpc.blog.getCategories.useQuery({ projectId: id })

  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [aiTopic, setAiTopic] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [selectedPost, setSelectedPost] = useState<string | null>(null)

  const createMutation = trpc.blog.create.useMutation({ onSuccess: () => { refetch(); setShowCreate(false); setTitle(''); setContent('') } })
  const generateMutation = trpc.blog.generateWithAI.useMutation({ onSuccess: () => { refetch(); setAiTopic('') } })
  const deleteMutation = trpc.blog.delete.useMutation({ onSuccess: () => refetch() })
  const updateMutation = trpc.blog.update.useMutation({ onSuccess: () => refetch() })

  const { data: postDetail } = trpc.blog.getById.useQuery(
    { id: selectedPost! },
    { enabled: !!selectedPost }
  )

  const filteredPosts = posts?.filter(p => !filterStatus || p.status === filterStatus)

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Blog CMS" subtitle="Create and manage blog posts for your trading website">
      {/* AI Generate */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">AI Blog Writer</h2>
            <p className="text-xs text-muted-foreground">Generate a full blog post from a topic</p>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="e.g., Top 5 Forex Trading Strategies for Beginners"
            className="flex-1 px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={() => aiTopic && generateMutation.mutate({ projectId: id, topic: aiTopic })}
            disabled={!aiTopic || generateMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {generateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {['', 'draft', 'published', 'scheduled'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filterStatus === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
              {s || 'All'}
            </button>
          ))}
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Create New Post</h3>
          <div className="space-y-4">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="general">General</option>
              <option value="market_analysis">Market Analysis</option>
              <option value="education">Education</option>
              <option value="news">News</option>
              <option value="strategy">Strategy</option>
            </select>
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your post content (supports markdown)..." rows={8} className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
            <div className="flex gap-2">
              <button onClick={() => title && content && createMutation.mutate({ projectId: id, title, content, category, status: 'draft' })} disabled={!title || !content || createMutation.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {createMutation.isPending ? 'Saving...' : 'Save Draft'}
              </button>
              <button onClick={() => title && content && createMutation.mutate({ projectId: id, title, content, category, status: 'published' })} disabled={!title || !content} className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No blog posts yet. Generate one with AI or create manually.</p>
          </div>
        )}
        {filteredPosts?.map(post => (
          <div key={post.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between group hover:border-primary/30 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground truncate">{post.title}</h3>
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', post.status === 'published' ? 'bg-success/20 text-success' : post.status === 'scheduled' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground')}>
                  {post.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{post.category}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                {post.excerpt && <span className="truncate max-w-[300px]">{post.excerpt}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setSelectedPost(post.id)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
              {post.status === 'draft' && (
                <button onClick={() => updateMutation.mutate({ id: post.id, status: 'published' })} className="px-3 py-1.5 rounded-lg bg-success/20 text-success text-xs font-medium hover:bg-success/30">Publish</button>
              )}
              <button onClick={() => deleteMutation.mutate({ id: post.id })} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Preview Modal */}
      {selectedPost && postDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPost(null)}>
          <div className="bg-card border border-border rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-foreground mb-2">{postDetail.title}</h2>
            <div className="flex gap-2 mb-4 text-xs text-muted-foreground">
              <span>{postDetail.category}</span>
              <span>|</span>
              <span>{postDetail.author}</span>
              <span>|</span>
              <span>{new Date(postDetail.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{postDetail.content}</div>
            <button onClick={() => setSelectedPost(null)} className="mt-4 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted">Close</button>
          </div>
        </div>
      )}
    </PhaseLayout>
  )
}
