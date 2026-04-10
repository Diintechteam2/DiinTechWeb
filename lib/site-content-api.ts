import { cache } from "react"

export type SiteLinkItem = {
  label: string
  href: string
  description?: string
}

export type HeaderContent = {
  solutionMenu: SiteLinkItem[]
  industryMenu: SiteLinkItem[]
  navLinks: SiteLinkItem[]
  contactButtonText: string
  ctaButtonText: string
}

export type LogoCloudItem = {
  name: string
  initials: string
}

export type LogoCloudContent = {
  introText: string
  logos: LogoCloudItem[]
}

export type DifferenceComparison = {
  traditional: string
  diin: string
}

export type DifferenceSectionContent = {
  badgeText: string
  titleLineOne: string
  titleHighlight: string
  description: string
  traditionalTitle: string
  diinTitle: string
  comparisons: DifferenceComparison[]
}

export type AgenticFeatureItem = {
  icon: string
  title: string
  description: string
}

export type AgenticSectionContent = {
  badgeText: string
  title: string
  description: string
  features: AgenticFeatureItem[]
}

export type SolutionsSectionContent = {
  badgeText: string
  title: string
  description: string
  primaryButtonText: string
}

export type IndustriesSectionContent = {
  badgeText: string
  title: string
  description: string
}

export type TechnologySectionIconItem = {
  icon: string
  label: string
}

export type TechnologySectionContent = {
  badgeText: string
  titleLineOne: string
  titleHighlight: string
  description: string
  techStack: TechnologySectionIconItem[]
  architectureTitle: string
  architectureFeatures: string[]
  securityTitle: string
  securityDescription: string
}

export type ProcessStepItem = {
  icon: string
  number: string
  title: string
  description: string
}

export type ProcessSectionContent = {
  badgeText: string
  title: string
  description: string
  steps: ProcessStepItem[]
}

export type WhyDiinReasonItem = {
  icon: string
  title: string
  description: string
}

export type WhyDiinSectionContent = {
  badgeText: string
  title: string
  description: string
  reasons: WhyDiinReasonItem[]
}

export type CTAButton = {
  text: string
  link: string
}

export type CTASectionContent = {
  titleLineOne: string
  titleHighlight: string
  description: string
  primaryButton: CTAButton
  secondaryButton: CTAButton
  trustIndicators: string[]
}

export type FooterContent = {
  brandText: string
  description: string
  solutionLinks: SiteLinkItem[]
  companyLinks: SiteLinkItem[]
  legalLinks: SiteLinkItem[]
  copyrightText: string
}

export type ProjectsPageContent = {
  backLinkText: string
  titlePrefix: string
  titleHighlight: string
  description: string
  visitWebsiteLabel: string
  privacyPolicyLabel: string
}

export type PrivacyPolicyTemplateSectionLabels = {
  introduction: string
  informationWeCollect: string
  personalSubheading: string
  userContentSubheading: string
  deviceUsageSubheading: string
  howWeUse: string
  imageProcessing: string
  dataSharing: string
  dataSecurity: string
  dataRetention: string
  userDataDeletion: string
  requestEmailLabel: string
  subjectLabel: string
  childrenPrivacy: string
  thirdPartyServices: string
  aiDisclaimer: string
  changesToPolicy: string
  contactUs: string
}

export type PrivacyPolicyTemplateContent = {
  breadcrumbProjectsLabel: string
  breadcrumbPolicyLabel: string
  complianceBadgeText: string
  titlePrefix: string
  organizationLine: string
  effectiveDateLabel: string
  sections: PrivacyPolicyTemplateSectionLabels
}

