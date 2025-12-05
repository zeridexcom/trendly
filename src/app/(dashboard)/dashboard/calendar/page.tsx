'use client'

import { useState, useMemo } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Filter,
    List,
    Grid3X3,
    X,
    Sparkles,
} from 'lucide-react'
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday,
    addWeeks,
    subWeeks,
} from 'date-fns'

// Types
interface Post {
    id: string
    title: string
    status: string
    platforms: string[]
    format: string
    scheduledDateTime: string
    ownerId?: string
    owner?: { name: string }
}

interface ContentSlot {
    id: string
    name: string
    platform: string
    format: string
    dayOfWeek: number
    timeOfDay: string
}

// Mock data
const mockPosts: Post[] = [
    {
        id: '1',
        title: 'Monday motivation reel',
        status: 'SCHEDULED',
        platforms: ['INSTAGRAM'],
        format: 'REEL',
        scheduledDateTime: '2024-01-15T10:00:00Z',
        owner: { name: 'Sarah Chen' },
    },
    {
        id: '2',
        title: 'Product feature announcement',
        status: 'APPROVED',
        platforms: ['TWITTER'],
        format: 'TEXT_POST',
        scheduledDateTime: '2024-01-15T14:00:00Z',
        owner: { name: 'Mike Johnson' },
    },
    {
        id: '3',
        title: 'Tutorial: Getting started guide',
        status: 'IN_REVIEW',
        platforms: ['YOUTUBE'],
        format: 'SHORT',
        scheduledDateTime: '2024-01-16T12:00:00Z',
        owner: { name: 'Emily Davis' },
    },
    {
        id: '4',
        title: 'Behind the scenes carousel',
        status: 'DRAFT',
        platforms: ['INSTAGRAM'],
        format: 'CAROUSEL',
        scheduledDateTime: '2024-01-17T18:00:00Z',
        owner: { name: 'Alex Kim' },
    },
    {
        id: '5',
        title: 'Industry insights thread',
        status: 'IDEA',
        platforms: ['TWITTER', 'LINKEDIN'],
        format: 'THREAD',
        scheduledDateTime: '2024-01-18T09:00:00Z',
        owner: { name: 'Sarah Chen' },
    },
    {
        id: '6',
        title: 'Customer story highlight',
        status: 'PUBLISHED',
        platforms: ['INSTAGRAM'],
        format: 'STORY',
        scheduledDateTime: '2024-01-12T16:00:00Z',
        owner: { name: 'Mike Johnson' },
    },
]

const mockSlots: ContentSlot[] = [
    { id: 's1', name: 'Monday Tips', platform: 'INSTAGRAM', format: 'REEL', dayOfWeek: 1, timeOfDay: '10:00' },
    { id: 's2', name: 'Wednesday Wisdom', platform: 'LINKEDIN', format: 'TEXT_POST', dayOfWeek: 3, timeOfDay: '09:00' },
    { id: 's3', name: 'Friday Fun', platform: 'TIKTOK', format: 'SHORT', dayOfWeek: 5, timeOfDay: '18:00' },
]

const platformIcons: Record<string, string> = {
    INSTAGRAM: '📸',
    TIKTOK: '🎵',
    YOUTUBE: '▶️',
    TWITTER: '𝕏',
    LINKEDIN: '💼',
}

const statusColors: Record<string, { bg: string; border: string }> = {
    IDEA: { bg: '#6b728020', border: '#6b7280' },
    DRAFT: { bg: '#3b82f620', border: '#3b82f6' },
    IN_REVIEW: { bg: '#eab30820', border: '#eab308' },
    APPROVED: { bg: '#22c55e20', border: '#22c55e' },
    SCHEDULED: { bg: '#a855f720', border: '#a855f7' },
    PUBLISHED: { bg: '#15803d20', border: '#15803d' },
}

