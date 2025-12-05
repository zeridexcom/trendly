'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Login failed')
            }

            // Redirect to dashboard
            router.push('/dashboard')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    // Demo login handler
    const handleDemoLogin = async () => {
        setIsLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/demo', {
                method: 'POST',
            })

            if (!res.ok) {
                throw new Error('Demo login failed')
            }

            router.push('/dashboard')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setIsLoading(false)
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
                        Welcome back
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Sign in to your Trendly account
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

                    <form onSubmit={handleSubmit}>
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
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{ paddingLeft: 'var(--space-10)', paddingRight: 'var(--space-10)' }}
                                    required
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
                            disabled={isLoading}
                            style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

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
                            or
                        </span>
                        <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                    </div>

                    {/* Demo Login */}
                    <button
                        type="button"
                        className="btn btn-secondary w-full"
                        onClick={handleDemoLogin}
                        disabled={isLoading}
                        style={{ padding: 'var(--space-4)' }}
                    >
                        <Sparkles size={18} />
                        Try Demo Account
                    </button>
                </div>

                {/* Footer */}
                <p
                    style={{
                        textAlign: 'center',
                        marginTop: 'var(--space-6)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-muted)',
                    }}
                >
                    Don&apos;t have an account?{' '}
                    <Link href="/login" style={{ color: 'var(--color-primary)' }}>
                        Contact your admin
                    </Link>
                </p>
            </div>
        </div>
    )
}
