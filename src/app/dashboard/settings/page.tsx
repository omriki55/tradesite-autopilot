'use client'

import { useSession } from 'next-auth/react'
import { Settings, Key, Database, Server } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Account</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground">{session?.user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="text-foreground">{session?.user?.name}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">API Keys</h2>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Anthropic API Key', env: 'ANTHROPIC_API_KEY', status: !!process.env.ANTHROPIC_API_KEY },
              { name: 'Domain Registrar', env: 'NAMECHEAP_API_KEY', status: false },
              { name: 'Meta API', env: 'META_APP_ID', status: false },
              { name: 'Twitter API', env: 'TWITTER_API_KEY', status: false },
            ].map((key) => (
              <div key={key.env} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{key.name}</span>
                <span className={key.status ? 'text-success' : 'text-muted-foreground'}>
                  {key.status ? 'Connected' : 'Not configured'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Configure API keys in .env file</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Infrastructure</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database</span>
              <span className="text-success">PostgreSQL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Queue</span>
              <span className="text-muted-foreground">Redis (BullMQ)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AI Engine</span>
              <span className="text-foreground">Claude (Anthropic)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
