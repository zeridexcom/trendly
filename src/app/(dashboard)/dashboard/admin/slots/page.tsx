'use client'

import { useState } from 'react'
import { Plus, Clock, Edit, Trash2, X, Check } from 'lucide-react'

// Types
interface ContentSlot {
    id: string
    name: string
    platform: string
    format: string
    dayOfWeek: number
    timeOfDay: string
    goal?: string
    isActive: boolean
}

// Mock data
const mockSlots: ContentSlot[] = [
    {
        id: '1',
        name: 'Monday Tips',
        platform: 'INSTAGRAM',
        format: 'REEL',
        dayOfWeek: 1,
        timeOfDay: '10:00',
        goal: 'ENGAGEMENT',
        isActive: true,
    },
    {
        id: '2',
        name: 'Wednesday Wisdom',
        platform: 'LINKEDIN',
        format: 'TEXT_POST',
        dayOfWeek: 3,
        timeOfDay: '09:00',
        goal: 'AWARENESS',
        isActive: true,
    },
    {
        id: '3',
        name: 'Friday Fun',
        platform: 'TIKTOK',
        format: 'SHORT',
        dayOfWeek: 5,
        timeOfDay: '18:00',
        goal: 'ENGAGEMENT',
        isActive: true,
    },
    {
        id: '4',
        name: 'Weekend Recap',
        platform: 'INSTAGRAM',
        format: 'CAROUSEL',
        dayOfWeek: 0,
        timeOfDay: '12:00',
        goal: 'ENGAGEMENT',
        isActive: false,
    },
]

const platformIcons: Record<string, string> = {
    INSTAGRAM: '📸',
    TIKTOK: '🎵',
    YOUTUBE: '▶️',
    TWITTER: '𝕏',
    LINKEDIN: '💼',
}

const formatConfig: Record<string, string> = {
    REEL: '🎬 Reel',
    STORY: '📱 Story',
    CAROUSEL: '🎠 Carousel',
    SINGLE_IMAGE: '🖼️ Single Image',
    SHORT: '⚡ Short',
    TEXT_POST: '📝 Text Post',
    THREAD: '🧵 Thread',
    OTHER: '📌 Other',
}

const goalConfig: Record<string, { label: string; color: string }> = {
    AWARENESS: { label: 'Awareness', color: '#3b82f6' },
    ENGAGEMENT: { label: 'Engagement', color: '#22c55e' },
    LEADS: { label: 'Leads', color: '#f59e0b' },
    SALES: { label: 'Sales', color: '#ef4444' },
    OTHER: { label: 'Other', color: '#6b7280' },
}

const daysOfWeek = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
]

