import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import * as kv from "./kv_store.tsx";

// Helper function to get localized text
async function getLocalizedText(key: string): Promise<string> {
  const language = await kv.get("prathmikta_language") || "hi";
  
  const translations: Record<string, Record<string, string>> = {
    en: {
      now: "Now"
    },
    hi: {
      now: "अभी"
    }
  };
  
  return translations[language]?.[key] || key;
}

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c3689432/health", (c) => {
  return c.json({ status: "ok" });
});

// Posts endpoints
app.get("/make-server-c3689432/posts", async (c) => {
  try {
    const posts = await kv.get("prathmikta_posts") || [];
    return c.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return c.json({ error: "Failed to fetch posts", posts: [] }, 500);
  }
});

app.post("/make-server-c3689432/posts", async (c) => {
  try {
    const { post } = await c.req.json();
    
    // Get existing posts
    const existingPosts = await kv.get("prathmikta_posts") || [];
    
    // Add new post to the beginning
    const updatedPosts = [post, ...existingPosts];
    
    // Save updated posts
    await kv.set("prathmikta_posts", updatedPosts);
    
    return c.json({ post, posts: updatedPosts });
  } catch (error) {
    console.error("Error creating post:", error);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

app.post("/make-server-c3689432/posts/upvote", async (c) => {
  try {
    const { postId } = await c.req.json();
    
    // Get existing posts
    const posts = await kv.get("prathmikta_posts") || [];
    
    // Update the specific post's upvote status
    const nowText = await getLocalizedText("now");
    const updatedPosts = posts.map((post: any) => {
      if (post.id === postId) {
        return {
          ...post,
          isUpvoted: !post.isUpvoted,
          upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes + 1,
          lastUpdated: nowText
        };
      }
      return post;
    });
    
    // Save updated posts
    await kv.set("prathmikta_posts", updatedPosts);
    
    return c.json({ posts: updatedPosts });
  } catch (error) {
    console.error("Error updating upvotes:", error);
    return c.json({ error: "Failed to update upvotes" }, 500);
  }
});

app.post("/make-server-c3689432/posts/status", async (c) => {
  try {
    const { postId, status } = await c.req.json();
    
    // Get existing posts
    const posts = await kv.get("prathmikta_posts") || [];
    
    // Update the specific post's status
    const nowText = await getLocalizedText("now");
    const updatedPosts = posts.map((post: any) => {
      if (post.id === postId) {
        return {
          ...post,
          status,
          lastUpdated: nowText
        };
      }
      return post;
    });
    
    // Save updated posts
    await kv.set("prathmikta_posts", updatedPosts);
    
    return c.json({ posts: updatedPosts });
  } catch (error) {
    console.error("Error updating post status:", error);
    return c.json({ error: "Failed to update post status" }, 500);
  }
});

// Comments endpoints
app.get("/make-server-c3689432/comments/:postId", async (c) => {
  try {
    const postId = c.req.param("postId");
    const comments = await kv.get(`prathmikta_comments_${postId}`) || [];
    return c.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return c.json({ error: "Failed to fetch comments", comments: [] }, 500);
  }
});

app.post("/make-server-c3689432/comments", async (c) => {
  try {
    const { comment } = await c.req.json();
    
    // Get existing comments for this post
    const existingComments = await kv.get(`prathmikta_comments_${comment.postId}`) || [];
    
    // Add new comment
    const updatedComments = [...existingComments, comment];
    
    // Save updated comments
    await kv.set(`prathmikta_comments_${comment.postId}`, updatedComments);
    
    // Update comment count in posts
    const posts = await kv.get("prathmikta_posts") || [];
    const nowText = await getLocalizedText("now");
    const updatedPosts = posts.map((post: any) => {
      if (post.id === comment.postId) {
        return {
          ...post,
          comments: updatedComments.length,
          lastUpdated: nowText
        };
      }
      return post;
    });
    await kv.set("prathmikta_posts", updatedPosts);
    
    return c.json({ comment, comments: updatedComments });
  } catch (error) {
    console.error("Error creating comment:", error);
    return c.json({ error: "Failed to create comment" }, 500);
  }
});

// User preferences endpoints
app.get("/make-server-c3689432/user/municipality", async (c) => {
  try {
    const municipality = await kv.get("prathmikta_municipality");
    return c.json({ municipality });
  } catch (error) {
    console.error("Error fetching user municipality:", error);
    return c.json({ error: "Failed to fetch municipality", municipality: null }, 500);
  }
});

app.post("/make-server-c3689432/user/municipality", async (c) => {
  try {
    const { municipality } = await c.req.json();
    await kv.set("prathmikta_municipality", municipality);
    return c.json({ municipality });
  } catch (error) {
    console.error("Error setting user municipality:", error);
    return c.json({ error: "Failed to set municipality" }, 500);
  }
});

app.get("/make-server-c3689432/user/language", async (c) => {
  try {
    const language = await kv.get("prathmikta_language") || "hi";
    return c.json({ language });
  } catch (error) {
    console.error("Error fetching user language:", error);
    return c.json({ error: "Failed to fetch language", language: "hi" }, 500);
  }
});

app.post("/make-server-c3689432/user/language", async (c) => {
  try {
    const { language } = await c.req.json();
    await kv.set("prathmikta_language", language);
    return c.json({ language });
  } catch (error) {
    console.error("Error setting user language:", error);
    return c.json({ error: "Failed to set language" }, 500);
  }
});

// Initialize default data if not exists
app.post("/make-server-c3689432/initialize", async (c) => {
  try {
    const existingPosts = await kv.get("prathmikta_posts");
    
    if (!existingPosts || existingPosts.length === 0) {
      // Get user language preference to determine which default data to use
      const userLanguage = await kv.get("prathmikta_language") || "hi";
      
      let defaultPosts;
      
      if (userLanguage === "en") {
        defaultPosts = [
          {
            id: "1",
            username: "Citizen",
            title: "Road with Large Potholes",
            content: "There are several large potholes on the main road causing traffic disruption. It becomes even more dangerous during rainy days. Please get this repaired as soon as possible.",
            images: [],
            upvotes: 12,
            comments: 3,
            isUpvoted: false,
            status: "pending",
            createdAt: "2 days ago",
            lastUpdated: "2 days ago",
            municipality: "Delhi Municipal Corporation"
          },
          {
            id: "2", 
            username: "Citizen",
            title: "Street Light Issue",
            content: "The street light in our lane has been off for the past week. It has become difficult to walk at night and there are security concerns.",
            images: [],
            upvotes: 8,
            comments: 2,
            isUpvoted: true,
            status: "working",
            createdAt: "1 day ago",
            lastUpdated: "6 hours ago",
            municipality: "Delhi Municipal Corporation"
          },
          {
            id: "3",
            username: "Citizen", 
            title: "Water Supply Problem",
            content: "There has been no water supply in our area for the past 3 days. Residents are troubled. Please take immediate action.",
            images: [],
            upvotes: 15,
            comments: 5,
            isUpvoted: false,
            status: "pending",
            createdAt: "12 hours ago",
            lastUpdated: "12 hours ago",
            municipality: "Delhi Municipal Corporation"
          }
        ];
      } else {
        defaultPosts = [
          {
            id: "1",
            username: "नागरिक",
            title: "सड़क पर बड़े गड्ढे",
            content: "मुख्य सड़क पर कई बड़े गड्ढे हैं जो यातायात में बाधा डाल रहे हैं। बारिश के दिनों में यह और भी खतरनाक हो जाता है। कृपया जल्द से जल्द इसकी मरम्मत करवाएं।",
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
            title: "स्ट्रीट लाइट की समस्या",
            content: "हमारी गली में स्ट्रीट लाइट पिछले एक हफ्ते से बंद है। रात में चलना मुश्किल हो गया है और सुरक्षा की चिंता है।",
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
            title: "पानी की आपूर्ति में समस्या",
            content: "पिछले 3 दिनों से हमारे इलाके में पानी की आपूर्ति नहीं हो रही है। निवासी परेशान हैं। कृपया तुरंत कार्रवाई करें।",
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
      }
      
      await kv.set("prathmikta_posts", defaultPosts);
      return c.json({ message: "Default data initialized", posts: defaultPosts });
    }
    
    return c.json({ message: "Data already exists", posts: existingPosts });
  } catch (error) {
    console.error("Error initializing data:", error);
    return c.json({ error: "Failed to initialize data" }, 500);
  }
});

Deno.serve(app.fetch);