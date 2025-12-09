'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart3,
    TrendingUp,
    Users,
    Search,
    Zap,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Simple bar chart component - Neo-Brutalist Style
function BarChart({ data, height = 200 }: { data: { label: string; value: number }[]; height?: number }) {
    const maxValue = Math.max(...data.map(d => d.value), 1)

    return (
        <div className="flex items-end gap-2 justify-between" style={{ height }}>
            {data.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div
                        className="w-full bg-[#FFC900] border-2 border-black transition-all hover:bg-[#FF90E8]"
                        style={{
                            height: `${(item.value / maxValue) * 100}%`,
                            minHeight: 4
                        }}
                    />
                    <span className="text-xs text-black/60 font-bold truncate w-full text-center uppercase">{item.label}</span>
                </div>
            ))}
        </div>
    )
}

// Line chart component - Neo-Brutalist Style
function LineChart({ data, height = 200 }: { data: number[]; height?: number }) {
    const maxValue = Math.max(...data, 1)
    const minValue = Math.min(...data)
    const range = maxValue - minValue || 1

    const points = data.map((value, i) => {
        const x = (i / (data.length - 1)) * 100
        const y = ((maxValue - value) / range) * 100
        return `${x},${y}`
    }).join(' ')

    return (
        <div className="relative border-2 border-black bg-white" style={{ height }}>
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#000" strokeWidth="0.2" strokeDasharray="2,2" />
                ))}
                {/* Area */}
                <polygon
                    fill="#FFC900"
                    fillOpacity="0.3"
                    points={`0,100 ${points} 100,100`}
                />
                {/* Line */}
                <polyline
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    points={points}
                />
            </svg>
        </div>
    )
}

