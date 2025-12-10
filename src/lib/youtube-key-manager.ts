/**
 * YouTube Multi-Key Manager
 * Rotates between 11 API keys for 110,000 daily quota
 * Auto-failover when quota exhausted
 */

interface KeyStatus {
    key: string
    usedToday: number
    lastUsed: Date | null
    isExhausted: boolean
    errorCount: number
}

// 21 YouTube API Keys from different projects = 210,000 quota/day!
const YOUTUBE_API_KEYS = [
    // Original 11 keys
    'AIzaSyA3iYhZKZmAd0ineTnYPoYr88GCvPftvZY',
    'AIzaSyC6tp3u8bHbpxCchsz3EXKx_R1cocqf8J0',
    'AIzaSyDTNa8lapxmD1F-CcAliH811dpEK87XUsE',
    'AIzaSyB6PhTkStlnCYIRwhdR6yzE4tYRokMgy3k',
    'AIzaSyAZVU7JoJ0REaf3HsC0U26vAtH35d7x5rg',
    'AIzaSyAocfOJmnWdTYb2BHANc9S-IkXWbK0Yrho',
    'AIzaSyDkxbbv5CvwpyKJG2czYCGf8fdknn4QYaE',
    'AIzaSyBKqzW2dhFrlPwL55oZWnaGqk2Qja9LcSY',
    'AIzaSyASIz4Fccf6bXfgao5KU5QnOmvN6S0z0q0',
    'AIzaSyDHTJSZ8AGuUQJTjhy2o2jRvSTWBVMrn4s',
    'AIzaSyD-LwsjwET3kNCWlq-RoVEs_m_L-_rwR0w',
    // 10 new keys
    'AIzaSyB8Zoky8ERGiclB5D9OkalYuDFeYjKIADQ',
    'AIzaSyBz21UMDDEtcD9XuKDui2heGWOd0I0q5b4',
    'AIzaSyCN_tdWMhi2vvj5NSFlMA-q_S9hAEuiQJU',
    'AIzaSyB97y9keMXMPGuOrLQZf0o6aQE37ynEpAs',
    'AIzaSyCJGKGJR1GaOog8dBj_9-qmIyTMMUY7SJ4',
    'AIzaSyCdylwaSeG-lbUhxunHY5RQmHwYgEjAfls',
    'AIzaSyAWpeD4D6jshS5CnUlYLhgkFqpBvblAdGc',
    'AIzaSyCELpsyCkGwGgX6NxDaCuVKxxuaR50t9WY',
    'AIzaSyC7W3DbzylvdrzzISXneln7P4I9zLc-2Sw',
    'AIzaSyAvOGpxjuLh3s_LnJStm1KYybqJnD7qOoY',
]

// In-memory key status (resets on server restart)
// For production, consider storing in Redis or database
let keyStatuses: KeyStatus[] = YOUTUBE_API_KEYS.map(key => ({
    key,
    usedToday: 0,
    lastUsed: null,
    isExhausted: false,
    errorCount: 0
}))

let currentKeyIndex = 0
let lastResetDate = new Date().toDateString()

// Reset daily quotas at midnight
function checkDailyReset() {
    const today = new Date().toDateString()
    if (today !== lastResetDate) {
        console.log('[YouTube Key Manager] Daily reset - all keys refreshed')
        keyStatuses = keyStatuses.map(status => ({
            ...status,
            usedToday: 0,
            isExhausted: false,
            errorCount: 0
        }))
        lastResetDate = today
    }
}

/**
 * Get the next available API key using round-robin rotation
 */
export function getNextKey(): string | null {
    checkDailyReset()

    const startIndex = currentKeyIndex
    let attempts = 0

    while (attempts < YOUTUBE_API_KEYS.length) {
        const status = keyStatuses[currentKeyIndex]

        if (!status.isExhausted && status.errorCount < 3) {
            const key = status.key

            // Move to next key for next request (round-robin)
            currentKeyIndex = (currentKeyIndex + 1) % YOUTUBE_API_KEYS.length

            return key
        }

        // Try next key
        currentKeyIndex = (currentKeyIndex + 1) % YOUTUBE_API_KEYS.length
        attempts++
    }

    console.error('[YouTube Key Manager] All keys exhausted!')
    return null
}

/**
 * Mark a key as used (add to quota count)
 */
