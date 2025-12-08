'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Sparkles, ArrowRight, ArrowLeft, Loader2, Check,
    Cpu, Film, Briefcase, Heart, Gamepad2, Shirt, BookOpen, UtensilsCrossed, Plane, Newspaper,
    Globe, MapPin,
    Youtube, Instagram, Twitter, Linkedin, PenTool, Video,
    Zap, Flame, Calendar, Target
} from 'lucide-react'

// Step 1: Industry
const INDUSTRIES = [
    { id: 'TECH', label: 'Tech & Startups', icon: Cpu },
    { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Film },
    { id: 'BUSINESS', label: 'Business & Finance', icon: Briefcase },
    { id: 'HEALTH', label: 'Health & Fitness', icon: Heart },
    { id: 'GAMING', label: 'Gaming & Esports', icon: Gamepad2 },
    { id: 'FASHION', label: 'Fashion & Lifestyle', icon: Shirt },
    { id: 'EDUCATION', label: 'Education', icon: BookOpen },
    { id: 'FOOD', label: 'Food & Cooking', icon: UtensilsCrossed },
    { id: 'TRAVEL', label: 'Travel & Adventure', icon: Plane },
    { id: 'NEWS', label: 'News & Current Events', icon: Newspaper },
]

// Step 2: Audience Location
const LOCATIONS = [
    { id: 'IN', label: 'India', code: 'IN' },
    { id: 'US', label: 'United States', code: 'US' },
    { id: 'GLOBAL', label: 'Global / Worldwide', code: 'GLOBAL' },
    { id: 'GB', label: 'United Kingdom', code: 'GB' },
    { id: 'OTHER', label: 'Other', code: 'OTHER' },
]

// Step 3: Platforms
const PLATFORMS = [
    { id: 'YOUTUBE', label: 'YouTube', icon: Youtube },
    { id: 'INSTAGRAM', label: 'Instagram', icon: Instagram },
    { id: 'TIKTOK', label: 'TikTok', icon: Video },
    { id: 'TWITTER', label: 'Twitter / X', icon: Twitter },
    { id: 'LINKEDIN', label: 'LinkedIn', icon: Linkedin },
    { id: 'BLOG', label: 'Blog / Website', icon: PenTool },
]

