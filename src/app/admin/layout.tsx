'use client'

import dynamic from 'next/dynamic'

// Force dynamic rendering to prevent prerendering issues with Supabase
export const runtime = 'nodejs'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    Database,
    BarChart3,
    Settings,
    Shield,
    LogOut,
    Menu,
    X,
    RefreshCw,
    Bell,
    Search,
    ChevronRight,
    Zap,
    Globe,
    Youtube,
    FileText,
    AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
    children: React.ReactNode
}

const sidebarItems = [
    {
        title: 'OVERVIEW',
        items: [
            { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
            { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        ]
    },
    {
        title: 'CONTENT',
        items: [
            { name: 'Trends', href: '/admin/trends', icon: TrendingUp },
            { name: 'YouTube Videos', href: '/admin/videos', icon: Youtube },
            { name: 'Custom Posts', href: '/admin/posts', icon: FileText },
        ]
    },
    {
        title: 'SYSTEM',
        items: [
            { name: 'Users', href: '/admin/users', icon: Users },
            { name: 'Cache Control', href: '/admin/cache', icon: Database },
            { name: 'API Usage', href: '/admin/api-usage', icon: Zap },
            { name: 'Logs', href: '/admin/logs', icon: AlertCircle },
        ]
    },
    {
        title: 'SETTINGS',
        items: [
            { name: 'App Settings', href: '/admin/settings', icon: Settings },
        ]
    }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
    const [adminName, setAdminName] = useState('')

    useEffect(() => {
        // Check if user is admin
        const checkAdmin = async () => {
            try {
                const response = await fetch('/api/admin/check')
                const data = await response.json()

                if (data.isAdmin) {
                    setIsAdmin(true)
                    setAdminName(data.name || 'Admin')
                } else {
                    setIsAdmin(false)
                    router.push('/dashboard')
                }
            } catch (error) {
                setIsAdmin(false)
                router.push('/dashboard')
            }
        }
        checkAdmin()
    }, [router])

    if (isAdmin === null) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-8 h-8 text-[#FFC900] animate-spin" />
                    <p className="text-white font-mono">Verifying admin access...</p>
                </div>
            </div>
        )
    }

    if (isAdmin === false) {
        return null
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 h-screen bg-[#111111] border-r-2 border-[#FFC900] transition-all duration-300",
                    sidebarOpen ? "w-64" : "w-20"
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b-2 border-[#222]">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FFC900] flex items-center justify-center">
                            <Shield className="w-6 h-6 text-black" />
                        </div>
                        {sidebarOpen && (
                            <span className="font-black text-lg uppercase tracking-tight">
                                Admin
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-[#222] rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-8rem)]">
                    {sidebarItems.map((section) => (
                        <div key={section.title}>
                            {sidebarOpen && (
                                <p className="text-xs font-bold text-[#666] mb-2 tracking-widest">
                                    {section.title}
                                </p>
                            )}
                            <ul className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-all",
                                                    isActive
                                                        ? "bg-[#FFC900] text-black"
                                                        : "text-[#888] hover:text-white hover:bg-[#1A1A1A]"
                                                )}
                                            >
                                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                                {sidebarOpen && <span>{item.name}</span>}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-[#222] bg-[#111]">
                    <div className={cn("flex items-center", sidebarOpen ? "gap-3" : "justify-center")}>
                        <div className="w-10 h-10 bg-[#FFC900] rounded-full flex items-center justify-center font-black text-black">
                            {adminName.charAt(0).toUpperCase()}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1">
                                <p className="font-bold text-sm">{adminName}</p>
                                <p className="text-xs text-[#666]">Super Admin</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={cn(
                    "transition-all duration-300 min-h-screen",
                    sidebarOpen ? "ml-64" : "ml-20"
                )}
            >
                {/* Top Header */}
                <header className="h-16 bg-[#111] border-b-2 border-[#222] flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-[#1A1A1A] border-2 border-[#333] rounded-lg pl-10 pr-4 py-2 text-sm focus:border-[#FFC900] focus:outline-none w-64"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 bg-[#1A1A1A] border-2 border-[#333] rounded-lg hover:border-[#FFC900] transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">3</span>
                        </button>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#333] rounded-lg text-sm font-semibold hover:border-[#FFC900] transition-colors flex items-center gap-2"
                        >
                            <Globe className="w-4 h-4" />
                            View Site
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
