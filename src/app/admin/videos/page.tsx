'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Youtube,
    Plus,
    Search,
    Trash2,
    Eye,
    ExternalLink,
    RefreshCw,
    Star,
    Play,
    ThumbsUp,
    X,
    Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CachedVideo {
    id: number
    video_id: string
    title: string
    channel_title: string
    thumbnail: string
    view_count: number
    like_count: number
    industry: string
    fetched_at: string
}

interface FeaturedVideo {
    id: string
    video_id: string
    title: string
    thumbnail: string
    channel_title: string
    view_count: number
    like_count: number
    industry: string
    is_featured: boolean
    added_at: string
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function VideosManagementPage() {
    const [cachedVideos, setCachedVideos] = useState<CachedVideo[]>([])
    const [featuredVideos, setFeaturedVideos] = useState<FeaturedVideo[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<'cached' | 'featured'>('cached')
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [newVideoUrl, setNewVideoUrl] = useState('')
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        setLoading(true)
        try {
            // Fetch cached YouTube videos
            const cachedResponse = await fetch('/api/youtube/trending')
            const cachedData = await cachedResponse.json()
            if (cachedData.videos) {
                setCachedVideos(cachedData.videos || [])
            }

            // Fetch featured admin videos
            const featuredResponse = await fetch('/api/admin/videos')
            const featuredData = await featuredResponse.json()
            if (featuredData.success) {
                setFeaturedVideos(featuredData.videos || [])
            }
        } catch (error) {
            console.error('Failed to fetch videos:', error)
        } finally {
            setLoading(false)
        }
    }

    const addVideo = async () => {
        if (!newVideoUrl.trim()) return
        setAdding(true)
        try {
            const videoId = extractVideoId(newVideoUrl)
            if (!videoId) {
                alert('Invalid YouTube URL')
                return
            }

            const response = await fetch('/api/admin/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId })
            })

            if (response.ok) {
                setNewVideoUrl('')
                setAddModalOpen(false)
                fetchVideos()
            }
        } catch (error) {
            console.error('Failed to add video:', error)
        } finally {
            setAdding(false)
        }
    }

