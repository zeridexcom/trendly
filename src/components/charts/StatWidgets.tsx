'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    TrendingDown,
    Minus,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Heart,
    MessageCircle,
    Share2,
    Users,
    Zap,
    DollarSign,
    BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Stat Card with trend
interface StatCardProps {
    title: string
    value: string | number
    change?: number
    changeLabel?: string
    icon?: React.ReactNode
    gradient?: string
    size?: 'sm' | 'md' | 'lg'
    animate?: boolean
}

export function StatCard({
    title,
    value,
    change,
    changeLabel = 'vs last week',
    icon,
    gradient = 'from-violet-500 to-purple-600',
    size = 'md',
    animate = true,
}: StatCardProps) {
    const isPositive = change && change > 0
    const isNegative = change && change < 0

    const sizes = {
        sm: { card: 'p-4', title: 'text-xs', value: 'text-xl', icon: 'w-8 h-8' },
        md: { card: 'p-5', title: 'text-sm', value: 'text-2xl', icon: 'w-10 h-10' },
        lg: { card: 'p-6', title: 'text-base', value: 'text-3xl', icon: 'w-12 h-12' },
    }

    const s = sizes[size]

    return (
        <motion.div
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                "relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg",
                s.card
            )}
        >
            {/* Background gradient orb */}
            <div className={cn(
                "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br",
                gradient
            )} />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className={cn("font-medium text-slate-500 dark:text-slate-400", s.title)}>
                        {title}
                    </p>
                    <p className={cn("font-bold text-slate-900 dark:text-white mt-1", s.value)}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>

                    {change !== undefined && (
                        <div className="flex items-center gap-1 mt-2">
                            <span className={cn(
                                "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold",
                                isPositive && "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
                                isNegative && "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
                                !isPositive && !isNegative && "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            )}>
                                {isPositive ? <TrendingUp className="w-3 h-3" /> :
                                    isNegative ? <TrendingDown className="w-3 h-3" /> :
                                        <Minus className="w-3 h-3" />}
                                {isPositive && '+'}{change}%
                            </span>
                            <span className="text-xs text-slate-400">{changeLabel}</span>
                        </div>
                    )}
                </div>

                {icon && (
                    <div className={cn(
                        "rounded-xl bg-gradient-to-br text-white shadow-lg flex items-center justify-center",
                        gradient,
                        s.icon
                    )}>
                        {icon}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// Mini Stat (inline)
interface MiniStatProps {
    label: string
    value: string | number
    change?: number
    icon?: React.ReactNode
}

export function MiniStat({ label, value, change, icon }: MiniStatProps) {
    const isPositive = change && change > 0

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            {icon && (
                <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                    {icon}
                </div>
            )}
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </span>
                    {change !== undefined && (
                        <span className={cn(
                            "text-xs font-medium",
                            isPositive ? "text-emerald-500" : "text-red-500"
                        )}>
                            {isPositive ? '+' : ''}{change}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

// Metric Row
interface MetricRowProps {
    metrics: Array<{
        label: string
        value: string | number
        icon?: React.ReactNode
        color?: string
    }>
}

export function MetricRow({ metrics }: MetricRowProps) {
    return (
        <div className="flex items-center divide-x divide-slate-200 dark:divide-slate-700">
            {metrics.map((metric, i) => (
                <div key={i} className="flex-1 px-4 first:pl-0 last:pr-0 text-center">
                    <div className="flex items-center justify-center gap-2">
                        {metric.icon && (
                            <span className={cn("text-slate-400", metric.color)}>
                                {metric.icon}
                            </span>
                        )}
                        <span className="font-bold text-lg text-slate-900 dark:text-white">
                            {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{metric.label}</p>
                </div>
            ))}
        </div>
    )
}

// Engagement Stats Grid (for social media)
interface EngagementStatsProps {
    views: number
    likes: number
    comments: number
    shares: number
    className?: string
}

export function EngagementStats({ views, likes, comments, shares, className }: EngagementStatsProps) {
    const stats = [
        { icon: Eye, value: views, label: 'Views', color: 'text-blue-500' },
        { icon: Heart, value: likes, label: 'Likes', color: 'text-pink-500' },
        { icon: MessageCircle, value: comments, label: 'Comments', color: 'text-green-500' },
        { icon: Share2, value: shares, label: 'Shares', color: 'text-purple-500' },
    ]

    const formatNumber = (n: number) => {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
        if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
        return n.toString()
    }

    return (
        <div className={cn("grid grid-cols-4 gap-3", className)}>
            {stats.map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                >
                    <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
                    <p className="font-bold text-slate-900 dark:text-white">{formatNumber(stat.value)}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    )
}

// Trending Badge
interface TrendingBadgeProps {
    rank: number
    direction?: 'up' | 'down' | 'stable'
    label?: string
}

export function TrendingBadge({ rank, direction = 'up', label }: TrendingBadgeProps) {
    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold",
            direction === 'up' && "bg-gradient-to-r from-emerald-500 to-green-500 text-white",
            direction === 'down' && "bg-gradient-to-r from-red-500 to-rose-500 text-white",
            direction === 'stable' && "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
        )}>
            {direction === 'up' && <ArrowUpRight className="w-4 h-4" />}
            {direction === 'down' && <ArrowDownRight className="w-4 h-4" />}
            #{rank} {label && <span className="opacity-80">{label}</span>}
        </div>
    )
}

// Quick Stats Icons
export const QuickStatIcons = {
    users: <Users className="w-4 h-4" />,
    zap: <Zap className="w-4 h-4" />,
    dollar: <DollarSign className="w-4 h-4" />,
    chart: <BarChart3 className="w-4 h-4" />,
    eye: <Eye className="w-4 h-4" />,
    heart: <Heart className="w-4 h-4" />,
    message: <MessageCircle className="w-4 h-4" />,
    share: <Share2 className="w-4 h-4" />,
}
