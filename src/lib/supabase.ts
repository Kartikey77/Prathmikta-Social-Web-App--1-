import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Post {
  id: string;
  title: string;
  content: string;
  images?: string[];
  upvotes: number;
  comments: number;
  is_upvoted?: boolean;
  status: 'pending' | 'working' | 'solved';
  username: string;
  municipality: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  content: string;
  username: string;
  created_at: string;
}

export interface Upvote {
  id: string;
  post_id: string;
  username: string;
  created_at: string;
}

// Database Operations
export class DatabaseService {
  // Posts
  static async getPosts(municipality: string): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          comments:comments(count),
          upvotes:upvotes(count)
        `)
        .eq('municipality', municipality)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return [];
      }

      return data?.map(post => ({
        ...post,
        comments: post.comments?.[0]?.count || 0,
        upvotes: post.upvotes?.[0]?.count || 0,
      })) || [];
    } catch (error) {
      console.error('Error in getPosts:', error);
      return [];
    }
  }

  static async createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'comments'>): Promise<Post | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...post,
          upvotes: 0,
          comments: 0
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createPost:', error);
      return null;
    }
  }

  static async updatePostStatus(postId: string, status: Post['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);

      return !error;
    } catch (error) {
      console.error('Error updating post status:', error);
      return false;
    }
  }

  // Comments
  static async getComments(postId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getComments:', error);
      return [];
    }
  }

  static async createComment(comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment | null> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([comment])
        .select()
        .single();

      if (error) {
        console.error('Error creating comment:', error);
        return null;
      }

      // Update comment count
      await supabase.rpc('increment_comment_count', { post_id: comment.post_id });

      return data;
    } catch (error) {
      console.error('Error in createComment:', error);
      return null;
    }
  }

  // Upvotes
  static async toggleUpvote(postId: string, username: string): Promise<boolean> {
    try {
      // Check if already upvoted
      const { data: existing, error: checkError } = await supabase
        .from('upvotes')
        .select('id')
        .eq('post_id', postId)
        .eq('username', username)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking upvote:', checkError);
        return false;
      }

      if (existing) {
        // Remove upvote
        const { error: deleteError } = await supabase
          .from('upvotes')
          .delete()
          .eq('id', existing.id);

        if (!deleteError) {
          await supabase.rpc('decrement_upvote_count', { post_id: postId });
        }

        return !deleteError;
      } else {
        // Add upvote
        const { error: insertError } = await supabase
          .from('upvotes')
          .insert([{ post_id: postId, username }]);

        if (!insertError) {
          await supabase.rpc('increment_upvote_count', { post_id: postId });
        }

        return !insertError;
      }
    } catch (error) {
      console.error('Error in toggleUpvote:', error);
      return false;
    }
  }

  static async isPostUpvoted(postId: string, username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('upvotes')
        .select('id')
        .eq('post_id', postId)
        .eq('username', username)
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }
}

// SQL Functions for Supabase (Run these in your Supabase SQL editor)
/*
-- Create tables
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  upvotes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'working', 'solved')),
  username TEXT NOT NULL,
  municipality TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS upvotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, username)
);

-- Functions to increment/decrement counts
CREATE OR REPLACE FUNCTION increment_comment_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts SET comments = comments + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_upvote_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts SET upvotes = upvotes + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_upvote_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

-- Policies (Allow all operations for now - customize based on your auth needs)
CREATE POLICY "Enable all operations for posts" ON posts FOR ALL USING (true);
CREATE POLICY "Enable all operations for comments" ON comments FOR ALL USING (true);
CREATE POLICY "Enable all operations for upvotes" ON upvotes FOR ALL USING (true);
*/