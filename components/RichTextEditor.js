// File: components/RichTextEditor.js
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlock from '@tiptap/extension-code-block'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  Highlighter,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Table as TableIcon,
  Trash2,
  Column,
  ColumnVertical,
  Row,
  RowVertical,
  Image as ImageIcon,
  Youtube,
  Link as LinkIcon,
  Undo,
  Redo,
  Grid,
  Split,
  Heading
} from 'lucide-react'

const MenuBar = ({ editor }) => {
  const supabase = useSupabaseClient()

  if (!editor) {
    return null
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const addYoutubeVideo = () => {
    const url = window.prompt('Enter YouTube URL')
    if (url) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
      if (videoId) {
        const html = `<div class="aspect-w-16 aspect-h-9 my-4">
          <iframe src="https://www.youtube.com/embed/${videoId}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            class="w-full h-full rounded-lg"
          ></iframe>
        </div>`
        editor.chain().focus().insertContent(html).run()
      }
    }
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

  const buttonStyle = (isActive = false) => `p-2 rounded hover:bg-gray-100 ${
    isActive ? 'bg-emerald-pool text-white' : 'bg-gray-50'
  }`

  return (
    <div className="border-b flex flex-wrap gap-1 p-2">
      {/* Text Style Controls */}
      <div className="flex gap-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonStyle(editor.isActive('bold'))}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonStyle(editor.isActive('italic'))}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={buttonStyle(editor.isActive('underline'))}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={buttonStyle(editor.isActive('strike'))}
          title="Strike"
        >
          <Strikethrough size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={buttonStyle(editor.isActive('highlight'))}
          title="Highlight"
        >
          <Highlighter size={16} />
        </button>
      </div>

      {/* Script Controls */}
      <div className="flex gap-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={buttonStyle(editor.isActive('superscript'))}
          title="Superscript"
        >
          <SuperscriptIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={buttonStyle(editor.isActive('subscript'))}
          title="Subscript"
        >
          <SubscriptIcon size={16} />
        </button>
      </div>

      {/* Alignment Controls */}
      <div className="flex gap-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={buttonStyle(editor.isActive({ textAlign: 'left' }))}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={buttonStyle(editor.isActive({ textAlign: 'center' }))}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={buttonStyle(editor.isActive({ textAlign: 'right' }))}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={buttonStyle(editor.isActive({ textAlign: 'justify' }))}
          title="Justify"
        >
          <AlignJustify size={16} />
        </button>
      </div>

      {/* Heading Controls */}
      <div className="flex gap-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={buttonStyle(editor.isActive('heading', { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={buttonStyle(editor.isActive('heading', { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={buttonStyle(editor.isActive('heading', { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={buttonStyle(editor.isActive('heading', { level: 4 }))}
          title="Heading 4"
        >
          <Heading4 size={16} />
        </button>
      </div>

      {/* List Controls */}
      <div className="flex gap-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonStyle(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonStyle(editor.isActive('orderedList'))}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={buttonStyle(editor.isActive('taskList'))}
          title="Task List"
        >
          <CheckSquare size={16} />
        </button>
      </div>

      {/* Block Controls */}
      <div className="flex gap-1 border-r pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={buttonStyle(editor.isActive('blockquote'))}
          title="Quote"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={buttonStyle(editor.isActive('codeBlock'))}
          title="Code Block"
        >
          <Code2 size={16} />
        </button>
      </div>

      {/* Table Controls */}
      <div className="flex gap-1 border-r pr-2">
        <button
          type="button"
          onClick={addTable}
          className={buttonStyle()}
          title="Insert Table"
        >
          <TableIcon size={16} />
        </button>
        {editor.can().deleteTable() && (
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className={buttonStyle()}
            title="Delete Table"
          >
            <Trash2 size={16} />
          </button>
        )}
        {editor.can().addColumnBefore() && (
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className={buttonStyle()}
            title="Add Column Before"
          >
            <Column size={16} />
          </button>
        )}
        {editor.can().addColumnAfter() && (
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className={buttonStyle()}
            title="Add Column After"
          >
            <ColumnVertical size={16} />
          </button>
        )}
        {editor.can().addRowBefore() && (
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className={buttonStyle()}
            title="Add Row Before"
          >
            <Row size={16} />
          </button>
        )}
        {editor.can().addRowAfter() && (
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className={buttonStyle()}
            title="Add Row After"
          >
            <RowVertical size={16} />
          </button>
        )}
      </div>

      {/* Insert Controls */}
      <div className="flex gap-1">
        <label className={`${buttonStyle()} cursor-pointer`} title="Insert Image">
          <ImageIcon size={16} />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
        <button
          type="button"
          onClick={addYoutubeVideo}
          className={buttonStyle()}
          title="Insert YouTube Video"
        >
          <Youtube size={16} />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Enter URL')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={buttonStyle(editor.isActive('link'))}
          title="Insert Link"
        >
          <LinkIcon size={16} />
        </button>
      </div>

      {/* Undo/Redo Controls */}
      <div className="flex gap-1 border-l pl-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${buttonStyle()} disabled:opacity-50`}
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${buttonStyle()} disabled:opacity-50`}
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>
    </div>
  )
}

export default function RichTextEditor({ content = '', onUpdate }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4]
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-pool hover:text-emerald-pool/80 underline'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-gray-200',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border-b-2 border-gray-300 bg-gray-100 py-3 px-4 text-left font-semibold',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-200 py-2 px-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Underline,
      Superscript,
      Subscript,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'rounded-lg bg-gray-800 text-white p-4 font-mono text-sm my-4',
        }
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate && onUpdate(editor.getHTML())
    },
  })

  // Add this effect to fix content not appearing when editing
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      const currentCursor = editor.view.state.selection
      editor.commands.setContent(content)
      editor.commands.setTextSelection(currentCursor)
    }
  }, [content, editor])

  return (
    <div className="border rounded-lg overflow-hidden" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 50 }}>
        <MenuBar editor={editor} />
      </div>
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <EditorContent 
          editor={editor} 
          style={{ height: '100%' }}
        />
      </div>

      <style jsx global>{`
        .ProseMirror {
          padding: 1rem;
          min-height: 100%;
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }

        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1rem 0;
        }

        .ProseMirror td,
        .ProseMirror th {
          border: 2px solid #ced4da;
          padding: 8px;
          min-width: 100px;
        }

        .ProseMirror th {
          background-color: #f8f9fa;
          font-weight: bold;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #ced4da;
          margin: 1rem 0;
          padding-left: 1rem;
          color: #6c757d;
        }

        .ProseMirror pre {
          background-color: #343a40;
          color: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
        }

        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }

        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: baseline;
        }

        .ProseMirror ul[data-type="taskList"] li > label {
          margin-right: 0.5rem;
          user-select: none;
        }

        .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1;
        }

        .ProseMirror hr {
          border: none;
          border-top: 2px solid #ced4da;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  )
}