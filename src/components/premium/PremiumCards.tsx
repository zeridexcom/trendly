'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Sparkles, Flame, Crown, Star, Zap, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Premium Gradient Card
interface PremiumCardProps {
    children: React.ReactNode
    gradient?: string
    glow?: boolean
    animate?: boolean
    className?: string
}

export function PremiumCard({
    children,
    gradient = 'from-violet-500 via-purple-500 to-fuchsia-500',
    glow = true,
    animate = true,
    className,
}: PremiumCardProps) {
    return (
        <motion.div
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className={cn("relative group", className)}
        >
            {/* Glow effect */}
            {glow && (
                <div className={cn(
                    "absolute -inset-1 rounded-3xl bg-gradient-to-r opacity-20 blur-xl transition-opacity group-hover:opacity-40",
                    gradient
                )} />
            )}

            {/* Card */}
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                {/* Gradient accent */}
                <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", gradient)} />

                {/* Decorative orb */}
                <div className={cn(
                    "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-10 bg-gradient-to-br",
                    gradient
                )} />

                <div className="relative">{children}</div>
            </div>
        </motion.div>
    )
}

// Hero Stat Card (large, prominent)
interface HeroStatCardProps {
    title: string
    value: string | number
    subtitle?: string
    change?: number
    icon?: React.ReactNode
    gradient?: string
    sparkData?: number[]
}

export function HeroStatCard({
    title,
    value,
    subtitle,
    change,
    icon,
    gradient = 'from-violet-500 to-purple-600',
    sparkData,
}: HeroStatCardProps) {
    const isPositive = change && change > 0

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-3xl p-6 lg:p-8"
        >
            {/* Gradient background */}
            <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            <div className="relative flex items-start justify-between text-white">
                <div>
                    <p className="text-white/70 text-sm font-medium mb-1">{title}</p>
                    <p className="text-4xl lg:text-5xl font-bold mb-2">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>

                    <div className="flex items-center gap-3">
                        {change !== undefined && (
                            <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                                isPositive ? "bg-white/20" : "bg-red-500/30"
                            )}>
                                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {isPositive && '+'}{change}%
                            </span>
                        )}
                        {subtitle && <span className="text-white/60 text-sm">{subtitle}</span>}
                    </div>
                </div>

                {icon && (
                    <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                        {icon}
                    </div>
                )}
            </div>

            {/* Sparkline at bottom */}
            {sparkData && (
                <div className="relative mt-6 flex items-end gap-1 h-12">
                    {sparkData.map((v, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${(v / Math.max(...sparkData)) * 100}%` }}
                            transition={{ delay: i * 0.05 }}
                            className="flex-1 bg-white/30 rounded-t"
                        />
                    ))}
                </div>
            )}
        </motion.div>
    )
}

// Trending Item Card
interface TrendingItemProps {
    rank: number
    title: string
    value: string
    change: number
    icon?: React.ReactNode
    hot?: boolean
}

export function TrendingItem({ rank, title, value, change, icon, hot }: TrendingItemProps) {
    const isPositive = change > 0

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
        >
            {/* Rank */}
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg",
                rank === 1 && "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
                rank === 2 && "bg-gradient-to-br from-slate-300 to-slate-400 text-white",
                rank === 3 && "bg-gradient-to-br from-amber-600 to-amber-700 text-white",
                rank > 3 && "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            )}>
                {rank}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white truncate">{title}</h4>
                    {hot && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold">
                            <Flame className="w-3 h-3" /> HOT
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-500">{value}</p>
            </div>

            {/* Change */}
            <div className={cn(
                "flex items-center gap-1 text-sm font-semibold",
                isPositive ? "text-emerald-500" : "text-red-500"
            )}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isPositive && '+'}{change}%
            </div>

            {icon}
        </motion.div>
    )
}

// Achievement Badge
interface AchievementBadgeProps {
    title: string
    description?: string
    icon?: React.ReactNode
    rarity?: 'common' | 'rare' | 'epic' | 'legendary'
    unlocked?: boolean
}

export function AchievementBadge({
    title,
    description,
    icon = <Star className="w-6 h-6" />,
    rarity = 'common',
    unlocked = true,
}: AchievementBadgeProps) {
    const rarities = {
        common: { bg: 'from-slate-400 to-slate-500', glow: 'shadow-slate-500/20' },
        rare: { bg: 'from-blue-400 to-blue-600', glow: 'shadow-blue-500/30' },
        epic: { bg: 'from-purple-400 to-purple-600', glow: 'shadow-purple-500/40' },
        legendary: { bg: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/50' },
    }

    const r = rarities[rarity]

    return (
        <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className={cn(
                "relative p-4 rounded-2xl text-center transition-all",
                unlocked ? "opacity-100" : "opacity-40 grayscale"
            )}
        >
            {/* Badge icon */}
            <div className={cn(
                "w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg mb-3",
                r.bg,
                unlocked && r.glow
            )}>
                {rarity === 'legendary' && <Crown className="w-7 h-7" />}
                {rarity === 'epic' && <Sparkles className="w-7 h-7" />}
                {rarity === 'rare' && <Zap className="w-7 h-7" />}
                {rarity === 'common' && icon}
            </div>

            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
            {description && (
                <p className="text-xs text-slate-500 mt-1">{description}</p>
            )}
        </motion.div>
    )
}

// Premium CTA Card
interface CTACardProps {
    title: string
    description: string
    buttonText: string
    onClick?: () => void
    gradient?: string
    icon?: React.ReactNode
}

export function CTACard({
    title,
    description,
    buttonText,
    onClick,
    gradient = 'from-violet-500 via-purple-500 to-fuchsia-500',
    icon = <Sparkles className="w-5 h-5" />,
}: CTACardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn("relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r", gradient)}
        >
            {/* Shimmer effect */}
            <motion.div
                animate={{ x: ['0%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            />

            <div className="relative">
                <div className="flex items-center gap-2 text-white/80 mb-2">
                    {icon}
                    <span className="text-sm font-medium">Premium Feature</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/70 text-sm mb-4">{description}</p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 transition-colors"
                >
                    {buttonText}
                    <ArrowRight className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    )
}
