'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import { Search, BarChart3, Globe2, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseJson } from '@/lib/json-helpers'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

interface Keyword {
  keyword: string
  volume: number
  difficulty: number
  intent: string
  mappedPage?: string
}

interface AuditData {
  coreWebVitals: { lcp: number; fid: number; cls: number; score: number }
  mobileScore: number
  pageSpeed: { mobile: number; desktop: number }
  issues: Array<{ type: string; message: string; count: number }>
  sslValid: boolean
  robotsTxt: boolean
  sitemapFound: boolean
  canonicalTags: boolean
  structuredData: boolean
}

export default function SeoPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: seoConfig, refetch } = trpc.seo.get.useQuery({ projectId: id })
  const [activeTab, setActiveTab] = useState<'keywords' | 'audit' | 'geo'>('keywords')

  const keywordMutation = trpc.seo.generateKeywords.useMutation({ onSuccess: () => refetch() })
  const auditMutation = trpc.seo.runAudit.useMutation({ onSuccess: () => refetch() })
  const metaMutation = trpc.seo.generateMeta.useMutation()
  const geoMutation = trpc.seo.generateGeoPages.useMutation({ onSuccess: () => refetch() })

  const keywords: Keyword[] = parseJson<Keyword[]>(seoConfig?.keywords as string | null, [])
  const audit = parseJson<AuditData | null>(seoConfig?.technicalAudit as string | null, null)

  return (
    <PhaseLayout
      projectId={id}
      projectName={project?.name}
      phaseNum={3}
      title="SEO & GEO Optimization"
      subtitle="Optimize for search engines and target markets"
      headerAction={
        seoConfig?.seoScore ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-foreground">{seoConfig.seoScore}</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        ) : undefined
      }
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border pb-2">
        {(['keywords', 'audit', 'geo'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {tab === 'geo' ? 'GEO Targeting' : tab === 'audit' ? 'Technical Audit' : 'Keywords'}
          </button>
        ))}
      </div>

      {activeTab === 'keywords' && (
        <div>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => keywordMutation.mutate({ projectId: id, niche: project?.niche || '', targetMarkets: parseJson<string[]>(project?.targetMarkets as string, []) })}
              disabled={keywordMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {keywordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Generate Keywords
            </button>
            <button
              onClick={() => metaMutation.mutate({ projectId: id })}
              disabled={metaMutation.isPending || !keywords.length}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 disabled:opacity-50"
            >
              {metaMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Generate Meta Tags
            </button>
          </div>

          {keywords.length > 0 ? (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Keyword</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Volume</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Difficulty</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Intent</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Mapped Page</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((kw, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-4 py-3 font-medium text-foreground">{kw.keyword}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{kw.volume?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          kw.difficulty > 70 ? 'bg-destructive/10 text-destructive' :
                          kw.difficulty > 40 ? 'bg-accent/10 text-accent' :
                          'bg-success/10 text-success'
                        )}>
                          {kw.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{kw.intent}</td>
                      <td className="px-4 py-3 text-muted-foreground">/{kw.mappedPage || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Click &ldquo;Generate Keywords&rdquo; to start</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'audit' && (
        <div>
          <button
            onClick={() => auditMutation.mutate({ projectId: id })}
            disabled={auditMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 mb-4"
          >
            {auditMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
            Run Audit
          </button>

          {audit ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-medium text-foreground mb-3">Core Web Vitals</h3>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">LCP</span><span className="font-medium text-foreground">{audit.coreWebVitals.lcp}s</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">FID</span><span className="font-medium text-foreground">{audit.coreWebVitals.fid}ms</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">CLS</span><span className="font-medium text-foreground">{audit.coreWebVitals.cls}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Score</span><span className="font-bold text-success">{audit.coreWebVitals.score}/100</span></div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-medium text-foreground mb-3">Page Speed</h3>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Mobile</span><span className="font-medium text-foreground">{audit.pageSpeed.mobile}/100</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Desktop</span><span className="font-medium text-foreground">{audit.pageSpeed.desktop}/100</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Mobile-Friendly</span><span className="font-medium text-success">{audit.mobileScore}/100</span></div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 col-span-2">
                <h3 className="font-medium text-foreground mb-3">Technical Checklist</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'SSL Valid', ok: audit.sslValid },
                    { label: 'Robots.txt', ok: audit.robotsTxt },
                    { label: 'Sitemap', ok: audit.sitemapFound },
                    { label: 'Canonical Tags', ok: audit.canonicalTags },
                    { label: 'Structured Data', ok: audit.structuredData },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      {item.ok ? <CheckCircle className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-accent" />}
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
                {audit.issues.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {audit.issues.map((issue, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className={cn('w-4 h-4', issue.type === 'warning' ? 'text-accent' : 'text-muted-foreground')} />
                        <span className="text-muted-foreground">{issue.message} ({issue.count})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Run an audit to see technical SEO results</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'geo' && (
        <div>
          <button
            onClick={() => geoMutation.mutate({
              projectId: id,
              countries: parseJson<string[]>(project?.targetMarkets as string, []).map((m) => ({ country: m, language: 'en' })),
            })}
            disabled={geoMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 mb-4"
          >
            {geoMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe2 className="w-4 h-4" />}
            Generate GEO Pages
          </button>

          {seoConfig?.geoTargets ? (
            <div className="grid grid-cols-2 gap-3">
              {parseJson<Array<{ country: string; language: string }>>(seoConfig.geoTargets as string, []).map((geo, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                  <Globe2 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{geo.country}</p>
                    <p className="text-xs text-muted-foreground">Language: {geo.language}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <Globe2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Generate geo-targeted landing pages for your markets</p>
            </div>
          )}
        </div>
      )}
    </PhaseLayout>
  )
}
