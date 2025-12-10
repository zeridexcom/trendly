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

// Platform config with ICONS (matching theme)
const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#FF90E8', desc: 'Reels & Posts' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF4D4D', desc: 'Long-form videos' },
    { id: 'youtube_shorts', label: 'YT Shorts', icon: Play, color: '#FFC900', desc: '60 sec vertical' },
    { id: 'tiktok', label: 'TikTok', icon: Video, color: '#00F0FF', desc: 'Trending content' },
    { id: 'blog', label: 'Blog', icon: PenTool, color: '#B1F202', desc: 'Written articles' },
    { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: '#1DA1F2', desc: 'Threads & posts' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0077B5', desc: 'Professional' },
]

// Step messages
const STEP_MESSAGES = [
    { greeting: "Ooh, nice pick! 🔥", message: "I analyzed this video and found some AMAZING content ideas. Pick one!", tip: "Click me for a high-five! ✋" },
    { greeting: "Great choice! 📱", message: "Where are we posting this masterpiece?", tip: "I'll customize the script for your platform!" },
    { greeting: "Cooking... 🧙‍♂️", message: "Adding hooks, storyboards, camera angles...", tip: "This is where the magic happens!" },
    { greeting: "BOOM! Done! 🎉", message: "Your script is ready to film!", tip: "Save it or copy sections!" },
]

