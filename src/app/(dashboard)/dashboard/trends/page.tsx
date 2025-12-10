'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp, Play, Eye, Heart, MessageCircle, Clock, ExternalLink,
    Sparkles, Search, RefreshCw, Lightbulb, Hash, Target, Zap, Youtube,
    X, CheckCircle, AlertTriangle, ArrowRight, Copy, ThumbsUp, BarChart3, Globe, Loader2, RotateCcw
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
    viralHook?: {
        original: string
        englishTranslation: string
        hookType: string
        hookAnalysis: string
    }
    keyFactors: { factor: string; analysis: string; impact: string }[]
    thumbnailInsights: string
    titleAnalysis: string
    contentStrategy: string
    audienceAppeal: string
    topicSummary?: string
    suggestedHashtags?: string[]
    suggestedTags?: string[]
    suggestedCaption?: string
    suggestedDescription?: string
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

interface GoogleTrend {
    title: string
    formattedTraffic: string
    relatedQueries?: string[]
    industry?: string
    relevanceScore?: number
    reason?: string
    contentIdea?: string
    quickAnalysis?: {
        whyTrending: string
        contentIdea: string
        isPreComputed: boolean
    }
}

interface GoogleTrendAnalysis {
    whyTrending: string
    searchIntent: string
    audienceProfile: string
    contentAngles: string[]
    bestPlatforms: string[]
    peakTiming: string
    suggestedTitle: string
    suggestedHook: string
    hashtags: string[]
    keyPoints: string[]
    potentialViews: string
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
    // Active tab
    const [activeTab, setActiveTab] = useState<'youtube' | 'google'>('youtube')

    // YouTube state
    const [videos, setVideos] = useState<YouTubeVideo[]>([])
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [analyzing, setAnalyzing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastFetched, setLastFetched] = useState<string>('')

    // Pagination state for cached videos
    const [currentPage, setCurrentPage] = useState(1)
    const [totalVideos, setTotalVideos] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [userNiche, setUserNiche] = useState('TECH')

