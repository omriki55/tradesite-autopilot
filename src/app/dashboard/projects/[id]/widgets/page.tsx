'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import {
  Puzzle, TrendingUp, CalendarDays, Calculator, BarChart3, Loader2, Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

const widgetIcons: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  CalendarDays: <CalendarDays className="w-6 h-6" />,
  Calculator: <Calculator className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
}

const impactColors: Record<string, string> = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-green-500/20 text-green-400',
}

interface TickerItem { symbol: string; price: number; change: number; pct: string }
interface CalendarItem { date: string; time: string; event: string; impact: string; forecast: string; previous: string; currency: string }
interface SentimentItem { symbol: string; bullish: number; bearish: number }

export default function WidgetsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const { data: allWidgets } = trpc.website.getWidgets.useQuery()
  const { data: activeWidgets, refetch: refetchActive } = trpc.website.getActiveWidgets.useQuery({ projectId: id })
  const [previewId, setPreviewId] = useState<string | null>(null)

  const toggleMutation = trpc.website.toggleWidget.useMutation({
    onSuccess: () => refetchActive(),
  })

  const activeIds = activeWidgets?.map(w => w.id) || []

  function isActive(widgetId: string) {
    return activeIds.includes(widgetId)
  }

  function handleToggle(widgetId: string) {
    toggleMutation.mutate({
      projectId: id,
      widgetId,
      enabled: !isActive(widgetId),
    })
  }

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Trading Widgets" subtitle="Add live market data, calculators, and trading tools to your website">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Available', value: allWidgets?.length || 0, color: 'text-foreground' },
          { label: 'Active', value: activeIds.length, color: 'text-green-400' },
          { label: 'Market Data', value: allWidgets?.filter(w => w.type === 'price_ticker' || w.type === 'economic_calendar' || w.type === 'market_sentiment').length || 0, color: 'text-blue-400' },
          { label: 'Tools', value: allWidgets?.filter(w => w.type === 'trading_calculator').length || 0, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Available Widgets</h2>

      {/* Widget Cards */}
      <div className="grid gap-4 mb-6">
        {allWidgets?.map(widget => {
          const active = isActive(widget.id)
          return (
            <div key={widget.id} className={cn('bg-card border rounded-xl overflow-hidden transition-colors', active ? 'border-primary/40' : 'border-border')}>
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                    {widgetIcons[widget.icon] || <Puzzle className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-foreground">{widget.name}</h3>
                      {active && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/20 text-green-400">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{widget.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPreviewId(previewId === widget.id ? null : widget.id)}
                      className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted"
                    >
                      {previewId === widget.id ? 'Hide Preview' : 'Preview'}
                    </button>
                    <button
                      onClick={() => handleToggle(widget.id)}
                      disabled={toggleMutation.isPending}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        active
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-primary text-primary-foreground hover:opacity-90'
                      )}
                    >
                      {toggleMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Widget Preview */}
              {previewId === widget.id && (
                <div className="border-t border-border bg-background/50 p-5">
                  <WidgetPreview widgetId={widget.id} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Integration Info */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">How Widgets Work</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><span className="text-primary font-bold">1.</span> Enable the widgets you want on your trading website</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">2.</span> Widgets are automatically included when you export your site as HTML</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">3.</span> Mock data is used for preview — connect real APIs for live data in production</li>
          <li className="flex items-start gap-2"><span className="text-primary font-bold">4.</span> Supported: TradingView embeds, custom calculators, and mock market data</li>
        </ul>
      </div>
    </PhaseLayout>
  )
}

/* ─── Widget Preview Components ─────────────────────────── */

function WidgetPreview({ widgetId }: { widgetId: string }) {
  switch (widgetId) {
    case 'price-ticker': return <PriceTickerPreview />
    case 'economic-calendar': return <EconomicCalendarPreview />
    case 'trading-calculator': return <TradingCalculatorPreview />
    case 'market-sentiment': return <MarketSentimentPreview />
    default: return <p className="text-sm text-muted-foreground">No preview available</p>
  }
}

function PriceTickerPreview() {
  const items: TickerItem[] = [
    { symbol: 'EUR/USD', price: 1.0842, change: +0.0015, pct: '+0.14%' },
    { symbol: 'GBP/USD', price: 1.2654, change: -0.0023, pct: '-0.18%' },
    { symbol: 'USD/JPY', price: 149.32, change: +0.45, pct: '+0.30%' },
    { symbol: 'BTC/USD', price: 67245, change: +1250, pct: '+1.89%' },
    { symbol: 'ETH/USD', price: 3521, change: +85, pct: '+2.47%' },
    { symbol: 'XAU/USD', price: 2345.60, change: +12.30, pct: '+0.53%' },
    { symbol: 'US30', price: 39245, change: -125, pct: '-0.32%' },
    { symbol: 'NAS100', price: 17892, change: +156, pct: '+0.88%' },
    { symbol: 'US500', price: 5234, change: +18, pct: '+0.35%' },
    { symbol: 'CRUDE', price: 78.45, change: -0.85, pct: '-1.07%' },
  ]

  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Price Ticker Preview</h4>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map(item => (
          <div key={item.symbol} className="flex-shrink-0 bg-card border border-border rounded-lg px-4 py-3 min-w-[140px]">
            <p className="text-xs font-semibold text-muted-foreground">{item.symbol}</p>
            <p className="text-lg font-bold text-foreground">{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className={cn('text-xs font-medium', item.change >= 0 ? 'text-green-400' : 'text-red-400')}>
              {item.change >= 0 ? '+' : ''}{item.change} ({item.pct})
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function EconomicCalendarPreview() {
  const events: CalendarItem[] = [
    { date: '2026-03-12', time: '08:30', event: 'US CPI (YoY)', impact: 'high', forecast: '3.1%', previous: '3.0%', currency: 'USD' },
    { date: '2026-03-12', time: '10:00', event: 'ECB Interest Rate Decision', impact: 'high', forecast: '4.25%', previous: '4.50%', currency: 'EUR' },
    { date: '2026-03-13', time: '08:30', event: 'US Initial Jobless Claims', impact: 'medium', forecast: '215K', previous: '210K', currency: 'USD' },
    { date: '2026-03-13', time: '13:30', event: 'UK GDP (QoQ)', impact: 'high', forecast: '0.3%', previous: '0.1%', currency: 'GBP' },
    { date: '2026-03-14', time: '09:00', event: 'US Retail Sales (MoM)', impact: 'high', forecast: '0.5%', previous: '-0.8%', currency: 'USD' },
    { date: '2026-03-14', time: '14:00', event: 'US Michigan Consumer Sentiment', impact: 'medium', forecast: '79.5', previous: '79.6', currency: 'USD' },
  ]

  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Economic Calendar Preview</h4>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 gap-2 px-4 py-2 bg-muted/50 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Date/Time</span><span>Event</span><span>Impact</span><span>Currency</span><span>Forecast</span><span>Previous</span>
        </div>
        {events.map((ev, i) => (
          <div key={i} className="grid grid-cols-6 gap-2 px-4 py-2.5 border-t border-border/50 text-sm items-center">
            <span className="text-xs text-muted-foreground">{ev.date}<br />{ev.time}</span>
            <span className="text-foreground font-medium text-xs">{ev.event}</span>
            <span><span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', impactColors[ev.impact])}>{ev.impact}</span></span>
            <span className="text-xs font-semibold text-foreground">{ev.currency}</span>
            <span className="text-xs text-foreground">{ev.forecast}</span>
            <span className="text-xs text-muted-foreground">{ev.previous}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TradingCalculatorPreview() {
  const [calcType, setCalcType] = useState<'pip' | 'margin' | 'profit'>('pip')
  const [instrument, setInstrument] = useState('EUR/USD')
  const [lotSize, setLotSize] = useState('1.0')
  const [leverage, setLeverage] = useState('100')
  const [entryPrice, setEntryPrice] = useState('1.0840')
  const [exitPrice, setExitPrice] = useState('1.0890')

  function calculate() {
    const lots = parseFloat(lotSize) || 1
    if (calcType === 'pip') {
      const pipValue = lots * 10
      return { label: 'Pip Value', value: `$${pipValue.toFixed(2)}` }
    }
    if (calcType === 'margin') {
      const lev = parseFloat(leverage) || 100
      const margin = (lots * 100000) / lev
      return { label: 'Required Margin', value: `$${margin.toLocaleString(undefined, { minimumFractionDigits: 2 })}` }
    }
    const entry = parseFloat(entryPrice) || 0
    const exit = parseFloat(exitPrice) || 0
    const pips = (exit - entry) * 10000
    const profit = pips * lots * 10
    return { label: 'Profit/Loss', value: `$${profit.toFixed(2)} (${pips.toFixed(1)} pips)` }
  }

  const result = calculate()

  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Trading Calculator Preview</h4>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex gap-2 mb-4">
          {(['pip', 'margin', 'profit'] as const).map(t => (
            <button key={t} onClick={() => setCalcType(t)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', calcType === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
              {t} Calculator
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Instrument</label>
            <select value={instrument} onChange={e => setInstrument(e.target.value)} className="w-full mt-1 px-2 py-1.5 rounded border border-border text-sm bg-background text-foreground">
              <option>EUR/USD</option><option>GBP/USD</option><option>USD/JPY</option><option>XAU/USD</option><option>BTC/USD</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Lot Size</label>
            <input type="number" value={lotSize} onChange={e => setLotSize(e.target.value)} step="0.01" className="w-full mt-1 px-2 py-1.5 rounded border border-border text-sm bg-background text-foreground" />
          </div>
          {calcType === 'margin' && (
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Leverage</label>
              <select value={leverage} onChange={e => setLeverage(e.target.value)} className="w-full mt-1 px-2 py-1.5 rounded border border-border text-sm bg-background text-foreground">
                <option value="50">1:50</option><option value="100">1:100</option><option value="200">1:200</option><option value="500">1:500</option>
              </select>
            </div>
          )}
          {calcType === 'profit' && (
            <>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Entry Price</label>
                <input type="number" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} step="0.0001" className="w-full mt-1 px-2 py-1.5 rounded border border-border text-sm bg-background text-foreground" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Exit Price</label>
                <input type="number" value={exitPrice} onChange={e => setExitPrice(e.target.value)} step="0.0001" className="w-full mt-1 px-2 py-1.5 rounded border border-border text-sm bg-background text-foreground" />
              </div>
            </>
          )}
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">{result.label}</p>
          <p className="text-2xl font-bold text-primary">{result.value}</p>
        </div>
      </div>
    </div>
  )
}

function MarketSentimentPreview() {
  const items: SentimentItem[] = [
    { symbol: 'EUR/USD', bullish: 62, bearish: 38 },
    { symbol: 'GBP/USD', bullish: 45, bearish: 55 },
    { symbol: 'USD/JPY', bullish: 71, bearish: 29 },
    { symbol: 'XAU/USD', bullish: 78, bearish: 22 },
    { symbol: 'BTC/USD', bullish: 85, bearish: 15 },
    { symbol: 'US500', bullish: 55, bearish: 45 },
  ]

  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Market Sentiment Preview</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map(item => (
          <div key={item.symbol} className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs font-semibold text-foreground mb-2">{item.symbol}</p>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${item.bullish}%` }} />
              </div>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-green-400 font-semibold">{item.bullish}% Bull</span>
              <span className="text-red-400 font-semibold">{item.bearish}% Bear</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
