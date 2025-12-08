'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Sparkles, ArrowRight, ArrowLeft, Loader2, Check,
    Video, Briefcase, Newspaper, GraduationCap,
    Gamepad2, Tv, DollarSign, Heart, Music, Utensils, Plane,
    Instagram, Youtube, Twitter
} from 'lucide-react'

const USER_TYPES = [
    { id: 'CONTENT_CREATOR', label: 'Content Creator', icon: Video, description: 'YouTube, Instagram, TikTok', emoji: '🎬' },
    { id: 'BUSINESS', label: 'Business / Marketer', icon: Briefcase, description: 'Brand, Agency, E-commerce', emoji: '💼' },
    { id: 'JOURNALIST', label: 'Journalist / Blogger', icon: Newspaper, description: 'News, Media, Publishing', emoji: '📰' },
    { id: 'STUDENT', label: 'Student / Researcher', icon: GraduationCap, description: 'Learning, Academic', emoji: '🎓' },
]

const CONTENT_NICHES = [
    { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Tv, emoji: '🎭' },
    { id: 'TECH', label: 'Technology', icon: Sparkles, emoji: '💻' },
    { id: 'GAMING', label: 'Gaming', icon: Gamepad2, emoji: '🎮' },
    { id: 'FINANCE', label: 'Finance', icon: DollarSign, emoji: '💰' },
    { id: 'HEALTH', label: 'Health', icon: Heart, emoji: '💪' },
    { id: 'EDUCATION', label: 'Education', icon: GraduationCap, emoji: '📚' },
    { id: 'FOOD', label: 'Food', icon: Utensils, emoji: '🍕' },
    { id: 'TRAVEL', label: 'Travel', icon: Plane, emoji: '✈️' },
    { id: 'MUSIC', label: 'Music', icon: Music, emoji: '🎵' },
]

