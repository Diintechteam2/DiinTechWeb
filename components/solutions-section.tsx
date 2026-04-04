"use client"

import { TrendingUp, Headphones, Settings, Database, Cog } from "lucide-react"
import { Button } from "@/components/ui/button"

const solutions = [
  {
    icon: TrendingUp,
    title: "AI Sales & Growth Agents",
    description:
      "Autonomous lead qualification, AI voice & chat follow-ups, CRM updates & deal tracking, revenue forecasting.",
    features: ["Lead Qualification", "Voice & Chat AI", "CRM Automation", "Revenue Intelligence"],
    color: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/30",
  },
  {
    icon: Headphones,
    title: "AI Customer Support Agents",
    description:
      "24×7 voice & chat support, context-aware conversations, ticket resolution & escalation, omnichannel support.",
    features: ["24/7 Availability", "Context Awareness", "Auto-Resolution", "Omnichannel"],
    color: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    icon: Settings,
    title: "AI Operations Agents",
    description: "Workflow orchestration, task allocation & monitoring, internal reporting, process optimization.",
    features: ["Workflow Automation", "Task Management", "Analytics", "Optimization"],
    color: "from-indigo-500/20 to-purple-500/20",
    borderColor: "border-indigo-500/30",
  },
  {
    icon: Database,
    title: "AI Knowledge & RAG Systems",
    description:
      "Enterprise knowledge ingestion, secure vector search, policy-aware AI responses, internal AI copilots.",
    features: ["Knowledge Graphs", "Vector Search", "Policy Compliance", "AI Copilots"],
    color: "from-purple-500/20 to-fuchsia-500/20",
    borderColor: "border-purple-500/30",
  },
  {
    icon: Cog,
    title: "Custom Enterprise AI",
    description:
      "Fully tailored agent ecosystems, API & system integrations, cloud & on-prem deployment, scalable architectures.",
    features: ["Custom Agents", "API Integrations", "Flexible Deployment", "Scalable"],
    color: "from-fuchsia-500/20 to-cyan-500/20",
    borderColor: "border-fuchsia-500/30",
  },
]

export function SolutionsSection() {
  return (
    <section id="solutions" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Solutions</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            AI Agents for Every Business Function
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deploy autonomous AI agents across your organization to transform operations, enhance customer experience,
            and drive growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${solution.color} border ${solution.borderColor} rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="w-14 h-14 rounded-xl bg-background/80 flex items-center justify-center mb-6">
                <solution.icon className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{solution.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{solution.description}</p>
              <div className="flex flex-wrap gap-2">
                {solution.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium bg-background/60 text-foreground rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Explore All Solutions
          </Button>
        </div>
      </div>
    </section>
  )
}
