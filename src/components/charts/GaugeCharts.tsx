'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Gauge Chart
interface GaugeChartProps {
    value: number
    min?: number
    max?: number
    label?: string
    size?: 'sm' | 'md' | 'lg'
    color?: string
    showValue?: boolean
    animate?: boolean
}

export function GaugeChart({
    value,
    min = 0,
    max = 100,
    label,
    size = 'md',
    color = 'violet',
    showValue = true,
    animate = true,
}: GaugeChartProps) {
    const percentage = ((value - min) / (max - min)) * 100
    const rotation = (percentage / 100) * 180 - 90 // -90 to 90 degrees

    const sizes = {
        sm: { width: 100, stroke: 8, fontSize: 'text-lg', labelSize: 'text-[10px]' },
        md: { width: 160, stroke: 12, fontSize: 'text-2xl', labelSize: 'text-xs' },
        lg: { width: 200, stroke: 16, fontSize: 'text-3xl', labelSize: 'text-sm' },
    }

    const s = sizes[size]
    const radius = (s.width - s.stroke) / 2
    const circumference = Math.PI * radius

    const colors = {
        violet: { bg: 'stroke-slate-200 dark:stroke-slate-700', fg: 'stroke-violet-500' },
        green: { bg: 'stroke-slate-200 dark:stroke-slate-700', fg: 'stroke-emerald-500' },
        blue: { bg: 'stroke-slate-200 dark:stroke-slate-700', fg: 'stroke-blue-500' },
        amber: { bg: 'stroke-slate-200 dark:stroke-slate-700', fg: 'stroke-amber-500' },
        red: { bg: 'stroke-slate-200 dark:stroke-slate-700', fg: 'stroke-red-500' },
    }

    const c = colors[color as keyof typeof colors] || colors.violet

    return (
        <div className="relative inline-flex flex-col items-center">
            <svg width={s.width} height={s.width / 2 + 20} className="overflow-visible">
                {/* Background arc */}
                <path
                    d={`M ${s.stroke / 2} ${s.width / 2} A ${radius} ${radius} 0 0 1 ${s.width - s.stroke / 2} ${s.width / 2}`}
                    fill="none"
                    className={c.bg}
                    strokeWidth={s.stroke}
                    strokeLinecap="round"
                />

                {/* Value arc */}
                <motion.path
                    d={`M ${s.stroke / 2} ${s.width / 2} A ${radius} ${radius} 0 0 1 ${s.width - s.stroke / 2} ${s.width / 2}`}
                    fill="none"
                    className={c.fg}
                    strokeWidth={s.stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={animate ? { strokeDashoffset: circumference } : {}}
                    animate={{ strokeDashoffset: circumference * (1 - percentage / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                />

                {/* Needle */}
                <motion.g
                    initial={animate ? { rotate: -90 } : {}}
                    animate={{ rotate: rotation }}
                    style={{ transformOrigin: `${s.width / 2}px ${s.width / 2}px` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                    <line
                        x1={s.width / 2}
                        y1={s.width / 2}
                        x2={s.width / 2}
                        y2={s.stroke + 10}
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        className="text-slate-700 dark:text-slate-300"
                    />
                    <circle
                        cx={s.width / 2}
                        cy={s.width / 2}
                        r={6}
                        className="fill-slate-700 dark:fill-slate-300"
                    />
                </motion.g>
            </svg>

            {/* Value and label */}
            {(showValue || label) && (
                <div className="text-center mt-2">
                    {showValue && (
                        <p className={cn("font-bold text-slate-900 dark:text-white", s.fontSize)}>
                            {value}
                        </p>
                    )}
                    {label && (
                        <p className={cn("text-slate-500 uppercase tracking-wider", s.labelSize)}>
                            {label}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

// Radial Progress
interface RadialProgressProps {
    value: number
    max?: number
    size?: 'sm' | 'md' | 'lg'
    color?: string
    label?: string
    showValue?: boolean
    thickness?: number
}

export function RadialProgress({
    value,
    max = 100,
    size = 'md',
    color = 'violet',
    label,
    showValue = true,
    thickness = 8,
}: RadialProgressProps) {
    const percentage = (value / max) * 100

    const sizes = {
        sm: { width: 60, fontSize: 'text-sm', labelSize: 'text-[8px]' },
        md: { width: 100, fontSize: 'text-xl', labelSize: 'text-xs' },
        lg: { width: 140, fontSize: 'text-3xl', labelSize: 'text-sm' },
    }

    const s = sizes[size]
    const radius = (s.width - thickness) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    const gradients = {
        violet: 'from-violet-500 to-purple-600',
        green: 'from-emerald-500 to-green-600',
        blue: 'from-blue-500 to-indigo-600',
        amber: 'from-amber-500 to-orange-600',
        pink: 'from-pink-500 to-rose-600',
    }

    const gradient = gradients[color as keyof typeof gradients] || gradients.violet
    const gradientId = `radial-${color}-${Math.random().toString(36).substr(2, 9)}`

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={s.width} height={s.width} className="transform -rotate-90">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className={cn('stop-color-current', gradient.split(' ')[0].replace('from-', 'text-'))} stopColor="currentColor" />
                        <stop offset="100%" className={cn('stop-color-current', gradient.split(' ')[1].replace('to-', 'text-'))} stopColor="currentColor" />
                    </linearGradient>
                </defs>

                {/* Background */}
                <circle
                    cx={s.width / 2}
                    cy={s.width / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={thickness}
                    className="text-slate-200 dark:text-slate-700"
                />

                {/* Progress */}
                <motion.circle
                    cx={s.width / 2}
                    cy={s.width / 2}
                    r={radius}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </svg>

            {/* Center content */}
            {(showValue || label) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {showValue && (
                        <span className={cn("font-bold text-slate-900 dark:text-white", s.fontSize)}>
                            {Math.round(percentage)}%
                        </span>
                    )}
                    {label && (
                        <span className={cn("text-slate-500 uppercase tracking-wider", s.labelSize)}>
                            {label}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

// Progress Ring Stack (multiple rings)
interface ProgressRingStackProps {
    rings: Array<{
        value: number
        max: number
        color: string
        label: string
    }>
    size?: number
}

export function ProgressRingStack({ rings, size = 120 }: ProgressRingStackProps) {
    const baseThickness = 8
    const gap = 6

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {rings.map((ring, i) => {
                    const thickness = baseThickness
                    const radius = (size / 2) - (thickness / 2) - (i * (thickness + gap))
                    const circumference = 2 * Math.PI * radius
                    const percentage = (ring.value / ring.max) * 100
                    const offset = circumference - (percentage / 100) * circumference

                    const colors: Record<string, string> = {
                        violet: '#8b5cf6',
                        blue: '#3b82f6',
                        green: '#10b981',
                        amber: '#f59e0b',
                        pink: '#ec4899',
                    }

                    return (
                        <React.Fragment key={i}>
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={thickness}
                                className="text-slate-200 dark:text-slate-700"
                            />
                            <motion.circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={colors[ring.color] || colors.violet}
                                strokeWidth={thickness}
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1, delay: i * 0.2, ease: 'easeOut' }}
                            />
                        </React.Fragment>
                    )
                })}
            </svg>

            {/* Legend */}
            <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4">
                {rings.map((ring, i) => {
                    const colors: Record<string, string> = {
                        violet: 'bg-violet-500',
                        blue: 'bg-blue-500',
                        green: 'bg-emerald-500',
                        amber: 'bg-amber-500',
                        pink: 'bg-pink-500',
                    }
                    return (
                        <div key={i} className="flex items-center gap-1.5">
                            <div className={cn("w-2 h-2 rounded-full", colors[ring.color] || colors.violet)} />
                            <span className="text-xs text-slate-500">{ring.label}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// Comparison Bar
interface ComparisonBarProps {
    value1: number
    value2: number
    label1: string
    label2: string
    color1?: string
    color2?: string
}

export function ComparisonBar({
    value1,
    value2,
    label1,
    label2,
    color1 = 'violet',
    color2 = 'amber',
}: ComparisonBarProps) {
    const total = value1 + value2
    const percent1 = (value1 / total) * 100
    const percent2 = (value2 / total) * 100

    const colors: Record<string, string> = {
        violet: 'bg-violet-500',
        blue: 'bg-blue-500',
        green: 'bg-emerald-500',
        amber: 'bg-amber-500',
        pink: 'bg-pink-500',
        red: 'bg-red-500',
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">{label1}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{label2}</span>
            </div>

            <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent1}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={cn("h-full", colors[color1])}
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent2}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                    className={cn("h-full", colors[color2])}
                />
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900 dark:text-white">{percent1.toFixed(0)}%</span>
                <span className="font-bold text-slate-900 dark:text-white">{percent2.toFixed(0)}%</span>
            </div>
        </div>
    )
}
