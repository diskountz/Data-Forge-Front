// File: components/SocialShare.js
import { useState } from 'react'

export default function SocialShare({ url, title, description }) {
  const [copied, setCopied] = useState(false)

  const shareButtons = [
    {
      name: 'LinkedIn',
      icon: '💼',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      className: 'bg-[#0077B5] hover:bg-[#006297]'
    },
    {
      name: 'Facebook',
      icon: '📘',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      className: 'bg-[#1877F2] hover:bg-[#0C63D4]'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      className: 'bg-[#1DA1F2] hover:bg-[#0C85D0]'
    },
    {
      name: 'Email',
      icon: '📧',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\nRead more at: ${url}`)}`,
      className: 'bg-[#6B46C1] hover:bg-[#553C9A]'
    }
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Share this article</h3>
      <div className="flex flex-wrap gap-3">
        {shareButtons.map((button) => (
          <a
            key={button.name}
            href={button.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${button.className} p-3 rounded-full text-white transition-all duration-200 hover:scale-105 text-lg`}
            title={`Share on ${button.name}`}
          >
            {button.icon}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className={`p-3 rounded-full transition-all duration-200 hover:scale-105 text-lg ${
            copied 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
          }`}
          title="Copy link"
        >
          {copied ? '✓' : '🔗'}
        </button>
      </div>
      {copied && (
        <p className="mt-2 text-sm text-green-600">Link copied to clipboard!</p>
      )}
    </div>
  )
}