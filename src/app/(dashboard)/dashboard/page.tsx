'use client'

import React from 'react'
import Link from 'next/link'
import {
    TrendingUp,
    Lightbulb,
    Calendar as CalendarIcon,
    ArrowUpRight,
    MoreHorizontal,
    Plus,
    PlayCircle,
    BarChart3,
    Users
} from 'lucide-react'

export default function DashboardPage() {
    const stats = [
        { label: 'Total Ideas', value: '128', change: '+12%', trend: 'up', icon: Lightbulb },
        { label: 'Scheduled Posts', value: '12', change: '+4', trend: 'up', icon: CalendarIcon },
        { label: 'Avg. Engagement', value: '8.4%', change: '+1.2%', trend: 'up', icon: BarChart3 },
        { label: 'Active Trends', value: '24', change: 'New', trend: 'neutral', icon: TrendingUp },
    ]

    const recentIdeas = [
        { title: 'Product Launch Teaser', platform: 'Instagram', status: 'Draft', date: '2h ago' },
        { title: 'Weekly Recap Thread', platform: 'Twitter', status: 'Review', date: '5h ago' },
        { title: 'AI Features Tutorial', platform: 'YouTube', status: 'Scheduled', date: '1d ago' },
        { title: 'Behind the Scenes', platform: 'TikTok', status: 'Idea', date: '1d ago' },
        { title: 'Customer Stories', platform: 'LinkedIn', status: 'Draft', date: '2d ago' },
    ]

    const trends = [
        { name: 'AI Art Showcase', category: 'Tech', volume: 'High' },
        { name: 'POV: Daily Life', category: 'Lifestyle', volume: 'Med' },
        { name: 'Tech Layoffs', category: 'Business', volume: 'High' },
        { name: 'Morning Routine', category: 'Wellness', volume: 'Low' },
    ]

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your content pipeline and performance.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                        Download Report
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                        <Plus size={16} className="mr-2" /> New Post
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Ideas - Spans 2 cols */}
                <div className="lg:col-span-2 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex items-center justify-between border-b">
                        <div>
                            <h3 className="text-lg font-semibold leading-none tracking-tight">Recent Ideas</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Drafts and content currently in progress.
                            </p>
                        </div>
                        <Link href="/dashboard/ideas" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                            View all <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    <div className="p-0">
                        <div className="w-full">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 px-6 py-3 border-b bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <div className="col-span-6">Title</div>
                                <div className="col-span-3">Platform</div>
                                <div className="col-span-3 text-right">Status</div>
                            </div>
                            {/* Rows */}
                            <div className="divide-y">
                                {recentIdeas.map((idea, i) => (
                                    <div key={i} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-muted/50 transition-colors group">
                                        <div className="col-span-6 flex flex-col gap-0.5">
                                            <span className="font-medium text-sm text-foreground">{idea.title}</span>
                                            <span className="text-xs text-muted-foreground">{idea.date}</span>
                                        </div>
                                        <div className="col-span-3">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                {idea.platform}
                                            </span>
                                        </div>
                                        <div className="col-span-3 text-right">
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {idea.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trending Topics - Spans 1 col */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold leading-none tracking-tight">Trending Now</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            High volume topics to watch.
                        </p>
                    </div>
                    <div className="p-6 space-y-6">
                        {trends.map((trend, i) => (
                            <div key={i} className="flex items-start justify-between group cursor-pointer">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{trend.name}</p>
                                    <p className="text-xs text-muted-foreground">{trend.category}</p>
                                </div>
                                <div className="text-xs font-medium bg-muted px-2 py-1 rounded text-muted-foreground">
                                    {trend.volume}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 pt-0">
                        <Link href="/dashboard/trends" className="block w-full rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2 text-sm font-medium text-center transition-colors">
                            Explore Trends
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