type SiteContentData = {
  header?: Partial<HeaderContent>
  logoCloud?: Partial<LogoCloudContent>
  differenceSection?: Partial<DifferenceSectionContent>
  agenticSection?: Partial<AgenticSectionContent>
  solutionsSection?: Partial<SolutionsSectionContent>
  industriesSection?: Partial<IndustriesSectionContent>
  technologySection?: Partial<TechnologySectionContent>
  processSection?: Partial<ProcessSectionContent>
  whyDiinSection?: Partial<WhyDiinSectionContent>
  ctaSection?: Partial<CTASectionContent>
  footer?: Partial<FooterContent>
  projectsPage?: Partial<ProjectsPageContent>
  privacyPolicyTemplate?: Partial<PrivacyPolicyTemplateContent>
}

type SiteContentResponse = {
  success?: boolean
  data?: SiteContentData
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

export const DEFAULT_HEADER_CONTENT: HeaderContent = {
  solutionMenu: [
    {
      label: "AI Sales Agents",
      description: "Autonomous lead qualification and revenue optimization",
      href: "/#solutions",
    },
    {
      label: "AI Support Agents",
      description: "24x7 intelligent customer support",
      href: "/#solutions",
    },
    {
      label: "AI Operations Agents",
      description: "Workflow orchestration and automation",
      href: "/#solutions",
    },
    {
      label: "AI Knowledge & RAG",
      description: "Enterprise knowledge systems",
      href: "/#solutions",
    },
  ],
  industryMenu: [
    { label: "Education & EdTech", href: "/#industries" },
    { label: "BFSI & FinTech", href: "/#industries" },
    { label: "Healthcare", href: "/#industries" },
    { label: "BPO & Call Centers", href: "/#industries" },
  ],
  navLinks: [
    { label: "About", href: "/#about" },
    { label: "Technology", href: "/#technology" },
    { label: "Why Diin", href: "/#why-diin" },
  ],
  contactButtonText: "Contact",
  ctaButtonText: "Book a Strategy Call",
}

export const DEFAULT_LOGO_CLOUD_CONTENT: LogoCloudContent = {
  introText: "Trusted by innovative companies worldwide",
  logos: [
    { name: "TechCorp", initials: "TC" },
    { name: "InnovateLabs", initials: "IL" },
    { name: "DataDriven", initials: "DD" },
    { name: "ScaleUp", initials: "SU" },
    { name: "FutureAI", initials: "FA" },
    { name: "CloudFirst", initials: "CF" },
  ],
}

export const DEFAULT_DIFFERENCE_SECTION: DifferenceSectionContent = {
  badgeText: "The Diin Difference",
  titleLineOne: "We Don't Automate Tasks.",
  titleHighlight: "We Build AI Workforces.",
  description:
    "Traditional automation follows rules. Our Agentic AI understands goals and achieves them autonomously.",
  traditionalTitle: "Traditional Automation",
  diinTitle: "Diin's Agentic AI",
  comparisons: [
    { traditional: "Rule-based workflows", diin: "Goal-driven intelligence" },
    { traditional: "Human-dependent", diin: "Autonomous execution" },
    { traditional: "Isolated tools", diin: "Multi-agent ecosystems" },
    { traditional: "Static logic", diin: "Self-learning systems" },
  ],
}

export const DEFAULT_AGENTIC_SECTION: AgenticSectionContent = {
  badgeText: "Agentic AI",
  title: "AI With Agency",
  description:
    "Agentic AI refers to AI systems capable of independent decision-making and action. This is AI that thinks, plans, acts, and learns.",
  features: [
    {
      icon: "Brain",
      title: "Autonomous Decision-Making",
      description:
        "AI systems capable of independent decision-making and action. Unlike traditional AI that waits for prompts, agentic AI understands goals and achieves them.",
    },
    {
      icon: "Users",
      title: "Multi-Agent Collaboration",
      description:
        "Collaborative AI agents, each responsible for specific roles: Planner Agents, Executor Agents, Evaluator Agents, and Memory Agents working together.",
    },
    {
      icon: "Shield",
      title: "Human-in-the-Loop Control",
      description:
        "Governance, approvals, auditability, ethical AI behavior, and override mechanisms ensure safe and controlled AI operations.",
    },
    {
      icon: "Sparkles",
      title: "Self-Learning Systems",
      description:
        "Our agents learn from outcomes, continuously improving their performance and adapting to new challenges without manual intervention.",
    },
  ],
}

export const DEFAULT_SOLUTIONS_SECTION: SolutionsSectionContent = {
  badgeText: "Solutions",
  title: "AI Agents for Every Business Function",
  description:
    "Deploy autonomous AI agents across your organization to transform operations, enhance customer experience, and drive growth.",
  primaryButtonText: "Explore All Solutions",
}

export const DEFAULT_INDUSTRIES_SECTION: IndustriesSectionContent = {
  badgeText: "Industries",
  title: "AI Solutions Across Sectors",
  description:
    "We deploy intelligent AI agents tailored to the unique challenges and opportunities in your industry.",
}

export const DEFAULT_TECHNOLOGY_SECTION: TechnologySectionContent = {
  badgeText: "Technology",
  titleLineOne: "Enterprise-Grade",
  titleHighlight: "AI Infrastructure",
  description:
    "Built on cutting-edge AI technologies with enterprise security and compliance at its core.",
  techStack: [
    { icon: "Cpu", label: "Large Language Models (LLMs)" },
    { icon: "Server", label: "Multi-Agent Frameworks" },
    { icon: "Database", label: "Vector Databases & RAG" },
    { icon: "Zap", label: "Voice AI (STT + TTS)" },
    { icon: "Cloud", label: "Cloud-Native Microservices" },
    { icon: "Shield", label: "Enterprise Security" },
  ],
  architectureTitle: "Architecture & Security",
  architectureFeatures: [
    "Modular & Scalable",
    "API-First Design",
    "Secure & Fault-Tolerant",
    "Role-Based Access Control",
    "Data Encryption at Rest & Transit",
    "Comprehensive Audit Logs",
  ],
  securityTitle: "Security & Compliance",
  securityDescription:
    "SOC 2 compliant infrastructure with end-to-end encryption, GDPR-ready data handling, and comprehensive audit trails.",
}

export const DEFAULT_PROCESS_SECTION: ProcessSectionContent = {
  badgeText: "Our Process",
  title: "From Vision to Autonomous Reality",
  description: "A proven methodology for delivering enterprise AI solutions that work from day one.",
  steps: [
    {
      icon: "Search",
      number: "01",
      title: "Discovery & Strategy",
      description: "Deep dive into your business processes, challenges, and goals to define the AI roadmap.",
    },
    {
      icon: "PenTool",
      number: "02",
      title: "Agent Design & Architecture",
      description: "Design multi-agent systems tailored to your specific workflows and requirements.",
    },
    {
      icon: "Code",
      number: "03",
      title: "Development & Training",
      description: "Build, train, and fine-tune AI agents using your data and domain knowledge.",
    },
    {
      icon: "Rocket",
      number: "04",
      title: "Deployment & Integration",
      description: "Seamlessly integrate AI agents into your existing systems and workflows.",
    },
    {
      icon: "LineChart",
      number: "05",
      title: "Monitoring & Optimization",
      description: "Continuous monitoring, performance tracking, and iterative improvements.",
    },
  ],
}

export const DEFAULT_WHY_DIIN_SECTION: WhyDiinSectionContent = {
  badgeText: "Why Diin",
  title: "Your Partner in AI Transformation",
  description:
    "We're not just another AI vendor. We're builders who understand that AI must deliver real business value.",
  reasons: [
    { icon: "Clock", title: "6+ Years of Excellence", description: "Battle-tested expertise in AI and software development." },
    { icon: "Target", title: "Agentic-First Mindset", description: "We think in autonomous agents, not just automation scripts." },
    { icon: "Rocket", title: "Business Outcome Driven", description: "We measure success by your business metrics, not technical vanity." },
    { icon: "Shield", title: "Enterprise-Ready Systems", description: "Security, compliance, and scalability built from the ground up." },
    { icon: "Users", title: "End-to-End Ownership", description: "From strategy to deployment to optimization - we own it all." },
    { icon: "Award", title: "Builders, Not Experimenters", description: "Production-grade AI that works in the real world, today." },
  ],
}

export const DEFAULT_CTA_SECTION: CTASectionContent = {
  titleLineOne: "Ready to Deploy AI Agents",
  titleHighlight: "That Actually Work?",
  description:
    "Let's discuss how Diin's Agentic AI can transform your business operations and drive measurable results.",
  primaryButton: { text: "Book a Free Strategy Session", link: "#" },
  secondaryButton: { text: "Contact Sales", link: "#" },
  trustIndicators: [
    "No commitment required",
    "30-minute discovery call",
    "Custom solutions discussed",
  ],
}

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  brandText: "Technologies Pvt. Ltd.",
  description:
    "Disruptive Innovation Through Autonomous Intelligence. Building AI agents that run businesses - not just assist them.",
  solutionLinks: [
    { label: "AI Sales Agents", href: "/#solutions" },
    { label: "AI Support Agents", href: "/#solutions" },
    { label: "AI Operations Agents", href: "/#solutions" },
    { label: "Custom Enterprise AI", href: "/#solutions" },
  ],
  companyLinks: [
    { label: "About Us", href: "/#about" },
    { label: "Technology", href: "/#technology" },
    { label: "Industries", href: "/#industries" },
    { label: "Why Diin", href: "/#why-diin" },
    { label: "Projects", href: "/projects" },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/#legal" },
    { label: "Terms of Service", href: "/#legal" },
    { label: "Security", href: "/#legal" },
  ],
  copyrightText: "(c) {{year}} Diin Technologies Pvt. Ltd. All rights reserved.",
}

