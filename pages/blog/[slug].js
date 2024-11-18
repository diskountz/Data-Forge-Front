import { createClient } from '@supabase/supabase-js'

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
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    slug: params.slug
  });

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
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
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}