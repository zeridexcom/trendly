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
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F3F3F4] dark:bg-[#34312D] border border-[#E8E8E9] dark:border-[#34312D]">
            {themes.map((t) => (
                <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                        "relative p-2 rounded-lg transition-all duration-200",
                        theme === t.value
                            ? "text-[#14110F]"
                            : "text-[#7E7F83] hover:text-[#14110F] dark:hover:text-[#F3F3F4]"
                    )}
                    title={t.label}
                >
                    {theme === t.value && (
                        <motion.div
                            layoutId="theme-indicator"
                            className="absolute inset-0 bg-[#D9C5B2] rounded-lg"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                    )}
                    <t.icon className="h-4 w-4 relative z-10" />
                </button>
            ))}
        </div>
    )
}
