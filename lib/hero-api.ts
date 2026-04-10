export type HeroStat = {
  value: string
  label: string
}

export type HeroButton = {
  text: string
  link: string
  variant: "primary" | "outline"
}

export type HeroContent = {
  badgeText: string
  mainHeading: string
  subHeading: string
  stats: HeroStat[]
  ctaButtons: HeroButton[]
}

export const DEFAULT_HERO_CONTENT: HeroContent = {
  badgeText: "Next-Generation Agentic AI",
  mainHeading: "We Build AI Systems That Run Businesses",
  subHeading:
    "Diin Technologies designs autonomous AI agents that think, plan, act, and learn - delivering real, measurable business outcomes for enterprise organizations.",
  stats: [
    { value: "6+", label: "Years Experience" },
    { value: "50+", label: "AI Agents Deployed" },
    { value: "10M+", label: "Tasks Automated" },
    { value: "99.9%", label: "Uptime SLA" },
  ],
  ctaButtons: [
    { text: "Book a Strategy Call", link: "#", variant: "primary" },
    { text: "Watch Demo", link: "#", variant: "outline" },
  ],
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

type HeroApiResponse = {
  success?: boolean
  data?: Partial<HeroContent>
}

function normalizeHeroContent(data?: Partial<HeroContent>): HeroContent {
  return {
    badgeText: data?.badgeText || DEFAULT_HERO_CONTENT.badgeText,
    mainHeading: data?.mainHeading || DEFAULT_HERO_CONTENT.mainHeading,
    subHeading: data?.subHeading || DEFAULT_HERO_CONTENT.subHeading,
    stats:
      data?.stats && data.stats.length
        ? data.stats.map((stat, index) => ({
            value: stat?.value || DEFAULT_HERO_CONTENT.stats[index]?.value || "",
            label: stat?.label || DEFAULT_HERO_CONTENT.stats[index]?.label || "",
          }))
        : DEFAULT_HERO_CONTENT.stats,
    ctaButtons:
      data?.ctaButtons && data.ctaButtons.length
        ? data.ctaButtons.map((button, index) => ({
            text: button?.text || DEFAULT_HERO_CONTENT.ctaButtons[index]?.text || "",
            link: button?.link || DEFAULT_HERO_CONTENT.ctaButtons[index]?.link || "#",
            variant: button?.variant || DEFAULT_HERO_CONTENT.ctaButtons[index]?.variant || "primary",
          }))
        : DEFAULT_HERO_CONTENT.ctaButtons,
  }
}

export async function getHeroContent(): Promise<HeroContent> {
  try {
    const response = await fetch(`${API_BASE_URL}/hero`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch hero content")
    }

    const result = (await response.json()) as HeroApiResponse
    return normalizeHeroContent(result.data)
  } catch {
    return DEFAULT_HERO_CONTENT
  }
}
