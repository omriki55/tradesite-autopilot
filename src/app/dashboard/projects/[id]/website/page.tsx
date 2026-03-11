'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import { Layout, FileText, Eye, Rocket, Check, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseJson } from '@/lib/json-helpers'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

export default function WebsitePage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: website, refetch } = trpc.website.get.useQuery({ projectId: id })
  const { data: templates } = trpc.website.getTemplates.useQuery()
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const { data: pageData } = trpc.website.getPage.useQuery(
    { pageId: selectedPage! },
    { enabled: !!selectedPage }
  )

  const selectTemplateMutation = trpc.website.selectTemplate.useMutation({
    onSuccess: () => refetch(),
  })
  const generateMutation = trpc.website.generate.useMutation({
    onSuccess: () => refetch(),
  })
  const deployMutation = trpc.website.deploy.useMutation({
    onSuccess: () => refetch(),
  })

  const pages = website?.pages || []
  const hasTemplate = !!website?.templateId
  const selectedTemplate = templates?.find((t) => t.id === website?.templateId)

  return (
    <PhaseLayout
      projectId={id}
      projectName={project?.name}
      phaseNum={2}
      title="Website Factory"
      subtitle="Choose a template, generate pages, and deploy your trading website"
      isComplete={website?.status === 'DEPLOYED'}
      headerAction={
        website?.status === 'DEPLOYED' ? (
          <a
            href={website.deployUrl || '#'}
            target="_blank"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium"
          >
            <Check className="w-4 h-4" /> Live at {website.deployUrl}
          </a>
        ) : selectedTemplate ? (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {selectedTemplate.icon} {selectedTemplate.name}
          </span>
        ) : undefined
      }
    >
      {/* Template Selection Step */}
      {!hasTemplate && !pages.length && templates && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-1">Choose Your Template</h2>
          <p className="text-sm text-muted-foreground mb-4">Select the template that best matches your business type</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => selectTemplateMutation.mutate({ projectId: id, templateId: template.id })}
                disabled={selectTemplateMutation.isPending}
                className="text-left p-5 rounded-xl border-2 border-border hover:border-primary/50 bg-card transition-all group"
              >
                <div className="text-3xl mb-3">{template.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                    {template.pageCount} pages
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {template.features.map((f) => (
                    <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{f}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-4 h-4" /> Select Template
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        {hasTemplate && (!website || website.status === 'PENDING') && (
          <button
            onClick={() => generateMutation.mutate({ projectId: id })}
            disabled={generateMutation.isPending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
          >
            {generateMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating Pages...</>
            ) : (
              <><Layout className="w-4 h-4" /> Generate Website ({selectedTemplate?.pageCount || 0} pages)</>
            )}
          </button>
        )}
        {website?.status === 'GENERATED' && (
          <button
            onClick={() => deployMutation.mutate({ projectId: id })}
            disabled={deployMutation.isPending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-success text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {deployMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Deploying...</>
            ) : (
              <><Rocket className="w-4 h-4" /> Deploy Website</>
            )}
          </button>
        )}
      </div>

      {generateMutation.isPending && (
        <div className="text-center py-12 bg-card border border-border rounded-xl mb-6">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-foreground font-medium">Generating {selectedTemplate?.pageCount || 0} pages with AI...</p>
          <p className="text-sm text-muted-foreground mt-1">This may take a few minutes</p>
        </div>
      )}

      {pages.length > 0 && (
        <div className="grid grid-cols-12 gap-6">
          {/* Page list */}
          <div className="col-span-4 space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Pages ({pages.length})</h2>
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(page.id)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2',
                  selectedPage === page.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate">{page.title}</span>
                <span className={cn(
                  'ml-auto text-xs px-1.5 py-0.5 rounded',
                  page.status === 'published' ? 'bg-success/10 text-success' :
                  page.status === 'generated' ? 'bg-primary/10 text-primary' :
                  'bg-muted text-muted-foreground'
                )}>
                  {page.status}
                </span>
              </button>
            ))}
          </div>

          {/* Page preview */}
          <div className="col-span-8">
            {pageData ? (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {/* Browser chrome */}
                <div className="bg-[#1a1a2e] border-b border-border px-4 py-2.5 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 bg-[#0d0d1a] rounded-md px-3 py-1 text-xs text-muted-foreground flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {website?.deployUrl || 'https://example.com'}/{pageData.slug === 'home' ? '' : pageData.slug}
                  </div>
                </div>

                {/* Website preview */}
                <div className="bg-white text-gray-900 max-h-[600px] overflow-y-auto">
                  {(() => {
                    const content = parseJson<{
                      heroTitle?: string
                      heroSubtitle?: string
                      sections?: Array<{ title: string; content: string; type: string }>
                    }>(pageData.content as string, {})
                    const brandName = project?.brandName || 'Brand'
                    const navItems = ['Home', 'Markets', 'Platforms', 'Pricing', 'Education', 'About']
                    return (
                      <>
                        {/* Nav bar */}
                        <nav className="bg-[#0f1729] text-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                          <span className="font-bold text-sm">{brandName}</span>
                          <div className="flex items-center gap-4">
                            {navItems.map((item) => (
                              <span key={item} className="text-xs text-gray-400 hover:text-white cursor-default">{item}</span>
                            ))}
                            <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Open Account</span>
                          </div>
                        </nav>

                        {/* Hero section */}
                        {content?.heroTitle && (
                          <div className="bg-gradient-to-br from-[#0f1729] to-[#1a2744] text-white px-8 py-12">
                            <div className="max-w-lg">
                              <h1 className="text-2xl font-bold mb-3">{content.heroTitle}</h1>
                              {content.heroSubtitle && (
                                <p className="text-gray-300 text-sm mb-6">{content.heroSubtitle}</p>
                              )}
                              <div className="flex gap-3">
                                <span className="bg-blue-600 text-white text-xs px-4 py-2 rounded font-medium">Get Started</span>
                                <span className="border border-gray-500 text-gray-300 text-xs px-4 py-2 rounded">Learn More</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Content sections */}
                        {Array.isArray(content?.sections) && (
                          <div className="px-8 py-8 space-y-8">
                            {content.sections!.map((section, i) => (
                              <div key={i}>
                                {section.type === 'features' || section.type === 'list' ? (
                                  <div className="bg-gray-50 rounded-lg p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>
                                    <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                                    <div className="grid grid-cols-3 gap-3 mt-4">
                                      {['Fast Execution', '24/7 Support', 'Regulated'].map((f) => (
                                        <div key={f} className="bg-white rounded p-3 text-center">
                                          <div className="w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                                            <div className="w-4 h-4 bg-blue-500 rounded-full" />
                                          </div>
                                          <span className="text-xs font-medium text-gray-700">{f}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : section.type === 'pricing' || section.type === 'table' ? (
                                  <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>
                                    <p className="text-sm text-gray-600 mb-4">{section.content}</p>
                                    <div className="grid grid-cols-3 gap-3">
                                      {['Standard', 'Premium', 'VIP'].map((tier, ti) => (
                                        <div key={tier} className={cn('rounded-lg p-4 border text-center', ti === 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200')}>
                                          <h3 className="font-bold text-sm">{tier}</h3>
                                          <p className="text-xs text-gray-500 mt-1">From ${ti === 0 ? '100' : ti === 1 ? '1,000' : '10,000'}</p>
                                          <span className={cn('inline-block mt-3 text-xs px-3 py-1 rounded', ti === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700')}>
                                            Choose Plan
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : section.type === 'cta' ? (
                                  <div className="bg-blue-600 text-white rounded-lg p-6 text-center">
                                    <h2 className="text-lg font-bold mb-2">{section.title}</h2>
                                    <p className="text-sm text-blue-100 mb-4">{section.content}</p>
                                    <span className="bg-white text-blue-600 text-xs px-5 py-2 rounded font-medium">Start Trading Now</span>
                                  </div>
                                ) : (
                                  <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h2>
                                    <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="bg-[#0f1729] text-gray-400 px-8 py-6 mt-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-white font-bold text-sm mb-1">{brandName}</p>
                              <p className="text-xs">Professional Trading Services</p>
                            </div>
                            <div className="flex gap-6">
                              {['Company', 'Legal', 'Support'].map((col) => (
                                <div key={col}>
                                  <p className="text-xs font-medium text-gray-300 mb-2">{col}</p>
                                  <div className="space-y-1">
                                    {['Link 1', 'Link 2', 'Link 3'].map((l, li) => (
                                      <p key={li} className="text-xs text-gray-500">{l}</p>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="border-t border-gray-800 pt-3 text-xs text-gray-500">
                            Risk Disclosure: Trading involves significant risk. Past performance is not indicative of future results.
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>

                {/* SEO meta info */}
                {pageData.metaTitle && (
                  <div className="border-t border-border px-4 py-3 bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-0.5">SEO Preview</p>
                    <p className="text-sm font-medium text-blue-400">{pageData.metaTitle}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{pageData.metaDescription}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-card border border-border rounded-xl">
                <div className="text-center text-muted-foreground">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <p>Select a page to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!pages.length && !generateMutation.isPending && hasTemplate && (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Template Selected</h3>
          <p className="text-muted-foreground">Click &ldquo;Generate Website&rdquo; to create {selectedTemplate?.pageCount || 0} professional pages</p>
        </div>
      )}

      {!pages.length && !generateMutation.isPending && !hasTemplate && !templates && (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Loading Templates...</h3>
        </div>
      )}
    </PhaseLayout>
  )
}
