'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ArrowDown, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InfiniteScrollProps<T> {
    items: T[]
    renderItem: (item: T, index: number) => React.ReactNode
    loadMore: () => Promise<void>
    hasMore: boolean
    loading?: boolean
    threshold?: number
    className?: string
    emptyMessage?: string
}

export default function InfiniteScroll<T>({
    items,
    renderItem,
    loadMore,
    hasMore,
    loading = false,
    threshold = 200,
    className,
    emptyMessage = 'No items to display',
}: InfiniteScrollProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const handleScroll = useCallback(async () => {
        if (!containerRef.current || !hasMore || isLoadingMore) return

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current

        if (scrollHeight - scrollTop - clientHeight < threshold) {
            setIsLoadingMore(true)
            await loadMore()
            setIsLoadingMore(false)
        }
    }, [hasMore, isLoadingMore, loadMore, threshold])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    return (
        <div ref={containerRef} className={cn("overflow-y-auto", className)}>
            {items.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <p>{emptyMessage}</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {items.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.02 }}
                                >
                                    {renderItem(item, index)}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Loading indicator */}
                    {(loading || isLoadingMore) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center py-8"
                        >
                            <div className="flex items-center gap-3 text-violet-500">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="text-sm font-medium">Loading more...</span>
                            </div>
                        </motion.div>
                    )}

                    {/* End message */}
                    {!hasMore && items.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center py-8"
                        >
                            <span className="text-sm text-slate-400">No more items to load</span>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    )
}

// Pull to Refresh component
interface PullToRefreshProps {
    children: React.ReactNode
    onRefresh: () => Promise<void>
    threshold?: number
}

export function PullToRefresh({
    children,
    onRefresh,
    threshold = 80,
}: PullToRefreshProps) {
    const [pullDistance, setPullDistance] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [startY, setStartY] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleTouchStart = (e: React.TouchEvent) => {
        if (containerRef.current?.scrollTop === 0) {
            setStartY(e.touches[0].clientY)
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (containerRef.current?.scrollTop !== 0 || isRefreshing) return

        const currentY = e.touches[0].clientY
        const diff = currentY - startY

        if (diff > 0) {
            setPullDistance(Math.min(diff * 0.5, threshold + 40))
        }
    }

    const handleTouchEnd = async () => {
        if (pullDistance >= threshold && !isRefreshing) {
            setIsRefreshing(true)
            setPullDistance(threshold)
            await onRefresh()
            setIsRefreshing(false)
        }
        setPullDistance(0)
    }

    const progress = Math.min(pullDistance / threshold, 1)

    return (
        <div className="relative overflow-hidden">
            {/* Pull indicator */}
            <motion.div
                animate={{
                    height: pullDistance,
                    opacity: pullDistance > 10 ? 1 : 0
                }}
                className="absolute top-0 left-0 right-0 flex items-center justify-center bg-gradient-to-b from-violet-500/10 to-transparent overflow-hidden"
            >
                <motion.div
                    animate={{
                        rotate: isRefreshing ? 360 : progress * 180,
                        scale: progress
                    }}
                    transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                    className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-lg"
                >
                    <RefreshCw className={cn(
                        "h-5 w-5",
                        progress >= 1 ? "text-violet-500" : "text-slate-400"
                    )} />
                </motion.div>
            </motion.div>

            {/* Content */}
            <div
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="overflow-y-auto"
                style={{ transform: `translateY(${pullDistance}px)` }}
            >
                {children}
            </div>
        </div>
    )
}

// Load More Button (alternative to infinite scroll)
interface LoadMoreButtonProps {
    onClick: () => void
    loading?: boolean
    hasMore: boolean
}

export function LoadMoreButton({ onClick, loading, hasMore }: LoadMoreButtonProps) {
    if (!hasMore) return null

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 hover:text-violet-600 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
        >
            {loading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    <ArrowDown className="h-4 w-4" />
                    Load More
                </>
            )}
        </motion.button>
    )
}
