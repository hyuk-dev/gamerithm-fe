"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Check, X } from "lucide-react"

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]")
      let currentSection = ""

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top
        if (sectionTop <= 150) {
          currentSection = section.getAttribute("id") || ""
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" })
    }
  }

  const sections = [
    { id: "collection", title: "1. Information We Collect" },
    { id: "usage", title: "2. How We Use Your Data" },
    { id: "steam-data", title: "3. Steam Data Collection" },
    { id: "ai-processing", title: "4. AI Processing" },
    { id: "storage", title: "5. Data Storage & Security" },
    { id: "third-party", title: "6. Third-Party Services" },
    { id: "rights", title: "7. Your Rights (GDPR/CCPA)" },
    { id: "cookies", title: "8. Cookies" },
    { id: "children", title: "9. Children's Privacy" },
    { id: "changes", title: "10. Changes to Policy" },
    { id: "contact", title: "11. Contact Us" },
  ]

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <Navigation />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6 hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 shrink-0">
              <Card className="bg-gray-900/50 border-gray-800 p-4 lg:sticky lg:top-24 backdrop-blur-sm">
                <h3 className="font-semibold mb-4 text-gray-400 text-sm uppercase">Table of Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? "bg-purple-600 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </Card>
            </aside>

            <div className="flex-1 max-w-3xl">
              <Card className="bg-gray-900/50 border-gray-800 p-8 backdrop-blur-sm">
                <header className="mb-8 pb-8 border-b border-gray-800">
                  <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                  <p className="text-gray-400 mb-2">Last updated: January 15, 2025</p>
                  <p className="text-gray-300 leading-relaxed">
                    Your privacy is important to us. Learn how we collect, use, and protect your data.
                  </p>
                </header>

                <div className="space-y-12 text-gray-300 leading-relaxed">
                  <section id="collection">
                    <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                    <p className="mb-4">We collect the following information when you use our Service:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Steam account data:</strong> Username, profile URL, avatar image
                      </li>
                      <li>
                        <strong>Game library:</strong> List of owned games and playtime statistics
                      </li>
                      <li>
                        <strong>User preferences:</strong> Genre preferences, notification settings, privacy choices
                      </li>
                      <li>
                        <strong>Usage analytics:</strong> Pages visited, features used, interaction patterns
                      </li>
                    </ul>
                  </section>

                  <section id="usage">
                    <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
                    <p className="mb-4">Your data is used to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Generate personalized game recommendations</li>
                      <li>Improve our AI algorithms and recommendation quality</li>
                      <li>Provide customer support and respond to inquiries</li>
                      <li>Send notifications (if you have opted in)</li>
                      <li>Analyze usage patterns to enhance the Service</li>
                    </ul>
                    <p className="mt-4">
                      We <strong>never</strong> sell your personal data to third parties.
                    </p>
                  </section>

                  <section id="steam-data">
                    <h2 className="text-2xl font-bold text-white mb-4">3. Steam Data Collection</h2>
                    <p className="mb-4">
                      We access your Steam data through the official <strong>Steam Web API</strong>. This integration is
                      secure and follows Steam's terms of service.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 my-6">
                      <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                        <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                          <Check className="w-5 h-5" />
                          What We Collect
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-400" />
                            <span>Public profile information</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-400" />
                            <span>Game library and playtime</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-400" />
                            <span>Achievement data</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                        <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                          <X className="w-5 h-5" />
                          What We DON'T Collect
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <X className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
                            <span>Your Steam password</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <X className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
                            <span>Payment information</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <X className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
                            <span>Private messages</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <X className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
                            <span>Friends list</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section id="ai-processing">
                    <h2 className="text-2xl font-bold text-white mb-4">4. AI Processing</h2>
                    <p className="mb-4">
                      We use artificial intelligence to analyze your gaming preferences and generate recommendations.
                      This processing includes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Analyzing your game library and playtime patterns</li>
                      <li>Identifying genre preferences and gaming habits</li>
                      <li>Matching your profile with similar users (anonymized)</li>
                      <li>Generating personalized game suggestions</li>
                    </ul>
                    <p className="mt-4">
                      All AI processing is performed securely, and your data is never shared with other users in an
                      identifiable form.
                    </p>
                  </section>

                  <section id="storage">
                    <h2 className="text-2xl font-bold text-white mb-4">5. Data Storage & Security</h2>
                    <p className="mb-4">We take data security seriously. Your information is protected through:</p>
                    <div className="bg-gray-800/50 rounded-lg p-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 shrink-0" />
                        <div>
                          <strong>Encrypted storage:</strong> Data stored on MongoDB Atlas with encryption at rest
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 shrink-0" />
                        <div>
                          <strong>Secure hosting:</strong> Hosted on AWS servers (SOC 2 compliant)
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 shrink-0" />
                        <div>
                          <strong>HTTPS encryption:</strong> All data transmission uses SSL/TLS encryption
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 shrink-0" />
                        <div>
                          <strong>Regular audits:</strong> Security assessments and vulnerability testing
                        </div>
                      </div>
                    </div>
                  </section>

                  <section id="third-party">
                    <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Services</h2>
                    <p className="mb-4">
                      We use the following third-party services, each with their own privacy policies:
                    </p>
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Steam Web API (Valve Corporation)</h3>
                        <p className="text-sm text-gray-400">Used for authentication and game library access</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">OpenAI API</h3>
                        <p className="text-sm text-gray-400">Powers our AI recommendation engine</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Google Analytics</h3>
                        <p className="text-sm text-gray-400">Anonymized usage tracking and analytics</p>
                      </div>
                    </div>
                  </section>

                  <section id="rights">
                    <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights (GDPR/CCPA)</h2>
                    <p className="mb-4">Under GDPR and CCPA regulations, you have the right to:</p>
                    <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                        <div>
                          <strong>Access your data:</strong> Request a copy of all data we have about you
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                        <div>
                          <strong>Delete your account:</strong> Permanently remove your account and associated data
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                        <div>
                          <strong>Export your data:</strong> Download your data in a portable format
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                        <div>
                          <strong>Opt-out of recommendations:</strong> Disable AI analysis while keeping your account
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                        <div>
                          <strong>Correct inaccurate data:</strong> Update or correct your information
                        </div>
                      </div>
                    </div>
                    <p className="mt-4">
                      To exercise these rights, contact us at{" "}
                      <a href="mailto:privacy@gamerec.ai" className="text-purple-400 hover:text-purple-300 underline">
                        privacy@gamerec.ai
                      </a>
                    </p>
                  </section>

                  <section id="cookies">
                    <h2 className="text-2xl font-bold text-white mb-4">8. Cookies</h2>
                    <p className="mb-4">We use cookies and similar technologies to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Keep you logged in to your account</li>
                      <li>Remember your preferences and settings</li>
                      <li>Analyze site traffic and usage patterns</li>
                      <li>Improve site performance and user experience</li>
                    </ul>
                    <p className="mt-4">
                      You can control cookies through your browser settings. Note that disabling cookies may affect site
                      functionality.
                    </p>
                  </section>

                  <section id="children">
                    <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
                    <p className="mb-4">
                      Our Service is not intended for children under 13 years of age. We do not knowingly collect
                      personal information from children under 13.
                    </p>
                    <p>
                      If you are a parent or guardian and believe your child has provided us with personal information,
                      please contact us immediately so we can delete it.
                    </p>
                  </section>

                  <section id="changes">
                    <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
                    <p className="mb-4">
                      We may update this Privacy Policy from time to time. We will notify you of any material changes
                      by:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Posting the new Privacy Policy on this page</li>
                      <li>Updating the "Last updated" date</li>
                      <li>Sending an email notification (if you have opted in)</li>
                    </ul>
                    <p className="mt-4">We encourage you to review this Privacy Policy periodically for any changes.</p>
                  </section>

                  <section id="contact">
                    <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                    <p className="mb-4">
                      If you have any questions about this Privacy Policy or how we handle your data, please contact us:
                    </p>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                      <p className="font-semibold mb-3">GameRec AI Privacy Team</p>
                      <div className="space-y-2 text-gray-400">
                        <p>Email: privacy@gamerec.ai</p>
                        <p>Response time: Within 48 hours</p>
                        <p className="mt-4 text-sm">
                          For GDPR/CCPA requests, please include "Data Request" in your email subject line.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                <footer className="mt-12 pt-8 border-t border-gray-800">
                  <p className="text-gray-400 text-sm mb-4">
                    This Privacy Policy is effective as of the date stated at the top of this page.
                  </p>
                  <div className="flex gap-4">
                    <Link href="/terms" className="text-purple-400 hover:text-purple-300 text-sm underline">
                      View Terms of Service
                    </Link>
                    <span className="text-gray-600">|</span>
                    <a
                      href="https://gdpr.eu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm underline"
                    >
                      Learn about GDPR
                    </a>
                    <span className="text-gray-600">|</span>
                    <a
                      href="https://oag.ca.gov/privacy/ccpa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm underline"
                    >
                      Learn about CCPA
                    </a>
                  </div>
                </footer>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
