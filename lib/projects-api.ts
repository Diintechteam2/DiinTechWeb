import { PROJECTS, type Project } from "@/lib/projects-data"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

type ProjectApiResponse = {
  success?: boolean
  data?: Project | Project[]
}

function normalizeProject(project: Partial<Project>): Project {
  return {
    slug: project.slug || "",
    name: project.name || "",
    logoUrl: project.logoUrl || "",
    lastUpdated: project.lastUpdated || "",
    websiteUrl: project.websiteUrl || "",
    content: {
      introduction: project.content?.introduction || "",
      informationCollect: {
        personal: project.content?.informationCollect?.personal || [],
        userContent: project.content?.informationCollect?.userContent || [],
        deviceUsage: project.content?.informationCollect?.deviceUsage || [],
      },
      howWeUse: project.content?.howWeUse || [],
      dataSharing: project.content?.dataSharing || [],
      dataSecurity: project.content?.dataSecurity || "",
      dataRetention: project.content?.dataRetention || "",
      dataDeletion: {
        instruction: project.content?.dataDeletion?.instruction || "",
        email: project.content?.dataDeletion?.email || "",
        subject: project.content?.dataDeletion?.subject || "",
      },
      childrenPrivacy: project.content?.childrenPrivacy || "",
      thirdParty: project.content?.thirdParty || "",
      changesToPolicy: project.content?.changesToPolicy || "",
      imageProcessing: project.content?.imageProcessing || "",
      disclaimer: project.content?.disclaimer || "",
      contactUs: {
        instruction: project.content?.contactUs?.instruction || "",
        email: project.content?.contactUs?.email || "",
      },
    },
    refundPolicy: project.refundPolicy ? {
      enabled: !!project.refundPolicy.enabled,
      content: {
        introduction: project.refundPolicy.content?.introduction || "",
        eligibility: project.refundPolicy.content?.eligibility || "",
        timeline: project.refundPolicy.content?.timeline || "",
        process: project.refundPolicy.content?.process || "",
      }
    } : undefined,
    termsConditions: project.termsConditions ? {
      enabled: !!project.termsConditions.enabled,
      content: {
        introduction: project.termsConditions.content?.introduction || "",
        userAgreement: project.termsConditions.content?.userAgreement || "",
        intellectualProperty: project.termsConditions.content?.intellectualProperty || "",
        userConduct: project.termsConditions.content?.userConduct || "",
        limitationLiability: project.termsConditions.content?.limitationLiability || "",
        governingLaw: project.termsConditions.content?.governingLaw || "",
        contactUs: project.termsConditions.content?.contactUs || "",
      }
    } : undefined,
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch projects")
    }

    const result = (await response.json()) as ProjectApiResponse
    const projects = Array.isArray(result.data) ? result.data : []

    if (!projects.length) {
      return PROJECTS
    }

    return projects.map((project) => normalizeProject(project))
  } catch {
    return PROJECTS
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${slug}`, {
      cache: "no-store",
    })

    if (response.ok) {
      const result = (await response.json()) as ProjectApiResponse
      if (result.data && !Array.isArray(result.data)) {
        return normalizeProject(result.data)
      }
    }
  } catch {
    // Fall back to static project data below.
  }

  return PROJECTS.find((project) => project.slug.toLowerCase() === slug.toLowerCase()) || null
}