export const DEFAULT_PROJECTS_PAGE_CONTENT: ProjectsPageContent = {
  backLinkText: "Back to Home",
  titlePrefix: "Our",
  titleHighlight: "Projects",
  description:
    "Explore the products and applications built by Diin Technologies to solve real-world problems through autonomous intelligence.",
  visitWebsiteLabel: "Visit Website",
  privacyPolicyLabel: "Privacy Policy",
}

export const DEFAULT_PRIVACY_POLICY_TEMPLATE: PrivacyPolicyTemplateContent = {
  breadcrumbProjectsLabel: "Projects",
  breadcrumbPolicyLabel: "Privacy Policy",
  complianceBadgeText: "Legal Compliance",
  titlePrefix: "Privacy Policy for",
  organizationLine: "A unit of Diin Technology",
  effectiveDateLabel: "Effective Date:",
  sections: {
    introduction: "Introduction",
    informationWeCollect: "Information We Collect",
    personalSubheading: "a. Personal",
    userContentSubheading: "b. User Content",
    deviceUsageSubheading: "c. Device & Usage",
    howWeUse: "How We Use Your Information",
    imageProcessing: "Image Processing & AI Use",
    dataSharing: "Data Sharing",
    dataSecurity: "Data Security",
    dataRetention: "Data Retention",
    userDataDeletion: "User Data Deletion",
    requestEmailLabel: "Request Email",
    subjectLabel: "Subject:",
    childrenPrivacy: "Children's Privacy",
    thirdPartyServices: "Third-Party Services",
    aiDisclaimer: "AI-Generated Results Disclaimer",
    changesToPolicy: "Changes to This Policy",
    contactUs: "Contact Us",
  },
}

