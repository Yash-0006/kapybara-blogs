"use client"

import { PostCard } from "@/components/post-card"
import { trpc } from "@/lib/trpc-client"

export function FeaturedSection() {
  const { data: postsData } = trpc.posts.list.useQuery({
    limit: 3,
    offset: 0,
    status: "published",
  })

  const posts = postsData?.posts || []

  if (posts.length === 0) return null

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Featured Posts</h2>
          <p className="mt-4 text-lg text-muted-foreground">Discover our most popular and trending articles</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
  )
}