// Step 4: Posting Frequency
const FREQUENCIES = [
    { id: 'DAILY', label: 'Daily', description: 'I post every day', icon: Zap },
    { id: 'FREQUENT', label: '3-4 times/week', description: 'Regular posting schedule', icon: Flame },
    { id: 'WEEKLY', label: 'Weekly', description: 'Once or twice a week', icon: Calendar },
    { id: 'OCCASIONAL', label: 'Occasionally', description: 'When inspiration strikes', icon: Target },
]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [industry, setIndustry] = useState('')
    const [location, setLocation] = useState('')
    const [platforms, setPlatforms] = useState<string[]>([])
    const [frequency, setFrequency] = useState('')
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
            // Save preferences to API
            await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ industry, location, platforms, frequency }),
            })
            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            console.error('Error:', error)
            router.push('/dashboard')
        } finally {
            setIsLoading(false)
        }
    }

    const goToStep = (newStep: number) => {
        setAnimateIn(true)
        setTimeout(() => setStep(newStep), 100)
    }

    const canProceed = () => {
        if (step === 1) return !!industry
        if (step === 2) return !!location
        if (step === 3) return platforms.length > 0
        if (step === 4) return !!frequency
        return false
    }

    const stepData = [
        { title: "What industry are you in?", subtitle: "We'll show you relevant trends in your field" },
        { title: "Where is your audience?", subtitle: "We'll prioritize trends from your target region" },
        { title: "Which platforms do you use?", subtitle: "Select all platforms you create content for" },
        { title: "How often do you post?", subtitle: "We'll tailor trend urgency to your schedule" },
    ]

    const cardStyle = (isSelected: boolean, isHovered: boolean) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '18px 22px',
        borderRadius: '14px',
        cursor: 'pointer',
        textAlign: 'left' as const,
        border: isSelected ? '2px solid #D9C5B2' : '2px solid rgba(217,197,178,0.15)',
        background: isSelected ? 'rgba(217,197,178,0.12)' : isHovered ? 'rgba(217,197,178,0.06)' : 'transparent',
        transform: isHovered || isSelected ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    })

    const iconBoxStyle = (isSelected: boolean) => ({
        width: 44,
        height: 44,
        borderRadius: '10px',
        background: isSelected ? 'linear-gradient(135deg, #D9C5B2, #BFA68F)' : 'rgba(217,197,178,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.25s ease',
    })

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(145deg, #0F0D0C 0%, #1A1816 50%, #0F0D0C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
            <div style={{ width: '100%', maxWidth: 680 }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '36px',
                    animation: animateIn ? 'fadeInDown 0.4s ease-out' : 'none',
                }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #D9C5B2 0%, #BFA68F 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 16px 48px rgba(217,197,178,0.25)',
                    }}>
                        <Sparkles size={30} color="#0F0D0C" strokeWidth={2} />
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#F5F0EB',
                        marginBottom: '10px',
                        letterSpacing: '-0.5px',
                    }}>
                        {stepData[step - 1].title}
                    </h1>
                    <p style={{ color: 'rgba(217,197,178,0.6)', fontSize: '15px', fontWeight: 400 }}>
                        {stepData[step - 1].subtitle}
                    </p>
                </div>

                {/* Progress */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '32px',
                    padding: '0 40px',
                }}>
                    {[1, 2, 3, 4].map(s => (
                        <div
                            key={s}
                            style={{
                                flex: 1,
                                height: 4,
                                borderRadius: 2,
                                background: 'rgba(217,197,178,0.15)',
                                overflow: 'hidden',
                                cursor: s < step ? 'pointer' : 'default',
                            }}
                            onClick={() => s < step && goToStep(s)}
                        >
                            <div style={{
                                height: '100%',
                                borderRadius: 2,
                                background: s <= step ? '#D9C5B2' : 'transparent',
                                width: s <= step ? '100%' : '0%',
                                transition: 'width 0.4s ease-out',
                            }} />
                        </div>
                    ))}
                </div>

                {/* Card Container */}
                <div style={{
                    background: 'rgba(26, 24, 22, 0.6)',
                    backdropFilter: 'blur(24px)',
                    borderRadius: '20px',
                    padding: '32px',
                    border: '1px solid rgba(217,197,178,0.08)',
                    animation: animateIn ? 'fadeInUp 0.4s ease-out' : 'none',
                }}>
                    {/* Step 1: Industry */}
                    {step === 1 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            {INDUSTRIES.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setIndustry(item.id)}
                                    onMouseEnter={() => setHoveredCard(item.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        ...cardStyle(industry === item.id, hoveredCard === item.id),
                                        animation: `fadeInUp 0.4s ease-out ${index * 0.04}s both`,
                                    }}
                                >
                                    <div style={iconBoxStyle(industry === item.id)}>
                                        <item.icon size={20} color={industry === item.id ? '#0F0D0C' : '#D9C5B2'} strokeWidth={1.5} />
                                    </div>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: industry === item.id ? '#F5F0EB' : 'rgba(217,197,178,0.8)',
                                    }}>
                                        {item.label}
                                    </span>
                                    {industry === item.id && (
                                        <Check size={18} color="#D9C5B2" style={{ marginLeft: 'auto' }} strokeWidth={2.5} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Location */}
                    {step === 2 && (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {LOCATIONS.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setLocation(item.id)}
                                    onMouseEnter={() => setHoveredCard(item.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        ...cardStyle(location === item.id, hoveredCard === item.id),
                                        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                                    }}
                                >
                                    <div style={iconBoxStyle(location === item.id)}>
                                        {item.id === 'GLOBAL' ? (
                                            <Globe size={20} color={location === item.id ? '#0F0D0C' : '#D9C5B2'} strokeWidth={1.5} />
                                        ) : (
                                            <MapPin size={20} color={location === item.id ? '#0F0D0C' : '#D9C5B2'} strokeWidth={1.5} />
                                        )}
                                    </div>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: 500,
                                        color: location === item.id ? '#F5F0EB' : 'rgba(217,197,178,0.8)',
                                    }}>
                                        {item.label}
                                    </span>
                                    {location === item.id && (
                                        <Check size={18} color="#D9C5B2" style={{ marginLeft: 'auto' }} strokeWidth={2.5} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 3: Platforms */}
                    {step === 3 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            {PLATFORMS.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => togglePlatform(item.id)}
                                    onMouseEnter={() => setHoveredCard(item.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        ...cardStyle(platforms.includes(item.id), hoveredCard === item.id),
                                        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                                    }}
                                >
                                    <div style={iconBoxStyle(platforms.includes(item.id))}>
                                        <item.icon size={20} color={platforms.includes(item.id) ? '#0F0D0C' : '#D9C5B2'} strokeWidth={1.5} />
                                    </div>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: platforms.includes(item.id) ? '#F5F0EB' : 'rgba(217,197,178,0.8)',
                                    }}>
                                        {item.label}
                                    </span>
                                    {platforms.includes(item.id) && (
                                        <Check size={18} color="#D9C5B2" style={{ marginLeft: 'auto' }} strokeWidth={2.5} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 4: Frequency */}
                    {step === 4 && (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {FREQUENCIES.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setFrequency(item.id)}
                                    onMouseEnter={() => setHoveredCard(item.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        ...cardStyle(frequency === item.id, hoveredCard === item.id),
                                        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                                    }}
                                >
                                    <div style={iconBoxStyle(frequency === item.id)}>
                                        <item.icon size={20} color={frequency === item.id ? '#0F0D0C' : '#D9C5B2'} strokeWidth={1.5} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '15px',
                                            fontWeight: 500,
                                            color: frequency === item.id ? '#F5F0EB' : 'rgba(217,197,178,0.8)',
                                            marginBottom: '2px',
                                        }}>
                                            {item.label}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'rgba(217,197,178,0.5)' }}>
                                            {item.description}
                                        </div>
                                    </div>
                                    {frequency === item.id && (
                                        <Check size={18} color="#D9C5B2" strokeWidth={2.5} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Navigation */}
                    <div style={{ display: 'flex', gap: '14px', marginTop: '32px' }}>
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => goToStep(step - 1)}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    border: '1.5px solid rgba(217,197,178,0.25)',
                                    background: 'transparent',
                                    color: '#D9C5B2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <ArrowLeft size={18} /> Back
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={step === 4 ? handleComplete : () => goToStep(step + 1)}
                            disabled={!canProceed() || isLoading}
                            style={{
                                flex: step === 1 ? 1 : 2,
                                padding: '16px',
                                borderRadius: '12px',
                                cursor: canProceed() ? 'pointer' : 'not-allowed',
                                border: 'none',
                                background: canProceed() ? 'linear-gradient(135deg, #D9C5B2, #BFA68F)' : 'rgba(217,197,178,0.15)',
                                color: canProceed() ? '#0F0D0C' : 'rgba(217,197,178,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontSize: '15px',
                                fontWeight: 600,
                                boxShadow: canProceed() ? '0 12px 32px rgba(217,197,178,0.25)' : 'none',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {isLoading ? (
                                <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Setting up...</>
                            ) : step === 4 ? (
                                <>Get Started <Sparkles size={18} /></>
                            ) : (
                                <>Continue <ArrowRight size={18} /></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Skip */}
                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        style={{
                            color: 'rgba(217,197,178,0.4)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 400,
                        }}
                    >
                        Skip for now
                    </button>
                </p>
            </div>

            <style jsx>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
