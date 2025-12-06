'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressCircleProps {
    value: number // 0-100
    size?: 'sm' | 'md' | 'lg' | 'xl'
    strokeWidth?: number
    gradient?: string
    showValue?: boolean
    label?: string
    className?: string
}

const sizeConfig = {
    sm: { size: 48, fontSize: 'text-xs', labelSize: 'text-[8px]' },
    md: { size: 80, fontSize: 'text-lg', labelSize: 'text-xs' },
    lg: { size: 120, fontSize: 'text-2xl', labelSize: 'text-sm' },
    xl: { size: 160, fontSize: 'text-4xl', labelSize: 'text-base' },
}

export default function ProgressCircle({
    value,
    size = 'md',
    strokeWidth = 8,
    gradient = 'from-violet-500 to-purple-600',
    showValue = true,
    label,
    className,
}: ProgressCircleProps) {
    const config = sizeConfig[size]
    const radius = (config.size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (value / 100) * circumference
    const gradientId = `progress-gradient-${Math.random().toString(36).substr(2, 9)}`

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg
                width={config.size}
                height={config.size}
                className="transform -rotate-90"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className={cn("stop-color-current", gradient.includes('violet') ? 'text-violet-500' : gradient.includes('green') ? 'text-green-500' : gradient.includes('amber') ? 'text-amber-500' : gradient.includes('pink') ? 'text-pink-500' : 'text-blue-500')} stopColor="currentColor" />
                        <stop offset="100%" className={cn("stop-color-current", gradient.includes('purple') ? 'text-purple-600' : gradient.includes('emerald') ? 'text-emerald-600' : gradient.includes('orange') ? 'text-orange-600' : gradient.includes('rose') ? 'text-rose-600' : 'text-indigo-600')} stopColor="currentColor" />
                    </linearGradient>
                </defs>

                {/* Background circle */}
                <circle
                    cx={config.size / 2}
                    cy={config.size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-slate-200 dark:text-slate-700"
                />

                {/* Progress circle */}
                <motion.circle
                    cx={config.size / 2}
                    cy={config.size / 2}
                    r={radius}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={strokeWidth}
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
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className={cn("font-bold text-slate-900 dark:text-white", config.fontSize)}
                        >
                            {Math.round(value)}%
                        </motion.span>
                    )}
                    {label && (
                        <span className={cn("text-slate-500 dark:text-slate-400 uppercase tracking-wider", config.labelSize)}>
                            {label}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

// Linear progress bar
interface ProgressBarProps {
    value: number
    gradient?: string
    height?: 'sm' | 'md' | 'lg'
    showValue?: boolean
    label?: string
    animated?: boolean
    className?: string
}

const heightConfig = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
}

export function ProgressBar({
    value,
    gradient = 'from-violet-500 to-purple-600',
    height = 'md',
    showValue = false,
    label,
    animated = true,
    className,
}: ProgressBarProps) {
    return (
        <div className={cn("w-full", className)}>
            {(label || showValue) && (
                <div className="flex items-center justify-between mb-2">
                    {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
                    {showValue && <span className="text-sm font-semibold text-slate-900 dark:text-white">{Math.round(value)}%</span>}
                </div>
            )}
            <div className={cn("w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", heightConfig[height])}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
                    className={cn("h-full rounded-full bg-gradient-to-r", gradient)}
                />
            </div>
        </div>
    )
}

// Step progress
interface Step {
    label: string
    completed: boolean
    current?: boolean
}

interface StepProgressProps {
    steps: Step[]
    gradient?: string
}

export function StepProgress({ steps, gradient = 'from-violet-500 to-purple-600' }: StepProgressProps) {
    return (
        <div className="flex items-center w-full">
            {steps.map((step, i) => (
                <React.Fragment key={i}>
                    {/* Step circle */}
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors",
                                step.completed
                                    ? cn("bg-gradient-to-br text-white shadow-lg", gradient)
                                    : step.current
                                        ? "border-2 border-violet-500 text-violet-500 bg-violet-50 dark:bg-violet-900/30"
                                        : "border-2 border-slate-300 dark:border-slate-600 text-slate-400"
                            )}
                        >
                            {step.completed ? '✓' : i + 1}
                        </motion.div>
                        <span className={cn(
                            "mt-2 text-xs font-medium",
                            step.completed || step.current
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-400"
                        )}>
                            {step.label}
                        </span>
                    </div>

                    {/* Connector */}
                    {i < steps.length - 1 && (
                        <div className="flex-1 h-0.5 mx-2 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: step.completed ? '100%' : '0%' }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={cn("absolute inset-y-0 left-0 bg-gradient-to-r", gradient)}
                            />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}
