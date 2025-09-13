// Supabase-based data management for Prathmikta app
// Using KV store approach for flexible data storage

import { projectId, publicAnonKey } from '../utils/supabase/info';

// Server endpoint for database operations
const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/server`;

// Interface definitions matching the existing localStorage system
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
  department?: string;
  urgency?: "low" | "medium" | "high";
  estimatedCost?: number;
  location?: string;
  assignedTo?: string;
  isFunded?: boolean;
  fundingAmount?: number;
}

export interface Comment {
  id: string;
  postId: string;
  username: string;
  content: string;
  timestamp: string;
  createdAt: string;
}

// Utility function for API calls with demo mode fallback
async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    // Add a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // In demo mode, API calls will fail - silently fall back to localStorage
    if (error instanceof Error && (
      error.name === 'AbortError' || 
      error.message.includes('Failed to fetch') ||
      error.message.includes('TypeError')
    )) {
      // This is expected in demo mode - don't log as error
      console.log(`📱 Demo mode: Using localStorage fallback for ${endpoint}`);
    } else {
      console.error(`API call failed for ${endpoint}:`, error);
    }
    // Always fall back to localStorage in demo environment
    throw error;
  }
}

// Posts management
export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await apiCall('/make-server-c3689432/posts');
    return response.posts || [];
  } catch (error) {
    // Silently fallback to localStorage in demo mode
    return getPostsFromLocalStorage();
  }
};

export const addPost = async (post: Omit<Post, 'id' | 'createdAt' | 'lastUpdated'>): Promise<Post> => {
  const newPost: Post = {
    ...post,
    id: Date.now().toString(),
    createdAt: 'Now',
    lastUpdated: 'Now'
  };
  
  try {
    const response = await apiCall('/make-server-c3689432/posts', {
      method: 'POST',
      body: JSON.stringify({ post: newPost }),
    });
    return response.post || newPost;
  } catch (error) {
    // Silently fallback to localStorage in demo mode
    const posts = getPostsFromLocalStorage();
    const updatedPosts = [newPost, ...posts];
    savePostsToLocalStorage(updatedPosts);
    return newPost;
  }
};

export const updatePostUpvotes = async (postId: string): Promise<Post[]> => {
  try {
    const response = await apiCall('/make-server-c3689432/posts/upvote', {
      method: 'POST',
      body: JSON.stringify({ postId }),
    });
    return response.posts || [];
  } catch (error) {
    // Silently fallback to localStorage in demo mode
    return updatePostUpvotesLocalStorage(postId);
  }
};

export const updatePostStatus = async (postId: string, status: Post['status']): Promise<Post[]> => {
  try {
    const response = await apiCall('/make-server-c3689432/posts/status', {
      method: 'POST',
      body: JSON.stringify({ postId, status }),
    });
    return response.posts || [];
  } catch (error) {
    // Silently fallback to localStorage in demo mode
    return updatePostStatusLocalStorage(postId, status);
  }
};

// Comments management
export const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await apiCall(`/make-server-c3689432/comments/${postId}`);
    return response.comments || [];
  } catch (error) {
    // Silently fallback to localStorage in demo mode
    return getCommentsFromLocalStorage(postId);
  }
};

export const addComment = async (postId: string, content: string): Promise<Comment> => {
  const newComment: Comment = {
    id: Date.now().toString(),
    postId,
    username: 'Citizen',
    content,
    timestamp: 'Now',
    createdAt: new Date().toISOString()
  };
  
  try {
    const response = await apiCall('/make-server-c3689432/comments', {
      method: 'POST',
      body: JSON.stringify({ comment: newComment }),
    });
    return response.comment || newComment;
  } catch (error) {
    // Silently fallback to localStorage in demo mode
    const comments = getCommentsFromLocalStorage(postId);
    const updatedComments = [...comments, newComment];
    saveCommentsToLocalStorage(postId, updatedComments);
    
    // Update comment count in posts
    const posts = getPostsFromLocalStorage();
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: updatedComments.length
        };
      }
      return post;
    });
    savePostsToLocalStorage(updatedPosts);
    
    return newComment;
  }
};

// User preferences
export const getUserMunicipality = async (): Promise<string | null> => {
  try {
    const response = await apiCall('/make-server-c3689432/user/municipality');
    return response.municipality;
  } catch (error) {
    // Silently fallback to localStorage in demo mode
    return getUserMunicipalityFromLocalStorage();
  }
};

export const setUserMunicipality = async (municipality: string): Promise<void> => {
  try {
    await apiCall('/make-server-c3689432/user/municipality', {
      method: 'POST',
      body: JSON.stringify({ municipality }),
    });
  } catch (error) {
    // Silently fallback to localStorage in demo mode
    setUserMunicipalityInLocalStorage(municipality);
  }
};

export const getUserLanguage = async (): Promise<string> => {
  try {
    const response = await apiCall('/make-server-c3689432/user/language');
    return response.language || 'hi';
  } catch (error) {
    // Silently fallback to localStorage in demo mode
    return getUserLanguageFromLocalStorage();
  }
};

export const setUserLanguage = async (language: string): Promise<void> => {
  try {
    await apiCall('/make-server-c3689432/user/language', {
      method: 'POST',
      body: JSON.stringify({ language }),
    });
  } catch (error) {
    // Silently fallback to localStorage in demo mode
    setUserLanguageInLocalStorage(language);
  }
};

// localStorage fallback functions
function getPostsFromLocalStorage(): Post[] {
  try {
    const stored = localStorage.getItem('prathmikta_posts');
    if (stored) {
      return JSON.parse(stored);
    }
    // Return default posts showcasing Prathmikta 2.0 features with comprehensive metadata
    const defaultPosts: Post[] = [
      {
        id: "1",
        username: "Priya Sharma",
        title: "🚰 Water Pipeline Burst - Community Fix Needed",
        content: "Major water pipeline burst near Central Park affecting 50+ households. Water shortage since morning. Local plumber volunteers ready to assist with temporary repairs while waiting for municipal team.",
        images: [],
        upvotes: 23,
        comments: 8,
        isUpvoted: false,
        status: "working",
        createdAt: "2 hours ago",
        lastUpdated: "30 mins ago",
        municipality: "Delhi Municipal Corporation",
        department: "Water Supply",
        urgency: "high",
        estimatedCost: 25000,
        location: "Central Park, Connaught Place",
        assignedTo: "Volunteer Team Alpha"
      },
      {
        id: "2", 
        username: "Tech Solutions NGO",
        title: "🔌 Smart Street Light Installation Project",
        content: "Proposing energy-efficient LED smart street lights in Sector 15. IoT-enabled with automatic brightness control and fault detection. Corporate sponsor interested in funding this sustainability initiative.",
        images: [],
        upvotes: 34,
        comments: 12,
        isUpvoted: true,
        status: "pending",
        createdAt: "1 day ago",
        lastUpdated: "4 hours ago",
        municipality: "Delhi Municipal Corporation",
        department: "Electricity",
        urgency: "medium",
        estimatedCost: 125000,
        location: "Sector 15, Rohini",
        isFunded: true,
        fundingAmount: 75000
      },
      {
        id: "3",
        username: "Community Reporter",
        title: "🛣️ Main Road Pothole Repair - COMPLETED",
        content: "✅ Successfully completed! Major pothole problem on Main Market Road resolved through business sponsorship. Thanks to GreenTech Corp for funding the ₹50,000 repair work. Road now smooth and safe for all vehicles.",
        images: [],
        upvotes: 56,
        comments: 18,
        isUpvoted: false,
        status: "solved",
        createdAt: "5 days ago",
        lastUpdated: "2 days ago",
        municipality: "Delhi Municipal Corporation",
        department: "Roads & Transportation",
        urgency: "medium",
        estimatedCost: 50000,
        location: "Main Market Road, Lajpat Nagar",
        isFunded: true,
        fundingAmount: 50000
      },
      {
        id: "4",
        username: "EcoWarriors Delhi",
        title: "🌱 Community Park Cleanup & Tree Plantation",
        content: "Weekend cleanup drive at Nehru Park. 15 volunteers already registered! Activities: trash removal, tree planting, flower bed maintenance. Bring your own gloves and water. Light refreshments provided.",
        images: [],
        upvotes: 41,
        comments: 9,
        isUpvoted: true,
        status: "working",
        createdAt: "8 hours ago",
        lastUpdated: "2 hours ago",
        municipality: "Delhi Municipal Corporation",
        department: "Environment & Parks",
        urgency: "low",
        estimatedCost: 8000,
        location: "Nehru Park, CP",
        assignedTo: "EcoWarriors Volunteer Team"
      },
      {
        id: "5",
        username: "Dr. Emergency",
        title: "🏥 Critical: Hospital Access Road Blocked",
        content: "URGENT! Main access road to City Hospital blocked by fallen tree and construction debris. Ambulances being diverted. Immediate municipal intervention required. Lives at risk!",
        images: [],
        upvotes: 89,
        comments: 25,
        isUpvoted: false,
        status: "working",
        createdAt: "45 mins ago",
        lastUpdated: "10 mins ago",
        municipality: "Delhi Municipal Corporation",
        department: "Emergency Services",
        urgency: "high",
        estimatedCost: 15000,
        location: "Hospital Road, AIIMS Junction",
        assignedTo: "Municipal Emergency Team"
      },
      {
        id: "6",
        username: "Student Volunteer",
        title: "📚 Digital Literacy Center Setup",
        content: "Setting up free computer training center for senior citizens in community hall. Need laptops, internet connection, and volunteer teachers. Corporate CSR funding opportunity available.",
        images: [],
        upvotes: 28,
        comments: 7,
        isUpvoted: true,
        status: "pending",
        createdAt: "3 days ago",
        lastUpdated: "1 day ago",
        municipality: "Delhi Municipal Corporation",
        department: "Education & Social Welfare",
        urgency: "low",
        estimatedCost: 80000,
        location: "Community Hall, Karol Bagh"
      },
      {
        id: "7",
        username: "Safety First Citizen",
        title: "🚨 Broken Street Light - Safety Hazard",
        content: "Street light broken for 2 weeks at main intersection. Creating safety issues for pedestrians and vehicles during night hours. Multiple minor accidents reported. Quick fix needed.",
        images: [],
        upvotes: 19,
        comments: 4,
        isUpvoted: false,
        status: "pending",
        createdAt: "1 day ago",
        lastUpdated: "6 hours ago",
        municipality: "Delhi Municipal Corporation",
        department: "Electricity",
        urgency: "high",
        estimatedCost: 3500,
        location: "Sector 12 Main Road, Dwarka"
      },
      {
        id: "8",
        username: "Local Business Owner",
        title: "🚮 Waste Management System Upgrade",
        content: "Proposing smart waste bins with sensors for optimal collection routes. Reduce overflow and improve sanitation in market area. Seeking partnership with waste management companies.",
        images: [],
        upvotes: 15,
        comments: 6,
        isUpvoted: true,
        status: "pending",
        createdAt: "2 days ago",
        lastUpdated: "12 hours ago",
        municipality: "Delhi Municipal Corporation",
        department: "Sanitation",
        urgency: "medium",
        estimatedCost: 45000,
        location: "Central Market, Laxmi Nagar"
      },
      {
        id: "9",
        username: "Youth Volunteer",
        title: "🎨 Community Wall Art Project - FUNDED",
        content: "Beautiful wall art project completed! Anti-graffiti murals promoting cleanliness and unity. Thanks to ArtsTech Foundation for sponsoring ₹20,000. Community response has been overwhelmingly positive!",
        images: [],
        upvotes: 72,
        comments: 21,
        isUpvoted: false,
        status: "solved",
        createdAt: "1 week ago",
        lastUpdated: "3 days ago",
        municipality: "Delhi Municipal Corporation",
        department: "Cultural Affairs",
        urgency: "low",
        estimatedCost: 20000,
        location: "Metro Station Wall, Rajiv Chowk",
        isFunded: true,
        fundingAmount: 20000
      },
      {
        id: "10",
        username: "Concerned Parent",
        title: "🏫 School Zone Speed Breakers Required",
        content: "Vehicles speeding through school zone during peak hours. Children's safety at risk. Need speed breakers and warning signs installed immediately. Parent committee ready to contribute funds.",
        images: [],
        upvotes: 38,
        comments: 11,
        isUpvoted: true,
        status: "pending",
        createdAt: "4 hours ago",
        lastUpdated: "1 hour ago",
        municipality: "Delhi Municipal Corporation",
        department: "Traffic & Safety",
        urgency: "high",
        estimatedCost: 12000,
        location: "Government School, Block A, Janakpuri"
      }
    ];
    savePostsToLocalStorage(defaultPosts);
    return defaultPosts;
  } catch {
    return [];
  }
}

function savePostsToLocalStorage(posts: Post[]): void {
  try {
    localStorage.setItem('prathmikta_posts', JSON.stringify(posts));
  } catch {
    // Handle storage error silently
  }
}

function updatePostUpvotesLocalStorage(postId: string): Post[] {
  const posts = getPostsFromLocalStorage();
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
  savePostsToLocalStorage(updatedPosts);
  return updatedPosts;
}

function updatePostStatusLocalStorage(postId: string, status: Post['status']): Post[] {
  const posts = getPostsFromLocalStorage();
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      return {
        ...post,
        status,
        lastUpdated: 'Now'
      };
    }
    return post;
  });
  savePostsToLocalStorage(updatedPosts);
  return updatedPosts;
}

function getCommentsFromLocalStorage(postId: string): Comment[] {
  try {
    const stored = localStorage.getItem(`prathmikta_comments_${postId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Return some default comments for demo posts
    const defaultComments: { [key: string]: Comment[] } = {
      "1": [
        {
          id: "c1_1",
          postId: "1",
          username: "राहुल शर्मा",
          content: "मैं पाइप की मरम्मत में मदद कर सकता हूं। मेरे पास प्लम्बिंग का अनुभव है।",
          timestamp: "1 घंटा पहले",
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: "c1_2", 
          postId: "1",
          username: "Municipal Engineer",
          content: "We've dispatched a team to assess the situation. Community volunteers can help with temporary measures.",
          timestamp: "45 मिनट पहले",
          createdAt: new Date(Date.now() - 2700000).toISOString()
        }
      ],
      "2": [
        {
          id: "c2_1",
          postId: "2", 
          username: "टेक वालंटियर",
          content: "This is a great initiative! IoT sensors will really help with energy monitoring.",
          timestamp: "3 घंटे पहले",
          createdAt: new Date(Date.now() - 10800000).toISOString()
        }
      ],
      "3": [
        {
          id: "c3_1",
          postId: "3",
          username: "स्थानीय निवासी", 
          content: "बहुत बढ़िया! ABC Corp का धन्यवाद। अब यहां से गुजरना आसान हो गया है।",
          timestamp: "1 दिन पहले",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "c3_2",
          postId: "3",
          username: "ABC Corp Representative",
          content: "Happy to contribute to community development. More projects coming soon!",
          timestamp: "1 दिन पहले", 
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    };
    
    const comments = defaultComments[postId] || [];
    if (comments.length > 0) {
      saveCommentsToLocalStorage(postId, comments);
    }
    return comments;
  } catch {
    return [];
  }
}

function saveCommentsToLocalStorage(postId: string, comments: Comment[]): void {
  try {
    localStorage.setItem(`prathmikta_comments_${postId}`, JSON.stringify(comments));
  } catch {
    // Handle storage error silently
  }
}

function getUserMunicipalityFromLocalStorage(): string | null {
  try {
    return localStorage.getItem('prathmikta_municipality');
  } catch {
    return null;
  }
}

function setUserMunicipalityInLocalStorage(municipality: string): void {
  try {
    localStorage.setItem('prathmikta_municipality', municipality);
  } catch {
    // Handle storage error silently
  }
}

function getUserLanguageFromLocalStorage(): string {
  try {
    return localStorage.getItem('prathmikta_language') || 'hi';
  } catch {
    return 'hi';
  }
}

function setUserLanguageInLocalStorage(language: string): void {
  try {
    localStorage.setItem('prathmikta_language', language);
  } catch {
    // Handle storage error silently
  }
}