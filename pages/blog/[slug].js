import { createClient } from '@supabase/supabase-js'
import MainLayout from '../../components/MainLayout'
import { useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import TableOfContents from '../../components/PostEditor/TableOfContents'

// Calculate reading time function
function calculateReadTime(content) {
  if (!content) return 0;

  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');

  // Average reading speed (words per minute)
  const wordsPerMinute = 230;

  // Count words (split by spaces and filter empty strings)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);

  // Calculate reading time in minutes
  const readingTime = Math.ceil(words.length / wordsPerMinute);

  // Return at least 1 minute
  return Math.max(1, readingTime);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function getStaticPaths() {
  console.log('Starting getStaticPaths');
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        posts_categories!inner(
          category_id,
          categories(*)
        )
      `)
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;

    if (!post) {
      return { notFound: true }
    }

    const formattedPost = {
      ...post,
      formatted_date: post.published_at || post.created_at 
        ? format(parseISO(post.published_at || post.created_at), 'MMMM d, yyyy')
        : '',
      reading_time: calculateReadTime(post.content)
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const canonicalUrl = `${baseUrl}/blog/${params.slug}`.replace(/([^:]\/)\/+/g, '$1')

    return {
      props: {
        post: formattedPost,
        canonicalUrl
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true }
  }
}

export default function BlogPost({ post, canonicalUrl }) {
  useEffect(() => {
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      console.log('Client error:', { msg, url, lineNo, columnNo, error });
      return false;
    };
  }, []);

  const handleShare = (platform) => {
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(canonicalUrl)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(canonicalUrl)}&title=${encodeURIComponent(post.title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`
    };
    window.open(shareUrls[platform], '_blank');
  };

  if (!post) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header Bar - Full Width */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category and Date */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <span className="text-emerald-pool font-medium uppercase">
              {post.posts_categories?.[0]?.categories?.name}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{post.formatted_date}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">
              {post.reading_time} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[50px] font-bold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Author and Social Share Section */}
          <div className="flex items-center justify-between">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-pool/10 flex items-center justify-center">
                <span className="text-emerald-pool font-medium text-sm">DF</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Data Forge</div>
                <div className="text-sm text-gray-500">Chief Knowledge Officer</div>
              </div>
            </div>

            {/* Compact Social Share */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleShare('twitter')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleShare('linkedin')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <article>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Free Credits CTA */}
            <div className="mt-12 border-t border-gray-200 pt-12">
              <div className="bg-gradient-to-r from-emerald-pool to-daring-indigo rounded-xl p-8 shadow-lg relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
                      ✨ No credit card required
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4">
                      Transform Your Outreach with Verified Data
                    </h3>

                    <div className="space-y-3 mb-8 text-white/90">
                      <div className="flex items-center gap-2">
                        <span className="text-white">✓</span>
                        <p>50 free monthly credits</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white">✓</span>
                        <p>98% email deliverability rate</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white">✓</span>
                        <p>Direct dials & company insights</p>
                      </div>
                    </div>

                    <button
                      onClick={() => window.location.href = 'https://app.dataforge.so'}
                      className="group relative inline-flex items-center justify-center px-8 py-4 bg-white rounded-lg overflow-hidden transition-all duration-300
                      hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
                    >
                      <span className="relative z-10 font-bold text-lg bg-gradient-to-r from-emerald-pool to-daring-indigo bg-clip-text text-transparent group-hover:opacity-80">
                        Get Started Free
                      </span>
                      <span className="relative z-10 ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-12 mb-12">
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-pool/5 rounded-xl transform rotate-1"></div>
                <div className="absolute -inset-4 bg-emerald-pool/5 rounded-xl transform -rotate-1"></div>

                <div className="relative bg-white rounded-xl p-8 shadow-lg border border-emerald-pool/10">
                  <div className="flex items-center gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-1 text-emerald-pool mb-6">
                        {'★★★★★'.split('').map((star, i) => (
                          <span key={i} className="text-xl">{star}</span>
                        ))}
                      </div>

                      <blockquote className="text-2xl font-medium text-gray-900 mb-6 relative">
                        <span className="absolute -left-4 -top-4 text-6xl text-emerald-pool/10">"</span>
                        <span className="relative">Data Forge transformed our outreach strategy. We've seen a 3x increase in response rates.</span>
                      </blockquote>

                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-pool to-daring-indigo flex items-center justify-center shadow-lg">
                          <span className="text-white font-semibold text-lg">SC</span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">Sarah Chen</div>
                          <div className="text-emerald-pool">Head of Sales at TechCorp</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-8">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <TableOfContents content={post.content} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}