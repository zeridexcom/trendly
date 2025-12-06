'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'
import { cn } from '@/lib/utils'

// Color palettes
const gradientColors = {
    violet: { start: '#8b5cf6', end: '#a855f7' },
    blue: { start: '#3b82f6', end: '#60a5fa' },
    cyan: { start: '#06b6d4', end: '#22d3ee' },
    green: { start: '#10b981', end: '#34d399' },
    amber: { start: '#f59e0b', end: '#fbbf24' },
    pink: { start: '#ec4899', end: '#f472b6' },
    red: { start: '#ef4444', end: '#f87171' },
}

const pieColors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444']

// Custom Tooltip
interface CustomTooltipProps {
    active?: boolean
    payload?: Array<{ value: number; name: string; color: string }>
    label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null

    return (
        <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 mb-2">{label}</p>
            {payload.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.value.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">{item.name}</span>
                </div>
            ))}
        </div>
    )
}

// Gradient Area Chart
interface GradientAreaChartProps {
    data: Array<{ name: string; value: number;[key: string]: string | number }>
    dataKey?: string
    color?: keyof typeof gradientColors
    height?: number
    showGrid?: boolean
    showAxis?: boolean
    animate?: boolean
    className?: string
}

export function GradientAreaChart({
    data,
    dataKey = 'value',
    color = 'violet',
    height = 200,
    showGrid = true,
    showAxis = true,
    animate = true,
    className,
}: GradientAreaChartProps) {
    const colors = gradientColors[color]
    const gradientId = `area-gradient-${color}`

    return (
        <motion.div
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            className={cn("w-full", className)}
        >
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors.start} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={colors.end} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    {showGrid && (
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    )}
                    {showAxis && (
                        <>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                            />
                        </>
                    )}
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={colors.start}
                        strokeWidth={2}
                        fill={`url(#${gradientId})`}
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    )
}

// Multi-Line Chart
interface MultiLineChartProps {
    data: Array<{ name: string;[key: string]: string | number }>
    lines: Array<{ dataKey: string; color: keyof typeof gradientColors; label?: string }>
    height?: number
    className?: string
}

export function MultiLineChart({
    data,
    lines,
    height = 250,
    className,
}: MultiLineChartProps) {
    return (
        <div className={cn("w-full", className)}>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            type="monotone"
                            dataKey={line.dataKey}
                            name={line.label || line.dataKey}
                            stroke={gradientColors[line.color].start}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: gradientColors[line.color].start }}
                            animationDuration={1500 + i * 200}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

// Gradient Bar Chart
interface GradientBarChartProps {
    data: Array<{ name: string; value: number }>
    color?: keyof typeof gradientColors
    height?: number
    horizontal?: boolean
    className?: string
}

export function GradientBarChart({
    data,
    color = 'violet',
    height = 200,
    horizontal = false,
    className,
}: GradientBarChartProps) {
    const colors = gradientColors[color]
    const gradientId = `bar-gradient-${color}`

    return (
        <div className={cn("w-full", className)}>
            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={data}
                    layout={horizontal ? 'vertical' : 'horizontal'}
                    margin={{ top: 10, right: 10, left: horizontal ? 60 : 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors.start} stopOpacity={1} />
                            <stop offset="95%" stopColor={colors.end} stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={!horizontal} vertical={horizontal} />
                    {horizontal ? (
                        <>
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        </>
                    ) : (
                        <>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                        </>
                    )}
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="value"
                        fill={`url(#${gradientId})`}
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

// Donut Chart
interface DonutChartProps {
    data: Array<{ name: string; value: number }>
    height?: number
    innerRadius?: number
    outerRadius?: number
    showLabels?: boolean
    centerLabel?: string
    centerValue?: string | number
    className?: string
}

export function DonutChart({
    data,
    height = 200,
    innerRadius = 60,
    outerRadius = 80,
    showLabels = true,
    centerLabel,
    centerValue,
    className,
}: DonutChartProps) {
    return (
        <div className={cn("w-full relative", className)}>
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        paddingAngle={2}
                        dataKey="value"
                        animationDuration={1500}
                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={pieColors[index % pieColors.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    {showLabels && <Legend />}
                </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            {(centerLabel || centerValue) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    {centerValue && (
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            {centerValue}
                        </span>
                    )}
                    {centerLabel && (
                        <span className="text-xs text-slate-500">{centerLabel}</span>
                    )}
                </div>
            )}
        </div>
    )
}

// Sparkline (mini chart)
interface SparklineProps {
    data: number[]
    color?: keyof typeof gradientColors
    width?: number
    height?: number
    showDot?: boolean
}

export function Sparkline({
    data,
    color = 'violet',
    width = 100,
    height = 30,
    showDot = true,
}: SparklineProps) {
    const chartData = data.map((value, i) => ({ name: i, value }))
    const colors = gradientColors[color]

    return (
        <ResponsiveContainer width={width} height={height}>
            <LineChart data={chartData}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={colors.start}
                    strokeWidth={2}
                    dot={showDot ? { r: 0 } : false}
                    activeDot={showDot ? { r: 4, fill: colors.start } : false}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

// Mini Bar (inline spark bar)
interface MiniBarProps {
    data: number[]
    color?: keyof typeof gradientColors
    width?: number
    height?: number
}

export function MiniBar({
    data,
    color = 'violet',
    width = 80,
    height = 24,
}: MiniBarProps) {
    const max = Math.max(...data)
    const colors = gradientColors[color]

    return (
        <div className="flex items-end gap-0.5" style={{ width, height }}>
            {data.map((value, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${(value / max) * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="flex-1 rounded-t"
                    style={{ backgroundColor: colors.start }}
                />
            ))}
        </div>
    )
}
