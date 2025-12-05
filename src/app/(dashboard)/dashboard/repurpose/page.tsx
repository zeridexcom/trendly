'use client'

import { useState } from 'react'
import {
    Sparkles,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    Copy,
    Check,
    Loader2,
    FileText,
    Zap,
    ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

interface RepurposedContent {
    twitter: { thread: string[]; singlePost: string }
    linkedin: string
    instagram: { caption: string; hashtags: string[] }
    tiktok: { script: string; hooks: string[] }
    youtubeShorts: { script: string; title: string }
}

const platformConfig = {
    twitter: { name: 'Twitter / X', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    linkedin: { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-600/10' },
    instagram: { name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    tiktok: { name: 'TikTok', icon: TikTokIcon, color: 'text-black dark:text-white', bg: 'bg-gray-500/10' },
    youtubeShorts: { name: 'YouTube Shorts', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10' },
}

export default function RepurposePage() {
    const [originalContent, setOriginalContent] = useState('')
    const [contentType, setContentType] = useState<'blog' | 'video' | 'podcast' | 'article'>('blog')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<RepurposedContent | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleRepurpose = async () => {
        if (originalContent.trim().length < 50) return

        setIsLoading(true)
        try {
            const response = await fetch('/api/ai/repurpose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: originalContent, contentType })
            })
            const data = await response.json()
            if (data.error) throw new Error(data.error)
            setResult(data)
        } catch (error) {
            console.error('Failed to repurpose:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Content Repurposer</h1>
                <p className="text-muted-foreground mt-1">
                    Transform one piece of content into optimized versions for every platform.
                </p>
            </div>

            {/* Input Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <label className="text-sm font-medium mb-3 block">Original Content</label>
                        <textarea
                            value={originalContent}
                            onChange={(e) => setOriginalContent(e.target.value)}
                            placeholder="Paste your blog post, video script, article, or any content here..."
                            className="flex min-h-[300px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                        />
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Content Type:</span>
                                <select
                                    value={contentType}
                                    onChange={(e) => setContentType(e.target.value as typeof contentType)}
                                    className="text-sm border rounded-md px-2 py-1 bg-background"
                                >
                                    <option value="blog">Blog Post</option>
                                    <option value="video">Video Script</option>
                                    <option value="podcast">Podcast Notes</option>
                                    <option value="article">Article</option>
                                </select>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {originalContent.length} characters
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleRepurpose}
                        disabled={isLoading || originalContent.trim().length < 50}
                        className="w-full inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Zap className="mr-2 h-5 w-5" />
                                Repurpose Content
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>

                {/* How it works */}
                <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 p-6">
                    <h3 className="font-semibold flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-primary" />
                        How It Works
                    </h3>
                    <div className="space-y-4">
                        {[
                            { step: 1, title: 'Paste Your Content', desc: 'Add your blog post, video script, or any long-form content.' },
                            { step: 2, title: 'AI Analyzes & Adapts', desc: 'Our AI extracts key points and adapts tone for each platform.' },
                            { step: 3, title: 'Get 5 Versions', desc: 'Receive optimized content for Twitter, LinkedIn, Instagram, TikTok & YouTube.' },
                            { step: 4, title: 'Copy & Post', desc: 'One-click copy to clipboard, ready to publish everywhere.' },
                        ].map((item) => (
                            <div key={item.step} className="flex gap-3">
                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                                    {item.step}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            Your Content is Ready
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {/* Twitter Card */}
                            <PlatformCard
                                platform="twitter"
                                config={platformConfig.twitter}
                                copiedId={copiedId}
                                onCopy={copyToClipboard}
                            >
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Single Tweet</p>
                                        <p className="text-sm">{result.twitter.singlePost}</p>
                                    </div>
                                    <div className="border-t pt-3">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Thread ({result.twitter.thread.length} tweets)</p>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {result.twitter.thread.map((tweet, i) => (
                                                <p key={i} className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                                    {tweet}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </PlatformCard>

                            {/* LinkedIn Card */}
                            <PlatformCard
                                platform="linkedin"
                                config={platformConfig.linkedin}
                                copiedId={copiedId}
                                onCopy={copyToClipboard}
                                content={result.linkedin}
                            >
                                <p className="text-sm whitespace-pre-line line-clamp-[12]">{result.linkedin}</p>
                            </PlatformCard>

                            {/* Instagram Card */}
                            <PlatformCard
                                platform="instagram"
                                config={platformConfig.instagram}
                                copiedId={copiedId}
                                onCopy={copyToClipboard}
                                content={result.instagram.caption + '\n\n' + result.instagram.hashtags.join(' ')}
                            >
                                <div className="space-y-3">
                                    <p className="text-sm line-clamp-6">{result.instagram.caption}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {result.instagram.hashtags.slice(0, 6).map((tag, i) => (
                                            <span key={i} className="text-xs text-pink-500">#{tag.replace('#', '')}</span>
                                        ))}
                                    </div>
                                </div>
                            </PlatformCard>

                            {/* TikTok Card */}
                            <PlatformCard
                                platform="tiktok"
                                config={platformConfig.tiktok}
                                copiedId={copiedId}
                                onCopy={copyToClipboard}
                                content={result.tiktok.script}
                            >
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Script</p>
                                        <p className="text-sm whitespace-pre-line line-clamp-6">{result.tiktok.script}</p>
                                    </div>
                                    <div className="border-t pt-2">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Alt Hooks</p>
                                        <div className="space-y-1">
                                            {result.tiktok.hooks.map((hook, i) => (
                                                <p key={i} className="text-xs text-muted-foreground">• {hook}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </PlatformCard>

                            {/* YouTube Shorts Card */}
                            <PlatformCard
                                platform="youtubeShorts"
                                config={platformConfig.youtubeShorts}
                                copiedId={copiedId}
                                onCopy={copyToClipboard}
                                content={result.youtubeShorts.script}
                            >
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Title</p>
                                        <p className="text-sm font-medium">{result.youtubeShorts.title}</p>
                                    </div>
                                    <div className="border-t pt-2">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Script</p>
                                        <p className="text-sm whitespace-pre-line line-clamp-6">{result.youtubeShorts.script}</p>
                                    </div>
                                </div>
                            </PlatformCard>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Platform Card Component
function PlatformCard({
    platform,
    config,
    copiedId,
    onCopy,
    content,
    children
}: {
    platform: string
    config: { name: string; icon: React.ElementType; color: string; bg: string }
    copiedId: string | null
    onCopy: (text: string, id: string) => void
    content?: string
    children: React.ReactNode
}) {
    const Icon = config.icon

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg", config.bg)}>
                        <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <span className="font-medium text-sm">{config.name}</span>
                </div>
                {content && (
                    <button
                        onClick={() => onCopy(content, platform)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {copiedId === platform ? (
                            <>
                                <Check className="h-3 w-3 text-green-500" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="h-3 w-3" />
                                Copy
                            </>
                        )}
                    </button>
                )}
            </div>
            {children}
        </motion.div>
    )
}
