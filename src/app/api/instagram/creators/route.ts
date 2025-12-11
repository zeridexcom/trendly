import { NextRequest, NextResponse } from 'next/server'

// Top creators database by niche
const TOP_CREATORS: Record<string, any[]> = {
    TECH: [
        { username: 'mkbhd', name: 'Marques Brownlee', followers: '4.5M', engagement: '5.2%', style: 'Clean tech reviews', contentType: 'Reviews/Tutorials', postFrequency: 'Daily' },
        { username: 'ijustine', name: 'iJustine', followers: '2.1M', engagement: '4.8%', style: 'Enthusiastic unboxings', contentType: 'Unboxings/Vlogs', postFrequency: '3-4x/week' },
        { username: 'mrwhosetheboss', name: 'Arun Maini', followers: '3.2M', engagement: '6.1%', style: 'Deep dives & comparisons', contentType: 'Reviews/Comparisons', postFrequency: 'Daily' },
        { username: 'techmeme', name: 'Tech News', followers: '890K', engagement: '3.5%', style: 'Breaking tech news', contentType: 'News/Updates', postFrequency: 'Multiple daily' },
        { username: 'verge', name: 'The Verge', followers: '2.8M', engagement: '3.2%', style: 'Media company coverage', contentType: 'News/Reviews', postFrequency: 'Multiple daily' },
    ],
    GAMING: [
        { username: 'ninja', name: 'Ninja', followers: '12M', engagement: '4.5%', style: 'High-energy gameplay', contentType: 'Gaming/Clips', postFrequency: 'Daily' },
        { username: 'pokimane', name: 'Pokimane', followers: '6.8M', engagement: '5.8%', style: 'Personality-driven', contentType: 'Gaming/Lifestyle', postFrequency: 'Daily' },
        { username: 'shroud', name: 'Shroud', followers: '3.5M', engagement: '4.2%', style: 'Pro-level plays', contentType: 'Gaming Clips', postFrequency: '3-4x/week' },
        { username: 'valkyrae', name: 'Valkyrae', followers: '4.2M', engagement: '6.3%', style: 'Variety gaming', contentType: 'Gaming/Personal', postFrequency: 'Daily' },
        { username: 'timthetatman', name: 'TimTheTatman', followers: '2.9M', engagement: '5.1%', style: 'Entertainment focus', contentType: 'Gaming/Comedy', postFrequency: '4-5x/week' },
    ],
    ENTERTAINMENT: [
        { username: 'therock', name: 'Dwayne Johnson', followers: '395M', engagement: '1.2%', style: 'Motivational + BTS', contentType: 'Lifestyle/Promo', postFrequency: 'Daily' },
        { username: 'khaby.lame', name: 'Khaby Lame', followers: '82M', engagement: '3.5%', style: 'Silent comedy', contentType: 'Comedy/Reactions', postFrequency: 'Daily' },
        { username: 'willsmith', name: 'Will Smith', followers: '62M', engagement: '2.1%', style: 'Variety content', contentType: 'Comedy/Lifestyle', postFrequency: '3-4x/week' },
        { username: 'zendaya', name: 'Zendaya', followers: '185M', engagement: '2.8%', style: 'Fashion forward', contentType: 'Fashion/Promo', postFrequency: '2-3x/week' },
        { username: 'selenagomez', name: 'Selena Gomez', followers: '430M', engagement: '1.5%', style: 'Authentic personal', contentType: 'Lifestyle/Music', postFrequency: 'Weekly' },
    ],
    FOOD: [
        { username: 'gordonramsay', name: 'Gordon Ramsay', followers: '18M', engagement: '4.2%', style: 'Quick recipes + humor', contentType: 'Recipes/Reactions', postFrequency: 'Daily' },
        { username: 'salt_bae', name: 'Salt Bae', followers: '52M', engagement: '2.5%', style: 'Signature style', contentType: 'Cooking/Show', postFrequency: '3-4x/week' },
        { username: 'cookingwithshereen', name: 'Shereen', followers: '3.2M', engagement: '6.8%', style: 'Easy recipes', contentType: 'Recipes/Tips', postFrequency: 'Daily' },
        { username: 'joshuaweissman', name: 'Joshua Weissman', followers: '2.8M', engagement: '5.5%', style: 'But better series', contentType: 'Recipes/Education', postFrequency: '4-5x/week' },
        { username: 'babishculinary', name: 'Babish', followers: '1.9M', engagement: '4.8%', style: 'Recipe recreations', contentType: 'Recipes/Entertainment', postFrequency: '3x/week' },
    ],
    FITNESS: [
        { username: 'kaikigreene', name: 'Kai Greene', followers: '4.8M', engagement: '3.2%', style: 'Bodybuilding motivation', contentType: 'Workout/Motivation', postFrequency: 'Daily' },
        { username: 'blogilates', name: 'Cassey Ho', followers: '2.1M', engagement: '5.5%', style: 'Fun workouts', contentType: 'Workout/Tips', postFrequency: 'Daily' },
        { username: 'chloeting', name: 'Chloe Ting', followers: '3.8M', engagement: '4.8%', style: 'Challenge programs', contentType: 'Workout/Challenges', postFrequency: 'Daily' },
        { username: 'davidlaid', name: 'David Laid', followers: '3.5M', engagement: '4.2%', style: 'Transformation content', contentType: 'Workout/Lifestyle', postFrequency: '3-4x/week' },
        { username: 'jeffnippard', name: 'Jeff Nippard', followers: '1.2M', engagement: '6.1%', style: 'Science-based', contentType: 'Education/Workout', postFrequency: '4-5x/week' },
    ],
    FASHION: [
        { username: 'chiara_ferragni', name: 'Chiara Ferragni', followers: '29M', engagement: '2.5%', style: 'High fashion lifestyle', contentType: 'Fashion/Lifestyle', postFrequency: 'Daily' },
        { username: 'emmachamberlain', name: 'Emma Chamberlain', followers: '16M', engagement: '3.8%', style: 'Authentic casual', contentType: 'Fashion/Lifestyle', postFrequency: '3-4x/week' },
        { username: 'looksbylexie', name: 'Lexie', followers: '1.8M', engagement: '7.2%', style: 'Affordable fashion', contentType: 'OOTD/Tips', postFrequency: 'Daily' },
        { username: 'brittany_xavier', name: 'Brittany Xavier', followers: '3.2M', engagement: '4.5%', style: 'Elevated basics', contentType: 'Fashion/Travel', postFrequency: 'Daily' },
        { username: 'weworewhat', name: 'Danielle Bernstein', followers: '3.1M', engagement: '3.9%', style: 'Street style', contentType: 'Fashion/Business', postFrequency: 'Daily' },
    ],
    EDUCATION: [
        { username: 'tibees', name: 'Toby Hendy', followers: '890K', engagement: '5.8%', style: 'Math made fun', contentType: 'Education/Science', postFrequency: '2-3x/week' },
        { username: 'haborymoon', name: 'Study Tips', followers: '1.2M', engagement: '6.5%', style: 'Study aesthetics', contentType: 'Study Tips/Motivation', postFrequency: 'Daily' },
        { username: 'studyquill', name: 'Ruby Granger', followers: '580K', engagement: '7.1%', style: 'Productive routines', contentType: 'Study/Lifestyle', postFrequency: '4-5x/week' },
        { username: 'langfocus', name: 'Paul Jorgensen', followers: '420K', engagement: '5.2%', style: 'Language learning', contentType: 'Education', postFrequency: '2x/week' },
        { username: 'studytee', name: 'Study With Me', followers: '750K', engagement: '6.8%', style: 'ASMR study', contentType: 'Study/ASMR', postFrequency: 'Daily' },
    ],
    TRAVEL: [
        { username: 'funforlouis', name: 'Louis Cole', followers: '2.1M', engagement: '4.5%', style: 'Adventure travel', contentType: 'Travel/Vlogs', postFrequency: 'Daily' },
        { username: 'best_places', name: 'Best Places', followers: '4.8M', engagement: '3.2%', style: 'Destination showcase', contentType: 'Travel/Photos', postFrequency: 'Multiple daily' },
        { username: 'drewbinsky', name: 'Drew Binsky', followers: '2.5M', engagement: '5.1%', style: 'Every country', contentType: 'Travel/Culture', postFrequency: 'Daily' },
        { username: 'lexielarson', name: 'Lexie Limitless', followers: '890K', engagement: '6.8%', style: 'Solo female travel', contentType: 'Travel/Tips', postFrequency: '4-5x/week' },
        { username: 'chrisburkard', name: 'Chris Burkard', followers: '3.8M', engagement: '3.5%', style: 'Photography focused', contentType: 'Travel/Photography', postFrequency: '3-4x/week' },
    ],
    BUSINESS: [
        { username: 'garyvee', name: 'Gary Vaynerchuk', followers: '10.5M', engagement: '2.8%', style: 'Raw motivation', contentType: 'Motivation/Business', postFrequency: 'Multiple daily' },
        { username: 'alexhormozi', name: 'Alex Hormozi', followers: '2.8M', engagement: '5.5%', style: 'No-BS business', contentType: 'Business/Tips', postFrequency: 'Daily' },
        { username: 'hormozi', name: 'Leila Hormozi', followers: '1.2M', engagement: '6.2%', style: 'Business strategy', contentType: 'Business/Leadership', postFrequency: 'Daily' },
        { username: 'gabordon', name: 'Gabe Gordon', followers: '580K', engagement: '7.5%', style: 'Marketing hacks', contentType: 'Marketing/Tips', postFrequency: '4-5x/week' },
        { username: 'thefutur', name: 'The Futur', followers: '890K', engagement: '5.8%', style: 'Design business', contentType: 'Business/Design', postFrequency: 'Daily' },
    ],
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const niche = searchParams.get('niche')?.toUpperCase() || 'TECH'
    const limit = parseInt(searchParams.get('limit') || '10')

    const creators = (TOP_CREATORS[niche] || TOP_CREATORS['TECH']).slice(0, limit)

    // Add calculated data
    const enrichedCreators = creators.map((creator, i) => ({
        ...creator,
        rank: i + 1,
        profileUrl: `https://instagram.com/${creator.username}`,
        whyFollow: getWhyFollow(creator),
    }))

    return NextResponse.json({
        success: true,
        niche,
        creators: enrichedCreators,
        niches: Object.keys(TOP_CREATORS),
        updatedAt: new Date().toISOString()
    })
}

function getWhyFollow(creator: any): string {
    const engagementNum = parseFloat(creator.engagement)
    if (engagementNum > 6) return "Extremely high engagement - study their content strategy"
    if (engagementNum > 4) return "Great engagement - good example of what works"
    if (creator.followers.includes('M') && parseFloat(creator.followers) > 10) return "Massive reach - see how they scale content"
    return "Consistent content creator - learn their posting habits"
}
