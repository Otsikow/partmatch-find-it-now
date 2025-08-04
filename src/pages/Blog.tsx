import React from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '@/components/BlogCard';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Blog: React.FC = () => {
  const { posts, loading, error } = useBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-bold">Auto Insights</h1>
      </div>
      {loading && (
        <div className="flex justify-center py-8">
          <div className="text-lg">Loading blog posts...</div>
        </div>
      )}
      {error && (
        <div className="flex justify-center py-8">
          <div className="text-lg text-red-600">Error loading blog posts. Please try again later.</div>
        </div>
      )}
      {!loading && !error && posts.length === 0 && (
        <div className="flex justify-center py-8">
          <div className="text-lg text-muted-foreground">No blog posts available yet.</div>
        </div>
      )}
      {!loading && !error && posts.length > 0 && (
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
