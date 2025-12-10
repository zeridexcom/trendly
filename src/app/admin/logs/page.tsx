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
    Download,
    Trash2,
    X,
    Loader2
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
    const [autoRefresh, setAutoRefresh] = useState(false)
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)

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
                setLogs(data.logs || [])
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error)
            setLogs([])
        } finally {
            setLoading(false)
        }
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

    const getLevelStyle = (level: LogEntry['level']) => {
        switch (level) {
            case 'info': return 'bg-[#00F0FF] text-black'
            case 'warning': return 'bg-[#FFC900] text-black'
            case 'error': return 'bg-[#FF4D4D] text-white'
            case 'success': return 'bg-[#B1F202] text-black'
            case 'debug': return 'bg-[#FF90E8] text-black'
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
        return matchesSearch && matchesLevel
    })

    const logCounts = {
        all: logs.length,
        info: logs.filter(l => l.level === 'info').length,
        warning: logs.filter(l => l.level === 'warning').length,
        error: logs.filter(l => l.level === 'error').length,
        success: logs.filter(l => l.level === 'success').length,
    }

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
                        <FileText className="w-8 h-8" />
                        System Logs
                    </h1>
                    <p className="text-black/60 mt-1 font-medium">Monitor system activity and errors</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={cn(
                            "px-4 py-2 font-bold uppercase text-sm flex items-center gap-2 transition-all border-2 border-black",
                            autoRefresh
                                ? "bg-[#B1F202] shadow-brutal"
                                : "bg-white hover:bg-[#F5F5F0]"
                        )}
                    >
                        <RefreshCw className={cn("w-4 h-4", autoRefresh && "animate-spin")} />
                        {autoRefresh ? 'Auto' : 'Manual'}
                    </button>
                    <button
                        onClick={fetchLogs}
                        className="p-2 bg-white border-2 border-black hover:bg-[#FFC900] transition-colors"
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
                            "p-3 border-2 border-black transition-all text-left",
                            filterLevel === level
                                ? "bg-[#FFC900] shadow-brutal"
                                : "bg-white hover:bg-[#F5F5F0]"
                        )}
                    >
                        <p className="text-2xl font-black">{count}</p>
                        <p className="text-xs text-black/60 font-bold uppercase">{level}</p>
                    </button>
                ))}
            </motion.div>

            {/* Filters */}
            <motion.div variants={item} className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-2 border-black pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-[#FFC900] focus:outline-none"
                    />
                </div>
                <button
                    onClick={exportLogs}
                    className="px-4 py-2 bg-white border-2 border-black hover:bg-[#F5F5F0] flex items-center gap-2 font-bold"
                >
                    <Download className="w-4 h-4" />
                    Export
                </button>
                <button
                    onClick={clearLogs}
                    className="px-4 py-2 bg-[#FF4D4D] text-white border-2 border-black hover:bg-[#FF3333] flex items-center gap-2 font-bold"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear
                </button>
            </motion.div>

            {/* Logs List */}
            <motion.div variants={item} className="bg-white border-4 border-black shadow-brutal overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                    {loading && logs.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-[#FF90E8] animate-spin" />
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <FileText className="w-12 h-12 text-black/30 mb-3" />
                            <p className="text-black/60 font-medium">No logs found</p>
                            <p className="text-black/40 text-sm">Logs will appear as system events occur</p>
                        </div>
                    ) : (
                        <div className="divide-y-2 divide-black/10">
                            {filteredLogs.map((log) => (
                                <div
                                    key={log.id}
                                    onClick={() => setSelectedLog(log)}
                                    className="p-4 hover:bg-[#F5F5F0] transition-colors cursor-pointer"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "p-2 border border-black flex-shrink-0",
                                            getLevelStyle(log.level)
                                        )}>
                                            {getLevelIcon(log.level)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-[#F5F5F0] border border-black text-xs font-bold uppercase">
                                                    {log.source}
                                                </span>
                                                <span className={cn(
                                                    "px-2 py-0.5 border border-black text-xs font-black uppercase",
                                                    getLevelStyle(log.level)
                                                )}>
                                                    {log.level}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium">{log.message}</p>
                                            {log.details && (
                                                <p className="text-xs text-black/50 mt-1 truncate">{log.details}</p>
                                            )}
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-mono font-bold">{formatTime(log.timestamp)}</p>
                                            <p className="text-xs text-black/50">{formatDate(log.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Log Detail Modal */}
            {selectedLog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    onClick={() => setSelectedLog(null)}
                >
                    <div
                        className="bg-white border-4 border-black w-full max-w-lg p-6 shadow-brutal-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 border border-black", getLevelStyle(selectedLog.level))}>
                                    {getLevelIcon(selectedLog.level)}
                                </div>
                                <div>
                                    <p className="font-black">{selectedLog.source}</p>
                                    <p className="text-xs text-black/60">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-[#F5F5F0] border border-black">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-black/60 mb-1 uppercase font-black">Message</p>
                                <p className="text-sm">{selectedLog.message}</p>
                            </div>

                            {selectedLog.details && (
                                <div>
                                    <p className="text-xs text-black/60 mb-1 uppercase font-black">Details</p>
                                    <pre className="text-xs bg-black text-[#B1F202] p-3 border-2 border-black overflow-x-auto font-mono">
                                        {selectedLog.details}
                                    </pre>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-black/60 mb-1 font-bold">Level</p>
                                    <span className={cn("px-2 py-1 border border-black text-xs font-black uppercase", getLevelStyle(selectedLog.level))}>
                                        {selectedLog.level}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-black/60 mb-1 font-bold">Source</p>
                                    <span className="font-black">{selectedLog.source}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
