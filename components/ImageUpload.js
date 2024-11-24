import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Image, Upload, X } from 'lucide-react' // Added import for icons

export default function ImageUpload({ onUpload, currentImage, label, hint }) {
  const [uploading, setUploading] = useState(false)
  const supabase = useSupabaseClient()

  async function handleUpload(event) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `post-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      onUpload(publicUrl)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    onUpload('') // Clear the image
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label || 'Image'}
      </label>

      {/* Current Image Preview */}
      {currentImage && (
        <div className="relative rounded-lg border border-gray-200 p-2">
          <div className="relative aspect-video w-full">
            <img
              src={currentImage}
              alt="Current image"
              className="rounded-lg object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Input */}
      <div className="relative">
        <label
          className={`
            block w-full rounded-lg border-2 border-dashed p-4 text-center
            ${currentImage ? 'border-gray-200 hover:border-gray-300' : 'border-emerald-pool/20 hover:border-emerald-pool/30'}
            transition-colors cursor-pointer
          `}
        >
          <div className="flex flex-col items-center">
            <Upload 
              className={`w-8 h-8 mb-2 ${currentImage ? 'text-gray-400' : 'text-emerald-pool'}`} 
            />
            <span className="text-sm font-medium text-gray-700">
              {uploading ? 'Uploading...' : currentImage ? 'Change image' : 'Upload image'}
            </span>
            {hint && (
              <span className="text-xs text-gray-500 mt-1">{hint}</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  )
}