const PLATFORMS = [
    { id: 'YOUTUBE', label: 'YouTube', icon: Youtube, color: '#FF0000', emoji: '▶️' },
    { id: 'INSTAGRAM', label: 'Instagram', icon: Instagram, color: '#E4405F', emoji: '📸' },
    { id: 'TIKTOK', label: 'TikTok', icon: Video, color: '#000000', emoji: '🎵' },
    { id: 'TWITTER', label: 'Twitter/X', icon: Twitter, color: '#1DA1F2', emoji: '🐦' },
]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [userType, setUserType] = useState('')
    const [niche, setNiche] = useState('')
    const [platforms, setPlatforms] = useState<string[]>([])
    const [animateIn, setAnimateIn] = useState(true)
    const [hoveredCard, setHoveredCard] = useState<string | null>(null)

    useEffect(() => {
        setAnimateIn(true)
        const timer = setTimeout(() => setAnimateIn(false), 500)
        return () => clearTimeout(timer)
    }, [step])

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
            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const goToStep = (newStep: number) => {
        setAnimateIn(true)
        setTimeout(() => setStep(newStep), 100)
    }

    const canProceed = () => {
        if (step === 1) return !!userType
        if (step === 2) return !!niche
        if (step === 3) return platforms.length > 0
        return false
    }

    const stepTitles = ['Who are you?', "What's your niche?", 'Which platforms?']
    const stepSubtitles = [
        'Help us understand your role',
        'Select your main content area',
        'Choose where you create content'
    ]

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #14110F 0%, #34312D 50%, #14110F 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Animated background elements */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(217,197,178,0.1) 0%, transparent 70%)',
                animation: 'float 6s ease-in-out infinite',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(217,197,178,0.08) 0%, transparent 70%)',
                animation: 'float 8s ease-in-out infinite reverse',
            }} />

            <div style={{
                width: '100%',
                maxWidth: 700,
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px',
                    animation: animateIn ? 'fadeInDown 0.5s ease-out' : 'none',
                }}>
                    <div style={{
                        width: 70,
                        height: 70,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #D9C5B2, #BFA68F)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 20px 60px rgba(217,197,178,0.3)',
                        animation: 'pulse 2s ease-in-out infinite',
                    }}>
                        <Sparkles size={36} color="#14110F" />
                    </div>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: 800,
                        color: '#D9C5B2',
                        marginBottom: '12px',
                        letterSpacing: '-0.5px',
                    }}>
                        {stepTitles[step - 1]}
                    </h1>
                    <p style={{ color: 'rgba(217,197,178,0.7)', fontSize: '16px' }}>
                        {stepSubtitles[step - 1]} • Step {step} of 3
                    </p>
                </div>

                {/* Progress Bar */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '40px',
                    padding: '0 20px',
                }}>
                    {[1, 2, 3].map(s => (
                        <div
                            key={s}
                            style={{
                                flex: 1,
                                height: 6,
                                borderRadius: 3,
                                background: 'rgba(217,197,178,0.2)',
                                overflow: 'hidden',
                                cursor: s < step ? 'pointer' : 'default',
                            }}
                            onClick={() => s < step && goToStep(s)}
                        >
                            <div style={{
                                height: '100%',
                                borderRadius: 3,
                                background: s <= step ? 'linear-gradient(90deg, #D9C5B2, #BFA68F)' : 'transparent',
                                width: s < step ? '100%' : s === step ? '100%' : '0%',
                                transition: 'width 0.5s ease-out',
                                boxShadow: s <= step ? '0 0 10px rgba(217,197,178,0.5)' : 'none',
                            }} />
                        </div>
                    ))}
                </div>

                {/* Card Container */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '40px',
                    border: '1px solid rgba(217,197,178,0.1)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                    animation: animateIn ? 'fadeInUp 0.5s ease-out' : 'none',
                }}>
                    {/* Step 1: User Type */}
                    {step === 1 && (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {USER_TYPES.map((type, index) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setUserType(type.id)}
                                    onMouseEnter={() => setHoveredCard(type.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        padding: '20px 24px',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        border: userType === type.id
                                            ? '2px solid #D9C5B2'
                                            : '2px solid rgba(217,197,178,0.15)',
                                        background: userType === type.id
                                            ? 'rgba(217,197,178,0.15)'
                                            : hoveredCard === type.id
                                                ? 'rgba(217,197,178,0.08)'
                                                : 'rgba(255,255,255,0.02)',
                                        transform: hoveredCard === type.id || userType === type.id ? 'scale(1.02)' : 'scale(1)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                    }}
                                >
                                    <div style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '14px',
                                        background: userType === type.id
                                            ? 'linear-gradient(135deg, #D9C5B2, #BFA68F)'
                                            : 'rgba(217,197,178,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '28px',
                                        transition: 'all 0.3s ease',
                                    }}>
                                        {type.emoji}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: 600,
                                            fontSize: '17px',
                                            color: userType === type.id ? '#D9C5B2' : 'rgba(217,197,178,0.9)',
                                            marginBottom: '4px',
                                        }}>
                                            {type.label}
                                        </div>
                                        <div style={{ fontSize: '14px', color: 'rgba(217,197,178,0.5)' }}>
                                            {type.description}
                                        </div>
                                    </div>
                                    {userType === type.id && (
                                        <div style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: '#D9C5B2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            animation: 'scaleIn 0.3s ease-out',
                                        }}>
                                            <Check size={16} color="#14110F" strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Niche */}
                    {step === 2 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            {CONTENT_NICHES.map((n, index) => (
                                <button
                                    key={n.id}
                                    type="button"
                                    onClick={() => setNiche(n.id)}
                                    onMouseEnter={() => setHoveredCard(n.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '24px 16px',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        border: niche === n.id
                                            ? '2px solid #D9C5B2'
                                            : '2px solid rgba(217,197,178,0.15)',
                                        background: niche === n.id
                                            ? 'rgba(217,197,178,0.15)'
                                            : hoveredCard === n.id
                                                ? 'rgba(217,197,178,0.08)'
                                                : 'rgba(255,255,255,0.02)',
                                        transform: hoveredCard === n.id || niche === n.id ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                                        position: 'relative',
                                    }}
                                >
                                    <span style={{ fontSize: '36px' }}>{n.emoji}</span>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: niche === n.id ? '#D9C5B2' : 'rgba(217,197,178,0.8)',
                                    }}>
                                        {n.label}
                                    </span>
                                    {niche === n.id && (
                                        <div style={{
                                            position: 'absolute',
                                            top: -8,
                                            right: -8,
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            background: '#D9C5B2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            animation: 'scaleIn 0.3s ease-out',
                                        }}>
                                            <Check size={14} color="#14110F" strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 3: Platforms */}
                    {step === 3 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            {PLATFORMS.map((p, index) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => togglePlatform(p.id)}
                                    onMouseEnter={() => setHoveredCard(p.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '24px',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        border: platforms.includes(p.id)
                                            ? '2px solid #D9C5B2'
                                            : '2px solid rgba(217,197,178,0.15)',
                                        background: platforms.includes(p.id)
                                            ? 'rgba(217,197,178,0.15)'
                                            : hoveredCard === p.id
                                                ? 'rgba(217,197,178,0.08)'
                                                : 'rgba(255,255,255,0.02)',
                                        transform: hoveredCard === p.id || platforms.includes(p.id) ? 'scale(1.03)' : 'scale(1)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                    }}
                                >
                                    <span style={{ fontSize: '32px' }}>{p.emoji}</span>
                                    <span style={{
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        color: platforms.includes(p.id) ? '#D9C5B2' : 'rgba(217,197,178,0.8)',
                                    }}>
                                        {p.label}
                                    </span>
                                    {platforms.includes(p.id) && (
                                        <div style={{
                                            marginLeft: 'auto',
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: '#D9C5B2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            animation: 'scaleIn 0.3s ease-out',
                                        }}>
                                            <Check size={16} color="#14110F" strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => goToStep(step - 1)}
                                style={{
                                    flex: 1,
                                    padding: '18px',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    border: '2px solid rgba(217,197,178,0.3)',
                                    background: 'transparent',
                                    color: '#D9C5B2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <ArrowLeft size={20} /> Back
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={step === 3 ? handleComplete : () => goToStep(step + 1)}
                            disabled={!canProceed() || isLoading}
                            style={{
                                flex: step === 1 ? 1 : 2,
                                padding: '18px',
                                borderRadius: '14px',
                                cursor: canProceed() ? 'pointer' : 'not-allowed',
                                border: 'none',
                                background: canProceed()
                                    ? 'linear-gradient(135deg, #D9C5B2, #BFA68F)'
                                    : 'rgba(217,197,178,0.2)',
                                color: canProceed() ? '#14110F' : 'rgba(217,197,178,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                fontSize: '16px',
                                fontWeight: 700,
                                boxShadow: canProceed() ? '0 20px 40px rgba(217,197,178,0.3)' : 'none',
                                transition: 'all 0.3s ease',
                                transform: canProceed() ? 'translateY(0)' : 'translateY(0)',
                            }}
                        >
                            {isLoading ? (
                                <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</>
                            ) : step === 3 ? (
                                <>Let&apos;s Go! <Sparkles size={20} /></>
                            ) : (
                                <>Continue <ArrowRight size={20} /></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Skip */}
                <p style={{ textAlign: 'center', marginTop: '24px' }}>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        style={{
                            color: 'rgba(217,197,178,0.5)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'color 0.3s ease',
                        }}
                    >
                        Skip for now
                    </button>
                </p>
            </div>

            <style jsx>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 20px 60px rgba(217,197,178,0.3); }
                    50% { transform: scale(1.05); box-shadow: 0 25px 70px rgba(217,197,178,0.4); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
