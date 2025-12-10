'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, ArrowRight, ArrowLeft, Loader2, Sparkles, Check, Save,
    Youtube, Instagram, Twitter, Linkedin, PenTool, Video,
    Copy, Play, Zap, Lightbulb, Target, PartyPopper
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types
interface VideoContext {
    id: string
    title: string
    thumbnail: string
    channelTitle: string
    whyViral?: string
    hook?: string
    contentIdea?: string
}

interface ContentIdea {
    title: string
    hook: string
    format: string
    angle: string
    estimatedViews: string
}

interface GeneratedScript {
    title: string
    hook: { text: string; duration: string; delivery: string; visualNote: string }
    sections: Array<{
        title: string
        script: string
        duration: string
        delivery: string
        bRoll: string[]
        camera: string
        graphics: string
    }>
    cta: { text: string; type: string }
    storyboard: Array<{
        scene: number
        duration: string
        visual: string
        audio: string
        camera: string
    }>
    production: {
        musicMood: string
        props: string[]
        location: string
        lighting: string
        outfit: string
    }
    caption: string
    hashtags: string[]
    viralityScore: number
    viralityReason: string
    estimatedViews: string
    bestTimeToPost: string
}

// Avatar colors
const AVATAR_COLORS: Record<string, string> = {
    'pink': '#FF90E8',
    'blue': '#00D4FF',
    'green': '#B1F202',
    'purple': '#A855F7',
    'orange': '#FF8C42',
}

// Platform config
const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#FF90E8', desc: 'Reels & Posts', emoji: '📸' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF4D4D', desc: 'Long-form', emoji: '▶️' },
    { id: 'youtube_shorts', label: 'YT Shorts', icon: Play, color: '#FF6B6B', desc: '60 sec vertical', emoji: '🎬' },
    { id: 'tiktok', label: 'TikTok', icon: Video, color: '#00F0FF', desc: 'Trending', emoji: '🎵' },
    { id: 'blog', label: 'Blog', icon: PenTool, color: '#B1F202', desc: 'Written', emoji: '✍️' },
    { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: '#1DA1F2', desc: 'Threads', emoji: '🐦' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0077B5', desc: 'Professional', emoji: '💼' },
]

// Step messages - Fun and conversational
const STEP_MESSAGES = [
    {
        greeting: "Ooh, nice pick! 🔥",
        message: "I analyzed this video and found some AMAZING content ideas just for you. Pick one that gets you excited!",
        tip: "Pro tip: Click me for a high-five! ✋",
    },
    {
        greeting: "Great choice! 📱",
        message: "Now where are we posting this masterpiece? Each platform needs its own magic touch!",
        tip: "I'll customize the script for your platform!",
    },
    {
        greeting: "Hold tight... 🧙‍♂️",
        message: "I'm cooking up something special! Adding hooks, storyboards, camera angles, and all the good stuff...",
        tip: "This is where the magic happens!",
    },
    {
        greeting: "BOOM! Done! 🎉",
        message: "Your script is ready! It's got viral potential written all over it. Save it or copy individual sections!",
        tip: "Don't forget to give me a high-five! ✋",
    },
]

