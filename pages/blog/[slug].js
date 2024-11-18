import { createClient } from '@supabase/supabase-js'
import MainLayout from '../../components/MainLayout'
import { useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'

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

    // Format the post data
    const formattedPost = {
      ...post,
      formatted_date: post.published_at || post.created_at 
        ? format(parseISO(post.published_at || post.created_at), 'MMMM d, yyyy')
        : ''
    }

    return {
      props: {
        post: formattedPost
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true }
  }
}

export default function BlogPost({ post }) {
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
      <div className="max-w-4xl mx-auto px-4 py-8">
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
      </div>
    </MainLayout>
  );
}