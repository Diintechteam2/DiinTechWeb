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
import { getHeroContent } from "@/lib/hero-api"
import {
  getAgenticSectionContent,
  getCTASectionContent,
  getDifferenceSectionContent,
  getFooterContent,
  getHeaderContent,
  getIndustriesSectionContent,
  getLogoCloudContent,
  getProcessSectionContent,
  getSolutionsSectionContent,
  getTechnologySectionContent,
  getWhyDiinSectionContent,
} from "@/lib/site-content-api"
import { getIndustriesContent } from "@/lib/industries-api"
import { getGlobalSettings } from "@/lib/settings-api"
import { getSolutionsContent } from "@/lib/solutions-api"

export default async function Home() {
  const headerContent = await getHeaderContent()
  const heroContent = await getHeroContent()
  const logoCloudContent = await getLogoCloudContent()
  const differenceSectionContent = await getDifferenceSectionContent()
  const agenticSectionContent = await getAgenticSectionContent()
  const solutionsSectionContent = await getSolutionsSectionContent()
  const solutionsContent = await getSolutionsContent()
  const industriesSectionContent = await getIndustriesSectionContent()
  const industriesContent = await getIndustriesContent()
  const technologySectionContent = await getTechnologySectionContent()
  const processSectionContent = await getProcessSectionContent()
  const whyDiinSectionContent = await getWhyDiinSectionContent()
  const ctaSectionContent = await getCTASectionContent()
  const footerContent = await getFooterContent()
  const globalSettings = await getGlobalSettings()

  return (
    <main className="min-h-screen bg-background">
      <Header content={headerContent} />
      <HeroSection content={heroContent} />
      <LogoCloud content={logoCloudContent} />
      <WhatMakesDifferent content={differenceSectionContent} />
      <AgenticAISection content={agenticSectionContent} />
      <SolutionsSection sectionContent={solutionsSectionContent} solutions={solutionsContent} />
      <IndustriesSection sectionContent={industriesSectionContent} industries={industriesContent} />
      <TechnologySection content={technologySectionContent} />
      <ProcessSection content={processSectionContent} />
      <WhyDiinSection content={whyDiinSectionContent} />
      <CTASection content={ctaSectionContent} />
      <Footer content={footerContent} settings={globalSettings} />
      <WhatsAppButton
        phoneNumber={globalSettings.whatsapp.number}
        message={globalSettings.whatsapp.message}
      />
      <ScrollToTop />
    </main>
  )
}
