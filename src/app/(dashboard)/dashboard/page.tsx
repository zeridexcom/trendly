'use client'

import { useState, useEffect } from 'react'
import {
    ArrowUpRight,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
    ExternalLink,
    MoreHorizontal,
    Calendar,
    ArrowRight
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
    BarChart,
    Bar
} from 'recharts'
import { engagementData, revenueData } from '@/lib/mock-charts'
import { cn } from '@/lib/utils'

// Animation variants
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
    // Client-side hydration check for charts
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => setIsMounted(true), [])

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="space-y-8 pb-8"
        >
            {/* Welcome Section */}
            <motion.div variants={item} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        Good Afternoon, Sarah
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's what's happening with your content today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary">
                        <Calendar size={16} className="mr-2" />
                        Oct 24, 2024
                    </button>
                    <button className="btn btn-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                        <Zap size={16} className="mr-2" />
                        Create Content
                    </button>
                </div>
            </motion.div>

            {/* AI Insights Banner */}
            <motion.div
                variants={item}
                className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-1"
            >
                <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-3xl" />
                <div className="relative flex items-center justify-between p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Viral Opportunity Detected</h3>
                            <p className="text-sm text-muted-foreground">
                                The "Day in Life" trend is peaking on TikTok. Create a variation now to capture 3x reach.
                            </p>
                        </div>
                    </div>
                    <button className="btn btn-primary bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
                        Generate Script <ArrowRight size={16} className="ml-2" />
                    </button>
                </div>
            </motion.div>

            {/* KPI Grid */}
            <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Reach', value: '2.4M', change: '+12.5%', icon: Users, color: 'text-blue-500' },
                    { label: 'Engagement', value: '45.2K', change: '+8.2%', icon: Zap, color: 'text-yellow-500' },
                    { label: 'Growth', value: '+2,834', change: '+3.1%', icon: TrendingUp, color: 'text-green-500' },
                    { label: 'Avg. Watch Time', value: '45s', change: '-1.2%', icon: Sparkles, color: 'text-purple-500' },
                ].map((stat, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <stat.icon className={cn("h-4 w-4", stat.color)} />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className={cn("text-xs flex items-center font-medium", stat.change.startsWith('+') ? "text-green-500" : "text-red-500")}>
                                {stat.change.startsWith('+') ? <ArrowUpRight size={14} className="mr-1" /> : null}
                                {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Main Charts Area */}
            <div className="grid gap-4 md:grid-cols-7">
                {/* Engagement Chart */}
                <motion.div variants={item} className="col-span-4 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="mb-4">
                        <h3 className="font-semibold text-lg">Audience Engagement</h3>
                        <p className="text-sm text-muted-foreground">Weekly performance across all platforms</p>
                    </div>
                    <div className="h-[300px] w-full">
                        {isMounted ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={engagementData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">Loading chart...</div>
                        )}
                    </div>
                </motion.div>

                {/* Revenue/Conversion Chart */}
                <motion.div variants={item} className="col-span-3 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="mb-4">
                        <h3 className="font-semibold text-lg">Conversions</h3>
                        <p className="text-sm text-muted-foreground">Monthly goal completions</p>
                    </div>
                    <div className="h-[300px] w-full">
                        {isMounted ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                    />
                                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">Loading chart...</div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity List - Glassmorphic */}
            <motion.div variants={item} className="rounded-xl border bg-card shadow-sm">
                <div className="flex items-center justify-between p-6">
                    <div>
                        <h3 className="font-semibold text-lg">Recent Content</h3>
                        <p className="text-sm text-muted-foreground">Latest drafts and scheduled posts</p>
                    </div>
                    <button className="text-sm font-medium text-primary hover:text-primary/80">View All</button>
                </div>
                <div className="border-t">
                    {[
                        { title: 'Product Launch Teaser', platform: 'Instagram', status: 'Draft', time: '2h ago' },
                        { title: 'Weekly Recap Thread', platform: 'Twitter', status: 'Review', time: '5h ago' },
                        { title: 'AI Features Tutorial', platform: 'YouTube', status: 'Scheduled', time: '1d ago' },
                        { title: 'Behind the Scenes', platform: 'TikTok', status: 'Idea', time: '1d ago' },
                        { title: 'Customer Stories', platform: 'LinkedIn', status: 'Draft', time: '1d ago' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b last:border-0">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <div className="h-4 w-4 rounded-full bg-current" />
                                </div>
                                <div>
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.platform} • {item.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={cn(
                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                    item.status === 'Scheduled' && "bg-green-100 text-green-800",
                                    item.status === 'Draft' && "bg-blue-100 text-blue-800",
                                    item.status === 'Review' && "bg-yellow-100 text-yellow-800",
                                    item.status === 'Idea' && "bg-gray-100 text-gray-800",
                                )}>
                                    {item.status}
                                </span>
                                <button className="btn btn-ghost btn-icon btn-sm">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}
