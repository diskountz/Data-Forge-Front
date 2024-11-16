import { createClient } from '@supabase/supabase-js'
import MainLayout from '../../components/MainLayout'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function getStaticPaths() {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'published')

  return {
    paths: posts?.map(({ slug }) => ({
      params: { slug }
    })) || [],
    fallback: true  // Changed to true from 'blocking'
  }
}

export async function getStaticProps({ params }) {
  try {
    console.log('Fetching post for slug:', params.slug);

    const { data: post, error } = await supabase
      .from('posts')
      .select('title, content, slug')  // Minimal fields first
      .eq('slug', params.slug)
      .single();

    console.log('Fetch result:', { hasPost: !!post, hasError: !!error });

    if (error) {
      console.error('Supabase error:', error);
      return { notFound: true };
    }

    if (!post) {
      console.log('No post found');
      return { notFound: true };
    }

    return {
      props: {
        post: {
          title: post.title,
          content: post.content,
          slug: post.slug
        }
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true }
  }
}

export default function BlogPost({ post }) {
  if (!post) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl">Loading...</h1>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <article className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </MainLayout>
  );
}