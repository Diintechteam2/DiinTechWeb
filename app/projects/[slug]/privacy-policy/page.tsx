import { PROJECTS } from "@/lib/projects-data"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Shield, Mail, FileText, ChevronRight, Box } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPrivacyPolicy({ params }: PageProps) {
  const { slug } = await params
  const project = PROJECTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase())

  if (!project) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <Header />

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-32 pb-24">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 animate-slide-up">
          <Link href="/projects" className="hover:text-foreground cursor-pointer transition-colors flex items-center gap-1.5">
            Projects
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{project.name}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary/80">Privacy Policy</span>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
              <Shield className="w-3.5 h-3.5" />
              <span>Legal Compliance</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Privacy Policy for <span className="text-primary">{project.name}</span>
            </h1>
            <p className="text-lg font-medium text-foreground/80 mb-4">
              A unit of Diin Technology
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Effective Date: <span className="text-foreground/80 font-medium">{project.lastUpdated}</span>
            </p>
          </div>

          {/* Policy Content Card */}
          <div
            className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 md:p-12 shadow-2xl animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="prose prose-invert max-w-none space-y-12">
              {(() => {
                let count = 1;
                return (
                  <>
                    {/* Introduction */}
                    <section>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                          <FileText className="w-4 h-4" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground m-0">{count++}. Introduction</h2>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.content.introduction}
                      </p>
                    </section>

                    {/* Information Collection */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                          <Shield className="w-4 h-4" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground m-0">{count++}. Information We Collect</h2>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                          <h3 className="text-lg font-semibold text-foreground mb-3">a. Personal</h3>
                          <ul className="space-y-2 list-none p-0">
                            {project.content.informationCollect.personal.map((item, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                          <h3 className="text-lg font-semibold text-foreground mb-3">b. User Content</h3>
                          <ul className="space-y-2 list-none p-0">
                            {project.content.informationCollect.userContent.map((item, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                          <h3 className="text-lg font-semibold text-foreground mb-3">c. Device & Usage</h3>
                          <ul className="space-y-2 list-none p-0">
                            {project.content.informationCollect.deviceUsage.map((item, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* How We Use */}
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-bold text-foreground m-0">{count++}. How We Use Your Information</h2>
                      </div>
                      <ul className="grid sm:grid-cols-2 gap-4 m-0 p-0 list-none">
                        {project.content.howWeUse.map((item, i) => (
                          <li key={i} className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-muted-foreground text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Image Processing & AI Use (Conditional) */}
                    {project.content.imageProcessing && (
                      <section>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                            <Box className="w-4 h-4" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground m-0">{count++}. Image Processing & AI Use</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {project.content.imageProcessing}
                        </p>
                      </section>
                    )}

                    {/* Data Sharing & Security */}
                    <div className="grid md:grid-cols-2 gap-12">
                      <section>
                        <div className="flex items-center gap-3 mb-4">
                          <h2 className="text-xl font-bold text-foreground m-0">{count++}. Data Sharing</h2>
                        </div>
                        <div className="space-y-4">
                          {project.content.dataSharing.map((p, i) => (
                            <p key={i} className="text-sm text-muted-foreground m-0">{p}</p>
                          ))}
                        </div>
                      </section>
                      <section>
                        <div className="flex items-center gap-3 mb-4">
                          <h2 className="text-xl font-bold text-foreground m-0">{count++}. Data Security</h2>
                        </div>
                        <p className="text-sm text-muted-foreground m-0">{project.content.dataSecurity}</p>
                      </section>
                    </div>

                    {/* Data Retention */}
                    <section>
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-xl font-bold text-foreground m-0">{count++}. Data Retention</h2>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{project.content.dataRetention}</p>
                    </section>

                    {/* Deletion */}
                    <section>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-foreground mb-4">{count++}. User Data Deletion</h2>
                        <p className="text-sm text-muted-foreground mb-4">{project.content.dataDeletion.instruction}</p>
                        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Request Email</p>
                          <p className="text-primary font-mono text-sm">{project.content.dataDeletion.email}</p>
                          <p className="text-xs text-muted-foreground mt-2 italic font-mono">Subject: {project.content.dataDeletion.subject}</p>
                        </div>
                      </div>
                    </section>

                    {/* Children's Privacy & Third-Party */}
                    <div className="grid md:grid-cols-2 gap-12">
                      <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">{count++}. Children's Privacy</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">{project.content.childrenPrivacy}</p>
                      </section>
                      <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">{count++}. Third-Party Services</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">{project.content.thirdParty}</p>
                      </section>
                    </div>

                    {/* AI Disclaimer (Conditional) */}
                    {project.content.disclaimer && (
                      <section className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <h2 className="text-xl font-bold text-foreground mb-4">{count++}. AI-Generated Results Disclaimer</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">{project.content.disclaimer}</p>
                      </section>
                    )}

                    {/* Changes to Policy */}
                    <section>
                      <h2 className="text-xl font-bold text-foreground mb-4">{count++}. Changes to This Policy</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{project.content.changesToPolicy}</p>
                    </section>

                    {/* Contact Us */}
                    <section className="pt-8 border-t border-border/50">
                      <div className="max-w-2xl">
                        <h2 className="text-xl font-bold text-foreground mb-4">{count++}. Contact Us</h2>
                        <p className="text-sm text-muted-foreground mb-4">{project.content.contactUs.instruction}</p>
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20 inline-flex">
                          <Mail className="w-5 h-5 text-primary" />
                          <a href={`mailto:${project.content.contactUs.email}`} className="text-foreground font-medium hover:text-primary transition-colors">
                            {project.content.contactUs.email}
                          </a>
                        </div>
                      </div>
                    </section>
                  </>
                );
              })()}

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
