"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Award,
  Briefcase,
  FolderOpen,
  MessageSquare,
  BarChart3,
  Menu,
  X,
  Home,
  ExternalLink,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface AdminSidebarProps {
  user: User
}

const sidebarLinks = [
  {
    title: "Main",
    links: [
      { label: "Dashboard", href: "/protected", icon: LayoutDashboard },
      { label: "Analytics", href: "/protected/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Content",
    links: [
      { label: "Projects", href: "/protected/projects", icon: FolderOpen },
      { label: "Experience", href: "/protected/experience", icon: Briefcase },
      { label: "Certifications", href: "/protected/certifications", icon: Award },
      { label: "Blog Posts", href: "/protected/posts", icon: FileText },
    ],
  },
  {
    title: "Management",
    links: [
      { label: "Messages", href: "/protected/messages", icon: MessageSquare },
      { label: "Users", href: "/protected/users", icon: Users },
      { label: "Settings", href: "/protected/settings", icon: Settings },
    ],
  },
]

const quickLinks = [
  { label: "Homepage", href: "/", icon: Home },
  { label: "Kharcha", href: "https://kharcha.poonamkarki.com.np/auth/login", icon: ExternalLink, external: true },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              CP
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Chiranjivi Poudel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {sidebarLinks.map((section) => (
              <div key={section.title}>
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </p>
                <ul className="space-y-1">
                  {section.links.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}

            {/* Quick Links */}
            <div>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Links
              </p>
              <ul className="space-y-1">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                      {link.external && (
                        <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* User Info */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                {user.email?.[0].toUpperCase() || "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">Superadmin</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
