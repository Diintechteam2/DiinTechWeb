"use client"

import type { LogoCloudContent } from "@/lib/site-content-api"

interface LogoCloudProps {
  content: LogoCloudContent
}

export function LogoCloud({ content }: LogoCloudProps) {
  return (
    <section className="py-16 border-y border-border bg-card/30">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-10 uppercase tracking-wider">
          {content.introText}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {content.logos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <span className="font-bold text-sm">{logo.initials}</span>
              </div>
              <span className="font-semibold text-lg">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
