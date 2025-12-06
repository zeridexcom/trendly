'use client'

import { useState, useEffect } from 'react'
import {
    Sparkles,
    Play,
    ThumbsUp,
    ThumbsDown,
    Edit3,
    Copy,
    Check,
    Loader2,
    Video,
    Clock,
    Zap,
    Brain,
    TrendingUp,
    Music,
    Camera,
    Target,
    ChevronRight,
    RefreshCw,
    Save
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Types
interface ScriptSection {
    title: string
    text: string
    duration: string
    bRoll: string[]
}

interface GeneratedScript {
    id: string
    hook: {
        text: string
        duration: string
        tips: string[]
    }
    content: {
        sections: ScriptSection[]
    }
    cta: {
        text: string
        type: string
        tips: string[]
    }
    bRollSuggestions: string[]
    musicMood: string
    estimatedDuration: string
    viralityScore: number
    metadata: {
        topic: string
        platform: string
        tone: string
        generatedAt: string
    }
}

interface TrainingStats {
    totalScripts: number
    goodScripts: number
    badScripts: number
    editedScripts: number
    improvementScore: number
    learningLevel: string
}

const platforms = [
    { id: 'tiktok', label: 'TikTok', icon: '🎵' },
    { id: 'youtube', label: 'YouTube', icon: '▶️' },
    { id: 'instagram', label: 'Instagram Reels', icon: '📸' },
    { id: 'shorts', label: 'YouTube Shorts', icon: '🎬' },
]

const durations = [
    { id: '15s', label: '15 seconds' },
    { id: '30s', label: '30 seconds' },
    { id: '60s', label: '1 minute' },
    { id: '3min', label: '3 minutes' },
    { id: '10min', label: '10 minutes' },
]

const tones = [
    { id: 'casual', label: 'Casual', desc: 'Friendly, conversational' },
    { id: 'professional', label: 'Professional', desc: 'Authoritative, polished' },
    { id: 'energetic', label: 'Energetic', desc: 'High energy, exciting' },
    { id: 'educational', label: 'Educational', desc: 'Informative, clear' },
    { id: 'storytelling', label: 'Storytelling', desc: 'Narrative, emotional' },
]

export default function ScriptsPage() {
    const [topic, setTopic] = useState('')
    const [platform, setPlatform] = useState('tiktok')
    const [duration, setDuration] = useState('60s')
    const [tone, setTone] = useState('casual')
    const [isGenerating, setIsGenerating] = useState(false)
    const [script, setScript] = useState<GeneratedScript | null>(null)
    const [trainingStats, setTrainingStats] = useState<TrainingStats | null>(null)
    const [copiedSection, setCopiedSection] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedScript, setEditedScript] = useState<GeneratedScript | null>(null)
    const [feedbackSent, setFeedbackSent] = useState<string | null>(null)

    // Fetch training stats on mount
    useEffect(() => {
        fetchTrainingStats()
    }, [])

    const fetchTrainingStats = async () => {
        try {
            const response = await fetch('/api/ai/scripts/feedback')
            const data = await response.json()
            setTrainingStats(data.stats)
        } catch (error) {
            console.error('Failed to fetch training stats:', error)
        }
    }

    const generateScript = async () => {
        if (!topic.trim()) return

        setIsGenerating(true)
        setScript(null)
        setFeedbackSent(null)

        try {
            const response = await fetch('/api/ai/scripts/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, platform, duration, tone })
            })
            const data = await response.json()
            setScript(data)
            setEditedScript(data)
        } catch (error) {
            console.error('Failed to generate script:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    const sendFeedback = async (rating: 'good' | 'bad' | 'edited') => {
        if (!script) return

        try {
            const response = await fetch('/api/ai/scripts/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scriptId: script.id,
                    rating,
                    originalScript: script,
                    editedScript: rating === 'edited' ? editedScript : undefined,
                    editedFields: rating === 'edited' ? ['hook', 'content', 'cta'] : undefined
                })
            })
            const data = await response.json()
            if (data.success) {
                setFeedbackSent(rating)
                fetchTrainingStats()
            }
        } catch (error) {
            console.error('Failed to send feedback:', error)
        }
    }

    const copyToClipboard = (text: string, section: string) => {
        navigator.clipboard.writeText(text)
        setCopiedSection(section)
        setTimeout(() => setCopiedSection(null), 2000)
    }

    const getFullScript = () => {
        if (!script) return ''
        const sections = script.content.sections.map(s => `[${s.title}]\n${s.text}`).join('\n\n')
        return `[HOOK]\n${script.hook.text}\n\n${sections}\n\n[CTA]\n${script.cta.text}`
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Video className="h-8 w-8 text-purple-500" />
                        AI Script Writer
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Generate video scripts that improve with your feedback
                    </p>
                </div>

                {/* Training Stats Badge */}
                {trainingStats && (
                    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl px-4 py-2">
                        <Brain className="h-5 w-5 text-purple-500" />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">AI Training Level:</span>
                                <span className={cn(
                                    "text-xs font-bold px-2 py-0.5 rounded-full",
                                    trainingStats.learningLevel === 'Expert' ? "bg-green-100 text-green-700" :
                                        trainingStats.learningLevel === 'Trained' ? "bg-blue-100 text-blue-700" :
                                            trainingStats.learningLevel === 'Learning' ? "bg-yellow-100 text-yellow-700" :
                                                "bg-gray-100 text-gray-700"
                                )}>
                                    {trainingStats.learningLevel}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                        style={{ width: `${trainingStats.improvementScore}%` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground">{trainingStats.improvementScore}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Input Form */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Script Settings
                        </h3>

                        <div className="space-y-4">
                            {/* Topic */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Topic / Idea</label>
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., 5 productivity tips for entrepreneurs"
                                    className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                />
                            </div>

                            {/* Platform */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Platform</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {platforms.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => setPlatform(p.id)}
                                            className={cn(
                                                "flex items-center gap-2 p-2 rounded-lg border text-sm transition-all",
                                                platform === p.id
                                                    ? "border-primary bg-primary/5 text-foreground"
                                                    : "border-input hover:bg-accent"
                                            )}
                                        >
                                            <span>{p.icon}</span>
                                            <span>{p.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Duration</label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    {durations.map((d) => (
                                        <option key={d.id} value={d.id}>{d.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tone */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Tone</label>
                                <div className="space-y-2">
                                    {tones.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTone(t.id)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-3 rounded-lg border text-left text-sm transition-all",
                                                tone === t.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-input hover:bg-accent"
                                            )}
                                        >
                                            <div>
                                                <p className="font-medium">{t.label}</p>
                                                <p className="text-xs text-muted-foreground">{t.desc}</p>
                                            </div>
                                            {tone === t.id && <Check className="h-4 w-4 text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={generateScript}
                                disabled={isGenerating || !topic.trim()}
                                className="w-full inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 shadow-lg shadow-primary/25"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Generate Script
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Training Dashboard */}
                    {trainingStats && trainingStats.totalScripts > 0 && (
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                Your AI Training Stats
                            </h3>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                                    <p className="text-2xl font-bold text-green-600">{trainingStats.goodScripts}</p>
                                    <p className="text-xs text-muted-foreground">👍 Good</p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                                    <p className="text-2xl font-bold text-red-600">{trainingStats.badScripts}</p>
                                    <p className="text-xs text-muted-foreground">👎 Bad</p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                    <p className="text-2xl font-bold text-blue-600">{trainingStats.editedScripts}</p>
                                    <p className="text-xs text-muted-foreground">✏️ Edited</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-3">
                                The more you rate, the better your scripts become!
                            </p>
                        </div>
                    )}
                </div>

                {/* Generated Script */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {script ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                {/* Script Header */}
                                <div className="rounded-xl border bg-card p-4 shadow-sm">
                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{script.estimatedDuration}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Music className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{script.musicMood}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Zap className={cn(
                                                    "h-4 w-4",
                                                    script.viralityScore >= 80 ? "text-green-500" :
                                                        script.viralityScore >= 60 ? "text-yellow-500" :
                                                            "text-red-500"
                                                )} />
                                                <span className="text-sm font-semibold">{script.viralityScore}% Viral Score</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => copyToClipboard(getFullScript(), 'full')}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border hover:bg-accent transition-colors"
                                            >
                                                {copiedSection === 'full' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                Copy All
                                            </button>
                                            <button
                                                onClick={generateScript}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border hover:bg-accent transition-colors"
                                            >
                                                <RefreshCw className="h-3.5 w-3.5" />
                                                Regenerate
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Hook Section */}
                                <ScriptSection
                                    title="🎣 Hook"
                                    duration={script.hook.duration}
                                    color="from-orange-500 to-red-500"
                                    copiedSection={copiedSection}
                                    onCopy={() => copyToClipboard(script.hook.text, 'hook')}
                                    sectionId="hook"
                                >
                                    <p className="text-lg font-medium">{script.hook.text}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {script.hook.tips.map((tip, i) => (
                                            <span key={i} className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">
                                                💡 {tip}
                                            </span>
                                        ))}
                                    </div>
                                </ScriptSection>

                                {/* Content Sections */}
                                {script.content.sections.map((section, i) => (
                                    <ScriptSection
                                        key={i}
                                        title={`📝 ${section.title}`}
                                        duration={section.duration}
                                        color="from-blue-500 to-purple-500"
                                        copiedSection={copiedSection}
                                        onCopy={() => copyToClipboard(section.text, `content-${i}`)}
                                        sectionId={`content-${i}`}
                                    >
                                        <p className="text-sm whitespace-pre-line">{section.text}</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {section.bRoll.map((b, j) => (
                                                <span key={j} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full flex items-center gap-1">
                                                    <Camera className="h-3 w-3" /> {b}
                                                </span>
                                            ))}
                                        </div>
                                    </ScriptSection>
                                ))}

                                {/* CTA Section */}
                                <ScriptSection
                                    title="🎯 Call to Action"
                                    duration="Last 5s"
                                    color="from-green-500 to-emerald-500"
                                    copiedSection={copiedSection}
                                    onCopy={() => copyToClipboard(script.cta.text, 'cta')}
                                    sectionId="cta"
                                >
                                    <p className="text-lg font-medium">{script.cta.text}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {script.cta.tips.map((tip, i) => (
                                            <span key={i} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                                                💡 {tip}
                                            </span>
                                        ))}
                                    </div>
                                </ScriptSection>

                                {/* Feedback Section */}
                                <div className="rounded-xl border bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5 p-6 shadow-sm">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Brain className="h-5 w-5 text-purple-500" />
                                        Help AI Learn Your Style
                                    </h3>

                                    {feedbackSent ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Check className="h-5 w-5" />
                                            <span>Thanks! AI is learning from your feedback.</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => sendFeedback('good')}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-medium transition-colors"
                                            >
                                                <ThumbsUp className="h-4 w-4" />
                                                This is great!
                                            </button>
                                            <button
                                                onClick={() => sendFeedback('bad')}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium transition-colors"
                                            >
                                                <ThumbsDown className="h-4 w-4" />
                                                Not quite right
                                            </button>
                                            <button
                                                onClick={() => sendFeedback('edited')}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-colors"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                                I edited it
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-xl border bg-card p-12 shadow-sm flex flex-col items-center justify-center text-center min-h-[500px]"
                            >
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <Video className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Generate Your First Script</h3>
                                <p className="text-muted-foreground max-w-md mb-6">
                                    Enter a topic, choose your platform and tone, then let AI create a complete video script with hooks, content sections, and CTAs.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Brain className="h-4 w-4" />
                                    <span>The more you rate scripts, the better they become!</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

// Script Section Component
function ScriptSection({
    title,
    duration,
    color,
    copiedSection,
    onCopy,
    sectionId,
    children
}: {
    title: string
    duration: string
    color: string
    copiedSection: string | null
    onCopy: () => void
    sectionId: string
    children: React.ReactNode
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={cn("w-1 h-8 rounded-full bg-gradient-to-b", color)} />
                    <h4 className="font-semibold">{title}</h4>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{duration}</span>
                </div>
                <button
                    onClick={onCopy}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    {copiedSection === sectionId ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>
            {children}
        </motion.div>
    )
}
