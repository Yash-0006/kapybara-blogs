"use client"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center px-6">
        <MobileNav />
        <div className="mr-8 hidden md:flex">
          <Link href="/" className="mr-8 flex items-center space-x-3">
            <span className="hidden font-bold text-lg sm:inline-block">
              Kapybara Blogs
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hidden md:inline-flex"
              )}
            >
              Blog
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hidden md:inline-flex"
              )}
            >
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
