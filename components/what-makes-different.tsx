"use client"

import { Check, X } from "lucide-react"

const comparisons = [
  { traditional: "Rule-based workflows", diin: "Goal-driven intelligence" },
  { traditional: "Human-dependent", diin: "Autonomous execution" },
  { traditional: "Isolated tools", diin: "Multi-agent ecosystems" },
  { traditional: "Static logic", diin: "Self-learning systems" },
]

export function WhatMakesDifferent() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">The Diin Difference</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
              We Don&apos;t Automate Tasks.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                We Build AI Workforces.
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Traditional automation follows rules. Our Agentic AI understands goals and achieves them autonomously.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional Column */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-muted-foreground">Traditional Automation</h3>
              </div>
              <ul className="space-y-4">
                {comparisons.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    {item.traditional}
                  </li>
                ))}
              </ul>
            </div>

            {/* Diin Column */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-2xl p-6 md:p-8 glow-primary">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Diin&apos;s Agentic AI</h3>
              </div>
              <ul className="space-y-4">
                {comparisons.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {item.diin}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
