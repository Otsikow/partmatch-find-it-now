import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { BlogPost } from '@/types/BlogPost';

const BlogManager = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = '';
    if (image) {
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(`public/${uuidv4()}`, image);

      if (error) {
        console.error('Error uploading image:', error);
        return;
      }
      const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(data.path);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from('blog_posts').insert([
      {
        title,
        content,
        author_id: author, // This should be a user ID in production
        slug: title.toLowerCase().replace(/\s/g, '-'),
        featured_image_url: imageUrl,
        published: true,
      },
    ]);

    if (error) {
      console.error('Error saving blog post:', error);
    } else {
      alert('Blog post submitted!');
      setTitle('');
      setContent('');
      setAuthor('');
      setImage(null);
      fetchPosts();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Author
              </label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author's name"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post here..."
                required
                rows={10}
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <Button type="submit">
              Publish Post
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Published Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {posts.map((post) => (
              <li key={post.id} className="mb-2">
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {post.title}
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManager;
