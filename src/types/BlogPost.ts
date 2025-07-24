export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  author_id: string;
  featured_image_url?: string;
  published: boolean;
  published_at?: string;
  scheduled_publish_at?: string;
  tags: string[];
  category?: string;
  view_count?: number;
  created_at: string;
  updated_at: string;
}
