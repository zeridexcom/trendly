'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
                    renderButton: (element: HTMLElement, config: any) => void
                    prompt: () => void
                }
            }
        }
    }
}

export default function GoogleSignInButton({ onError, onLoading }: GoogleSignInButtonProps) {
    const [scriptLoaded, setScriptLoaded] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleGoogleCallback = async (response: any) => {
        try {
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
                // Check if onboarding is complete
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
            onLoading?.(false)
        }
    }

    useEffect(() => {
        if (scriptLoaded && window.google) {
            // Initialize Google Sign-In
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: handleGoogleCallback,
                auto_select: false,
                cancel_on_tap_outside: true,
            })

            // Render the button
            const buttonDiv = document.getElementById('google-signin-button')
            if (buttonDiv) {
                window.google.accounts.id.renderButton(buttonDiv, {
                    type: 'standard',
                    theme: 'outline',
                    size: 'large',
                    text: 'continue_with',
                    shape: 'rectangular',
                    width: '100%',
                })
            }
        }
    }, [scriptLoaded])

    return (
        <>
            <Script
                src="https://accounts.google.com/gsi/client"
                onLoad={() => setScriptLoaded(true)}
                strategy="afterInteractive"
            />
            <div
                id="google-signin-button"
                className="w-full flex justify-center"
                style={{ minHeight: '44px' }}
            />
        </>
    )
}
