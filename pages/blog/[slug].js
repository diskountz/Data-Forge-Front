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
      .select('*')  // Keep this simple for now
      .eq('slug', params.slug)
      .single();

    console.log('Query result:', { hasPost: !!post, error });

    if (error) throw error;

    return {
      props: { post },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error:', error);
    return { notFound: true }
  }
}

export default function BlogPost({ post }) {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div 
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>
    </MainLayout>
  );
}