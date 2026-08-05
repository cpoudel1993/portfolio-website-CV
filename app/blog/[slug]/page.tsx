import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { NavigationServer } from '@/components/navigation-server'
import { Footer } from '@/components/footer'
import { getCachedBlogPost } from '@/lib/public-data'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'

const getPost = getCachedBlogPost

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Post Not Found | Chiranjivi Poudel' }
  }

  return {
    title: `${post.title} | Chiranjivi Poudel`,
    description: post.excerpt || 'Article by Chiranjivi Poudel.',
    openGraph: {
      title: post.title,
      description: post.excerpt || 'Article by Chiranjivi Poudel.',
      images: post.featured_image || post.cover_image ? [post.featured_image || post.cover_image] : undefined,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const image = post.featured_image || post.cover_image

  return (
    <>
      <NavigationServer />
      <main className="pt-20">
        <article className="px-4 py-12 lg:py-20">
          <div className="mx-auto max-w-3xl">
            {/* Back link */}
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-md border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
              {post.reading_time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.reading_time} min read
                </span>
              )}
            </div>

            {/* Featured image */}
            {image && (
              <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  quality={85}
                  priority
                />
              </div>
            )}

            {/* Content */}
            {post.content ? (
              <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary whitespace-pre-wrap leading-relaxed text-foreground">
                {post.content}
              </div>
            ) : post.excerpt ? (
              <p className="text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
            ) : (
              <p className="text-muted-foreground">This post has no content yet.</p>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
