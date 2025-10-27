import { router, publicProcedure } from "@/lib/trpc"
import { db } from "@/lib/db"
import { posts, postCategories, categories, users } from "@/lib/schema"
import { z } from "zod"
import { eq, desc, inArray } from "drizzle-orm"

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  authorId: z.number(),
  status: z.enum(["draft", "published"]).default("draft"),
  categoryIds: z.array(z.number()).optional(),
})

const updatePostSchema = createPostSchema.partial().extend({
  id: z.number(),
})

export const postsRouter = router({
  create: publicProcedure.input(createPostSchema).mutation(async ({ input }) => {
    const [post] = await db.insert(posts).values(input).returning()

    if (input.categoryIds && input.categoryIds.length > 0) {
      await db.insert(postCategories).values(
        input.categoryIds.map((categoryId) => ({
          postId: post.id,
          categoryId,
        })),
      )
    }

    return post
  }),

  update: publicProcedure.input(updatePostSchema).mutation(async ({ input }) => {
    const { id, categoryIds, ...updateData } = input

    const [post] = await db.update(posts).set(updateData).where(eq(posts.id, id)).returning()

    if (categoryIds !== undefined) {
      await db.delete(postCategories).where(eq(postCategories.postId, id))
      if (categoryIds.length > 0) {
        await db.insert(postCategories).values(
          categoryIds.map((categoryId) => ({
            postId: id,
            categoryId,
          })),
        )
      }
    }

    return post
  }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await db.delete(posts).where(eq(posts.id, input.id))
    return { success: true }
  }),

  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, input.id))
      .leftJoin(users, eq(posts.authorId, users.id))

    if (!post) return null

    const postCats = await db
      .select()
      .from(postCategories)
      .leftJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(eq(postCategories.postId, input.id))

    return {
      ...post.posts,
      author: post.users,
      categories: postCats.map((pc) => pc.categories).filter(Boolean),
    }
  }),

  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, input.slug))
      .leftJoin(users, eq(posts.authorId, users.id))

    if (!post) return null

    const postCats = await db
      .select()
      .from(postCategories)
      .leftJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(eq(postCategories.postId, post.posts.id))

    return {
      ...post.posts,
      author: post.users,
      categories: postCats.map((pc) => pc.categories).filter(Boolean),
    }
  }),

  list: publicProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
        status: z.enum(["draft", "published"]).optional(),
        categoryId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      let query = db.select().from(posts).leftJoin(users, eq(posts.authorId, users.id))

      if (input.status) {
        query = query.where(eq(posts.status, input.status))
      }

      if (input.categoryId) {
        const postIds = await db
          .select({ postId: postCategories.postId })
          .from(postCategories)
          .where(eq(postCategories.categoryId, input.categoryId))

        const ids = postIds.map((p) => p.postId)
        if (ids.length === 0) return { posts: [], total: 0 }

        query = query.where(inArray(posts.id, ids))
      }

      const total = await db.select().from(posts)
      const result = await query.orderBy(desc(posts.createdAt)).limit(input.limit).offset(input.offset)

      const postsWithCategories = await Promise.all(
        result.map(async (row) => {
          const postCats = await db
            .select()
            .from(postCategories)
            .leftJoin(categories, eq(postCategories.categoryId, categories.id))
            .where(eq(postCategories.postId, row.posts.id))

          return {
            ...row.posts,
            author: row.users,
            categories: postCats.map((pc) => pc.categories).filter(Boolean),
          }
        }),
      )

      return {
        posts: postsWithCategories,
        total: total.length,
      }
    }),
})
