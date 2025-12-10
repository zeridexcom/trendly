'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
    Sparkles, Copy, Check, Loader2, Video, Zap, Brain, Camera, Target,
    RefreshCw, Save, Trash2, BookOpen, FileText, X, ChevronDown,
    Youtube, Instagram, Twitter, Linkedin, PenTool, Play, PartyPopper
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Platform config
const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#FF90E8' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF4D4D' },
    { id: 'youtube_shorts', label: 'YT Shorts', icon: Play, color: '#FFC900' },
    { id: 'tiktok', label: 'TikTok', icon: Video, color: '#00F0FF' },
    { id: 'blog', label: 'Blog', icon: PenTool, color: '#B1F202' },
    { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: '#1DA1F2' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
]

interface SavedScript {
    id: string
    title: string
    platform: string
    idea_text: string
    script_content: any
    source_video_title: string
    source_video_thumbnail: string
    created_at: string
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
    production: { musicMood: string; props: string[]; location: string; lighting: string; outfit: string }
    caption: string
    hashtags: string[]
    viralityScore: number
    viralityReason: string
    estimatedViews: string
    bestTimeToPost: string
}

function ScriptsContent() {
    const searchParams = useSearchParams()

    // URL params (from Content Wizard)
    const videoId = searchParams.get('videoId')
    const videoTitle = searchParams.get('videoTitle')
    const videoThumbnail = searchParams.get('videoThumbnail')
    const ideaFromUrl = searchParams.get('idea')
    const ideaHook = searchParams.get('ideaHook')
    const platformFromUrl = searchParams.get('platform')
    const industryFromUrl = searchParams.get('industry')

    const hasContext = !!(videoId && ideaFromUrl && platformFromUrl)

    // State
    const [activeTab, setActiveTab] = useState<'create' | 'saved'>(hasContext ? 'create' : 'create')
    const [topic, setTopic] = useState(hasContext ? `${ideaFromUrl} - ${ideaHook || ''}` : '')
    const [platform, setPlatform] = useState(platformFromUrl || 'instagram')
    const [isGenerating, setIsGenerating] = useState(false)
    const [script, setScript] = useState<GeneratedScript | null>(null)
    const [savedScripts, setSavedScripts] = useState<SavedScript[]>([])
    const [loadingSaved, setLoadingSaved] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showContext, setShowContext] = useState(hasContext)
    const [viewingScript, setViewingScript] = useState<SavedScript | null>(null)

    // Fetch saved scripts
    useEffect(() => {
        fetchSavedScripts()
    }, [])

    const fetchSavedScripts = async () => {
        setLoadingSaved(true)
        try {
            const userResponse = await fetch('/api/auth/session')
            const userData = await userResponse.json()
            if (!userData.user?.id) return

            const response = await fetch('/api/user/scripts', {
                headers: { 'x-user-id': userData.user.id }
            })
            const data = await response.json()
            if (data.success) setSavedScripts(data.scripts || [])
        } catch (error) {
            console.error('Failed to fetch saved scripts:', error)
        } finally {
            setLoadingSaved(false)
        }
    }

    const generateScript = async () => {
        if (!topic.trim()) return
        setIsGenerating(true)
        setScript(null)

        try {
            const response = await fetch('/api/ai/script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idea: topic,
                    platform,
                    videoContext: hasContext ? { title: videoTitle, whyViral: 'High engagement' } : undefined,
                    userIndustry: industryFromUrl || 'General'
                })
            })
            const data = await response.json()
            if (data.success && data.script) {
                setScript(data.script)
            }
        } catch (error) {
            console.error('Failed to generate script:', error)
        } finally {
            setIsGenerating(false)
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
                    platform,
                    ideaText: topic,
                    scriptContent: script,
                    sourceVideoId: videoId,
                    sourceVideoTitle: videoTitle,
                    sourceVideoThumbnail: videoThumbnail
                })
            })
            setSaved(true)
            fetchSavedScripts()
        } catch (error) {
            console.error('Save failed:', error)
        } finally {
            setSaving(false)
        }
    }

    const deleteScript = async (id: string) => {
        if (!confirm('Delete this script?')) return
        try {
            const userResponse = await fetch('/api/auth/session')
            const userData = await userResponse.json()

            await fetch('/api/user/scripts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'x-user-id': userData.user?.id || '' },
                body: JSON.stringify({ id })
            })
            setSavedScripts(savedScripts.filter(s => s.id !== id))
        } catch (error) {
            console.error('Delete failed:', error)
        }
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

    const clearContext = () => {
        setShowContext(false)
        setTopic('')
        setPlatform('instagram')
        // Clear URL params
        window.history.replaceState({}, '', '/dashboard/scripts')
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF90E8] border-3 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center">
                            <Video className="w-5 h-5" />
                        </div>
                        AI Script Writer
                    </h1>
                    <p className="text-black/60 mt-1 font-medium">Create viral scripts with AI-powered insights</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b-4 border-black">
                <button
                    onClick={() => setActiveTab('create')}
                    className={cn(
                        "flex items-center gap-2 px-5 py-3 font-black text-sm uppercase border-3 border-black border-b-0 -mb-1 transition-all",
                        activeTab === 'create'
                            ? "bg-[#FFC900] shadow-none"
                            : "bg-white hover:bg-gray-50"
                    )}
                >
                    <Sparkles className="w-4 h-4" />
                    Create Script
                </button>
                <button
                    onClick={() => setActiveTab('saved')}
                    className={cn(
                        "flex items-center gap-2 px-5 py-3 font-black text-sm uppercase border-3 border-black border-b-0 -mb-1 transition-all",
                        activeTab === 'saved'
                            ? "bg-[#B1F202] shadow-none"
                            : "bg-white hover:bg-gray-50"
                    )}
                >
                    <BookOpen className="w-4 h-4" />
                    Saved ({savedScripts.length})
                </button>
            </div>

            {/* CREATE TAB */}
            {activeTab === 'create' && (
                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Left: Input */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Context Banner */}
                        {showContext && hasContext && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-[#FFC900] border-3 border-black shadow-[4px_4px_0px_0px_#000]"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <p className="font-black text-sm uppercase flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Creating Script Based On:
                                    </p>
                                    <button onClick={clearContext} className="p-1 hover:bg-black/10 rounded">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    {videoThumbnail && (
                                        <img src={videoThumbnail} alt="" className="w-16 h-10 object-cover border-2 border-black" />
                                    )}
                                    <div>
                                        <p className="font-bold text-sm line-clamp-1">{videoTitle}</p>
                                        <p className="text-xs text-black/70">💡 {ideaFromUrl}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Script Settings Card */}
                        <div className="p-5 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                            <h3 className="font-black text-base uppercase mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-[#FF90E8]" />
                                Script Settings
                            </h3>

                            {/* Topic */}
                            <div className="mb-4">
                                <label className="text-sm font-bold uppercase mb-2 block">Topic / Idea</label>
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., 5 productivity tips for entrepreneurs"
                                    className="w-full min-h-[100px] p-3 border-3 border-black font-medium text-sm resize-none focus:outline-none focus:shadow-[4px_4px_0px_0px_#FFC900]"
                                />
                            </div>

                            {/* Platform */}
                            <div className="mb-4">
                                <label className="text-sm font-bold uppercase mb-2 block">Platform</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {PLATFORMS.map((p) => {
                                        const Icon = p.icon
                                        return (
                                            <button
                                                key={p.id}
                                                onClick={() => setPlatform(p.id)}
                                                className={cn(
                                                    "p-2 border-2 border-black flex flex-col items-center gap-1 transition-all",
                                                    platform === p.id ? "shadow-[3px_3px_0px_0px_#000]" : "bg-white shadow-[2px_2px_0px_0px_#000]"
                                                )}
                                                style={{ backgroundColor: platform === p.id ? p.color : undefined }}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="text-xs font-bold">{p.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={generateScript}
                                disabled={isGenerating || !topic.trim()}
                                className={cn(
                                    "w-full py-4 font-black uppercase text-lg flex items-center justify-center gap-2 border-3 border-black transition-all",
                                    isGenerating
                                        ? "bg-gray-200"
                                        : "bg-[#B1F202] shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000]"
                                )}
                            >
                                {isGenerating ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
                                ) : (
                                    <><Zap className="w-5 h-5" /> Generate Script</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right: Script Output */}
                    <div className="lg:col-span-3 space-y-4">
                        <AnimatePresence mode="wait">
                            {isGenerating && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-12 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                        className="w-16 h-16 border-4 border-black rounded-full border-t-[#FF90E8] border-r-[#FFC900] border-b-[#B1F202] border-l-[#00F0FF]"
                                    />
                                    <p className="mt-4 font-black text-lg">Creating Your Script...</p>
                                    <p className="text-sm text-black/60">Adding hooks, storyboard, camera angles...</p>
                                </motion.div>
                            )}

                            {!isGenerating && script && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    {/* Title & Score */}
                                    <div className="flex items-center justify-between flex-wrap gap-2 p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                                        <h3 className="font-black text-lg">{script.title}</h3>
                                        <div className="px-4 py-2 bg-[#B1F202] border-2 border-black font-black shadow-[3px_3px_0px_0px_#000]">
                                            🔥 {script.viralityScore || 85}% Viral Score
                                        </div>
                                    </div>

                                    {/* Hook */}
                                    <div className="p-4 bg-[#FFC900] border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-black text-sm uppercase">🎣 The Hook</h4>
                                            <button
                                                onClick={() => copyToClipboard(script.hook?.text || '', 'hook')}
                                                className="text-xs px-2 py-1 bg-black text-white font-bold flex items-center gap-1"
                                            >
                                                {copied === 'hook' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <p className="font-bold text-lg">{script.hook?.text}</p>
                                        {script.hook?.visualNote && (
                                            <p className="text-xs mt-2 text-black/70 flex items-center gap-1">
                                                <Camera className="w-3 h-3" /> {script.hook.visualNote}
                                            </p>
                                        )}
                                        {script.hook?.delivery && (
                                            <p className="text-xs mt-1 text-black/70">🎤 {script.hook.delivery}</p>
                                        )}
                                    </div>

                                    {/* Sections */}
                                    {script.sections?.map((section, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] border-l-[6px]"
                                            style={{ borderLeftColor: ['#FF90E8', '#00F0FF', '#FFC900', '#B1F202', '#FF90E8'][i % 5] }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-black text-sm uppercase">{section.title}</h4>
                                                <span className="text-xs bg-gray-100 px-2 py-1 border border-black font-bold">{section.duration}</span>
                                            </div>
                                            <p className="text-sm mb-3 leading-relaxed">{section.script}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {section.camera && (
                                                    <span className="px-2 py-1 bg-[#FF90E8] border border-black text-xs font-bold">
                                                        🎥 {section.camera}
                                                    </span>
                                                )}
                                                {section.bRoll?.slice(0, 2).map((b, j) => (
                                                    <span key={j} className="px-2 py-1 bg-gray-100 border border-black text-xs">
                                                        📹 {b}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* CTA */}
                                    <div className="p-4 bg-[#B1F202] border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                                        <h4 className="font-black text-sm uppercase mb-2">🎯 Call to Action</h4>
                                        <p className="font-bold">{script.cta?.text}</p>
                                    </div>

                                    {/* Production Notes */}
                                    {script.production && (
                                        <div className="p-4 bg-[#00F0FF]/20 border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                                            <h4 className="font-black text-sm uppercase mb-3">🎬 Production Notes</h4>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <p><strong>🎵 Music:</strong> {script.production.musicMood}</p>
                                                <p><strong>📍 Location:</strong> {script.production.location}</p>
                                                <p><strong>💡 Lighting:</strong> {script.production.lighting}</p>
                                                <p><strong>👕 Outfit:</strong> {script.production.outfit}</p>
                                            </div>
                                            {script.production.props?.length > 0 && (
                                                <p className="mt-2 text-sm"><strong>🎁 Props:</strong> {script.production.props.join(', ')}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Caption & Hashtags */}
                                    <div className="p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-black text-sm uppercase">📝 Caption</h4>
                                            <button
                                                onClick={() => copyToClipboard(script.caption + '\n\n' + script.hashtags?.join(' '), 'caption')}
                                                className="text-xs px-2 py-1 bg-black text-white font-bold flex items-center gap-1"
                                            >
                                                {copied === 'caption' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <p className="text-sm mb-3 whitespace-pre-line">{script.caption}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {script.hashtags?.map((tag, i) => (
                                                <span key={i} className="text-xs px-2 py-1 bg-black text-white font-bold">
                                                    {tag.startsWith('#') ? tag : `#${tag}`}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="p-3 bg-white border-3 border-black text-center">
                                            <p className="font-black text-lg">{script.estimatedViews || '10K-50K'}</p>
                                            <p className="text-xs text-black/60 uppercase font-bold">Est. Views</p>
                                        </div>
                                        <div className="p-3 bg-white border-3 border-black text-center">
                                            <p className="font-black text-lg">{script.bestTimeToPost || '6-9 PM'}</p>
                                            <p className="text-xs text-black/60 uppercase font-bold">Best Time</p>
                                        </div>
                                        <div className="p-3 bg-white border-3 border-black text-center">
                                            <p className="font-black text-lg">{script.viralityScore || 85}%</p>
                                            <p className="text-xs text-black/60 uppercase font-bold">Viral Score</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => copyToClipboard(getFullScript(), 'full')}
                                            className="flex-1 py-3 bg-white border-3 border-black font-black uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
                                        >
                                            {copied === 'full' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            Copy All
                                        </button>
                                        <button
                                            onClick={saveScript}
                                            disabled={saving || saved}
                                            className={cn(
                                                "flex-1 py-3 border-3 border-black font-black uppercase flex items-center justify-center gap-2 transition-all",
                                                saved ? "bg-[#B1F202]" : "bg-[#FFC900] shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000]"
                                            )}
                                        >
                                            {saving ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : saved ? (
                                                <><PartyPopper className="w-5 h-5" /> Saved!</>
                                            ) : (
                                                <><Save className="w-5 h-5" /> Save Script</>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {!isGenerating && !script && (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-12 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center text-center"
                                >
                                    <Brain className="w-16 h-16 text-[#FF90E8] mb-4" />
                                    <h3 className="font-black text-xl uppercase mb-2">Ready to Create Magic!</h3>
                                    <p className="text-black/60 max-w-md">
                                        Enter your topic, choose a platform, and let AI generate a complete viral script with hooks, storyboard, camera angles, and more!
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* SAVED TAB */}
            {activeTab === 'saved' && (
                <div className="space-y-4">
                    {loadingSaved ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#FF90E8]" />
                        </div>
                    ) : savedScripts.length === 0 ? (
                        <div className="p-12 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center text-center">
                            <FileText className="w-16 h-16 text-black/20 mb-4" />
                            <h3 className="font-black text-xl uppercase mb-2">No Saved Scripts</h3>
                            <p className="text-black/60 mb-4">Create your first script and save it here!</p>
                            <button
                                onClick={() => setActiveTab('create')}
                                className="px-6 py-3 bg-[#FFC900] border-3 border-black font-black uppercase shadow-[4px_4px_0px_0px_#000]"
                            >
                                Create Script
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {savedScripts.map((savedScript) => (
                                <motion.div
                                    key={savedScript.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all cursor-pointer"
                                    onClick={() => setViewingScript(savedScript)}
                                >
                                    {savedScript.source_video_thumbnail && (
                                        <img
                                            src={savedScript.source_video_thumbnail}
                                            alt=""
                                            className="w-full h-24 object-cover border-2 border-black mb-3"
                                        />
                                    )}
                                    <h4 className="font-black line-clamp-2 mb-2">{savedScript.title}</h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs bg-[#FF90E8] border border-black px-2 py-0.5 font-bold uppercase">
                                            {savedScript.platform}
                                        </span>
                                        <span className="text-xs text-black/60">
                                            {new Date(savedScript.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-end pt-3 border-t border-black/10">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteScript(savedScript.id) }}
                                            className="p-2 text-black/50 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Script Viewer Modal */}
                    {viewingScript && (
                        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setViewingScript(null)}>
                            <div className="bg-[#F5F5F0] w-full max-w-2xl max-h-[85vh] overflow-y-auto border-4 border-black shadow-[8px_8px_0px_0px_#000]" onClick={(e) => e.stopPropagation()}>
                                <div className="p-4 bg-[#FFC900] border-b-4 border-black flex items-center justify-between">
                                    <h3 className="font-black">{viewingScript.title}</h3>
                                    <button onClick={() => setViewingScript(null)} className="p-1 hover:bg-black/10">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-4 space-y-4">
                                    {viewingScript.script_content?.hook && (
                                        <div className="p-3 bg-[#FFC900] border-3 border-black">
                                            <p className="text-xs font-black uppercase mb-1">🎣 Hook</p>
                                            <p className="font-bold">{viewingScript.script_content.hook.text}</p>
                                        </div>
                                    )}
                                    {viewingScript.script_content?.sections?.map((sec: any, i: number) => (
                                        <div key={i} className="p-3 bg-white border-3 border-black">
                                            <p className="text-xs font-black uppercase mb-1">{sec.title}</p>
                                            <p className="text-sm">{sec.script}</p>
                                        </div>
                                    ))}
                                    {viewingScript.script_content?.cta && (
                                        <div className="p-3 bg-[#B1F202] border-3 border-black">
                                            <p className="text-xs font-black uppercase mb-1">🎯 CTA</p>
                                            <p className="font-bold">{viewingScript.script_content.cta.text}</p>
                                        </div>
                                    )}
                                    {viewingScript.script_content?.caption && (
                                        <div className="p-3 bg-white border-3 border-black">
                                            <p className="text-xs font-black uppercase mb-1">📝 Caption</p>
                                            <p className="text-sm">{viewingScript.script_content.caption}</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {viewingScript.script_content.hashtags?.map((tag: string, i: number) => (
                                                    <span key={i} className="text-xs bg-black text-white px-2 py-0.5">
                                                        {tag.startsWith('#') ? tag : `#${tag}`}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default function ScriptsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <ScriptsContent />
        </Suspense>
    )
}
