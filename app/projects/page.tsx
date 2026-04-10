import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Box, ChevronLeft, ExternalLink } from "lucide-react"
import { getProjects } from "@/lib/projects-api"
import { getFooterContent, getHeaderContent, getProjectsPageContent } from "@/lib/site-content-api"
import { getGlobalSettings } from "@/lib/settings-api"

export default async function ProjectsPage() {
  const headerContent = await getHeaderContent()
  const projects = await getProjects()
  const projectsPageContent = await getProjectsPageContent()
  const footerContent = await getFooterContent()
  const globalSettings = await getGlobalSettings()

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Header content={headerContent} />
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 pt-32 pb-24 flex-grow">
        <div className="container mx-auto px-4 lg:px-8 text-center md:text-left">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group text-sm"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{projectsPageContent.backLinkText}</span>
          </Link>
          <div className="max-w-3xl mb-10 mx-auto md:mx-0">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-3">
              {projectsPageContent.titlePrefix}{" "}
              <span className="text-primary">{projectsPageContent.titleHighlight}</span>
            </h1>
            <p className="text-base text-muted-foreground">{projectsPageContent.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div 
                key={project.slug} 
                className="group relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl p-5 hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                
                <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  {project.logoUrl ? (
                    <img
                      src={project.logoUrl}
                      alt={`${project.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Box className="w-5 h-5" />
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">{project.name}</h2>
                
                <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                  {project.content.introduction}
                </p>
                
                <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-border/50">
                  {project.websiteUrl && (
                    <a 
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                    >
                      {projectsPageContent.visitWebsiteLabel} <ExternalLink className="w-3.5 h-3.5 ml-1.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                  <Link 
                    href={`/projects/${project.slug}/privacy-policy`}
                    className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                  >
                    {projectsPageContent.privacyPolicyLabel} <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer content={footerContent} settings={globalSettings} />
    </main>
  )
}
