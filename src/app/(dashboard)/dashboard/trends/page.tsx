'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp,
    Play,
    Eye,
    Heart,
    MessageCircle,
    Clock,
    ExternalLink,
    Sparkles,
    Search,
    RefreshCw,
    Lightbulb,
    Hash,
    Target,
    Zap,
    Youtube,
    X,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    Copy,
    ThumbsUp,
    BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface YouTubeVideo {
    id: string
    title: string
    description: string
    thumbnail: string
    channelTitle: string
    publishedAt: string
    viewCount: number
    likeCount: number
    commentCount: number
    engagementRate: string
    formattedViews: string
    formattedLikes: string
    formattedComments: string
    formattedDuration: string
    categoryName: string
    tags: string[]
    url: string
}

interface AIAnalysis {
    whyTrending: string
    commonPatterns: string[]
    recommendedTopics: string[]
    contentIdeas: { title: string; hook: string; format: string }[]
    bestHashtags: string[]
    optimalLength: string
    postingAdvice: string
}

interface VideoAnalysis {
    viralScore: number
    whyViral: string
    keyFactors: { factor: string; analysis: string; impact: string }[]
    thumbnailInsights: string
    titleAnalysis: string
    contentStrategy: string
    audienceAppeal: string
    recreateStrategy: {
        yourTitle: string
        yourHook: string
        yourFormat: string
        yourAngle: string
        keyElements: string[]
    }
    doThis: string[]
    avoidThis: string[]
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function TrendsPage() {
    const [videos, setVideos] = useState<YouTubeVideo[]>([])
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [analyzing, setAnalyzing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastFetched, setLastFetched] = useState<string>('')

    // Video analysis modal state
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
    const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null)
    const [analyzingVideo, setAnalyzingVideo] = useState(false)

    useEffect(() => {
        fetchTrending()
    }, [])

    const fetchTrending = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/youtube/trending?region=IN&limit=20')
            const data = await response.json()

