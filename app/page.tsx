"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TrendingUp, TrendingDown, Activity, Search, Trophy, Briefcase, BarChart2, User } from "lucide-react"

const INITIAL_PLAYERS = [
  { id: 1, name: "Nikola Jokic", team: "DEN", position: "C", price: 8901, change: 445, changePct: 5.26 },
  { id: 2, name: "LeBron James", team: "LAL", position: "SF", price: 8542, change: 234, changePct: 2.82 },
  { id: 3, name: "Giannis Antetokounmpo", team: "MIL", position: "PF", price: 8123, change: 312, changePct: 4.00 },
  { id: 4, name: "Stephen Curry", team: "GSW", position: "PG", price: 7891, change: -156, changePct: -1.94 },
  { id: 5, name: "Luka Doncic", team: "DAL", position: "PG", price: 7654, change: 189, changePct: 2.53 },
  { id: 6, name: "Shai Gilgeous-Alexander", team: "OKC", position: "SG", price: 7432, change: 267, changePct: 3.73 },
  { id: 7, name: "Victor Wembanyama", team: "SAS", position: "C", price: 6987, change: 605, changePct: 9.53 },
  { id: 8, name: "Tyrese Haliburton", team: "IND", position: "PG", price: 5821, change: -267, changePct: -4.37 },
  { id: 9, name: "Jayson Tatum", team: "BOS", position: "SF", price: 7215, change: 143, changePct: 2.02 },
  { id: 10, name: "Kevin Durant", team: "PHX", position: "SF", price: 7098, change: -89, changePct: -1.24 },
  { id: 11, name: "Anthony Edwards", team: "MIN", position: "SG", price: 6543, change: 321, changePct: 5.16 },
  { id: 12, name: "Devin Booker", team: "PHX", position: "SG", price: 6234, change: -112, changePct: -1.77 },
]

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

export default function MarketPage() {
  const [chips, setChips] = useState(10000)
  const [portfolio, setPortfolio] = useState<Record<number, { shares: number; avgCost: number }>>({})
  const [players, setPlayers] = useState(INITIAL_PLAYERS)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("price")
  const [toast, setToast] = useState<{ msg: string; type: "buy" | "sell" } | null>(null)

  // Simulate price fluctuation every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(prev => prev.map(p => {
        const delta = Math.floor((Math.random() - 0.48) * 120)
        const newPrice = Math.max(1000, p.price + delta)
        const newChange = p.change + delta
        const newPct = parseFloat(((newChange / (newPrice - newChange)) * 100).toFixed(2))
        return { ...p, price: newPrice, change: newChange, changePct: newPct }
      }))
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const showToast = (msg: string, type: "buy" | "sell") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleBuy = (player: typeof INITIAL_PLAYERS[0]) => {
    if (chips < player.price) {
      showToast("Not enough chips!", "sell")
      return
    }
    setChips(c => c - player.price)
    setPortfolio(p => {
      const existing = p[player.id]
      if (existing) {
        const totalShares = existing.shares + 1
        const avgCost = Math.floor((existing.avgCost * existing.shares + player.price) / totalShares)
        return { ...p, [player.id]: { shares: totalShares, avgCost } }
      }
      return { ...p, [player.id]: { shares: 1, avgCost: player.price } }
    })
    showToast(`Bought 1 share of ${player.name}`, "buy")
  }

  const handleSell = (player: typeof INITIAL_PLAYERS[0]) => {
    const holding = portfolio[player.id]
    if (!holding || holding.shares === 0) {
      showToast("You don't own this stock!", "sell")
      return
    }
    setChips(c => c + player.price)
    setPortfolio(p => {
      const newShares = p[player.id].shares - 1
      if (newShares === 0) {
        const updated = { ...p }
        delete updated[player.id]
        return updated
      }
      return { ...p, [player.id]: { ...p[player.id], shares: newShares } }
    })
    showToast(`Sold 1 share of ${player.name}`, "sell")
  }

  const topGainer = [...players].sort((a, b) => b.changePct - a.changePct)[0]
  const topLoser = [...players].sort((a, b) => a.changePct - b.changePct)[0]
  const avgChange = (players.reduce((s, p) => s + p.changePct, 0) / players.length).toFixed(2)

  const filtered = players
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price") return b.price - a.price
      if (sortBy === "change") return b.changePct - a.changePct
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <TrendingUp size={16} className="text-black" />
          </div>
          <span className="font-bold text-lg">BallStock</span>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/" className="px-4 py-2 rounded-lg bg-white/10 text-sm font-medium flex items-center gap-2">
            <BarChart2 size={14} /> Market
          </Link>
          <Link href="/portfolio" className="px-4 py-2 rounded-lg text-white/60 hover:text-white text-sm font-medium flex items-center gap-2">
            <Briefcase size={14} /> Portfolio
          </Link>
          <Link href="/leaderboard" className="px-4 py-2 rounded-lg text-white/60 hover:text-white text-sm font-medium flex items-center gap-2">
            <Trophy size={14} /> Leaderboard
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-2 rounded-lg text-sm">
            Balance: <span className="text-green-400 font-bold">{chips.toLocaleString()}</span> chips
          </div>
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <User size={14} />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-1">Market</h1>
        <p className="text-white/50 mb-6">Trade stock in your favorite NBA players</p>

        {/* Ticker cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-400 text-sm mb-2"><TrendingUp size={14} /> Top Gainer</div>
            <div className="font-bold text-lg">{topGainer.name}</div>
            <div className="text-green-400 font-bold">+{topGainer.changePct}%</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-400 text-sm mb-2"><TrendingDown size={14} /> Top Loser</div>
            <div className="font-bold text-lg">{topLoser.name}</div>
            <div className="text-red-400 font-bold">{topLoser.changePct}%</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-2"><Activity size={14} /> Market Average</div>
            <div className="font-bold text-lg">All Players</div>
            <div className={`font-bold ${parseFloat(avgChange) >= 0 ? "text-green-400" : "text-red-400"}`}>
              {parseFloat(avgChange) >= 0 ? "+" : ""}{avgChange}%
            </div>
          </div>
        </div>

        {/* Search + Sort */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30"
              placeholder="Search players or teams..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-white/50">
            Sort by:
            <select
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="price">Price</option>
              <option value="change">% Change</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Player grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(player => {
            const holding = portfolio[player.id]
            const isUp = player.change >= 0
            return (
              <div key={player.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                      {getInitials(player.name)}
                    </div>
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-white/40 text-xs">{player.team} · {player.position}</div>
                    </div>
                  </div>
                  {holding && (
                    <div className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/20">
                      {holding.shares} owned
                    </div>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold">{player.price.toLocaleString()} <span className="text-sm font-normal text-white/40">chips</span></div>
                    <div className={`text-sm font-medium ${isUp ? "text-green-400" : "text-red-400"}`}>
                      {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{player.change} ({isUp ? "+" : ""}{player.changePct}%)
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSell(player)}
                      className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors"
                    >
                      Sell
                    </button>
                    <button
                      onClick={() => handleBuy(player)}
                      className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-black text-sm font-bold transition-colors"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${
          toast.type === "buy" ? "bg-green-500 text-black" : "bg-red-500 text-white"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
