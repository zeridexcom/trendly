'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    FileText,
    TrendingUp,
    Calendar,
    MessageCircle,
    Target,
    Sparkles,
    Rocket,
    Zap,
    Plus
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
    type: 'content' | 'ideas' | 'calendar' | 'comments' | 'competitors' | 'default'
    title?: string
    description?: string
    action?: {
        label: string
        href?: string
        onClick?: () => void
    }
}

const illustrations = {
    content: {
        icon: FileText,
        gradient: 'from-violet-500 to-purple-600',
        color: 'text-violet-500',
        bgColor: 'bg-violet-50 dark:bg-violet-900/20',
        defaultTitle: 'No content yet',
        defaultDescription: 'Create your first piece of content to get started',
    },
    ideas: {
        icon: Sparkles,
        gradient: 'from-amber-400 to-orange-500',
        color: 'text-amber-500',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        defaultTitle: 'Ready for inspiration?',
        defaultDescription: 'Generate AI-powered content ideas tailored to your niche',
    },
    calendar: {
        icon: Calendar,
        gradient: 'from-cyan-400 to-blue-500',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
        defaultTitle: 'Your calendar is empty',
        defaultDescription: 'Schedule your first post to start building your content calendar',
    },
    comments: {
        icon: MessageCircle,
        gradient: 'from-green-400 to-emerald-500',
        color: 'text-green-500',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        defaultTitle: 'No comments to respond to',
        defaultDescription: 'Paste comments from your posts to generate AI-powered replies',
    },
    competitors: {
        icon: Target,
        gradient: 'from-pink-500 to-rose-500',
        color: 'text-pink-500',
        bgColor: 'bg-pink-50 dark:bg-pink-900/20',
        defaultTitle: 'No competitors tracked',
        defaultDescription: 'Add competitors to monitor their strategy and performance',
    },
    default: {
        icon: Rocket,
        gradient: 'from-slate-600 to-slate-800',
        color: 'text-slate-500',
        bgColor: 'bg-slate-50 dark:bg-slate-800/50',
        defaultTitle: 'Nothing here yet',
        defaultDescription: 'Get started by adding some content',
    },
}

export default function EmptyState({
    type,
    title,
    description,
    action
}: EmptyStateProps) {
    const config = illustrations[type]
    const Icon = config.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex flex-col items-center justify-center py-16 px-8 rounded-2xl border-2 border-dashed",
                config.bgColor
            )}
        >
            {/* Animated Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                className="relative mb-6"
            >
                <div className={cn(
                    "w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-2xl",
                    config.gradient
                )}>
                    <Icon className="h-12 w-12 text-white" />
                </div>

                {/* Decorative elements */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-full"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
                >
                    <Zap className="h-4 w-4 text-white" />
                </motion.div>
            </motion.div>

            {/* Text */}
            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center"
            >
                {title || config.defaultTitle}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6"
            >
                {description || config.defaultDescription}
            </motion.p>

            {/* Action Button */}
            {action && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {action.href ? (
                        <Link
                            href={action.href}
                            className={cn(
                                "inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r text-white font-semibold shadow-lg transition-all hover:scale-105",
                                config.gradient
                            )}
                        >
                            <Plus className="h-5 w-5" />
                            {action.label}
                        </Link>
                    ) : (
                        <button
                            onClick={action.onClick}
                            className={cn(
                                "inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r text-white font-semibold shadow-lg transition-all hover:scale-105",
                                config.gradient
                            )}
                        >
                            <Plus className="h-5 w-5" />
                            {action.label}
                        </button>
                    )}
                </motion.div>
            )}
        </motion.div>
    )
}
