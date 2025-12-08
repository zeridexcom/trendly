'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sparkles, ArrowRight, ArrowLeft, Loader2, Check, Trophy, PartyPopper,
    Cpu, Film, Briefcase, Heart, Gamepad2, Shirt, BookOpen, UtensilsCrossed, Plane, Newspaper,
    Globe, MapPin,
    Youtube, Instagram, Twitter, Linkedin, PenTool, Video,
    Zap, Flame, Calendar, Target, Rocket
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Step 1: Industry
const INDUSTRIES = [
    { id: 'TECH', label: 'Tech & Startups', icon: Cpu },
    { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Film },
    { id: 'BUSINESS', label: 'Business & Finance', icon: Briefcase },
    { id: 'HEALTH', label: 'Health & Fitness', icon: Heart },
    { id: 'GAMING', label: 'Gaming & Esports', icon: Gamepad2 },
    { id: 'FASHION', label: 'Fashion & Lifestyle', icon: Shirt },
    { id: 'EDUCATION', label: 'Education', icon: BookOpen },
    { id: 'FOOD', label: 'Food & Cooking', icon: UtensilsCrossed },
    { id: 'TRAVEL', label: 'Travel & Adventure', icon: Plane },
    { id: 'NEWS', label: 'News & Current Events', icon: Newspaper },
]

// Industry-specific background colors
const INDUSTRY_COLORS: Record<string, string> = {
    '': '#FFC900', // Default yellow
    'TECH': '#00D4FF', // Cyan/Blue
    'ENTERTAINMENT': '#FF6B6B', // Coral Red
    'BUSINESS': '#4ECDC4', // Teal
    'HEALTH': '#95E1D3', // Mint Green
    'GAMING': '#A855F7', // Purple
    'FASHION': '#FF90E8', // Pink
    'EDUCATION': '#FFD93D', // Golden Yellow
    'FOOD': '#FF8C42', // Orange
    'TRAVEL': '#6BCB77', // Green
    'NEWS': '#748FFC', // Blue Purple
}


// Step 2: Audience Location
const LOCATIONS = [
    { id: 'IN', label: 'India', code: 'IN' },
    { id: 'US', label: 'United States', code: 'US' },
    { id: 'GLOBAL', label: 'Global / Worldwide', code: 'GLOBAL' },
    { id: 'GB', label: 'United Kingdom', code: 'GB' },
    { id: 'OTHER', label: 'Other', code: 'OTHER' },
]

// Step 3: Platforms
const PLATFORMS = [
    { id: 'YOUTUBE', label: 'YouTube', icon: Youtube },
    { id: 'INSTAGRAM', label: 'Instagram', icon: Instagram },
    { id: 'TIKTOK', label: 'TikTok', icon: Video },
    { id: 'TWITTER', label: 'Twitter / X', icon: Twitter },
    { id: 'LINKEDIN', label: 'LinkedIn', icon: Linkedin },
    { id: 'BLOG', label: 'Blog / Website', icon: PenTool },
]

// Step 4: Posting Frequency
const FREQUENCIES = [
    { id: 'DAILY', label: 'Daily', description: 'I post every day', icon: Zap },
    { id: 'FREQUENT', label: '3-4 times/week', description: 'Regular posting schedule', icon: Flame },
    { id: 'WEEKLY', label: 'Weekly', description: 'Once or twice a week', icon: Calendar },
    { id: 'OCCASIONAL', label: 'Occasionally', description: 'When inspiration strikes', icon: Target },
]

// Avatar dialogue for each step
const AVATAR_DIALOGUE = [
    {
        greeting: "Hey there! 👋",
        message: "I'm Trendy, your content assistant. Let me learn about you so I can find trends you'll actually care about!",
        tip: "Pick the niche closest to your content style.",
    },
    {
        greeting: "Nice choice! 🎯",
        message: "Now let's figure out where your audience hangs out. This helps me prioritize trends from their region.",
        tip: "Most of your viewers are probably from here.",
    },
    {
        greeting: "Looking good! 🔥",
        message: "Which platforms are you creating for? I'll tailor content ideas specifically for each one.",
        tip: "Select all that apply - you can change later!",
    },
    {
        greeting: "Almost done! ⚡",
        message: "Last question - how often do you post? This helps me know when to send you urgent trend alerts.",
        tip: "Be honest - we'll adapt to your pace!",
    },
    {
        greeting: "You're all set! 🚀",
        message: "Time to discover your first viral trends. Your personalized dashboard is ready!",
        tip: "",
    },
]

