'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp, Play, Eye, Heart, MessageCircle, Clock, ExternalLink,
    Sparkles, Search, RefreshCw, Lightbulb, Hash, Target, Zap, Youtube,
    X, CheckCircle, AlertTriangle, ArrowRight, Copy, ThumbsUp, BarChart3,
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
        <div className="max-w-6xl mx-auto pb-12 font-sans text-black">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Youtube className="w-8 h-8 text-black fill-red-500" />
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                            Real-Time Trends
                        </h1>
                        <span className="px-3 py-1 bg-[#B1F202] border-2 border-black font-black uppercase text-sm shadow-[2px_2px_0px_0px_#000]">
                            LIVE
                        </span>
                    </div>
                    <p className="text-black font-bold border-l-4 border-black pl-3">
                        {searchQuery ? `Results for "${searchQuery}"` : 'Trending on YouTube India right now'}
                        {lastFetched && <span className="ml-2 text-sm text-gray-500 font-bold">• UPDATED {lastFetched}</span>}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchTrending}
                        disabled={loading}
                        className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                        <RefreshCw className={cn("w-6 h-6 text-black", loading && "animate-spin")} />
                    </button>
                </div>
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 mb-10">
                <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Search className="w-6 h-6 text-black" strokeWidth={3} />
                    </div>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search trends (e.g., 'tech reviews', 'cooking recipes')..."
                        className="w-full pl-14 pr-4 py-4 border-2 border-black shadow-[4px_4px_0px_0px_#000] text-lg font-bold placeholder:text-gray-400 focus:outline-none focus:bg-[#FFF9E5] transition-colors uppercase"
                    />
                </div>
                <button
                    onClick={searchAndAnalyze}
                    disabled={analyzing || !searchInput.trim()}
                    className="px-8 py-4 bg-[#FF90E8] border-2 border-black shadow-[4px_4px_0px_0px_#000] text-black font-black uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    <Sparkles className={cn("w-5 h-5 fill-black", analyzing && "animate-spin")} />
                    {analyzing ? 'Analyzing...' : 'Analyze'}
                </button>
            </motion.div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-100 border-2 border-black mb-8 font-bold text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> {error}
                </div>
            )}

            {/* AI Analysis Panel */}
            <AnimatePresence>
                {aiAnalysis && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-12"
                    >
                        <div className="p-8 bg-[#00F0FF] border-2 border-black shadow-[8px_8px_0px_0px_#000]">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-black text-white border-2 border-black">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black uppercase text-black">AI Marketing Analysis</h2>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Why Trending */}
                                <div className="p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black">
                                        <TrendingUp className="w-5 h-5 text-black" />
                                        <h3 className="font-black uppercase">Why Trending</h3>
                                    </div>
                                    <p className="font-medium text-black">{aiAnalysis.whyTrending}</p>
                                </div>

                                {/* Best Hashtags */}
                                <div className="p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black">
                                        <Hash className="w-5 h-5 text-black" />
                                        <h3 className="font-black uppercase">Best Hashtags</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {aiAnalysis.bestHashtags.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 bg-black text-white text-xs font-bold uppercase">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Optimal Length */}
                                <div className="p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black">
                                        <Clock className="w-5 h-5 text-black" />
                                        <h3 className="font-black uppercase">Optimal Length</h3>
                                    </div>
                                    <p className="font-medium text-black">{aiAnalysis.optimalLength}</p>
                                </div>

                                {/* Content Ideas */}
                                <div className="md:col-span-2 lg:col-span-3 p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-black">
                                        <Lightbulb className="w-5 h-5 text-black fill-[#FFC900]" />
                                        <h3 className="font-black uppercase">Content Ideas For You</h3>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {aiAnalysis.contentIdeas.map((idea, i) => (
                                            <div key={i} className="p-4 bg-[#F3F3F3] border-2 border-black hover:bg-[#FF90E8] hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                                                <p className="font-black text-black uppercase mb-2">{idea.title}</p>
                                                <p className="text-xs font-bold text-gray-600 mb-3">Hook: "{idea.hook}"</p>
                                                <span className="px-2 py-1 bg-black text-white text-xs font-bold uppercase">{idea.format}</span>
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse bg-white border-2 border-gray-200">
                            <div className="aspect-video bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-6 bg-gray-200 w-3/4" />
                                <div className="h-4 bg-gray-200 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Videos Grid */}
            {!loading && videos.length > 0 && (
                <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            variants={item}
                            className="group bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-all"
                        >
                            {/* Thumbnail */}
                            <a href={video.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-video border-b-2 border-black overflow-hidden">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black text-white text-xs font-black uppercase">
                                    {video.formattedDuration}
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                                    <Play className="w-12 h-12 text-white fill-black opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                </div>
                                {index < 3 && (
                                    <div className="absolute top-2 left-2 px-3 py-1 bg-[#FF4D4D] border-2 border-black text-white text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
                                        #{index + 1} Trending
                                    </div>
                                )}
                            </a>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-black text-lg leading-tight uppercase mb-2 line-clamp-2">
                                    {video.title}
                                </h3>
                                <p className="text-xs font-bold text-gray-500 uppercase mb-4">{video.channelTitle}</p>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-xs font-bold text-black border-t-2 border-black/10 pt-3 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" /> {video.formattedViews}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-4 h-4" /> {video.formattedLikes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="w-4 h-4" /> {video.formattedComments}
                                    </span>
                                </div>

                                {/* Engagement Rate & Analyze Button */}
                                <div className="flex items-center justify-between gap-3">
                                    <span className="px-2 py-1 bg-[#B1F202] border-2 border-black text-xs font-black">
                                        {video.engagementRate} ENGAGEMENT
                                    </span>
                                    <button
                                        onClick={() => analyzeVideo(video)}
                                        className="flex-1 py-2 bg-black text-white text-xs font-black uppercase hover:bg-[#FFC900] hover:text-black transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        Analyze This
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Empty State */}
            {!loading && videos.length === 0 && !error && (
                <div className="text-center py-16 bg-white border-2 border-black border-dashed">
                    <Youtube className="w-16 h-16 mx-auto text-black mb-4" />
                    <h3 className="text-xl font-black uppercase text-black mb-2">No videos found</h3>
                    <p className="font-medium text-gray-500">Try a different search query or refresh trending</p>
                </div>
            )}

            {/* Video Analysis Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-4 border-black shadow-[12px_12px_0px_0px_#FF90E8]"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 z-10 flex items-start gap-4 p-6 border-b-4 border-black bg-white">
                                <img src={selectedVideo.thumbnail} alt="" className="w-40 h-auto border-2 border-black shadow-[4px_4px_0px_0px_#000]" />
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-2xl font-black uppercase line-clamp-2 mb-2">
                                        {selectedVideo.title}
                                    </h2>
                                    <p className="font-bold text-gray-600 uppercase mb-2">{selectedVideo.channelTitle}</p>
                                    <div className="flex gap-2">
                                        <span className="bg-black text-white px-2 py-1 text-xs font-black uppercase">{selectedVideo.formattedViews} VIEWS</span>
                                        <span className="bg-[#B1F202] text-black border border-black px-2 py-1 text-xs font-black uppercase">{selectedVideo.engagementRate} ENGAGEMENT</span>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors">
                                    <X className="w-6 h-6" strokeWidth={3} />
                                </button>
                            </div>

                            {/* Analysis Content */}
                            <div className="p-8 space-y-8">
                                {analyzingVideo ? (
                                    <div className="text-center py-20">
                                        <Sparkles className="w-16 h-16 mx-auto text-[#FF90E8] animate-spin mb-6" />
                                        <p className="text-xl font-black uppercase animate-pulse">Deconstructing Virality...</p>
                                    </div>
                                ) : videoAnalysis ? (
                                    <>
                                        {/* Viral Score */}
                                        <div className="flex items-center gap-6 p-6 bg-[#B1F202] border-2 border-black shadow-[6px_6px_0px_0px_#000]">
                                            <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center border-4 border-white">
                                                <span className="text-4xl font-black text-[#B1F202]">{videoAnalysis.viralScore}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black uppercase mb-1">Viral Score</h3>
                                                <p className="font-bold text-lg">{videoAnalysis.whyViral}</p>
                                            </div>
                                        </div>

                                        {/* Key Factors */}
                                        <div>
                                            <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2 border-l-4 border-black pl-3">
                                                Key Viral Factors
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {videoAnalysis.keyFactors.map((factor, i) => (
                                                    <div key={i} className="p-4 bg-white border-2 border-black hover:bg-[#F3F3F3]">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-black uppercase">{factor.factor}</span>
                                                            <span className={cn(
                                                                "px-2 py-0.5 text-xs font-black border border-black",
                                                                factor.impact === 'HIGH' && "bg-[#00F0FF]",
                                                                factor.impact === 'MEDIUM' && "bg-[#FFC900]",
                                                                factor.impact === 'LOW' && "bg-[#E0E0E0]"
                                                            )}>
                                                                {factor.impact}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-600">{factor.analysis}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Deep Insights */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {[
                                                { title: "Thumbnail Strategy", icon: Eye, content: videoAnalysis.thumbnailInsights },
                                                { title: "Title Analysis", icon: Target, content: videoAnalysis.titleAnalysis },
                                                { title: "Content Strategy", icon: Youtube, content: videoAnalysis.contentStrategy },
                                                { title: "Audience Appeal", icon: Heart, content: videoAnalysis.audienceAppeal },
                                            ].map((item, i) => (
                                                <div key={i} className="p-5 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                                                    <h4 className="font-black uppercase mb-3 flex items-center gap-2">
                                                        <item.icon className="w-5 h-5" /> {item.title}
                                                    </h4>
                                                    <p className="text-sm font-medium">{item.content}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Recreate Strategy */}
                                        <div className="p-6 bg-[#FFC900] border-2 border-black shadow-[8px_8px_0px_0px_#000]">
                                            <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2 bg-black text-[#FFC900] inline-block px-3 py-1">
                                                <Lightbulb className="w-5 h-5 fill-[#FFC900]" />
                                                How YOU Can Steal This
                                            </h3>
                                            <div className="space-y-4 bg-white p-5 border-2 border-black">
                                                <div className="flex flex-col sm:flex-row gap-2 sm:items-center border-b-2 border-black pb-3">
                                                    <span className="text-xs font-black uppercase w-24 shrink-0 bg-black text-white px-2 py-1 text-center">Your Title</span>
                                                    <div className="flex-1 flex items-center justify-between gap-2">
                                                        <p className="font-bold uppercase">{videoAnalysis.recreateStrategy.yourTitle}</p>
                                                        <button onClick={() => copyToClipboard(videoAnalysis.recreateStrategy.yourTitle)} className="p-2 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-colors">
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-2 sm:items-center border-b-2 border-black pb-3">
                                                    <span className="text-xs font-black uppercase w-24 shrink-0 bg-black text-white px-2 py-1 text-center">Your Hook</span>
                                                    <p className="font-medium italic">"{videoAnalysis.recreateStrategy.yourHook}"</p>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                                    <span className="text-xs font-black uppercase w-24 shrink-0 bg-black text-white px-2 py-1 text-center">Your Angle</span>
                                                    <p className="font-medium">{videoAnalysis.recreateStrategy.yourAngle}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Do This / Avoid This */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="p-6 bg-[#E0FFE0] border-2 border-black">
                                                <h4 className="font-black uppercase mb-4 flex items-center gap-2 text-green-800">
                                                    <CheckCircle className="w-6 h-6 fill-green-800 text-white" />
                                                    Do This
                                                </h4>
                                                <ul className="space-y-3">
                                                    {videoAnalysis.doThis.map((tip, i) => (
                                                        <li key={i} className="font-bold text-sm flex items-start gap-2">
                                                            <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" />
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="p-6 bg-[#FFE0E0] border-2 border-black">
                                                <h4 className="font-black uppercase mb-4 flex items-center gap-2 text-red-800">
                                                    <AlertTriangle className="w-6 h-6 fill-red-800 text-white" />
                                                    Avoid This
                                                </h4>
                                                <ul className="space-y-3">
                                                    {videoAnalysis.avoidThis.map((tip, i) => (
                                                        <li key={i} className="font-bold text-sm flex items-start gap-2">
                                                            <X className="w-4 h-4 mt-0.5 shrink-0" />
                                                            {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-4 pt-4 border-t-4 border-black">
                                            <a
                                                href={selectedVideo.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 py-4 bg-[#FF4D4D] text-white border-2 border-black shadow-[4px_4px_0px_0px_#000] font-black uppercase text-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                                            >
                                                <Youtube className="w-5 h-5 fill-white" />
                                                Watch on YouTube
                                            </a>
                                            <button
                                                onClick={closeModal}
                                                className="flex-1 py-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] font-black uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
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
        </div>
    )
}
