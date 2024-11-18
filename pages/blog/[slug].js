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
  console.log('Starting getStaticProps:', params);

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('title, content')
      .eq('slug', params.slug)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return {
      props: { 
        post,
        // Add any props MainLayout might need
        navigation: {
          isOpen: false
        }
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true }
  }
}

export default function BlogPost({ post, navigation }) {
  return (
    <MainLayout navigation={navigation}>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </main>
    </MainLayout>
  );
}