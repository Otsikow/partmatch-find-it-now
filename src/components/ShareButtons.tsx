import React from 'react';
import { Facebook, Twitter, MessageCircle } from 'lucide-react';

const ShareButtons: React.FC = () => {
  const url = window.location.href;
  const text = "Check out this article!";

  return (
    <div className="flex items-center space-x-4">
      <span className="font-bold">Share this post:</span>
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-success hover:text-success/90"
      >
        <MessageCircle size={24} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-700"
      >
        <Facebook size={24} />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-500"
      >
        <Twitter size={24} />
      </a>
    </div>
  );
};

export default ShareButtons;
