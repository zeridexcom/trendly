'use client'

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
                <Loader2 className="w-8 h-8 animate-spin text-[#D9C5B2]" />
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-[#7E7F83]" />
                </button>
                <div>
                    <h1 className="text-2xl font-semibold text-[#14110F] dark:text-[#F3F3F4]">Settings</h1>
                    <p className="text-[#7E7F83] text-sm">Manage your profile and preferences</p>
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-[#1A1714] rounded-xl border border-[#E8E8E9] dark:border-[#34312D] p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-[#D9C5B2]/20">
                        <User className="w-5 h-5 text-[#D9C5B2]" />
                    </div>
                    <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">Profile</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#14110F] dark:text-[#F3F3F4] mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E8E9] dark:border-[#34312D] bg-white dark:bg-[#0F0D0C] text-[#14110F] dark:text-[#F3F3F4] focus:border-[#D9C5B2] outline-none transition-colors"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#14110F] dark:text-[#F3F3F4] mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E8E9] dark:border-[#34312D] bg-[#F3F3F4] dark:bg-[#1A1714] text-[#7E7F83] cursor-not-allowed"
                        />
                        <p className="text-xs text-[#7E7F83] mt-1">Email cannot be changed</p>
                    </div>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white dark:bg-[#1A1714] rounded-xl border border-[#E8E8E9] dark:border-[#34312D] p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-[#D9C5B2]/20">
                        <Settings className="w-5 h-5 text-[#D9C5B2]" />
                    </div>
                    <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">Trend Preferences</h2>
                </div>

                {/* Industry */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#14110F] dark:text-[#F3F3F4] mb-3">Industry</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {INDUSTRIES.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setIndustry(item.id)}
                                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${industry === item.id
                                        ? 'border-[#D9C5B2] bg-[#D9C5B2]/10'
                                        : 'border-[#E8E8E9] dark:border-[#34312D] hover:border-[#D9C5B2]/50'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${industry === item.id ? 'text-[#D9C5B2]' : 'text-[#7E7F83]'}`} />
                                <span className={`text-sm ${industry === item.id ? 'text-[#14110F] dark:text-[#F3F3F4] font-medium' : 'text-[#7E7F83]'}`}>
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#14110F] dark:text-[#F3F3F4] mb-3">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Audience Location
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {LOCATIONS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setLocation(item.id)}
                                className={`px-4 py-2 rounded-full border-2 transition-all ${location === item.id
                                        ? 'border-[#D9C5B2] bg-[#D9C5B2]/10 text-[#14110F] dark:text-[#F3F3F4] font-medium'
                                        : 'border-[#E8E8E9] dark:border-[#34312D] text-[#7E7F83] hover:border-[#D9C5B2]/50'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Platforms */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#14110F] dark:text-[#F3F3F4] mb-3">Platforms</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {PLATFORMS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => togglePlatform(item.id)}
                                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${platforms.includes(item.id)
                                        ? 'border-[#D9C5B2] bg-[#D9C5B2]/10'
                                        : 'border-[#E8E8E9] dark:border-[#34312D] hover:border-[#D9C5B2]/50'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${platforms.includes(item.id) ? 'text-[#D9C5B2]' : 'text-[#7E7F83]'}`} />
                                <span className={`text-sm ${platforms.includes(item.id) ? 'text-[#14110F] dark:text-[#F3F3F4] font-medium' : 'text-[#7E7F83]'}`}>
                                    {item.label}
                                </span>
                                {platforms.includes(item.id) && <Check className="w-4 h-4 text-[#D9C5B2] ml-auto" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Frequency */}
                <div>
                    <label className="block text-sm font-medium text-[#14110F] dark:text-[#F3F3F4] mb-3">Posting Frequency</label>
                    <div className="grid grid-cols-2 gap-2">
                        {FREQUENCIES.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setFrequency(item.id)}
                                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${frequency === item.id
                                        ? 'border-[#D9C5B2] bg-[#D9C5B2]/10'
                                        : 'border-[#E8E8E9] dark:border-[#34312D] hover:border-[#D9C5B2]/50'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${frequency === item.id ? 'text-[#D9C5B2]' : 'text-[#7E7F83]'}`} />
                                <span className={`text-sm ${frequency === item.id ? 'text-[#14110F] dark:text-[#F3F3F4] font-medium' : 'text-[#7E7F83]'}`}>
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#34312D] to-[#14110F] text-[#D9C5B2] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {saving ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                    ) : saved ? (
                        <><Check className="w-5 h-5" /> Saved!</>
                    ) : (
                        <><Save className="w-5 h-5" /> Save Changes</>
                    )}
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" /> Logout
                </button>
            </div>
        </div>
    )
}
