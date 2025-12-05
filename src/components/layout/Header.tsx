'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Search, Plus, X, Sparkles } from 'lucide-react'

interface User {
    id: string
    name: string
    email: string
    role: string
}

interface HeaderProps {
    user: User | null
}

interface Notification {
    id: string
    type: string
    title: string
    message: string
    isRead: boolean
    createdAt: string
    link?: string
}

const pageConfig: Record<string, { title: string; description: string }> = {
    '/dashboard': {
        title: 'Dashboard',
        description: 'Overview of your content planning',
    },
    '/dashboard/trends': {
        title: 'Trends',
        description: 'Capture and organize trending content ideas',
    },
    '/dashboard/ideas': {
        title: 'Ideas',
        description: 'Manage your content ideas pipeline',
    },
    '/dashboard/calendar': {
        title: 'Content Calendar',
        description: 'Schedule and manage your posts',
    },
    '/dashboard/admin/users': {
        title: 'Team Management',
        description: 'Manage team members and roles',
    },
    '/dashboard/admin/settings': {
        title: 'Settings',
        description: 'Configure workspace and brand settings',
    },
    '/dashboard/admin/slots': {
        title: 'Content Slots',
        description: 'Configure recurring content slots',
    },
}

export default function Header({ user }: HeaderProps) {
    const pathname = usePathname()
    const [showNotifications, setShowNotifications] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Mock notifications - replace with real data
    const [notifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'UPCOMING_POST',
            title: 'Post scheduled for tomorrow',
            message: 'Instagram Reel about summer trends is due in 24 hours',
            isRead: false,
            createdAt: new Date().toISOString(),
            link: '/dashboard/posts/1',
        },
        {
            id: '2',
            type: 'STUCK_POST',
            title: 'Post stuck in review',
            message: 'TikTok video has been in review for 3 days',
            isRead: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            link: '/dashboard/posts/2',
        },
        {
            id: '3',
            type: 'EMPTY_SLOT',
            title: 'Empty content slot',
            message: 'Monday 6PM Instagram slot is empty',
            isRead: true,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            link: '/dashboard/calendar',
        },
    ])

    const unreadCount = notifications.filter((n) => !n.isRead).length

    const currentPage = pageConfig[pathname || ''] || {
        title: 'Trendly',
        description: 'Social media content planning',
    }

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (hours < 1) return 'Just now'
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }

    return (
        <header
            style={{
                position: 'sticky',
                top: 0,
                height: 'var(--header-height)',
                background: 'rgba(10, 10, 15, 0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 var(--space-6)',
                zIndex: 40,
            }}
        >
            {/* Page Title */}
            <div>
                <h1
                    style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: 'var(--font-semibold)',
                        marginBottom: 'var(--space-1)',
                    }}
                >
                    {currentPage.title}
                </h1>
                <p
                    style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    {currentPage.description}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => setShowSearch(!showSearch)}
                    >
                        <Search size={20} />
                    </button>

                    {showSearch && (
                        <>
                            <div
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    zIndex: 100,
                                }}
                                onClick={() => setShowSearch(false)}
                            />
                            <div
                                style={{
                                    position: 'fixed',
                                    top: '20%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '100%',
                                    maxWidth: 600,
                                    padding: 'var(--space-4)',
                                    zIndex: 101,
                                }}
                            >
                                <div
                                    style={{
                                        background: 'var(--color-bg-secondary)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-xl)',
                                        overflow: 'hidden',
                                        boxShadow: 'var(--shadow-xl)',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-3)',
                                            padding: 'var(--space-4)',
                                            borderBottom: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <Search size={20} style={{ color: 'var(--color-text-muted)' }} />
                                        <input
                                            type="text"
                                            placeholder="Search trends, ideas, posts..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            autoFocus
                                            style={{
                                                flex: 1,
                                                background: 'transparent',
                                                border: 'none',
                                                outline: 'none',
                                                fontSize: 'var(--text-base)',
                                                color: 'var(--color-text-primary)',
                                            }}
                                        />
                                        <kbd
                                            style={{
                                                padding: 'var(--space-1) var(--space-2)',
                                                fontSize: 'var(--text-xs)',
                                                background: 'var(--color-bg-tertiary)',
                                                borderRadius: 'var(--radius-sm)',
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            ESC
                                        </kbd>
                                    </div>
                                    <div
                                        style={{
                                            padding: 'var(--space-8)',
                                            textAlign: 'center',
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        <p>Start typing to search...</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Notifications */}
                <div style={{ position: 'relative' }} className="notification-bell">
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </button>

                    {showNotifications && (
                        <>
                            <div
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    zIndex: 99,
                                }}
                                onClick={() => setShowNotifications(false)}
                            />
                            <div className="notification-panel" style={{ zIndex: 100 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: 'var(--space-4)',
                                        borderBottom: '1px solid var(--color-border)',
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: 'var(--text-base)',
                                            fontWeight: 'var(--font-semibold)',
                                        }}
                                    >
                                        Notifications
                                    </h3>
                                    <button
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-primary)',
                                        }}
                                    >
                                        Mark all as read
                                    </button>
                                </div>
                                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div
                                            style={{
                                                padding: 'var(--space-8)',
                                                textAlign: 'center',
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            <Bell size={32} style={{ marginBottom: 'var(--space-2)', opacity: 0.5 }} />
                                            <p>No notifications</p>
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <p
                                                        style={{
                                                            fontSize: 'var(--text-sm)',
                                                            fontWeight: 'var(--font-medium)',
                                                            marginBottom: 'var(--space-1)',
                                                        }}
                                                    >
                                                        {notification.title}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: 'var(--text-xs)',
                                                            color: 'var(--color-text-secondary)',
                                                            marginBottom: 'var(--space-1)',
                                                        }}
                                                    >
                                                        {notification.message}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: 'var(--text-xs)',
                                                            color: 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        {formatTime(notification.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* AI Generate Button */}
                <button className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
                    <Sparkles size={16} />
                    <span className="hide-mobile">Generate with AI</span>
                </button>
            </div>
        </header>
    )
}
