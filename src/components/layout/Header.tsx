'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, Command, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/ThemeToggle'
import { MobileMenuButton } from './MobileNav'

interface HeaderProps {
    onMobileMenuOpen: () => void
    title?: string
    subtitle?: string
    actions?: React.ReactNode
}

export default function Header({
    onMobileMenuOpen,
    title,
    subtitle,
    actions
}: HeaderProps) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800"
        >
            <div className="flex items-center justify-between px-4 lg:px-6 h-16">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <MobileMenuButton onClick={onMobileMenuOpen} />

                    {title && (
                        <div className="hidden sm:block">
                            <h1 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h1>
                            {subtitle && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Center - Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <Search className="h-4 w-4" />
                        <span className="flex-1 text-left text-sm">Search...</span>
                        <kbd className="hidden lg:flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-xs font-mono">
                            <Command className="h-3 w-3" />K
                        </kbd>
                    </button>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Actions */}
                    {actions}

                    {/* Quick Create */}
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow">
                        <Plus className="h-4 w-4" />
                        <span className="hidden lg:inline">Create</span>
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 ring-2 ring-white dark:ring-slate-900" />
                    </button>

                    {/* Theme Toggle */}
                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>

                    {/* User Avatar */}
                    <button className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-white dark:ring-slate-900">
                        U
                    </button>
                </div>
            </div>
        </motion.header>
    )
}
