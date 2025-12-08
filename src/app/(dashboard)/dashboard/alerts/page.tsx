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
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 font-sans text-black">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard"
                    className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                    <ArrowLeft className="w-5 h-5 text-black" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <Bell className="w-8 h-8 text-black fill-[#FFC900]" />
                        Keyword Alerts
                    </h1>
                    <p className="text-black font-bold border-l-4 border-black pl-3 mt-2">
                        Get notified when your keywords go viral
                    </p>
                </div>
                <button
                    onClick={checkTrends}
                    disabled={checking || alerts.length === 0}
                    className="flex items-center gap-2 px-5 py-3 bg-[#FFC900] border-2 border-black shadow-[4px_4px_0px_0px_#000] text-black font-black uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                >
                    {checking ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</>
                    ) : (
                        <><Search className="w-4 h-4" strokeWidth={3} /> CHECK TRENDS</>
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
                        className="mb-8 p-6 bg-[#B1F202] border-2 border-black shadow-[6px_6px_0px_0px_#000]"
                    >
                        <div className="flex items-start gap-4">
                            <Zap className="w-6 h-6 text-black fill-white mt-1" />
                            <div className="flex-1">
                                <p className="font-black text-xl text-black uppercase mb-2">
                                    {matches.length} keyword{matches.length > 1 ? 's' : ''} trending now!
                                </p>
                                <div className="space-y-2">
                                    {matches.map((match, i) => (
                                        <div key={i} className="text-sm font-bold border-b-2 border-black/20 pb-1 last:border-0">
                                            <span className="uppercase text-black">
                                                "{match.keyword}"
                                            </span>
                                            <span className="text-black/70">
                                                {' '}→ {match.matchingTrends.slice(0, 3).join(', ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setMatches([])} className="p-1 hover:bg-black/10 rounded">
                                <X className="w-6 h-6 text-black" strokeWidth={3} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Keyword Form */}
            <form onSubmit={addKeyword} className="mb-8">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="Type a keyword (e.g., 'AI', 'Crypto', 'Gaming')..."
                            className="w-full px-4 py-4 border-2 border-black shadow-[4px_4px_0px_0px_#000] text-lg font-bold placeholder:text-gray-400 focus:outline-none focus:bg-[#FFF9E5] transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={adding || newKeyword.length < 2}
                        className="px-6 py-4 bg-black text-white font-black uppercase tracking-wide border-2 border-transparent hover:bg-[#FF90E8] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_#000] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" strokeWidth={3} />}
                        ADD
                    </button>
                </div>
                {error && (
                    <p className="text-sm text-red-600 font-bold mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </p>
                )}
            </form>

            {/* Keywords List */}
            {alerts.length === 0 ? (
                <div className="text-center py-16 px-8 bg-white border-2 border-black border-dashed">
                    <div className="w-16 h-16 bg-[#FFC900] border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_#000]">
                        <Bell className="w-8 h-8 text-black" />
                    </div>
                    <h2 className="text-xl font-black text-black uppercase mb-2">
                        No alerts configured
                    </h2>
                    <p className="text-gray-600 font-medium max-w-md mx-auto">
                        Track specific topics. We'll notify you when they appear in the top charts.
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]"
                        >
                            <div className="w-12 h-12 bg-[#F3F3F3] border-2 border-black flex items-center justify-center font-black text-xl">
                                #
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-xl text-black uppercase">
                                    {alert.keyword}
                                </p>
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        ADDED {formatDate(alert.createdAt).toUpperCase()}
                                    </span>
                                    {alert.matchCount > 0 && (
                                        <span className="flex items-center gap-1 text-black bg-[#B1F202] px-1 border border-black">
                                            <TrendingUp className="w-3 h-3" />
                                            {alert.matchCount} MATCHES
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => deleteAlert(alert.id)}
                                disabled={deleting === alert.id}
                                className="p-3 border-2 border-transparent hover:border-black hover:bg-red-500 hover:text-white transition-all rounded-none"
                            >
                                {deleting === alert.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Tip */}
            <div className="mt-12 p-6 bg-white border-2 border-black shadow-[8px_8px_0px_0px_#FF90E8]">
                <div className="flex items-start gap-4">
                    <Zap className="w-8 h-8 text-black fill-[#FFC900]" />
                    <div>
                        <p className="font-black text-xl uppercase mb-1">
                            Pro Strategy
                        </p>
                        <p className="font-medium text-black">
                            Add broad keywords like "AI", "iPhone", or your niche topics. Check trends regularly to catch trending opportunities early.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
