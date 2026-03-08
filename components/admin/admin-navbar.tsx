"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Moon,
  Sun,
  Home,
  Settings,
  LogOut,
  User,
  ExternalLink,
  Calendar,
} from "lucide-react"
import { formatNepaliDateFull } from "@/lib/nepali-date"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface AdminNavbarProps {
  user: SupabaseUser
}

export function AdminNavbar({ user }: AdminNavbarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    
    // Update date every minute
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const localDateStr = mounted ? currentDate.toLocaleDateString("en-NZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : ""

  const nepaliDateStr = mounted ? formatNepaliDateFull(currentDate) : ""

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-xl px-4 md:px-6 lg:px-8">
      {/* Left side - Dashboard title & Dates */}
      <div className="flex items-center gap-6 pl-12 lg:pl-0">
        <h1 className="text-lg font-semibold text-foreground hidden sm:block">Dashboard</h1>
        
        {mounted && (
          <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{localDateStr}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-primary font-medium">NP:</span>
              <span>{nepaliDateStr}</span>
            </div>
          </div>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Kharcha Link */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <a
            href="https://kharcha.poonamkarki.com.np/auth/login"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kharcha
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>

        {/* Homepage Link */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/">
            <Home className="h-4 w-4" />
            <span className="sr-only">Homepage</span>
          </Link>
        </Button>

        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
            >
              <span className="text-sm font-medium">
                {user.email?.[0].toUpperCase() || "U"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Superadmin</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/protected/profile" className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/protected/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action="/auth/signout" method="post" className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
