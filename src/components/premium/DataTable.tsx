'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, Search, Filter, MoreHorizontal, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Column definition
interface Column<T> {
    key: keyof T | string
    label: string
    sortable?: boolean
    render?: (value: unknown, row: T) => React.ReactNode
    width?: string
}

// Data Table Props
interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    searchable?: boolean
    searchKey?: keyof T
    onRowClick?: (row: T) => void
    loading?: boolean
    emptyMessage?: string
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    searchable = false,
    searchKey,
    onRowClick,
    loading = false,
    emptyMessage = 'No data available',
}: DataTableProps<T>) {
    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

    // Filter data
    const filteredData = searchable && searchKey
        ? data.filter(row => String(row[searchKey]).toLowerCase().includes(search.toLowerCase()))
        : data

    // Sort data
    const sortedData = sortKey
        ? [...filteredData].sort((a, b) => {
            const aVal = String((a as Record<string, unknown>)[sortKey] ?? '')
            const bVal = String((b as Record<string, unknown>)[sortKey] ?? '')
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
            return 0
        })
        : filteredData

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDir('asc')
        }
    }

    return (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Search bar */}
            {searchable && (
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={cn(
                                        "px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider",
                                        col.sortable && "cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                    style={{ width: col.width }}
                                    onClick={() => col.sortable && handleSort(String(col.key))}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && sortKey === String(col.key) && (
                                            sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <AnimatePresence>
                            {sortedData.map((row, i) => (
                                <motion.tr
                                    key={row.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: i * 0.02 }}
                                    onClick={() => onRowClick?.(row)}
                                    className={cn(
                                        "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                                        onRowClick && "cursor-pointer"
                                    )}
                                >
                                    {columns.map((col) => (
                                        <td key={String(col.key)} className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300">
                                            {col.render
                                                ? col.render((row as Record<string, unknown>)[String(col.key)], row)
                                                : String((row as Record<string, unknown>)[String(col.key)] ?? '')
                                            }
                                        </td>
                                    ))}
                                </motion.tr>
                            ))}
                        </AnimatePresence>

                        {sortedData.length === 0 && !loading && (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Status Badge for tables
interface StatusBadgeProps {
    status: 'active' | 'pending' | 'completed' | 'failed' | 'draft'
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const styles = {
        active: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
        pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
        completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        failed: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
        draft: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    }

    const icons = {
        active: <Check className="w-3 h-3" />,
        pending: null,
        completed: <Check className="w-3 h-3" />,
        failed: <X className="w-3 h-3" />,
        draft: null,
    }

    return (
        <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
            styles[status]
        )}>
            {icons[status]}
            {status}
        </span>
    )
}

// User Cell for tables
interface UserCellProps {
    name: string
    email?: string
    avatar?: string
}

export function UserCell({ name, email, avatar }: UserCellProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {avatar || name.charAt(0)}
            </div>
            <div>
                <p className="font-medium text-slate-900 dark:text-white">{name}</p>
                {email && <p className="text-xs text-slate-500">{email}</p>}
            </div>
        </div>
    )
}
