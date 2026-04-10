import { Cloud, Cpu, Database, Server, Shield, Zap } from "lucide-react"
import type { TechnologySectionContent } from "@/lib/site-content-api"

const technologyIcons = {
  Cpu,
  Server,
  Database,
  Zap,
  Cloud,
  Shield,
} as const

type TechnologySectionProps = {
  content: TechnologySectionContent
}

export function TechnologySection({ content }: TechnologySectionProps) {
  return (
    <section id="technology" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">{content.badgeText}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              {content.titleLineOne}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                {content.titleHighlight}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">{content.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {content.techStack.map((tech, index) => {
                const Icon = technologyIcons[tech.icon as keyof typeof technologyIcons] || Cpu

                return (
                  <div key={`${tech.label}-${index}`} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{tech.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-card to-secondary/50 border border-border rounded-3xl p-8 lg:p-10">
            <h3 className="text-2xl font-bold text-foreground mb-6">{content.architectureTitle}</h3>
            <div className="space-y-4">
              {content.architectureFeatures.map((feature, index) => (
                <div key={`${feature}-${index}`} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-background/50 border border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-primary" />
                <span className="font-semibold text-foreground">{content.securityTitle}</span>
              </div>
              <p className="text-sm text-muted-foreground">{content.securityDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
