'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Bookmark, Trash2, ExternalLink, Loader2, Clock,
    TrendingUp, ArrowLeft, Sparkles, AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface SavedTrend {
    title: string
    traffic?: string
    formattedTraffic?: string
    industry?: string
    savedAt: string
    newsUrl?: string
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function SavedTrendsPage() {
    const [trends, setTrends] = useState<SavedTrend[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        loadSavedTrends()
    }, [])

    const loadSavedTrends = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/trends/saved')
            const data = await response.json()
            if (data.success) {
                setTrends(data.trends || [])
            }
        } catch (error) {
            console.error('Failed to load saved trends:', error)
        } finally {
            setLoading(false)
        }
    }

    const deleteTrend = async (title: string) => {
        setDeleting(title)
        try {
            const response = await fetch(`/api/trends/saved?title=${encodeURIComponent(title)}`, {
                method: 'DELETE',
            })
            const data = await response.json()
            if (data.success) {
                setTrends(data.trends || [])
            }
        } catch (error) {
            console.error('Failed to delete trend:', error)
        } finally {
            setDeleting(null)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-black" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 font-sans text-black">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <Link
                    href="/dashboard"
                    className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                    <ArrowLeft className="w-5 h-5 text-black" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <Bookmark className="w-8 h-8 text-black fill-[#00F0FF]" />
                        Saved Trends
                    </h1>
                    <p className="text-black font-bold border-l-4 border-black pl-3 mt-2">
                        Your personal idea vault
                    </p>
                </div>
                <div className="px-4 py-2 border-2 border-black bg-[#00F0FF] shadow-[4px_4px_0px_0px_#000]">
                    <span className="font-black text-lg">
                        {trends.length} SAVED
                    </span>
                </div>
            </div>

            {/* Empty State */}
            {trends.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 px-8 bg-white border-2 border-black border-dashed"
                >
                    <div className="w-20 h-20 bg-[#F3F3F3] border-2 border-black flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_0px_#000]">
                        <Bookmark className="w-8 h-8 text-black" />
                    </div>
                    <h2 className="text-2xl font-black text-black uppercase mb-3">
                        No saved trends yet
                    </h2>
                    <p className="text-gray-600 font-medium mb-8 max-w-md mx-auto">
                        Bookmark interesting trends from the dashboard to analyze them later.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-black uppercase text-lg hover:bg-[#FFC900] hover:text-black hover:shadow-[6px_6px_0px_0px_#000] border-2 border-transparent hover:border-black transition-all"
                    >
                        <TrendingUp className="w-6 h-6" />
                        Explore Trends
                    </Link>
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {trends.map((trend) => (
                        <motion.div
                            key={trend.title}
                            variants={item}
                            className="flex items-center gap-5 p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all group"
                        >
                            <div className="w-12 h-12 bg-[#FF90E8] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                                <TrendingUp className="w-6 h-6 text-black" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-xl text-black uppercase truncate mb-1">
                                    {trend.title}
                                </h3>
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 border border-black">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(trend.savedAt)}
                                    </span>
                                    {trend.industry && (
                                        <span className="px-2 py-0.5 bg-[#F3F3F3] border border-black text-black uppercase">
                                            {trend.industry}
                                        </span>
                                    )}
                                    {trend.formattedTraffic && (
                                        <span className="text-[#FFC900] bg-black px-2 py-0.5">{trend.formattedTraffic} SEARCHES</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {trend.newsUrl && (
                                    <a
                                        href={trend.newsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-white border-2 border-black hover:bg-[#00F0FF] transition-colors"
                                    >
                                        <ExternalLink className="w-5 h-5 text-black" />
                                    </a>
                                )}
                                <button
                                    onClick={() => deleteTrend(trend.title)}
                                    disabled={deleting === trend.title}
                                    className="p-3 bg-white border-2 border-black hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    {deleting === trend.title ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Tip */}
            {trends.length > 0 && (
                <div className="mt-12 p-6 bg-white border-2 border-black shadow-[8px_8px_0px_0px_#B1F202]">
                    <div className="flex items-start gap-4">
                        <Sparkles className="w-8 h-8 text-black fill-[#FF90E8]" />
                        <div>
                            <p className="font-black text-xl uppercase mb-1">
                                Creator Tip
                            </p>
                            <p className="font-medium text-black">
                                Batch your content creation! Use these saved trends to write 5 scripts at once on Sunday, then film all week.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
