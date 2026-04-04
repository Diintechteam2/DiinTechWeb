import Link from "next/link"
import { PROJECTS } from "@/lib/projects-data"
import { ArrowRight, Box } from "lucide-react"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Our <span className="text-primary">Projects</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore the products and applications built by Diin Technologies to solve real-world problems through autonomous intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <div 
              key={project.slug} 
              className="group relative bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
              
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                <Box className="w-6 h-6" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-2">{project.name}</h2>
              
              <p className="text-muted-foreground mb-6 line-clamp-3">
                {project.content.introduction}
              </p>
              
              <div className="flex flex-col gap-3 mt-auto">
                <Link 
                  href={`/projects/${project.slug}/privacy-policy`}
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group-hover:gap-2 gap-1 duration-300"
                >
                  Privacy Policy <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                {/* You can add more links here in the future, like Terms, App Store link, etc. */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
