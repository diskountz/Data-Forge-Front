import { createClient } from '@supabase/supabase-js'
import MainLayout from '../../components/MainLayout'
import { useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import TableOfContents from '../../components/PostEditor/TableOfContents'
import SocialShare from '../../components/SocialShare'
import Image from 'next/image'

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
        : ''
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
      {/* Featured Image Container - Full Width */}
      {post.featured_image && (
        <div className="w-full bg-gray-100 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-8">
            <article>
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.posts_categories?.map(({ categories }) => (
                  <Link 
                    key={categories.id} 
                    href={`/blog/category/${categories.slug}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-pool/10 text-emerald-pool hover:bg-emerald-pool/20 transition-colors"
                  >
                    {categories.name}
                  </Link>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-daring-indigo mb-4">
                {post.title}
              </h1>

              {/* Date */}
              <p className="text-gray-600 mb-8">{post.formatted_date}</p>

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

                    <Link 
                      href="https://app.dataforge.so"
                      className="inline-flex px-8 py-4 bg-white text-emerald-pool rounded-lg hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-lg"
                    >
                      Get Started Free →
                    </Link>
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
            <div className="sticky top-8 space-y-8">
              {/* Social Share */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <SocialShare 
                  url={canonicalUrl}
                  title={post.title}
                />
              </div>

              {/* Table of Contents */}
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