import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Diin Technologies",
  description:
    "Diin Technologies builds autonomous AI agents that run businesses. Transform your operations, sales, and customer experience with next-generation Agentic AI systems.",
  generator: "Diin Technologies Pvt. Ltd.",
  keywords: ["Agentic AI", "AI Agents", "Enterprise AI", "Autonomous AI", "Multi-Agent Systems", "AI Automation"],
  authors: [{ name: "Diin Technologies Pvt. Ltd." }],
  icons: {
    icon: [
      {
        url: "/Diinimagelogo-N.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/Diinimagelogo-N.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/Diinimagelogo-N.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/Diinimagelogo-N.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0f0f14",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
