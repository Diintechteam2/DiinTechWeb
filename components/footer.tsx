"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone, Linkedin, Twitter } from "lucide-react"
import { PROJECTS } from "@/lib/projects-data"

const footerLinks = {
  solutions: [
    { label: "AI Sales Agents", href: "#solutions" },
    { label: "AI Support Agents", href: "#solutions" },
    { label: "AI Operations Agents", href: "#solutions" },
    { label: "Custom Enterprise AI", href: "#solutions" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Technology", href: "#technology" },
    { label: "Industries", href: "#industries" },
    { label: "Why Diin", href: "#why-diin" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="relative w-35 h-15 rounded-lg flex items-center justify-center">
                <Image
                  src="/Diinlogo-N.png"
                  alt="Diin Technologies Logo"
                  width={400}
                  height={400}
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to text logo if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = '<span class="text-primary-foreground font-bold text-xl">D</span>'
                    }
                  }}
                />
              </div>
              <span className="mt-4 text-xl font-bold text-foreground">Technologies Pvt. Ltd.</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Disruptive Innovation Through Autonomous Intelligence. Building AI agents that run businesses — not just
              assist them.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:contact@diintech.com" className="hover:text-foreground transition-colors">
                  contact@diintech.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+918147540362" className="hover:text-foreground transition-colors">
                  +91 81475 40362               </a>
              </div>
              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  C-116, Sector-2, Noida,
                  <br />
                  Uttar Pradesh – 201301, India
                </span>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Diin Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
