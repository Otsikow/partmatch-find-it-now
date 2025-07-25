import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/BlogPost';

export const useBlogPost = (slug: string | undefined) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          throw error;
        }

        setPost(data as BlogPost);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
};
