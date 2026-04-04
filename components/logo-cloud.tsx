"use client"

const logos = [
  { name: "TechCorp", initials: "TC" },
  { name: "InnovateLabs", initials: "IL" },
  { name: "DataDriven", initials: "DD" },
  { name: "ScaleUp", initials: "SU" },
  { name: "FutureAI", initials: "FA" },
  { name: "CloudFirst", initials: "CF" },
]

export function LogoCloud() {
  return (
    <section className="py-16 border-y border-border bg-card/30">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-10 uppercase tracking-wider">
          Trusted by innovative companies worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((logo, index) => (
            <div
              key={index}
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
