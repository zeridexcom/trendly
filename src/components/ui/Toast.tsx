'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    Info,
    Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
    progress?: boolean
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (toast: Omit<Toast, 'id'>) => string
    removeToast: (id: string) => void
    success: (title: string, message?: string) => string
    error: (title: string, message?: string) => string
    warning: (title: string, message?: string) => string
    info: (title: string, message?: string) => string
    loading: (title: string, message?: string) => string
    dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const toastConfig = {
    success: {
        icon: CheckCircle,
        gradient: 'from-emerald-500 to-green-600',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
        iconColor: 'text-emerald-500',
    },
    error: {
        icon: AlertCircle,
        gradient: 'from-red-500 to-rose-600',
        borderColor: 'border-red-200 dark:border-red-800',
        bgColor: 'bg-red-50 dark:bg-red-900/30',
        iconColor: 'text-red-500',
    },
    warning: {
        icon: AlertTriangle,
        gradient: 'from-amber-500 to-orange-600',
        borderColor: 'border-amber-200 dark:border-amber-800',
        bgColor: 'bg-amber-50 dark:bg-amber-900/30',
        iconColor: 'text-amber-500',
    },
    info: {
        icon: Info,
        gradient: 'from-blue-500 to-indigo-600',
        borderColor: 'border-blue-200 dark:border-blue-800',
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        iconColor: 'text-blue-500',
    },
    loading: {
        icon: Loader2,
        gradient: 'from-violet-500 to-purple-600',
        borderColor: 'border-violet-200 dark:border-violet-800',
        bgColor: 'bg-violet-50 dark:bg-violet-900/30',
        iconColor: 'text-violet-500',
    },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = `toast_${Date.now()}`
        const newToast = { ...toast, id }
        setToasts(prev => [...prev, newToast])

        if (toast.type !== 'loading' && toast.duration !== 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id))
            }, toast.duration || 4000)
        }

        return id
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const success = useCallback((title: string, message?: string) =>
        addToast({ type: 'success', title, message }), [addToast])

    const error = useCallback((title: string, message?: string) =>
        addToast({ type: 'error', title, message }), [addToast])

    const warning = useCallback((title: string, message?: string) =>
        addToast({ type: 'warning', title, message }), [addToast])

    const info = useCallback((title: string, message?: string) =>
        addToast({ type: 'info', title, message }), [addToast])

    const loading = useCallback((title: string, message?: string) =>
        addToast({ type: 'loading', title, message, duration: 0 }), [addToast])

    return (
        <ToastContext.Provider value={{
            toasts,
            addToast,
            removeToast,
            success,
            error,
            warning,
            info,
            loading,
            dismiss: removeToast
        }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
                ))}
            </AnimatePresence>
        </div>
    )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const config = toastConfig[toast.type]
    const Icon = config.icon
    const [progress, setProgress] = useState(100)

    React.useEffect(() => {
        if (toast.type === 'loading' || toast.duration === 0) return

        const duration = toast.duration || 4000
        const interval = 50
        const decrement = (interval / duration) * 100

        const timer = setInterval(() => {
            setProgress(prev => Math.max(0, prev - decrement))
        }, interval)

        return () => clearInterval(timer)
    }, [toast.type, toast.duration])

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className={cn(
                "pointer-events-auto relative overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl",
                config.borderColor,
                config.bgColor
            )}
        >
            <div className="flex items-start gap-3 p-4">
                {/* Icon with gradient background */}
                <div className={cn("p-2 rounded-xl bg-gradient-to-br text-white shadow-lg", config.gradient)}>
                    <Icon className={cn("h-5 w-5", toast.type === 'loading' && "animate-spin")} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white">{toast.title}</p>
                    {toast.message && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{toast.message}</p>
                    )}
                </div>

                {/* Dismiss */}
                <button
                    onClick={() => onDismiss(toast.id)}
                    className="p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                >
                    <X className="h-4 w-4 text-slate-400" />
                </button>
            </div>

            {/* Progress bar */}
            {toast.type !== 'loading' && toast.duration !== 0 && (
                <div className="h-1 bg-slate-200/50 dark:bg-slate-700/50">
                    <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: `${progress}%` }}
                        className={cn("h-full bg-gradient-to-r", config.gradient)}
                    />
                </div>
            )}
        </motion.div>
    )
}
