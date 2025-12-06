'use client'

import React, { useState, useEffect } from 'react'
import {
    MessageCircle,
    Send,
    Copy,
    Check,
    Loader2,
    Plus,
    Trash2,
    ThumbsUp,
    ThumbsDown,
    HelpCircle,
    AlertTriangle,
    Minus,
    RefreshCw,
    Sparkles,
    ChevronDown,
    Youtube,
    Twitter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Icons
const InstagramIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
    </svg>
)

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

const LinkedInIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
)

// Types
interface CommentInput {
    id: string
    text: string
    username: string
    platform: string
}

interface GeneratedReply {
    id: string
    originalComment: CommentInput
    sentiment: string
    sentimentScore: number
    intent: string
    replies: { style: string; text: string; engagementScore: number }[]
    suggestedEmojis: string[]
    followUpQuestion?: string
}

const platforms = [
    { id: 'instagram', label: 'Instagram', icon: InstagramIcon, color: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400' },
    { id: 'tiktok', label: 'TikTok', icon: TikTokIcon, color: 'bg-black' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-red-600' },
    { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { id: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon, color: 'bg-blue-700' },
    { id: 'facebook', label: 'Facebook', icon: FacebookIcon, color: 'bg-blue-600' },
]

const sentimentIcons = {
    positive: { icon: ThumbsUp, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    negative: { icon: ThumbsDown, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
    neutral: { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
    question: { icon: HelpCircle, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    spam: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
}

const styleEmojis: Record<string, string> = {
    friendly: '😊',
    professional: '💼',
    witty: '😏',
    grateful: '🙏',
    engaging: '💬',
    casual: '✌️',
}

export default function CommentsPage() {
    const [comments, setComments] = useState<CommentInput[]>([])
    const [results, setResults] = useState<GeneratedReply[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [selectedPlatform, setSelectedPlatform] = useState('instagram')
    const [expandedResult, setExpandedResult] = useState<string | null>(null)

    // New comment form
    const [newComment, setNewComment] = useState({ username: '', text: '' })

    const addComment = () => {
        if (!newComment.text.trim()) return

        setComments([...comments, {
            id: `comment_${Date.now()}`,
            text: newComment.text,
            username: newComment.username || 'User',
            platform: selectedPlatform,
        }])
        setNewComment({ username: '', text: '' })
    }

    const removeComment = (id: string) => {
        setComments(comments.filter(c => c.id !== id))
    }

    const processComments = async () => {
        if (comments.length === 0) return

        setIsProcessing(true)
        try {
            const response = await fetch('/api/ai/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comments })
            })
            const data = await response.json()
            if (data.success) {
                setResults(data.results)
            }
        } catch (error) {
            console.error('Failed to process comments:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    const copyReply = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const getPlatformInfo = (platformId: string) => {
        return platforms.find(p => p.id === platformId) || platforms[0]
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <MessageCircle className="h-8 w-8 text-blue-500" />
                        AI Comment Responder
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Generate smart replies for all your social media comments
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Section */}
                <div className="space-y-4">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            Add Comments
                        </h3>

                        {/* Platform Selector */}
                        <div className="mb-4">
                            <label className="text-sm font-medium mb-2 block">Platform</label>
                            <div className="flex flex-wrap gap-2">
                                {platforms.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPlatform(p.id)}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all",
                                            selectedPlatform === p.id
                                                ? "border-primary bg-primary/10"
                                                : "border-input hover:bg-accent"
                                        )}
                                    >
                                        <p.icon className="h-4 w-4" />
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comment Input */}
                        <div className="space-y-3 mb-4">
                            <input
                                type="text"
                                value={newComment.username}
                                onChange={(e) => setNewComment({ ...newComment, username: e.target.value })}
                                placeholder="Username (optional)"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                            />
                            <textarea
                                value={newComment.text}
                                onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                                placeholder="Paste the comment here..."
                                className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
                            />
                            <button
                                onClick={addComment}
                                disabled={!newComment.text.trim()}
                                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 disabled:opacity-50"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Comment
                            </button>
                        </div>

                        {/* Comments Queue */}
                        {comments.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Comments Queue ({comments.length})</span>
                                    <button
                                        onClick={() => setComments([])}
                                        className="text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        Clear all
                                    </button>
                                </div>
                                <div className="max-h-[200px] overflow-y-auto space-y-2">
                                    {comments.map((comment) => {
                                        const platformInfo = getPlatformInfo(comment.platform)
                                        return (
                                            <div key={comment.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                                                <div className={cn("w-6 h-6 rounded flex items-center justify-center text-white flex-shrink-0", platformInfo.color)}>
                                                    <platformInfo.icon className="h-3 w-3" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium">@{comment.username}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{comment.text}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeComment(comment.id)}
                                                    className="p-1 rounded hover:bg-background"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={processComments}
                        disabled={isProcessing || comments.length === 0}
                        className="w-full inline-flex items-center justify-center rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 h-12 shadow-lg shadow-blue-500/25 disabled:opacity-50"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Generating Replies...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Generate Smart Replies ({comments.length})
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    {results.length > 0 ? (
                        <div className="space-y-4">
                            {results.map((result, i) => {
                                const platformInfo = getPlatformInfo(result.originalComment.platform)
                                const sentimentInfo = sentimentIcons[result.sentiment as keyof typeof sentimentIcons] || sentimentIcons.neutral
                                const SentimentIcon = sentimentInfo.icon
                                const isExpanded = expandedResult === result.id

                                return (
                                    <motion.div
                                        key={result.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="rounded-xl border bg-card shadow-sm overflow-hidden"
                                    >
                                        {/* Comment Header */}
                                        <div
                                            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => setExpandedResult(isExpanded ? null : result.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0", platformInfo.color)}>
                                                    <platformInfo.icon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-semibold">@{result.originalComment.username}</span>
                                                        <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs", sentimentInfo.bg)}>
                                                            <SentimentIcon className={cn("h-3 w-3", sentimentInfo.color)} />
                                                            <span className="capitalize">{result.sentiment}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{result.originalComment.text}</p>
                                                </div>
                                                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                                            </div>
                                        </div>

                                        {/* Replies */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 'auto' }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 space-y-3">
                                                        <div className="border-t pt-3">
                                                            <p className="text-xs font-medium text-muted-foreground mb-3">Choose a reply style:</p>
                                                            <div className="grid gap-2">
                                                                {result.replies.map((reply) => (
                                                                    <div
                                                                        key={reply.style}
                                                                        className="flex items-start gap-3 p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all group"
                                                                    >
                                                                        <span className="text-lg">{styleEmojis[reply.style]}</span>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <span className="text-xs font-semibold capitalize">{reply.style}</span>
                                                                                <span className="text-xs text-green-500">{reply.engagementScore}% match</span>
                                                                            </div>
                                                                            <p className="text-sm">{reply.text}</p>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => copyReply(reply.text, `${result.id}-${reply.style}`)}
                                                                            className="p-2 rounded-md hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            {copiedId === `${result.id}-${reply.style}` ? (
                                                                                <Check className="h-4 w-4 text-green-500" />
                                                                            ) : (
                                                                                <Copy className="h-4 w-4" />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Suggested Emojis */}
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-muted-foreground">Add emoji:</span>
                                                            {result.suggestedEmojis.map((emoji, j) => (
                                                                <button
                                                                    key={j}
                                                                    onClick={() => navigator.clipboard.writeText(emoji)}
                                                                    className="text-lg hover:scale-125 transition-transform"
                                                                >
                                                                    {emoji}
                                                                </button>
                                                            ))}
                                                        </div>

                                                        {/* Follow-up Question */}
                                                        {result.followUpQuestion && (
                                                            <div className="p-2 rounded-lg bg-muted/50 text-xs">
                                                                <span className="font-medium">💡 Engagement tip:</span> Add "{result.followUpQuestion}"
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="rounded-xl border bg-card p-12 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4">
                                <MessageCircle className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Add Comments to Reply</h3>
                            <p className="text-muted-foreground text-sm max-w-sm">
                                Paste comments from any platform and get AI-generated smart replies in 6 different styles.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {Object.entries(styleEmojis).map(([style, emoji]) => (
                                    <span key={style} className="px-2 py-1 bg-muted rounded-full text-xs">
                                        {emoji} {style}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
