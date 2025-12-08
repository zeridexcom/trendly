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
    matchesIndustry?: boolean
}

interface Personalization {
    industry: string
    location: string
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
    viral: 'bg-[#FF90E8] text-black border-black',
    reels: 'bg-[#FFC900] text-black border-black',
    lifestyle: 'bg-[#00F0FF] text-black border-black',
    entertainment: 'bg-[#B1F202] text-black border-black',
    motivation: 'bg-white text-black border-black',
    photography: 'bg-gray-200 text-black border-black',
    trending: 'bg-black text-white border-black',
}

export default function SocialTrendsPage() {
    const [instagramTrends, setInstagramTrends] = useState<SocialTrend[]>([])
    const [tiktokTrends, setTiktokTrends] = useState<SocialTrend[]>([])
    const [forYouTrends, setForYouTrends] = useState<SocialTrend[]>([])
    const [personalization, setPersonalization] = useState<Personalization | null>(null)
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
                setForYouTrends(data.data.forYou || [])
                if (data.personalization) {
                    setPersonalization(data.personalization)
                }
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
        <div className="max-w-6xl mx-auto pb-12 font-sans text-black">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    <ArrowLeft className="w-5 h-5 text-black" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-black fill-[#FF90E8]" />
                        Social Media Trends
                    </h1>
                    <p className="text-black font-bold border-l-4 border-black pl-3 mt-2">
                        Real-time viral hashtags form Instagram & TikTok
                    </p>
                </div>
                <button
                    onClick={fetchTrends}
                    disabled={loading}
                    className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                >
                    <RefreshCw className={cn("w-5 h-5 text-black", loading && "animate-spin")} />
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-16 h-16 border-4 border-black rounded-full border-t-[#FF90E8] animate-spin"></div>
                    <p className="font-bold text-xl uppercase tracking-widest">Loading Trends...</p>
                </div>
            ) : (
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-12">

                    {/* For You Section - AI Filtered 95%+ Relevant */}
                    {forYouTrends.length > 0 && personalization && personalization.industry !== 'ALL' && (
                        <motion.div variants={item}>
                            <div className="flex items-center gap-4 mb-6 p-4 border-b-4 border-black bg-gradient-to-r from-[#B1F202] to-[#00F0FF]">
                                <div className="w-12 h-12 border-2 border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                                    <Sparkles className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-black uppercase italic flex items-center gap-2">
                                        🤖 AI-Curated For You
                                    </h2>
                                    <p className="text-sm font-bold text-black">
                                        95%+ Relevant to {personalization.industry.charAt(0) + personalization.industry.slice(1).toLowerCase()} • Verified by AI
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {forYouTrends.map((trend: any, i) => (
                                    <motion.div
                                        key={trend.title}
                                        variants={item}
                                        className="relative p-5 bg-white border-3 border-black shadow-[6px_6px_0px_0px_#B1F202] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#00F0FF] transition-all group"
                                    >
                                        {/* Relevance Score Badge */}
                                        <span className="absolute -top-3 -right-3 px-3 py-1 bg-[#B1F202] border-2 border-black text-sm font-black uppercase rotate-3 shadow-md">
                                            {trend.relevanceScore}% Match
                                        </span>

                                        {/* Trend Title */}
                                        <h3 className="font-black text-xl text-black mb-2 pr-12">{trend.title}</h3>

                                        {/* AI Reason */}
                                        {trend.reason && (
                                            <p className="text-sm text-gray-600 mb-3 border-l-4 border-[#B1F202] pl-3">
                                                {trend.reason}
                                            </p>
                                        )}

                                        {/* Content Idea */}
                                        {trend.contentIdea && (
                                            <div className="bg-[#FFC900]/20 border-2 border-[#FFC900] p-3 mb-3">
                                                <p className="text-xs font-bold uppercase text-gray-700 mb-1">💡 Content Idea:</p>
                                                <p className="text-sm font-medium text-black">{trend.contentIdea}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                            <span className="text-sm font-bold text-gray-600">
                                                {trend.formattedTraffic || 'Trending'}
                                            </span>
                                            <button
                                                onClick={() => saveTrend(trend)}
                                                className="p-2 bg-[#FFC900] border-2 border-black hover:bg-black hover:text-white transition-colors"
                                            >
                                                <Bookmark className={cn("w-4 h-4", savingTrend === trend.title && "animate-pulse")} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* No matches message */}
                            {forYouTrends.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="font-bold">No 95%+ matches found right now</p>
                                    <p className="text-sm">Check back later for trends highly relevant to your niche</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Instagram Section */}
                    <motion.div variants={item}>
                        <div className="flex items-center gap-4 mb-6 p-4 border-b-4 border-black bg-white">
                            <div className="w-12 h-12 border-2 border-black bg-[#FF90E8] flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                                <Instagram className="w-6 h-6 text-black" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-black uppercase italic">
                                    Instagram Hashtags
                                </h2>
                                <p className="text-sm font-bold text-gray-600">Viral tags for maximum reach</p>
                            </div>
                            <button
                                onClick={copyAllHashtags}
                                className="flex items-center gap-2 px-4 py-3 bg-[#FFC900] border-2 border-black shadow-[4px_4px_0px_0px_#000] font-bold uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-sm"
                            >
                                {copiedTag === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                Copy All
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {instagramTrends.map((trend, i) => (
                                <motion.div
                                    key={trend.title}
                                    variants={item}
                                    className="relative p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FF90E8] transition-all group cursor-pointer"
                                    onClick={() => copyHashtag(trend.title)}
                                >
                                    {i < 3 && (
                                        <span className="absolute -top-3 -right-3 w-8 h-8 bg-black text-white border-2 border-white shadow-sm text-sm font-black flex items-center justify-center z-10 rotate-12">
                                            #{i + 1}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2 mb-3">
                                        <Hash className="w-5 h-5 text-black" />
                                        <span className="font-black text-lg text-black break-all">
                                            {trend.title.replace('#', '')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className={cn("text-xs px-2 py-1 font-bold border-2 capitalize", categoryColors[trend.category || 'trending'])}>
                                            {trend.category || 'trending'}
                                        </span>
                                        <span className="text-xs font-bold text-gray-500 group-hover:text-black transition-colors">
                                            {copiedTag === trend.title ? 'COPIED!' : 'COPY'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* TikTok Section */}
                    <motion.div variants={item}>
                        <div className="flex items-center gap-4 mb-6 p-4 border-b-4 border-black bg-white">
                            <div className="w-12 h-12 border-2 border-black bg-[#00F0FF] flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                                <Music className="w-6 h-6 text-black" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-black uppercase italic">
                                    TikTok Viral
                                </h2>
                                <p className="text-sm font-bold text-gray-600">Trending sounds & challenges</p>
                            </div>
                            <span className="px-3 py-1 font-black bg-red-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] animate-pulse">
                                LIVE
                            </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {tiktokTrends.map((trend, i) => (
                                <motion.div
                                    key={trend.title}
                                    variants={item}
                                    className="flex items-center gap-4 p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#000] transition-all group"
                                >
                                    <span className={cn(
                                        "w-10 h-10 border-2 border-black flex items-center justify-center text-lg font-black",
                                        i < 3
                                            ? "bg-[#B1F202] text-black"
                                            : "bg-gray-100 text-gray-500"
                                    )}>
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-black truncate text-lg">
                                            {trend.title}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs font-bold text-gray-500 mt-1">
                                            {trend.formattedTraffic && <span className="uppercase">{trend.formattedTraffic}</span>}
                                            {trend.socialScore > 15 && (
                                                <span className="flex items-center gap-1 bg-black text-[#FFC900] px-2 py-0.5 border border-black">
                                                    <Zap className="w-3 h-3 fill-[#FFC900]" /> HOT
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => saveTrend(trend)}
                                            disabled={savingTrend === trend.title}
                                            className="p-2 border-2 border-transparent hover:border-black hover:bg-gray-100 transition-all"
                                        >
                                            {savingTrend === trend.title ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-black" />
                                            ) : (
                                                <Bookmark className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                                            )}
                                        </button>
                                        <Link
                                            href={`/dashboard/ideas?topic=${encodeURIComponent(trend.title)}`}
                                            className="p-2 border-2 border-transparent hover:border-black hover:bg-[#FF90E8] transition-all"
                                        >
                                            <Sparkles className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Usage Tips */}
                    <motion.div variants={item} className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white border-2 border-black shadow-[8px_8px_0px_0px_#FF90E8]">
                            <div className="flex items-start gap-4">
                                <Instagram className="w-8 h-8 text-black" />
                                <div>
                                    <p className="font-black text-xl uppercase mb-2">Instagram Strategy</p>
                                    <p className="font-medium text-black">
                                        Use 5-10 trending hashtags per Reel. Mix popular (#viral) with niche hashtags for best reach.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-white border-2 border-black shadow-[8px_8px_0px_0px_#00F0FF]">
                            <div className="flex items-start gap-4">
                                <Music className="w-8 h-8 text-black" />
                                <div>
                                    <p className="font-black text-xl uppercase mb-2">TikTok Strategy</p>
                                    <p className="font-medium text-black">
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