// Trendy Avatar Component with mouse-following eyes, high-five, and idle animations
function TrendyAvatar({ expression = 'happy', isAnimating = false, onHighFive }: {
    expression?: 'happy' | 'excited' | 'thinking' | 'celebrating',
    isAnimating?: boolean,
    onHighFive?: () => void
}) {
    const avatarRef = React.useRef<HTMLDivElement>(null)
    const [eyeOffset, setEyeOffset] = React.useState({ x: 0, y: 0 })
    const [isPanicking, setIsPanicking] = React.useState(false)
    const [isHighFiving, setIsHighFiving] = React.useState(false)
    const [isBlinking, setIsBlinking] = React.useState(false)
    const [isIdle, setIsIdle] = React.useState(false)
    const idleTimerRef = React.useRef<NodeJS.Timeout | null>(null)
    const blinkIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

    // Reset idle timer on any mouse movement
    const resetIdleTimer = React.useCallback(() => {
        setIsIdle(false)
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
        if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current)

        // Start idle timer (5 seconds)
        idleTimerRef.current = setTimeout(() => {
            setIsIdle(true)
            // Start periodic blinking when idle
            blinkIntervalRef.current = setInterval(() => {
                setIsBlinking(true)
                setTimeout(() => setIsBlinking(false), 150)
            }, 2000)
        }, 5000)
    }, [])

    // Handle high-five click
    const handleClick = () => {
        if (isHighFiving) return
        setIsHighFiving(true)
        onHighFive?.()
        setTimeout(() => setIsHighFiving(false), 800)
    }

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!avatarRef.current) return
            setIsPanicking(false)
            resetIdleTimer()

            const rect = avatarRef.current.getBoundingClientRect()
            const avatarCenterX = rect.left + rect.width / 2
            const avatarCenterY = rect.top + rect.height / 2

            // Calculate direction from avatar to mouse
            const deltaX = e.clientX - avatarCenterX
            const deltaY = e.clientY - avatarCenterY

            // Clamp the offset so eyes don't go too far
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

        const handleMouseEnter = () => {
            setIsPanicking(false)
            resetIdleTimer()
        }

        window.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseleave', handleMouseLeave)
        document.addEventListener('mouseenter', handleMouseEnter)
        resetIdleTimer()

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseleave', handleMouseLeave)
            document.removeEventListener('mouseenter', handleMouseEnter)
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
        highfive: 'M 8 16 Q 16 28 24 16', // Big smile for high-five
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
            <div className="w-32 h-32 bg-[#FF90E8] border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-3xl flex items-center justify-center relative overflow-hidden hover:shadow-[8px_8px_0px_0px_#000] transition-shadow">
                {/* Sparkle accessory - bounces when idle */}
                <motion.div
                    animate={isIdle ? { rotate: [0, 10, -10, 0], y: [0, -2, 0] } : {}}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFC900] border-2 border-black flex items-center justify-center rounded-full z-10"
                >
                    <Sparkles className="w-4 h-4" />
                </motion.div>

                {/* Face with SVG */}
                <svg width="64" height="52" viewBox="0 0 32 26" className="mt-2">
                    {/* Left Eye */}
                    <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                        {isBlinking ? (
                            <line x1="4" y1="9" x2="14" y2="9" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        ) : currentExpression === 'panic' ? (
                            <>
                                {/* Worried eyebrow */}
                                <line x1="4" y1="4" x2="12" y2="6" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="9" cy="10" r="5" fill="white" stroke="black" strokeWidth="1.5" />
                                <circle cx="9" cy="10" r="3" fill="black" />
                            </>
                        ) : currentExpression === 'celebrating' ? (
                            <text x="6" y="12" fontSize="10" fontWeight="bold" fill="black">✦</text>
                        ) : currentExpression === 'excited' || currentExpression === 'highfive' ? (
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
                                {/* Worried eyebrow */}
                                <line x1="20" y1="6" x2="28" y2="4" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="23" cy="10" r="5" fill="white" stroke="black" strokeWidth="1.5" />
                                <circle cx="23" cy="10" r="3" fill="black" />
                            </>
                        ) : currentExpression === 'celebrating' ? (
                            <text x="20" y="12" fontSize="10" fontWeight="bold" fill="black">✦</text>
                        ) : currentExpression === 'excited' || currentExpression === 'highfive' ? (
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

            {/* Name tag with hint */}
            <div className="mt-3 bg-black text-white px-4 py-1 font-black text-sm uppercase tracking-wide text-center border-2 border-black">
                {isHighFiving ? '🙌 HIGH FIVE!' : 'TRENDY'}
            </div>

            {/* Click me hint when idle */}
            {isIdle && !isHighFiving && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-center mt-2 text-gray-500 font-bold"
                >
                    Click me! 👆
                </motion.p>
            )}
        </motion.div>
    )
}




