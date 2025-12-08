'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart3, RefreshCw, Loader2, ArrowLeft, TrendingUp,
    Youtube, Instagram, Twitter, Zap, Eye, Users
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PlatformData {
    id: string
    name: string
    icon: any
    color: string
    bgColor: string
    trends: string[]
    insights: {
        topCategory: string
        avgEngagement: string
        bestTime: string
        contentType: string
    }
}

const PLATFORMS: PlatformData[] = [
    {
        id: 'youtube',
        name: 'YouTube',
        icon: Youtube,
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        trends: [],
        insights: {
            topCategory: 'Entertainment',
            avgEngagement: '4.2%',
            bestTime: '12-3 PM, 7-9 PM',
            contentType: 'Long-form video',
        }
    },
    {
        id: 'instagram',
        name: 'Instagram',
        icon: Instagram,
        color: 'text-pink-500',
        bgColor: 'bg-pink-100 dark:bg-pink-900/30',
        trends: [],
        insights: {
            topCategory: 'Lifestyle',
            avgEngagement: '3.8%',
            bestTime: '11 AM, 2 PM, 7 PM',
            contentType: 'Reels & Stories',
        }
    },
    {
        id: 'twitter',
        name: 'Twitter/X',
        icon: Twitter,
        color: 'text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        trends: [],
        insights: {
            topCategory: 'News & Tech',
            avgEngagement: '2.1%',
            bestTime: '8 AM, 12 PM, 5 PM',
            contentType: 'Threads & Quick takes',
        }
    },
]

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function PlatformInsightsPage() {
    const [platforms, setPlatforms] = useState(PLATFORMS)
    const [loading, setLoading] = useState(true)
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

    useEffect(() => {
        fetchAllTrends()
    }, [])

    const fetchAllTrends = async () => {
        setLoading(true)
        try {
            // Fetch general trends and categorize by platform relevance
            const response = await fetch('/api/trends/google?geo=IN')
            const data = await response.json()

            if (data.success && data.data?.trends) {
                const trends = data.data.trends.slice(0, 20)

                // Simple categorization based on keywords
                const ytTrends: string[] = []
                const igTrends: string[] = []
                const twTrends: string[] = []

                trends.forEach((t: any) => {
                    const title = t.title.toLowerCase()
                    // YouTube: movies, music, gaming, tech reviews
                    if (title.includes('movie') || title.includes('trailer') || title.includes('music') ||
                        title.includes('gaming') || title.includes('review') || title.includes('video')) {
                        ytTrends.push(t.title)
                    }
                    // Instagram: lifestyle, fashion, celebs
                    if (title.includes('fashion') || title.includes('style') || title.includes('photo') ||
                        title.includes('model') || title.includes('outfit')) {
                        igTrends.push(t.title)
                    }
                    // Twitter: news, politics, tech
                    if (title.includes('news') || title.includes('breaking') || title.includes('update') ||
                        title.includes('announce') || title.includes('launch')) {
                        twTrends.push(t.title)
                    }
                    // If trend didn't match, add to platform with fewer trends
                    if (!ytTrends.includes(t.title) && !igTrends.includes(t.title) && !twTrends.includes(t.title)) {
                        if (ytTrends.length <= igTrends.length && ytTrends.length <= twTrends.length) {
                            ytTrends.push(t.title)
                        } else if (igTrends.length <= twTrends.length) {
                            igTrends.push(t.title)
                        } else {
                            twTrends.push(t.title)
                        }
                    }
                })

                setPlatforms(prev => prev.map(p => {
                    if (p.id === 'youtube') return { ...p, trends: ytTrends.slice(0, 5) }
                    if (p.id === 'instagram') return { ...p, trends: igTrends.slice(0, 5) }
                    if (p.id === 'twitter') return { ...p, trends: twTrends.slice(0, 5) }
                    return p
                }))
            }
        } catch (err) {
            console.error('Failed to fetch:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#7E7F83]" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-[#14110F] dark:text-[#F3F3F4] flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-indigo-500" />
                        Platform Insights
                    </h1>
                    <p className="text-[#7E7F83] text-sm">Platform-specific trends and recommendations</p>
                </div>
                <button
                    onClick={fetchAllTrends}
                    disabled={loading}
                    className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                >
                    <RefreshCw className={cn("w-5 h-5 text-[#7E7F83]", loading && "animate-spin")} />
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-[#D9C5B2]" />
                </div>
            ) : (
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                    {/* Platform Cards */}
                    <motion.div variants={item} className="grid md:grid-cols-3 gap-6">
                        {platforms.map((platform) => (
                            <div
                                key={platform.id}
                                onClick={() => setSelectedPlatform(selectedPlatform === platform.id ? null : platform.id)}
                                className={cn(
                                    "p-5 rounded-xl bg-white dark:bg-[#1A1714] border-2 cursor-pointer transition-all",
                                    selectedPlatform === platform.id
                                        ? "border-[#D9C5B2]"
                                        : "border-[#E8E8E9] dark:border-[#34312D] hover:border-[#D9C5B2]/50"
                                )}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", platform.bgColor)}>
                                        <platform.icon className={cn("w-6 h-6", platform.color)} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">{platform.name}</h3>
                                        <p className="text-xs text-[#7E7F83]">{platform.trends.length} trending topics</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="p-2 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D]">
                                        <p className="text-xs text-[#7E7F83]">Top Category</p>
                                        <p className="font-medium text-[#14110F] dark:text-[#F3F3F4]">{platform.insights.topCategory}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D]">
                                        <p className="text-xs text-[#7E7F83]">Engagement</p>
                                        <p className="font-medium text-emerald-600 dark:text-emerald-400">{platform.insights.avgEngagement}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D]">
                                        <p className="text-xs text-[#7E7F83]">Best Time</p>
                                        <p className="font-medium text-[#14110F] dark:text-[#F3F3F4] text-xs">{platform.insights.bestTime}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D]">
                                        <p className="text-xs text-[#7E7F83]">Content</p>
                                        <p className="font-medium text-[#14110F] dark:text-[#F3F3F4] text-xs">{platform.insights.contentType}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Selected Platform Trends */}
                    {selectedPlatform && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]"
                        >
                            {(() => {
                                const platform = platforms.find(p => p.id === selectedPlatform)!
                                return (
                                    <>
                                        <h3 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-4 flex items-center gap-2">
                                            <TrendingUp className={platform.color} />
                                            Trending on {platform.name}
                                        </h3>
                                        <div className="space-y-2">
                                            {platform.trends.length > 0 ? (
                                                platform.trends.map((trend, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors">
                                                        <span className="w-6 h-6 rounded-full bg-[#F3F3F4] dark:bg-[#34312D] flex items-center justify-center text-xs font-medium text-[#7E7F83]">
                                                            {i + 1}
                                                        </span>
                                                        <p className="font-medium text-[#14110F] dark:text-[#F3F3F4]">{trend}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-[#7E7F83] text-center py-4">No specific trends detected</p>
                                            )}
                                        </div>
                                    </>
                                )
                            })()}
                        </motion.div>
                    )}

                    {/* Quick Tips */}
                    <motion.div variants={item} className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-indigo-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-sm text-indigo-700 dark:text-indigo-400">Cross-Platform Strategy</p>
                                <p className="text-sm text-indigo-600 dark:text-indigo-300">
                                    Repurpose your content across platforms. A YouTube video can become Instagram Reels, Twitter threads, and LinkedIn posts to maximize reach.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}
