'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const routeLabels: Record<string, string> = {
    'dashboard': 'Dashboard',
    'trends': 'Trends',
    'ideas': 'Ideas',
    'scripts': 'Scripts',
    'virality': 'Virality Score',
    'comments': 'Comments',
    'pillars': 'Content Pillars',
    'best-time': 'Best Time',
    'competitors': 'Competitors',
    'repurpose': 'Repurpose',
    'workflows': 'Workflows',
    'scheduler': 'Auto-Scheduler',
    'activity': 'Activity Feed',
    'calendar': 'Calendar',
    'admin': 'Admin',
    'users': 'Team',
    'settings': 'Settings',
}

export default function Breadcrumbs() {
    const pathname = usePathname()

    if (!pathname || pathname === '/dashboard') return null

    const segments = pathname.split('/').filter(Boolean)

    // Build breadcrumb items
    const items = segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/')
        const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
        const isLast = index === segments.length - 1

        return { path, label, isLast }
    })

    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-sm mb-6"
        >
            <Link
                href="/dashboard"
                className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
                <Home className="h-4 w-4" />
            </Link>

            {items.map((item, i) => (
                <React.Fragment key={item.path}>
                    <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                    {item.isLast ? (
                        <span className="font-medium text-slate-900 dark:text-white">
                            {item.label}
                        </span>
                    ) : (
                        <Link
                            href={item.path}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            {item.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </motion.nav>
    )
}
