import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service | Trendly',
    description: 'Terms of Service for Trendly - Instagram & YouTube Trends Platform',
}

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#FFFBF5] py-16 px-4">
            <div className="max-w-3xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
                <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">Terms of Service</h1>
                <p className="text-gray-600 mb-4">Last updated: December 2024</p>

                <div className="space-y-6 text-gray-800">
                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">1. Acceptance of Terms</h2>
                        <p className="font-medium">By accessing and using Trendly, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">2. Description of Service</h2>
                        <p className="font-medium">Trendly provides:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 font-medium">
                            <li>Trending content discovery for Instagram and YouTube</li>
                            <li>Hashtag research and recommendations</li>
                            <li>Content ideas and viral hooks</li>
                            <li>Analytics and insights for content creators</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">3. User Accounts</h2>
                        <ul className="list-disc list-inside space-y-1 font-medium">
                            <li>You must provide accurate information when creating an account</li>
                            <li>You are responsible for maintaining your account security</li>
                            <li>You must be at least 13 years old to use this service</li>
                            <li>One person or entity may maintain only one account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">4. Instagram Integration</h2>
                        <p className="font-medium">When connecting your Instagram account:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 font-medium">
                            <li>You authorize us to access your account data</li>
                            <li>You can disconnect at any time</li>
                            <li>We comply with Meta Platform Terms</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">5. Acceptable Use</h2>
                        <p className="font-medium">You agree NOT to:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 font-medium">
                            <li>Use the service for illegal purposes</li>
                            <li>Attempt to hack or disrupt our systems</li>
                            <li>Scrape or collect data from our platform</li>
                            <li>Share your account with others</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">6. Content Disclaimer</h2>
                        <p className="font-medium">Trend data and recommendations are provided for informational purposes. We do not guarantee specific results from using our suggestions.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">7. Termination</h2>
                        <p className="font-medium">We reserve the right to terminate accounts that violate these terms or engage in abusive behavior.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">8. Changes to Terms</h2>
                        <p className="font-medium">We may update these terms occasionally. Continued use of the service constitutes acceptance of any changes.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">9. Contact</h2>
                        <p className="font-medium">Questions about these terms? Contact us at:</p>
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
