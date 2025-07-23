export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  author: string;
  cover_image_url: string;
  published_at: string;
  tags: string[];
}