// Speech Bubble Component with Typewriter Effect
function SpeechBubble({ greeting, message, tip, onTyping }: {
    greeting: string,
    message: string,
    tip?: string,
    onTyping?: (isTyping: boolean) => void
}) {
    const [displayedMessage, setDisplayedMessage] = React.useState('')
    const [isTyping, setIsTyping] = React.useState(true)

    React.useEffect(() => {
        // Reset and start typing when message changes
        setDisplayedMessage('')
        setIsTyping(true)
        onTyping?.(true)

        let index = 0
        const interval = setInterval(() => {
            if (index < message.length) {
                setDisplayedMessage(message.slice(0, index + 1))
                index++
            } else {
                setIsTyping(false)
                onTyping?.(false)
                clearInterval(interval)
            }
        }, 25) // Type speed

        return () => {
            clearInterval(interval)
            onTyping?.(false)
        }
    }, [message, onTyping])

    return (
        <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white border-3 border-black p-5 shadow-[4px_4px_0px_0px_#000] max-w-xs"
        >
            {/* Pointer */}
            <div className="absolute -left-3 top-6 w-0 h-0 border-t-[10px] border-t-transparent border-r-[12px] border-r-black border-b-[10px] border-b-transparent" />
            <div className="absolute -left-2 top-6 w-0 h-0 border-t-[10px] border-t-transparent border-r-[12px] border-r-white border-b-[10px] border-b-transparent" />

            <p className="text-xl font-black mb-2">{greeting}</p>
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

// Sparkle Trail Component - follows cursor with magical sparkles
function SparkleTrail({ color = '#FFC900' }: { color?: string }) {
    const [sparkles, setSparkles] = React.useState<Array<{ id: number, x: number, y: number }>>([])
    const idCounter = React.useRef(0)
    const lastSparkleTime = React.useRef(0)

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now()
            // Throttle sparkle creation (every 50ms)
            if (now - lastSparkleTime.current < 50) return
            lastSparkleTime.current = now

            const newSparkle = {
                id: idCounter.current++,
                x: e.clientX,
                y: e.clientY,
            }

            setSparkles(prev => [...prev.slice(-15), newSparkle]) // Keep last 15 sparkles
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Clean up old sparkles
    React.useEffect(() => {
        const cleanup = setInterval(() => {
            setSparkles(prev => prev.slice(-10))
        }, 500)
        return () => clearInterval(cleanup)
    }, [])

    const sparkleSymbols = ['✦', '✧', '⋆', '✴', '✵']

    return (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            <AnimatePresence>
                {sparkles.map((sparkle, index) => (
                    <motion.div
                        key={sparkle.id}
                        initial={{
                            opacity: 1,
                            scale: 1,
                            x: sparkle.x,
                            y: sparkle.y,
                        }}
                        animate={{
                            opacity: 0,
                            scale: 0,
                            y: sparkle.y - 30,
                            rotate: 180,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{
                            position: 'absolute',
                            color: color,
                            fontSize: 12 + (index % 3) * 4,
                            textShadow: `0 0 10px ${color}`,
                        }}
                    >
                        {sparkleSymbols[index % sparkleSymbols.length]}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

// Achievement Badge Popup Component
function AchievementBadge({ title, description, show, onHide }: { title: string, description: string, show: boolean, onHide: () => void }) {
    React.useEffect(() => {
        if (show) {
            const timer = setTimeout(onHide, 2500)
            return () => clearTimeout(timer)
        }
    }, [show, onHide])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="bg-[#FFC900] border-4 border-black px-6 py-4 shadow-[6px_6px_0px_0px_#000] flex items-center gap-4">
                        <div className="w-12 h-12 bg-black flex items-center justify-center rounded-full">
                            <Trophy className="w-6 h-6 text-[#FFC900]" />
                        </div>
                        <div>
                            <p className="font-black text-lg uppercase">{title}</p>
                            <p className="font-bold text-sm text-black/70">{description}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Confetti Component
function Confetti({ active }: { active: boolean }) {
    const colors = ['#FF90E8', '#FFC900', '#00F0FF', '#B1F202', '#FF4D4D']
    const confettiCount = 50

    if (!active) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: confettiCount }).map((_, i) => {
                const color = colors[i % colors.length]
                const left = Math.random() * 100
                const delay = Math.random() * 0.5
                const size = Math.random() * 10 + 5
                const rotation = Math.random() * 360

                return (
                    <motion.div
                        key={i}
                        initial={{
                            y: -20,
                            x: `${left}vw`,
                            rotate: rotation,
                            opacity: 1
                        }}
                        animate={{
                            y: '100vh',
                            rotate: rotation + 360,
                            opacity: 0
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            delay,
                            ease: 'linear'
                        }}
                        style={{
                            position: 'absolute',
                            width: size,
                            height: size * 0.6,
                            backgroundColor: color,
                            borderRadius: '2px',
                        }}
                    />
                )
            })}
        </div>
    )
}

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [industry, setIndustry] = useState('')
    const [location, setLocation] = useState('')
    const [platforms, setPlatforms] = useState<string[]>([])
    const [frequency, setFrequency] = useState('')
    const [avatarExpression, setAvatarExpression] = useState<'happy' | 'excited' | 'thinking' | 'celebrating'>('happy')
    const [isAvatarAnimating, setIsAvatarAnimating] = useState(false)

    // Achievement badges state
    const [showAchievement, setShowAchievement] = useState(false)
    const [achievementData, setAchievementData] = useState({ title: '', description: '' })
    const [earnedBadges, setEarnedBadges] = useState<string[]>([])

    // Confetti state
    const [showConfetti, setShowConfetti] = useState(false)

    // Talking state for typewriter effect
    const [isTalking, setIsTalking] = useState(false)

    // Show achievement badge
    const triggerAchievement = (id: string, title: string, description: string) => {
        if (earnedBadges.includes(id)) return // Don't show same badge twice
        setEarnedBadges(prev => [...prev, id])
        setAchievementData({ title, description })
        setShowAchievement(true)
    }

    // Animate avatar on selection
    const animateAvatar = (expression: 'happy' | 'excited' | 'thinking' | 'celebrating' = 'excited') => {
        setAvatarExpression(expression)
        setIsAvatarAnimating(true)
        setTimeout(() => setIsAvatarAnimating(false), 500)
    }

    useEffect(() => {
        // Reset expression when step changes
        if (step === 5) {
            setAvatarExpression('celebrating')
        } else {
            setAvatarExpression('happy')
        }
    }, [step])

    const togglePlatform = (platformId: string) => {
        setPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(p => p !== platformId)
                : [...prev, platformId]
        )
        animateAvatar('excited')
    }

    const handleComplete = async () => {
        setIsLoading(true)
        animateAvatar('celebrating')
        setShowConfetti(true) // 🎉 Confetti explosion!

        try {
            // Save preferences to API
            await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ industry, location, platforms, frequency }),
            })
            // Delay redirect so user can see confetti
            setTimeout(() => {
                router.push('/dashboard')
                router.refresh()
            }, 1500)
        } catch (error) {
            console.error('Error:', error)
            router.push('/dashboard')
        } finally {
            setIsLoading(false)
        }
    }

    const goToStep = (newStep: number) => {
        animateAvatar('thinking')
        setTimeout(() => {
            setStep(newStep)
            setAvatarExpression('happy')
        }, 200)
    }

    const canProceed = () => {
        if (step === 1) return !!industry
        if (step === 2) return !!location
        if (step === 3) return platforms.length > 0
        if (step === 4) return !!frequency
        return false
    }

    const handleSelection = (setter: (val: string) => void, value: string, badgeId?: string, badgeTitle?: string, badgeDesc?: string) => {
        setter(value)
        animateAvatar('excited')
        // Trigger achievement on first selection
        if (badgeId && badgeTitle && badgeDesc) {
            triggerAchievement(badgeId, badgeTitle, badgeDesc)
        }
    }

    // Get current background color based on industry
    const bgColor = INDUSTRY_COLORS[industry] || INDUSTRY_COLORS['']

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center p-4 font-sans text-black transition-colors duration-500"
            animate={{ backgroundColor: bgColor }}
            transition={{ duration: 0.5 }}
        >
            {/* Sparkle Trail */}
            <SparkleTrail color={industry ? '#FFFFFF' : '#000000'} />

            <div className="w-full max-w-5xl">
                {/* Main Container */}
                <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">

                    {/* Avatar Section - Left Side */}
                    <div className="hidden lg:flex flex-col items-center gap-6 sticky top-8">
                        <TrendyAvatar
                            expression={isTalking ? 'excited' : avatarExpression}
                            isAnimating={isAvatarAnimating}
                            onHighFive={() => triggerAchievement('high_five', '🙌 High Five!', 'You made a friend!')}
                        />
                        <AnimatePresence mode="wait">
                            <SpeechBubble
                                key={step}
                                greeting={AVATAR_DIALOGUE[step - 1].greeting}
                                message={AVATAR_DIALOGUE[step - 1].message}
                                tip={AVATAR_DIALOGUE[step - 1].tip}
                                onTyping={setIsTalking}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Form Section - Right Side */}
                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000]">

                        {/* Mobile Avatar (shows on small screens) */}
                        <div className="lg:hidden flex items-center gap-4 mb-6 pb-6 border-b-2 border-black">
                            <div className="w-16 h-16 bg-[#FF90E8] border-2 border-black rounded-xl flex items-center justify-center">
                                <span className="text-lg">◠‿◠</span>
                            </div>
                            <div>
                                <p className="font-black text-lg">{AVATAR_DIALOGUE[step - 1].greeting}</p>
                                <p className="text-sm text-gray-600">{AVATAR_DIALOGUE[step - 1].message}</p>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center justify-between mb-8">
                            <span className="font-black uppercase text-sm tracking-wide">Step {step} of 4</span>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(s => (
                                    <div
                                        key={s}
                                        className={cn(
                                            "w-10 h-2 border-2 border-black transition-all",
                                            s < step ? "bg-black" : s === step ? "bg-[#FF90E8]" : "bg-white"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Step Title */}
                        <h1 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter mb-8">
                            {step === 1 && "What's Your Niche?"}
                            {step === 2 && "Where's Your Audience?"}
                            {step === 3 && "Pick Your Platforms"}
                            {step === 4 && "Posting Schedule"}
                        </h1>

                        {/* Content Area */}
                        <div className="min-h-[320px]">
                            <AnimatePresence mode="wait">
                                {/* Step 1: Industry */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="grid grid-cols-2 gap-3"
                                    >
                                        {INDUSTRIES.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSelection(setIndustry, item.id, 'first_choice', '🏆 First Choice!', 'You picked your niche')}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 border-2 border-black transition-all text-left",
                                                    industry === item.id
                                                        ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                                                        : "bg-white hover:bg-[#FF90E8] shadow-[3px_3px_0px_0px_#000]"
                                                )}
                                            >
                                                <div className={cn(
                                                    "p-2 border-2 border-current",
                                                    industry === item.id ? "bg-white text-black" : ""
                                                )}>
                                                    <item.icon size={18} strokeWidth={2.5} />
                                                </div>
                                                <span className="font-bold text-sm">{item.label}</span>
                                                {industry === item.id && <Check size={18} className="ml-auto" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Step 2: Location */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="grid gap-3"
                                    >
                                        {LOCATIONS.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSelection(setLocation, item.id)}
                                                className={cn(
                                                    "flex items-center gap-4 p-4 border-2 border-black transition-all text-left",
                                                    location === item.id
                                                        ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                                                        : "bg-white hover:bg-[#00F0FF] shadow-[4px_4px_0px_0px_#000]"
                                                )}
                                            >
                                                <div className={cn(
                                                    "p-3 border-2 border-current",
                                                    location === item.id ? "bg-white text-black" : ""
                                                )}>
                                                    {item.id === 'GLOBAL' ? <Globe size={24} /> : <MapPin size={24} />}
                                                </div>
                                                <span className="font-bold text-lg">{item.label}</span>
                                                {location === item.id && <Check size={24} className="ml-auto" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Step 3: Platforms */}
                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="grid grid-cols-2 lg:grid-cols-3 gap-3"
                                    >
                                        {PLATFORMS.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => togglePlatform(item.id)}
                                                className={cn(
                                                    "flex flex-col items-center gap-3 p-5 border-2 border-black transition-all",
                                                    platforms.includes(item.id)
                                                        ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                                                        : "bg-white hover:bg-[#B1F202] shadow-[4px_4px_0px_0px_#000]"
                                                )}
                                            >
                                                <item.icon size={36} strokeWidth={1.5} />
                                                <span className="font-bold">{item.label}</span>
                                                {platforms.includes(item.id) && <Check size={20} />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Step 4: Frequency */}
                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="grid gap-3"
                                    >
                                        {FREQUENCIES.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSelection(setFrequency, item.id)}
                                                className={cn(
                                                    "flex items-center gap-4 p-4 border-2 border-black transition-all text-left",
                                                    frequency === item.id
                                                        ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                                                        : "bg-white hover:bg-[#FFC900] shadow-[4px_4px_0px_0px_#000]"
                                                )}
                                            >
                                                <div className={cn(
                                                    "p-3 border-2 border-current",
                                                    frequency === item.id ? "bg-white text-black" : ""
                                                )}>
                                                    <item.icon size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-lg">{item.label}</div>
                                                    <div className={cn("text-sm", frequency === item.id ? "text-gray-400" : "text-gray-500")}>
                                                        {item.description}
                                                    </div>
                                                </div>
                                                {frequency === item.id && <Check size={24} />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-4 mt-8 pt-6 border-t-2 border-black">
                            {step > 1 && (
                                <button
                                    onClick={() => goToStep(step - 1)}
                                    className="px-6 py-4 font-bold border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
                                >
                                    <ArrowLeft size={20} strokeWidth={3} /> BACK
                                </button>
                            )}
                            <button
                                onClick={step === 4 ? handleComplete : () => goToStep(step + 1)}
                                disabled={!canProceed() || isLoading}
                                className={cn(
                                    "flex-1 px-6 py-4 font-black border-2 border-black transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-lg",
                                    canProceed()
                                        ? "bg-[#00F0FF] shadow-[4px_4px_0px_0px_#000] hover:bg-[#FF90E8] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000]"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400"
                                )}
                            >
                                {isLoading ? (
                                    <><Loader2 className="animate-spin" /> Setting up...</>
                                ) : step === 4 ? (
                                    <><Rocket strokeWidth={2.5} /> LAUNCH DASHBOARD</>
                                ) : (
                                    <>CONTINUE <ArrowRight strokeWidth={3} /></>
                                )}
                            </button>
                        </div>

                        {/* Skip */}
                        <div className="text-center mt-6">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="text-gray-400 font-bold hover:text-black hover:underline decoration-2 transition-colors"
                            >
                                Skip for now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gamification Components */}
            <Confetti active={showConfetti} />
            <AchievementBadge
                title={achievementData.title}
                description={achievementData.description}
                show={showAchievement}
                onHide={() => setShowAchievement(false)}
            />
        </motion.div>
    )
}
