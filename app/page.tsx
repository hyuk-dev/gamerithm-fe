"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

export default function GamerithmLanding() {
  return (
    <div className="min-h-screen bg-[#212121] text-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Social Proof Section */}
      <SocialProofSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const fullText = "Discover Your Next Favorite Game"
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [isVisible])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-[#1a1a25] px-4 py-20"
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1
          className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight transition-all duration-1000 min-h-[1.2em] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            {displayedText}
            {displayedText.length < fullText.length && <span className="animate-pulse">|</span>}
          </span>
        </h1>

        <p
          className={`text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Algorithm-Powered Game Discovery
        </p>

        <div
          className={`transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link href="/auth/steam">
            <Button
              size="lg"
              className="bg-[#171a21] hover:bg-[#1b2838] text-white px-8 py-6 text-lg rounded-lg font-semibold transition-all duration-200 border border-white/50 hover:border-white hover:scale-105 cursor-pointer"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 1.5a8.5 8.5 0 0 1 8.5 8.5 8.5 8.5 0 0 1-8.5 8.5A8.5 8.5 0 0 1 3.5 12 8.5 8.5 0 0 1 12 3.5zm-1.5 3v1.793L7.707 11.086a2 2 0 0 0-1.414.586l-1.5 1.5a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l1.5-1.5a2 2 0 0 0 .586-1.414L12.5 10.293V6.5h-2z" />
              </svg>
              Sign in with Steam
            </Button>
          </Link>
        </div>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-6 text-sm md:text-base transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-500/50">
            <span className="text-2xl">🔒</span>
            <span className="text-purple-400 font-medium">Secure OAuth</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-500/50">
            <span className="text-2xl">📊</span>
            <span className="text-cyan-400 font-medium">Analyze 1000+ Games</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              const newState = [...prev]
              newState[index] = true
              return newState
            })
          }
        },
        { threshold: 0.1 },
      )

      if (ref) {
        observer.observe(ref)
      }

      return observer
    })

    return () => observers.forEach((observer) => observer.disconnect())
  }, [])

  const features = [
    {
      title: "Smart Analysis",
      description: "AI analyzes your Steam library to understand your gaming preferences with precision.",
      icon: (
        <svg className="w-12 h-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Personalized Picks",
      description: "Get game recommendations tailored to your playtime, genres, and ratings.",
      icon: (
        <svg className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
    },
    {
      title: "Save Time",
      description: "Stop browsing thousands of games. Find your next favorite and start playing instantly.",
      icon: (
        <svg className="w-12 h-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ]

  return (
    <section className="py-20 px-4 bg-[#212121]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Why Gamerithm?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el
              }}
              className={`transition-all duration-1000 ${
                visibleCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <Card className="bg-gray-800 border-gray-700 p-8 rounded-2xl hover:-translate-y-2 hover:border-purple-500 transition-all duration-300 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-gray-900 rounded-xl">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SocialProofSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "50,000+", label: "Recommendations Made" },
    { number: "95%", label: "Satisfaction Rate" },
  ]

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2
          className={`text-3xl md:text-4xl font-bold text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Trusted by Gamers Worldwide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const faqs = [
    {
      question: "Is my Steam account safe?",
      answer:
        "Yes, we use Steam's official OAuth authentication. We never store your password and only access information approved by Steam.",
    },
    {
      question: "How do recommendations work?",
      answer:
        "Our AI analyzes your Steam library, playtime, and preferred genres to recommend personalized games. The more you use it, the better the recommendations become.",
    },
    {
      question: "Is it free?",
      answer: "Basic recommendation features are completely free. Premium features will be available in the future.",
    },
    {
      question: "What games can I get recommendations for?",
      answer:
        "You can get recommendations for any game on Steam. We have a database of over 1000 games, from indie titles to AAA releases.",
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-[#212121]">
      <div className="max-w-3xl mx-auto">
        <h2
          className={`text-3xl md:text-4xl font-bold text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Frequently Asked Questions
        </h2>

        <div
          className={`transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gray-800 border-gray-700 rounded-xl px-6 data-[state=open]:border-purple-500 transition-colors"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-purple-400 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6 leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 py-12 px-4 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              Gamerithm
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Algorithm-powered game recommendation platform to help you discover your next favorite game.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/recommendations"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline"
                >
                  Recommendations
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-400 transition-colors cursor-pointer hover:underline">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Legal & Social</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-purple-400 transition-colors cursor-pointer hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="https://discord.gg/gamerithm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline inline-flex items-center gap-1"
                >
                  Discord
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/gamerithm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors cursor-pointer hover:underline inline-flex items-center gap-1"
                >
                  Twitter
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>© 2025 Gamerithm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
