// components/SocialShare.js
import React from 'react';
import { Twitter, Facebook, Linkedin, Link2, Mail } from 'lucide-react';

export default function SocialShare({ url, title, description }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareData = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      hoverColor: '#1a8cd8',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      hoverColor: '#166fe5',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0A66C2',
      hoverColor: '#0a5ab8',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: '#EA4335',
      hoverColor: '#d33a2c',
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // You might want to add a toast notification here
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="share-container">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
      <div className="flex flex-wrap gap-3">
        {shareData.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: item.color,
                color: 'white',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = item.hoverColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = item.color}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </a>
          );
        })}
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors duration-200"
        >
          <Link2 size={20} />
          <span>Copy Link</span>
        </button>
      </div>
    </div>
  );
}