function normalizeLinks(
  links: Partial<SiteLinkItem>[] | undefined,
  defaults: SiteLinkItem[]
): SiteLinkItem[] {
  return links && links.length
    ? links.map((link, index) => ({
        label: link?.label || defaults[index]?.label || "",
        href: link?.href || defaults[index]?.href || "#",
        description: link?.description || defaults[index]?.description || "",
      }))
    : defaults
}

function normalizeHeaderContent(data?: Partial<HeaderContent>): HeaderContent {
  return {
    solutionMenu: normalizeLinks(data?.solutionMenu, DEFAULT_HEADER_CONTENT.solutionMenu),
    industryMenu: normalizeLinks(data?.industryMenu, DEFAULT_HEADER_CONTENT.industryMenu),
    navLinks: normalizeLinks(data?.navLinks, DEFAULT_HEADER_CONTENT.navLinks),
    contactButtonText: data?.contactButtonText || DEFAULT_HEADER_CONTENT.contactButtonText,
    ctaButtonText: data?.ctaButtonText || DEFAULT_HEADER_CONTENT.ctaButtonText,
  }
}

function normalizeLogoCloudContent(data?: Partial<LogoCloudContent>): LogoCloudContent {
  return {
    introText: data?.introText || DEFAULT_LOGO_CLOUD_CONTENT.introText,
    logos:
      data?.logos && data.logos.length
        ? data.logos.map((logo, index) => ({
            name: logo?.name || DEFAULT_LOGO_CLOUD_CONTENT.logos[index]?.name || "",
            initials: logo?.initials || DEFAULT_LOGO_CLOUD_CONTENT.logos[index]?.initials || "",
          }))
        : DEFAULT_LOGO_CLOUD_CONTENT.logos,
  }
}

