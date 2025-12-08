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
    icon: React.ComponentType<any>
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
        { id: 'nav-dashboard', label: 'Dashboard', description: 'Overview', icon: LayoutDashboard, action: () => router.push('/dashboard'), category: 'navigation' },
        { id: 'nav-trends', label: 'Trends', description: 'Discover trending topics', icon: TrendingUp, action: () => router.push('/dashboard/trends'), category: 'navigation' },
        { id: 'nav-ideas', label: 'Ideas', description: 'AI content ideas', icon: Lightbulb, action: () => router.push('/dashboard/ideas'), category: 'navigation' },
        { id: 'nav-scripts', label: 'Scripts', description: 'AI script writer', icon: Video, action: () => router.push('/dashboard/scripts'), category: 'navigation' },
        { id: 'nav-virality', label: 'Virality Score', description: 'Score your content', icon: Zap, action: () => router.push('/dashboard/virality'), category: 'navigation' },
        { id: 'nav-comments', label: 'Comments', description: 'AI reply generator', icon: MessageCircle, action: () => router.push('/dashboard/comments'), category: 'navigation' },
        { id: 'nav-pillars', label: 'Pillars', description: 'Content strategy', icon: Layers, action: () => router.push('/dashboard/pillars'), category: 'navigation' },
        { id: 'nav-besttime', label: 'Best Time', description: 'Optimal posting times', icon: Clock, action: () => router.push('/dashboard/best-time'), category: 'navigation' },
        { id: 'nav-competitors', label: 'Competitors', description: 'Track competitors', icon: Target, action: () => router.push('/dashboard/competitors'), category: 'navigation' },
        { id: 'nav-repurpose', label: 'Repurpose', description: 'Content repurposing', icon: Sparkles, action: () => router.push('/dashboard/repurpose'), category: 'navigation' },
        { id: 'nav-calendar', label: 'Calendar', description: 'Content calendar', icon: Calendar, action: () => router.push('/dashboard/calendar'), category: 'navigation' },
        { id: 'nav-workflows', label: 'Workflows', description: 'Approval pipeline', icon: FileText, action: () => router.push('/dashboard/workflows'), category: 'navigation' },
        { id: 'nav-scheduler', label: 'Scheduler', description: 'Auto-scheduling', icon: Clock, action: () => router.push('/dashboard/scheduler'), category: 'navigation' },
        { id: 'nav-activity', label: 'Activity', description: 'Team activity', icon: Activity, action: () => router.push('/dashboard/activity'), category: 'navigation' },
        { id: 'nav-team', label: 'Team', description: 'Manage team', icon: Users, action: () => router.push('/dashboard/admin/users'), category: 'navigation' },
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
            {/* Trigger Button - Hidden on Desktop as Header handles it, visible on mobile maybe? Actually Component is used in Layout */}
            {/* We'll hide the trigger here since Header has one, but keys still work */}
            <div className="hidden"></div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-white/50 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="fixed inset-0 flex items-start justify-center pt-[15vh] px-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                className="relative w-full max-w-lg bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000]"
                            >
                                {/* Search Input */}
                                <div className="flex items-center gap-3 px-4 py-4 border-b-2 border-black bg-[#FF90E8]">
                                    <Search className="h-6 w-6 text-black" strokeWidth={3} />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }}
                                        onKeyDown={handleKeyDown}
                                        placeholder="What do you want to do?"
                                        className="flex-1 bg-transparent outline-none text-lg font-black text-black placeholder:text-black/60 uppercase"
                                    />
                                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 border-2 border-black bg-white text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                                        ESC
                                    </kbd>
                                </div>

                                {/* Results */}
                                <div className="max-h-[400px] overflow-y-auto p-2 bg-white">
                                    {allFiltered.length === 0 ? (
                                        <div className="py-8 text-center text-sm font-bold text-gray-500 uppercase">No results found.</div>
                                    ) : (
                                        <>
                                            {groupedCommands.navigation.length > 0 && (
                                                <div className="mb-2">
                                                    <p className="px-2 py-2 text-xs font-black text-black uppercase tracking-wider">Navigation</p>
                                                    {groupedCommands.navigation.map((cmd, i) => {
                                                        const globalIndex = i
                                                        return (
                                                            <button
                                                                key={cmd.id}
                                                                onClick={() => executeCommand(cmd)}
                                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-3 py-3 border-2 border-transparent transition-all",
                                                                    selectedIndex === globalIndex ? "bg-[#FFC900] border-black shadow-[4px_4px_0px_0px_#000] -translate-y-1" : "hover:bg-gray-50"
                                                                )}
                                                            >
                                                                <cmd.icon className="h-5 w-5 text-black" strokeWidth={2.5} />
                                                                <div className="flex-1 text-left">
                                                                    <p className="text-sm font-bold text-black uppercase">{cmd.label}</p>
                                                                    {cmd.description && <p className="text-xs font-medium text-gray-600">{cmd.description}</p>}
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                            {groupedCommands.create.length > 0 && (
                                                <div className="mb-2">
                                                    <p className="px-2 py-2 text-xs font-black text-black uppercase tracking-wider">Create</p>
                                                    {groupedCommands.create.map((cmd, i) => {
                                                        const globalIndex = groupedCommands.navigation.length + i
                                                        return (
                                                            <button
                                                                key={cmd.id}
                                                                onClick={() => executeCommand(cmd)}
                                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-3 py-3 border-2 border-transparent transition-all",
                                                                    selectedIndex === globalIndex ? "bg-[#00F0FF] border-black shadow-[4px_4px_0px_0px_#000] -translate-y-1" : "hover:bg-gray-50"
                                                                )}
                                                            >
                                                                <cmd.icon className="h-5 w-5 text-black" strokeWidth={2.5} />
                                                                <div className="flex-1 text-left">
                                                                    <p className="text-sm font-bold text-black uppercase">{cmd.label}</p>
                                                                    {cmd.description && <p className="text-xs font-medium text-gray-600">{cmd.description}</p>}
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                            {groupedCommands.actions.length > 0 && (
                                                <div>
                                                    <p className="px-2 py-2 text-xs font-black text-black uppercase tracking-wider">Actions</p>
                                                    {groupedCommands.actions.map((cmd, i) => {
                                                        const globalIndex = groupedCommands.navigation.length + groupedCommands.create.length + i
                                                        return (
                                                            <button
                                                                key={cmd.id}
                                                                onClick={() => executeCommand(cmd)}
                                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                                className={cn(
                                                                    "w-full flex items-center gap-3 px-3 py-3 border-2 border-transparent transition-all",
                                                                    selectedIndex === globalIndex ? "bg-[#B1F202] border-black shadow-[4px_4px_0px_0px_#000] -translate-y-1" : "hover:bg-gray-50"
                                                                )}
                                                            >
                                                                <cmd.icon className="h-5 w-5 text-black" strokeWidth={2.5} />
                                                                <div className="flex-1 text-left">
                                                                    <p className="text-sm font-bold text-black uppercase">{cmd.label}</p>
                                                                    {cmd.description && <p className="text-xs font-medium text-gray-600">{cmd.description}</p>}
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
                                <div className="px-4 py-3 border-t-2 border-black bg-gray-50 text-xs font-bold text-gray-500 flex items-center justify-between uppercase tracking-wider">
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
