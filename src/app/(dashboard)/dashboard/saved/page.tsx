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
                <Loader2 className="w-8 h-8 animate-spin text-[#D9C5B2]" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard"
                    className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-[#7E7F83]" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-[#14110F] dark:text-[#F3F3F4] flex items-center gap-2">
                        <Bookmark className="w-6 h-6 text-[#D9C5B2]" />
                        Saved Trends
                    </h1>
                    <p className="text-[#7E7F83] text-sm">
                        Your bookmarked trends for later reference
                    </p>
                </div>
                <span className="px-3 py-1 text-sm font-medium bg-[#D9C5B2]/20 text-[#34312D] dark:text-[#D9C5B2] rounded-full">
                    {trends.length} saved
                </span>
            </div>

            {/* Empty State */}
            {trends.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16 px-8 bg-white dark:bg-[#1A1714] rounded-xl border border-[#E8E8E9] dark:border-[#34312D]"
                >
                    <div className="w-16 h-16 rounded-2xl bg-[#D9C5B2]/20 flex items-center justify-center mx-auto mb-4">
                        <Bookmark className="w-8 h-8 text-[#D9C5B2]" />
                    </div>
                    <h2 className="text-lg font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-2">
                        No saved trends yet
                    </h2>
                    <p className="text-[#7E7F83] mb-6 max-w-md mx-auto">
                        When you find interesting trends on the dashboard, click the bookmark icon to save them here for later.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#34312D] text-[#D9C5B2] font-medium hover:opacity-90 transition-opacity"
                    >
                        <TrendingUp className="w-5 h-5" />
                        Explore Trends
                    </Link>
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                >
                    {trends.map((trend) => (
                        <motion.div
                            key={trend.title}
                            variants={item}
                            className="flex items-center gap-4 p-4 bg-white dark:bg-[#1A1714] rounded-xl border border-[#E8E8E9] dark:border-[#34312D] hover:border-[#D9C5B2] transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[#D9C5B2]/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-[#D9C5B2]" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-[#14110F] dark:text-[#F3F3F4] truncate">
                                    {trend.title}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-[#7E7F83]">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(trend.savedAt)}
                                    </span>
                                    {trend.industry && (
                                        <span className="px-2 py-0.5 bg-[#F3F3F4] dark:bg-[#34312D] rounded">
                                            {trend.industry}
                                        </span>
                                    )}
                                    {trend.formattedTraffic && (
                                        <span>{trend.formattedTraffic} searches</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {trend.newsUrl && (
                                    <a
                                        href={trend.newsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4 text-[#7E7F83]" />
                                    </a>
                                )}
                                <button
                                    onClick={() => deleteTrend(trend.title)}
                                    disabled={deleting === trend.title}
                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    {deleting === trend.title ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                    ) : (
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Tip */}
            {trends.length > 0 && (
                <div className="mt-8 p-4 bg-[#D9C5B2]/10 rounded-xl border border-[#D9C5B2]/20">
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-[#D9C5B2] mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-[#14110F] dark:text-[#F3F3F4]">
                                Pro Tip
                            </p>
                            <p className="text-sm text-[#7E7F83]">
                                Save trends that match your content style. This helps build your idea library for future content creation.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