function normalizeDifferenceSection(data?: Partial<DifferenceSectionContent>): DifferenceSectionContent {
  return {
    badgeText: data?.badgeText || DEFAULT_DIFFERENCE_SECTION.badgeText,
    titleLineOne: data?.titleLineOne || DEFAULT_DIFFERENCE_SECTION.titleLineOne,
    titleHighlight: data?.titleHighlight || DEFAULT_DIFFERENCE_SECTION.titleHighlight,
    description: data?.description || DEFAULT_DIFFERENCE_SECTION.description,
    traditionalTitle: data?.traditionalTitle || DEFAULT_DIFFERENCE_SECTION.traditionalTitle,
    diinTitle: data?.diinTitle || DEFAULT_DIFFERENCE_SECTION.diinTitle,
    comparisons:
      data?.comparisons && data.comparisons.length
        ? data.comparisons.map((item, index) => ({
            traditional: item?.traditional || DEFAULT_DIFFERENCE_SECTION.comparisons[index]?.traditional || "",
            diin: item?.diin || DEFAULT_DIFFERENCE_SECTION.comparisons[index]?.diin || "",
          }))
        : DEFAULT_DIFFERENCE_SECTION.comparisons,
  }
}

function normalizeAgenticSection(data?: Partial<AgenticSectionContent>): AgenticSectionContent {
  return {
    badgeText: data?.badgeText || DEFAULT_AGENTIC_SECTION.badgeText,
    title: data?.title || DEFAULT_AGENTIC_SECTION.title,
    description: data?.description || DEFAULT_AGENTIC_SECTION.description,
    features:
      data?.features && data.features.length
        ? data.features.map((feature, index) => ({
            icon: feature?.icon || DEFAULT_AGENTIC_SECTION.features[index]?.icon || "Brain",
            title: feature?.title || DEFAULT_AGENTIC_SECTION.features[index]?.title || "",
            description: feature?.description || DEFAULT_AGENTIC_SECTION.features[index]?.description || "",
          }))
        : DEFAULT_AGENTIC_SECTION.features,
  }
}

function normalizeSolutionsSection(data?: Partial<SolutionsSectionContent>): SolutionsSectionContent {
  return {
    badgeText: data?.badgeText || DEFAULT_SOLUTIONS_SECTION.badgeText,
    title: data?.title || DEFAULT_SOLUTIONS_SECTION.title,
    description: data?.description || DEFAULT_SOLUTIONS_SECTION.description,
    primaryButtonText: data?.primaryButtonText || DEFAULT_SOLUTIONS_SECTION.primaryButtonText,
  }
}

