import { NextRequest, NextResponse } from 'next/server'

// Types
interface ContentItem {
    id: string
    title: string
    content: string
    platform: string
    status: 'draft' | 'review' | 'approved' | 'scheduled' | 'published'
    createdBy: string
    createdAt: string
    updatedAt: string
    scheduledFor?: string
    reviewedBy?: string
    approvedBy?: string
    comments: { user: string; text: string; timestamp: string }[]
    history: { status: string; user: string; timestamp: string; note?: string }[]
}

// In-memory store
let contentItems: ContentItem[] = [
    {
        id: 'content_1',
        title: '10 Tips for Better Content',
        content: 'Here are 10 tips that will transform your content strategy...',
        platform: 'instagram',
        status: 'draft',
        createdBy: 'John Doe',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        history: [{ status: 'draft', user: 'John Doe', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() }]
    },
    {
        id: 'content_2',
        title: 'Behind the Scenes Video',
        content: 'A day in the life at our office...',
        platform: 'tiktok',
        status: 'review',
        createdBy: 'Jane Smith',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [{ user: 'John Doe', text: 'Love this concept!', timestamp: new Date().toISOString() }],
        history: [
            { status: 'draft', user: 'Jane Smith', timestamp: new Date(Date.now() - 86400000).toISOString() },
            { status: 'review', user: 'Jane Smith', timestamp: new Date(Date.now() - 3600000).toISOString(), note: 'Ready for review' }
        ]
    },
    {
        id: 'content_3',
        title: 'Product Launch Announcement',
        content: 'Exciting news! Our new product is launching...',
        platform: 'linkedin',
        status: 'approved',
        createdBy: 'Mike Johnson',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date().toISOString(),
        reviewedBy: 'Jane Smith',
        approvedBy: 'John Doe',
        comments: [],
        history: [
            { status: 'draft', user: 'Mike Johnson', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
            { status: 'review', user: 'Mike Johnson', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
            { status: 'approved', user: 'John Doe', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Looks great!' }
        ]
    },
    {
        id: 'content_4',
        title: 'Weekly Tips Thread',
        content: 'Thread: 5 productivity tips for creators...',
        platform: 'twitter',
        status: 'scheduled',
        createdBy: 'Jane Smith',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        updatedAt: new Date().toISOString(),
        scheduledFor: new Date(Date.now() + 86400000).toISOString(),
        reviewedBy: 'Mike Johnson',
        approvedBy: 'John Doe',
        comments: [],
        history: [
            { status: 'draft', user: 'Jane Smith', timestamp: new Date(Date.now() - 86400000 * 4).toISOString() },
            { status: 'review', user: 'Jane Smith', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
            { status: 'approved', user: 'John Doe', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
            { status: 'scheduled', user: 'Jane Smith', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Scheduled for tomorrow' }
        ]
    }
]

// GET - Fetch all content items
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let filtered = contentItems
    if (status && status !== 'all') {
        filtered = contentItems.filter(item => item.status === status)
    }

    const stats = {
        draft: contentItems.filter(i => i.status === 'draft').length,
        review: contentItems.filter(i => i.status === 'review').length,
        approved: contentItems.filter(i => i.status === 'approved').length,
        scheduled: contentItems.filter(i => i.status === 'scheduled').length,
        published: contentItems.filter(i => i.status === 'published').length,
    }

    return NextResponse.json({ items: filtered, stats, total: contentItems.length })
}

// POST - Create new content or update status
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        if (body.action === 'create') {
            const newItem: ContentItem = {
                id: `content_${Date.now()}`,
                title: body.title,
                content: body.content,
                platform: body.platform || 'instagram',
                status: 'draft',
                createdBy: body.user || 'Current User',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                comments: [],
                history: [{ status: 'draft', user: body.user || 'Current User', timestamp: new Date().toISOString() }]
            }
            contentItems.unshift(newItem)
            return NextResponse.json({ success: true, item: newItem })
        }

        if (body.action === 'updateStatus') {
            const index = contentItems.findIndex(i => i.id === body.id)
            if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

            const validTransitions: Record<string, string[]> = {
                draft: ['review'],
                review: ['draft', 'approved'],
                approved: ['review', 'scheduled'],
                scheduled: ['approved', 'published'],
                published: []
            }

            const currentStatus = contentItems[index].status
            if (!validTransitions[currentStatus]?.includes(body.newStatus)) {
                return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 })
            }

            contentItems[index].status = body.newStatus
            contentItems[index].updatedAt = new Date().toISOString()
            contentItems[index].history.push({
                status: body.newStatus,
                user: body.user || 'Current User',
                timestamp: new Date().toISOString(),
                note: body.note
            })

            if (body.newStatus === 'review') contentItems[index].reviewedBy = undefined
            if (body.newStatus === 'approved') {
                contentItems[index].reviewedBy = body.user
                contentItems[index].approvedBy = body.user
            }
            if (body.newStatus === 'scheduled') contentItems[index].scheduledFor = body.scheduledFor

            return NextResponse.json({ success: true, item: contentItems[index] })
        }

        if (body.action === 'comment') {
            const index = contentItems.findIndex(i => i.id === body.id)
            if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

            contentItems[index].comments.push({
                user: body.user || 'Current User',
                text: body.text,
                timestamp: new Date().toISOString()
            })

            return NextResponse.json({ success: true, item: contentItems[index] })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
    }
}

// DELETE - Remove content
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    contentItems = contentItems.filter(i => i.id !== id)
    return NextResponse.json({ success: true })
}
