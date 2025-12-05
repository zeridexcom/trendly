'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    TrendingUp,
    Lightbulb,
    Calendar,
    Settings,
    Users,
    Bell,
    LogOut,
    Menu,
    X,
    Clock,
    Sparkles,
    ChevronDown,
} from 'lucide-react'

interface User {
    id: string
    name: string
    email: string
    role: string
    avatarUrl?: string
}

interface SidebarProps {
    user: User | null
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Trends', href: '/dashboard/trends', icon: TrendingUp },
    { name: 'Ideas', href: '/dashboard/ideas', icon: Lightbulb },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
]

const adminNavigation = [
    { name: 'Team', href: '/dashboard/admin/users', icon: Users },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
    { name: 'Content Slots', href: '/dashboard/admin/slots', icon: Clock },
]

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [notifications, setNotifications] = useState<number>(3)
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER'

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="btn btn-ghost btn-icon show-mobile fixed top-4 left-4 z-50"
                style={{ display: 'none' }}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 hide-desktop"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`sidebar ${isMobileOpen ? 'open' : ''}`}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 'var(--sidebar-width)',
                    background: 'var(--color-bg-secondary)',
                    borderRight: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 45,
                    transform: isMobileOpen ? 'translateX(0)' : undefined,
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        padding: 'var(--space-6)',
                        borderBottom: '1px solid var(--color-border)',
                    }}
                >
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--gradient-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Sparkles size={24} color="white" />
                        </div>
                        <span
                            style={{
                                fontSize: 'var(--text-xl)',
                                fontWeight: 'var(--font-bold)',
                            }}
                            className="text-gradient"
                        >
                            Trendly
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto' }}>
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                        <p
                            style={{
                                fontSize: 'var(--text-xs)',
                                fontWeight: 'var(--font-semibold)',
                                color: 'var(--color-text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                padding: '0 var(--space-3)',
                                marginBottom: 'var(--space-2)',
                            }}
                        >
                            Main Menu
                        </p>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        padding: 'var(--space-3) var(--space-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        marginBottom: 'var(--space-1)',
                                        color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                        background: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                                        fontWeight: isActive ? 'var(--font-medium)' : 'var(--font-normal)',
                                        transition: 'all var(--transition-fast)',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'var(--color-glass-hover)'
                                            e.currentTarget.style.color = 'var(--color-text-primary)'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent'
                                            e.currentTarget.style.color = 'var(--color-text-secondary)'
                                        }
                                    }}
                                >
                                    <item.icon size={20} style={{ opacity: isActive ? 1 : 0.7 }} />
                                    <span style={{ fontSize: 'var(--text-sm)' }}>{item.name}</span>
                                    {isActive && (
                                        <div
                                            style={{
                                                marginLeft: 'auto',
                                                width: 6,
                                                height: 6,
                                                borderRadius: 'var(--radius-full)',
                                                background: 'var(--color-primary)',
                                            }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {isAdmin && (
                        <div>
                            <p
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 'var(--font-semibold)',
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    padding: '0 var(--space-3)',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                Admin
                            </p>
                            {adminNavigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-3)',
                                            padding: 'var(--space-3) var(--space-4)',
                                            borderRadius: 'var(--radius-lg)',
                                            marginBottom: 'var(--space-1)',
                                            color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                            background: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                                            fontWeight: isActive ? 'var(--font-medium)' : 'var(--font-normal)',
                                            transition: 'all var(--transition-fast)',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'var(--color-glass-hover)'
                                                e.currentTarget.style.color = 'var(--color-text-primary)'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'transparent'
                                                e.currentTarget.style.color = 'var(--color-text-secondary)'
                                            }
                                        }}
                                    >
                                        <item.icon size={20} style={{ opacity: isActive ? 1 : 0.7 }} />
                                        <span style={{ fontSize: 'var(--text-sm)' }}>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </nav>

                {/* User Section */}
                <div
                    style={{
                        padding: 'var(--space-4)',
                        borderTop: '1px solid var(--color-border)',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                        }}
                    >
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                                padding: 'var(--space-3)',
                                borderRadius: 'var(--radius-lg)',
                                background: showUserMenu ? 'var(--color-glass-hover)' : 'transparent',
                                transition: 'all var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--color-glass-hover)'
                            }}
                            onMouseLeave={(e) => {
                                if (!showUserMenu) {
                                    e.currentTarget.style.background = 'transparent'
                                }
                            }}
                        >
                            <div className="avatar avatar-sm">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.name} />
                                ) : (
                                    getInitials(user?.name || 'U')
                                )}
                            </div>
                            <div style={{ flex: 1, textAlign: 'left' }}>
                                <p
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-medium)',
                                        color: 'var(--color-text-primary)',
                                    }}
                                >
                                    {user?.name || 'User'}
                                </p>
                                <p
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-text-muted)',
                                    }}
                                >
                                    {user?.role || 'Member'}
                                </p>
                            </div>
                            <ChevronDown
                                size={16}
                                style={{
                                    color: 'var(--color-text-muted)',
                                    transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)',
                                    transition: 'transform var(--transition-fast)',
                                }}
                            />
                        </button>

                        {showUserMenu && (
                            <div
                                className="dropdown-menu"
                                style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: 0,
                                    right: 0,
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                <button className="dropdown-item dropdown-item-danger" onClick={handleLogout}>
                                    <LogOut size={16} />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    )
}
