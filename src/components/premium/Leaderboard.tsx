'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Medal, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

// Leaderboard Item
interface LeaderboardItemProps {
    rank: number
    name: string
    avatar?: string
    score: number
    change?: number
    highlight?: boolean
}

export function LeaderboardItem({ rank, name, avatar, score, change, highlight }: LeaderboardItemProps) {
    const getRankStyle = () => {
        if (rank === 1) return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/30'
        if (rank === 2) return 'bg-gradient-to-r from-slate-300 to-slate-400 text-white'
        if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4 }}
            className={cn(
                "flex items-center gap-4 p-4 rounded-xl transition-colors",
                highlight && "bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800"
            )}
        >
            {/* Rank */}
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold", getRankStyle())}>
                {rank === 1 && <Crown className="w-5 h-5" />}
                {rank === 2 && <Medal className="w-5 h-5" />}
                {rank === 3 && <Medal className="w-5 h-5" />}
                {rank > 3 && rank}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {avatar || name.charAt(0)}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">{name}</p>
            </div>

            {/* Score */}
            <div className="text-right">
                <p className="font-bold text-slate-900 dark:text-white">{score.toLocaleString()}</p>
                {change !== undefined && (
                    <div className={cn(
                        "flex items-center justify-end gap-0.5 text-xs font-medium",
                        change > 0 ? "text-emerald-500" : change < 0 ? "text-red-500" : "text-slate-400"
                    )}>
                        {change > 0 && <TrendingUp className="w-3 h-3" />}
                        {change < 0 && <TrendingDown className="w-3 h-3" />}
                        {change > 0 && '+'}{change !== 0 && change}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// Full Leaderboard
interface LeaderboardProps {
    items: LeaderboardItemProps[]
    title?: string
    maxItems?: number
    highlightUser?: string
}

export function Leaderboard({ items, title = 'Leaderboard', maxItems = 10, highlightUser }: LeaderboardProps) {
    const displayItems = items.slice(0, maxItems)

    return (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayItems.map((item, i) => (
                    <LeaderboardItem
                        key={i}
                        {...item}
                        highlight={highlightUser === item.name}
                    />
                ))}
            </div>
        </div>
    )
}

// Comparison Widget
interface ComparisonProps {
    leftLabel: string
    rightLabel: string
    leftValue: number
    rightValue: number
    leftColor?: string
    rightColor?: string
}

export function ComparisonWidget({
    leftLabel,
    rightLabel,
    leftValue,
    rightValue,
    leftColor = 'violet',
    rightColor = 'amber',
}: ComparisonProps) {
    const total = leftValue + rightValue
    const leftPercent = (leftValue / total) * 100
    const rightPercent = (rightValue / total) * 100

    const colors: Record<string, string> = {
        violet: 'from-violet-500 to-purple-600',
        amber: 'from-amber-500 to-orange-600',
        blue: 'from-blue-500 to-indigo-600',
        green: 'from-emerald-500 to-green-600',
        pink: 'from-pink-500 to-rose-600',
    }

    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            {/* Labels */}
            <div className="flex justify-between mb-4">
                <div>
                    <p className="text-sm text-slate-500">{leftLabel}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{leftValue.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500">{rightLabel}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{rightValue.toLocaleString()}</p>
                </div>
            </div>

            {/* Bar */}
            <div className="flex h-4 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${leftPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={cn("h-full bg-gradient-to-r", colors[leftColor])}
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rightPercent}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                    className={cn("h-full bg-gradient-to-r", colors[rightColor])}
                />
            </div>

            {/* Percentages */}
            <div className="flex justify-between mt-2 text-sm font-medium">
                <span className="text-violet-500">{leftPercent.toFixed(0)}%</span>
                <span className="text-amber-500">{rightPercent.toFixed(0)}%</span>
            </div>
        </div>
    )
}
