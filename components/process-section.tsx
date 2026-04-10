import { Code, LineChart, PenTool, Rocket, Search } from "lucide-react"
import type { ProcessSectionContent } from "@/lib/site-content-api"

const processIcons = {
  Search,
  PenTool,
  Code,
  Rocket,
  LineChart,
} as const

type ProcessSectionProps = {
  content: ProcessSectionContent
}

export function ProcessSection({ content }: ProcessSectionProps) {
  return (
    <section className="py-24 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">{content.badgeText}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            {content.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{content.description}</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

            <div className="space-y-12 lg:space-y-0">
              {content.steps.map((step, index) => {
                const Icon = processIcons[step.icon as keyof typeof processIcons] || Search

                return (
                  <div
                    key={`${step.number}-${step.title}-${index}`}
                    className={`lg:flex items-center gap-8 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                  >
                    <div className={`lg:w-1/2 ${index % 2 === 0 ? "lg:text-right lg:pr-12" : "lg:pl-12"}`}>
                      <div
                        className={`bg-background border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors ${index % 2 === 0 ? "lg:ml-auto" : ""} max-w-md`}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <span className="text-4xl font-bold text-primary/20">{step.number}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>

                    <div className="hidden lg:flex w-4 h-4 rounded-full bg-primary glow-primary flex-shrink-0 relative z-10" />
                    <div className="lg:w-1/2" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
