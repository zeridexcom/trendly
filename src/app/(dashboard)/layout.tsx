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
        <div className="flex min-h-screen bg-[#F5F6FA]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen relative">
                <Header user={user} />
                <main className="flex-1 px-8 pb-8 pt-4 w-full max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
