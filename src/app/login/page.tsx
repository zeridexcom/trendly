'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
        <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans text-black">
            {/* Left Panel - Brand / Marketing */}
            <div className="hidden lg:flex flex-col justify-between bg-[#FFC900] border-r-4 border-black p-12 relative overflow-hidden">
                <div className="z-10">
                    <div className="w-16 h-16 bg-black border-2 border-white shadow-[4px_4px_0px_0px_#FFF] flex items-center justify-center mb-8">
                        <span className="text-white text-3xl font-black italic">T</span>
                    </div>
                    <h1 className="text-7xl font-black tracking-tighter italic mb-6 leading-none">
                        CREATE<br />
                        FASTER.<br />
                        GO VIRAL.
                    </h1>
                    <p className="text-xl font-bold border-l-4 border-black pl-6 py-2 max-w-md">
                        Stop guessing what to post. Get AI-powered trend predictions and content ideas in seconds.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 w-96 h-96 bg-[#FF90E8] rounded-full border-4 border-black mix-blend-multiply opacity-50 blur-3xl" />
                <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-80 h-80 bg-[#00F0FF] rounded-full border-4 border-black mix-blend-multiply opacity-50 blur-3xl" />

                <div className="z-10 space-y-2">
                    <div className="font-mono text-sm font-bold tracking-widest uppercase">
                        © 2024 Trendllly Inc.
                    </div>
                    <div className="text-xs font-medium">
                        By signing up, you agree to our{' '}
                        <Link href="/terms" className="underline hover:no-underline">Terms</Link>,{' '}
                        <Link href="/privacy" className="underline hover:no-underline">Privacy Policy</Link>{' & '}
                        <Link href="/cookies" className="underline hover:no-underline">Cookies</Link>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex items-center justify-center p-8 bg-white relative">
                {/* Error Message */}
                {error && (
                    <div className="absolute top-8 left-8 right-8 p-4 bg-red-100 border-2 border-red-500 text-red-700 font-bold shadow-[4px_4px_0px_0px_#EF4444]">
                        ⚠️ {error}
                    </div>
                )}

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl font-black mb-2 uppercase italic">
                            {isSignUp ? 'Join the Club' : 'Welcome Back'}
                        </h2>
                        <p className="text-gray-500 font-bold text-lg">
                            {isSignUp ? 'Start your viral journey today.' : 'Login to access your dashboard.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field (Sign Up Only) */}
                        {isSignUp && (
                            <div className="space-y-1">
                                <label className="font-black text-sm uppercase tracking-wider">Full Name</label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all outline-none font-bold placeholder:text-gray-300 group-hover:bg-gray-50"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-1">
                            <label className="font-black text-sm uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <input
                                    required
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all outline-none font-bold placeholder:text-gray-300 group-hover:bg-gray-50"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="font-black text-sm uppercase tracking-wider">Password</label>
                                {!isSignUp && (
                                    <button type="button" className="text-xs font-bold underline decoration-2 decoration-[#FF90E8] hover:bg-[#FF90E8] transition-colors px-1">
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <div className="relative group">
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all outline-none font-bold placeholder:text-gray-300 group-hover:bg-gray-50 pr-12"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-[#FF90E8] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full p-4 bg-black text-white font-black text-lg border-2 border-transparent hover:bg-[#FF90E8] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> PROCESSING...</>
                            ) : (
                                <>{isSignUp ? 'Get Started' : 'Login'} <Sparkles className="w-5 h-5 group-hover:animate-pulse" /></>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t-2 border-black"></div>
                        <span className="flex-shrink-0 mx-4 text-black font-black text-xs uppercase bg-white px-2 border-2 border-black -rotate-2 shadow-[2px_2px_0px_0px_#000]">OR CONTINUE WITH</span>
                        <div className="flex-grow border-t-2 border-black"></div>
                    </div>

                    {/* Social Login */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                        className="w-full p-4 bg-white text-black font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 uppercase tracking-wide"
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" className="w-5 h-5">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        GOOGLE
                    </button>

                    {/* Toggle */}
                    <div className="text-center">
                        <p className="font-bold text-gray-500">
                            {isSignUp ? 'Already a member?' : "New to Trendllly?"}{' '}
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-black underline decoration-2 decoration-[#FFC900] hover:bg-[#FFC900] transition-all px-1 font-black"
                            >
                                {isSignUp ? 'Login Here' : 'Create Account'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
