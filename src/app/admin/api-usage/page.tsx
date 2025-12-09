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
    Shield,
    Activity,
    Play,
    XCircle
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
            // Refresh status after test
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

    const formatLastUsed = (date: string | null) => {
        if (!date) return 'Never'
        const d = new Date(date)
        const now = new Date()
        const diff = now.getTime() - d.getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'Just now'
        if (mins < 60) return `${mins} min ago`
        const hours = Math.floor(mins / 60)
        if (hours < 24) return `${hours} hr ago`
        return d.toLocaleDateString()
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
                        <Zap className="w-8 h-8 text-[#FFC900]" />
                        API Usage
                    </h1>
                    <p className="text-[#888] mt-1">Monitor your API quotas and multi-key rotation</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={testYouTubeApi}
                        disabled={testing}
                        className="px-4 py-2 bg-red-500/20 border-2 border-red-500/50 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors flex items-center gap-2 text-red-400"
                    >
                        {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Test YouTube API
                    </button>
                    <button
                        onClick={fetchYouTubeStatus}
                        disabled={loading}
                        className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#333] rounded-lg text-sm font-semibold hover:border-[#FFC900] transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Test Result */}
            {testResult && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "p-4 rounded-lg border-2",
                        testResult.success
                            ? "bg-green-500/10 border-green-500/50 text-green-400"
                            : "bg-red-500/10 border-red-500/50 text-red-400"
                    )}
                >
                    {testResult.message}
                </motion.div>
            )}

            {/* YouTube Multi-Key Status */}
            <motion.div variants={item} className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black uppercase flex items-center gap-2">
                        <Youtube className="w-5 h-5 text-red-500" />
                        YouTube Multi-Key System
                    </h2>
                    {youtubeStatus && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                            {youtubeStatus.activeKeys} / {youtubeStatus.totalKeys} Keys Active
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <RefreshCw className="w-8 h-8 text-[#FFC900] animate-spin" />
                    </div>
                ) : youtubeStatus ? (
                    <>
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                <p className="text-3xl font-black text-[#FFC900]">{youtubeStatus.totalKeys}</p>
                                <p className="text-xs text-[#888] uppercase font-semibold">Total Keys</p>
                            </div>
                            <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                <p className="text-3xl font-black text-green-400">{youtubeStatus.totalQuota.toLocaleString()}</p>
                                <p className="text-xs text-[#888] uppercase font-semibold">Daily Quota</p>
                            </div>
                            <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                <p className="text-3xl font-black text-blue-400">{youtubeStatus.usedQuota.toLocaleString()}</p>
                                <p className="text-xs text-[#888] uppercase font-semibold">Used Today</p>
                            </div>
                            <div className="bg-[#1A1A1A] p-4 rounded-lg">
                                <p className="text-3xl font-black text-purple-400">{youtubeStatus.remainingQuota.toLocaleString()}</p>
                                <p className="text-xs text-[#888] uppercase font-semibold">Remaining</p>
                            </div>
                        </div>

                        {/* Overall Progress */}
                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-[#888]">Daily Quota Usage</span>
                                <span className="font-bold">{youtubeStatus.percentUsed}%</span>
                            </div>
                            <div className="h-4 bg-[#333] rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-500",
                                        youtubeStatus.percentUsed < 50
                                            ? "bg-gradient-to-r from-green-500 to-green-400"
                                            : youtubeStatus.percentUsed < 80
                                                ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                                                : "bg-gradient-to-r from-red-500 to-red-400"
                                    )}
                                    style={{ width: `${youtubeStatus.percentUsed}%` }}
                                />
                            </div>
                        </div>

                        {/* Individual Keys Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#333]">
                                        <th className="text-left py-3 px-4 text-xs font-bold text-[#888] uppercase">Key</th>
                                        <th className="text-left py-3 px-4 text-xs font-bold text-[#888] uppercase">Status</th>
                                        <th className="text-left py-3 px-4 text-xs font-bold text-[#888] uppercase">Used Today</th>
                                        <th className="text-left py-3 px-4 text-xs font-bold text-[#888] uppercase">Last Used</th>
                                        <th className="text-left py-3 px-4 text-xs font-bold text-[#888] uppercase">Errors</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {youtubeStatus.keys.map((key, index) => (
                                        <tr key={index} className="border-b border-[#222] hover:bg-[#1A1A1A]">
                                            <td className="py-3 px-4">
                                                <code className="text-sm font-mono text-[#888]">{key.keyPreview}</code>
                                            </td>
                                            <td className="py-3 px-4">
                                                {key.isExhausted ? (
                                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold flex items-center gap-1 w-fit">
                                                        <XCircle className="w-3 h-3" />
                                                        Exhausted
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold flex items-center gap-1 w-fit">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-[#333] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-red-400 rounded-full"
                                                            style={{ width: `${(key.usedToday / 10000) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-mono">{key.usedToday.toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-[#888]">
                                                {formatLastUsed(key.lastUsed)}
                                            </td>
                                            <td className="py-3 px-4">
                                                {key.errorCount > 0 ? (
                                                    <span className="text-yellow-400 text-sm">{key.errorCount}</span>
                                                ) : (
                                                    <span className="text-[#888] text-sm">0</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 text-[#888]">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                        <p>Failed to load YouTube key status</p>
                    </div>
                )}
            </motion.div>

            {/* Other APIs */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SerpAPI */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="font-bold">SerpAPI</p>
                            <p className="text-xs text-[#888]">Google Trends Data</p>
                        </div>
                    </div>
                    <p className="text-sm text-[#888]">Using cached trends (no live API calls)</p>
                </div>

                {/* OpenRouter */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="font-bold">OpenRouter AI</p>
                            <p className="text-xs text-[#888]">GPT-4 / Claude</p>
                        </div>
                    </div>
                    <p className="text-sm text-[#888]">Pay-per-use, no daily limit</p>
                </div>
            </motion.div>

            {/* Info Banner */}
            <motion.div variants={item} className="bg-gradient-to-br from-[#FFC900]/10 to-transparent border-2 border-[#FFC900]/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#FFC900] rounded-lg">
                        <Shield className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg">Multi-Key Rotation Active</h3>
                        <p className="text-sm text-[#888] mt-1">
                            Using {youtubeStatus?.totalKeys || 11} YouTube API keys with automatic round-robin rotation.
                            When one key hits quota, the system automatically switches to the next key.
                            Total daily capacity: {(youtubeStatus?.totalQuota || 110000).toLocaleString()} units ({Math.floor((youtubeStatus?.totalQuota || 110000) / 100)} searches).
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
