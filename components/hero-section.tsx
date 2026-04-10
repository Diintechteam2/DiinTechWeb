"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import type { HeroContent } from "@/lib/hero-api"

type HeroSectionProps = {
  content: HeroContent
}

function splitHeroHeading(heading: string) {
  const suffix = "Run Businesses"

  if (heading.endsWith(suffix)) {
    const prefix = heading.slice(0, -suffix.length).trimEnd()
    return { prefix, highlight: suffix }
  }

  return {
    prefix: "",
    highlight: heading,
  }
}

export function HeroSection({ content }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const headingParts = splitHeroHeading(content.mainHeading)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = []
    const particleCount = 80

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      })
    }

    const animate = () => {
      ctx.fillStyle = "rgba(12, 12, 24, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "rgba(0, 212, 255, 0.15)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.globalAlpha = ((150 - distance) / 150) * 0.3
            ctx.stroke()
          }
        }
      }

      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0, 212, 255, 0.7)"
        ctx.globalAlpha = 1
        ctx.fill()

        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(180deg, #0f0f14 0%, #0a0a0f 100%)" }}
      />

      <div className="absolute inset-0 z-0 grid-bg opacity-50" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4" />
            <span>{content.badgeText}</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-slide-up text-balance"
            style={{ animationDelay: "0.1s" }}
          >
            {headingParts.prefix ? `${headingParts.prefix} ` : ""}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient">
              {headingParts.highlight}
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-slide-up text-pretty"
            style={{ animationDelay: "0.2s" }}
          >
            {content.subHeading}
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            {content.ctaButtons.map((button) => (
              <Button
                key={`${button.variant}-${button.text}`}
                asChild
                size="lg"
                variant={button.variant === "outline" ? "outline" : "default"}
                className={
                  button.variant === "outline"
                    ? "border-border text-foreground hover:bg-secondary text-base px-8 py-6 h-auto bg-transparent"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-base px-8 py-6 h-auto"
                }
              >
                <a href={button.link || "#"}>
                  {button.variant === "outline" ? <Play className="mr-2 w-5 h-5" /> : null}
                  {button.text}
                  {button.variant === "primary" ? <ArrowRight className="ml-2 w-5 h-5" /> : null}
                </a>
              </Button>
            ))}
          </div>

          <div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            {content.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  )
}
