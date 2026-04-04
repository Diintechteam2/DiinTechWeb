"use client"

import { Brain, Users, Shield, Sparkles } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Autonomous Decision-Making",
    description:
      "AI systems capable of independent decision-making and action. Unlike traditional AI that waits for prompts, agentic AI understands goals and achieves them.",
  },
  {
    icon: Users,
    title: "Multi-Agent Collaboration",
    description:
      "Collaborative AI agents, each responsible for specific roles: Planner Agents, Executor Agents, Evaluator Agents, and Memory Agents working together.",
  },
  {
    icon: Shield,
    title: "Human-in-the-Loop Control",
    description:
      "Governance, approvals, auditability, ethical AI behavior, and override mechanisms ensure safe and controlled AI operations.",
  },
  {
    icon: Sparkles,
    title: "Self-Learning Systems",
    description:
      "Our agents learn from outcomes, continuously improving their performance and adapting to new challenges without manual intervention.",
  },
]

export function AgenticAISection() {
  return (
    <section className="py-24 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Agentic AI</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            AI With Agency
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Agentic AI refers to AI systems capable of independent decision-making and action. This is AI that thinks,
            plans, acts, and learns.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-background border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
