import { HeroSection } from "@/components/features/hero-section";
import { FeaturesSection } from "@/components/features/features-section";
import { SocialProofSection } from "@/components/features/social-proof-section";
import { FAQSection } from "@/components/features/faq-section";
import { Footer } from "@/components/layout/footer";

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
  );
}
