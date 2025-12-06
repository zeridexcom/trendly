'use client'

import React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const themes = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ] as const

    return (
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            {themes.map((t) => (
                <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                        "relative p-2 rounded-lg transition-colors",
                        theme === t.value
                            ? "text-white"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    )}
                    title={t.label}
                >
                    {theme === t.value && (
                        <motion.div
                            layoutId="theme-indicator"
                            className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <t.icon className="h-4 w-4 relative z-10" />
                </button>
            ))}
        </div>
    )
}
