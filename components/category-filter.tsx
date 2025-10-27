"use client"

import { Badge } from "@/components/ui/badge"

interface CategoryFilterProps {
  categories: Array<{ id: number; name: string; slug: string }>
  selectedCategoryId?: number
  onCategoryChange: (categoryId?: number) => void
}

export function CategoryFilter({ categories, selectedCategoryId, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={selectedCategoryId === undefined ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => onCategoryChange(undefined)}
      >
        All
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category.id}
          variant={selectedCategoryId === category.id ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </Badge>
      ))}
    </div>
  )
}
