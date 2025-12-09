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
    Star,
    Globe,
    Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CachedTrend {
    id: number
    title: string
    traffic: string
    formatted_traffic: string
    industry: string
    relevance_score: number
    reason: string
    content_idea: string
    source: string
    fetched_at: string
}

interface CustomTrend {
    id: string
    title: string
    traffic: string
    industry: string
    content_idea: string
    reason: string
    is_active: boolean
    is_featured: boolean
    created_at: string
}

const INDUSTRIES = [
    'ALL', 'TECH', 'HEALTH', 'FITNESS', 'GAMING', 'ENTERTAINMENT',
    'FINANCE', 'FOOD', 'TRAVEL', 'EDUCATION', 'BEAUTY'
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
    const [cachedTrends, setCachedTrends] = useState<CachedTrend[]>([])
    const [customTrends, setCustomTrends] = useState<CustomTrend[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterIndustry, setFilterIndustry] = useState('ALL')
    const [activeTab, setActiveTab] = useState<'cached' | 'custom'>('cached')
    const [modalOpen, setModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editingTrend, setEditingTrend] = useState<CustomTrend | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        traffic: 'Hot Topic',
        industry: 'ALL',
        content_idea: '',
        reason: '',
        is_active: true,
        is_featured: false
    })

    useEffect(() => {
        fetchTrends()
    }, [])

    const fetchTrends = async () => {
        setLoading(true)
        try {
            // Fetch cached Google Trends
            const cachedResponse = await fetch('/api/trends/google')
            const cachedData = await cachedResponse.json()
            if (cachedData.success) {
                setCachedTrends(cachedData.trends || [])
            }

            // Fetch custom admin trends
            const customResponse = await fetch('/api/admin/trends')
            const customData = await customResponse.json()
            if (customData.success) {
                setCustomTrends(customData.trends || [])
            }
        } catch (error) {
            console.error('Failed to fetch trends:', error)
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
            content_idea: '',
            reason: '',
            is_active: true,
            is_featured: false
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

            if (response.ok) {
                setModalOpen(false)
                fetchTrends()
            }
        } catch (error) {
            console.error('Failed to save trend:', error)
        } finally {
            setSaving(false)
        }
    }

    const deleteTrend = async (id: string) => {
        if (!confirm('Delete this trend?')) return

        try {
            await fetch('/api/admin/trends', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            setCustomTrends(customTrends.filter(t => t.id !== id))
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    const filteredCachedTrends = cachedTrends.filter(trend => {
        const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesIndustry = filterIndustry === 'ALL' || trend.industry === filterIndustry
        return matchesSearch && matchesIndustry
    })

    const filteredCustomTrends = customTrends.filter(trend => {
        const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesIndustry = filterIndustry === 'ALL' || trend.industry === filterIndustry
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
                        <TrendingUp className="w-8 h-8" />
                        Trends Management
                    </h1>
                    <p className="text-black/60 mt-1 font-medium">View cached trends and create custom ones</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-[#FF90E8] border-2 border-black font-black uppercase text-sm flex items-center gap-2 shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Custom Trend
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('cached')}
                    className={cn(
                        "px-4 py-2 font-black uppercase text-sm border-2 border-black transition-all",
                        activeTab === 'cached'
                            ? "bg-[#FFC900] shadow-brutal"
                            : "bg-white hover:bg-[#F5F5F0]"
                    )}
                >
                    <Globe className="w-4 h-4 inline mr-2" />
                    Cached Google Trends ({cachedTrends.length})
                </button>
                <button
                    onClick={() => setActiveTab('custom')}
                    className={cn(
                        "px-4 py-2 font-black uppercase text-sm border-2 border-black transition-all",
                        activeTab === 'custom'
                            ? "bg-[#FF90E8] shadow-brutal"
                            : "bg-white hover:bg-[#F5F5F0]"
                    )}
                >
                    <Star className="w-4 h-4 inline mr-2" />
                    Custom Trends ({customTrends.length})
                </button>
            </div>

            {/* Filters */}
            <motion.div variants={item} className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search trends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-2 border-black pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-[#FFC900] focus:outline-none"
                    />
                </div>
                <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="bg-white border-2 border-black px-4 py-2.5 focus:ring-2 focus:ring-[#FFC900] focus:outline-none min-w-[150px] font-bold"
                >
                    {INDUSTRIES.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                    ))}
                </select>
                <button
                    onClick={fetchTrends}
                    className="px-4 py-2 bg-white border-2 border-black hover:bg-[#F5F5F0] transition-colors"
                >
                    <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                </button>
            </motion.div>

            {/* Cached Trends Grid */}
            {activeTab === 'cached' && (
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white border-2 border-black p-5 animate-pulse">
                                <div className="h-6 bg-gray-200 w-3/4 mb-3" />
                                <div className="h-4 bg-gray-200 w-1/2 mb-2" />
                                <div className="h-4 bg-gray-200 w-full" />
                            </div>
                        ))
                    ) : filteredCachedTrends.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white border-2 border-black">
                            <TrendingUp className="w-12 h-12 text-black/30 mx-auto mb-3" />
                            <p className="text-black/60 font-medium">No cached trends found</p>
                            <p className="text-sm text-black/40 mt-1">Refresh the cache to fetch new trends</p>
                        </div>
                    ) : (
                        filteredCachedTrends.map((trend) => (
                            <div
                                key={trend.id}
                                className="bg-white border-2 border-black p-5 hover:shadow-brutal transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className="px-2 py-1 bg-[#00F0FF] border border-black text-xs font-black uppercase">
                                        {trend.industry || 'General'}
                                    </span>
                                    <span className="text-sm font-bold text-[#FF90E8]">{trend.formatted_traffic || trend.traffic}</span>
                                </div>

                                <h3 className="font-black text-lg mb-2">{trend.title}</h3>
                                {trend.reason && (
                                    <p className="text-sm text-black/60 mb-1">
                                        <strong>Why:</strong> {trend.reason}
                                    </p>
                                )}
                                {trend.content_idea && (
                                    <p className="text-sm text-[#FF90E8] font-medium">
                                        <strong>Idea:</strong> {trend.content_idea}
                                    </p>
                                )}

                                <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-black/40" />
                                    <span className="text-xs text-black/40 font-medium">{trend.source}</span>
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>
            )}

            {/* Custom Trends Grid */}
            {activeTab === 'custom' && (
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white border-2 border-black p-5 animate-pulse">
                                <div className="h-6 bg-gray-200 w-3/4 mb-3" />
                                <div className="h-4 bg-gray-200 w-1/2" />
                            </div>
                        ))
                    ) : filteredCustomTrends.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white border-2 border-black">
                            <Star className="w-12 h-12 text-black/30 mx-auto mb-3" />
                            <p className="text-black/60 font-medium">No custom trends yet</p>
                            <button
                                onClick={openAddModal}
                                className="mt-4 px-4 py-2 bg-[#FFC900] border-2 border-black font-black uppercase text-sm"
                            >
                                Add Your First Trend
                            </button>
                        </div>
                    ) : (
                        filteredCustomTrends.map((trend) => (
                            <div
                                key={trend.id}
                                className={cn(
                                    "bg-white border-2 p-5 transition-all",
                                    trend.is_featured ? "border-[#FFC900] shadow-brutal" : "border-black hover:shadow-brutal",
                                    !trend.is_active && "opacity-50"
                                )}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-[#FF90E8] border border-black text-xs font-black uppercase">
                                            {trend.industry}
                                        </span>
                                        {trend.is_featured && (
                                            <span className="px-2 py-1 bg-[#FFC900] text-black text-xs font-black flex items-center gap-1">
                                                <Star className="w-3 h-3" /> Featured
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold">{trend.traffic}</span>
                                </div>

                                <h3 className="font-black text-lg mb-2">{trend.title}</h3>
                                {trend.reason && (
                                    <p className="text-sm text-black/60 mb-1">
                                        <strong>Why:</strong> {trend.reason}
                                    </p>
                                )}
                                {trend.content_idea && (
                                    <p className="text-sm text-[#FF90E8] font-medium">
                                        <strong>Idea:</strong> {trend.content_idea}
                                    </p>
                                )}

                                <div className="flex items-center justify-end mt-4 pt-3 border-t-2 border-black/10 gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingTrend(trend)
                                            setFormData({
                                                title: trend.title,
                                                traffic: trend.traffic,
                                                industry: trend.industry,
                                                content_idea: trend.content_idea,
                                                reason: trend.reason,
                                                is_active: trend.is_active,
                                                is_featured: trend.is_featured
                                            })
                                            setModalOpen(true)
                                        }}
                                        className="p-2 hover:bg-[#F5F5F0] border border-black transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteTrend(trend.id)}
                                        className="p-2 hover:bg-[#FF4D4D] hover:text-white border border-black transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border-4 border-black w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-brutal-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black uppercase">
                                    {editingTrend ? 'Edit Trend' : 'Add Custom Trend'}
                                </h3>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="p-2 hover:bg-[#F5F5F0] border border-black"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-black uppercase mb-2">Trend Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., AI in Healthcare 2025"
                                        className="w-full bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-black uppercase mb-2">Traffic</label>
                                        <input
                                            type="text"
                                            value={formData.traffic}
                                            onChange={(e) => setFormData({ ...formData, traffic: e.target.value })}
                                            placeholder="e.g., 100K+"
                                            className="w-full bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black uppercase mb-2">Industry</label>
                                        <select
                                            value={formData.industry}
                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                            className="w-full bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none"
                                        >
                                            {INDUSTRIES.map(industry => (
                                                <option key={industry} value={industry}>{industry}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black uppercase mb-2">Why Trending?</label>
                                    <input
                                        type="text"
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        placeholder="e.g., Rising interest in AI healthcare"
                                        className="w-full bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-black uppercase mb-2">Content Idea</label>
                                    <textarea
                                        value={formData.content_idea}
                                        onChange={(e) => setFormData({ ...formData, content_idea: e.target.value })}
                                        placeholder="e.g., Create a video about top 5 AI tools"
                                        rows={3}
                                        className="w-full bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-5 h-5 border-2 border-black accent-[#FFC900]"
                                        />
                                        <span className="text-sm font-bold">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_featured}
                                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                            className="w-5 h-5 border-2 border-black accent-[#FFC900]"
                                        />
                                        <span className="text-sm font-bold">Featured</span>
                                    </label>
                                </div>

                                <button
                                    onClick={saveTrend}
                                    disabled={!formData.title.trim() || saving}
                                    className={cn(
                                        "w-full py-3 font-black uppercase flex items-center justify-center gap-2 transition-all border-2 border-black",
                                        !formData.title.trim() || saving
                                            ? "bg-gray-200 text-black/50 cursor-not-allowed"
                                            : "bg-[#FFC900] hover:shadow-brutal"
                                    )}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
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
