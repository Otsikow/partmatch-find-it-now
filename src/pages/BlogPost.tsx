import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ShareButtons from '@/components/ShareButtons';
import { useBlogPost } from '@/hooks/useBlogPost';
import '@/styles/blog.css';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPost(slug);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !post) {
    return <div>Error fetching post.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Home
      </Link>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 mb-4">
        <span>Published on {post.published_at}</span>
        <span className="mx-2">&bull;</span>
        <span>Tags: {post.tags.join(', ')}</span>
      </div>
      {post.featured_image_url && <img src={post.featured_image_url} alt={post.title} className="w-full h-auto object-cover rounded-lg mb-8" />}
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="mt-8">
        <ShareButtons />
      </div>
    </div>
  );
};

export default BlogPost;
