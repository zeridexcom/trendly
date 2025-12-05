'use client'

import { useState } from 'react'
import {
    Plus,
    Search,
    MoreVertical,
    Shield,
    User,
    Mail,
    Edit,
    UserX,
    UserCheck,
    X,
    Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Types
interface TeamMember {
    id: string
    name: string
    email: string
    role: string
    isActive: boolean
    createdAt: string
    avatarUrl?: string
}

// Mock data
const mockUsers: TeamMember[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah@company.com',
        role: 'ADMIN',
        isActive: true,
        createdAt: '2023-06-15T10:00:00Z',
    },
    {
        id: '2',
        name: 'Mike Johnson',
        email: 'mike@company.com',
        role: 'MANAGER',
        isActive: true,
        createdAt: '2023-08-20T14:30:00Z',
    },
    {
        id: '3',
        name: 'Emily Davis',
        email: 'emily@company.com',
        role: 'CREATOR',
        isActive: true,
        createdAt: '2023-09-10T09:15:00Z',
    },
    {
        id: '4',
        name: 'Alex Kim',
        email: 'alex@company.com',
        role: 'CREATOR',
        isActive: true,
        createdAt: '2023-10-05T16:45:00Z',
    },
    {
        id: '5',
        name: 'Jordan Smith',
        email: 'jordan@company.com',
        role: 'EXECUTIVE',
        isActive: true,
        createdAt: '2023-11-12T11:20:00Z',
    },
    {
        id: '6',
        name: 'Taylor Brown',
        email: 'taylor@company.com',
        role: 'CREATOR',
        isActive: false,
        createdAt: '2023-07-01T08:00:00Z',
    },
]

const roleConfig: Record<string, { label: string; color: string; bg: string; description: string }> = {
    ADMIN: {
        label: 'Admin',
        color: 'text-red-600',
        bg: 'bg-red-50 dark:bg-red-900/20',
        description: 'Full access to all features and settings',
    },
    MANAGER: {
        label: 'Manager',
        color: 'text-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        description: 'Can manage content, ideas, and team assignments',
    },
    CREATOR: {
        label: 'Creator',
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        description: 'Can create and edit assigned content',
    },
    EXECUTIVE: {
        label: 'Executive',
        color: 'text-green-600',
        bg: 'bg-green-50 dark:bg-green-900/20',
        description: 'Can schedule and publish content',
    },
}

