export interface TopicList {
  can_create_topic: boolean;
  draft: boolean;
  draft_key: string;
  draft_sequence: number;
  per_page: number;
  topics: [Topic];
}

export interface Topic {
  id: number;
  title: string;
  fancy_title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  highest_post_number: number;
  image_url: string;
  created_at: string;
  last_posted_at: string;
  bumped: boolean;
  bumped_at: string;
  unseen: boolean;
  pinned: boolean;
  unpinned: boolean;
  excerpt: string;
  visible: boolean;
  closed: boolean;
  archived: boolean;
  bookmarked: any;
  liked: any;
  views: number;
  like_count: number;
  has_summary: boolean;
  archetype: string;
  last_poster_username: string;
  category_id: number;
  pinned_globally: boolean;
  posters: [Poster];
}

interface Poster {
  extras: string;
  description: string;
  user_id: number;
}
