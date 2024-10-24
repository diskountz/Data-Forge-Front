// File: pages/blog/[slug].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { format } from 'date-fns'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import TableOfContents from '../../components/PostEditor/TableOfContents'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

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
        <div className="text-center py-12">Loading...</div>
      </MainLayout>
    )
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="text-center py-12">Post not found</div>
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
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}

            <header className="mb-8">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                {post.posts_categories.map(({ categories }) => (
                  <Link 
                    key={categories.id} 
                    href={`/blog/category/${categories.slug}`}
                  >
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-pool/10 text-emerald-pool cursor-pointer">
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
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-8">
              <TableOfContents content={post.content} />

              {/* Author Bio */}
              {post.author_bio && (
                <div className="bg-gray-50 rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                  <div className="flex items-center mb-4">
                    <img
                      src={post.profiles.avatar_url || '/default-avatar.png'}
                      alt={post.profiles.full_name}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{post.profiles.full_name}</h4>
                      <p className="text-sm text-gray-500">{post.profiles.title}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{post.author_bio}</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>
    </MainLayout>
  )
}