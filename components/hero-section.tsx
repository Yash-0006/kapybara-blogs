import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-screen flex justify-cente items-center overflow-hidden bg-linear-to-br from-background via-background to-muted py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Share Your <span className="text-primary">Thoughts</span> with the World
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            Welcome to our modern blogging platform. Create, share, and discover amazing stories from writers around the
            world. Start your journey today.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/blog">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Blogs
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Start Writing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
