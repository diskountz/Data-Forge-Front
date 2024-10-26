import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { Alert, AlertDescription } from '../ui/alert'
import RichTextEditor from '../RichTextEditor'
import ImageUpload from '../ImageUpload'

export default function PostEditor({ postId }) {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    featured_image: '',
    featured_image_alt: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    social_image: '',
    social_image_alt: '',
    is_featured: false,
  })

  useEffect(() => {
    fetchCategories()
    if (postId) {
      fetchPost()
    }
  }, [postId])

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
      setError('Failed to load categories')
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

      if (data) {
        setFormData({
          ...data,
          meta_title: data.meta_title || data.title,
          meta_description: data.meta_description || data.excerpt,
          featured_image_alt: data.featured_image_alt || '',
          social_image_alt: data.social_image_alt || ''
        })
        setContent(data.content || '')
        setSelectedCategories(data.posts_categories.map(pc => pc.category_id))
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      setError('Failed to load post')
    }
  }

  function handleImageUpload(field, url) {
    setFormData(prev => ({
      ...prev,
      [field]: url
    }))
  }

  async function handleChange(e) {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    if (name === 'title' && !postId) {
      const baseSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({
        ...prev,
        slug: baseSlug
      }))
    }
  }

  function handleContentUpdate(newContent) {
    setContent(newContent)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw new Error('Authentication error')
      if (!user) throw new Error('No authenticated user found')

      const postData = {
        title: formData.title,
        slug: formData.slug,
        content: content,
        excerpt: formData.excerpt,
        featured_image: formData.featured_image,
        featured_image_alt: formData.featured_image_alt,
        status: formData.status,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        canonical_url: formData.canonical_url,
        social_image: formData.social_image,
        social_image_alt: formData.social_image_alt,
        is_featured: formData.is_featured,
        updated_at: new Date().toISOString()
      }

      let post
      if (postId) {
        const { data, error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', postId)
          .select()
          .single()

        if (error) throw error
        post = data
      } else {
        const { data, error } = await supabase
          .from('posts')
          .insert([{
            ...postData,
            author_id: user.id,
            created_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (error) throw error
        post = data
      }

      if (post) {
        if (postId) {
          await supabase
            .from('posts_categories')
            .delete()
            .eq('post_id', postId)
        }

        let categoriesToAssign = selectedCategories

        if (categoriesToAssign.length === 0) {
          const { data: generalCat, error: findError } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', 'general')
            .single()

          if (findError || !generalCat) {
            const { data: newCat, error: createError } = await supabase
              .from('categories')
              .insert([{
                name: 'General',
                slug: 'general',
                description: 'General category for uncategorized posts'
              }])
              .select()
              .single()

            if (createError) throw createError
            categoriesToAssign = [newCat.id]
          } else {
            categoriesToAssign = [generalCat.id]
          }
        }

        const { error: categoriesError } = await supabase
          .from('posts_categories')
          .insert(
            categoriesToAssign.map(categoryId => ({
              post_id: post.id,
              category_id: categoryId
            }))
          )

        if (categoriesError) throw categoriesError
      }

      router.push('/admin/posts')
    } catch (error) {
      console.error('Error saving post:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
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
              className="w-full text-4xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-emerald-pool break-words"
              style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
              required
            />

            {/* Featured Image Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Featured Image</h3>
              <ImageUpload
                currentImage={formData.featured_image}
                onUpload={(url) => handleImageUpload('featured_image', url)}
                label="Featured Image"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alt Text
                </label>
                <input
                  type="text"
                  name="featured_image_alt"
                  value={formData.featured_image_alt}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                  placeholder="Describe the image for accessibility"
                />
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <RichTextEditor
                content={content}
                onUpdate={handleContentUpdate}
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
                  ({formData.meta_title?.length || 0}/70)
                </span>
              </label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title || ''}
                onChange={handleChange}
                maxLength={70}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta Description
                <span className="text-sm text-gray-500 ml-2">
                  ({formData.meta_description?.length || 0}/160)
                </span>
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description || ''}
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
                value={formData.canonical_url || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Social Share Image */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Social Share Image</h3>
            <ImageUpload
              currentImage={formData.social_image}
              onUpload={(url) => handleImageUpload('social_image', url)}
              label="Social Share Image"
              hint="Recommended: 1200x630px"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Social Image Alt Text
              </label>
              <input
                type="text"
                name="social_image_alt"
                value={formData.social_image_alt}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                placeholder="Describe the social share image for accessibility"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Sidebar */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              />
            </div>

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
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-pool hover:bg-emerald-pool/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-pool disabled:opacity-50"
            >
              {loading ? 'Saving...' : postId ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}