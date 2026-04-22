"use client"

import Link from "next/link"
import { TrendingUp, TrendingDown, Briefcase, Trophy, BarChart2, User } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const DEMO_HOLDINGS = [
  { id: 2, name: "LeBron James", team: "LAL", position: "SF", shares: 2, avgCost: 8200, currentPrice: 8542, changePct: 2.82 },
  { id: 1, name: "Nikola Jokic", team: "DEN", position: "C", shares: 3, avgCost: 8500, currentPrice: 8901, changePct: 5.26 },
  { id: 7, name: "Victor Wembanyama", team: "SAS", position: "C", shares: 1, avgCost: 6200, currentPrice: 6987, changePct: 9.53 },
  { id: 4, name: "Stephen Curry", team: "GSW", position: "PG", shares: 2, avgCost: 8100, currentPrice: 7891, changePct: -1.94 },
]

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

// Generate portfolio value history — starts lower, trends up with dips
function generatePortfolioHistory(currentTotal: number) {
  const points = 24
  const data = []
  let val = currentTotal * 0.88
  const hours = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am",
    "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "Now"]
  for (let i = 0; i < points; i++) {
    val = Math.max(currentTotal * 0.8, val + (Math.random() - 0.42) * (currentTotal * 0.018))
    data.push({ time: hours[i], value: Math.round(val) })
  }
  data[data.length - 1].value = currentTotal
  return data
}

export default function PortfolioPage() {
  const chipBalance = 10000
  const totalPortfolioValue = DEMO_HOLDINGS.reduce((sum, h) => sum + h.currentPrice * h.shares, 0)
  const totalCost = DEMO_HOLDINGS.reduce((sum, h) => sum + h.avgCost * h.shares, 0)
  const totalGainLoss = totalPortfolioValue - totalCost
  const totalGainLossPct = ((totalGainLoss / totalCost) * 100).toFixed(2)
  const totalValue = chipBalance + totalPortfolioValue

  const portfolioHistory = generatePortfolioHistory(totalValue)
  const startValue = portfolioHistory[0].value
  const isPortfolioUp = totalValue >= startValue

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <TrendingUp size={16} className="text-black" />
          </div>
          <span className="font-bold text-lg">BallStock</span>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/" className="px-4 py-2 rounded-lg text-white/60 hover:text-white text-sm font-medium flex items-center gap-2">
            <BarChart2 size={14} /> Market
          </Link>
          <Link href="/portfolio" className="px-4 py-2 rounded-lg bg-white/10 text-sm font-medium flex items-center gap-2">
            <Briefcase size={14} /> Portfolio
          </Link>
          <Link href="/leaderboard" className="px-4 py-2 rounded-lg text-white/60 hover:text-white text-sm font-medium flex items-center gap-2">
            <Trophy size={14} /> Leaderboard
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-2 rounded-lg text-sm">
            Balance: <span className="text-green-400 font-bold">{chipBalance.toLocaleString()}</span> chips
          </div>
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <User size={14} />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-1">My Portfolio</h1>
        <p className="text-white/50 mb-6">Track your holdings and performance</p>

        {/* Total value + chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-white/40 text-sm mb-1">Total Portfolio Value</div>
              <div className="text-4xl font-bold">{totalValue.toLocaleString()} <span className="text-lg font-normal text-white/40">chips</span></div>
              <div className={`text-sm mt-1 font-medium ${isPortfolioUp ? "text-green-400" : "text-red-400"}`}>
                {isPortfolioUp ? "▲" : "▼"} {isPortfolioUp ? "+" : ""}{(totalValue - startValue).toLocaleString()} today
                <span className="text-white/30 ml-2">({isPortfolioUp ? "+" : ""}{(((totalValue - startValue) / startValue) * 100).toFixed(2)}%)</span>
              </div>
            </div>
            <div className="text-right text-sm text-white/30">
              <div>24h chart</div>
            </div>
          </div>

          <div className="h-52 mt-4 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioHistory}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={5}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  width={35}
                />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
                  formatter={(val: number) => [`${val.toLocaleString()} chips`, "Total Value"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPortfolioUp ? "#22c55e" : "#ef4444"}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: isPortfolioUp ? "#22c55e" : "#ef4444" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 text-white/40 text-sm mb-2"><Briefcase size={14} /> Chip Balance</div>
            <div className="text-2xl font-bold">{chipBalance.toLocaleString()}</div>
            <div className="text-white/40 text-sm mt-1">Available to trade</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 text-white/40 text-sm mb-2"><BarChart2 size={14} /> Holdings Value</div>
            <div className="text-2xl font-bold">{totalPortfolioValue.toLocaleString()}</div>
            <div className="text-white/40 text-sm mt-1">{DEMO_HOLDINGS.length} positions</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
              {totalGainLoss >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} Total Gain/Loss
            </div>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
              {totalGainLoss >= 0 ? "+" : ""}{totalGainLoss.toLocaleString()}
            </div>
            <div className={`text-sm mt-1 ${totalGainLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
              {totalGainLoss >= 0 ? "+" : ""}{totalGainLossPct}%
            </div>
          </div>
        </div>

        {/* Holdings table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="font-bold text-lg">Holdings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-3 text-white/40 text-sm font-medium">Player</th>
                  <th className="text-right px-4 py-3 text-white/40 text-sm font-medium">Shares</th>
                  <th className="text-right px-4 py-3 text-white/40 text-sm font-medium">Avg Cost</th>
                  <th className="text-right px-4 py-3 text-white/40 text-sm font-medium">Current Price</th>
                  <th className="text-right px-4 py-3 text-white/40 text-sm font-medium">Market Value</th>
                  <th className="text-right px-4 py-3 text-white/40 text-sm font-medium">Gain/Loss</th>
                  <th className="text-right px-6 py-3 text-white/40 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_HOLDINGS.map(h => {
                  const marketValue = h.currentPrice * h.shares
                  const gainLoss = (h.currentPrice - h.avgCost) * h.shares
                  const gainLossPct = (((h.currentPrice - h.avgCost) / h.avgCost) * 100).toFixed(2)
                  const isUp = gainLoss >= 0
                  return (
                    <tr key={h.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                            {getInitials(h.name)}
                          </div>
                          <div>
                            <div className="font-medium">{h.name}</div>
                            <div className="text-white/40 text-xs">{h.team} - {h.position}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-medium">{h.shares}</td>
                      <td className="px-4 py-4 text-right text-white/60">{h.avgCost.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-medium">{h.currentPrice.toLocaleString()}</span>
                        <span className={`text-xs ml-1 ${h.changePct >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {h.changePct >= 0 ? "+" : ""}{h.changePct}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-medium">{marketValue.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right">
                        <div className={`font-medium ${isUp ? "text-green-400" : "text-red-400"}`}>
                          {isUp ? "▲ +" : "▼ "}{gainLoss.toLocaleString()} ({isUp ? "+" : ""}{gainLossPct}%)
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors">
                            Sell
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-400 text-black text-xs font-bold transition-colors">
                            Buy
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
