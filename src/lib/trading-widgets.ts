export interface TradingWidget {
  id: string
  name: string
  type: string
  description: string
  icon: string
  category: string
  embedType: string
  mockData?: unknown
}

export const TRADING_WIDGETS: TradingWidget[] = [
  {
    id: 'price-ticker',
    name: 'Price Ticker',
    type: 'price_ticker',
    description: 'Real-time scrolling price ticker for major instruments (Forex, Crypto, Indices)',
    icon: 'TrendingUp',
    category: 'market_data',
    embedType: 'mock',
    mockData: [
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
    ],
  },
  {
    id: 'economic-calendar',
    name: 'Economic Calendar',
    type: 'economic_calendar',
    description: 'Upcoming high-impact economic events and data releases',
    icon: 'CalendarDays',
    category: 'market_data',
    embedType: 'mock',
    mockData: [
      { date: '2026-03-12', time: '08:30', event: 'US CPI (YoY)', impact: 'high', forecast: '3.1%', previous: '3.0%', currency: 'USD' },
      { date: '2026-03-12', time: '10:00', event: 'ECB Interest Rate Decision', impact: 'high', forecast: '4.25%', previous: '4.50%', currency: 'EUR' },
      { date: '2026-03-13', time: '08:30', event: 'US Initial Jobless Claims', impact: 'medium', forecast: '215K', previous: '210K', currency: 'USD' },
      { date: '2026-03-13', time: '13:30', event: 'UK GDP (QoQ)', impact: 'high', forecast: '0.3%', previous: '0.1%', currency: 'GBP' },
      { date: '2026-03-14', time: '09:00', event: 'US Retail Sales (MoM)', impact: 'high', forecast: '0.5%', previous: '-0.8%', currency: 'USD' },
      { date: '2026-03-14', time: '14:00', event: 'US Michigan Consumer Sentiment', impact: 'medium', forecast: '79.5', previous: '79.6', currency: 'USD' },
    ],
  },
  {
    id: 'trading-calculator',
    name: 'Trading Calculator',
    type: 'trading_calculator',
    description: 'Pip value, margin, and profit/loss calculator for traders',
    icon: 'Calculator',
    category: 'tools',
    embedType: 'custom',
    mockData: {
      calculators: [
        { name: 'Pip Calculator', inputs: ['instrument', 'lotSize', 'accountCurrency'] },
        { name: 'Margin Calculator', inputs: ['instrument', 'lotSize', 'leverage'] },
        { name: 'Profit Calculator', inputs: ['instrument', 'entryPrice', 'exitPrice', 'lotSize'] },
      ],
    },
  },
  {
    id: 'market-sentiment',
    name: 'Market Sentiment',
    type: 'market_sentiment',
    description: 'Bull/Bear gauge showing trader positioning across instruments',
    icon: 'BarChart3',
    category: 'market_data',
    embedType: 'mock',
    mockData: [
      { symbol: 'EUR/USD', bullish: 62, bearish: 38 },
      { symbol: 'GBP/USD', bullish: 45, bearish: 55 },
      { symbol: 'USD/JPY', bullish: 71, bearish: 29 },
      { symbol: 'XAU/USD', bullish: 78, bearish: 22 },
      { symbol: 'BTC/USD', bullish: 85, bearish: 15 },
      { symbol: 'US500', bullish: 55, bearish: 45 },
    ],
  },
]

export function getWidgetById(id: string): TradingWidget | undefined {
  return TRADING_WIDGETS.find((w) => w.id === id)
}

export function getWidgetMockData(id: string): unknown {
  return TRADING_WIDGETS.find((w) => w.id === id)?.mockData
}
