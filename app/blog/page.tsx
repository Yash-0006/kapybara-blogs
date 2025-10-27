"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { PostCard } from "@/components/post-card"
import { Pagination } from "@/components/pagination"
import { BlogFilterSidebar } from "@/components/blog-filter-sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { trpc } from "@/lib/trpc-client"

const POSTS_PER_PAGE = 9

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>()

  const handleCategoryChange = (categoryId?: number) => {
    setSelectedCategoryId(categoryId)
    setCurrentPage(1)
  }

  const { data: postsData, isLoading: postsLoading } = trpc.posts.list.useQuery({
    limit: POSTS_PER_PAGE,
    offset: (currentPage - 1) * POSTS_PER_PAGE,
    status: "published",
    categoryId: selectedCategoryId,
  })

  const { data: categories = [] } = trpc.categories.list.useQuery()

  const posts = postsData?.posts || []
  const total = postsData?.total || 0
  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  return (
    <>  
    <Header />
    <div className="min-h-screen bg-background md:mx-30">
      

      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground pl-4">All Posts</h1>
          <div className="block lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  Filter Posts
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>Categories</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => handleCategoryChange(undefined)}
                    className="w-full text-left px-4 py-2 rounded-lg transition-colors bg-primary/10 hover:bg-muted"
                  >
                    All Posts
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={
                        selectedCategoryId === category.id
                          ? "w-full text-left px-4 py-2 rounded-lg transition-colors bg-primary/10"
                          : "w-full text-left px-4 py-2 rounded-lg transition-colors hover:bg-muted"
                      }
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="hidden lg:block">
            <BlogFilterSidebar
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {postsLoading
                ? Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[300px] rounded-lg bg-muted animate-pulse"
                    />
                  ))
                : posts.map((post) => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      slug={post.slug}
                      excerpt={post.excerpt || undefined}
                      featuredImage={post.featuredImage || undefined}
                      publishedAt={post.publishedAt ? new Date(post.publishedAt) : undefined}
                      categories={post.categories?.filter((c): c is NonNullable<typeof c> => 
                        c !== null
                      ).map(c => ({
                        id: c.id,
                        name: c.name,
                        slug: c.slug
                      })) || []}
                    />
                  ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
    </>
  )
}