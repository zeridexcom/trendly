'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
    X, ArrowRight, ArrowLeft, Sparkles,
    Youtube, Instagram, Twitter, Linkedin, PenTool, Video,
    Play, Lightbulb, Target
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
    estimatedViews: string
}

// Avatar colors
const AVATAR_COLORS: Record<string, string> = { 'pink': '#FF90E8', 'blue': '#00D4FF', 'green': '#B1F202' }

// Platforms with ICONS
const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#FF90E8', desc: 'Reels & Posts' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF4D4D', desc: 'Long-form' },
    { id: 'youtube_shorts', label: 'YT Shorts', icon: Play, color: '#FFC900', desc: '60s vertical' },
    { id: 'tiktok', label: 'TikTok', icon: Video, color: '#00F0FF', desc: 'Trending' },
    { id: 'blog', label: 'Blog', icon: PenTool, color: '#B1F202', desc: 'Articles' },
    { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: '#1DA1F2', desc: 'Threads' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0077B5', desc: 'Professional' },
]

// Messages
const STEP_MESSAGES = [
    { greeting: "Let's go! 🔥", message: "Pick an idea that excites you! I'll help you turn it into a viral script.", tip: "Click me for a high-five! ✋" },
    { greeting: "Great pick! 📱", message: "Where are we posting? I'll customize everything for that platform!", tip: "Almost there!" },
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

    useEffect(() => {
        if (isOpen && ideas.length === 0) {
            // Generate ideas immediately
            setIdeas([
                { title: `My Take on "${video.title.slice(0, 25)}..."`, hook: "You won't believe what I discovered...", format: "Reaction", estimatedViews: "10K-50K" },
                { title: `${video.title.slice(0, 20)} Explained`, hook: "Here's the simple breakdown...", format: "Explainer", estimatedViews: "20K-80K" },
                { title: `Why This is Going Viral`, hook: "Everyone's talking about this...", format: "Commentary", estimatedViews: "15K-60K" },
                { title: `I Tried This - Results`, hook: "I tested it so you don't have to...", format: "Challenge", estimatedViews: "25K-100K" },
                { title: `The Hidden Truth`, hook: "Nobody's telling you this part...", format: "Exposé", estimatedViews: "30K-120K" },
                { title: `Beginner's Complete Guide`, hook: "Everything you need to know...", format: "Tutorial", estimatedViews: "15K-70K" },
            ])
        }
    }, [isOpen, video.title])

    const handleCreateScript = () => {
        if (!selectedIdea || !selectedPlatform) return

        // Build URL params
        const params = new URLSearchParams({
            videoId: video.id,
            videoTitle: video.title,
            videoThumbnail: video.thumbnail,
            idea: selectedIdea.title,
            ideaHook: selectedIdea.hook,
            platform: selectedPlatform,
            industry: userIndustry
        })

        // Close wizard and redirect
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
                    className="bg-[#F5F5F0] w-full max-w-2xl max-h-[70vh] overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col"
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
                        <div className="w-56 p-4 bg-white border-r-4 border-black flex flex-col items-center shrink-0">
                            <TrendyAvatar />
                            <div className="mt-3 w-full">
                                <DialogueBox greeting={STEP_MESSAGES[step - 1].greeting} message={STEP_MESSAGES[step - 1].message} tip={STEP_MESSAGES[step - 1].tip} />
                            </div>
                            <div className="mt-3 w-full">
                                <p className="text-xs font-bold uppercase text-black/50 mb-1">Based on:</p>
                                <div className="flex items-center gap-2 p-2 bg-[#F5F5F0] border-2 border-black">
                                    <img src={video.thumbnail} alt="" className="w-10 h-7 object-cover border border-black" />
                                    <p className="text-xs font-bold line-clamp-2">{video.title.slice(0, 35)}...</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {/* STEP 1: Ideas */}
                                {step === 1 && (
                                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                                        <h3 className="font-black text-lg uppercase flex items-center gap-2">
                                            <Lightbulb className="w-5 h-5 text-[#FFC900]" /> Pick Your Idea
                                        </h3>
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
                                                    <p className="text-xs text-black/60 italic mb-2">"{idea.hook}"</p>
                                                    <div className="flex gap-1">
                                                        <span className="text-xs px-1.5 py-0.5 bg-[#FF90E8] border border-black font-bold">{idea.format}</span>
                                                        <span className="text-xs px-1.5 py-0.5 bg-[#B1F202] border border-black font-bold">{idea.estimatedViews}</span>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                        {selectedIdea && (
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
                                        <h3 className="font-black text-lg uppercase flex items-center gap-2">
                                            <Target className="w-5 h-5 text-[#00F0FF]" /> Choose Platform
                                        </h3>
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
                                                    🚀 Open Script Writer
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
