import React from 'react';

interface AutoInsightsPost {
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
}

interface AutoInsightsCardProps {
  post: AutoInsightsPost;
}

const AutoInsightsCard: React.FC<AutoInsightsCardProps> = ({ post }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img src={post.cover_image_url} alt={post.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-4">{post.excerpt}</p>
        <span className="text-blue-500 hover:underline">Read More →</span>
      </div>
    </div>
  );
};

export default AutoInsightsCard;
