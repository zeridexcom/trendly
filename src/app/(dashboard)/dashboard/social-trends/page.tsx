'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Instagram, Music, RefreshCw, Loader2, ArrowLeft,
    TrendingUp, Zap, Bookmark, ExternalLink, Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SocialTrend {
    title: string
    formattedTraffic?: string
    socialScore: number
    platform: 'instagram' | 'tiktok' | 'both'
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function SocialTrendsPage() {
    const [instagramTrends, setInstagramTrends] = useState<SocialTrend[]>([])
    const [tiktokTrends, setTiktokTrends] = useState<SocialTrend[]>([])
    const [loading, setLoading] = useState(true)
    const [savingTrend, setSavingTrend] = useState<string | null>(null)

    useEffect(() => {
        fetchTrends()
    }, [])

    const fetchTrends = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/trends/social')
            const data = await response.json()

            if (data.success) {
                setInstagramTrends(data.data.instagram || [])
                setTiktokTrends(data.data.tiktok || [])
            }
        } catch (error) {
            console.error('Failed to fetch:', error)
        } finally {
            setLoading(false)
        }
    }

    const saveTrend = async (trend: SocialTrend) => {
        setSavingTrend(trend.title)
        try {
            await fetch('/api/trends/saved', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trend }),
            })
        } catch (error) {
            console.error('Failed to save:', error)
        } finally {
            setSavingTrend(null)
        }
    }

    const TrendCard = ({ trend, index, platform }: { trend: SocialTrend, index: number, platform: 'instagram' | 'tiktok' }) => (
        <motion.div
            variants={item}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D] hover:border-[#D9C5B2] transition-all group"
        >
            <span className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                index < 3
                    ? platform === 'instagram'
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                        : "bg-gradient-to-br from-cyan-400 to-pink-500 text-white"
                    : "bg-[#F3F3F4] dark:bg-[#34312D] text-[#7E7F83]"
            )}>
                {index + 1}
            </span>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4] truncate">
                    {trend.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#7E7F83]">
                    {trend.formattedTraffic && <span>{trend.formattedTraffic}</span>}
                    {trend.socialScore > 15 && (
                        <span className="flex items-center gap-0.5 text-amber-500">
                            <Zap className="w-3 h-3" /> Hot
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => saveTrend(trend)}
                    disabled={savingTrend === trend.title}
                    className="p-1.5 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                >
                    {savingTrend === trend.title ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#D9C5B2]" />
                    ) : (
                        <Bookmark className="w-4 h-4 text-[#7E7F83]" />
                    )}
                </button>
                <Link
                    href={`/dashboard/ideas?topic=${encodeURIComponent(trend.title)}`}
                    className="p-1.5 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                >
                    <Sparkles className="w-4 h-4 text-[#7E7F83]" />
                </Link>
            </div>
        </motion.div>
    )

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#7E7F83]" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-[#14110F] dark:text-[#F3F3F4] flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-pink-500" />
                        Social Media Trends
                    </h1>
                    <p className="text-[#7E7F83] text-sm">
                        What's viral on Instagram Reels & TikTok right now
                    </p>
                </div>
                <button
                    onClick={fetchTrends}
                    disabled={loading}
                    className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                >
                    <RefreshCw className={cn("w-5 h-5 text-[#7E7F83]", loading && "animate-spin")} />
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-[#D9C5B2]" />
                </div>
            ) : (
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
                    {/* Instagram Section */}
                    <motion.div variants={item}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                                <Instagram className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">
                                    Trending on Instagram Reels
                                </h2>
                                <p className="text-xs text-[#7E7F83]">Viral content people are searching for</p>
                            </div>
                            <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 rounded-full">
                                LIVE
                            </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                            {instagramTrends.map((trend, i) => (
                                <TrendCard key={trend.title} trend={trend} index={i} platform="instagram" />
                            ))}
                        </div>
                    </motion.div>

                    {/* TikTok Section */}
                    <motion.div variants={item}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-pink-500 to-red-500 flex items-center justify-center">
                                <Music className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">
                                    Trending on TikTok
                                </h2>
                                <p className="text-xs text-[#7E7F83]">Dances, challenges & viral sounds</p>
                            </div>
                            <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 rounded-full">
                                LIVE
                            </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                            {tiktokTrends.map((trend, i) => (
                                <TrendCard key={trend.title} trend={trend} index={i} platform="tiktok" />
                            ))}
                        </div>
                    </motion.div>

                    {/* Tip */}
                    <motion.div variants={item} className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200 dark:border-pink-800">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-pink-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-sm text-pink-700 dark:text-pink-400">
                                    How This Works
                                </p>
                                <p className="text-sm text-pink-600 dark:text-pink-300">
                                    We analyze Google search trends to identify what's going viral on social media. When something trends on Instagram or TikTok, millions search for it on Google - that's how we catch trends like "Husky Dance" in real-time!
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}
