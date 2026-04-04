export interface Project {
  slug: string
  name: string
  lastUpdated?: string
  content: {
    introduction: string
    informationCollect: {
      personal: string[]
      userContent: string[]
      deviceUsage: string[]
    }
    howWeUse: string[]
    dataSharing: string[]
    dataSecurity: string
    dataRetention: string
    dataDeletion: {
      instruction: string
      email: string
      subject: string
    }
    childrenPrivacy: string
    thirdParty: string
    changesToPolicy: string
    contactUs: {
      instruction: string
      email: string
    }
  }
}

export const PROJECTS: Project[] = [
  {
    slug: "badhai",
    name: "BadhAI",
    lastUpdated: "02/04/2026",
    content: {
      introduction: "BadhAI (\"we\", \"our\", or \"us\") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.",
      informationCollect: {
        personal: ["Name (if provided)", "Email address", "Phone number"],
        userContent: ["Photos uploaded by users", "Content submitted for reel creation"],
        deviceUsage: ["Device type and operating system", "App usage data"]
      },
      howWeUse: [
        "To provide reel creation services",
        "To process user requests",
        "To deliver created reels",
        "To improve app performance",
        "To communicate with users if required"
      ],
      dataSharing: [
        "We do not sell user data.",
        "We may share data only with internal team/admin for processing requests and service providers (hosting, analytics)."
      ],
      dataSecurity: "We take reasonable security measures to protect your data. All data transmission is encrypted using secure protocols (HTTPS).",
      dataRetention: "We retain user data only as long as necessary to provide services and fulfill user requests.",
      dataDeletion: {
        instruction: "Users can request deletion of their data at any time.",
        email: "cotact@diintech.com",
        subject: "Delete my user details for BadhAI app"
      },
      childrenPrivacy: "BadhAI is not intended for children under the age of 13. We do not knowingly collect data from children.",
      thirdParty: "We may use third-party services such as Firebase and cloud storage providers. These services may process data according to their own privacy policies.",
      changesToPolicy: "We may update this Privacy Policy from time to time. Users are advised to review this page periodically.",
      contactUs: {
        instruction: "If you have any questions, contact us at:",
        email: "cotact@diintech.com"
      }
    }
  }
]
