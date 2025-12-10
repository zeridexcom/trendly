'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    Search,
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
    TrendingUp,
    Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserData {
    id: string
    email: string
    name: string
    avatar: string
    industry: string
    location: string
    created_at: string
    updated_at: string
    status: 'active' | 'banned' | 'inactive'
    total_searches: number
    is_admin: boolean
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

const INDUSTRIES = ['ALL', 'TECH', 'HEALTH', 'FITNESS', 'GAMING', 'ENTERTAINMENT', 'FINANCE', 'FOOD', 'TRAVEL', 'EDUCATION', 'BEAUTY']

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned' | 'inactive'>('all')
    const [filterIndustry, setFilterIndustry] = useState<string>('ALL')
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
                setUsers(data.users || [])
                setTotalPages(data.totalPages || 1)
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
            setUsers([])
        } finally {
            setLoading(false)
        }
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
                body: JSON.stringify({ userId, is_admin: true })
            })
            setUsers(users.map(u => u.id === userId ? { ...u, is_admin: true } : u))
        } catch (error) {
            console.error('Failed to make admin:', error)
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-IN', { dateStyle: 'medium' })
    }

    const formatTimeAgo = (dateString: string) => {
        if (!dateString) return 'N/A'
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
                        <Users className="w-8 h-8" />
                        Users
                    </h1>
                    <p className="text-black/60 mt-1 font-medium">Manage all registered users</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{filteredUsers.length} users</span>
                    <button
                        onClick={fetchUsers}
                        className="px-4 py-2 bg-white border-2 border-black font-bold uppercase text-sm shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
                        disabled={loading}
                    >
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <motion.div variants={item} className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-2 border-black pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-[#FFC900] focus:outline-none"
                    />
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="bg-white border-2 border-black px-4 py-2.5 font-bold focus:ring-2 focus:ring-[#FFC900] focus:outline-none min-w-[150px]"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                </select>

                <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="bg-white border-2 border-black px-4 py-2.5 font-bold focus:ring-2 focus:ring-[#FFC900] focus:outline-none min-w-[150px]"
                >
                    {INDUSTRIES.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                    ))}
                </select>
            </motion.div>

            {/* Users Table */}
            <motion.div variants={item} className="bg-white border-4 border-black shadow-brutal overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#FFC900] border-b-4 border-black">
                                <th className="text-left py-4 px-4 text-sm font-black uppercase">User</th>
                                <th className="text-left py-4 px-4 text-sm font-black uppercase">Industry</th>
                                <th className="text-left py-4 px-4 text-sm font-black uppercase">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-black uppercase">Searches</th>
                                <th className="text-left py-4 px-4 text-sm font-black uppercase">Last Active</th>
                                <th className="text-right py-4 px-4 text-sm font-black uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Loader2 className="w-8 h-8 text-[#FF90E8] animate-spin mx-auto" />
                                        <p className="text-black/60 mt-2 font-medium">Loading users...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Users className="w-12 h-12 text-black/30 mx-auto" />
                                        <p className="text-black/60 mt-2 font-medium">No users found</p>
                                        <p className="text-black/40 text-sm">Users will appear here when they sign up</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b-2 border-black/10 hover:bg-[#F5F5F0] transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 border-2 border-black flex items-center justify-center font-black text-black",
                                                    user.is_admin ? "bg-[#FFC900]" : "bg-[#FF90E8]"
                                                )}>
                                                    {user.avatar || user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-black">{user.name || 'No name'}</p>
                                                        {user.is_admin && (
                                                            <span className="px-2 py-0.5 bg-[#FFC900] text-black text-xs font-black border border-black">
                                                                ADMIN
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-black/60">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-2 py-1 bg-[#00F0FF] border border-black text-sm font-bold uppercase">
                                                {user.industry || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={cn(
                                                "px-3 py-1 border border-black text-xs font-black uppercase flex items-center gap-1 w-fit",
                                                user.status === 'active' && "bg-[#B1F202]",
                                                user.status === 'inactive' && "bg-gray-200",
                                                user.status === 'banned' && "bg-[#FF4D4D] text-white"
                                            )}>
                                                {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                                                {user.status === 'banned' && <Ban className="w-3 h-3" />}
                                                {user.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-black/40" />
                                                <span className="font-bold">{user.total_searches || 0}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm text-black/60 font-medium">{formatTimeAgo(user.updated_at)}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setModalOpen(true)
                                                    }}
                                                    className="p-2 bg-white border border-black hover:bg-[#F5F5F0] transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => toggleBanUser(user.id, user.status)}
                                                    className={cn(
                                                        "p-2 border border-black transition-colors",
                                                        user.status === 'banned'
                                                            ? "bg-[#B1F202] hover:bg-[#9ED700]"
                                                            : "bg-[#FF4D4D] text-white hover:bg-[#FF3333]"
                                                    )}
                                                    title={user.status === 'banned' ? 'Unban User' : 'Ban User'}
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                                {!user.is_admin && (
                                                    <button
                                                        onClick={() => makeAdmin(user.id)}
                                                        className="p-2 bg-[#FFC900] border border-black hover:bg-[#FFD93D] transition-colors"
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
                <div className="flex items-center justify-between p-4 border-t-4 border-black bg-[#F5F5F0]">
                    <p className="text-sm font-bold">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 bg-white border-2 border-black hover:bg-[#FFC900] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 bg-white border-2 border-black hover:bg-[#FFC900] disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border-4 border-black w-full max-w-lg p-6 shadow-brutal-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black uppercase">User Details</h3>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="p-2 hover:bg-[#F5F5F0] border border-black"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-16 h-16 border-2 border-black flex items-center justify-center font-black text-2xl",
                                        selectedUser.is_admin ? "bg-[#FFC900]" : "bg-[#FF90E8]"
                                    )}>
                                        {selectedUser.avatar || selectedUser.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black">{selectedUser.name || 'No name'}</h4>
                                        <p className="text-black/60">{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-[#F5F5F0] border-2 border-black">
                                        <div className="flex items-center gap-2 text-black/60 mb-1">
                                            <Briefcase className="w-4 h-4" />
                                            <span className="text-sm font-bold uppercase">Industry</span>
                                        </div>
                                        <p className="font-black">{selectedUser.industry || 'N/A'}</p>
                                    </div>
                                    <div className="p-4 bg-[#F5F5F0] border-2 border-black">
                                        <div className="flex items-center gap-2 text-black/60 mb-1">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm font-bold uppercase">Location</span>
                                        </div>
                                        <p className="font-black">{selectedUser.location || 'N/A'}</p>
                                    </div>
                                    <div className="p-4 bg-[#F5F5F0] border-2 border-black">
                                        <div className="flex items-center gap-2 text-black/60 mb-1">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm font-bold uppercase">Joined</span>
                                        </div>
                                        <p className="font-black">{formatDate(selectedUser.created_at)}</p>
                                    </div>
                                    <div className="p-4 bg-[#F5F5F0] border-2 border-black">
                                        <div className="flex items-center gap-2 text-black/60 mb-1">
                                            <TrendingUp className="w-4 h-4" />
                                            <span className="text-sm font-bold uppercase">Searches</span>
                                        </div>
                                        <p className="font-black">{selectedUser.total_searches || 0}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => toggleBanUser(selectedUser.id, selectedUser.status)}
                                        className={cn(
                                            "flex-1 py-3 font-black uppercase flex items-center justify-center gap-2 border-2 border-black",
                                            selectedUser.status === 'banned'
                                                ? "bg-[#B1F202]"
                                                : "bg-[#FF4D4D] text-white"
                                        )}
                                    >
                                        <Ban className="w-5 h-5" />
                                        {selectedUser.status === 'banned' ? 'Unban User' : 'Ban User'}
                                    </button>
                                    {!selectedUser.is_admin && (
                                        <button
                                            onClick={() => makeAdmin(selectedUser.id)}
                                            className="flex-1 py-3 bg-[#FFC900] border-2 border-black font-black uppercase flex items-center justify-center gap-2"
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
