'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    loading?: boolean
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
    fullWidth?: boolean
    gradient?: string
}

const variants = {
    primary: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:from-violet-600 hover:to-purple-700',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700',
    ghost: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:from-red-600 hover:to-rose-700',
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-green-700',
    outline: 'border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
}

const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2',
    xl: 'px-8 py-4 text-lg rounded-2xl gap-3',
}

const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    gradient,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading

    return (
        <motion.div
            whileHover={{ scale: isDisabled ? 1 : 1.02 }}
            whileTap={{ scale: isDisabled ? 1 : 0.98 }}
            className={cn(fullWidth && "w-full")}
        >
            <button
                disabled={isDisabled}
                className={cn(
                    "inline-flex items-center justify-center font-semibold transition-all duration-300 w-full",
                    variants[variant],
                    sizes[size],
                    isDisabled && "opacity-50 cursor-not-allowed",
                    gradient && `bg-gradient-to-r ${gradient}`,
                    className
                )}
                {...props}
            >
                {loading ? (
                    <>
                        <Loader2 className={cn("animate-spin", iconSizes[size])} />
                        <span>Loading...</span>
                    </>
                ) : (
                    <>
                        {icon && iconPosition === 'left' && (
                            <span className={iconSizes[size]}>{icon}</span>
                        )}
                        {children}
                        {icon && iconPosition === 'right' && (
                            <span className={iconSizes[size]}>{icon}</span>
                        )}
                    </>
                )}
            </button>
        </motion.div>
    )
}

// Icon Button
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'sm' | 'md' | 'lg'
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

const iconButtonSizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
}

export function IconButton({
    children,
    size = 'md',
    variant = 'ghost',
    className,
    disabled,
    ...props
}: IconButtonProps) {
    return (
        <motion.div
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            className="inline-flex"
        >
            <button
                disabled={disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl transition-all duration-200",
                    variants[variant],
                    iconButtonSizes[size],
                    disabled && "opacity-50 cursor-not-allowed",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        </motion.div>
    )
}

// Button Group
export function ButtonGroup({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("inline-flex rounded-xl overflow-hidden shadow-lg", className)}>
            {React.Children.map(children, (child, i) => (
                <div className={cn(i > 0 && "border-l border-white/20")}>
                    {child}
                </div>
            ))}
        </div>
    )
}
