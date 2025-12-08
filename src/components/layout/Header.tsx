'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, Plus } from 'lucide-react'
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
            className="sticky top-0 z-40 bg-white border-b-4 border-black"
        >
            <div className="flex items-center justify-between px-4 lg:px-6 h-20">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <MobileMenuButton onClick={onMobileMenuOpen} />

                    {title && (
                        <div className="hidden sm:block">
                            <h1 className="font-black text-xl italic uppercase tracking-tighter text-black">{title}</h1>
                            {subtitle && (
                                <p className="text-sm font-bold text-gray-500 border-l-2 border-black pl-2">{subtitle}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Center - Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group">
                        <Search className="w-5 h-5 text-black" />
                        <span className="flex-1 text-left text-sm font-bold text-gray-500 group-hover:text-black">Search...</span>
                        <kbd className="hidden lg:flex items-center gap-1 px-2 py-0.5 bg-[#FFC900] border border-black text-xs font-black text-black shadow-[2px_2px_0px_0px_#000]">
                            ⌘K
                        </kbd>
                    </button>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {actions}

                    {/* Quick Create */}
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#FF90E8] border-2 border-black shadow-[4px_4px_0px_0px_#000] text-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                        <Plus className="w-5 h-5" strokeWidth={3} />
                        <span className="hidden lg:inline">Create</span>
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                        <Bell className="w-5 h-5 text-black" />
                        <span className="absolute top-1 right-1 w-3 h-3 bg-[#00F0FF] border-2 border-black" />
                    </button>

                    {/* User Avatar */}
                    <button className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center text-white font-black text-lg hover:bg-[#FFC900] hover:text-black transition-colors">
                        U
                    </button>
                </div>
            </div>
        </motion.header>
    )
}
