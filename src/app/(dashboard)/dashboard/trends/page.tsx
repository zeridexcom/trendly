'use client'

import { useState } from 'react'
import {
    Plus,
    Search,
    Filter,
    ExternalLink,
    MoreHorizontal,
    Edit,
    Trash2,
    Lightbulb,
    X,
    Sparkles,
    Zap,
    CheckCircle,
    ArrowUpRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
]

const platformConfig: Record<string, { icon: string; name: string }> = {
    INSTAGRAM: { icon: 'Instagram', name: 'Instagram' },
    TIKTOK: { icon: 'TikTok', name: 'TikTok' },
    YOUTUBE: { icon: 'YouTube', name: 'YouTube' },
    TWITTER: { icon: 'Twitter', name: 'X (Twitter)' },
    LINKEDIN: { icon: 'LinkedIn', name: 'LinkedIn' },
    OTHER: { icon: 'Other', name: 'Other' },
}

const typeConfig: Record<string, { label: string }> = {
    HASHTAG: { label: 'Hashtag' },
    SOUND_AUDIO: { label: 'Sound/Audio' },
    MEME_FORMAT: { label: 'Meme/Format' },
    VIDEO_STYLE: { label: 'Video Style' },
    CHALLENGE: { label: 'Challenge' },
    TOPIC: { label: 'Topic' },
    OTHER: { label: 'Other' },
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
    const [isDiscovering, setIsDiscovering] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [discoveredTrends, setDiscoveredTrends] = useState<DiscoveredTrend[]>([])
    const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null)
    const [formData, setFormData] = useState({ title: '', platform: 'INSTAGRAM', type: 'MEME_FORMAT', url: '', notes: '' })
    const [aiFormData, setAiFormData] = useState({ platforms: ['INSTAGRAM', 'TIKTOK'], niche: '' })

    const filteredTrends = trends.filter((trend) => {
        const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase()) || trend.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesPlatform = !filterPlatform || trend.platform === filterPlatform
        const matchesType = !filterType || trend.type === filterType
        return matchesSearch && matchesPlatform && matchesType
    })

    const handleCreateTrend = () => {
        const newTrend: Trend = { id: Date.now().toString(), ...formData, createdBy: { name: 'Demo User' }, createdAt: new Date().toISOString() }
        setTrends([newTrend, ...trends])
        setShowCreateModal(false)
        setFormData({ title: '', platform: 'INSTAGRAM', type: 'MEME_FORMAT', url: '', notes: '' })
    }

    const handleDeleteTrend = (id: string) => setTrends(trends.filter((t) => t.id !== id))
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    const handleDiscoverTrends = async () => {
        setIsDiscovering(true)
        setDiscoveredTrends([])
        try {
            const response = await fetch('/api/ai/trends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'discover', platforms: aiFormData.platforms, niche: aiFormData.niche }),
            })
            const data = await response.json()
            if (data.trends && data.trends.length > 0) setDiscoveredTrends(data.trends)
            else setDiscoveredTrends([{ title: 'Short-form educational content', platform: 'TIKTOK', type: 'VIDEO_STYLE', reason: 'Educational reels' }])
        } catch (error) { console.error(error); alert('Failed to discover trends') } finally { setIsDiscovering(false) }
    }

    const handleAddDiscoveredTrend = (discovered: DiscoveredTrend) => {
        const newTrend: Trend = { id: Date.now().toString(), title: discovered.title, platform: discovered.platform, type: discovered.type, notes: discovered.reason, createdBy: { name: 'AI' }, createdAt: new Date().toISOString(), aiGenerated: true, reason: discovered.reason }
        setTrends([newTrend, ...trends])
        setDiscoveredTrends(discoveredTrends.filter(t => t.title !== discovered.title))
    }

    const handleAnalyzeTrend = async (trend: Trend) => {
        setSelectedTrend(trend)
        setShowAnalysisModal(true)
        setIsAnalyzing(true)
        setTrendAnalysis(null)
        try {
            const response = await fetch('/api/ai/trends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'analyze', title: trend.title, platform: trend.platform, type: trend.type, description: trend.notes }),
            })
            const data = await response.json()
            setTrendAnalysis(data)
        } catch (error) { setTrendAnalysis({ score: 75, potential: 'MEDIUM', insights: ['Trending steady'], contentIdeas: ['Tutorial'], bestTimeToPost: '9 AM', predictedLifespan: '2 weeks' }) }
        finally { setIsAnalyzing(false) }
    }

    return (
        <div className="space-y-6 animate-fadeIn h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Trends</h1>
                    <p className="text-muted-foreground mt-1">Discover, track, and analyze viral topics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className={`btn btn-sm ${showFilters ? 'bg-muted text-foreground' : 'btn-ghost'}`} onClick={() => setShowFilters(!showFilters)}>
                        <Filter size={16} className="mr-2" /> Filters
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2" onClick={() => setShowAIModal(true)}>
                        <Sparkles size={16} className="mr-2" /> Discover
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2" onClick={() => setShowCreateModal(true)}>
                        <Plus size={16} className="mr-2" /> Add Trend
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search trends..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Main Table */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b text-xs uppercase font-medium text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Platform</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4 hidden md:table-cell">Created</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredTrends.map(trend => (
                                <tr key={trend.id} className="group hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleAnalyzeTrend(trend)}>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-foreground">{trend.title}</span>
                                            {trend.notes && <span className="text-muted-foreground text-xs line-clamp-1">{trend.notes}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {platformConfig[trend.platform]?.name || trend.platform}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {typeConfig[trend.type]?.label || trend.type}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                                        {formatDate(trend.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {trend.url && (
                                                <a href={trend.url} target="_blank" rel="noopener" className="p-2 hover:bg-muted rounded-md" onClick={e => e.stopPropagation()}>
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                            <button className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md" onClick={(e) => { e.stopPropagation(); handleDeleteTrend(trend.id); }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTrends.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No trends found. Try creating one or using AI to discover.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Discover Modal */}
            {showAIModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-lg border bg-card p-6 shadow-lg animate-fadeIn h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><Sparkles size={18} /> Discover Trends</h2>
                            {!isDiscovering && <button onClick={() => setShowAIModal(false)}><X size={20} className="text-muted-foreground" /></button>}
                        </div>

                        {!discoveredTrends.length ? (
                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <button
                                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium flex items-center gap-2"
                                        onClick={handleDiscoverTrends}
                                        disabled={isDiscovering}
                                    >
                                        {isDiscovering ? 'Discovering...' : 'Start Discovery'}
                                        {!isDiscovering && <ArrowUpRight size={16} />}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto space-y-3">
                                {discoveredTrends.map((trend, idx) => (
                                    <div key={idx} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-semibold text-sm">{trend.title}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{trend.reason}</p>
                                        </div>
                                        <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md" onClick={() => handleAddDiscoveredTrend(trend)}>Add</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-lg border bg-card p-6 shadow-lg animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">New Trend</h2>
                            <button onClick={() => setShowCreateModal(false)}><X size={20} className="text-muted-foreground" /></button>
                        </div>
                        <input className="w-full bg-background border rounded-md px-3 py-2 mb-4 text-sm" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} autoFocus />
                        <div className="flex justify-end gap-3">
                            <button className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md" onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md" onClick={handleCreateTrend}>Add Trend</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Analysis Modal */}
            {showAnalysisModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-lg border bg-card p-6 shadow-lg animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><Zap size={18} /> Analysis</h2>
                            <button onClick={() => setShowAnalysisModal(false)}><X size={20} className="text-muted-foreground" /></button>
                        </div>
                        {isAnalyzing || !trendAnalysis ? (
                            <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-muted/50 rounded-lg border">
                                    <div className="text-sm font-medium text-muted-foreground">Score</div>
                                    <div className="text-3xl font-bold">{trendAnalysis.score}<span className="text-sm text-muted-foreground font-normal">/100</span></div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Insights</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                                        {trendAnalysis.insights.map((insight, i) => <li key={i}>{insight}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
