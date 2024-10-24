// File: pages/admin/categories/index.js
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import AdminLayout from '../../../components/AdminLayout'
import { Alert, AlertDescription } from '../../../components/ui/alert'

export default function CategoriesManager() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' })
  const [editingCategory, setEditingCategory] = useState(null)
  const supabase = useSupabaseClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e, isEditing = false) {
    const { name, value } = e.target
    if (isEditing) {
      setEditingCategory(prev => ({ ...prev, [name]: value }))
    } else {
      setNewCategory(prev => ({ ...prev, [name]: value }))
      // Auto-generate slug from name
      if (name === 'name') {
        const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        setNewCategory(prev => ({ ...prev, slug }))
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])

      if (error) throw error

      setCategories([...categories, data[0]])
      setNewCategory({ name: '', slug: '', description: '' })
    } catch (error) {
      setError(error.message)
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    setError(null)
    try {
      const { error } = await supabase
        .from('categories')
        .update(editingCategory)
        .eq('id', editingCategory.id)

      if (error) throw error

      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ))
      setEditingCategory(null)
    } catch (error) {
      setError(error.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select() // Add this to return the inserted data

      if (error) throw error

      // Update to handle the returned data properly
      if (data && data.length > 0) {
        setCategories([...categories, data[0]])
        setNewCategory({ name: '', slug: '', description: '' })
      } else {
        throw new Error('No data returned from insert')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this category?')) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCategories(categories.filter(cat => cat.id !== id))
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <AdminLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Categories</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Add New Category Form */}
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
          <h2 className="text-lg font-medium mb-4">Add New Category</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                name="slug"
                value={newCategory.slug}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-emerald-pool text-white rounded-md hover:bg-opacity-90"
          >
            Add Category
          </button>
        </form>

        {/* Categories List */}
        {loading ? (
          <div className="text-center text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500">No categories yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map(category => (
                  <tr key={category.id}>
                    {editingCategory?.id === category.id ? (
                      <td colSpan="4">
                        <form onSubmit={handleUpdate} className="p-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <input
                              type="text"
                              name="name"
                              value={editingCategory.name}
                              onChange={e => handleInputChange(e, true)}
                              className="rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                            />
                            <input
                              type="text"
                              name="slug"
                              value={editingCategory.slug}
                              onChange={e => handleInputChange(e, true)}
                              className="rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                            />
                            <input
                              type="text"
                              name="description"
                              value={editingCategory.description}
                              onChange={e => handleInputChange(e, true)}
                              className="rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                            />
                          </div>
                          <div className="mt-2 flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setEditingCategory(null)}
                              className="px-3 py-1 text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 bg-emerald-pool text-white rounded-md hover:bg-opacity-90"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.slug}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {category.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="text-emerald-pool hover:text-emerald-pool/80 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}