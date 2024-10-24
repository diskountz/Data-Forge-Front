// File: pages/blog/index.js
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { format } from 'date-fns'
import MainLayout from '../../components/MainLayout'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function BlogIndex() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id(full_name),
          posts_categories(
            categories(name, slug)
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-pool mx-auto"></div>
            </div>
          ) : (
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`} passHref>
                    <div className="cursor-pointer">
                      {post.featured_image && (
                        <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                          <img 
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}

                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.posts_categories.map(({ categories }) => (
                          <span
                            key={categories.slug}
                            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-emerald-pool/10 text-emerald-pool"
                          >
                            {categories.name}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-pool transition-colors">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{post.profiles?.full_name}</span>
                        <span className="mx-2">·</span>
                        <span>{format(new Date(post.published_at || post.created_at), 'MMM d, yyyy')}</span>
                        {post.estimated_read_time && (
                          <>
                            <span className="mx-2">·</span>
                            <span>{post.estimated_read_time} min read</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}