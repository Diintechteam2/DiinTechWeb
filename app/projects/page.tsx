import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronLeft } from "lucide-react"
import { getProjects, getProjectAssets } from "@/lib/projects-api"
import { getFooterContent, getHeaderContent, getProjectsPageContent } from "@/lib/site-content-api"
import { getGlobalSettings } from "@/lib/settings-api"
import { ProjectsDirectoryClient } from "@/components/projects-directory-client"

export default async function ProjectsPage() {
  const headerContent = await getHeaderContent()
  const projects = await getProjects()
  const assets = await getProjectAssets()
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

      {/* Dynamic Projects and Assets Wrapper */}
      <div className="relative z-10 flex-grow">
        <ProjectsDirectoryClient
          projects={projects}
          initialAssets={assets}
          projectsPageContent={projectsPageContent}
        />
      </div>

      <Footer content={footerContent} settings={globalSettings} />
    </main>
  )
}
