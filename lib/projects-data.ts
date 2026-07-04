export interface Project {
  slug: string
  name: string
  logoUrl?: string
  lastUpdated?: string
  websiteUrl?: string
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
    imageProcessing?: string
    disclaimer?: string
    contactUs: {
      instruction: string
      email: string
    }
  }
  refundPolicy?: {
    enabled: boolean
    content: {
      introduction: string
      eligibility: string
      timeline: string
      process: string
    }
  }
  termsConditions?: {
    enabled: boolean
    content: {
      introduction: string
      userAgreement: string
      intellectualProperty: string
      userConduct: string
      limitationLiability: string
      governingLaw: string
      contactUs: string
    }
  }
}

export const PROJECTS: Project[] = [
  {
    slug: "badhai",
    name: "BadhAI",
    websiteUrl: "#",
    lastUpdated: "04/04/2026",
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
        email: "contact@diintech.com",
        subject: "Delete my user details for BadhAI app"
      },
      childrenPrivacy: "BadhAI is not intended for children under the age of 13. We do not knowingly collect data from children.",
      thirdParty: "We may use third-party services such as Firebase and cloud storage providers. These services may process data according to their own privacy policies.",
      changesToPolicy: "We may update this Privacy Policy from time to time. Users are advised to review this page periodically.",
      contactUs: {
        instruction: "If you have any questions, contact us at:",
        email: "contact@diintech.com"
      }
    }
  },
  {
    slug: "yovoai",
    name: "YovoAI",
    websiteUrl: "https://viralstatus-frontend.vercel.app/landingpage",
    lastUpdated: "06/04/2026",
    content: {
      introduction: "YovoAI (\"we\", \"our\", or \"us\") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application and related services.",
      informationCollect: {
        personal: ["Name (if provided)", "Email address", "Phone number (if provided)"],
        userContent: [
          "Text prompts submitted by users",
          "Images uploaded by users",
          "AI-generated images and related content",
          "Any content submitted for processing through the app"
        ],
        deviceUsage: [
          "Device type and operating system",
          "App usage data",
          "Log information such as crashes, access times, and app activity"
        ]
      },
      howWeUse: [
        "To provide AI image generation and related services",
        "To process user prompts and uploaded content",
        "To generate and deliver AI-created images",
        "To improve app performance and user experience",
        "To communicate with users if required",
        "To maintain app security and prevent misuse"
      ],
      dataSharing: [
        "We do not sell user data.",
        "We may share data only with:",
        "Internal team/admin for processing app services",
        "Service providers (hosting, cloud storage, analytics, AI processing services)",
        "Legal authorities if required by law"
      ],
      dataSecurity: "We take reasonable security measures to protect your data. All data transmission is encrypted using secure protocols (HTTPS).",
      dataRetention: "We retain user data only as long as necessary to provide services, improve the app, and fulfill user requests or legal obligations.",
      dataDeletion: {
        instruction: "Users can request deletion of their data at any time. To request deletion, email us at:",
        email: "contact@diintech.com",
        subject: "Delete my user details for YovoAI app"
      },
      childrenPrivacy: "YovoAI is not intended for children under the age of 13. We do not knowingly collect data from children.",
      thirdParty: "We may use third-party services such as Firebase, cloud storage providers, analytics tools, and AI service providers. These services may process data according to their own privacy policies.",
      disclaimer: "YovoAI provides AI-generated content based on user inputs. While we strive to offer high-quality results, we do not guarantee the accuracy, originality, or suitability of AI-generated outputs for every purpose.",
      changesToPolicy: "We may update this Privacy Policy from time to time. Users are advised to review this page periodically for any changes.",
      contactUs: {
        instruction: "If you have any questions, contact us at:",
        email: "contact@diintech.com"
      }
    }
  },
  {
    slug: "myaiads",
    name: "My AI Ads",
    websiteUrl: "https://myaiads.diintech.com/",
    lastUpdated: "06/04/2026",
    content: {
      introduction: "My AI Ads (\"we\", \"our\", or \"us\") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application, website, and related services.",
      informationCollect: {
        personal: ["Name (if provided)", "Email address", "Phone number (if provided)"],
        userContent: [
          "Text prompts submitted by users",
          "Marketing content inputs",
          "Product details, brand details, or business information entered by users",
          "Images, logos, or media uploaded by users",
          "AI-generated ad creatives, captions, copies, or visual outputs"
        ],
        deviceUsage: [
          "Device type and operating system",
          "App usage data",
          "Log information such as crashes, access times, and feature usage"
        ]
      },
      howWeUse: [
        "To provide AI-powered ad and creative generation services",
        "To process user prompts and uploaded media",
        "To generate marketing creatives, captions, ad copies, and related content",
        "To improve app performance and user experience",
        "To communicate with users if required",
        "To maintain security and prevent misuse of the platform"
      ],
      dataSharing: [
        "We do not sell user data.",
        "We may share data only with:",
        "Internal team/admin for processing and support",
        "Service providers (hosting, analytics, cloud storage, AI processing services)",
        "Legal authorities if required by law"
      ],
      dataSecurity: "We take reasonable security measures to protect your data. All data transmission is encrypted using secure protocols (HTTPS).",
      dataRetention: "We retain user data only as long as necessary to provide services, improve our platform, and fulfill legal or operational obligations.",
      dataDeletion: {
        instruction: "Users can request deletion of their data at any time. To request deletion, email us at:",
        email: "contact@diintech.com",
        subject: "Delete my user details for MY AI Ads app"
      },
      childrenPrivacy: "My AI Ads is not intended for children under the age of 13. We do not knowingly collect personal data from children.",
      thirdParty: "We may use third-party services such as Firebase, analytics tools, cloud storage providers, and AI service providers. These services may process data according to their own privacy policies.",
      disclaimer: "My AI Ads provides AI-generated marketing and advertising content based on user inputs. While we strive to provide useful and high-quality outputs, we do not guarantee the accuracy, originality, legal compliance, or suitability of AI-generated content for every advertising or commercial use case.",
      changesToPolicy: "We may update this Privacy Policy from time to time. Users are advised to review this page periodically.",
      contactUs: {
        instruction: "If you have any questions, contact us at:",
        email: "contact@diintech.com"
      }
    }
  },
  {
    slug: "tryoai",
    name: "TryoAI",
    websiteUrl: "#",
    lastUpdated: "06/04/2026",
    content: {
      introduction: "TryoAI (\"we\", \"our\", or \"us\") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application, website, and related services.",
      informationCollect: {
        personal: ["Name (if provided)", "Email address", "Phone number (if provided)"],
        userContent: [
          "User-uploaded photos",
          "Outfit, clothing, or style selections made by users",
          "Body appearance or pose-related image inputs (only for virtual try-on processing)",
          "AI-generated outfit preview images",
          "Any content submitted for styling or virtual try-on purposes"
        ],
        deviceUsage: [
          "Device type and operating system",
          "App usage data",
          "Log information such as crashes, access times, and feature usage"
        ]
      },
      howWeUse: [
        "To provide AI-powered virtual try-on and outfit preview services",
        "To process uploaded user photos and outfit selections",
        "To generate clothing try-on previews and styling results",
        "To improve app performance and user experience",
        "To communicate with users if required",
        "To maintain app security and prevent misuse of the platform"
      ],
      imageProcessing: "TryoAI uses artificial intelligence and image processing technology to create outfit previews based on user-uploaded images and selected clothing styles. Uploaded photos are used only for generating virtual try-on results, improving service functionality, and supporting app features.",
      dataSharing: [
        "We do not sell user data.",
        "We may share data only with:",
        "Internal team/admin for support and service operations",
        "Service providers (hosting, analytics, cloud storage, AI/image processing services)",
        "Legal authorities if required by law"
      ],
      dataSecurity: "We take reasonable security measures to protect your data. All data transmission is encrypted using secure protocols (HTTPS).",
      dataRetention: "We retain uploaded images and related user data only as long as necessary to provide services, improve the app, and fulfill legal or operational obligations.",
      dataDeletion: {
        instruction: "Users can request deletion of their data at any time. To request deletion, email us at:",
        email: "contact@diintech.com",
        subject: "Delete my user details for TryoAI app"
      },
      childrenPrivacy: "TryoAI is not intended for children under the age of 13. We do not knowingly collect personal data from children.",
      thirdParty: "We may use third-party services such as Firebase, cloud storage providers, analytics tools, and AI/image processing service providers. These services may process data according to their own privacy policies.",
      disclaimer: "TryoAI provides AI-generated outfit previews based on user-uploaded photos and selected clothing inputs. These results are intended for visualization purposes only and may not exactly reflect real-life fit, fabric behavior, body proportions, or final appearance.",
      changesToPolicy: "We may update this Privacy Policy from time to time. Users are advised to review this page periodically for any changes.",
      contactUs: {
        instruction: "If you have any questions, contact us at:",
        email: "contact@diintech.com"
      }
    }
  }
]
