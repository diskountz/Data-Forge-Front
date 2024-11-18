import { createClient } from '@supabase/supabase-js'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MainLayout from '../../components/MainLayout'
import TableOfContents from '../../components/PostEditor/TableOfContents'
import SocialShare from '../../components/SocialShare'
import Image from 'next/image'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const cleanUrl = (url) => {
  if (!url) return ''
  return url.replace(/([^:]\/)\/+/g, '$1')
}

export async function getStaticPaths() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug')
      .eq('status', 'published')

    if (error) throw error

    return {
      paths: posts?.map(({ slug }) => ({
        params: { slug }
      })) || [],
      fallback: true  // Changed to true for better UX during build
    }
  } catch (error) {
    console.error('Error in getStaticPaths:', error)
    return { paths: [], fallback: false }
  }
}

export async function getStaticProps({ params }) {
  try {
    // Fetch post with author and categories
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id(*),
        posts_categories!inner(
          category_id,
          categories(*)
        )
      `)
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single()

    if (error || !post) {
      return { notFound: true }
    }

    // Fetch related posts
    const categoryIds = post.posts_categories.map(pc => pc.category_id)
    const { data: relatedPosts } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        published_at,
        created_at,
        excerpt,
        featured_image,
        posts_categories!inner(
          category_id,
          categories(*)
        )
      `)
      .eq('status', 'published')
      .neq('id', post.id)
      .in('posts_categories.category_id', categoryIds)
      .limit(3)

    // Format post data
    const formattedPost = {
      ...post,
      author_name: post.profiles?.full_name || 'Anonymous',
      author_avatar: post.profiles?.avatar_url || '/default-avatar.png',
      formatted_date: post.published_at || post.created_at 
        ? format(parseISO(post.published_at || post.created_at), 'MMMM d, yyyy')
        : ''
    }

    // Format related posts
    const formattedRelatedPosts = (relatedPosts || []).map(post => ({
      ...post,
      formatted_date: post.published_at || post.created_at 
        ? format(parseISO(post.published_at || post.created_at), 'MMM d, yyyy')
        : ''
    }))

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const canonicalUrl = cleanUrl(`${baseUrl}/blog/${params.slug}`)

    return {
      props: {
        post: formattedPost,
        relatedPosts: formattedRelatedPosts,
        canonicalUrl,
        siteTitle: process.env.NEXT_PUBLIC_SITE_NAME || 'Data Forge'
      },
      revalidate: 3600 // Revalidate every hour
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return { notFound: true }
  }
}

export default function BlogPost({ post, relatedPosts, canonicalUrl, siteTitle }) {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-pool"></div>
        </div>
      </MainLayout>
    )
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title || "",
    "image": post.featured_image ? [post.featured_image] : [],
    "datePublished": post.published_at || post.created_at || new Date().toISOString(),
    "dateModified": post.updated_at || post.published_at || post.created_at || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author_name
    },
    "publisher": {
      "@type": "Organization",
      "name": siteTitle,
      "logo": {
        "@type": "ImageObject",
        "url": cleanUrl(`${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`)
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  }

  return (
    <MainLayout>
      <Head>
        <title>{`${post.title} | ${siteTitle}`}</title>
        <meta name="description" content={post.excerpt || ''} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ''} />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
        {post.featured_image && (
          <meta property="og:image" content={post.featured_image} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData)
          }}
        />
      </Head>

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-8">
            {post.featured_image && (
              <div className="relative w-full h-64 md:h-96 mb-8">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            )}

            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.posts_categories.map(({ categories }) => (
                  <Link
                    key={categories.id}
                    href={`/blog/category/${categories.slug}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-pool/10 text-emerald-pool hover:bg-emerald-pool/20 transition-colors"
                  >
                    {categories.name}
                  </Link>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

              <div className="flex items-center space-x-4">
                <Image
                  src={post.author_avatar}
                  alt={post.author_name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {post.author_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {post.formatted_date}
                    {post.estimated_read_time && ` · ${post.estimated_read_time} min read`}
                  </p>
                </div>
              </div>
            </header>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              {/* Social Share moved above Table of Contents */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
                <SocialShare
                  url={canonicalUrl}
                  title={post.title}
                  description={post.excerpt || ''}
                />
              </div>

              {/* Table of Contents */}
              <TableOfContents content={post.content} />

              {/* Author Bio */}
              {post.profiles?.bio && (
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                  <div className="flex items-start space-x-4">
                    <Image
                      src={post.author_avatar}
                      alt={post.author_name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{post.author_name}</h4>
                      {post.profiles.title && (
                        <p className="text-sm text-gray-500 mb-2">{post.profiles.title}</p>
                      )}
                      <p className="text-gray-600 text-sm">{post.profiles.bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(post => (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {post.featured_image ? (
                      <div className="relative aspect-w-16 aspect-h-9">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-pool transition-colors mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {post.formatted_date}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </MainLayout>
  )
}