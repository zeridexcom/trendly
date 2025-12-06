import { NextRequest, NextResponse } from 'next/server'

// Types for feedback
interface ScriptFeedback {
    scriptId: string
    rating: 'good' | 'bad' | 'edited'
    originalScript?: object
    editedScript?: object
    editedFields?: string[]
    timestamp: string
}

interface UserPreferences {
    preferredHookStyle: string[]
    preferredCTAStyle: string[]
    avoidPhrases: string[]
    successfulPatterns: string[]
    averageRating: number
    totalScriptsRated: number
    totalGood: number
    totalBad: number
    totalEdited: number
    lastUpdated: string
}

// In-memory store (in production, use database)
const userPreferencesStore: Record<string, UserPreferences> = {}
const feedbackHistory: ScriptFeedback[] = []

// Get user preferences
export async function GET(request: NextRequest) {
    const userId = request.headers.get('x-user-id') || 'demo-user'

    const preferences = userPreferencesStore[userId] || {
        preferredHookStyle: [],
        preferredCTAStyle: [],
        avoidPhrases: [],
        successfulPatterns: [],
        averageRating: 0,
        totalScriptsRated: 0,
        totalGood: 0,
        totalBad: 0,
        totalEdited: 0,
        lastUpdated: new Date().toISOString()
    }

    // Calculate improvement score (0-100)
    const improvementScore = Math.min(100, Math.round(
        (preferences.totalScriptsRated * 5) +
        (preferences.totalGood * 3) +
        (preferences.totalEdited * 2)
    ))

    return NextResponse.json({
        preferences,
        stats: {
            totalScripts: preferences.totalScriptsRated,
            goodScripts: preferences.totalGood,
            badScripts: preferences.totalBad,
            editedScripts: preferences.totalEdited,
            improvementScore,
            learningLevel: improvementScore < 20 ? 'Beginner' :
                improvementScore < 50 ? 'Learning' :
                    improvementScore < 80 ? 'Trained' : 'Expert'
        }
    })
}

// Submit feedback
export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id') || 'demo-user'
        const body: ScriptFeedback = await request.json()

        if (!body.scriptId || !body.rating) {
            return NextResponse.json(
                { error: 'Missing scriptId or rating' },
                { status: 400 }
            )
        }

        // Record feedback
        feedbackHistory.push({
            ...body,
            timestamp: new Date().toISOString()
        })

        // Update user preferences
        if (!userPreferencesStore[userId]) {
            userPreferencesStore[userId] = {
                preferredHookStyle: [],
                preferredCTAStyle: [],
                avoidPhrases: [],
                successfulPatterns: [],
                averageRating: 0,
                totalScriptsRated: 0,
                totalGood: 0,
                totalBad: 0,
                totalEdited: 0,
                lastUpdated: new Date().toISOString()
            }
        }

        const prefs = userPreferencesStore[userId]
        prefs.totalScriptsRated++

        if (body.rating === 'good') {
            prefs.totalGood++
            // Learn from good scripts
            if (body.originalScript) {
                const script = body.originalScript as any
                if (script.hook?.text) {
                    // Extract hook pattern
                    const hookPattern = script.hook.text.split(' ').slice(0, 3).join(' ')
                    if (!prefs.preferredHookStyle.includes(hookPattern)) {
                        prefs.preferredHookStyle.push(hookPattern)
                    }
                }
                if (script.cta?.type) {
                    if (!prefs.preferredCTAStyle.includes(script.cta.type)) {
                        prefs.preferredCTAStyle.push(script.cta.type)
                    }
                }
            }
        } else if (body.rating === 'bad') {
            prefs.totalBad++
            // Learn what to avoid
            if (body.originalScript) {
                const script = body.originalScript as any
                if (script.hook?.text) {
                    const hookPattern = script.hook.text.split(' ').slice(0, 3).join(' ')
                    if (!prefs.avoidPhrases.includes(hookPattern)) {
                        prefs.avoidPhrases.push(hookPattern)
                    }
                }
            }
        } else if (body.rating === 'edited') {
            prefs.totalEdited++
            // Learn from edits
            if (body.editedFields && body.editedFields.length > 0) {
                body.editedFields.forEach(field => {
                    const pattern = `User prefers to edit: ${field}`
                    if (!prefs.successfulPatterns.includes(pattern)) {
                        prefs.successfulPatterns.push(pattern)
                    }
                })
            }
        }

        // Calculate new average rating
        const ratingValue = body.rating === 'good' ? 5 : body.rating === 'edited' ? 3 : 1
        prefs.averageRating = (
            (prefs.averageRating * (prefs.totalScriptsRated - 1)) + ratingValue
        ) / prefs.totalScriptsRated

        prefs.lastUpdated = new Date().toISOString()

        return NextResponse.json({
            success: true,
            message: 'Feedback recorded! AI is learning from your preferences.',
            updatedPreferences: prefs
        })
    } catch (error) {
        console.error('Feedback Error:', error)
        return NextResponse.json(
            { error: 'Failed to record feedback' },
            { status: 500 }
        )
    }
}
