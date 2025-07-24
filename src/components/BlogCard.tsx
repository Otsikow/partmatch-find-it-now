import React from 'react';
fix/admin-home-button

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
}
import { BlogPost } from '@/types/BlogPost';
main

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
 fix/admin-home-button
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img src={post.cover_image_url} alt={post.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-4">{post.excerpt}</p>
        <span className="text-blue-500 hover:underline">Read More →</span>
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
        main
      </div>
    </div>
  );
};

export default BlogCard;
