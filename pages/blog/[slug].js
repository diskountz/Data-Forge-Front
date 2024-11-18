import { createClient } from '@supabase/supabase-js'
import MainLayout from '../../components/MainLayout'
import { useEffect } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function getStaticPaths() {
  console.log('Starting getStaticPaths');
  return {
    paths: [],
    fallback: true  // Changed to true from 'blocking'
  }
}

export async function getStaticProps({ params }) {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('title, content, created_at, status')
      .eq('slug', params.slug)
      .single();

    if (error) throw error;

    if (!post) {
      return { notFound: true }
    }

    return {
      props: {
        post,
        fallback: true
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
    // Client-side error logging
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
          <h1 className="text-4xl font-bold text-daring-indigo mb-4">
            {post.title}
          </h1>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </MainLayout>
  );
}