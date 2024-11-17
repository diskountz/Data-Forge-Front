import { createClient } from '@supabase/supabase-js'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MainLayout from '../../components/MainLayout'
import TableOfContents from '../../components/PostEditor/TableOfContents'
import SocialShare from '../../components/SocialShare'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const cleanUrl = (url) => {
  if (!url) return ''
  return url.replace(/([^:]\/)\/+/g, '$1')
}

export async function getStaticPaths() {
  console.log('Starting getStaticPaths');
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug')
      .eq('status', 'published');

    console.log('getStaticPaths result:', {
      postCount: posts?.length,
      hasError: !!error,
      errorMessage: error?.message,
      errorDetails: error?.details
    });

    if (error) throw error;

    return {
      paths: posts?.map(({ slug }) => ({
        params: { slug }
      })) || [],
      fallback: true
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return {
      paths: [],
      fallback: true
    };
  }
}

export async function getStaticProps({ params }) {
  console.log('Starting getStaticProps with params:', params);
  try {
    // Log environment variables (redacted for security)
    console.log('Environment check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL
    });

    // Main post query
    console.log('Fetching post data for slug:', params.slug);
    const { data: post, error: postError } = await supabase
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
      .single();

    console.log('Post query result:', {
      hasPost: !!post,
      hasError: !!postError,
      errorMessage: postError?.message,
      errorDetails: postError?.details
    });

    if (postError) throw postError;

    if (!post) {
      console.log('No post found for slug:', params.slug);
      return { notFound: true };
    }

    // Get category IDs from the current post
    const categoryIds = post.posts_categories.map(pc => pc.category_id);
    console.log('Fetching related posts for categories:', categoryIds);

    // Related posts query
    const { data: relatedPosts, error: relatedError } = await supabase
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
      .limit(3);

    console.log('Related posts query result:', {
      relatedPostCount: relatedPosts?.length,
      hasError: !!relatedError,
      errorMessage: relatedError?.message
    });

    if (relatedError) {
      console.warn('Error fetching related posts:', relatedError);
      // Continue without related posts rather than failing
    }

    // Format the post data
    console.log('Formatting post data');
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
    }));

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const canonicalUrl = cleanUrl(`${baseUrl}/blog/${params.slug}`);

    console.log('Successfully prepared data for:', params.slug);

    return {
      props: {
        post: formattedPost,
        relatedPosts: formattedRelatedPosts,
        canonicalUrl,
        siteTitle: process.env.NEXT_PUBLIC_SITE_NAME || 'Your Site Name'
      },
      revalidate: 60 // Revalidate every minute
    }
  } catch (error) {
    console.error('Fatal error in getStaticProps:', {
      message: error.message,
      name: error.name,
      code: error.code,
      details: error.details,
      stack: error.stack
    });
    throw error; // Let Next.js handle the error
  }
}

export default function BlogPost({ post, relatedPosts, canonicalUrl, siteTitle }) {
  const router = useRouter();

  // Handle loading state
  if (router.isFallback) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-pool"></div>
        </div>
      </MainLayout>
    );
  }

  // Handle no post case
  if (!post) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <Link href="/blog">
            <a className="text-emerald-pool hover:underline">Return to blog</a>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Prepare schema data
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
  };

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
                  src={post.author_avatar}
                  alt={post.author_name}
                  className="w-12 h-12 rounded-full"
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

            {/* Share buttons at the top */}
            <div className="mb-8">
              <SocialShare 
                url={canonicalUrl}
                title={post.title}
                description={post.excerpt || ''}
              />
            </div>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share buttons at the bottom */}
            <div className="mt-12 pt-8 border-t">
              <SocialShare 
                url={canonicalUrl}
                title={post.title}
                description={post.excerpt || ''}
              />
            </div>

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <a className="group">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                          {post.featured_image ? (
                            <div className="aspect-w-16 aspect-h-9">
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-48 object-cover"
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
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              {/* Table of Contents */}
              <TableOfContents content={post.content} />

              {/* Author Bio */}
              {post.profiles?.bio && (
                <div className="bg-white shadow-sm rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.author_avatar}
                      alt={post.author_name}
                      className="w-16 h-16 rounded-full"
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
      </article>
    </MainLayout>
  );
}