import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | Chiranjivi Poudel',
  description: 'Read articles and insights by Chiranjivi Poudel on engineering, technology, and professional development.',
  openGraph: {
    title: 'Blog | Chiranjivi Poudel',
    description: 'Articles and insights by Chiranjivi Poudel.',
  },
}

async function getBlogPosts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
  return data || []
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      <Navigation />
      <main className="pt-20">
        <section className="px-4 py-20 lg:py-28">
          <div className="mx-auto max-w-4xl">
            {/* Section Header */}
            <div className="mb-14 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
                Thoughts & Insights
              </p>
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
                Blog
              </h1>
              <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
                  >
                    <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row">
                      {post.featured_image && (
                        <div className="relative w-full sm:w-64 aspect-video sm:aspect-square flex-shrink-0 overflow-hidden">
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-5 flex-1">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          {post.published_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.published_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                          {post.reading_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.reading_time} min read
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>
                        )}
                        <span className="inline-flex items-center text-sm font-medium text-primary">
                          Read more
                          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
