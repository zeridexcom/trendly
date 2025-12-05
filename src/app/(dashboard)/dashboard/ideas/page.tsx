'use client'

import { useState } from 'react'
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
    Plus,
    MoreVertical,
    ThumbsUp,
    Calendar,
    Sparkles,
    X,
    Loader2,
    CheckCircle,
    Zap,
} from 'lucide-react'

// Types
interface Idea {
    id: string
    title: string
    description?: string
    status: string
    platforms: string[]
    priority: string
    upvoteCount: number
    hasUpvoted: boolean
    createdBy: { name: string }
    createdAt: string
    linkedTrend?: { title: string }
    hook?: string
    aiGenerated?: boolean
}

interface GeneratedIdea {
    title: string
    description: string
    suggestedPlatform: string
    suggestedFormat: string
    hook?: string
    estimatedEngagement?: string
    contentPillars?: string[]
}

// Mock data
const initialIdeas: Idea[] = [
    {
        id: '1',
        title: 'Behind the scenes content series',
        description: 'Show the team working on new features and daily operations',
        status: 'NEW',
        platforms: ['INSTAGRAM', 'TIKTOK'],
        priority: 'HIGH',
        upvoteCount: 5,
        hasUpvoted: false,
        createdBy: { name: 'Sarah Chen' },
        createdAt: '2024-01-12T10:00:00Z',
    },
    {
        id: '2',
        title: 'User testimonial carousel',
        description: 'Compile best customer reviews into carousel format',
        status: 'SHORTLISTED',
        platforms: ['INSTAGRAM'],
        priority: 'NORMAL',
        upvoteCount: 3,
        hasUpvoted: true,
        createdBy: { name: 'Mike Johnson' },
        createdAt: '2024-01-11T14:30:00Z',
    },
    {
        id: '3',
        title: 'Industry trend analysis thread',
        description: 'Deep dive into Q1 industry trends',
        status: 'IN_BRIEFING',
        platforms: ['TWITTER', 'LINKEDIN'],
        priority: 'HIGH',
        upvoteCount: 8,
        hasUpvoted: false,
        createdBy: { name: 'Emily Davis' },
        createdAt: '2024-01-10T09:15:00Z',
        linkedTrend: { title: 'Tech industry discussion' },
    },
    {
        id: '4',
        title: 'Product feature showcase reel',
        description: 'Quick demo of new dashboard features',
        status: 'IN_PRODUCTION',
        platforms: ['INSTAGRAM', 'YOUTUBE'],
        priority: 'NORMAL',
        upvoteCount: 2,
        hasUpvoted: false,
        createdBy: { name: 'Alex Kim' },
        createdAt: '2024-01-09T16:45:00Z',
    },
]

const columns = [
    { id: 'NEW', title: 'New', color: '#6b7280' },
    { id: 'SHORTLISTED', title: 'Shortlisted', color: '#3b82f6' },
    { id: 'IN_BRIEFING', title: 'In Briefing', color: '#f59e0b' },
    { id: 'IN_PRODUCTION', title: 'In Production', color: '#8b5cf6' },
    { id: 'ARCHIVED', title: 'Archived', color: '#374151' },
]

const platformIcons: Record<string, string> = {
    INSTAGRAM: '📸',
    TIKTOK: '🎵',
    YOUTUBE: '▶️',
    TWITTER: '𝕏',
    LINKEDIN: '💼',
}

const priorityConfig: Record<string, { color: string; label: string; icon: string }> = {
    LOW: { color: '#6b7280', label: 'Low', icon: '↓' },
    NORMAL: { color: '#3b82f6', label: 'Normal', icon: '→' },
    HIGH: { color: '#ef4444', label: 'High', icon: '↑' },
}

