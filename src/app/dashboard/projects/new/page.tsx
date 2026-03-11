'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/trpc/client'

const niches = [
  { value: 'forex_broker', label: 'Forex Broker' },
  { value: 'crypto_exchange', label: 'Crypto Exchange' },
  { value: 'prop_trading', label: 'Prop Trading Firm' },
  { value: 'commodities_broker', label: 'Commodities Broker' },
  { value: 'investment_fund', label: 'Investment Fund' },
  { value: 'copy_trading', label: 'Copy Trading Platform' },
]

const markets = [
  'Global', 'Europe', 'Asia', 'Middle East', 'North America',
  'Latin America', 'Africa', 'Oceania', 'UK', 'UAE', 'Singapore',
]

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    brandName: '',
    niche: 'forex_broker',
    targetMarkets: [] as string[],
    brandColors: { primary: '#3b82f6', secondary: '#1e293b', accent: '#f59e0b' },
  })

  const createProject = trpc.project.create.useMutation({
    onSuccess: (project) => {
      router.push(`/dashboard/projects/${project.id}`)
    },
  })

  const toggleMarket = (market: string) => {
    setForm((prev) => ({
      ...prev,
      targetMarkets: prev.targetMarkets.includes(market)
        ? prev.targetMarkets.filter((m) => m !== market)
        : [...prev.targetMarkets, market],
    }))
  }

  const handleSubmit = () => {
    createProject.mutate(form)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-2">Create New Project</h1>
      <p className="text-muted-foreground mb-8">Set up a new trading company website in minutes</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {s}
            </div>
            {s < 3 && <div className={`w-12 h-0.5 ${s < step ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Info</h2>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Project Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="My Trading Project"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Brand Name</label>
            <input
              type="text"
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="AlphaTrading"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Trading Niche</label>
            <select
              value={form.niche}
              onChange={(e) => setForm({ ...form, niche: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {niches.map((n) => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!form.name || !form.brandName}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Target Markets</h2>
          <p className="text-sm text-muted-foreground">Select regions where you want to target customers</p>
          <div className="flex flex-wrap gap-2">
            {markets.map((market) => (
              <button
                key={market}
                onClick={() => toggleMarket(market)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  form.targetMarkets.includes(market)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {market}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={form.targetMarkets.length === 0}
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Brand Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            {(['primary', 'secondary', 'accent'] as const).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-foreground mb-1 capitalize">{key}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.brandColors[key]}
                    onChange={(e) => setForm({ ...form, brandColors: { ...form.brandColors, [key]: e.target.value } })}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <span className="text-sm text-muted-foreground">{form.brandColors[key]}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-muted rounded-xl p-4 mt-4">
            <h3 className="text-sm font-medium text-foreground mb-2">Summary</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><span className="text-foreground">Project:</span> {form.name}</p>
              <p><span className="text-foreground">Brand:</span> {form.brandName}</p>
              <p><span className="text-foreground">Niche:</span> {niches.find((n) => n.value === form.niche)?.label}</p>
              <p><span className="text-foreground">Markets:</span> {form.targetMarkets.join(', ')}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={createProject.isPending}
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
            >
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
