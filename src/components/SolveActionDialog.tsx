import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { CheckCircle, Clock, MapPin, Wrench, Calendar, User } from "lucide-react";
import { toast } from "sonner";

interface SolveActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  issueTitle: string;
  issueId: string;
  estimatedCost?: number;
  currentUser?: {
    username: string;
    name: string;
    type: "citizen" | "volunteer" | "municipal";
    volunteerType?: "ngo" | "student" | "citizen" | "business";
    skills?: string[];
  };
  onConfirm: (data: {
    timeline: string;
    approach: string;
    experience: string;
    estimatedDays: number;
  }) => void;
}

export function SolveActionDialog({ 
  isOpen, 
  onClose, 
  issueTitle, 
  issueId, 
  estimatedCost,
  currentUser, 
  onConfirm 
}: SolveActionDialogProps) {
  const [timeline, setTimeline] = useState("");
  const [approach, setApproach] = useState("");
  const [experience, setExperience] = useState("");
  const [estimatedDays, setEstimatedDays] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!timeline.trim() || !approach.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onConfirm({
        timeline: timeline.trim(),
        approach: approach.trim(),
        experience: experience.trim(),
        estimatedDays
      });
      
  // Reset form
  setTimeline("");
  setApproach("");
  setExperience("");
  setEstimatedDays(7);
      
  // Success toast is handled by the parent component to avoid duplicates
  onClose();
    } catch (error) {
      toast.error("Failed to submit your proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border-2 border-green-200 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg p-6 -m-6 mb-6 border-b-2 border-green-100">
          <DialogTitle className="flex items-center gap-3 text-green-800">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Wrench className="w-6 h-6 text-green-600" />
            </motion.div>
            Offer to Solve Issue
          </DialogTitle>
          <DialogDescription className="text-green-700 mt-2">
            Submit your proposal to solve: <span className="font-semibold">"{issueTitle}"</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-green-800">{currentUser?.name || "Volunteer"}</div>
                <div className="text-sm text-green-600">
                  {currentUser?.volunteerType === "ngo" && "NGO Volunteer"}
                  {currentUser?.volunteerType === "student" && "Student Volunteer"}
                  {currentUser?.volunteerType === "citizen" && "Citizen Volunteer"}
                  {currentUser?.volunteerType === "business" && "Corporate Volunteer"}
                  {!currentUser?.volunteerType && "Community Volunteer"}
                </div>
              </div>
            </div>
            {currentUser?.skills && currentUser.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-green-700 border-green-300 bg-white/50">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Estimated Timeline */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-green-800">
              <Calendar className="w-4 h-4" />
              Estimated Timeline *
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="1"
                max="30"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(parseInt(e.target.value) || 1)}
                className="w-20 border-green-200 focus:border-green-400"
              />
              <span className="text-green-700">days to complete</span>
            </div>
            <Input
              placeholder="e.g., Will start work immediately, complete in phases"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="border-green-200 focus:border-green-400"
            />
          </div>

          {/* Approach */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-green-800">
              <Wrench className="w-4 h-4" />
              Your Approach *
            </label>
            <Textarea
              placeholder="Describe how you plan to solve this issue, what tools/materials you'll need, and your step-by-step approach..."
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              className="min-h-20 border-green-200 focus:border-green-400"
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-green-800">
              <CheckCircle className="w-4 h-4" />
              Relevant Experience
            </label>
            <Textarea
              placeholder="Share any relevant experience or similar projects you've completed (optional)..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="min-h-16 border-green-200 focus:border-green-400"
            />
          </div>

          {/* Cost Info */}
          {estimatedCost && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 text-orange-800">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Estimated Project Cost: ₹{estimatedCost.toLocaleString()}</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                This is the municipal estimate. Your actual costs may vary.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t-2 border-green-200 pt-6 bg-gradient-to-r from-green-50/30 to-emerald-50/30 rounded-b-lg p-6 -m-6 mt-6">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !timeline.trim() || !approach.trim()}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Proposal
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}