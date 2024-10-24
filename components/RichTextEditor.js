// File: components/RichTextEditor.js
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CodeBlock from '@tiptap/extension-code-block'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const MenuBar = ({ editor, onImageUpload }) => {
  const supabase = useSupabaseClient()

  if (!editor) {
    return null
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `blog-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      editor.chain().focus().setImage({ src: publicUrl }).run()
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  return (
    <div className="border-b p-2 flex flex-wrap gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${editor.isActive('bold') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${editor.isActive('italic') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
      >
        Numbered List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
      >
        Quote
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded ${editor.isActive('codeBlock') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
      >
        Code
      </button>
      <label className="p-2 rounded bg-gray-100 cursor-pointer">
        Image
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </label>
      <button
        onClick={() => {
          const url = window.prompt('Enter URL')
          if (url) {
            editor.chain().focus().setLink({ href: url }).run()
          }
        }}
        className={`p-2 rounded ${editor.isActive('link') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
      >
        Link
      </button>
    </div>
  )
}