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
    Clock,
    Zap,
    Activity
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

    const refreshCache = async () => {
        setRefreshing(true)
        const startTime = Date.now()
        addLog('Starting cache refresh...', 'info')

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
                addLog(`✅ Refreshed in ${duration}s - ${data.stats.googleTrendsCount} trends, ${data.stats.youtubeVideosCount} videos`, 'success')
            } else {
                addLog(`❌ Failed: ${data.error}`, 'error')
            }
        } catch (error: any) {
            addLog(`❌ Error: ${error.message}`, 'error')
        } finally {
            setRefreshing(false)
        }
    }

    const addLog = (message: string, type: 'info' | 'success' | 'error') => {
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

        if (diffMins < 60) return `${diffMins} min ago`
        if (diffHours < 24) return `${diffHours} hr ago`
        return `${Math.floor(diffHours / 24)} days ago`
    }

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
                        <Database className="w-8 h-8" />
                        Cache Control
                    </h1>
                    <p className="text-black/60 mt-1 font-medium">Manage cached trends and videos</p>
                </div>
                <button
                    onClick={fetchCacheStatus}
                    className="px-4 py-2 bg-white border-2 border-black font-bold uppercase text-sm shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
                    disabled={loading}
                >
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    Refresh
                </button>
            </div>

            {/* Status Cards */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Overall Status */}
                <div className={cn(
                    "bg-white border-4 p-6 shadow-brutal",
                    cacheStatus?.refresh_status === 'success' && "border-[#B1F202]",
                    cacheStatus?.refresh_status === 'error' && "border-[#FF4D4D]",
                    !cacheStatus && "border-black"
                )}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={cn(
                            "w-12 h-12 border-2 border-black flex items-center justify-center",
                            cacheStatus?.refresh_status === 'success' && "bg-[#B1F202]",
                            cacheStatus?.refresh_status === 'error' && "bg-[#FF4D4D]",
                            !cacheStatus && "bg-gray-200"
                        )}>
                            {cacheStatus?.refresh_status === 'success' ? (
                                <CheckCircle className="w-6 h-6" />
                            ) : cacheStatus?.refresh_status === 'error' ? (
                                <AlertCircle className="w-6 h-6 text-white" />
                            ) : (
                                <Database className="w-6 h-6" />
                            )}
                        </div>
                        <div>
                            <p className="font-black text-lg uppercase">Status</p>
                            <p className="font-bold uppercase">{cacheStatus?.refresh_status || 'Unknown'}</p>
                        </div>
                    </div>
                </div>

                {/* Google Trends */}
                <div className="bg-white border-4 border-black p-6 shadow-brutal hover:border-[#00F0FF] transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-[#00F0FF] border-2 border-black flex items-center justify-center">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black uppercase">Google Trends</p>
                            <p className="text-3xl font-black">{cacheStatus?.google_trends_count || 0}</p>
                        </div>
                    </div>
                    <p className="text-xs text-black/60 font-medium">
                        Updated: {formatTimeAgo(cacheStatus?.last_google_refresh || null)}
                    </p>
                </div>

                {/* YouTube Videos */}
                <div className="bg-white border-4 border-black p-6 shadow-brutal hover:border-[#FF4D4D] transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-[#FF4D4D] border-2 border-black flex items-center justify-center">
                            <Youtube className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-black uppercase">YouTube Videos</p>
                            <p className="text-3xl font-black">{cacheStatus?.youtube_videos_count || 0}</p>
                        </div>
                    </div>
                    <p className="text-xs text-black/60 font-medium">
                        Updated: {formatTimeAgo(cacheStatus?.last_youtube_refresh || null)}
                    </p>
                </div>
            </motion.div>

            {/* Control Panel & Logs */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Control Panel */}
                <div className="bg-white border-4 border-black p-6 shadow-brutal">
                    <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Refresh Controls
                    </h2>

                    <div className="space-y-4">
                        <button
                            onClick={refreshCache}
                            disabled={refreshing}
                            className={cn(
                                "w-full p-4 flex items-center gap-4 transition-all border-4 border-black",
                                refreshing
                                    ? "bg-gray-200 cursor-not-allowed"
                                    : "bg-[#FFC900] font-bold shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                            )}
                        >
                            {refreshing ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <RefreshCw className="w-6 h-6" />
                            )}
                            <div className="text-left">
                                <p className="font-black uppercase">Refresh All Cache</p>
                                <p className="text-sm">Fetch Google Trends + YouTube Videos</p>
                            </div>
                        </button>

                        <div className="p-4 bg-[#F5F5F0] border-2 border-black space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-black/60 font-bold">Total Items</span>
                                <span className="font-black text-[#FF90E8]">
                                    {(cacheStatus?.google_trends_count || 0) + (cacheStatus?.youtube_videos_count || 0)}
                                </span>
                            </div>
                        </div>

                        {cacheStatus?.last_error && (
                            <div className="p-4 bg-[#FF4D4D] border-2 border-black text-white">
                                <p className="text-sm font-bold">Error: {cacheStatus.last_error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Logs */}
                <div className="bg-white border-4 border-black p-6 shadow-brutal">
                    <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Live Logs
                    </h2>

                    <div className="bg-black border-2 border-black h-[250px] overflow-y-auto font-mono text-sm text-white p-3">
                        {logs.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-white/50">
                                <p>Trigger a refresh to see logs</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {logs.map((log, index) => (
                                    <div key={index} className="flex gap-2">
                                        <span className="text-white/50">[{log.time}]</span>
                                        <span className={cn(
                                            log.type === 'success' && "text-[#B1F202]",
                                            log.type === 'error' && "text-[#FF4D4D]",
                                            log.type === 'info' && "text-[#00F0FF]"
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

            {/* Schedule */}
            <motion.div variants={item} className="bg-white border-4 border-black p-6 shadow-brutal">
                <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Auto Refresh Schedule
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#F5F5F0] border-2 border-black">
                        <p className="text-sm text-black/60 font-bold uppercase mb-1">Schedule</p>
                        <p className="font-black">Daily 5:30 AM IST</p>
                    </div>
                    <div className="p-4 bg-[#F5F5F0] border-2 border-black">
                        <p className="text-sm text-black/60 font-bold uppercase mb-1">Next Refresh</p>
                        <p className="font-black">Tomorrow 5:30 AM</p>
                    </div>
                    <div className="p-4 bg-[#F5F5F0] border-2 border-black">
                        <p className="text-sm text-black/60 font-bold uppercase mb-1">Cron</p>
                        <p className="font-mono font-black">0 0 * * *</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