function normalizeIndustriesSection(data?: Partial<IndustriesSectionContent>): IndustriesSectionContent {
  return {
    badgeText: data?.badgeText || DEFAULT_INDUSTRIES_SECTION.badgeText,
    title: data?.title || DEFAULT_INDUSTRIES_SECTION.title,
    description: data?.description || DEFAULT_INDUSTRIES_SECTION.description,
  }
}

function normalizeTechnologySection(data?: Partial<TechnologySectionContent>): TechnologySectionContent {
  return {
    badgeText: data?.badgeText || DEFAULT_TECHNOLOGY_SECTION.badgeText,
    titleLineOne: data?.titleLineOne || DEFAULT_TECHNOLOGY_SECTION.titleLineOne,
    titleHighlight: data?.titleHighlight || DEFAULT_TECHNOLOGY_SECTION.titleHighlight,
    description: data?.description || DEFAULT_TECHNOLOGY_SECTION.description,
    techStack:
      data?.techStack && data.techStack.length
        ? data.techStack.map((item, index) => ({
            icon: item?.icon || DEFAULT_TECHNOLOGY_SECTION.techStack[index]?.icon || "Cpu",
            label: item?.label || DEFAULT_TECHNOLOGY_SECTION.techStack[index]?.label || "",
          }))
        : DEFAULT_TECHNOLOGY_SECTION.techStack,
    architectureTitle: data?.architectureTitle || DEFAULT_TECHNOLOGY_SECTION.architectureTitle,
    architectureFeatures:
      data?.architectureFeatures && data.architectureFeatures.length
        ? data.architectureFeatures
        : DEFAULT_TECHNOLOGY_SECTION.architectureFeatures,
    securityTitle: data?.securityTitle || DEFAULT_TECHNOLOGY_SECTION.securityTitle,
    securityDescription: data?.securityDescription || DEFAULT_TECHNOLOGY_SECTION.securityDescription,
  }
}

function normalizeProcessSection(data?: Partial<ProcessSectionContent>): ProcessSectionContent {
  return {
    badgeText: data?.badgeText || DEFAULT_PROCESS_SECTION.badgeText,
    title: data?.title || DEFAULT_PROCESS_SECTION.title,
    description: data?.description || DEFAULT_PROCESS_SECTION.description,
    steps:
      data?.steps && data.steps.length
        ? data.steps.map((step, index) => ({
            icon: step?.icon || DEFAULT_PROCESS_SECTION.steps[index]?.icon || "Search",
            number: step?.number || DEFAULT_PROCESS_SECTION.steps[index]?.number || "",
            title: step?.title || DEFAULT_PROCESS_SECTION.steps[index]?.title || "",
            description: step?.description || DEFAULT_PROCESS_SECTION.steps[index]?.description || "",
          }))
        : DEFAULT_PROCESS_SECTION.steps,
  }
}

function normalizeWhyDiinSection(data?: Partial<WhyDiinSectionContent>): WhyDiinSectionContent {
  return {
    badgeText: data?.badgeText || DEFAULT_WHY_DIIN_SECTION.badgeText,
    title: data?.title || DEFAULT_WHY_DIIN_SECTION.title,
    description: data?.description || DEFAULT_WHY_DIIN_SECTION.description,
    reasons:
      data?.reasons && data.reasons.length
        ? data.reasons.map((reason, index) => ({
            icon: reason?.icon || DEFAULT_WHY_DIIN_SECTION.reasons[index]?.icon || "Rocket",
            title: reason?.title || DEFAULT_WHY_DIIN_SECTION.reasons[index]?.title || "",
            description: reason?.description || DEFAULT_WHY_DIIN_SECTION.reasons[index]?.description || "",
          }))
        : DEFAULT_WHY_DIIN_SECTION.reasons,
  }
}

function normalizeCTAButton(button: Partial<CTAButton> | undefined, defaults: CTAButton): CTAButton {
  return {
    text: button?.text || defaults.text,
    link: button?.link || defaults.link,
  }
}

