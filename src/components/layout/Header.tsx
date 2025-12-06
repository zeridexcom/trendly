'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, Plus } from 'lucide-react'
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-40 bg-white/90 dark:bg-[#14110F]/90 backdrop-blur-md border-b border-[#E8E8E9] dark:border-[#34312D]"
        >
            <div className="flex items-center justify-between px-4 lg:px-6 h-16">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <MobileMenuButton onClick={onMobileMenuOpen} />

                    {title && (
                        <div className="hidden sm:block">
                            <h1 className="font-semibold text-lg text-[#14110F] dark:text-[#F3F3F4]">{title}</h1>
                            {subtitle && (
                                <p className="text-sm text-[#7E7F83]">{subtitle}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Center - Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D] border border-[#E8E8E9] dark:border-[#34312D] text-[#7E7F83] hover:border-[#D9C5B2] transition-colors">
                        <Search className="w-4 h-4" />
                        <span className="flex-1 text-left text-sm">Search...</span>
                        <kbd className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-[#14110F] text-xs font-mono text-[#7E7F83]">
                            ⌘K
                        </kbd>
                    </button>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {actions}

                    {/* Quick Create */}
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D9C5B2] text-[#14110F] font-medium hover:bg-[#C4B09D] transition-colors">
                        <Plus className="w-4 h-4" />
                        <span className="hidden lg:inline">Create</span>
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors">
                        <Bell className="w-5 h-5 text-[#7E7F83]" />
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D9C5B2] ring-2 ring-white dark:ring-[#14110F]" />
                    </button>

                    {/* Theme Toggle */}
                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>

                    {/* User Avatar */}
                    <button className="w-9 h-9 rounded-full bg-[#D9C5B2] flex items-center justify-center text-[#14110F] text-sm font-semibold">
                        U
                    </button>
                </div>
            </div>
        </motion.header>
    )
}
