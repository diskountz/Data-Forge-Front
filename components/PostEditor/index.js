// File: components/PostEditor/index.js
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { Alert, AlertDescription } from '../../components/ui/alert'
import RichTextEditor from './RichTextEditor'
import ImageUpload from './ImageUpload'
import TableOfContents from './TableOfContents'
import PostPreview from './PostPreview'
import { extractTableOfContents, calculateReadTime } from './utils'

export default function PostEditor({ postId }) {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isPreview, setIsPreview] = useState(false)
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    featured_image: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    og_image: '',
    social_image: '',
    author_bio: '',
    author_image: '',
    is_featured: false,
    table_of_contents: [],
    estimated_read_time: 0
  })

  useEffect(() => {
    fetchCategories()
    if (postId) {
      fetchPost()
    }
  }, [postId])

  useEffect(() => {
    // Update table of contents when content changes
    const toc = extractTableOfContents(content)
    const readTime = calculateReadTime(content)
    setFormData(prev => ({
      ...prev,
      table_of_contents: toc,
      estimated_read_time: readTime
    }))
  }, [content])

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  async function fetchPost() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          posts_categories(category_id)
        `)
        .eq('id', postId)
        .single()

      if (error) throw error

      setFormData({
        ...data,
        meta_title: data.meta_title || data.title,
        meta_description: data.meta_description || data.excerpt
      })
      setContent(data.content)
      setSelectedCategories(data.posts_categories.map(pc => pc.category_id))
    } catch (error) {
      setError(error.message)
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Auto-generate slug from title
    if (name === 'title' && !postId) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const postData = {
        ...formData,
        content,
        updated_at: new Date().toISOString()
      }

      let postId
      if (postData.id) {
        const { data, error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', postData.id)
          .select()
          .single()

        if (error) throw error
        postId = postData.id
      } else {
        const { data, error } = await supabase
          .from('posts')
          .insert([{
            ...postData,
            author_id: (await supabase.auth.getUser()).data.user.id
          }])
          .select()
          .single()

        if (error) throw error
        postId = data.id
      }

      // Handle categories
      if (selectedCategories.length > 0) {
        // Remove existing categories if updating
        if (postData.id) {
          await supabase
            .from('posts_categories')
            .delete()
            .eq('post_id', postId)
        }

        // Insert new categories
        const { error: categoriesError } = await supabase
          .from('posts_categories')
          .insert(
            selectedCategories.map(categoryId => ({
              post_id: postId,
              category_id: categoryId
            }))
          )

        if (categoriesError) throw categoriesError
      }

      router.push('/admin/posts')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (isPreview) {
    return (
      <PostPreview
        post={{
          ...formData,
          content,
          author: { bio: formData.author_bio, image: formData.author_image }
        }}
        onBack={() => setIsPreview(false)}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Main Content */}
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post Title"
              className="w-full text-4xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-emerald-pool"
              required
            />

            <div className="prose prose-lg max-w-none">
              <RichTextEditor
                initialContent={content}
                onChange={setContent}
              />
            </div>
          </div>

          {/* SEO and Meta */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="text-lg font-medium text-gray-900">SEO & Meta</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta Title
                <span className="text-sm text-gray-500 ml-2">
                  ({formData.meta_title.length}/60)
                </span>
              </label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                maxLength={60}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta Description
                <span className="text-sm text-gray-500 ml-2">
                  ({formData.meta_description.length}/160)
                </span>
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                maxLength={160}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Canonical URL
              </label>
              <input
                type="url"
                name="canonical_url"
                value={formData.canonical_url}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Author Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Author Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Author Bio
              </label>
              <textarea
                name="author_bio"
                value={formData.author_bio}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              />
            </div>

            <ImageUpload
              currentImage={formData.author_image}
              onUpload={(url) => setFormData(prev => ({ ...prev, author_image: url }))}
              label="Author Image"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Sidebar */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categories
              </label>
              <div className="mt-2 space-y-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.id])
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.id))
                        }
                      }}
                      className="rounded border-gray-300 text-emerald-pool focus:ring-emerald-pool"
                    />
                    <span className="ml-2">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-emerald-pool focus:ring-emerald-pool"
                />
                <span className="ml-2">Featured Post</span>
              </label>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">
                Estimated read time: {formData.estimated_read_time} min
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Images</h3>

            <ImageUpload
              currentImage={formData.featured_image}
              onUpload={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
              label="Featured Image"
            />

            <ImageUpload
              currentImage={formData.social_image}
              onUpload={(url) => setFormData(prev => ({ ...prev, social_image: url }))}
              label="Social Share Image"
              hint="Recommended: 1200x630px"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-pool"
            >
              Preview
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-pool hover:bg-emerald-pool/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-pool"
            >
              {loading ? 'Saving...' : postId ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}