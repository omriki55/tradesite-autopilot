'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import { Globe, Search, Check, AlertTriangle, Star } from 'lucide-react'
import { parseJson } from '@/lib/json-helpers'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

interface DomainSuggestion {
  domain: string
  score: number
  available: boolean
  tld: string
  price: number
  keywordRelevance?: number
  brandability?: number
  seoScore?: number
}

export default function DomainPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: domainData, refetch } = trpc.domain.getSuggestions.useQuery({ projectId: id })
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)

  const generateMutation = trpc.domain.generateSuggestions.useMutation({
    onSuccess: () => refetch(),
  })

  const selectMutation = trpc.domain.selectDomain.useMutation({
    onSuccess: () => refetch(),
  })

  const suggestions: DomainSuggestion[] = parseJson<DomainSuggestion[]>(domainData?.suggestions as string | null, [])

  const handleGenerate = () => {
    if (!project) return
    generateMutation.mutate({
      projectId: id,
      brandName: project.brandName,
      niche: project.niche,
      targetMarkets: parseJson<string[]>(project.targetMarkets as string, []),
    })
  }

  const handleSelect = (domain: string, score: number) => {
    setSelectedDomain(domain)
    selectMutation.mutate({ projectId: id, domain, score })
  }

  return (
    <PhaseLayout
      projectId={id}
      projectName={project?.name}
      phaseNum={1}
      title="Domain Intelligence"
      subtitle={`Find & register the perfect domain for ${project?.brandName || 'your brand'}`}
      isComplete={domainData?.status === 'REGISTERED'}
      headerAction={
        domainData?.status === 'REGISTERED' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium">
            <Check className="w-4 h-4" /> Domain Registered
          </div>
        ) : undefined
      }
    >
      {domainData?.selectedDomain && (
        <div className="bg-card border border-success/30 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Selected Domain</p>
              <p className="text-xl font-bold text-foreground">{domainData.selectedDomain}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-xl font-bold text-success">{domainData.score}/100</p>
            </div>
          </div>
        </div>
      )}

      {!suggestions.length && !generateMutation.isPending && (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Find Your Domain</h3>
          <p className="text-muted-foreground mb-4">AI will generate and score 15+ domain suggestions</p>
          <button
            onClick={handleGenerate}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90"
          >
            Generate Suggestions
          </button>
        </div>
      )}

      {generateMutation.isPending && (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">AI is analyzing and scoring domains...</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">Domain Suggestions</h2>
            <button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="text-sm text-primary hover:underline"
            >
              Regenerate
            </button>
          </div>
          {suggestions.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                selectedDomain === s.domain || domainData?.selectedDomain === s.domain
                  ? 'bg-primary/5 border-primary/30'
                  : s.available
                  ? 'bg-card border-border hover:border-primary/30'
                  : 'bg-card border-border opacity-60'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{s.domain}</span>
                  {i === 0 && <Star className="w-4 h-4 text-accent fill-accent" />}
                  {!s.available && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                      Taken
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  {s.keywordRelevance !== undefined && <span>Keywords: {s.keywordRelevance}</span>}
                  {s.brandability !== undefined && <span>Brand: {s.brandability}</span>}
                  {s.seoScore !== undefined && <span>SEO: {s.seoScore}</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-foreground">{s.score}</div>
                <div className="text-xs text-muted-foreground">score</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">${s.price}</div>
                <div className="text-xs text-muted-foreground">/year</div>
              </div>
              {s.available && domainData?.selectedDomain !== s.domain && (
                <button
                  onClick={() => handleSelect(s.domain, s.score)}
                  disabled={selectMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 whitespace-nowrap"
                >
                  Select
                </button>
              )}
              {domainData?.selectedDomain === s.domain && (
                <span className="px-4 py-2 rounded-lg bg-success/10 text-success text-sm font-medium">
                  Selected
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </PhaseLayout>
  )
}
