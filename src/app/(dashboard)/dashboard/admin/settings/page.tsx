'use client'

import { useState } from 'react'
import { Save, Building2, Palette, Globe, Check } from 'lucide-react'

const platformOptions = [
    { id: 'INSTAGRAM', label: 'Instagram', icon: '📸' },
    { id: 'TIKTOK', label: 'TikTok', icon: '🎵' },
    { id: 'YOUTUBE', label: 'YouTube', icon: '▶️' },
    { id: 'TWITTER', label: 'X (Twitter)', icon: '𝕏' },
    { id: 'LINKEDIN', label: 'LinkedIn', icon: '💼' },
]

const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-focused' },
    { value: 'casual', label: 'Casual', description: 'Friendly and relaxed' },
    { value: 'playful', label: 'Playful', description: 'Fun and engaging' },
    { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' },
    { value: 'educational', label: 'Educational', description: 'Informative and teaching-focused' },
]

export default function SettingsPage() {
    const [saved, setSaved] = useState(false)
    const [settings, setSettings] = useState({
        brandName: 'Acme Inc.',
        brandDescription:
            'We help businesses grow with innovative solutions and exceptional service.',
        brandTone: 'professional',
        defaultPlatforms: ['INSTAGRAM', 'LINKEDIN'],
        logoUrl: '',
    })

    const handleSave = () => {
        // Simulate save
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const togglePlatform = (platformId: string) => {
        setSettings((prev) => ({
            ...prev,
            defaultPlatforms: prev.defaultPlatforms.includes(platformId)
                ? prev.defaultPlatforms.filter((p) => p !== platformId)
                : [...prev.defaultPlatforms, platformId],
        }))
    }

    return (
        <div className="animate-fadeIn" style={{ maxWidth: 800 }}>
            {/* Header */}
            <div
                className="flex items-center justify-between"
                style={{ marginBottom: 'var(--space-8)' }}
            >
                <div>
                    <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)' }}>
                        Workspace Settings
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                        Configure your brand and workspace preferences
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleSave}>
                    {saved ? (
                        <>
                            <Check size={16} />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Brand Info Section */}
            <div className="card card-elevated" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="flex items-center gap-3 mb-6">
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(99, 102, 241, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Building2 size={20} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                        <h3 style={{ fontWeight: 'var(--font-semibold)' }}>Brand Information</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                            This information helps AI generate relevant content
                        </p>
                    </div>
                </div>

                <div className="input-group mb-4">
                    <label className="input-label">Brand Name</label>
                    <input
                        type="text"
                        className="input"
                        value={settings.brandName}
                        onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                        placeholder="Your brand name"
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Brand Description</label>
                    <textarea
                        className="input"
                        value={settings.brandDescription}
                        onChange={(e) => setSettings({ ...settings, brandDescription: e.target.value })}
                        placeholder="Describe what your brand does and who it serves..."
                        rows={3}
                    />
                    <p
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-text-muted)',
                            marginTop: 'var(--space-2)',
                        }}
                    >
                        Used by AI to understand your brand context when generating content
                    </p>
                </div>
            </div>

            {/* Tone Section */}
            <div className="card card-elevated" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="flex items-center gap-3 mb-6">
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(234, 179, 8, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Palette size={20} style={{ color: '#eab308' }} />
                    </div>
                    <div>
                        <h3 style={{ fontWeight: 'var(--font-semibold)' }}>Brand Voice & Tone</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                            Set the default tone for AI-generated content
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: 'var(--space-3)',
                    }}
                >
                    {toneOptions.map((tone) => (
                        <button
                            key={tone.value}
                            onClick={() => setSettings({ ...settings, brandTone: tone.value })}
                            style={{
                                padding: 'var(--space-4)',
                                borderRadius: 'var(--radius-lg)',
                                border:
                                    settings.brandTone === tone.value
                                        ? '2px solid var(--color-primary)'
                                        : '1px solid var(--color-border)',
                                background:
                                    settings.brandTone === tone.value
                                        ? 'var(--color-primary-subtle)'
                                        : 'var(--color-bg-tertiary)',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: 'var(--font-medium)',
                                    marginBottom: 'var(--space-1)',
                                    color:
                                        settings.brandTone === tone.value
                                            ? 'var(--color-primary)'
                                            : 'var(--color-text-primary)',
                                }}
                            >
                                {tone.label}
                            </p>
                            <p
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                {tone.description}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Default Platforms Section */}
            <div className="card card-elevated">
                <div className="flex items-center gap-3 mb-6">
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(34, 197, 94, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Globe size={20} style={{ color: '#22c55e' }} />
                    </div>
                    <div>
                        <h3 style={{ fontWeight: 'var(--font-semibold)' }}>Default Platforms</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                            Pre-select these platforms when creating new content
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {platformOptions.map((platform) => {
                        const isSelected = settings.defaultPlatforms.includes(platform.id)
                        return (
                            <button
                                key={platform.id}
                                onClick={() => togglePlatform(platform.id)}
                                className="btn"
                                style={{
                                    padding: 'var(--space-3) var(--space-4)',
                                    background: isSelected
                                        ? 'var(--color-primary-subtle)'
                                        : 'var(--color-bg-tertiary)',
                                    border: isSelected
                                        ? '1px solid var(--color-primary)'
                                        : '1px solid var(--color-border)',
                                    color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>{platform.icon}</span>
                                {platform.label}
                                {isSelected && <Check size={14} />}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
