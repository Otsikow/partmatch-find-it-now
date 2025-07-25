import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

serve(async (_req) => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL or Anon Key not provided');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const now = new Date().toISOString();

    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('published', false)
      .lte('scheduled_publish_at', now);

    if (error) {
      throw error;
    }

    if (posts && posts.length > 0) {
      for (const post of posts) {
        await supabase
          .from('blog_posts')
          .update({ published: true, published_at: now })
          .eq('id', post.id);
      }
      return new Response(JSON.stringify({ message: `${posts.length} posts published.` }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'No posts to publish.' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
