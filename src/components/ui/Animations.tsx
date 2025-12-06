'use client'

import React, { useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

// 3D Tilt Card
interface TiltCardProps {
    children: React.ReactNode
    className?: string
    tiltAmount?: number
    glare?: boolean
}

export function TiltCard({
    children,
    className,
    tiltAmount = 15,
    glare = true
}: TiltCardProps) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const rotateX = useTransform(y, [-0.5, 0.5], [tiltAmount, -tiltAmount])
    const rotateY = useTransform(x, [-0.5, 0.5], [-tiltAmount, tiltAmount])

    const springConfig = { stiffness: 300, damping: 30 }
    const springRotateX = useSpring(rotateX, springConfig)
    const springRotateY = useSpring(rotateY, springConfig)

    const glareX = useTransform(x, [-0.5, 0.5], [0, 100])
    const glareY = useTransform(y, [-0.5, 0.5], [0, 100])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const xPos = (e.clientX - rect.left) / rect.width - 0.5
        const yPos = (e.clientY - rect.top) / rect.height - 0.5
        x.set(xPos)
        y.set(yPos)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: 'preserve-3d',
                perspective: 1000,
            }}
            className={cn("relative", className)}
        >
            {children}

            {glare && (
                <motion.div
                    className="absolute inset-0 pointer-events-none rounded-[inherit]"
                    style={{
                        background: useTransform(
                            [glareX, glareY],
                            ([gx, gy]) =>
                                `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.2) 0%, transparent 50%)`
                        ),
                    }}
                />
            )}
        </motion.div>
    )
}

// Floating Animation
interface FloatProps {
    children: React.ReactNode
    duration?: number
    distance?: number
    delay?: number
}

export function Float({ children, duration = 3, distance = 10, delay = 0 }: FloatProps) {
    return (
        <motion.div
            animate={{ y: [0, -distance, 0] }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            {children}
        </motion.div>
    )
}

// Pulse Animation
interface PulseProps {
    children: React.ReactNode
    color?: 'violet' | 'green' | 'red' | 'amber'
    duration?: number
}

export function Pulse({ children, color = 'violet', duration = 2 }: PulseProps) {
    const colors = {
        violet: 'bg-violet-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
        amber: 'bg-amber-500',
    }

    return (
        <div className="relative inline-flex">
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: 'easeOut',
                }}
                className={cn("absolute inset-0 rounded-full", colors[color])}
            />
            <div className="relative">{children}</div>
        </div>
    )
}

// Shake Animation
export function Shake({ children, trigger = false }: { children: React.ReactNode; trigger?: boolean }) {
    return (
        <motion.div
            animate={trigger ? { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } } : {}}
        >
            {children}
        </motion.div>
    )
}

// Bounce on Click
interface BounceClickProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
}

export function BounceClick({ children, className, onClick }: BounceClickProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={cn("cursor-pointer", className)}
        >
            {children}
        </motion.div>
    )
}

// Magnetic Hover
interface MagneticProps {
    children: React.ReactNode
    strength?: number
}

export function Magnetic({ children, strength = 0.3 }: MagneticProps) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set((e.clientX - centerX) * strength)
        y.set((e.clientY - centerY) * strength)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: useSpring(x), y: useSpring(y) }}
        >
            {children}
        </motion.div>
    )
}

// Stagger Children Animation
export function StaggerChildren({ children, staggerDelay = 0.1 }: { children: React.ReactNode; staggerDelay?: number }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: staggerDelay } }
            }}
        >
            {React.Children.map(children, (child) => (
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    )
}

// Counter Animation
interface AnimatedNumberProps {
    value: number
    duration?: number
    format?: (n: number) => string
    className?: string
}

export function AnimatedNumber({
    value,
    duration = 1,
    format = (n) => n.toLocaleString(),
    className
}: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0)

    React.useEffect(() => {
        const startTime = Date.now()
        const durationMs = duration * 1000

        const updateValue = () => {
            const progress = Math.min((Date.now() - startTime) / durationMs, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.round(value * eased))

            if (progress < 1) {
                requestAnimationFrame(updateValue)
            }
        }

        requestAnimationFrame(updateValue)
    }, [value, duration])

    return <span className={className}>{format(displayValue)}</span>
}

// Reveal on Scroll
interface RevealProps {
    children: React.ReactNode
    direction?: 'up' | 'down' | 'left' | 'right'
    delay?: number
}

export function Reveal({ children, direction = 'up', delay = 0 }: RevealProps) {
    const directions = {
        up: { y: 50 },
        down: { y: -50 },
        left: { x: 50 },
        right: { x: -50 },
    }

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay }}
        >
            {children}
        </motion.div>
    )
}
