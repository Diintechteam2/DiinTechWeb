"use client"

import Image from "next/image"
import Link from "next/link"
import { Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"
import type { FooterContent } from "@/lib/site-content-api"
import type { GlobalSettingsContent } from "@/lib/settings-api"

interface FooterProps {
  content: FooterContent
  settings: GlobalSettingsContent
  projectName?: string
  isProjectView?: boolean
}

function normalizeCopyright(text: string) {
  return text.replace("{{year}}", String(new Date().getFullYear())).replace("(c)", "©")
}

export function Footer({ content, settings, projectName, isProjectView }: FooterProps) {
  if (isProjectView) {
    return (
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 py-8 flex justify-center items-center">
          <p className="text-sm text-muted-foreground">powered by {projectName}</p>
        </div>
      </footer>
    )
  }

  const addressLines = settings.address.split("\n").filter(Boolean)
  const socialLinks = [
    { href: settings.socialLinks.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: settings.socialLinks.twitter, icon: Twitter, label: "Twitter" },
    { href: settings.socialLinks.instagram, icon: Instagram, label: "Instagram" },
  ].filter((item) => item.href && item.href !== "#")

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="relative w-35 h-15 rounded-lg flex items-center justify-center">
                <Image
                  src="/Diinlogo-N.png"
                  alt="Diin Technologies Logo"
                  width={400}
                  height={400}
                  className="object-cover"
                />
              </div>
              <span className="mt-4 text-xl font-bold text-foreground">{content.brandText}</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">{content.description}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <a href={`mailto:${settings.email}`} className="hover:text-foreground transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-foreground transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  {addressLines.map((line, index) => (
                    <span key={`${line}-${index}`}>
                      {line}
                      {index < addressLines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Solutions</h4>
            <ul className="space-y-3">
              {content.solutionLinks.map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {content.companyLinks.map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/asset/myaiads/videos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Asset
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {content.legalLinks.map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{normalizeCopyright(content.copyrightText)}</p>
          <div className="flex items-center gap-4">
            {socialLinks.map((item) => {
              const Icon = item.icon

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={item.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
