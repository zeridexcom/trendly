'use client'

import { useEffect, useState, useCallback } from 'react'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface GoogleSignInButtonProps {
    onError?: (error: string) => void
    onLoading?: (loading: boolean) => void
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: any) => void
                    prompt: (callback?: (notification: any) => void) => void
                }
            }
        }
    }
}

export default function GoogleSignInButton({ onError, onLoading }: GoogleSignInButtonProps) {
    const [scriptLoaded, setScriptLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleGoogleCallback = useCallback(async (response: any) => {
        try {
            setIsLoading(true)
            onLoading?.(true)

            if (!response.credential) {
                throw new Error('No credential received from Google')
            }

            // Sign in with Supabase using the Google ID token
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
            })

            if (error) {
                console.error('Supabase auth error:', error)
                throw new Error(error.message || 'Failed to sign in')
            }

            if (data?.user) {
                const onboardingComplete = data.user.user_metadata?.onboardingComplete

                if (onboardingComplete) {
                    router.push('/dashboard')
                } else {
                    router.push('/onboarding')
                }
                router.refresh()
            }
        } catch (err) {
            console.error('Google sign-in error:', err)
            onError?.(err instanceof Error ? err.message : 'Google sign-in failed')
            setIsLoading(false)
            onLoading?.(false)
        }
    }, [supabase, router, onError, onLoading])

    useEffect(() => {
        if (scriptLoaded && window.google) {
            const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

            if (!clientId) {
                console.error('Google Client ID not configured')
                return
            }

            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: handleGoogleCallback,
                auto_select: false,
                cancel_on_tap_outside: true,
            })
        }
    }, [scriptLoaded, handleGoogleCallback])

    const handleClick = () => {
        if (!window.google) {
            onError?.('Google Sign-In is loading. Please try again.')
            return
        }

        setIsLoading(true)
        onLoading?.(true)

        // Trigger Google One Tap / account chooser
        window.google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // Fall back to showing a message
                setIsLoading(false)
                onLoading?.(false)

                const reason = notification.getNotDisplayedReason?.() || notification.getSkippedReason?.()
                console.log('Google prompt not shown:', reason)

                if (reason === 'opt_out_or_no_session') {
                    onError?.('Please sign in to your Google account first, then try again.')
                } else if (reason === 'suppressed_by_user') {
                    onError?.('Google Sign-In was dismissed. Please try again.')
                } else {
                    onError?.('Could not show Google Sign-In. Please try again or use email login.')
                }
            }
        })
    }

    return (
        <>
            <Script
                src="https://accounts.google.com/gsi/client"
                onLoad={() => setScriptLoaded(true)}
                strategy="afterInteractive"
            />
            <button
                type="button"
                onClick={handleClick}
                disabled={isLoading || !scriptLoaded}
                className="w-full p-4 bg-white text-black font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                )}
                {isLoading ? 'SIGNING IN...' : 'GOOGLE'}
            </button>
        </>
    )
}
