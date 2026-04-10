import { Button } from "@/components/ui/button"
import { Cog, Database, Headphones, Settings, TrendingUp } from "lucide-react"
import type { SolutionsSectionContent } from "@/lib/site-content-api"
import type { SolutionItem } from "@/lib/solutions-api"

const solutionIcons = {
  TrendingUp,
  Headphones,
  Settings,
  Database,
  Cog,
} as const

type SolutionsSectionProps = {
  sectionContent: SolutionsSectionContent
  solutions: SolutionItem[]
}

export function SolutionsSection({ sectionContent, solutions }: SolutionsSectionProps) {
  return (
    <section id="solutions" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">{sectionContent.badgeText}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            {sectionContent.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{sectionContent.description}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => {
            const Icon = solutionIcons[solution.icon as keyof typeof solutionIcons] || TrendingUp

            return (
              <div
                key={`${solution.title}-${index}`}
                className={`group relative bg-gradient-to-br ${solution.color} border ${solution.borderColor} rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="w-14 h-14 rounded-xl bg-background/80 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{solution.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{solution.description}</p>
                <div className="flex flex-wrap gap-2">
                  {solution.features.map((feature, featureIndex) => (
                    <span
                      key={`${solution.title}-${featureIndex}`}
                      className="px-3 py-1 text-xs font-medium bg-background/60 text-foreground rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            {sectionContent.primaryButtonText}
          </Button>
        </div>
      </div>
    </section>
  )
}
