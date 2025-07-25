import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BlogCard from '@/components/BlogCard';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Blog: React.FC = () => {
  const { posts, loading, error } = useBlogPosts();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold">Auto Insights</h1>
        </div>
        <Link to="/blog/create">
          <Button>Create Post</Button>
        </Link>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>Error fetching posts.</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`}>
              <BlogCard post={post} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
