'use client'

import { Bell, Search, Command } from 'lucide-react'

export default function Header({
    user
}: {
    user: { name: string, email: string, avatarUrl?: string }
}) {
    return (
        <header className="h-16 border-b bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10 w-full">

            {/* Search / Command Trigger */}
            <button className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md text-sm border transition-colors w-64 group text-left">
                <Search size={14} className="group-hover:text-foreground" />
                <span className="flex-1">Search...</span>
                <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono bg-background border px-1.5 rounded text-muted-foreground group-hover:text-foreground">
                    <Command size={10} /> K
                </kbd>
            </button>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button className="relative text-muted-foreground hover:text-foreground transition-colors p-1">
                    <Bell size={18} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-background rounded-full"></span>
                </button>

                <div className="w-px h-6 bg-border mx-1"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 border ring-2 ring-background overflow-hidden relative">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jason"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}
