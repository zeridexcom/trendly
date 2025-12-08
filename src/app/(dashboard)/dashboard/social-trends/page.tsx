'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Instagram, Music, RefreshCw, Loader2, ArrowLeft,
    TrendingUp, Zap, Bookmark, Sparkles, Hash, Copy, Check
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SocialTrend {
    title: string
    formattedTraffic?: string
    socialScore: number
    platform: 'instagram' | 'tiktok' | 'both'
    source?: string
    category?: string
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

const categoryColors: Record<string, string> = {
    viral: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    reels: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    lifestyle: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    entertainment: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    motivation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    photography: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    trending: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

export default function SocialTrendsPage() {
    const [instagramTrends, setInstagramTrends] = useState<SocialTrend[]>([])
    const [tiktokTrends, setTiktokTrends] = useState<SocialTrend[]>([])
    const [loading, setLoading] = useState(true)
    const [savingTrend, setSavingTrend] = useState<string | null>(null)
    const [copiedTag, setCopiedTag] = useState<string | null>(null)

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

    const copyHashtag = (hashtag: string) => {
        navigator.clipboard.writeText(hashtag)
        setCopiedTag(hashtag)
        setTimeout(() => setCopiedTag(null), 2000)
    }

    const copyAllHashtags = () => {
        const all = instagramTrends.map(t => t.title).join(' ')
        navigator.clipboard.writeText(all)
        setCopiedTag('all')
        setTimeout(() => setCopiedTag(null), 2000)
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
                        <TrendingUp className="w-6 h-6 text-pink-500" />
                        Social Media Trends
                    </h1>
                    <p className="text-[#7E7F83] text-sm">
                        Instagram hashtags & TikTok viral trends
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
                            <div className="flex-1">
                                <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">
                                    Instagram Trending Hashtags
                                </h2>
                                <p className="text-xs text-[#7E7F83]">Copy & use these for maximum reach</p>
                            </div>
                            <button
                                onClick={copyAllHashtags}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-[#D9C5B2] text-[#14110F] font-medium hover:bg-[#C4B09D] transition-colors"
                            >
                                {copiedTag === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                Copy All
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {instagramTrends.map((trend, i) => (
                                <motion.div
                                    key={trend.title}
                                    variants={item}
                                    className="relative p-4 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D] hover:border-pink-300 dark:hover:border-pink-700 transition-all group cursor-pointer"
                                    onClick={() => copyHashtag(trend.title)}
                                >
                                    {i < 3 && (
                                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-bold flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2 mb-2">
                                        <Hash className="w-4 h-4 text-pink-500" />
                                        <span className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">
                                            {trend.title.replace('#', '')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={cn("text-xs px-2 py-0.5 rounded-full", categoryColors[trend.category || 'trending'])}>
                                            {trend.category || 'trending'}
                                        </span>
                                        <span className="text-xs text-[#7E7F83]">
                                            {copiedTag === trend.title ? '✓ Copied!' : 'Click to copy'}
                                        </span>
                                    </div>
                                </motion.div>
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
                                    TikTok Viral Trends
                                </h2>
                                <p className="text-xs text-[#7E7F83]">What's going viral right now</p>
                            </div>
                            <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 rounded-full">
                                LIVE
                            </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                            {tiktokTrends.map((trend, i) => (
                                <motion.div
                                    key={trend.title}
                                    variants={item}
                                    className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D] hover:border-cyan-300 dark:hover:border-cyan-700 transition-all group"
                                >
                                    <span className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                                        i < 3
                                            ? "bg-gradient-to-br from-cyan-400 to-pink-500 text-white"
                                            : "bg-[#F3F3F4] dark:bg-[#34312D] text-[#7E7F83]"
                                    )}>
                                        {i + 1}
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
                            ))}
                        </div>
                    </motion.div>

                    {/* Usage Tips */}
                    <motion.div variants={item} className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200 dark:border-pink-800">
                            <div className="flex items-start gap-3">
                                <Instagram className="w-5 h-5 text-pink-500 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-pink-700 dark:text-pink-400">Instagram Tips</p>
                                    <p className="text-xs text-pink-600 dark:text-pink-300 mt-1">
                                        Use 5-10 trending hashtags per Reel. Mix popular (#viral) with niche hashtags for best reach.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-200 dark:border-cyan-800">
                            <div className="flex items-start gap-3">
                                <Music className="w-5 h-5 text-cyan-500 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-cyan-700 dark:text-cyan-400">TikTok Tips</p>
                                    <p className="text-xs text-cyan-600 dark:text-cyan-300 mt-1">
                                        Jump on trends within 24-48 hours. Use popular sounds and add your unique twist!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}
