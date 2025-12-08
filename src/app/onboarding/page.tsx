'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Sparkles, ArrowRight, ArrowLeft, Loader2, Check,
    Cpu, Film, Briefcase, Heart, Gamepad2, Shirt, BookOpen, UtensilsCrossed, Plane, Newspaper,
    Globe, MapPin,
    Youtube, Instagram, Twitter, Linkedin, PenTool, Video,
    Zap, Flame, Calendar, Target
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

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [industry, setIndustry] = useState('')
    const [location, setLocation] = useState('')
    const [platforms, setPlatforms] = useState<string[]>([])
    const [frequency, setFrequency] = useState('')
    const [animateIn, setAnimateIn] = useState(true)

    useEffect(() => {
        setAnimateIn(true)
        const timer = setTimeout(() => setAnimateIn(false), 500)
        return () => clearTimeout(timer)
    }, [step])

    const togglePlatform = (platformId: string) => {
        setPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(p => p !== platformId)
                : [...prev, platformId]
        )
    }

    const handleComplete = async () => {
        setIsLoading(true)
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
        setAnimateIn(true)
        setTimeout(() => setStep(newStep), 100)
    }

    const canProceed = () => {
        if (step === 1) return !!industry
        if (step === 2) return !!location
        if (step === 3) return platforms.length > 0
        if (step === 4) return !!frequency
        return false
    }

    const stepData = [
        { title: "WHAT'S YOUR NICHE?", subtitle: "We'll show you relevant trends in your field" },
        { title: "WHERE'S YOUR AUDIENCE?", subtitle: "We'll prioritize trends from your target region" },
        { title: "PICK YOUR PLATFORMS", subtitle: "Select all platforms you create content for" },
        { title: "POSTING SCHEDULE", subtitle: "We'll tailor trend urgency to your workflow" },
    ]

    return (
        <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center p-4 font-sans text-black">
            <div className="w-full max-w-2xl">
                {/* Main Card */}
                <div className="bg-[#FFC900] border-4 border-black p-8 relative shadow-[8px_8px_0px_0px_#000]">

                    {/* Header Section */}
                    <div className="text-center mb-8 relative z-10">
                        <div className="w-16 h-16 bg-black border-2 border-white shadow-[4px_4px_0px_0px_#FFF] flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
                            {stepData[step - 1].title}
                        </h1>
                        <p className="text-lg font-bold text-black/70 border-b-2 border-black inline-block pb-1">
                            {stepData[step - 1].subtitle}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-3 mb-8 px-4">
                        {[1, 2, 3, 4].map(s => (
                            <div
                                key={s}
                                onClick={() => s < step && goToStep(s)}
                                className={cn(
                                    "h-3 flex-1 border-2 border-black transition-all duration-300 relative",
                                    s < step ? "cursor-pointer bg-black" : "bg-white",
                                    s === step ? "bg-[#FF90E8]" : ""
                                )}
                            >
                                {s === step && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-black" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className={cn(
                        "bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000] min-h-[300px]",
                        animateIn ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0 transition-all duration-300"
                    )}>
                        {/* Step 1: Industry */}
                        {step === 1 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {INDUSTRIES.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setIndustry(item.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-4 border-2 border-black transition-all text-left group",
                                            industry === item.id
                                                ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                                                : "bg-white hover:bg-[#FF90E8] shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000]"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-2 border-2 border-black flex items-center justify-center",
                                            industry === item.id ? "bg-white text-black" : "bg-gray-100"
                                        )}>
                                            <item.icon size={20} strokeWidth={2.5} />
                                        </div>
                                        <span className="font-bold flex-1">{item.label}</span>
                                        {industry === item.id && <Check size={20} strokeWidth={3} />}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Location */}
                        {step === 2 && (
                            <div className="grid gap-3">
                                {LOCATIONS.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setLocation(item.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-4 border-2 border-black transition-all text-left",
                                            location === item.id
                                                ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                                                : "bg-white hover:bg-[#00F0FF] shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000]"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-2 border-2 border-black flex items-center justify-center",
                                            location === item.id ? "bg-white text-black" : "bg-gray-100"
                                        )}>
                                            {item.id === 'GLOBAL' ? <Globe size={20} strokeWidth={2.5} /> : <MapPin size={20} strokeWidth={2.5} />}
                                        </div>
                                        <span className="font-bold text-lg flex-1">{item.label}</span>
                                        {location === item.id && <Check size={24} strokeWidth={3} />}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Step 3: Platforms */}
                        {step === 3 && (
                            <div className="grid grid-cols-2 gap-3">
                                {PLATFORMS.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => togglePlatform(item.id)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 border-2 border-black transition-all text-center h-full justify-center",
                                            platforms.includes(item.id)
                                                ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                                                : "bg-white hover:bg-[#B1F202] shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000]"
                                        )}
                                    >
                                        <item.icon size={32} strokeWidth={2} />
                                        <span className="font-bold">{item.label}</span>
                                        {platforms.includes(item.id) && (
                                            <div className="absolute top-2 right-2">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Step 4: Frequency */}
                        {step === 4 && (
                            <div className="grid gap-3">
                                {FREQUENCIES.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setFrequency(item.id)}
                                        className={cn(
                                            "flex items-center gap-4 p-4 border-2 border-black transition-all text-left",
                                            frequency === item.id
                                                ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                                                : "bg-white hover:bg-[#FFC900] shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000]"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-3 border-2 border-black flex items-center justify-center",
                                            frequency === item.id ? "bg-white text-black" : "bg-gray-100"
                                        )}>
                                            <item.icon size={24} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-lg">{item.label}</div>
                                            <div className={cn("text-sm font-medium", frequency === item.id ? "text-gray-300" : "text-gray-500")}>
                                                {item.description}
                                            </div>
                                        </div>
                                        {frequency === item.id && <Check size={24} strokeWidth={3} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-4 mt-8">
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
                                "flex-1 px-6 py-4 font-black border-2 border-black transition-all flex items-center justify-center gap-2 uppercase tracking-wide",
                                canProceed()
                                    ? "bg-[#00F0FF] shadow-[4px_4px_0px_0px_#000] hover:bg-[#FF90E8] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000]"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400"
                            )}
                        >
                            {isLoading ? (
                                <><Loader2 className="animate-spin" /> SETUP...</>
                            ) : step === 4 ? (
                                <>LAUNCH DASHBOARD <Sparkles strokeWidth={3} /></>
                            ) : (
                                <>CONTINUE <ArrowRight strokeWidth={3} /></>
                            )}
                        </button>
                    </div>

                    {/* Skip */}
                    <div className="text-center mt-6">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-gray-500 font-bold hover:text-black hover:underline decoration-2"
                        >
                            Skip for now
                        </button>
                    </div>

                    {/* Decorative Elements around main card */}
                    <div className="absolute -top-4 -left-4 w-full h-full border-4 border-black -z-10 bg-white" />
                </div>
            </div>
        </div>
    )
}
