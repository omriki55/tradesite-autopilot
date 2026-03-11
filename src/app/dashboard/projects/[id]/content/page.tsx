'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import { BookOpen, Search, Copy, Check, Tag, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseJson } from '@/lib/json-helpers'

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '📚' },
  { id: 'compliance', label: 'Compliance', icon: '⚖️' },
  { id: 'marketing', label: 'Marketing', icon: '📢' },
  { id: 'trust', label: 'Trust', icon: '🛡️' },
  { id: 'educational', label: 'Educational', icon: '🎓' },
  { id: 'social_media', label: 'Social Media', icon: '📱' },
]

export default function ContentLibraryPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: contentBank } = trpc.social.getContentBank.useQuery({ projectId: id })
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const items = contentBank || []
  const templateItems = items.filter((item) => {
    const content = parseJson<{ text?: string; usageHint?: string }>(item.content as string, {})
    const isTemplate = item.isTemplate || !!content?.usageHint
    if (!isTemplate && activeCategory === 'all') return true
    if (!isTemplate) return item.category === activeCategory

    // Filter by category
    if (activeCategory !== 'all' && item.category !== activeCategory) return false

    // Filter by search
    if (searchQuery) {
      const lower = searchQuery.toLowerCase()
      const titleMatch = item.title?.toLowerCase().includes(lower)
      const contentMatch = (content?.text || '').toLowerCase().includes(lower)
      const tagMatch = parseJson<string[]>(item.tags as string, []).some((t) => t.includes(lower))
      return titleMatch || contentMatch || tagMatch
    }

    return true
  })

  const handleCopy = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(itemId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Dashboard</span><span>/</span>
        <span>{project?.name || 'Project'}</span><span>/</span>
        <span className="text-foreground font-medium">Content Library</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> Content Library
          </h1>
          <p className="text-muted-foreground mt-1">
            Best-practice templates and content for trading companies ({items.length} items)
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates by keyword, tag, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:bg-muted'
            )}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content grid */}
      {templateItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templateItems.map((item) => {
            const content = parseJson<{ text?: string; usageHint?: string; platforms?: string[] }>(item.content as string, {})
            const tags = parseJson<string[]>(item.tags as string, [])

            return (
              <div key={item.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">
                      {item.category}
                    </span>
                    {item.type && (
                      <span className="text-xs text-muted-foreground capitalize">{item.type.replace(/_/g, ' ')}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(content?.text || '', item.id)}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {item.title && (
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h3>
                )}

                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {content?.text || 'Content template'}
                </p>

                {content?.usageHint && (
                  <p className="text-xs text-primary/80 italic mb-2 flex items-start gap-1">
                    <FileText className="w-3 h-3 mt-0.5 shrink-0" />
                    {content.usageHint}
                  </p>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.slice(0, 5).map((tag) => (
                      <span key={tag} className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        <Tag className="w-2.5 h-2.5" />{tag}
                      </span>
                    ))}
                    {tags.length > 5 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground">+{tags.length - 5} more</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchQuery ? 'No Results' : 'Content Library Empty'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? `No templates found matching "${searchQuery}"`
              : 'Content templates will be seeded when you create a new project'
            }
          </p>
        </div>
      )}
    </div>
  )
}
