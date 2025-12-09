'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
    FileText,
    AlertCircle,
    AlertTriangle,
    Info,
    Bug,
    CheckCircle,
    RefreshCw,
    Search,
    Filter,
    Download,
    Trash2,
    Clock,
    Server,
    Database,
    Zap,
    X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogEntry {
    id: string
    timestamp: string
    level: 'info' | 'warning' | 'error' | 'success' | 'debug'
    source: string
    message: string
    details?: string
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterLevel, setFilterLevel] = useState<string>('all')
    const [filterSource, setFilterSource] = useState<string>('all')
    const [autoRefresh, setAutoRefresh] = useState(false)
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
    const logsEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchLogs()
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (autoRefresh) {
            interval = setInterval(fetchLogs, 5000)
        }
        return () => clearInterval(interval)
    }, [autoRefresh])

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/logs')
            const data = await response.json()
            if (data.success) {
                setLogs(data.logs)
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error)
            // Demo data
            setLogs(generateDemoLogs())
        } finally {
            setLoading(false)
        }
    }

    const generateDemoLogs = (): LogEntry[] => {
        const levels: LogEntry['level'][] = ['info', 'warning', 'error', 'success', 'debug']
        const sources = ['API', 'Cache', 'Auth', 'Database', 'YouTube', 'SerpAPI']
        const messages = [
            { level: 'success', msg: 'Cache refresh completed', source: 'Cache' },
            { level: 'info', msg: 'User login successful', source: 'Auth' },
            { level: 'warning', msg: 'API quota at 80%', source: 'YouTube' },
            { level: 'error', msg: 'Failed to fetch trends', source: 'SerpAPI' },
            { level: 'debug', msg: 'Query executed in 45ms', source: 'Database' },
            { level: 'info', msg: 'New user registered', source: 'Auth' },
            { level: 'success', msg: 'Video analysis completed', source: 'API' },
            { level: 'warning', msg: 'Rate limit approaching', source: 'API' },
            { level: 'info', msg: 'Cache hit ratio: 85%', source: 'Cache' },
            { level: 'error', msg: 'Connection timeout', source: 'Database' },
        ]

        return messages.map((m, i) => ({
            id: `log-${i}`,
            timestamp: new Date(Date.now() - i * 300000).toISOString(),
            level: m.level as LogEntry['level'],
            source: m.source,
            message: m.msg,
            details: m.level === 'error' ? 'Stack trace: Error at line 42...' : undefined
        }))
    }

    const clearLogs = async () => {
        if (!confirm('Clear all logs?')) return
        try {
            await fetch('/api/admin/logs', { method: 'DELETE' })
            setLogs([])
        } catch (error) {
            setLogs([])
        }
    }

    const exportLogs = () => {
        const data = JSON.stringify(logs, null, 2)
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `logs-${new Date().toISOString().split('T')[0]}.json`
        a.click()
    }

    const getLevelIcon = (level: LogEntry['level']) => {
        switch (level) {
            case 'info': return <Info className="w-4 h-4" />
            case 'warning': return <AlertTriangle className="w-4 h-4" />
            case 'error': return <AlertCircle className="w-4 h-4" />
            case 'success': return <CheckCircle className="w-4 h-4" />
            case 'debug': return <Bug className="w-4 h-4" />
        }
    }

    const getLevelColor = (level: LogEntry['level']) => {
        switch (level) {
            case 'info': return 'text-blue-400 bg-blue-400/10'
            case 'warning': return 'text-yellow-400 bg-yellow-400/10'
            case 'error': return 'text-red-400 bg-red-400/10'
            case 'success': return 'text-green-400 bg-green-400/10'
            case 'debug': return 'text-purple-400 bg-purple-400/10'
        }
    }

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'API': return <Zap className="w-4 h-4" />
            case 'Cache': return <Database className="w-4 h-4" />
            case 'Auth': return <Server className="w-4 h-4" />
            case 'Database': return <Database className="w-4 h-4" />
            default: return <Server className="w-4 h-4" />
        }
    }

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric'
        })
    }

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.source.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesLevel = filterLevel === 'all' || log.level === filterLevel
        const matchesSource = filterSource === 'all' || log.source === filterSource
        return matchesSearch && matchesLevel && matchesSource
    })

    const logCounts = {
        all: logs.length,
        info: logs.filter(l => l.level === 'info').length,
        warning: logs.filter(l => l.level === 'warning').length,
        error: logs.filter(l => l.level === 'error').length,
        success: logs.filter(l => l.level === 'success').length,
    }

    const uniqueSources = [...new Set(logs.map(l => l.source))]

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-[#FFC900]" />
                        System Logs
                    </h1>
                    <p className="text-[#888] mt-1">Monitor system activity and errors</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors",
                            autoRefresh
                                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                : "bg-[#1A1A1A] border border-[#333] hover:border-[#FFC900]"
                        )}
                    >
                        <RefreshCw className={cn("w-4 h-4", autoRefresh && "animate-spin")} />
                        {autoRefresh ? 'Auto' : 'Manual'}
                    </button>
                    <button
                        onClick={fetchLogs}
                        className="p-2 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#FFC900]"
                    >
                        <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(logCounts).map(([level, count]) => (
                    <button
                        key={level}
                        onClick={() => setFilterLevel(level)}
                        className={cn(
                            "p-3 rounded-lg border-2 transition-all text-left",
                            filterLevel === level
                                ? "border-[#FFC900] bg-[#FFC900]/10"
                                : "border-[#333] bg-[#111] hover:border-[#444]"
                        )}
                    >
                        <p className="text-2xl font-black">{count}</p>
                        <p className="text-xs text-[#888] capitalize">{level}</p>
                    </button>
                ))}
            </motion.div>

            {/* Filters */}
            <motion.div variants={item} className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111] border-2 border-[#333] rounded-lg pl-10 pr-4 py-2.5 focus:border-[#FFC900] focus:outline-none"
                    />
                </div>
                <select
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                    className="bg-[#111] border-2 border-[#333] rounded-lg px-4 py-2.5 focus:border-[#FFC900] focus:outline-none"
                >
                    <option value="all">All Sources</option>
                    {uniqueSources.map(source => (
                        <option key={source} value={source}>{source}</option>
                    ))}
                </select>
                <button
                    onClick={exportLogs}
                    className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#333] rounded-lg hover:border-[#FFC900] flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Export
                </button>
                <button
                    onClick={clearLogs}
                    className="px-4 py-2 bg-red-500/10 border-2 border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear
                </button>
            </motion.div>

            {/* Logs List */}
            <motion.div variants={item} className="bg-[#111] border-2 border-[#222] rounded-xl overflow-hidden">
                <div className="max-h-[600px] overflow-y-auto">
                    {loading && logs.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="w-8 h-8 text-[#FFC900] animate-spin" />
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <FileText className="w-12 h-12 text-[#666] mb-3" />
                            <p className="text-[#888]">No logs found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#222]">
                            {filteredLogs.map((log) => (
                                <div
                                    key={log.id}
                                    onClick={() => setSelectedLog(log)}
                                    className="p-4 hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Level Badge */}
                                        <div className={cn(
                                            "p-2 rounded-lg flex-shrink-0",
                                            getLevelColor(log.level)
                                        )}>
                                            {getLevelIcon(log.level)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-[#333] rounded text-xs font-semibold">
                                                    {log.source}
                                                </span>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-xs font-bold uppercase",
                                                    getLevelColor(log.level)
                                                )}>
                                                    {log.level}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium">{log.message}</p>
                                            {log.details && (
                                                <p className="text-xs text-[#888] mt-1 truncate">{log.details}</p>
                                            )}
                                        </div>

                                        {/* Timestamp */}
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-mono">{formatTime(log.timestamp)}</p>
                                            <p className="text-xs text-[#888]">{formatDate(log.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div ref={logsEndRef} />
                </div>
            </motion.div>

            {/* Log Detail Modal */}
            {selectedLog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                    onClick={() => setSelectedLog(null)}
                >
                    <div
                        className="bg-[#111] border-2 border-[#333] rounded-xl w-full max-w-lg p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg", getLevelColor(selectedLog.level))}>
                                    {getLevelIcon(selectedLog.level)}
                                </div>
                                <div>
                                    <p className="font-bold">{selectedLog.source}</p>
                                    <p className="text-xs text-[#888]">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-[#333] rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-[#888] mb-1 uppercase font-bold">Message</p>
                                <p className="text-sm">{selectedLog.message}</p>
                            </div>

                            {selectedLog.details && (
                                <div>
                                    <p className="text-xs text-[#888] mb-1 uppercase font-bold">Details</p>
                                    <pre className="text-xs bg-[#0A0A0A] p-3 rounded-lg overflow-x-auto text-red-400 font-mono">
                                        {selectedLog.details}
                                    </pre>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-[#888] mb-1">Level</p>
                                    <span className={cn("px-2 py-1 rounded text-xs font-bold uppercase", getLevelColor(selectedLog.level))}>
                                        {selectedLog.level}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-[#888] mb-1">Source</p>
                                    <span className="font-semibold">{selectedLog.source}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
