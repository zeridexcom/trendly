'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Skeleton component for loading states
export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={cn(
            "animate-pulse rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 bg-[length:200%_100%]",
            className
        )} style={{ animation: 'shimmer 1.5s infinite' }} />
    )
}

// Card Skeleton
export function CardSkeleton() {
    return (
        <div className="rounded-2xl border bg-white dark:bg-slate-900 p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-20 w-full" />
        </div>
    )
}

// Stat Card Skeleton
export function StatCardSkeleton() {
    return (
        <div className="rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-20" />
        </div>
    )
}

// Table Skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="rounded-2xl border bg-white dark:bg-slate-900 overflow-hidden">
            <div className="p-4 border-b">
                <Skeleton className="h-6 w-40" />
            </div>
            <div className="divide-y dark:divide-slate-800">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-20 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    )
}

// Button with ripple effect
interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'ghost'
}

export function RippleButton({ children, className, variant = 'primary', ...props }: RippleButtonProps) {
    const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = Date.now()

        setRipples(prev => [...prev, { x, y, id }])
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600)

        props.onClick?.(e)
    }

    const variantStyles = {
        primary: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40',
        secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700',
        ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
    }

    return (
        <button
            {...props}
            onClick={handleClick}
            className={cn(
                "relative overflow-hidden rounded-xl px-4 py-2.5 font-medium transition-all duration-300",
                variantStyles[variant],
                className
            )}
        >
            {ripples.map(ripple => (
                <motion.span
                    key={ripple.id}
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute rounded-full bg-white/30 pointer-events-none"
                    style={{
                        left: ripple.x - 10,
                        top: ripple.y - 10,
                        width: 20,
                        height: 20,
                    }}
                />
            ))}
            <span className="relative z-10">{children}</span>
        </button>
    )
}

// Hover Card with lift effect
export function HoverCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={cn("rounded-2xl border bg-white dark:bg-slate-900 shadow-lg transition-colors", className)}
        >
            {children}
        </motion.div>
    )
}

// Animated counter
export function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        let start = 0
        const end = value
        const increment = end / (duration / 16)

        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setCount(end)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)

        return () => clearInterval(timer)
    }, [value, duration])

    return <span>{count.toLocaleString()}</span>
}
