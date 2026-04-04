"use client"

import { Cpu, Server, Database, Shield, Cloud, Zap } from "lucide-react"

const techStack = [
  { icon: Cpu, label: "Large Language Models (LLMs)" },
  { icon: Server, label: "Multi-Agent Frameworks" },
  { icon: Database, label: "Vector Databases & RAG" },
  { icon: Zap, label: "Voice AI (STT + TTS)" },
  { icon: Cloud, label: "Cloud-Native Microservices" },
  { icon: Shield, label: "Enterprise Security" },
]

const architectureFeatures = [
  "Modular & Scalable",
  "API-First Design",
  "Secure & Fault-Tolerant",
  "Role-Based Access Control",
  "Data Encryption at Rest & Transit",
  "Comprehensive Audit Logs",
]

export function TechnologySection() {
  return (
    <section id="technology" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Technology</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              Enterprise-Grade
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                AI Infrastructure
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Built on cutting-edge AI technologies with enterprise security and compliance at its core.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {techStack.map((tech, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                  <tech.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{tech.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Architecture Card */}
          <div className="bg-gradient-to-br from-card to-secondary/50 border border-border rounded-3xl p-8 lg:p-10">
            <h3 className="text-2xl font-bold text-foreground mb-6">Architecture & Security</h3>
            <div className="space-y-4">
              {architectureFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
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
                <span className="font-semibold text-foreground">Security & Compliance</span>
              </div>
              <p className="text-sm text-muted-foreground">
                SOC 2 compliant infrastructure with end-to-end encryption, GDPR-ready data handling, and comprehensive
                audit trails.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