export function markKeyUsed(key: string, units: number = 100) {
    const status = keyStatuses.find(s => s.key === key)
    if (status) {
        status.usedToday += units
        status.lastUsed = new Date()

        // Mark as exhausted if close to 10,000 limit
        if (status.usedToday >= 9500) {
            status.isExhausted = true
            console.log(`[YouTube Key Manager] Key ${key.slice(-8)} exhausted (${status.usedToday} units)`)
        }
    }
}

/**
 * Handle quota exceeded error
 */
export function markKeyExhausted(key: string) {
    const status = keyStatuses.find(s => s.key === key)
    if (status) {
        status.isExhausted = true
        status.errorCount++
        console.log(`[YouTube Key Manager] Key ${key.slice(-8)} marked exhausted due to quota error`)
    }
}

/**
 * Handle general API error
 */
export function markKeyError(key: string) {
    const status = keyStatuses.find(s => s.key === key)
    if (status) {
        status.errorCount++
        if (status.errorCount >= 3) {
            status.isExhausted = true
            console.log(`[YouTube Key Manager] Key ${key.slice(-8)} disabled after 3 errors`)
        }
    }
}

/**
 * Get status of all keys for admin dashboard
 */
export function getKeyStatuses() {
    checkDailyReset()

    const totalQuota = YOUTUBE_API_KEYS.length * 10000
    const usedQuota = keyStatuses.reduce((sum, s) => sum + s.usedToday, 0)
    const activeKeys = keyStatuses.filter(s => !s.isExhausted).length

    return {
        totalKeys: YOUTUBE_API_KEYS.length,
        activeKeys,
        exhaustedKeys: YOUTUBE_API_KEYS.length - activeKeys,
        totalQuota,
        usedQuota,
        remainingQuota: totalQuota - usedQuota,
        percentUsed: Math.round((usedQuota / totalQuota) * 100),
        keys: keyStatuses.map(s => ({
            keyPreview: `...${s.key.slice(-8)}`,
            usedToday: s.usedToday,
            isExhausted: s.isExhausted,
            errorCount: s.errorCount,
            lastUsed: s.lastUsed
        }))
    }
}

/**
 * Make a YouTube API request with automatic key rotation and retry
 */
export async function youtubeApiRequest(
    endpoint: string,
    params: Record<string, string>,
    retries: number = 3
): Promise<any> {
    for (let attempt = 0; attempt < retries; attempt++) {
        const key = getNextKey()

        if (!key) {
            throw new Error('All YouTube API keys exhausted. Please wait until quota resets.')
        }

        const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`)
        url.searchParams.set('key', key)

        for (const [k, v] of Object.entries(params)) {
            url.searchParams.set(k, v)
        }

        try {
            const response = await fetch(url.toString())
            const data = await response.json()

            if (response.ok) {
                // Success - mark key as used
                markKeyUsed(key, endpoint === 'search' ? 100 : 1)
                return data
            }

            // Handle quota exceeded
            if (response.status === 403 && data.error?.errors?.[0]?.reason === 'quotaExceeded') {
                console.log(`[YouTube Key Manager] Quota exceeded for key ${key.slice(-8)}, rotating...`)
                markKeyExhausted(key)
                continue // Try next key
            }

            // Handle other errors
            if (response.status === 400 || response.status === 403) {
                markKeyError(key)
                console.error(`[YouTube Key Manager] API error: ${JSON.stringify(data.error)}`)
                continue // Try next key
            }

            throw new Error(data.error?.message || 'YouTube API error')

        } catch (error: any) {
            markKeyError(key)
            console.error(`[YouTube Key Manager] Request failed: ${error.message}`)

            if (attempt === retries - 1) {
                throw error
            }
        }
    }

    throw new Error('YouTube API request failed after all retries')
}

/**
 * Search YouTube videos with automatic key rotation
 */
export async function searchYouTube(query: string, maxResults: number = 10) {
    return youtubeApiRequest('search', {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxResults.toString(),
        order: 'relevance',
        videoDuration: 'medium',
        publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    })
}

/**
 * Get video details with automatic key rotation
 */
export async function getVideoDetails(videoIds: string[]) {
    return youtubeApiRequest('videos', {
        part: 'snippet,statistics,contentDetails',
        id: videoIds.join(',')
    })
}
