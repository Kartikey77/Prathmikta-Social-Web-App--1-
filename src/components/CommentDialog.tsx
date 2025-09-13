import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MessageCircle, Send } from "lucide-react";
import { motion } from "motion/react";
// English-only version - no language context needed

interface Comment {
  id: string;
  postId: string;
  username: string;
  content: string;
  timestamp: string;
  createdAt: string;
}

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle: string;
  postId: string;
  currentUser?: {
    username: string;
    name: string;
    type: "citizen" | "volunteer" | "municipal";
  };
}

import { getComments, addComment } from "../services/supabaseDataManager";
import { toast } from "sonner";

export function CommentDialog({ isOpen, onClose, postTitle, postId, currentUser }: CommentDialogProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  // Load comments when dialog opens
  useEffect(() => {
    if (isOpen) {
      const loadComments = async () => {
        try {
          const storedComments = await getComments(postId);
          setComments(storedComments);
        } catch (error) {
          console.error('Error loading comments:', error);
          // Set empty comments on error
          setComments([]);
        }
      };
      
      loadComments();
    }
  }, [isOpen, postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // Create comment with current user's information
      const username = currentUser?.name || currentUser?.username || 'Citizen';
      const timestamp = 'Now';
      
      const newCommentData: Comment = {
        id: Date.now().toString(),
        postId,
        username,
        content: newComment.trim(),
        timestamp,
        createdAt: new Date().toISOString()
      };

      // Add to localStorage directly (since we're in demo mode)
      const existingComments = await getComments(postId);
      const updatedComments = [...existingComments, newCommentData];
      
      // Save comments to localStorage
      localStorage.setItem(`prathmikta_comments_${postId}`, JSON.stringify(updatedComments));
      
      // Update post comment count
      const posts = JSON.parse(localStorage.getItem('prathmikta_posts') || '[]');
      const updatedPosts = posts.map((post: any) => {
        if (post.id === postId) {
          return { ...post, comments: updatedComments.length };
        }
        return post;
      });
      localStorage.setItem('prathmikta_posts', JSON.stringify(updatedPosts));
      
      setComments(updatedComments);
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error("Error adding comment!");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddComment();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-white border-2 border-orange-200 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-orange-50 via-white to-green-50 rounded-t-lg p-4 -m-6 mb-4">
          <DialogTitle className="flex items-center gap-2 text-blue-900">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageCircle className="w-5 h-5 text-orange-600" />
            </motion.div>
            Comments
          </DialogTitle>
          <DialogDescription className="line-clamp-2 text-blue-700">
            {postTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4 max-h-96">
          {comments.length === 0 ? (
            <motion.div 
              className="text-center py-8 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50 text-orange-400" />
              <p className="text-blue-700">
                No comments yet. Be the first to comment!
              </p>
            </motion.div>
          ) : (
            comments.map((comment, index) => (
              <motion.div 
                key={comment.id} 
                className="flex gap-3 p-3 bg-gradient-to-r from-orange-50/50 to-green-50/50 rounded-lg border border-orange-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Avatar className="w-8 h-8 bg-gradient-to-r from-orange-400 to-green-400">
                  <AvatarFallback className="text-xs text-white font-bold">
                    🇮🇳
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-blue-900">{comment.username}</span>
                    <span className="text-xs text-blue-600">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <DialogFooter className="border-t-2 border-orange-200 pt-4 bg-gradient-to-r from-orange-50/30 to-green-50/30 rounded-b-lg p-4 -m-6 mt-4">
          <div className="flex w-full gap-2">
            <Textarea
              placeholder="Write your comment... (Ctrl+Enter to send)"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyPress}
              className="min-h-12 max-h-20 resize-none bg-white/80 border-2 border-orange-200 focus:border-orange-400"
            />
            <Button 
              onClick={handleAddComment} 
              disabled={!newComment.trim()}
              size="sm"
              className="self-end bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}