'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Music,
    Hash,
    Play,
    TrendingUp,
    Globe,
    Filter,
    RefreshCw,
    ExternalLink,
    Flame,
    Clock,
    Youtube,
    Instagram,
    Twitter,
    Sparkles,
    Search,
    ChevronRight,
    ArrowUpRight,
    Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

// Types
interface TrendingSong {
    id: string
    title: string
    artist: string
    platform: string
    uses: string
    growth: string
    coverUrl: string
}

interface TrendingHashtag {
    id: string
    tag: string
    platform: string
    posts: string
    growth: string
    category: string
}

interface ViralClip {
    id: string
    title: string
    creator: string
    platform: string
    views: string
    likes: string
    category: string
    thumbnailUrl: string
    duration: string
}

interface TrendingTopic {
    id: string
    topic: string
    description: string
    platforms: string[]
    hotness: number
    category: string
    region: string
}

interface DiscoveryData {
    lastUpdated: string
    region: string
    songs: TrendingSong[]
    hashtags: TrendingHashtag[]
    clips: ViralClip[]
    topics: TrendingTopic[]
    youtubeKeywords: string[]
}

const tabs = [
    { id: 'topics', label: 'Trending Topics', icon: TrendingUp },
    { id: 'songs', label: 'Trending Songs', icon: Music },
    { id: 'hashtags', label: 'Hashtags', icon: Hash },
    { id: 'clips', label: 'Viral Clips', icon: Play },
    { id: 'keywords', label: 'YouTube SEO', icon: Youtube },
]

const regions = [
    { value: 'global', label: '🌍 Global' },
    { value: 'us', label: '🇺🇸 United States' },
    { value: 'uk', label: '🇬🇧 United Kingdom' },
    { value: 'in', label: '🇮🇳 India' },
    { value: 'br', label: '🇧🇷 Brazil' },
    { value: 'jp', label: '🇯🇵 Japan' },
    { value: 'kr', label: '🇰🇷 South Korea' },
    { value: 'de', label: '🇩🇪 Germany' },
]

const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'tech', label: 'Tech' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'food', label: 'Food' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'business', label: 'Business' },
    { value: 'comedy', label: 'Comedy' },
]

const platformIcons: Record<string, React.ElementType> = {
    tiktok: TikTokIcon,
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    spotify: Music,
}

const platformColors: Record<string, string> = {
    tiktok: 'bg-black text-white',
    instagram: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 text-white',
    youtube: 'bg-red-600 text-white',
    twitter: 'bg-sky-500 text-white',
    spotify: 'bg-green-500 text-white',
}

