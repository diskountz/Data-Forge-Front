// File: pages/blog/[slug].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { format } from 'date-fns'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import TableOfContents from '../../components/PostEditor/TableOfContents'
import SocialShare from '../../components/SocialShare'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  async function fetchPost() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id(*),
          posts_categories(
            categories(*)
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) throw error
      setPost(data)

      // Fetch related posts
      if (data?.posts_categories?.length) {
        const categoryIds = data.posts_categories.map(pc => pc.categories.id)
        const { data: related } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            slug,
            published_at,
            created_at
          `)
          .eq('status', 'published')
          .neq('id', data.id)
          .in('posts_categories.categories.id', categoryIds)
          .limit(3)

        setRelatedPosts(related || [])
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      router.push('/blog')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-pool"></div>
        </div>
      </MainLayout>
    )
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
          <Link href="/blog">
            <span className="text-emerald-pool hover:text-emerald-pool/80 cursor-pointer">
              ← Back to Blog
            </span>
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-8">
            {post.featured_image && (
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
              />
            )}

            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.posts_categories.map(({ categories }) => (
                  <Link 
                    key={categories.id} 
                    href={`/blog/category/${categories.slug}`}
                    passHref
                  >
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-pool/10 text-emerald-pool cursor-pointer hover:bg-emerald-pool/20 transition-colors">
                      {categories.name}
                    </span>
                  </Link>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

              <div className="flex items-center space-x-4">
                <img
                  src={post.profiles.avatar_url || '/default-avatar.png'}
                  alt={post.profiles.full_name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {post.profiles.full_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
                    {post.estimated_read_time && ` · ${post.estimated_read_time} min read`}
                  </p>
                </div>
              </div>
            </header>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Social Share */}
            <div className="mt-12 pt-8 border-t">
              <SocialShare 
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={post.title}
                description={post.excerpt || ''}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              <TableOfContents content={post.content} />

              {/* Author Bio */}
              {post.profiles.bio && (
                <div className="bg-white shadow-sm rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.profiles.avatar_url || '/default-avatar.png'}
                      alt={post.profiles.full_name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{post.profiles.full_name}</h4>
                      {post.profiles.title && (
                        <p className="text-sm text-gray-500 mb-2">{post.profiles.title}</p>
                      )}
                      <p className="text-gray-600 text-sm">{post.profiles.bio}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map(post => (
                      <Link key={post.id} href={`/blog/${post.slug}`} passHref>
                        <a className="block group">
                          <h4 className="text-base font-medium text-gray-900 group-hover:text-emerald-pool transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(new Date(post.published_at || post.created_at), 'MMM d, yyyy')}
                          </p>
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>
    </MainLayout>
  )
}