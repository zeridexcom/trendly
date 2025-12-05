'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    Sparkles,
    TrendingUp,
    Lightbulb,
    ArrowRight,
    PlayCircle,
    Clock,
    MoreVertical,
    Plus,
    BarChart2,
    Users,
} from 'lucide-react'

export default function DashboardPage() {
    const [timeRange, setTimeRange] = useState('Weekly')

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8 h-full">
            {/* LEFT COLUMN - MAIN CONTENT */}
            <div className="flex flex-col gap-8 overflow-hidden">

                {/* HERO BANNER */}
                <div className="relative w-full h-[200px] rounded-[24px] overflow-hidden p-8 flex items-center justify-between shadow-lg shadow-[#6C5DD3]/20">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-[#6C5DD3] z-0">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#8979E8] rounded-full blur-[60px] opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#5B4EC1] rounded-full blur-[40px] opacity-60 -translate-x-1/2 translate-y-1/2"></div>
                    </div>

                    <div className="relative z-10 text-white max-w-lg">
                        <span className="inline-block py-1 px-3 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-3 border border-white/10">
                            AI-POWERED PLATFORM
                        </span>
                        <h1 className="text-3xl font-bold mb-4 leading-tight">
                            Scale Your Content with<br />
                            Intelligent Generation
                        </h1>
                        <button className="bg-white text-[#6C5DD3] px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-gray-50 transition-colors flex items-center gap-2">
                            Generate Now <div className="bg-[#6C5DD3] rounded-full p-1"><ArrowRight size={12} className="text-white" /></div>
                        </button>
                    </div>

                    {/* Decorative Sparkle (CSS-based) */}
                    <div className="relative z-10 hidden md:block">
                        <Sparkles size={120} className="text-white/10 rotate-12" />
                    </div>
                </div>

                {/* PROGRESS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Total Ideas', count: '128', sub: '24 this week', icon: Lightbulb, color: '#6C5DD3', bg: '#EBE9F7' },
                        { label: 'Scheduled', count: '12', sub: 'Next: Tue 2pm', icon: Clock, color: '#FF754C', bg: '#FFF0EC' },
                        { label: 'Published', count: '45', sub: '+12% growth', icon: TrendingUp, color: '#3F8CFF', bg: '#EBF3FF' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: stat.bg, color: stat.color }}
                            >
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[#11142D]">{stat.count}</h3>
                                <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                            </div>
                            <div className="ml-auto">
                                <button className="text-gray-300 hover:text-gray-500"><MoreVertical size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ACTIVE TRENDS (Replaces "Continue Watching") */}
                <div>
                    <div className="flex items-center justify-between mb-5 px-1">
                        <h2 className="text-xl font-bold text-[#11142D]">Trending Now</h2>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#6C5DD3] hover:border-[#6C5DD3] transition-colors">
                                <ArrowRight size={16} className="rotate-180" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center shadow-lg shadow-[#6C5DD3]/30">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'AI Art Showcase', tag: 'Instagram', img: 'bg-gradient-to-br from-purple-500 to-indigo-600', views: '2.4k' },
                            { title: 'POV: Daily Life', tag: 'TikTok', img: 'bg-gradient-to-br from-pink-500 to-rose-500', views: '1.8k' },
                            { title: 'Tech Layoffs', tag: 'LinkedIn', img: 'bg-gradient-to-br from-blue-500 to-cyan-500', views: '500' },
                        ].map((trend, i) => (
                            <div key={i} className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer border border-gray-100">
                                <div className={`h-32 w-full ${trend.img} relative p-4 flex flex-col justify-between`}>
                                    <span className="self-end bg-black/20 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-bold">
                                        {trend.views} Uses
                                    </span>
                                    <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        <PlayCircle size={16} fill="white" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <span className="text-[10px] font-bold text-[#6C5DD3] bg-[#EBE9F7] px-2 py-1 rounded-md mb-2 inline-block">
                                        {trend.tag}
                                    </span>
                                    <h3 className="text-sm font-bold text-[#11142D] group-hover:text-[#6C5DD3] transition-colors">
                                        {trend.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">High engagement potential</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LIST SECTION (Replaces "Your Lesson") */}
                <div>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-xl font-bold text-[#11142D]">Recent Ideas</h2>
                        <Link href="/dashboard/ideas" className="text-sm font-semibold text-[#6C5DD3] hover:underline">See all</Link>
                    </div>

                    <div className="bg-white rounded-[24px] p-2 shadow-sm border border-gray-100">
                        {[
                            { title: 'Product Launch Teaser', platform: 'Instagram', author: 'Jason Ranti', date: '2/16/2024' },
                            { title: 'Weekly Recap Thread', platform: 'Twitter', author: 'Sarah Chen', date: '2/15/2024' },
                            { title: 'Tutorial: AI Features', platform: 'YouTube', author: 'Mike Johnson', date: '2/14/2024' },
                        ].map((idea, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${idea.author}`} className="w-full h-full" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#11142D] mb-1">{idea.title}</h4>
                                        <p className="text-xs text-gray-400">{idea.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <span className="px-3 py-1 rounded-full bg-[#EBE9F7] text-[#6C5DD3] text-xs font-bold w-24 text-center hidden md:block">
                                        {idea.platform}
                                    </span>
                                    <p className="text-xs font-semibold text-[#11142D] w-32 hidden md:block truncate">Created by {idea.author}</p>

                                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#6C5DD3] hover:text-[#6C5DD3] transition-colors">
                                        <ArrowRight size={14} className="-rotate-45" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* RIGHT COLUMN - STATS PANEL */}
            <div className="hidden xl:flex flex-col gap-8">

                {/* Profile Card */}
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 text-center relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-[#11142D] text-left">Statistic</h3>
                        <button className="text-gray-400 hover:text-[#6C5DD3]"><MoreVertical size={16} /></button>
                    </div>

                    <div className="relative w-24 h-24 mx-auto mb-4">
                        {/* Ring SVG */}
                        <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EBE9F7" strokeWidth="2" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6C5DD3" strokeWidth="2" strokeDasharray="75, 100" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center p-2">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jason" className="w-full h-full rounded-full bg-[#FFE2E5]" />
                        </div>
                        <span className="absolute top-0 right-0 bg-[#6C5DD3] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                            32%
                        </span>
                    </div>

                    <h4 className="text-lg font-bold text-[#11142D]">Good Morning Jason 🔥</h4>
                    <p className="text-xs text-gray-400 mt-1 mb-6">Continue your planning to achieve your target!</p>

                    {/* Chart Area */}
                    <div className="bg-[#F9FAFB] rounded-xl p-4 h-[180px] flex items-end justify-between gap-2">
                        {[40, 65, 30, 85, 50].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                <div
                                    className="w-full bg-[#EBE9F7] rounded-t-md hover:bg-[#6C5DD3] transition-colors cursor-pointer relative group"
                                    style={{ height: `${h}%` }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#11142D] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {h} Posts
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium">Aug {10 + i}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mentors / Team */}
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#11142D]">Your Team</h3>
                        <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#6C5DD3] hover:border-[#6C5DD3]">
                            <Plus size={12} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'Padhang Satrio', role: 'Designer', seed: 'Padhang' },
                            { name: 'Zakir Horizontal', role: 'Editor', seed: 'Zakir' },
                            { name: 'Leonardo Samsul', role: 'Admin', seed: 'Leonardo' },
                        ].map((member, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.seed}`} className="w-full h-full" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold text-[#11142D]">{member.name}</h5>
                                        <p className="text-[10px] text-gray-400 font-medium">{member.role}</p>
                                    </div>
                                </div>
                                <button className="text-[#6C5DD3] text-xs font-bold border border-[#F0EFFB] px-3 py-1.5 rounded-full hover:bg-[#6C5DD3] hover:text-white transition-colors flex items-center gap-1">
                                    <Users size={12} /> Chat
                                </button>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-3 bg-[#F5F6FA] text-[#6C5DD3] rounded-xl text-xs font-bold hover:bg-[#EBE9F7] transition-colors">
                        See All
                    </button>
                </div>

            </div>

        </div>
    )
}
