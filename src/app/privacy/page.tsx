import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy | Trendly',
    description: 'Privacy Policy for Trendly - Instagram & YouTube Trends Platform',
}

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#FFFBF5] py-16 px-4">
            <div className="max-w-3xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
                <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">Privacy Policy</h1>
                <p className="text-gray-600 mb-4">Last updated: December 2024</p>

                <div className="space-y-6 text-gray-800">
                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">1. Information We Collect</h2>
                        <p className="font-medium">When you use Trendly, we may collect:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 font-medium">
                            <li>Account information (email, name) when you sign up</li>
                            <li>Instagram account data when you connect your account</li>
                            <li>Usage data to improve our services</li>
                            <li>Content preferences and niche selections</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">2. How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-1 font-medium">
                            <li>To provide personalized trend recommendations</li>
                            <li>To display relevant content ideas and hashtags</li>
                            <li>To improve our platform and user experience</li>
                            <li>To communicate important updates about our service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">3. Instagram Data</h2>
                        <p className="font-medium">When you connect your Instagram account, we access:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 font-medium">
                            <li>Basic profile information (username, account type)</li>
                            <li>Media content for analytics purposes</li>
                            <li>Engagement metrics to provide insights</li>
                        </ul>
                        <p className="mt-2 font-medium">We do not post on your behalf or share your data with third parties.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">4. Data Security</h2>
                        <p className="font-medium">We implement industry-standard security measures to protect your data. Your information is encrypted and stored securely.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">5. Data Deletion</h2>
                        <p className="font-medium">You can request deletion of your data at any time by contacting us or disconnecting your Instagram account from our platform.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">6. Contact Us</h2>
                        <p className="font-medium">For any privacy concerns, please contact us at:</p>
                        <p className="font-black mt-2">support@trendllly.com</p>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t-2 border-gray-200">
                    <a href="/" className="inline-block px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors">
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    )
}
