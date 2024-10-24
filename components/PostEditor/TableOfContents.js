// File: components/PostEditor/TableOfContents.js
import { useEffect, useState } from 'react'

export default function TableOfContents({ content, className = '' }) {
  const [activeId, setActiveId] = useState('')
  const [toc, setToc] = useState([])

  useEffect(() => {
    // Extract only H2 headings from content
    const doc = new DOMParser().parseFromString(content, 'text/html')
    const headings = Array.from(doc.querySelectorAll('h2'))

    const tocItems = headings.map((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`
      }

      return {
        id: heading.id,
        text: heading.textContent
      }
    })

    setToc(tocItems)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [content])

  if (toc.length === 0) return null

  return (
    <nav 
      className={`${className} sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent`}
      aria-label="Table of contents"
    >
      <div className="pb-4 mb-4 border-b border-gray-200">
        <h4 className="text-lg font-bold text-gray-900">Table of Contents</h4>
        <p className="text-sm text-gray-600 mt-1">Quick navigation</p>
      </div>
      <ul className="space-y-3">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                })
              }}
              className={`
                block py-2 pl-4 border-l-2 text-sm hover:text-emerald-pool transition-all duration-200
                ${activeId === item.id 
                  ? 'border-emerald-pool text-emerald-pool font-medium' 
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }
              `}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}