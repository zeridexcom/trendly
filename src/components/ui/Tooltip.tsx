'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TooltipProps {
    children: React.ReactNode
    content: React.ReactNode
    side?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
    shortcut?: string
    delayMs?: number
}

const positions = {
    top: {
        initial: { opacity: 0, y: 8, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        className: 'bottom-full mb-2',
    },
    bottom: {
        initial: { opacity: 0, y: -8, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        className: 'top-full mt-2',
    },
    left: {
        initial: { opacity: 0, x: 8, scale: 0.96 },
        animate: { opacity: 1, x: 0, scale: 1 },
        className: 'right-full mr-2',
    },
    right: {
        initial: { opacity: 0, x: -8, scale: 0.96 },
        animate: { opacity: 1, x: 0, scale: 1 },
        className: 'left-full ml-2',
    },
}

const alignments = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
}

export default function Tooltip({
    children,
    content,
    side = 'top',
    align = 'center',
    shortcut,
    delayMs = 300,
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

    const handleMouseEnter = () => {
        const id = setTimeout(() => setIsVisible(true), delayMs)
        setTimeoutId(id)
    }

    const handleMouseLeave = () => {
        if (timeoutId) clearTimeout(timeoutId)
        setIsVisible(false)
    }

    const position = positions[side]
    const alignment = side === 'left' || side === 'right'
        ? 'top-1/2 -translate-y-1/2'
        : alignments[align]

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={position.initial}
                        animate={position.animate}
                        exit={position.initial}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute z-[9999] pointer-events-none",
                            position.className,
                            alignment
                        )}
                    >
                        <div className="relative">
                            {/* Tooltip content */}
                            <div className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium shadow-xl whitespace-nowrap flex items-center gap-2">
                                <span>{content}</span>
                                {shortcut && (
                                    <kbd className="px-1.5 py-0.5 rounded bg-slate-700 dark:bg-slate-300 text-slate-300 dark:text-slate-700 text-xs font-mono">
                                        {shortcut}
                                    </kbd>
                                )}
                            </div>

                            {/* Arrow */}
                            <div className={cn(
                                "absolute w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45",
                                side === 'top' && "top-full -mt-1 left-1/2 -translate-x-1/2",
                                side === 'bottom' && "bottom-full -mb-1 left-1/2 -translate-x-1/2",
                                side === 'left' && "left-full -ml-1 top-1/2 -translate-y-1/2",
                                side === 'right' && "right-full -mr-1 top-1/2 -translate-y-1/2"
                            )} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Info Tooltip with icon
interface InfoTooltipProps {
    content: React.ReactNode
    side?: 'top' | 'bottom' | 'left' | 'right'
}

export function InfoTooltip({ content, side = 'top' }: InfoTooltipProps) {
    return (
        <Tooltip content={content} side={side}>
            <button className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold transition-colors">
                ?
            </button>
        </Tooltip>
    )
}

// Badge Tooltip
interface BadgeTooltipProps {
    children: React.ReactNode
    label: string
    count?: number
    gradient?: string
}

export function BadgeTooltip({ children, label, count, gradient = 'from-violet-500 to-purple-600' }: BadgeTooltipProps) {
    return (
        <Tooltip content={label}>
            <div className="relative inline-flex">
                {children}
                {count !== undefined && count > 0 && (
                    <span className={cn(
                        "absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r text-white text-xs font-bold flex items-center justify-center shadow-lg",
                        gradient
                    )}>
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </div>
        </Tooltip>
    )
}
