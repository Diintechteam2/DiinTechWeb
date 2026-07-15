"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import type { HeaderContent, SiteLinkItem } from "@/lib/site-content-api"
import { cn } from "@/lib/utils"

interface HeaderProps {
  content: HeaderContent
  projectName?: string
  projectLogo?: string
  projectWebsiteUrl?: string
  isProjectView?: boolean
}

function getNavLink(navLinks: SiteLinkItem[], index: number, fallbackLabel: string, fallbackHref: string) {
  return navLinks[index] || { label: fallbackLabel, href: fallbackHref }
}

export function Header({ content, projectName, projectLogo, projectWebsiteUrl, isProjectView }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const aboutLink = getNavLink(content.navLinks, 0, "About", "/#about")
  const technologyLink = getNavLink(content.navLinks, 1, "Technology", "/#technology")
  const whyDiinLink = getNavLink(content.navLinks, 2, "Why Diin", "/#why-diin")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href={isProjectView ? (projectWebsiteUrl || "#") : "/"} className="flex items-center">
            {isProjectView ? (
              <div className="flex items-center gap-3">
                {projectName?.toLowerCase() === 'myaiads' ? (
                  <>
                    {projectLogo && (
                      <img
                        src={projectLogo}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-white/10"
                      />
                    )}
                    <span className="text-xl font-bold text-white tracking-tight">
                      UGC <span className="text-primary">Videos</span>
                    </span>
                  </>
                ) : (
                  <>
                    {projectLogo && (
                      <img
                        src={projectLogo}
                        alt={`${projectName} Logo`}
                        className="w-10 h-10 rounded-xl object-cover border border-white/10"
                      />
                    )}
                    <span className="text-xl font-bold text-white tracking-tight">
                      {projectName}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div className="relative w-30 h-10 rounded-lg flex items-center justify-center">
                <Image
                  src="/Diinlogo-N.png"
                  alt="Diin Technologies Logo"
                  width={200}
                  height={200}
                  className="object-fill"
                  priority
                />
              </div>
            )}
          </Link>

          {!isProjectView && (
            mounted ? (
              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList className="gap-1">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href={aboutLink.href}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {aboutLink.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent">
                      Solutions
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-card border border-border rounded-lg">
                        {content.solutionMenu.map((item, index) => (
                          <li key={`${item.label}-${index}`}>
                            <NavigationMenuLink asChild>
                              <a
                                href={item.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none text-foreground">{item.label}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent">
                      Industries
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[250px] gap-2 p-4 bg-card border border-border rounded-lg">
                        {content.industryMenu.map((item, index) => (
                          <li key={`${item.label}-${index}`}>
                            <NavigationMenuLink asChild>
                              <a
                                href={item.href}
                                className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm font-medium text-foreground"
                              >
                                {item.label}
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href={technologyLink.href}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {technologyLink.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href={whyDiinLink.href}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {whyDiinLink.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <nav className="hidden lg:flex items-center gap-1">
                <Link
                  href={aboutLink.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {aboutLink.label}
                </Link>
                <a href="/#solutions" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Solutions
                </a>
                <a href="/#industries" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Industries
                </a>
                <Link
                  href={technologyLink.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {technologyLink.label}
                </Link>
                <Link
                  href={whyDiinLink.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {whyDiinLink.label}
                </Link>
              </nav>
            )
          )}

          {!isProjectView && (
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                {content.contactButtonText}
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
                {content.ctaButtonText}
              </Button>
            </div>
          )}

          {!isProjectView && (
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {!isProjectView && mobileMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <nav className="container mx-auto px-4 py-6 space-y-4">
            <a href={aboutLink.href} className="block py-2 text-foreground font-medium">
              {aboutLink.label}
            </a>
            <a href="/#solutions" className="block py-2 text-foreground font-medium">
              Solutions
            </a>
            <a href="/#industries" className="block py-2 text-foreground font-medium">
              Industries
            </a>
            <a href={technologyLink.href} className="block py-2 text-foreground font-medium">
              {technologyLink.label}
            </a>
            <a href={whyDiinLink.href} className="block py-2 text-foreground font-medium">
              {whyDiinLink.label}
            </a>
            <div className="pt-4 space-y-3">
              <Button variant="outline" className="w-full bg-transparent">
                {content.contactButtonText}
              </Button>
              <Button className="w-full bg-primary text-primary-foreground">{content.ctaButtonText}</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
