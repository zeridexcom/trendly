'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    ArrowUpRight,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
    Calendar,
    ArrowRight,
    BarChart3,
    Target,
    Flame,
    Clock,
    Eye,
    Heart,
    MessageCircle,
    Share2,
    Crown,
    Rocket,
    Star
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

// Mock data
const engagementData = [
    { name: 'Mon', value: 4000, prev: 3200 },
    { name: 'Tue', value: 5200, prev: 4100 },
    { name: 'Wed', value: 4800, prev: 4600 },
    { name: 'Thu', value: 7200, prev: 5100 },
    { name: 'Fri', value: 6800, prev: 5800 },
    { name: 'Sat', value: 8500, prev: 6200 },
    { name: 'Sun', value: 9200, prev: 7000 },
]

const quickStats = [
    { label: 'Total Reach', value: '2.4M', change: '+24%', icon: Eye, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/25' },
    { label: 'Engagement', value: '156K', change: '+18%', icon: Heart, gradient: 'from-pink-500 to-rose-500', shadow: 'shadow-pink-500/25' },
    { label: 'Comments', value: '8.2K', change: '+32%', icon: MessageCircle, gradient: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/25' },
    { label: 'Shares', value: '12.4K', change: '+45%', icon: Share2, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/25' },
]

const trendingContent = [
    { title: 'Day in Life Vlog', platform: 'TikTok', views: '245K', engagement: '12.5%', trend: 'up', color: 'from-pink-500 to-rose-500' },
    { title: 'Product Tutorial', platform: 'YouTube', views: '89K', engagement: '8.2%', trend: 'up', color: 'from-red-500 to-orange-500' },
    { title: 'Behind the Scenes', platform: 'Instagram', views: '156K', engagement: '15.8%', trend: 'up', color: 'from-purple-500 to-pink-500' },
]

const upcomingPosts = [
    { title: 'Weekly Tips Thread', time: 'Today, 9:00 AM', platform: 'Twitter', status: 'ready' },
    { title: 'New Product Reveal', time: 'Tomorrow, 12:00 PM', platform: 'Instagram', status: 'draft' },
    { title: 'Tutorial Video', time: 'Dec 8, 3:00 PM', platform: 'YouTube', status: 'review' },
]

export default function DashboardPage() {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => setIsMounted(true), [])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 17) return 'Good Afternoon'
        return 'Good Evening'
    }

    return (
        <motion.div initial="hidden" animate="show" variants={container} className="space-y-8 pb-8">
            {/* Hero Header */}
            <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8 text-white shadow-2xl shadow-purple-500/25">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Crown className="h-5 w-5 text-amber-300" />
                            <span className="text-sm font-medium text-white/80">Premium Creator</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-2">{getGreeting()}, Creator! ✨</h1>
                        <p className="text-lg text-white/80">Your content is performing 24% better than last week.</p>
                    </div>
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                            <p className="text-3xl font-bold">89</p>
                            <p className="text-sm text-white/70">Health Score</p>
                        </div>
                        <Link href="/dashboard/ideas" className="px-6 py-3 rounded-xl bg-white text-purple-600 font-semibold hover:bg-white/90 transition-colors shadow-lg flex items-center gap-2">
                            <Rocket className="h-5 w-5" />
                            Generate Ideas
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {quickStats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn("group relative overflow-hidden rounded-2xl p-5 text-white shadow-xl hover-lift", stat.shadow)}
                    >
                        <div className={cn("absolute inset-0 bg-gradient-to-br", stat.gradient)} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-semibold bg-white/20 px-2 py-0.5 rounded-full">{stat.change}</span>
                            </div>
                            <p className="text-3xl font-bold">{stat.value}</p>
                            <p className="text-sm text-white/80">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* AI Insights Banner */}
            <motion.div variants={item} className="relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl opacity-50" />
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                            <Flame className="h-7 w-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-semibold">HOT TIP</span>
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">Viral Opportunity Detected!</h3>
                            <p className="text-slate-600">The "Day in Life" trend is peaking. Create content now for 3x reach.</p>
                        </div>
                    </div>
                    <Link href="/dashboard/scripts" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow">
                        Generate Script <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Engagement Chart */}
                <motion.div variants={item} className="lg:col-span-2 rounded-2xl border bg-white p-6 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Engagement Overview</h2>
                            <p className="text-sm text-slate-500">Weekly performance vs last week</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600" />
                                <span className="text-slate-600">This Week</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                                <span className="text-slate-600">Last Week</span>
                            </div>
                        </div>
                    </div>
                    {isMounted && (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={engagementData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="prev" stroke="#cbd5e1" strokeWidth={2} fill="transparent" />
                                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>

                {/* Trending Content */}
                <motion.div variants={item} className="rounded-2xl border bg-white p-6 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-slate-900">Top Content</h2>
                        <Link href="/dashboard/trends" className="text-sm text-violet-600 font-medium hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {trendingContent.map((content, i) => (
                            <div key={i} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold shadow-lg", content.color)}>
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 truncate">{content.title}</p>
                                    <p className="text-sm text-slate-500">{content.platform} • {content.views} views</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-emerald-500">{content.engagement}</p>
                                    <p className="text-xs text-slate-400">engagement</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Second Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Upcoming Posts */}
                <motion.div variants={item} className="rounded-2xl border bg-white p-6 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-slate-900">Upcoming Posts</h2>
                        <Link href="/dashboard/calendar" className="text-sm text-violet-600 font-medium hover:underline">Calendar</Link>
                    </div>
                    <div className="space-y-3">
                        {upcomingPosts.map((post, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900">{post.title}</p>
                                    <p className="text-sm text-slate-500">{post.time} • {post.platform}</p>
                                </div>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-semibold",
                                    post.status === 'ready' && "bg-emerald-100 text-emerald-600",
                                    post.status === 'draft' && "bg-slate-200 text-slate-600",
                                    post.status === 'review' && "bg-amber-100 text-amber-600"
                                )}>{post.status}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={item} className="rounded-2xl border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl">
                    <h2 className="text-xl font-bold mb-5">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Generate Ideas', icon: Sparkles, href: '/dashboard/ideas', gradient: 'from-violet-500 to-purple-600' },
                            { label: 'Write Script', icon: Zap, href: '/dashboard/scripts', gradient: 'from-amber-400 to-orange-500' },
                            { label: 'Check Virality', icon: TrendingUp, href: '/dashboard/virality', gradient: 'from-pink-500 to-rose-500' },
                            { label: 'Best Time to Post', icon: Clock, href: '/dashboard/best-time', gradient: 'from-cyan-400 to-blue-500' },
                            { label: 'Auto-Schedule', icon: Calendar, href: '/dashboard/scheduler', gradient: 'from-emerald-400 to-teal-500' },
                            { label: 'View Activity', icon: BarChart3, href: '/dashboard/activity', gradient: 'from-indigo-400 to-violet-500' },
                        ].map((action, i) => (
                            <Link
                                key={i}
                                href={action.href}
                                className={cn("group flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors")}
                            >
                                <div className={cn("p-2 rounded-lg bg-gradient-to-br text-white", action.gradient)}>
                                    <action.icon className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-sm">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
