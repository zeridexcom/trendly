import { NextRequest, NextResponse } from 'next/server'

// Types
interface ScheduleSlot {
    id: string
    contentId: string
    title: string
    platform: string
    scheduledTime: string
    suggestedTime: string
    engagementPrediction: number
    status: 'pending' | 'scheduled' | 'posted'
}

interface QueueItem {
    id: string
    title: string
    content: string
    platform: string
    priority: 'high' | 'medium' | 'low'
    addedAt: string
}

// Optimal times by platform (based on algorithm data)
const optimalTimes: Record<string, { day: number; hour: number; score: number }[]> = {
    instagram: [
        { day: 3, hour: 11, score: 92 }, { day: 2, hour: 9, score: 88 }, { day: 4, hour: 12, score: 89 },
        { day: 1, hour: 12, score: 85 }, { day: 5, hour: 11, score: 86 }, { day: 0, hour: 10, score: 75 }
    ],
    tiktok: [
        { day: 4, hour: 12, score: 93 }, { day: 2, hour: 9, score: 90 }, { day: 3, hour: 7, score: 88 },
        { day: 1, hour: 6, score: 82 }, { day: 5, hour: 5, score: 85 }, { day: 6, hour: 11, score: 80 }
    ],
    youtube: [
        { day: 5, hour: 15, score: 90 }, { day: 4, hour: 15, score: 88 }, { day: 3, hour: 15, score: 86 },
        { day: 2, hour: 15, score: 85 }, { day: 6, hour: 10, score: 83 }
    ],
    twitter: [
        { day: 3, hour: 9, score: 90 }, { day: 2, hour: 9, score: 88 }, { day: 4, hour: 9, score: 86 },
        { day: 1, hour: 9, score: 84 }, { day: 5, hour: 10, score: 82 }
    ],
    linkedin: [
        { day: 3, hour: 12, score: 92 }, { day: 2, hour: 10, score: 90 }, { day: 4, hour: 10, score: 88 },
        { day: 1, hour: 8, score: 82 }, { day: 5, hour: 9, score: 75 }
    ],
}

// In-memory stores
let contentQueue: QueueItem[] = [
    { id: 'q1', title: 'Morning Motivation Post', content: 'Start your day with...', platform: 'instagram', priority: 'high', addedAt: new Date().toISOString() },
    { id: 'q2', title: 'Product Tutorial', content: 'How to use our new feature...', platform: 'youtube', priority: 'medium', addedAt: new Date().toISOString() },
    { id: 'q3', title: 'Industry News Thread', content: 'Breaking: Latest updates in...', platform: 'twitter', priority: 'high', addedAt: new Date().toISOString() },
    { id: 'q4', title: 'Behind the Scenes', content: 'A day at the office...', platform: 'tiktok', priority: 'low', addedAt: new Date().toISOString() },
    { id: 'q5', title: 'Weekly Insights', content: 'This week we learned...', platform: 'linkedin', priority: 'medium', addedAt: new Date().toISOString() },
]

let scheduledSlots: ScheduleSlot[] = []

function getNextOptimalSlots(platform: string, count: number = 5): { time: Date; score: number }[] {
    const platformTimes = optimalTimes[platform] || optimalTimes.instagram
    const now = new Date()
    const slots: { time: Date; score: number }[] = []

    for (let weekOffset = 0; weekOffset < 3 && slots.length < count; weekOffset++) {
        for (const slot of platformTimes) {
            const targetDate = new Date(now)
            targetDate.setDate(now.getDate() + ((slot.day - now.getDay() + 7) % 7) + (weekOffset * 7))
            targetDate.setHours(slot.hour, 0, 0, 0)

            if (targetDate > now) {
                slots.push({ time: targetDate, score: slot.score - (weekOffset * 5) })
            }
            if (slots.length >= count) break
        }
    }

    return slots.sort((a, b) => a.time.getTime() - b.time.getTime()).slice(0, count)
}

// GET - Fetch queue and schedule
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'suggestions') {
        // Generate AI schedule suggestions for all queue items
        const suggestions = contentQueue.map(item => {
            const slots = getNextOptimalSlots(item.platform, 3)
            return {
                item,
                suggestedSlots: slots.map(s => ({
                    time: s.time.toISOString(),
                    score: s.score,
                    label: s.time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                }))
            }
        })
        return NextResponse.json({ suggestions })
    }

    return NextResponse.json({
        queue: contentQueue,
        scheduled: scheduledSlots,
        stats: {
            queueSize: contentQueue.length,
            scheduledCount: scheduledSlots.length,
            nextPost: scheduledSlots.sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())[0] || null
        }
    })
}

// POST - Add to queue or auto-schedule
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        if (body.action === 'addToQueue') {
            const newItem: QueueItem = {
                id: `q_${Date.now()}`,
                title: body.title,
                content: body.content,
                platform: body.platform || 'instagram',
                priority: body.priority || 'medium',
                addedAt: new Date().toISOString()
            }
            contentQueue.push(newItem)
            return NextResponse.json({ success: true, item: newItem })
        }

        if (body.action === 'autoSchedule') {
            // Auto-schedule all queue items to optimal slots
            const scheduled: ScheduleSlot[] = []
            const usedSlots: Set<string> = new Set(scheduledSlots.map(s => s.scheduledTime))

            // Sort by priority
            const sortedQueue = [...contentQueue].sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 }
                return priorityOrder[a.priority] - priorityOrder[b.priority]
            })

            for (const item of sortedQueue) {
                const optimalSlots = getNextOptimalSlots(item.platform, 10)
                const availableSlot = optimalSlots.find(s => !usedSlots.has(s.time.toISOString()))

                if (availableSlot) {
                    const slot: ScheduleSlot = {
                        id: `slot_${Date.now()}_${item.id}`,
                        contentId: item.id,
                        title: item.title,
                        platform: item.platform,
                        scheduledTime: availableSlot.time.toISOString(),
                        suggestedTime: availableSlot.time.toISOString(),
                        engagementPrediction: availableSlot.score,
                        status: 'scheduled'
                    }
                    scheduled.push(slot)
                    scheduledSlots.push(slot)
                    usedSlots.add(availableSlot.time.toISOString())
                }
            }

            // Clear queue
            contentQueue = []

            return NextResponse.json({
                success: true,
                scheduled,
                message: `Auto-scheduled ${scheduled.length} items to optimal time slots`
            })
        }

        if (body.action === 'scheduleOne') {
            const item = contentQueue.find(q => q.id === body.itemId)
            if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

            const slot: ScheduleSlot = {
                id: `slot_${Date.now()}`,
                contentId: item.id,
                title: item.title,
                platform: item.platform,
                scheduledTime: body.scheduledTime,
                suggestedTime: body.scheduledTime,
                engagementPrediction: body.score || 75,
                status: 'scheduled'
            }
            scheduledSlots.push(slot)
            contentQueue = contentQueue.filter(q => q.id !== item.id)

            return NextResponse.json({ success: true, slot })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
    }
}

// DELETE - Remove from queue or schedule
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type') || 'queue'

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    if (type === 'queue') {
        contentQueue = contentQueue.filter(q => q.id !== id)
    } else {
        scheduledSlots = scheduledSlots.filter(s => s.id !== id)
    }

    return NextResponse.json({ success: true })
}
