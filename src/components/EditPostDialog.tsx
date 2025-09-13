import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { X, Save, Edit, FileText } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { motion } from "motion/react";

interface Post {
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

interface EditPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onSave: (postId: string, updates: Partial<Post>) => void;
}

export function EditPostDialog({ isOpen, onClose, post, onSave }: EditPostDialogProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when post changes
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const handleSave = async () => {
    if (!post || !title.trim() || !content.trim()) return;
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(post.id, { title: title.trim(), content: content.trim() });
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
    onClose();
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm border-2 border-orange-200 shadow-xl">
        <DialogHeader className="bg-gradient-to-r from-orange-100 via-white to-green-100 -mx-6 -mt-6 px-6 py-4 rounded-t-lg border-b-2 border-orange-200">
          <DialogTitle className="flex items-center gap-3 text-blue-900">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Edit className="w-6 h-6 text-orange-600" />
            </motion.div>
            Edit Post
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FileText className="w-5 h-5 text-green-600" />
            </motion.div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="edit-title" className="text-blue-900 font-semibold">
              {t('compose.titleField')}
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('compose.titlePlaceholder')}
              className="border-2 border-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm"
            />
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="edit-content" className="text-blue-900 font-semibold">
              {t('compose.descField')}
            </Label>
            <Textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('compose.descPlaceholder')}
              className="min-h-32 resize-y border-2 border-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm"
            />
          </motion.div>

          {post.images && post.images.length > 0 && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label className="text-blue-900 font-semibold">Current Images</Label>
              <div className="grid grid-cols-2 gap-3">
                {post.images.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="overflow-hidden rounded-lg border-2 border-orange-200 shadow-md"
                  >
                    <img
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter className="gap-3 pt-4 border-t-2 border-orange-100">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-2 border-orange-200 hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100 text-blue-800"
            >
              <X className="w-4 h-4 mr-2" />
              {t('common.cancel')}
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || isSaving}
              className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white shadow-lg disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('common.save')}
                </>
              )}
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}