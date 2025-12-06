'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Zap, Loader2, Play, Trash2, ChevronRight, Sparkles, Youtube, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" /></svg>
)
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
)
const LinkedInIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" /></svg>
)

interface QueueItem { id: string; title: string; content: string; platform: string; priority: 'high' | 'medium' | 'low' }
interface Suggestion { item: QueueItem; suggestedSlots: { time: string; score: number; label: string }[] }

const platformIcons: Record<string, React.FC<{ className?: string }>> = { instagram: InstagramIcon, tiktok: TikTokIcon, youtube: Youtube, twitter: Twitter, linkedin: LinkedInIcon }
const priorityColors = { high: 'bg-red-500', medium: 'bg-yellow-500', low: 'bg-green-500' }

export default function SchedulerPage() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isScheduling, setIsScheduling] = useState(false)
    const [stats, setStats] = useState({ queueSize: 0, scheduledCount: 0 })

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [queueRes, suggRes] = await Promise.all([
                fetch('/api/scheduler'),
                fetch('/api/scheduler?action=suggestions')
            ])
            const queueData = await queueRes.json()
            const suggData = await suggRes.json()
            setStats({ queueSize: queueData.queue?.length || 0, scheduledCount: queueData.scheduled?.length || 0 })
            setSuggestions(suggData.suggestions || [])
        } catch (e) { console.error(e) }
        finally { setIsLoading(false) }
    }

    const autoScheduleAll = async () => {
        setIsScheduling(true)
        try {
            await fetch('/api/scheduler', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'autoSchedule' }) })
            fetchData()
        } catch (e) { console.error(e) }
        finally { setIsScheduling(false) }
    }

    const scheduleOne = async (itemId: string, time: string, score: number) => {
        try {
            await fetch('/api/scheduler', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'scheduleOne', itemId, scheduledTime: time, score }) })
            fetchData()
        } catch (e) { console.error(e) }
    }

    const getPlatformIcon = (p: string) => platformIcons[p] || Calendar

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-purple-500" />
                        Auto-Scheduler
                    </h1>
                    <p className="text-muted-foreground mt-1">AI distributes your content to optimal time slots</p>
                </div>
                <button
                    onClick={autoScheduleAll}
                    disabled={isScheduling || suggestions.length === 0}
                    className="inline-flex items-center justify-center rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 h-11 px-6 shadow-lg shadow-purple-500/25 disabled:opacity-50"
                >
                    {isScheduling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    Auto-Schedule All ({suggestions.length})
                </button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border bg-card p-4 shadow-sm"><p className="text-sm text-muted-foreground">In Queue</p><p className="text-3xl font-bold">{stats.queueSize}</p></div>
                <div className="rounded-xl border bg-card p-4 shadow-sm"><p className="text-sm text-muted-foreground">Scheduled</p><p className="text-3xl font-bold text-green-500">{stats.scheduledCount}</p></div>
            </div>

            {/* Content with AI Suggestions */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : suggestions.length === 0 ? (
                <div className="rounded-xl border bg-card p-12 text-center">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Queue is Empty</h3>
                    <p className="text-muted-foreground text-sm">Add content to your queue to get AI scheduling suggestions.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {suggestions.map((sugg, i) => {
                        const PlatformIcon = getPlatformIcon(sugg.item.platform)
                        return (
                            <motion.div
                                key={sugg.item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="rounded-xl border bg-card p-5 shadow-sm"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", priorityColors[sugg.item.priority])}>
                                            <PlatformIcon className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold">{sugg.item.title}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted capitalize">{sugg.item.priority}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">{sugg.item.content}</p>

                                        {/* AI Suggested Times */}
                                        <div className="flex flex-wrap gap-2">
                                            {sugg.suggestedSlots.map((slot, j) => (
                                                <button
                                                    key={j}
                                                    onClick={() => scheduleOne(sugg.item.id, slot.time, slot.score)}
                                                    className={cn(
                                                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all hover:border-primary hover:bg-primary/5",
                                                        j === 0 ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""
                                                    )}
                                                >
                                                    <Clock className="h-3 w-3" />
                                                    <span>{slot.label}</span>
                                                    <span className={cn("text-xs font-semibold", slot.score >= 85 ? "text-green-500" : "text-yellow-500")}>{slot.score}%</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