// Sortable Idea Card Component
function IdeaCard({
    idea,
    onUpvote,
    onCreatePost,
}: {
    idea: Idea
    onUpvote: (id: string) => void
    onCreatePost: (idea: Idea) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: idea.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="kanban-card"
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <h4 className="kanban-card-title">{idea.title}</h4>
                    {idea.aiGenerated && (
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
                <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical size={14} />
                </button>
            </div>

            {idea.description && (
                <p
                    className="line-clamp-2"
                    style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--space-3)',
                    }}
                >
                    {idea.description}
                </p>
            )}

            {idea.hook && (
                <div
                    style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-warning)',
                        background: 'rgba(234, 179, 8, 0.1)',
                        padding: 'var(--space-2)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: 'var(--space-3)',
                        fontStyle: 'italic',
                    }}
                >
                    💡 "{idea.hook}"
                </div>
            )}

            {idea.linkedTrend && (
                <div
                    style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-primary)',
                        background: 'var(--color-primary-subtle)',
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: 'var(--space-3)',
                        display: 'inline-block',
                    }}
                >
                    🔗 {idea.linkedTrend.title}
                </div>
            )}

            <div className="flex items-center gap-2 mb-3">
                {idea.platforms.map((p) => (
                    <span key={p} style={{ fontSize: '12px' }}>
                        {platformIcons[p]}
                    </span>
                ))}
                <span
                    style={{
                        fontSize: 'var(--text-xs)',
                        color: priorityConfig[idea.priority].color,
                        fontWeight: 'var(--font-medium)',
                    }}
                >
                    {priorityConfig[idea.priority].icon} {priorityConfig[idea.priority].label}
                </span>
            </div>

            <div
                className="flex items-center justify-between"
                style={{
                    paddingTop: 'var(--space-2)',
                    borderTop: '1px solid var(--color-border)',
                }}
            >
                <div className="flex items-center gap-2">
                    <button
                        className="btn btn-ghost btn-sm"
                        style={{
                            padding: 'var(--space-1) var(--space-2)',
                            color: idea.hasUpvoted ? 'var(--color-primary)' : undefined,
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            onUpvote(idea.id)
                        }}
                    >
                        <ThumbsUp size={14} fill={idea.hasUpvoted ? 'currentColor' : 'none'} />
                        <span>{idea.upvoteCount}</span>
                    </button>
                </div>

                <button
                    className="btn btn-ghost btn-sm"
                    style={{ padding: 'var(--space-1) var(--space-2)' }}
                    onClick={(e) => {
                        e.stopPropagation()
                        onCreatePost(idea)
                    }}
                >
                    <Calendar size={14} />
                    <span style={{ fontSize: 'var(--text-xs)' }}>Schedule</span>
                </button>
            </div>
        </div>
    )
}

