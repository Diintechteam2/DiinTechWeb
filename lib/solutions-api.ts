export type SolutionItem = {
  icon: string
  title: string
  description: string
  features: string[]
  color: string
  borderColor: string
  order?: number
}

type SolutionsApiResponse = {
  success?: boolean
  data?: Partial<SolutionItem>[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

export const DEFAULT_SOLUTIONS: SolutionItem[] = [
  {
    icon: "TrendingUp",
    title: "AI Sales & Growth Agents",
    description:
      "Autonomous lead qualification, AI voice & chat follow-ups, CRM updates & deal tracking, revenue forecasting.",
    features: ["Lead Qualification", "Voice & Chat AI", "CRM Automation", "Revenue Intelligence"],
    color: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/30",
    order: 1,
  },
  {
    icon: "Headphones",
    title: "AI Customer Support Agents",
    description:
      "24x7 voice & chat support, context-aware conversations, ticket resolution & escalation, omnichannel support.",
    features: ["24/7 Availability", "Context Awareness", "Auto-Resolution", "Omnichannel"],
    color: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-500/30",
    order: 2,
  },
  {
    icon: "Settings",
    title: "AI Operations Agents",
    description: "Workflow orchestration, task allocation & monitoring, internal reporting, process optimization.",
    features: ["Workflow Automation", "Task Management", "Analytics", "Optimization"],
    color: "from-indigo-500/20 to-purple-500/20",
    borderColor: "border-indigo-500/30",
    order: 3,
  },
  {
    icon: "Database",
    title: "AI Knowledge & RAG Systems",
    description:
      "Enterprise knowledge ingestion, secure vector search, policy-aware AI responses, internal AI copilots.",
    features: ["Knowledge Graphs", "Vector Search", "Policy Compliance", "AI Copilots"],
    color: "from-purple-500/20 to-fuchsia-500/20",
    borderColor: "border-purple-500/30",
    order: 4,
  },
  {
    icon: "Cog",
    title: "Custom Enterprise AI",
    description:
      "Fully tailored agent ecosystems, API & system integrations, cloud & on-prem deployment, scalable architectures.",
    features: ["Custom Agents", "API Integrations", "Flexible Deployment", "Scalable"],
    color: "from-fuchsia-500/20 to-cyan-500/20",
    borderColor: "border-fuchsia-500/30",
    order: 5,
  },
]

function normalizeSolution(solution?: Partial<SolutionItem>, index = 0): SolutionItem {
  const fallback = DEFAULT_SOLUTIONS[index] || DEFAULT_SOLUTIONS[0]

  return {
    icon: solution?.icon || fallback.icon,
    title: solution?.title || fallback.title,
    description: solution?.description || fallback.description,
    features: solution?.features?.length ? solution.features : fallback.features,
    color: solution?.color || fallback.color,
    borderColor: solution?.borderColor || fallback.borderColor,
    order: solution?.order ?? fallback.order ?? index,
  }
}

export async function getSolutionsContent(): Promise<SolutionItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/solutions`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch solutions")
    }

    const result = (await response.json()) as SolutionsApiResponse
    const items = Array.isArray(result.data) ? result.data : []

    if (!items.length) {
      return DEFAULT_SOLUTIONS
    }

    return items.map((item, index) => normalizeSolution(item, index))
  } catch {
    return DEFAULT_SOLUTIONS
  }
}
