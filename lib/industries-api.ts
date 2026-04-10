export type IndustryItem = {
  icon: string
  title: string
  description: string
  order?: number
}

type IndustriesApiResponse = {
  success?: boolean
  data?: Partial<IndustryItem>[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

export const DEFAULT_INDUSTRIES: IndustryItem[] = [
  {
    icon: "GraduationCap",
    title: "Education & EdTech",
    description: "AI tutors, AI mentors, content agents, admissions automation.",
    order: 1,
  },
  {
    icon: "Building2",
    title: "BFSI & FinTech",
    description: "Compliance agents, risk analysis, customer onboarding AI.",
    order: 2,
  },
  {
    icon: "Heart",
    title: "Healthcare",
    description: "Scheduling agents, patient engagement, operations intelligence.",
    order: 3,
  },
  {
    icon: "Headphones",
    title: "BPO & Call Centers",
    description: "AI calling agents, QA automation, performance optimization.",
    order: 4,
  },
  {
    icon: "Rocket",
    title: "Enterprises & Startups",
    description: "End-to-end AI workforce deployment for any industry.",
    order: 5,
  },
]

function normalizeIndustry(industry?: Partial<IndustryItem>, index = 0): IndustryItem {
  const fallback = DEFAULT_INDUSTRIES[index] || DEFAULT_INDUSTRIES[0]

  return {
    icon: industry?.icon || fallback.icon,
    title: industry?.title || fallback.title,
    description: industry?.description || fallback.description,
    order: industry?.order ?? fallback.order ?? index,
  }
}

export async function getIndustriesContent(): Promise<IndustryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/industries`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch industries")
    }

    const result = (await response.json()) as IndustriesApiResponse
    const items = Array.isArray(result.data) ? result.data : []

    if (!items.length) {
      return DEFAULT_INDUSTRIES
    }

    return items.map((item, index) => normalizeIndustry(item, index))
  } catch {
    return DEFAULT_INDUSTRIES
  }
}
