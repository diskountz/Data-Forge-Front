// File: pages/blog/[slug].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { format } from 'date-fns'
import Link from 'next/link'

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
          profiles:author_id(full_name),
          posts_categories(
            categories(name, slug)
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
    return <div className="text-center py-12">Loading...</div>
  }

  if (!post) {
    return <div className="text-center py-12">Post not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Link href="/blog">
            <span className="text-emerald-pool hover:text-emerald-pool/80 cursor-pointer">
              ← Back to Blog
            </span>
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <article className="bg-white shadow rounded-lg overflow-hidden">
          {post.featured_image && (
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            <div className="mt-2 text-sm text-gray-500">
              By {post.profiles?.full_name} • {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
            </div>
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
            <div 
              className="mt-8 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </main>
    </div>
  )
}