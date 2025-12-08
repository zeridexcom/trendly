'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Sparkles, ArrowRight, ArrowLeft, Loader2, Check,
    Target, TrendingUp, Lightbulb, Users,
    Zap, Clock, Rocket, Crown,
    Video, FileText, Image, Mic
} from 'lucide-react'

// Step 1: What's your main goal?
const GOALS = [
    { id: 'GROW_AUDIENCE', label: 'Grow My Audience', icon: TrendingUp, description: 'Get more followers and subscribers', emoji: '📈' },
    { id: 'CONTENT_IDEAS', label: 'Find Content Ideas', icon: Lightbulb, description: 'Never run out of viral ideas', emoji: '�' },
    { id: 'STAY_RELEVANT', label: 'Stay Trend-Ready', icon: Zap, description: 'Jump on trends before they peak', emoji: '⚡' },
    { id: 'BEAT_COMPETITION', label: 'Beat Competition', icon: Target, description: 'Outperform others in my niche', emoji: '�' },
]

// Step 2: What's your current audience size?
const AUDIENCE_SIZES = [
    { id: 'STARTING', label: 'Just Starting', description: '0 - 1,000 followers', emoji: '�', color: '#10B981' },
    { id: 'GROWING', label: 'Growing', description: '1K - 10K followers', emoji: '🌿', color: '#3B82F6' },
    { id: 'ESTABLISHED', label: 'Established', description: '10K - 100K followers', emoji: '�', color: '#8B5CF6' },
    { id: 'INFLUENCER', label: 'Influencer', description: '100K+ followers', emoji: '�', color: '#F59E0B' },
]

