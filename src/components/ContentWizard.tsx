'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
    X, ArrowRight, ArrowLeft, Sparkles, Loader2,
    Youtube, Instagram, Twitter, Linkedin, PenTool, Video,
    Play, Lightbulb, Target, RefreshCw
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

// Platforms with ICONS
const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#FF90E8', desc: 'Reels' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF4D4D', desc: 'Long' },
    { id: 'youtube_shorts', label: 'YT Shorts', icon: Play, color: '#FFC900', desc: '60s' },
    { id: 'tiktok', label: 'TikTok', icon: Video, color: '#00F0FF', desc: 'Viral' },
    { id: 'blog', label: 'Blog', icon: PenTool, color: '#B1F202', desc: 'Article' },
    { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: '#1DA1F2', desc: 'Thread' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0077B5', desc: 'Pro' },
]

// Messages
const STEP_MESSAGES = [
    { greeting: "Let's go! 🔥", message: "I analyzed this video and created content ideas just for YOU. Pick one that excites you!", tip: "Click me for a high-five! ✋" },
    { greeting: "Great pick! 📱", message: "Where are we posting? I'll customize the script for that platform!", tip: "Almost there!" },
]

// ========== TRENDY AVATAR ==========
function TrendyAvatar({ isAnimating = false, onHighFive }: { isAnimating?: boolean; onHighFive?: () => void }) {
    const avatarRef = useRef<HTMLDivElement>(null)
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
    const [isHighFiving, setIsHighFiving] = useState(false)

    const handleClick = () => {
        if (isHighFiving) return
        setIsHighFiving(true)
        onHighFive?.()
        setTimeout(() => setIsHighFiving(false), 600)
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!avatarRef.current) return
            const rect = avatarRef.current.getBoundingClientRect()
            const deltaX = e.clientX - (rect.left + rect.width / 2)
            const deltaY = e.clientY - (rect.top + rect.height / 2)
            const maxOffset = 5
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
            const scale = Math.min(maxOffset / distance, 1)
            setEyeOffset({ x: deltaX * scale * 0.12, y: deltaY * scale * 0.12 })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <motion.div ref={avatarRef} animate={isHighFiving ? { y: [0, -10, 0], rotate: [0, -8, 8, 0] } : isAnimating ? { y: [0, -5, 0] } : {}} transition={{ duration: 0.4, repeat: isAnimating ? Infinity : 0 }} className="relative cursor-pointer" onClick={handleClick}>
            <AnimatePresence>
                {isHighFiving && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute -right-5 top-3 text-2xl z-20">✋</motion.div>}
            </AnimatePresence>
            <div className="w-20 h-20 border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#FF90E8' }}>
                <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFC900] border-2 border-black flex items-center justify-center rounded-full z-10">
                    <Sparkles className="w-2.5 h-2.5" />
                </motion.div>
                <svg width="40" height="34" viewBox="0 0 32 26">
                    <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                        {isHighFiving ? <text x="6" y="12" fontSize="10" fontWeight="bold" fill="black">★</text> : <><circle cx="9" cy="9" r="4" fill="white" stroke="black" strokeWidth="1.5" /><circle cx={9 + eyeOffset.x * 0.3} cy={9 + eyeOffset.y * 0.3} r="2" fill="black" /></>}
                    </g>
                    <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                        {isHighFiving ? <text x="20" y="12" fontSize="10" fontWeight="bold" fill="black">★</text> : <><circle cx="23" cy="9" r="4" fill="white" stroke="black" strokeWidth="1.5" /><circle cx={23 + eyeOffset.x * 0.3} cy={9 + eyeOffset.y * 0.3} r="2" fill="black" /></>}
                    </g>
                    <path d={isHighFiving ? 'M 8 16 Q 16 26 24 16' : 'M 8 18 Q 16 24 24 18'} fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
            <div className="mt-1 bg-black text-white px-2 py-0.5 font-black text-xs uppercase text-center">TRENDY ✨</div>
        </motion.div>
    )
}