            if (data.success) {
                setVideos(data.data.videos)
                setLastFetched(new Date(data.data.fetchedAt).toLocaleTimeString())
                setSearchQuery('')
                setAiAnalysis(null)
            } else {
                setError(data.error)
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch trends')
        } finally {
            setLoading(false)
        }
    }

    const searchAndAnalyze = async () => {
        if (!searchInput.trim()) return

        setAnalyzing(true)
        setError(null)
        try {
            const response = await fetch('/api/youtube/trending', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: searchInput,
                    analyzeWithAI: true,
                }),
            })
            const data = await response.json()

            if (data.success) {
                setVideos(data.data.videos)
                setAiAnalysis(data.data.aiAnalysis)
                setSearchQuery(searchInput)
                setLastFetched(new Date(data.data.fetchedAt).toLocaleTimeString())
            } else {
                setError(data.error)
            }
        } catch (err: any) {
            setError(err.message || 'Failed to search')
        } finally {
            setAnalyzing(false)
        }
    }

    const analyzeVideo = async (video: YouTubeVideo) => {
        setSelectedVideo(video)
        setVideoAnalysis(null)
        setAnalyzingVideo(true)

        try {
            const response = await fetch('/api/youtube/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ video }),
            })
            const data = await response.json()

            if (data.success) {
                setVideoAnalysis(data.data.analysis)
            }
        } catch (err: any) {
            console.error('Analysis error:', err)
        } finally {
            setAnalyzingVideo(false)
        }
    }

    const closeModal = () => {
        setSelectedVideo(null)
        setVideoAnalysis(null)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            searchAndAnalyze()
        }
    }

    return (
        <motion.div initial="hidden" animate="show" variants={container} className="space-y-6 pb-8">
            {/* Header */}
            <motion.div variants={item} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Youtube className="w-6 h-6 text-red-500" />
                        <h1 className="text-2xl font-semibold text-[#14110F] dark:text-[#F3F3F4]">
                            Real-Time Trends
                        </h1>
                        <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                            LIVE
                        </span>
                    </div>
                    <p className="text-[#7E7F83]">
                        {searchQuery ? `Results for "${searchQuery}"` : 'Trending on YouTube India right now'}
                        {lastFetched && <span className="ml-2 text-xs">• Updated {lastFetched}</span>}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchTrending}
                        disabled={loading}
                        className="p-2.5 rounded-lg border border-[#E8E8E9] dark:border-[#34312D] hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                    >
                        <RefreshCw className={cn("w-5 h-5 text-[#7E7F83]", loading && "animate-spin")} />
                    </button>
                </div>
            </motion.div>

            {/* Search */}
            <motion.div variants={item} className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7E7F83]" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search trends (e.g., 'tech reviews', 'cooking recipes', 'fitness')"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D] text-[#14110F] dark:text-[#F3F3F4] placeholder:text-[#7E7F83] focus:outline-none focus:border-[#D9C5B2]"
                    />
                </div>
                <button
                    onClick={searchAndAnalyze}
                    disabled={analyzing || !searchInput.trim()}
                    className="px-6 py-3 rounded-xl bg-[#D9C5B2] text-[#14110F] font-medium hover:bg-[#C4B09D] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    <Sparkles className={cn("w-5 h-5", analyzing && "animate-pulse")} />
                    {analyzing ? 'Analyzing...' : 'Search & Analyze'}
                </button>
            </motion.div>

            {/* Error */}
            {error && (
                <motion.div variants={item} className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
                    {error}
                </motion.div>
            )}

            {/* AI Analysis Panel */}
            <AnimatePresence>
                {aiAnalysis && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 rounded-xl bg-gradient-to-br from-[#D9C5B2]/20 to-[#D9C5B2]/5 dark:from-[#D9C5B2]/10 dark:to-transparent border border-[#D9C5B2]/30">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 rounded-lg bg-[#D9C5B2]">
                                    <Sparkles className="w-5 h-5 text-[#14110F]" />
                                </div>
                                <h2 className="font-semibold text-lg text-[#14110F] dark:text-[#F3F3F4]">AI Marketing Analysis</h2>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        <h3 className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4]">Why Trending</h3>
                                    </div>
                                    <p className="text-sm text-[#7E7F83]">{aiAnalysis.whyTrending}</p>
                                </div>

                                <div className="p-4 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Hash className="w-4 h-4 text-blue-500" />
                                        <h3 className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4]">Best Hashtags</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {aiAnalysis.bestHashtags.map((tag, i) => (
                                            <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-amber-500" />
                                        <h3 className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4]">Optimal Length</h3>
                                    </div>
                                    <p className="text-sm text-[#7E7F83]">{aiAnalysis.optimalLength}</p>
                                </div>

                                <div className="md:col-span-2 lg:col-span-3 p-4 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Lightbulb className="w-4 h-4 text-amber-500" />
                                        <h3 className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4]">Content Ideas For You</h3>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-3">
                                        {aiAnalysis.contentIdeas.map((idea, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D]">
                                                <p className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4] mb-1">{idea.title}</p>
                                                <p className="text-xs text-[#7E7F83] mb-2">Hook: "{idea.hook}"</p>
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-[#D9C5B2] text-[#14110F]">{idea.format}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading State */}
            {loading && (
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
            )}

            {/* Videos Grid */}
            {!loading && videos.length > 0 && (
                <motion.div variants={item} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D] overflow-hidden hover:border-[#D9C5B2] transition-all hover:shadow-lg"
                        >
                            {/* Thumbnail */}
                            <a href={video.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-video">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
                                    {video.formattedDuration}
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                {index < 3 && (
                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        #{index + 1} Trending
                                    </div>
                                )}
                            </a>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4] line-clamp-2 mb-2">
                                    {video.title}
                                </h3>
                                <p className="text-xs text-[#7E7F83] mb-3">{video.channelTitle}</p>

                                {/* Stats */}
                                <div className="flex items-center gap-3 text-xs text-[#7E7F83]">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" />
                                        {video.formattedViews}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-3.5 h-3.5" />
                                        {video.formattedLikes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        {video.formattedComments}
                                    </span>
                                </div>

                                {/* Engagement Rate & Analyze Button */}
                                <div className="mt-3 pt-3 border-t border-[#E8E8E9] dark:border-[#34312D] flex items-center justify-between">
                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        {video.engagementRate} engagement
                                    </span>
                                    <button
                                        onClick={() => analyzeVideo(video)}
                                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#D9C5B2] text-[#14110F] hover:bg-[#C4B09D] transition-colors flex items-center gap-1"
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        Why Viral?
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Empty State */}
            {!loading && videos.length === 0 && !error && (
                <motion.div variants={item} className="text-center py-12">
                    <Youtube className="w-12 h-12 mx-auto text-[#7E7F83] mb-4" />
                    <h3 className="font-medium text-[#14110F] dark:text-[#F3F3F4] mb-2">No videos found</h3>
                    <p className="text-sm text-[#7E7F83]">Try a different search query or refresh trending</p>
                </motion.div>
            )}

            {/* Video Analysis Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1A1714] rounded-2xl shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 z-10 flex items-start gap-4 p-6 border-b border-[#E8E8E9] dark:border-[#34312D] bg-white dark:bg-[#1A1714]">
                                <img src={selectedVideo.thumbnail} alt="" className="w-32 h-20 object-cover rounded-lg" />
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] line-clamp-2 mb-1">
                                        {selectedVideo.title}
                                    </h2>
                                    <p className="text-sm text-[#7E7F83]">{selectedVideo.channelTitle}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-[#7E7F83]">
                                        <span>{selectedVideo.formattedViews} views</span>
                                        <span>{selectedVideo.engagementRate} engagement</span>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D]">
                                    <X className="w-5 h-5 text-[#7E7F83]" />
                                </button>
                            </div>

                            {/* Analysis Content */}
                            <div className="p-6 space-y-6">
                                {analyzingVideo ? (
                                    <div className="text-center py-12">
                                        <Sparkles className="w-10 h-10 mx-auto text-[#D9C5B2] animate-pulse mb-4" />
                                        <p className="text-[#7E7F83]">AI is analyzing why this video went viral...</p>
                                    </div>
                                ) : videoAnalysis ? (
                                    <>
                                        {/* Viral Score */}
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                                            <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                                                {videoAnalysis.viralScore}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">Viral Score</h3>
                                                <p className="text-sm text-[#7E7F83]">{videoAnalysis.whyViral}</p>
                                            </div>
                                        </div>

                                        {/* Key Factors */}
                                        <div>
                                            <h3 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-3 flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5 text-[#D9C5B2]" />
                                                Key Viral Factors
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                {videoAnalysis.keyFactors.map((factor, i) => (
                                                    <div key={i} className="p-4 rounded-xl bg-[#F3F3F4] dark:bg-[#34312D]">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4]">{factor.factor}</span>
                                                            <span className={cn(
                                                                "px-2 py-0.5 text-xs rounded-full font-medium",
                                                                factor.impact === 'HIGH' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                                                                factor.impact === 'MEDIUM' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                                                factor.impact === 'LOW' && "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                                                            )}>
                                                                {factor.impact}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-[#7E7F83]">{factor.analysis}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Deep Insights */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl border border-[#E8E8E9] dark:border-[#34312D]">
                                                <h4 className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4] mb-2">🎬 Thumbnail Strategy</h4>
                                                <p className="text-sm text-[#7E7F83]">{videoAnalysis.thumbnailInsights}</p>
                                            </div>
                                            <div className="p-4 rounded-xl border border-[#E8E8E9] dark:border-[#34312D]">
                                                <h4 className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4] mb-2">📝 Title Analysis</h4>
                                                <p className="text-sm text-[#7E7F83]">{videoAnalysis.titleAnalysis}</p>
                                            </div>
                                            <div className="p-4 rounded-xl border border-[#E8E8E9] dark:border-[#34312D]">
                                                <h4 className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4] mb-2">🎯 Content Strategy</h4>
                                                <p className="text-sm text-[#7E7F83]">{videoAnalysis.contentStrategy}</p>
                                            </div>
                                            <div className="p-4 rounded-xl border border-[#E8E8E9] dark:border-[#34312D]">
                                                <h4 className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4] mb-2">👥 Audience Appeal</h4>
                                                <p className="text-sm text-[#7E7F83]">{videoAnalysis.audienceAppeal}</p>
                                            </div>
                                        </div>

                                        {/* Recreate Strategy */}
                                        <div className="p-5 rounded-xl bg-gradient-to-br from-[#D9C5B2]/20 to-transparent border border-[#D9C5B2]/30">
                                            <h3 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-4 flex items-center gap-2">
                                                <Lightbulb className="w-5 h-5 text-[#D9C5B2]" />
                                                How YOU Can Recreate This
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-xs font-medium text-[#7E7F83] w-20">Your Title:</span>
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <p className="text-sm text-[#14110F] dark:text-[#F3F3F4]">{videoAnalysis.recreateStrategy.yourTitle}</p>
                                                        <button onClick={() => copyToClipboard(videoAnalysis.recreateStrategy.yourTitle)} className="p-1 rounded hover:bg-[#D9C5B2]/20">
                                                            <Copy className="w-3.5 h-3.5 text-[#7E7F83]" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="text-xs font-medium text-[#7E7F83] w-20">Your Hook:</span>
                                                    <p className="text-sm text-[#14110F] dark:text-[#F3F3F4]">"{videoAnalysis.recreateStrategy.yourHook}"</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="text-xs font-medium text-[#7E7F83] w-20">Format:</span>
                                                    <p className="text-sm text-[#14110F] dark:text-[#F3F3F4]">{videoAnalysis.recreateStrategy.yourFormat}</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="text-xs font-medium text-[#7E7F83] w-20">Your Angle:</span>
                                                    <p className="text-sm text-[#14110F] dark:text-[#F3F3F4]">{videoAnalysis.recreateStrategy.yourAngle}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Do This / Avoid This */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                                                <h4 className="font-medium text-sm text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Do This
                                                </h4>
                                                <ul className="space-y-2">
                                                    {videoAnalysis.doThis.map((tip, i) => (
                                                        <li key={i} className="text-sm text-emerald-700 dark:text-emerald-400 flex items-start gap-2">
                                                            <ArrowRight className="w-3 h-3 mt-1 shrink-0" />
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                                <h4 className="font-medium text-sm text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Avoid This
                                                </h4>
                                                <ul className="space-y-2">
                                                    {videoAnalysis.avoidThis.map((tip, i) => (
                                                        <li key={i} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                                                            <X className="w-3 h-3 mt-1 shrink-0" />
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-[#E8E8E9] dark:border-[#34312D]">
                                            <a
                                                href={selectedVideo.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium text-center hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Youtube className="w-5 h-5" />
                                                Watch on YouTube
                                            </a>
                                            <button
                                                onClick={closeModal}
                                                className="flex-1 py-3 rounded-xl border border-[#E8E8E9] dark:border-[#34312D] text-[#14110F] dark:text-[#F3F3F4] font-medium hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