const formatConfig: Record<string, string> = {
    REEL: '🎬',
    STORY: '📱',
    CAROUSEL: '🎠',
    SINGLE_IMAGE: '🖼️',
    SHORT: '⚡',
    TEXT_POST: '📝',
    THREAD: '🧵',
    OTHER: '📌',
}

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState<'month' | 'week'>('month')
    const [posts, setPosts] = useState(mockPosts)
    const [showFilters, setShowFilters] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [filterPlatform, setFilterPlatform] = useState('')
    const [filterStatus, setFilterStatus] = useState('')

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        platforms: ['INSTAGRAM'],
        format: 'REEL',
        scheduledDateTime: '',
        status: 'IDEA',
    })

    // Generate calendar days
    const calendarDays = useMemo(() => {
        if (view === 'month') {
            const monthStart = startOfMonth(currentDate)
            const monthEnd = endOfMonth(currentDate)
            const calendarStart = startOfWeek(monthStart)
            const calendarEnd = endOfWeek(monthEnd)
            return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
        } else {
            const weekStart = startOfWeek(currentDate)
            const weekEnd = endOfWeek(currentDate)
            return eachDayOfInterval({ start: weekStart, end: weekEnd })
        }
    }, [currentDate, view])

    // Filter posts
    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesPlatform = !filterPlatform || post.platforms.includes(filterPlatform)
            const matchesStatus = !filterStatus || post.status === filterStatus
            return matchesPlatform && matchesStatus
        })
    }, [posts, filterPlatform, filterStatus])

    // Get posts for a specific day
    const getPostsForDay = (day: Date) => {
        return filteredPosts.filter((post) => {
            const postDate = new Date(post.scheduledDateTime)
            return isSameDay(postDate, day)
        })
    }

    // Get slots for a specific day
    const getSlotsForDay = (day: Date) => {
        const dayOfWeek = day.getDay()
        return mockSlots.filter((slot) => slot.dayOfWeek === dayOfWeek)
    }

    // Navigation
    const handlePrev = () => {
        setCurrentDate(view === 'month' ? subMonths(currentDate, 1) : subWeeks(currentDate, 1))
    }

    const handleNext = () => {
        setCurrentDate(view === 'month' ? addMonths(currentDate, 1) : addWeeks(currentDate, 1))
    }

    const handleToday = () => {
        setCurrentDate(new Date())
    }

    // Handle click on empty day
    const handleDayClick = (day: Date) => {
        setSelectedDate(day)
        setFormData({
            ...formData,
            scheduledDateTime: format(day, "yyyy-MM-dd'T'10:00"),
        })
        setShowCreateModal(true)
    }

    // Handle create post
    const handleCreatePost = () => {
        const newPost: Post = {
            id: Date.now().toString(),
            ...formData,
            owner: { name: 'Demo User' },
        }
        setPosts([...posts, newPost])
        setShowCreateModal(false)
        setFormData({
            title: '',
            platforms: ['INSTAGRAM'],
            format: 'REEL',
            scheduledDateTime: '',
            status: 'IDEA',
        })
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <div className="animate-fadeIn">
            {/* Calendar Header */}
            <div
                className="flex items-center justify-between flex-wrap gap-4"
                style={{ marginBottom: 'var(--space-6)' }}
            >
                {/* Navigation */}
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary" onClick={handleToday}>
                        Today
                    </button>
                    <div className="flex items-center gap-1">
                        <button className="btn btn-ghost btn-icon" onClick={handlePrev}>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={handleNext}>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <h2
                        style={{
                            fontSize: 'var(--text-xl)',
                            fontWeight: 'var(--font-semibold)',
                        }}
                    >
                        {format(currentDate, view === 'month' ? 'MMMM yyyy' : "'Week of' MMM d, yyyy")}
                    </h2>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="tabs" style={{ padding: 'var(--space-1)' }}>
                        <button
                            className={`tab ${view === 'month' ? 'active' : ''}`}
                            onClick={() => setView('month')}
                            style={{ padding: 'var(--space-2) var(--space-3)' }}
                        >
                            <Grid3X3 size={16} />
                        </button>
                        <button
                            className={`tab ${view === 'week' ? 'active' : ''}`}
                            onClick={() => setView('week')}
                            style={{ padding: 'var(--space-2) var(--space-3)' }}
                        >
                            <List size={16} />
                        </button>
                    </div>

                    {/* Filters */}
                    <button
                        className={`btn btn-secondary ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            background: showFilters ? 'var(--color-primary-subtle)' : undefined,
                        }}
                    >
                        <Filter size={16} />
                        Filters
                    </button>

                    {/* Create Post */}
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={16} />
                        Add Post
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div
                    className="card animate-slideUp"
                    style={{
                        marginBottom: 'var(--space-6)',
                        padding: 'var(--space-4)',
                        display: 'flex',
                        gap: 'var(--space-4)',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <div className="input-group" style={{ flex: 1, minWidth: 200 }}>
                        <label className="input-label">Platform</label>
                        <select
                            className="input select"
                            value={filterPlatform}
                            onChange={(e) => setFilterPlatform(e.target.value)}
                        >
                            <option value="">All Platforms</option>
                            {Object.entries(platformIcons).map(([key, icon]) => (
                                <option key={key} value={key}>
                                    {icon} {key}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group" style={{ flex: 1, minWidth: 200 }}>
                        <label className="input-label">Status</label>
                        <select
                            className="input select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            {Object.keys(statusColors).map((status) => (
                                <option key={status} value={status}>
                                    {status.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                            setFilterPlatform('')
                            setFilterStatus('')
                        }}
                        style={{ marginTop: 'var(--space-6)' }}
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* Calendar Grid */}
            <div className="calendar-grid">
                {/* Week Day Headers */}
                {weekDays.map((day) => (
                    <div key={day} className="calendar-header-cell">
                        {day}
                    </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day, index) => {
                    const dayPosts = getPostsForDay(day)
                    const daySlots = getSlotsForDay(day)
                    const isCurrentMonth = isSameMonth(day, currentDate)
                    const isCurrentDay = isToday(day)

                    return (
                        <div
                            key={day.toISOString()}
                            className={`calendar-cell ${isCurrentDay ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
                            style={{
                                minHeight: view === 'week' ? '200px' : '120px',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleDayClick(day)}
                        >
                            <div className="calendar-date">{format(day, 'd')}</div>

                            {/* Content Slots (ghost elements) */}
                            {daySlots.map((slot) => {
                                const hasPost = dayPosts.some(
                                    (p) =>
                                        p.platforms.includes(slot.platform) &&
                                        p.format === slot.format
                                )
                                if (hasPost) return null

                                return (
                                    <div
                                        key={slot.id}
                                        className="calendar-slot"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setFormData({
                                                ...formData,
                                                platforms: [slot.platform],
                                                format: slot.format,
                                                scheduledDateTime: format(day, `yyyy-MM-dd'T'${slot.timeOfDay}`),
                                            })
                                            setShowCreateModal(true)
                                        }}
                                    >
                                        <span style={{ opacity: 0.7 }}>{platformIcons[slot.platform]}</span>
                                        <span>{slot.name}</span>
                                    </div>
                                )
                            })}

                            {/* Posts */}
                            {dayPosts.slice(0, view === 'week' ? 10 : 3).map((post) => (
                                <div
                                    key={post.id}
                                    className="calendar-post"
                                    style={{
                                        borderLeftColor: statusColors[post.status]?.border,
                                        background: statusColors[post.status]?.bg,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedPost(post)
                                    }}
                                >
                                    <div className="flex items-center gap-1">
                                        {post.platforms.map((p) => (
                                            <span key={p} style={{ fontSize: '10px' }}>
                                                {platformIcons[p]}
                                            </span>
                                        ))}
                                        <span className="truncate" style={{ flex: 1 }}>
                                            {post.title}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {dayPosts.length > (view === 'week' ? 10 : 3) && (
                                <div
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-text-muted)',
                                        padding: 'var(--space-1)',
                                    }}
                                >
                                    +{dayPosts.length - (view === 'week' ? 10 : 3)} more
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowCreateModal(false)} />
                    <div className="modal">
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {selectedDate ? `Schedule for ${format(selectedDate, 'MMM d, yyyy')}` : 'New Post'}
                            </h2>
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={() => setShowCreateModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="input-group mb-4">
                                <label className="input-label">Title *</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="What's this post about?"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="input-group">
                                    <label className="input-label">Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        className="input"
                                        value={formData.scheduledDateTime}
                                        onChange={(e) =>
                                            setFormData({ ...formData, scheduledDateTime: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Format</label>
                                    <select
                                        className="input select"
                                        value={formData.format}
                                        onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                                    >
                                        {Object.entries(formatConfig).map(([key, icon]) => (
                                            <option key={key} value={key}>
                                                {icon} {key.replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="input-group mb-4">
                                <label className="input-label">Platforms</label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(platformIcons).map(([key, icon]) => (
                                        <button
                                            key={key}
                                            className="btn btn-sm"
                                            style={{
                                                background: formData.platforms.includes(key)
                                                    ? 'var(--color-primary-subtle)'
                                                    : 'var(--color-bg-tertiary)',
                                                border: formData.platforms.includes(key)
                                                    ? '1px solid var(--color-primary)'
                                                    : '1px solid var(--color-border)',
                                            }}
                                            onClick={() => {
                                                const newPlatforms = formData.platforms.includes(key)
                                                    ? formData.platforms.filter((p) => p !== key)
                                                    : [...formData.platforms, key]
                                                setFormData({ ...formData, platforms: newPlatforms })
                                            }}
                                        >
                                            {icon} {key}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Initial Status</label>
                                <select
                                    className="input select"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    {Object.keys(statusColors).map((status) => (
                                        <option key={status} value={status}>
                                            {status.replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* AI Suggestion */}
                            <div
                                style={{
                                    marginTop: 'var(--space-6)',
                                    padding: 'var(--space-4)',
                                    background: 'var(--color-primary-subtle)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--color-primary)',
                                }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
                                    <span
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-medium)',
                                            color: 'var(--color-primary)',
                                        }}
                                    >
                                        Need inspiration?
                                    </span>
                                </div>
                                <p
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-text-secondary)',
                                        marginBottom: 'var(--space-3)',
                                    }}
                                >
                                    Generate AI suggestions for captions and hooks after creating the post.
                                </p>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                disabled={!formData.title || !formData.scheduledDateTime}
                                onClick={handleCreatePost}
                            >
                                Create Post
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Post Preview Modal */}
            {selectedPost && (
                <>
                    <div className="modal-backdrop" onClick={() => setSelectedPost(null)} />
                    <div className="modal">
                        <div className="modal-header">
                            <h2 className="modal-title">{selectedPost.title}</h2>
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={() => setSelectedPost(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="flex flex-wrap gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-muted mb-1">Status</p>
                                    <span
                                        className="badge badge-status"
                                        style={{
                                            background: statusColors[selectedPost.status]?.border,
                                            color: 'white',
                                        }}
                                    >
                                        {selectedPost.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs text-muted mb-1">Platforms</p>
                                    <div className="flex gap-1">
                                        {selectedPost.platforms.map((p) => (
                                            <span key={p} style={{ fontSize: '20px' }}>
                                                {platformIcons[p]}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted mb-1">Format</p>
                                    <span>
                                        {formatConfig[selectedPost.format]} {selectedPost.format.replace('_', ' ')}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs text-muted mb-1">Scheduled</p>
                                    <span>
                                        {format(new Date(selectedPost.scheduledDateTime), 'MMM d, yyyy h:mm a')}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs text-muted mb-1">Owner</p>
                                    <span>{selectedPost.owner?.name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setSelectedPost(null)}>
                                Close
                            </button>
                            <button className="btn btn-primary">Edit Post</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
