'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    Plus,
    Search,
    Filter,
    ExternalLink,
    MoreVertical,
    Edit,
    Trash2,
    Lightbulb,
    X,
} from 'lucide-react'

// Types
interface Trend {
    id: string
    title: string
    platform: string
    type: string
    url?: string
    notes?: string
    createdBy: { name: string }
    createdAt: string
}

// Mock data
const mockTrends: Trend[] = [
    {
        id: '1',
        title: 'AI-generated art showcase',
        platform: 'INSTAGRAM',
        type: 'MEME_FORMAT',
        url: 'https://instagram.com/example',
        notes: 'Users are sharing AI art with specific prompts. Great for engagement.',
        createdBy: { name: 'Sarah Chen' },
        createdAt: '2024-01-12T10:00:00Z',
    },
    {
        id: '2',
        title: 'Day in my life audio trend',
        platform: 'TIKTOK',
        type: 'SOUND_AUDIO',
        url: 'https://tiktok.com/example',
        notes: 'Trending audio for DITL content. Works well with lifestyle brands.',
        createdBy: { name: 'Mike Johnson' },
        createdAt: '2024-01-11T14:30:00Z',
    },
    {
        id: '3',
        title: '#2024Goals challenge',
        platform: 'TWITTER',
        type: 'HASHTAG',
        notes: 'New year goal setting hashtag gaining traction.',
        createdBy: { name: 'Emily Davis' },
        createdAt: '2024-01-10T09:15:00Z',
    },
    {
        id: '4',
        title: 'Tech industry layoffs discussion',
        platform: 'LINKEDIN',
        type: 'TOPIC',
        notes: 'Hot topic for thought leadership content.',
        createdBy: { name: 'Alex Kim' },
        createdAt: '2024-01-09T16:45:00Z',
    },
    {
        id: '5',
        title: 'Coffee shop aesthetic reels',
        platform: 'INSTAGRAM',
        type: 'MEME_FORMAT',
        notes: 'Cozy coffee shop vibes performing well.',
        createdBy: { name: 'Sarah Chen' },
        createdAt: '2024-01-08T11:20:00Z',
    },
]

const platformConfig: Record<string, { icon: string; name: string; color: string }> = {
    INSTAGRAM: { icon: '📸', name: 'Instagram', color: '#E4405F' },
    TIKTOK: { icon: '🎵', name: 'TikTok', color: '#00f2ea' },
    YOUTUBE: { icon: '▶️', name: 'YouTube', color: '#FF0000' },
    TWITTER: { icon: '𝕏', name: 'X (Twitter)', color: '#1DA1F2' },
    LINKEDIN: { icon: '💼', name: 'LinkedIn', color: '#0A66C2' },
    OTHER: { icon: '🌐', name: 'Other', color: '#6B7280' },
}

const typeConfig: Record<string, { icon: string; label: string }> = {
    HASHTAG: { icon: '#️⃣', label: 'Hashtag' },
    SOUND_AUDIO: { icon: '🎵', label: 'Sound/Audio' },
    MEME_FORMAT: { icon: '😂', label: 'Meme/Format' },
    TOPIC: { icon: '💡', label: 'Topic' },
    OTHER: { icon: '📌', label: 'Other' },
}

