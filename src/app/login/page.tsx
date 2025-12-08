'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    })

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: { name: formData.name },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                router.push('/onboarding')
                router.refresh()
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                })
                if (error) throw error
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true)
        setError('')
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
            setIsGoogleLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: '#FAFAFA',
        }}>
            {/* Left Panel - Dark Gradient with Marketing */}
            <div style={{
                flex: '0 0 45%',
                background: 'linear-gradient(135deg, #34312D 0%, #14110F 100%)',
                borderRadius: '0 40px 40px 0',
                padding: '60px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'rgba(217, 197, 178, 0.1)',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-50px',
                    left: '-50px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'rgba(217, 197, 178, 0.08)',
                }} />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: 800,
                        color: '#D9C5B2',
                        lineHeight: 1.2,
                        marginBottom: '24px',
                    }}>
                        Discover <br />
                        trending topics <br />
                        with <span style={{ borderBottom: '3px solid #D9C5B2' }}>Trendly.</span>
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: 'rgba(217, 197, 178, 0.8)',
                        maxWidth: '400px',
                        lineHeight: 1.6,
                    }}>
                        Stay ahead of the curve with real-time Google Trends,
                        AI-powered content ideas, and viral predictions.
                    </p>

                    {/* Feature pills */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '40px', flexWrap: 'wrap' }}>
                        {['🔥 Real-time Trends', '🤖 AI Insights', '📈 Growth Tips'].map(feature => (
                            <span key={feature} style={{
                                background: 'rgba(217, 197, 178, 0.15)',
                                backdropFilter: 'blur(10px)',
                                padding: '10px 20px',
                                borderRadius: '30px',
                                color: '#D9C5B2',
                                fontSize: '14px',
                                fontWeight: 500,
                                border: '1px solid rgba(217, 197, 178, 0.2)',
                            }}>
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Icon decoration */}
                <div style={{
                    position: 'absolute',
                    bottom: '60px',
                    right: '60px',
                    width: '160px',
                    height: '160px',
                    background: 'rgba(217, 197, 178, 0.1)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(217, 197, 178, 0.15)',
                }}>
                    <Sparkles size={70} color="#D9C5B2" />
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
            }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #34312D, #14110F)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: '0 10px 40px rgba(52, 49, 45, 0.3)',
                        }}>
                            <Sparkles size={28} color="#D9C5B2" />
                        </div>
                        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#34312D', marginBottom: '8px' }}>
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p style={{ color: '#7E7F83', fontSize: '15px' }}>
                            {isSignUp ? 'Start discovering trends today' : 'Please login to your account'}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            color: '#dc2626',
                            fontSize: '14px',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Name field for signup */}
                        {isSignUp && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#34312D', fontWeight: 500, fontSize: '14px' }}>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required={isSignUp}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '12px',
                                        border: '2px solid #E8E8E9',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        background: '#fff',
                                    }}
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#34312D', fontWeight: 500, fontSize: '14px' }}>
                                Email address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #E8E8E9',
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    background: '#fff',
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#34312D', fontWeight: 500, fontSize: '14px' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                    style={{
                                        width: '100%',
                                        padding: '14px 50px 14px 16px',
                                        borderRadius: '12px',
                                        border: '2px solid #E8E8E9',
                                        fontSize: '15px',
                                        outline: 'none',
                                        background: '#fff',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#7E7F83',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password */}
                        {!isSignUp && (
                            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                                <button type="button" style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#34312D',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                }}>
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #34312D, #14110F)',
                                color: '#D9C5B2',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 10px 40px rgba(52, 49, 45, 0.25)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                        >
                            {isLoading ? (
                                <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Please wait...</>
                            ) : (
                                isSignUp ? 'Create Account' : 'Login'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '28px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: '#E8E8E9' }} />
                        <span style={{ color: '#7E7F83', fontSize: '14px' }}>Or Login with</span>
                        <div style={{ flex: 1, height: '1px', background: '#E8E8E9' }} />
                    </div>

                    {/* Social Login Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isGoogleLoading}
                            style={{
                                flex: 1,
                                padding: '14px',
                                borderRadius: '12px',
                                border: '2px solid #E8E8E9',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: 500,
                                color: '#34312D',
                                transition: 'border-color 0.2s, background 0.2s',
                            }}
                        >
                            {isGoogleLoading ? (
                                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            Google
                        </button>
                    </div>

                    {/* Toggle Sign Up / Sign In */}
                    <p style={{ textAlign: 'center', marginTop: '32px', color: '#7E7F83', fontSize: '15px' }}>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#34312D',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            {isSignUp ? 'Login' : 'Sign up'}
                        </button>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                input:focus {
                    border-color: #D9C5B2 !important;
                }
            `}</style>
        </div>
    )
}
