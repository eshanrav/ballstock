"use client"

import Link from "next/link"
import { TrendingUp, Trophy, Briefcase, BarChart2, User, Crown, Medal } from "lucide-react"

const LEADERBOARD = [
  { rank: 1, username: "TradeKing_23", chips: 2456, portfolio: 45678, total: 48134 },
  { rank: 2, username: "HoopsMaster", chips: 5123, portfolio: 38234, total: 43357 },
  { rank: 3, username: "BallStreet", chips: 8901, portfolio: 32100, total: 41001 },
  { rank: 4, username: "StockSzn", chips: 3200, portfolio: 29800, total: 33000 },
  { rank: 5, username: "CourtVision", chips: 7654, portfolio: 22100, total: 29754 },
  { rank: 6, username: "NBAInvestor", chips: 9100, portfolio: 18900, total: 28000 },
  { rank: 7, username: "DraftDay", chips: 4500, portfolio: 21200, total: 25700 },
  { rank: 8, username: "RookieRich", chips: 6700, portfolio: 16800, total: 23500 },
  { rank: 9, username: "SwingTrade", chips: 2100, portfolio: 19800, total: 21900 },
  { rank: 10, username: "BenchWarmer", chips: 8900, portfolio: 10200, total: 19100 },
]

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

const podiumOrder = [LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]]

export default function LeaderboardPage() {
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
          <Link href="/portfolio" className="px-4 py-2 rounded-lg text-white/60 hover:text-white text-sm font-medium flex items-center gap-2">
            <Briefcase size={14} /> Portfolio
          </Link>
          <Link href="/leaderboard" className="px-4 py-2 rounded-lg bg-white/10 text-sm font-medium flex items-center gap-2">
            <Trophy size={14} /> Leaderboard
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-2 rounded-lg text-sm">
            Balance: <span className="text-green-400 font-bold">10,000</span> chips
          </div>
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <User size={14} />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-1">Leaderboard</h1>
        <p className="text-white/50 mb-8">Top traders ranked by total portfolio value</p>

        <div className="grid grid-cols-3 gap-4 mb-8 items-end">
          {podiumOrder.map((user) => {
            const isFirst = user.rank === 1
            const borderColor = isFirst ? "border-yellow-500/50" : user.rank === 2 ? "border-white/20" : "border-orange-500/30"
            const bgColor = isFirst ? "bg-yellow-500/5" : "bg-white/5"
            const iconColor = isFirst ? "text-yellow-400" : user.rank === 2 ? "text-white/60" : "text-orange-400"
            return (
              <div key={user.rank} className={`${bgColor} border ${borderColor} rounded-xl p-5 text-center ${isFirst ? "py-8" : ""}`}>
                <div className={`flex justify-center mb-3 ${iconColor}`}>
                  {isFirst ? <Crown size={24} /> : <Medal size={20} />}
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  {getInitials(user.username)}
                </div>
                <div className="font-bold mb-1">{user.username}</div>
                <div className="text-2xl font-bold mb-1">{user.total.toLocaleString()}</div>
                <div className="text-white/40 text-xs mb-2">Total Value</div>
                <div className="text-white/40 text-xs flex items-center justify-center gap-2">
                  <span>{user.chips.toLocaleString()} chips</span>
                  <span>|</span>
                  <span>{user.portfolio.toLocaleString()} portfolio</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="font-bold text-lg">Full Rankings</h2>
          </div>
          {LEADERBOARD.map((user, i) => {
            const isTop3 = user.rank <= 3
            const medals = ["🥇", "🥈", "🥉"]
            return (
              <div key={user.rank} className={`flex items-center justify-between px-6 py-4 border-b border-white/5 hover:bg-white/3 transition-colors ${isTop3 ? "bg-white/3" : ""}`}>
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-bold text-white/40">
                    {isTop3 ? medals[i] : `#${user.rank}`}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                    {getInitials(user.username)}
                  </div>
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-white/40 text-xs">{user.chips.toLocaleString()} chips + {user.portfolio.toLocaleString()} portfolio</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{user.total.toLocaleString()}</div>
                  <div className="text-white/40 text-xs">Total Value</div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
