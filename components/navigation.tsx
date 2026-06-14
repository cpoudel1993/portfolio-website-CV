"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, X, Moon, Sun, Download, LogIn, Globe, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NavLink = { label: string; href: string; anchor?: string; external?: boolean }

const defaultNavLinks: NavLink[] = [
  { label: "Home", href: "/", anchor: "#home" },
  { label: "About", href: "/about", anchor: "#about" },
  { label: "Experience", href: "/experience", anchor: "#experience" },
  { label: "Skills", href: "/skills", anchor: "#skills" },
  { label: "Projects", href: "/projects" },
  { label: "Certifications", href: "/certifications", anchor: "#certifications" },
  { label: "Gallery", href: "/gallery", anchor: "#gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact", anchor: "#contact" },
  { label: "Kharcha", href: "https://kharcha.poonamkarki.com.np/auth/login", external: true },
]

const languages = [
  { code: "en", label: "English" },
  { code: "ne", label: "Nepali" },
  { code: "hi", label: "Hindi" },
  { code: "jp", label: "Japanese" },
]

export function Navigation({ menuItems }: { menuItems?: NavLink[] } = {}) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const navLinks: NavLink[] = menuItems && menuItems.length > 0 ? menuItems : defaultNavLinks
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [selectedLang, setSelectedLang] = useState("en")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Only track anchor sections on homepage
      if (isHomePage) {
        const anchors = navLinks.filter((link) => link.anchor).map((link) => link.anchor!.replace("#", ""))
        for (let i = anchors.length - 1; i >= 0; i--) {
          const el = document.getElementById(anchors[i])
          if (el) {
            const rect = el.getBoundingClientRect()
            if (rect.top <= 100) {
              setActiveSection(anchors[i])
              break
            }
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHomePage])

  const handleAnchorClick = (anchor: string) => {
    setIsOpen(false)
    const el = document.querySelector(anchor)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  const getActiveState = (link: typeof navLinks[0]) => {
    if (isHomePage && link.anchor) {
      return activeSection === link.anchor.replace("#", "")
    }
    return pathname === link.href
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8" style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontWeight: 300 }}>
        {/* Logo */}
        <Link
          href="/"
          onClick={() => {
            if (isHomePage) {
              handleAnchorClick("#home")
            }
          }}
          className="text-lg font-bold tracking-tight text-foreground"
          style={{ fontFamily: '"Playfair Display", sans-serif' }}
        >
          CP<span className="text-primary">.</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : isHomePage && link.anchor ? (
                <a
                  href={link.anchor}
                  onClick={(e) => {
                    e.preventDefault()
                    handleAnchorClick(link.anchor!)
                  }}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    getActiveState(link)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    getActiveState(link)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Action Buttons */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Select language">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={selectedLang === lang.code ? "bg-primary/10 text-primary" : ""}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          {/* Download CV */}
          <Button variant="ghost" size="sm" className="gap-1.5" asChild>
            <a
              href="https://drive.google.com/drive/folders/11gfMOdsckoZaRyZvVU75R3ZdVn9-BOWG?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="h-4 w-4" />
              <span className="hidden xl:inline">Download CV</span>
            </a>
          </Button>

          {/* Join v0 */}
          <Button variant="ghost" size="sm" className="gap-1.5" asChild>
            <a href="https://v0.app/ref/TP1KBM" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Join v0.dev</span>
            </a>
          </Button>

          {/* Login */}
          <Button size="sm" className="gap-1.5" asChild>
            <Link href="/auth/login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          isOpen ? "max-h-[500px] border-b border-border" : "max-h-0"
        }`}
      >
        <div className="space-y-1 bg-background/95 backdrop-blur-xl px-4 pb-4">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              >
                {link.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : isHomePage && link.anchor ? (
              <a
                key={link.href}
                href={link.anchor}
                onClick={(e) => {
                  e.preventDefault()
                  handleAnchorClick(link.anchor!)
                }}
                className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  getActiveState(link)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  getActiveState(link)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            )
          )}

          <div className="my-3 border-t border-border" />

          <div className="flex flex-wrap items-center gap-2">
            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Globe className="h-4 w-4" />
                  {languages.find((l) => l.code === selectedLang)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    className={selectedLang === lang.code ? "bg-primary/10 text-primary" : ""}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <a href="https://drive.google.com/drive/folders/11gfMOdsckoZaRyZvVU75R3ZdVn9-BOWG?usp=sharing" download>
                <Download className="h-4 w-4" />
                Download
              </a>
            </Button>

            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <a href="https://v0.app/ref/TP1KBM" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Join v0.dev
              </a>
            </Button>

            <Button size="sm" className="gap-1.5" asChild>
              <Link href="/auth/login">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
