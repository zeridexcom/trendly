'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Zap,
    Youtube,
    Globe,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    Clock,
    RefreshCw,
    Key,
    Shield,
    Activity,
    BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApiKeyStatus {
    name: string
    type: 'youtube' | 'serpapi' | 'openai'
    status: 'active' | 'warning' | 'exhausted'
    usedToday: number
    limit: number
    lastUsed: string
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
    const [apiKeys, setApiKeys] = useState<ApiKeyStatus[]>([
        {
            name: 'YouTube Data API',
            type: 'youtube',
            status: 'active',
            usedToday: 150,
            limit: 10000,
            lastUsed: '5 mins ago'
        },
        {
            name: 'SerpAPI (Google Trends)',
            type: 'serpapi',
            status: 'warning',
            usedToday: 85,
            limit: 100,
            lastUsed: '2 hours ago'
        },
        {
            name: 'OpenRouter AI',
            type: 'openai',
            status: 'active',
            usedToday: 45,
            limit: 1000,
            lastUsed: '10 mins ago'
        }
    ])

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 500)
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500'
            case 'warning': return 'bg-yellow-500'
            case 'exhausted': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const getProgressColor = (used: number, limit: number) => {
        const percentage = (used / limit) * 100
        if (percentage < 50) return 'from-green-500 to-green-400'
        if (percentage < 80) return 'from-yellow-500 to-yellow-400'
        return 'from-red-500 to-red-400'
    }

    const getTotalUsage = () => {
        const youtube = apiKeys.find(k => k.type === 'youtube')
        const serpapi = apiKeys.find(k => k.type === 'serpapi')
        return {
            youtubePercent: youtube ? (youtube.usedToday / youtube.limit) * 100 : 0,
            serpapiPercent: serpapi ? (serpapi.usedToday / serpapi.limit) * 100 : 0
        }
    }

    const usage = getTotalUsage()

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
                    <p className="text-[#888] mt-1">Monitor your API quotas and usage</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#333] rounded-lg text-sm font-semibold hover:border-[#FFC900] transition-colors flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Overview Cards */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* YouTube Quota */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <Youtube className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="font-bold">YouTube API</p>
                                <p className="text-xs text-[#888]">Data API v3</p>
                            </div>
                        </div>
                        <div className={cn(
                            "w-3 h-3 rounded-full",
                            usage.youtubePercent < 80 ? "bg-green-500" : "bg-yellow-500"
                        )} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#888]">Used Today</span>
                            <span className="font-bold">150 / 10,000</span>
                        </div>
                        <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                                style={{ width: `${usage.youtubePercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-[#888]">{usage.youtubePercent.toFixed(1)}% used</p>
                    </div>
                </div>

                {/* SerpAPI Quota */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <Globe className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="font-bold">SerpAPI</p>
                                <p className="text-xs text-[#888]">Google Trends</p>
                            </div>
                        </div>
                        <div className={cn(
                            "w-3 h-3 rounded-full",
                            usage.serpapiPercent < 80 ? "bg-green-500" : "bg-yellow-500"
                        )} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#888]">Used This Month</span>
                            <span className="font-bold">85 / 100</span>
                        </div>
                        <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                                style={{ width: `${usage.serpapiPercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-[#888]">{usage.serpapiPercent.toFixed(1)}% used</p>
                    </div>
                </div>

                {/* OpenRouter */}
                <div className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <Activity className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="font-bold">OpenRouter AI</p>
                                <p className="text-xs text-[#888]">GPT-4 / Claude</p>
                            </div>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#888]">Requests Today</span>
                            <span className="font-bold">45 calls</span>
                        </div>
                        <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                                style={{ width: '4.5%' }}
                            />
                        </div>
                        <p className="text-xs text-[#888]">Pay per use</p>
                    </div>
                </div>
            </motion.div>

            {/* API Keys Table */}
            <motion.div variants={item} className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                    <Key className="w-5 h-5 text-[#FFC900]" />
                    API Keys Status
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#333]">
                                <th className="text-left py-3 px-4 text-sm font-bold text-[#888] uppercase">Service</th>
                                <th className="text-left py-3 px-4 text-sm font-bold text-[#888] uppercase">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-bold text-[#888] uppercase">Usage</th>
                                <th className="text-left py-3 px-4 text-sm font-bold text-[#888] uppercase">Last Used</th>
                                <th className="text-right py-3 px-4 text-sm font-bold text-[#888] uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiKeys.map((key, index) => (
                                <tr key={index} className="border-b border-[#222] hover:bg-[#1A1A1A] transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                                key.type === 'youtube' && "bg-red-500/20",
                                                key.type === 'serpapi' && "bg-blue-500/20",
                                                key.type === 'openai' && "bg-purple-500/20"
                                            )}>
                                                {key.type === 'youtube' && <Youtube className="w-5 h-5 text-red-400" />}
                                                {key.type === 'serpapi' && <Globe className="w-5 h-5 text-blue-400" />}
                                                {key.type === 'openai' && <Activity className="w-5 h-5 text-purple-400" />}
                                            </div>
                                            <div>
                                                <p className="font-bold">{key.name}</p>
                                                <p className="text-xs text-[#888]">****{Math.random().toString(36).slice(-8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-fit",
                                            key.status === 'active' && "bg-green-500/20 text-green-400",
                                            key.status === 'warning' && "bg-yellow-500/20 text-yellow-400",
                                            key.status === 'exhausted' && "bg-red-500/20 text-red-400"
                                        )}>
                                            {key.status === 'active' && <CheckCircle className="w-3 h-3" />}
                                            {key.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                                            {key.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-[#333] rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full bg-gradient-to-r",
                                                        getProgressColor(key.usedToday, key.limit)
                                                    )}
                                                    style={{ width: `${(key.usedToday / key.limit) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-mono">
                                                {key.usedToday}/{key.limit}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-[#888]">{key.lastUsed}</span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded text-xs font-semibold hover:border-[#FFC900] transition-colors">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Multi-Key Setup Info */}
            <motion.div variants={item} className="bg-gradient-to-br from-[#FFC900]/10 to-transparent border-2 border-[#FFC900]/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#FFC900] rounded-lg">
                        <Shield className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg">Multi-Key Rotation System</h3>
                        <p className="text-sm text-[#888] mt-1 mb-4">
                            Add multiple YouTube API keys to increase your daily quota. Each key provides 10,000 units/day.
                        </p>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-[#FFC900] text-black font-bold rounded-lg hover:bg-[#FFD93D] transition-colors">
                                + Add API Key
                            </button>
                            <button className="px-4 py-2 bg-[#1A1A1A] border border-[#333] font-semibold rounded-lg hover:border-[#FFC900] transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
