import { NextRequest, NextResponse } from 'next/server'

// Types
interface TimeSlot {
    hour: number
    engagement: number // 0-100 score
    label: string
}

interface DayData {
    day: string
    slots: TimeSlot[]
    bestTime: string
    peakEngagement: number
}

interface PlatformData {
    platform: string
    icon: string
    color: string
    weeklyData: DayData[]
    topTimes: { time: string; day: string; score: number }[]
    algorithmTips: string[]
    avoidTimes: string[]
    audienceInsight: string
}

// Algorithm-based optimal times data (based on industry research)
const platformOptimalTimes: Record<string, PlatformData> = {
    instagram: {
        platform: 'Instagram',
        icon: '📸',
        color: '#E1306C',
        weeklyData: [
            { day: 'Monday', slots: generateDaySlots([7, 8, 12, 19, 21], [6, 9, 11, 13, 18, 20, 22]), bestTime: '12:00 PM', peakEngagement: 85 },
            { day: 'Tuesday', slots: generateDaySlots([8, 9, 12, 19], [7, 10, 11, 13, 18, 20, 21]), bestTime: '9:00 AM', peakEngagement: 88 },
            { day: 'Wednesday', slots: generateDaySlots([7, 11, 12, 19, 20], [8, 9, 10, 13, 18, 21]), bestTime: '11:00 AM', peakEngagement: 92 },
            { day: 'Thursday', slots: generateDaySlots([9, 12, 19, 20], [7, 8, 10, 11, 13, 18, 21]), bestTime: '12:00 PM', peakEngagement: 89 },
            { day: 'Friday', slots: generateDaySlots([9, 10, 11, 14, 15], [7, 8, 12, 13, 16, 17]), bestTime: '11:00 AM', peakEngagement: 86 },
            { day: 'Saturday', slots: generateDaySlots([9, 10, 11], [8, 12, 13, 14, 19, 20]), bestTime: '10:00 AM', peakEngagement: 78 },
            { day: 'Sunday', slots: generateDaySlots([10, 11, 19, 20], [9, 12, 13, 18, 21]), bestTime: '10:00 AM', peakEngagement: 75 },
        ],
        topTimes: [
            { time: '11:00 AM', day: 'Wednesday', score: 92 },
            { time: '9:00 AM', day: 'Tuesday', score: 88 },
            { time: '12:00 PM', day: 'Thursday', score: 89 },
        ],
        algorithmTips: [
            '📱 Post during commute hours (7-9 AM) when users open Instagram first',
            '⏰ The algorithm favors posts that get engagement in the first 30-60 minutes',
            '🔄 Reels get 2x more reach - post them during peak hours',
            '💬 Reply to comments quickly to boost your post in the algorithm',
            '📊 Stories posted 7-9 AM appear first in the feed all day',
        ],
        avoidTimes: ['1:00 AM - 5:00 AM', '3:00 PM - 4:00 PM (work focus time)'],
        audienceInsight: 'Instagram users are most active during morning commute, lunch break, and evening wind-down. Wednesdays show highest overall engagement.',
    },
    tiktok: {
        platform: 'TikTok',
        icon: '🎵',
        color: '#000000',
        weeklyData: [
            { day: 'Monday', slots: generateDaySlots([6, 10, 22], [7, 8, 9, 11, 19, 20, 21, 23]), bestTime: '6:00 AM', peakEngagement: 82 },
            { day: 'Tuesday', slots: generateDaySlots([2, 4, 9], [6, 7, 8, 10, 11, 19, 20, 21]), bestTime: '9:00 AM', peakEngagement: 90 },
            { day: 'Wednesday', slots: generateDaySlots([7, 8, 11], [6, 9, 10, 12, 19, 20, 21]), bestTime: '7:00 AM', peakEngagement: 88 },
            { day: 'Thursday', slots: generateDaySlots([9, 12, 19], [7, 8, 10, 11, 13, 20, 21]), bestTime: '12:00 PM', peakEngagement: 93 },
            { day: 'Friday', slots: generateDaySlots([5, 13, 15], [6, 7, 8, 9, 12, 14, 16, 19, 20]), bestTime: '5:00 AM', peakEngagement: 85 },
            { day: 'Saturday', slots: generateDaySlots([11, 19, 20], [9, 10, 12, 13, 18, 21]), bestTime: '11:00 AM', peakEngagement: 80 },
            { day: 'Sunday', slots: generateDaySlots([7, 8, 16], [9, 10, 11, 15, 17, 18, 19]), bestTime: '8:00 AM', peakEngagement: 78 },
        ],
        topTimes: [
            { time: '12:00 PM', day: 'Thursday', score: 93 },
            { time: '9:00 AM', day: 'Tuesday', score: 90 },
            { time: '7:00 AM', day: 'Wednesday', score: 88 },
        ],
        algorithmTips: [
            '🚀 TikTok tests your video with 300-500 users first - high early engagement = viral',
            '⏱️ Post when users are opening the app fresh (early morning, late night)',
            '🔊 Use trending sounds posted in the last 7 days for 2-3x reach',
            '📈 Videos under 15 seconds have higher completion rates = algorithm boost',
            '🔄 Post 1-4 times per day - TikTok rewards consistency heavily',
        ],
        avoidTimes: ['12:00 AM - 4:00 AM', '2:00 PM - 4:00 PM'],
        audienceInsight: 'TikTok users are night owls and early birds. The algorithm favors early morning posts when competition is low. Thursdays show highest viral potential.',
    },
    youtube: {
        platform: 'YouTube',
        icon: '▶️',
        color: '#FF0000',
        weeklyData: [
            { day: 'Monday', slots: generateDaySlots([14, 15, 16], [12, 13, 17, 18, 19, 20]), bestTime: '3:00 PM', peakEngagement: 82 },
            { day: 'Tuesday', slots: generateDaySlots([14, 15, 16], [12, 13, 17, 18, 19, 20]), bestTime: '3:00 PM', peakEngagement: 85 },
            { day: 'Wednesday', slots: generateDaySlots([14, 15, 16], [12, 13, 17, 18, 19, 20]), bestTime: '3:00 PM', peakEngagement: 86 },
            { day: 'Thursday', slots: generateDaySlots([12, 15, 16], [13, 14, 17, 18, 19, 20]), bestTime: '3:00 PM', peakEngagement: 88 },
            { day: 'Friday', slots: generateDaySlots([12, 15, 16], [13, 14, 17, 18, 19, 20]), bestTime: '3:00 PM', peakEngagement: 90 },
            { day: 'Saturday', slots: generateDaySlots([9, 10, 11], [8, 12, 13, 14, 15, 16]), bestTime: '10:00 AM', peakEngagement: 83 },
            { day: 'Sunday', slots: generateDaySlots([9, 10, 11], [8, 12, 13, 14, 15, 16]), bestTime: '10:00 AM', peakEngagement: 80 },
        ],
        topTimes: [
            { time: '3:00 PM', day: 'Friday', score: 90 },
            { time: '3:00 PM', day: 'Thursday', score: 88 },
            { time: '3:00 PM', day: 'Wednesday', score: 86 },
        ],
        algorithmTips: [
            '📤 Upload 2-3 hours BEFORE peak viewing time for processing',
            '👆 CTR (Click-Through Rate) in first 48 hours determines long-term reach',
            '⏰ Average View Duration is the #1 ranking factor - hook viewers early',
            '🔔 Publish consistently same day/time - subscribers get trained to expect it',
            '📱 Shorts: Post early morning for maximum discovery',
        ],
        avoidTimes: ['12:00 AM - 8:00 AM', 'Monday mornings'],
        audienceInsight: 'YouTube views build over time. Publish 2-3 hours before peak hours (evenings) so the algorithm can index your video. Fridays have highest session times.',
    },
    twitter: {
        platform: 'Twitter/X',
        icon: '𝕏',
        color: '#1DA1F2',
        weeklyData: [
            { day: 'Monday', slots: generateDaySlots([8, 9, 10], [7, 11, 12, 13, 17, 18, 19]), bestTime: '9:00 AM', peakEngagement: 84 },
            { day: 'Tuesday', slots: generateDaySlots([8, 9, 10], [7, 11, 12, 13, 17, 18, 19]), bestTime: '9:00 AM', peakEngagement: 88 },
            { day: 'Wednesday', slots: generateDaySlots([9, 10, 12], [8, 11, 13, 17, 18, 19]), bestTime: '9:00 AM', peakEngagement: 90 },
            { day: 'Thursday', slots: generateDaySlots([8, 9, 10], [7, 11, 12, 13, 17, 18]), bestTime: '9:00 AM', peakEngagement: 86 },
            { day: 'Friday', slots: generateDaySlots([9, 10, 11], [8, 12, 13, 14, 17, 18]), bestTime: '10:00 AM', peakEngagement: 82 },
            { day: 'Saturday', slots: generateDaySlots([10, 11], [9, 12, 13, 14]), bestTime: '10:00 AM', peakEngagement: 68 },
            { day: 'Sunday', slots: generateDaySlots([10, 11], [9, 12, 13, 14]), bestTime: '10:00 AM', peakEngagement: 65 },
        ],
        topTimes: [
            { time: '9:00 AM', day: 'Wednesday', score: 90 },
            { time: '9:00 AM', day: 'Tuesday', score: 88 },
            { time: '9:00 AM', day: 'Thursday', score: 86 },
        ],
        algorithmTips: [
            '🧵 Threads get 3x more engagement than single tweets',
            '⚡ First 30 minutes matter most - get engagement quickly',
            '📷 Tweets with images get 150% more retweets',
            '🔄 Reply to your own tweet to bump it in feeds',
            '🏷️ Use 1-2 hashtags max - more reduces reach',
        ],
        avoidTimes: ['10:00 PM - 6:00 AM', 'Weekend afternoons'],
        audienceInsight: 'Twitter is a workday platform. Mornings (8-10 AM) during work commute see highest engagement. Threads perform best mid-week.',
    },
    linkedin: {
        platform: 'LinkedIn',
        icon: '💼',
        color: '#0A66C2',
        weeklyData: [
            { day: 'Monday', slots: generateDaySlots([7, 8, 10, 12], [9, 11, 13, 17, 18]), bestTime: '8:00 AM', peakEngagement: 82 },
            { day: 'Tuesday', slots: generateDaySlots([7, 8, 10, 12], [9, 11, 13, 17, 18]), bestTime: '10:00 AM', peakEngagement: 90 },
            { day: 'Wednesday', slots: generateDaySlots([7, 8, 10, 12], [9, 11, 13, 17, 18]), bestTime: '12:00 PM', peakEngagement: 92 },
            { day: 'Thursday', slots: generateDaySlots([7, 8, 10, 12], [9, 11, 13, 17, 18]), bestTime: '10:00 AM', peakEngagement: 88 },
            { day: 'Friday', slots: generateDaySlots([8, 9, 10], [7, 11, 12, 13]), bestTime: '9:00 AM', peakEngagement: 75 },
            { day: 'Saturday', slots: generateDaySlots([10, 11], [9, 12]), bestTime: '10:00 AM', peakEngagement: 45 },
            { day: 'Sunday', slots: generateDaySlots([10, 11], [9, 12]), bestTime: '10:00 AM', peakEngagement: 42 },
        ],
        topTimes: [
            { time: '12:00 PM', day: 'Wednesday', score: 92 },
            { time: '10:00 AM', day: 'Tuesday', score: 90 },
            { time: '10:00 AM', day: 'Thursday', score: 88 },
        ],
        algorithmTips: [
            '📝 First 3 lines matter most - hook before "see more" button',
            '💬 Comments > Likes in the algorithm - ask questions',
            '🚫 Avoid external links in posts - put in comments instead',
            '📸 Documents/Carousels get 3x more reach than text posts',
            '⏰ Engage with others 15 min before AND after posting',
        ],
        avoidTimes: ['After 6:00 PM', 'Weekends'],
        audienceInsight: 'LinkedIn is strictly business hours. Tuesday-Thursday mornings see highest professional engagement. Avoid weekends entirely.',
    },
}

