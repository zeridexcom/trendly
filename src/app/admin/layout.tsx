'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    Database,
    BarChart3,
    Settings,
    Shield,
    Menu,
    X,
    RefreshCw,
    Bell,
    ChevronRight,
    Zap,
    Globe,
    Youtube,
    AlertCircle,
    Home
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
            <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-8 h-8 text-[#FF90E8] animate-spin" />
                    <p className="text-black font-black uppercase">Verifying admin access...</p>
                </div>
            </div>
        )
    }

    if (isAdmin === false) {
        return null
    }

    return (
        <div className="min-h-screen bg-[#F5F5F0] text-black">
            {/* Desktop Sidebar - Neo-Brutalist Style */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 h-screen bg-white border-r-4 border-black transition-all duration-300",
                    sidebarOpen ? "w-64" : "w-20"
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b-4 border-black bg-[#FFC900]">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black flex items-center justify-center">
                            <Shield className="w-6 h-6 text-[#FFC900]" />
                        </div>
                        {sidebarOpen && (
                            <span className="font-black text-lg uppercase tracking-tight text-black">
                                Admin
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-black/10 transition-colors"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-8rem)]">
                    {sidebarItems.map((section) => (
                        <div key={section.title}>
                            {sidebarOpen && (
                                <p className="text-xs font-black text-black/50 mb-2 tracking-widest uppercase">
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
                                                    "flex items-center gap-3 px-3 py-2.5 font-bold uppercase text-sm transition-all border-2",
                                                    isActive
                                                        ? "bg-[#FF90E8] text-black border-black shadow-brutal"
                                                        : "text-black/70 hover:text-black hover:bg-[#F5F5F0] border-transparent hover:border-black"
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
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t-4 border-black bg-white">
                    <div className={cn("flex items-center", sidebarOpen ? "gap-3" : "justify-center")}>
                        <div className="w-10 h-10 bg-[#FF90E8] border-2 border-black flex items-center justify-center font-black text-black">
                            {adminName.charAt(0).toUpperCase()}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1">
                                <p className="font-black text-sm uppercase">{adminName}</p>
                                <p className="text-xs text-black/50 font-bold">Super Admin</p>
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
                <header className="h-16 bg-white border-b-4 border-black flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <h2 className="font-black uppercase text-lg">
                            {pathname === '/admin' && 'Dashboard'}
                            {pathname === '/admin/analytics' && 'Analytics'}
                            {pathname === '/admin/trends' && 'Trends'}
                            {pathname === '/admin/videos' && 'YouTube Videos'}
                            {pathname === '/admin/users' && 'Users'}
                            {pathname === '/admin/cache' && 'Cache Control'}
                            {pathname === '/admin/api-usage' && 'API Usage'}
                            {pathname === '/admin/logs' && 'Logs'}
                            {pathname === '/admin/settings' && 'Settings'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 bg-white border-2 border-black hover:bg-[#FFC900] transition-colors relative shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                            <Bell className="w-5 h-5" />
                        </button>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 bg-[#FFC900] border-2 border-black font-black uppercase text-sm shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
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
