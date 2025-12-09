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
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Globe,
    Youtube,
    Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Simple bar chart component (no external library needed)
function BarChart({ data, height = 200 }: { data: { label: string; value: number; color?: string }[]; height?: number }) {
    const maxValue = Math.max(...data.map(d => d.value))

    return (
        <div className="flex items-end gap-2 justify-between" style={{ height }}>
            {data.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div
                        className={cn(
                            "w-full rounded-t-lg transition-all",
                            item.color || "bg-[#FFC900]"
                        )}
                        style={{
                            height: `${(item.value / maxValue) * 100}%`,
                            minHeight: 4
                        }}
                    />
                    <span className="text-xs text-[#888] truncate w-full text-center">{item.label}</span>
                </div>
            ))}
        </div>
    )
}

// Line chart component
function LineChart({ data, height = 200 }: { data: number[]; height?: number }) {
    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)
    const range = maxValue - minValue || 1

    const points = data.map((value, i) => {
        const x = (i / (data.length - 1)) * 100
        const y = ((maxValue - value) / range) * 100
        return `${x},${y}`
    }).join(' ')

    return (
        <div className="relative" style={{ height }}>
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#333" strokeWidth="0.5" />
                ))}
                {/* Line */}
                <polyline
                    fill="none"
                    stroke="#FFC900"
                    strokeWidth="2"
                    points={points}
                />
                {/* Area */}
                <polygon
                    fill="url(#gradient)"
                    fillOpacity="0.3"
                    points={`0,100 ${points} 100,100`}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFC900" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}

// Donut chart component
function DonutChart({ data, size = 150 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
    const total = data.reduce((sum, d) => sum + d.value, 0)
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
            <svg width={size} height={size} viewBox="0 0 100 100">
                {segments.map((segment, i) => (
                    <path
                        key={i}
                        d={createArc(segment.startAngle, segment.endAngle)}
                        fill={segment.color}
                        className="transition-all hover:opacity-80"
                    />
                ))}
                <circle cx="50" cy="50" r="25" fill="#111" />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="fill-white text-lg font-bold">
                    {total}
                </text>
            </svg>
            <div className="space-y-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-[#888]">{item.label}</span>
                        <span className="text-sm font-bold">{item.value}</span>
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
        totalUsers: 1234,
        newUsersToday: 45,
        totalSearches: 5678,
        apiCalls: 2456,
        userGrowth: [100, 120, 150, 180, 200, 250, 300],
        searchTrends: [50, 80, 120, 90, 150, 180, 200],
        apiUsage: [1000, 1500, 2000, 1800, 2200, 2500, 2456],
        industryBreakdown: [
            { label: 'Tech', value: 450, color: '#3B82F6' },
            { label: 'Health', value: 320, color: '#22C55E' },
            { label: 'Gaming', value: 280, color: '#EF4444' },
            { label: 'Finance', value: 180, color: '#A855F7' },
            { label: 'Other', value: 150, color: '#6B7280' },
        ],
        topSearches: [
            { query: 'AI trends 2025', count: 456 },
            { query: 'Fitness routine', count: 321 },
            { query: 'Stock market', count: 289 },
            { query: 'Gaming setup', count: 245 },
            { query: 'Cooking recipes', count: 198 },
        ],
        dailyStats: [
            { label: 'Mon', value: 120 },
            { label: 'Tue', value: 180 },
            { label: 'Wed', value: 150 },
            { label: 'Thu', value: 220 },
            { label: 'Fri', value: 280 },
            { label: 'Sat', value: 200 },
            { label: 'Sun', value: 160 },
        ]
    })

    useEffect(() => {
        fetchAnalytics()
    }, [dateRange])

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/admin/analytics?range=${dateRange}`)
            const data = await response.json()
            if (data.success) {
                setStats(prev => ({ ...prev, ...data.stats }))
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
            value: stats.totalUsers.toLocaleString(),
            change: '+12%',
            changeType: 'positive',
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'New Today',
            value: stats.newUsersToday.toLocaleString(),
            change: '+8%',
            changeType: 'positive',
            icon: TrendingUp,
            color: 'bg-green-500'
        },
        {
            title: 'Total Searches',
            value: stats.totalSearches.toLocaleString(),
            change: '+25%',
            changeType: 'positive',
            icon: Search,
            color: 'bg-purple-500'
        },
        {
            title: 'API Calls Today',
            value: stats.apiCalls.toLocaleString(),
            change: '-5%',
            changeType: 'negative',
            icon: Zap,
            color: 'bg-orange-500'
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
                        <BarChart3 className="w-8 h-8 text-[#FFC900]" />
                        Analytics
                    </h1>
                    <p className="text-[#888] mt-1">Platform statistics and insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-[#111] border-2 border-[#333] rounded-lg px-4 py-2 focus:border-[#FFC900] focus:outline-none"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                    <button
                        onClick={fetchAnalytics}
                        className="p-2 bg-[#1A1A1A] border-2 border-[#333] rounded-lg hover:border-[#FFC900]"
                    >
                        <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card, i) => (
                    <div key={i} className="bg-[#111] border-2 border-[#222] rounded-xl p-5 hover:border-[#FFC900] transition-all">
                        <div className="flex items-start justify-between">
                            <div className={cn("p-3 rounded-lg", card.color)}>
                                <card.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className={cn(
                                "flex items-center gap-1 text-sm font-semibold",
                                card.changeType === 'positive' ? "text-green-400" : "text-red-400"
                            )}>
                                {card.changeType === 'positive' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {card.change}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-3xl font-black">{card.value}</p>
                            <p className="text-sm text-[#888] mt-1">{card.title}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Charts Row 1 */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                    <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        User Growth
                    </h3>
                    <LineChart data={stats.userGrowth} height={200} />
                    <div className="flex justify-between mt-4 text-xs text-[#888]">
                        <span>Day 1</span>
                        <span>Day 7</span>
                    </div>
                </div>

                {/* Search Activity */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                    <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                        <Search className="w-5 h-5 text-purple-400" />
                        Search Activity
                    </h3>
                    <BarChart data={stats.dailyStats} height={200} />
                </div>
            </motion.div>

            {/* Charts Row 2 */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Industry Breakdown */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                    <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-400" />
                        Users by Industry
                    </h3>
                    <DonutChart data={stats.industryBreakdown} />
                </div>

                {/* Top Searches */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#FFC900]" />
                        Top Searches
                    </h3>
                    <div className="space-y-3">
                        {stats.topSearches.map((search, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="w-6 h-6 bg-[#333] rounded-full flex items-center justify-center text-xs font-bold">
                                    {i + 1}
                                </span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold">{search.query}</span>
                                        <span className="text-sm text-[#888]">{search.count}</span>
                                    </div>
                                    <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#FFC900] rounded-full"
                                            style={{ width: `${(search.count / stats.topSearches[0].count) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* API Usage */}
            <motion.div variants={item} className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    API Usage Over Time
                </h3>
                <LineChart data={stats.apiUsage} height={150} />
                <div className="flex justify-between mt-4 text-xs text-[#888]">
                    <span>7 days ago</span>
                    <span>Today</span>
                </div>
            </motion.div>
        </motion.div>
    )
}
