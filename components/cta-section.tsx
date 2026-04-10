"use client"

import { ArrowRight, Calendar, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CTASectionContent } from "@/lib/site-content-api"

interface CTASectionProps {
  content: CTASectionContent
}

export function CTASection({ content }: CTASectionProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-pulse-glow"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            {content.titleLineOne}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              {content.titleHighlight}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">{content.description}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-base px-8 py-6 h-auto"
            >
              <a href={content.primaryButton.link}>
                <Calendar className="mr-2 w-5 h-5" />
                {content.primaryButton.text}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary text-base px-8 py-6 h-auto bg-transparent"
            >
              <a href={content.secondaryButton.link}>
                <Mail className="mr-2 w-5 h-5" />
                {content.secondaryButton.text}
              </a>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            {content.trustIndicators.map((indicator, index) => (
              <div key={`${indicator}-${index}`} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {indicator}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
