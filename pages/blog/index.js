// File: pages/blog/index.js
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  Clock, 
  Search, 
  Filter,
  ChevronRight,
  User,
  Calendar,
  Loader,
  BookOpen
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Utility function for reading time
function calculateReadingTime(content) {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const postsPerPage = 9;

  useEffect(() => {
    fetchPosts();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const searchResults = posts.filter(post => 
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.posts_categories?.some(({ categories }) => 
          categories.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredPosts(searchResults);
      setCurrentPage(1);
      setIsSearching(false);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  async function fetchPosts() {
    try {
      setLoading(true);
      setError(null);

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id(full_name),
          posts_categories(
            categories(name, slug)
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (postsError) throw postsError;

      // Process and set posts
      setPosts(postsData || []);
      setFilteredPosts(postsData || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  // Calculate current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Featured post logic
  const featuredPost = posts.find(post => post.is_featured) || posts[0];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={fetchPosts}
            className="px-6 py-3 bg-emerald-pool text-white rounded-lg hover:bg-emerald-pool/90 transition-colors"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blog & Resources
            </h1>
            <p className="text-lg text-gray-600">
              Expert insights on B2B prospecting, sales strategies, and data enrichment
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-pool/20 focus:border-emerald-pool transition-colors"
                />
                {isSearching ? (
                  <Loader className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 animate-spin text-emerald-pool mx-auto" />
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          ) : (
            <>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No posts found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {currentPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <a className="block">
                          {/* Image Container */}
                          <div className="relative aspect-video">
                            <img 
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-4 left-4 right-4 text-white">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center text-sm">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {calculateReadingTime(post.content)} min read
                                  </span>
                                  <span className="flex items-center text-sm font-medium">
                                    Read More 
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            {/* Categories */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.posts_categories?.map(({ categories }) => (
                                <span
                                  key={categories.slug}
                                  className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-emerald-pool/10 text-emerald-pool"
                                >
                                  {categories.name}
                                </span>
                              ))}
                            </div>

                            {/* Title */}
                            <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-pool transition-colors">
                              {post.title}
                            </h2>

                            {/* Excerpt */}
                            {post.excerpt && (
                              <p className="text-gray-600 line-clamp-2 mb-4">
                                {post.excerpt}
                              </p>
                            )}

                            {/* Meta */}
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-emerald-pool/10 flex items-center justify-center">
                                  <User className="w-4 h-4 text-emerald-pool" />
                                </div>
                                <span className="ml-2 text-sm text-gray-600">
                                  {post.profiles?.full_name}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                {format(new Date(post.published_at || post.created_at), 'MMM d, yyyy')}
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-emerald-pool text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}