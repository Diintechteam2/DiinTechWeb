import { cache } from "react"

export type GlobalSettingsContent = {
  email: string
  phone: string
  address: string
  whatsapp: {
    number: string
    message: string
  }
  socialLinks: {
    linkedin: string
    twitter: string
    instagram: string
  }
}

type SettingsResponse = {
  success?: boolean
  data?: Partial<GlobalSettingsContent>
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettingsContent = {
  email: "contact@diintech.com",
  phone: "+91 81475 40362",
  address: "C-116, Sector-2, Noida,\nUttar Pradesh - 201301, India",
  whatsapp: {
    number: "+919876543210",
    message: "Hello! I'm interested in Diin Technologies' Agentic AI solutions.",
  },
  socialLinks: {
    linkedin: "#",
    twitter: "#",
    instagram: "#",
  },
}

function normalizeSettings(data?: Partial<GlobalSettingsContent>): GlobalSettingsContent {
  return {
    email: data?.email || DEFAULT_GLOBAL_SETTINGS.email,
    phone: data?.phone || DEFAULT_GLOBAL_SETTINGS.phone,
    address: data?.address || DEFAULT_GLOBAL_SETTINGS.address,
    whatsapp: {
      number: data?.whatsapp?.number || DEFAULT_GLOBAL_SETTINGS.whatsapp.number,
      message: data?.whatsapp?.message || DEFAULT_GLOBAL_SETTINGS.whatsapp.message,
    },
    socialLinks: {
      linkedin: data?.socialLinks?.linkedin || DEFAULT_GLOBAL_SETTINGS.socialLinks.linkedin,
      twitter: data?.socialLinks?.twitter || DEFAULT_GLOBAL_SETTINGS.socialLinks.twitter,
      instagram: data?.socialLinks?.instagram || DEFAULT_GLOBAL_SETTINGS.socialLinks.instagram,
    },
  }
}

const fetchSettings = cache(async (): Promise<Partial<GlobalSettingsContent> | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch settings")
    }

    const result = (await response.json()) as SettingsResponse
    return result.data
  } catch {
    return undefined
  }
})

export async function getGlobalSettings(): Promise<GlobalSettingsContent> {
  const data = await fetchSettings()
  return normalizeSettings(data)
}
