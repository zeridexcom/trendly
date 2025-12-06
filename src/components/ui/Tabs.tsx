'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Tab {
    id: string
    label: string
    icon?: React.ReactNode
    badge?: number
}

interface TabsProps {
    tabs: Tab[]
    activeTab: string
    onChange: (id: string) => void
    variant?: 'default' | 'pills' | 'underline'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
}

const variants = {
    default: {
        container: 'bg-slate-100 dark:bg-slate-800 p-1 rounded-xl',
        tab: 'rounded-lg',
        active: 'bg-white dark:bg-slate-900 shadow-md',
        inactive: 'hover:bg-slate-50 dark:hover:bg-slate-700/50',
    },
    pills: {
        container: 'gap-2',
        tab: 'rounded-full',
        active: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25',
        inactive: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700',
    },
    underline: {
        container: 'border-b border-slate-200 dark:border-slate-700',
        tab: '',
        active: 'text-violet-600 dark:text-violet-400',
        inactive: 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300',
    },
}

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
}

export default function Tabs({
    tabs,
    activeTab,
    onChange,
    variant = 'default',
    size = 'md',
    fullWidth = false,
}: TabsProps) {
    const styles = variants[variant]

    return (
        <div className={cn("flex", styles.container, fullWidth && "w-full")}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab

                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "relative flex items-center justify-center gap-2 font-medium transition-all duration-200",
                            sizes[size],
                            styles.tab,
                            fullWidth && "flex-1",
                            variant !== 'underline' && (isActive ? styles.active : styles.inactive),
                            variant === 'underline' && (isActive ? styles.active : styles.inactive)
                        )}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>

                        {tab.badge !== undefined && tab.badge > 0 && (
                            <span className={cn(
                                "min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center",
                                isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400"
                            )}>
                                {tab.badge > 99 ? '99+' : tab.badge}
                            </span>
                        )}

                        {/* Underline indicator */}
                        {variant === 'underline' && isActive && (
                            <motion.div
                                layoutId="tab-indicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-600"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                )
            })}
        </div>
    )
}

// Tab Panel
interface TabPanelProps {
    value: string
    activeValue: string
    children: React.ReactNode
}

export function TabPanel({ value, activeValue, children }: TabPanelProps) {
    if (value !== activeValue) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.div>
    )
}
