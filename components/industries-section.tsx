"use client"

import { GraduationCap, Building2, Heart, Headphones, Rocket } from "lucide-react"

const industries = [
  {
    icon: GraduationCap,
    title: "Education & EdTech",
    description: "AI tutors, AI mentors, content agents, admissions automation.",
  },
  {
    icon: Building2,
    title: "BFSI & FinTech",
    description: "Compliance agents, risk analysis, customer onboarding AI.",
  },
  {
    icon: Heart,
    title: "Healthcare",
    description: "Scheduling agents, patient engagement, operations intelligence.",
  },
  {
    icon: Headphones,
    title: "BPO & Call Centers",
    description: "AI calling agents, QA automation, performance optimization.",
  },
  {
    icon: Rocket,
    title: "Enterprises & Startups",
    description: "End-to-end AI workforce deployment for any industry.",
  },
]

export function IndustriesSection() {
  return (
    <section id="industries" className="py-24 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Industries</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            AI Solutions Across Sectors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We deploy intelligent AI agents tailored to the unique challenges and opportunities in your industry.
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-2xl border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                <industry.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{industry.title}</h3>
              <p className="text-sm text-muted-foreground">{industry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
