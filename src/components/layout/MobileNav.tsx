'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    X,
    Menu,
    Sparkles,
    LayoutDashboard,
    TrendingUp,
    Lightbulb,
    Calendar,
    Video,
    Layers,
    Clock,
    Target,
    Zap,
    MessageCircle,
    FileText,
    Activity,
    Users,
    Crown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileNavProps {
    isOpen: boolean
    onClose: () => void
}

const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, gradient: 'from-violet-500 to-purple-500' },
    { href: '/dashboard/trends', label: 'Trends', icon: TrendingUp, gradient: 'from-pink-500 to-rose-500' },
    { href: '/dashboard/ideas', label: 'Ideas', icon: Lightbulb, gradient: 'from-amber-400 to-orange-500' },
    { href: '/dashboard/scripts', label: 'Scripts', icon: Video, gradient: 'from-cyan-400 to-blue-500' },
    { href: '/dashboard/virality', label: 'Virality', icon: Zap, gradient: 'from-yellow-400 to-amber-500' },
    { href: '/dashboard/comments', label: 'Comments', icon: MessageCircle, gradient: 'from-green-400 to-emerald-500' },
    { href: '/dashboard/pillars', label: 'Pillars', icon: Layers, gradient: 'from-indigo-400 to-violet-500' },
    { href: '/dashboard/best-time', label: 'Best Time', icon: Clock, gradient: 'from-sky-400 to-cyan-500' },
    { href: '/dashboard/competitors', label: 'Competitors', icon: Target, gradient: 'from-red-400 to-pink-500' },
    { href: '/dashboard/repurpose', label: 'Repurpose', icon: Sparkles, gradient: 'from-fuchsia-400 to-purple-500' },
    { href: '/dashboard/workflows', label: 'Workflows', icon: FileText, gradient: 'from-teal-400 to-cyan-500' },
    { href: '/dashboard/scheduler', label: 'Scheduler', icon: Clock, gradient: 'from-orange-400 to-red-500' },
    { href: '/dashboard/activity', label: 'Activity', icon: Activity, gradient: 'from-lime-400 to-green-500' },
    { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar, gradient: 'from-blue-400 to-indigo-500' },
    { href: '/dashboard/admin/users', label: 'Team', icon: Users, gradient: 'from-slate-600 to-slate-800' },
]

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 shadow-2xl z-[100] lg:hidden overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                            <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
                                <img src="/trendllly-logo.png" alt="Trendllly" className="h-8 object-contain" />
                            </Link>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="p-4 space-y-1">
                            {links.map((link, i) => {
                                const active = isActive(link.href)
                                return (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                                                active
                                                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-9 h-9 rounded-lg flex items-center justify-center",
                                                active
                                                    ? "bg-white/20"
                                                    : `bg-gradient-to-br ${link.gradient} text-white shadow-md`
                                            )}>
                                                <link.icon className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium">{link.label}</span>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </nav>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}

// Mobile Header Toggle Button
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
            <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
    )
}
