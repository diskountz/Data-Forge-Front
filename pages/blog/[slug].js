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
  console.log('Starting getStaticProps:', params);

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('title, content')  // Only select what we need
      .eq('slug', params.slug)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Post found:', post?.title);

    return {
      props: { post },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true }
  }
}

export default function BlogPost({ post }) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}