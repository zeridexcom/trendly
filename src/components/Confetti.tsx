'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiPiece {
    id: number
    x: number
    y: number
    rotation: number
    color: string
    size: number
    velocity: { x: number; y: number }
}

const colors = [
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#d946ef', // fuchsia
    '#ec4899', // pink
    '#f43f5e', // rose
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
]

export function useConfetti() {
    const [isActive, setIsActive] = useState(false)

    const fire = useCallback(() => {
        setIsActive(true)
        setTimeout(() => setIsActive(false), 3000)
    }, [])

    return { fire, isActive }
}

export default function Confetti({ isActive }: { isActive: boolean }) {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([])

    useEffect(() => {
        if (isActive) {
            const newPieces: ConfettiPiece[] = []
            for (let i = 0; i < 100; i++) {
                newPieces.push({
                    id: i,
                    x: Math.random() * window.innerWidth,
                    y: -20 - Math.random() * 100,
                    rotation: Math.random() * 360,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: 8 + Math.random() * 8,
                    velocity: {
                        x: (Math.random() - 0.5) * 10,
                        y: 3 + Math.random() * 5,
                    },
                })
            }
            setPieces(newPieces)
        } else {
            setPieces([])
        }
    }, [isActive])

    return (
        <AnimatePresence>
            {isActive && (
                <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
                    {pieces.map((piece) => (
                        <motion.div
                            key={piece.id}
                            initial={{
                                x: piece.x,
                                y: piece.y,
                                rotate: piece.rotation,
                                opacity: 1,
                            }}
                            animate={{
                                y: window.innerHeight + 100,
                                x: piece.x + piece.velocity.x * 50,
                                rotate: piece.rotation + 720,
                                opacity: 0,
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                ease: 'easeOut',
                            }}
                            style={{
                                position: 'absolute',
                                width: piece.size,
                                height: piece.size * 0.6,
                                backgroundColor: piece.color,
                                borderRadius: 2,
                            }}
                        />
                    ))}
                </div>
            )}
        </AnimatePresence>
    )
}

// Celebration popup with confetti
export function CelebrationPopup({
    isOpen,
    onClose,
    title,
    message
}: {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
}) {
    const { fire, isActive } = useConfetti()

    useEffect(() => {
        if (isOpen) {
            fire()
        }
    }, [isOpen, fire])

    return (
        <>
            <Confetti isActive={isActive} />
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={onClose}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ type: 'spring', bounce: 0.4 }}
                            className="relative z-50 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
                            >
                                <span className="text-4xl">🎉</span>
                            </motion.div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">{message}</p>
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
                            >
                                Awesome! 🚀
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
