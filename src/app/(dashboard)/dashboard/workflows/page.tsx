'use client'

import React, { useState, useEffect } from 'react'
import {
    FileText,
    Send,
    CheckCircle,
    Clock,
    Globe,
    MessageSquare,
    ChevronRight,
    Plus,
    Loader2,
    ArrowRight,
    X,
    Youtube,
    Twitter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

interface ContentItem {
    id: string
    title: string
    content: string
    platform: string
    status: 'draft' | 'review' | 'approved' | 'scheduled' | 'published'
    createdBy: string
    createdAt: string
    comments: { user: string; text: string; timestamp: string }[]
    history: { status: string; user: string; timestamp: string; note?: string }[]
}

const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-500', icon: FileText },
    review: { label: 'In Review', color: 'bg-yellow-500', icon: Send },
    approved: { label: 'Approved', color: 'bg-green-500', icon: CheckCircle },
    scheduled: { label: 'Scheduled', color: 'bg-blue-500', icon: Clock },
    published: { label: 'Published', color: 'bg-purple-500', icon: Globe },
}

const platformIcons: Record<string, React.FC<{ className?: string }>> = {
    instagram: InstagramIcon, tiktok: TikTokIcon, youtube: Youtube, twitter: Twitter, linkedin: LinkedInIcon
}

export default function WorkflowsPage() {
    const [items, setItems] = useState<ContentItem[]>([])
    const [stats, setStats] = useState({ draft: 0, review: 0, approved: 0, scheduled: 0, published: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
    const [filter, setFilter] = useState('all')

    useEffect(() => { fetchItems() }, [filter])

    const fetchItems = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/workflows?status=${filter}`)
            const data = await res.json()
            setItems(data.items || [])
            setStats(data.stats || {})
        } catch (e) { console.error(e) }
        finally { setIsLoading(false) }
    }

    const updateStatus = async (id: string, newStatus: string, note?: string) => {
        try {
            await fetch('/api/workflows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'updateStatus', id, newStatus, note })
            })
            fetchItems()
            setSelectedItem(null)
        } catch (e) { console.error(e) }
    }

    const getPlatformIcon = (p: string) => platformIcons[p] || Globe

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="h-8 w-8 text-indigo-500" />
                        Approval Workflows
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage content through Draft → Review → Approved → Scheduled</p>
                </div>
            </div>

            {/* Pipeline Overview */}
            <div className="grid gap-4 sm:grid-cols-5">
                {Object.entries(statusConfig).map(([key, config]) => {
                    const Icon = config.icon
                    const count = stats[key as keyof typeof stats] || 0
                    return (
                        <button
                            key={key}
                            onClick={() => setFilter(filter === key ? 'all' : key)}
                            className={cn(
                                "rounded-xl border p-4 text-left transition-all hover:shadow-md",
                                filter === key ? "ring-2 ring-primary" : ""
                            )}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", config.color)}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <span className="text-2xl font-bold">{count}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{config.label}</p>
                        </button>
                    )
                })}
            </div>

            {/* Content Items */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, i) => {
                        const statusInfo = statusConfig[item.status]
                        const StatusIcon = statusInfo.icon
                        const PlatformIcon = getPlatformIcon(item.platform)
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedItem(item)}
                                className="rounded-xl border bg-card p-4 shadow-sm cursor-pointer hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", statusInfo.color)}>
                                            <StatusIcon className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs font-medium">{statusInfo.label}</span>
                                    </div>
                                    <PlatformIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold mb-1 line-clamp-1">{item.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.content}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>by {item.createdBy}</span>
                                    {item.comments.length > 0 && (
                                        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{item.comments.length}</span>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-50 w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl border bg-card p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">{selectedItem.title}</h2>
                                <button onClick={() => setSelectedItem(null)} className="p-2 rounded-md hover:bg-muted"><X className="h-5 w-5" /></button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{selectedItem.content}</p>

                            {/* Status Actions */}
                            <div className="space-y-2 mb-4">
                                <p className="text-sm font-medium">Move to:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedItem.status === 'draft' && <button onClick={() => updateStatus(selectedItem.id, 'review')} className="px-3 py-1.5 rounded-lg bg-yellow-500 text-white text-sm">Submit for Review</button>}
                                    {selectedItem.status === 'review' && (
                                        <>
                                            <button onClick={() => updateStatus(selectedItem.id, 'draft')} className="px-3 py-1.5 rounded-lg bg-gray-500 text-white text-sm">Back to Draft</button>
                                            <button onClick={() => updateStatus(selectedItem.id, 'approved')} className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm">Approve</button>
                                        </>
                                    )}
                                    {selectedItem.status === 'approved' && (
                                        <>
                                            <button onClick={() => updateStatus(selectedItem.id, 'review')} className="px-3 py-1.5 rounded-lg bg-yellow-500 text-white text-sm">Back to Review</button>
                                            <button onClick={() => updateStatus(selectedItem.id, 'scheduled')} className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm">Schedule</button>
                                        </>
                                    )}
                                    {selectedItem.status === 'scheduled' && <button onClick={() => updateStatus(selectedItem.id, 'published')} className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-sm">Mark Published</button>}
                                </div>
                            </div>

                            {/* History */}
                            <div className="border-t pt-4">
                                <p className="text-sm font-medium mb-2">History</p>
                                <div className="space-y-2">
                                    {selectedItem.history.map((h, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs">
                                            <div className={cn("w-2 h-2 rounded-full mt-1", statusConfig[h.status as keyof typeof statusConfig]?.color || 'bg-gray-400')} />
                                            <div>
                                                <span className="font-medium">{h.user}</span> moved to <span className="capitalize">{h.status}</span>
                                                {h.note && <p className="text-muted-foreground">"{h.note}"</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
