import { NextRequest, NextResponse } from 'next/server'

// Types
interface ActivityItem {
    id: string
    type: 'content_created' | 'status_changed' | 'comment_added' | 'scheduled' | 'published' | 'login' | 'settings_changed'
    user: {
        name: string
        avatar: string
        role: string
    }
    action: string
    target?: string
    details?: string
    platform?: string
    timestamp: string
}

// Mock activity data
const activityFeed: ActivityItem[] = [
    {
        id: 'act_1',
        type: 'content_created',
        user: { name: 'John Doe', avatar: 'JD', role: 'Admin' },
        action: 'created new content',
        target: '10 Tips for Better Content',
        platform: 'instagram',
        timestamp: new Date(Date.now() - 300000).toISOString() // 5 min ago
    },
    {
        id: 'act_2',
        type: 'status_changed',
        user: { name: 'Jane Smith', avatar: 'JS', role: 'Editor' },
        action: 'moved to review',
        target: 'Behind the Scenes Video',
        details: 'Ready for approval',
        platform: 'tiktok',
        timestamp: new Date(Date.now() - 1800000).toISOString() // 30 min ago
    },
    {
        id: 'act_3',
        type: 'comment_added',
        user: { name: 'Mike Johnson', avatar: 'MJ', role: 'Reviewer' },
        action: 'commented on',
        target: 'Product Launch Announcement',
        details: 'Looks great! Just one small edit needed.',
        timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
        id: 'act_4',
        type: 'status_changed',
        user: { name: 'John Doe', avatar: 'JD', role: 'Admin' },
        action: 'approved',
        target: 'Weekly Tips Thread',
        platform: 'twitter',
        timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    },
    {
        id: 'act_5',
        type: 'scheduled',
        user: { name: 'Jane Smith', avatar: 'JS', role: 'Editor' },
        action: 'scheduled for tomorrow',
        target: 'Weekly Tips Thread',
        details: 'Scheduled for 9:00 AM',
        platform: 'twitter',
        timestamp: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
    },
    {
        id: 'act_6',
        type: 'published',
        user: { name: 'System', avatar: '🤖', role: 'System' },
        action: 'auto-published',
        target: 'Monday Motivation',
        platform: 'instagram',
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
        id: 'act_7',
        type: 'login',
        user: { name: 'Mike Johnson', avatar: 'MJ', role: 'Reviewer' },
        action: 'logged in',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    },
    {
        id: 'act_8',
        type: 'settings_changed',
        user: { name: 'John Doe', avatar: 'JD', role: 'Admin' },
        action: 'updated posting schedule',
        details: 'Changed default time from 10 AM to 11 AM',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
    },
]

// GET - Fetch activity feed
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const user = searchParams.get('user')

    let filtered = activityFeed

    if (type && type !== 'all') {
        filtered = filtered.filter(a => a.type === type)
    }

    if (user) {
        filtered = filtered.filter(a => a.user.name.toLowerCase().includes(user.toLowerCase()))
    }

    // Sort by timestamp descending
    filtered = filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Get team stats
    const teamMembers = [...new Set(activityFeed.map(a => a.user.name))].filter(n => n !== 'System')
    const activityByType = activityFeed.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
        activities: filtered.slice(0, limit),
        total: filtered.length,
        stats: {
            totalActions: activityFeed.length,
            teamMembers: teamMembers.length,
            actionsToday: activityFeed.filter(a => new Date(a.timestamp) > new Date(Date.now() - 86400000)).length,
            byType: activityByType
        }
    })
}

// POST - Log new activity
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const newActivity: ActivityItem = {
            id: `act_${Date.now()}`,
            type: body.type,
            user: body.user || { name: 'Current User', avatar: 'CU', role: 'Member' },
            action: body.action,
            target: body.target,
            details: body.details,
            platform: body.platform,
            timestamp: new Date().toISOString()
        }

        activityFeed.unshift(newActivity)

        return NextResponse.json({ success: true, activity: newActivity })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 })
    }
}
