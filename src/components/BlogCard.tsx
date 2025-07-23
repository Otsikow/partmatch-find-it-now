import React from 'react';
import { BlogPost } from '@/types/BlogPost';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <img
        src={post.featured_image_url || '/placeholder.svg'}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-700 mb-4">{post.excerpt}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
