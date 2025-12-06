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
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`)

    const links = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/trends', label: 'Trends', icon: TrendingUp },
        { href: '/dashboard/ideas', label: 'Ideas', icon: Lightbulb },
        { href: '/dashboard/scripts', label: 'Scripts', icon: Video },
        { href: '/dashboard/virality', label: 'Virality', icon: Zap },
        { href: '/dashboard/comments', label: 'Comments', icon: MessageCircle },
        { href: '/dashboard/pillars', label: 'Pillars', icon: Layers },
        { href: '/dashboard/best-time', label: 'Best Time', icon: Clock },
        { href: '/dashboard/competitors', label: 'Competitors', icon: Target },
        { href: '/dashboard/repurpose', label: 'Repurpose', icon: Sparkles },
        { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
        { href: '/dashboard/admin/users', label: 'Team', icon: Users },
    ]

    const navItemClass = (active: boolean) => cn(
        "group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
        active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    )

    return (
        <aside className="w-64 border-r bg-background/50 backdrop-blur-xl h-screen flex flex-col sticky top-0">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b">
                <div className="flex items-center gap-2 font-semibold">
                    <div className="bg-primary text-primary-foreground p-1 rounded-md">
                        <Sparkles size={16} fill="currentColor" />
                    </div>
                    <span>Trendly</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
                <div className="px-3 mb-2 text-xs font-medium text-muted-foreground/50 uppercase tracking-wider">
                    Platform
                </div>

                {links.map((link) => {
                    const Icon = link.icon
                    const active = isActive(link.href)
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={navItemClass(active)}
                        >
                            <Icon size={16} strokeWidth={2} className={active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"} />
                            {link.label}
                            {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
                        </Link>
                    )
                })}

                <div className="mt-8 px-3 mb-2 text-xs font-medium text-muted-foreground/50 uppercase tracking-wider">
                    Your Team
                </div>
                {['Sarah Chen', 'Mike Johnson', 'Emily Davis'].map((name, i) => (
                    <button key={i} className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors w-full text-left">
                        <div className="w-6 h-6 rounded-full bg-muted border flex items-center justify-center text-[10px] font-bold">
                            {name.charAt(0)}
                        </div>
                        {name}
                    </button>
                ))}

            </div>

            {/* Footer */}
            <div className="p-3 border-t bg-muted/20">
                <Link
                    href="/dashboard/admin/settings"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors mb-1"
                    )}
                >
                    <Settings size={16} />
                    Settings
                </Link>
                <button
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut size={16} />
                    Log out
                </button>
            </div>
        </aside>
    )
}
