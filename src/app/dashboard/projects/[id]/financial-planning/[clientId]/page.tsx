'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { trpc } from '@/trpc/client'
import {
  ArrowRight, Save, ChevronDown, ChevronUp, Plus, Trash2,
  CheckCircle, Clock, PauseCircle, TrendingUp, AlertCircle,
  BookOpen, Home, BarChart2, DollarSign, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

type LineItem = { label: string; amount: number }

type CashFlowData = {
  income: LineItem[]
  expenses: LineItem[]
}

type BalanceSheetData = {
  assets: LineItem[]
  liabilities: LineItem[]
}

type PensionData = {
  pensionFund: { name: string; balance: number; monthlyContribution: number; managementFee: number; track: string }
  trainingFund: { balance: number; monthlyContribution: number; managementFee: number }
  retirementAge: number
  notes: string
}

type WealthProjectionData = {
  initialCapital: number
  monthlyAddition: number
  annualReturn: number
}

type EducationProgress = {
  moneyManagement: string[]
  realEstate: string[]
  stockMarket: string[]
}

type AllocationItem = { channel: string; amount: number; notes: string }

type AssetAllocationData = {
  allocations: AllocationItem[]
  generalNotes: string
}

// ─── Education content ────────────────────────────────────────────────────────

const EDUCATION_TOPICS = {
  moneyManagement: [
    { id: 'interest_inflation', label: 'הקשר בין ריבית ואינפלציה' },
    { id: 'real_nominal', label: 'ריאלי ונומינלי' },
    { id: 'current_account', label: 'כמה כסף לשמור בעו"ש' },
    { id: 'short_term', label: 'פק"מ וקרן כספית — מתי ומה ההבדלים' },
    { id: 'time_horizon', label: 'התאמת אפיקים לטווח ההשקעה' },
    { id: 'beginners', label: 'אפיקים מתאימים לתחילת הדרך' },
    { id: 'warnings', label: 'ממה להיזהר בעולם הפיננסים' },
  ],
  realEstate: [
    { id: 're_purchase', label: 'איך לרכוש נכון דירה להשקעה בישראל' },
    { id: 're_vs_living', label: 'הבדלים בין דירה להשקעה ולמגורים' },
    { id: 're_tax_first', label: 'הטבות מיסוי בדירה יחידה' },
    { id: 're_mortgage', label: 'מתי ואיך לקחת משכנתא' },
    { id: 're_leverage', label: 'כוח המינוף' },
    { id: 're_roi_calc', label: 'חישוב תשואה ועלות משכנתא' },
    { id: 're_investor_escort', label: 'מלווה משקיעים — מתי כדאי' },
    { id: 're_tax_second', label: 'מיסים על דירה שנייה' },
    { id: 're_professionals', label: 'אנשי מקצוע שאסור לוותר עליהם' },
    { id: 're_abroad', label: 'נדל"ן בחו"ל — סיכויים וסיכונים' },
  ],
  stockMarket: [
    { id: 'sm_long_term', label: 'עקרונות השקעה לטווח ארוך' },
    { id: 'sm_passive', label: 'תורת ההשקעה הפסיבית' },
    { id: 'sm_account', label: 'פתיחת חשבון מסחר עצמאי' },
    { id: 'sm_first_buy', label: 'ביצוע הרכישה הראשונה' },
    { id: 'sm_etf', label: 'מדדים ו-ETF — הבסיס' },
    { id: 'sm_diversify', label: 'פיזור השקעות נכון' },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sum(items: LineItem[]) {
  return items.reduce((acc, i) => acc + (i.amount || 0), 0)
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(n)
}

function calcWealth(
  initialCapital: number,
  monthlyAddition: number,
  annualReturn: number,
  years: number
): number {
  const r = annualReturn / 100 / 12
  const n = years * 12
  if (r === 0) return initialCapital + monthlyAddition * n
  return (
    initialCapital * Math.pow(1 + r, n) +
    (monthlyAddition * (Math.pow(1 + r, n) - 1)) / r
  )
}

function defaultCashFlow(): CashFlowData {
  return {
    income: [{ label: 'משכורת', amount: 0 }],
    expenses: [
      { label: 'שכירות/משכנתא', amount: 0 },
      { label: 'מזון', amount: 0 },
      { label: 'רכב', amount: 0 },
      { label: 'חינוך', amount: 0 },
    ],
  }
}

function defaultBalanceSheet(): BalanceSheetData {
  return {
    assets: [
      { label: 'דירה', amount: 0 },
      { label: 'קרן השתלמות', amount: 0 },
      { label: 'חסכונות', amount: 0 },
    ],
    liabilities: [{ label: 'משכנתא', amount: 0 }],
  }
}

function defaultPension(): PensionData {
  return {
    pensionFund: {
      name: '',
      balance: 0,
      monthlyContribution: 0,
      managementFee: 0.5,
      track: '',
    },
    trainingFund: { balance: 0, monthlyContribution: 0, managementFee: 0.5 },
    retirementAge: 67,
    notes: '',
  }
}

function defaultWealthProjection(): WealthProjectionData {
  return { initialCapital: 0, monthlyAddition: 0, annualReturn: 7 }
}

function defaultEducation(): EducationProgress {
  return { moneyManagement: [], realEstate: [], stockMarket: [] }
}

function defaultAllocation(): AssetAllocationData {
  return {
    allocations: [
      { channel: 'שוק ההון — מדדים/ETF', amount: 0, notes: '' },
      { channel: 'נדל"ן', amount: 0, notes: '' },
      { channel: 'קרן השתלמות', amount: 0, notes: '' },
      { channel: 'פנסיה', amount: 0, notes: '' },
    ],
    generalNotes: '',
  }
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  children,
  defaultOpen = true,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && <div className="p-4 pt-0 border-t border-border">{children}</div>}
    </div>
  )
}

// ─── Line item table ──────────────────────────────────────────────────────────

function LineItemTable({
  items,
  onChange,
  addLabel,
}: {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
  addLabel: string
}) {
  const update = (idx: number, field: keyof LineItem, value: string | number) => {
    const next = items.map((item, i) =>
      i === idx ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item
    )
    onChange(next)
  }
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx))
  const add = () => onChange([...items, { label: '', amount: 0 }])

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            value={item.label}
            onChange={(e) => update(idx, 'label', e.target.value)}
            placeholder="תיאור"
            className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <input
            type="number"
            value={item.amount || ''}
            onChange={(e) => update(idx, 'amount', e.target.value)}
            placeholder="0"
            className="w-32 px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 text-left"
            dir="ltr"
          />
          <button
            onClick={() => remove(idx)}
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity mt-1"
      >
        <Plus className="w-3.5 h-3.5" />
        {addLabel}
      </button>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ClientDetailPage() {
  const { id: projectId, clientId } = useParams<{ id: string; clientId: string }>()
  const router = useRouter()

  const { data: client, isLoading, refetch } = trpc.financialPlanning.getById.useQuery({
    id: clientId,
  })

  const update = trpc.financialPlanning.update.useMutation({
    onSuccess: () => refetch(),
  })

  const deleteClient = trpc.financialPlanning.delete.useMutation({
    onSuccess: () =>
      router.push(`/dashboard/projects/${projectId}/financial-planning`),
  })

  // ── Local state (populated once client loads) ─────────────────────────────
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1)
  const [cashFlow, setCashFlow] = useState<CashFlowData>(defaultCashFlow())
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData>(defaultBalanceSheet())
  const [pension, setPension] = useState<PensionData>(defaultPension())
  const [wealthProjection, setWealthProjection] = useState<WealthProjectionData>(defaultWealthProjection())
  const [education, setEducation] = useState<EducationProgress>(defaultEducation())
  const [allocation, setAllocation] = useState<AssetAllocationData>(defaultAllocation())
  const [meetingNotes, setMeetingNotes] = useState('')
  const [generalNotes, setGeneralNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!client) return
    try { setCashFlow(JSON.parse(client.cashFlow ?? 'null') ?? defaultCashFlow()) } catch { /* ignore */ }
    try { setBalanceSheet(JSON.parse(client.balanceSheet ?? 'null') ?? defaultBalanceSheet()) } catch { /* ignore */ }
    try { setPension(JSON.parse(client.pensionData ?? 'null') ?? defaultPension()) } catch { /* ignore */ }
    try { setWealthProjection(JSON.parse(client.wealthProjection ?? 'null') ?? defaultWealthProjection()) } catch { /* ignore */ }
    try { setEducation(JSON.parse(client.educationProgress ?? 'null') ?? defaultEducation()) } catch { /* ignore */ }
    try { setAllocation(JSON.parse(client.assetAllocation ?? 'null') ?? defaultAllocation()) } catch { /* ignore */ }
    setMeetingNotes(client.meetingNotes ?? '')
    setGeneralNotes(client.notes ?? '')
  }, [client])

  const handleSave = useCallback(async () => {
    if (!client) return
    setSaving(true)
    try {
      await update.mutateAsync({
        id: client.id,
        cashFlow: JSON.stringify(cashFlow),
        balanceSheet: JSON.stringify(balanceSheet),
        pensionData: JSON.stringify(pension),
        wealthProjection: JSON.stringify(wealthProjection),
        educationProgress: JSON.stringify(education),
        assetAllocation: JSON.stringify(allocation),
        meetingNotes,
        notes: generalNotes,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }, [client, cashFlow, balanceSheet, pension, wealthProjection, education, allocation, meetingNotes, generalNotes, update])

  const advancePhase = async () => {
    if (!client || client.phase >= 3) return
    await update.mutateAsync({ id: client.id, phase: client.phase + 1 })
  }

  // ── Toggle education topic ─────────────────────────────────────────────────
  const toggleTopic = (category: keyof EducationProgress, id: string) => {
    setEducation((prev) => {
      const arr = prev[category]
      return {
        ...prev,
        [category]: arr.includes(id) ? arr.filter((t) => t !== id) : [...arr, id],
      }
    })
  }

  // ── Monthly totals ─────────────────────────────────────────────────────────
  const totalIncome = sum(cashFlow.income)
  const totalExpenses = sum(cashFlow.expenses)
  const monthlySavings = totalIncome - totalExpenses
  const totalAssets = sum(balanceSheet.assets)
  const totalLiabilities = sum(balanceSheet.liabilities)
  const netWorth = totalAssets - totalLiabilities

  // ── Wealth projection rows ─────────────────────────────────────────────────
  const projectionYears = [1, 3, 5, 10, 15, 20, 25, 30]

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-4">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-4 w-32 bg-muted rounded" />
      </div>
    )
  }

  if (!client) {
    return <div className="text-destructive">לקוח לא נמצא</div>
  }

  const phaseColors: Record<number, string> = {
    1: 'text-blue-400 bg-blue-400/10',
    2: 'text-amber-400 bg-amber-400/10',
    3: 'text-emerald-400 bg-emerald-400/10',
  }

  const phaseLabels: Record<number, string> = {
    1: 'מיפוי',
    2: 'לימוד',
    3: 'החלטות',
  }

  // ── Total allocated capital ────────────────────────────────────────────────
  const totalAllocated = allocation.allocations.reduce((s, a) => s + (a.amount || 0), 0)

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button
            onClick={() =>
              router.push(`/dashboard/projects/${projectId}/financial-planning`)
            }
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            חזרה לרשימה
          </button>
          <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            {client.email && (
              <span className="text-xs text-muted-foreground" dir="ltr">
                {client.email}
              </span>
            )}
            {client.phone && (
              <span className="text-xs text-muted-foreground" dir="ltr">
                {client.phone}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span
            className={cn(
              'text-xs px-2.5 py-1 rounded-full font-medium',
              client.status === 'completed'
                ? 'bg-success/10 text-success'
                : client.status === 'paused'
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-primary/10 text-primary'
            )}
          >
            {client.status === 'completed'
              ? 'הושלם'
              : client.status === 'paused'
                ? 'בהמתנה'
                : 'פעיל'}
          </span>
          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saved ? (
              <CheckCircle className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {saved ? 'נשמר' : saving ? 'שומר...' : 'שמור'}
          </button>
        </div>
      </div>

      {/* Phase progress bar */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          {([1, 2, 3] as const).map((p) => (
            <button
              key={p}
              onClick={() => setActiveTab(p)}
              className={cn(
                'flex-1 text-center py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === p
                  ? phaseColors[p]
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {p === 1 && <BookOpen className="w-4 h-4 mx-auto mb-1" />}
              {p === 2 && <TrendingUp className="w-4 h-4 mx-auto mb-1" />}
              {p === 3 && <DollarSign className="w-4 h-4 mx-auto mb-1" />}
              פגישה {p} — {phaseLabels[p]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <div
              key={p}
              className={cn(
                'flex-1 h-1.5 rounded-full transition-all',
                p <= client.phase ? 'bg-primary' : 'bg-border'
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>
            שלב נוכחי:{' '}
            <span className={cn('font-medium', phaseColors[client.phase])}>
              פגישה {client.phase} — {phaseLabels[client.phase]}
            </span>
          </span>
          {client.phase < 3 && (
            <button
              onClick={advancePhase}
              className="text-primary hover:opacity-80 font-medium transition-opacity"
            >
              קדם לפגישה {client.phase + 1} ←
            </button>
          )}
          {client.phase === 3 && client.status !== 'completed' && (
            <button
              onClick={() => update.mutateAsync({ id: client.id, status: 'completed' })}
              className="text-success hover:opacity-80 font-medium transition-opacity"
            >
              סמן כהושלם ✓
            </button>
          )}
        </div>
      </div>

      {/* ── Tab 1: Financial Mapping ─────────────────────────────────────────── */}
      {activeTab === 1 && (
        <div className="space-y-4">
          {/* Cash flow */}
          <Section title="שלב 1 — תזרים (הכנסות והוצאות)" subtitle="חישוב חיסכון חודשי נטו">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-xs font-semibold text-success mb-2 uppercase tracking-wider">הכנסות</p>
                <LineItemTable
                  items={cashFlow.income}
                  onChange={(items) => setCashFlow((p) => ({ ...p, income: items }))}
                  addLabel="הוסף הכנסה"
                />
                <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                  <span className="text-muted-foreground">סה&quot;כ הכנסות</span>
                  <span className="font-semibold text-success">{formatCurrency(totalIncome)}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-destructive mb-2 uppercase tracking-wider">הוצאות</p>
                <LineItemTable
                  items={cashFlow.expenses}
                  onChange={(items) => setCashFlow((p) => ({ ...p, expenses: items }))}
                  addLabel="הוסף הוצאה"
                />
                <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                  <span className="text-muted-foreground">סה&quot;כ הוצאות</span>
                  <span className="font-semibold text-destructive">{formatCurrency(totalExpenses)}</span>
                </div>
              </div>
            </div>
            <div
              className={cn(
                'mt-4 p-3 rounded-lg flex items-center justify-between',
                monthlySavings >= 0 ? 'bg-success/10' : 'bg-destructive/10'
              )}
            >
              <span className="text-sm font-semibold text-foreground">חיסכון חודשי</span>
              <span
                className={cn(
                  'text-lg font-bold',
                  monthlySavings >= 0 ? 'text-success' : 'text-destructive'
                )}
              >
                {formatCurrency(monthlySavings)}
              </span>
            </div>
          </Section>

          {/* Balance sheet */}
          <Section title="שלב 2 — מאזן (נכסים והתחייבויות)" subtitle="שווי נקי נוכחי">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-xs font-semibold text-success mb-2 uppercase tracking-wider">נכסים</p>
                <LineItemTable
                  items={balanceSheet.assets}
                  onChange={(items) => setBalanceSheet((p) => ({ ...p, assets: items }))}
                  addLabel="הוסף נכס"
                />
                <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                  <span className="text-muted-foreground">סה&quot;כ נכסים</span>
                  <span className="font-semibold text-success">{formatCurrency(totalAssets)}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-destructive mb-2 uppercase tracking-wider">התחייבויות</p>
                <LineItemTable
                  items={balanceSheet.liabilities}
                  onChange={(items) => setBalanceSheet((p) => ({ ...p, liabilities: items }))}
                  addLabel="הוסף התחייבות"
                />
                <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                  <span className="text-muted-foreground">סה&quot;כ התחייבויות</span>
                  <span className="font-semibold text-destructive">{formatCurrency(totalLiabilities)}</span>
                </div>
              </div>
            </div>
            <div
              className={cn(
                'mt-4 p-3 rounded-lg flex items-center justify-between',
                netWorth >= 0 ? 'bg-success/10' : 'bg-destructive/10'
              )}
            >
              <span className="text-sm font-semibold text-foreground">שווי נקי</span>
              <span
                className={cn(
                  'text-lg font-bold',
                  netWorth >= 0 ? 'text-success' : 'text-destructive'
                )}
              >
                {formatCurrency(netWorth)}
              </span>
            </div>
          </Section>

          {/* Pension */}
          <Section title="שלב 3 — פנסיה" subtitle="קרן פנסיה, קרן השתלמות ותחזית קצבה">
            <div className="mt-4 space-y-6">
              {/* Pension fund */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                  קרן פנסיה
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'שם הקרן', key: 'name', type: 'text', placeholder: 'מגדל, מנורה...' },
                    { label: 'יתרה (₪)', key: 'balance', type: 'number', placeholder: '0' },
                    { label: 'הפקדה חודשית (₪)', key: 'monthlyContribution', type: 'number', placeholder: '0' },
                    { label: 'דמי ניהול (%)', key: 'managementFee', type: 'number', placeholder: '0.5' },
                    { label: 'מסלול השקעה', key: 'track', type: 'text', placeholder: 'מניות, כללי...' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
                      <input
                        type={type}
                        value={(pension.pensionFund as Record<string, string | number>)[key] ?? ''}
                        onChange={(e) =>
                          setPension((p) => ({
                            ...p,
                            pensionFund: {
                              ...p.pensionFund,
                              [key]: type === 'number' ? Number(e.target.value) : e.target.value,
                            },
                          }))
                        }
                        placeholder={placeholder}
                        className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        dir={type === 'text' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Training fund */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                  קרן השתלמות
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'יתרה (₪)', key: 'balance', placeholder: '0' },
                    { label: 'הפקדה חודשית (₪)', key: 'monthlyContribution', placeholder: '0' },
                    { label: 'דמי ניהול (%)', key: 'managementFee', placeholder: '0.5' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
                      <input
                        type="number"
                        value={(pension.trainingFund as Record<string, number>)[key] ?? ''}
                        onChange={(e) =>
                          setPension((p) => ({
                            ...p,
                            trainingFund: {
                              ...p.trainingFund,
                              [key]: Number(e.target.value),
                            },
                          }))
                        }
                        placeholder={placeholder}
                        className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        dir="ltr"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Retirement age */}
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">גיל פרישה</label>
                  <input
                    type="number"
                    value={pension.retirementAge}
                    onChange={(e) =>
                      setPension((p) => ({ ...p, retirementAge: Number(e.target.value) }))
                    }
                    className="w-24 px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">הערות פנסיה</label>
                <textarea
                  value={pension.notes}
                  onChange={(e) => setPension((p) => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                  placeholder="פירוט, המלצות, הפניה לסוכן פנסיוני..."
                />
              </div>
            </div>
          </Section>

          {/* Wealth projection */}
          <Section title="שלב 4 — תחזית צמיחת הון" subtitle="הדמיית עושר לאורך השנים">
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">הון ראשוני (₪)</label>
                  <input
                    type="number"
                    value={wealthProjection.initialCapital || ''}
                    onChange={(e) =>
                      setWealthProjection((p) => ({ ...p, initialCapital: Number(e.target.value) }))
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">הוספה חודשית (₪)</label>
                  <input
                    type="number"
                    value={wealthProjection.monthlyAddition || ''}
                    onChange={(e) =>
                      setWealthProjection((p) => ({ ...p, monthlyAddition: Number(e.target.value) }))
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">תשואה שנתית (%)</label>
                  <input
                    type="number"
                    value={wealthProjection.annualReturn || ''}
                    onChange={(e) =>
                      setWealthProjection((p) => ({ ...p, annualReturn: Number(e.target.value) }))
                    }
                    placeholder="7"
                    className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">שנה</th>
                      <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">
                        ללא תשואה
                      </th>
                      <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium text-primary">
                        עם תשואה {wealthProjection.annualReturn}%
                      </th>
                      <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium text-success">
                        הפרש
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectionYears.map((years) => {
                      const withReturn = calcWealth(
                        wealthProjection.initialCapital,
                        wealthProjection.monthlyAddition,
                        wealthProjection.annualReturn,
                        years
                      )
                      const noReturn =
                        wealthProjection.initialCapital +
                        wealthProjection.monthlyAddition * years * 12
                      const diff = withReturn - noReturn

                      return (
                        <tr key={years} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-2 px-3 text-right font-medium">{years}</td>
                          <td className="py-2 px-3 text-left text-muted-foreground" dir="ltr">
                            {formatCurrency(noReturn)}
                          </td>
                          <td className="py-2 px-3 text-left font-semibold text-primary" dir="ltr">
                            {formatCurrency(withReturn)}
                          </td>
                          <td className="py-2 px-3 text-left text-success font-medium" dir="ltr">
                            +{formatCurrency(diff)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * תחשיב להמחשה בלבד. ריבית דריבית חודשית. אינו מהווה ייעוץ השקעות.
              </p>
            </div>
          </Section>
        </div>
      )}

      {/* ── Tab 2: Education ─────────────────────────────────────────────────── */}
      {activeTab === 2 && (
        <div className="space-y-4">
          {/* Money management */}
          <Section title="ניהול כסף" subtitle={`${education.moneyManagement.length}/${EDUCATION_TOPICS.moneyManagement.length} נושאים נדונו`}>
            <div className="mt-3 space-y-2">
              {EDUCATION_TOPICS.moneyManagement.map((topic) => {
                const checked = education.moneyManagement.includes(topic.id)
                return (
                  <label
                    key={topic.id}
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors',
                      checked ? 'bg-success/10' : 'hover:bg-muted/50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0',
                        checked
                          ? 'bg-success border-success'
                          : 'border-border'
                      )}
                      onClick={() => toggleTopic('moneyManagement', topic.id)}
                    >
                      {checked && <X className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={cn('text-sm', checked ? 'text-foreground' : 'text-muted-foreground')}>
                      {topic.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </Section>

          {/* Real estate */}
          <Section title="נדל״ן" subtitle={`${education.realEstate.length}/${EDUCATION_TOPICS.realEstate.length} נושאים נדונו`}>
            <div className="mt-3 space-y-2">
              {EDUCATION_TOPICS.realEstate.map((topic) => {
                const checked = education.realEstate.includes(topic.id)
                return (
                  <label
                    key={topic.id}
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors',
                      checked ? 'bg-success/10' : 'hover:bg-muted/50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0',
                        checked ? 'bg-success border-success' : 'border-border'
                      )}
                      onClick={() => toggleTopic('realEstate', topic.id)}
                    >
                      {checked && <X className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={cn('text-sm', checked ? 'text-foreground' : 'text-muted-foreground')}>
                      {topic.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </Section>

          {/* Stock market */}
          <Section title="שוק ההון" subtitle={`${education.stockMarket.length}/${EDUCATION_TOPICS.stockMarket.length} נושאים נדונו`}>
            <div className="mt-3 space-y-2">
              {EDUCATION_TOPICS.stockMarket.map((topic) => {
                const checked = education.stockMarket.includes(topic.id)
                return (
                  <label
                    key={topic.id}
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors',
                      checked ? 'bg-success/10' : 'hover:bg-muted/50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0',
                        checked ? 'bg-success border-success' : 'border-border'
                      )}
                      onClick={() => toggleTopic('stockMarket', topic.id)}
                    >
                      {checked && <X className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={cn('text-sm', checked ? 'text-foreground' : 'text-muted-foreground')}>
                      {topic.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </Section>

          {/* Progress summary */}
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm font-semibold text-foreground mb-3">סיכום התקדמות לימוד</p>
            {[
              { label: 'ניהול כסף', done: education.moneyManagement.length, total: EDUCATION_TOPICS.moneyManagement.length },
              { label: 'נדל"ן', done: education.realEstate.length, total: EDUCATION_TOPICS.realEstate.length },
              { label: 'שוק ההון', done: education.stockMarket.length, total: EDUCATION_TOPICS.stockMarket.length },
            ].map(({ label, done, total }) => (
              <div key={label} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-muted-foreground w-24 text-right">{label}</span>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all"
                    style={{ width: `${(done / total) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-left" dir="ltr">
                  {done}/{total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 3: Asset Allocation ──────────────────────────────────────────── */}
      {activeTab === 3 && (
        <div className="space-y-4">
          <Section title="הקצאת נכסים" subtitle={`סה"כ מוקצה: ${formatCurrency(totalAllocated)}`}>
            <div className="mt-4 space-y-3">
              {allocation.allocations.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={item.channel}
                    onChange={(e) => {
                      const next = [...allocation.allocations]
                      next[idx] = { ...next[idx], channel: e.target.value }
                      setAllocation((p) => ({ ...p, allocations: next }))
                    }}
                    placeholder="אפיק השקעה"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <input
                    type="number"
                    value={item.amount || ''}
                    onChange={(e) => {
                      const next = [...allocation.allocations]
                      next[idx] = { ...next[idx], amount: Number(e.target.value) }
                      setAllocation((p) => ({ ...p, allocations: next }))
                    }}
                    placeholder="סכום ₪"
                    className="w-32 px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    dir="ltr"
                  />
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => {
                      const next = [...allocation.allocations]
                      next[idx] = { ...next[idx], notes: e.target.value }
                      setAllocation((p) => ({ ...p, allocations: next }))
                    }}
                    placeholder="הערות"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <button
                    onClick={() => {
                      const next = allocation.allocations.filter((_, i) => i !== idx)
                      setAllocation((p) => ({ ...p, allocations: next }))
                    }}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setAllocation((p) => ({
                    ...p,
                    allocations: [...p.allocations, { channel: '', amount: 0, notes: '' }],
                  }))
                }
                className="flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                הוסף אפיק
              </button>
            </div>

            {/* Allocation pie-like breakdown */}
            {totalAllocated > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3 font-medium">פירוט אחוזים</p>
                <div className="space-y-2">
                  {allocation.allocations
                    .filter((a) => a.amount > 0)
                    .map((item, idx) => {
                      const pct = Math.round((item.amount / totalAllocated) * 100)
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-36 text-right truncate">
                            {item.channel || `אפיק ${idx + 1}`}
                          </span>
                          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-foreground w-10 text-left" dir="ltr">
                            {pct}%
                          </span>
                          <span className="text-xs text-muted-foreground w-24 text-left" dir="ltr">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </Section>

          {/* General decisions notes */}
          <Section title="החלטות ומסקנות" subtitle="סיכום פגישה 3 — מה הוחלט">
            <textarea
              value={allocation.generalNotes}
              onChange={(e) => setAllocation((p) => ({ ...p, generalNotes: e.target.value }))}
              rows={6}
              placeholder="סכם כאן את ההחלטות שהתקבלו: נדל&quot;ן, שוק ההון, פנסיה, ביטוחים, הלוואות, משכנתא וכד'"
              className="w-full mt-3 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
            />
          </Section>
        </div>
      )}

      {/* ── Meeting notes (always visible) ───────────────────────────────────── */}
      <div className="mt-6 space-y-4">
        <Section title="הערות פגישות" subtitle="יומן מפגשים עם הלקוח" defaultOpen={false}>
          <textarea
            value={meetingNotes}
            onChange={(e) => setMeetingNotes(e.target.value)}
            rows={5}
            placeholder="תאריך פגישה, נושאים שנדונו, משימות להמשך..."
            className="w-full mt-3 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
          />
        </Section>

        <Section title="הערות כלליות" subtitle="פרטים אישיים, רקע, מטרות" defaultOpen={false}>
          <textarea
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            rows={4}
            placeholder="מטרות הלקוח, מצב משפחתי, תכניות עתידיות..."
            className="w-full mt-3 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
          />
        </Section>
      </div>

      {/* ── Status change + danger zone ──────────────────────────────────────── */}
      <div className="mt-6 bg-card border border-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
          ניהול לקוח
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {(['active', 'paused', 'completed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => update.mutate({ id: client.id, status: s })}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                client.status === s
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              )}
            >
              {s === 'active' ? '● פעיל' : s === 'paused' ? '⏸ בהמתנה' : '✓ הושלם'}
            </button>
          ))}
          <div className="ml-auto">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                מחק לקוח
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5 inline ml-1" />
                  האם למחוק לצמיתות?
                </span>
                <button
                  onClick={() => deleteClient.mutate({ id: client.id })}
                  className="px-3 py-1.5 rounded-lg text-xs bg-destructive text-white hover:opacity-90 transition-opacity"
                >
                  מחק
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg text-xs border border-border text-muted-foreground hover:bg-muted transition-colors"
                >
                  ביטול
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom save bar */}
      <div className="sticky bottom-4 flex justify-center mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'נשמר בהצלחה!' : saving ? 'שומר...' : 'שמור שינויים'}
        </button>
      </div>
    </div>
  )
}