// Helper to generate day slots with engagement scores
function generateDaySlots(peakHours: number[], goodHours: number[]): TimeSlot[] {
    const slots: TimeSlot[] = []
    for (let hour = 0; hour < 24; hour++) {
        let engagement = 20 // base
        if (peakHours.includes(hour)) {
            engagement = 80 + Math.floor(Math.random() * 20) // 80-100
        } else if (goodHours.includes(hour)) {
            engagement = 50 + Math.floor(Math.random() * 25) // 50-75
        } else if (hour >= 6 && hour <= 22) {
            engagement = 25 + Math.floor(Math.random() * 20) // 25-45
        }
        slots.push({
            hour,
            engagement,
            label: formatHour(hour)
        })
    }
    return slots
}

function formatHour(hour: number): string {
    if (hour === 0) return '12 AM'
    if (hour === 12) return '12 PM'
    if (hour < 12) return `${hour} AM`
    return `${hour - 12} PM`
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform') || 'instagram'
    const timezone = searchParams.get('timezone') || 'UTC'

    const data = platformOptimalTimes[platform.toLowerCase()]

    if (!data) {
        return NextResponse.json(
            { error: 'Platform not found' },
            { status: 404 }
        )
    }

    // Get all platforms summary
    const allPlatforms = Object.entries(platformOptimalTimes).map(([key, val]) => ({
        id: key,
        name: val.platform,
        icon: val.icon,
        color: val.color,
        bestOverall: val.topTimes[0]
    }))

    return NextResponse.json({
        ...data,
        timezone,
        allPlatforms,
        lastUpdated: new Date().toISOString()
    })
}
