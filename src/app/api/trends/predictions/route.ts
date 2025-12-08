import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/ai'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { currentTrends, industry, region } = body

        if (!currentTrends || !Array.isArray(currentTrends)) {
            return NextResponse.json({ error: 'Current trends required' }, { status: 400 })
        }

        const prompt = `You are a trend analyst and prediction expert. Based on the following currently trending topics, predict what will likely trend in the next 24-48 hours.

Current Trending Topics:
${currentTrends.slice(0, 15).map((t: string, i: number) => `${i + 1}. ${t}`).join('\n')}

${industry ? `Industry Focus: ${industry}` : ''}
${region ? `Region: ${region}` : ''}

Analyze patterns, seasonality, related topics, and emerging themes. Provide predictions in this JSON format:
{
    "predictions": [
        {
            "topic": "Predicted trending topic",
            "confidence": "HIGH/MEDIUM/LOW",
            "reasoning": "Why this will likely trend",
            "timeframe": "Next 12h/24h/48h",
            "relatedTo": "Which current trend this relates to",
            "contentTip": "Quick content suggestion for this prediction"
        }
    ],
    "emergingThemes": ["Theme 1", "Theme 2", "Theme 3"],
    "watchList": ["Topic to monitor 1", "Topic to monitor 2"],
    "analysis": "Brief overall analysis of trend patterns"
}

Provide 5-7 predictions. Be specific and actionable.`

        const aiResponse = await generateContent(prompt)

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('Failed to parse AI response')
        }

        const predictions = JSON.parse(jsonMatch[0])

        return NextResponse.json({
            success: true,
            data: {
                ...predictions,
                generatedAt: new Date().toISOString(),
                basedOn: currentTrends.length + ' current trends',
            }
        })
    } catch (error: any) {
        console.error('Prediction error:', error)
        return NextResponse.json({
            error: error.message || 'Failed to generate predictions'
        }, { status: 500 })
    }
}
