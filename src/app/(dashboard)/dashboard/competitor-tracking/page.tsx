'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users, Plus, Trash2, Loader2, Search, ArrowLeft, X,
    TrendingUp, Clock, Zap, Youtube, Instagram, Twitter, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Competitor {
    id: string
    name: string
    platform: string
    handle: string
    keywords: string[]
    createdAt: string
    lastChecked: string | null
    alerts: string[]
}

interface CompetitorAlert {
    competitor: string
    platform: string
    matchingTrends: string[]
}

const PLATFORMS = [
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'twitter', label: 'Twitter/X', icon: Twitter },
]

export default function CompetitorTrackingPage() {
    const [competitors, setCompetitors] = useState<Competitor[]>([])
    const [loading, setLoading] = useState(true)
    const [showAdd, setShowAdd] = useState(false)
    const [newName, setNewName] = useState('')
    const [newPlatform, setNewPlatform] = useState('youtube')
    const [newKeywords, setNewKeywords] = useState('')
    const [adding, setAdding] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [checking, setChecking] = useState(false)
    const [alerts, setAlerts] = useState<CompetitorAlert[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadCompetitors()
    }, [])

    const loadCompetitors = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/competitors')
            const data = await response.json()
            if (data.success) {
                setCompetitors(data.competitors || [])
            }
        } catch (err) {
            console.error('Failed to load:', err)
        } finally {
            setLoading(false)
        }
    }

    const addCompetitor = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName.trim()) return

        setAdding(true)
        setError(null)
        try {
            const response = await fetch('/api/competitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newName,
                    platform: newPlatform,
                    keywords: newKeywords.split(',').map(k => k.trim()).filter(k => k),
                }),
            })
            const data = await response.json()
            if (data.success) {
                setCompetitors(data.competitors)
                setNewName('')
                setNewKeywords('')
                setShowAdd(false)
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError('Failed to add competitor')
        } finally {
            setAdding(false)
        }
    }

    const deleteCompetitor = async (id: string) => {
        setDeleting(id)
        try {
            const response = await fetch(`/api/competitors?id=${id}`, { method: 'DELETE' })
            const data = await response.json()
            if (data.success) {
                setCompetitors(data.competitors)
            }
        } catch (err) {
            console.error('Failed to delete:', err)
        } finally {
            setDeleting(null)
        }
    }

    const checkTrends = async () => {
        setChecking(true)
        setAlerts([])
        try {
            const trendsResponse = await fetch('/api/trends/personalized')
            const trendsData = await trendsResponse.json()

            if (trendsData.success && trendsData.trends) {
                const trendTitles = trendsData.trends.map((t: any) => t.title)

                const checkResponse = await fetch('/api/competitors', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ trends: trendTitles }),
                })
                const checkData = await checkResponse.json()

                if (checkData.success) {
                    setAlerts(checkData.alerts || [])
                    setCompetitors(checkData.competitors)
                }
            }
        } catch (err) {
            console.error('Failed to check:', err)
        } finally {
            setChecking(false)
        }
    }

    const getPlatformIcon = (platform: string) => {
        const p = PLATFORMS.find(p => p.id === platform)
        return p?.icon || Users
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
                <Link href="/dashboard" className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[#7E7F83]" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-[#14110F] dark:text-[#F3F3F4] flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-500" />
                        Competitor Tracking
                    </h1>
                    <p className="text-[#7E7F83] text-sm">Monitor when competitors are trending</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={checkTrends}
                        disabled={checking || competitors.length === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D9C5B2] text-[#14110F] font-medium hover:bg-[#C4B09D] transition-colors disabled:opacity-50"
                    >
                        {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        Check
                    </button>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#34312D] text-[#D9C5B2] font-medium hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>
            </div>

            {/* Alerts */}
            <AnimatePresence>
                {alerts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                        <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-red-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium text-red-700 dark:text-red-400 mb-2">
                                    {alerts.length} competitor{alerts.length > 1 ? 's' : ''} trending!
                                </p>
                                {alerts.map((alert, i) => (
                                    <div key={i} className="text-sm mb-1">
                                        <span className="font-medium text-red-600">{alert.competitor}</span>
                                        <span className="text-red-600/70"> → {alert.matchingTrends.join(', ')}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setAlerts([])} className="p-1 hover:bg-red-100 rounded">
                                <X className="w-4 h-4 text-red-600" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Form Modal */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAdd(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-[#1A1714] rounded-2xl p-6 w-full max-w-md"
                        >
                            <h2 className="text-lg font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-4">Add Competitor</h2>
                            <form onSubmit={addCompetitor} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-[#7E7F83] mb-1">Competitor Name</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="e.g., MrBeast, Marques Brownlee"
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8E9] dark:border-[#34312D] bg-white dark:bg-[#14110F] text-[#14110F] dark:text-[#F3F3F4]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#7E7F83] mb-1">Platform</label>
                                    <div className="flex gap-2">
                                        {PLATFORMS.map((p) => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setNewPlatform(p.id)}
                                                className={cn(
                                                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all",
                                                    newPlatform === p.id
                                                        ? "border-[#D9C5B2] bg-[#D9C5B2]/10"
                                                        : "border-[#E8E8E9] dark:border-[#34312D]"
                                                )}
                                            >
                                                <p.icon className="w-4 h-4" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#7E7F83] mb-1">Keywords (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={newKeywords}
                                        onChange={(e) => setNewKeywords(e.target.value)}
                                        placeholder="e.g., tech review, unboxing"
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8E9] dark:border-[#34312D] bg-white dark:bg-[#14110F] text-[#14110F] dark:text-[#F3F3F4]"
                                    />
                                </div>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl border border-[#E8E8E9] dark:border-[#34312D] text-[#7E7F83]">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={adding || !newName.trim()} className="flex-1 py-2.5 rounded-xl bg-[#34312D] text-[#D9C5B2] font-medium disabled:opacity-50">
                                        {adding ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Competitors List */}
            {competitors.length === 0 ? (
                <div className="text-center py-16 px-8 bg-white dark:bg-[#1A1714] rounded-xl border border-[#E8E8E9] dark:border-[#34312D]">
                    <Users className="w-12 h-12 mx-auto text-blue-500/50 mb-4" />
                    <h2 className="text-lg font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-2">No competitors yet</h2>
                    <p className="text-[#7E7F83] max-w-md mx-auto mb-6">
                        Add competitors to track when they're trending. Stay ahead of the game!
                    </p>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#34312D] text-[#D9C5B2] font-medium"
                    >
                        <Plus className="w-5 h-5" /> Add Competitor
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {competitors.map((comp) => {
                        const PlatformIcon = getPlatformIcon(comp.platform)
                        return (
                            <motion.div
                                key={comp.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-4 p-4 bg-white dark:bg-[#1A1714] rounded-xl border border-[#E8E8E9] dark:border-[#34312D] group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <PlatformIcon className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-[#14110F] dark:text-[#F3F3F4]">{comp.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-[#7E7F83]">
                                        <span>{PLATFORMS.find(p => p.id === comp.platform)?.label}</span>
                                        {comp.keywords.length > 0 && (
                                            <span>• {comp.keywords.slice(0, 3).join(', ')}</span>
                                        )}
                                    </div>
                                </div>
                                {comp.alerts && comp.alerts.length > 0 && (
                                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                        Trending!
                                    </span>
                                )}
                                <button
                                    onClick={() => deleteCompetitor(comp.id)}
                                    disabled={deleting === comp.id}
                                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                >
                                    {deleting === comp.id ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4 text-red-500" />}
                                </button>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
