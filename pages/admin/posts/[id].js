import { useRouter } from 'next/router'
import AdminLayout from '../../../components/AdminLayout'
import PostEditor from '../../../components/PostEditor'

export default function EditPost() {
  const router = useRouter()
  const { id } = router.query

  return (
    <AdminLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Post</h1>
        {id && <PostEditor postId={id} />}
      </div>
    </AdminLayout>
  )
}