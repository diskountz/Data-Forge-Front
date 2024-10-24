// File: components/PostEditor.js
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { Alert, AlertDescription } from '../components/ui/alert'
import RichTextEditor from './RichTextEditor'
import ImageUpload from './ImageUpload'

export default function PostEditor({ postId }) {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [content, setContent] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    featured_image: '',
    status: 'draft'
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
      setCategories(data)

      if (postId) {
        const { data: postCategories, error: postCategoriesError } = await supabase
          .from('posts_categories')
          .select('category_id')
          .eq('post_id', postId)

        if (postCategoriesError) throw postCategoriesError
        setSelectedCategories(postCategories.map(pc => pc.category_id))
      }
    } catch (error) {
      setError(error.message)
    }
  }

  async function fetchPost() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error) throw error

      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        featured_image: data.featured_image,
        status: data.status
      })
      setContent(data.content)
    } catch (error) {
      setError(error.message)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        author_id: (await supabase.auth.getUser()).data.user.id,
        updated_at: new Date().toISOString()
      }

      let postId
      if (isEditing) {
        const { data, error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editingPostId)
          .select()
          .single()

        if (error) throw error
        postId = editingPostId
      } else {
        const { data, error } = await supabase
          .from('posts')
          .insert([postData])
          .select()
          .single()

        if (error) throw error
        postId = data.id
      }

      // Handle categories
      if (selectedCategories.length > 0) {
        // First, delete existing categories if editing
        if (isEditing) {
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

  async function updatePostCategories(postId) {
    // Remove existing categories
    await supabase
      .from('posts_categories')
      .delete()
      .eq('post_id', postId)

    // Add new categories
    if (selectedCategories.length > 0) {
      const categoryData = selectedCategories.map(categoryId => ({
        post_id: postId,
        category_id: categoryId
      }))

      const { error } = await supabase
        .from('posts_categories')
        .insert(categoryData)

      if (error) throw error
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

      if (postId) {
        // Update existing post
        const { data, error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', postId)
          .select()
          .single()

        if (error) throw error
        await updatePostCategories(postId)
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('posts')
          .insert([{
            ...postData,
            author_id: (await supabase.auth.getUser()).data.user.id
          }])
          .select()
          .single()

        if (error) throw error
        await updatePostCategories(data.id)
      }

      router.push('/admin/posts')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleImageUpload(url) {
    setFormData(prev => ({
      ...prev,
      featured_image: url
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <div className="mt-1">
          <RichTextEditor
            initialContent={content}
            onChange={setContent}
          />
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
        />
      </div>

      <ImageUpload onUpload={handleImageUpload} />

      {formData.featured_image && (
        <div className="mt-2">
          <img
            src={formData.featured_image}
            alt="Featured"
            className="h-32 w-auto object-cover rounded-md"
          />
        </div>
      )}

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
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
            <label key={category.id} className="inline-flex items-center mr-4">
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

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push('/admin/posts')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-pool"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-pool hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-pool"
        >
          {loading ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  )
}