"use client"

import Link from "next/link"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { trpc } from "@/lib/trpc-client"

export function LatestSection() {
  const { data: postsData } = trpc.posts.list.useQuery({
    limit: 6,
    offset: 0,
    status: "published",
  })

  const posts = postsData?.posts || []

  if (posts.length === 0) return null

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Latest Articles</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stay updated with the newest content from our community
            </p>
          </div>
          <Link href="/blog">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
  )
}
