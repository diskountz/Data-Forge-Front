// components/SocialShare.js
import { Twitter, Facebook, Linkedin } from 'lucide-react';

export default function SocialShare({ url, title }) {
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };

  return (
    <div className="flex items-center gap-4">
      <a 
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-emerald-pool transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter size={20} />
      </a>
      <a 
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-emerald-pool transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook size={20} />
      </a>
      <a 
        href={shareUrls.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-emerald-pool transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={20} />
      </a>
    </div>
  );
}