// Donut chart component - Neo-Brutalist Style
function DonutChart({ data, size = 150 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1
    let currentAngle = 0

    const segments = data.map(item => {
        const angle = (item.value / total) * 360
        const segment = {
            ...item,
            startAngle: currentAngle,
            endAngle: currentAngle + angle
        }
        currentAngle += angle
        return segment
    })

    const createArc = (startAngle: number, endAngle: number) => {
        const start = (startAngle - 90) * (Math.PI / 180)
        const end = (endAngle - 90) * (Math.PI / 180)
        const radius = 40
        const x1 = 50 + radius * Math.cos(start)
        const y1 = 50 + radius * Math.sin(start)
        const x2 = 50 + radius * Math.cos(end)
        const y2 = 50 + radius * Math.sin(end)
        const largeArc = endAngle - startAngle > 180 ? 1 : 0
        return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    }

    return (
        <div className="flex items-center gap-6">
            <div className="border-2 border-black bg-white p-2">
                <svg width={size} height={size} viewBox="0 0 100 100">
                    {segments.map((segment, i) => (
                        <path
                            key={i}
                            d={createArc(segment.startAngle, segment.endAngle)}
                            fill={segment.color}
                            stroke="#000"
                            strokeWidth="1"
                            className="transition-all hover:opacity-80"
                        />
                    ))}
                    <circle cx="50" cy="50" r="25" fill="white" stroke="#000" strokeWidth="2" />
                    <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="fill-black text-lg font-black">
                        {total}
                    </text>
                </svg>
            </div>
            <div className="space-y-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-black" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-bold uppercase">{item.label}</span>
                        <span className="text-sm font-black">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState('7d')
    const [stats, setStats] = useState({
        totalUsers: 0,
        newUsersToday: 0,
        totalSearches: 0,
        apiCalls: 0,
        userGrowth: [0, 0, 0, 0, 0, 0, 0],
        searchTrends: [0, 0, 0, 0, 0, 0, 0],
        apiUsage: [0, 0, 0, 0, 0, 0, 0],
        industryBreakdown: [] as { label: string; value: number; color: string }[],
        topSearches: [] as { query: string; count: number }[],
        dailyStats: [] as { label: string; value: number }[],
        recentActivity: [] as { action: string; email: string; time: string; type: string }[]
    })

    useEffect(() => {
        fetchAnalytics()
    }, [dateRange])

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/admin/analytics?range=${dateRange}`)
            const data = await response.json()
            if (data.success && data.stats) {
                setStats(data.stats)
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    const summaryCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            change: stats.newUsersToday > 0 ? `+${stats.newUsersToday}` : '0',
            changeType: stats.newUsersToday > 0 ? 'positive' : 'neutral',
            icon: Users,
            color: 'bg-[#00F0FF]'
        },
        {
            title: 'New Today',
            value: stats.newUsersToday,
            change: stats.newUsersToday > 0 ? 'Growing' : 'Stable',
            changeType: stats.newUsersToday > 0 ? 'positive' : 'neutral',
            icon: TrendingUp,
            color: 'bg-[#B1F202]'
        },
        {
            title: 'Total Searches',
            value: stats.totalSearches,
            change: stats.totalSearches > 0 ? 'Active' : 'No data',
            changeType: stats.totalSearches > 0 ? 'positive' : 'neutral',
            icon: Search,
            color: 'bg-[#FF90E8]'
        },
        {
            title: 'API Calls',
            value: stats.apiCalls,
            change: 'Tracked',
            changeType: 'neutral',
            icon: Zap,
            color: 'bg-[#FFC900]'
        }
    ]

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-8 h-8" />
                        Analytics
                    </h1>
                    <p className="text-black/60 mt-1 font-medium">Real-time platform statistics and insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-white border-2 border-black px-4 py-2 font-bold focus:ring-2 focus:ring-[#FFC900] focus:outline-none"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                    <button
                        onClick={fetchAnalytics}
                        className="p-2 bg-white border-2 border-black hover:bg-[#FFC900] transition-colors"
                    >
                        <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card, i) => (
                    <div key={i} className="bg-white border-4 border-black p-5 shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
                        <div className="flex items-start justify-between">
                            <div className={cn("p-3 border-2 border-black", card.color)}>
                                <card.icon className="w-5 h-5 text-black" />
                            </div>
                            <span className={cn(
                                "flex items-center gap-1 text-sm font-black uppercase",
                                card.changeType === 'positive' ? "text-green-600" : "text-black/50"
                            )}>
                                {card.changeType === 'positive' && <ArrowUpRight className="w-4 h-4" />}
                                {card.change}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-4xl font-black">{card.value.toLocaleString()}</p>
                            <p className="text-sm text-black/60 mt-1 font-bold uppercase">{card.title}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Charts Row 1 */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth */}
                <div className="bg-white border-4 border-black p-6 shadow-brutal">
                    <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        User Growth (7 Days)
                    </h3>
                    <LineChart data={stats.userGrowth} height={200} />
                    <div className="flex justify-between mt-4 text-xs text-black/60 font-bold uppercase">
                        <span>Day 1</span>
                        <span>Day 7</span>
                    </div>
                </div>

                {/* Daily Activity */}
                <div className="bg-white border-4 border-black p-6 shadow-brutal">
                    <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Daily Activity
                    </h3>
                    {stats.dailyStats.length > 0 ? (
                        <BarChart data={stats.dailyStats} height={200} />
                    ) : (
                        <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-black/20">
                            <p className="text-black/40 font-bold">No activity data yet</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Charts Row 2 */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Industry Breakdown */}
                <div className="bg-white border-4 border-black p-6 shadow-brutal">
                    <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Users by Industry
                    </h3>
                    {stats.industryBreakdown.length > 0 ? (
                        <DonutChart data={stats.industryBreakdown} />
                    ) : (
                        <div className="h-[150px] flex items-center justify-center border-2 border-dashed border-black/20">
                            <p className="text-black/40 font-bold">No industry data</p>
                        </div>
                    )}
                </div>

                {/* Top Searches */}
                <div className="bg-white border-4 border-black p-6 shadow-brutal lg:col-span-2">
                    <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Top Searches
                    </h3>
                    {stats.topSearches.length > 0 ? (
                        <div className="space-y-3">
                            {stats.topSearches.map((search, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <span className="w-8 h-8 bg-[#FFC900] border-2 border-black flex items-center justify-center text-sm font-black">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold">{search.query}</span>
                                            <span className="text-sm font-black">{search.count}</span>
                                        </div>
                                        <div className="h-2 bg-[#F5F5F0] border border-black overflow-hidden">
                                            <div
                                                className="h-full bg-[#FF90E8]"
                                                style={{ width: `${(search.count / (stats.topSearches[0]?.count || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-[150px] flex items-center justify-center border-2 border-dashed border-black/20">
                            <p className="text-black/40 font-bold">No search data yet</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={item} className="bg-white border-4 border-black p-6 shadow-brutal">
                <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                </h3>
                {stats.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                        {stats.recentActivity.map((activity, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 bg-[#F5F5F0] border-2 border-black hover:bg-[#FFC900]/20 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-3 h-3 border border-black",
                                        activity.type === 'system' && "bg-[#00F0FF]",
                                        activity.type === 'user' && "bg-[#B1F202]",
                                        activity.type === 'search' && "bg-[#FF90E8]",
                                        activity.type === 'admin' && "bg-[#FFC900]"
                                    )} />
                                    <span className="text-sm font-bold">{activity.action}</span>
                                    {activity.email && (
                                        <span className="text-xs text-black/50 font-medium">({activity.email})</span>
                                    )}
                                </div>
                                <span className="text-xs text-black/60 font-bold">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-[100px] flex items-center justify-center border-2 border-dashed border-black/20">
                        <p className="text-black/40 font-bold">No recent activity</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}
