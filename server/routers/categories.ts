import { router, publicProcedure } from "@/lib/trpc"
import { db } from "@/lib/db"
import { categories } from "@/lib/schema"
import { z } from "zod"
import { eq, desc } from "drizzle-orm"

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
})

const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.number(),
})

export const categoriesRouter = router({
  create: publicProcedure.input(createCategorySchema).mutation(async ({ input }) => {
    const [category] = await db.insert(categories).values(input).returning()
    return category
  }),

  update: publicProcedure.input(updateCategorySchema).mutation(async ({ input }) => {
    const { id, ...updateData } = input
    const [category] = await db.update(categories).set(updateData).where(eq(categories.id, id)).returning()
    return category
  }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await db.delete(categories).where(eq(categories.id, input.id))
    return { success: true }
  }),

  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const [category] = await db.select().from(categories).where(eq(categories.id, input.id))
    return category || null
  }),

  list: publicProcedure.query(async () => {
    return await db.select().from(categories).orderBy(desc(categories.createdAt))
  }),
})
