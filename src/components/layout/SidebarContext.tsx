'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SidebarContextType {
    isCollapsed: boolean
    setIsCollapsed: (collapsed: boolean) => void
    toggle: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Load preference from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('trendly-sidebar-collapsed')
        if (saved === 'true') setIsCollapsed(true)
    }, [])

    // Save preference
    useEffect(() => {
        localStorage.setItem('trendly-sidebar-collapsed', String(isCollapsed))
    }, [isCollapsed])

    const toggle = () => setIsCollapsed(prev => !prev)

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, toggle }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}
