'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Settings,
    Save,
    RefreshCw,
    Globe,
    Bell,
    Shield,
    Palette,
    Database,
    Zap,
    Key,
    Mail,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff,
    Copy,
    ExternalLink
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

export default function SettingsPage() {
    const [settings, setSettings] = useState<AppSettings>({
        siteName: 'Trendly',
        siteDescription: 'Discover trending content for your niche',
        maintenanceMode: false,
        allowRegistration: true,
        defaultIndustry: 'TECH',
        cacheRefreshHour: 0,
        enableEmailNotifications: true,
        adminEmail: 'admin@trendly.app',
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

    const INDUSTRIES = [
        'TECH', 'HEALTH', 'FITNESS', 'GAMING', 'ENTERTAINMENT',
        'FINANCE', 'FOOD', 'TRAVEL', 'EDUCATION', 'BEAUTY'
    ]

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
                        <Settings className="w-8 h-8 text-[#FFC900]" />
                        Settings
                    </h1>
                    <p className="text-[#888] mt-1">Configure your application</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className={cn(
                        "px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all",
                        saving
                            ? "bg-[#333] text-[#888] cursor-not-allowed"
                            : saveStatus === 'success'
                                ? "bg-green-500 text-white"
                                : saveStatus === 'error'
                                    ? "bg-red-500 text-white"
                                    : "bg-[#FFC900] text-black hover:bg-[#FFD93D] shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    )}
                >
                    {saving ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : saveStatus === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : saveStatus === 'error' ? (
                        <AlertCircle className="w-5 h-5" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {saving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save Changes'}
                </button>
            </div>

            {/* General Settings */}
            <motion.div variants={item} className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    General Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Site Name</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="w-full bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Admin Email</label>
                        <input
                            type="email"
                            value={settings.adminEmail}
                            onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                            className="w-full bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-2">Site Description</label>
                        <textarea
                            value={settings.siteDescription}
                            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                            rows={2}
                            className="w-full bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Default Industry</label>
                        <select
                            value={settings.defaultIndustry}
                            onChange={(e) => setSettings({ ...settings, defaultIndustry: e.target.value })}
                            className="w-full bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none"
                        >
                            {INDUSTRIES.map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Cache Refresh Hour (UTC)</label>
                        <select
                            value={settings.cacheRefreshHour}
                            onChange={(e) => setSettings({ ...settings, cacheRefreshHour: parseInt(e.target.value) })}
                            className="w-full bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none"
                        >
                            {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i}>{i}:00 UTC ({(i + 5) % 24}:{30} IST)</option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Feature Toggles */}
            <motion.div variants={item} className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Features & Security
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg">
                        <div>
                            <p className="font-bold">Maintenance Mode</p>
                            <p className="text-sm text-[#888]">Disable site access for non-admins</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                            className={cn(
                                "w-14 h-8 rounded-full p-1 transition-colors",
                                settings.maintenanceMode ? "bg-red-500" : "bg-[#333]"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 bg-white rounded-full transition-transform",
                                settings.maintenanceMode ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg">
                        <div>
                            <p className="font-bold">Allow Registration</p>
                            <p className="text-sm text-[#888]">Enable new user sign-ups</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                            className={cn(
                                "w-14 h-8 rounded-full p-1 transition-colors",
                                settings.allowRegistration ? "bg-green-500" : "bg-[#333]"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 bg-white rounded-full transition-transform",
                                settings.allowRegistration ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg">
                        <div>
                            <p className="font-bold">Email Notifications</p>
                            <p className="text-sm text-[#888]">Send system alerts to admin</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, enableEmailNotifications: !settings.enableEmailNotifications })}
                            className={cn(
                                "w-14 h-8 rounded-full p-1 transition-colors",
                                settings.enableEmailNotifications ? "bg-green-500" : "bg-[#333]"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 bg-white rounded-full transition-transform",
                                settings.enableEmailNotifications ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* API Keys */}
            <motion.div variants={item} className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black uppercase flex items-center gap-2">
                        <Key className="w-5 h-5 text-[#FFC900]" />
                        API Keys
                    </h2>
                    <button
                        onClick={() => setShowApiKeys(!showApiKeys)}
                        className="px-4 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-sm font-semibold flex items-center gap-2 hover:border-[#FFC900]"
                    >
                        {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showApiKeys ? 'Hide Keys' : 'Show Keys'}
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">YouTube API Key</label>
                        <div className="flex gap-2">
                            <input
                                type={showApiKeys ? 'text' : 'password'}
                                value={settings.youtubeApiKey}
                                onChange={(e) => setSettings({ ...settings, youtubeApiKey: e.target.value })}
                                placeholder="Enter your YouTube API key"
                                className="flex-1 bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none font-mono text-sm"
                            />
                            <button
                                onClick={() => copyToClipboard(settings.youtubeApiKey)}
                                className="p-3 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#FFC900]"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">SerpAPI Key</label>
                        <div className="flex gap-2">
                            <input
                                type={showApiKeys ? 'text' : 'password'}
                                value={settings.serpApiKey}
                                onChange={(e) => setSettings({ ...settings, serpApiKey: e.target.value })}
                                placeholder="Enter your SerpAPI key"
                                className="flex-1 bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none font-mono text-sm"
                            />
                            <button
                                onClick={() => copyToClipboard(settings.serpApiKey)}
                                className="p-3 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#FFC900]"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">OpenRouter API Key</label>
                        <div className="flex gap-2">
                            <input
                                type={showApiKeys ? 'text' : 'password'}
                                value={settings.openRouterApiKey}
                                onChange={(e) => setSettings({ ...settings, openRouterApiKey: e.target.value })}
                                placeholder="Enter your OpenRouter API key"
                                className="flex-1 bg-[#1A1A1A] border-2 border-[#333] rounded-lg px-4 py-3 focus:border-[#FFC900] focus:outline-none font-mono text-sm"
                            />
                            <button
                                onClick={() => copyToClipboard(settings.openRouterApiKey)}
                                className="p-3 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#FFC900]"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-[#888] mt-4">
                    ⚠️ API keys are stored in environment variables. Changes here will update the database but won't affect the running app until redeployed.
                </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={item} className="bg-[#111] border-2 border-[#222] rounded-xl p-6">
                <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    Quick Links
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a
                        href="https://console.cloud.google.com/apis"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#FFC900] transition-colors flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Google Cloud</p>
                            <p className="text-xs text-[#888]">YouTube API</p>
                        </div>
                    </a>

                    <a
                        href="https://serpapi.com/manage-api-key"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#FFC900] transition-colors flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">SerpAPI</p>
                            <p className="text-xs text-[#888]">Trends API</p>
                        </div>
                    </a>

                    <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#FFC900] transition-colors flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">OpenRouter</p>
                            <p className="text-xs text-[#888]">AI API</p>
                        </div>
                    </a>

                    <a
                        href="https://vercel.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#FFC900] transition-colors flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Vercel</p>
                            <p className="text-xs text-[#888]">Hosting</p>
                        </div>
                    </a>
                </div>
            </motion.div>
        </motion.div>
    )
}
