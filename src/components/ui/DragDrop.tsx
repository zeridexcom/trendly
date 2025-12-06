'use client'

import React, { useState, useCallback } from 'react'
import { motion, Reorder, useDragControls, AnimatePresence } from 'framer-motion'
import { GripVertical, X, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DragItem {
    id: string
    content: React.ReactNode
}

interface DraggableListProps {
    items: DragItem[]
    onReorder: (items: DragItem[]) => void
    onDelete?: (id: string) => void
    className?: string
}

export default function DraggableList({
    items,
    onReorder,
    onDelete,
    className,
}: DraggableListProps) {
    return (
        <Reorder.Group
            axis="y"
            values={items}
            onReorder={onReorder}
            className={cn("space-y-2", className)}
        >
            <AnimatePresence>
                {items.map((item) => (
                    <DraggableItem
                        key={item.id}
                        item={item}
                        onDelete={onDelete}
                    />
                ))}
            </AnimatePresence>
        </Reorder.Group>
    )
}

function DraggableItem({
    item,
    onDelete,
}: {
    item: DragItem
    onDelete?: (id: string) => void
}) {
    const controls = useDragControls()
    const [isDragging, setIsDragging] = useState(false)

    return (
        <Reorder.Item
            value={item}
            dragListener={false}
            dragControls={controls}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            whileDrag={{
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                zIndex: 50
            }}
            className={cn(
                "flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 transition-colors",
                isDragging && "border-violet-400 dark:border-violet-500"
            )}
        >
            {/* Drag Handle */}
            <button
                onPointerDown={(e) => controls.start(e)}
                className="touch-none p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing"
            >
                <GripVertical className="h-5 w-5 text-slate-400" />
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {item.content}
            </div>

            {/* Delete */}
            {onDelete && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(item.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </motion.button>
            )}
        </Reorder.Item>
    )
}

// Simple Card with Swipe to Delete
interface SwipeCardProps {
    children: React.ReactNode
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    leftAction?: { icon: React.ReactNode; color: string; label: string }
    rightAction?: { icon: React.ReactNode; color: string; label: string }
}

export function SwipeCard({
    children,
    onSwipeLeft,
    onSwipeRight,
    leftAction = { icon: <Trash2 className="h-5 w-5" />, color: 'bg-red-500', label: 'Delete' },
    rightAction = { icon: <Check className="h-5 w-5" />, color: 'bg-emerald-500', label: 'Done' },
}: SwipeCardProps) {
    const [dragX, setDragX] = useState(0)

    const threshold = 100

    return (
        <div className="relative overflow-hidden rounded-xl">
            {/* Left Action Background */}
            <div className={cn(
                "absolute inset-y-0 left-0 flex items-center justify-center w-20 text-white",
                leftAction.color
            )}>
                <motion.div
                    animate={{ scale: dragX > threshold ? 1.2 : 1 }}
                    className="flex flex-col items-center"
                >
                    {leftAction.icon}
                    <span className="text-xs mt-1">{leftAction.label}</span>
                </motion.div>
            </div>

            {/* Right Action Background */}
            <div className={cn(
                "absolute inset-y-0 right-0 flex items-center justify-center w-20 text-white",
                rightAction.color
            )}>
                <motion.div
                    animate={{ scale: dragX < -threshold ? 1.2 : 1 }}
                    className="flex flex-col items-center"
                >
                    {rightAction.icon}
                    <span className="text-xs mt-1">{rightAction.label}</span>
                </motion.div>
            </div>

            {/* Card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDrag={(_, info) => setDragX(info.offset.x)}
                onDragEnd={(_, info) => {
                    if (info.offset.x > threshold && onSwipeRight) {
                        onSwipeRight()
                    } else if (info.offset.x < -threshold && onSwipeLeft) {
                        onSwipeLeft()
                    }
                    setDragX(0)
                }}
                animate={{ x: 0 }}
                className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
                {children}
            </motion.div>
        </div>
    )
}