function normalizeCTASection(data?: Partial<CTASectionContent>): CTASectionContent {
  return {
    titleLineOne: data?.titleLineOne || DEFAULT_CTA_SECTION.titleLineOne,
    titleHighlight: data?.titleHighlight || DEFAULT_CTA_SECTION.titleHighlight,
    description: data?.description || DEFAULT_CTA_SECTION.description,
    primaryButton: normalizeCTAButton(data?.primaryButton, DEFAULT_CTA_SECTION.primaryButton),
    secondaryButton: normalizeCTAButton(data?.secondaryButton, DEFAULT_CTA_SECTION.secondaryButton),
    trustIndicators:
      data?.trustIndicators && data.trustIndicators.length
        ? data.trustIndicators
        : DEFAULT_CTA_SECTION.trustIndicators,
  }
}

function normalizeFooterContent(data?: Partial<FooterContent>): FooterContent {
  return {
    brandText: data?.brandText || DEFAULT_FOOTER_CONTENT.brandText,
    description: data?.description || DEFAULT_FOOTER_CONTENT.description,
    solutionLinks: normalizeLinks(data?.solutionLinks, DEFAULT_FOOTER_CONTENT.solutionLinks),
    companyLinks: normalizeLinks(data?.companyLinks, DEFAULT_FOOTER_CONTENT.companyLinks),
    legalLinks: normalizeLinks(data?.legalLinks, DEFAULT_FOOTER_CONTENT.legalLinks),
    copyrightText: data?.copyrightText || DEFAULT_FOOTER_CONTENT.copyrightText,
  }
}

function normalizeProjectsPageContent(data?: Partial<ProjectsPageContent>): ProjectsPageContent {
  return {
    backLinkText: data?.backLinkText || DEFAULT_PROJECTS_PAGE_CONTENT.backLinkText,
    titlePrefix: data?.titlePrefix || DEFAULT_PROJECTS_PAGE_CONTENT.titlePrefix,
    titleHighlight: data?.titleHighlight || DEFAULT_PROJECTS_PAGE_CONTENT.titleHighlight,
    description: data?.description || DEFAULT_PROJECTS_PAGE_CONTENT.description,
    visitWebsiteLabel: data?.visitWebsiteLabel || DEFAULT_PROJECTS_PAGE_CONTENT.visitWebsiteLabel,
    privacyPolicyLabel: data?.privacyPolicyLabel || DEFAULT_PROJECTS_PAGE_CONTENT.privacyPolicyLabel,
  }
}

function normalizePrivacyPolicyTemplate(
  data?: Partial<PrivacyPolicyTemplateContent>
): PrivacyPolicyTemplateContent {
  return {
    breadcrumbProjectsLabel:
      data?.breadcrumbProjectsLabel || DEFAULT_PRIVACY_POLICY_TEMPLATE.breadcrumbProjectsLabel,
    breadcrumbPolicyLabel:
      data?.breadcrumbPolicyLabel || DEFAULT_PRIVACY_POLICY_TEMPLATE.breadcrumbPolicyLabel,
    complianceBadgeText:
      data?.complianceBadgeText || DEFAULT_PRIVACY_POLICY_TEMPLATE.complianceBadgeText,
    titlePrefix: data?.titlePrefix || DEFAULT_PRIVACY_POLICY_TEMPLATE.titlePrefix,
    organizationLine: data?.organizationLine || DEFAULT_PRIVACY_POLICY_TEMPLATE.organizationLine,
    effectiveDateLabel: data?.effectiveDateLabel || DEFAULT_PRIVACY_POLICY_TEMPLATE.effectiveDateLabel,
    sections: {
      introduction:
        data?.sections?.introduction || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.introduction,
      informationWeCollect:
        data?.sections?.informationWeCollect ||
        DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.informationWeCollect,
      personalSubheading:
        data?.sections?.personalSubheading || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.personalSubheading,
      userContentSubheading:
        data?.sections?.userContentSubheading ||
        DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.userContentSubheading,
      deviceUsageSubheading:
        data?.sections?.deviceUsageSubheading ||
        DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.deviceUsageSubheading,
      howWeUse: data?.sections?.howWeUse || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.howWeUse,
      imageProcessing:
        data?.sections?.imageProcessing || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.imageProcessing,
      dataSharing:
        data?.sections?.dataSharing || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.dataSharing,
      dataSecurity:
        data?.sections?.dataSecurity || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.dataSecurity,
      dataRetention:
        data?.sections?.dataRetention || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.dataRetention,
      userDataDeletion:
        data?.sections?.userDataDeletion || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.userDataDeletion,
      requestEmailLabel:
        data?.sections?.requestEmailLabel ||
        DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.requestEmailLabel,
      subjectLabel:
        data?.sections?.subjectLabel || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.subjectLabel,
      childrenPrivacy:
        data?.sections?.childrenPrivacy || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.childrenPrivacy,
      thirdPartyServices:
        data?.sections?.thirdPartyServices ||
        DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.thirdPartyServices,
      aiDisclaimer:
        data?.sections?.aiDisclaimer || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.aiDisclaimer,
      changesToPolicy:
        data?.sections?.changesToPolicy || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.changesToPolicy,
      contactUs: data?.sections?.contactUs || DEFAULT_PRIVACY_POLICY_TEMPLATE.sections.contactUs,
    },
  }
}

