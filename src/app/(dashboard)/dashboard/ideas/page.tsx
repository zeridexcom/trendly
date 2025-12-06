'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Lightbulb,
    Sparkles,
    TrendingUp,
    Search,
    RefreshCw,
    Clock,
    Eye,
    Target,
    Hash,
    Zap,
    Copy,
    Check,
    ArrowRight,
    Youtube,
    Instagram,
    Twitter,
    Loader2,
    ChevronRight,
    Star,
    Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrendingTopic {
    title: string
    traffic: string
    formattedTraffic: string
    imageUrl?: string
}

interface ContentAngle {
    angle: string
    platform: string
    format: string
    title: string
    hook: string
    outline: string[]
    cta: string
    estimatedViews: string
    difficulty: string
}

interface ContentIdeas {
    topicInsight: string
    audienceInterest: string
    contentAngles: ContentAngle[]
    hashtags: string[]
    bestTimeToPost: string
    trendLifespan: string
    competitorTip: string
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

const platformIcons: Record<string, any> = {
    'YouTube': Youtube,
    'Instagram': Instagram,
    'Twitter': Twitter,
}

export default function IdeasPage() {
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
    const [loadingTrends, setLoadingTrends] = useState(true)
    const [selectedTopic, setSelectedTopic] = useState<string>('')
    const [customTopic, setCustomTopic] = useState('')
    const [ideas, setIdeas] = useState<ContentIdeas | null>(null)
    const [generatingIdeas, setGeneratingIdeas] = useState(false)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchTrendingTopics()
    }, [])

    const fetchTrendingTopics = async () => {
        setLoadingTrends(true)
        try {
            const response = await fetch('/api/trends/google?geo=IN')
            const data = await response.json()

            if (data.success && data.data.trends) {
                setTrendingTopics(data.data.trends)
            }
        } catch (err) {
            console.error('Failed to fetch trends:', err)
        } finally {
            setLoadingTrends(false)
        }
    }

    const generateIdeas = async (topic: string) => {
        if (!topic.trim()) return

        setSelectedTopic(topic)
        setGeneratingIdeas(true)
        setIdeas(null)
        setError(null)

        try {
            const response = await fetch('/api/trends/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    platforms: ['YouTube', 'Instagram', 'Twitter'],
                }),
            })
            const data = await response.json()

            if (data.success) {
                setIdeas(data.data.ideas)
            } else {
                setError(data.error)
            }
        } catch (err: any) {
            setError(err.message || 'Failed to generate ideas')
        } finally {
            setGeneratingIdeas(false)
        }
    }

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (customTopic.trim()) {
            generateIdeas(customTopic)
        }
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <motion.div initial="hidden" animate="show" variants={container} className="space-y-6 pb-8">
            {/* Header */}
            <motion.div variants={item} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-6 h-6 text-amber-500" />
                        <h1 className="text-2xl font-semibold text-[#14110F] dark:text-[#F3F3F4]">
                            AI Content Ideas
                        </h1>
                        <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                            REAL-TIME
                        </span>
                    </div>
                    <p className="text-[#7E7F83]">
                        Generate viral content ideas from trending topics
                    </p>
                </div>
            </motion.div>

            {/* Custom Topic Input */}
            <motion.form variants={item} onSubmit={handleCustomSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7E7F83]" />
                    <input
                        type="text"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder="Enter any topic (e.g., 'AI tools', 'fitness tips', 'travel hacks')"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D] text-[#14110F] dark:text-[#F3F3F4] placeholder:text-[#7E7F83] focus:outline-none focus:border-[#D9C5B2]"
                    />
                </div>
                <button
                    type="submit"
                    disabled={generatingIdeas || !customTopic.trim()}
                    className="px-6 py-3 rounded-xl bg-[#D9C5B2] text-[#14110F] font-medium hover:bg-[#C4B09D] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    <Sparkles className={cn("w-5 h-5", generatingIdeas && "animate-pulse")} />
                    Generate Ideas
                </button>
            </motion.form>

            {/* Trending Topics */}
            <motion.div variants={item}>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        Trending Now in India
                    </h2>
                    <button
                        onClick={fetchTrendingTopics}
                        disabled={loadingTrends}
                        className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                    >
                        <RefreshCw className={cn("w-4 h-4 text-[#7E7F83]", loadingTrends && "animate-spin")} />
                    </button>
                </div>

                {loadingTrends ? (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="animate-pulse shrink-0 w-40 h-20 rounded-xl bg-[#F3F3F4] dark:bg-[#34312D]" />
                        ))}
                    </div>
                ) : (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {trendingTopics.map((topic, i) => (
                            <button
                                key={i}
                                onClick={() => generateIdeas(topic.title)}
                                disabled={generatingIdeas}
                                className={cn(
                                    "shrink-0 p-4 rounded-xl border transition-all text-left",
                                    selectedTopic === topic.title
                                        ? "border-[#D9C5B2] bg-[#D9C5B2]/10"
                                        : "border-[#E8E8E9] dark:border-[#34312D] hover:border-[#D9C5B2] bg-white dark:bg-[#1A1714]"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {i < 3 && <Zap className="w-3.5 h-3.5 text-amber-500" />}
                                    <span className="text-xs text-[#7E7F83]">{topic.formattedTraffic} searches</span>
                                </div>
                                <p className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4] line-clamp-2 max-w-[180px]">
                                    {topic.title}
                                </p>
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Error */}
            {error && (
                <motion.div variants={item} className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
                    {error}
                </motion.div>
            )}

            {/* Loading State */}
            {generatingIdeas && (
                <motion.div variants={item} className="text-center py-12">
                    <Loader2 className="w-10 h-10 mx-auto text-[#D9C5B2] animate-spin mb-4" />
                    <p className="text-[#7E7F83]">AI is generating viral content ideas for "{selectedTopic}"...</p>
                </motion.div>
            )}

            {/* Generated Ideas */}
            <AnimatePresence>
                {ideas && !generatingIdeas && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Topic Insight */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-[#D9C5B2]/20 to-[#D9C5B2]/5 border border-[#D9C5B2]/30">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 rounded-lg bg-[#D9C5B2]">
                                    <Target className="w-5 h-5 text-[#14110F]" />
                                </div>
                                <h3 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">Topic Insight: {selectedTopic}</h3>
                            </div>
                            <p className="text-sm text-[#7E7F83] mb-4">{ideas.topicInsight}</p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-3 rounded-lg bg-white dark:bg-[#1A1714]">
                                    <p className="text-xs text-[#7E7F83] mb-1">Audience Interest</p>
                                    <p className="text-sm text-[#14110F] dark:text-[#F3F3F4]">{ideas.audienceInterest}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-white dark:bg-[#1A1714]">
                                    <p className="text-xs text-[#7E7F83] mb-1">Best Time to Post</p>
                                    <p className="text-sm text-[#14110F] dark:text-[#F3F3F4]">{ideas.bestTimeToPost}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-white dark:bg-[#1A1714]">
                                    <p className="text-xs text-[#7E7F83] mb-1">Trend Lifespan</p>
                                    <p className="text-sm text-[#14110F] dark:text-[#F3F3F4]">{ideas.trendLifespan}</p>
                                </div>
                            </div>
                        </div>

                        {/* Hashtags */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Hash className="w-4 h-4 text-blue-500" />
                            {ideas.hashtags.map((tag, i) => (
                                <button
                                    key={i}
                                    onClick={() => copyToClipboard(`#${tag}`, i)}
                                    className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>

                        {/* Content Ideas */}
                        <div>
                            <h3 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-4 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-amber-500" />
                                Content Ideas ({ideas.contentAngles.length})
                            </h3>

                            <div className="grid lg:grid-cols-2 gap-4">
                                {ideas.contentAngles.map((angle, i) => {
                                    const PlatformIcon = platformIcons[angle.platform] || Target
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-5 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D] hover:border-[#D9C5B2] transition-all"
                                        >
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D]">
                                                        <PlatformIcon className="w-4 h-4 text-[#7E7F83]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-[#7E7F83]">{angle.platform} • {angle.format}</p>
                                                        <span className={cn("text-xs px-2 py-0.5 rounded-full", getDifficultyColor(angle.difficulty))}>
                                                            {angle.difficulty}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {angle.estimatedViews}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <h4 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-2">{angle.title}</h4>
                                            <p className="text-sm text-[#7E7F83] mb-3">{angle.angle}</p>

                                            {/* Hook */}
                                            <div className="p-3 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D] mb-3">
                                                <p className="text-xs text-[#7E7F83] mb-1">Opening Hook:</p>
                                                <p className="text-sm text-[#14110F] dark:text-[#F3F3F4] italic">"{angle.hook}"</p>
                                            </div>

                                            {/* Outline */}
                                            <div className="mb-3">
                                                <p className="text-xs text-[#7E7F83] mb-2">Content Outline:</p>
                                                <ul className="space-y-1">
                                                    {angle.outline.map((point, j) => (
                                                        <li key={j} className="text-sm text-[#14110F] dark:text-[#F3F3F4] flex items-start gap-2">
                                                            <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-[#D9C5B2] shrink-0" />
                                                            {point}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* CTA */}
                                            <div className="pt-3 border-t border-[#E8E8E9] dark:border-[#34312D] flex items-center justify-between">
                                                <p className="text-xs text-[#7E7F83]">CTA: {angle.cta}</p>
                                                <button
                                                    onClick={() => copyToClipboard(`${angle.title}\n\nHook: ${angle.hook}\n\nOutline:\n${angle.outline.map(p => `• ${p}`).join('\n')}\n\nCTA: ${angle.cta}`, 100 + i)}
                                                    className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                                                >
                                                    {copiedIndex === 100 + i ? (
                                                        <Check className="w-4 h-4 text-emerald-500" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-[#7E7F83]" />
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Pro Tip */}
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <div className="flex items-start gap-3">
                                <Star className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-amber-700 dark:text-amber-400 mb-1">Pro Tip: Stand Out</p>
                                    <p className="text-sm text-amber-600 dark:text-amber-300">{ideas.competitorTip}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {!generatingIdeas && !ideas && trendingTopics.length > 0 && (
                <motion.div variants={item} className="text-center py-12">
                    <Lightbulb className="w-12 h-12 mx-auto text-[#7E7F83] mb-4" />
                    <h3 className="font-medium text-[#14110F] dark:text-[#F3F3F4] mb-2">Ready to Generate Ideas</h3>
                    <p className="text-sm text-[#7E7F83]">Click on any trending topic above or enter your own topic</p>
                </motion.div>
            )}
        </motion.div>
    )
}