// ========== TRENDY AVATAR ==========
function TrendyAvatar({ expression = 'happy', isAnimating = false, onHighFive, avatarColor = 'pink' }: {
    expression?: 'happy' | 'excited' | 'thinking' | 'celebrating'
    isAnimating?: boolean
    onHighFive?: () => void
    avatarColor?: string
}) {
    const bodyColor = AVATAR_COLORS[avatarColor] || AVATAR_COLORS['pink']
    const avatarRef = useRef<HTMLDivElement>(null)
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
    const [isHighFiving, setIsHighFiving] = useState(false)
    const [isBlinking, setIsBlinking] = useState(false)

    const handleClick = () => {
        if (isHighFiving) return
        setIsHighFiving(true)
        onHighFive?.()
        setTimeout(() => setIsHighFiving(false), 800)
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!avatarRef.current) return
            const rect = avatarRef.current.getBoundingClientRect()
            const deltaX = e.clientX - (rect.left + rect.width / 2)
            const deltaY = e.clientY - (rect.top + rect.height / 2)
            const maxOffset = 6
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
            const scale = Math.min(maxOffset / distance, 1)
            setEyeOffset({ x: deltaX * scale * 0.15, y: deltaY * scale * 0.15 })
        }

        const blinkInterval = setInterval(() => {
            setIsBlinking(true)
            setTimeout(() => setIsBlinking(false), 150)
        }, 3000)

        window.addEventListener('mousemove', handleMouseMove)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            clearInterval(blinkInterval)
        }
    }, [])

    const currentExpression = isHighFiving ? 'highfive' : expression
    const mouthExpressions: Record<string, string> = {
        happy: 'M 8 18 Q 16 24 24 18',
        excited: 'M 8 16 Q 16 26 24 16',
        thinking: 'M 10 18 L 22 20',
        celebrating: 'M 10 16 Q 16 22 22 16',
        highfive: 'M 8 16 Q 16 28 24 16',
    }

    return (
        <motion.div
            ref={avatarRef}
            animate={isHighFiving ? { y: [0, -15, 0], rotate: [0, -10, 10, 0] } : isAnimating ? { y: [0, -8, 0] } : {}}
            transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
            className="relative cursor-pointer select-none"
            onClick={handleClick}
        >
            <AnimatePresence>
                {isHighFiving && (
                    <motion.div
                        initial={{ opacity: 0, x: -30, rotate: -20 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        className="absolute -right-6 top-4 text-3xl z-20"
                    >✋</motion.div>
                )}
            </AnimatePresence>

            <div className="w-24 h-24 border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: bodyColor }}>
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-1 -right-1 w-6 h-6 bg-[#FFC900] border-2 border-black flex items-center justify-center rounded-full z-10">
                    <Sparkles className="w-3 h-3" />
                </motion.div>

                <svg width="48" height="40" viewBox="0 0 32 26">
                    <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                        {isBlinking ? <line x1="4" y1="9" x2="14" y2="9" stroke="black" strokeWidth="2" strokeLinecap="round" /> : currentExpression === 'celebrating' || currentExpression === 'highfive' ? <text x="6" y="12" fontSize="10" fontWeight="bold" fill="black">★</text> : <><circle cx="9" cy="9" r="4" fill="white" stroke="black" strokeWidth="1.5" /><circle cx={9 + eyeOffset.x * 0.3} cy={9 + eyeOffset.y * 0.3} r="2" fill="black" /></>}
                    </g>
                    <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                        {isBlinking ? <line x1="18" y1="9" x2="28" y2="9" stroke="black" strokeWidth="2" strokeLinecap="round" /> : currentExpression === 'celebrating' || currentExpression === 'highfive' ? <text x="20" y="12" fontSize="10" fontWeight="bold" fill="black">★</text> : <><circle cx="23" cy="9" r="4" fill="white" stroke="black" strokeWidth="1.5" /><circle cx={23 + eyeOffset.x * 0.3} cy={9 + eyeOffset.y * 0.3} r="2" fill="black" /></>}
                    </g>
                    <path d={mouthExpressions[currentExpression]} fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
            <div className="mt-2 bg-black text-white px-3 py-1 font-black text-xs uppercase text-center">TRENDY ✨</div>
        </motion.div>
    )
}

// ========== DIALOGUE BOX ==========
function DialogueBox({ greeting, message, tip }: { greeting: string; message: string; tip?: string }) {
    const [displayed, setDisplayed] = useState('')
    const [done, setDone] = useState(false)

    useEffect(() => {
        setDisplayed('')
        setDone(false)
        let i = 0
        const interval = setInterval(() => {
            if (i < message.length) { setDisplayed(message.slice(0, i + 1)); i++ }
            else { setDone(true); clearInterval(interval) }
        }, 18)
        return () => clearInterval(interval)
    }, [message])

    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white border-3 border-black p-3 shadow-[3px_3px_0px_0px_#000] text-left">
            <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-10 border-r-black border-b-8 border-b-transparent" />
            <p className="font-black text-base mb-1">{greeting}</p>
            <p className="text-xs text-gray-700">{displayed}{!done && <span className="inline-block w-0.5 h-3 bg-black ml-0.5 animate-pulse" />}</p>
            {done && tip && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs font-bold text-[#FF90E8]">💡 {tip}</motion.p>}
        </motion.div>
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
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && ideas.length === 0) generateIdeas()
    }, [isOpen])

    const generateIdeas = async () => {
        setLoading(true)
        setAvatarExpression('thinking')
        // Fallback ideas immediately
        const fallbackIdeas: ContentIdea[] = [
            { title: `My Take on "${video.title.slice(0, 30)}..."`, hook: "You won't believe what I discovered...", format: "Reaction", angle: "Personal", estimatedViews: "10K-50K" },
            { title: `${video.title.slice(0, 25)} Explained`, hook: "Here's everything you need to know...", format: "Explainer", angle: "Educational", estimatedViews: "20K-80K" },
            { title: `Why This is Breaking the Internet`, hook: "Everyone's talking about this...", format: "Commentary", angle: "Trend", estimatedViews: "15K-60K" },
            { title: `I Tried This - Here's What Happened`, hook: "I tested it so you don't have to...", format: "Challenge", angle: "First-Person", estimatedViews: "25K-100K" },
            { title: `The Truth Nobody Tells You`, hook: "Nobody's talking about this part...", format: "Exposé", angle: "Controversial", estimatedViews: "30K-120K" },
            { title: `Complete Beginner's Guide`, hook: "Here's your complete guide...", format: "Tutorial", angle: "Beginner", estimatedViews: "15K-70K" },
        ]
        setIdeas(fallbackIdeas)
        setLoading(false)
        setAvatarExpression('excited')
    }

    const generateScript = async () => {
        if (!selectedIdea || !selectedPlatform) return
        setLoading(true)
        setStep(3)
        setAvatarExpression('thinking')
        setError(null)

        try {
            const response = await fetch('/api/ai/script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idea: `${selectedIdea.title} - ${selectedIdea.hook}`,
                    platform: selectedPlatform,
                    videoContext: { title: video.title, whyViral: video.whyViral || 'High engagement', hook: video.hook || 'Compelling opening' },
                    userIndustry: userIndustry || 'General'
                })
            })
            const data = await response.json()
            console.log('Script API response:', data)

            if (data.success && data.script) {
                setScript(data.script)
                setStep(4)
                setAvatarExpression('celebrating')
            } else {
                setError(data.error || 'Script generation failed')
                // Create fallback script
                setScript({
                    title: selectedIdea.title,
                    hook: { text: selectedIdea.hook, duration: '0-3s', delivery: 'Energetic', visualNote: 'Close-up face shot' },
                    sections: [
                        { title: 'Introduction', script: `Hey everyone! Today we're talking about ${video.title}. This is going to be good!`, duration: '5-10s', delivery: 'Friendly', bRoll: ['B-roll of topic'], camera: 'Medium shot', graphics: 'Title overlay' },
                        { title: 'Main Content', script: `Here's the thing about this topic that most people miss. Let me break it down for you step by step so you can understand exactly what's happening here.`, duration: '30-45s', delivery: 'Engaging', bRoll: ['Demonstration footage'], camera: 'Various angles', graphics: 'Key points' },
                        { title: 'Conclusion', script: `And that's the complete breakdown! If you found this helpful, make sure to save this for later.`, duration: '5-10s', delivery: 'Enthusiastic', bRoll: ['Summary visuals'], camera: 'Close-up', graphics: 'CTA overlay' },
                    ],
                    cta: { text: 'Follow for more content like this! Drop a comment below with your thoughts.', type: 'follow' },
                    production: { musicMood: 'Upbeat trending', props: ['Ring light', 'Phone/Camera'], location: 'Well-lit indoor', lighting: 'Soft front lighting', outfit: 'Casual but presentable' },
                    caption: `🔥 ${selectedIdea.title}\n\nThis is something everyone needs to know about!\n\nSave this for later 📌`,
                    hashtags: ['viral', 'trending', 'fyp', 'foryou', 'tips', userIndustry?.toLowerCase() || 'content'],
                    viralityScore: 78,
                    viralityReason: 'Engaging hook with clear value proposition',
                    estimatedViews: selectedIdea.estimatedViews,
                    bestTimeToPost: '6-9 PM local time'
                })
                setStep(4)
                setAvatarExpression('celebrating')
            }
        } catch (err: any) {
            console.error('Script generation error:', err)
            setError(err.message)
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
                headers: { 'Content-Type': 'application/json', 'x-user-id': userData.user?.id || '' },
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
        } catch (err) { console.error('Save failed:', err) }
        finally { setSaving(false) }
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const getFullScript = () => {
        if (!script) return ''
        let full = `🎣 HOOK:\n${script.hook?.text}\n\n`
        script.sections?.forEach(s => { full += `📝 ${s.title}:\n${s.script}\n\n` })
        full += `🎯 CTA:\n${script.cta?.text}\n\n📱 CAPTION:\n${script.caption}\n\n#️⃣ ${script.hashtags?.join(' ')}`
        return full
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-[#F5F5F0] w-full max-w-6xl h-[90vh] overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 bg-[#FFC900] border-b-4 border-black shrink-0">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5" />
                            <h2 className="font-black text-base uppercase">Content Wizard</h2>
                            <div className="flex gap-1 ml-3">
                                {[1, 2, 3, 4].map((s) => (
                                    <div key={s} className={cn("w-6 h-1.5 border border-black", s < step ? "bg-[#B1F202]" : s === step ? "bg-black" : "bg-white")} />
                                ))}
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-black/10 rounded"><X className="w-5 h-5" /></button>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Left: Avatar */}
                        <div className="w-64 p-4 bg-white border-r-4 border-black flex flex-col items-center shrink-0">
                            <TrendyAvatar expression={avatarExpression} isAnimating={loading} onHighFive={() => setAvatarExpression('celebrating')} />
                            <div className="mt-3 w-full">
                                <DialogueBox greeting={STEP_MESSAGES[step - 1].greeting} message={STEP_MESSAGES[step - 1].message} tip={STEP_MESSAGES[step - 1].tip} />
                            </div>
                            <div className="mt-3 w-full">
                                <p className="text-xs font-bold uppercase text-black/50 mb-1">Based on:</p>
                                <div className="flex items-center gap-2 p-2 bg-[#F5F5F0] border-2 border-black">
                                    <img src={video.thumbnail} alt="" className="w-12 h-8 object-cover border border-black" />
                                    <p className="text-xs font-bold line-clamp-2">{video.title.slice(0, 40)}...</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {/* STEP 1: Ideas */}
                                {step === 1 && (
                                    <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-3">
                                        <h3 className="font-black text-lg uppercase flex items-center gap-2"><Lightbulb className="w-5 h-5 text-[#FFC900]" /> Pick Your Idea</h3>
                                        {loading ? (
                                            <div className="flex flex-col items-center py-8">
                                                <Loader2 className="w-10 h-10 animate-spin text-[#FF90E8]" />
                                                <p className="mt-3 font-bold">Generating ideas...</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                                {ideas.map((idea, i) => (
                                                    <motion.button key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }} onClick={() => { setSelectedIdea(idea); setAvatarExpression('excited') }}
                                                        className={cn("p-3 text-left border-3 border-black transition-all", selectedIdea === idea ? "bg-[#FFC900] shadow-[4px_4px_0px_0px_#000]" : "bg-white shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000]")}>
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
                                        {selectedIdea && (
                                            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setStep(2)} className="w-full py-3 bg-black text-white font-black uppercase flex items-center justify-center gap-2 border-3 border-black shadow-[4px_4px_0px_0px_#FFC900]">
                                                Next: Choose Platform <ArrowRight className="w-5 h-5" />
                                            </motion.button>
                                        )}
                                    </motion.div>
                                )}

                                {/* STEP 2: Platform */}
                                {step === 2 && (
                                    <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-3">
                                        <h3 className="font-black text-lg uppercase flex items-center gap-2"><Target className="w-5 h-5 text-[#00F0FF]" /> Choose Platform</h3>
                                        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
                                            {PLATFORMS.map((p, i) => {
                                                const Icon = p.icon
                                                return (
                                                    <motion.button key={p.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} whileHover={{ y: -3 }}
                                                        onClick={() => { setSelectedPlatform(p.id); setAvatarExpression('excited') }}
                                                        className={cn("p-3 border-3 border-black flex flex-col items-center gap-1 transition-all", selectedPlatform === p.id ? "shadow-[4px_4px_0px_0px_#000]" : "bg-white shadow-[3px_3px_0px_0px_#000]")}
                                                        style={{ backgroundColor: selectedPlatform === p.id ? p.color : undefined }}>
                                                        <Icon className="w-7 h-7" />
                                                        <p className="font-black text-xs">{p.label}</p>
                                                        <p className="text-xs text-black/60">{p.desc}</p>
                                                    </motion.button>
                                                )
                                            })}
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button onClick={() => setStep(1)} className="px-4 py-2 bg-white border-3 border-black font-black uppercase flex items-center gap-2 shadow-[3px_3px_0px_0px_#000]">
                                                <ArrowLeft className="w-4 h-4" /> Back
                                            </button>
                                            {selectedPlatform && (
                                                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={generateScript} className="flex-1 py-2 bg-[#B1F202] border-3 border-black font-black uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000]">
                                                    <Zap className="w-5 h-5" /> Generate Script!
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 3: Loading */}
                                {step === 3 && loading && (
                                    <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-16">
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 border-4 border-black rounded-full border-t-[#FF90E8] border-r-[#FFC900] border-b-[#B1F202] border-l-[#00F0FF]" />
                                        <p className="mt-4 font-black text-xl">Creating Your Script...</p>
                                        <p className="text-sm text-black/60">Adding hooks, storyboard, camera angles...</p>
                                    </motion.div>
                                )}

                                {/* STEP 4: Script */}
                                {step === 4 && script && (
                                    <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <h3 className="font-black text-lg">{script.title}</h3>
                                            <div className="px-3 py-1 bg-[#B1F202] border-2 border-black font-black shadow-[3px_3px_0px_0px_#000]">🔥 {script.viralityScore || 85}% Viral</div>
                                        </div>

                                        {error && <p className="text-xs text-orange-600 bg-orange-100 p-2 border border-orange-300">⚠️ Using fallback script: {error}</p>}

                                        {/* Hook */}
                                        <div className="p-3 bg-[#FFC900] border-3 border-black shadow-[3px_3px_0px_0px_#000]">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-black text-sm">🎣 HOOK</h4>
                                                <button onClick={() => copyToClipboard(script.hook?.text || '', 'hook')} className="text-xs px-2 py-0.5 bg-black text-white flex items-center gap-1">
                                                    {copied === 'hook' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            </div>
                                            <p className="font-bold">{script.hook?.text}</p>
                                            {script.hook?.visualNote && <p className="text-xs mt-1 text-black/70">📹 {script.hook.visualNote}</p>}
                                        </div>

                                        {/* Sections */}
                                        {script.sections?.map((s, i) => (
                                            <div key={i} className="p-3 bg-white border-3 border-black shadow-[3px_3px_0px_0px_#000]">
                                                <div className="flex justify-between mb-1">
                                                    <h4 className="font-black text-xs uppercase">{s.title}</h4>
                                                    <span className="text-xs bg-gray-100 px-1.5 py-0.5 border border-black">{s.duration}</span>
                                                </div>
                                                <p className="text-sm mb-2">{s.script}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    <span className="px-1.5 py-0.5 bg-[#FF90E8] border border-black text-xs font-bold">🎥 {s.camera}</span>
                                                    {s.bRoll?.slice(0, 2).map((b, j) => <span key={j} className="px-1.5 py-0.5 bg-gray-100 border border-black text-xs">📹 {b}</span>)}
                                                </div>
                                            </div>
                                        ))}

                                        {/* CTA */}
                                        <div className="p-3 bg-[#B1F202] border-3 border-black shadow-[3px_3px_0px_0px_#000]">
                                            <h4 className="font-black text-xs mb-1">🎯 CALL TO ACTION</h4>
                                            <p className="font-bold text-sm">{script.cta?.text}</p>
                                        </div>

                                        {/* Caption */}
                                        <div className="p-3 bg-white border-3 border-black shadow-[3px_3px_0px_0px_#000]">
                                            <div className="flex justify-between mb-1">
                                                <h4 className="font-black text-xs">📝 CAPTION</h4>
                                                <button onClick={() => copyToClipboard(script.caption + '\n\n' + script.hashtags?.join(' '), 'cap')} className="text-xs px-2 py-0.5 bg-black text-white flex items-center gap-1">
                                                    {copied === 'cap' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            </div>
                                            <p className="text-sm mb-2">{script.caption}</p>
                                            <div className="flex flex-wrap gap-1">{script.hashtags?.map((t, i) => <span key={i} className="text-xs px-1.5 py-0.5 bg-black text-white">{t.startsWith('#') ? t : `#${t}`}</span>)}</div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <button onClick={() => copyToClipboard(getFullScript(), 'full')} className="flex-1 py-2 bg-white border-3 border-black font-black uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#000]">
                                                {copied === 'full' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy All
                                            </button>
                                            <button onClick={saveScript} disabled={saving || saved} className={cn("flex-1 py-2 border-3 border-black font-black uppercase flex items-center justify-center gap-2", saved ? "bg-[#B1F202]" : "bg-[#FFC900] shadow-[4px_4px_0px_0px_#000]")}>
                                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><PartyPopper className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save</>}
                                            </button>
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
