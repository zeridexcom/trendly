'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Shield, FileText, Check } from 'lucide-react'

export default function CookieConsentBanner() {
    const [showBanner, setShowBanner] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
            setShowBanner(true)
        }
    }, [])

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted')
        localStorage.setItem('cookie-consent-date', new Date().toISOString())
        setShowBanner(false)
    }

    if (!showBanner) return null

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="fixed bottom-4 left-4 z-50 w-80"
                >
                    <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000] p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Cookie className="w-5 h-5" />
                            <h3 className="font-black text-sm uppercase">Cookie Notice</h3>
                        </div>

                        <p className="text-xs font-medium text-gray-600 mb-3">
                            We use cookies for authentication and to improve your experience.
                        </p>

                        <div className="flex gap-2 text-xs mb-3">
                            <Link href="/cookies" target="_blank" className="text-blue-600 hover:underline font-bold">
                                Cookies
                            </Link>
                            <span>•</span>
                            <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline font-bold">
                                Privacy
                            </Link>
                            <span>•</span>
                            <Link href="/terms" target="_blank" className="text-blue-600 hover:underline font-bold">
                                Terms
                            </Link>
                        </div>

                        <button
                            onClick={acceptCookies}
                            className="w-full py-2 bg-[#B1F202] text-black font-bold text-sm border-2 border-black hover:shadow-[2px_2px_0px_0px_#000] transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Accept & Continue
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
