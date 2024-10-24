// File: pages/admin/posts/new.js
import AdminLayout from '../../../components/AdminLayout'
import PostEditor from '../../../components/PostEditor'

export default function NewPost() {
  return (
    <AdminLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Post</h1>
        <PostEditor />
      </div>
    </AdminLayout>
  )
}