'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    TrendingUp,
    Lightbulb,
    Calendar,
    ArrowRight,
    Sparkles,
    Clock,
    CheckCircle2,
    RefreshCw,
    Zap,
    Target,
    MessageSquare,
    Brain,
} from 'lucide-react'

// Mock data for dashboard
const stats = [
    { label: 'Active Trends', value: '24', change: '+12%', icon: TrendingUp, color: '#a855f7' },
    { label: 'Ideas in Pipeline', value: '18', change: '+5', icon: Lightbulb, color: '#eab308' },
    { label: 'Scheduled Posts', value: '42', change: '+8', icon: Calendar, color: '#22c55e' },
    { label: 'Published This Week', value: '15', change: '+3', icon: CheckCircle2, color: '#3b82f6' },
]

const recentIdeas = [
    { id: '1', title: 'Behind the scenes content series', status: 'SHORTLISTED', platforms: ['INSTAGRAM', 'TIKTOK'], priority: 'HIGH' },
    { id: '2', title: 'User testimonial carousel', status: 'IN_PRODUCTION', platforms: ['INSTAGRAM'], priority: 'NORMAL' },
    { id: '3', title: 'Industry trend analysis thread', status: 'NEW', platforms: ['TWITTER', 'LINKEDIN'], priority: 'LOW' },
]

const upcomingPosts = [
    { id: '1', title: 'Monday motivation reel', platform: 'INSTAGRAM', scheduledFor: '2024-01-15T10:00:00', status: 'SCHEDULED' },
    { id: '2', title: 'Product feature announcement', platform: 'TWITTER', scheduledFor: '2024-01-15T14:00:00', status: 'APPROVED' },
    { id: '3', title: 'Tutorial: Getting started', platform: 'YOUTUBE', scheduledFor: '2024-01-16T12:00:00', status: 'IN_REVIEW' },
]

const trendingNow = [
    { id: '1', title: 'AI-generated art trend', platform: 'INSTAGRAM', type: 'MEME_FORMAT' },
    { id: '2', title: 'Day in my life audio', platform: 'TIKTOK', type: 'SOUND_AUDIO' },
    { id: '3', title: '#2024Goals', platform: 'TWITTER', type: 'HASHTAG' },
]

const platformIcons: Record<string, string> = {
    INSTAGRAM: '📸',
    TIKTOK: '🎵',
    YOUTUBE: '▶️',
    TWITTER: '𝕏',
    LINKEDIN: '💼',
}

const statusColors: Record<string, { bg: string; text: string }> = {
    NEW: { bg: 'var(--color-status-idea)', text: 'white' },
    SHORTLISTED: { bg: 'var(--color-status-draft)', text: 'white' },
    IN_PRODUCTION: { bg: 'var(--color-status-scheduled)', text: 'white' },
    IN_REVIEW: { bg: 'var(--color-status-review)', text: 'black' },
    APPROVED: { bg: 'var(--color-status-approved)', text: 'white' },
    SCHEDULED: { bg: 'var(--color-status-scheduled)', text: 'white' },
}

const priorityConfig: Record<string, { color: string; label: string }> = {
    LOW: { color: 'var(--color-priority-low)', label: '↓ Low' },
    NORMAL: { color: 'var(--color-priority-normal)', label: '→ Normal' },
    HIGH: { color: 'var(--color-priority-high)', label: '↑ High' },
}

interface AIInsights {
    greeting: string
    mainInsight: string
    tips: string[]
    focusArea: string
    actionItems: string[]
}

