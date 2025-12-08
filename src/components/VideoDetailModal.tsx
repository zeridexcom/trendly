'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    ExternalLink,
    Eye,
    Heart,
    MessageCircle,
    Sparkles,
    Copy,
    Check,
    Loader2,
    Lightbulb,
    Hash,
    Tag,
    FileText,
    Clock,
    TrendingUp,
    Zap,
    ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface VideoAnalysis {
    whyPopular: string
    hook: string
    suggestedHashtags: string[]
    suggestedTags: string[]
    suggestedTitle: string
    suggestedDescription: string
    contentIdea: string
    keyTakeaways: string[]
}

interface VideoDetailModalProps {
    video: {
        id: string
        title: string
        thumbnail: string
        channelTitle: string
        description: string
        tags: string[]
        viewCount: number
        likeCount: number
        commentCount: number
        formattedViews: string
        formattedLikes: string
        formattedComments: string
        engagementRate: string
        url: string
        daysAgo?: number
    }
    userIndustry: string
    isOpen: boolean
    onClose: () => void
}

export default function VideoDetailModal({ video, userIndustry, isOpen, onClose }: VideoDetailModalProps) {
    const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && video && !analysis) {
            fetchAnalysis()
        }
    }, [isOpen, video])

    const fetchAnalysis = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/youtube/trending', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ video, userIndustry }),
            })
            const data = await response.json()
            if (data.success) {
                setAnalysis(data.analysis)
            }
        } catch (error) {
            console.error('Failed to fetch analysis:', error)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text)
        setCopied(type)
        setTimeout(() => setCopied(null), 2000)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-[#1A1714] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-4 border-black"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b-4 border-black bg-[#FFC900]">
                        <h2 className="font-black text-black text-lg flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            AI Video Analysis
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-black/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-black" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                        {/* Video Info */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex gap-4">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-48 h-28 object-cover rounded-lg border-2 border-black"
                                />
                                <div className="flex-1">
                                    <h3 className="font-black text-black dark:text-white text-lg mb-2 line-clamp-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {video.channelTitle}
                                    </p>
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        <span className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded font-bold">
                                            <Eye className="w-4 h-4" />
                                            {video.formattedViews}
                                        </span>
                                        <span className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded font-bold">
                                            <Heart className="w-4 h-4" />
                                            {video.formattedLikes}
                                        </span>
                                        <span className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded font-bold">
                                            <MessageCircle className="w-4 h-4" />
                                            {video.formattedComments}
                                        </span>
                                        <span className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded font-bold">
                                            <TrendingUp className="w-4 h-4" />
                                            {video.engagementRate}
                                        </span>
                                        {video.daysAgo !== undefined && (
                                            <span className="flex items-center gap-1 bg-purple-500 text-white px-2 py-1 rounded font-bold">
                                                <Clock className="w-4 h-4" />
                                                {video.daysAgo === 0 ? 'Today' : `${video.daysAgo}d ago`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Watch on YouTube
                            </a>
                        </div>

                        {/* AI Analysis */}
                        {loading ? (
                            <div className="p-8 flex flex-col items-center justify-center">
                                <Loader2 className="w-8 h-8 text-[#FFC900] animate-spin mb-3" />
                                <p className="text-gray-600 dark:text-gray-400">AI is analyzing this video...</p>
                            </div>
                        ) : analysis ? (
                            <div className="p-4 space-y-4">
                                {/* Why Popular */}
                                <div className="p-4 bg-[#FFC900]/20 border-2 border-[#FFC900] rounded-xl">
                                    <h4 className="font-black text-black dark:text-white mb-2 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-[#FFC900]" />
                                        Why This Video Went Viral
                                    </h4>
                                    <p className="text-black dark:text-white">{analysis.whyPopular}</p>
                                </div>

                                {/* Hook */}
                                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500 rounded-xl">
                                    <h4 className="font-black text-black dark:text-white mb-2 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-purple-500" />
                                        Opening Hook Strategy
                                    </h4>
                                    <p className="text-black dark:text-white">{analysis.hook}</p>
                                </div>

                                {/* Content Idea */}
                                <div className="p-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded-xl">
                                    <h4 className="font-black text-black dark:text-white mb-2 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-green-500" />
                                        Content Idea For You
                                    </h4>
                                    <p className="text-black dark:text-white font-medium">{analysis.contentIdea}</p>
                                </div>

                                {/* Key Takeaways */}
                                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 rounded-xl">
                                    <h4 className="font-black text-black dark:text-white mb-2 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        Key Takeaways
                                    </h4>
                                    <ul className="space-y-1">
                                        {analysis.keyTakeaways.map((takeaway, i) => (
                                            <li key={i} className="text-black dark:text-white flex items-start gap-2">
                                                <span className="font-bold text-blue-600">•</span>
                                                {takeaway}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Suggested Title */}
                                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-black text-black dark:text-white flex items-center gap-2">
                                            📝 Suggested Title
                                        </h4>
                                        <button
                                            onClick={() => copyToClipboard(analysis.suggestedTitle, 'title')}
                                            className="text-sm px-2 py-1 bg-black text-white rounded hover:bg-gray-800 flex items-center gap-1"
                                        >
                                            {copied === 'title' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            Copy
                                        </button>
                                    </div>
                                    <p className="text-black dark:text-white font-medium">{analysis.suggestedTitle}</p>
                                </div>

                                {/* Suggested Description */}
                                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-black text-black dark:text-white flex items-center gap-2">
                                            📄 Suggested Description
                                        </h4>
                                        <button
                                            onClick={() => copyToClipboard(analysis.suggestedDescription, 'desc')}
                                            className="text-sm px-2 py-1 bg-black text-white rounded hover:bg-gray-800 flex items-center gap-1"
                                        >
                                            {copied === 'desc' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            Copy
                                        </button>
                                    </div>
                                    <p className="text-black dark:text-white">{analysis.suggestedDescription}</p>
                                </div>

                                {/* Hashtags */}
                                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-black text-black dark:text-white flex items-center gap-2">
                                            <Hash className="w-5 h-5" /> Trending Hashtags
                                        </h4>
                                        <button
                                            onClick={() => copyToClipboard(analysis.suggestedHashtags.join(' '), 'hashtags')}
                                            className="text-sm px-2 py-1 bg-black text-white rounded hover:bg-gray-800 flex items-center gap-1"
                                        >
                                            {copied === 'hashtags' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            Copy All
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.suggestedHashtags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-black text-white rounded-full text-sm font-bold">
                                                {tag.startsWith('#') ? tag : `#${tag}`}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-black text-black dark:text-white flex items-center gap-2">
                                            <Tag className="w-5 h-5" /> SEO Tags
                                        </h4>
                                        <button
                                            onClick={() => copyToClipboard(analysis.suggestedTags.join(', '), 'tags')}
                                            className="text-sm px-2 py-1 bg-black text-white rounded hover:bg-gray-800 flex items-center gap-1"
                                        >
                                            {copied === 'tags' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            Copy All
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.suggestedTags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {/* Create Content CTA */}
                        <div className="p-4 border-t-4 border-black bg-[#B1F202]">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-black text-black text-lg">Ready to Create?</h4>
                                    <p className="text-black/70 text-sm">Turn this inspiration into your own viral content</p>
                                </div>
                                <Link
                                    href={`/dashboard/scripts?topic=${encodeURIComponent(video.title)}&idea=${encodeURIComponent(analysis?.contentIdea || '')}`}
                                    className="px-6 py-3 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_#FFC900] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center gap-2"
                                    onClick={onClose}
                                >
                                    Create Your Own Content
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
