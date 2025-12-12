'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Flame, Heart, MessageCircle } from 'lucide-react'

interface ReelCardProps {
    reel: {
        id: string
        username: string
        displayName: string
        caption: string
        thumbnail?: string
        likes: number
        comments: number
        viralScore: number
        url: string
    }
    index: number
}

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
}

export default function ReelCard({ reel, index }: ReelCardProps) {
    const [imageError, setImageError] = useState(false)

    // Use our proxy API that caches Instagram images server-side
    const thumbnailUrl = `/api/instagram/image-proxy?shortcode=${reel.id}`

    // Generate fallback gradient based on username
    const gradientBg = `linear-gradient(135deg, 
        hsl(${(reel.username?.charCodeAt(0) || 0) * 5 % 360}, 80%, 60%), 
        hsl(${((reel.username?.charCodeAt(1) || 0) * 7 + 60) % 360}, 70%, 50%))`

    return (
        <motion.a
            variants={item}
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border-2 border-black hover:-translate-y-2 hover:shadow-[6px_6px_0px_0px_#EC4899] transition-all group cursor-pointer overflow-hidden"
        >
            {/* Thumbnail */}
            <div
                className="relative aspect-[9/16] overflow-hidden bg-gray-200"
                style={{ background: imageError ? gradientBg : undefined }}
            >
                {/* Actual thumbnail image */}
                {!imageError && (
                    <img
                        src={thumbnailUrl}
                        alt={reel.caption?.slice(0, 50)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                )}

                {/* Fallback caption when image fails */}
                {imageError && (
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                        <div className="text-white text-sm font-bold line-clamp-4 drop-shadow-lg">
                            {reel.caption?.slice(0, 120)}...
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border-2 border-white/40">
                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Play overlay on hover */}
                {!imageError && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-black">
                            <Play className="w-8 h-8 text-pink-500 fill-current ml-1" />
                        </div>
                    </div>
                )}

                {/* Viral Score Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 border-2 border-black shadow-lg">
                    <Flame className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-black">{reel.viralScore || 50}</span>
                </div>

                {/* Instagram Icon */}
                <div className="absolute bottom-3 right-3 w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center border border-white/30">
                    <span className="text-white font-black text-xs">IG</span>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs border border-black">
                        {reel.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-black text-sm truncate">@{reel.username}</p>
                        <p className="text-xs text-gray-500 truncate">{reel.displayName}</p>
                    </div>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">{reel.caption?.slice(0, 80)}...</p>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1 text-red-500">
                        <Heart className="w-3 h-3" />
                        {reel.likes >= 1000000 ? `${(reel.likes / 1000000).toFixed(1)}M` : reel.likes >= 1000 ? `${(reel.likes / 1000).toFixed(1)}K` : reel.likes}
                    </span>
                    <span className="flex items-center gap-1 text-blue-500">
                        <MessageCircle className="w-3 h-3" />
                        {reel.comments >= 1000 ? `${(reel.comments / 1000).toFixed(1)}K` : reel.comments}
                    </span>
                </div>
            </div>
        </motion.a>
    )
}
