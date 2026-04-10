import {
  Building2,
  DollarSign,
  Factory,
  GraduationCap,
  Headphones,
  Heart,
  Rocket,
  ShoppingCart,
  Stethoscope,
} from "lucide-react"
import type { IndustriesSectionContent } from "@/lib/site-content-api"
import type { IndustryItem } from "@/lib/industries-api"

const industryIcons = {
  GraduationCap,
  Building2,
  Heart,
  Headphones,
  Rocket,
  Stethoscope,
  ShoppingCart,
  DollarSign,
  Factory,
} as const

type IndustriesSectionProps = {
  sectionContent: IndustriesSectionContent
  industries: IndustryItem[]
}

export function IndustriesSection({ sectionContent, industries }: IndustriesSectionProps) {
  return (
    <section id="industries" className="py-24 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">{sectionContent.badgeText}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            {sectionContent.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{sectionContent.description}</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {industries.map((industry, index) => {
            const Icon = industryIcons[industry.icon as keyof typeof industryIcons] || Rocket

            return (
              <div
                key={`${industry.title}-${index}`}
                className="group text-center p-6 rounded-2xl border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{industry.title}</h3>
                <p className="text-sm text-muted-foreground">{industry.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
