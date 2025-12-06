'use client'

import React, { useState, useEffect } from 'react'
import { Activity, FileText, MessageSquare, Clock, Globe, LogIn, Settings, Filter, RefreshCw, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ActivityItem {
    id: string
    type: string
    user: { name: string; avatar: string; role: string }
    action: string
    target?: string
    details?: string
    platform?: string
    timestamp: string
}

const typeIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
    content_created: { icon: FileText, color: 'bg-blue-500' },
    status_changed: { icon: RefreshCw, color: 'bg-yellow-500' },
    comment_added: { icon: MessageSquare, color: 'bg-green-500' },
    scheduled: { icon: Clock, color: 'bg-purple-500' },
    published: { icon: Globe, color: 'bg-pink-500' },
    login: { icon: LogIn, color: 'bg-gray-500' },
    settings_changed: { icon: Settings, color: 'bg-orange-500' },
}

const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

export default function ActivityPage() {
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [stats, setStats] = useState({ totalActions: 0, teamMembers: 0, actionsToday: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => { fetchActivities() }, [filter])

    const fetchActivities = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/activity?type=${filter}`)
            const data = await res.json()
            setActivities(data.activities || [])
            setStats(data.stats || {})
        } catch (e) { console.error(e) }
        finally { setIsLoading(false) }
    }

    const filterTypes = ['all', 'content_created', 'status_changed', 'comment_added', 'scheduled', 'published']

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Activity className="h-8 w-8 text-green-500" />
                        Team Activity
                    </h1>
                    <p className="text-muted-foreground mt-1">Real-time log of team actions</p>
                </div>
                <button onClick={fetchActivities} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors">
                    <RefreshCw className="h-4 w-4" />Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-4 shadow-sm"><p className="text-sm text-muted-foreground">Total Actions</p><p className="text-3xl font-bold">{stats.totalActions}</p></div>
                <div className="rounded-xl border bg-card p-4 shadow-sm"><p className="text-sm text-muted-foreground">Team Members</p><p className="text-3xl font-bold">{stats.teamMembers}</p></div>
                <div className="rounded-xl border bg-card p-4 shadow-sm"><p className="text-sm text-muted-foreground">Today's Actions</p><p className="text-3xl font-bold text-green-500">{stats.actionsToday}</p></div>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
                {filterTypes.map(type => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={cn("px-3 py-1.5 rounded-lg border text-sm transition-all capitalize", filter === type ? "border-primary bg-primary/10" : "hover:bg-accent")}
                    >
                        {type.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Activity Feed */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="divide-y">
                        {activities.map((activity, i) => {
                            const typeInfo = typeIcons[activity.type] || typeIcons.content_created
                            const Icon = typeInfo.icon
                            return (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0", typeInfo.color)}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">{activity.user.avatar}</div>
                                            <span className="font-semibold text-sm">{activity.user.name}</span>
                                            <span className="text-xs text-muted-foreground">{activity.user.role}</span>
                                        </div>
                                        <p className="text-sm">
                                            <span className="text-muted-foreground">{activity.action}</span>
                                            {activity.target && <span className="font-medium"> {activity.target}</span>}
                                        </p>
                                        {activity.details && <p className="text-xs text-muted-foreground mt-1">"{activity.details}"</p>}
                                    </div>
                                    <span className="text-xs text-muted-foreground flex-shrink-0">{formatTimeAgo(activity.timestamp)}</span>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
