import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { LogoCloud } from "@/components/logo-cloud"
import { WhatMakesDifferent } from "@/components/what-makes-different"
import { AgenticAISection } from "@/components/agentic-ai-section"
import { SolutionsSection } from "@/components/solutions-section"
import { IndustriesSection } from "@/components/industries-section"
import { TechnologySection } from "@/components/technology-section"
import { ProcessSection } from "@/components/process-section"
import { WhyDiinSection } from "@/components/why-diin-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <LogoCloud />
      <WhatMakesDifferent />
      <AgenticAISection />
      <SolutionsSection />
      <IndustriesSection />
      <TechnologySection />
      <ProcessSection />
      <WhyDiinSection />
      <CTASection />
      <Footer />
      
      {/* Floating Action Buttons */}
      <WhatsAppButton phoneNumber="+919876543210" message="Hello! I'm interested in Diin Technologies' Agentic AI solutions." />
      <ScrollToTop />
    </main>
  )
}
