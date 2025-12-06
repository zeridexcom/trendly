'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    description?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    showClose?: boolean
    gradient?: string
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
}

export default function Modal({
    isOpen,
    onClose,
    children,
    title,
    description,
    size = 'md',
    showClose = true,
    gradient = 'from-violet-500 to-purple-600',
}: ModalProps) {
    // Close on escape
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                        className={cn(
                            "relative w-full overflow-hidden rounded-3xl shadow-2xl",
                            sizeClasses[size]
                        )}
                    >
                        {/* Glassmorphism background */}
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl" />

                        {/* Gradient accent line */}
                        <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", gradient)} />

                        {/* Decorative gradient orb */}
                        <div className={cn(
                            "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 bg-gradient-to-br",
                            gradient
                        )} />
                        <div className={cn(
                            "absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-20 bg-gradient-to-br",
                            gradient
                        )} />

                        {/* Content */}
                        <div className="relative">
                            {/* Header */}
                            {(title || showClose) && (
                                <div className="flex items-start justify-between p-6 pb-0">
                                    <div>
                                        {title && (
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {title}
                                            </h2>
                                        )}
                                        {description && (
                                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                                {description}
                                            </p>
                                        )}
                                    </div>
                                    {showClose && (
                                        <button
                                            onClick={onClose}
                                            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <X className="h-5 w-5 text-slate-400" />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Body */}
                            <div className="p-6">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

// Confirm Modal preset
interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'default'
    loading?: boolean
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    loading = false,
}: ConfirmModalProps) {
    const variantStyles = {
        danger: {
            gradient: 'from-red-500 to-rose-600',
            button: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/25',
        },
        warning: {
            gradient: 'from-amber-500 to-orange-600',
            button: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/25',
        },
        default: {
            gradient: 'from-violet-500 to-purple-600',
            button: 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-violet-500/25',
        },
    }

    const styles = variantStyles[variant]

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" gradient={styles.gradient}>
            <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={cn(
                            "flex-1 px-4 py-3 rounded-xl font-semibold text-white shadow-lg transition-all disabled:opacity-50",
                            styles.button
                        )}
                    >
                        {loading ? 'Loading...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
