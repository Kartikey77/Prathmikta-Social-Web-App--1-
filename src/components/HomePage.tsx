import { PostCard } from "./PostCard";
import { Button } from "./ui/button";
import { Plus, Star, TrendingUp } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { motion } from "motion/react";

interface Post {
  id: string;
  username: string;
  title: string;
  content: string;
  images?: string[];
  upvotes: number;
  comments: number;
  isUpvoted: boolean;
  createdAt: string;
  lastUpdated: string;
}

interface HomePageProps {
  onNavigate: (page: string) => void;
  posts: Post[];
  onUpvote: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onViewIssue: (issueId: string) => void;
}

export function HomePage({ onNavigate, posts, onUpvote, onComment, onShare, onViewIssue }: HomePageProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              Community Feed
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-6 h-6 text-yellow-500" />
            </motion.div>
          </div>
          <p className="text-blue-700 font-medium">Raise issues, support projects, and improve your city.</p>
          <p className="text-sm text-gray-600 mt-2">🇮🇳 Digital India Mission</p>
        </motion.div>

        {/* Posts Feed */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <PostCard
                post={post}
                onUpvote={onUpvote}
                onComment={onComment}
                onShare={onShare}
                onViewIssue={onViewIssue}
              />
            </motion.div>
          ))}
        </motion.div>

        {posts.length === 0 && (
          <motion.div 
            className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-orange-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Community Feed</h3>
            <p className="text-blue-700">Raise issues, support projects, and improve your city.</p>
          </motion.div>
        )}
      </div>
      
      {/* Floating Compose Button */}
      <motion.div 
        className="fixed bottom-8 right-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => onNavigate("compose")}
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 shadow-2xl border-4 border-white/50"
        >
          <motion.div
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Plus className="w-7 h-7" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}