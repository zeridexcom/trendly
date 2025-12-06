'use client'

import React, { useState } from 'react'
import {
    Sparkles,
    Zap,
    TrendingUp,
    Target,
    BarChart3,
    Flame,
    Clock,
    Copy,
    Check,
    Loader2,
    ArrowRight,
    Hash,
    MessageCircle,
    Heart,
    Share2,
    Bookmark,
    AlertCircle,
    ChevronRight,
    Lightbulb,
    Youtube,
    Twitter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Icons
const InstagramIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
    </svg>
)

const TikTokIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

const LinkedInIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)

// Types
interface ScoreFactor {
    name: string
    score: number
    maxScore: number
    weight: number
    analysis: string
    suggestions: string[]
    icon: string
}

interface ViralityResult {
    overallScore: number
    grade: string
    gradeColor: string
    factors: ScoreFactor[]
    emotionalTriggers: { trigger: string; strength: number; color: string }[]
    hookAnalysis: { score: number; type: string; pattern: string; improvements: string[] }
    readabilityScore: number
    predictedEngagement: { likes: string; comments: string; shares: string; saves: string }
    competitorComparison: number
    bestTimeToPost: string
    aiSuggestions: { category: string; original: string; improved: string; impact: string }[]
    trendAlignment: { matched: string[]; suggested: string[] }
}

const platforms = [
    { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
    { id: 'tiktok', label: 'TikTok', icon: TikTokIcon },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'twitter', label: 'Twitter/X', icon: Twitter },
    { id: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon },
]

const contentTypes = [
    { id: 'caption', label: 'Caption' },
    { id: 'script', label: 'Video Script' },
    { id: 'thread', label: 'Thread' },
    { id: 'post', label: 'Post' },
]

