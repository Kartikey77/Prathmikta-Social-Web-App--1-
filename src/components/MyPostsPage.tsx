import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { ChevronUp, MessageCircle, Share2, Trash2, Upload, Clock, CheckCircle, AlertCircle, FileText, Star, TrendingUp, Edit } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "./LanguageContext";
import { motion } from "motion/react";
import { EditPostDialog } from "./EditPostDialog";

interface MyPost {
  id: string;
  title: string;
  content: string;
  images?: string[];
  upvotes: number;
  comments: number;
  status: "pending" | "working" | "solved";
  createdAt: string;
  lastUpdated: string;
}

interface MyPostsPageProps {
  onNavigate: (page: string) => void;
  posts: MyPost[];
  onDeletePost: (postId: string) => void;
  onUpdatePost: (postId: string, updates: Partial<MyPost>) => void;
}

export function MyPostsPage({ onNavigate, posts, onDeletePost, onUpdatePost }: MyPostsPageProps) {
  const { t } = useLanguage();
  const [editingPost, setEditingPost] = useState<MyPost | null>(null);

  const getStatusIcon = (status: MyPost["status"]) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "working":
        return <Clock className="w-4 h-4" />;
      case "solved":
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: MyPost["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-orange-500 to-yellow-500 text-white";
      case "working":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      case "solved":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    }
  };

  const getStatusText = (status: MyPost["status"]) => {
    switch (status) {
      case "pending":
        return t('home.status.pending');
      case "working":
        return t('home.status.working');
      case "solved":
        return t('home.status.solved');
    }
  };

  const handleDeletePost = (postId: string) => {
    onDeletePost(postId);
  };

  const handleReuploadPost = (postId: string) => {
    // In a real app, this would create a new post based on the solved one
    console.log("Reuploading post:", postId);
    alert("Post has been prepared for re-upload. You can modify it in the compose page.");
    onNavigate("compose");
  };

  const filterPostsByStatus = (status: MyPost["status"]) => {
    return posts.filter(post => post.status === status);
  };

  const PostCard = ({ post }: { post: MyPost }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="mb-4 bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-orange-300">
        <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 via-white to-green-50 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 text-lg mb-2">{post.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className={`${getStatusColor(post.status)} shadow-md flex items-center gap-1`}>
                    {getStatusIcon(post.status)}
                    <span className="font-medium">{getStatusText(post.status)}</span>
                  </Badge>
                </motion.div>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingPost(post)}
                className="flex items-center gap-2 text-blue-800 border-orange-200 hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100"
              >
                <Edit className="w-4 h-4" />
                {t('myReports.edit')}
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{post.content}</p>
          
          {post.images && post.images.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 gap-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {post.images.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="overflow-hidden rounded-xl border-2 border-orange-200 shadow-md"
                >
                  <ImageWithFallback
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="flex items-center gap-4 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
            <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{t('myReports.lastUpdated')}: {new Date(post.lastUpdated).toLocaleDateString()}</span>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 border-t-2 border-orange-100 bg-gradient-to-r from-orange-50/50 via-white/50 to-green-50/50">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-blue-700">
                <ChevronUp className="w-4 h-4" />
                <span className="font-medium">{post.upvotes}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium">{post.comments}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <Share2 className="w-4 h-4" />
                <span className="font-medium">{t('home.share')}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {post.status === "solved" && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReuploadPost(post.id)}
                    className="flex items-center gap-2 text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <Upload className="w-4 h-4" />
                    Re-upload
                  </Button>
                </motion.div>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('myReports.delete')}
                    </Button>
                  </motion.div>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-2 border-orange-200">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-blue-900">Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-blue-700">
                      This action cannot be undone. This will permanently delete your post
                      and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-orange-200 hover:bg-orange-100">
                      {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDeletePost(post.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {t('myReports.delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div 
          className="mb-6 text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-200 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <FileText className="w-8 h-8 text-orange-600" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              My Reports
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-6 h-6 text-yellow-500" />
            </motion.div>
          </div>
          <p className="text-blue-700 font-medium">Track and manage issues you’ve posted.</p>
          <p className="text-sm text-gray-600 mt-2">🇮🇳 Digital India Mission</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-2 border-orange-200 shadow-md">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                All ({posts.length})
              </TabsTrigger>
              <TabsTrigger 
                value="pending"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                {t('home.status.pending')} ({filterPostsByStatus("pending").length})
              </TabsTrigger>
              <TabsTrigger 
                value="working"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                {t('home.status.working')} ({filterPostsByStatus("working").length})
              </TabsTrigger>
              <TabsTrigger 
                value="solved"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
              >
                {t('home.status.solved')} ({filterPostsByStatus("solved").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {posts.length === 0 ? (
                <motion.div 
                  className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-orange-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-blue-900 font-semibold mb-4">You haven't created any posts yet.</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={() => onNavigate("compose")}
                      className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white shadow-lg"
                    >
                      Create Your First Post
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filterPostsByStatus("pending").map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
              {filterPostsByStatus("pending").length === 0 && (
                <motion.div 
                  className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-orange-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl mb-4">⏳</div>
                  <p className="text-blue-900 font-semibold">No pending posts.</p>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="working" className="space-y-4">
              {filterPostsByStatus("working").map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
              {filterPostsByStatus("working").length === 0 && (
                <motion.div 
                  className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-orange-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl mb-4">🔧</div>
                  <p className="text-blue-900 font-semibold">No posts currently being worked on.</p>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="solved" className="space-y-4">
              {filterPostsByStatus("solved").map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
              {filterPostsByStatus("solved").length === 0 && (
                <motion.div 
                  className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-orange-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-blue-900 font-semibold">No solved posts yet.</p>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <EditPostDialog
        isOpen={editingPost !== null}
        onClose={() => setEditingPost(null)}
        post={editingPost}
        onSave={onUpdatePost}
      />
    </div>
  );
}