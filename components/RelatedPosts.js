// File: components/RelatedPosts.js
import Link from 'next/link'
import { format } from 'date-fns'

export default function RelatedPosts({ currentPost, posts }) {
  if (!posts?.length) return null

  return (
    <div className="py-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="group">
            {post.featured_image && (
              <Link href={`/blog/${post.slug}`}>
                <div className="relative rounded-lg overflow-hidden mb-4 aspect-[16/9]">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
            )}
            <div>
              {post.categories?.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-block text-xs font-medium text-emerald-pool mb-2 mr-2"
                >
                  {cat.name}
                </span>
              ))}
              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-pool transition-colors mb-2">
                  {post.title}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{format(new Date(post.published_at), 'MMM d, yyyy')}</span>
                <span className="mx-2">·</span>
                <span>{post.estimated_read_time} min read</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}