# Setup Guide for Multi-User Blogging Platform

## Step 1: Environment Setup

Make sure you have the following environment variables set in your Vercel project:

- `NEON_NEON_DATABASE_URL` - Your Neon PostgreSQL connection string

You can find this in your Neon dashboard or in the Vercel integration settings.

## Step 2: Initialize Database

The database needs to be initialized with tables and seeded with sample data.

### Option A: Using npm scripts (Recommended)

\`\`\`bash
# Install dependencies
npm install

# Setup database tables
npm run setup-db

# Seed with sample data
npm run seed-db
\`\`\`

### Option B: Manual Setup

If the scripts don't work, you can manually run the SQL:

1. Go to your Neon dashboard
2. Open the SQL editor
3. Copy the contents of `scripts/init-db.sql`
4. Execute the SQL

Then run the seed script:
\`\`\`bash
npm run seed-db
\`\`\`

## Step 3: Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000 to see your blog platform.

## Step 4: Explore the Platform

### Home Page
- View featured blog posts
- Browse all posts with pagination
- Filter posts by category

### Blog Post Page
- Read individual blog posts
- See post metadata (author, date, categories)
- Navigate back to home

### Dashboard
- Create new blog posts
- View all posts
- Delete posts
- Edit posts (coming soon)

## Sample Data

The seed script creates:
- 1 default user (admin@example.com)
- 4 categories (Design, Development, Business, Research)
- 6 sample blog posts with categories assigned

## Troubleshooting

### Database Connection Error
- Verify `NEON_DATABASE_URL` is set correctly
- Check that your Neon database is active
- Ensure the connection string includes the database name

### Tables Already Exist
- The setup script will fail if tables already exist
- You can safely ignore this error or drop the tables and re-run

### No Posts Showing
- Make sure you ran the seed script
- Check that posts have `status = 'published'`
- Verify categories are assigned to posts

## Next Steps

1. Customize the design in `app/globals.css`
2. Add more categories in the dashboard
3. Create your own blog posts
4. Deploy to Vercel

## Support

For issues or questions, check the README.md file for more information.
