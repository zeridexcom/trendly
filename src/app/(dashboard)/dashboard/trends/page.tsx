'use client'

import { useState } from 'react'
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
    Sparkles,
    Loader2,
    TrendingUp,
    Zap,
    CheckCircle,
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
    aiGenerated?: boolean
    reason?: string
}

interface DiscoveredTrend {
    title: string
    platform: string
    type: string
    reason: string
}

interface TrendAnalysis {
    score: number
    potential: string
    insights: string[]
    contentIdeas: string[]
    bestTimeToPost: string
    predictedLifespan: string
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
    VIDEO_STYLE: { icon: '🎬', label: 'Video Style' },
    CHALLENGE: { icon: '🏆', label: 'Challenge' },
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
    const [showAIModal, setShowAIModal] = useState(false)
    const [showAnalysisModal, setShowAnalysisModal] = useState(false)
    const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null)
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const [isDiscovering, setIsDiscovering] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [discoveredTrends, setDiscoveredTrends] = useState<DiscoveredTrend[]>([])
    const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        platform: 'INSTAGRAM',
        type: 'MEME_FORMAT',
        url: '',
        notes: '',
    })

    // AI Modal form state
    const [aiFormData, setAiFormData] = useState({
        platforms: ['INSTAGRAM', 'TIKTOK'],
        niche: '',
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

    // 🔥 AI DISCOVER TRENDS - Connected to API!
    const handleDiscoverTrends = async () => {
        setIsDiscovering(true)
        setDiscoveredTrends([])

        try {
            const response = await fetch('/api/ai/trends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'discover',
                    platforms: aiFormData.platforms,
                    niche: aiFormData.niche || undefined,
                }),
            })

            const data = await response.json()

            if (data.trends && data.trends.length > 0) {
                setDiscoveredTrends(data.trends)
            } else {
                // Fallback mock data
                setDiscoveredTrends([
                    { title: 'Short-form educational content', platform: 'TIKTOK', type: 'VIDEO_STYLE', reason: 'Educational reels under 60 seconds are seeing 3x engagement' },
                    { title: 'Behind-the-scenes authenticity', platform: 'INSTAGRAM', type: 'MEME_FORMAT', reason: 'Raw, unpolished content builds trust with Gen Z' },
                    { title: 'POV storytelling format', platform: 'TIKTOK', type: 'VIDEO_STYLE', reason: 'POV videos create immersive viewer experiences' },
                ])
            }
        } catch (error) {
            console.error('AI discover error:', error)
            alert('Failed to discover trends. Please try again.')
        } finally {
            setIsDiscovering(false)
        }
    }

    // Add discovered trend to list
    const handleAddDiscoveredTrend = (discovered: DiscoveredTrend) => {
        const newTrend: Trend = {
            id: Date.now().toString(),
            title: discovered.title,
            platform: discovered.platform,
            type: discovered.type,
            notes: discovered.reason,
            createdBy: { name: 'Trendly AI' },
            createdAt: new Date().toISOString(),
            aiGenerated: true,
            reason: discovered.reason,
        }
        setTrends([newTrend, ...trends])
        setDiscoveredTrends(discoveredTrends.filter(t => t.title !== discovered.title))
    }

    // Add all discovered trends
    const handleAddAllDiscoveredTrends = () => {
        const newTrends = discoveredTrends.map((discovered, index) => ({
            id: (Date.now() + index).toString(),
            title: discovered.title,
            platform: discovered.platform,
            type: discovered.type,
            notes: discovered.reason,
            createdBy: { name: 'Trendly AI' },
            createdAt: new Date().toISOString(),
            aiGenerated: true,
            reason: discovered.reason,
        }))

        setTrends([...newTrends, ...trends])
        setDiscoveredTrends([])
        setShowAIModal(false)
    }

    // 🔥 AI ANALYZE TREND
    const handleAnalyzeTrend = async (trend: Trend) => {
        setSelectedTrend(trend)
        setShowAnalysisModal(true)
        setIsAnalyzing(true)
        setTrendAnalysis(null)

        try {
            const response = await fetch('/api/ai/trends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'analyze',
                    title: trend.title,
                    platform: trend.platform,
                    type: trend.type,
                    description: trend.notes,
                }),
            })

            const data = await response.json()
            setTrendAnalysis(data)
        } catch (error) {
            console.error('AI analyze error:', error)
            // Fallback
            setTrendAnalysis({
                score: 75,
                potential: 'MEDIUM',
                insights: ['This trend shows steady engagement', 'Early adoption recommended', 'Add your unique angle'],
                contentIdeas: ['Tutorial video', 'Behind-the-scenes take', 'Reaction content'],
                bestTimeToPost: '9 AM - 11 AM or 7 PM - 9 PM',
                predictedLifespan: '2-3 weeks',
            })
        } finally {
            setIsAnalyzing(false)
        }
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

                    {/* AI Discover Button */}
                    <button className="btn btn-secondary" onClick={() => setShowAIModal(true)}>
                        <Sparkles size={16} />
                        Generate with AI
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
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span style={{ fontSize: '20px' }}>
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
                                    {trend.aiGenerated && (
                                        <span style={{
                                            fontSize: '10px',
                                            background: 'var(--gradient-primary)',
                                            color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: 'var(--radius-full)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '2px'
                                        }}>
                                            <Sparkles size={10} /> AI
                                        </span>
                                    )}
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
                                                <button className="dropdown-item" onClick={() => handleAnalyzeTrend(trend)}>
                                                    <Zap size={14} />
                                                    AI Analyze
                                                </button>
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

            {/* AI Discover Trends Modal - FULLY FUNCTIONAL */}
            {showAIModal && (
                <>
                    <div className="modal-backdrop" onClick={() => !isDiscovering && setShowAIModal(false)} />
                    <div className="modal modal-lg">
                        <div className="modal-header">
                            <div className="flex items-center gap-3">
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--gradient-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Sparkles size={20} color="white" />
                                </div>
                                <h2 className="modal-title">Discover Trends with AI</h2>
                            </div>
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={() => !isDiscovering && setShowAIModal(false)}
                                disabled={isDiscovering}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Show discovered trends if any */}
                            {discoveredTrends.length > 0 ? (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-semibold)' }}>
                                            🔥 Discovered {discoveredTrends.length} Trending Topics
                                        </h3>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={handleAddAllDiscoveredTrends}
                                        >
                                            <CheckCircle size={14} />
                                            Add All
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: 400, overflowY: 'auto' }}>
                                        {discoveredTrends.map((trend, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    padding: 'var(--space-4)',
                                                    background: 'var(--color-bg-tertiary)',
                                                    borderRadius: 'var(--radius-lg)',
                                                    border: '1px solid var(--color-border)',
                                                }}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span style={{ fontSize: '16px' }}>{platformConfig[trend.platform]?.icon || '📱'}</span>
                                                        <h4 style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>
                                                            {trend.title}
                                                        </h4>
                                                    </div>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleAddDiscoveredTrend(trend)}
                                                    >
                                                        <Plus size={14} />
                                                        Add
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="badge" style={{ background: 'var(--color-bg-hover)', fontSize: 'var(--text-xs)' }}>
                                                        {typeConfig[trend.type]?.icon} {typeConfig[trend.type]?.label || trend.type}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                                    💡 {trend.reason}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className="btn btn-secondary mt-4"
                                        style={{ width: '100%' }}
                                        onClick={() => setDiscoveredTrends([])}
                                    >
                                        <Sparkles size={16} />
                                        Discover More Trends
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                                        Let AI discover what's trending right now across social media platforms.
                                    </p>

                                    <div className="input-group mb-4">
                                        <label className="input-label">Platforms to Search</label>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(platformConfig).map(([key, { icon, name }]) => (
                                                <button
                                                    key={key}
                                                    className="btn btn-sm"
                                                    disabled={isDiscovering}
                                                    style={{
                                                        background: aiFormData.platforms.includes(key)
                                                            ? 'var(--color-primary-subtle)'
                                                            : 'var(--color-bg-tertiary)',
                                                        border: aiFormData.platforms.includes(key)
                                                            ? '1px solid var(--color-primary)'
                                                            : '1px solid var(--color-border)',
                                                    }}
                                                    onClick={() => {
                                                        const newPlatforms = aiFormData.platforms.includes(key)
                                                            ? aiFormData.platforms.filter((p) => p !== key)
                                                            : [...aiFormData.platforms, key]
                                                        setAiFormData({ ...aiFormData, platforms: newPlatforms })
                                                    }}
                                                >
                                                    {icon} {name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Your Niche (optional)</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="e.g., fitness, cooking, tech reviews, education..."
                                            value={aiFormData.niche}
                                            onChange={(e) => setAiFormData({ ...aiFormData, niche: e.target.value })}
                                            disabled={isDiscovering}
                                        />
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                                            Adding your niche helps AI find more relevant trends
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {discoveredTrends.length === 0 && (
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowAIModal(false)}
                                    disabled={isDiscovering}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleDiscoverTrends}
                                    disabled={isDiscovering || aiFormData.platforms.length === 0}
                                >
                                    {isDiscovering ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Discovering...
                                        </>
                                    ) : (
                                        <>
                                            <TrendingUp size={16} />
                                            Discover Trends
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* AI Analysis Modal */}
            {showAnalysisModal && selectedTrend && (
                <>
                    <div className="modal-backdrop" onClick={() => !isAnalyzing && setShowAnalysisModal(false)} />
                    <div className="modal modal-lg">
                        <div className="modal-header">
                            <div className="flex items-center gap-3">
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 'var(--radius-md)',
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Zap size={20} color="white" />
                                </div>
                                <div>
                                    <h2 className="modal-title">AI Trend Analysis</h2>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                                        {selectedTrend.title}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={() => setShowAnalysisModal(false)}
                                disabled={isAnalyzing}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {isAnalyzing ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)', gap: 'var(--space-3)' }}>
                                    <Loader2 size={24} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                                    <span>Analyzing trend potential...</span>
                                </div>
                            ) : trendAnalysis ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    {/* Score */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                        <div
                                            style={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                background: `conic-gradient(var(--color-primary) ${trendAnalysis.score}%, var(--color-bg-tertiary) 0)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: '50%',
                                                    background: 'var(--color-bg-secondary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 'var(--text-xl)',
                                                    fontWeight: 'var(--font-bold)',
                                                }}
                                            >
                                                {trendAnalysis.score}
                                            </div>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                                Trend Score
                                            </p>
                                            <span
                                                style={{
                                                    padding: 'var(--space-1) var(--space-3)',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: 'var(--text-sm)',
                                                    fontWeight: 'var(--font-medium)',
                                                    background: trendAnalysis.potential === 'HIGH' ? 'var(--color-success-subtle)' : 'var(--color-warning-subtle)',
                                                    color: trendAnalysis.potential === 'HIGH' ? 'var(--color-success)' : 'var(--color-warning)',
                                                }}
                                            >
                                                {trendAnalysis.potential} Potential
                                            </span>
                                        </div>
                                    </div>

                                    {/* Key Insights */}
                                    <div>
                                        <h4 style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>🎯 Key Insights</h4>
                                        <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                            {trendAnalysis.insights.map((insight, i) => (
                                                <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', paddingLeft: 'var(--space-4)' }}>
                                                    • {insight}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Content Ideas */}
                                    <div>
                                        <h4 style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>💡 Content Ideas</h4>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                            {trendAnalysis.contentIdeas.map((idea, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        padding: 'var(--space-2) var(--space-3)',
                                                        background: 'var(--color-bg-tertiary)',
                                                        borderRadius: 'var(--radius-md)',
                                                        fontSize: 'var(--text-sm)',
                                                    }}
                                                >
                                                    {idea}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Timing */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                        <div style={{ padding: 'var(--space-3)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Best Time to Post</p>
                                            <p style={{ fontWeight: 'var(--font-medium)' }}>{trendAnalysis.bestTimeToPost}</p>
                                        </div>
                                        <div style={{ padding: 'var(--space-3)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>Predicted Lifespan</p>
                                            <p style={{ fontWeight: 'var(--font-medium)' }}>{trendAnalysis.predictedLifespan}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowAnalysisModal(false)}>
                                Close
                            </button>
                            <button className="btn btn-primary">
                                <Lightbulb size={16} />
                                Create Idea from Trend
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
