'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search,
    LayoutDashboard,
    TrendingUp,
    Lightbulb,
    Video,
    Zap,
    MessageCircle,
    Layers,
    Clock,
    Target,
    Sparkles,
    Calendar,
    Users,
    FileText,
    Activity,
    Plus,
    Settings,
    Command
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CommandItem {
    id: string
    label: string
    description?: string
    icon: React.ComponentType<{ className?: string }>
    action: () => void
    category: 'navigation' | 'create' | 'actions'
}

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const commands: CommandItem[] = [
        // Navigation
        { id: 'nav-dashboard', label: 'Go to Dashboard', description: 'Overview', icon: LayoutDashboard, action: () => router.push('/dashboard'), category: 'navigation' },
        { id: 'nav-trends', label: 'Go to Trends', description: 'Discover trending topics', icon: TrendingUp, action: () => router.push('/dashboard/trends'), category: 'navigation' },
        { id: 'nav-ideas', label: 'Go to Ideas', description: 'AI content ideas', icon: Lightbulb, action: () => router.push('/dashboard/ideas'), category: 'navigation' },
        { id: 'nav-scripts', label: 'Go to Scripts', description: 'AI script writer', icon: Video, action: () => router.push('/dashboard/scripts'), category: 'navigation' },
        { id: 'nav-virality', label: 'Go to Virality Score', description: 'Score your content', icon: Zap, action: () => router.push('/dashboard/virality'), category: 'navigation' },
        { id: 'nav-comments', label: 'Go to Comments', description: 'AI reply generator', icon: MessageCircle, action: () => router.push('/dashboard/comments'), category: 'navigation' },
        { id: 'nav-pillars', label: 'Go to Pillars', description: 'Content strategy', icon: Layers, action: () => router.push('/dashboard/pillars'), category: 'navigation' },
        { id: 'nav-besttime', label: 'Go to Best Time', description: 'Optimal posting times', icon: Clock, action: () => router.push('/dashboard/best-time'), category: 'navigation' },
        { id: 'nav-competitors', label: 'Go to Competitors', description: 'Track competitors', icon: Target, action: () => router.push('/dashboard/competitors'), category: 'navigation' },
        { id: 'nav-repurpose', label: 'Go to Repurpose', description: 'Content repurposing', icon: Sparkles, action: () => router.push('/dashboard/repurpose'), category: 'navigation' },
        { id: 'nav-calendar', label: 'Go to Calendar', description: 'Content calendar', icon: Calendar, action: () => router.push('/dashboard/calendar'), category: 'navigation' },
        { id: 'nav-workflows', label: 'Go to Workflows', description: 'Approval pipeline', icon: FileText, action: () => router.push('/dashboard/workflows'), category: 'navigation' },
        { id: 'nav-scheduler', label: 'Go to Scheduler', description: 'Auto-scheduling', icon: Clock, action: () => router.push('/dashboard/scheduler'), category: 'navigation' },
        { id: 'nav-activity', label: 'Go to Activity', description: 'Team activity', icon: Activity, action: () => router.push('/dashboard/activity'), category: 'navigation' },
        { id: 'nav-team', label: 'Go to Team', description: 'Manage team', icon: Users, action: () => router.push('/dashboard/admin/users'), category: 'navigation' },
        // Create Actions
        { id: 'create-idea', label: 'Generate Ideas', description: 'AI-powered content ideas', icon: Plus, action: () => router.push('/dashboard/ideas'), category: 'create' },
        { id: 'create-script', label: 'Write Script', description: 'Create a new script', icon: Plus, action: () => router.push('/dashboard/scripts'), category: 'create' },
        { id: 'create-content', label: 'New Content', description: 'Start content workflow', icon: Plus, action: () => router.push('/dashboard/workflows'), category: 'create' },
        // Quick Actions
        { id: 'action-analyze', label: 'Analyze Virality', description: 'Check content score', icon: Zap, action: () => router.push('/dashboard/virality'), category: 'actions' },
        { id: 'action-schedule', label: 'Auto-Schedule', description: 'AI optimize schedule', icon: Clock, action: () => router.push('/dashboard/scheduler'), category: 'actions' },
    ]

    const filteredCommands = query
        ? commands.filter(cmd =>
            cmd.label.toLowerCase().includes(query.toLowerCase()) ||
            cmd.description?.toLowerCase().includes(query.toLowerCase())
        )
        : commands

    const groupedCommands = {
        navigation: filteredCommands.filter(c => c.category === 'navigation'),
        create: filteredCommands.filter(c => c.category === 'create'),
        actions: filteredCommands.filter(c => c.category === 'actions'),
    }

    const allFiltered = [...groupedCommands.navigation, ...groupedCommands.create, ...groupedCommands.actions]

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
            setQuery('')
            setSelectedIndex(0)
        }
    }, [isOpen])

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => Math.min(prev + 1, allFiltered.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => Math.max(prev - 1, 0))
        } else if (e.key === 'Enter' && allFiltered[selectedIndex]) {
            e.preventDefault()
            allFiltered[selectedIndex].action()
            setIsOpen(false)
        }
    }, [allFiltered, selectedIndex])

    const executeCommand = (cmd: CommandItem) => {
        cmd.action()
        setIsOpen(false)
    }

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-input bg-background hover:bg-accent text-sm text-muted-foreground transition-colors"
            >
                <Search className="h-4 w-4" />
                <span>Search...</span>
                <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <Command className="h-3 w-3" />K
                </kbd>
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="fixed inset-0 flex items-start justify-center pt-[15vh]">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                className="relative w-full max-w-lg rounded-xl border bg-card shadow-2xl overflow-hidden"
                            >
                                {/* Search Input */}
                                <div className="flex items-center gap-3 px-4 py-3 border-b">
                                    <Search className="h-5 w-5 text-muted-foreground" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type a command or search..."
                                        className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                                    />
                                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                        ESC
                                    </kbd>
                                </div>

                                {/* Results */}
                                <div className="max-h-[400px] overflow-y-auto p-2">
                                    {allFiltered.length === 0 ? (
                                        <div className="py-8 text-center text-sm text-muted-foreground">No results found.</div>
                                    ) : (
                                        <>
                                            {groupedCommands.navigation.length > 0 && (
                                                <div className="mb-2">
                                                    <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Navigation</p>
                                                    {groupedCommands.navigation.map((cmd, i) => {
                                                        const globalIndex = i
                                                        return (
                                                            <button
                                                                key={cmd.id}
                                                                onClick={() => executeCommand(cmd)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors",
                                                                    selectedIndex === globalIndex ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                <cmd.icon className="h-4 w-4" />
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium">{cmd.label}</p>
                                                                    {cmd.description && <p className="text-xs text-muted-foreground">{cmd.description}</p>}
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                            {groupedCommands.create.length > 0 && (
                                                <div className="mb-2">
                                                    <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Create</p>
                                                    {groupedCommands.create.map((cmd, i) => {
                                                        const globalIndex = groupedCommands.navigation.length + i
                                                        return (
                                                            <button
                                                                key={cmd.id}
                                                                onClick={() => executeCommand(cmd)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors",
                                                                    selectedIndex === globalIndex ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                <cmd.icon className="h-4 w-4" />
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium">{cmd.label}</p>
                                                                    {cmd.description && <p className="text-xs text-muted-foreground">{cmd.description}</p>}
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                            {groupedCommands.actions.length > 0 && (
                                                <div>
                                                    <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Quick Actions</p>
                                                    {groupedCommands.actions.map((cmd, i) => {
                                                        const globalIndex = groupedCommands.navigation.length + groupedCommands.create.length + i
                                                        return (
                                                            <button
                                                                key={cmd.id}
                                                                onClick={() => executeCommand(cmd)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors",
                                                                    selectedIndex === globalIndex ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                                                )}
                                                            >
                                                                <cmd.icon className="h-4 w-4" />
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium">{cmd.label}</p>
                                                                    {cmd.description && <p className="text-xs text-muted-foreground">{cmd.description}</p>}
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-4 py-2 border-t text-xs text-muted-foreground flex items-center justify-between">
                                    <span>↑↓ to navigate</span>
                                    <span>↵ to select</span>
                                    <span>esc to close</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
