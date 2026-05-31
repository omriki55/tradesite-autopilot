'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/trpc/client'
import {
  Users, Plus, ChevronRight, TrendingUp, CheckCircle,
  Clock, PauseCircle, X, BookOpen, Lightbulb,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function AddClientModal({
  projectId,
  onClose,
  onSuccess,
}: {
  projectId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const create = trpc.financialPlanning.create.useMutation({
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">לקוח חדש</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">שם מלא *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ישראל ישראלי"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="israel@example.com"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">טלפון</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="050-000-0000"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              dir="ltr"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            ביטול
          </button>
          <button
            onClick={() => {
              if (!name.trim()) return
              create.mutate({
                projectId,
                name: name.trim(),
                email: email.trim() || undefined,
                phone: phone.trim() || undefined,
              })
            }}
            disabled={!name.trim() || create.isPending}
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {create.isPending ? 'שומר...' : 'הוסף לקוח'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FinancialPlanningPage() {
  const { id: projectId } = useParams<{ id: string }>()
  const router = useRouter()
  const [showAddModal, setShowAddModal] = useState(false)

  const { data: clients = [], refetch } = trpc.financialPlanning.list.useQuery({ projectId })
  const { data: stats } = trpc.financialPlanning.getStats.useQuery({ projectId })

  const phaseLabel = (phase: number) => {
    if (phase === 1) return 'מיפוי'
    if (phase === 2) return 'לימוד'
    return 'החלטות'
  }

  const phaseColor = (phase: number) => {
    if (phase === 1) return 'text-blue-400 bg-blue-400/10'
    if (phase === 2) return 'text-amber-400 bg-amber-400/10'
    return 'text-emerald-400 bg-emerald-400/10'
  }

  return (
    <div className="max-w-5xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">תכנון פיננסי</h1>
          <p className="text-muted-foreground mt-1">ניהול תהליכי תכנון פיננסי עם לקוחות</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          לקוח חדש
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">סה&quot;כ לקוחות</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.total ?? 0}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground">פגישה 1 — מיפוי</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.phase1 ?? 0}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-muted-foreground">פגישה 2–3</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {(stats?.phase2 ?? 0) + (stats?.phase3 ?? 0)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">הושלמו</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.completed ?? 0}</p>
        </div>
      </div>

      {/* Client list */}
      {clients.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">אין לקוחות עדיין</h2>
          <p className="text-muted-foreground mb-6">
            הוסף את הלקוח הראשון שלך כדי להתחיל תהליך תכנון פיננסי
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            הוסף לקוח ראשון
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">
              רשימת לקוחות ({clients.length})
            </h2>
          </div>
          <div className="divide-y divide-border">
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() =>
                  router.push(
                    `/dashboard/projects/${projectId}/financial-planning/${client.id}`
                  )
                }
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-right"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                  {client.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{client.name}</span>
                    {client.status === 'completed' && (
                      <CheckCircle className="w-3.5 h-3.5 text-success" />
                    )}
                    {client.status === 'paused' && (
                      <PauseCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {client.email ?? client.phone ?? 'אין פרטי קשר'}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((p) => (
                      <div
                        key={p}
                        className={cn(
                          'w-2 h-2 rounded-full',
                          p <= client.phase ? 'bg-primary' : 'bg-border'
                        )}
                      />
                    ))}
                  </div>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      phaseColor(client.phase)
                    )}
                  >
                    פגישה {client.phase} — {phaseLabel(client.phase)}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 rotate-180" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Process explanation */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            phase: 1,
            icon: BookOpen,
            title: 'פגישה 1 — מיפוי',
            color: 'border-blue-400/30 bg-blue-400/5',
            iconColor: 'text-blue-400',
            desc: 'מיפוי תזרים הכנסות/הוצאות, מאזן נכסים והתחייבויות, נתוני פנסיה ותחזית צמיחת הון',
          },
          {
            phase: 2,
            icon: Lightbulb,
            title: 'פגישה 2 — לימוד',
            color: 'border-amber-400/30 bg-amber-400/5',
            iconColor: 'text-amber-400',
            desc: 'עקרונות ניהול כסף, השקעות נדל"ן בישראל ובחו"ל, שוק ההון ותורת ההשקעה הפסיבית',
          },
          {
            phase: 3,
            icon: TrendingUp,
            title: 'פגישה 3 — החלטות',
            color: 'border-emerald-400/30 bg-emerald-400/5',
            iconColor: 'text-emerald-400',
            desc: 'הקצאת נכסים, בניית תיק השקעות, החלטות על נדל"ן ואפיקים נוספים בהתאם למטרות',
          },
        ].map(({ phase, icon: Icon, title, color, iconColor, desc }) => (
          <div key={phase} className={cn('border rounded-xl p-4', color)}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={cn('w-4 h-4', iconColor)} />
              <span className="text-sm font-semibold text-foreground">{title}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddClientModal
          projectId={projectId}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  )
}