export default function DashboardPage() {
    const [aiInsights, setAiInsights] = useState<AIInsights | null>(null)
    const [loadingInsights, setLoadingInsights] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchAIInsights = async () => {
        try {
            setRefreshing(true)
            const response = await fetch('/api/ai/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    activeTrends: 24,
                    ideasInPipeline: 18,
                    scheduledPosts: 42,
                    publishedThisWeek: 15,
                    topPlatforms: ['INSTAGRAM', 'TIKTOK', 'TWITTER'],
                }),
            })
            const data = await response.json()
            setAiInsights(data)
        } catch (error) {
            console.error('Failed to fetch AI insights:', error)
            // Set fallback insights
            setAiInsights({
                greeting: "Welcome back! 🚀",
                mainInsight: "Your content pipeline is active. Focus on converting ideas to scheduled posts.",
                tips: [
                    "Review trending topics daily",
                    "Batch create content for efficiency",
                    "Engage during peak hours: 9-11 AM"
                ],
                focusArea: "Content velocity",
                actionItems: ["Check new trends", "Review scheduled content", "Plan next week"]
            })
        } finally {
            setLoadingInsights(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchAIInsights()
    }, [])

    return (
        <div className="animate-fadeIn">
            {/* AI Insights Card - Top Banner */}
            <div
                className="card"
                style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    marginBottom: 'var(--space-6)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: -30,
                        right: -30,
                        width: 150,
                        height: 150,
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                    }}
                />
                <div style={{ position: 'relative' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
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
                                <Brain size={20} color="white" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                    AI Insights
                                </h2>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                    Powered by Trendly AI
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={fetchAIInsights}
                            disabled={refreshing}
                            className="btn btn-ghost btn-sm"
                            style={{ gap: 'var(--space-2)' }}
                        >
                            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>

                    {loadingInsights ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div className="loading" />
                            <span style={{ color: 'var(--color-text-secondary)' }}>Analyzing your content strategy...</span>
                        </div>
                    ) : aiInsights && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                            <div>
                                <p style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
                                    {aiInsights.greeting}
                                </p>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', lineHeight: '1.6' }}>
                                    {aiInsights.mainInsight}
                                </p>
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        padding: 'var(--space-2) var(--space-3)',
                                        background: 'rgba(139, 92, 246, 0.2)',
                                        borderRadius: 'var(--radius-full)',
                                    }}
                                >
                                    <Target size={14} color="var(--color-primary)" />
                                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                        Focus: {aiInsights.focusArea}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <Zap size={14} color="#eab308" />
                                    Quick Tips
                                </p>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    {aiInsights.tips.map((tip, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--color-text-secondary)',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 'var(--space-2)',
                                            }}
                                        >
                                            <span style={{ color: 'var(--color-primary)' }}>•</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: 'var(--space-4)',
                    marginBottom: 'var(--space-8)',
                }}
            >
                {stats.map((stat, index) => (
                    <div
                        key={stat.label}
                        className="card card-elevated"
                        style={{
                            animationDelay: `${index * 50}ms`,
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 'var(--radius-lg)',
                                    background: `${stat.color}20`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <stat.icon size={24} style={{ color: stat.color }} />
                            </div>
                            <span
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 'var(--font-medium)',
                                    color: 'var(--color-success)',
                                    background: 'var(--color-success-subtle)',
                                    padding: 'var(--space-1) var(--space-2)',
                                    borderRadius: 'var(--radius-full)',
                                }}
                            >
                                {stat.change}
                            </span>
                        </div>
                        <p
                            style={{
                                fontSize: 'var(--text-3xl)',
                                fontWeight: 'var(--font-bold)',
                                marginBottom: 'var(--space-1)',
                            }}
                        >
                            {stat.value}
                        </p>
                        <p
                            style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--color-text-secondary)',
                            }}
                        >
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Action Items from AI */}
            {aiInsights && (
                <div
                    className="card"
                    style={{
                        background: 'var(--color-bg-secondary)',
                        marginBottom: 'var(--space-6)',
                    }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 size={18} color="var(--color-success)" />
                        <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-semibold)' }}>
                            Today's Action Items
                        </h3>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                        {aiInsights.actionItems.map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: 'var(--space-3) var(--space-4)',
                                    background: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-lg)',
                                    fontSize: 'var(--text-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-primary-subtle)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--color-bg-tertiary)'
                                }}
                            >
                                <span style={{ color: 'var(--color-text-muted)' }}>{i + 1}.</span>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: 'var(--space-6)',
                }}
            >
                {/* Recent Ideas */}
                <div className="card card-elevated">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(234, 179, 8, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Lightbulb size={20} style={{ color: '#eab308' }} />
                            </div>
                            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                Recent Ideas
                            </h2>
                        </div>
                        <Link
                            href="/dashboard/ideas"
                            className="btn btn-ghost btn-sm"
                            style={{ gap: 'var(--space-2)' }}
                        >
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {recentIdeas.map((idea) => (
                            <div
                                key={idea.id}
                                style={{
                                    padding: 'var(--space-4)',
                                    background: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-bg-hover)'
                                    e.currentTarget.style.transform = 'translateX(4px)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--color-bg-tertiary)'
                                    e.currentTarget.style.transform = 'translateX(0)'
                                }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <p
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-medium)',
                                            flex: 1,
                                        }}
                                    >
                                        {idea.title}
                                    </p>
                                    <span
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 'var(--font-medium)',
                                            padding: 'var(--space-1) var(--space-2)',
                                            borderRadius: 'var(--radius-full)',
                                            background: statusColors[idea.status].bg,
                                            color: statusColors[idea.status].text,
                                        }}
                                    >
                                        {idea.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        {idea.platforms.map((p) => (
                                            <span key={p} style={{ fontSize: '14px' }}>
                                                {platformIcons[p]}
                                            </span>
                                        ))}
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            color: priorityConfig[idea.priority].color,
                                        }}
                                    >
                                        {priorityConfig[idea.priority].label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Posts */}
                <div className="card card-elevated">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(34, 197, 94, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Clock size={20} style={{ color: '#22c55e' }} />
                            </div>
                            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                Upcoming Posts
                            </h2>
                        </div>
                        <Link
                            href="/dashboard/calendar"
                            className="btn btn-ghost btn-sm"
                            style={{ gap: 'var(--space-2)' }}
                        >
                            View calendar <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {upcomingPosts.map((post) => (
                            <div
                                key={post.id}
                                style={{
                                    padding: 'var(--space-4)',
                                    background: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-bg-hover)'
                                    e.currentTarget.style.transform = 'translateX(4px)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--color-bg-tertiary)'
                                    e.currentTarget.style.transform = 'translateX(0)'
                                }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <p
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-medium)',
                                            flex: 1,
                                        }}
                                    >
                                        {post.title}
                                    </p>
                                    <span
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 'var(--font-medium)',
                                            padding: 'var(--space-1) var(--space-2)',
                                            borderRadius: 'var(--radius-full)',
                                            background: statusColors[post.status].bg,
                                            color: statusColors[post.status].text,
                                        }}
                                    >
                                        {post.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span style={{ fontSize: '14px' }}>{platformIcons[post.platform]}</span>
                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                        {new Date(post.scheduledFor).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trending Now */}
                <div className="card card-elevated">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(168, 85, 247, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <TrendingUp size={20} style={{ color: '#a855f7' }} />
                            </div>
                            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                Trending Now
                            </h2>
                        </div>
                        <Link
                            href="/dashboard/trends"
                            className="btn btn-ghost btn-sm"
                            style={{ gap: 'var(--space-2)' }}
                        >
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {trendingNow.map((trend, index) => (
                            <div
                                key={trend.id}
                                style={{
                                    padding: 'var(--space-4)',
                                    background: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-4)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-bg-hover)'
                                    e.currentTarget.style.transform = 'translateX(4px)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--color-bg-tertiary)'
                                    e.currentTarget.style.transform = 'translateX(0)'
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--gradient-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 'var(--font-bold)',
                                        color: 'white',
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-medium)',
                                            marginBottom: 'var(--space-1)',
                                        }}
                                    >
                                        {trend.title}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span style={{ fontSize: '14px' }}>{platformIcons[trend.platform]}</span>
                                        <span
                                            style={{
                                                fontSize: 'var(--text-xs)',
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            {trend.type.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Content Generator */}
                <div
                    className="card"
                    style={{
                        background: 'var(--gradient-primary)',
                        border: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 200,
                            height: 200,
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '50%',
                            filter: 'blur(40px)',
                        }}
                    />
                    <div style={{ position: 'relative' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Sparkles size={24} color="white" />
                            </div>
                            <div>
                                <h2
                                    style={{
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: 'var(--font-semibold)',
                                        color: 'white',
                                    }}
                                >
                                    AI Content Ideas
                                </h2>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.8)' }}>
                                    Generate fresh content ideas
                                </p>
                            </div>
                        </div>
                        <p
                            style={{
                                fontSize: 'var(--text-sm)',
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginBottom: 'var(--space-6)',
                                lineHeight: 'var(--leading-relaxed)',
                            }}
                        >
                            Let AI analyze trends and generate personalized content ideas tailored to your brand and audience.
                        </p>
                        <Link
                            href="/dashboard/ideas"
                            className="btn"
                            style={{
                                background: 'white',
                                color: 'var(--color-primary)',
                                fontWeight: 'var(--font-semibold)',
                            }}
                        >
                            <Sparkles size={16} />
                            Generate Ideas
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
