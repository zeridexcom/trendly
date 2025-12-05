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
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`)

    const links = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/trends', label: 'Trends', icon: TrendingUp },
        { href: '/dashboard/ideas', label: 'Ideas', icon: Lightbulb },
        { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
        { href: '/dashboard/admin/users', label: 'Team', icon: Users },
    ]

    const friends = [
        { name: 'Sarah Chen', role: 'Designer', avatar: 'S', color: '#FF754C' },
        { name: 'Mike Johnson', role: 'Editor', avatar: 'M', color: '#3F8CFF' },
        { name: 'Emily Davis', role: 'Manager', avatar: 'E', color: '#6C5DD3' },
    ]

    return (
        <aside className="w-[250px] bg-white p-6 flex flex-col border-r border-transparent flex-shrink-0 h-screen sticky top-0 overflow-y-auto no-scrollbar">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 rounded-xl bg-[#6C5DD3] flex items-center justify-center shadow-lg shadow-[#6C5DD3]/20">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-[#11142D]">Trendly</span>
            </div>

            {/* Main Navigation */}
            <div className="flex-1">
                <div className="mb-8">
                    <p className="px-4 text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">Overview</p>
                    <nav className="space-y-1">
                        {links.map((link) => {
                            const Icon = link.icon
                            const active = isActive(link.href)
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "sidebar-link",
                                        active && "active"
                                    )}
                                >
                                    <Icon size={20} />
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Friends/Team Section */}
                <div>
                    <p className="px-4 text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">Team</p>
                    <div className="space-y-3 px-2">
                        {friends.map((friend) => (
                            <div key={friend.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                    style={{ background: friend.color }}
                                >
                                    {friend.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[#11142D]">{friend.name}</p>
                                    <p className="text-xs text-gray-400">{friend.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 border-t border-gray-100">
                <Link
                    href="/dashboard/admin/settings"
                    className="sidebar-link"
                >
                    <Settings size={20} />
                    Settings
                </Link>
                <button
                    className="sidebar-link w-full text-red-400 hover:text-red-500 hover:bg-red-50"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    )
}
