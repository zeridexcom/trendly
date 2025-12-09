'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    TrendingUp,
    Youtube,
    Zap,
    RefreshCw,
    Clock,
    CheckCircle,
    AlertCircle,
    Globe,
    Database,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Play,
    Search,
    Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CacheStatus {
    last_google_refresh: string | null
    last_youtube_refresh: string | null
    google_trends_count: number
    youtube_videos_count: number
    refresh_status: string
    last_error: string | null
}

interface Stats {
    totalUsers: number
    activeToday: number
    totalSearches: number
    apiCallsToday: number
    trendsCount: number
    videosCount: number
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function AdminDashboard() {
    const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null)
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        activeToday: 0,
        totalSearches: 0,
        apiCallsToday: 0,
        trendsCount: 0,
        videosCount: 0
    })
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [recentActivity, setRecentActivity] = useState<any[]>([])

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            // Fetch cache status
            const cacheResponse = await fetch('/api/admin/refresh-cache')
            const cacheData = await cacheResponse.json()
            if (cacheData.cache) {
                setCacheStatus(cacheData.cache)
                setStats(prev => ({
                    ...prev,
                    trendsCount: cacheData.cache.google_trends_count || 0,
                    videosCount: cacheData.cache.youtube_videos_count || 0
                }))
            }

            // Fetch user stats
            const statsResponse = await fetch('/api/admin/stats')
            const statsData = await statsResponse.json()
            if (statsData.success) {
                setStats(prev => ({
                    ...prev,
                    totalUsers: statsData.totalUsers || 0,
                    activeToday: statsData.activeToday || 0,
                    totalSearches: statsData.totalSearches || 0,
                    apiCallsToday: statsData.apiCallsToday || 0
                }))
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const refreshCache = async () => {
        setRefreshing(true)
        try {
            const response = await fetch('/api/admin/refresh-cache?key=trendly-refresh-2024')
            const data = await response.json()
            if (data.success) {
                setCacheStatus({
                    ...cacheStatus!,
                    refresh_status: 'success',
                    google_trends_count: data.stats.googleTrendsCount,
                    youtube_videos_count: data.stats.youtubeVideosCount,
                    last_google_refresh: new Date().toISOString(),
                    last_youtube_refresh: new Date().toISOString(),
                    last_error: null
                })
            }
        } catch (error) {
            console.error('Cache refresh failed:', error)
        } finally {
            setRefreshing(false)
        }
    }

    const formatTimeAgo = (dateString: string | null) => {
        if (!dateString) return 'Never'
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)

        if (diffMins < 60) return `${diffMins} mins ago`
        if (diffHours < 24) return `${diffHours} hours ago`
        return `${Math.floor(diffHours / 24)} days ago`
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            change: '+12%',
            changeType: 'positive',
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'Active Today',
            value: stats.activeToday.toLocaleString(),
            change: '+5%',
            changeType: 'positive',
            icon: Activity,
            color: 'bg-green-500'
        },
        {
            title: 'Cached Trends',
            value: stats.trendsCount.toLocaleString(),
            change: 'Updated',
            changeType: 'neutral',
            icon: TrendingUp,
            color: 'bg-purple-500'
        },
        {
            title: 'Cached Videos',
            value: stats.videosCount.toLocaleString(),
            change: 'Updated',
            changeType: 'neutral',
            icon: Youtube,
            color: 'bg-red-500'
        }
    ]

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Dashboard</h1>
                    <p className="text-[#888] mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#333] rounded-lg text-sm font-semibold hover:border-[#FFC900] transition-colors flex items-center gap-2"
                    disabled={loading}
                >
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <div
                        key={stat.title}
                        className="bg-[#111] border-2 border-[#222] rounded-xl p-5 hover:border-[#FFC900] transition-all group"
                    >
                        <div className="flex items-start justify-between">
                            <div className={cn("p-3 rounded-lg", stat.color)}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-sm font-semibold",
                                stat.changeType === 'positive' && "text-green-400",
                                stat.changeType === 'negative' && "text-red-400",
                                stat.changeType === 'neutral' && "text-[#888]"
                            )}>
                                {stat.changeType === 'positive' && <ArrowUpRight className="w-4 h-4" />}
                                {stat.changeType === 'negative' && <ArrowDownRight className="w-4 h-4" />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-3xl font-black">{stat.value}</p>
                            <p className="text-sm text-[#888] mt-1">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Cache Control Panel */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cache Status */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black uppercase flex items-center gap-2">
                            <Database className="w-5 h-5 text-[#FFC900]" />
                            Cache Status
                        </h2>
                        <div className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1",
                            cacheStatus?.refresh_status === 'success' && "bg-green-500/20 text-green-400",
                            cacheStatus?.refresh_status === 'refreshing' && "bg-yellow-500/20 text-yellow-400",
                            cacheStatus?.refresh_status === 'error' && "bg-red-500/20 text-red-400",
                            !cacheStatus && "bg-[#333] text-[#888]"
                        )}>
                            {cacheStatus?.refresh_status === 'success' && <CheckCircle className="w-3 h-3" />}
                            {cacheStatus?.refresh_status === 'refreshing' && <Loader2 className="w-3 h-3 animate-spin" />}
                            {cacheStatus?.refresh_status === 'error' && <AlertCircle className="w-3 h-3" />}
                            {cacheStatus?.refresh_status || 'Unknown'}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Google Trends */}
                        <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-[#333]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-bold">Google Trends</p>
                                    <p className="text-sm text-[#888]">
                                        {cacheStatus?.google_trends_count || 0} trends cached
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[#888]">Last updated</p>
                                <p className="font-semibold text-[#FFC900]">
                                    {formatTimeAgo(cacheStatus?.last_google_refresh || null)}
                                </p>
                            </div>
                        </div>

                        {/* YouTube Videos */}
                        <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-[#333]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                    <Youtube className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="font-bold">YouTube Videos</p>
                                    <p className="text-sm text-[#888]">
                                        {cacheStatus?.youtube_videos_count || 0} videos cached
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[#888]">Last updated</p>
                                <p className="font-semibold text-[#FFC900]">
                                    {formatTimeAgo(cacheStatus?.last_youtube_refresh || null)}
                                </p>
                            </div>
                        </div>

                        {/* Error Display */}
                        {cacheStatus?.last_error && (
                            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                                <p className="text-sm text-red-400">
                                    <strong>Error:</strong> {cacheStatus.last_error}
                                </p>
                            </div>
                        )}

                        {/* Refresh Button */}
                        <button
                            onClick={refreshCache}
                            disabled={refreshing}
                            className={cn(
                                "w-full py-3 rounded-lg font-black uppercase text-black flex items-center justify-center gap-2 transition-all",
                                refreshing
                                    ? "bg-[#333] text-[#888] cursor-not-allowed"
                                    : "bg-[#FFC900] hover:bg-[#FFD93D] shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                            )}
                        >
                            {refreshing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Refreshing Cache...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-5 h-5" />
                                    Refresh Cache Now
                                </>
                            )}
                        </button>
                        <p className="text-xs text-[#666] text-center">
                            This will fetch fresh data from SerpAPI & YouTube
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                    <h2 className="text-xl font-black uppercase flex items-center gap-2 mb-6">
                        <Zap className="w-5 h-5 text-[#FFC900]" />
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-4 bg-[#1A1A1A] border-2 border-[#333] rounded-lg hover:border-[#FFC900] transition-all group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-6 h-6 text-purple-400" />
                                </div>
                                <span className="font-semibold text-sm">Add Trend</span>
                            </div>
                        </button>

                        <button className="p-4 bg-[#1A1A1A] border-2 border-[#333] rounded-lg hover:border-[#FFC900] transition-all group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Youtube className="w-6 h-6 text-red-400" />
                                </div>
                                <span className="font-semibold text-sm">Feature Video</span>
                            </div>
                        </button>

                        <button className="p-4 bg-[#1A1A1A] border-2 border-[#333] rounded-lg hover:border-[#FFC900] transition-all group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6 text-blue-400" />
                                </div>
                                <span className="font-semibold text-sm">View Users</span>
                            </div>
                        </button>

                        <button className="p-4 bg-[#1A1A1A] border-2 border-[#333] rounded-lg hover:border-[#FFC900] transition-all group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Eye className="w-6 h-6 text-green-400" />
                                </div>
                                <span className="font-semibold text-sm">View Logs</span>
                            </div>
                        </button>
                    </div>

                    {/* API Usage */}
                    <div className="mt-6 p-4 bg-[#1A1A1A] rounded-lg border border-[#333]">
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-bold text-sm">API Usage Today</p>
                            <span className="text-xs text-[#888]">10,000 limit</span>
                        </div>
                        <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#FFC900] to-[#FF6B00] rounded-full transition-all"
                                style={{ width: `${Math.min((stats.apiCallsToday / 10000) * 100, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-[#888] mt-2">
                            {stats.apiCallsToday.toLocaleString()} / 10,000 calls used
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={item} className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                <h2 className="text-xl font-black uppercase flex items-center gap-2 mb-6">
                    <Activity className="w-5 h-5 text-[#FFC900]" />
                    Recent Activity
                </h2>

                <div className="space-y-3">
                    {[
                        { action: 'Cache refreshed', time: '2 mins ago', type: 'system' },
                        { action: 'New user registered', time: '15 mins ago', type: 'user' },
                        { action: 'YouTube quota warning (80%)', time: '1 hour ago', type: 'warning' },
                        { action: 'Admin login detected', time: '2 hours ago', type: 'admin' },
                        { action: 'Cache refreshed', time: '6 hours ago', type: 'system' },
                    ].map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg border border-[#333] hover:border-[#444] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    activity.type === 'system' && "bg-blue-400",
                                    activity.type === 'user' && "bg-green-400",
                                    activity.type === 'warning' && "bg-yellow-400",
                                    activity.type === 'admin' && "bg-purple-400"
                                )} />
                                <span className="text-sm">{activity.action}</span>
                            </div>
                            <span className="text-xs text-[#888]">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}
