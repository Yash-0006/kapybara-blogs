"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Header } from "@/components/header"
import { marked } from 'marked'
import { 
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Label,
  Checkbox,
  Badge,
  ConfirmDialog
} from "@/components/ui"
import { trpc } from "@/lib/trpc-client"
import { Plus, Trash2, Edit2, X } from "lucide-react"
import { toast } from "sonner"

interface Category {
  id: number
  name: string
}

interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  categories?: Category[]
  authorId: number
  status: "draft" | "published"
}

interface FormData {
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  categoryIds: number[]
}

interface PostsResponse {
  posts: Post[]
  total: number
}

const emptyForm: FormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  featuredImage: "",
  categoryIds: [],
}

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [showPreview, setShowPreview] = useState(false)

  const contentPreview = useCallback(() => {
    return { __html: marked(formData.content) }
  }, [formData.content])

  const utils = trpc.useUtils()

  const { data: postsData } = trpc.posts.list.useQuery({
    limit: 100,
    offset: 0,
  }) as { data: PostsResponse | undefined }

  const { data: categories = [] } = trpc.categories.list.useQuery()

  const createPostMutation = trpc.posts.create.useMutation({
    onSuccess: () => {
      setFormData(emptyForm)
      setIsEditing(false)
      utils.posts.list.invalidate()
      toast.success("Post created successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const updatePostMutation = trpc.posts.update.useMutation({
    onSuccess: () => {
      setFormData(emptyForm)
      setIsEditing(false)
      setEditingId(null)
      utils.posts.list.invalidate()
      toast.success("Post updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const deletePostMutation = trpc.posts.delete.useMutation({
    onSuccess: () => {
      utils.posts.list.invalidate()
      toast.success("Post deleted successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      authorId: 1,
      status: "published" as const,
    }

    try {
      if (editingId) {
        await updatePostMutation.mutateAsync({ id: editingId, ...payload })
      } else {
        await createPostMutation.mutateAsync(payload)
      }
    } catch (error) {
      console.error("Failed to save post:", error)
    }
  }

  const handleSaveDraft = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    // For drafts, only title is required
    if (!formData.title.trim()) {
      toast.error("Title is required even for drafts")
      return
    }

    // Generate a slug from title if not provided
    const payload = {
      ...formData,
      authorId: 1,
      status: "draft" as const,
      // If no slug provided, create one from title
      slug: formData.slug.trim() || formData.title.toLowerCase().replace(/\s+/g, '-'),
    }

    try {
      if (editingId) {
        await updatePostMutation.mutateAsync({ id: editingId, ...payload })
      } else {
        await createPostMutation.mutateAsync(payload)
      }
    } catch (error) {
      console.error("Failed to save draft:", error)
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  const handleEdit = (post: Post) => {
    setEditingId(post.id)
    setIsEditing(true)
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      featuredImage: post.featuredImage || "",
      categoryIds: post.categories?.map((c: Category) => c.id) || [],
    })
  }

  // Delete flow: open a confirmation dialog instead of using window.confirm
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const handleDelete = (postId: number) => {
    setDeleteTarget(postId)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deletePostMutation.mutateAsync({ id: deleteTarget })
    } catch (error) {
      console.error("Failed to delete post:", error)
    } finally {
      setConfirmOpen(false)
      setDeleteTarget(null)
    }
  }

  const handleCancel = () => {
    setFormData(emptyForm)
    setIsEditing(false)
    setEditingId(null)
  }

  const toggleCategory = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }))
  }

  // Early return if data is not loaded
  if (!postsData) return null

  const posts = postsData.posts

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          )}
        </div>

        {isEditing && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{editingId ? "Edit Post" : "Create New Post"}</CardTitle>
                  <CardDescription>
                    {editingId ? "Update an existing blog post" : "Add a new blog post to your platform"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Post title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="post-url-slug"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="content">Content (Markdown)</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your blog post content in Markdown..."
                      className="min-h-[400px] font-mono"
                      required
                    />
                  </div>
                  {showPreview && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div 
                        className="prose dark:prose-invert min-h-[400px] p-4 rounded-md border bg-card overflow-auto"
                        dangerouslySetInnerHTML={contentPreview()}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief summary of your post..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {categories.map((category: Category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={formData.categoryIds.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSaveDraft}
                    disabled={createPostMutation.isPending || updatePostMutation.isPending}
                  >
                    Save as draft
                  </Button>
                  <Button
                    type="submit"
                    disabled={createPostMutation.isPending || updatePostMutation.isPending}
                  >
                    {editingId ? "Update Post" : "Create Post"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <Card key={post.id} className="relative">
              {post.status === 'draft' && (
                <Badge
                  className="absolute right-3 bottom-3 text-xs bg-white text-black border border-border px-2 py-1 rounded"
                  variant="outline"
                >
                  Draft
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.categories?.map((category: Category) => (
                    <Badge key={category.id} variant="secondary" className="text-xs">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* In-app confirm dialog for deletions */}
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete post"
          description="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={confirmDelete}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          loading={deletePostMutation.isPending}
        />
      </main>
    </div>
  )
}