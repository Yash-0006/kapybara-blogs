"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, Button } from "@/components/ui"
import { cn } from "@/lib/utils"

interface MobileFiltersProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export function MobileFilters({ categories, selectedCategory, onCategoryChange }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle>Filter Posts</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                onCategoryChange(null)
                setIsOpen(false)
              }}
              className={cn(
                "px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                !selectedCategory ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onCategoryChange(category)
                  setIsOpen(false)
                }}
                className={cn(
                  "px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                  selectedCategory === category ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}