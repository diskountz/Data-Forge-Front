import { useState, useEffect } from 'react';

const ReadingProgress = () => {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      const content = document.querySelector('article');
      if (!content) return;

      const contentBox = content.getBoundingClientRect();
      const contentTop = contentBox.top + window.scrollY;
      const contentHeight = contentBox.height;
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      // Calculate how much of the article is scrolled
      if (scrollPosition < contentTop) {
        setReadingProgress(0);
      } else if (scrollPosition > contentTop + contentHeight - windowHeight) {
        setReadingProgress(100);
      } else {
        const progress = ((scrollPosition - contentTop) / (contentHeight - windowHeight)) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', updateReadingProgress);
    updateReadingProgress();

    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 h-1 bg-gray-100">
      <div 
        className="h-full bg-emerald-pool transition-all duration-200 ease-out"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
};

export default ReadingProgress;