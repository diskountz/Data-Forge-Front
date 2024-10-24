// File: components/PostEditor/TableOfContents.js
import { useEffect, useState } from 'react'

export default function TableOfContents({ content }) {
  const [activeId, setActiveId] = useState('')
  const [headings, setHeadings] = useState([])

  useEffect(() => {
    if (!content) return

    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headingElements = doc.querySelectorAll('h2')

    const extractedHeadings = Array.from(headingElements).map((heading, index) => {
      const id = heading.id || `heading-${index}`
      return {
        id,
        text: heading.textContent.trim()
      }
    })

    setHeadings(extractedHeadings)

    // Add IDs to actual document headings if they don't exist
    document.querySelectorAll('h2').forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`
      }
    })
  }, [content])

  useEffect(() => {
    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-20% 0% -35% 0%',
      threshold: 0
    })

    document.querySelectorAll('h2[id]').forEach((element) => {
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id) => {
    const element = document.getElementById(id)
    if (!element) return

    const header = document.querySelector('header')
    const headerOffset = header ? header.offsetHeight : 0
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - headerOffset - 24

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  if (headings.length === 0) return null

  return (
    <nav 
      className="sticky top-24 w-full bg-white rounded-lg p-6 shadow-sm"
      aria-label="Table of contents"
    >
      <div className="border-b border-gray-200 pb-4">
        <h4 className="text-lg font-bold text-[#6B46C1]">In this article</h4>
      </div>
      <div className="mt-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 -mr-2 scroll-smooth">
        <ul className="space-y-3">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`
                  group block w-full text-left py-2 pl-4 border-l-2 text-sm transition-all duration-200
                  ${activeId === heading.id 
                    ? 'border-[#6B46C1] text-[#6B46C1] font-medium' 
                    : 'border-gray-200 text-gray-600 hover:text-[#6B46C1] hover:border-[#6B46C1]'
                  }
                `}
              >
                {heading.text}
                <span 
                  className={`
                    ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    ${activeId === heading.id ? 'opacity-100' : ''}
                  `}
                >
                  →
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}