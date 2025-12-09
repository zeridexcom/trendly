'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Youtube,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    ExternalLink,
    RefreshCw,
    Star,
    Play,
    BarChart3,
    Clock,
    ThumbsUp,
    MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeaturedVideo {
    id: string
    videoId: string
    title: string
    thumbnail: string
    channelTitle: string
    viewCount: number
    likeCount: number
    industry: string
    isFeatured: boolean
    addedAt: string
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
    const [videos, setVideos] = useState<FeaturedVideo[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [newVideoUrl, setNewVideoUrl] = useState('')
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/videos')
            const data = await response.json()
            if (data.success) {
                setVideos(data.videos)
            }
        } catch (error) {
            console.error('Failed to fetch videos:', error)
            // Demo data
            setVideos([
                {
                    id: '1',
                    videoId: 'dQw4w9WgXcQ',
                    title: 'Top 10 Tech Trends 2025',
                    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                    channelTitle: 'Tech News',
                    viewCount: 1500000,
                    likeCount: 50000,
                    industry: 'TECH',
                    isFeatured: true,
                    addedAt: new Date().toISOString()
                },
                {
                    id: '2',
                    videoId: 'abc123',
                    title: 'Morning Workout Routine',
                    thumbnail: 'https://img.youtube.com/vi/abc123/maxresdefault.jpg',
                    channelTitle: 'Fitness Pro',
                    viewCount: 800000,
                    likeCount: 25000,
                    industry: 'FITNESS',
                    isFeatured: false,
                    addedAt: new Date().toISOString()
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    const addVideo = async () => {
        if (!newVideoUrl.trim()) return

        setAdding(true)
        try {
            // Extract video ID from URL
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

            const data = await response.json()
            if (data.success) {
                setVideos([data.video, ...videos])
                setNewVideoUrl('')
                setAddModalOpen(false)
            }
        } catch (error) {
            console.error('Failed to add video:', error)
            // Demo: add mock video
            setVideos([{
                id: Date.now().toString(),
                videoId: extractVideoId(newVideoUrl) || 'unknown',
                title: 'New Video',
                thumbnail: `https://img.youtube.com/vi/${extractVideoId(newVideoUrl)}/maxresdefault.jpg`,
                channelTitle: 'Unknown',
                viewCount: 0,
                likeCount: 0,
                industry: 'ALL',
                isFeatured: false,
                addedAt: new Date().toISOString()
            }, ...videos])
            setNewVideoUrl('')
            setAddModalOpen(false)
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

    const toggleFeatured = async (video: FeaturedVideo) => {
        try {
            await fetch('/api/admin/videos', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: video.id, isFeatured: !video.isFeatured })
            })
            setVideos(videos.map(v => v.id === video.id ? { ...v, isFeatured: !v.isFeatured } : v))
        } catch (error) {
            setVideos(videos.map(v => v.id === video.id ? { ...v, isFeatured: !v.isFeatured } : v))
        }
    }

    const deleteVideo = async (id: string) => {
        if (!confirm('Remove this video?')) return

        try {
            await fetch('/api/admin/videos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            setVideos(videos.filter(v => v.id !== id))
        } catch (error) {
            setVideos(videos.filter(v => v.id !== id))
        }
    }

    const formatCount = (count: number) => {
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
        return count.toString()
    }

    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Youtube className="w-8 h-8 text-red-500" />
                        YouTube Videos
                    </h1>
                    <p className="text-[#888] mt-1">Manage featured videos</p>
                </div>
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Video
                </button>
            </div>

            {/* Search */}
            <motion.div variants={item} className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111] border-2 border-[#333] rounded-lg pl-10 pr-4 py-2.5 focus:border-red-500 focus:outline-none"
                    />
                </div>
                <button
                    onClick={fetchVideos}
                    className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#333] rounded-lg hover:border-[#FFC900]"
                >
                    <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                </button>
            </motion.div>

            {/* Videos Grid */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-[#111] border-2 border-[#222] rounded-xl overflow-hidden animate-pulse">
                            <div className="aspect-video bg-[#333]" />
                            <div className="p-4 space-y-2">
                                <div className="h-5 bg-[#333] rounded w-3/4" />
                                <div className="h-4 bg-[#333] rounded w-1/2" />
                            </div>
                        </div>
                    ))
                ) : filteredVideos.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-[#111] border-2 border-[#222] rounded-xl">
                        <Youtube className="w-12 h-12 text-[#666] mx-auto mb-3" />
                        <p className="text-[#888]">No videos found</p>
                        <button
                            onClick={() => setAddModalOpen(true)}
                            className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg"
                        >
                            Add Your First Video
                        </button>
                    </div>
                ) : (
                    filteredVideos.map((video) => (
                        <div
                            key={video.id}
                            className={cn(
                                "bg-[#111] border-2 rounded-xl overflow-hidden transition-all group",
                                video.isFeatured ? "border-[#FFC900]" : "border-[#222] hover:border-[#444]"
                            )}
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-[#333]">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
                                    }}
                                />
                                {video.isFeatured && (
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#FFC900] text-black text-xs font-bold rounded flex items-center gap-1">
                                        <Star className="w-3 h-3" /> Featured
                                    </div>
                                )}
                                <a
                                    href={`https://youtube.com/watch?v=${video.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Play className="w-12 h-12 text-white" />
                                </a>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="font-bold line-clamp-2 mb-1">{video.title}</h3>
                                <p className="text-sm text-[#888] mb-3">{video.channelTitle}</p>

                                <div className="flex items-center gap-4 text-sm text-[#888] mb-4">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        {formatCount(video.viewCount)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ThumbsUp className="w-4 h-4" />
                                        {formatCount(video.likeCount)}
                                    </span>
                                    <span className="px-2 py-0.5 bg-[#333] rounded text-xs">
                                        {video.industry}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => toggleFeatured(video)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors",
                                            video.isFeatured
                                                ? "bg-[#FFC900]/20 text-[#FFC900]"
                                                : "bg-[#333] text-[#888] hover:bg-[#444]"
                                        )}
                                    >
                                        <Star className="w-4 h-4" />
                                        {video.isFeatured ? 'Featured' : 'Feature'}
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={`https://youtube.com/watch?v=${video.videoId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-[#333] rounded-lg transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => deleteVideo(video.id)}
                                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
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

            {/* Add Video Modal */}
            {addModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                    onClick={() => setAddModalOpen(false)}
                >
                    <div
                        className="bg-[#111] border-2 border-[#333] rounded-xl w-full max-w-md p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-black mb-4">Add YouTube Video</h3>
                        <p className="text-sm text-[#888] mb-4">
                            Paste a YouTube URL to add it to your featured videos
                        </p>

                        <input
                            type="text"
                            value={newVideoUrl}
                            onChange={(e) => setNewVideoUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-red-500 focus:outline-none mb-4"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setAddModalOpen(false)}
                                className="flex-1 py-3 bg-[#333] rounded-lg font-bold hover:bg-[#444]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addVideo}
                                disabled={!newVideoUrl.trim() || adding}
                                className={cn(
                                    "flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2",
                                    !newVideoUrl.trim() || adding
                                        ? "bg-[#333] text-[#888] cursor-not-allowed"
                                        : "bg-red-500 text-white hover:bg-red-600"
                                )}
                            >
                                {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Add Video
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