export default function UsersPage() {
    const [users, setUsers] = useState(mockUsers)
    const [searchQuery, setSearchQuery] = useState('')
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null)
    const [activeMenu, setActiveMenu] = useState<string | null>(null)

    // Form state
    const [inviteForm, setInviteForm] = useState({
        email: '',
        name: '',
        role: 'CREATOR',
    })

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleInvite = () => {
        const newUser: TeamMember = {
            id: Date.now().toString(),
            ...inviteForm,
            isActive: true,
            createdAt: new Date().toISOString(),
        }
        setUsers([...users, newUser])
        setShowInviteModal(false)
        setInviteForm({ email: '', name: '', role: 'CREATOR' })
    }

    const handleToggleActive = (id: string) => {
        setUsers(
            users.map((user) =>
                user.id === id ? { ...user, isActive: !user.isActive } : user
            )
        )
        setActiveMenu(null)
    }

    const handleChangeRole = (id: string, role: string) => {
        setUsers(
            users.map((user) => (user.id === id ? { ...user, role } : user))
        )
        setShowEditModal(false)
        setSelectedUser(null)
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    onClick={() => setShowInviteModal(true)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Invite Member
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="text-2xl font-bold">{users.filter((u) => u.isActive).length}</div>
                    <div className="text-sm text-muted-foreground">Active Members</div>
                </div>
                {Object.entries(roleConfig).map(([key, { label, color }]) => (
                    <div key={key} className="rounded-xl border bg-card p-4 shadow-sm">
                        <div className={cn("text-2xl font-bold", color)}>
                            {users.filter((u) => u.role === key && u.isActive).length}
                        </div>
                        <div className="text-sm text-muted-foreground">{label}s</div>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground uppercase text-xs tracking-wider">Member</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground uppercase text-xs tracking-wider">Role</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground uppercase text-xs tracking-wider">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground uppercase text-xs tracking-wider">Joined</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground uppercase text-xs tracking-wider w-[50px]"></th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted items-center justify-center font-semibold text-muted-foreground",
                                                !user.isActive && "opacity-50"
                                            )}>
                                                {getInitials(user.name)}
                                            </div>
                                            <div className={cn(!user.isActive && "opacity-50")}>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                            roleConfig[user.role]?.bg,
                                            roleConfig[user.role]?.color
                                        )}>
                                            <Shield className="mr-1 h-3 w-3" />
                                            {roleConfig[user.role]?.label}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                                            user.isActive
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                        )}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="p-4 align-middle text-right relative">
                                        <button
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                            onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </button>

                                        {activeMenu === user.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute right-0 z-20 mt-1 w-48 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
                                                >
                                                    <div className="p-1">
                                                        <button
                                                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setShowEditModal(true)
                                                                setActiveMenu(null)
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Role
                                                        </button>
                                                        <div className="my-1 h-px bg-muted" />
                                                        <button
                                                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-red-600 focus:text-red-600"
                                                            onClick={() => handleToggleActive(user.id)}
                                                        >
                                                            {user.isActive ? (
                                                                <>
                                                                    <UserX className="mr-2 h-4 w-4" />
                                                                    Deactivate
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                                    Activate
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setShowInviteModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative z-50 w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg sm:p-10"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-semibold">Invite Team Member</h2>
                                <button className="rounded-full p-1 hover:bg-muted" onClick={() => setShowInviteModal(false)}>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="John Doe"
                                            value={inviteForm.name}
                                            onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="john@company.com"
                                            value={inviteForm.email}
                                            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium leading-none">Role</label>
                                    <div className="grid gap-3">
                                        {Object.entries(roleConfig).map(([key, { label, color, bg, description }]) => (
                                            <div
                                                key={key}
                                                className={cn(
                                                    "cursor-pointer rounded-lg border p-4 transition-all hover:bg-accent",
                                                    inviteForm.role === key ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-input"
                                                )}
                                                onClick={() => setInviteForm({ ...inviteForm, role: key })}
                                            >
                                                <div className="flex items-center justify-between space-x-2">
                                                    <div className="space-y-1">
                                                        <p className={cn("text-sm font-medium leading-none", color)}>{label}</p>
                                                        <p className="text-xs text-muted-foreground">{description}</p>
                                                    </div>
                                                    {inviteForm.role === key && <Check className="h-4 w-4 text-primary" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3">
                                <button className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground" onClick={() => setShowInviteModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 disabled:opacity-50"
                                    disabled={!inviteForm.name || !inviteForm.email}
                                    onClick={handleInvite}
                                >
                                    Send Invite
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal - Simplified for brevity but reusing similar structure */}
            {/* Edit Role Modal */}
            <AnimatePresence>
                {showEditModal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setShowEditModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative z-50 w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold">Edit Role: {selectedUser.name}</h2>
                                <button className="rounded-full p-1 hover:bg-muted" onClick={() => setShowEditModal(false)}>
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(roleConfig).map(([key, { label, color, description }]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleChangeRole(selectedUser.id, key)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left hover:bg-accent",
                                            selectedUser.role === key ? "border-primary bg-primary/5" : "border-input"
                                        )}
                                    >
                                        <div>
                                            <div className={cn("font-medium text-sm", color)}>{label}</div>
                                            <div className="text-xs text-muted-foreground">{description}</div>
                                        </div>
                                        {selectedUser.role === key && <Check className="h-4 w-4 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
