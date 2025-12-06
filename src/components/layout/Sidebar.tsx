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
    LogOut,
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
    Crown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
    const pathname = usePathname()

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

    const renderLinks = (links: typeof mainLinks) => (
        links.map((link) => {
            const active = isActive(link.href)
            return (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300",
                        active
                            ? "bg-gradient-to-r text-white shadow-lg"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    )}
                    style={active ? { backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` } : {}}
                >
                    <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                        active ? "bg-white/20" : `bg-gradient-to-br ${link.gradient} text-white shadow-md`
                    )}>
                        <link.icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1">{link.label}</span>
                    {active && (
                        <ChevronRight className="h-4 w-4 opacity-70" />
                    )}
                    {active && (
                        <div className={cn("absolute inset-0 rounded-xl bg-gradient-to-r opacity-100", link.gradient)} style={{ zIndex: -1 }} />
                    )}
                </Link>
            )
        })
    )

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col border-r bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-y-auto">
            {/* Logo */}
            <div className="p-5">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                            <Crown className="h-2.5 w-2.5 text-white" />
                        </div>
                    </div>
                    <div>
                        <span className="font-bold text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                            Trendly
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">AI Creator Suite</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-6 pb-4">
                {/* Main */}
                <div>
                    <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Main</p>
                    <div className="space-y-1">
                        {renderLinks(mainLinks)}
                    </div>
                </div>

                {/* AI Tools */}
                <div>
                    <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">AI Tools</p>
                    <div className="space-y-1">
                        {renderLinks(toolLinks)}
                    </div>
                </div>

                {/* Workflow */}
                <div>
                    <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Workflow</p>
                    <div className="space-y-1">
                        {renderLinks(workflowLinks)}
                    </div>
                </div>
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-slate-100">
                <Link
                    href="/dashboard/admin/users"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all",
                        isActive('/dashboard/admin')
                            ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg"
                            : "text-slate-600 hover:bg-slate-100"
                    )}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white shadow-md">
                        <Users className="h-4 w-4" />
                    </div>
                    <span>Team</span>
                </Link>

                {/* User Profile */}
                <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-purple-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            U
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">Pro User</p>
                            <p className="text-xs text-slate-500">Premium Plan</p>
                        </div>
                        <button className="p-1.5 rounded-lg hover:bg-white/50 transition-colors text-slate-400 hover:text-slate-600">
                            <Settings className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}
