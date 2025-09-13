// Data management utilities for Prathmikta app
// Using localStorage for data persistence

export interface Post {
  id: string;
  username: string;
  title: string;
  content: string;
  images?: string[];
  upvotes: number;
  comments: number;
  isUpvoted: boolean;
  status?: "pending" | "working" | "solved";
  createdAt: string;
  lastUpdated: string;
  municipality?: string;
}

export interface Comment {
  id: string;
  postId: string;
  username: string;
  content: string;
  timestamp: string;
  createdAt: string;
}

// Posts management
export const getPosts = (): Post[] => {
  try {
    const stored = localStorage.getItem('prathmikta_posts');
    if (stored) {
      return JSON.parse(stored);
    }
    // Return default posts if none exist
    const defaultPosts: Post[] = [
      {
        id: "1",
        username: "नागरिक",
        title: "सड़क पर बड़े गड्ढे - Road with Large Potholes",
        content: "मुख्य सड़क पर कई बड़े गड्ढे हैं जो यातायात में बाधा डाल रहे हैं। बारिश के दिनों में यह और भी खतरनाक हो जाता है। कृपया जल्द से जल्द इसकी मरम्मत करवाएं। / There are several large potholes on the main road causing traffic disruption. It becomes even more dangerous during rainy days. Please get this repaired as soon as possible.",
        images: [],
        upvotes: 12,
        comments: 3,
        isUpvoted: false,
        status: "pending",
        createdAt: "2 दिन पहले",
        lastUpdated: "2 दिन पहले",
        municipality: "दिल्ली नगर निगम"
      },
      {
        id: "2", 
        username: "नागरिक",
        title: "स्ट्रीट लाइट की समस्या - Street Light Issue",
        content: "हमारी गली में स्ट्रीट लाइट पिछले एक हफ्ते से बंद है। रात में चलना मुश्किल हो गया है और सुरक्षा की चिंता है। / The street light in our lane has been off for the past week. It has become difficult to walk at night and there are security concerns.",
        images: [],
        upvotes: 8,
        comments: 2,
        isUpvoted: true,
        status: "working",
        createdAt: "1 दिन पहले",
        lastUpdated: "6 घंटे पहले",
        municipality: "दिल्ली नगर निगम"
      },
      {
        id: "3",
        username: "नागरिक", 
        title: "पानी की आपूर्ति में समस्या - Water Supply Problem",
        content: "पिछले 3 दिनों से हमारे इलाके में पानी की आपूर्ति नहीं हो रही है। निवासी परेशान हैं। कृपया तुरंत कार्रवाई करें। / There has been no water supply in our area for the past 3 days. Residents are troubled. Please take immediate action.",
        images: [],
        upvotes: 15,
        comments: 5,
        isUpvoted: false,
        status: "pending",
        createdAt: "12 घंटे पहले",
        lastUpdated: "12 घंटे पहले",
        municipality: "दिल्ली नगर निगम"
      }
    ];
    savePosts(defaultPosts);
    return defaultPosts;
  } catch {
    return [];
  }
};

export const savePosts = (posts: Post[]): void => {
  try {
    localStorage.setItem('prathmikta_posts', JSON.stringify(posts));
  } catch {
    // Handle storage error silently
  }
};

export const addPost = (post: Omit<Post, 'id' | 'createdAt' | 'lastUpdated'>): Post => {
  const newPost: Post = {
    ...post,
    id: Date.now().toString(),
    createdAt: "अभी",
    lastUpdated: "अभी"
  };
  
  const posts = getPosts();
  const updatedPosts = [newPost, ...posts];
  savePosts(updatedPosts);
  return newPost;
};

export const updatePostUpvotes = (postId: string): Post[] => {
  const posts = getPosts();
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      return {
        ...post,
        isUpvoted: !post.isUpvoted,
        upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes + 1
      };
    }
    return post;
  });
  savePosts(updatedPosts);
  return updatedPosts;
};

export const updatePostStatus = (postId: string, status: Post['status']): Post[] => {
  const posts = getPosts();
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      return {
        ...post,
        status,
        lastUpdated: "अभी"
      };
    }
    return post;
  });
  savePosts(updatedPosts);
  return updatedPosts;
};

// Comments management
export const getComments = (postId: string): Comment[] => {
  try {
    const stored = localStorage.getItem(`prathmikta_comments_${postId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveComments = (postId: string, comments: Comment[]): void => {
  try {
    localStorage.setItem(`prathmikta_comments_${postId}`, JSON.stringify(comments));
  } catch {
    // Handle storage error silently
  }
};

export const addComment = (postId: string, content: string): Comment => {
  const newComment: Comment = {
    id: Date.now().toString(),
    postId,
    username: "नागरिक",
    content,
    timestamp: "अभी",
    createdAt: new Date().toISOString()
  };
  
  const comments = getComments(postId);
  const updatedComments = [...comments, newComment];
  saveComments(postId, updatedComments);
  
  // Update comment count in posts
  const posts = getPosts();
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      return {
        ...post,
        comments: updatedComments.length
      };
    }
    return post;
  });
  savePosts(updatedPosts);
  
  return newComment;
};

// User preferences
export const getUserMunicipality = (): string | null => {
  try {
    return localStorage.getItem('prathmikta_municipality');
  } catch {
    return null;
  }
};

export const setUserMunicipality = (municipality: string): void => {
  try {
    localStorage.setItem('prathmikta_municipality', municipality);
  } catch {
    // Handle storage error silently
  }
};

export const getUserLanguage = (): string => {
  try {
    return localStorage.getItem('prathmikta_language') || 'hi';
  } catch {
    return 'hi';
  }
};

export const setUserLanguage = (language: string): void => {
  try {
    localStorage.setItem('prathmikta_language', language);
  } catch {
    // Handle storage error silently
  }
};