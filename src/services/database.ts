import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema interfaces
export interface Post {
  id: string;
  title: string;
  content: string;
  username: string;
  user_id: string;
  municipality: string;
  images?: string[];
  upvotes: number;
  comments_count: number;
  status: 'pending' | 'working' | 'solved';
  created_at: string;
  updated_at: string;
  category?: string;
  location?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  aadhaar_number: string;
  user_type: 'citizen' | 'officer';
  municipality: string;
  created_at: string;
}

// Post-related database operations
export const postService = {
  // Create a new post
  async createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'comments_count'>) {
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        ...postData,
        upvotes: 0,
        comments_count: 0,
        status: 'pending'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all posts for a municipality
  async getPostsByMunicipality(municipality: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('municipality', municipality)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get posts by user
  async getPostsByUser(userId: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Update post status
  async updatePostStatus(postId: string, status: 'pending' | 'working' | 'solved') {
    const { data, error } = await supabase
      .from('posts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', postId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Upvote a post
  async upvotePost(postId: string, userId: string) {
    // First check if user already upvoted
    const { data: existingUpvote } = await supabase
      .from('post_upvotes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingUpvote) {
      // Remove upvote
      await supabase
        .from('post_upvotes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      // Decrease upvote count
      const { data, error } = await supabase
        .from('posts')
        .update({ upvotes: supabase.sql`upvotes - 1` })
        .eq('id', postId)
        .select()
        .single();
      
      if (error) throw error;
      return { ...data, isUpvoted: false };
    } else {
      // Add upvote
      await supabase
        .from('post_upvotes')
        .insert([{ post_id: postId, user_id: userId }]);
      
      // Increase upvote count
      const { data, error } = await supabase
        .from('posts')
        .update({ upvotes: supabase.sql`upvotes + 1` })
        .eq('id', postId)
        .select()
        .single();
      
      if (error) throw error;
      return { ...data, isUpvoted: true };
    }
  },

  // Check if user upvoted a post
  async checkUserUpvote(postId: string, userId: string) {
    const { data } = await supabase
      .from('post_upvotes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
    
    return !!data;
  }
};

// Comment-related database operations
export const commentService = {
  // Create a new comment
  async createComment(commentData: Omit<Comment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select()
      .single();
    
    if (error) throw error;

    // Update comments count on the post
    await supabase
      .from('posts')
      .update({ comments_count: supabase.sql`comments_count + 1` })
      .eq('id', commentData.post_id);
    
    return data;
  },

  // Get comments for a post
  async getCommentsByPost(postId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Delete a comment
  async deleteComment(commentId: string, postId: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    
    if (error) throw error;

    // Update comments count on the post
    await supabase
      .from('posts')
      .update({ comments_count: supabase.sql`comments_count - 1` })
      .eq('id', postId);
  }
};

// User-related database operations
export const userService = {
  // Create or get user profile
  async createOrGetUser(aadhaarNumber: string, userType: 'citizen' | 'officer', municipality: string) {
    // First try to get existing user
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('aadhaar_number', aadhaarNumber)
      .single();

    if (existingUser) {
      return existingUser;
    }

    // Create new user if doesn't exist
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        aadhaar_number: aadhaarNumber,
        user_type: userType,
        municipality: municipality
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user by ID
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Image upload service
export const imageService = {
  // Upload image to Supabase storage
  async uploadImage(file: File, bucket: string = 'post-images') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  },

  // Delete image from storage
  async deleteImage(fileName: string, bucket: string = 'post-images') {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);
    
    if (error) throw error;
  }
};