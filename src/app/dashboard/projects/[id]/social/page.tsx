'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import { Share2, Loader2, Check, Image, Film, Type, Hash, Link2, Unlink, Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseJson } from '@/lib/json-helpers'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

const platformIcons: Record<string, string> = {
  FACEBOOK: '📘', INSTAGRAM: '📸', TWITTER: '🐦', LINKEDIN: '💼',
  YOUTUBE: '🎥', TIKTOK: '🎵', TELEGRAM: '✈️',
}

export default function SocialPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: profiles, refetch: refetchProfiles } = trpc.social.getProfiles.useQuery({ projectId: id })
  const { data: contentBank, refetch: refetchBank } = trpc.social.getContentBank.useQuery({ projectId: id })
  const { data: connections, refetch: refetchConnections } = trpc.connections.getAll.useQuery({ projectId: id })
  const [activeTab, setActiveTab] = useState<'profiles' | 'content' | 'connections'>('profiles')
  const [bankFilter, setBankFilter] = useState<string>('all')

  const createProfilesMutation = trpc.social.createProfiles.useMutation({ onSuccess: () => { refetchProfiles(); refetchConnections() } })
  const generateBankMutation = trpc.social.generateContentBank.useMutation({ onSuccess: () => refetchBank() })
  const connectMutation = trpc.connections.connect.useMutation({ onSuccess: () => refetchConnections() })
  const disconnectMutation = trpc.connections.disconnect.useMutation({ onSuccess: () => refetchConnections() })
  const testMutation = trpc.connections.test.useMutation()

  const typeIcons: Record<string, React.ReactNode> = {
    caption: <Type className="w-4 h-4" />,
    image: <Image className="w-4 h-4" />,
    video_script: <Film className="w-4 h-4" />,
    carousel: <Image className="w-4 h-4" />,
    hashtag_set: <Hash className="w-4 h-4" />,
  }

  return (
    <PhaseLayout
      projectId={id}
      projectName={project?.name}
      phaseNum={4}
      title="Social Media"
      subtitle="Create profiles, connect accounts, and build your content library"
    >
      <div className="flex gap-2 mb-6 border-b border-border pb-2">
        {(['profiles', 'connections', 'content'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {tab === 'content' ? 'Content Bank' : tab === 'connections' ? 'Connect Accounts' : 'Profiles'}
          </button>
        ))}
      </div>

      {/* Profiles Tab */}
      {activeTab === 'profiles' && (
        <div>
          <button
            onClick={() => createProfilesMutation.mutate({ projectId: id })}
            disabled={createProfilesMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 mb-4"
          >
            {createProfilesMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            {profiles?.length ? 'Recreate Profiles' : 'Create All Profiles'}
          </button>

          {profiles?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((profile) => {
                const conn = connections?.find((c) => c.platform === profile.platform)
                return (
                  <div key={profile.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{platformIcons[profile.platform] || '🌐'}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{profile.platform}</h3>
                        <p className="text-sm text-muted-foreground">@{profile.username}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {conn?.connected ? (
                          <span className="flex items-center gap-1 text-xs text-success">
                            <Wifi className="w-3 h-3" /> Connected
                          </span>
                        ) : profile.status === 'active' ? (
                          <span className="flex items-center gap-1 text-xs text-success"><Check className="w-3 h-3" /> Active</span>
                        ) : (
                          <span className="text-xs text-muted-foreground capitalize">{profile.status}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                    {profile.profileUrl && (
                      <p className="text-xs text-primary mt-2 truncate">{profile.profileUrl}</p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <Share2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Profiles Yet</h3>
              <p className="text-muted-foreground">Create branded profiles across 7 platforms</p>
            </div>
          )}
        </div>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div>
          <div className="bg-card border border-border rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Third-Party Connections</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Connect your social media accounts to enable live posting. Without a connection, posts are published in mock/preview mode.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['FACEBOOK', 'INSTAGRAM', 'TWITTER', 'LINKEDIN', 'YOUTUBE', 'TIKTOK', 'TELEGRAM'] as const).map((platform) => {
              const conn = connections?.find((c) => c.platform === platform)
              const isConnected = conn?.connected || false

              return (
                <div key={platform} className={cn(
                  'bg-card border rounded-xl p-5 transition-all',
                  isConnected ? 'border-success/30' : 'border-border'
                )}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{platformIcons[platform]}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{platform}</h3>
                      <p className="text-xs text-muted-foreground">
                        {isConnected ? 'Live mode — posts go to real account' : 'Mock mode — posts are simulated'}
                      </p>
                    </div>
                    {isConnected ? (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                        <Wifi className="w-3 h-3" /> Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                        <WifiOff className="w-3 h-3" /> Mock
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isConnected ? (
                      <>
                        <button
                          onClick={() => testMutation.mutate({ projectId: id, platform })}
                          disabled={testMutation.isPending}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-foreground hover:bg-muted/80"
                        >
                          Test Connection
                        </button>
                        <button
                          onClick={() => disconnectMutation.mutate({ projectId: id, platform })}
                          disabled={disconnectMutation.isPending}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10"
                        >
                          <Unlink className="w-3 h-3" /> Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => connectMutation.mutate({ projectId: id, platform })}
                        disabled={connectMutation.isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90"
                      >
                        {connectMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Link2 className="w-3 h-3" />}
                        Connect Account
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Content Bank Tab */}
      {activeTab === 'content' && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => generateBankMutation.mutate({ projectId: id })}
              disabled={generateBankMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {generateBankMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Generate Content Bank
            </button>
            <div className="flex gap-1">
              {['all', 'educational', 'promotional', 'analysis', 'motivational'].map((f) => (
                <button
                  key={f}
                  onClick={() => setBankFilter(f)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium capitalize',
                    bankFilter === f ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {contentBank?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentBank
                .filter((item) => !item.isTemplate && (bankFilter === 'all' || item.category === bankFilter))
                .map((item) => (
                  <div key={item.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {typeIcons[item.type] || <Type className="w-4 h-4" />}
                      <span className="text-xs font-medium text-foreground capitalize">{item.type.replace('_', ' ')}</span>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{item.category}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(() => {
                        const c = parseJson<Record<string, unknown>>(item.content as string, {})
                        if (c?.text) return <p className="line-clamp-3">{c.text as string}</p>
                        if (c?.headline) return <p className="line-clamp-3">{c.headline as string}</p>
                        if (c?.hook) return <p className="line-clamp-3">{c.hook as string}</p>
                        if (c?.hashtags) return <p className="line-clamp-3">{(c.hashtags as string[]).join(' ')}</p>
                        if (c?.slides) return <p>{(c.slides as Array<{ title: string }>).map(s => s.title).join(' | ')}</p>
                        return <p>Content item</p>
                      })()}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground">Generate a content bank with 25+ reusable assets</p>
            </div>
          )}
        </div>
      )}
    </PhaseLayout>
  )
}