export default function ViralityPage() {
    const [content, setContent] = useState('')
    const [platform, setPlatform] = useState('instagram')
    const [contentType, setContentType] = useState('caption')
    const [hashtags, setHashtags] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<ViralityResult | null>(null)
    const [copied, setCopied] = useState(false)

    const analyzeContent = async () => {
        if (!content.trim() || content.length < 10) return

        setIsAnalyzing(true)
        try {
            const response = await fetch('/api/ai/virality', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    platform,
                    contentType,
                    hashtags: hashtags.split(/[,\s]+/).filter(Boolean).map(h => h.startsWith('#') ? h : `#${h}`)
                })
            })
            const data = await response.json()
            setResult(data)
        } catch (error) {
            console.error('Analysis failed:', error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500'
        if (score >= 60) return 'text-yellow-500'
        return 'text-red-500'
    }

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-500'
        if (score >= 60) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Zap className="h-8 w-8 text-yellow-500" />
                        Virality Score
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        AI-powered content analysis • 8 scoring factors • Improvement suggestions
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Input Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Content Analyzer
                        </h3>

                        {/* Platform Selector */}
                        <div className="mb-4">
                            <label className="text-sm font-medium mb-2 block">Platform</label>
                            <div className="flex flex-wrap gap-2">
                                {platforms.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPlatform(p.id)}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all",
                                            platform === p.id
                                                ? "border-primary bg-primary/10"
                                                : "border-input hover:bg-accent"
                                        )}
                                    >
                                        <p.icon />
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Type */}
                        <div className="mb-4">
                            <label className="text-sm font-medium mb-2 block">Content Type</label>
                            <select
                                value={contentType}
                                onChange={(e) => setContentType(e.target.value)}
                                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                {contentTypes.map((t) => (
                                    <option key={t.id} value={t.id}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Content Input */}
                        <div className="mb-4">
                            <label className="text-sm font-medium mb-2 block">Your Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your caption, script, or post here..."
                                className="flex min-h-[200px] w-full rounded-lg border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{content.length} characters</span>
                                <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                            </div>
                        </div>

                        {/* Hashtags */}
                        <div className="mb-4">
                            <label className="text-sm font-medium mb-2 block">Hashtags (optional)</label>
                            <input
                                type="text"
                                value={hashtags}
                                onChange={(e) => setHashtags(e.target.value)}
                                placeholder="#trending #viral #fyp"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                            />
                        </div>

                        <button
                            onClick={analyzeContent}
                            disabled={isAnalyzing || content.length < 10}
                            className="w-full inline-flex items-center justify-center rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 h-11 px-6 shadow-lg shadow-orange-500/25 disabled:opacity-50"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Zap className="mr-2 h-4 w-4" />
                                    Analyze Virality
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Score Card */}
                                <div className="rounded-xl border bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-sm">
                                    <div className="flex items-center gap-6">
                                        {/* Big Score */}
                                        <div className="relative">
                                            <div className="w-32 h-32 rounded-full border-8 flex items-center justify-center" style={{ borderColor: result.gradeColor }}>
                                                <div className="text-center">
                                                    <span className="text-4xl font-bold">{result.overallScore}</span>
                                                    <span className="text-sm text-muted-foreground block">/ 100</span>
                                                </div>
                                            </div>
                                            <div
                                                className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold"
                                                style={{ backgroundColor: result.gradeColor }}
                                            >
                                                {result.grade}
                                            </div>
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="flex-1 grid gap-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Hook Strength</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div className={cn("h-full rounded-full", getScoreBg(result.hookAnalysis.score))} style={{ width: `${result.hookAnalysis.score}%` }} />
                                                    </div>
                                                    <span className="text-sm font-medium w-8">{result.hookAnalysis.score}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">vs Competitors</span>
                                                <span className={cn("text-sm font-semibold", result.competitorComparison >= 70 ? "text-green-500" : "text-yellow-500")}>
                                                    Top {100 - result.competitorComparison}%
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Best Time</span>
                                                <span className="text-sm font-medium flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {result.bestTimeToPost}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Predicted Engagement */}
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-green-500" />
                                        Predicted Engagement
                                    </h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="text-center p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20">
                                            <Heart className="h-5 w-5 text-pink-500 mx-auto mb-1" />
                                            <p className="text-lg font-bold">{result.predictedEngagement.likes}</p>
                                            <p className="text-xs text-muted-foreground">Likes</p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                            <MessageCircle className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                                            <p className="text-lg font-bold">{result.predictedEngagement.comments}</p>
                                            <p className="text-xs text-muted-foreground">Comments</p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                                            <Share2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
                                            <p className="text-lg font-bold">{result.predictedEngagement.shares}</p>
                                            <p className="text-xs text-muted-foreground">Shares</p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                            <Bookmark className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                                            <p className="text-lg font-bold">{result.predictedEngagement.saves}</p>
                                            <p className="text-xs text-muted-foreground">Saves</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Scoring Factors */}
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Scoring Breakdown (8 Factors)
                                    </h3>
                                    <div className="space-y-4">
                                        {result.factors.map((factor, i) => (
                                            <motion.div
                                                key={factor.name}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{factor.icon}</span>
                                                        <span className="text-sm font-medium">{factor.name}</span>
                                                        {factor.weight > 1 && (
                                                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                                                {factor.weight}x weight
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className={cn("text-sm font-bold", getScoreColor(factor.score))}>
                                                        {factor.score}/{factor.maxScore}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-1">
                                                    <motion.div
                                                        className={cn("h-full rounded-full", getScoreBg(factor.score))}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${factor.score}%` }}
                                                        transition={{ duration: 0.5, delay: i * 0.05 }}
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground">{factor.analysis}</p>
                                                {factor.suggestions.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {factor.suggestions.map((s, j) => (
                                                            <span key={j} className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full">
                                                                💡 {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Emotional Triggers */}
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <Flame className="h-5 w-5 text-orange-500" />
                                        Emotional Triggers Detected
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.emotionalTriggers.map((trigger, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                                                style={{ borderColor: trigger.color, backgroundColor: `${trigger.color}10` }}
                                            >
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trigger.color }} />
                                                <span className="text-sm font-medium capitalize">{trigger.trigger}</span>
                                                <span className="text-xs text-muted-foreground">{trigger.strength}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Suggestions */}
                                {result.aiSuggestions.length > 0 && (
                                    <div className="rounded-xl border bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 p-6 shadow-sm">
                                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                                            AI Improvement Suggestions
                                        </h3>
                                        <div className="space-y-4">
                                            {result.aiSuggestions.map((suggestion, i) => (
                                                <div key={i} className="p-4 rounded-lg bg-background/50">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">{suggestion.category}</span>
                                                        <span className="text-xs text-green-500 font-semibold">{suggestion.impact}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm line-through text-muted-foreground">
                                                            {suggestion.original}
                                                        </div>
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                        <div className="flex-1 p-2 rounded bg-green-50 dark:bg-green-900/20 text-sm font-medium">
                                                            {suggestion.improved}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Trend Alignment */}
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <Hash className="h-5 w-5 text-blue-500" />
                                        Trend Alignment
                                    </h3>
                                    <div className="space-y-3">
                                        {result.trendAlignment.matched.length > 0 && (
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-2">✅ Matched Trends:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.trendAlignment.matched.map((t, i) => (
                                                        <span key={i} className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-2">💡 Suggested Trends to Add:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.trendAlignment.suggested.map((t, i) => (
                                                    <span key={i} className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs cursor-pointer hover:bg-blue-200 transition-colors">
                                                        + {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-xl border bg-card p-12 shadow-sm flex flex-col items-center justify-center text-center min-h-[500px]"
                            >
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-6">
                                    <Zap className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Analyze Your Content</h3>
                                <p className="text-muted-foreground max-w-md mb-6">
                                    Paste your caption, script, or post and get an instant virality score with 8 weighted factors,
                                    emotional trigger detection, and AI-powered improvement suggestions.
                                </p>
                                <div className="flex flex-wrap justify-center gap-2 text-xs">
                                    <span className="px-2 py-1 bg-muted rounded-full">🎣 Hook Strength</span>
                                    <span className="px-2 py-1 bg-muted rounded-full">❤️ Emotional Impact</span>
                                    <span className="px-2 py-1 bg-muted rounded-full">📏 Length</span>
                                    <span className="px-2 py-1 bg-muted rounded-full">👁️ Readability</span>
                                    <span className="px-2 py-1 bg-muted rounded-full">#️⃣ Hashtags</span>
                                    <span className="px-2 py-1 bg-muted rounded-full">✨ Emojis</span>
                                    <span className="px-2 py-1 bg-muted rounded-full">🎯 CTA</span>
                                    <span className="px-2 py-1 bg-muted rounded-full">🔥 Trends</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