export default function TrendsPage() {
    const [activeTab, setActiveTab] = useState('topics')
    const [region, setRegion] = useState('global')
    const [category, setCategory] = useState('all')
    const [data, setData] = useState<DiscoveryData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

    const fetchTrends = useCallback(async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true)
        else setIsLoading(true)

        try {
            const response = await fetch(
                `/api/ai/trends/discover?region=${region}&category=${category}`
            )
            const result = await response.json()
            setData(result)
            setLastUpdate(new Date())
        } catch (error) {
            console.error('Failed to fetch trends:', error)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [region, category])

    // Initial load and filter changes
    useEffect(() => {
        fetchTrends()
    }, [fetchTrends])

    // Auto-refresh every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            fetchTrends(true)
        }, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [fetchTrends])

    const formatTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
        if (seconds < 60) return 'Just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        return `${Math.floor(seconds / 3600)}h ago`
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Flame className="h-8 w-8 text-orange-500" />
                        Trends Discovery
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Real-time trending content across all platforms
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {lastUpdate && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {formatTimeAgo(lastUpdate)}
                        </span>
                    )}
                    <button
                        onClick={() => fetchTrends(true)}
                        disabled={isRefreshing}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    >
                        <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {regions.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {categories.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
                <nav className="flex gap-4 overflow-x-auto pb-px" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                                activeTab === tab.id
                                    ? "border-primary text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Discovering trends...</p>
                    </div>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Trending Topics */}
                        {activeTab === 'topics' && data?.topics && (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {data.topics.map((topic, i) => (
                                    <motion.div
                                        key={topic.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/30"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold group-hover:text-primary transition-colors">{topic.topic}</h3>
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{topic.description}</p>
                                            </div>
                                            <div className="flex-shrink-0 ml-3">
                                                <div className={cn(
                                                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                                                    topic.hotness >= 90 ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                                                        topic.hotness >= 80 ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" :
                                                            "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                )}>
                                                    <Flame className="h-3 w-3" />
                                                    {topic.hotness}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{topic.category}</span>
                                            <div className="flex gap-1">
                                                {topic.platforms.map((p) => {
                                                    const Icon = platformIcons[p] || Globe
                                                    return <Icon key={p} className="h-3.5 w-3.5 text-muted-foreground" />
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Trending Songs */}
                        {activeTab === 'songs' && data?.songs && (
                            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                                <div className="divide-y">
                                    {data.songs.map((song, i) => {
                                        const PlatformIcon = platformIcons[song.platform] || Music
                                        return (
                                            <motion.div
                                                key={song.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group"
                                            >
                                                <span className="text-lg font-bold text-muted-foreground w-6">{i + 1}</span>
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl">
                                                        🎵
                                                    </div>
                                                    <div className={cn(
                                                        "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
                                                        platformColors[song.platform]
                                                    )}>
                                                        <PlatformIcon className="h-3 w-3" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate group-hover:text-primary transition-colors">{song.title}</p>
                                                    <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">{song.uses}</p>
                                                    <p className="text-xs text-green-500 flex items-center justify-end gap-0.5">
                                                        <ArrowUpRight className="h-3 w-3" />
                                                        {song.growth}
                                                    </p>
                                                </div>
                                                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                                                    <ExternalLink className="h-4 w-4" />
                                                </button>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Trending Hashtags */}
                        {activeTab === 'hashtags' && data?.hashtags && (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {data.hashtags.map((hashtag, i) => {
                                    const PlatformIcon = platformIcons[hashtag.platform] || Hash
                                    return (
                                        <motion.div
                                            key={hashtag.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-primary/30"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center",
                                                    platformColors[hashtag.platform]
                                                )}>
                                                    <PlatformIcon className="h-4 w-4" />
                                                </div>
                                                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{hashtag.category}</span>
                                            </div>
                                            <p className="font-semibold text-lg group-hover:text-primary transition-colors">{hashtag.tag}</p>
                                            <div className="flex items-center justify-between mt-2 text-sm">
                                                <span className="text-muted-foreground">{hashtag.posts} posts</span>
                                                <span className="text-green-500 font-medium">{hashtag.growth}</span>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Viral Clips */}
                        {activeTab === 'clips' && data?.clips && (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                                {data.clips.map((clip, i) => {
                                    const PlatformIcon = platformIcons[clip.platform] || Play
                                    return (
                                        <motion.div
                                            key={clip.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                                        >
                                            <div className="relative aspect-[9/16] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                                <Play className="h-12 w-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
                                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                                                    {clip.duration}
                                                </div>
                                                <div className={cn(
                                                    "absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center",
                                                    platformColors[clip.platform]
                                                )}>
                                                    <PlatformIcon className="h-3 w-3" />
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <p className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{clip.title}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{clip.creator}</p>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                    <span>{clip.views} views</span>
                                                    <span>{clip.likes} likes</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}

                        {/* YouTube SEO Keywords */}
                        {activeTab === 'keywords' && data?.youtubeKeywords && (
                            <div className="space-y-4">
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-red-500/10">
                                            <Youtube className="h-5 w-5 text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Trending YouTube Keywords</h3>
                                            <p className="text-sm text-muted-foreground">High-volume search terms for SEO optimization</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {data.youtubeKeywords.map((keyword, i) => (
                                            <motion.button
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.03 }}
                                                onClick={() => navigator.clipboard.writeText(keyword)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-background text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group"
                                            >
                                                <Search className="h-3 w-3 text-muted-foreground group-hover:text-primary-foreground" />
                                                {keyword}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-xl border bg-gradient-to-br from-red-500/5 via-orange-500/5 to-yellow-500/5 p-6">
                                    <div className="flex items-start gap-3">
                                        <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold">Pro Tip</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Click any keyword to copy it. Use these in your video titles, descriptions, and tags to improve discoverability.
                                                Combine 2-3 related keywords for maximum impact.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    )
}
