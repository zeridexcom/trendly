import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'

// Demo user for when database isn't set up
const DEMO_USER = {
    id: 'demo-user-id',
    name: 'Demo User',
    email: 'demo@trendly.com',
    role: 'ADMIN' as const,
}

export async function POST() {
    try {
        // Create token for demo user
        const token = jwt.sign(
            {
                userId: DEMO_USER.id,
                email: DEMO_USER.email,
                role: DEMO_USER.role,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        return NextResponse.json({
            success: true,
            user: DEMO_USER,
        })
    } catch (error) {
        console.error('Demo login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
