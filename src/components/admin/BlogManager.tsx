import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { BlogPost } from '@/types/BlogPost';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const BlogManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

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

    if (editingPost) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleCreate = async () => {
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

    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create a post.',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('blog_posts').insert([
      {
        title,
        content,
        author_id: user.id,
        slug: title.toLowerCase().replace(/\s/g, '-'),
        featured_image_url: imageUrl,
        published: true,
        published_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'Error Saving Post',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success!',
        description: 'Blog post has been published successfully.',
      });
      resetForm();
      fetchPosts();
    }
  };

  const handleUpdate = async () => {
    if (!editingPost) return;

    let imageUrl = editingPost.featured_image_url;
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

    const { error } = await supabase
      .from('blog_posts')
      .update({
        title,
        content,
        featured_image_url: imageUrl,
        slug: title.toLowerCase().replace(/\s/g, '-'),
      })
      .eq('id', editingPost.id);

    if (error) {
      toast({
        title: 'Error Updating Post',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success!',
        description: 'Blog post has been updated successfully.',
      });
      resetForm();
      fetchPosts();
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImage(null);
    setEditingPost(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleDelete = async (postId: string) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', postId);

    if (error) {
      toast({
        title: 'Error Deleting Post',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success!',
        description: 'Blog post has been deleted successfully.',
      });
      fetchPosts();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>{editingPost ? 'Edit Blog Post' : 'Create a New Blog Post'}</CardTitle>
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
            <div className="flex space-x-2">
              <Button type="submit">
                {editingPost ? 'Update Post' : 'Publish Post'}
              </Button>
              {editingPost && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Published Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="flex items-center justify-between">
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {post.title}
                </a>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the blog post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(post.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManager;