// ========== TRENDY AVATAR COMPONENT ==========
function TrendyAvatar({
    expression = 'happy',
    isAnimating = false,
    onHighFive,
    avatarColor = 'pink'
}: {
    expression?: 'happy' | 'excited' | 'thinking' | 'celebrating'
    isAnimating?: boolean
    onHighFive?: () => void
    avatarColor?: string
}) {
    const bodyColor = AVATAR_COLORS[avatarColor] || AVATAR_COLORS['pink']
    const avatarRef = useRef<HTMLDivElement>(null)
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
    const [isPanicking, setIsPanicking] = useState(false)
    const [isHighFiving, setIsHighFiving] = useState(false)
    const [isBlinking, setIsBlinking] = useState(false)
    const [isIdle, setIsIdle] = useState(false)
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
    const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const resetIdleTimer = useCallback(() => {
        setIsIdle(false)
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
        if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current)

        idleTimerRef.current = setTimeout(() => {
            setIsIdle(true)
            blinkIntervalRef.current = setInterval(() => {
                setIsBlinking(true)
                setTimeout(() => setIsBlinking(false), 150)
            }, 2000)
        }, 5000)
    }, [])

    const handleClick = () => {
        if (isHighFiving) return
        setIsHighFiving(true)
        onHighFive?.()
        setTimeout(() => setIsHighFiving(false), 800)
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!avatarRef.current) return
            setIsPanicking(false)
            resetIdleTimer()

            const rect = avatarRef.current.getBoundingClientRect()
            const avatarCenterX = rect.left + rect.width / 2
            const avatarCenterY = rect.top + rect.height / 2
            const deltaX = e.clientX - avatarCenterX
            const deltaY = e.clientY - avatarCenterY
            const maxOffset = 6
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
            const scale = Math.min(maxOffset / distance, 1)

            setEyeOffset({
                x: deltaX * scale * 0.15,
                y: deltaY * scale * 0.15
            })
        }

        const handleMouseLeave = () => {
            setIsPanicking(true)
            setEyeOffset({ x: 0, y: 0 })
        }

        window.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseleave', handleMouseLeave)
        resetIdleTimer()

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseleave', handleMouseLeave)
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
            if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current)
        }
    }, [resetIdleTimer])

    const currentExpression = isPanicking ? 'panic' : isHighFiving ? 'highfive' : expression

    const mouthExpressions: Record<string, string> = {
        happy: 'M 8 18 Q 16 24 24 18',
        excited: 'M 8 16 Q 16 26 24 16',
        thinking: 'M 10 18 L 22 20',
        celebrating: 'M 10 16 Q 16 22 22 16',
        panic: 'M 10 20 Q 16 16 22 20',
        highfive: 'M 8 16 Q 16 28 24 16',
    }

    return (
        <motion.div
            ref={avatarRef}
            animate={isHighFiving ? { y: [0, -15, 0], rotate: [0, -10, 10, 0] } : isAnimating ? { y: [0, -10, 0], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: isHighFiving ? 0.4 : 0.5, ease: 'easeInOut' }}
            className="relative cursor-pointer select-none"
            onClick={handleClick}
        >
            {/* High-five hand */}
            <AnimatePresence>
                {isHighFiving && (
                    <motion.div
                        initial={{ opacity: 0, x: -30, y: 20, rotate: -20 }}
                        animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                        exit={{ opacity: 0, x: 30, scale: 0.5 }}
                        className="absolute -right-8 top-4 text-4xl z-20"
                    >
                        ✋
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Body */}
            <div
                className="w-28 h-28 border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-3xl flex items-center justify-center relative overflow-hidden hover:shadow-[8px_8px_0px_0px_#000] transition-shadow"
                style={{ backgroundColor: bodyColor }}
            >
                {/* Sparkle accessory */}
                <motion.div
                    animate={isIdle ? { rotate: [0, 10, -10, 0], y: [0, -2, 0] } : {}}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-[#FFC900] border-2 border-black flex items-center justify-center rounded-full z-10"
                >
                    <Sparkles className="w-3 h-3" />
                </motion.div>

                {/* Face */}
                <svg width="56" height="48" viewBox="0 0 32 26" className="mt-2">
                    {/* Left Eye */}
                    <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                        {isBlinking ? (
                            <line x1="4" y1="9" x2="14" y2="9" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        ) : currentExpression === 'panic' ? (
                            <>
                                <line x1="4" y1="4" x2="12" y2="6" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="9" cy="10" r="5" fill="white" stroke="black" strokeWidth="1.5" />
                                <circle cx="9" cy="10" r="3" fill="black" />
                            </>
                        ) : currentExpression === 'celebrating' || currentExpression === 'highfive' ? (
                            <text x="6" y="12" fontSize="10" fontWeight="bold" fill="black">★</text>
                        ) : (
                            <>
                                <circle cx="9" cy="9" r="5" fill="white" stroke="black" strokeWidth="1.5" />
                                <circle cx={9 + eyeOffset.x * 0.3} cy={9 + eyeOffset.y * 0.3} r="2.5" fill="black" />
                            </>
                        )}
                    </g>

                    {/* Right Eye */}
                    <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                        {isBlinking ? (
                            <line x1="18" y1="9" x2="28" y2="9" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        ) : currentExpression === 'panic' ? (
                            <>
                                <line x1="20" y1="6" x2="28" y2="4" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="23" cy="10" r="5" fill="white" stroke="black" strokeWidth="1.5" />
                                <circle cx="23" cy="10" r="3" fill="black" />
                            </>
                        ) : currentExpression === 'celebrating' || currentExpression === 'highfive' ? (
                            <text x="20" y="12" fontSize="10" fontWeight="bold" fill="black">★</text>
                        ) : (
                            <>
                                <circle cx="23" cy="9" r="5" fill="white" stroke="black" strokeWidth="1.5" />
                                <circle cx={23 + eyeOffset.x * 0.3} cy={9 + eyeOffset.y * 0.3} r="2.5" fill="black" />
                            </>
                        )}
                    </g>

                    {/* Mouth */}
                    <path
                        d={mouthExpressions[currentExpression]}
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Name tag */}
            <motion.div
                animate={isIdle ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-2 bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-wide text-center"
            >
                TRENDY ✨
            </motion.div>
        </motion.div>
    )
}

// ========== DIALOGUE BOX ==========
function DialogueBox({ greeting, message, tip }: { greeting: string; message: string; tip?: string }) {
    const [displayedMessage, setDisplayedMessage] = useState('')
    const [isTyping, setIsTyping] = useState(true)

    useEffect(() => {
        setDisplayedMessage('')
        setIsTyping(true)
        let index = 0
        const interval = setInterval(() => {
            if (index < message.length) {
                setDisplayedMessage(message.slice(0, index + 1))
                index++
            } else {
                setIsTyping(false)
                clearInterval(interval)
            }
        }, 20)
        return () => clearInterval(interval)
    }, [message])

    return (
        <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000] max-w-xs"
        >
            {/* Pointer */}
            <div className="absolute -left-3 top-6 w-0 h-0 border-t-[10px] border-t-transparent border-r-[12px] border-r-black border-b-[10px] border-b-transparent" />
            <div className="absolute -left-2 top-6 w-0 h-0 border-t-[10px] border-t-transparent border-r-[12px] border-r-white border-b-[10px] border-b-transparent" />

            <p className="text-lg font-black mb-2">{greeting}</p>
            <p className="text-sm font-medium text-gray-700 leading-relaxed">
                {displayedMessage}
                {isTyping && <span className="inline-block w-0.5 h-4 bg-black ml-0.5 animate-pulse" />}
            </p>
            {!isTyping && tip && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-xs font-bold text-[#FF90E8] uppercase border-t border-gray-200 pt-2"
                >
                    💡 {tip}
                </motion.p>
            )}
        </motion.div>
    )
}

