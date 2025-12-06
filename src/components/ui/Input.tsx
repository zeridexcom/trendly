'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string
    error?: string
    hint?: string
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'filled' | 'ghost'
    gradient?: boolean
}

const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-3 text-sm rounded-xl',
    lg: 'px-5 py-4 text-base rounded-xl',
}

const iconPaddings = {
    sm: { left: 'pl-9', right: 'pr-9' },
    md: { left: 'pl-11', right: 'pr-11' },
    lg: { left: 'pl-12', right: 'pr-12' },
}

export default function Input({
    label,
    error,
    hint,
    icon,
    iconPosition = 'left',
    size = 'md',
    variant = 'default',
    gradient = false,
    className,
    type,
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                {/* Gradient border when focused */}
                {gradient && (
                    <AnimatePresence>
                        {isFocused && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl blur-sm"
                            />
                        )}
                    </AnimatePresence>
                )}

                <div className="relative">
                    {/* Icon left */}
                    {icon && iconPosition === 'left' && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {icon}
                        </div>
                    )}

                    <input
                        type={inputType}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={cn(
                            "relative w-full bg-white dark:bg-slate-900 border transition-all duration-200",
                            "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                            "text-slate-900 dark:text-white",
                            error
                                ? "border-red-300 dark:border-red-700 focus:ring-2 focus:ring-red-500/20"
                                : isFocused
                                    ? "border-violet-400 dark:border-violet-500 ring-2 ring-violet-500/20"
                                    : "border-slate-200 dark:border-slate-700",
                            sizes[size],
                            icon && iconPaddings[size][iconPosition],
                            isPassword && iconPaddings[size]['right'],
                            "focus:outline-none",
                            className
                        )}
                        {...props}
                    />

                    {/* Icon right */}
                    {icon && iconPosition === 'right' && !isPassword && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {icon}
                        </div>
                    )}

                    {/* Password toggle */}
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Error or Hint */}
            {(error || hint) && (
                <p className={cn(
                    "mt-1.5 text-sm",
                    error ? "text-red-500" : "text-slate-500 dark:text-slate-400"
                )}>
                    {error || hint}
                </p>
            )}
        </div>
    )
}

// Search Input
interface SearchInputProps extends Omit<InputProps, 'icon' | 'iconPosition'> {
    onClear?: () => void
}

export function SearchInput({ onClear, value, className, ...props }: SearchInputProps) {
    return (
        <div className="relative">
            <Input
                icon={<Search className="h-5 w-5" />}
                iconPosition="left"
                placeholder="Search..."
                value={value}
                className={cn("pr-10", className)}
                {...props}
            />
            {value && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    hint?: string
    charCount?: boolean
    maxLength?: number
}

export function Textarea({
    label,
    error,
    hint,
    charCount = false,
    maxLength,
    className,
    value,
    ...props
}: TextareaProps) {
    const length = typeof value === 'string' ? value.length : 0

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {label}
                </label>
            )}

            <textarea
                value={value}
                maxLength={maxLength}
                className={cn(
                    "w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border transition-all duration-200",
                    "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                    "text-slate-900 dark:text-white resize-none",
                    error
                        ? "border-red-300 dark:border-red-700 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-200 dark:border-slate-700 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20",
                    "focus:outline-none",
                    className
                )}
                {...props}
            />

            <div className="flex items-center justify-between mt-1.5">
                {(error || hint) && (
                    <p className={cn(
                        "text-sm",
                        error ? "text-red-500" : "text-slate-500 dark:text-slate-400"
                    )}>
                        {error || hint}
                    </p>
                )}
                {charCount && maxLength && (
                    <span className={cn(
                        "text-sm ml-auto",
                        length >= maxLength ? "text-red-500" : "text-slate-400"
                    )}>
                        {length}/{maxLength}
                    </span>
                )}
            </div>
        </div>
    )
}
