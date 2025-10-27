"use client"
import { Button } from "@/components/ui/button"

interface BlogFilterSidebarProps {
  categories: Array<{ id: number; name: string; slug: string }>
  selectedCategoryId?: number
  onCategoryChange: (categoryId?: number) => void
}

export function BlogFilterSidebar({ categories, selectedCategoryId, onCategoryChange }: BlogFilterSidebarProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Filter by Category</h3>
      <div className="space-y-2">
        <Button
          variant={selectedCategoryId === undefined ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onCategoryChange(undefined)}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
