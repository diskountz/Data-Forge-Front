// File: components/RichTextEditor.js
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border-b p-2 flex flex-wrap gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded ${editor.isActive('bold') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
        title="Bold"
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded ${editor.isActive('italic') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
        title="Italic"
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
        title="Heading"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
        title="Bullet List"
      >
        List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
        title="Numbered List"
      >
        1. 2. 3.
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1 rounded ${editor.isActive('blockquote') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
        title="Quote"
      >
        Quote
      </button>
      <button
        onClick={() => {
          const url = window.prompt('Enter URL')
          if (url) {
            editor.chain().focus().setLink({ href: url }).run()
          }
        }}
        className={`p-1 rounded ${editor.isActive('link') ? 'bg-emerald-pool text-white' : 'bg-gray-100'}`}
        title="Link"
      >
        Link
      </button>
    </div>
  )
}

export default function RichTextEditor({ initialContent = '', onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="border rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4"
      />
    </div>
  )
}