'use client'

import { useState, useEffect } from 'react'
import {
    Clock,
    TrendingUp,
    Zap,
    AlertCircle,
    CheckCircle,
    Calendar,
    ChevronRight,
    RefreshCw,
    Loader2,
    Info,
    Sparkles,
    Target
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Types
interface TimeSlot {
    hour: number
    engagement: number
    label: string
}

interface DayData {
    day: string
    slots: TimeSlot[]
    bestTime: string
    peakEngagement: number
}

interface PlatformSummary {
    id: string
    name: string
    icon: string
    color: string
    bestOverall: { time: string; day: string; score: number }
}

interface BestTimeData {
    platform: string
    icon: string
    color: string
    weeklyData: DayData[]
    topTimes: { time: string; day: string; score: number }[]
    algorithmTips: string[]
    avoidTimes: string[]
    audienceInsight: string
    allPlatforms: PlatformSummary[]
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function BestTimePage() {
    const [selectedPlatform, setSelectedPlatform] = useState('instagram')
    const [data, setData] = useState<BestTimeData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showTips, setShowTips] = useState(false)

    useEffect(() => {
        fetchData()
    }, [selectedPlatform])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/ai/best-time?platform=${selectedPlatform}`)
            const result = await response.json()
            setData(result)
        } catch (error) {
            console.error('Failed to fetch best time data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getEngagementColor = (score: number) => {
        if (score >= 80) return 'bg-green-500'
        if (score >= 60) return 'bg-green-400'
        if (score >= 45) return 'bg-yellow-400'
        if (score >= 30) return 'bg-orange-400'
        return 'bg-gray-300 dark:bg-gray-700'
    }

    const getEngagementOpacity = (score: number) => {
        return Math.max(0.2, score / 100)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Clock className="h-8 w-8 text-blue-500" />
                        Best Time to Post
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Algorithm-optimized posting times for maximum reach
                    </p>
                </div>
                <button
                    onClick={() => setShowTips(!showTips)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-sm font-medium hover:from-purple-500/20 hover:to-pink-500/20 transition-all"
                >
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Algorithm Tips
                </button>
            </div>

            {/* Platform Selector */}
            {data?.allPlatforms && (
                <div className="flex flex-wrap gap-2">
                    {data.allPlatforms.map((platform) => (
                        <button
                            key={platform.id}
                            onClick={() => setSelectedPlatform(platform.id)}
                            className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                                selectedPlatform === platform.id
                                    ? "border-primary bg-primary/10 text-foreground"
                                    : "border-input hover:bg-accent"
                            )}
                        >
                            <span className="text-lg">{platform.icon}</span>
                            <span>{platform.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : data ? (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content - Heatmap */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Top Times */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Target className="h-5 w-5 text-green-500" />
                                Best Times to Post on {data.platform}
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {data.topTimes.map((time, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={cn(
                                            "relative rounded-lg p-4 text-center overflow-hidden",
                                            i === 0 ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white" : "bg-muted"
                                        )}
                                    >
                                        {i === 0 && (
                                            <div className="absolute top-2 right-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                                #1 Best
                                            </div>
                                        )}
                                        <p className="text-2xl font-bold">{time.time}</p>
                                        <p className={cn("text-sm", i === 0 ? "text-white/80" : "text-muted-foreground")}>{time.day}</p>
                                        <div className="mt-2 flex items-center justify-center gap-1">
                                            <TrendingUp className={cn("h-3 w-3", i === 0 ? "text-white/80" : "text-green-500")} />
                                            <span className={cn("text-xs font-medium", i === 0 ? "text-white/80" : "text-green-500")}>
                                                {time.score}% engagement
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Heatmap */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Weekly Engagement Heatmap
                            </h3>

                            {/* Time labels */}
                            <div className="flex mb-2 pl-20">
                                {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
                                    <div key={hour} className="flex-1 text-xs text-muted-foreground text-center">
                                        {hour === 0 ? '12a' : hour === 12 ? '12p' : hour < 12 ? `${hour}a` : `${hour - 12}p`}
                                    </div>
                                ))}
                            </div>

                            {/* Heatmap Grid */}
                            <div className="space-y-1">
                                {data.weeklyData.map((day, dayIndex) => (
                                    <div key={day.day} className="flex items-center gap-2">
                                        <span className="w-16 text-xs text-muted-foreground text-right">{day.day.slice(0, 3)}</span>
                                        <div className="flex-1 flex gap-0.5">
                                            {day.slots.map((slot, hourIndex) => (
                                                <div
                                                    key={hourIndex}
                                                    className={cn(
                                                        "flex-1 h-6 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:ring-offset-1",
                                                        getEngagementColor(slot.engagement)
                                                    )}
                                                    style={{ opacity: getEngagementOpacity(slot.engagement) }}
                                                    title={`${day.day} ${slot.label}: ${slot.engagement}% engagement`}
                                                />
                                            ))}
                                        </div>
                                        <span className="w-12 text-xs text-muted-foreground">{day.bestTime}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
                                <span className="text-xs text-muted-foreground">Low</span>
                                <div className="flex gap-1">
                                    <div className="w-4 h-4 rounded-sm bg-gray-300 dark:bg-gray-700" />
                                    <div className="w-4 h-4 rounded-sm bg-orange-400" />
                                    <div className="w-4 h-4 rounded-sm bg-yellow-400" />
                                    <div className="w-4 h-4 rounded-sm bg-green-400" />
                                    <div className="w-4 h-4 rounded-sm bg-green-500" />
                                </div>
                                <span className="text-xs text-muted-foreground">High</span>
                            </div>
                        </div>

                        {/* Audience Insight */}
                        <div className="rounded-xl border bg-gradient-to-r from-blue-500/5 to-purple-500/5 p-6">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-1">Audience Insight</h3>
                                    <p className="text-sm text-muted-foreground">{data.audienceInsight}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Algorithm Tips */}
                        <AnimatePresence>
                            {showTips && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="rounded-xl border bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 p-6 shadow-sm overflow-hidden"
                                >
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-yellow-500" />
                                        {data.platform} Algorithm Tips
                                    </h3>
                                    <div className="space-y-3">
                                        {data.algorithmTips.map((tip, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-start gap-2 text-sm"
                                            >
                                                <span>{tip}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Avoid Times */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold mb-4 flex items-center gap-2 text-red-500">
                                <AlertCircle className="h-5 w-5" />
                                Times to Avoid
                            </h3>
                            <div className="space-y-2">
                                {data.avoidTimes.map((time, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="w-2 h-2 rounded-full bg-red-400" />
                                        {time}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Daily Best Times */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Best Time by Day
                            </h3>
                            <div className="space-y-2">
                                {data.weeklyData.map((day) => (
                                    <div key={day.day} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <span className="text-sm font-medium">{day.day}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{day.bestTime}</span>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                day.peakEngagement >= 85 ? "bg-green-500" :
                                                    day.peakEngagement >= 70 ? "bg-yellow-500" : "bg-orange-500"
                                            )} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors text-left">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Schedule at Best Time</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors text-left">
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Auto-Optimize Queue</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
