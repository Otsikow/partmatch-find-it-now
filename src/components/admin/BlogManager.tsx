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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);
  const [excerpt, setExcerpt] = useState('');

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

  const handleFormatWithAI = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Missing Content',
        description: 'Please enter both title and content before formatting.',
        variant: 'destructive',
      });
      return;
    }

    setIsFormatting(true);
    try {
      const response = await fetch('https://ytgmzhevgcmvevuwkocz.supabase.co/functions/v1/blog-formatter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to format content');
      }

      const result = await response.json();

      if (result.formattedContent) {
        setContent(result.formattedContent);
        if (result.excerpt) {
          setExcerpt(result.excerpt);
        }
        toast({
          title: 'Content Formatted!',
          description: 'Your blog post has been professionally formatted.',
        });
        if (result.suggestions && result.suggestions.length > 0) {
          console.log('AI Suggestions:', result.suggestions);
        }
      }
    } catch (error) {
      console.error('Error formatting content:', error);
      toast({
        title: 'Formatting Failed',
        description: 'Failed to format content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsFormatting(false);
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

    const currentTime = new Date().toISOString();
    const scheduledTime = isScheduled && scheduledDate ? new Date(scheduledDate).toISOString() : null;
    const shouldPublishNow = !isScheduled || (scheduledTime && new Date(scheduledTime) <= new Date());

    const { error } = await supabase.from('blog_posts').insert([
      {
        title,
        content,
        author_id: user.id,
        slug: title.toLowerCase().replace(/\s/g, '-'),
        featured_image_url: imageUrl,
        excerpt: excerpt || content.substring(0, 160) + '...',
        published: shouldPublishNow,
        published_at: shouldPublishNow ? currentTime : null,
        scheduled_publish_at: scheduledTime,
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
      const successMessage = isScheduled && scheduledTime && new Date(scheduledTime) > new Date()
        ? 'Blog post has been scheduled successfully.'
        : 'Blog post has been published successfully.';
      toast({
        title: 'Success!',
        description: successMessage,
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
    setExcerpt(post.excerpt || '');
    setIsScheduled(!!post.scheduled_publish_at && !post.published);
    setScheduledDate(post.scheduled_publish_at ? post.scheduled_publish_at.slice(0, 16) : '');
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setExcerpt('');
    setImage(null);
    setIsScheduled(false);
    setScheduledDate('');
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
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Content
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleFormatWithAI}
                  disabled={isFormatting || !title.trim() || !content.trim()}
                >
                  {isFormatting ? 'Formatting...' : '✨ Format with AI'}
                </Button>
              </div>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post content here... The AI formatter will help organize and style it professionally."
                required
                rows={12}
              />
            </div>
            {excerpt && (
              <div>
                <Label htmlFor="excerpt" className="text-sm font-medium">
                  Meta Excerpt (SEO)
                </Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description for search engines (max 160 characters)"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">{excerpt.length}/160 characters</p>
              </div>
            )}
            <div>
              <Label htmlFor="image" className="text-sm font-medium">
                Featured Image
              </Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="schedule-mode"
                checked={isScheduled}
                onCheckedChange={setIsScheduled}
              />
              <Label htmlFor="schedule-mode">Schedule for later</Label>
            </div>
            {isScheduled && (
              <div>
                <Label htmlFor="scheduled-date" className="text-sm font-medium">
                  Publish Date & Time
                </Label>
                <Input
                  id="scheduled-date"
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  required={isScheduled}
                />
              </div>
            )}
            <div className="flex space-x-2">
              <Button type="submit">
                {editingPost ? (isScheduled ? 'Update & Schedule' : 'Update Post') : (isScheduled ? 'Schedule Post' : 'Publish Post')}
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
                <div>
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">
                    {post.title}
                  </a>
                  <div className="text-sm text-gray-500 mt-1">
                    {post.published ? (
                      <span className="text-green-600">Published {post.published_at && new Date(post.published_at).toLocaleDateString()}</span>
                    ) : post.scheduled_publish_at ? (
                      <span className="text-orange-600">Scheduled for {new Date(post.scheduled_publish_at).toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-600">Draft</span>
                    )}
                  </div>
                </div>
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
