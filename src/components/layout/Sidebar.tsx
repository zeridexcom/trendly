'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    TrendingUp,
    Lightbulb,
    Calendar,
    Settings,
    Users,
    ChevronRight,
    Video,
    Layers,
    Clock,
    Target,
    Zap,
    MessageCircle,
    FileText,
    Activity,
    PanelLeftClose,
    PanelLeftOpen,
    Sparkles,
    Bookmark,
    Globe,
    Bell,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSidebar } from './SidebarContext'
import { createClient } from '@/lib/supabase/client'

export default function Sidebar() {
    const pathname = usePathname()
    const { isCollapsed, toggle } = useSidebar()
    const [userName, setUserName] = useState('User')
    const [userInitial, setUserInitial] = useState('U')

    useEffect(() => {
        const loadUser = async () => {
            try {
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
                    setUserName(name)
                    setUserInitial(name.charAt(0).toUpperCase())
                }
            } catch (error) {
                console.error('Error loading user:', error)
            }
        }
        loadUser()
    }, [])

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`)

    const mainLinks = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/trends', label: 'Trends', icon: TrendingUp },
        { href: '/dashboard/regions', label: 'Regions', icon: Globe },
        { href: '/dashboard/alerts', label: 'Alerts', icon: Bell },
        { href: '/dashboard/saved', label: 'Saved', icon: Bookmark },
        { href: '/dashboard/ideas', label: 'Ideas', icon: Lightbulb },
        { href: '/dashboard/scripts', label: 'Scripts', icon: Video },
        { href: '/dashboard/virality', label: 'Virality', icon: Zap },
    ]

    const toolLinks = [
        { href: '/dashboard/predictions', label: 'Predictions', icon: Sparkles },
        { href: '/dashboard/platform-insights', label: 'Platforms', icon: Activity },
        { href: '/dashboard/comments', label: 'Comments', icon: MessageCircle },
        { href: '/dashboard/pillars', label: 'Pillars', icon: Layers },
        { href: '/dashboard/best-time', label: 'Best Time', icon: Clock },
        { href: '/dashboard/competitor-tracking', label: 'Competitors', icon: Target },
    ]

    const workflowLinks = [
        { href: '/dashboard/workflows', label: 'Workflows', icon: FileText },
        { href: '/dashboard/scheduler', label: 'Scheduler', icon: Clock },
        { href: '/dashboard/activity', label: 'Activity', icon: Activity },
        { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    ]

    const renderLinks = (links: typeof mainLinks) => (
        links.map((link) => {
            const active = isActive(link.href)
            return (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        isCollapsed && "justify-center px-2",
                        active
                            ? "bg-[#D9C5B2] text-[#14110F]"
                            : "text-[#7E7F83] hover:text-[#14110F] hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] dark:hover:text-[#F3F3F4]"
                    )}
                >
                    <link.icon className={cn("w-5 h-5", active && "text-[#14110F]")} />
                    {!isCollapsed && <span>{link.label}</span>}
                    {!isCollapsed && active && <ChevronRight className="w-4 h-4 ml-auto opacity-60" />}
                </Link>
            )
        })
    )

    return (
        <motion.aside
            animate={{ width: isCollapsed ? 72 : 240 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed top-0 left-0 h-screen flex-col border-r border-[#E8E8E9] dark:border-[#34312D] bg-white dark:bg-[#14110F] overflow-y-auto hidden lg:flex z-50"
        >
            {/* Logo */}
            <div className={cn("p-5 flex items-center border-b border-[#E8E8E9] dark:border-[#34312D]", isCollapsed && "justify-center p-4")}>
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#D9C5B2] flex items-center justify-center">
                        <span className="text-[#14110F] font-bold text-lg">T</span>
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-semibold text-lg text-[#14110F] dark:text-[#F3F3F4]"
                            >
                                Trendly
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggle}
                className={cn(
                    "mx-3 my-3 p-2 rounded-lg border border-[#E8E8E9] dark:border-[#34312D] hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors",
                    isCollapsed && "mx-auto"
                )}
            >
                {isCollapsed ? (
                    <PanelLeftOpen className="w-4 h-4 text-[#7E7F83]" />
                ) : (
                    <PanelLeftClose className="w-4 h-4 text-[#7E7F83]" />
                )}
            </button>

            {/* Navigation */}
            <nav className={cn("flex-1 px-3 space-y-6 pb-4", isCollapsed && "px-2")}>
                {/* Main */}
                <div>
                    {!isCollapsed && (
                        <p className="px-3 mb-2 text-[10px] font-medium text-[#7E7F83] uppercase tracking-wider">Main</p>
                    )}
                    <div className="space-y-1">{renderLinks(mainLinks)}</div>
                </div>

                {/* AI Tools */}
                <div>
                    {!isCollapsed && (
                        <p className="px-3 mb-2 text-[10px] font-medium text-[#7E7F83] uppercase tracking-wider">AI Tools</p>
                    )}
                    <div className="space-y-1">{renderLinks(toolLinks)}</div>
                </div>

                {/* Workflow */}
                <div>
                    {!isCollapsed && (
                        <p className="px-3 mb-2 text-[10px] font-medium text-[#7E7F83] uppercase tracking-wider">Workflow</p>
                    )}
                    <div className="space-y-1">{renderLinks(workflowLinks)}</div>
                </div>
            </nav>

            {/* Bottom Section */}
            <div className={cn("p-3 border-t border-[#E8E8E9] dark:border-[#34312D]", isCollapsed && "p-2")}>
                <Link
                    href="/dashboard/admin/users"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                        isCollapsed && "justify-center px-2",
                        isActive('/dashboard/admin')
                            ? "bg-[#D9C5B2] text-[#14110F]"
                            : "text-[#7E7F83] hover:text-[#14110F] hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] dark:hover:text-[#F3F3F4]"
                    )}
                >
                    <Users className="w-5 h-5" />
                    {!isCollapsed && <span>Team</span>}
                </Link>

                {/* User Profile */}
                {!isCollapsed && (
                    <div className="mt-3 p-3 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#D9C5B2] flex items-center justify-center text-[#14110F] text-sm font-semibold">
                                {userInitial}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#14110F] dark:text-[#F3F3F4] truncate">{userName}</p>
                                <p className="text-xs text-[#7E7F83]">Free Plan</p>
                            </div>
                            <Link
                                href="/dashboard/settings"
                                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#14110F] transition-colors"
                            >
                                <Settings className="w-4 h-4 text-[#7E7F83]" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </motion.aside>
    )
}

