'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Zap,
    Youtube,
    Globe,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Key,
    Play,
    XCircle,
    Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface YouTubeKeyStatus {
    keyPreview: string
    usedToday: number
    isExhausted: boolean
    errorCount: number
    lastUsed: string | null
}

interface YouTubeStatus {
    totalKeys: number
    activeKeys: number
    exhaustedKeys: number
    totalQuota: number
    usedQuota: number
    remainingQuota: number
    percentUsed: number
    keys: YouTubeKeyStatus[]
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function ApiUsagePage() {
    const [loading, setLoading] = useState(true)
    const [testing, setTesting] = useState(false)
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
    const [youtubeStatus, setYoutubeStatus] = useState<YouTubeStatus | null>(null)

    useEffect(() => {
        fetchYouTubeStatus()
    }, [])

    const fetchYouTubeStatus = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/youtube-keys')
            const data = await response.json()
            if (data.success) {
                setYoutubeStatus(data)
            }
        } catch (error) {
            console.error('Failed to fetch YouTube status:', error)
        } finally {
            setLoading(false)
        }
    }

    const testYouTubeApi = async () => {
        setTesting(true)
        setTestResult(null)
        try {
            const response = await fetch('/api/admin/youtube-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: 'trending videos' })
            })
            const data = await response.json()
            setTestResult({
                success: data.success,
                message: data.success
                    ? `✅ Working! Found ${data.resultsCount} videos in ${data.duration}`
                    : `❌ Error: ${data.error}`
            })
            fetchYouTubeStatus()
        } catch (error: any) {
            setTestResult({
                success: false,
                message: `❌ Error: ${error.message}`
            })
        } finally {
            setTesting(false)
        }
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
                        <Zap className="w-8 h-8" />
                        API Usage
                    </h1>
                    <p className="text-black/60 mt-1 font-medium">Monitor YouTube API key rotation and usage</p>
                </div>
                <button
                    onClick={fetchYouTubeStatus}
                    className="px-4 py-2 bg-white border-2 border-black font-bold uppercase text-sm shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
                    disabled={loading}
                >
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    Refresh
                </button>
            </div>

            {/* YouTube Overview */}
            <motion.div variants={item} className="bg-white border-4 border-black p-6 shadow-brutal">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black uppercase flex items-center gap-2">
                        <Youtube className="w-5 h-5" />
                        YouTube Multi-Key System
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#B1F202] border-2 border-black font-black text-sm uppercase">
                            {youtubeStatus?.activeKeys || 0}/{youtubeStatus?.totalKeys || 0} Active
                        </span>
                    </div>
                </div>

                {/* Quota Progress */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="font-bold">Daily Quota</span>
                        <span className="font-black">
                            {youtubeStatus?.usedQuota?.toLocaleString() || 0} / {youtubeStatus?.totalQuota?.toLocaleString() || 0}
                        </span>
                    </div>
                    <div className="h-4 bg-[#F5F5F0] border-2 border-black overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all",
                                (youtubeStatus?.percentUsed || 0) < 50 && "bg-[#B1F202]",
                                (youtubeStatus?.percentUsed || 0) >= 50 && (youtubeStatus?.percentUsed || 0) < 80 && "bg-[#FFC900]",
                                (youtubeStatus?.percentUsed || 0) >= 80 && "bg-[#FF4D4D]"
                            )}
                            style={{ width: `${youtubeStatus?.percentUsed || 0}%` }}
                        />
                    </div>
                    <p className="text-sm text-black/60 mt-1 font-medium">
                        {youtubeStatus?.remainingQuota?.toLocaleString() || 0} units remaining ({Math.round(100 - (youtubeStatus?.percentUsed || 0))}%)
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-[#F5F5F0] border-2 border-black">
                        <Key className="w-5 h-5 mb-2" />
                        <p className="text-2xl font-black">{youtubeStatus?.totalKeys || 0}</p>
                        <p className="text-sm text-black/60 font-bold uppercase">Total Keys</p>
                    </div>
                    <div className="p-4 bg-[#B1F202] border-2 border-black">
                        <CheckCircle className="w-5 h-5 mb-2" />
                        <p className="text-2xl font-black">{youtubeStatus?.activeKeys || 0}</p>
                        <p className="text-sm font-bold uppercase">Active</p>
                    </div>
                    <div className="p-4 bg-[#FF4D4D] border-2 border-black text-white">
                        <XCircle className="w-5 h-5 mb-2" />
                        <p className="text-2xl font-black">{youtubeStatus?.exhaustedKeys || 0}</p>
                        <p className="text-sm font-bold uppercase">Exhausted</p>
                    </div>
                    <div className="p-4 bg-[#FFC900] border-2 border-black">
                        <Zap className="w-5 h-5 mb-2" />
                        <p className="text-2xl font-black">{youtubeStatus?.totalQuota?.toLocaleString() || 0}</p>
                        <p className="text-sm font-bold uppercase">Daily Quota</p>
                    </div>
                </div>

                {/* Test Button */}
                <button
                    onClick={testYouTubeApi}
                    disabled={testing}
                    className={cn(
                        "w-full py-3 font-black uppercase flex items-center justify-center gap-2 border-4 border-black transition-all",
                        testing
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-[#FF90E8] shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                    )}
                >
                    {testing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Play className="w-5 h-5" />
                    )}
                    Test YouTube API
                </button>

                {testResult && (
                    <div className={cn(
                        "mt-4 p-4 border-2 border-black font-bold",
                        testResult.success ? "bg-[#B1F202]" : "bg-[#FF4D4D] text-white"
                    )}>
                        {testResult.message}
                    </div>
                )}
            </motion.div>

            {/* Individual Keys */}
            <motion.div variants={item} className="bg-white border-4 border-black p-6 shadow-brutal">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Individual Key Status
                </h2>

                <div className="space-y-3">
                    {youtubeStatus?.keys?.map((key, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-center justify-between p-4 border-2 border-black",
                                key.isExhausted ? "bg-[#FF4D4D]/10" : "bg-[#F5F5F0]"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 border-2 border-black flex items-center justify-center font-black",
                                    key.isExhausted ? "bg-[#FF4D4D] text-white" : "bg-[#B1F202]"
                                )}>
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-mono font-bold">{key.keyPreview}</p>
                                    <p className="text-sm text-black/60">
                                        {key.isExhausted ? 'Exhausted' : 'Active'} • {key.errorCount} errors
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black">{key.usedToday?.toLocaleString() || 0}</p>
                                <p className="text-sm text-black/60">units today</p>
                            </div>
                        </div>
                    )) || (
                            <div className="text-center py-8 text-black/40 font-medium">
                                No keys loaded. Check YouTube key configuration.
                            </div>
                        )}
                </div>
            </motion.div>

            {/* Other APIs */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SerpAPI */}
                <div className="bg-white border-4 border-black p-6 shadow-brutal">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-[#00F0FF] border-2 border-black flex items-center justify-center">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black uppercase">SerpAPI</p>
                            <p className="text-sm text-black/60">Google Trends</p>
                        </div>
                    </div>
                    <p className="text-black/60 font-medium">
                        Cached data - minimal API calls. Daily refresh caches all trends.
                    </p>
                </div>

                {/* OpenRouter */}
                <div className="bg-white border-4 border-black p-6 shadow-brutal">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-[#FF90E8] border-2 border-black flex items-center justify-center">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black uppercase">OpenRouter AI</p>
                            <p className="text-sm text-black/60">Content Analysis</p>
                        </div>
                    </div>
                    <p className="text-black/60 font-medium">
                        Pay-per-use pricing. No daily limits.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}