// ========== DIALOGUE BOX ==========
function DialogueBox({ greeting, message, tip }: { greeting: string; message: string; tip?: string }) {
    return (
        <div className="relative bg-white border-3 border-black p-3 shadow-[3px_3px_0px_0px_#000] text-left">
            <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-10 border-r-black border-b-8 border-b-transparent" />
            <p className="font-black text-sm mb-1">{greeting}</p>
            <p className="text-xs text-gray-700">{message}</p>
            {tip && <p className="mt-2 text-xs font-bold text-[#FF90E8]">💡 {tip}</p>}
        </div>
    )
}

// ========== MAIN WIZARD ==========
interface ContentWizardProps {
    video: VideoContext
    userIndustry: string
    isOpen: boolean
    onClose: () => void
}

export default function ContentWizard({ video, userIndustry, isOpen, onClose }: ContentWizardProps) {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [ideas, setIdeas] = useState<ContentIdea[]>([])
    const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null)
    const [selectedPlatform, setSelectedPlatform] = useState<string>('')
    const [loadingIdeas, setLoadingIdeas] = useState(false)

    useEffect(() => {
        if (isOpen && ideas.length === 0) {
            generateRelevantIdeas()
        }
    }, [isOpen])

    // Generate AI-powered RELEVANT ideas based on video
    const generateRelevantIdeas = async () => {
        setLoadingIdeas(true)
        try {
            const response = await fetch('/api/ai/ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoTitle: video.title,
                    videoContext: video.whyViral || video.contentIdea || '',
                    userIndustry: userIndustry || 'General',
                    count: 6
                })
            })
            const data = await response.json()

            if (data.success && data.ideas && Array.isArray(data.ideas)) {
                setIdeas(data.ideas)
            } else if (data.ideas?.contentAngles && Array.isArray(data.ideas.contentAngles)) {
                setIdeas(data.ideas.contentAngles.slice(0, 6))
            } else {
                // Generate smart fallbacks based on video title
                generateSmartFallbacks()
            }
        } catch (error) {
            console.error('Failed to generate ideas:', error)
            generateSmartFallbacks()
        } finally {
            setLoadingIdeas(false)
        }
    }

    // Smart fallbacks that analyze video title
    const generateSmartFallbacks = () => {
        const title = video.title.toLowerCase()
        const isNews = title.includes('news') || title.includes('update') || title.includes('breaking') || title.includes('announced')
        const isTech = title.includes('tech') || title.includes('phone') || title.includes('app') || title.includes('ai')
        const isPolitics = title.includes('trump') || title.includes('biden') || title.includes('election') || title.includes('government')
        const isReview = title.includes('review') || title.includes('unboxing') || title.includes('first look')

        let ideas: ContentIdea[] = []

        if (isNews || isPolitics) {
            ideas = [
                { title: `Breaking Down: ${video.title.slice(0, 30)}...`, hook: "Here's what this ACTUALLY means for you...", format: "News Analysis", angle: "Explainer", estimatedViews: "50K-200K" },
                { title: `My HOT TAKE on This News`, hook: "Everyone's missing the REAL story here...", format: "Opinion", angle: "Commentary", estimatedViews: "30K-150K" },
                { title: `5 Things Media Won't Tell You`, hook: "The mainstream narrative is WRONG about this...", format: "Exposé", angle: "Counter-narrative", estimatedViews: "100K-500K" },
                { title: `This Changes EVERYTHING`, hook: "If you're not paying attention to this, you should be...", format: "Alert", angle: "Urgency", estimatedViews: "75K-300K" },
                { title: `What Happens Next?`, hook: "I predicted this would happen, here's what's coming...", format: "Prediction", angle: "Future", estimatedViews: "40K-180K" },
                { title: `The REAL Impact on You`, hook: "Here's how this affects YOUR wallet, job, and life...", format: "Practical", angle: "Personal", estimatedViews: "60K-250K" },
            ]
        } else if (isTech || isReview) {
            ideas = [
                { title: `${video.title.slice(0, 25)} - Honest Review`, hook: "After using this for a week, here's the TRUTH...", format: "Review", angle: "Honest", estimatedViews: "40K-150K" },
                { title: `Should You Actually Buy This?`, hook: "I'll save you money with this one tip...", format: "Buying Guide", angle: "Practical", estimatedViews: "50K-200K" },
                { title: `Hidden Features You're Missing`, hook: "99% of people don't know about THIS...", format: "Tips", angle: "Discovery", estimatedViews: "80K-300K" },
                { title: `Why I'm Switching To This`, hook: "After 5 years, I'm finally making the change...", format: "Personal", angle: "Story", estimatedViews: "35K-120K" },
                { title: `Best vs Worst Features`, hook: "The good, bad, and ugly truth...", format: "Analysis", angle: "Balanced", estimatedViews: "45K-180K" },
                { title: `Comparing to the Competition`, hook: "Here's how it REALLY stacks up...", format: "Comparison", angle: "Versus", estimatedViews: "60K-250K" },
            ]
        } else {
            ideas = [
                { title: `My Reaction to: ${video.title.slice(0, 20)}...`, hook: "I can't believe what I just saw...", format: "Reaction", angle: "Personal", estimatedViews: "30K-100K" },
                { title: `The REAL Story Behind This`, hook: "What they're not telling you...", format: "Deep Dive", angle: "Research", estimatedViews: "50K-180K" },
                { title: `Why This is Going Viral`, hook: "There's a reason everyone's talking about this...", format: "Analysis", angle: "Trend", estimatedViews: "40K-150K" },
                { title: `My Expert Opinion`, hook: "As someone who knows this topic, here's the truth...", format: "Expert Take", angle: "Authority", estimatedViews: "35K-120K" },
                { title: `What This Means For You`, hook: "Here's the practical takeaway...", format: "Practical", angle: "Actionable", estimatedViews: "45K-160K" },
                { title: `The Part Everyone Missed`, hook: "Nobody noticed THIS detail...", format: "Discovery", angle: "Hidden", estimatedViews: "60K-220K" },
            ]
        }

        setIdeas(ideas)
    }

    const handleCreateScript = () => {
        if (!selectedIdea || !selectedPlatform) return

        const params = new URLSearchParams({
            videoId: video.id,
            videoTitle: video.title,
            videoThumbnail: video.thumbnail,
            idea: selectedIdea.title,
            ideaHook: selectedIdea.hook,
            ideaFormat: selectedIdea.format,
            platform: selectedPlatform,
            industry: userIndustry
        })

        onClose()
        router.push(`/dashboard/scripts?${params.toString()}`)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="bg-[#F5F5F0] w-full max-w-3xl max-h-[80vh] overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 bg-[#FFC900] border-b-4 border-black shrink-0">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5" />
                            <h2 className="font-black text-base uppercase">Content Wizard</h2>
                            <div className="flex gap-1 ml-3">
                                {[1, 2].map((s) => (
                                    <div key={s} className={cn("w-8 h-2 border border-black", s < step ? "bg-[#B1F202]" : s === step ? "bg-black" : "bg-white")} />
                                ))}
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-black/10 rounded"><X className="w-5 h-5" /></button>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Left: Avatar */}
                        <div className="w-52 p-4 bg-white border-r-4 border-black flex flex-col items-center shrink-0">
                            <TrendyAvatar isAnimating={loadingIdeas} />
                            <div className="mt-3 w-full">
                                <DialogueBox greeting={STEP_MESSAGES[step - 1].greeting} message={STEP_MESSAGES[step - 1].message} tip={STEP_MESSAGES[step - 1].tip} />
                            </div>
                            <div className="mt-3 w-full">
                                <p className="text-xs font-bold uppercase text-black/50 mb-1">Based on:</p>
                                <div className="flex items-center gap-2 p-2 bg-[#F5F5F0] border-2 border-black">
                                    <img src={video.thumbnail} alt="" className="w-10 h-7 object-cover border border-black" />
                                    <p className="text-xs font-bold line-clamp-2">{video.title.slice(0, 30)}...</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {/* STEP 1: Ideas */}
                                {step === 1 && (
                                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black text-base uppercase flex items-center gap-2">
                                                <Lightbulb className="w-5 h-5 text-[#FFC900]" /> Content Ideas
                                            </h3>
                                            <button onClick={generateRelevantIdeas} disabled={loadingIdeas} className="text-xs px-2 py-1 bg-white border-2 border-black flex items-center gap-1 font-bold">
                                                <RefreshCw className={cn("w-3 h-3", loadingIdeas && "animate-spin")} /> Refresh
                                            </button>
                                        </div>

                                        {loadingIdeas ? (
                                            <div className="flex flex-col items-center py-8">
                                                <Loader2 className="w-10 h-10 animate-spin text-[#FF90E8]" />
                                                <p className="mt-3 font-bold">Analyzing video & generating ideas...</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-3">
                                                {ideas.map((idea, i) => (
                                                    <motion.button
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        onClick={() => setSelectedIdea(idea)}
                                                        className={cn(
                                                            "p-3 text-left border-3 border-black transition-all hover:-translate-y-1",
                                                            selectedIdea === idea
                                                                ? "bg-[#FFC900] shadow-[4px_4px_0px_0px_#000]"
                                                                : "bg-white shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000]"
                                                        )}
                                                    >
                                                        <p className="font-black text-sm mb-1 line-clamp-2">{idea.title}</p>
                                                        <p className="text-xs text-black/60 italic mb-2 line-clamp-1">"{idea.hook}"</p>
                                                        <div className="flex gap-1 flex-wrap">
                                                            <span className="text-xs px-1.5 py-0.5 bg-[#FF90E8] border border-black font-bold">{idea.format}</span>
                                                            <span className="text-xs px-1.5 py-0.5 bg-[#B1F202] border border-black font-bold">{idea.estimatedViews}</span>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        )}

                                        {selectedIdea && !loadingIdeas && (
                                            <motion.button
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                onClick={() => setStep(2)}
                                                className="w-full py-3 bg-black text-white font-black uppercase flex items-center justify-center gap-2 border-3 border-black shadow-[4px_4px_0px_0px_#FFC900] hover:shadow-[2px_2px_0px_0px_#FFC900] transition-all"
                                            >
                                                Next: Choose Platform <ArrowRight className="w-5 h-5" />
                                            </motion.button>
                                        )}
                                    </motion.div>
                                )}

                                {/* STEP 2: Platform */}
                                {step === 2 && (
                                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                                        <h3 className="font-black text-base uppercase flex items-center gap-2">
                                            <Target className="w-5 h-5 text-[#00F0FF]" /> Choose Platform
                                        </h3>

                                        {/* Selected Idea Preview */}
                                        <div className="p-3 bg-[#FFC900]/30 border-2 border-black">
                                            <p className="text-xs font-bold uppercase text-black/50 mb-1">Your Idea:</p>
                                            <p className="font-black text-sm">{selectedIdea?.title}</p>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2">
                                            {PLATFORMS.map((p, i) => {
                                                const Icon = p.icon
                                                return (
                                                    <motion.button
                                                        key={p.id}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.03 }}
                                                        onClick={() => setSelectedPlatform(p.id)}
                                                        className={cn(
                                                            "p-3 border-3 border-black flex flex-col items-center gap-1 transition-all hover:-translate-y-1",
                                                            selectedPlatform === p.id ? "shadow-[4px_4px_0px_0px_#000]" : "bg-white shadow-[3px_3px_0px_0px_#000]"
                                                        )}
                                                        style={{ backgroundColor: selectedPlatform === p.id ? p.color : undefined }}
                                                    >
                                                        <Icon className="w-6 h-6" />
                                                        <p className="font-black text-xs">{p.label}</p>
                                                    </motion.button>
                                                )
                                            })}
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <button onClick={() => setStep(1)} className="px-4 py-2 bg-white border-3 border-black font-black uppercase flex items-center gap-2 shadow-[3px_3px_0px_0px_#000]">
                                                <ArrowLeft className="w-4 h-4" /> Back
                                            </button>
                                            {selectedPlatform && (
                                                <motion.button
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    onClick={handleCreateScript}
                                                    className="flex-1 py-3 bg-[#B1F202] border-3 border-black font-black uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
                                                >
                                                    🚀 Create Script
                                                </motion.button>
                                            )}
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
