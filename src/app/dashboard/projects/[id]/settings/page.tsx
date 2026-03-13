'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState, useEffect } from 'react'
import { Settings, BarChart3, MessageCircle, Save, Check, Loader2, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

const CHAT_PROVIDERS = [
  { id: 'tawk', name: 'Tawk.to', placeholder: 'Enter your Tawk.to Property ID' },
  { id: 'crisp', name: 'Crisp', placeholder: 'Enter your Crisp Website ID' },
  { id: 'livechat', name: 'LiveChat', placeholder: 'Enter your LiveChat License Number' },
  { id: 'intercom', name: 'Intercom', placeholder: 'Enter your Intercom App ID' },
  { id: 'custom', name: 'Custom Script', placeholder: 'Enter your widget embed code' },
]

export default function ProjectSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: integrations, refetch } = trpc.project.getIntegrations.useQuery({ projectId: id })

  const [ga4Id, setGa4Id] = useState('')
  const [gtmId, setGtmId] = useState('')
  const [chatProvider, setChatProvider] = useState('')
  const [chatWidgetId, setChatWidgetId] = useState('')
  const [saved, setSaved] = useState(false)

  const updateMutation = trpc.project.updateIntegrations.useMutation({
    onSuccess: () => {
      refetch()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  useEffect(() => {
    if (integrations) {
      setGa4Id(integrations.ga4Id || '')
      setGtmId(integrations.gtmId || '')
      setChatProvider(integrations.chatWidgetProvider || '')
      setChatWidgetId(integrations.chatWidgetId || '')
    }
  }, [integrations])

  const handleSave = () => {
    updateMutation.mutate({
      projectId: id,
      ga4Id: ga4Id || undefined,
      gtmId: gtmId || undefined,
      chatWidgetProvider: chatProvider || undefined,
      chatWidgetId: chatWidgetId || undefined,
    })
  }

  const isValidGA4 = !ga4Id || /^G-[A-Z0-9]+$/.test(ga4Id)
  const isValidGTM = !gtmId || /^GTM-[A-Z0-9]+$/.test(gtmId)

  return (
    <PhaseLayout
      projectId={id}
      projectName={project?.name}
      phaseNum={0}
      title="Project Settings"
      subtitle="Configure integrations, analytics, and third-party services"
    >
      {/* Google Analytics */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Google Analytics</h2>
            <p className="text-xs text-muted-foreground">Track website visitors and conversions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">GA4 Measurement ID</label>
            <input
              type="text"
              value={ga4Id}
              onChange={(e) => setGa4Id(e.target.value.toUpperCase())}
              placeholder="G-XXXXXXXXXX"
              className={cn(
                'w-full px-3 py-2 rounded-lg border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30',
                !isValidGA4 ? 'border-destructive' : 'border-border'
              )}
            />
            {!isValidGA4 && <p className="text-xs text-destructive mt-1">Format: G-XXXXXXXXXX</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Google Tag Manager ID</label>
            <input
              type="text"
              value={gtmId}
              onChange={(e) => setGtmId(e.target.value.toUpperCase())}
              placeholder="GTM-XXXXXXX"
              className={cn(
                'w-full px-3 py-2 rounded-lg border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30',
                !isValidGTM ? 'border-destructive' : 'border-border'
              )}
            />
            {!isValidGTM && <p className="text-xs text-destructive mt-1">Format: GTM-XXXXXXX</p>}
          </div>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground">
            💡 Analytics tracking codes will be automatically injected into your exported HTML pages and deployed website.
          </p>
        </div>
      </div>

      {/* Live Chat */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Live Chat Widget</h2>
            <p className="text-xs text-muted-foreground">Add real-time chat support to your website</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Chat Provider</label>
            <select
              value={chatProvider}
              onChange={(e) => setChatProvider(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">None (disabled)</option>
              {CHAT_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          {chatProvider && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {CHAT_PROVIDERS.find((p) => p.id === chatProvider)?.name} Widget ID
              </label>
              <input
                type="text"
                value={chatWidgetId}
                onChange={(e) => setChatWidgetId(e.target.value)}
                placeholder={CHAT_PROVIDERS.find((p) => p.id === chatProvider)?.placeholder}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}
        </div>

        {chatProvider && (
          <div className="mt-4 p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Preview</span>
            </div>
            <div className="relative bg-background rounded-lg p-8 border border-border min-h-[100px]">
              <p className="text-sm text-muted-foreground text-center">Your website content here...</p>
              <div className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Chat widget will appear in the bottom-right corner of your website pages.
            </p>
          </div>
        )}
      </div>

      {/* Project Locale */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Content Language</h2>
            <p className="text-xs text-muted-foreground">Language for AI-generated content</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground px-3 py-1.5 rounded-lg bg-muted border border-border">English (default)</span>
          <span className="text-xs text-muted-foreground">Multi-language support coming soon</span>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending || !isValidGA4 || !isValidGTM}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </PhaseLayout>
  )
}
