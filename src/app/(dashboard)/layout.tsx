import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // For demo purposes, use a mock user directly
    const user = {
        id: 'demo-user',
        name: 'Jason Ranti',
        email: 'jason@trendly.com',
        role: 'ADMIN' as const,
        avatarUrl: undefined,
    }

    return (
        <div className="flex bg-background min-h-screen font-sans antialiased text-foreground">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                <Header user={user} />
                <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 overflow-y-auto scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    )
}