// Step 3: What type of content do you create?
const CONTENT_TYPES = [
    { id: 'SHORT_VIDEO', label: 'Short Videos', description: 'Reels, TikToks, Shorts', icon: Video, emoji: '�' },
    { id: 'LONG_VIDEO', label: 'Long Videos', description: 'YouTube, Vlogs, Tutorials', icon: Video, emoji: '📹' },
    { id: 'WRITTEN', label: 'Written Content', description: 'Blogs, Threads, Articles', icon: FileText, emoji: '✍️' },
    { id: 'VISUAL', label: 'Visual Content', description: 'Photos, Carousels, Graphics', icon: Image, emoji: '📸' },
    { id: 'AUDIO', label: 'Audio Content', description: 'Podcasts, Spaces, Audio', icon: Mic, emoji: '�️' },
    { id: 'MIXED', label: 'Mix of Everything', description: 'I do it all!', icon: Sparkles, emoji: '🌟' },
]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [goal, setGoal] = useState('')
    const [audienceSize, setAudienceSize] = useState('')
    const [contentType, setContentType] = useState('')
    const [animateIn, setAnimateIn] = useState(true)
    const [hoveredCard, setHoveredCard] = useState<string | null>(null)

    useEffect(() => {
        setAnimateIn(true)
        const timer = setTimeout(() => setAnimateIn(false), 500)
        return () => clearTimeout(timer)
    }, [step])

    const handleComplete = async () => {
        setIsLoading(true)
        try {
            // Here you would save preferences to database
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
        if (step === 1) return !!goal
        if (step === 2) return !!audienceSize
        if (step === 3) return !!contentType
        return false
    }

    const stepData = [
        { title: "What's your main goal?", subtitle: "We'll customize trends for your success" },
        { title: "Where are you in your journey?", subtitle: "We'll match insights to your level" },
        { title: "What content do you create?", subtitle: "We'll find trends that fit your style" },
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
            {/* Animated background */}
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
                        {step === 1 ? <Target size={36} color="#14110F" /> :
                            step === 2 ? <Users size={36} color="#14110F" /> :
                                <Rocket size={36} color="#14110F" />}
                    </div>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 800,
                        color: '#D9C5B2',
                        marginBottom: '12px',
                    }}>
                        {stepData[step - 1].title}
                    </h1>
                    <p style={{ color: 'rgba(217,197,178,0.7)', fontSize: '16px' }}>
                        {stepData[step - 1].subtitle}
                    </p>
                </div>

                {/* Progress */}
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
                                width: s <= step ? '100%' : '0%',
                                transition: 'width 0.5s ease-out',
                                boxShadow: s <= step ? '0 0 10px rgba(217,197,178,0.5)' : 'none',
                            }} />
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '40px',
                    border: '1px solid rgba(217,197,178,0.1)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                    animation: animateIn ? 'fadeInUp 0.5s ease-out' : 'none',
                }}>
                    {/* Step 1: Goals */}
                    {step === 1 && (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {GOALS.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setGoal(item.id)}
                                    onMouseEnter={() => setHoveredCard(item.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        padding: '20px 24px',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        border: goal === item.id
                                            ? '2px solid #D9C5B2'
                                            : '2px solid rgba(217,197,178,0.15)',
                                        background: goal === item.id
                                            ? 'rgba(217,197,178,0.15)'
                                            : hoveredCard === item.id
                                                ? 'rgba(217,197,178,0.08)'
                                                : 'rgba(255,255,255,0.02)',
                                        transform: hoveredCard === item.id || goal === item.id ? 'scale(1.02)' : 'scale(1)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                    }}
                                >
                                    <div style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '14px',
                                        background: goal === item.id
                                            ? 'linear-gradient(135deg, #D9C5B2, #BFA68F)'
                                            : 'rgba(217,197,178,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '28px',
                                        transition: 'all 0.3s ease',
                                    }}>
                                        {item.emoji}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: 600,
                                            fontSize: '17px',
                                            color: goal === item.id ? '#D9C5B2' : 'rgba(217,197,178,0.9)',
                                            marginBottom: '4px',
                                        }}>
                                            {item.label}
                                        </div>
                                        <div style={{ fontSize: '14px', color: 'rgba(217,197,178,0.5)' }}>
                                            {item.description}
                                        </div>
                                    </div>
                                    {goal === item.id && (
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

                    {/* Step 2: Audience Size */}
                    {step === 2 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            {AUDIENCE_SIZES.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setAudienceSize(item.id)}
                                    onMouseEnter={() => setHoveredCard(item.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '28px 20px',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        border: audienceSize === item.id
                                            ? '2px solid #D9C5B2'
                                            : '2px solid rgba(217,197,178,0.15)',
                                        background: audienceSize === item.id
                                            ? 'rgba(217,197,178,0.15)'
                                            : hoveredCard === item.id
                                                ? 'rgba(217,197,178,0.08)'
                                                : 'rgba(255,255,255,0.02)',
                                        transform: hoveredCard === item.id || audienceSize === item.id ? 'scale(1.03) translateY(-4px)' : 'scale(1)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                        position: 'relative',
                                    }}
                                >
                                    <span style={{ fontSize: '48px' }}>{item.emoji}</span>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{
                                            fontWeight: 700,
                                            fontSize: '16px',
                                            color: audienceSize === item.id ? '#D9C5B2' : 'rgba(217,197,178,0.9)',
                                            marginBottom: '4px',
                                        }}>
                                            {item.label}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'rgba(217,197,178,0.5)' }}>
                                            {item.description}
                                        </div>
                                    </div>
                                    {audienceSize === item.id && (
                                        <div style={{
                                            position: 'absolute',
                                            top: -8,
                                            right: -8,
                                            width: 26,
                                            height: 26,
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

                    {/* Step 3: Content Type */}
                    {step === 3 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            {CONTENT_TYPES.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setContentType(item.id)}
                                    onMouseEnter={() => setHoveredCard(item.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '24px 12px',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        border: contentType === item.id
                                            ? '2px solid #D9C5B2'
                                            : '2px solid rgba(217,197,178,0.15)',
                                        background: contentType === item.id
                                            ? 'rgba(217,197,178,0.15)'
                                            : hoveredCard === item.id
                                                ? 'rgba(217,197,178,0.08)'
                                                : 'rgba(255,255,255,0.02)',
                                        transform: hoveredCard === item.id || contentType === item.id ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                                        position: 'relative',
                                    }}
                                >
                                    <span style={{ fontSize: '36px' }}>{item.emoji}</span>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{
                                            fontWeight: 600,
                                            fontSize: '13px',
                                            color: contentType === item.id ? '#D9C5B2' : 'rgba(217,197,178,0.9)',
                                            marginBottom: '2px',
                                        }}>
                                            {item.label}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'rgba(217,197,178,0.5)', lineHeight: 1.3 }}>
                                            {item.description}
                                        </div>
                                    </div>
                                    {contentType === item.id && (
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
                                            <Check size={12} color="#14110F" strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Navigation */}
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
                            }}
                        >
                            {isLoading ? (
                                <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Setting up...</>
                            ) : step === 3 ? (
                                <>Start Discovering Trends <Sparkles size={20} /></>
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
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
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
