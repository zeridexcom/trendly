'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
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

    // Email/Password Sign In or Sign Up
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            if (isSignUp) {
                // Sign Up
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            name: formData.name,
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                })
                if (error) throw error

                // Redirect to onboarding after signup
                router.push('/onboarding')
                router.refresh()
            } else {
                // Sign In
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

    // Google Sign In
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
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-4)',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: 420,
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: 'var(--space-8)',
                    }}
                >
                    <Link href="/" className="flex items-center justify-center gap-3 mb-4">
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--gradient-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Sparkles size={28} color="white" />
                        </div>
                    </Link>
                    <h1
                        style={{
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 'var(--font-bold)',
                            marginBottom: 'var(--space-2)',
                        }}
                    >
                        {isSignUp ? 'Create your account' : 'Welcome back'}
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        {isSignUp ? 'Start discovering trends today' : 'Sign in to your Trendly account'}
                    </p>
                </div>

                {/* Login Card */}
                <div className="card card-elevated" style={{ padding: 'var(--space-8)' }}>
                    {/* Error Message */}
                    {error && (
                        <div
                            style={{
                                padding: 'var(--space-3) var(--space-4)',
                                background: 'var(--color-error-subtle)',
                                border: '1px solid var(--color-error)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--space-4)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--color-error)',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Google Sign In Button */}
                    <button
                        type="button"
                        className="btn btn-secondary w-full"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading || isLoading}
                        style={{
                            padding: 'var(--space-4)',
                            marginBottom: 'var(--space-4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-3)',
                        }}
                    >
                        {isGoogleLoading ? (
                            <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        )}
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-4)',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                            or continue with email
                        </span>
                        <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Name (only for signup) */}
                        {isSignUp && (
                            <div className="input-group mb-4">
                                <label className="input-label">Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required={isSignUp}
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div className="input-group mb-4">
                            <label className="input-label">Email</label>
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
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ paddingLeft: 'var(--space-10)' }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="input-group mb-6">
                            <label className="input-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock
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
                                    type={showPassword ? 'text' : 'password'}
                                    className="input"
                                    placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{ paddingLeft: 'var(--space-10)', paddingRight: 'var(--space-10)' }}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: 'var(--space-3)',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--color-text-muted)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 'var(--space-1)',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isLoading || isGoogleLoading}
                            style={{ padding: 'var(--space-4)' }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                                </>
                            ) : (
                                <>
                                    {isSignUp ? 'Create Account' : 'Sign In'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Toggle Sign In / Sign Up */}
                <p
                    style={{
                        textAlign: 'center',
                        marginTop: 'var(--space-6)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-muted)',
                    }}
                >
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{
                            color: 'var(--color-primary)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                    >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    )
}
