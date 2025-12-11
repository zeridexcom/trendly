import { NextRequest, NextResponse } from 'next/server'

// Best posting times data based on engagement studies
const POSTING_TIMES = {
    general: {
        best: [
            { day: 'Monday', times: ['11:00 AM', '1:00 PM'], engagement: 'High' },
            { day: 'Tuesday', times: ['9:00 AM', '12:00 PM', '7:00 PM'], engagement: 'Very High' },
            { day: 'Wednesday', times: ['11:00 AM', '3:00 PM'], engagement: 'High' },
            { day: 'Thursday', times: ['12:00 PM', '7:00 PM'], engagement: 'Very High' },
            { day: 'Friday', times: ['2:00 PM', '5:00 PM'], engagement: 'Medium-High' },
            { day: 'Saturday', times: ['9:00 AM', '11:00 AM'], engagement: 'Medium' },
            { day: 'Sunday', times: ['10:00 AM', '7:00 PM'], engagement: 'High' },
        ],
        avoid: ['3:00 AM - 6:00 AM', 'Weekdays after 9:00 PM'],
        peakDays: ['Tuesday', 'Thursday'],
        tip: 'Post when your audience is taking breaks - lunch time and after work perform best.'
    },
    byNiche: {
        TECH: {
            bestTimes: ['9:00 AM', '12:00 PM', '6:00 PM'],
            bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
            tip: 'Tech audiences are most active during work hours and early evening.',
            peakHour: '12:00 PM'
        },
        GAMING: {
            bestTimes: ['3:00 PM', '7:00 PM', '10:00 PM'],
            bestDays: ['Friday', 'Saturday', 'Sunday'],
            tip: 'Gamers are most active in evenings and weekends.',
            peakHour: '7:00 PM'
        },
        ENTERTAINMENT: {
            bestTimes: ['11:00 AM', '2:00 PM', '8:00 PM'],
            bestDays: ['Thursday', 'Friday', 'Saturday'],
            tip: 'Entertainment peaks around lunch and evening relaxation time.',
            peakHour: '8:00 PM'
        },
        FOOD: {
            bestTimes: ['7:00 AM', '12:00 PM', '5:00 PM'],
            bestDays: ['Sunday', 'Monday', 'Wednesday'],
            tip: 'Post around mealtimes when people are thinking about food.',
            peakHour: '12:00 PM'
        },
        FITNESS: {
            bestTimes: ['6:00 AM', '12:00 PM', '5:00 PM'],
            bestDays: ['Monday', 'Tuesday', 'Wednesday'],
            tip: 'Fitness content performs best early morning and before gym sessions.',
            peakHour: '6:00 AM'
        },
        FASHION: {
            bestTimes: ['9:00 AM', '1:00 PM', '7:00 PM'],
            bestDays: ['Wednesday', 'Friday', 'Saturday'],
            tip: 'Fashion content peaks during morning routines and weekend planning.',
            peakHour: '9:00 AM'
        },
        EDUCATION: {
            bestTimes: ['8:00 AM', '4:00 PM', '8:00 PM'],
            bestDays: ['Monday', 'Tuesday', 'Sunday'],
            tip: 'Educational content works best at start/end of day when people want to learn.',
            peakHour: '8:00 AM'
        },
        TRAVEL: {
            bestTimes: ['10:00 AM', '1:00 PM', '7:00 PM'],
            bestDays: ['Thursday', 'Friday', 'Sunday'],
            tip: 'Travel dreaming happens mid-week and weekend planning time.',
            peakHour: '10:00 AM'
        },
        BUSINESS: {
            bestTimes: ['7:00 AM', '12:00 PM', '6:00 PM'],
            bestDays: ['Tuesday', 'Wednesday', 'LinkedIn = Tues-Thurs'],
            tip: 'Business content performs best during commute and lunch breaks.',
            peakHour: '7:00 AM'
        },
    },
    reelsVsPosts: {
        reels: {
            bestTimes: ['9:00 AM', '12:00 PM', '7:00 PM'],
            note: 'Reels get 22% more engagement when posted during high-traffic hours'
        },
        carousels: {
            bestTimes: ['10:00 AM', '2:00 PM'],
            note: 'Carousels perform best mid-morning when people have time to swipe'
        },
        stories: {
            bestTimes: ['8:00 AM', '12:00 PM', '10:00 PM'],
            note: 'Stories work well early morning, lunch, and before bed'
        }
    },
    frequency: {
        reels: { min: 3, max: 7, optimal: 5, note: 'per week' },
        posts: { min: 3, max: 5, optimal: 4, note: 'per week' },
        stories: { min: 5, max: 15, optimal: 10, note: 'per day' },
        carousels: { min: 2, max: 4, optimal: 3, note: 'per week' },
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const niche = searchParams.get('niche')?.toUpperCase() || 'TECH'

    const nicheData = POSTING_TIMES.byNiche[niche as keyof typeof POSTING_TIMES.byNiche] || POSTING_TIMES.byNiche.TECH

    return NextResponse.json({
        success: true,
        niche,
        general: POSTING_TIMES.general,
        nicheSpecific: nicheData,
        contentTypes: POSTING_TIMES.reelsVsPosts,
        frequency: POSTING_TIMES.frequency,
        quickTips: [
            "🎯 Post consistently at the same times each day",
            "📊 Check your Instagram Insights for YOUR audience's active hours",
            "🔥 Reels posted at peak times get 40% more reach",
            "📱 Stories have short lifespan - post multiple per day",
            "⏰ Schedule posts when you're NOT available to engage - use the time after to reply to comments"
        ],
        updatedAt: new Date().toISOString()
    })
}
