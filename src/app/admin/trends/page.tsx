'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Save,
    X,
    RefreshCw,
    Globe,
    Zap,
    Star,
    Filter,
    ChevronDown,
    Check,
    AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomTrend {
    id: string
    title: string
    traffic: string
    industry: string
    contentIdea: string
    reason: string
    isActive: boolean
    isFeatured: boolean
    createdAt: string
    createdBy: string
}

const INDUSTRIES = [
    'TECH', 'HEALTH', 'FITNESS', 'GAMING', 'ENTERTAINMENT',
    'FINANCE', 'FOOD', 'TRAVEL', 'EDUCATION', 'BEAUTY', 'ALL'
]

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function TrendsManagementPage() {
    const [trends, setTrends] = useState<CustomTrend[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterIndustry, setFilterIndustry] = useState('all')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingTrend, setEditingTrend] = useState<CustomTrend | null>(null)
    const [saving, setSaving] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        traffic: 'Hot Topic',
        industry: 'ALL',
        contentIdea: '',
        reason: '',
        isActive: true,
        isFeatured: false
    })

    useEffect(() => {
        fetchTrends()
    }, [])

    const fetchTrends = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/trends')
            const data = await response.json()
            if (data.success) {
                setTrends(data.trends)
            }
        } catch (error) {
            console.error('Failed to fetch trends:', error)
            // Demo data
            setTrends([
                {
                    id: '1',
                    title: 'AI Trends 2025',
                    traffic: '100K+',
                    industry: 'TECH',
                    contentIdea: 'Top 10 AI tools changing work',
                    reason: 'Rising interest in AI',
                    isActive: true,
                    isFeatured: true,
                    createdAt: new Date().toISOString(),
                    createdBy: 'Admin'
                },
                {
                    id: '2',
                    title: 'Workout Trends',
                    traffic: '50K+',
                    industry: 'FITNESS',
                    contentIdea: 'Home workouts that actually work',
                    reason: 'New year fitness goals',
                    isActive: true,
                    isFeatured: false,
                    createdAt: new Date().toISOString(),
                    createdBy: 'Admin'
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    const openAddModal = () => {
        setEditingTrend(null)
        setFormData({
            title: '',
            traffic: 'Hot Topic',
            industry: 'ALL',
            contentIdea: '',
            reason: '',
            isActive: true,
            isFeatured: false
        })
        setModalOpen(true)
    }

    const openEditModal = (trend: CustomTrend) => {
        setEditingTrend(trend)
        setFormData({
            title: trend.title,
            traffic: trend.traffic,
            industry: trend.industry,
            contentIdea: trend.contentIdea,
            reason: trend.reason,
            isActive: trend.isActive,
            isFeatured: trend.isFeatured
        })
        setModalOpen(true)
    }

    const saveTrend = async () => {
        if (!formData.title.trim()) return

        setSaving(true)
        try {
            const method = editingTrend ? 'PATCH' : 'POST'
            const body = editingTrend
                ? { id: editingTrend.id, ...formData }
                : formData

            const response = await fetch('/api/admin/trends', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const data = await response.json()
            if (data.success) {
                setModalOpen(false)
                fetchTrends()
            }
        } catch (error) {
            console.error('Failed to save trend:', error)
            // Update locally for demo
            if (editingTrend) {
                setTrends(trends.map(t => t.id === editingTrend.id ? { ...t, ...formData } : t))
            } else {
                setTrends([{
                    id: Date.now().toString(),
                    ...formData,
                    createdAt: new Date().toISOString(),
                    createdBy: 'Admin'
                }, ...trends])
            }
            setModalOpen(false)
        } finally {
            setSaving(false)
        }
    }

    const deleteTrend = async (id: string) => {
        if (!confirm('Are you sure you want to delete this trend?')) return

        try {
            await fetch('/api/admin/trends', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            setTrends(trends.filter(t => t.id !== id))
        } catch (error) {
            console.error('Failed to delete trend:', error)
            setTrends(trends.filter(t => t.id !== id))
        }
    }

    const toggleActive = async (trend: CustomTrend) => {
        const newStatus = !trend.isActive
        try {
            await fetch('/api/admin/trends', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: trend.id, isActive: newStatus })
            })
            setTrends(trends.map(t => t.id === trend.id ? { ...t, isActive: newStatus } : t))
        } catch (error) {
            setTrends(trends.map(t => t.id === trend.id ? { ...t, isActive: newStatus } : t))
        }
    }

    const toggleFeatured = async (trend: CustomTrend) => {
        const newStatus = !trend.isFeatured
        try {
            await fetch('/api/admin/trends', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: trend.id, isFeatured: newStatus })
            })
            setTrends(trends.map(t => t.id === trend.id ? { ...t, isFeatured: newStatus } : t))
        } catch (error) {
            setTrends(trends.map(t => t.id === trend.id ? { ...t, isFeatured: newStatus } : t))
        }
    }

    const filteredTrends = trends.filter(trend => {
        const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesIndustry = filterIndustry === 'all' || trend.industry === filterIndustry
        return matchesSearch && matchesIndustry
    })

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-[#FFC900]" />
                        Trends Management
                    </h1>
                    <p className="text-[#888] mt-1">Create and manage custom trends</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-[#FFC900] text-black font-bold rounded-lg flex items-center gap-2 hover:bg-[#FFD93D] transition-colors shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                    <Plus className="w-5 h-5" />
                    Add Trend
                </button>
            </div>

            {/* Filters */}
            <motion.div variants={item} className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <input
                        type="text"
                        placeholder="Search trends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111] border-2 border-[#333] rounded-lg pl-10 pr-4 py-2.5 focus:border-[#FFC900] focus:outline-none"
                    />
                </div>
                <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="bg-[#111] border-2 border-[#333] rounded-lg px-4 py-2.5 focus:border-[#FFC900] focus:outline-none min-w-[150px]"
                >
                    <option value="all">All Industries</option>
                    {INDUSTRIES.filter(i => i !== 'ALL').map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                    ))}
                </select>
                <button
                    onClick={fetchTrends}
                    className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#333] rounded-lg hover:border-[#FFC900] transition-colors"
                >
                    <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                </button>
            </motion.div>

            {/* Trends Grid */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-[#111] border-2 border-[#222] rounded-xl p-5 animate-pulse">
                            <div className="h-6 bg-[#333] rounded w-3/4 mb-3" />
                            <div className="h-4 bg-[#333] rounded w-1/2 mb-2" />
                            <div className="h-4 bg-[#333] rounded w-full" />
                        </div>
                    ))
                ) : filteredTrends.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-[#111] border-2 border-[#222] rounded-xl">
                        <TrendingUp className="w-12 h-12 text-[#666] mx-auto mb-3" />
                        <p className="text-[#888]">No trends found</p>
                        <button
                            onClick={openAddModal}
                            className="mt-4 px-4 py-2 bg-[#FFC900] text-black font-bold rounded-lg"
                        >
                            Add Your First Trend
                        </button>
                    </div>
                ) : (
                    filteredTrends.map((trend) => (
                        <div
                            key={trend.id}
                            className={cn(
                                "bg-[#111] border-2 rounded-xl p-5 transition-all",
                                trend.isFeatured ? "border-[#FFC900]" : "border-[#222] hover:border-[#444]",
                                !trend.isActive && "opacity-50"
                            )}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-[#333] rounded text-xs font-bold">
                                        {trend.industry}
                                    </span>
                                    {trend.isFeatured && (
                                        <span className="px-2 py-1 bg-[#FFC900]/20 text-[#FFC900] rounded text-xs font-bold flex items-center gap-1">
                                            <Star className="w-3 h-3" /> Featured
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm text-[#888]">{trend.traffic}</span>
                            </div>

                            <h3 className="font-bold text-lg mb-2">{trend.title}</h3>
                            <p className="text-sm text-[#888] mb-1">
                                <strong>Why:</strong> {trend.reason}
                            </p>
                            <p className="text-sm text-[#FFC900]">
                                <strong>Content Idea:</strong> {trend.contentIdea}
                            </p>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#333]">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleActive(trend)}
                                        className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            trend.isActive
                                                ? "text-green-400 hover:bg-green-500/20"
                                                : "text-red-400 hover:bg-red-500/20"
                                        )}
                                        title={trend.isActive ? 'Active' : 'Inactive'}
                                    >
                                        {trend.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => toggleFeatured(trend)}
                                        className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            trend.isFeatured
                                                ? "text-[#FFC900] hover:bg-[#FFC900]/20"
                                                : "text-[#666] hover:bg-[#333]"
                                        )}
                                        title={trend.isFeatured ? 'Featured' : 'Not Featured'}
                                    >
                                        <Star className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openEditModal(trend)}
                                        className="p-2 hover:bg-[#333] rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteTrend(trend.id)}
                                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </motion.div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#111] border-2 border-[#333] rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black">
                                    {editingTrend ? 'Edit Trend' : 'Add New Trend'}
                                </h3>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="p-2 hover:bg-[#333] rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Trend Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., AI in Healthcare 2025"
                                        className="w-full bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Traffic</label>
                                        <input
                                            type="text"
                                            value={formData.traffic}
                                            onChange={(e) => setFormData({ ...formData, traffic: e.target.value })}
                                            placeholder="e.g., 100K+"
                                            className="w-full bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Industry</label>
                                        <select
                                            value={formData.industry}
                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                            className="w-full bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none"
                                        >
                                            {INDUSTRIES.map(industry => (
                                                <option key={industry} value={industry}>{industry}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Why is this trending?</label>
                                    <input
                                        type="text"
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        placeholder="e.g., Rising interest in AI healthcare solutions"
                                        className="w-full bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Content Idea</label>
                                    <textarea
                                        value={formData.contentIdea}
                                        onChange={(e) => setFormData({ ...formData, contentIdea: e.target.value })}
                                        placeholder="e.g., Create a video about top 5 AI tools for healthcare professionals"
                                        rows={3}
                                        className="w-full bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-5 h-5 rounded border-2 border-[#333] bg-[#1A1A1A] checked:bg-[#FFC900] checked:border-[#FFC900]"
                                        />
                                        <span className="text-sm font-semibold">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFeatured}
                                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                            className="w-5 h-5 rounded border-2 border-[#333] bg-[#1A1A1A] checked:bg-[#FFC900] checked:border-[#FFC900]"
                                        />
                                        <span className="text-sm font-semibold">Featured</span>
                                    </label>
                                </div>

                                <button
                                    onClick={saveTrend}
                                    disabled={!formData.title.trim() || saving}
                                    className={cn(
                                        "w-full py-3 rounded-lg font-black uppercase flex items-center justify-center gap-2 transition-all",
                                        !formData.title.trim() || saving
                                            ? "bg-[#333] text-[#888] cursor-not-allowed"
                                            : "bg-[#FFC900] text-black hover:bg-[#FFD93D] shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                                    )}
                                >
                                    {saving ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            {editingTrend ? 'Update Trend' : 'Create Trend'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
