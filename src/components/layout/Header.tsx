'use client'

import { useState } from 'react'
import { Search, Bell, Mail, ChevronDown } from 'lucide-react'

export default function Header({
    user
}: {
    user: { name: string, email: string, avatarUrl?: string }
}) {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <header className="px-8 py-6 w-full flex items-center justify-between gap-8">
            {/* Search Bar - Large and Spacious */}
            <div className="flex-1 max-w-2xl relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search for trends, ideas, or content..."
                    className="w-full bg-white h-12 pl-12 pr-4 rounded-xl border-none outline-none text-sm font-medium shadow-sm focus:shadow-md transition-shadow placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {/* Icon Buttons */}
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-[#6C5DD3] hover:shadow-md transition-all">
                        <Mail size={20} />
                    </button>
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-[#6C5DD3] hover:shadow-md transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF754C] rounded-full border border-white"></span>
                    </button>
                </div>

                <div className="h-8 w-[1px] bg-gray-200"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#FFE2E5] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jason"
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-[#11142D]">{user.name}</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
