"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfServicePage() {
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
    { id: "agreement", title: "1. Agreement to Terms" },
    { id: "use", title: "2. Use of Service" },
    { id: "steam", title: "3. Steam Integration" },
    { id: "ai", title: "4. AI Recommendations" },
    { id: "data", title: "5. User Data" },
    { id: "prohibited", title: "6. Prohibited Activities" },
    { id: "liability", title: "7. Limitation of Liability" },
    { id: "changes", title: "8. Changes to Terms" },
    { id: "contact", title: "9. Contact Us" },
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
                  <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                  <p className="text-gray-400 mb-2">Last updated: January 15, 2025</p>
                  <p className="text-gray-300 leading-relaxed">
                    Please read these terms carefully before using our service.
                  </p>
                </header>

                <div className="space-y-12 text-gray-300 leading-relaxed">
                  <section id="agreement">
                    <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                    <p className="mb-4">
                      By accessing <strong>GameRec AI</strong> (the "Service"), you agree to be bound by these Terms of
                      Service and all applicable laws and regulations. If you do not agree with any of these terms, you
                      are prohibited from using or accessing this site.
                    </p>
                    <p>
                      The materials contained in this Service are protected by applicable copyright and trademark law.
                      Your continued use of the Service constitutes acceptance of these terms.
                    </p>
                  </section>

                  <section id="use">
                    <h2 className="text-2xl font-bold text-white mb-4">2. Use of Service</h2>
                    <p className="mb-4">
                      You may use the Service for lawful purposes only. You agree not to use the Service:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>In any way that violates any applicable federal, state, local, or international law</li>
                      <li>To transmit any unauthorized advertising or promotional material</li>
                      <li>To impersonate or attempt to impersonate another user or person</li>
                      <li>To engage in any conduct that restricts or inhibits anyone's use of the Service</li>
                    </ul>
                  </section>

                  <section id="steam">
                    <h2 className="text-2xl font-bold text-white mb-4">3. Steam Integration</h2>
                    <p className="mb-4">
                      Our Service integrates with the <strong>Steam Web API</strong>. By connecting your Steam account,
                      you authorize us to access your game library, playtime data, and profile information as permitted
                      by Steam's terms of service.
                    </p>
                    <p className="mb-4">We do not:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Store your Steam password</li>
                      <li>Access your payment information</li>
                      <li>Read your private messages</li>
                      <li>Modify your Steam account in any way</li>
                    </ul>
                    <p className="mt-4">You can disconnect your Steam account at any time from the Settings page.</p>
                  </section>

                  <section id="ai">
                    <h2 className="text-2xl font-bold text-white mb-4">4. AI Recommendations</h2>
                    <p className="mb-4">
                      Recommendations are generated using artificial intelligence and machine learning algorithms. These
                      recommendations are for <strong>informational purposes only</strong> and should not be considered
                      as professional advice.
                    </p>
                    <p>
                      We do not guarantee the accuracy, completeness, or suitability of any recommendations. The quality
                      of recommendations may improve over time as our AI learns from more data.
                    </p>
                  </section>

                  <section id="data">
                    <h2 className="text-2xl font-bold text-white mb-4">5. User Data</h2>
                    <p className="mb-4">
                      We collect and process data in accordance with our{" "}
                      <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                        Privacy Policy
                      </Link>
                      . Your Steam data is used solely for generating personalized game recommendations and improving
                      our Service.
                    </p>
                    <p>
                      You retain all rights to your data and can request deletion of your account and associated data at
                      any time.
                    </p>
                  </section>

                  <section id="prohibited">
                    <h2 className="text-2xl font-bold text-white mb-4">6. Prohibited Activities</h2>
                    <p className="mb-4">You may not:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Attempt to gain unauthorized access to any portion of the Service</li>
                      <li>Use any automated system to access the Service without permission</li>
                      <li>Interfere with or disrupt the Service or servers</li>
                      <li>Reverse engineer or attempt to extract the source code of the Service</li>
                      <li>Use the Service to distribute malware or harmful code</li>
                    </ul>
                  </section>

                  <section id="liability">
                    <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
                    <p className="mb-4">
                      The Service is provided on an "as is" and "as available" basis. We make no warranties, expressed
                      or implied, regarding the Service's operation or the information, content, or materials included.
                    </p>
                    <p>
                      To the fullest extent permitted by law, we disclaim all warranties and shall not be liable for any
                      damages of any kind arising from the use of the Service, including but not limited to direct,
                      indirect, incidental, punitive, and consequential damages.
                    </p>
                  </section>

                  <section id="changes">
                    <h2 className="text-2xl font-bold text-white mb-4">8. Changes to Terms</h2>
                    <p className="mb-4">
                      We reserve the right to modify these Terms of Service at any time. We will notify users of any
                      material changes by posting the new Terms of Service on this page and updating the "Last updated"
                      date.
                    </p>
                    <p>
                      Your continued use of the Service after any changes constitutes acceptance of the new Terms of
                      Service.
                    </p>
                  </section>

                  <section id="contact">
                    <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
                    <p className="mb-4">If you have any questions about these Terms of Service, please contact us:</p>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="font-semibold mb-2">GameRec AI Support</p>
                      <p className="text-gray-400">Email: support@gamerec.ai</p>
                      <p className="text-gray-400">Response time: Within 48 hours</p>
                    </div>
                  </section>
                </div>

                <footer className="mt-12 pt-8 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">
                    By using GameRec AI, you acknowledge that you have read and understood these Terms of Service.
                  </p>
                  <div className="mt-4">
                    <Link href="/privacy" className="text-purple-400 hover:text-purple-300 text-sm underline">
                      View Privacy Policy
                    </Link>
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
