import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { users, categories, posts, postCategories } from "@/lib/schema"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)
const db = drizzle(sql, { schema: { users, categories, posts, postCategories } })

export async function GET() {
  try {

    // Check if data already exists
    const existingPosts = await db.select().from(posts).limit(1)
    if (existingPosts.length > 0) {
      return Response.json({ message: "Database already seeded" }, { status: 200 })
    }

    // Create a default user
    const [user] = await db
      .insert(users)
      .values({
        name: "Admin User",
        email: "admin@blog.com",
      })
      .returning()

    // Create categories
    const categoryData = [
      { name: "Technology", slug: "technology" },
      { name: "Design", slug: "design" },
      { name: "Business", slug: "business" },
      { name: "Lifestyle", slug: "lifestyle" },
      { name: "Development", slug: "development" },
    ]

    const createdCategories = await db.insert(categories).values(categoryData).returning()

    // Create blog posts
    const postsData = [
      {
        title: "The Future of Web Development",
        slug: "future-of-web-development",
        content:
          "Web development is evolving rapidly with new frameworks and technologies emerging constantly. In this article, we explore the trends that will shape the future of web development, including AI integration, edge computing, and new JavaScript frameworks.",
        excerpt: "Explore the emerging trends that will define web development in the coming years.",
        featuredImage: "/web-development-future.png",
        authorId: user.id,
        status: "published" as const,
      },
      {
        title: "Mastering React Hooks",
        slug: "mastering-react-hooks",
        content:
          "React Hooks have revolutionized the way we write React components. Learn how to use useState, useEffect, useContext, and custom hooks to build powerful and efficient React applications.",
        excerpt: "A comprehensive guide to understanding and using React Hooks effectively.",
        featuredImage: "/react-hooks-programming.png",
        authorId: user.id,
        status: "published" as const,
      },
      {
        title: "UI Design Principles for Modern Interfaces",
        slug: "ui-design-principles",
        content:
          "Good UI design is about more than just aesthetics. It's about creating intuitive, accessible, and delightful user experiences. Discover the core principles that guide modern interface design.",
        excerpt: "Learn the fundamental principles of creating beautiful and functional user interfaces.",
        featuredImage: "/ui-design-principles-interface.jpg",
        authorId: user.id,
        status: "published" as const,
      },
      {
        title: "Scaling Your Business: A Strategic Guide",
        slug: "scaling-business-guide",
        content:
          "Scaling a business requires careful planning, the right team, and strategic decision-making. In this guide, we discuss the key strategies and considerations for growing your business sustainably.",
        excerpt: "Essential strategies for scaling your business while maintaining quality and culture.",
        featuredImage: "/business-scaling-growth-strategy.jpg",
        authorId: user.id,
        status: "published" as const,
      },
      {
        title: "Remote Work: Productivity Tips and Best Practices",
        slug: "remote-work-productivity",
        content:
          "Working remotely has become the new normal. Discover proven strategies and tools to maintain productivity, stay focused, and achieve work-life balance while working from home.",
        excerpt: "Maximize your productivity and well-being while working remotely.",
        featuredImage: "/remote-work-productivity-home-office.jpg",
        authorId: user.id,
        status: "published" as const,
      },
      {
        title: "TypeScript: Why You Should Use It",
        slug: "typescript-benefits",
        content:
          "TypeScript adds static typing to JavaScript, making your code more robust and maintainable. Learn why TypeScript is becoming the standard for large-scale JavaScript projects.",
        excerpt: "Discover the benefits of TypeScript and why it's worth adopting in your projects.",
        featuredImage: "/typescript-programming-language.jpg",
        authorId: user.id,
        status: "published" as const,
      },
      {
        title: "Minimalist Design: Less is More",
        slug: "minimalist-design",
        content:
          "Minimalism in design is about removing unnecessary elements and focusing on what truly matters. Explore how minimalist principles can create more impactful and user-friendly designs.",
        excerpt: "Embrace minimalism to create cleaner, more focused designs.",
        featuredImage: "/minimalist-design-aesthetic.jpg",
        authorId: user.id,
        status: "published" as const,
      },
    ]

    const createdPosts = await db.insert(posts).values(postsData).returning()

    // Assign categories to posts
    const postCategoryMappings = [
      { postId: createdPosts[0].id, categoryId: createdCategories[0].id },
      { postId: createdPosts[0].id, categoryId: createdCategories[4].id },
      { postId: createdPosts[1].id, categoryId: createdCategories[0].id },
      { postId: createdPosts[1].id, categoryId: createdCategories[4].id },
      { postId: createdPosts[2].id, categoryId: createdCategories[1].id },
      { postId: createdPosts[2].id, categoryId: createdCategories[0].id },
      { postId: createdPosts[3].id, categoryId: createdCategories[2].id },
      { postId: createdPosts[4].id, categoryId: createdCategories[3].id },
      { postId: createdPosts[4].id, categoryId: createdCategories[2].id },
      { postId: createdPosts[5].id, categoryId: createdCategories[0].id },
      { postId: createdPosts[5].id, categoryId: createdCategories[4].id },
      { postId: createdPosts[6].id, categoryId: createdCategories[1].id },
      { postId: createdPosts[6].id, categoryId: createdCategories[3].id },
    ]

    await db.insert(postCategories).values(postCategoryMappings)

    return Response.json(
      {
        message: "Database seeded successfully",
        data: {
          users: 1,
          categories: createdCategories.length,
          posts: createdPosts.length,
          postCategories: postCategoryMappings.length,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    // return generic error response; don't log server-side details to console
    return Response.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
