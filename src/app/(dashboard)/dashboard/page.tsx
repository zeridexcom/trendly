'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    Lightbulb,
    Calendar,
    Sparkles,
    ArrowRight,
    Eye,
    Heart,
    MessageCircle,
    Youtube,
    Zap,
    RefreshCw,
    ExternalLink,
    Target,
    BarChart3,
    Clock,
    Flame,
    ChevronRight,
    Globe,
    Bookmark,
    Loader2,
    Hand
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface YouTubeVideo {
    id: string
    title: string
    thumbnail: string
    channelTitle: string
    formattedViews: string
    engagementRate: string
    url: string
    daysAgo?: number
    aiInsight?: {
        whyPopular: string
        keyTakeaway: string
        contentIdea: string
    }
}

interface TrendingTopic {
    title: string
    formattedTraffic: string
    industry?: string
}

interface Personalization {
    location: string
    industry: string
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
    const [trendingVideos, setTrendingVideos] = useState<YouTubeVideo[]>([])
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
    const [loadingVideos, setLoadingVideos] = useState(true)
    const [loadingTopics, setLoadingTopics] = useState(true)
    const [greeting, setGreeting] = useState('')
    const [personalization, setPersonalization] = useState<Personalization | null>(null)
    const [savingTrend, setSavingTrend] = useState<string | null>(null)
    const [youtubePersonalization, setYoutubePersonalization] = useState<{ industry: string | null; isPersonalized: boolean; matchingVideos: number } | null>(null)

    useEffect(() => {
        // Set greeting based on time
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good morning')
        else if (hour < 17) setGreeting('Good afternoon')
        else setGreeting('Good evening')

        fetchTrendingVideos()
        fetchTrendingTopics()
    }, [])

    const fetchTrendingVideos = async () => {
        setLoadingVideos(true)
        try {
            const response = await fetch('/api/youtube/trending?region=IN&limit=6')
            const data = await response.json()
            if (data.success) {
                setTrendingVideos(data.data.videos.slice(0, 6))
                if (data.data.personalization) {
                    setYoutubePersonalization(data.data.personalization)
                }
            }
        } catch (err) {
            console.error('Failed to fetch videos:', err)
        } finally {
            setLoadingVideos(false)
        }
    }

