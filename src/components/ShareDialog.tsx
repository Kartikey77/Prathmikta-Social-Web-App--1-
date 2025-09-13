import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Share2, Copy, Check, Twitter, Facebook, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle: string;
  postId: string;
}

export function ShareDialog({ isOpen, onClose, postTitle, postId }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate a mock URL for the post
  const postUrl = `https://prathmikta.app/post/${postId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Check out this civic issue report: "${postTitle}"`);
    const url = encodeURIComponent(postUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(postUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this civic issue report: "${postTitle}" ${postUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Post
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            {postTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <label className="text-sm">Share Link</label>
            <div className="flex gap-2">
              <Input
                value={postUrl}
                readOnly
                className="flex-1"
              />
              <Button 
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Sharing */}
          <div className="space-y-2">
            <label className="text-sm">Share on Social Media</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleShareTwitter}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3"
              >
                <Twitter className="w-5 h-5" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                onClick={handleShareFacebook}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3"
              >
                <Facebook className="w-5 h-5" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button
                onClick={handleShareWhatsApp}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-3"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs">WhatsApp</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}