'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    TrendingUp,
    Zap,
    Calendar,
    Target,
    Rocket
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TourStep {
    target: string // CSS selector or element ID
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    position: 'top' | 'bottom' | 'left' | 'right'
}

const tourSteps: TourStep[] = [
    {
        target: '[data-tour="dashboard"]',
        title: 'Welcome to Trendly! 👋',
        description: 'Your AI-powered content command center. Let\'s take a quick tour to get you started.',
        icon: Rocket,
        position: 'bottom',
    },
    {
        target: '[data-tour="trends"]',
        title: 'Discover Trends 🔥',
        description: 'Find what\'s trending across all platforms. AI updates in real-time so you never miss a viral opportunity.',
        icon: TrendingUp,
        position: 'right',
    },
    {
        target: '[data-tour="ideas"]',
        title: 'AI Content Ideas 💡',
        description: 'Generate unlimited content ideas tailored to your niche. The AI learns your style over time.',
        icon: Sparkles,
        position: 'right',
    },
    {
        target: '[data-tour="virality"]',
        title: 'Virality Score ⚡',
        description: 'Check your content\'s viral potential before posting. Get actionable tips to boost engagement.',
        icon: Zap,
        position: 'right',
    },
    {
        target: '[data-tour="calendar"]',
        title: 'Content Calendar 📅',
        description: 'Plan and schedule your content. AI suggests the best times to post for maximum reach.',
        icon: Calendar,
        position: 'right',
    },
    {
        target: '[data-tour="competitors"]',
        title: 'Track Competitors 🎯',
        description: 'Monitor what\'s working for others in your space. Learn from their wins and avoid their mistakes.',
        icon: Target,
        position: 'right',
    },
]

export function useTour() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [hasSeenTour, setHasSeenTour] = useState(true)

    useEffect(() => {
        const seen = localStorage.getItem('trendly-tour-completed')
        if (!seen) {
            setHasSeenTour(false)
            // Auto-start tour after 2 seconds for new users
            const timer = setTimeout(() => setIsOpen(true), 2000)
            return () => clearTimeout(timer)
        }
    }, [])

    const startTour = useCallback(() => {
        setCurrentStep(0)
        setIsOpen(true)
    }, [])

    const endTour = useCallback(() => {
        setIsOpen(false)
        localStorage.setItem('trendly-tour-completed', 'true')
        setHasSeenTour(true)
    }, [])

    const nextStep = useCallback(() => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            endTour()
        }
    }, [currentStep, endTour])

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }, [currentStep])

    return { isOpen, currentStep, startTour, endTour, nextStep, prevStep, hasSeenTour }
}

export default function OnboardingTour({
    isOpen,
    currentStep,
    onNext,
    onPrev,
    onClose
}: {
    isOpen: boolean
    currentStep: number
    onNext: () => void
    onPrev: () => void
    onClose: () => void
}) {
    const step = tourSteps[currentStep]
    const Icon = step?.icon || Sparkles

    return (
        <AnimatePresence>
            {isOpen && step && (
                <div className="fixed inset-0 z-[9999]">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Tour Card */}
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', bounce: 0.3 }}
                            className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl max-w-md w-full"
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="h-5 w-5 text-slate-400" />
                            </button>

                            {/* Icon */}
                            <motion.div
                                key={currentStep}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', bounce: 0.5 }}
                                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30"
                            >
                                <Icon className="h-8 w-8 text-white" />
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                key={`content-${currentStep}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-center mb-8"
                            >
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                    {step.title}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400">
                                    {step.description}
                                </p>
                            </motion.div>

                            {/* Progress dots */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                {tourSteps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-all",
                                            i === currentStep
                                                ? "w-8 bg-gradient-to-r from-violet-500 to-purple-600"
                                                : i < currentStep
                                                    ? "bg-violet-300"
                                                    : "bg-slate-200 dark:bg-slate-700"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={onPrev}
                                    disabled={currentStep === 0}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
                                        currentStep === 0
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Back
                                </button>

                                <button
                                    onClick={onNext}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
                                >
                                    {currentStep === tourSteps.length - 1 ? 'Get Started!' : 'Next'}
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Skip */}
                            <button
                                onClick={onClose}
                                className="w-full mt-4 text-center text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                Skip tour
                            </button>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    )
}
