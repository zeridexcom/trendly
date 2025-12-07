'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Sparkles, ArrowRight, ArrowLeft, Loader2,
    Video, Briefcase, Newspaper, GraduationCap,
    Gamepad2, Tv, DollarSign, Heart, Music, Utensils, Plane,
    Instagram, Youtube, Twitter
} from 'lucide-react'

const USER_TYPES = [
    { id: 'CONTENT_CREATOR', label: 'Content Creator', icon: Video, description: 'YouTube, Instagram, TikTok' },
    { id: 'BUSINESS', label: 'Business / Marketer', icon: Briefcase, description: 'Brand, Agency, E-commerce' },
    { id: 'JOURNALIST', label: 'Journalist / Blogger', icon: Newspaper, description: 'News, Media, Publishing' },
    { id: 'STUDENT', label: 'Student / Researcher', icon: GraduationCap, description: 'Learning, Academic' },
]

const CONTENT_NICHES = [
    { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Tv },
    { id: 'TECH', label: 'Technology', icon: Sparkles },
    { id: 'GAMING', label: 'Gaming', icon: Gamepad2 },
    { id: 'FINANCE', label: 'Finance', icon: DollarSign },
    { id: 'HEALTH', label: 'Health & Fitness', icon: Heart },
    { id: 'EDUCATION', label: 'Education', icon: GraduationCap },
    { id: 'FOOD', label: 'Food & Cooking', icon: Utensils },
    { id: 'TRAVEL', label: 'Travel', icon: Plane },
    { id: 'MUSIC', label: 'Music', icon: Music },
]

const PLATFORMS = [
    { id: 'YOUTUBE', label: 'YouTube', icon: Youtube },
    { id: 'INSTAGRAM', label: 'Instagram', icon: Instagram },
    { id: 'TIKTOK', label: 'TikTok', icon: Video },
    { id: 'TWITTER', label: 'Twitter/X', icon: Twitter },
]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [userType, setUserType] = useState('')
    const [niche, setNiche] = useState('')
    const [platforms, setPlatforms] = useState<string[]>([])

    const togglePlatform = (platformId: string) => {
        setPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(p => p !== platformId)
                : [...prev, platformId]
        )
    }

    const handleComplete = async () => {
        setIsLoading(true)
        try {
            // For now, just redirect to dashboard
            // Preferences will be saved when we have the API endpoint
            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const canProceed = () => {
        if (step === 1) return !!userType
        if (step === 2) return !!niche
        if (step === 3) return platforms.length > 0
        return false
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ width: '100%', maxWidth: 600 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}>
                        <Sparkles size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                        Personalize Your Experience
                    </h1>
                    <p style={{ color: '#6b7280' }}>
                        Step {step} of 3 - {step === 1 ? 'Who are you?' : step === 2 ? "What's your niche?" : 'Which platforms?'}
                    </p>
                </div>

                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{
                            flex: 1, height: 4, borderRadius: 2,
                            background: s <= step ? '#6366f1' : '#e5e7eb',
                            transition: 'background 0.3s',
                        }} />
                    ))}
                </div>

                {/* Card */}
                <div style={{ background: 'var(--color-bg-elevated, #fff)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    {/* Step 1: User Type */}
                    {step === 1 && (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {USER_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setUserType(type.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                                        borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                                        border: userType === type.id ? '2px solid #6366f1' : '2px solid #e5e7eb',
                                        background: userType === type.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                                    }}
                                >
                                    <div style={{ width: 48, height: 48, borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <type.icon size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{type.label}</div>
                                        <div style={{ fontSize: '14px', color: '#6b7280' }}>{type.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Niche */}
                    {step === 2 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            {CONTENT_NICHES.map(n => (
                                <button
                                    key={n.id}
                                    type="button"
                                    onClick={() => setNiche(n.id)}
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px',
                                        borderRadius: '12px', cursor: 'pointer',
                                        border: niche === n.id ? '2px solid #6366f1' : '2px solid #e5e7eb',
                                        background: niche === n.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                                    }}
                                >
                                    <n.icon size={28} />
                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{n.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 3: Platforms */}
                    {step === 3 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            {PLATFORMS.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => togglePlatform(p.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                                        borderRadius: '12px', cursor: 'pointer',
                                        border: platforms.includes(p.id) ? '2px solid #6366f1' : '2px solid #e5e7eb',
                                        background: platforms.includes(p.id) ? 'rgba(99,102,241,0.1)' : 'transparent',
                                    }}
                                >
                                    <p.icon size={24} />
                                    <span style={{ fontWeight: 500 }}>{p.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                style={{
                                    flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer',
                                    border: '2px solid #e5e7eb', background: 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                }}
                            >
                                <ArrowLeft size={18} /> Back
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={step === 3 ? handleComplete : () => setStep(step + 1)}
                            disabled={!canProceed() || isLoading}
                            style={{
                                flex: 1, padding: '16px', borderRadius: '12px', cursor: canProceed() ? 'pointer' : 'not-allowed',
                                border: 'none', background: canProceed() ? '#6366f1' : '#e5e7eb', color: canProceed() ? 'white' : '#9ca3af',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600,
                            }}
                        >
                            {isLoading ? (
                                <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                            ) : step === 3 ? (
                                <>Complete Setup <Sparkles size={18} /></>
                            ) : (
                                <>Continue <ArrowRight size={18} /></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Skip Option */}
                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Skip for now
                    </button>
                </p>
            </div>
        </div>
    )
}
