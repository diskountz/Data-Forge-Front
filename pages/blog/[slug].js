import { createClient } from '@supabase/supabase-js'
import MainLayout from '../../components/MainLayout'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function getStaticPaths() {
  console.log('Starting getStaticPaths');
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  console.log('Starting getStaticProps', {
    slug: params.slug
  });

  try {
    const { data: post, error } = await supabase
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

    console.log('Query result:', { hasPost: !!post, error });

    if (error) throw error;

    return {
      props: { 
        post,
        siteTitle: process.env.NEXT_PUBLIC_SITE_NAME || 'Data Forge'
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error:', error);
    return { notFound: true }
  }
}

export default function BlogPost({ post, siteTitle }) {
  return (
    <MainLayout>
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            {post.featured_image && (
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
              />
            )}

            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              {post.author_id && (
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {post.profiles?.full_name || 'Anonymous'}
                    </p>
                  </div>
                </div>
              )}
            </header>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>
    </MainLayout>
  );
}