    const extractVideoId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([a-zA-Z0-9_-]{11})$/
        ]
        for (const pattern of patterns) {
            const match = url.match(pattern)
            if (match) return match[1]
        }
        return null
    }

    const deleteVideo = async (id: string) => {
        if (!confirm('Remove this video?')) return
        try {
            await fetch('/api/admin/videos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            setFeaturedVideos(featuredVideos.filter(v => v.id !== id))
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    const formatCount = (count: number) => {
        if (!count) return '0'
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
        return count.toString()
    }

    const filteredCachedVideos = cachedVideos.filter(video =>
        video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channel_title?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredFeaturedVideos = featuredVideos.filter(video =>
        video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channel_title?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Youtube className="w-8 h-8" />
                        YouTube Videos
                    </h1>
                    <p className="text-black/60 mt-1 font-medium">View cached and featured videos</p>
                </div>
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="px-4 py-2 bg-[#FF4D4D] text-white border-2 border-black font-black uppercase text-sm flex items-center gap-2 shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Video
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('cached')}
                    className={cn(
                        "px-4 py-2 font-black uppercase text-sm border-2 border-black transition-all",
                        activeTab === 'cached'
                            ? "bg-[#FF4D4D] text-white shadow-brutal"
                            : "bg-white hover:bg-[#F5F5F0]"
                    )}
                >
                    <Youtube className="w-4 h-4 inline mr-2" />
                    Cached Videos ({cachedVideos.length})
                </button>
                <button
                    onClick={() => setActiveTab('featured')}
                    className={cn(
                        "px-4 py-2 font-black uppercase text-sm border-2 border-black transition-all",
                        activeTab === 'featured'
                            ? "bg-[#FFC900] shadow-brutal"
                            : "bg-white hover:bg-[#F5F5F0]"
                    )}
                >
                    <Star className="w-4 h-4 inline mr-2" />
                    Featured ({featuredVideos.length})
                </button>
            </div>

            {/* Search */}
            <motion.div variants={item} className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-2 border-black pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-[#FF4D4D] focus:outline-none"
                    />
                </div>
                <button
                    onClick={fetchVideos}
                    className="px-4 py-2 bg-white border-2 border-black hover:bg-[#F5F5F0]"
                >
                    <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                </button>
            </motion.div>

            {/* Cached Videos Grid */}
            {activeTab === 'cached' && (
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white border-2 border-black overflow-hidden animate-pulse">
                                <div className="aspect-video bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-5 bg-gray-200 w-3/4" />
                                    <div className="h-4 bg-gray-200 w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : filteredCachedVideos.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white border-2 border-black">
                            <Youtube className="w-12 h-12 text-black/30 mx-auto mb-3" />
                            <p className="text-black/60 font-medium">No cached videos found</p>
                            <p className="text-sm text-black/40">Refresh the cache to fetch new videos</p>
                        </div>
                    ) : (
                        filteredCachedVideos.slice(0, 30).map((video) => (
                            <div
                                key={video.id}
                                className="bg-white border-2 border-black overflow-hidden group hover:shadow-brutal transition-all"
                            >
                                <div className="relative aspect-video bg-gray-200">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`
                                        }}
                                    />
                                    <a
                                        href={`https://youtube.com/watch?v=${video.video_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Play className="w-12 h-12 text-white" />
                                    </a>
                                    <span className="absolute top-2 left-2 px-2 py-1 bg-[#00F0FF] border border-black text-xs font-black uppercase">
                                        {video.industry}
                                    </span>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-black line-clamp-2 mb-1">{video.title}</h3>
                                    <p className="text-sm text-black/60 mb-3">{video.channel_title}</p>

                                    <div className="flex items-center gap-4 text-sm text-black/60">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {formatCount(video.view_count)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ThumbsUp className="w-4 h-4" />
                                            {formatCount(video.like_count)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>
            )}

            {/* Featured Videos Grid */}
            {activeTab === 'featured' && (
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white border-2 border-black overflow-hidden animate-pulse">
                                <div className="aspect-video bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-5 bg-gray-200 w-3/4" />
                                    <div className="h-4 bg-gray-200 w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : filteredFeaturedVideos.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white border-2 border-black">
                            <Star className="w-12 h-12 text-black/30 mx-auto mb-3" />
                            <p className="text-black/60 font-medium">No featured videos yet</p>
                            <button
                                onClick={() => setAddModalOpen(true)}
                                className="mt-4 px-4 py-2 bg-[#FFC900] border-2 border-black font-black uppercase text-sm"
                            >
                                Add Your First Video
                            </button>
                        </div>
                    ) : (
                        filteredFeaturedVideos.map((video) => (
                            <div
                                key={video.id}
                                className="bg-white border-4 border-[#FFC900] overflow-hidden group shadow-brutal"
                            >
                                <div className="relative aspect-video bg-gray-200">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`
                                        }}
                                    />
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#FFC900] border border-black text-xs font-black flex items-center gap-1">
                                        <Star className="w-3 h-3" /> Featured
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-black line-clamp-2 mb-1">{video.title}</h3>
                                    <p className="text-sm text-black/60 mb-3">{video.channel_title}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-sm text-black/60">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                {formatCount(video.view_count)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`https://youtube.com/watch?v=${video.video_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-white border border-black hover:bg-[#F5F5F0]"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => deleteVideo(video.id)}
                                                className="p-2 bg-[#FF4D4D] text-white border border-black hover:bg-[#FF3333]"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>
            )}

            {/* Add Video Modal */}
            {addModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    onClick={() => setAddModalOpen(false)}
                >
                    <div
                        className="bg-white border-4 border-black w-full max-w-md p-6 shadow-brutal-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-black uppercase">Add YouTube Video</h3>
                            <button onClick={() => setAddModalOpen(false)} className="p-2 hover:bg-[#F5F5F0] border border-black">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-black/60 mb-4">
                            Paste a YouTube URL to add it to featured videos
                        </p>

                        <input
                            type="text"
                            value={newVideoUrl}
                            onChange={(e) => setNewVideoUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FF4D4D] focus:outline-none mb-4"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setAddModalOpen(false)}
                                className="flex-1 py-3 bg-white border-2 border-black font-black uppercase hover:bg-[#F5F5F0]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addVideo}
                                disabled={!newVideoUrl.trim() || adding}
                                className={cn(
                                    "flex-1 py-3 font-black uppercase flex items-center justify-center gap-2 border-2 border-black",
                                    !newVideoUrl.trim() || adding
                                        ? "bg-gray-200 text-black/50 cursor-not-allowed"
                                        : "bg-[#FF4D4D] text-white hover:bg-[#FF3333]"
                                )}
                            >
                                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
