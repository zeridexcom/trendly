import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // For demo purposes, use a mock user directly
    // In production with proper database setup, this would verify the auth token
    // and fetch the real user from the database
    const user = {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@trendly.com',
        role: 'ADMIN' as const,
        avatarUrl: undefined,
    }

    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
            }}
        >
            <Sidebar user={user} />
            <main
                style={{
                    flex: 1,
                    marginLeft: 'var(--sidebar-width)',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                <Header user={user} />
                <div
                    style={{
                        flex: 1,
                        padding: 'var(--space-6)',
                        maxWidth: 'var(--content-max-width)',
                        width: '100%',
                    }}
                >
                    {children}
                </div>
            </main>
        </div>
    )
}
