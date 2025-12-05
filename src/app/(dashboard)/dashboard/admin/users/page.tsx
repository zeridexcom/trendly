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
} from 'lucide-react'

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

const roleConfig: Record<string, { label: string; color: string; description: string }> = {
    ADMIN: {
        label: 'Admin',
        color: '#ef4444',
        description: 'Full access to all features and settings',
    },
    MANAGER: {
        label: 'Manager',
        color: '#a855f7',
        description: 'Can manage content, ideas, and team assignments',
    },
    CREATOR: {
        label: 'Creator',
        color: '#3b82f6',
        description: 'Can create and edit assigned content',
    },
    EXECUTIVE: {
        label: 'Executive',
        color: '#22c55e',
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
        <div className="animate-fadeIn">
            {/* Header */}
            <div
                className="flex items-center justify-between flex-wrap gap-4"
                style={{ marginBottom: 'var(--space-6)' }}
            >
                {/* Search */}
                <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
                    <Search
                        size={18}
                        style={{
                            position: 'absolute',
                            left: 'var(--space-4)',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)',
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input"
                        style={{ paddingLeft: 'var(--space-10)' }}
                    />
                </div>

                <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
                    <Plus size={16} />
                    Invite Member
                </button>
            </div>

            {/* Stats */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 'var(--space-4)',
                    marginBottom: 'var(--space-6)',
                }}
            >
                <div className="card" style={{ padding: 'var(--space-4)' }}>
                    <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>
                        {users.filter((u) => u.isActive).length}
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                        Active Members
                    </p>
                </div>
                {Object.entries(roleConfig).map(([key, { label, color }]) => (
                    <div key={key} className="card" style={{ padding: 'var(--space-4)' }}>
                        <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color }}>
                            {users.filter((u) => u.role === key && u.isActive).length}
                        </p>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                            {label}s
                        </p>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="card card-elevated" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <th
                                style={{
                                    padding: 'var(--space-4)',
                                    textAlign: 'left',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 'var(--font-semibold)',
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Member
                            </th>
                            <th
                                style={{
                                    padding: 'var(--space-4)',
                                    textAlign: 'left',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 'var(--font-semibold)',
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Role
                            </th>
                            <th
                                style={{
                                    padding: 'var(--space-4)',
                                    textAlign: 'left',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 'var(--font-semibold)',
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Status
                            </th>
                            <th
                                style={{
                                    padding: 'var(--space-4)',
                                    textAlign: 'left',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 'var(--font-semibold)',
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Joined
                            </th>
                            <th style={{ padding: 'var(--space-4)', width: 50 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                style={{
                                    borderBottom: '1px solid var(--color-border)',
                                    transition: 'background var(--transition-fast)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--color-bg-hover)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent'
                                }}
                            >
                                <td style={{ padding: 'var(--space-4)' }}>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="avatar"
                                            style={{
                                                opacity: user.isActive ? 1 : 0.5,
                                            }}
                                        >
                                            {getInitials(user.name)}
                                        </div>
                                        <div>
                                            <p
                                                style={{
                                                    fontWeight: 'var(--font-medium)',
                                                    opacity: user.isActive ? 1 : 0.5,
                                                }}
                                            >
                                                {user.name}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--color-text-muted)',
                                                }}
                                            >
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: 'var(--space-4)' }}>
                                    <span
                                        className="badge"
                                        style={{
                                            background: `${roleConfig[user.role]?.color}20`,
                                            color: roleConfig[user.role]?.color,
                                            border: `1px solid ${roleConfig[user.role]?.color}`,
                                        }}
                                    >
                                        <Shield size={12} />
                                        {roleConfig[user.role]?.label}
                                    </span>
                                </td>
                                <td style={{ padding: 'var(--space-4)' }}>
                                    <span
                                        className="badge"
                                        style={{
                                            background: user.isActive
                                                ? 'var(--color-success-subtle)'
                                                : 'var(--color-bg-tertiary)',
                                            color: user.isActive ? 'var(--color-success)' : 'var(--color-text-muted)',
                                        }}
                                    >
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td
                                    style={{
                                        padding: 'var(--space-4)',
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--color-text-secondary)',
                                    }}
                                >
                                    {formatDate(user.createdAt)}
                                </td>
                                <td style={{ padding: 'var(--space-4)', position: 'relative' }}>
                                    <button
                                        className="btn btn-ghost btn-icon btn-sm"
                                        onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {activeMenu === user.id && (
                                        <>
                                            <div
                                                style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                                                onClick={() => setActiveMenu(null)}
                                            />
                                            <div
                                                className="dropdown-menu"
                                                style={{ zIndex: 100, right: 0, minWidth: 160 }}
                                            >
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setShowEditModal(true)
                                                        setActiveMenu(null)
                                                    }}
                                                >
                                                    <Edit size={14} />
                                                    Edit Role
                                                </button>
                                                <div className="dropdown-separator" />
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleToggleActive(user.id)}
                                                >
                                                    {user.isActive ? (
                                                        <>
                                                            <UserX size={14} />
                                                            Deactivate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserCheck size={14} />
                                                            Activate
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowInviteModal(false)} />
                    <div className="modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Invite Team Member</h2>
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={() => setShowInviteModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="input-group mb-4">
                                <label className="input-label">Name *</label>
                                <div style={{ position: 'relative' }}>
                                    <User
                                        size={18}
                                        style={{
                                            position: 'absolute',
                                            left: 'var(--space-4)',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--color-text-muted)',
                                        }}
                                    />
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="John Doe"
                                        value={inviteForm.name}
                                        onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                                        style={{ paddingLeft: 'var(--space-10)' }}
                                    />
                                </div>
                            </div>

                            <div className="input-group mb-4">
                                <label className="input-label">Email *</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail
                                        size={18}
                                        style={{
                                            position: 'absolute',
                                            left: 'var(--space-4)',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--color-text-muted)',
                                        }}
                                    />
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="john@company.com"
                                        value={inviteForm.email}
                                        onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                        style={{ paddingLeft: 'var(--space-10)' }}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Role *</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    {Object.entries(roleConfig).map(([key, { label, color, description }]) => (
                                        <label
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 'var(--space-3)',
                                                padding: 'var(--space-3)',
                                                borderRadius: 'var(--radius-md)',
                                                border:
                                                    inviteForm.role === key
                                                        ? `1px solid ${color}`
                                                        : '1px solid var(--color-border)',
                                                background:
                                                    inviteForm.role === key ? `${color}10` : 'transparent',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={key}
                                                checked={inviteForm.role === key}
                                                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                                                style={{ marginTop: 2 }}
                                            />
                                            <div>
                                                <p style={{ fontWeight: 'var(--font-medium)', color }}>
                                                    {label}
                                                </p>
                                                <p
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--color-text-secondary)',
                                                    }}
                                                >
                                                    {description}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowInviteModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                disabled={!inviteForm.name || !inviteForm.email}
                                onClick={handleInvite}
                            >
                                Send Invite
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Edit Role Modal */}
            {showEditModal && selectedUser && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowEditModal(false)} />
                    <div className="modal">
                        <div className="modal-header">
                            <h2 className="modal-title">Edit Role for {selectedUser.name}</h2>
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={() => setShowEditModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {Object.entries(roleConfig).map(([key, { label, color, description }]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleChangeRole(selectedUser.id, key)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 'var(--space-3)',
                                            padding: 'var(--space-4)',
                                            borderRadius: 'var(--radius-md)',
                                            border:
                                                selectedUser.role === key
                                                    ? `1px solid ${color}`
                                                    : '1px solid var(--color-border)',
                                            background:
                                                selectedUser.role === key ? `${color}10` : 'transparent',
                                            textAlign: 'left',
                                            width: '100%',
                                        }}
                                    >
                                        <div>
                                            <p style={{ fontWeight: 'var(--font-medium)', color }}>
                                                {label}
                                                {selectedUser.role === key && ' (Current)'}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--color-text-secondary)',
                                                }}
                                            >
                                                {description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
