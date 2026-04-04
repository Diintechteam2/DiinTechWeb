"use client"

import { Award, Target, Users, Rocket, Shield, Clock } from "lucide-react"

const reasons = [
  {
    icon: Clock,
    title: "6+ Years of Excellence",
    description: "Battle-tested expertise in AI and software development.",
  },
  {
    icon: Target,
    title: "Agentic-First Mindset",
    description: "We think in autonomous agents, not just automation scripts.",
  },
  {
    icon: Rocket,
    title: "Business Outcome Driven",
    description: "We measure success by your business metrics, not technical vanity.",
  },
  {
    icon: Shield,
    title: "Enterprise-Ready Systems",
    description: "Security, compliance, and scalability built from the ground up.",
  },
  {
    icon: Users,
    title: "End-to-End Ownership",
    description: "From strategy to deployment to optimization — we own it all.",
  },
  {
    icon: Award,
    title: "Builders, Not Experimenters",
    description: "Production-grade AI that works in the real world, today.",
  },
]

export function WhyDiinSection() {
  return (
    <section id="why-diin" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Why Diin</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            Your Partner in AI Transformation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;re not just another AI vendor. We&apos;re builders who understand that AI must deliver real business
            value.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-2xl p-8 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <reason.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
