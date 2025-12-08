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
    borderColor: string
    shadowColor: string
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
        color: 'text-black',
        bgColor: 'bg-[#FF9090]',
        borderColor: 'border-black',
        shadowColor: 'shadow-[4px_4px_0px_0px_#000]',
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
        color: 'text-black',
        bgColor: 'bg-[#FF90E8]',
        borderColor: 'border-black',
        shadowColor: 'shadow-[4px_4px_0px_0px_#000]',
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
        color: 'text-black',
        bgColor: 'bg-[#00F0FF]',
        borderColor: 'border-black',
        shadowColor: 'shadow-[4px_4px_0px_0px_#000]',
        trends: [],
        insights: {
            topCategory: 'News & Tech',
            avgEngagement: '2.1%',
            bestTime: '8 AM, 12 PM, 5 PM',
            contentType: 'Threads',
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
        <div className="max-w-5xl mx-auto pb-12 font-sans text-black">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <Link href="/dashboard" className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    <ArrowLeft className="w-5 h-5 text-black" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-black fill-[#FFC900]" />
                        Platform Insights
                    </h1>
                    <p className="text-black font-bold border-l-4 border-black pl-3 mt-2">Where should you post next?</p>
                </div>
                <button
                    onClick={fetchAllTrends}
                    disabled={loading}
                    className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                    <RefreshCw className={cn("w-5 h-5 text-black", loading && "animate-spin")} />
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-black" />
                </div>
            ) : (
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
                    {/* Platform Cards */}
                    <motion.div variants={item} className="grid md:grid-cols-3 gap-6">
                        {platforms.map((platform) => (
                            <div
                                key={platform.id}
                                onClick={() => setSelectedPlatform(selectedPlatform === platform.id ? null : platform.id)}
                                className={cn(
                                    "p-6 bg-white border-2 border-black cursor-pointer transition-all hover:bg-gray-50",
                                    platform.shadowColor,
                                    selectedPlatform === platform.id ? "translate-x-[2px] translate-y-[2px] shadow-none bg-[#F3F3F3]" : "hover:-translate-y-1"
                                )}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={cn("w-14 h-14 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]", platform.bgColor)}>
                                        <platform.icon className={cn("w-7 h-7", platform.color)} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase">{platform.name}</h3>
                                        <p className="text-xs font-bold text-gray-500 uppercase">{platform.trends.length} TRENDS</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="p-3 border-2 border-black bg-white">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Category</p>
                                        <p className="font-black uppercase truncate">{platform.insights.topCategory}</p>
                                    </div>
                                    <div className="p-3 border-2 border-black bg-white">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Engagement</p>
                                        <p className="font-black uppercase text-[#00AA00]">{platform.insights.avgEngagement}</p>
                                    </div>
                                    <div className="p-3 border-2 border-black bg-white col-span-2">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Best Time</p>
                                        <p className="font-black uppercase">{platform.insights.bestTime}</p>
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
                            className="p-8 bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000]"
                        >
                            {(() => {
                                const platform = platforms.find(p => p.id === selectedPlatform)!
                                return (
                                    <>
                                        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
                                            <TrendingUp className="w-8 h-8 text-black" />
                                            <h3 className="text-2xl font-black uppercase">
                                                Trending on {platform.name}
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            {platform.trends.length > 0 ? (
                                                platform.trends.map((trend, i) => (
                                                    <div key={i} className="flex items-center gap-4 p-4 border-2 border-black hover:bg-[#FFF9E5] transition-colors">
                                                        <span className="w-8 h-8 flex items-center justify-center font-black text-white bg-black border-2 border-black">
                                                            {i + 1}
                                                        </span>
                                                        <p className="text-lg font-bold uppercase">{trend}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 font-bold uppercase text-center py-6">No specific trends detected</p>
                                            )}
                                        </div>
                                    </>
                                )
                            })()}
                        </motion.div>
                    )}

                    {/* Quick Tips */}
                    <motion.div variants={item} className="p-6 bg-[#00F0FF] border-2 border-black shadow-[8px_8px_0px_0px_#000]">
                        <div className="flex items-start gap-4">
                            <Zap className="w-8 h-8 text-black fill-white" />
                            <div>
                                <p className="font-black text-xl uppercase mb-1">Strategist Tip</p>
                                <p className="font-medium text-black">
                                    Repurpose your content! A YouTube video can become 3 Shorts, 5 Tweets, and a LinkedIn carousel. Maximize your ROI.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}