    // YouTube video analysis modal state
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
    const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null)
    const [analyzingVideo, setAnalyzingVideo] = useState(false)

    // Google Trends state
    const [googleTrends, setGoogleTrends] = useState<GoogleTrend[]>([])
    const [loadingGoogle, setLoadingGoogle] = useState(true)
    const [personalization, setPersonalization] = useState<{ industry: string; location: string } | null>(null)

    // Google Trend analysis modal state
    const [selectedGoogleTrend, setSelectedGoogleTrend] = useState<GoogleTrend | null>(null)
    const [googleTrendAnalysis, setGoogleTrendAnalysis] = useState<GoogleTrendAnalysis | null>(null)
    const [analyzingGoogleTrend, setAnalyzingGoogleTrend] = useState(false)

    useEffect(() => {
        // Get user's niche from preferences
        getUserNiche()
        fetchTrending(true) // true = fresh start with random offset
        fetchGoogleTrends()
    }, [])

    const getUserNiche = async () => {
        try {
            const response = await fetch('/api/user/preferences')
            const data = await response.json()
            if (data.industry) {
                setUserNiche(data.industry.toUpperCase())
            }
        } catch (e) {
            console.log('Using default niche')
        }
    }

    const fetchTrending = async (freshStart: boolean = false) => {
        if (freshStart) {
            setLoading(true)
            setVideos([])
            setCurrentPage(1)
        }
        setError(null)

        try {
            // Use cache API with random page for variety
            const page = freshStart ? Math.floor(Math.random() * 3) + 1 : currentPage
            const response = await fetch(`/api/youtube/cache?niche=${userNiche}&page=${page}&limit=20`)
            const data = await response.json()

            if (data.success) {
                const formattedVideos = data.videos.map((v: any) => ({
                    id: v.id,
                    title: v.title,
                    description: v.description || '',
                    thumbnail: v.thumbnail,
                    channelTitle: v.channelTitle,
                    publishedAt: v.publishedAt,
                    viewCount: parseInt(v.viewCount || '0'),
                    likeCount: parseInt(v.likeCount || '0'),
                    commentCount: parseInt(v.commentCount || '0'),
                    formattedViews: v.formattedViews || '0',
                    formattedLikes: v.formattedLikes || '0',
                    formattedComments: '0',
                    formattedDuration: '',
                    engagementRate: '',
                    categoryName: userNiche,
                    tags: v.tags || [],
                    url: `https://youtube.com/watch?v=${v.id}`
                }))

                if (freshStart) {
                    setVideos(formattedVideos)
                } else {
                    setVideos(prev => [...prev, ...formattedVideos])
                }

                setTotalVideos(data.pagination?.totalVideos || 0)
                setHasMore(data.pagination?.hasMore || false)
                setCurrentPage(data.pagination?.page || 1)
                setLastFetched(new Date().toLocaleTimeString())
                setSearchQuery('')
                setAiAnalysis(null)
            } else {
                setError(data.error)
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch trends')
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const loadMoreVideos = async () => {
        setLoadingMore(true)
        const nextPage = currentPage + 1
        setCurrentPage(nextPage)

        try {
            const response = await fetch(`/api/youtube/cache?niche=${userNiche}&page=${nextPage}&limit=20`)
            const data = await response.json()

            if (data.success) {
                const formattedVideos = data.videos.map((v: any) => ({
                    id: v.id,
                    title: v.title,
                    description: v.description || '',
                    thumbnail: v.thumbnail,
                    channelTitle: v.channelTitle,
                    publishedAt: v.publishedAt,
                    viewCount: parseInt(v.viewCount || '0'),
                    likeCount: parseInt(v.likeCount || '0'),
                    commentCount: parseInt(v.commentCount || '0'),
                    formattedViews: v.formattedViews || '0',
                    formattedLikes: v.formattedLikes || '0',
                    formattedComments: '0',
                    formattedDuration: '',
                    engagementRate: '',
                    categoryName: userNiche,
                    tags: v.tags || [],
                    url: `https://youtube.com/watch?v=${v.id}`
                }))

                setVideos(prev => [...prev, ...formattedVideos])
                setHasMore(data.pagination?.hasMore || false)
            }
        } catch (err) {
            console.error('Failed to load more:', err)
        } finally {
            setLoadingMore(false)
        }
    }

    const refreshVideos = () => {
        fetchTrending(true)
    }

    const fetchGoogleTrends = async () => {
        setLoadingGoogle(true)
        try {
            const response = await fetch('/api/trends/personalized')
            const data = await response.json()
            if (data.success && data.trends) {
                setGoogleTrends(data.trends)
                if (data.personalization) {
                    setPersonalization(data.personalization)
                }
            }
        } catch (err) {
            console.error('Failed to fetch Google trends:', err)
        } finally {
            setLoadingGoogle(false)
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

    const analyzeGoogleTrend = async (trend: GoogleTrend) => {
        setSelectedGoogleTrend(trend)

        // If trend has pre-computed quickAnalysis, use it instantly (no loading!)
        if (trend.quickAnalysis?.isPreComputed || trend.reason) {
            setGoogleTrendAnalysis({
                whyTrending: trend.quickAnalysis?.whyTrending || trend.reason || 'This topic is trending in your niche',
                searchIntent: 'Users are looking for information, tips, and guidance on this topic',
                audienceProfile: 'Health-conscious individuals interested in wellness and fitness',
                contentAngles: [
                    trend.quickAnalysis?.contentIdea || trend.contentIdea || 'Create a comprehensive guide',
                    'Share your personal experience or case study',
                    'Compare different approaches or methods',
                    'Debunk common myths about this topic'
                ],
                bestPlatforms: ['YouTube', 'Instagram Reels', 'TikTok'],
                peakTiming: 'Post now while trending - mornings work best',
                suggestedTitle: `${trend.title} - Complete Guide for 2024`,
                suggestedHook: `Here's what nobody tells you about ${trend.title.toLowerCase()}...`,
                hashtags: ['#health', '#wellness', '#fitness', '#trending', `#${trend.title.replace(/\s+/g, '').toLowerCase()}`],
                keyPoints: ['Key insight 1', 'Key insight 2', 'Key insight 3'],
                potentialViews: 'HIGH'
            })
            setAnalyzingGoogleTrend(false)
            return
        }

        // Otherwise, call AI API for full analysis
        setGoogleTrendAnalysis(null)
        setAnalyzingGoogleTrend(true)
        try {
            const response = await fetch('/api/trends/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trend: trend.title,
                    traffic: trend.formattedTraffic,
                    industry: personalization?.industry || 'GENERAL'
                }),
            })
            const data = await response.json()
            if (data.success) {
                setGoogleTrendAnalysis(data.analysis)
            }
        } catch (err) {
            console.error('Google trend analysis error:', err)
        } finally {
            setAnalyzingGoogleTrend(false)
        }
    }

    const closeModal = () => {
        setSelectedVideo(null)
        setVideoAnalysis(null)
    }

    const closeGoogleTrendModal = () => {
        setSelectedGoogleTrend(null)
        setGoogleTrendAnalysis(null)
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
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-8 h-8 text-black" />
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                            Real-Time Trends
                        </h1>
                        <span className="px-3 py-1 bg-[#B1F202] border-2 border-black font-black uppercase text-sm shadow-[2px_2px_0px_0px_#000]">
                            LIVE
                        </span>
                    </div>
                    <p className="text-black font-bold border-l-4 border-black pl-3">
                        {personalization?.industry && personalization.industry !== 'ALL'
                            ? `Personalized for ${personalization.industry.charAt(0) + personalization.industry.slice(1).toLowerCase()}`
                            : 'Trending in India right now'
                        }
                        {lastFetched && <span className="ml-2 text-sm text-gray-500 font-bold">• UPDATED {lastFetched}</span>}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { refreshVideos(); fetchGoogleTrends(); }}
                        disabled={loading || loadingGoogle}
                        className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                        <RefreshCw className={cn("w-6 h-6 text-black", (loading || loadingGoogle) && "animate-spin")} />
                    </button>
                </div>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('youtube')}
                    className={cn(
                        "px-6 py-3 font-black uppercase text-sm border-2 border-black transition-all flex items-center gap-2",
                        activeTab === 'youtube'
                            ? "bg-red-500 text-white shadow-[4px_4px_0px_0px_#000]"
                            : "bg-white text-black hover:bg-gray-100"
                    )}
                >
                    <Youtube className="w-5 h-5" />
                    YouTube Trends
                    <span className="px-2 py-0.5 text-xs bg-black text-white rounded-full">{videos.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('google')}
                    className={cn(
                        "px-6 py-3 font-black uppercase text-sm border-2 border-black transition-all flex items-center gap-2",
                        activeTab === 'google'
                            ? "bg-blue-500 text-white shadow-[4px_4px_0px_0px_#000]"
                            : "bg-white text-black hover:bg-gray-100"
                    )}
                >
                    <Globe className="w-5 h-5" />
                    Google Trends
                    <span className="px-2 py-0.5 text-xs bg-black text-white rounded-full">{googleTrends.length}</span>
                </button>
            </motion.div>

            {/* ========== YOUTUBE TAB ========== */}
            {activeTab === 'youtube' && (
                <>
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
                                className="mb-10 p-8 bg-[#FFC900] border-4 border-black shadow-[8px_8px_0px_0px_#000]"
                            >
                                <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                                    <Sparkles className="w-7 h-7 fill-black" />
                                    AI Analysis: "{searchQuery}"
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-5 border-2 border-black">
                                        <h4 className="font-black uppercase mb-3 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5" /> Why It's Trending
                                        </h4>
                                        <p className="font-medium">{aiAnalysis.whyTrending}</p>
                                    </div>
                                    <div className="bg-white p-5 border-2 border-black">
                                        <h4 className="font-black uppercase mb-3 flex items-center gap-2">
                                            <Hash className="w-5 h-5" /> Best Hashtags
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {aiAnalysis.bestHashtags.map((tag: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-black text-white text-xs font-bold">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 border-2 border-black md:col-span-2">
                                        <h4 className="font-black uppercase mb-3 flex items-center gap-2">
                                            <Lightbulb className="w-5 h-5" /> Content Ideas
                                        </h4>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            {aiAnalysis.contentIdeas.map((idea: any, i: number) => (
                                                <div key={i} className="p-3 border border-black">
                                                    <p className="font-black text-sm mb-1">{idea.title}</p>
                                                    <p className="text-xs text-gray-600">"{idea.hook}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading State */}
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="animate-pulse bg-white border-2 border-black">
                                    <div className="aspect-video bg-gray-200" />
                                    <div className="p-5">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video, index) => (
                                <motion.div
                                    key={video.id}
                                    variants={item}
                                    className="bg-white border-2 border-black overflow-hidden hover:shadow-[8px_8px_0px_0px_#FF4D4D] transition-shadow group"
                                >
                                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="block relative">
                                        <img src={video.thumbnail} alt={video.title} className="w-full aspect-video object-cover" />
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-black text-white text-xs font-black">
                                            #{index + 1} TRENDING
                                        </div>
                                        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black text-white text-xs font-black">
                                            {video.formattedDuration}
                                        </div>
                                    </a>
                                    <div className="p-5">
                                        <h3 className="font-black text-lg leading-tight uppercase mb-2 line-clamp-2">
                                            {video.title}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-4">{video.channelTitle}</p>
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

                    {/* Load More Button */}
                    {!loading && videos.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-8 flex flex-col items-center gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-gray-500">
                                    Showing {videos.length} of {totalVideos} videos
                                </span>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={refreshVideos}
                                    disabled={loading}
                                    className="px-6 py-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase text-sm flex items-center gap-2"
                                >
                                    <RotateCcw className={cn("w-5 h-5", loading && "animate-spin")} />
                                    Refresh
                                </button>
                                {hasMore && (
                                    <button
                                        onClick={loadMoreVideos}
                                        disabled={loadingMore}
                                        className="px-8 py-3 bg-[#B1F202] border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase text-sm flex items-center gap-2"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            <>
                                                Load More Videos
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
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
                </>
            )}

            {/* ========== GOOGLE TRENDS TAB ========== */}
            {activeTab === 'google' && (
                <>
                    {loadingGoogle ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="animate-pulse bg-white border-2 border-black p-6">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {googleTrends.map((trend, i) => (
                                <motion.div
                                    key={i}
                                    variants={item}
                                    className="bg-white border-2 border-black p-5 hover:shadow-[6px_6px_0px_0px_#3B82F6] transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-black">
                                            #{i + 1} TRENDING
                                        </span>
                                        <span className="text-xs font-black text-gray-500 bg-gray-100 px-2 py-1">
                                            {trend.formattedTraffic}
                                        </span>
                                    </div>
                                    <h3 className="font-black text-xl uppercase mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {trend.title}
                                    </h3>
                                    {trend.relevanceScore && trend.relevanceScore >= 90 && (
                                        <div className="mb-3">
                                            <span className="px-2 py-1 bg-[#B1F202] border border-black text-xs font-black">
                                                🎯 {trend.relevanceScore}% MATCH
                                            </span>
                                        </div>
                                    )}
                                    {trend.contentIdea && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            💡 {trend.contentIdea}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => analyzeGoogleTrend(trend)}
                                        className="w-full py-3 bg-black text-white font-black uppercase hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Why Is This Trending?
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {!loadingGoogle && googleTrends.length === 0 && (
                        <div className="text-center py-16 bg-white border-2 border-black border-dashed">
                            <Globe className="w-16 h-16 mx-auto text-black mb-4" />
                            <h3 className="text-xl font-black uppercase text-black mb-2">No Google trends found</h3>
                            <p className="font-medium text-gray-500">Try refreshing the page</p>
                        </div>
                    )}
                </>
            )}

            {/* ========== GOOGLE TREND ANALYSIS MODAL ========== */}
            <AnimatePresence>
                {selectedGoogleTrend && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={closeGoogleTrendModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border-4 border-black shadow-[12px_12px_0px_0px_#3B82F6]"
                        >
                            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b-4 border-black bg-blue-500 text-white">
                                <div>
                                    <h2 className="text-2xl font-black uppercase">{selectedGoogleTrend.title}</h2>
                                    <p className="font-bold">{selectedGoogleTrend.formattedTraffic} searches</p>
                                </div>
                                <button onClick={closeGoogleTrendModal} className="p-2 border-2 border-white hover:bg-white hover:text-blue-500 transition-colors">
                                    <X className="w-6 h-6" strokeWidth={3} />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                {analyzingGoogleTrend ? (
                                    <div className="text-center py-20">
                                        <Sparkles className="w-16 h-16 mx-auto text-blue-500 animate-spin mb-6" />
                                        <p className="text-xl font-black uppercase animate-pulse">Analyzing Search Intent...</p>
                                    </div>
                                ) : googleTrendAnalysis ? (
                                    <>
                                        <div className="p-5 bg-blue-100 border-2 border-black">
                                            <h4 className="font-black uppercase mb-2 flex items-center gap-2">🔥 Why Is This Trending?</h4>
                                            <p className="font-medium">{googleTrendAnalysis.whyTrending}</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-5 bg-white border-2 border-black">
                                                <h4 className="font-black uppercase mb-2">🎯 Search Intent</h4>
                                                <p className="font-medium text-sm">{googleTrendAnalysis.searchIntent}</p>
                                            </div>
                                            <div className="p-5 bg-white border-2 border-black">
                                                <h4 className="font-black uppercase mb-2">👥 Who Is Searching</h4>
                                                <p className="font-medium text-sm">{googleTrendAnalysis.audienceProfile}</p>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-[#FFC900] border-2 border-black">
                                            <h4 className="font-black uppercase mb-3">💡 Content Ideas For You</h4>
                                            <ul className="space-y-2">
                                                {googleTrendAnalysis.contentAngles.map((angle, i) => (
                                                    <li key={i} className="font-medium flex items-start gap-2">
                                                        <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" /> {angle}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-5 bg-white border-2 border-black">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-black uppercase">📝 Title Idea</h4>
                                                    <button onClick={() => copyToClipboard(googleTrendAnalysis.suggestedTitle)} className="text-xs px-2 py-1 bg-black text-white font-bold">Copy</button>
                                                </div>
                                                <p className="font-bold">{googleTrendAnalysis.suggestedTitle}</p>
                                            </div>
                                            <div className="p-5 bg-white border-2 border-black">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-black uppercase">🎬 Hook Idea</h4>
                                                    <button onClick={() => copyToClipboard(googleTrendAnalysis.suggestedHook)} className="text-xs px-2 py-1 bg-black text-white font-bold">Copy</button>
                                                </div>
                                                <p className="font-medium italic">"{googleTrendAnalysis.suggestedHook}"</p>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-white border-2 border-black">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-black uppercase flex items-center gap-2"><Hash className="w-5 h-5" /> Hashtags</h4>
                                                <button onClick={() => copyToClipboard(googleTrendAnalysis.hashtags.join(' '))} className="text-xs px-2 py-1 bg-black text-white font-bold">Copy All</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {googleTrendAnalysis.hashtags.map((tag, i) => (
                                                    <span key={i} className="px-2 py-1 bg-black text-white text-xs font-bold">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-[#B1F202] border-2 border-black">
                                            <span className="font-black uppercase">Viral Potential:</span>
                                            <span className="px-3 py-1 bg-black text-white font-black">{googleTrendAnalysis.potentialViews}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-10 text-gray-500">
                                        <p className="font-medium">Loading analysis...</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ========== VIDEO ANALYSIS MODAL ========== */}
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

                                        {/* Viral Hook */}
                                        {videoAnalysis.viralHook && (
                                            <div className="p-6 bg-[#FF90E8] border-4 border-black shadow-[8px_8px_0px_0px_#000]">
                                                <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                                                    <Zap className="w-6 h-6" />
                                                    The Viral Hook 🔥
                                                </h3>
                                                <div className="bg-white p-4 border-2 border-black mb-4">
                                                    <p className="text-lg font-black mb-2">"{videoAnalysis.viralHook.original}"</p>
                                                    {videoAnalysis.viralHook.original !== videoAnalysis.viralHook.englishTranslation && (
                                                        <p className="text-sm font-medium text-gray-600 italic">
                                                            English: "{videoAnalysis.viralHook.englishTranslation}"
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="bg-white p-3 border-2 border-black">
                                                        <span className="text-xs font-black uppercase text-gray-500">Hook Type</span>
                                                        <p className="font-black">{videoAnalysis.viralHook.hookType}</p>
                                                    </div>
                                                    <div className="bg-white p-3 border-2 border-black">
                                                        <span className="text-xs font-black uppercase text-gray-500">Why It Works</span>
                                                        <p className="font-medium text-sm">{videoAnalysis.viralHook.hookAnalysis}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Topic Summary */}
                                        {videoAnalysis.topicSummary && (
                                            <div className="p-5 bg-white border-2 border-black">
                                                <h4 className="font-black uppercase mb-2 flex items-center gap-2">
                                                    📝 What This Video Is About
                                                </h4>
                                                <p className="font-medium">{videoAnalysis.topicSummary}</p>
                                            </div>
                                        )}

                                        {/* Hashtags & Tags */}
                                        {(videoAnalysis.suggestedHashtags || videoAnalysis.suggestedTags) && (
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {videoAnalysis.suggestedHashtags && (
                                                    <div className="p-5 bg-white border-2 border-black">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-black uppercase flex items-center gap-2">
                                                                <Hash className="w-5 h-5" /> Trending Hashtags
                                                            </h4>
                                                            <button
                                                                onClick={() => copyToClipboard(videoAnalysis.suggestedHashtags?.join(' ') || '')}
                                                                className="text-xs px-2 py-1 bg-black text-white font-bold hover:bg-gray-800"
                                                            >
                                                                Copy All
                                                            </button>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {videoAnalysis.suggestedHashtags.map((tag, i) => (
                                                                <span key={i} className="px-2 py-1 bg-black text-white text-xs font-bold">
                                                                    {tag.startsWith('#') ? tag : `#${tag}`}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {videoAnalysis.suggestedTags && (
                                                    <div className="p-5 bg-white border-2 border-black">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-black uppercase flex items-center gap-2">
                                                                🏷️ SEO Tags
                                                            </h4>
                                                            <button
                                                                onClick={() => copyToClipboard(videoAnalysis.suggestedTags?.join(', ') || '')}
                                                                className="text-xs px-2 py-1 bg-black text-white font-bold hover:bg-gray-800"
                                                            >
                                                                Copy All
                                                            </button>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {videoAnalysis.suggestedTags.map((tag, i) => (
                                                                <span key={i} className="px-2 py-1 bg-gray-200 text-black text-xs font-medium">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Caption & Description */}
                                        {(videoAnalysis.suggestedCaption || videoAnalysis.suggestedDescription) && (
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {videoAnalysis.suggestedCaption && (
                                                    <div className="p-5 bg-[#FFC900] border-2 border-black">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-black uppercase">📱 Caption Idea</h4>
                                                            <button
                                                                onClick={() => copyToClipboard(videoAnalysis.suggestedCaption || '')}
                                                                className="text-xs px-2 py-1 bg-black text-white font-bold hover:bg-gray-800"
                                                            >
                                                                Copy
                                                            </button>
                                                        </div>
                                                        <p className="font-medium">{videoAnalysis.suggestedCaption}</p>
                                                    </div>
                                                )}
                                                {videoAnalysis.suggestedDescription && (
                                                    <div className="p-5 bg-[#00F0FF] border-2 border-black">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-black uppercase">📄 Description Idea</h4>
                                                            <button
                                                                onClick={() => copyToClipboard(videoAnalysis.suggestedDescription || '')}
                                                                className="text-xs px-2 py-1 bg-black text-white font-bold hover:bg-gray-800"
                                                            >
                                                                Copy
                                                            </button>
                                                        </div>
                                                        <p className="font-medium text-sm whitespace-pre-line">{videoAnalysis.suggestedDescription}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

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

                                        {/* Action Buttons */}
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
