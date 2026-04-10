import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"

function normalizeIconName(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
}

const iconEntries = Object.entries(LucideIcons).filter(
  ([name, value]) => typeof value === "function" && /^[A-Z]/.test(name)
)

const normalizedIconMap = new Map<string, LucideIcon>(
  iconEntries.map(([name, component]) => [normalizeIconName(name), component as LucideIcon])
)

const iconAliases: Record<string, string> = {
  bank: "Building2",
  banking: "Building2",
  finance: "Building2",
  fintech: "Building2",
  ecommerce: "ShoppingCart",
  commerce: "ShoppingCart",
  shopping: "ShoppingCart",
  manufacturing: "Factory",
  factory: "Factory",
  healthcare: "Heart",
  health: "Heart",
  support: "Headphones",
  education: "GraduationCap",
  edtech: "GraduationCap",
  startup: "Rocket",
  enterprise: "Rocket",
}

export function resolveLucideIcon(iconName: string, fallbackName = "Rocket") {
  const normalizedInput = normalizeIconName(iconName || "")
  const aliasName = normalizedInput ? iconAliases[normalizedInput] : undefined
  const normalizedAlias = aliasName ? normalizeIconName(aliasName) : ""
  const normalizedFallback = normalizeIconName(fallbackName)

  return (
    normalizedIconMap.get(normalizedInput) ||
    normalizedIconMap.get(normalizedAlias) ||
    normalizedIconMap.get(normalizedFallback) ||
    LucideIcons.Rocket
  )
}
