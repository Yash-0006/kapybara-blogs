"use client"

import { PostCard } from "@/components/post-card"

interface BlogGridProps {
  posts: any[]
  columns?: number
}

export function BlogGrid({ posts, columns = 3 }: BlogGridProps) {
  const gridColsClass =
    {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
    }[columns] || "md:grid-cols-3"

  return (
    <div className={`grid gap-6 ${gridColsClass}`}>
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  )
}
