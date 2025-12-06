'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    ArrowUpRight,
    TrendingUp,
    Calendar,
    ArrowRight,
    BarChart3,
    Clock,
    Eye,
    Heart,
    MessageCircle,
    Share2,
    ChevronRight,
    Plus,
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
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

// Mock data
const engagementData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 5200 },
    { name: 'Wed', value: 4800 },
    { name: 'Thu', value: 7200 },
    { name: 'Fri', value: 6800 },
    { name: 'Sat', value: 8500 },
    { name: 'Sun', value: 9200 },
]

const quickStats = [
    { label: 'Total Reach', value: '2.4M', change: '+24%', icon: Eye },
    { label: 'Engagement', value: '156K', change: '+18%', icon: Heart },
    { label: 'Comments', value: '8.2K', change: '+32%', icon: MessageCircle },
    { label: 'Shares', value: '12.4K', change: '+45%', icon: Share2 },
]

const trendingContent = [
    { title: 'Day in Life Vlog', platform: 'TikTok', views: '245K', engagement: '12.5%' },
    { title: 'Product Tutorial', platform: 'YouTube', views: '89K', engagement: '8.2%' },
    { title: 'Behind the Scenes', platform: 'Instagram', views: '156K', engagement: '15.8%' },
]

const upcomingPosts = [
    { title: 'Weekly Tips Thread', time: 'Today, 9:00 AM', platform: 'Twitter', status: 'ready' },
    { title: 'New Product Reveal', time: 'Tomorrow, 12:00 PM', platform: 'Instagram', status: 'draft' },
    { title: 'Tutorial Video', time: 'Dec 8, 3:00 PM', platform: 'YouTube', status: 'review' },
]

const quickActions = [
    { label: 'Generate Ideas', href: '/dashboard/ideas', icon: Plus },
    { label: 'Write Script', href: '/dashboard/scripts', icon: BarChart3 },
    { label: 'Check Trends', href: '/dashboard/trends', icon: TrendingUp },
    { label: 'Schedule', href: '/dashboard/calendar', icon: Calendar },
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
        <motion.div initial="hidden" animate="show" variants={container} className="space-y-6 pb-8">
            {/* Header */}
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-[#14110F] dark:text-[#F3F3F4]">
                        {getGreeting()}
                    </h1>
                    <p className="text-[#7E7F83] mt-1">Here's what's happening with your content today.</p>
                </div>
                <Link
                    href="/dashboard/ideas"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D9C5B2] text-[#14110F] font-medium hover:bg-[#C4B09D] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Content
                </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, i) => (
                    <div
                        key={i}
                        className="p-5 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <stat.icon className="w-5 h-5 text-[#7E7F83]" />
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-2xl font-semibold text-[#14110F] dark:text-[#F3F3F4]">{stat.value}</p>
                        <p className="text-sm text-[#7E7F83] mt-1">{stat.label}</p>
                    </div>
                ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Chart */}
                <motion.div variants={item} className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">Engagement Overview</h2>
                            <p className="text-sm text-[#7E7F83]">Last 7 days performance</p>
                        </div>
                        <button className="text-sm text-[#7E7F83] hover:text-[#14110F] dark:hover:text-[#F3F3F4]">
                            View All
                        </button>
                    </div>

                    {isMounted && (
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={engagementData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D9C5B2" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D9C5B2" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E9" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7E7F83' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7E7F83' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #E8E8E9',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                    }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#D9C5B2" strokeWidth={2} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>

                {/* Trending Content */}
                <motion.div variants={item} className="p-6 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">Top Content</h2>
                        <TrendingUp className="w-4 h-4 text-[#7E7F83]" />
                    </div>

                    <div className="space-y-4">
                        {trendingContent.map((content, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D]">
                                <div className="w-10 h-10 rounded-lg bg-[#D9C5B2] flex items-center justify-center text-[#14110F] font-semibold">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4] truncate">{content.title}</p>
                                    <p className="text-xs text-[#7E7F83]">{content.platform} • {content.views}</p>
                                </div>
                                <span className="text-xs font-medium text-emerald-600">{content.engagement}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Upcoming Posts */}
                <motion.div variants={item} className="p-6 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4]">Upcoming Posts</h2>
                        <Link href="/dashboard/calendar" className="text-sm text-[#7E7F83] hover:text-[#14110F] dark:hover:text-[#F3F3F4] flex items-center gap-1">
                            View Calendar <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {upcomingPosts.map((post, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D] flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-[#7E7F83]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4]">{post.title}</p>
                                    <p className="text-xs text-[#7E7F83]">{post.time} • {post.platform}</p>
                                </div>
                                <span className={cn(
                                    "text-xs font-medium px-2 py-1 rounded-full capitalize",
                                    post.status === 'ready' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20",
                                    post.status === 'draft' && "bg-[#F3F3F4] text-[#7E7F83] dark:bg-[#34312D]",
                                    post.status === 'review' && "bg-amber-50 text-amber-600 dark:bg-amber-900/20",
                                )}>
                                    {post.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={item} className="p-6 rounded-xl bg-white dark:bg-[#1A1714] border border-[#E8E8E9] dark:border-[#34312D]">
                    <h2 className="font-semibold text-[#14110F] dark:text-[#F3F3F4] mb-4">Quick Actions</h2>

                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, i) => (
                            <Link
                                key={i}
                                href={action.href}
                                className="flex items-center gap-3 p-4 rounded-lg border border-[#E8E8E9] dark:border-[#34312D] hover:border-[#D9C5B2] hover:bg-[#F3F3F4] dark:hover:bg-[#34312D] transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[#F3F3F4] dark:bg-[#34312D] flex items-center justify-center group-hover:bg-[#D9C5B2] transition-colors">
                                    <action.icon className="w-5 h-5 text-[#7E7F83] group-hover:text-[#14110F]" />
                                </div>
                                <span className="font-medium text-sm text-[#14110F] dark:text-[#F3F3F4]">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
