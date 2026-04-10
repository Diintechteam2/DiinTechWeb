"use client"

import { Award, Clock, Rocket, Shield, Target, Users } from "lucide-react"
import type { WhyDiinSectionContent } from "@/lib/site-content-api"

const reasonIcons = {
  Award,
  Clock,
  Rocket,
  Shield,
  Target,
  Users,
}

interface WhyDiinSectionProps {
  content: WhyDiinSectionContent
}

export function WhyDiinSection({ content }: WhyDiinSectionProps) {
  return (
    <section id="why-diin" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">{content.badgeText}</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            {content.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{content.description}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {content.reasons.map((reason, index) => {
            const Icon = reasonIcons[reason.icon as keyof typeof reasonIcons] || Rocket

            return (
              <div
                key={`${reason.title}-${index}`}
                className="group bg-card border border-border rounded-2xl p-8 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
