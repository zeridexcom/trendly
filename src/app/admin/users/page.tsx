'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Calendar,
    MapPin,
    Briefcase,
    Ban,
    CheckCircle,
    Eye,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    X,
    Shield,
    User,
    TrendingUp,
    AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserData {
    id: string
    email: string
    name: string
    avatar: string
    industry: string
    location: string
    createdAt: string
    lastActive: string
    status: 'active' | 'banned' | 'inactive'
    totalSearches: number
    isAdmin: boolean
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned' | 'inactive'>('all')
    const [filterIndustry, setFilterIndustry] = useState<string>('all')
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchUsers()
    }, [currentPage, filterStatus, filterIndustry])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/admin/users?page=${currentPage}&status=${filterStatus}&industry=${filterIndustry}`)
            const data = await response.json()
            if (data.success) {
                setUsers(data.users)
                setTotalPages(data.totalPages || 1)
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
            // Use mock data for demo
            setUsers(generateMockUsers())
        } finally {
            setLoading(false)
        }
    }

    const generateMockUsers = (): UserData[] => {
        return Array.from({ length: 10 }, (_, i) => ({
            id: `user-${i + 1}`,
            email: `user${i + 1}@example.com`,
            name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Chris Brown'][i % 5],
            avatar: ['J', 'J', 'M', 'S', 'C'][i % 5],
            industry: ['TECH', 'HEALTH', 'GAMING', 'FINANCE', 'ENTERTAINMENT'][i % 5],
            location: ['IN', 'US', 'UK', 'CA', 'AU'][i % 5],
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: ['active', 'active', 'active', 'inactive', 'banned'][i % 5] as any,
            totalSearches: Math.floor(Math.random() * 500),
            isAdmin: i === 0
        }))
    }

    const toggleBanUser = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'banned' ? 'active' : 'banned'
        try {
            await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, status: newStatus })
            })
            setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus as any } : u))
        } catch (error) {
            console.error('Failed to update user status:', error)
        }
    }

    const makeAdmin = async (userId: string) => {
        try {
            await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, isAdmin: true })
            })
            setUsers(users.map(u => u.id === userId ? { ...u, isAdmin: true } : u))
        } catch (error) {
            console.error('Failed to make admin:', error)
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', { dateStyle: 'medium' })
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        return `${diffDays}d ago`
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-[#FFC900]" />
                        Users
                    </h1>
                    <p className="text-[#888] mt-1">Manage all registered users</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-[#888]">{filteredUsers.length} users</span>
                    <button
                        onClick={fetchUsers}
                        className="px-4 py-2 bg-[#1A1A1A] border-2 border-[#333] rounded-lg text-sm font-semibold hover:border-[#FFC900] transition-colors flex items-center gap-2"
                        disabled={loading}
                    >
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <motion.div variants={item} className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111] border-2 border-[#333] rounded-lg pl-10 pr-4 py-2.5 focus:border-[#FFC900] focus:outline-none"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="bg-[#111] border-2 border-[#333] rounded-lg px-4 py-2.5 focus:border-[#FFC900] focus:outline-none min-w-[150px]"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                </select>

                {/* Industry Filter */}
                <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="bg-[#111] border-2 border-[#333] rounded-lg px-4 py-2.5 focus:border-[#FFC900] focus:outline-none min-w-[150px]"
                >
                    <option value="all">All Industries</option>
                    <option value="TECH">Tech</option>
                    <option value="HEALTH">Health</option>
                    <option value="GAMING">Gaming</option>
                    <option value="FINANCE">Finance</option>
                    <option value="ENTERTAINMENT">Entertainment</option>
                </select>
            </motion.div>

            {/* Users Table */}
            <motion.div variants={item} className="bg-[#111] border-2 border-[#222] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#0A0A0A] border-b border-[#333]">
                                <th className="text-left py-4 px-4 text-sm font-bold text-[#888] uppercase">User</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-[#888] uppercase">Industry</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-[#888] uppercase">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-[#888] uppercase">Searches</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-[#888] uppercase">Last Active</th>
                                <th className="text-right py-4 px-4 text-sm font-bold text-[#888] uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <RefreshCw className="w-8 h-8 text-[#FFC900] animate-spin mx-auto" />
                                        <p className="text-[#888] mt-2">Loading users...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Users className="w-8 h-8 text-[#666] mx-auto" />
                                        <p className="text-[#888] mt-2">No users found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-[#222] hover:bg-[#1A1A1A] transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-black",
                                                    user.isAdmin ? "bg-[#FFC900]" : "bg-[#333] text-white"
                                                )}>
                                                    {user.avatar}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold">{user.name}</p>
                                                        {user.isAdmin && (
                                                            <span className="px-2 py-0.5 bg-[#FFC900]/20 text-[#FFC900] text-xs font-bold rounded">
                                                                ADMIN
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-[#888]">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-2 py-1 bg-[#333] rounded text-sm font-semibold">
                                                {user.industry}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-fit",
                                                user.status === 'active' && "bg-green-500/20 text-green-400",
                                                user.status === 'inactive' && "bg-yellow-500/20 text-yellow-400",
                                                user.status === 'banned' && "bg-red-500/20 text-red-400"
                                            )}>
                                                {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                                                {user.status === 'banned' && <Ban className="w-3 h-3" />}
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-[#888]" />
                                                <span>{user.totalSearches}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm text-[#888]">{formatTimeAgo(user.lastActive)}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setModalOpen(true)
                                                    }}
                                                    className="p-2 hover:bg-[#333] rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => toggleBanUser(user.id, user.status)}
                                                    className={cn(
                                                        "p-2 rounded-lg transition-colors",
                                                        user.status === 'banned'
                                                            ? "hover:bg-green-500/20 text-green-400"
                                                            : "hover:bg-red-500/20 text-red-400"
                                                    )}
                                                    title={user.status === 'banned' ? 'Unban User' : 'Ban User'}
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                                {!user.isAdmin && (
                                                    <button
                                                        onClick={() => makeAdmin(user.id)}
                                                        className="p-2 hover:bg-[#FFC900]/20 text-[#FFC900] rounded-lg transition-colors"
                                                        title="Make Admin"
                                                    >
                                                        <Shield className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t border-[#333]">
                    <p className="text-sm text-[#888]">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#FFC900] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#FFC900] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* User Detail Modal */}
            <AnimatePresence>
                {modalOpen && selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#111] border-2 border-[#333] rounded-xl w-full max-w-lg p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black">User Details</h3>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="p-2 hover:bg-[#333] rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl",
                                        selectedUser.isAdmin ? "bg-[#FFC900] text-black" : "bg-[#333] text-white"
                                    )}>
                                        {selectedUser.avatar}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold">{selectedUser.name}</h4>
                                        <p className="text-[#888]">{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-[#1A1A1A] rounded-lg">
                                        <div className="flex items-center gap-2 text-[#888] mb-1">
                                            <Briefcase className="w-4 h-4" />
                                            <span className="text-sm">Industry</span>
                                        </div>
                                        <p className="font-bold">{selectedUser.industry}</p>
                                    </div>
                                    <div className="p-4 bg-[#1A1A1A] rounded-lg">
                                        <div className="flex items-center gap-2 text-[#888] mb-1">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm">Location</span>
                                        </div>
                                        <p className="font-bold">{selectedUser.location}</p>
                                    </div>
                                    <div className="p-4 bg-[#1A1A1A] rounded-lg">
                                        <div className="flex items-center gap-2 text-[#888] mb-1">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">Joined</span>
                                        </div>
                                        <p className="font-bold">{formatDate(selectedUser.createdAt)}</p>
                                    </div>
                                    <div className="p-4 bg-[#1A1A1A] rounded-lg">
                                        <div className="flex items-center gap-2 text-[#888] mb-1">
                                            <TrendingUp className="w-4 h-4" />
                                            <span className="text-sm">Total Searches</span>
                                        </div>
                                        <p className="font-bold">{selectedUser.totalSearches}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => toggleBanUser(selectedUser.id, selectedUser.status)}
                                        className={cn(
                                            "flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2",
                                            selectedUser.status === 'banned'
                                                ? "bg-green-500 text-white"
                                                : "bg-red-500 text-white"
                                        )}
                                    >
                                        <Ban className="w-5 h-5" />
                                        {selectedUser.status === 'banned' ? 'Unban User' : 'Ban User'}
                                    </button>
                                    {!selectedUser.isAdmin && (
                                        <button
                                            onClick={() => makeAdmin(selectedUser.id)}
                                            className="flex-1 py-3 bg-[#FFC900] text-black rounded-lg font-bold flex items-center justify-center gap-2"
                                        >
                                            <Shield className="w-5 h-5" />
                                            Make Admin
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
