'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    TrendingUp,
    Youtube,
    RefreshCw,
    Clock,
    CheckCircle,
    AlertCircle,
    Globe,
    Database,
    Activity,
    Loader2,
    Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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
        trendsCount: 0,
        videosCount: 0
    })
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

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
                    activeToday: statsData.activeToday || 0
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
                setStats(prev => ({
                    ...prev,
                    trendsCount: data.stats.googleTrendsCount,
                    videosCount: data.stats.youtubeVideosCount
                }))
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
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-[#00F0FF]'
        },
        {
            title: 'Active Today',
            value: stats.activeToday,
            icon: Activity,
            color: 'bg-[#B1F202]'
        },
        {
            title: 'Cached Trends',
            value: stats.trendsCount,
            icon: TrendingUp,
            color: 'bg-[#FF90E8]'
        },
        {
            title: 'Cached Videos',
            value: stats.videosCount,
            icon: Youtube,
            color: 'bg-[#FF4D4D]'
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
                    <p className="text-black/60 mt-1 font-medium">Welcome back! Here's your real-time data.</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-white border-2 border-black font-bold uppercase text-sm shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
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
                        className="bg-white border-4 border-black p-5 shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className={cn("p-3 border-2 border-black", stat.color)}>
                                <stat.icon className="w-5 h-5 text-black" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-4xl font-black">{stat.value.toLocaleString()}</p>
                            <p className="text-sm text-black/60 mt-1 font-bold uppercase">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Cache Control Panel */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cache Status */}
                <div className="bg-white border-4 border-black p-6 shadow-brutal">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black uppercase flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Cache Status
                        </h2>
                        <div className={cn(
                            "px-3 py-1 border-2 border-black text-xs font-black uppercase flex items-center gap-1",
                            cacheStatus?.refresh_status === 'success' && "bg-[#B1F202]",
                            cacheStatus?.refresh_status === 'refreshing' && "bg-[#FFC900]",
                            cacheStatus?.refresh_status === 'error' && "bg-[#FF4D4D]",
                            !cacheStatus && "bg-gray-200"
                        )}>
                            {cacheStatus?.refresh_status === 'success' && <CheckCircle className="w-3 h-3" />}
                            {cacheStatus?.refresh_status === 'refreshing' && <Loader2 className="w-3 h-3 animate-spin" />}
                            {cacheStatus?.refresh_status === 'error' && <AlertCircle className="w-3 h-3" />}
                            {cacheStatus?.refresh_status || 'Unknown'}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Google Trends */}
                        <div className="flex items-center justify-between p-4 bg-[#F5F5F0] border-2 border-black">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#00F0FF] border-2 border-black flex items-center justify-center">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-black uppercase">Google Trends</p>
                                    <p className="text-sm text-black/60 font-medium">
                                        {cacheStatus?.google_trends_count || 0} trends cached
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-black/60 font-medium">Last updated</p>
                                <p className="font-black text-[#FF90E8]">
                                    {formatTimeAgo(cacheStatus?.last_google_refresh || null)}
                                </p>
                            </div>
                        </div>

                        {/* YouTube Videos */}
                        <div className="flex items-center justify-between p-4 bg-[#F5F5F0] border-2 border-black">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#FF4D4D] border-2 border-black flex items-center justify-center">
                                    <Youtube className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-black uppercase">YouTube Videos</p>
                                    <p className="text-sm text-black/60 font-medium">
                                        {cacheStatus?.youtube_videos_count || 0} videos cached
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-black/60 font-medium">Last updated</p>
                                <p className="font-black text-[#FF90E8]">
                                    {formatTimeAgo(cacheStatus?.last_youtube_refresh || null)}
                                </p>
                            </div>
                        </div>

                        {/* Error Display */}
                        {cacheStatus?.last_error && (
                            <div className="p-4 bg-[#FF4D4D] border-2 border-black">
                                <p className="text-sm text-white font-bold">
                                    <strong>Error:</strong> {cacheStatus.last_error}
                                </p>
                            </div>
                        )}

                        {/* Refresh Button */}
                        <button
                            onClick={refreshCache}
                            disabled={refreshing}
                            className={cn(
                                "w-full py-3 font-black uppercase flex items-center justify-center gap-2 transition-all border-4 border-black",
                                refreshing
                                    ? "bg-gray-200 text-black/50 cursor-not-allowed"
                                    : "bg-[#FFC900] hover:bg-[#FFD93D] shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
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
                        <p className="text-xs text-black/50 text-center font-medium">
                            Fetches fresh data from SerpAPI & YouTube
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border-4 border-black p-6 shadow-brutal">
                    <h2 className="text-xl font-black uppercase flex items-center gap-2 mb-6">
                        <Zap className="w-5 h-5" />
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/admin/trends" className="p-4 bg-[#F5F5F0] border-2 border-black hover:bg-[#FF90E8] transition-all group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-[#FF90E8] border-2 border-black flex items-center justify-center group-hover:bg-white transition-colors">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <span className="font-black text-sm uppercase">Manage Trends</span>
                            </div>
                        </Link>

                        <Link href="/admin/videos" className="p-4 bg-[#F5F5F0] border-2 border-black hover:bg-[#FF4D4D] hover:text-white transition-all group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-[#FF4D4D] border-2 border-black flex items-center justify-center">
                                    <Youtube className="w-6 h-6 text-white" />
                                </div>
                                <span className="font-black text-sm uppercase">Manage Videos</span>
                            </div>
                        </Link>

                        <Link href="/admin/users" className="p-4 bg-[#F5F5F0] border-2 border-black hover:bg-[#00F0FF] transition-all group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-[#00F0FF] border-2 border-black flex items-center justify-center">
                                    <Users className="w-6 h-6" />
                                </div>
                                <span className="font-black text-sm uppercase">View Users</span>
                            </div>
                        </Link>

                        <Link href="/admin/api-usage" className="p-4 bg-[#F5F5F0] border-2 border-black hover:bg-[#FFC900] transition-all group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-[#FFC900] border-2 border-black flex items-center justify-center">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <span className="font-black text-sm uppercase">API Usage</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