// ========== MAIN WIZARD COMPONENT ==========
interface ContentWizardProps {
    video: VideoContext
    userIndustry: string
    isOpen: boolean
    onClose: () => void
}

export default function ContentWizard({ video, userIndustry, isOpen, onClose }: ContentWizardProps) {
    const [step, setStep] = useState(1)
    const [ideas, setIdeas] = useState<ContentIdea[]>([])
    const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null)
    const [selectedPlatform, setSelectedPlatform] = useState<string>('')
    const [script, setScript] = useState<GeneratedScript | null>(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)
    const [avatarExpression, setAvatarExpression] = useState<'happy' | 'excited' | 'thinking' | 'celebrating'>('happy')
    const [showConfetti, setShowConfetti] = useState(false)

    // Generate ideas when wizard opens
    useEffect(() => {
        if (isOpen && ideas.length === 0) {
            generateIdeas()
        }
    }, [isOpen])

    const generateIdeas = async () => {
        setLoading(true)
        setAvatarExpression('thinking')
        try {
            const response = await fetch('/api/ai/ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: video.title,
                    videoContext: { title: video.title, whyViral: video.whyViral, hook: video.hook },
                    userIndustry,
                    generateMultiple: true
                })
            })
            const data = await response.json()
            if (data.success && data.ideas?.contentAngles) {
                setIdeas(data.ideas.contentAngles.slice(0, 6))
            } else {
                // Fallback ideas
                setIdeas([
                    { title: `My Take on "${video.title}"`, hook: "You won't believe what I discovered...", format: "Reaction", angle: "Personal", estimatedViews: "10K-50K" },
                    { title: `${video.title} Explained in 60 Seconds`, hook: "Here's everything you need to know...", format: "Explainer", angle: "Educational", estimatedViews: "20K-80K" },
                    { title: `Why ${video.title} is Breaking the Internet`, hook: "Everyone's talking about this...", format: "Commentary", angle: "Trend", estimatedViews: "15K-60K" },
                    { title: `I Tried ${video.title} - Results`, hook: "I tested it so you don't have to...", format: "Challenge", angle: "First-Person", estimatedViews: "25K-100K" },
                    { title: `The Truth About ${video.title}`, hook: "Nobody's talking about this part...", format: "Exposé", angle: "Controversial", estimatedViews: "30K-120K" },
                    { title: `${video.title} for Beginners`, hook: "Here's your complete guide...", format: "Tutorial", angle: "Beginner", estimatedViews: "15K-70K" },
                ])
            }
            setAvatarExpression('excited')
        } catch (error) {
            console.error('Failed to generate ideas:', error)
            setAvatarExpression('happy')
        } finally {
            setLoading(false)
        }
    }

    const generateScript = async () => {
        if (!selectedIdea || !selectedPlatform) return
        setLoading(true)
        setStep(3)
        setAvatarExpression('thinking')

        try {
            const response = await fetch('/api/ai/script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idea: `${selectedIdea.title} - ${selectedIdea.hook}`,
                    platform: selectedPlatform,
                    videoContext: { title: video.title, whyViral: video.whyViral, hook: video.hook },
                    userIndustry
                })
            })
            const data = await response.json()
            if (data.success && data.script) {
                setScript(data.script)
                setStep(4)
                setAvatarExpression('celebrating')
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 3000)
            }
        } catch (error) {
            console.error('Failed to generate script:', error)
        } finally {
            setLoading(false)
        }
    }

    const saveScript = async () => {
        if (!script) return
        setSaving(true)
        try {
            const userResponse = await fetch('/api/auth/session')
            const userData = await userResponse.json()

            await fetch('/api/user/scripts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userData.user?.id || ''
                },
                body: JSON.stringify({
                    title: script.title,
                    platform: selectedPlatform,
                    ideaText: selectedIdea?.title,
                    scriptContent: script,
                    sourceVideoId: video.id,
                    sourceVideoTitle: video.title,
                    sourceVideoThumbnail: video.thumbnail
                })
            })
            setSaved(true)
            setAvatarExpression('celebrating')
        } catch (error) {
            console.error('Failed to save script:', error)
        } finally {
            setSaving(false)
        }
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const getFullScript = () => {
        if (!script) return ''
        let fullScript = `🎣 HOOK:\n${script.hook?.text}\n\n`
        script.sections?.forEach(s => {
            fullScript += `📝 ${s.title}:\n${s.script}\n\n`
        })
        fullScript += `🎯 CTA:\n${script.cta?.text}\n\n`
        fullScript += `📱 CAPTION:\n${script.caption}\n\n`
        fullScript += `#️⃣ HASHTAGS:\n${script.hashtags?.join(' ')}`
        return fullScript
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Confetti */}
                {showConfetti && (
                    <div className="fixed inset-0 pointer-events-none z-[60]">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1 }}
                                animate={{ y: window.innerHeight + 20, rotate: 360 * 3 }}
                                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
                                className="absolute text-2xl"
                            >
                                {['🎉', '✨', '🌟', '💫', '🔥'][Math.floor(Math.random() * 5)]}
                            </motion.div>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-[#F5F5F0] w-full max-w-5xl max-h-[90vh] overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_#000]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-[#FFC900] border-b-4 border-black">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6" />
                            <h2 className="font-black text-lg uppercase">Content Wizard</h2>
                            {/* Progress dots */}
                            <div className="flex gap-1 ml-4">
                                {[1, 2, 3, 4].map((s) => (
                                    <motion.div
                                        key={s}
                                        animate={{ scale: s === step ? [1, 1.2, 1] : 1 }}
                                        transition={{ duration: 0.5, repeat: s === step ? Infinity : 0 }}
                                        className={cn(
                                            "w-8 h-2 border border-black",
                                            s < step ? "bg-[#B1F202]" : s === step ? "bg-black" : "bg-white"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/10 rounded transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col lg:flex-row min-h-[500px] max-h-[calc(90vh-80px)] overflow-hidden">
                        {/* Avatar Section */}
                        <div className="lg:w-80 p-6 bg-white border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col items-center justify-start shrink-0">
                            <TrendyAvatar
                                expression={avatarExpression}
                                isAnimating={loading}
                                onHighFive={() => setAvatarExpression('celebrating')}
                            />

                            <div className="mt-4 w-full">
                                <DialogueBox
                                    greeting={STEP_MESSAGES[step - 1].greeting}
                                    message={STEP_MESSAGES[step - 1].message}
                                    tip={STEP_MESSAGES[step - 1].tip}
                                />
                            </div>

                            {/* Video Context */}
                            <div className="mt-4 w-full">
                                <p className="text-xs font-bold uppercase text-black/50 mb-2">Based on:</p>
                                <div className="flex items-center gap-2 p-2 bg-[#F5F5F0] border-2 border-black">
                                    <img src={video.thumbnail} alt="" className="w-14 h-9 object-cover border border-black" />
                                    <p className="text-xs font-bold line-clamp-2">{video.title}</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {/* STEP 1: Ideas */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="font-black text-xl uppercase flex items-center gap-2">
                                            <Lightbulb className="w-6 h-6 text-[#FFC900]" />
                                            Pick Your Idea
                                        </h3>

                                        {loading ? (
                                            <div className="flex flex-col items-center justify-center py-12">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                >
                                                    <Sparkles className="w-12 h-12 text-[#FF90E8]" />
                                                </motion.div>
                                                <p className="mt-4 font-bold text-lg">Generating amazing ideas...</p>
                                                <p className="text-sm text-black/60">This takes just a few seconds!</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {ideas.map((idea, i) => (
                                                    <motion.button
                                                        key={i}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        whileHover={{ scale: 1.02, y: -4 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => {
                                                            setSelectedIdea(idea)
                                                            setAvatarExpression('excited')
                                                        }}
                                                        className={cn(
                                                            "p-4 text-left border-3 border-black transition-all",
                                                            selectedIdea === idea
                                                                ? "bg-[#FFC900] shadow-[6px_6px_0px_0px_#000]"
                                                                : "bg-white shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]"
                                                        )}
                                                    >
                                                        <div className="flex items-start gap-2 mb-2">
                                                            <span className="text-2xl">{['🎬', '📚', '🔥', '🧪', '💡', '🎯'][i]}</span>
                                                            <p className="font-black text-sm">{idea.title}</p>
                                                        </div>
                                                        <p className="text-xs text-black/60 italic mb-2">"{idea.hook}"</p>
                                                        <div className="flex gap-2">
                                                            <span className="text-xs px-2 py-0.5 bg-[#FF90E8] border border-black font-bold">
                                                                {idea.format}
                                                            </span>
                                                            <span className="text-xs px-2 py-0.5 bg-[#B1F202] border border-black font-bold">
                                                                {idea.estimatedViews}
                                                            </span>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        )}

                                        {selectedIdea && (
                                            <motion.button
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setStep(2)}
                                                className="w-full py-4 bg-black text-white font-black uppercase flex items-center justify-center gap-2 border-3 border-black shadow-[6px_6px_0px_0px_#FFC900] hover:shadow-[4px_4px_0px_0px_#FFC900] transition-all"
                                            >
                                                Next: Choose Platform <ArrowRight className="w-5 h-5" />
                                            </motion.button>
                                        )}
                                    </motion.div>
                                )}

                                {/* STEP 2: Platform */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="font-black text-xl uppercase flex items-center gap-2">
                                            <Target className="w-6 h-6 text-[#00F0FF]" />
                                            Where Are You Posting?
                                        </h3>

                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {PLATFORMS.map((platform, i) => {
                                                const Icon = platform.icon
                                                return (
                                                    <motion.button
                                                        key={platform.id}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        whileHover={{ scale: 1.05, y: -4 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            setSelectedPlatform(platform.id)
                                                            setAvatarExpression('excited')
                                                        }}
                                                        className={cn(
                                                            "p-4 border-3 border-black flex flex-col items-center gap-2 transition-all",
                                                            selectedPlatform === platform.id
                                                                ? "shadow-[6px_6px_0px_0px_#000]"
                                                                : "bg-white shadow-[4px_4px_0px_0px_#000]"
                                                        )}
                                                        style={{
                                                            backgroundColor: selectedPlatform === platform.id ? platform.color : undefined
                                                        }}
                                                    >
                                                        <span className="text-3xl">{platform.emoji}</span>
                                                        <p className="font-black text-sm">{platform.label}</p>
                                                        <p className="text-xs text-black/60">{platform.desc}</p>
                                                    </motion.button>
                                                )
                                            })}
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setStep(1)}
                                                className="px-6 py-3 bg-white border-3 border-black font-black uppercase flex items-center gap-2 shadow-[4px_4px_0px_0px_#000]"
                                            >
                                                <ArrowLeft className="w-5 h-5" /> Back
                                            </motion.button>
                                            {selectedPlatform && (
                                                <motion.button
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={generateScript}
                                                    className="flex-1 py-3 bg-[#B1F202] border-3 border-black font-black uppercase flex items-center justify-center gap-2 shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
                                                >
                                                    <Zap className="w-5 h-5" /> Generate My Script!
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 3: Loading */}
                                {step === 3 && loading && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center py-16"
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            className="w-24 h-24 border-4 border-black rounded-full border-t-[#FF90E8] border-r-[#FFC900] border-b-[#B1F202] border-l-[#00F0FF]"
                                        />
                                        <motion.p
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="mt-6 font-black text-xl"
                                        >
                                            Creating Your Viral Script...
                                        </motion.p>
                                        <p className="text-sm text-black/60 mt-2">Adding hooks, storyboard, camera angles...</p>
                                    </motion.div>
                                )}

                                {/* STEP 4: Script Result */}
                                {step === 4 && script && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        {/* Title & Score */}
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <h3 className="font-black text-xl">{script.title}</h3>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', delay: 0.3 }}
                                                className="px-4 py-2 bg-[#B1F202] border-3 border-black font-black shadow-[4px_4px_0px_0px_#000]"
                                            >
                                                🔥 {script.viralityScore || 85}% Viral Score
                                            </motion.div>
                                        </div>

                                        {/* Hook */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="p-4 bg-[#FFC900] border-3 border-black shadow-[4px_4px_0px_0px_#000]"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-black flex items-center gap-2">🎣 THE HOOK</h4>
                                                <button
                                                    onClick={() => copyToClipboard(script.hook?.text || '', 'hook')}
                                                    className="text-xs px-2 py-1 bg-black text-white font-bold flex items-center gap-1"
                                                >
                                                    {copied === 'hook' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            </div>
                                            <p className="font-bold text-lg">{script.hook?.text}</p>
                                            {script.hook?.visualNote && (
                                                <p className="text-xs mt-2 text-black/70">📹 {script.hook.visualNote}</p>
                                            )}
                                        </motion.div>

                                        {/* Sections */}
                                        {script.sections?.map((section, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + i * 0.1 }}
                                                className="p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000]"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-black text-sm uppercase">{section.title}</h4>
                                                    <span className="text-xs bg-[#F5F5F0] px-2 py-0.5 border border-black">{section.duration}</span>
                                                </div>
                                                <p className="text-sm mb-3">{section.script}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-2 py-0.5 bg-[#FF90E8] border border-black text-xs font-bold">
                                                        🎥 {section.camera}
                                                    </span>
                                                    {section.bRoll?.slice(0, 2).map((b, j) => (
                                                        <span key={j} className="px-2 py-0.5 bg-gray-100 border border-black text-xs">
                                                            📹 {b}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* CTA */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="p-4 bg-[#B1F202] border-3 border-black shadow-[4px_4px_0px_0px_#000]"
                                        >
                                            <h4 className="font-black text-sm mb-1">🎯 CALL TO ACTION</h4>
                                            <p className="font-bold">{script.cta?.text}</p>
                                        </motion.div>

                                        {/* Caption & Hashtags */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000]"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-black text-sm">📝 CAPTION</h4>
                                                <button
                                                    onClick={() => copyToClipboard(script.caption + '\n\n' + script.hashtags?.join(' '), 'caption')}
                                                    className="text-xs px-2 py-1 bg-black text-white font-bold flex items-center gap-1"
                                                >
                                                    {copied === 'caption' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            </div>
                                            <p className="text-sm mb-3">{script.caption}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {script.hashtags?.map((tag, i) => (
                                                    <span key={i} className="text-xs px-2 py-0.5 bg-black text-white">
                                                        {tag.startsWith('#') ? tag : `#${tag}`}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-2">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => copyToClipboard(getFullScript(), 'full')}
                                                className="flex-1 py-3 bg-white border-3 border-black font-black uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000]"
                                            >
                                                {copied === 'full' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                Copy All
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={saveScript}
                                                disabled={saving || saved}
                                                className={cn(
                                                    "flex-1 py-3 border-3 border-black font-black uppercase flex items-center justify-center gap-2 transition-all",
                                                    saved
                                                        ? "bg-[#B1F202]"
                                                        : "bg-[#FFC900] shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000]"
                                                )}
                                            >
                                                {saving ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : saved ? (
                                                    <><PartyPopper className="w-5 h-5" /> Saved!</>
                                                ) : (
                                                    <><Save className="w-5 h-5" /> Save Script</>
                                                )}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
