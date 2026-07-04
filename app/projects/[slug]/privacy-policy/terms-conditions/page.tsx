import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Shield, Mail, FileText, ChevronRight, Box, Clock, Scale } from "lucide-react"
import { getProjectBySlug } from "@/lib/projects-api"
import {
  getFooterContent,
  getHeaderContent,
  getPrivacyPolicyTemplateContent,
} from "@/lib/site-content-api"
import { getGlobalSettings } from "@/lib/settings-api"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectTermsConditions({ params }: PageProps) {
  const { slug } = await params
  const headerContent = await getHeaderContent()
  const project = await getProjectBySlug(slug)
  const privacyPolicyTemplate = await getPrivacyPolicyTemplateContent()
  const footerContent = await getFooterContent()
  const globalSettings = await getGlobalSettings()

  if (!project || !project.termsConditions?.enabled) {
    notFound()
  }

  const termsContent = project.termsConditions.content

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <Header content={headerContent} />

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-32 pb-24">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 animate-slide-up">
          <Link href="/projects" className="hover:text-foreground cursor-pointer transition-colors flex items-center gap-1.5">
            {privacyPolicyTemplate.breadcrumbProjectsLabel}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{project.name}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary/80">Terms & Conditions</span>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                <Scale className="w-3.5 h-3.5" />
                <span>Terms of Service</span>
              </div>
              <Link
                href={`/projects/${project.slug}/privacy-policy`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all text-xs font-medium cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Privacy Policy</span>
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Terms & Conditions
              <span className="flex items-center gap-3 text-primary mt-3">
                {project.logoUrl ? (
                  <img
                    src={project.logoUrl}
                    alt={`${project.name} logo`}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover border border-primary/20 bg-white/5"
                  />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
                    <Box className="w-6 h-6 text-primary" />
                  </div>
                )}
                <span>{project.name}</span>
              </span>
            </h1>
            <p className="text-lg font-medium text-foreground/80 mb-4">
              {privacyPolicyTemplate.organizationLine}
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Last Updated: <span className="text-foreground/80 font-medium">{project.lastUpdated}</span>
            </p>
          </div>

          {/* Policy Content Card */}
          <div
            className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 md:p-12 shadow-2xl animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="prose prose-invert max-w-none space-y-12">
              {/* Introduction */}
              {termsContent.introduction && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground m-0">1. Introduction</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {termsContent.introduction}
                  </p>
                </section>
              )}

              {/* User Agreement */}
              {termsContent.userAgreement && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground m-0">2. User Agreement & Eligibility</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {termsContent.userAgreement}
                  </p>
                </section>
              )}

              {/* Intellectual Property */}
              {termsContent.intellectualProperty && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Box className="w-4 h-4" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground m-0">3. Intellectual Property Rights</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {termsContent.intellectualProperty}
                  </p>
                </section>
              )}

              {/* User Conduct */}
              {termsContent.userConduct && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Scale className="w-4 h-4" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground m-0">4. Prohibited User Conduct</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {termsContent.userConduct}
                  </p>
                </section>
              )}

              {/* Limitation of Liability */}
              {termsContent.limitationLiability && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground m-0">5. Limitation of Liability</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {termsContent.limitationLiability}
                  </p>
                </section>
              )}

              {/* Governing Law */}
              {termsContent.governingLaw && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                      <Scale className="w-4 h-4" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground m-0">6. Governing Law</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {termsContent.governingLaw}
                  </p>
                </section>
              )}

              {/* Contact Us */}
              {termsContent.contactUs && (
                <section className="pt-8 border-t border-border/50">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                        <Mail className="w-4 h-4" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground m-0">7. Support & Contact Channel</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-6">
                      {termsContent.contactUs}
                    </p>
                    {project.content.contactUs.email && (
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20 inline-flex">
                        <Mail className="w-5 h-5 text-primary" />
                        <a href={`mailto:${project.content.contactUs.email}`} className="text-foreground font-medium hover:text-primary transition-colors">
                          {project.content.contactUs.email}
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer content={footerContent} settings={globalSettings} />
    </main>
  )
}