    const saveTrend = async (e: React.MouseEvent, trend: any) => {
        e.preventDefault() // Prevent navigation
        e.stopPropagation()
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

    const fetchTrendingTopics = async () => {
        setLoadingTopics(true)
        try {
            // Use personalized trends API
            const response = await fetch('/api/trends/personalized')
            const data = await response.json()
            if (data.success && data.trends) {
                setTrendingTopics(data.trends.slice(0, 8))
                if (data.personalization) {
                    setPersonalization(data.personalization)
                }
            }
        } catch (err) {
            console.error('Failed to fetch topics:', err)
        } finally {
            setLoadingTopics(false)
        }
    }

    const quickActions = [
        { label: 'Explore Trends', href: '/dashboard/trends', icon: TrendingUp, color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
        { label: 'Generate Ideas', href: '/dashboard/ideas', icon: Lightbulb, color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
        { label: 'AI Scripts', href: '/dashboard/scripts', icon: Sparkles, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
        { label: 'Content Calendar', href: '/dashboard/calendar', icon: Calendar, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
    ]

    return (
        <motion.div initial="hidden" animate="show" variants={container} className="space-y-6 pb-8">
            {/* Header */}
            <motion.div variants={item}>
                <h1 className="text-5xl font-black italic tracking-tighter text-black mb-2 flex items-center gap-4">
                    <span className="underline decoration-[#FF90E8] decoration-8 underline-offset-4">{greeting.toUpperCase()}</span>
                    <Hand className="w-12 h-12 text-black fill-[#FFC900] -rotate-12" strokeWidth={3} />
                </h1>
                <p className="text-black font-medium border-l-4 border-black pl-4 py-1 mt-4">
                    Here's what's trending right now - real-time data from YouTube & Google
                </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFC900] transition-all group"
                    >
                        <div className={cn("w-10 h-10 border-2 border-black flex items-center justify-center mb-3 bg-white", action.color)}>
                            <action.icon className="w-5 h-5 text-black" />
                        </div>
                        <p className="font-bold text-black group-hover:underline decoration-black decoration-2 flex items-center gap-1">
                            {action.label}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                    </Link>
                ))}
            </motion.div>

            {/* Trending Topics - AI Verified */}
            <motion.div variants={item}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] flex items-center gap-2 flex-wrap">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className="font-bold text-black dark:text-white">
                            {personalization?.industry && personalization.industry !== 'ALL'
                                ? `${personalization.industry.charAt(0) + personalization.industry.slice(1).toLowerCase()} Trends`
                                : 'Trending Now'
                            }
                        </span>
                        {personalization?.location && (
                            <span className="text-[#34312D] dark:text-[#B0ADB0] font-normal text-sm">
                                in {personalization.location === 'IN' ? 'India' :
                                    personalization.location === 'US' ? 'United States' :
                                        personalization.location === 'GB' ? 'United Kingdom' :
                                            personalization.location}
                            </span>
                        )}
                        {(personalization as any)?.aiFiltered && (
                            <span className="px-2 py-0.5 text-xs font-bold bg-[#B1F202] text-black border border-black rounded-sm uppercase">
                                🤖 AI Verified
                            </span>
                        )}
                        <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                            LIVE
                        </span>
                    </h2>
                    <button
                        onClick={fetchTrendingTopics}
                        disabled={loadingTopics}
                        className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                    >
                        <RefreshCw className={cn("w-4 h-4 text-[#7E7F83]", loadingTopics && "animate-spin")} />
                    </button>
                </div>

                {loadingTopics ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="animate-pulse h-16 rounded-xl bg-[#F3F3F4] dark:bg-[#34312D]" />
                        ))}
                    </div>
                ) : trendingTopics.length === 0 && personalization?.industry ? (
                    <div className="p-8 bg-white border-2 border-black text-center">
                        <p className="font-black text-xl mb-2">🔍 No 95%+ Relevant Trends Found</p>
                        <p className="text-gray-600 mb-4">
                            No trends matching {personalization.industry.toLowerCase()} right now.
                        </p>
                        <p className="text-sm text-gray-500">
                            We only show trends that are highly relevant to your niche. Check back later or explore general trends.
                        </p>
                        <Link
                            href="/dashboard/trends"
                            className="inline-block mt-4 px-6 py-3 bg-[#FFC900] border-2 border-black font-bold shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                        >
                            Explore All Trends →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {trendingTopics.map((topic, i) => (
                            <Link
                                key={i}
                                href={`/dashboard/ideas?topic=${encodeURIComponent(topic.title)}`}
                                className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FF90E8] transition-all group relative block"
                            >
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                        onClick={(e) => saveTrend(e, topic)}
                                        disabled={savingTrend === topic.title}
                                        className="p-1.5 bg-white hover:bg-black hover:text-white transition-colors border-2 border-black"
                                    >
                                        {savingTrend === topic.title ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-black group-hover:text-white" />
                                        ) : (
                                            <Bookmark className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    {i < 3 && <Zap className="w-3.5 h-3.5 text-black fill-[#FFC900]" />}
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{topic.formattedTraffic}</span>
                                </div>
                                <p className="font-bold text-sm text-black line-clamp-2 pr-6 border-b-2 border-transparent group-hover:border-black inline-block">
                                    {topic.title}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Trending YouTube Videos */}
            <motion.div variants={item}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] flex items-center gap-2 flex-wrap">
                        <Youtube className="w-5 h-5 text-red-500" />
                        <span className="font-bold text-black dark:text-white">
                            {youtubePersonalization?.isPersonalized && youtubePersonalization.industry
                                ? `${youtubePersonalization.industry.charAt(0) + youtubePersonalization.industry.slice(1).toLowerCase()} Videos`
                                : 'Trending on YouTube India'
                            }
                        </span>
                        {youtubePersonalization?.isPersonalized && (
                            <span className="text-[#34312D] dark:text-[#B0ADB0] font-normal text-sm">
                                for you
                            </span>
                        )}
                        {youtubePersonalization?.isPersonalized && youtubePersonalization.matchingVideos > 0 && (
                            <span className="px-2 py-0.5 text-xs font-bold bg-[#B1F202] text-black border border-black rounded-sm">
                                🎯 {youtubePersonalization.matchingVideos} MATCHED
                            </span>
                        )}
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                            LIVE
                        </span>
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchTrendingVideos}
                            disabled={loadingVideos}
                            className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                        >
                            <RefreshCw className={cn("w-4 h-4 text-[#7E7F83]", loadingVideos && "animate-spin")} />
                        </button>
                        <Link
                            href="/dashboard/trends"
                            className="text-sm text-[#34312D] dark:text-[#B0ADB0] hover:underline flex items-center gap-1 font-medium"
                        >
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {loadingVideos ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="animate-pulse rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D] overflow-hidden">
                                <div className="aspect-video bg-[#F3F3F4] dark:bg-[#34312D]" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-[#F3F3F4] dark:bg-[#34312D] rounded w-3/4" />
                                    <div className="h-3 bg-[#F3F3F4] dark:bg-[#34312D] rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {trendingVideos.map((video, i) => (
                            <a
                                key={video.id}
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D] overflow-hidden hover:border-[#D9C5B2] transition-all group"
                            >
                                <div className="relative aspect-video">
                                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                                    {i < 3 && (
                                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center gap-1">
                                            <Zap className="w-3 h-3" />
                                            #{i + 1}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                                        <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        {video.daysAgo !== undefined && (
                                            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                                {video.daysAgo === 0 ? 'TODAY' : video.daysAgo === 1 ? '1 DAY AGO' : `${video.daysAgo} DAYS AGO`}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-sm text-black dark:text-white line-clamp-2 mb-2 group-hover:text-[#D9C5B2] transition-colors">
                                        {video.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-xs text-[#34312D] dark:text-[#B0ADB0] mb-2">
                                        <span className="font-medium">{video.channelTitle}</span>
                                        <span className="flex items-center gap-1 font-bold">
                                            <Eye className="w-3.5 h-3.5" />
                                            {video.formattedViews}
                                        </span>
                                    </div>
                                    {video.aiInsight && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase mb-1 flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" /> AI Insight
                                            </div>
                                            <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 mb-1">
                                                <span className="font-semibold">Why Viral:</span> {video.aiInsight.whyPopular}
                                            </p>
                                            <p className="text-xs text-green-700 dark:text-green-400 line-clamp-1">
                                                <span className="font-semibold">💡 Content Idea:</span> {video.aiInsight.contentIdea}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* AI Assistant Promo */}
            <motion.div variants={item}>
                <div className="p-6 rounded-xl bg-gradient-to-br from-[#D9C5B2]/30 to-[#D9C5B2]/10 border border-[#D9C5B2]/30">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-[#D9C5B2]">
                            <Sparkles className="w-6 h-6 text-[#14110F]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-1">
                                Your AI Marketing Manager
                            </h3>
                            <p className="text-sm text-[#7E7F83] mb-4">
                                I analyze real-time trends, generate viral content ideas, and help you understand why videos go viral. Click on any trending video to get deep insights!
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href="/dashboard/trends"
                                    className="px-4 py-2 rounded-lg bg-[#D9C5B2] text-[#14110F] text-sm font-medium hover:bg-[#C4B09D] transition-colors flex items-center gap-2"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    Analyze Trends
                                </Link>
                                <Link
                                    href="/dashboard/ideas"
                                    className="px-4 py-2 rounded-lg bg-white dark:bg-[#1A1714] text-[#14110F] dark:text-[#F3F3F4] text-sm font-medium border border-[#E8E8E9] dark:border-[#34312D] hover:border-[#D9C5B2] transition-colors flex items-center gap-2"
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    Generate Ideas
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
