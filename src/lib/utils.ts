import { type ClassValue, clsx } from 'clsx'

// Utility to combine class names
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

// Format date for display
export function formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

// Format date and time
export function formatDateTime(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date | string): string {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(date)
}

// Platform display names and icons
export const platformConfig = {
    INSTAGRAM: { name: 'Instagram', icon: '📸', color: '#E4405F' },
    TIKTOK: { name: 'TikTok', icon: '🎵', color: '#000000' },
    YOUTUBE: { name: 'YouTube', icon: '▶️', color: '#FF0000' },
    TWITTER: { name: 'X (Twitter)', icon: '𝕏', color: '#1DA1F2' },
    LINKEDIN: { name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
    OTHER: { name: 'Other', icon: '🌐', color: '#6B7280' },
}

// Status colors
export const statusColors = {
    // Idea statuses
    NEW: { bg: '#6b7280', text: '#ffffff', label: 'New' },
    SHORTLISTED: { bg: '#3b82f6', text: '#ffffff', label: 'Shortlisted' },
    IN_BRIEFING: { bg: '#f59e0b', text: '#000000', label: 'In Briefing' },
    IN_PRODUCTION: { bg: '#8b5cf6', text: '#ffffff', label: 'In Production' },
    ARCHIVED: { bg: '#374151', text: '#ffffff', label: 'Archived' },
    // Post statuses
    IDEA: { bg: '#6b7280', text: '#ffffff', label: 'Idea' },
    DRAFT: { bg: '#3b82f6', text: '#ffffff', label: 'Draft' },
    IN_REVIEW: { bg: '#eab308', text: '#000000', label: 'In Review' },
    APPROVED: { bg: '#22c55e', text: '#ffffff', label: 'Approved' },
    SCHEDULED: { bg: '#a855f7', text: '#ffffff', label: 'Scheduled' },
    PUBLISHED: { bg: '#15803d', text: '#ffffff', label: 'Published' },
}

// Priority config
export const priorityConfig = {
    LOW: { color: '#6b7280', label: 'Low', icon: '↓' },
    NORMAL: { color: '#3b82f6', label: 'Normal', icon: '→' },
    HIGH: { color: '#ef4444', label: 'High', icon: '↑' },
}

// Format config
export const formatConfig = {
    REEL: { label: 'Reel', icon: '🎬' },
    STORY: { label: 'Story', icon: '📱' },
    CAROUSEL: { label: 'Carousel', icon: '🎠' },
    SINGLE_IMAGE: { label: 'Single Image', icon: '🖼️' },
    SHORT: { label: 'Short', icon: '⚡' },
    TEXT_POST: { label: 'Text Post', icon: '📝' },
    THREAD: { label: 'Thread', icon: '🧵' },
    OTHER: { label: 'Other', icon: '📌' },
}

// Goal config
export const goalConfig = {
    AWARENESS: { label: 'Awareness', icon: '👁️', color: '#3b82f6' },
    ENGAGEMENT: { label: 'Engagement', icon: '💬', color: '#22c55e' },
    LEADS: { label: 'Leads', icon: '🎯', color: '#f59e0b' },
    SALES: { label: 'Sales', icon: '💰', color: '#ef4444' },
    OTHER: { label: 'Other', icon: '📌', color: '#6b7280' },
}

// Trend type config
export const trendTypeConfig = {
    HASHTAG: { label: 'Hashtag', icon: '#️⃣' },
    SOUND_AUDIO: { label: 'Sound/Audio', icon: '🎵' },
    MEME_FORMAT: { label: 'Meme/Format', icon: '😂' },
    TOPIC: { label: 'Topic', icon: '💡' },
    OTHER: { label: 'Other', icon: '📌' },
}

// Days of week
export const daysOfWeek = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
]

// Generate time slots (every 30 minutes)
export function generateTimeSlots(): { value: string; label: string }[] {
    const slots = []
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hour = h.toString().padStart(2, '0')
            const minute = m.toString().padStart(2, '0')
            const value = `${hour}:${minute}`
            const label = new Date(`2000-01-01T${value}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
            })
            slots.push({ value, label })
        }
    }
    return slots
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 3) + '...'
}

// Generate initials from name
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

// Debounce function
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}
