import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

// Define types inline to avoid dependency on generated Prisma client
type UserRole = 'ADMIN' | 'MANAGER' | 'CREATOR' | 'EXECUTIVE'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'

export interface JWTPayload {
    userId: string
    email: string
    role: UserRole
    iat?: number
    exp?: number
}

export interface AuthUser {
    id: string
    name: string
    email: string
    role: UserRole
    avatarUrl: string | null
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

// JWT token management
export function createToken(user: { id: string; email: string; role: string }): string {
    const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role as UserRole,
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch {
        return null
    }
}

// Get current user from cookies
// For demo mode, returns a demo user if token is valid
export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth-token')?.value

        if (!token) return null

        const payload = verifyToken(token)
        if (!payload) return null

        // Return demo user with info from JWT payload
        // In production, this would fetch from database
        return {
            id: payload.userId,
            name: 'Demo User',
            email: payload.email,
            role: payload.role,
            avatarUrl: null,
        }
    } catch {
        return null
    }
}

// Permission helpers
export function canManageUsers(role: UserRole): boolean {
    return role === 'ADMIN'
}

export function canManagePosts(role: UserRole): boolean {
    return ['ADMIN', 'MANAGER'].includes(role)
}

export function canDeletePosts(role: UserRole): boolean {
    return role === 'ADMIN'
}

export function canChangePostStatus(role: UserRole): boolean {
    return ['ADMIN', 'MANAGER'].includes(role)
}

export function canEditAnyPost(role: UserRole): boolean {
    return ['ADMIN', 'MANAGER'].includes(role)
}

// Require authentication for API routes
export async function requireAuth(): Promise<AuthUser> {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('Unauthorized')
    }
    return user
}

// Require specific role
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthUser> {
    const user = await requireAuth()
    if (!allowedRoles.includes(user.role)) {
        throw new Error('Forbidden')
    }
    return user
}
