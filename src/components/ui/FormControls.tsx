'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// Select component
interface SelectOption {
    value: string
    label: string
    icon?: React.ReactNode
}

interface SelectProps {
    options: SelectOption[]
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    label?: string
    error?: string
    disabled?: boolean
}

export function Select({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    label,
    error,
    disabled = false,
}: SelectProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    const selected = options.find(o => o.value === value)

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="w-full" ref={ref}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border transition-all",
                        error
                            ? "border-red-300 dark:border-red-700"
                            : isOpen
                                ? "border-violet-400 ring-2 ring-violet-500/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <span className={cn(
                        "flex items-center gap-2",
                        !selected && "text-slate-400"
                    )}>
                        {selected?.icon}
                        {selected?.label || placeholder}
                    </span>
                    <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                    </motion.span>
                </button>

                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value)
                                    setIsOpen(false)
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                                    option.value === value
                                        ? "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                )}
                            >
                                {option.icon}
                                <span className="flex-1">{option.label}</span>
                                {option.value === value && <Check className="h-4 w-4" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>

            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        </div>
    )
}

// Checkbox
interface CheckboxProps {
    checked: boolean
    onChange: (checked: boolean) => void
    label?: string
    description?: string
    disabled?: boolean
}

export function Checkbox({
    checked,
    onChange,
    label,
    description,
    disabled = false,
}: CheckboxProps) {
    return (
        <label className={cn(
            "flex items-start gap-3 cursor-pointer group",
            disabled && "opacity-50 cursor-not-allowed"
        )}>
            <div className="relative flex-shrink-0 mt-0.5">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => !disabled && onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only"
                />
                <motion.div
                    animate={checked ? { scale: [1, 1.1, 1] } : {}}
                    className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                        checked
                            ? "bg-gradient-to-r from-violet-500 to-purple-600 border-violet-500"
                            : "border-slate-300 dark:border-slate-600 group-hover:border-violet-400"
                    )}
                >
                    {checked && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                        >
                            <Check className="h-3 w-3 text-white" />
                        </motion.div>
                    )}
                </motion.div>
            </div>
            {(label || description) && (
                <div>
                    {label && <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>}
                    {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
                </div>
            )}
        </label>
    )
}

// Toggle Switch
interface ToggleProps {
    checked: boolean
    onChange: (checked: boolean) => void
    label?: string
    description?: string
    disabled?: boolean
}

export function Toggle({
    checked,
    onChange,
    label,
    description,
    disabled = false,
}: ToggleProps) {
    return (
        <label className={cn(
            "flex items-center justify-between gap-4 cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
        )}>
            {(label || description) && (
                <div>
                    {label && <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>}
                    {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
                </div>
            )}
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
                className={cn(
                    "relative w-12 h-7 rounded-full transition-colors duration-200",
                    checked
                        ? "bg-gradient-to-r from-violet-500 to-purple-600"
                        : "bg-slate-200 dark:bg-slate-700"
                )}
            >
                <motion.div
                    animate={{ x: checked ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md"
                />
            </button>
        </label>
    )
}

// Radio Group
interface RadioOption {
    value: string
    label: string
    description?: string
}

interface RadioGroupProps {
    options: RadioOption[]
    value: string
    onChange: (value: string) => void
    label?: string
}

export function RadioGroup({
    options,
    value,
    onChange,
    label,
}: RadioGroupProps) {
    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}
            {options.map((option) => (
                <label
                    key={option.value}
                    className="flex items-start gap-3 cursor-pointer group"
                >
                    <div className="relative flex-shrink-0 mt-0.5">
                        <input
                            type="radio"
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="sr-only"
                        />
                        <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            value === option.value
                                ? "border-violet-500"
                                : "border-slate-300 dark:border-slate-600 group-hover:border-violet-400"
                        )}>
                            {value === option.value && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                                />
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{option.label}</p>
                        {option.description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">{option.description}</p>
                        )}
                    </div>
                </label>
            ))}
        </div>
    )
}
