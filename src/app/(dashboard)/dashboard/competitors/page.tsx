'use client'

import React, { useState, useEffect } from 'react'
import {
    Users,
    Plus,
    Trash2,
    Edit3,
    ExternalLink,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Globe,
    Youtube,
    Twitter,
    Loader2,
    X,
    Check,
    Eye,
    Heart,
    MessageCircle,
    RefreshCw,
    Target,
    Instagram
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

// LinkedIn icon
const LinkedInIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)

// Types
interface SocialProfile {
    platform: string
    username: string
    url: string
    followers: number
    following: number
    posts: number
    avgEngagement: number
    growth: number
}

interface TopContent {
    id: string
    platform: string
    type: string
    title: string
    engagement: number
    views?: number
    likes: number
    comments: number
    date: string
}

interface Competitor {
    id: string
    name: string
    description: string
    website: string
    logoUrl: string
    profiles: SocialProfile[]
    topContent: TopContent[]
    postingFrequency: {
        daily: number
        weekly: number
        monthly: number
    }
    addedAt: string
    lastAnalyzed: string
}

const platformOptions = [
    { id: 'website', label: 'Website', icon: Globe, color: 'bg-gray-500' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-red-600' },
    { id: 'tiktok', label: 'TikTok', icon: TikTokIcon, color: 'bg-black' },
    { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: 'bg-sky-500' },
    { id: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon, color: 'bg-blue-700' },
]

export default function CompetitorsPage() {
    const [competitors, setCompetitors] = useState<Competitor[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null)
    const [stats, setStats] = useState({ total: 0, totalFollowers: 0, avgEngagement: '0', mostActive: '' })

    // Add form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        profiles: [] as { platform: string; username: string; url: string }[]
    })
    const [newProfile, setNewProfile] = useState({ platform: 'instagram', username: '', url: '' })

    useEffect(() => {
        fetchCompetitors()
    }, [])

    const fetchCompetitors = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/competitors')
            const data = await response.json()
            setCompetitors(data.competitors || [])
            setStats(data.stats || { total: 0, totalFollowers: 0, avgEngagement: '0', mostActive: '' })
        } catch (error) {
            console.error('Failed to fetch competitors:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const addCompetitor = async () => {
        if (!formData.name.trim() || formData.profiles.length === 0) return

        try {
            const response = await fetch('/api/competitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (data.success) {
                setShowAddModal(false)
                setFormData({ name: '', description: '', profiles: [] })
                fetchCompetitors()
            }
        } catch (error) {
            console.error('Failed to add competitor:', error)
        }
    }

    const deleteCompetitor = async (id: string) => {
        try {
            await fetch(`/api/competitors?id=${id}`, { method: 'DELETE' })
            fetchCompetitors()
            if (selectedCompetitor?.id === id) setSelectedCompetitor(null)
        } catch (error) {
            console.error('Failed to delete competitor:', error)
        }
    }

    const addProfile = () => {
        if (!newProfile.username.trim()) return
        setFormData({
            ...formData,
            profiles: [...formData.profiles, { ...newProfile }]
        })
        setNewProfile({ platform: 'instagram', username: '', url: '' })
    }

    const removeProfile = (index: number) => {
        setFormData({
            ...formData,
            profiles: formData.profiles.filter((_, i) => i !== index)
        })
    }

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    const getPlatformIcon = (platformId: string) => {
        return platformOptions.find(p => p.id === platformId)?.icon || Globe
    }

    const getPlatformColor = (platformId: string) => {
        return platformOptions.find(p => p.id === platformId)?.color || 'bg-gray-500'
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Target className="h-8 w-8 text-orange-500" />
                        Competitor Tracking
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor competitors across all platforms
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center justify-center rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Competitor
                </button>
            </div>

            {/* Stats */}
            {competitors.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">Competitors</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">Total Followers</p>
                        <p className="text-2xl font-bold">{formatNumber(stats.totalFollowers)}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">Avg Engagement</p>
                        <p className="text-2xl font-bold">{stats.avgEngagement}%</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">Most Active</p>
                        <p className="text-lg font-bold truncate">{stats.mostActive || '-'}</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : competitors.length === 0 ? (
                <div className="rounded-xl border bg-card p-12 shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Add Your First Competitor</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Track competitors across Instagram, YouTube, TikTok, Twitter, LinkedIn, and more.
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center justify-center rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Competitor
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Competitors List */}
                    <div className="space-y-4">
                        {competitors.map((comp, i) => (
                            <motion.div
                                key={comp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedCompetitor(comp)}
                                className={cn(
                                    "rounded-xl border bg-card p-4 shadow-sm cursor-pointer transition-all hover:shadow-md",
                                    selectedCompetitor?.id === comp.id && "ring-2 ring-primary"
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <img
                                        src={comp.logoUrl}
                                        alt={comp.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold truncate">{comp.name}</h3>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteCompetitor(comp.id); }}
                                                className="p-1 rounded hover:bg-red-100 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {comp.profiles.slice(0, 4).map((profile, j) => {
                                                const Icon = getPlatformIcon(profile.platform)
                                                return (
                                                    <div
                                                        key={j}
                                                        className={cn(
                                                            "w-6 h-6 rounded-full flex items-center justify-center text-white",
                                                            getPlatformColor(profile.platform)
                                                        )}
                                                    >
                                                        <Icon className="h-3 w-3" />
                                                    </div>
                                                )
                                            })}
                                            {comp.profiles.length > 4 && (
                                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                                                    +{comp.profiles.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm">
                                    <span className="text-muted-foreground">
                                        {formatNumber(comp.profiles.reduce((s, p) => s + p.followers, 0))} followers
                                    </span>
                                    <span className="text-muted-foreground">
                                        {comp.postingFrequency.weekly}/week
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Selected Competitor Details */}
                    <div className="lg:col-span-2">
                        {selectedCompetitor ? (
                            <div className="space-y-6">
                                {/* Profile Header */}
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={selectedCompetitor.logoUrl}
                                            alt={selectedCompetitor.name}
                                            className="w-16 h-16 rounded-xl object-cover"
                                        />
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold">{selectedCompetitor.name}</h2>
                                            <p className="text-sm text-muted-foreground">{selectedCompetitor.description}</p>
                                            {selectedCompetitor.website && (
                                                <a
                                                    href={selectedCompetitor.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                                                >
                                                    <Globe className="h-3 w-3" />
                                                    {selectedCompetitor.website}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Social Profiles */}
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Social Profiles
                                    </h3>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {selectedCompetitor.profiles.map((profile, i) => {
                                            const Icon = getPlatformIcon(profile.platform)
                                            return (
                                                <div key={i} className="rounded-lg border p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-lg flex items-center justify-center text-white",
                                                            getPlatformColor(profile.platform)
                                                        )}>
                                                            <Icon className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">@{profile.username}</p>
                                                            <p className="text-xs text-muted-foreground capitalize">{profile.platform}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <p className="text-muted-foreground">Followers</p>
                                                            <p className="font-semibold">{formatNumber(profile.followers)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Engagement</p>
                                                            <p className="font-semibold">{profile.avgEngagement}%</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Posts</p>
                                                            <p className="font-semibold">{formatNumber(profile.posts)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Growth</p>
                                                            <p className={cn(
                                                                "font-semibold flex items-center gap-1",
                                                                profile.growth >= 0 ? "text-green-500" : "text-red-500"
                                                            )}>
                                                                {profile.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                                {profile.growth >= 0 ? '+' : ''}{profile.growth}%
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Top Content */}
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-green-500" />
                                        Top Performing Content
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedCompetitor.topContent.map((content) => (
                                            <div key={content.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0",
                                                    getPlatformColor(content.platform)
                                                )}>
                                                    {React.createElement(getPlatformIcon(content.platform), { className: "h-5 w-5" })}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{content.title}</p>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                        {content.views && (
                                                            <span className="flex items-center gap-1">
                                                                <Eye className="h-3 w-3" />
                                                                {formatNumber(content.views)}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="h-3 w-3" />
                                                            {formatNumber(content.likes)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageCircle className="h-3 w-3" />
                                                            {formatNumber(content.comments)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-green-500">{content.engagement}%</p>
                                                    <p className="text-xs text-muted-foreground">{content.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Posting Frequency */}
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <RefreshCw className="h-5 w-5" />
                                        Posting Frequency
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="p-4 rounded-lg bg-muted">
                                            <p className="text-2xl font-bold">{selectedCompetitor.postingFrequency.daily}</p>
                                            <p className="text-xs text-muted-foreground">Daily</p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-muted">
                                            <p className="text-2xl font-bold">{selectedCompetitor.postingFrequency.weekly}</p>
                                            <p className="text-xs text-muted-foreground">Weekly</p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-muted">
                                            <p className="text-2xl font-bold">{selectedCompetitor.postingFrequency.monthly}</p>
                                            <p className="text-xs text-muted-foreground">Monthly</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border bg-card p-12 shadow-sm text-center">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">Select a competitor to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add Competitor Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative z-50 w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl border bg-card p-6 shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Add Competitor</h2>
                                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-md hover:bg-muted">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Competitor Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Nike, Apple, Competitor Co."
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Description</label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>

                                {/* Add Social Profiles */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Social Profiles *</label>
                                    <div className="flex gap-2 mb-2">
                                        <select
                                            value={newProfile.platform}
                                            onChange={(e) => setNewProfile({ ...newProfile, platform: e.target.value })}
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        >
                                            {platformOptions.map((p) => (
                                                <option key={p.id} value={p.id}>{p.label}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={newProfile.username}
                                            onChange={(e) => setNewProfile({ ...newProfile, username: e.target.value })}
                                            placeholder="Username"
                                            className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        />
                                        <button
                                            onClick={addProfile}
                                            disabled={!newProfile.username.trim()}
                                            className="h-10 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Added Profiles */}
                                    {formData.profiles.length > 0 && (
                                        <div className="space-y-2 mt-3">
                                            {formData.profiles.map((profile, i) => {
                                                const Icon = getPlatformIcon(profile.platform)
                                                return (
                                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn(
                                                                "w-6 h-6 rounded flex items-center justify-center text-white",
                                                                getPlatformColor(profile.platform)
                                                            )}>
                                                                <Icon className="h-3 w-3" />
                                                            </div>
                                                            <span className="text-sm">@{profile.username}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => removeProfile(i)}
                                                            className="p-1 rounded hover:bg-background"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 rounded-md border hover:bg-accent transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={addCompetitor}
                                        disabled={!formData.name.trim() || formData.profiles.length === 0}
                                        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                    >
                                        Add Competitor
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
