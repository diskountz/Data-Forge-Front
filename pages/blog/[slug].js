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
              <div className="bg-gradient-to-r from-emerald-pool to-daring-indigo rounded-xl p-8 text-white">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">
                      Start enriching your contact data today
                    </h3>
                    <p className="mb-6 text-white/90">
                      Get 50 free credits monthly. No credit card required.
                    </p>
                    <Link 
                      href="https://app.dataforge.so"
                      className="inline-flex px-6 py-3 bg-white text-emerald-pool rounded-lg hover:bg-white/90 transition-colors font-medium"
                    >
                      Get Started Free
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-12 mb-12">
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center gap-8">
                  <div className="flex-1">
                    <blockquote className="text-xl text-gray-900 mb-6">
                      "Data Forge transformed our outreach strategy. We've seen a 3x increase in response rates."
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-pool/10 flex items-center justify-center">
                        <span className="text-emerald-pool font-medium">SC</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Sarah Chen</div>
                        <div className="text-gray-600">Head of Sales at TechCorp</div>
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