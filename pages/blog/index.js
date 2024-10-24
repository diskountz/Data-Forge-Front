// File: pages/blog/index.js
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { format } from 'date-fns'

// Initialize Supabase client
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="bg-white shadow rounded-lg overflow-hidden">
                {post.featured_image && (
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-emerald-pool cursor-pointer">
                      {post.title}
                    </h2>
                  </Link>
                  <div className="mt-2 text-sm text-gray-500">
                    By {post.profiles?.full_name} • {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
                  </div>
                  {post.excerpt && (
                    <p className="mt-3 text-gray-600">{post.excerpt}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.posts_categories.map(({ categories }) => (
                      <span
                        key={categories.slug}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-pool/10 text-emerald-pool"
                      >
                        {categories.name}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}