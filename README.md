# Multi-User Blogging Platform

A modern, full-stack blogging platform built with Next.js 15, PostgreSQL, Drizzle ORM, and tRPC.

## Features

- **Blog Post Management**: Create, read, update, and delete blog posts
- **Category System**: Organize posts with categories
- **Multi-User Support**: Support for multiple authors
- **Responsive Design**: Mobile-first design that works on all devices
- **Type-Safe APIs**: Built with tRPC for end-to-end type safety
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, tRPC
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **Styling**: Tailwind CSS, shadcn/ui
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Neon PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables in your Vercel project:
   - `NEON_NEON_DATABASE_URL` - Your Neon database connection string

4. Initialize the database:
   \`\`\`bash
   npm run setup-db
   \`\`\`

5. Seed the database with sample data:
   \`\`\`bash
   npm run seed-db
   \`\`\`

6. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```plaintext
├── app/
│   ├── api/
│   │   └── trpc/              # tRPC API routes
│   ├── blog/
│   │   └── [slug]/            # Individual blog post pages
│   ├── dashboard/             # Admin dashboard
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
│
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── header.tsx             # Navigation header
│   ├── post-card.tsx          # Blog post card component
│   ├── pagination.tsx         # Pagination component
│   └── category-filter.tsx    # Category filter component
│
├── lib/
│   ├── db.ts                  # Database client
│   ├── schema.ts              # Drizzle schema
│   ├── trpc.ts                # tRPC configuration
│   ├── trpc-client.ts         # tRPC client
│   └── utils.ts               # Utility functions
│
└── server/
   └── routers/
       ├── posts.ts           # Posts API procedures
       ├── categories.ts      # Categories API procedures
       └── index.ts           # Main router

```


## API Routes

### Posts
- `posts.create` - Create a new post
- `posts.update` - Update an existing post
- `posts.delete` - Delete a post
- `posts.getById` - Get a post by ID
- `posts.getBySlug` - Get a post by slug
- `posts.list` - List all posts with filtering

### Categories
- `categories.create` - Create a new category
- `categories.update` - Update a category
- `categories.delete` - Delete a category
- `categories.getById` - Get a category by ID
- `categories.list` - List all categories

## Pages

- `/` - Home page with featured and all posts
- `/blog` - Blog listing page with filtering
- `/blog/[slug]` - Individual blog post page
- `/dashboard` - Admin dashboard for managing posts

## Database Schema

### Users
- id (Primary Key)
- name
- email
- created_at
- updated_at

### Categories
- id (Primary Key)
- name
- slug
- description
- created_at
- updated_at

### Posts
- id (Primary Key)
- title
- slug
- content
- excerpt
- featured_image
- author_id (Foreign Key)
- status (draft/published)
- published_at
- created_at
- updated_at

### Post Categories (Junction Table)
- id (Primary Key)
- post_id (Foreign Key)
- category_id (Foreign Key)
- created_at

## Development

### Running Scripts

\`\`\`bash
# Setup database
npm run setup-db

# Seed database
npm run seed-db

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Deployment

This project is ready to deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

