'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell, Plus, Trash2, Loader2, Search, Check, AlertCircle,
    TrendingUp, Clock, Zap, ArrowLeft, X
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface KeywordAlert {
    id: string
    keyword: string
    createdAt: string
    matchCount: number
    lastMatch: string | null
}

interface AlertMatch {
    keyword: string
    matchingTrends: string[]
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<KeywordAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [newKeyword, setNewKeyword] = useState('')
    const [adding, setAdding] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [checking, setChecking] = useState(false)
    const [matches, setMatches] = useState<AlertMatch[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadAlerts()
    }, [])

    const loadAlerts = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/alerts')
            const data = await response.json()
            if (data.success) {
                setAlerts(data.alerts || [])
            }
        } catch (err) {
            console.error('Failed to load alerts:', err)
        } finally {
            setLoading(false)
        }
    }

    const addKeyword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newKeyword.trim() || newKeyword.length < 2) return

        setAdding(true)
        setError(null)
        try {
            const response = await fetch('/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword: newKeyword }),
            })
            const data = await response.json()
            if (data.success) {
                setAlerts(data.alerts)
                setNewKeyword('')
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError('Failed to add keyword')
        } finally {
            setAdding(false)
        }
    }

    const deleteAlert = async (id: string) => {
        setDeleting(id)
        try {
            const response = await fetch(`/api/alerts?id=${id}`, { method: 'DELETE' })
            const data = await response.json()
            if (data.success) {
                setAlerts(data.alerts)
            }
        } catch (err) {
            console.error('Failed to delete:', err)
        } finally {
            setDeleting(null)
        }
    }

    const checkTrends = async () => {
        setChecking(true)
        setMatches([])
        try {
            // First fetch current trends
            const trendsResponse = await fetch('/api/trends/personalized')
            const trendsData = await trendsResponse.json()

            if (trendsData.success && trendsData.trends) {
                const trendTitles = trendsData.trends.map((t: any) => t.title)

                // Check alerts against trends
                const checkResponse = await fetch('/api/alerts', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ trends: trendTitles }),
                })
                const checkData = await checkResponse.json()

                if (checkData.success) {
                    setMatches(checkData.matches || [])
                    setAlerts(checkData.alerts)
                }
            }
        } catch (err) {
            console.error('Failed to check trends:', err)
        } finally {
            setChecking(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
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
                <Link
                    href="/dashboard"
                    className="p-2 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-[#7E7F83]" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-[#14110F] dark:text-[#F3F3F4] flex items-center gap-2">
                        <Bell className="w-6 h-6 text-amber-500" />
                        Keyword Alerts
                    </h1>
                    <p className="text-[#7E7F83] text-sm">
                        Get notified when your keywords start trending
                    </p>
                </div>
                <button
                    onClick={checkTrends}
                    disabled={checking || alerts.length === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D9C5B2] text-[#14110F] font-medium hover:bg-[#C4B09D] transition-colors disabled:opacity-50"
                >
                    {checking ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</>
                    ) : (
                        <><Search className="w-4 h-4" /> Check Trends</>
                    )}
                </button>
            </div>

            {/* Matches Alert */}
            <AnimatePresence>
                {matches.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                    >
                        <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-emerald-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                                    {matches.length} keyword{matches.length > 1 ? 's' : ''} trending now!
                                </p>
                                <div className="space-y-2">
                                    {matches.map((match, i) => (
                                        <div key={i} className="text-sm">
                                            <span className="font-medium text-emerald-600 dark:text-emerald-300">
                                                "{match.keyword}"
                                            </span>
                                            <span className="text-emerald-600/70 dark:text-emerald-300/70">
                                                {' '}→ {match.matchingTrends.slice(0, 3).join(', ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setMatches([])} className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded">
                                <X className="w-4 h-4 text-emerald-600" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Keyword Form */}
            <form onSubmit={addKeyword} className="mb-6">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="Enter a keyword to track (e.g., 'AI', 'iPhone', 'crypto')"
                            className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E8E9] dark:border-[#34312D] bg-white dark:bg-[#1A1714] text-[#14110F] dark:text-[#F3F3F4] placeholder:text-[#7E7F83] focus:border-[#D9C5B2] outline-none transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={adding || newKeyword.length < 2}
                        className="px-5 py-3 rounded-xl bg-[#34312D] text-[#D9C5B2] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                    >
                        {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        Add
                    </button>
                </div>
                {error && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </p>
                )}
            </form>

            {/* Keywords List */}
            {alerts.length === 0 ? (
                <div className="text-center py-16 px-8 bg-white dark:bg-[#1A1714] rounded-xl border border-[#E8E8E9] dark:border-[#34312D]">
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-2">
                        No keyword alerts yet
                    </h2>
                    <p className="text-[#7E7F83] max-w-md mx-auto">
                        Add keywords you want to track. When they appear in trending topics, you'll be notified.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 p-4 bg-white dark:bg-[#1A1714] rounded-xl border border-[#E8E8E9] dark:border-[#34312D] group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-amber-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-[#14110F] dark:text-[#F3F3F4]">
                                    {alert.keyword}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-[#7E7F83]">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Added {formatDate(alert.createdAt)}
                                    </span>
                                    {alert.matchCount > 0 && (
                                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                            <TrendingUp className="w-3 h-3" />
                                            {alert.matchCount} matches
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => deleteAlert(alert.id)}
                                disabled={deleting === alert.id}
                                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            >
                                {deleting === alert.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                ) : (
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Tip */}
            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                        <p className="font-medium text-sm text-amber-700 dark:text-amber-400">
                            Pro Tip
                        </p>
                        <p className="text-sm text-amber-600 dark:text-amber-300">
                            Add broad keywords like "AI", "iPhone", or your niche topics. Check trends regularly to catch trending opportunities early.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
