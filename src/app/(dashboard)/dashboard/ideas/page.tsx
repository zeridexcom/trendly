'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Lightbulb, Sparkles, TrendingUp, Search, RefreshCw, Clock,
    Eye, Target, Hash, Zap, Copy, Check, ArrowRight,
    Youtube, Instagram, Twitter, Loader2, ChevronRight, Star, Flame,
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

const platformColors: Record<string, string> = {
    'YouTube': 'bg-[#FF9090] text-black',
    'Instagram': 'bg-[#FF90E8] text-black',
    'Twitter': 'bg-[#00F0FF] text-black',
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

    const generateIdeas = async () => {
        const topic = customTopic || selectedTopic
        if (!topic) return

        setGeneratingIdeas(true)
        setIdeas(null)
        setError(null)

        try {
            const response = await fetch('/api/ai/ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
            })
            const data = await response.json()

            if (data.success) {
                setIdeas(data.ideas)
            } else {
                setError(data.error || 'Failed to generate ideas')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setGeneratingIdeas(false)
        }
    }

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    return (
        <div className="max-w-6xl mx-auto pb-12 font-sans text-black">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <Lightbulb className="w-8 h-8 text-black fill-[#FFC900]" />
                        Content Idea Generator
                    </h1>
                    <p className="text-black font-bold border-l-4 border-black pl-3 mt-2">
                        Turn trends into viral scripts instantly
                    </p>
                </div>
            </motion.div>

            {/* Input Section */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {/* Visual Topic Selection */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black uppercase flex items-center gap-2">
                            <Flame className="w-5 h-5 text-red-500 fill-red-500" />
                            Select a Trending Topic
                        </h2>
                        <button onClick={fetchTrendingTopics} className="text-sm font-bold text-gray-500 border-b-2 border-transparent hover:border-black flex items-center gap-1">
                            <RefreshCw className={cn("w-3 h-3", loadingTrends && "animate-spin")} /> Refresh
                        </button>
                    </div>

                    {loadingTrends ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="h-16 bg-gray-100 border-2 border-gray-200 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {trendingTopics.slice(0, 9).map((trend) => (
                                <button
                                    key={trend.title}
                                    onClick={() => {
                                        setSelectedTopic(trend.title)
                                        setCustomTopic('')
                                    }}
                                    className={cn(
                                        "p-3 text-left border-2 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]",
                                        selectedTopic === trend.title
                                            ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_#FF90E8]"
                                            : "bg-white border-black text-black hover:bg-[#FFF9E5]"
                                    )}
                                >
                                    <p className="font-bold text-sm uppercase truncate">{trend.title}</p>
                                    <p className={cn("text-xs font-bold", selectedTopic === trend.title ? "text-gray-400" : "text-gray-500")}>
                                        {trend.formattedTraffic} searches
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Custom Input & Action */}
                <div className="bg-[#B1F202] border-2 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col justify-center">
                    <h3 className="font-black uppercase mb-3 text-lg">Or type your own topic</h3>
                    <input
                        type="text"
                        value={customTopic}
                        onChange={(e) => {
                            setCustomTopic(e.target.value)
                            setSelectedTopic('')
                        }}
                        placeholder="e.g. AI Tools, Vegan Diet..."
                        className="w-full p-4 border-2 border-black text-lg font-bold mb-4 focus:outline-none focus:bg-white bg-[#F3F3F3]"
                    />
                    <button
                        onClick={generateIdeas}
                        disabled={generatingIdeas || (!selectedTopic && !customTopic)}
                        className="w-full py-4 bg-black text-white text-lg font-black uppercase hover:bg-[#FF90E8] hover:text-black hover:shadow-[4px_4px_0px_0px_#000] border-2 border-transparent hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {generatingIdeas ? (
                            <><Loader2 className="w-6 h-6 animate-spin" /> Cooking...</>
                        ) : (
                            <><Sparkles className="w-6 h-6" /> GENERATE IDEAS</>
                        )}
                    </button>
                    {error && (
                        <p className="mt-2 text-red-600 font-bold text-sm bg-white px-2 py-1 border border-black inline-block text-center">{error}</p>
                    )}
                </div>
            </div>

            {/* Ideas Result */}
            <AnimatePresence>
                {ideas && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-8"
                    >
                        {/* High Level Insights */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Target className="w-6 h-6 text-black" />
                                    <h3 className="font-black uppercase">Audience Insight</h3>
                                </div>
                                <p className="font-medium">{ideas.audienceInterest}</p>
                            </div>
                            <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="w-6 h-6 text-black" />
                                    <h3 className="font-black uppercase">Best Time</h3>
                                </div>
                                <p className="font-medium">{ideas.bestTimeToPost}</p>
                            </div>
                            <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Hash className="w-6 h-6 text-black" />
                                    <h3 className="font-black uppercase">Viral Tags</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {ideas.hashtags.slice(0, 5).map((tag, i) => (
                                        <span key={i} className="bg-black text-white px-2 py-1 text-xs font-bold uppercase">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content Cards */}
                        <div>
                            <h2 className="text-3xl font-black italic uppercase mb-6 flex items-center gap-3">
                                <Zap className="w-8 h-8 text-black fill-[#FFC900]" />
                                Ready-To-Film Scripts
                            </h2>
                            <div className="grid lg:grid-cols-2 gap-8">
                                {ideas.contentAngles.map((angle, index) => {
                                    const Icon = platformIcons[angle.platform] || Youtube
                                    const colorClass = platformColors[angle.platform] || 'bg-white text-black'

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_#FF90E8] transition-all"
                                        >
                                            {/* Card Header */}
                                            <div className="p-6 border-b-4 border-black bg-[#F3F3F3] flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("p-2 border-2 border-black shadow-[2px_2px_0px_0px_#000]", colorClass)}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs font-black uppercase text-gray-500">{angle.format}</span>
                                                        <h3 className="text-xl font-black uppercase leading-tight">{angle.title}</h3>
                                                    </div>
                                                </div>
                                                <div className="bg-black text-white px-3 py-1 font-black text-sm uppercase">
                                                    {angle.difficulty}
                                                </div>
                                            </div>

                                            {/* Script Content */}
                                            <div className="p-6 space-y-6">
                                                <div>
                                                    <span className="text-xs font-black uppercase bg-[#FFC900] px-2 py-1 border border-black mb-2 inline-block">The Hook</span>
                                                    <p className="font-bold text-lg border-l-4 border-black pl-4 italic">
                                                        "{angle.hook}"
                                                    </p>
                                                </div>

                                                <div>
                                                    <span className="text-xs font-black uppercase bg-[#B1F202] px-2 py-1 border border-black mb-2 inline-block">Structure</span>
                                                    <ul className="space-y-2">
                                                        {angle.outline.map((step, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-sm font-medium">
                                                                <span className="font-black text-gray-400">{i + 1}.</span>
                                                                {step}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t-2 border-black/10">
                                                    <div>
                                                        <p className="text-xs font-black text-gray-500 uppercase">Call to Action</p>
                                                        <p className="font-bold uppercase">{angle.cta}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => copyToClipboard(`${angle.title}\n\nHook: ${angle.hook}\n\nOutline:\n${angle.outline.map((s, i) => `${i + 1}. ${s}`).join('\n')}`, index)}
                                                        className="p-3 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
                                                    >
                                                        {copiedIndex === index ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tip */}
            <div className="mt-16 p-8 bg-[#00F0FF] border-2 border-black shadow-[8px_8px_0px_0px_#000]">
                <div className="flex items-start gap-4">
                    <Star className="w-10 h-10 text-black fill-white" />
                    <div>
                        <h3 className="text-2xl font-black uppercase mb-2">Pro Tip: Trend-Jacking</h3>
                        <p className="font-bold text-lg">
                            Don't just report the news. Use the "Audience Insight" to find a unique angle. If everyone is saying "AI is scary", make a video about "How AI saves you 10 hours a week". Contrarian takes go viral.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
