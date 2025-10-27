"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { trpc } from "@/lib/trpc-client"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string

  const { data: post, isLoading } = trpc.posts.getBySlug.useQuery({ slug })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-muted-foreground">Loading post...</p>
        </main>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-muted-foreground">Post not found.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/">
          <Button variant="ghost" className="mb-8 gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to posts
          </Button>
        </Link>

        <article>
          {post.featuredImage && (
            <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
              <Image src={post.featuredImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
          )}

          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold text-foreground">{post.title}</h1>
            <div className="flex flex-col gap-4 text-muted-foreground">
              <div className="flex items-center gap-4">
                {post.author && <span>{post.author.name}</span>}
                {post.publishedAt && <span>{formatDate(new Date(post.publishedAt))}</span>}
              </div>
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.categories
                    .filter((c): c is NonNullable<typeof post.categories[number]> => c !== null)
                    .map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </header>

          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">{post.content}</p>
          </div>
        </article>
      </main>
    </div>
  )
}
