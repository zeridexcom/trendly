'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { SidebarProvider, useSidebar } from '@/components/layout/SidebarContext'
import CommandPalette from '@/components/CommandPalette'
import { cn } from '@/lib/utils'

function DashboardContent({ children }: { children: React.ReactNode }) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const { isCollapsed } = useSidebar()

    return (
        <div className="flex bg-white min-h-screen font-sans antialiased">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Navigation */}
            <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

            {/* Command Palette (⌘K) */}
            <CommandPalette />

            {/* Main Content */}
            <motion.div
                animate={{
                    marginLeft: isCollapsed ? 80 : 256,
                }}
                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                className="flex-1 flex flex-col min-h-screen lg:ml-64"
                style={{ marginLeft: 0 }} // Mobile default
            >
                {/* Sticky Header */}
                <Header onMobileMenuOpen={() => setMobileNavOpen(true)} />

                {/* Main Content Area */}
                <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-[#FAF9F6]">
                    <div className="max-w-[1400px] mx-auto">
                        {/* Breadcrumbs */}
                        <Breadcrumbs />

                        {/* Page Content */}
                        {children}
                    </div>
                </main>
            </motion.div>
        </div>
    )
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <DashboardContent>{children}</DashboardContent>
        </SidebarProvider>
    )
}
