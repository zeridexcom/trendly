'use client'

import { useState, useEffect } from 'react'
import {
    LayoutGrid,
    Plus,
    Trash2,
    Edit3,
    Check,
    X,
    TrendingUp,
    TrendingDown,
    Minus,
    Sparkles,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Loader2,
    ChevronRight,
    Target,
    BarChart3,
    Layers,
    Palette
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Types
interface ContentPillar {
    id: string
    name: string
    description: string
    color: string
    icon: string
    targetPercentage: number
    currentCount: number
    minPerWeek: number
    maxPerWeek: number
    actualPercentage?: number
    status?: 'balanced' | 'under' | 'over'
    diff?: number
    performance: {
        avgEngagement: number
        trend: 'up' | 'down' | 'stable'
    }
}

interface PillarTemplate {
    id: string
    name: string
    description: string
    industry: string
    pillars: any[]
}

const colorOptions = [
    '#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B',
    '#EF4444', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
]

const iconOptions = [
    '📚', '🎬', '💭', '📢', '👥', '💡', '🎯', '⭐', '🏢', '📰',
    '✨', '💫', '📖', '🤝', '🔥', '🎓', '📊', '🏆', '👤', '💰'
]

export default function PillarsPage() {
    const [pillars, setPillars] = useState<ContentPillar[]>([])
    const [templates, setTemplates] = useState<PillarTemplate[]>([])
    const [healthScore, setHealthScore] = useState(0)
    const [recommendation, setRecommendation] = useState('')
    const [totalContent, setTotalContent] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [showTemplates, setShowTemplates] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingPillar, setEditingPillar] = useState<ContentPillar | null>(null)

    // New pillar form
    const [newPillar, setNewPillar] = useState({
        name: '',
        description: '',
        color: '#3B82F6',
        icon: '📌',
        targetPercentage: 20,
        minPerWeek: 1,
        maxPerWeek: 5
    })

    useEffect(() => {
        fetchPillars()
        fetchTemplates()
    }, [])

    const fetchPillars = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/pillars')
            const data = await response.json()
            setPillars(data.pillars || [])
            setHealthScore(data.healthScore || 0)
            setRecommendation(data.recommendation || '')
            setTotalContent(data.totalContent || 0)
        } catch (error) {
            console.error('Failed to fetch pillars:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchTemplates = async () => {
        try {
            const response = await fetch('/api/pillars?action=templates')
            const data = await response.json()
            setTemplates(data.templates || [])
        } catch (error) {
            console.error('Failed to fetch templates:', error)
        }
    }

    const applyTemplate = async (templateId: string) => {
        try {
            const response = await fetch('/api/pillars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ templateId })
            })
            const data = await response.json()
            if (data.success) {
                setShowTemplates(false)
                fetchPillars()
            }
        } catch (error) {
            console.error('Failed to apply template:', error)
        }
    }

    const createPillar = async () => {
        if (!newPillar.name.trim()) return

        try {
            const response = await fetch('/api/pillars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPillar)
            })
            const data = await response.json()
            if (data.success) {
                setShowAddModal(false)
                setNewPillar({
                    name: '',
                    description: '',
                    color: '#3B82F6',
                    icon: '📌',
                    targetPercentage: 20,
                    minPerWeek: 1,
                    maxPerWeek: 5
                })
                fetchPillars()
            }
        } catch (error) {
            console.error('Failed to create pillar:', error)
        }
    }

    const deletePillar = async (id: string) => {
        try {
            await fetch(`/api/pillars?id=${id}`, { method: 'DELETE' })
            fetchPillars()
        } catch (error) {
            console.error('Failed to delete pillar:', error)
        }
    }

    const updatePillar = async (pillar: ContentPillar) => {
        try {
            await fetch('/api/pillars', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pillar)
            })
            setEditingPillar(null)
            fetchPillars()
        } catch (error) {
            console.error('Failed to update pillar:', error)
        }
    }

    const getHealthColor = (score: number) => {
        if (score >= 80) return 'text-green-500'
        if (score >= 50) return 'text-yellow-500'
        return 'text-red-500'
    }

    const getHealthBg = (score: number) => {
        if (score >= 80) return 'from-green-500'
        if (score >= 50) return 'from-yellow-500'
        return 'from-red-500'
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Layers className="h-8 w-8 text-indigo-500" />
                        Content Pillars
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Organize your content strategy and maintain a balanced mix
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowTemplates(true)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4"
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Use Template
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Pillar
                    </button>
                </div>
            </div>

            {/* Health Score Card */}
            {pillars.length > 0 && (
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Score Circle */}
                        <div className="flex-shrink-0">
                            <div className="relative w-32 h-32">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="none"
                                        className="text-muted/20"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="none"
                                        strokeDasharray={`${(healthScore / 100) * 352} 352`}
                                        strokeLinecap="round"
                                        className={getHealthColor(healthScore)}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={cn("text-3xl font-bold", getHealthColor(healthScore))}>{healthScore}</span>
                                    <span className="text-xs text-muted-foreground">Health</span>
                                </div>
                            </div>
                        </div>

                        {/* Balance Bars */}
                        <div className="flex-1 space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Content Balance
                            </h3>
                            <div className="space-y-2">
                                {pillars.map((pillar) => (
                                    <div key={pillar.id} className="flex items-center gap-3">
                                        <span className="text-lg w-6">{pillar.icon}</span>
                                        <span className="text-sm w-24 truncate">{pillar.name}</span>
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${Math.min(100, (pillar.actualPercentage || 0))}%`,
                                                    backgroundColor: pillar.color
                                                }}
                                            />
                                        </div>
                                        <span className={cn(
                                            "text-xs font-medium w-12 text-right",
                                            pillar.status === 'balanced' ? 'text-green-500' :
                                                pillar.status === 'under' ? 'text-yellow-500' : 'text-red-500'
                                        )}>
                                            {pillar.actualPercentage || 0}%
                                        </span>
                                        <span className="text-xs text-muted-foreground w-8">
                                            / {pillar.targetPercentage}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="md:w-64">
                            <div className={cn(
                                "rounded-lg p-4",
                                healthScore >= 80 ? "bg-green-50 dark:bg-green-900/20" :
                                    healthScore >= 50 ? "bg-yellow-50 dark:bg-yellow-900/20" :
                                        "bg-red-50 dark:bg-red-900/20"
                            )}>
                                {healthScore >= 80 ? (
                                    <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
                                ) : (
                                    <AlertCircle className={cn("h-5 w-5 mb-2", healthScore >= 50 ? "text-yellow-500" : "text-red-500")} />
                                )}
                                <p className="text-sm">{recommendation}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pillars Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : pillars.length === 0 ? (
                <div className="rounded-xl border bg-card p-12 shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Layers className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Set Up Your Content Pillars</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Content pillars help you maintain a balanced content strategy. Choose a template to get started quickly!
                    </p>
                    <button
                        onClick={() => setShowTemplates(true)}
                        className="inline-flex items-center justify-center rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6"
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Choose a Template
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pillars.map((pillar, i) => (
                        <motion.div
                            key={pillar.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                                        style={{ backgroundColor: `${pillar.color}20` }}
                                    >
                                        {pillar.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{pillar.name}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{pillar.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setEditingPillar(pillar)}
                                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={() => deletePillar(pillar.id)}
                                        className="p-1.5 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Progress */}
                                <div>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-muted-foreground">Current vs Target</span>
                                        <span className={cn(
                                            "font-medium",
                                            pillar.status === 'balanced' ? 'text-green-500' :
                                                pillar.status === 'under' ? 'text-yellow-500' : 'text-red-500'
                                        )}>
                                            {pillar.actualPercentage || 0}% / {pillar.targetPercentage}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${Math.min(100, ((pillar.actualPercentage || 0) / pillar.targetPercentage) * 100)}%`,
                                                backgroundColor: pillar.color
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Target className="h-3 w-3" />
                                        <span>{pillar.minPerWeek}-{pillar.maxPerWeek}/week</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                        {pillar.performance.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                                        {pillar.performance.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                                        {pillar.performance.trend === 'stable' && <Minus className="h-3 w-3 text-gray-500" />}
                                        <span className="text-muted-foreground">{pillar.performance.avgEngagement.toLocaleString()} avg</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Templates Modal */}
            <AnimatePresence>
                {showTemplates && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setShowTemplates(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative z-50 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl border bg-card p-6 shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold">Choose a Template</h2>
                                    <p className="text-sm text-muted-foreground">Pre-built pillar sets for different industries</p>
                                </div>
                                <button onClick={() => setShowTemplates(false)} className="p-2 rounded-md hover:bg-muted">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => applyTemplate(template.id)}
                                        className="w-full text-left p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">{template.name}</h3>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {template.pillars.map((p, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                                                    style={{ backgroundColor: `${p.color}20`, color: p.color }}
                                                >
                                                    {p.icon} {p.name}
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Pillar Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative z-50 w-full max-w-md rounded-xl border bg-card p-6 shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Add Custom Pillar</h2>
                                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-md hover:bg-muted">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Name</label>
                                    <input
                                        type="text"
                                        value={newPillar.name}
                                        onChange={(e) => setNewPillar({ ...newPillar, name: e.target.value })}
                                        placeholder="e.g., Educational Content"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Description</label>
                                    <input
                                        type="text"
                                        value={newPillar.description}
                                        onChange={(e) => setNewPillar({ ...newPillar, description: e.target.value })}
                                        placeholder="What type of content goes here?"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Icon</label>
                                        <div className="flex flex-wrap gap-1">
                                            {iconOptions.slice(0, 10).map((icon) => (
                                                <button
                                                    key={icon}
                                                    onClick={() => setNewPillar({ ...newPillar, icon })}
                                                    className={cn(
                                                        "w-8 h-8 rounded-md flex items-center justify-center text-lg transition-all",
                                                        newPillar.icon === icon ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"
                                                    )}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Color</label>
                                        <div className="flex flex-wrap gap-1">
                                            {colorOptions.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setNewPillar({ ...newPillar, color })}
                                                    className={cn(
                                                        "w-6 h-6 rounded-full transition-all",
                                                        newPillar.color === color ? "ring-2 ring-offset-2 ring-primary" : ""
                                                    )}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Target: {newPillar.targetPercentage}%</label>
                                    <input
                                        type="range"
                                        min="5"
                                        max="50"
                                        value={newPillar.targetPercentage}
                                        onChange={(e) => setNewPillar({ ...newPillar, targetPercentage: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Min/Week</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            value={newPillar.minPerWeek}
                                            onChange={(e) => setNewPillar({ ...newPillar, minPerWeek: parseInt(e.target.value) })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Max/Week</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={newPillar.maxPerWeek}
                                            onChange={(e) => setNewPillar({ ...newPillar, maxPerWeek: parseInt(e.target.value) })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 rounded-md border hover:bg-accent transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={createPillar}
                                        disabled={!newPillar.name.trim()}
                                        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                    >
                                        Add Pillar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