// Static Card for Drag Overlay
function StaticIdeaCard({ idea }: { idea: Idea }) {
    return (
        <div className="kanban-card" style={{ boxShadow: 'var(--shadow-xl)', cursor: 'grabbing' }}>
            <h4 className="kanban-card-title">{idea.title}</h4>
            {idea.description && (
                <p
                    className="line-clamp-2"
                    style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--space-3)',
                    }}
                >
                    {idea.description}
                </p>
            )}
            <div className="flex items-center gap-2">
                {idea.platforms.map((p) => (
                    <span key={p} style={{ fontSize: '12px' }}>
                        {platformIcons[p]}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default function IdeasPage() {
    const [ideas, setIdeas] = useState(initialIdeas)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showAIModal, setShowAIModal] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([])
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        platforms: ['INSTAGRAM'],
        priority: 'NORMAL',
    })

    // AI Modal form state
    const [aiFormData, setAiFormData] = useState({
        contentType: '',
        audience: '',
        goal: 'AWARENESS',
        platforms: ['INSTAGRAM', 'TIKTOK'],
        numberOfIdeas: 5,
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const getColumnIdeas = (status: string) => {
        return ideas.filter((idea) => idea.status === status)
    }

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const activeIdea = ideas.find((i) => i.id === active.id)
        if (!activeIdea) return

        const targetColumn = columns.find((c) => c.id === over.id)
        if (targetColumn) {
            setIdeas(
                ideas.map((idea) =>
                    idea.id === active.id ? { ...idea, status: targetColumn.id } : idea
                )
            )
            return
        }

        const overIdea = ideas.find((i) => i.id === over.id)
        if (overIdea && activeIdea.status !== overIdea.status) {
            setIdeas(
                ideas.map((idea) =>
                    idea.id === active.id ? { ...idea, status: overIdea.status } : idea
                )
            )
        }
    }

    const handleUpvote = (id: string) => {
        setIdeas(
            ideas.map((idea) =>
                idea.id === id
                    ? {
                        ...idea,
                        hasUpvoted: !idea.hasUpvoted,
                        upvoteCount: idea.hasUpvoted ? idea.upvoteCount - 1 : idea.upvoteCount + 1,
                    }
                    : idea
            )
        )
    }

    const handleCreatePost = (idea: Idea) => {
        console.log('Create post from idea:', idea)
    }

    const handleCreateIdea = () => {
        const newIdea: Idea = {
            id: Date.now().toString(),
            ...formData,
            status: 'NEW',
            upvoteCount: 0,
            hasUpvoted: false,
            createdBy: { name: 'Demo User' },
            createdAt: new Date().toISOString(),
        }
        setIdeas([newIdea, ...ideas])
        setShowCreateModal(false)
        setFormData({ title: '', description: '', platforms: ['INSTAGRAM'], priority: 'NORMAL' })
    }

    // 🔥 AI GENERATION FUNCTION - Connected to API!
    const handleGenerateIdeas = async () => {
        if (!aiFormData.contentType) {
            alert('Please describe what type of content you need')
            return
        }

        setIsGenerating(true)
        setGeneratedIdeas([])

        try {
            const response = await fetch('/api/ai/ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    brandName: 'Your Brand',
                    brandNiche: aiFormData.contentType,
                    audienceDescription: aiFormData.audience || 'General audience',
                    platforms: aiFormData.platforms,
                    goal: aiFormData.goal,
                    numberOfIdeas: aiFormData.numberOfIdeas,
                }),
            })

            const data = await response.json()

            if (data.ideas && data.ideas.length > 0) {
                setGeneratedIdeas(data.ideas)
            } else {
                // Fallback if no ideas returned
                setGeneratedIdeas([
                    {
                        title: `${aiFormData.contentType} - Idea 1`,
                        description: 'AI-generated content idea based on your input',
                        suggestedPlatform: aiFormData.platforms[0] || 'INSTAGRAM',
                        suggestedFormat: 'Reel',
                        hook: 'Stop scrolling! This will change everything...',
                    },
                ])
            }
        } catch (error) {
            console.error('AI generation error:', error)
            // Show error to user
            alert('Failed to generate ideas. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    // Add AI-generated idea to board
    const handleAddGeneratedIdea = (generatedIdea: GeneratedIdea) => {
        const newIdea: Idea = {
            id: Date.now().toString(),
            title: generatedIdea.title,
            description: generatedIdea.description,
            status: 'NEW',
            platforms: [generatedIdea.suggestedPlatform || 'INSTAGRAM'],
            priority: generatedIdea.estimatedEngagement === 'High' ? 'HIGH' : 'NORMAL',
            upvoteCount: 0,
            hasUpvoted: false,
            createdBy: { name: 'Trendly AI' },
            createdAt: new Date().toISOString(),
            hook: generatedIdea.hook,
            aiGenerated: true,
        }
        setIdeas([newIdea, ...ideas])

        // Remove from generated list
        setGeneratedIdeas(generatedIdeas.filter(i => i.title !== generatedIdea.title))
    }

    // Add all generated ideas
    const handleAddAllGeneratedIdeas = () => {
        const newIdeas = generatedIdeas.map((genIdea, index) => ({
            id: (Date.now() + index).toString(),
            title: genIdea.title,
            description: genIdea.description,
            status: 'NEW',
            platforms: [genIdea.suggestedPlatform || 'INSTAGRAM'],
            priority: 'NORMAL' as const,
            upvoteCount: 0,
            hasUpvoted: false,
            createdBy: { name: 'Trendly AI' },
            createdAt: new Date().toISOString(),
            hook: genIdea.hook,
            aiGenerated: true,
        }))

        setIdeas([...newIdeas, ...ideas])
        setGeneratedIdeas([])
        setShowAIModal(false)
        setAiFormData({ contentType: '', audience: '', goal: 'AWARENESS', platforms: ['INSTAGRAM', 'TIKTOK'], numberOfIdeas: 5 })
    }

    const activeIdea = activeId ? ideas.find((i) => i.id === activeId) : null

    return (
        <div className="animate-fadeIn">
            {/* Header Actions */}
            <div
                className="flex items-center justify-between flex-wrap gap-4"
                style={{ marginBottom: 'var(--space-6)' }}
            >
                <div className="flex items-center gap-2">
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                        {ideas.length} ideas total
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary" onClick={() => setShowAIModal(true)}>
                        <Sparkles size={16} />
                        Generate with AI
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={16} />
                        New Idea
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="kanban-board">
                    {columns.map((column) => {
                        const columnIdeas = getColumnIdeas(column.id)
                        return (
                            <div key={column.id} className="kanban-column">
                                <div className="kanban-column-header">
                                    <div className="kanban-column-title">
                                        <span
                                            style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                background: column.color,
                                            }}
                                        />
                                        {column.title}
                                    </div>
                                    <span className="kanban-column-count">{columnIdeas.length}</span>
                                </div>

                                <SortableContext
                                    items={columnIdeas.map((i) => i.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="kanban-cards" data-column-id={column.id}>
                                        {columnIdeas.map((idea) => (
                                            <IdeaCard
                                                key={idea.id}
                                                idea={idea}
                                                onUpvote={handleUpvote}
                                                onCreatePost={handleCreatePost}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>

                                <button
                                    className="kanban-add-card"
                                    onClick={() => {
                                        setFormData({ ...formData, title: '' })
                                        setShowCreateModal(true)
                                    }}
                                >
                                    <Plus size={14} />
                                    Add idea
                                </button>
                            </div>
                        )
                    })}
                </div>

                <DragOverlay>
                    {activeIdea ? <StaticIdeaCard idea={activeIdea} /> : null}
                </DragOverlay>
            </DndContext>

            {/* Create Idea Modal */}
            {showCreateModal && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowCreateModal(false)} />
                    <div className="modal">
                        <div className="modal-header">
                            <h2 className="modal-title">New Idea</h2>
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
                                    placeholder="What's your content idea?"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="input-group mb-4">
                                <label className="input-label">Description</label>
                                <textarea
                                    className="input"
                                    placeholder="Describe your idea in more detail..."
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
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
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Priority</label>
                                <div className="flex gap-2">
                                    {Object.entries(priorityConfig).map(([key, config]) => (
                                        <button
                                            key={key}
                                            className="btn btn-sm"
                                            style={{
                                                flex: 1,
                                                background:
                                                    formData.priority === key
                                                        ? `${config.color}20`
                                                        : 'var(--color-bg-tertiary)',
                                                border:
                                                    formData.priority === key
                                                        ? `1px solid ${config.color}`
                                                        : '1px solid var(--color-border)',
                                                color: formData.priority === key ? config.color : undefined,
                                            }}
                                            onClick={() => setFormData({ ...formData, priority: key })}
                                        >
                                            {config.icon} {config.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                disabled={!formData.title}
                                onClick={handleCreateIdea}
                            >
                                Create Idea
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* AI Generate Modal - FULLY FUNCTIONAL */}
            {showAIModal && (
                <>
                    <div className="modal-backdrop" onClick={() => !isGenerating && setShowAIModal(false)} />
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
                                <h2 className="modal-title">Generate Ideas with AI</h2>
                            </div>
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={() => !isGenerating && setShowAIModal(false)}
                                disabled={isGenerating}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Show generated ideas if any */}
                            {generatedIdeas.length > 0 ? (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-semibold)' }}>
                                            ✨ Generated {generatedIdeas.length} Ideas
                                        </h3>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={handleAddAllGeneratedIdeas}
                                        >
                                            <CheckCircle size={14} />
                                            Add All to Board
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: 400, overflowY: 'auto' }}>
                                        {generatedIdeas.map((idea, index) => (
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
                                                    <h4 style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>
                                                        {idea.title}
                                                    </h4>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleAddGeneratedIdea(idea)}
                                                    >
                                                        <Plus size={14} />
                                                        Add
                                                    </button>
                                                </div>
                                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                                                    {idea.description}
                                                </p>
                                                {idea.hook && (
                                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning)', fontStyle: 'italic' }}>
                                                        💡 Hook: "{idea.hook}"
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span style={{ fontSize: '14px' }}>{platformIcons[idea.suggestedPlatform] || '📱'}</span>
                                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                                        {idea.suggestedFormat}
                                                    </span>
                                                    {idea.estimatedEngagement && (
                                                        <span style={{
                                                            fontSize: 'var(--text-xs)',
                                                            color: idea.estimatedEngagement === 'High' ? 'var(--color-success)' : 'var(--color-text-muted)'
                                                        }}>
                                                            • {idea.estimatedEngagement} engagement
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className="btn btn-secondary mt-4"
                                        style={{ width: '100%' }}
                                        onClick={() => {
                                            setGeneratedIdeas([])
                                        }}
                                    >
                                        <Sparkles size={16} />
                                        Generate More Ideas
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="input-group mb-4">
                                        <label className="input-label">What type of content do you need? *</label>
                                        <textarea
                                            className="input"
                                            placeholder="e.g., Engaging Instagram Reels about productivity tips, spoken English classes, cooking tutorials..."
                                            rows={3}
                                            value={aiFormData.contentType}
                                            onChange={(e) => setAiFormData({ ...aiFormData, contentType: e.target.value })}
                                            disabled={isGenerating}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="input-group">
                                            <label className="input-label">Target Audience</label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="e.g., students and parents"
                                                value={aiFormData.audience}
                                                onChange={(e) => setAiFormData({ ...aiFormData, audience: e.target.value })}
                                                disabled={isGenerating}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Goal</label>
                                            <select
                                                className="input select"
                                                value={aiFormData.goal}
                                                onChange={(e) => setAiFormData({ ...aiFormData, goal: e.target.value })}
                                                disabled={isGenerating}
                                            >
                                                <option value="AWARENESS">Awareness</option>
                                                <option value="ENGAGEMENT">Engagement</option>
                                                <option value="LEADS">Leads</option>
                                                <option value="SALES">Sales</option>
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
                                                    disabled={isGenerating}
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
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Number of Ideas</label>
                                        <select
                                            className="input select"
                                            style={{ maxWidth: 200 }}
                                            value={aiFormData.numberOfIdeas}
                                            onChange={(e) => setAiFormData({ ...aiFormData, numberOfIdeas: parseInt(e.target.value) })}
                                            disabled={isGenerating}
                                        >
                                            <option value="3">3 ideas</option>
                                            <option value="5">5 ideas</option>
                                            <option value="10">10 ideas</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        {generatedIdeas.length === 0 && (
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowAIModal(false)}
                                    disabled={isGenerating}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleGenerateIdeas}
                                    disabled={isGenerating || !aiFormData.contentType}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            Generate Ideas
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
