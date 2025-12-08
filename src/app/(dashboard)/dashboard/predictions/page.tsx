'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Sparkles, Loader2, TrendingUp, Clock, ArrowLeft,
    Zap, Target, Eye, RefreshCw, Lightbulb, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Prediction {
    topic: string
    confidence: 'HIGH' | 'MEDIUM' | 'LOW'
    reasoning: string
    timeframe: string
    relatedTo: string
    contentTip: string
}

interface PredictionData {
    predictions: Prediction[]
    emergingThemes: string[]
    watchList: string[]
    analysis: string
    generatedAt: string
    basedOn: string
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function PredictionsPage() {
    const [data, setData] = useState<PredictionData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const generatePredictions = async () => {
        setLoading(true)
        setError(null)

        try {
            // First get current trends
            const trendsResponse = await fetch('/api/trends/personalized')
            const trendsData = await trendsResponse.json()

            if (!trendsData.success || !trendsData.trends) {
                throw new Error('Failed to fetch current trends')
            }

            const trendTitles = trendsData.trends.map((t: any) => t.title)

            // Generate predictions
            const predResponse = await fetch('/api/trends/predictions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentTrends: trendTitles,
                    industry: trendsData.personalization?.industry,
                    region: trendsData.personalization?.location,
                }),
            })

            const predData = await predResponse.json()

            if (predData.success) {
                setData(predData.data)
            } else {
                throw new Error(predData.error || 'Failed to generate predictions')
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const getConfidenceColor = (confidence: string) => {
        switch (confidence) {
            case 'HIGH': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            case 'MEDIUM': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            case 'LOW': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
            default: return 'bg-gray-100 text-gray-700'
        }
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
                        <Sparkles className="w-6 h-6 text-purple-500" />
                        AI Trend Predictions
                    </h1>
                    <p className="text-[#7E7F83] text-sm">
                        Predict what will trend in the next 24-48 hours
                    </p>
                </div>
                <button
                    onClick={generatePredictions}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Predicting...</>
                    ) : data ? (
                        <><RefreshCw className="w-4 h-4" /> Refresh</>
                    ) : (
                        <><Sparkles className="w-4 h-4" /> Generate Predictions</>
                    )}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-16">
                    <Loader2 className="w-12 h-12 mx-auto text-purple-500 animate-spin mb-4" />
                    <p className="text-[#14110F] dark:text-[#F3F3F4] font-medium mb-2">
                        AI is analyzing trends...
                    </p>
                    <p className="text-sm text-[#7E7F83]">
                        This may take a few seconds
                    </p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !data && !error && (
                <div className="text-center py-16 px-8 bg-white dark:bg-[#1A1714] rounded-xl border border-[#E8E8E9] dark:border-[#34312D]">
                    <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-purple-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-2">
                        See the Future of Trends
                    </h2>
                    <p className="text-[#7E7F83] max-w-md mx-auto mb-6">
                        Our AI analyzes current trending topics and predicts what will trend next. Get ahead of the curve with content ideas.
                    </p>
                    <button
                        onClick={generatePredictions}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
                    >
                        <Sparkles className="w-5 h-5" />
                        Generate Predictions
                    </button>
                </div>
            )}

            {/* Results */}
            {!loading && data && (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    {/* Analysis */}
                    <motion.div variants={item} className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-start gap-3">
                            <Eye className="w-5 h-5 text-purple-500 mt-1" />
                            <div>
                                <p className="font-medium text-[#14110F] dark:text-[#F3F3F4] mb-2">Analysis Overview</p>
                                <p className="text-sm text-[#7E7F83]">{data.analysis}</p>
                                <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                                    Based on {data.basedOn} • Generated {new Date(data.generatedAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Themes & Watch List */}
                    <motion.div variants={item} className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]">
                            <p className="text-xs font-medium text-[#7E7F83] mb-2">EMERGING THEMES</p>
                            <div className="flex flex-wrap gap-2">
                                {data.emergingThemes.map((theme, i) => (
                                    <span key={i} className="px-3 py-1 text-sm rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                                        {theme}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]">
                            <p className="text-xs font-medium text-[#7E7F83] mb-2">WATCH LIST</p>
                            <div className="flex flex-wrap gap-2">
                                {data.watchList.map((topic, i) => (
                                    <span key={i} className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Predictions */}
                    <motion.div variants={item}>
                        <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-purple-500" />
                            Predicted Trends ({data.predictions.length})
                        </h2>
                        <div className="grid gap-4">
                            {data.predictions.map((pred, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-5 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">
                                                {pred.topic}
                                            </h3>
                                            <p className="text-xs text-[#7E7F83] flex items-center gap-2 mt-1">
                                                <Clock className="w-3 h-3" />
                                                {pred.timeframe}
                                                <span>•</span>
                                                Related to: {pred.relatedTo}
                                            </p>
                                        </div>
                                        <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getConfidenceColor(pred.confidence))}>
                                            {pred.confidence}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#7E7F83] mb-3">{pred.reasoning}</p>
                                    <div className="p-3 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D]">
                                        <p className="text-xs text-[#7E7F83] mb-1 flex items-center gap-1">
                                            <Lightbulb className="w-3 h-3" /> Content Tip
                                        </p>
                                        <p className="text-sm text-[#14110F] dark:text-[#F3F3F4]">{pred.contentTip}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}
