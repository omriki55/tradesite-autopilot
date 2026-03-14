'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import {
  Rss, Plus, ExternalLink, Trash2, FileText, Link2, Globe, BarChart3,
  CheckCircle2, Clock, Send, Eye, Loader2, ArrowUpRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

interface BlogSite {
  id: string
  name: string
  url: string
  da: number
  niche: string
  status: 'active' | 'pending' | 'paused'
  articlesPublished: number
  totalTraffic: string
  lastPublished: string
}

interface ArticleLink {
  id: string
  title: string
  blogSite: string
  targetDomain: string
  anchorText: string
  status: 'published' | 'scheduled' | 'draft'
  publishDate: string
  url?: string
}

const sampleBlogs: BlogSite[] = [
  { id: '1', name: 'Trading Insights Daily', url: 'tradinginsightsdaily.com', da: 35, niche: 'Forex', status: 'active', articlesPublished: 24, totalTraffic: '12K/mo', lastPublished: '2025-03-10' },
  { id: '2', name: 'Crypto Market Review', url: 'cryptomarketreview.net', da: 28, niche: 'Crypto', status: 'active', articlesPublished: 18, totalTraffic: '8K/mo', lastPublished: '2025-03-08' },
  { id: '3', name: 'Investment Hub Blog', url: 'investmenthub-blog.com', da: 32, niche: 'Investment', status: 'active', articlesPublished: 21, totalTraffic: '10K/mo', lastPublished: '2025-03-12' },
  { id: '4', name: 'Finance Education Pro', url: 'financeeducationpro.com', da: 26, niche: 'Education', status: 'pending', articlesPublished: 8, totalTraffic: '3K/mo', lastPublished: '2025-02-28' },
  { id: '5', name: 'Global Trading News', url: 'globaltradingnews.org', da: 38, niche: 'Multi-Asset', status: 'active', articlesPublished: 31, totalTraffic: '18K/mo', lastPublished: '2025-03-13' },
]

const sampleLinks: ArticleLink[] = [
  { id: '1', title: 'Top 10 Forex Strategies for 2025', blogSite: 'Trading Insights Daily', targetDomain: 'tradepro-fx.com', anchorText: 'forex trading platform', status: 'published', publishDate: '2025-03-10', url: '#' },
  { id: '2', title: 'Understanding Cryptocurrency Exchanges', blogSite: 'Crypto Market Review', targetDomain: 'cryptovault-io.com', anchorText: 'crypto exchange', status: 'published', publishDate: '2025-03-08', url: '#' },
  { id: '3', title: 'Best Investment Apps Compared', blogSite: 'Investment Hub Blog', targetDomain: 'investnow-hub.com', anchorText: 'investment platform', status: 'scheduled', publishDate: '2025-03-15' },
  { id: '4', title: 'How to Start Stock Trading', blogSite: 'Global Trading News', targetDomain: 'stockedge-pro.com', anchorText: 'stock trading app', status: 'published', publishDate: '2025-03-12', url: '#' },
  { id: '5', title: 'Forex vs Crypto: Which to Trade', blogSite: 'Finance Education Pro', targetDomain: 'alphatrade-zone.com', anchorText: 'multi-asset broker', status: 'draft', publishDate: '2025-03-18' },
]

const statusColors: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  paused: 'bg-muted text-muted-foreground',
  published: 'bg-green-500/20 text-green-400',
  scheduled: 'bg-purple-500/20 text-purple-400',
  draft: 'bg-muted text-muted-foreground',
}

export default function BlogNetworkPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const [blogs] = useState(sampleBlogs)
  const [links] = useState(sampleLinks)
  const [view, setView] = useState<'blogs' | 'articles'>('blogs')

  const totalArticles = blogs.reduce((s, b) => s + b.articlesPublished, 0)

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Blog Network" subtitle="Own and manage a network of niche blog properties for SEO distribution and internal link injection">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Blog Sites', value: blogs.length, color: 'text-foreground' },
          { label: 'Active', value: blogs.filter(b => b.status === 'active').length, color: 'text-green-400' },
          { label: 'Articles Published', value: totalArticles, color: 'text-blue-400' },
          { label: 'Avg. DA', value: Math.round(blogs.reduce((s, b) => s + b.da, 0) / blogs.length), color: 'text-purple-400' },
          { label: 'Link Placements', value: links.filter(l => l.status === 'published').length, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {(['blogs', 'articles'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-colors', view === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
              {v === 'blogs' ? 'Blog Sites' : 'Article Links'}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> {view === 'blogs' ? 'Add Blog Site' : 'Create Article'}
        </button>
      </div>

      {view === 'blogs' ? (
        <div className="grid gap-3">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Rss className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-foreground">{blog.name}</span>
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', statusColors[blog.status])}>{blog.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {blog.url}</span>
                    <span>DA: {blog.da}</span>
                    <span>{blog.niche}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{blog.articlesPublished}</p>
                    <p>Articles</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{blog.totalTraffic}</p>
                    <p>Traffic</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Article</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Blog Site</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Target Domain</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Anchor Text</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {links.map(link => (
                <tr key={link.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{link.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{link.blogSite}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-sm text-primary"><Link2 className="w-3 h-3" /> {link.targetDomain}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground italic">&quot;{link.anchorText}&quot;</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', statusColors[link.status])}>{link.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{link.publishDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* How It Works */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {[
          { icon: <FileText className="w-5 h-5 text-blue-400" />, title: 'Content Creation', desc: '5 keyword-optimized articles per domain' },
          { icon: <Rss className="w-5 h-5 text-orange-400" />, title: 'Blog Network', desc: 'Publish on our own blog properties' },
          { icon: <Link2 className="w-5 h-5 text-purple-400" />, title: 'Internal Links', desc: 'Inject target anchor texts' },
          { icon: <BarChart3 className="w-5 h-5 text-green-400" />, title: 'Topical Clustering', desc: 'Group by topic for authority' },
        ].map(step => (
          <div key={step.title} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">{step.icon}</div>
            <p className="text-sm font-medium text-foreground mb-1">{step.title}</p>
            <p className="text-xs text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>
    </PhaseLayout>
  )
}