export default function SlotsPage() {
    const [slots, setSlots] = useState(mockSlots)
    const [showModal, setShowModal] = useState(false)
    const [editingSlot, setEditingSlot] = useState<ContentSlot | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        platform: 'INSTAGRAM',
        format: 'REEL',
        dayOfWeek: 1,
        timeOfDay: '10:00',
        goal: 'ENGAGEMENT',
    })

    const handleSave = () => {
        if (editingSlot) {
            setSlots(
                slots.map((slot) =>
                    slot.id === editingSlot.id
                        ? { ...slot, ...formData }
                        : slot
                )
            )
        } else {
            const newSlot: ContentSlot = {
                id: Date.now().toString(),
                ...formData,
                isActive: true,
            }
            setSlots([...slots, newSlot])
        }
        setShowModal(false)
        setEditingSlot(null)
        setFormData({
            name: '',
            platform: 'INSTAGRAM',
            format: 'REEL',
            dayOfWeek: 1,
            timeOfDay: '10:00',
            goal: 'ENGAGEMENT',
        })
    }

    const handleEdit = (slot: ContentSlot) => {
        setEditingSlot(slot)
        setFormData({
            name: slot.name,
            platform: slot.platform,
            format: slot.format,
            dayOfWeek: slot.dayOfWeek,
            timeOfDay: slot.timeOfDay,
            goal: slot.goal || 'ENGAGEMENT',
        })
        setShowModal(true)
    }

    const handleDelete = (id: string) => {
        setSlots(slots.filter((slot) => slot.id !== id))
    }

    const handleToggleActive = (id: string) => {
        setSlots(
            slots.map((slot) =>
                slot.id === id ? { ...slot, isActive: !slot.isActive } : slot
            )
        )
    }

    // Group slots by day
    const slotsByDay = daysOfWeek.map((day) => ({
        ...day,
        slots: slots.filter((slot) => slot.dayOfWeek === day.value),
    }))

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div
                className="flex items-center justify-between"
                style={{ marginBottom: 'var(--space-6)' }}
            >
                <div>
                    <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)' }}>
                        Content Slots
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                        Define recurring content slots for your weekly schedule
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingSlot(null)
                        setFormData({
                            name: '',
                            platform: 'INSTAGRAM',
                            format: 'REEL',
                            dayOfWeek: 1,
                            timeOfDay: '10:00',
                            goal: 'ENGAGEMENT',
                        })
                        setShowModal(true)
                    }}
                >
                    <Plus size={16} />
                    Add Slot
                </button>
            </div>

            {/* Weekly View */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: 'var(--space-3)',
                }}
            >
                {slotsByDay.map((day) => (
                    <div
                        key={day.value}
                        className="card"
                        style={{
                            padding: 'var(--space-4)',
                            minHeight: 200,
                        }}
                    >
                        <h4
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-semibold)',
                                color: 'var(--color-text-secondary)',
                                marginBottom: 'var(--space-4)',
                                textAlign: 'center',
                            }}
                        >
                            {day.label}
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            {day.slots.map((slot) => (
                                <div
                                    key={slot.id}
                                    style={{
                                        padding: 'var(--space-3)',
                                        background: slot.isActive
                                            ? 'var(--color-bg-tertiary)'
                                            : 'var(--color-bg-elevated)',
                                        borderRadius: 'var(--radius-md)',
                                        opacity: slot.isActive ? 1 : 0.5,
                                        border: `1px solid ${slot.isActive ? 'var(--color-border)' : 'transparent'}`,
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span style={{ fontSize: '14px' }}>{platformIcons[slot.platform]}</span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                className="btn btn-ghost btn-icon btn-sm"
                                                onClick={() => handleEdit(slot)}
                                                style={{ width: 24, height: 24 }}
                                            >
                                                <Edit size={12} />
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-icon btn-sm"
                                                onClick={() => handleDelete(slot.id)}
                                                style={{ width: 24, height: 24, color: 'var(--color-error)' }}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <p
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 'var(--font-medium)',
                                            marginBottom: 'var(--space-1)',
                                        }}
                                    >
                                        {slot.name}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        <Clock size={10} style={{ display: 'inline', marginRight: 4 }} />
                                        {slot.timeOfDay}
                                    </p>
                                </div>
                            ))}

                            {day.slots.length === 0 && (
                                <div
                                    style={{
                                        padding: 'var(--space-4)',
                                        textAlign: 'center',
                                        color: 'var(--color-text-muted)',
                                        fontSize: 'var(--text-xs)',
                                    }}
                                >
                                    No slots
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Slots List */}
            <div className="card card-elevated" style={{ marginTop: 'var(--space-6)' }}>
                <h3
                    style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-semibold)',
                        marginBottom: 'var(--space-4)',
                    }}
                >
                    All Content Slots
                </h3>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <th
                                style={{
                                    padding: 'var(--space-3)',
                                    textAlign: 'left',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Name
                            </th>
                            <th
                                style={{
                                    padding: 'var(--space-3)',
                                    textAlign: 'left',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Platform
                            </th>
                            <th
                                style={{
                                    padding: 'var(--space-3)',
                                    textAlign: 'left',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Format
                            </th>
                            <th
                                style={{
                                    padding: 'var(--space-3)',
                                    textAlign: 'left',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Schedule
                            </th>
                            <th
                                style={{
                                    padding: 'var(--space-3)',
                                    textAlign: 'left',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Goal
                            </th>
                            <th
                                style={{
                                    padding: 'var(--space-3)',
                                    textAlign: 'left',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {slots.map((slot) => (
                            <tr
                                key={slot.id}
                                style={{ borderBottom: '1px solid var(--color-border)' }}
                            >
                                <td style={{ padding: 'var(--space-3)', fontWeight: 'var(--font-medium)' }}>
                                    {slot.name}
                                </td>
                                <td style={{ padding: 'var(--space-3)' }}>
                                    {platformIcons[slot.platform]} {slot.platform}
                                </td>
                                <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                                    {formatConfig[slot.format]}
                                </td>
                                <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                                    {daysOfWeek.find((d) => d.value === slot.dayOfWeek)?.label} at {slot.timeOfDay}
                                </td>
                                <td style={{ padding: 'var(--space-3)' }}>
                                    {slot.goal && (
                                        <span
                                            className="badge"
                                            style={{
                                                background: `${goalConfig[slot.goal]?.color}20`,
                                                color: goalConfig[slot.goal]?.color,
                                            }}
                                        >
                                            {goalConfig[slot.goal]?.label}
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: 'var(--space-3)' }}>
                                    <button
                                        onClick={() => handleToggleActive(slot.id)}
                                        className="badge"
                                        style={{
                                            cursor: 'pointer',
                                            background: slot.isActive
                                                ? 'var(--color-success-subtle)'
                                                : 'var(--color-bg-tertiary)',
                                            color: slot.isActive ? 'var(--color-success)' : 'var(--color-text-muted)',
                                        }}
                                    >
                                        {slot.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <>
                    <div className="modal-backdrop" onClick={() => setShowModal(false)} />
                    <div className="modal">
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingSlot ? 'Edit Content Slot' : 'New Content Slot'}
                            </h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="input-group mb-4">
                                <label className="input-label">Slot Name *</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g., Monday Tips"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="input-group">
                                    <label className="input-label">Platform</label>
                                    <select
                                        className="input select"
                                        value={formData.platform}
                                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    >
                                        {Object.entries(platformIcons).map(([key, icon]) => (
                                            <option key={key} value={key}>
                                                {icon} {key}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Format</label>
                                    <select
                                        className="input select"
                                        value={formData.format}
                                        onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                                    >
                                        {Object.entries(formatConfig).map(([key, label]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="input-group">
                                    <label className="input-label">Day of Week</label>
                                    <select
                                        className="input select"
                                        value={formData.dayOfWeek}
                                        onChange={(e) =>
                                            setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })
                                        }
                                    >
                                        {daysOfWeek.map((day) => (
                                            <option key={day.value} value={day.value}>
                                                {day.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Time</label>
                                    <input
                                        type="time"
                                        className="input"
                                        value={formData.timeOfDay}
                                        onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Goal</label>
                                <select
                                    className="input select"
                                    value={formData.goal}
                                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                >
                                    {Object.entries(goalConfig).map(([key, { label }]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                disabled={!formData.name}
                                onClick={handleSave}
                            >
                                {editingSlot ? 'Update Slot' : 'Create Slot'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
