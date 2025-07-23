import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '@/components/BlogCard';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/BlogPost';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Auto Insights</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`}>
            <BlogCard post={post} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
