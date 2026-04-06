"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const solutions = [
  {
    title: "AI Sales Agents",
    description: "Autonomous lead qualification and revenue optimization",
    href: "/#solutions",
  },
  { title: "AI Support Agents", description: "24×7 intelligent customer support", href: "/#solutions" },
  { title: "AI Operations Agents", description: "Workflow orchestration and automation", href: "/#solutions" },
  { title: "AI Knowledge & RAG", description: "Enterprise knowledge systems", href: "/#solutions" },
]

const industries = [
  { title: "Education & EdTech", href: "/#industries" },
  { title: "BFSI & FinTech", href: "/#industries" },
  { title: "Healthcare", href: "/#industries" },
  { title: "BPO & Call Centers", href: "/#industries" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-30 h-10 rounded-lg flex items-center justify-center">
              <Image
                src="/Diinlogo-N.png"
                alt="Diin Technologies Logo"
                width={200}
                height={200}
                className="object-fill"
                priority
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
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/#about" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent">
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-card border border-border rounded-lg">
                    {solutions.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <a
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none text-foreground">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
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
                    {industries.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <a
                            href={item.href}
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm font-medium text-foreground"
                          >
                            {item.title}
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/#technology" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Technology
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/#why-diin" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Why Diin
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Contact
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
              Book a Strategy Call
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <nav className="container mx-auto px-4 py-6 space-y-4">
            <a href="/#about" className="block py-2 text-foreground font-medium">
              About
            </a>
            <a href="/#solutions" className="block py-2 text-foreground font-medium">
              Solutions
            </a>
            <a href="/#industries" className="block py-2 text-foreground font-medium">
              Industries
            </a>
            <a href="/#technology" className="block py-2 text-foreground font-medium">
              Technology
            </a>
            <a href="/#why-diin" className="block py-2 text-foreground font-medium">
              Why Diin
            </a>
            <div className="pt-4 space-y-3">
              <Button variant="outline" className="w-full bg-transparent">
                Contact
              </Button>
              <Button className="w-full bg-primary text-primary-foreground">Book a Strategy Call</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
