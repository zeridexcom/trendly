'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sparkles, ArrowRight, ArrowLeft, Loader2, Check,
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

// Trendy Avatar Component with expressions
function TrendyAvatar({ expression = 'happy', isAnimating = false }: { expression?: 'happy' | 'excited' | 'thinking' | 'celebrating', isAnimating?: boolean }) {
    const faces = {
        happy: { eyes: '◠ ◠', mouth: '‿' },
        excited: { eyes: '★ ★', mouth: 'D' },
        thinking: { eyes: '◔ ◔', mouth: '~' },
        celebrating: { eyes: '✦ ✦', mouth: 'O' },
    }

    const face = faces[expression]

    return (
        <motion.div
            animate={isAnimating ? { y: [0, -10, 0], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="relative"
        >
            {/* Body */}
            <div className="w-32 h-32 bg-[#FF90E8] border-4 border-black shadow-[6px_6px_0px_0px_#000] rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                {/* Sparkle accessory */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFC900] border-2 border-black flex items-center justify-center rounded-full">
                    <Sparkles className="w-4 h-4" />
                </div>

                {/* Face */}
                <div className="text-3xl font-black tracking-widest mb-1">{face.eyes}</div>
                <div className="text-2xl font-black">{face.mouth}</div>
            </div>

            {/* Name tag */}
            <div className="mt-3 bg-black text-white px-4 py-1 font-black text-sm uppercase tracking-wide text-center border-2 border-black">
                TRENDY
            </div>
        </motion.div>
    )
}

// Speech Bubble Component
function SpeechBubble({ greeting, message, tip }: { greeting: string, message: string, tip?: string }) {
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
            <p className="text-sm font-medium text-gray-700 leading-relaxed">{message}</p>
            {tip && (
                <p className="mt-3 text-xs font-bold text-[#FF90E8] uppercase border-t border-gray-200 pt-2">
                    💡 {tip}
                </p>
            )}
        </motion.div>
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
        try {
            // Save preferences to API
            await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ industry, location, platforms, frequency }),
            })
            router.push('/dashboard')
            router.refresh()
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

    const handleSelection = (setter: (val: string) => void, value: string) => {
        setter(value)
        animateAvatar('excited')
    }

    return (
        <div className="min-h-screen bg-[#FFC900] flex items-center justify-center p-4 font-sans text-black">
            <div className="w-full max-w-5xl">
                {/* Main Container */}
                <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">

                    {/* Avatar Section - Left Side */}
                    <div className="hidden lg:flex flex-col items-center gap-6 sticky top-8">
                        <TrendyAvatar expression={avatarExpression} isAnimating={isAvatarAnimating} />
                        <AnimatePresence mode="wait">
                            <SpeechBubble
                                key={step}
                                greeting={AVATAR_DIALOGUE[step - 1].greeting}
                                message={AVATAR_DIALOGUE[step - 1].message}
                                tip={AVATAR_DIALOGUE[step - 1].tip}
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
                                                onClick={() => handleSelection(setIndustry, item.id)}
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
        </div>
    )
}
