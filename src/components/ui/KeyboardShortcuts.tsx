'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Command, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Shortcut {
    keys: string[]
    label: string
    action: () => void
    category?: string
}

interface ShortcutsDisplayProps {
    shortcuts: Shortcut[]
}

// Floating Keyboard Shortcuts Help
export function KeyboardShortcutsHelp({ shortcuts }: ShortcutsDisplayProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Toggle with ?
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                const target = e.target as HTMLElement
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    e.preventDefault()
                    setIsOpen(prev => !prev)
                }
            }
            if (e.key === 'Escape') setIsOpen(false)
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Group by category
    const grouped = shortcuts.reduce((acc, shortcut) => {
        const category = shortcut.category || 'General'
        if (!acc[category]) acc[category] = []
        acc[category].push(shortcut)
        return acc
    }, {} as Record<string, Shortcut[]>)

    return (
        <>
            {/* Floating button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
            >
                <div className="flex items-center gap-2">
                    <Command className="h-5 w-5" />
                    <span className="hidden sm:inline text-sm font-medium">Shortcuts</span>
                </div>
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600">
                                            <Command className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Keyboard Shortcuts</h2>
                                            <p className="text-sm text-slate-500">Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">?</kbd> to toggle</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-slate-400" />
                                    </button>
                                </div>

                                {/* Shortcuts List */}
                                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6">
                                    {Object.entries(grouped).map(([category, categoryShortcuts]) => (
                                        <div key={category}>
                                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                                {category}
                                            </h3>
                                            <div className="space-y-2">
                                                {categoryShortcuts.map((shortcut, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center justify-between py-2"
                                                    >
                                                        <span className="text-sm text-slate-600 dark:text-slate-300">
                                                            {shortcut.label}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            {shortcut.keys.map((key, j) => (
                                                                <React.Fragment key={j}>
                                                                    <kbd className="min-w-[24px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 text-center">
                                                                        {key}
                                                                    </kbd>
                                                                    {j < shortcut.keys.length - 1 && (
                                                                        <span className="text-slate-400 text-xs">+</span>
                                                                    )}
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

// Global shortcut handler hook
export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

            for (const shortcut of shortcuts) {
                const matchesAll = shortcut.keys.every((key, i) => {
                    const k = key.toLowerCase()
                    if (k === '⌘' || k === 'cmd' || k === 'meta') return e.metaKey
                    if (k === 'ctrl') return e.ctrlKey
                    if (k === 'shift') return e.shiftKey
                    if (k === 'alt') return e.altKey
                    // Last key should be the actual key
                    if (i === shortcut.keys.length - 1) {
                        return e.key.toLowerCase() === k
                    }
                    return true
                })

                if (matchesAll) {
                    e.preventDefault()
                    shortcut.action()
                    return
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [shortcuts])
}

// Inline keyboard shortcut display
export function ShortcutHint({ keys, className }: { keys: string[]; className?: string }) {
    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            {keys.map((key, i) => (
                <React.Fragment key={i}>
                    <kbd className="min-w-[20px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 text-center">
                        {key === 'Meta' ? '⌘' : key}
                    </kbd>
                    {i < keys.length - 1 && (
                        <span className="text-slate-300 text-[10px]">+</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}
