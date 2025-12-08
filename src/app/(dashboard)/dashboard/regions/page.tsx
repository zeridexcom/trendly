'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Globe, RefreshCw, TrendingUp, Loader2, MapPin, Bookmark,
    Zap, ArrowUpRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrendingTopic {
    title: string
    formattedTraffic?: string
    traffic?: string
    industry?: string
}

interface RegionTrends {
    region: string
    label: string
    flag: string
    trends: TrendingTopic[]
    loading: boolean
}

const REGIONS = [
    { id: 'IN', label: 'India', flag: '🇮🇳' },
    { id: 'US', label: 'United States', flag: '🇺🇸' },
    { id: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
]

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function MultiRegionPage() {
    const [regions, setRegions] = useState<RegionTrends[]>(
        REGIONS.map(r => ({ ...r, region: r.id, trends: [], loading: true }))
    )
    const [savingTrend, setSavingTrend] = useState<string | null>(null)

    useEffect(() => {
        REGIONS.forEach((region, index) => {
            fetchTrendsForRegion(region.id, index)
        })
    }, [])

    const fetchTrendsForRegion = async (regionId: string, index: number) => {
        setRegions(prev => prev.map((r, i) =>
            i === index ? { ...r, loading: true } : r
        ))

        try {
            const response = await fetch(`/api/trends/google?geo=${regionId}`)
            const data = await response.json()

            if (data.success && data.data?.trends) {
                setRegions(prev => prev.map((r, i) =>
                    i === index ? { ...r, trends: data.data.trends.slice(0, 10), loading: false } : r
                ))
            }
        } catch (error) {
            console.error(`Failed to fetch trends for ${regionId}:`, error)
            setRegions(prev => prev.map((r, i) =>
                i === index ? { ...r, loading: false } : r
            ))
        }
    }

    const refreshAll = () => {
        REGIONS.forEach((region, index) => {
            fetchTrendsForRegion(region.id, index)
        })
    }

    const saveTrend = async (trend: TrendingTopic, region: string) => {
        setSavingTrend(trend.title)
        try {
            await fetch('/api/trends/saved', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trend: { ...trend, region } }),
            })
        } catch (error) {
            console.error('Failed to save trend:', error)
        } finally {
            setSavingTrend(null)
        }
    }

    // Find trends that appear in multiple regions
    const findGlobalTrends = () => {
        const trendCounts: Record<string, { count: number, regions: string[] }> = {}

        regions.forEach(region => {
            region.trends.forEach(trend => {
                const key = trend.title.toLowerCase()
                if (!trendCounts[key]) {
                    trendCounts[key] = { count: 0, regions: [] }
                }
                trendCounts[key].count++
                trendCounts[key].regions.push(region.label)
            })
        })

        return Object.entries(trendCounts)
            .filter(([_, data]) => data.count > 1)
            .map(([title, data]) => ({ title, ...data }))
    }

    const globalTrends = findGlobalTrends()

    return (
        <motion.div initial="hidden" animate="show" variants={container} className="space-y-6 pb-8">
            {/* Header */}
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-6 h-6 text-blue-500" />
                        <h1 className="text-2xl font-semibold text-[#14110F] dark:text-[#F3F3F4]">
                            Multi-Region Trends
                        </h1>
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                            LIVE
                        </span>
                    </div>
                    <p className="text-[#7E7F83]">
                        Compare trending topics across different countries
                    </p>
                </div>
                <button
                    onClick={refreshAll}
                    className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                >
                    <RefreshCw className="w-5 h-5 text-[#7E7F83]" />
                </button>
            </motion.div>

            {/* Global Trends */}
            {globalTrends.length > 0 && (
                <motion.div variants={item} className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-5 h-5 text-purple-500" />
                        <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">
                            Global Trends
                        </h2>
                        <span className="text-xs text-[#7E7F83]">Trending in multiple regions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {globalTrends.map((trend, i) => (
                            <div
                                key={i}
                                className="px-3 py-2 rounded-lg bg-white dark:bg-[#1A1714] border border-purple-200 dark:border-purple-800"
                            >
                                <p className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4]">
                                    {trend.title}
                                </p>
                                <p className="text-xs text-purple-600 dark:text-purple-400">
                                    {trend.regions.join(' • ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Region Columns */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {regions.map((region, regionIndex) => (
                    <div
                        key={region.region}
                        className="bg-white dark:bg-[#1A1714] rounded-xl border border-[#E8E8E9] dark:border-[#34312D] overflow-hidden"
                    >
                        {/* Region Header */}
                        <div className="p-4 border-b border-[#E8E8E9] dark:border-[#34312D] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{region.flag}</span>
                                <div>
                                    <h3 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">
                                        {region.label}
                                    </h3>
                                    <p className="text-xs text-[#7E7F83]">
                                        {region.trends.length} trending
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => fetchTrendsForRegion(region.region, regionIndex)}
                                disabled={region.loading}
                                className="p-1.5 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                            >
                                <RefreshCw className={cn("w-4 h-4 text-[#7E7F83]", region.loading && "animate-spin")} />
                            </button>
                        </div>

                        {/* Trends List */}
                        <div className="p-2">
                            {region.loading ? (
                                <div className="space-y-2 p-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-12 animate-pulse rounded-lg bg-[#F3F3F4] dark:bg-[#34312D]" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {region.trends.map((trend, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors group"
                                        >
                                            <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-[#7E7F83] bg-[#F3F3F4] dark:bg-[#34312D] rounded-full">
                                                {i + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4] truncate">
                                                    {trend.title}
                                                </p>
                                                {trend.formattedTraffic && (
                                                    <p className="text-xs text-[#7E7F83]">
                                                        {trend.formattedTraffic} searches
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => saveTrend(trend, region.label)}
                                                disabled={savingTrend === trend.title}
                                                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#E8E8E9] dark:hover:bg-[#14110F] transition-all"
                                            >
                                                {savingTrend === trend.title ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D9C5B2]" />
                                                ) : (
                                                    <Bookmark className="w-3.5 h-3.5 text-[#7E7F83]" />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Tip */}
            <motion.div variants={item} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                        <p className="font-medium text-sm text-blue-700 dark:text-blue-400">
                            Global Trend Tip
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-300">
                            Topics trending in multiple regions have higher viral potential. Look for patterns across countries to create content that resonates globally.
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
