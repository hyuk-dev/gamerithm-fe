"use client";

import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
      answer:
        "Basic recommendation features are completely free. Premium features will be available in the future.",
    },
    {
      question: "What games can I get recommendations for?",
      answer:
        "You can get recommendations for any game on Steam. We have a database of over 1000 games, from indie titles to AAA releases.",
    },
  ];

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
                <AccordionContent className="text-gray-400 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
