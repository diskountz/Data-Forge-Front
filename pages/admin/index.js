// File: pages/admin/index.js
import { useEffect, useState } from 'react'
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import AdminLayout from '../../components/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useRouter } from 'next/router'

export default function AdminDashboard() {
  const session = useSession()
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    categories: 0
  })

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    } else {
      fetchStats()
    }
  }, [session])

  async function fetchStats() {
    try {
      // Get total posts
      const { count: totalPosts } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })

      // Get published posts
      const { count: publishedPosts } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

      // Get draft posts
      const { count: draftPosts } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft')

      // Get categories
      const { count: categories } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalPosts: totalPosts || 0,
        publishedPosts: publishedPosts || 0,
        draftPosts: draftPosts || 0,
        categories: categories || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (!session) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back to your CMS dashboard.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-pool">{stats.totalPosts}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Published Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.publishedPosts}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Draft Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{stats.draftPosts}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stats.categories}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/admin/posts/new')}
                className="p-4 text-left bg-emerald-pool/10 rounded-lg hover:bg-emerald-pool/20 transition-colors"
              >
                <h3 className="font-semibold text-emerald-pool">Create New Post</h3>
                <p className="text-sm text-gray-600 mt-1">Start writing a new blog post</p>
              </button>

              <button
                onClick={() => router.push('/admin/categories')}
                className="p-4 text-left bg-emerald-pool/10 rounded-lg hover:bg-emerald-pool/20 transition-colors"
              >
                <h3 className="font-semibold text-emerald-pool">Manage Categories</h3>
                <p className="text-sm text-gray-600 mt-1">Organize your content</p>
              </button>

              <button
                onClick={() => router.push('/admin/posts')}
                className="p-4 text-left bg-emerald-pool/10 rounded-lg hover:bg-emerald-pool/20 transition-colors"
              >
                <h3 className="font-semibold text-emerald-pool">View All Posts</h3>
                <p className="text-sm text-gray-600 mt-1">Manage your existing content</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}