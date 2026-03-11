'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import { Share2, Loader2, Check, Image, Film, Type, Hash } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'profiles' | 'content'>('profiles')
  const [bankFilter, setBankFilter] = useState<string>('all')

  const createProfilesMutation = trpc.social.createProfiles.useMutation({ onSuccess: () => refetchProfiles() })
  const generateBankMutation = trpc.social.generateContentBank.useMutation({ onSuccess: () => refetchBank() })

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
      subtitle="Create profiles and build your content library"
    >
      <div className="flex gap-2 mb-6 border-b border-border pb-2">
        {(['profiles', 'content'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {tab === 'content' ? 'Content Bank' : 'Profiles'}
          </button>
        ))}
      </div>

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
              {profiles.map((profile) => (
                <div key={profile.id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{platformIcons[profile.platform] || '🌐'}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{profile.platform}</h3>
                      <p className="text-sm text-muted-foreground">@{profile.username}</p>
                    </div>
                    {profile.status === 'active' ? (
                      <span className="flex items-center gap-1 text-xs text-success"><Check className="w-3 h-3" /> Active</span>
                    ) : (
                      <span className="text-xs text-muted-foreground capitalize">{profile.status}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  {profile.profileUrl && (
                    <p className="text-xs text-primary mt-2 truncate">{profile.profileUrl}</p>
                  )}
                </div>
              ))}
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
                .filter((item) => bankFilter === 'all' || item.category === bankFilter)
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