export default function TrendsPage() {
    const [trends, setTrends] = useState(mockTrends)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterPlatform, setFilterPlatform] = useState<string>('')
    const [filterType, setFilterType] = useState<string>('')
    const [showFilters, setShowFilters] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null)
    const [activeMenu, setActiveMenu] = useState<string | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        platform: 'INSTAGRAM',
        type: 'MEME_FORMAT',
        url: '',
        notes: '',
    })

    const filteredTrends = trends.filter((trend) => {
        const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trend.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesPlatform = !filterPlatform || trend.platform === filterPlatform
        const matchesType = !filterType || trend.type === filterType
        return matchesSearch && matchesPlatform && matchesType
    })

    const handleCreateTrend = () => {
        const newTrend: Trend = {
            id: Date.now().toString(),
            ...formData,
            createdBy: { name: 'Demo User' },
            createdAt: new Date().toISOString(),
        }
        setTrends([newTrend, ...trends])
        setShowCreateModal(false)
        setFormData({ title: '', platform: 'INSTAGRAM', type: 'MEME_FORMAT', url: '', notes: '' })
    }

    const handleDeleteTrend = (id: string) => {
        setTrends(trends.filter((t) => t.id !== id))
        setActiveMenu(null)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    return (
        <div className="animate-fadeIn">
            {/* Header Actions */}
            <div
                className="flex items-center justify-between flex-wrap gap-4"
                style={{ marginBottom: 'var(--space-6)' }}
            >
                {/* Search */}
                <div
                    style={{
                        position: 'relative',
                        flex: '1',
                        maxWidth: 400,
                    }}
                >
                    <Search
                        size={18}
                        style={{
                            position: 'absolute',
                            left: 'var(--space-4)',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)',
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search trends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input"
                        style={{ paddingLeft: 'var(--space-10)' }}
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* Filter Toggle */}
                    <button
                        className={`btn btn-secondary ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            background: showFilters ? 'var(--color-primary-subtle)' : undefined,
                            borderColor: showFilters ? 'var(--color-primary)' : undefined,
                        }}
                    >
                        <Filter size={16} />
                        Filters
                        {(filterPlatform || filterType) && (
                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: 'var(--color-primary)',
                                }}
                            />
                        )}
                    </button>

                    {/* Create Button */}
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={16} />
                        Add Trend
                    </button>
                </div>
            </div>

            {/* Filters */}
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
                    <div className="input-group" style={{ flex: '1', minWidth: 200 }}>
                        <label className="input-label">Platform</label>
                        <select
                            className="input select"
                            value={filterPlatform}
                            onChange={(e) => setFilterPlatform(e.target.value)}
                        >
                            <option value="">All Platforms</option>
                            {Object.entries(platformConfig).map(([key, { name }]) => (
                                <option key={key} value={key}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group" style={{ flex: '1', minWidth: 200 }}>
                        <label className="input-label">Type</label>
                        <select
                            className="input select"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            {Object.entries(typeConfig).map(([key, { label }]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                            setFilterPlatform('')
                            setFilterType('')
                        }}
                        style={{ marginTop: 'var(--space-6)' }}
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* Trends List */}
            {filteredTrends.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h3 className="empty-state-title">No trends found</h3>
                    <p className="empty-state-description">
                        {searchQuery || filterPlatform || filterType
                            ? 'Try adjusting your search or filters'
                            : 'Start by adding your first trend'}
                    </p>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={16} />
                        Add Trend
                    </button>
                </div>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: 'var(--space-4)',
                    }}
                >
                    {filteredTrends.map((trend, index) => (
                        <div
                            key={trend.id}
                            className="card card-elevated card-interactive"
                            style={{
                                animationDelay: `${index * 50}ms`,
                            }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span
                                        style={{
                                            fontSize: '20px',
                                        }}
                                    >
                                        {platformConfig[trend.platform]?.icon}
                                    </span>
                                    <span
                                        className="badge badge-platform"
                                        style={{
                                            background: `${platformConfig[trend.platform]?.color}20`,
                                            color: platformConfig[trend.platform]?.color,
                                            border: `1px solid ${platformConfig[trend.platform]?.color}`,
                                        }}
                                    >
                                        {platformConfig[trend.platform]?.name}
                                    </span>
                                    <span className="badge" style={{ background: 'var(--color-bg-hover)' }}>
                                        {typeConfig[trend.type]?.icon} {typeConfig[trend.type]?.label}
                                    </span>
                                </div>

                                {/* Actions Menu */}
                                <div style={{ position: 'relative' }}>
                                    <button
                                        className="btn btn-ghost btn-icon btn-sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setActiveMenu(activeMenu === trend.id ? null : trend.id)
                                        }}
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {activeMenu === trend.id && (
                                        <>
                                            <div
                                                style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                                                onClick={() => setActiveMenu(null)}
                                            />
                                            <div className="dropdown-menu" style={{ zIndex: 100 }}>
                                                <button className="dropdown-item">
                                                    <Edit size={14} />
                                                    Edit
                                                </button>
                                                <button className="dropdown-item">
                                                    <Lightbulb size={14} />
                                                    Create Idea
                                                </button>
                                                <div className="dropdown-separator" />
                                                <button
                                                    className="dropdown-item dropdown-item-danger"
                                                    onClick={() => handleDeleteTrend(trend.id)}
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <h3
                                style={{
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 'var(--font-semibold)',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                {trend.title}
                            </h3>

                            {trend.notes && (
                                <p
                                    className="line-clamp-2"
                                    style={{
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--color-text-secondary)',
                                        marginBottom: 'var(--space-4)',
                                    }}
                                >
                                    {trend.notes}
                                </p>
                            )}

                            <div
                                className="flex items-center justify-between"
                                style={{
                                    paddingTop: 'var(--space-3)',
                                    borderTop: '1px solid var(--color-border)',
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="avatar avatar-sm">{trend.createdBy.name.charAt(0)}</div>
                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                        {trend.createdBy.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                        {formatDate(trend.createdAt)}
                                    </span>
                                    {trend.url && (
                                        <a
                                            href={trend.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-ghost btn-icon btn-sm"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowCreateModal(false)} />
                    <div className="modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Add New Trend</h2>
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
                                    placeholder="e.g., New dancing trend on TikTok"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="input-group">
                                    <label className="input-label">Platform *</label>
                                    <select
                                        className="input select"
                                        value={formData.platform}
                                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    >
                                        {Object.entries(platformConfig).map(([key, { name }]) => (
                                            <option key={key} value={key}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Type *</label>
                                    <select
                                        className="input select"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        {Object.entries(typeConfig).map(([key, { label }]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="input-group mb-4">
                                <label className="input-label">URL (optional)</label>
                                <input
                                    type="url"
                                    className="input"
                                    placeholder="https://..."
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Notes (optional)</label>
                                <textarea
                                    className="input"
                                    placeholder="Add any notes about this trend..."
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                disabled={!formData.title}
                                onClick={handleCreateTrend}
                            >
                                Add Trend
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
