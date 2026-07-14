import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProjectBySlug, getProjectAssets } from "@/lib/projects-api"
import { getFooterContent, getHeaderContent, getProjectsPageContent } from "@/lib/site-content-api"
import { getGlobalSettings } from "@/lib/settings-api"
import { ProjectVideosClient } from "@/components/project-videos-client"
import { notFound } from "next/navigation"

interface ProjectReelsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProjectReelsPage({ params }: ProjectReelsPageProps) {
  const { slug } = await params

  // 1. Fetch project details
  const project = await getProjectBySlug(slug)
  if (!project) {
    notFound()
  }

  // 2. Fetch header, footer, global settings, and content translations
  const headerContent = await getHeaderContent()
  const projectsPageContent = await getProjectsPageContent()
  const footerContent = await getFooterContent()
  const globalSettings = await getGlobalSettings()

  // 3. Fetch assets of type "video" and filter by this project's slug
  const allVideoAssets = await getProjectAssets(undefined, "video")
  const projectAssets = allVideoAssets.filter(
    (asset) => asset.project?.slug.toLowerCase() === slug.toLowerCase()
  )

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Header content={headerContent} />
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Dynamic Projects and Assets Wrapper */}
      <div className="relative z-10 flex-grow">
        <ProjectVideosClient
          project={project}
          assets={projectAssets}
          projectsPageContent={projectsPageContent}
        />
      </div>

      <Footer content={footerContent} settings={globalSettings} />
    </main>
  )
}
