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
    Calendar as CalendarIcon
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
import { cn } from '@/lib/utils'

// Types (Keeping same types)
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
]

const mockSlots: ContentSlot[] = [
    { id: 's1', name: 'Monday Tips', platform: 'INSTAGRAM', format: 'REEL', dayOfWeek: 1, timeOfDay: '10:00' },
    { id: 's2', name: 'Wednesday Wisdom', platform: 'LINKEDIN', format: 'TEXT_POST', dayOfWeek: 3, timeOfDay: '09:00' },
]

const platformIcons: Record<string, string> = {
    INSTAGRAM: 'Instagram',
    TIKTOK: 'TikTok',
    YOUTUBE: 'YouTube',
    TWITTER: 'X',
    LINKEDIN: 'LinkedIn',
}

const statusColors: Record<string, string> = {
    IDEA: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    DRAFT: 'bg-blue-50 text-blue-700 border-blue-200',
    IN_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
    APPROVED: 'bg-green-50 text-green-700 border-green-200',
    SCHEDULED: 'bg-purple-50 text-purple-700 border-purple-200',
    PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
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

    const [formData, setFormData] = useState({
        title: '',
        platforms: ['INSTAGRAM'],
        format: 'REEL',
        scheduledDateTime: '',
        status: 'IDEA',
    })

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

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesPlatform = !filterPlatform || post.platforms.includes(filterPlatform)
            const matchesStatus = !filterStatus || post.status === filterStatus
            return matchesPlatform && matchesStatus
        })
    }, [posts, filterPlatform, filterStatus])

    const getPostsForDay = (day: Date) => filteredPosts.filter(post => isSameDay(new Date(post.scheduledDateTime), day))
    const getSlotsForDay = (day: Date) => {
        const dayOfWeek = day.getDay()
        return mockSlots.filter((slot) => slot.dayOfWeek === dayOfWeek)
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const handleCreatePost = () => {
        const newPost: Post = { id: Date.now().toString(), ...formData, owner: { name: 'Demo User' } }
        setPosts([...posts, newPost])
        setShowCreateModal(false)
        setFormData({ title: '', platforms: ['INSTAGRAM'], format: 'REEL', scheduledDateTime: '', status: 'IDEA' })
    }

    return (
        <div className="h-full flex flex-col animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                    <div className="flex items-center border rounded-md bg-background">
                        <button className="p-1 px-2 border-r hover:bg-muted" onClick={() => setCurrentDate(subMonths(currentDate, 1))}><ChevronLeft size={16} /></button>
                        <div className="px-4 py-1 text-sm font-medium w-40 text-center">
                            {format(currentDate, 'MMMM yyyy')}
                        </div>
                        <button className="p-1 px-2 hover:bg-muted" onClick={() => setCurrentDate(addMonths(currentDate, 1))}><ChevronRight size={16} /></button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={() => setCurrentDate(new Date())}>Today</button>
                    <div className="h-6 w-px bg-border mx-2" />
                    <button className={cn("btn btn-sm", view === 'month' ? "bg-primary text-primary-foreground" : "btn-secondary")} onClick={() => setView('month')}>Month</button>
                    <button className={cn("btn btn-sm", view === 'week' ? "bg-primary text-primary-foreground" : "btn-secondary")} onClick={() => setView('week')}>Week</button>
                    <div className="h-6 w-px bg-border mx-2" />
                    <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
                        <Plus size={16} className="mr-2" /> Create
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 border rounded-xl bg-card overflow-hidden flex flex-col shadow-sm">
                {/* Headers */}
                <div className="grid grid-cols-7 border-b bg-muted/40">
                    {weekDays.map(day => (
                        <div key={day} className="py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider border-r last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                    {calendarDays.map((day, i) => {
                        const dayPosts = getPostsForDay(day)
                        const isCurrentMonth = isSameMonth(day, currentDate)
                        const isCurrentDay = isToday(day)

                        return (
                            <div
                                key={day.toISOString()}
                                className={cn(
                                    "min-h-[120px] border-b border-r p-2 relative group hover:bg-muted/30 transition-colors",
                                    !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                                    isCurrentDay && "bg-blue-50/50"
                                )}
                                onClick={() => { setSelectedDate(day); setFormData({ ...formData, scheduledDateTime: format(day, "yyyy-MM-dd'T'10:00") }); setShowCreateModal(true) }}
                            >
                                <div className={cn("text-xs font-medium mb-2", isCurrentDay ? "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center -ml-1" : "")}>
                                    {format(day, 'd')}
                                </div>

                                <div className="space-y-1">
                                    {dayPosts.map(post => (
                                        <div
                                            key={post.id}
                                            className={cn("text-[10px] px-2 py-1 rounded truncate border cursor-pointer hover:opacity-80 transition-opacity font-medium", statusColors[post.status])}
                                            onClick={(e) => { e.stopPropagation(); setSelectedPost(post) }}
                                        >
                                            {post.platforms[0]?.charAt(0)} • {post.title}
                                        </div>
                                    ))}
                                </div>

                                {/* Hover Add Button */}
                                <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded text-muted-foreground">
                                    <Plus size={14} />
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-lg border bg-card p-6 shadow-lg animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">New Post</h2>
                            <button onClick={() => setShowCreateModal(false)}><X size={20} className="text-muted-foreground" /></button>
                        </div>
                        <input className="w-full bg-background border rounded-md px-3 py-2 mb-4 text-sm" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} autoFocus />

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input type="datetime-local" className="w-full bg-background border rounded-md px-3 py-2 text-sm" value={formData.scheduledDateTime} onChange={e => setFormData({ ...formData, scheduledDateTime: e.target.value })} />
                            <select className="w-full bg-background border rounded-md px-3 py-2 text-sm" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md" onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md" onClick={handleCreatePost}>Schedule</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
