'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, ArrowRight, ArrowLeft, Loader2, Sparkles, Check, Save,
    Youtube, Instagram, Twitter, Linkedin, PenTool, Video,
    Copy, ChevronRight, Play, Camera, Music, Lightbulb, Target,
    Clock, Hash, FileText, Zap
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

// Platform config
const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#FF90E8', desc: 'Reels & Posts' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF4D4D', desc: 'Long-form videos' },
    { id: 'youtube_shorts', label: 'YT Shorts', icon: Play, color: '#FF6B6B', desc: '60 sec vertical' },
    { id: 'tiktok', label: 'TikTok', icon: Video, color: '#00F0FF', desc: 'Trending content' },
    { id: 'blog', label: 'Blog', icon: PenTool, color: '#B1F202', desc: 'Written articles' },
    { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: '#1DA1F2', desc: 'Threads & posts' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0077B5', desc: 'Professional posts' },
]

// Avatar messages for each step
const STEP_MESSAGES = [
    {
        greeting: "Let's create! 🚀",
        message: "I've analyzed this video and found some amazing content angles for you. Pick the one that excites you most!",
        tip: "Each idea is optimized for virality based on the video's success"
    },
    {
        greeting: "Great choice! 📱",
        message: "Now, which platform are you creating for? I'll tailor the script format, length, and style specifically for it.",
        tip: "Different platforms need different approaches"
    },
    {
        greeting: "Magic happening! ✨",
        message: "I'm generating your complete script with storyboard, camera directions, and everything you need to start filming.",
        tip: "This usually takes 10-20 seconds"
    },
    {
        greeting: "Your script is ready! 🎬",
        message: "Here's your complete, ready-to-film script. Copy it, save it, or generate a fresh version!",
        tip: "Save to your library to access anytime"
    }
]

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

    // Generate ideas when wizard opens
    useEffect(() => {
        if (isOpen && ideas.length === 0) {
            generateIdeas()
        }
    }, [isOpen])

    const generateIdeas = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/ai/ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: video.title,
                    videoContext: {
                        title: video.title,
                        whyViral: video.whyViral,
                        hook: video.hook
                    },
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
                    { title: `My Take on "${video.title}"`, hook: "You won't believe what I discovered...", format: "Reaction", angle: "Personal Experience", estimatedViews: "10K-50K" },
                    { title: `${video.title} Explained in 60 Seconds`, hook: "Here's everything you need to know...", format: "Explainer", angle: "Educational", estimatedViews: "20K-80K" },
                    { title: `Why ${video.title} is Breaking the Internet`, hook: "Everyone's talking about this, here's why...", format: "Commentary", angle: "Trend Analysis", estimatedViews: "15K-60K" },
                    { title: `I Tried ${video.title} - Here's What Happened`, hook: "I tested it so you don't have to...", format: "Challenge", angle: "First-Person", estimatedViews: "25K-100K" },
                    { title: `The Truth About ${video.title}`, hook: "Nobody's talking about this part...", format: "Exposé", angle: "Controversial", estimatedViews: "30K-120K" },
                ])
            }
        } catch (error) {
            console.error('Failed to generate ideas:', error)
        } finally {
            setLoading(false)
        }
    }

    const generateScript = async () => {
        if (!selectedIdea || !selectedPlatform) return
        setLoading(true)
        setStep(3)

        try {
            const response = await fetch('/api/ai/script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idea: `${selectedIdea.title} - ${selectedIdea.hook}`,
                    platform: selectedPlatform,
                    videoContext: {
                        title: video.title,
                        whyViral: video.whyViral,
                        hook: video.hook
                    },
                    userIndustry
                })
            })
            const data = await response.json()
            if (data.success && data.script) {
                setScript(data.script)
                setStep(4)
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
            // Get user ID from session
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
        let fullScript = `${script.hook.text}\n\n`
        script.sections.forEach(s => {
            fullScript += `[${s.title}]\n${s.script}\n\n`
        })
        fullScript += `[CTA]\n${script.cta.text}`
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
                            <div className="flex gap-1 ml-4">
                                {[1, 2, 3, 4].map((s) => (
                                    <div
                                        key={s}
                                        className={cn(
                                            "w-8 h-2 border border-black",
                                            s <= step ? "bg-black" : "bg-white"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/10 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col lg:flex-row min-h-[500px]">
                        {/* Avatar Section */}
                        <div className="lg:w-80 p-6 bg-white border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col items-center">
                            {/* Avatar */}
                            <div className="w-24 h-24 bg-[#FF90E8] border-4 border-black rounded-full flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_#000]">
                                <Sparkles className="w-10 h-10" />
                            </div>

                            {/* Message */}
                            <div className="bg-[#F5F5F0] border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] w-full">
                                <p className="font-black text-lg mb-2">{STEP_MESSAGES[step - 1].greeting}</p>
                                <p className="text-sm text-black/70 leading-relaxed">
                                    {STEP_MESSAGES[step - 1].message}
                                </p>
                                {STEP_MESSAGES[step - 1].tip && (
                                    <p className="text-xs font-bold text-[#FF90E8] mt-3 border-t border-black/20 pt-2">
                                        💡 {STEP_MESSAGES[step - 1].tip}
                                    </p>
                                )}
                            </div>

                            {/* Video Context */}
                            <div className="mt-4 w-full">
                                <p className="text-xs font-bold uppercase text-black/50 mb-2">Based on:</p>
                                <div className="flex items-center gap-2 p-2 bg-[#F5F5F0] border border-black">
                                    <img src={video.thumbnail} alt="" className="w-16 h-10 object-cover border border-black" />
                                    <p className="text-xs font-bold line-clamp-2">{video.title}</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-6 overflow-y-auto max-h-[60vh] lg:max-h-none">
                            <AnimatePresence mode="wait">
                                {/* Step 1: Ideas */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="font-black text-xl uppercase flex items-center gap-2">
                                            <Lightbulb className="w-5 h-5" />
                                            Choose Your Idea
                                        </h3>

                                        {loading ? (
                                            <div className="flex flex-col items-center justify-center py-12">
                                                <Loader2 className="w-8 h-8 animate-spin text-[#FF90E8]" />
                                                <p className="mt-3 font-bold">Generating ideas...</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {ideas.map((idea, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSelectedIdea(idea)}
                                                        className={cn(
                                                            "p-4 text-left border-2 border-black transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]",
                                                            selectedIdea === idea
                                                                ? "bg-[#FFC900] shadow-[4px_4px_0px_0px_#000]"
                                                                : "bg-white"
                                                        )}
                                                    >
                                                        <p className="font-black text-sm mb-1">{idea.title}</p>
                                                        <p className="text-xs text-black/60 mb-2">"{idea.hook}"</p>
                                                        <div className="flex gap-2">
                                                            <span className="text-xs px-2 py-0.5 bg-[#FF90E8] border border-black font-bold">
                                                                {idea.format}
                                                            </span>
                                                            <span className="text-xs px-2 py-0.5 bg-[#B1F202] border border-black font-bold">
                                                                {idea.estimatedViews}
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {selectedIdea && (
                                            <button
                                                onClick={() => setStep(2)}
                                                className="w-full py-3 bg-black text-white font-black uppercase flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                                            >
                                                Continue <ArrowRight className="w-5 h-5" />
                                            </button>
                                        )}
                                    </motion.div>
                                )}

                                {/* Step 2: Platform */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="font-black text-xl uppercase flex items-center gap-2">
                                            <Target className="w-5 h-5" />
                                            Choose Platform
                                        </h3>

                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {PLATFORMS.map((platform) => {
                                                const Icon = platform.icon
                                                return (
                                                    <button
                                                        key={platform.id}
                                                        onClick={() => setSelectedPlatform(platform.id)}
                                                        className={cn(
                                                            "p-4 border-2 border-black transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] flex flex-col items-center",
                                                            selectedPlatform === platform.id
                                                                ? "shadow-[4px_4px_0px_0px_#000]"
                                                                : "bg-white"
                                                        )}
                                                        style={{
                                                            backgroundColor: selectedPlatform === platform.id ? platform.color : undefined
                                                        }}
                                                    >
                                                        <Icon className="w-8 h-8 mb-2" />
                                                        <p className="font-black text-sm">{platform.label}</p>
                                                        <p className="text-xs text-black/60">{platform.desc}</p>
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="px-6 py-3 bg-white border-2 border-black font-black uppercase flex items-center gap-2 hover:bg-gray-100"
                                            >
                                                <ArrowLeft className="w-5 h-5" /> Back
                                            </button>
                                            {selectedPlatform && (
                                                <button
                                                    onClick={generateScript}
                                                    className="flex-1 py-3 bg-[#B1F202] border-2 border-black font-black uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                                                >
                                                    Generate Script <Zap className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Loading */}
                                {step === 3 && loading && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center py-16"
                                    >
                                        <div className="relative">
                                            <div className="w-20 h-20 border-4 border-black rounded-full animate-spin border-t-[#FF90E8]" />
                                            <Sparkles className="w-8 h-8 absolute inset-0 m-auto" />
                                        </div>
                                        <p className="mt-6 font-black text-xl">Creating Your Script...</p>
                                        <p className="text-sm text-black/60 mt-2">Adding storyboard, camera angles, and viral elements</p>
                                    </motion.div>
                                )}

                                {/* Step 4: Script Result */}
                                {step === 4 && script && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        {/* Title & Virality */}
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black text-xl">{script.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-[#B1F202] border-2 border-black font-black">
                                                    {script.viralityScore}% Viral
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-white border border-black text-xs font-bold flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {script.bestTimeToPost}
                                            </span>
                                            <span className="px-2 py-1 bg-white border border-black text-xs font-bold flex items-center gap-1">
                                                <Target className="w-3 h-3" /> {script.estimatedViews}
                                            </span>
                                        </div>

                                        {/* Hook */}
                                        <div className="p-4 bg-[#FFC900] border-2 border-black">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-black flex items-center gap-2">
                                                    <Zap className="w-4 h-4" /> HOOK
                                                </h4>
                                                <button
                                                    onClick={() => copyToClipboard(script.hook.text, 'hook')}
                                                    className="text-xs px-2 py-1 bg-black text-white flex items-center gap-1"
                                                >
                                                    {copied === 'hook' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            </div>
                                            <p className="font-bold">{script.hook.text}</p>
                                            <p className="text-xs mt-2 text-black/70">📹 {script.hook.visualNote}</p>
                                        </div>

                                        {/* Script Sections */}
                                        {script.sections?.map((section, i) => (
                                            <div key={i} className="p-4 bg-white border-2 border-black">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-black text-sm uppercase">{section.title}</h4>
                                                    <span className="text-xs text-black/50">{section.duration}</span>
                                                </div>
                                                <p className="text-sm mb-2">{section.script}</p>
                                                <div className="flex flex-wrap gap-2 text-xs">
                                                    <span className="px-2 py-0.5 bg-[#FF90E8] border border-black">
                                                        🎥 {section.camera}
                                                    </span>
                                                    {section.bRoll?.slice(0, 2).map((b, j) => (
                                                        <span key={j} className="px-2 py-0.5 bg-gray-100 border border-black">
                                                            📹 {b}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        {/* CTA */}
                                        <div className="p-4 bg-[#B1F202] border-2 border-black">
                                            <h4 className="font-black text-sm mb-1">📢 CALL TO ACTION</h4>
                                            <p className="font-bold">{script.cta?.text}</p>
                                        </div>

                                        {/* Caption & Hashtags */}
                                        <div className="p-4 bg-white border-2 border-black">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-black text-sm">📝 CAPTION</h4>
                                                <button
                                                    onClick={() => copyToClipboard(script.caption + '\n\n' + script.hashtags?.join(' '), 'caption')}
                                                    className="text-xs px-2 py-1 bg-black text-white flex items-center gap-1"
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
                                        </div>

                                        {/* Production Notes */}
                                        {script.production && (
                                            <div className="p-4 bg-gray-100 border-2 border-black">
                                                <h4 className="font-black text-sm mb-2">🎬 PRODUCTION NOTES</h4>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <p><Music className="w-3 h-3 inline" /> Music: {script.production.musicMood}</p>
                                                    <p><Camera className="w-3 h-3 inline" /> Location: {script.production.location}</p>
                                                    <p>💡 Lighting: {script.production.lighting}</p>
                                                    <p>👕 Outfit: {script.production.outfit}</p>
                                                </div>
                                                {script.production.props?.length > 0 && (
                                                    <p className="mt-2 text-xs">Props: {script.production.props.join(', ')}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => copyToClipboard(getFullScript(), 'full')}
                                                className="flex-1 py-3 bg-white border-2 border-black font-black uppercase flex items-center justify-center gap-2 hover:bg-gray-100"
                                            >
                                                {copied === 'full' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                Copy Script
                                            </button>
                                            <button
                                                onClick={saveScript}
                                                disabled={saving || saved}
                                                className={cn(
                                                    "flex-1 py-3 border-2 border-black font-black uppercase flex items-center justify-center gap-2 transition-all",
                                                    saved
                                                        ? "bg-[#B1F202]"
                                                        : "bg-[#FFC900] shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                                                )}
                                            >
                                                {saving ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : saved ? (
                                                    <><Check className="w-5 h-5" /> Saved!</>
                                                ) : (
                                                    <><Save className="w-5 h-5" /> Save Script</>
                                                )}
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
