import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Cookie Policy | Trendly',
    description: 'Cookie Policy for Trendly - Instagram & YouTube Trends Platform',
}

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-[#FFFBF5] py-16 px-4">
            <div className="max-w-3xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
                <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">Cookie Policy</h1>
                <p className="text-gray-600 mb-4">Last updated: December 2024</p>

                <div className="space-y-6 text-gray-800">
                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">1. What Are Cookies?</h2>
                        <p className="font-medium">Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and login status.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">2. How We Use Cookies</h2>
                        <p className="font-medium mb-2">Trendly uses the following types of cookies:</p>
                        <div className="bg-gray-100 border-2 border-black p-4 space-y-3">
                            <div>
                                <h4 className="font-black">Essential Cookies (Required)</h4>
                                <p className="text-sm">These cookies are necessary for the website to function. They enable core functionality such as security, authentication, and session management.</p>
                            </div>
                            <div>
                                <h4 className="font-black">Authentication Cookies</h4>
                                <p className="text-sm">We use Supabase authentication cookies to keep you logged in and maintain your session securely.</p>
                            </div>
                            <div>
                                <h4 className="font-black">Preference Cookies</h4>
                                <p className="text-sm">These remember your settings like your selected niche, theme preferences, and consent choices.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">3. Cookies We Use</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-2 border-black">
                                <thead className="bg-black text-white">
                                    <tr>
                                        <th className="p-2 text-left font-black">Cookie Name</th>
                                        <th className="p-2 text-left font-black">Purpose</th>
                                        <th className="p-2 text-left font-black">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="font-medium">
                                    <tr className="border-b border-gray-200">
                                        <td className="p-2">sb-*-auth-token</td>
                                        <td className="p-2">Authentication session</td>
                                        <td className="p-2">Session/1 week</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-2">cookie-consent</td>
                                        <td className="p-2">Stores your consent choice</td>
                                        <td className="p-2">1 year</td>
                                    </tr>
                                    <tr>
                                        <td className="p-2">user-preferences</td>
                                        <td className="p-2">Your app settings</td>
                                        <td className="p-2">1 year</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">4. Third-Party Cookies</h2>
                        <p className="font-medium">We may use third-party services that set their own cookies:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 font-medium">
                            <li><strong>Google OAuth:</strong> For sign-in functionality</li>
                            <li><strong>Supabase:</strong> For authentication and database services</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">5. Managing Cookies</h2>
                        <p className="font-medium">You can control cookies through your browser settings. However, please note that disabling essential cookies will affect the functionality of our website.</p>
                        <p className="font-medium mt-2">To delete cookies in your browser:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 font-medium">
                            <li>Chrome: Settings → Privacy → Clear browsing data</li>
                            <li>Firefox: Options → Privacy → Clear Data</li>
                            <li>Safari: Preferences → Privacy → Manage Website Data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">6. Your Consent</h2>
                        <p className="font-medium">By using Trendly and accepting our cookie consent banner, you agree to our use of cookies as described in this policy. You can withdraw your consent at any time by clearing your cookies and revisiting our site.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-3">7. Contact Us</h2>
                        <p className="font-medium">For questions about our cookie policy:</p>
                        <p className="font-black mt-2">support@trendllly.com</p>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t-2 border-gray-200 flex gap-4">
                    <Link href="/" className="inline-block px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors">
                        ← Back to Home
                    </Link>
                    <Link href="/privacy" className="inline-block px-6 py-3 border-2 border-black font-bold hover:bg-gray-100 transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="inline-block px-6 py-3 border-2 border-black font-bold hover:bg-gray-100 transition-colors">
                        Terms of Service
                    </Link>
                </div>
            </div>
        </div>
    )
}
