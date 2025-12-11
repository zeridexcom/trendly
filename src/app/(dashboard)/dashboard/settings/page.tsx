'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    User, Settings, MapPin, Briefcase, Zap, Save, Loader2, Check,
    Cpu, Film, Heart, Gamepad2, Shirt, BookOpen, UtensilsCrossed, Plane, Newspaper,
    Youtube, Instagram, Twitter, Linkedin, PenTool, Video,
    Flame, Calendar, Target, ArrowLeft, LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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

const LOCATIONS = [
    { id: 'IN', label: 'India' },
    { id: 'US', label: 'United States' },
    { id: 'GLOBAL', label: 'Global / Worldwide' },
    { id: 'GB', label: 'United Kingdom' },
    { id: 'OTHER', label: 'Other' },
]

const PLATFORMS = [
    { id: 'YOUTUBE', label: 'YouTube', icon: Youtube },
    { id: 'INSTAGRAM', label: 'Instagram', icon: Instagram },
    { id: 'TIKTOK', label: 'TikTok', icon: Video },
    { id: 'TWITTER', label: 'Twitter / X', icon: Twitter },
    { id: 'LINKEDIN', label: 'LinkedIn', icon: Linkedin },
    { id: 'BLOG', label: 'Blog / Website', icon: PenTool },
]

const FREQUENCIES = [
    { id: 'DAILY', label: 'Daily', icon: Zap },
    { id: 'FREQUENT', label: '3-4 times/week', icon: Flame },
    { id: 'WEEKLY', label: 'Weekly', icon: Calendar },
    { id: 'OCCASIONAL', label: 'Occasionally', icon: Target },
]

export default function SettingsPage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [user, setUser] = useState<any>(null)

    // Profile
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    // Preferences
    const [industry, setIndustry] = useState('')
    const [location, setLocation] = useState('')
    const [platforms, setPlatforms] = useState<string[]>([])
    const [frequency, setFrequency] = useState('')

    useEffect(() => {
        loadUserData()
    }, [])

    const loadUserData = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
                setEmail(user.email || '')
                setName(user.user_metadata?.name || user.user_metadata?.full_name || '')
                setIndustry(user.user_metadata?.industry || '')
                setLocation(user.user_metadata?.location || 'IN')
                setPlatforms(user.user_metadata?.platforms || [])
                setFrequency(user.user_metadata?.frequency || '')
            }
        } catch (error) {
            console.error('Error loading user:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setSaved(false)
        try {
            // Update user metadata
            await supabase.auth.updateUser({
                data: {
                    name,
                    industry,
                    location,
                    platforms,
                    frequency,
                }
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } catch (error) {
            console.error('Error saving:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const togglePlatform = (id: string) => {
        setPlatforms(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-black" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 font-sans text-black">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                    <ArrowLeft className="w-5 h-5 text-black" />
                </button>
                <div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">Settings</h1>
                    <p className="text-black font-bold border-l-4 border-black pl-3 mt-2">Manage your profile & content preferences</p>
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] p-8 mb-8">
                <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
                    <div className="p-2 bg-[#FF90E8] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                        <User className="w-6 h-6 text-black" />
                    </div>
                    <h2 className="text-2xl font-black uppercase">Your Profile</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-black uppercase mb-2">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-black shadow-[4px_4px_0px_0px_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] outline-none transition-all font-bold"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-black uppercase mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-3 border-2 border-black bg-gray-100 font-medium text-gray-500 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] p-8 mb-8">
                <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
                    <div className="p-2 bg-[#FFC900] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                        <Settings className="w-6 h-6 text-black" />
                    </div>
                    <h2 className="text-2xl font-black uppercase">Content Preferences</h2>
                </div>

                {/* Industry */}
                <div className="mb-8">
                    <label className="block text-sm font-black uppercase mb-3">Your Niche / Industry</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {INDUSTRIES.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setIndustry(item.id)}
                                className={`flex items-center gap-3 p-3 border-2 border-black transition-all ${industry === item.id
                                    ? 'bg-black text-white shadow-[4px_4px_0px_0px_#FF90E8] -translate-y-1'
                                    : 'bg-white text-black hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${industry === item.id ? 'text-[#FF90E8]' : 'text-black'}`} />
                                <span className="text-sm font-bold uppercase text-left leading-tight">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div className="mb-8">
                    <label className="block text-sm font-black uppercase mb-3">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Target Audience
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {LOCATIONS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setLocation(item.id)}
                                className={`px-4 py-2 border-2 border-black font-bold uppercase text-sm transition-all ${location === item.id
                                    ? 'bg-[#B1F202] shadow-[2px_2px_0px_0px_#000]'
                                    : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Platforms */}
                <div className="mb-8">
                    <label className="block text-sm font-black uppercase mb-3">Active Platforms</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {PLATFORMS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => togglePlatform(item.id)}
                                className={`flex items-center gap-3 p-3 border-2 border-black transition-all ${platforms.includes(item.id)
                                    ? 'bg-[#00F0FF] shadow-[4px_4px_0px_0px_#000] -translate-y-1'
                                    : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 text-black" />
                                <span className="text-sm font-bold uppercase">
                                    {item.label}
                                </span>
                                {platforms.includes(item.id) && <Check className="w-5 h-5 text-black ml-auto border-2 border-black rounded-full p-0.5 bg-white" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Frequency */}
                <div>
                    <label className="block text-sm font-black uppercase mb-3">Posting Frequency</label>
                    <div className="grid grid-cols-2 gap-3">
                        {FREQUENCIES.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setFrequency(item.id)}
                                className={`flex items-center gap-3 p-4 border-2 border-black transition-all ${frequency === item.id
                                    ? 'bg-[#FF90E8] shadow-[4px_4px_0px_0px_#000]'
                                    : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 text-black" />
                                <span className="text-sm font-bold uppercase">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-black text-white text-lg font-black uppercase tracking-wide border-2 border-transparent hover:bg-[#FFC900] hover:text-black hover:border-black hover:shadow-[6px_6px_0px_0px_#000] transition-all disabled:opacity-50"
                >
                    {saving ? (
                        <><Loader2 className="w-6 h-6 animate-spin" /> SAVING...</>
                    ) : saved ? (
                        <><Check className="w-6 h-6" /> SAVED!</>
                    ) : (
                        <><Save className="w-6 h-6" /> SAVE CHANGES</>
                    )}
                </button>
                <button
                    onClick={handleLogout}
                    className="px-6 py-4 border-2 border-black bg-white text-red-600 font-black uppercase hover:bg-red-50 transition-colors flex items-center gap-2 shadow-[4px_4px_0px_0px_#000]"
                >
                    <LogOut className="w-5 h-5" /> Logout
                </button>
            </div>
        </div>
    )
}
