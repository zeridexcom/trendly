'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Settings,
    Save,
    RefreshCw,
    Globe,
    Shield,
    Key,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff,
    Copy,
    ExternalLink,
    Zap,
    Database,
    Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppSettings {
    siteName: string
    siteDescription: string
    maintenanceMode: boolean
    allowRegistration: boolean
    defaultIndustry: string
    cacheRefreshHour: number
    enableEmailNotifications: boolean
    adminEmail: string
    youtubeApiKey: string
    serpApiKey: string
    openRouterApiKey: string
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

const INDUSTRIES = [
    'TECH', 'HEALTH', 'FITNESS', 'GAMING', 'ENTERTAINMENT',
    'FINANCE', 'FOOD', 'TRAVEL', 'EDUCATION', 'BEAUTY'
]

export default function SettingsPage() {
    const [settings, setSettings] = useState<AppSettings>({
        siteName: 'Trendllly',
        siteDescription: 'Discover trending content for your niche',
        maintenanceMode: false,
        allowRegistration: true,
        defaultIndustry: 'TECH',
        cacheRefreshHour: 0,
        enableEmailNotifications: true,
        adminEmail: 'admin@Trendllly.app',
        youtubeApiKey: '',
        serpApiKey: '',
        openRouterApiKey: ''
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showApiKeys, setShowApiKeys] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/settings')
            const data = await response.json()
            if (data.success && data.settings) {
                setSettings(data.settings)
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const saveSettings = async () => {
        setSaving(true)
        setSaveStatus('idle')
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })
            const data = await response.json()
            if (data.success) {
                setSaveStatus('success')
                setTimeout(() => setSaveStatus('idle'), 3000)
            } else {
                setSaveStatus('error')
            }
        } catch (error) {
            setSaveStatus('error')
        } finally {
            setSaving(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Settings className="w-8 h-8" />
                        Settings
                    </h1>
                    <p className="text-black/60 mt-1 font-medium">Configure your application</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className={cn(
                        "px-6 py-2.5 font-black uppercase flex items-center gap-2 transition-all border-4 border-black",
                        saving
                            ? "bg-gray-200 text-black/50 cursor-not-allowed"
                            : saveStatus === 'success'
                                ? "bg-[#B1F202]"
                                : saveStatus === 'error'
                                    ? "bg-[#FF4D4D] text-white"
                                    : "bg-[#FFC900] shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                    )}
                >
                    {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : saveStatus === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : saveStatus === 'error' ? (
                        <AlertCircle className="w-5 h-5" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {saving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save'}
                </button>
            </div>

            {/* General Settings */}
            <motion.div variants={item} className="bg-white border-4 border-black p-6 shadow-brutal">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    General Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-black uppercase mb-2">Site Name</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="w-full bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-black uppercase mb-2">Admin Email</label>
                        <input
                            type="email"
                            value={settings.adminEmail}
                            onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                            className="w-full bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-black uppercase mb-2">Site Description</label>
                        <textarea
                            value={settings.siteDescription}
                            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                            rows={2}
                            className="w-full bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-black uppercase mb-2">Default Industry</label>
                        <select
                            value={settings.defaultIndustry}
                            onChange={(e) => setSettings({ ...settings, defaultIndustry: e.target.value })}
                            className="w-full bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none"
                        >
                            {INDUSTRIES.map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-black uppercase mb-2">Cache Refresh Hour (UTC)</label>
                        <select
                            value={settings.cacheRefreshHour}
                            onChange={(e) => setSettings({ ...settings, cacheRefreshHour: parseInt(e.target.value) })}
                            className="w-full bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none"
                        >
                            {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i}>{i}:00 UTC ({(i + 5) % 24}:30 IST)</option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Feature Toggles */}
            <motion.div variants={item} className="bg-white border-4 border-black p-6 shadow-brutal">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Features & Security
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#F5F5F0] border-2 border-black">
                        <div>
                            <p className="font-black">Maintenance Mode</p>
                            <p className="text-sm text-black/60">Disable site access for non-admins</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                            className={cn(
                                "w-14 h-8 border-2 border-black p-1 transition-colors",
                                settings.maintenanceMode ? "bg-[#FF4D4D]" : "bg-gray-200"
                            )}
                        >
                            <div className={cn(
                                "w-5 h-5 bg-white border border-black transition-transform",
                                settings.maintenanceMode ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#F5F5F0] border-2 border-black">
                        <div>
                            <p className="font-black">Allow Registration</p>
                            <p className="text-sm text-black/60">Enable new user sign-ups</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                            className={cn(
                                "w-14 h-8 border-2 border-black p-1 transition-colors",
                                settings.allowRegistration ? "bg-[#B1F202]" : "bg-gray-200"
                            )}
                        >
                            <div className={cn(
                                "w-5 h-5 bg-white border border-black transition-transform",
                                settings.allowRegistration ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#F5F5F0] border-2 border-black">
                        <div>
                            <p className="font-black">Email Notifications</p>
                            <p className="text-sm text-black/60">Send system alerts to admin</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, enableEmailNotifications: !settings.enableEmailNotifications })}
                            className={cn(
                                "w-14 h-8 border-2 border-black p-1 transition-colors",
                                settings.enableEmailNotifications ? "bg-[#B1F202]" : "bg-gray-200"
                            )}
                        >
                            <div className={cn(
                                "w-5 h-5 bg-white border border-black transition-transform",
                                settings.enableEmailNotifications ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* API Keys */}
            <motion.div variants={item} className="bg-white border-4 border-black p-6 shadow-brutal">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black uppercase flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        API Keys
                    </h2>
                    <button
                        onClick={() => setShowApiKeys(!showApiKeys)}
                        className="px-4 py-2 bg-[#F5F5F0] border-2 border-black font-bold text-sm flex items-center gap-2 hover:bg-[#FFC900]"
                    >
                        {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showApiKeys ? 'Hide' : 'Show'}
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-black uppercase mb-2">YouTube API Key</label>
                        <div className="flex gap-2">
                            <input
                                type={showApiKeys ? 'text' : 'password'}
                                value={settings.youtubeApiKey}
                                onChange={(e) => setSettings({ ...settings, youtubeApiKey: e.target.value })}
                                placeholder="Enter your YouTube API key"
                                className="flex-1 bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none font-mono text-sm"
                            />
                            <button
                                onClick={() => copyToClipboard(settings.youtubeApiKey)}
                                className="p-3 bg-[#F5F5F0] border-2 border-black hover:bg-[#FFC900]"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-black uppercase mb-2">SerpAPI Key</label>
                        <div className="flex gap-2">
                            <input
                                type={showApiKeys ? 'text' : 'password'}
                                value={settings.serpApiKey}
                                onChange={(e) => setSettings({ ...settings, serpApiKey: e.target.value })}
                                placeholder="Enter your SerpAPI key"
                                className="flex-1 bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none font-mono text-sm"
                            />
                            <button
                                onClick={() => copyToClipboard(settings.serpApiKey)}
                                className="p-3 bg-[#F5F5F0] border-2 border-black hover:bg-[#FFC900]"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-black uppercase mb-2">OpenRouter API Key</label>
                        <div className="flex gap-2">
                            <input
                                type={showApiKeys ? 'text' : 'password'}
                                value={settings.openRouterApiKey}
                                onChange={(e) => setSettings({ ...settings, openRouterApiKey: e.target.value })}
                                placeholder="Enter your OpenRouter API key"
                                className="flex-1 bg-[#F5F5F0] border-2 border-black px-4 py-3 focus:ring-2 focus:ring-[#FFC900] focus:outline-none font-mono text-sm"
                            />
                            <button
                                onClick={() => copyToClipboard(settings.openRouterApiKey)}
                                className="p-3 bg-[#F5F5F0] border-2 border-black hover:bg-[#FFC900]"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-black/50 mt-4 font-medium">
                    ⚠️ API keys are stored in environment variables. Changes here update the database but need redeployment.
                </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={item} className="bg-white border-4 border-black p-6 shadow-brutal">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Links
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a
                        href="https://console.cloud.google.com/apis"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-[#F5F5F0] border-2 border-black hover:bg-[#FF4D4D] hover:text-white transition-colors flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-[#FF4D4D] border-2 border-black flex items-center justify-center">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-black text-sm">Google Cloud</p>
                            <p className="text-xs opacity-60">YouTube API</p>
                        </div>
                    </a>

                    <a
                        href="https://serpapi.com/manage-api-key"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-[#F5F5F0] border-2 border-black hover:bg-[#00F0FF] transition-colors flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-[#00F0FF] border-2 border-black flex items-center justify-center">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-black text-sm">SerpAPI</p>
                            <p className="text-xs opacity-60">Trends API</p>
                        </div>
                    </a>

                    <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-[#F5F5F0] border-2 border-black hover:bg-[#FF90E8] transition-colors flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-[#FF90E8] border-2 border-black flex items-center justify-center">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-black text-sm">OpenRouter</p>
                            <p className="text-xs opacity-60">AI API</p>
                        </div>
                    </a>

                    <a
                        href="https://vercel.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-[#F5F5F0] border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center">
                            <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-black text-sm">Vercel</p>
                            <p className="text-xs opacity-60">Hosting</p>
                        </div>
                    </a>
                </div>
            </motion.div>
        </motion.div>
    )
}
