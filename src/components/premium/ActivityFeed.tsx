'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Clock,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    MessageCircle,
    Heart,
    Share2,
    Bell,
    Zap,
    TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Activity Item
interface ActivityItemProps {
    id: string
    type: 'create' | 'update' | 'delete' | 'comment' | 'like' | 'share' | 'approve' | 'alert'
    user: { name: string; avatar?: string }
    message: string
    time: string
    read?: boolean
}

const activityIcons = {
    create: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    update: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    delete: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
    comment: { icon: MessageCircle, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    like: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/30' },
    share: { icon: Share2, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
    approve: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    alert: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
}

export function ActivityItem({ type, user, message, time, read = true }: ActivityItemProps) {
    const { icon: Icon, color, bg } = activityIcons[type]

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "flex gap-4 p-4 rounded-xl transition-colors",
                !read && "bg-violet-50 dark:bg-violet-900/10"
            )}
        >
            {/* Icon */}
            <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">{user.name}</span>{' '}
                    {message}
                </p>
                <p className="text-xs text-slate-500 mt-1">{time}</p>
            </div>

            {/* Unread indicator */}
            {!read && (
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-violet-500 mt-2" />
            )}
        </motion.div>
    )
}

// Activity Timeline
interface TimelineProps {
    items: ActivityItemProps[]
    maxItems?: number
}

export function ActivityTimeline({ items, maxItems }: TimelineProps) {
    const displayItems = maxItems ? items.slice(0, maxItems) : items

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-700" />

            {/* Items */}
            <div className="space-y-2">
                <AnimatePresence>
                    {displayItems.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <ActivityItem {...item} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}

// Notification Card
interface NotificationCardProps {
    title: string
    message: string
    type?: 'info' | 'success' | 'warning' | 'error'
    time?: string
    actionLabel?: string
    onAction?: () => void
    onDismiss?: () => void
}

export function NotificationCard({
    title,
    message,
    type = 'info',
    time,
    actionLabel,
    onAction,
    onDismiss,
}: NotificationCardProps) {
    const types = {
        info: { icon: Bell, gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        success: { icon: CheckCircle, gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        warning: { icon: AlertCircle, gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        error: { icon: XCircle, gradient: 'from-red-500 to-rose-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    }

    const t = types[type]
    const Icon = t.icon

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={cn("rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700", t.bg)}
        >
            {/* Gradient accent */}
            <div className={cn("h-1 bg-gradient-to-r", t.gradient)} />

            <div className="p-4">
                <div className="flex gap-4">
                    {/* Icon */}
                    <div className={cn("p-2 rounded-xl bg-gradient-to-br text-white", t.gradient)}>
                        <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-slate-900 dark:text-white">{title}</h4>
                            {time && <span className="text-xs text-slate-500">{time}</span>}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{message}</p>

                        {/* Actions */}
                        {(actionLabel || onDismiss) && (
                            <div className="flex items-center gap-3 mt-3">
                                {actionLabel && (
                                    <button
                                        onClick={onAction}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r",
                                            t.gradient
                                        )}
                                    >
                                        {actionLabel}
                                    </button>
                                )}
                                {onDismiss && (
                                    <button
                                        onClick={onDismiss}
                                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    >
                                        Dismiss
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// Live Indicator
export function LiveIndicator({ label = 'LIVE' }: { label?: string }) {
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold">
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-white"
            />
            {label}
        </div>
    )
}

// Real-time Counter
interface LiveCounterProps {
    value: number
    label: string
    icon?: React.ReactNode
}

export function LiveCounter({ value, label, icon }: LiveCounterProps) {
    const [displayValue, setDisplayValue] = React.useState(value)
    const [flash, setFlash] = React.useState(false)

    React.useEffect(() => {
        if (value !== displayValue) {
            setFlash(true)
            setTimeout(() => setFlash(false), 300)
            setDisplayValue(value)
        }
    }, [value, displayValue])

    return (
        <div className={cn(
            "flex items-center gap-3 p-4 rounded-xl border transition-all duration-300",
            flash
                ? "bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-700"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
        )}>
            {icon && (
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                    {icon}
                </div>
            )}
            <div>
                <motion.p
                    key={displayValue}
                    initial={{ scale: 1.2, color: '#8b5cf6' }}
                    animate={{ scale: 1, color: 'inherit' }}
                    className="text-2xl font-bold text-slate-900 dark:text-white"
                >
                    {displayValue.toLocaleString()}
                </motion.p>
                <p className="text-xs text-slate-500">{label}</p>
            </div>
            <LiveIndicator />
        </div>
    )
}