const fetchSiteContent = cache(async (): Promise<SiteContentData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/site-content`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch site content")
    }

    const result = (await response.json()) as SiteContentResponse
    return result.data || {}
  } catch {
    return {}
  }
})

export async function getHeaderContent(): Promise<HeaderContent> {
  const data = await fetchSiteContent()
  return normalizeHeaderContent(data.header)
}

export async function getLogoCloudContent(): Promise<LogoCloudContent> {
  const data = await fetchSiteContent()
  return normalizeLogoCloudContent(data.logoCloud)
}

export async function getDifferenceSectionContent(): Promise<DifferenceSectionContent> {
  const data = await fetchSiteContent()
  return normalizeDifferenceSection(data.differenceSection)
}

export async function getAgenticSectionContent(): Promise<AgenticSectionContent> {
  const data = await fetchSiteContent()
  return normalizeAgenticSection(data.agenticSection)
}

export async function getSolutionsSectionContent(): Promise<SolutionsSectionContent> {
  const data = await fetchSiteContent()
  return normalizeSolutionsSection(data.solutionsSection)
}

export async function getIndustriesSectionContent(): Promise<IndustriesSectionContent> {
  const data = await fetchSiteContent()
  return normalizeIndustriesSection(data.industriesSection)
}

export async function getTechnologySectionContent(): Promise<TechnologySectionContent> {
  const data = await fetchSiteContent()
  return normalizeTechnologySection(data.technologySection)
}

export async function getProcessSectionContent(): Promise<ProcessSectionContent> {
  const data = await fetchSiteContent()
  return normalizeProcessSection(data.processSection)
}

export async function getWhyDiinSectionContent(): Promise<WhyDiinSectionContent> {
  const data = await fetchSiteContent()
  return normalizeWhyDiinSection(data.whyDiinSection)
}

export async function getCTASectionContent(): Promise<CTASectionContent> {
  const data = await fetchSiteContent()
  return normalizeCTASection(data.ctaSection)
}

export async function getFooterContent(): Promise<FooterContent> {
  const data = await fetchSiteContent()
  return normalizeFooterContent(data.footer)
}

export async function getProjectsPageContent(): Promise<ProjectsPageContent> {
  const data = await fetchSiteContent()
  return normalizeProjectsPageContent(data.projectsPage)
}

export async function getPrivacyPolicyTemplateContent(): Promise<PrivacyPolicyTemplateContent> {
  const data = await fetchSiteContent()
  return normalizePrivacyPolicyTemplate(data.privacyPolicyTemplate)
}
