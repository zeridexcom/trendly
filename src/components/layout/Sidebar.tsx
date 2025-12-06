'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Sparkles,
    LayoutDashboard,
    TrendingUp,
    Lightbulb,
    Calendar,
    Settings,
    Users,
    ChevronRight,
    ChevronLeft,
    Video,
    Layers,
    Clock,
    Target,
    Zap,
    MessageCircle,
    FileText,
    Activity,
    Crown,
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSidebar } from './SidebarContext'
import Tooltip from '@/components/ui/Tooltip'

export default function Sidebar() {
    const pathname = usePathname()
    const { isCollapsed, toggle } = useSidebar()

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`)

    const mainLinks = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, gradient: 'from-violet-500 to-purple-500' },
        { href: '/dashboard/trends', label: 'Trends', icon: TrendingUp, gradient: 'from-pink-500 to-rose-500' },
        { href: '/dashboard/ideas', label: 'Ideas', icon: Lightbulb, gradient: 'from-amber-400 to-orange-500' },
        { href: '/dashboard/scripts', label: 'Scripts', icon: Video, gradient: 'from-cyan-400 to-blue-500' },
        { href: '/dashboard/virality', label: 'Virality', icon: Zap, gradient: 'from-yellow-400 to-amber-500' },
    ]

    const toolLinks = [
        { href: '/dashboard/comments', label: 'Comments', icon: MessageCircle, gradient: 'from-green-400 to-emerald-500' },
        { href: '/dashboard/pillars', label: 'Pillars', icon: Layers, gradient: 'from-indigo-400 to-violet-500' },
        { href: '/dashboard/best-time', label: 'Best Time', icon: Clock, gradient: 'from-sky-400 to-cyan-500' },
        { href: '/dashboard/competitors', label: 'Competitors', icon: Target, gradient: 'from-red-400 to-pink-500' },
        { href: '/dashboard/repurpose', label: 'Repurpose', icon: Sparkles, gradient: 'from-fuchsia-400 to-purple-500' },
    ]

    const workflowLinks = [
        { href: '/dashboard/workflows', label: 'Workflows', icon: FileText, gradient: 'from-teal-400 to-cyan-500' },
        { href: '/dashboard/scheduler', label: 'Scheduler', icon: Clock, gradient: 'from-orange-400 to-red-500' },
        { href: '/dashboard/activity', label: 'Activity', icon: Activity, gradient: 'from-lime-400 to-green-500' },
        { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar, gradient: 'from-blue-400 to-indigo-500' },
    ]

    const renderLinks = (links: typeof mainLinks, showLabel: boolean) => (
        links.map((link) => {
            const active = isActive(link.href)
            const linkContent = (
                <Link
                    href={link.href}
                    className={cn(
                        "group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300",
                        isCollapsed && "justify-center px-2",
                        active
                            ? "text-white shadow-lg"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                >
                    {active && (
                        <motion.div
                            layoutId="sidebar-active"
                            className={cn("absolute inset-0 rounded-xl bg-gradient-to-r", link.gradient)}
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <div className={cn(
                        "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                        active ? "bg-white/20" : `bg-gradient-to-br ${link.gradient} text-white shadow-md`
                    )}>
                        <link.icon className="h-4 w-4" />
                    </div>
                    {!isCollapsed && (
                        <span className="relative flex-1">{link.label}</span>
                    )}
                    {!isCollapsed && active && (
                        <ChevronRight className="relative h-4 w-4 opacity-70" />
                    )}
                </Link>
            )

            if (isCollapsed) {
                return (
                    <Tooltip key={link.href} content={link.label} side="right">
                        {linkContent}
                    </Tooltip>
                )
            }

            return <div key={link.href}>{linkContent}</div>
        })
    )

    return (
        <motion.aside
            animate={{ width: isCollapsed ? 80 : 256 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            className="fixed top-0 left-0 h-screen flex-col border-r bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 overflow-y-auto hidden lg:flex z-50"
        >
            {/* Logo */}
            <div className={cn("p-5 flex items-center", isCollapsed && "justify-center p-3")}>
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                            <Crown className="h-2.5 w-2.5 text-white" />
                        </div>
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                            >
                                <span className="font-bold text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    Trendly
                                </span>
                                <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">AI Creator Suite</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggle}
                className={cn(
                    "mx-3 mb-4 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center",
                    isCollapsed && "mx-auto"
                )}
            >
                {isCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4 text-slate-500" />
                ) : (
                    <PanelLeftClose className="h-4 w-4 text-slate-500" />
                )}
            </button>

            {/* Navigation */}
            <nav className={cn("flex-1 px-3 space-y-6 pb-4", isCollapsed && "px-2")}>
                {/* Main */}
                <div>
                    {!isCollapsed && (
                        <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Main</p>
                    )}
                    <div className="space-y-1">
                        {renderLinks(mainLinks, !isCollapsed)}
                    </div>
                </div>

                {/* AI Tools */}
                <div>
                    {!isCollapsed && (
                        <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">AI Tools</p>
                    )}
                    <div className="space-y-1">
                        {renderLinks(toolLinks, !isCollapsed)}
                    </div>
                </div>

                {/* Workflow */}
                <div>
                    {!isCollapsed && (
                        <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Workflow</p>
                    )}
                    <div className="space-y-1">
                        {renderLinks(workflowLinks, !isCollapsed)}
                    </div>
                </div>
            </nav>

            {/* Bottom Section */}
            <div className={cn("p-3 border-t border-slate-100 dark:border-slate-800", isCollapsed && "p-2")}>
                {/* Team Link */}
                {isCollapsed ? (
                    <Tooltip content="Team" side="right">
                        <Link
                            href="/dashboard/admin/users"
                            className={cn(
                                "flex items-center justify-center p-2 rounded-xl transition-all",
                                isActive('/dashboard/admin')
                                    ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white shadow-md">
                                <Users className="h-4 w-4" />
                            </div>
                        </Link>
                    </Tooltip>
                ) : (
                    <Link
                        href="/dashboard/admin/users"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all",
                            isActive('/dashboard/admin')
                                ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white shadow-md">
                            <Users className="h-4 w-4" />
                        </div>
                        <span>Team</span>
                    </Link>
                )}

                {/* User Profile */}
                {!isCollapsed && (
                    <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-purple-100 dark:border-purple-900">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                U
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">Pro User</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Premium Plan</p>
                            </div>
                            <button className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <Settings className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Collapsed user avatar */}
                {isCollapsed && (
                    <Tooltip content="Pro User" side="right">
                        <div className="mt-3 flex justify-center">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                U
                            </div>
                        </div>
                    </Tooltip>
                )}
            </div>
        </motion.aside>
    )
}
