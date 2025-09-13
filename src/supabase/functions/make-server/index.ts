import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to get localized text
async function getLocalizedText(key: string): Promise<string> {
  try {
    const { data } = await supabase
      .from('kv_store_c3689432')
      .select('value')
      .eq('key', 'prathmikta_language')
      .single()
    
    const language = data?.value || 'hi'
    
    const translations: Record<string, Record<string, string>> = {
      en: {
        now: "Now"
      },
      hi: {
        now: "अभी"
      }
    }
    
    return translations[language]?.[key] || key
  } catch {
    return key
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/make-server', '')

    // Health check
    if (path === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Posts endpoints
    if (path === '/posts' && req.method === 'GET') {
      const { data } = await supabase
        .from('kv_store_c3689432')
        .select('value')
        .eq('key', 'prathmikta_posts')
        .single()
      
      const posts = data?.value || []
      return new Response(JSON.stringify({ posts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (path === '/posts' && req.method === 'POST') {
      const { post } = await req.json()
      
      // Get existing posts
      const { data: existingData } = await supabase
        .from('kv_store_c3689432')
        .select('value')
        .eq('key', 'prathmikta_posts')
        .single()
      
      const existingPosts = existingData?.value || []
      const updatedPosts = [post, ...existingPosts]
      
      // Save updated posts
      await supabase
        .from('kv_store_c3689432')
        .upsert({ key: 'prathmikta_posts', value: updatedPosts })
      
      return new Response(JSON.stringify({ post, posts: updatedPosts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (path === '/posts/upvote' && req.method === 'POST') {
      const { postId } = await req.json()
      
      // Get existing posts
      const { data } = await supabase
        .from('kv_store_c3689432')
        .select('value')
        .eq('key', 'prathmikta_posts')
        .single()
      
      const posts = data?.value || []
      const nowText = await getLocalizedText("now")
      
      // Update the specific post's upvote status
      const updatedPosts = posts.map((post: any) => {
        if (post.id === postId) {
          return {
            ...post,
            isUpvoted: !post.isUpvoted,
            upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes + 1,
            lastUpdated: nowText
          }
        }
        return post
      })
      
      // Save updated posts
      await supabase
        .from('kv_store_c3689432')
        .upsert({ key: 'prathmikta_posts', value: updatedPosts })
      
      return new Response(JSON.stringify({ posts: updatedPosts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (path === '/posts/status' && req.method === 'POST') {
      const { postId, status } = await req.json()
      
      // Get existing posts
      const { data } = await supabase
        .from('kv_store_c3689432')
        .select('value')
        .eq('key', 'prathmikta_posts')
        .single()
      
      const posts = data?.value || []
      const nowText = await getLocalizedText("now")
      
      // Update the specific post's status
      const updatedPosts = posts.map((post: any) => {
        if (post.id === postId) {
          return {
            ...post,
            status,
            lastUpdated: nowText
          }
        }
        return post
      })
      
      // Save updated posts
      await supabase
        .from('kv_store_c3689432')
        .upsert({ key: 'prathmikta_posts', value: updatedPosts })
      
      return new Response(JSON.stringify({ posts: updatedPosts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Comments endpoints
    if (path.startsWith('/comments/') && req.method === 'GET') {
      const postId = path.split('/')[2]
      const { data } = await supabase
        .from('kv_store_c3689432')
        .select('value')
        .eq('key', `prathmikta_comments_${postId}`)
        .single()
      
      const comments = data?.value || []
      return new Response(JSON.stringify({ comments }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (path === '/comments' && req.method === 'POST') {
      const { comment } = await req.json()
      
      // Get existing comments for this post
      const { data: existingData } = await supabase
        .from('kv_store_c3689432')
        .select('value')
        .eq('key', `prathmikta_comments_${comment.postId}`)
        .single()
      
      const existingComments = existingData?.value || []
      const updatedComments = [...existingComments, comment]
      
      // Save updated comments
      await supabase
        .from('kv_store_c3689432')
        .upsert({ key: `prathmikta_comments_${comment.postId}`, value: updatedComments })
      
      // Update comment count in posts
      const { data: postsData } = await supabase
        .from('kv_store_c3689432')
        .select('value')
        .eq('key', 'prathmikta_posts')
        .single()
      
      const posts = postsData?.value || []
      const nowText = await getLocalizedText("now")
      const updatedPosts = posts.map((post: any) => {
        if (post.id === comment.postId) {
          return {
            ...post,
            comments: updatedComments.length,
            lastUpdated: nowText
          }
        }
        return post
      })
      
      await supabase
        .from('kv_store_c3689432')
        .upsert({ key: 'prathmikta_posts', value: updatedPosts })
      
      return new Response(JSON.stringify({ comment, comments: updatedComments }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // User preferences endpoints
    if (path === '/user/municipality' && req.method === 'GET') {
      const { data } = await supabase
        .from('kv_store_c3689432')
        .select('value')
        .eq('key', 'prathmikta_municipality')
        .single()
      
      return new Response(JSON.stringify({ municipality: data?.value }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (path === '/user/municipality' && req.method === 'POST') {
      const { municipality } = await req.json()
      await supabase
        .from('kv_store_c3689432')
        .upsert({ key: 'prathmikta_municipality', value: municipality })
      
      return new Response(JSON.stringify({ municipality }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (path === '/user/language' && req.method === 'GET') {
      const { data } = await supabase
        .from('kv_store_c3689432')
        .select('value')
        .eq('key', 'prathmikta_language')
        .single()
      
      const language = data?.value || 'hi'
      return new Response(JSON.stringify({ language }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (path === '/user/language' && req.method === 'POST') {
      const { language } = await req.json()
      await supabase
        .from('kv_store_c3689432')
        .upsert({ key: 'prathmikta_language', value: language })
      
      return new Response(JSON.stringify({ language }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Initialize default data
    if (path === '/initialize' && req.method === 'POST') {
      const { data: existingData } = await supabase
        .from('kv_store_c3689432')
        .select('value')
        .eq('key', 'prathmikta_posts')
        .single()
      
      if (!existingData?.value || existingData.value.length === 0) {
        // Get user language preference to determine which default data to use
        const { data: langData } = await supabase
          .from('kv_store_c3689432')
          .select('value')
          .eq('key', 'prathmikta_language')
          .single()
        
        const userLanguage = langData?.value || 'hi'
        
        let defaultPosts
        
        if (userLanguage === 'en') {
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
          ]
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
          ]
        }
        
        await supabase
          .from('kv_store_c3689432')
          .upsert({ key: 'prathmikta_posts', value: defaultPosts })
        
        return new Response(JSON.stringify({ message: "Default data initialized", posts: defaultPosts }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      
      return new Response(JSON.stringify({ message: "Data already exists", posts: existingData.value }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})