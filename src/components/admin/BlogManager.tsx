import { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      setTitle('');
      setContent('');
      setImage(null);
      setIsScheduled(false);
      setScheduledDate('');
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
            
            <Button type="submit">
              {isScheduled ? 'Schedule Post' : 'Publish Post'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Published Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">
                    {post.title}
                  </a>
                  <div className="text-sm text-gray-500 mt-1">
                    {post.published ? (
                      <span className="text-green-600">Published {new Date(post.published_at!).toLocaleDateString()}</span>
                    ) : post.scheduled_publish_at ? (
                      <span className="text-orange-600">Scheduled for {new Date(post.scheduled_publish_at).toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-600">Draft</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManager;
