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
}

interface TrendingTopic {
    title: string
    formattedTraffic: string
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
            }
        } catch (err) {
            console.error('Failed to fetch videos:', err)
        } finally {
            setLoadingVideos(false)
        }
    }

    const fetchTrendingTopics = async () => {
        setLoadingTopics(true)
        try {
            const response = await fetch('/api/trends/google?geo=IN')
            const data = await response.json()
            if (data.success && data.data.trends) {
                setTrendingTopics(data.data.trends.slice(0, 8))
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
                <h1 className="text-2xl font-semibold text-[#14110F] dark:text-[#F3F3F4]">
                    {greeting}! 👋
                </h1>
                <p className="text-[#7E7F83] mt-1">
                    Here's what's trending right now - real-time data from YouTube & Google
                </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {quickActions.map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        className="p-4 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D] hover:border-[#D9C5B2] transition-all group"
                    >
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", action.color)}>
                            <action.icon className="w-5 h-5" />
                        </div>
                        <p className="font-medium text-[#14110F] dark:text-[#F3F3F4] group-hover:text-[#D9C5B2] transition-colors flex items-center gap-1">
                            {action.label}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                    </Link>
                ))}
            </motion.div>

            {/* Trending Topics from Google */}
            <motion.div variants={item}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        Trending on Google India
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
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {trendingTopics.map((topic, i) => (
                            <Link
                                key={i}
                                href={`/dashboard/ideas?topic=${encodeURIComponent(topic.title)}`}
                                className="p-4 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D] hover:border-[#D9C5B2] transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {i < 3 && <Zap className="w-3.5 h-3.5 text-amber-500" />}
                                    <span className="text-xs text-[#7E7F83]">{topic.formattedTraffic}</span>
                                </div>
                                <p className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4] line-clamp-2 group-hover:text-[#D9C5B2] transition-colors">
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
                    <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] flex items-center gap-2">
                        <Youtube className="w-5 h-5 text-red-500" />
                        Trending on YouTube India
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
                            className="text-sm text-[#D9C5B2] hover:underline flex items-center gap-1"
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
                                    <h3 className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4] line-clamp-2 mb-2 group-hover:text-[#D9C5B2] transition-colors">
                                        {video.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-xs text-[#7E7F83]">
                                        <span>{video.channelTitle}</span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3.5 h-3.5" />
                                            {video.formattedViews}
                                        </span>
                                    </div>
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
