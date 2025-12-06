'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// Real-time data hook
export function useRealTimeData<T>(initialData: T, updateFn: (d: T) => T, interval = 5000) {
    const [data, setData] = useState<T>(initialData)
    const [isLive, setIsLive] = useState(false)
    const ref = useRef<NodeJS.Timeout | null>(null)

    const start = useCallback(() => {
        if (ref.current) return
        setIsLive(true)
        ref.current = setInterval(() => setData(prev => updateFn(prev)), interval)
    }, [interval, updateFn])

    const stop = useCallback(() => {
        if (ref.current) clearInterval(ref.current)
        ref.current = null
        setIsLive(false)
    }, [])

    useEffect(() => () => { if (ref.current) clearInterval(ref.current) }, [])
    return { data, isLive, start, stop, setData }
}

// Generate chart data
export const generateChartData = (n: number, max = 100) =>
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, n).map(name => ({
        name, value: Math.floor(Math.random() * max)
    }))

// Generate comparison data
export const generateComparisonData = (n: number) =>
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, n).map(name => ({
        name,
        thisWeek: Math.floor(Math.random() * 5000) + 1000,
        lastWeek: Math.floor(Math.random() * 4000) + 800,
    }))

// Format numbers
export const formatNumber = (n: number) =>
    n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toString()

// Calculate change
export const calcChange = (curr: number, prev: number) =>
    prev === 0 ? 0 : Math.round(((curr - prev) / prev) * 100)
