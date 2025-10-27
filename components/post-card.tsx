import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface PostCardProps {
  id: number
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  publishedAt?: Date
  categories?: Array<{ id: number; name: string; slug: string }>
  status?: 'draft' | 'published'
}

export function PostCard({ id, title, slug, excerpt, featuredImage, publishedAt, categories, status }: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <article className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg">
        {featuredImage && (
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            <Image
              src={featuredImage || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {publishedAt && <p className="mt-2 text-sm text-muted-foreground">{formatDate(new Date(publishedAt))}</p>}
          {excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {status === 'draft' && (
              <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500">
                Draft
              </Badge>
            )}
            {categories && categories.length > 0 && 
              categories.map((category) => (
                <Badge key={category.id} variant="secondary" className="text-xs">
                  {category.name}
                </Badge>
              ))
            }
          </div>
        </div>
      </article>
    </Link>
  )
}
