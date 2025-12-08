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
        <motion.div initial="hidden" animate="show" variants={container} className="space-y-8 pb-12 font-sans text-black">
            {/* Header */}
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-8 h-8 text-black fill-[#00F0FF]" />
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-black">
                            Multi-Region Trends
                        </h1>
                        <span className="px-3 py-1 text-sm font-black bg-[#FFC900] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                            LIVE
                        </span>
                    </div>
                    <p className="text-black font-bold border-l-4 border-black pl-3">
                        Compare trending topics across different markets
                    </p>
                </div>
                <button
                    onClick={refreshAll}
                    className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase font-bold flex items-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" /> REFRESH ALL
                </button>
            </motion.div>

            {/* Global Trends */}
            {globalTrends.length > 0 && (
                <motion.div variants={item} className="p-6 bg-[#B1F202] border-2 border-black shadow-[6px_6px_0px_0px_#000]">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-6 h-6 text-black fill-white" />
                        <h2 className="text-xl font-black uppercase">
                            Global Phenomena
                        </h2>
                        <span className="text-xs font-bold uppercase bg-black text-white px-2 py-1">Trending Everywhere</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {globalTrends.map((trend, i) => (
                            <div
                                key={i}
                                className="px-4 py-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex flex-col"
                            >
                                <p className="font-black text-lg uppercase">
                                    {trend.title}
                                </p>
                                <p className="text-xs font-bold text-gray-500 uppercase mt-1">
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
                        className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col"
                    >
                        {/* Region Header */}
                        <div className="p-5 border-b-2 border-black bg-[#F3F3F3] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl filter drop-shadow-md">{region.flag}</span>
                                <div>
                                    <h3 className="text-xl font-black uppercase text-black">
                                        {region.label}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-500 uppercase">
                                        {region.trends.length} TOPICS
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => fetchTrendsForRegion(region.region, regionIndex)}
                                disabled={region.loading}
                                className="p-2 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
                            >
                                <RefreshCw className={cn("w-4 h-4", region.loading && "animate-spin")} />
                            </button>
                        </div>

                        {/* Trends List */}
                        <div className="p-3 flex-1 bg-white">
                            {region.loading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-14 animate-pulse bg-gray-100 border-2 border-transparent" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {region.trends.map((trend, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 p-3 border-2 border-transparent hover:border-black hover:bg-[#FF90E8]/10 hover:shadow-[2px_2px_0px_0px_#000] transition-all group"
                                        >
                                            <span className="w-8 h-8 flex items-center justify-center text-sm font-black text-black bg-[#FFC900] border-2 border-black">
                                                {i + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-black uppercase truncate">
                                                    {trend.title}
                                                </p>
                                                {trend.formattedTraffic && (
                                                    <p className="text-xs font-bold text-gray-500">
                                                        {trend.formattedTraffic}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => saveTrend(trend, region.label)}
                                                disabled={savingTrend === trend.title}
                                                className="p-2 opacity-0 group-hover:opacity-100 bg-white border-2 border-black hover:bg-[#00F0FF] transition-all shadow-[2px_2px_0px_0px_#000]"
                                            >
                                                {savingTrend === trend.title ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Bookmark className="w-4 h-4" />
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
            <motion.div variants={item} className="p-6 bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000]">
                <div className="flex items-start gap-4">
                    <MapPin className="w-8 h-8 text-black" strokeWidth={2} />
                    <div>
                        <p className="font-black text-xl uppercase mb-1 text-black">
                            Viral Tip
                        </p>
                        <p className="font-medium text-black">
                            Topics trending in multiple regions have higher viral potential. Look for patterns across countries to create content that resonates globally.
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
