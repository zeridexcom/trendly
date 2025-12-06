'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Gradient Border Card
interface GradientBorderCardProps {
    children: React.ReactNode
    className?: string
    gradient?: string
    borderWidth?: number
    animated?: boolean
}

export function GradientBorderCard({
    children,
    className,
    gradient = 'from-violet-500 via-purple-500 to-fuchsia-500',
    borderWidth = 2,
    animated = false,
}: GradientBorderCardProps) {
    return (
        <div className="relative rounded-2xl p-[2px] overflow-hidden">
            {/* Gradient border */}
            <div
                className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-r",
                    gradient,
                    animated && "animate-spin-slow"
                )}
                style={animated ? { animationDuration: '3s' } : {}}
            />

            {/* Content */}
            <div className={cn(
                "relative rounded-[14px] bg-white dark:bg-slate-900",
                className
            )}>
                {children}
            </div>
        </div>
    )
}

// Glass Card
interface GlassCardProps {
    children: React.ReactNode
    className?: string
    blur?: 'sm' | 'md' | 'lg' | 'xl'
}

export function GlassCard({
    children,
    className,
    blur = 'lg',
}: GlassCardProps) {
    const blurClass = {
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-lg',
        xl: 'backdrop-blur-xl',
    }

    return (
        <div className={cn(
            "bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-xl",
            blurClass[blur],
            className
        )}>
            {children}
        </div>
    )
}

// Spotlight Card
interface SpotlightCardProps {
    children: React.ReactNode
    className?: string
}

export function SpotlightCard({ children, className }: SpotlightCardProps) {
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = React.useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={cn(
                "relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700",
                className
            )}
        >
            {/* Spotlight */}
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
                }}
            />
            <div className="relative">{children}</div>
        </div>
    )
}

// Animated Background Card
export function AnimatedBackgroundCard({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn("relative overflow-hidden rounded-2xl", className)}>
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-10" />
            <motion.div
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="absolute -inset-[100%] bg-gradient-conic from-violet-500 via-transparent to-violet-500 opacity-5"
            />

            {/* Content */}
            <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl">
                {children}
            </div>
        </div>
    )
}

// Neon Card
interface NeonCardProps {
    children: React.ReactNode
    className?: string
    color?: 'violet' | 'cyan' | 'pink' | 'green'
}

export function NeonCard({
    children,
    className,
    color = 'violet',
}: NeonCardProps) {
    const colors = {
        violet: 'shadow-violet-500/50 hover:shadow-violet-500',
        cyan: 'shadow-cyan-500/50 hover:shadow-cyan-500',
        pink: 'shadow-pink-500/50 hover:shadow-pink-500',
        green: 'shadow-green-500/50 hover:shadow-green-500',
    }

    const borderColors = {
        violet: 'border-violet-500/50',
        cyan: 'border-cyan-500/50',
        pink: 'border-pink-500/50',
        green: 'border-green-500/50',
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
                "rounded-2xl bg-slate-900 border transition-shadow duration-300 shadow-lg",
                borderColors[color],
                colors[color],
                className
            )}
        >
            {children}
        </motion.div>
    )
}

// Particle Background
export function ParticleBackground({ count = 50 }: { count?: number }) {
    const particles = Array.from({ length: count }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
    }))

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-violet-500/20"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    )
}
