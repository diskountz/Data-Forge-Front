// File: components/RichTextEditor/index.js
import { useEffect, useRef, useState } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { exampleSetup } from 'prosemirror-example-setup'

// Extend the basic schema with lists
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks
})

export default function RichTextEditor({ initialContent = '', onChange }) {
  const editorRef = useRef()
  const viewRef = useRef(null)
  const [editorReady, setEditorReady] = useState(false)

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return

    // Create a document from the initial HTML content
    const contentElement = document.createElement('div')
    contentElement.innerHTML = initialContent

    const state = EditorState.create({
      doc: DOMParser.fromSchema(mySchema).parse(contentElement),
      plugins: exampleSetup({ schema: mySchema })
    })

    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction)
        view.updateState(newState)

        if (onChange) {
          // Convert the document to HTML and send it to the parent
          const fragment = DOMSerializer
            .fromSchema(mySchema)
            .serializeFragment(newState.doc.content)

          const tempDiv = document.createElement('div')
          tempDiv.appendChild(fragment)
          onChange(tempDiv.innerHTML)
        }
      }
    })

    viewRef.current = view
    setEditorReady(true)

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy()
      }
    }
  }, [initialContent])

  return (
    <div className="rich-text-editor">
      <div className="border rounded-md p-4 min-h-[200px]" ref={editorRef} />
      <style jsx global>{`
        .ProseMirror {
          position: relative;
          word-wrap: break-word;
          white-space: pre-wrap;
          -webkit-font-variant-ligatures: none;
          font-variant-ligatures: none;
          min-height: 200px;
          outline: none;
        }

        .ProseMirror p {
          margin-bottom: 1em;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }

        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }

        .ProseMirror ul, .ProseMirror ol {
          padding-left: 30px;
          margin-bottom: 1em;
        }

        .ProseMirror li {
          margin-bottom: 0.5em;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #ddd;
          margin-left: 0;
          margin-right: 0;
          padding-left: 1em;
          color: #666;
        }

        .ProseMirror pre {
          background-color: #f5f5f5;
          padding: 0.5em;
          border-radius: 3px;
          margin-bottom: 1em;
        }

        .ProseMirror code {
          background-color: #f5f5f5;
          padding: 0.2em 0.4em;
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}

// File: components/RichTextEditor/Toolbar.js
import { useState } from 'react'

export default function Toolbar({ editor }) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const buttons = [
    {
      icon: 'B',
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: 'I',
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: 'H1',
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: 'H2',
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: '•',
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: '1.',
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: '"',
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: '🔗',
      title: 'Link',
      action: () => setShowLinkInput(true),
    },
  ]

  const handleLinkSubmit = (e) => {
    e.preventDefault()
    editor.chain().focus().setLink({ href: linkUrl }).run()
    setShowLinkInput(false)
    setLinkUrl('')
  }

  return (
    <div className="border-b p-2 flex items-center space-x-2">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.action}
          className="p-2 hover:bg-gray-100 rounded"
          title={button.title}
        >
          {button.icon}
        </button>
      ))}

      {showLinkInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleLinkSubmit} className="bg-white p-4 rounded-lg">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="border p-2 rounded"
            />
            <div className="mt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowLinkInput(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-pool text-white rounded hover:bg-opacity-90"
              >
                Add Link
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}