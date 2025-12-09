'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Database,
    RefreshCw,
    Globe,
    Youtube,
    CheckCircle,
    AlertCircle,
    Loader2,
    Trash2,
    Clock,
    Zap,
    Activity,
    Server,
    HardDrive
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

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function CacheControlPage() {
    const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [refreshType, setRefreshType] = useState<'all' | 'trends' | 'youtube' | null>(null)
    const [logs, setLogs] = useState<any[]>([])

    useEffect(() => {
        fetchCacheStatus()
    }, [])

    const fetchCacheStatus = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/refresh-cache')
            const data = await response.json()
            if (data.cache) {
                setCacheStatus(data.cache)
            }
        } catch (error) {
            console.error('Failed to fetch cache status:', error)
        } finally {
            setLoading(false)
        }
    }

    const refreshCache = async (type: 'all' | 'trends' | 'youtube') => {
        setRefreshing(true)
        setRefreshType(type)

        const startTime = Date.now()
        addLog(`Starting ${type} cache refresh...`, 'info')

        try {
            const response = await fetch('/api/admin/refresh-cache?key=trendly-refresh-2024')
            const data = await response.json()

            const duration = ((Date.now() - startTime) / 1000).toFixed(2)

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
                addLog(`✅ Cache refreshed in ${duration}s - ${data.stats.googleTrendsCount} trends, ${data.stats.youtubeVideosCount} videos`, 'success')
            } else {
                addLog(`❌ Cache refresh failed: ${data.error}`, 'error')
            }
        } catch (error: any) {
            addLog(`❌ Error: ${error.message}`, 'error')
        } finally {
            setRefreshing(false)
            setRefreshType(null)
        }
    }

    const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning') => {
        setLogs(prev => [{
            message,
            type,
            time: new Date().toLocaleTimeString()
        }, ...prev.slice(0, 19)])
    }

    const formatTimeAgo = (dateString: string | null) => {
        if (!dateString) return 'Never'
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)

        if (diffMins < 60) return `${diffMins} minutes ago`
        if (diffHours < 24) return `${diffHours} hours ago`
        return `${Math.floor(diffHours / 24)} days ago`
    }

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        })
    }

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
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Database className="w-8 h-8 text-[#FFC900]" />
                        Cache Control
                    </h1>
                    <p className="text-[#888] mt-1">Manage your cached trends and videos</p>
                </div>
                <button
                    onClick={fetchCacheStatus}
                    className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#333] rounded-lg text-sm font-semibold hover:border-[#FFC900] transition-colors flex items-center gap-2"
                    disabled={loading}
                >
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    Refresh Status
                </button>
            </div>

            {/* Status Overview */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Overall Status */}
                <div className={cn(
                    "bg-[#111] border-2 rounded-xl p-6",
                    cacheStatus?.refresh_status === 'success' && "border-green-500/50",
                    cacheStatus?.refresh_status === 'error' && "border-red-500/50",
                    cacheStatus?.refresh_status === 'refreshing' && "border-yellow-500/50",
                    !cacheStatus && "border-[#333]"
                )}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center",
                            cacheStatus?.refresh_status === 'success' && "bg-green-500/20",
                            cacheStatus?.refresh_status === 'error' && "bg-red-500/20",
                            !cacheStatus && "bg-[#333]"
                        )}>
                            {cacheStatus?.refresh_status === 'success' ? (
                                <CheckCircle className="w-6 h-6 text-green-400" />
                            ) : cacheStatus?.refresh_status === 'error' ? (
                                <AlertCircle className="w-6 h-6 text-red-400" />
                            ) : (
                                <Server className="w-6 h-6 text-[#888]" />
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-lg">Cache Status</p>
                            <p className={cn(
                                "text-sm font-semibold uppercase",
                                cacheStatus?.refresh_status === 'success' && "text-green-400",
                                cacheStatus?.refresh_status === 'error' && "text-red-400",
                                !cacheStatus && "text-[#888]"
                            )}>
                                {cacheStatus?.refresh_status || 'Unknown'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Google Trends */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Globe className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Google Trends</p>
                            <p className="text-2xl font-black text-blue-400">
                                {cacheStatus?.google_trends_count || 0}
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-[#888]">
                        Last updated: {formatTimeAgo(cacheStatus?.last_google_refresh || null)}
                    </p>
                </div>

                {/* YouTube Videos */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6 hover:border-red-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <Youtube className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">YouTube Videos</p>
                            <p className="text-2xl font-black text-red-400">
                                {cacheStatus?.youtube_videos_count || 0}
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-[#888]">
                        Last updated: {formatTimeAgo(cacheStatus?.last_youtube_refresh || null)}
                    </p>
                </div>
            </motion.div>

            {/* Control Panel & Logs */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Control Panel */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                    <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[#FFC900]" />
                        Refresh Controls
                    </h2>

                    <div className="space-y-4">
                        {/* Refresh All */}
                        <button
                            onClick={() => refreshCache('all')}
                            disabled={refreshing}
                            className={cn(
                                "w-full p-4 rounded-lg flex items-center gap-4 transition-all",
                                refreshing
                                    ? "bg-[#1A1A1A] border-2 border-[#333] cursor-not-allowed"
                                    : "bg-[#FFC900] text-black font-bold shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                            )}
                        >
                            {refreshing && refreshType === 'all' ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <RefreshCw className="w-6 h-6" />
                            )}
                            <div className="text-left">
                                <p className="font-black uppercase">Refresh All Cache</p>
                                <p className="text-sm opacity-80">Fetch Google Trends + YouTube Videos</p>
                            </div>
                        </button>

                        {/* Detailed Info */}
                        <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333] space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#888]">Google Trends Updated</span>
                                <span className="font-mono text-sm">
                                    {formatDateTime(cacheStatus?.last_google_refresh || null)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#888]">YouTube Videos Updated</span>
                                <span className="font-mono text-sm">
                                    {formatDateTime(cacheStatus?.last_youtube_refresh || null)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#888]">Total Cached Items</span>
                                <span className="font-bold text-[#FFC900]">
                                    {(cacheStatus?.google_trends_count || 0) + (cacheStatus?.youtube_videos_count || 0)}
                                </span>
                            </div>
                        </div>

                        {/* Error Display */}
                        {cacheStatus?.last_error && (
                            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                                <p className="text-sm text-red-400 font-semibold mb-1">Last Error:</p>
                                <p className="text-xs text-red-300">{cacheStatus.last_error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Logs */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                    <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#FFC900]" />
                        Live Logs
                    </h2>

                    <div className="bg-[#0A0A0A] rounded-lg border border-[#333] h-[300px] overflow-y-auto font-mono text-sm">
                        {logs.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-[#666]">
                                <p>No logs yet. Trigger a cache refresh to see logs.</p>
                            </div>
                        ) : (
                            <div className="p-3 space-y-1">
                                {logs.map((log, index) => (
                                    <div key={index} className="flex gap-2">
                                        <span className="text-[#666] flex-shrink-0">[{log.time}]</span>
                                        <span className={cn(
                                            log.type === 'success' && "text-green-400",
                                            log.type === 'error' && "text-red-400",
                                            log.type === 'warning' && "text-yellow-400",
                                            log.type === 'info' && "text-blue-400"
                                        )}>
                                            {log.message}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Schedule Info */}
            <motion.div variants={item} className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#FFC900]" />
                    Automatic Refresh Schedule
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333]">
                        <p className="text-sm text-[#888] mb-1">Schedule</p>
                        <p className="font-bold">Daily at 5:30 AM IST</p>
                    </div>
                    <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333]">
                        <p className="text-sm text-[#888] mb-1">Next Refresh</p>
                        <p className="font-bold">Tomorrow 5:30 AM</p>
                    </div>
                    <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333]">
                        <p className="text-sm text-[#888] mb-1">Cron Expression</p>
                        <p className="font-mono text-sm">0 0 * * *</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
