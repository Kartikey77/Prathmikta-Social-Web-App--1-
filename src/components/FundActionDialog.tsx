import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { motion } from "motion/react";
import { DollarSign, Building, Heart, Sparkles, CreditCard, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface FundActionDialogProps {
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
  };
  onConfirm: (data: {
    amount: number;
    fundingType: string;
    message: string;
    isAnonymous: boolean;
  }) => void;
}

export function FundActionDialog({ 
  isOpen, 
  onClose, 
  issueTitle, 
  issueId, 
  estimatedCost,
  currentUser, 
  onConfirm 
}: FundActionDialogProps) {
  const [amount, setAmount] = useState("");
  const [fundingType, setFundingType] = useState("full");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fundingOptions = [
    { value: "full", label: "Full Funding", description: "Fund the complete project" },
    { value: "partial", label: "Partial Funding", description: "Contribute towards the project" },
    { value: "materials", label: "Material Sponsorship", description: "Provide materials/equipment" },
    { value: "expertise", label: "Technical Support", description: "Provide expert consultation" }
  ];

  const suggestedAmounts = estimatedCost ? [
    Math.floor(estimatedCost * 0.25),
    Math.floor(estimatedCost * 0.5),
    Math.floor(estimatedCost * 0.75),
    estimatedCost
  ] : [1000, 2500, 5000, 10000];

  const handleSubmit = async () => {
    const fundingAmount = parseInt(amount);
    if (!fundingAmount || fundingAmount <= 0) {
      toast.error("Please enter a valid funding amount");
      return;
    }

    if (!fundingType) {
      toast.error("Please select a funding type");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onConfirm({
        amount: fundingAmount,
        fundingType,
        message: message.trim(),
        isAnonymous
      });
      
  // Reset form
  setAmount("");
  setFundingType("full");
  setMessage("");
  setIsAnonymous(false);
      
  // Success toast is handled by the parent component to avoid duplicates
  onClose();
    } catch (error) {
      toast.error("Failed to submit funding proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border-2 border-orange-200 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg p-6 -m-6 mb-6 border-b-2 border-orange-100">
          <DialogTitle className="flex items-center gap-3 text-orange-800">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <DollarSign className="w-6 h-6 text-orange-600" />
            </motion.div>
            Fund This Project
          </DialogTitle>
          <DialogDescription className="text-orange-700 mt-2">
            Support the community by funding: <span className="font-semibold">"{issueTitle}"</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sponsor Info */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-orange-800">
                  {currentUser?.name || "Anonymous Sponsor"}
                </div>
                <div className="text-sm text-orange-600">
                  {currentUser?.volunteerType === "business" && "Corporate Sponsor"}
                  {currentUser?.volunteerType === "ngo" && "NGO Sponsor"}
                  {!currentUser?.volunteerType && "Community Sponsor"}
                </div>
              </div>
            </div>
          </div>

          {/* Project Cost Info */}
          {estimatedCost && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="font-medium">Estimated Project Cost: ₹{estimatedCost.toLocaleString()}</span>
              </div>
              <p className="text-sm text-blue-700">
                This is the municipal estimate for completing the entire project.
              </p>
            </div>
          )}

          {/* Funding Type */}
          <div className="space-y-2">
            <label className="font-medium text-orange-800">Funding Type *</label>
            <Select value={fundingType} onValueChange={setFundingType}>
              <SelectTrigger className="border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="Select funding type" />
              </SelectTrigger>
              <SelectContent>
                {fundingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Funding Amount */}
          <div className="space-y-3">
            <label className="font-medium text-orange-800">Funding Amount (₹) *</label>
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {suggestedAmounts.map((suggestedAmount, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(suggestedAmount.toString())}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                >
                  ₹{suggestedAmount.toLocaleString()}
                </Button>
              ))}
            </div>

            <Input
              type="number"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-orange-200 focus:border-orange-400"
              min="1"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-orange-800">
              <Heart className="w-4 h-4" />
              Message to Community (Optional)
            </label>
            <Textarea
              placeholder="Share why you're supporting this project or any message for the community..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-16 border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="anonymous" className="text-gray-700 text-sm">
              Fund anonymously (your name won't be displayed publicly)
            </label>
          </div>

          {/* Impact Preview */}
          {amount && parseInt(amount) > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200"
            >
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Your Impact</span>
              </div>
              <p className="text-sm text-green-700">
                Your contribution of ₹{parseInt(amount).toLocaleString()} will help bring this community project to life!
                {estimatedCost && (
                  <span className="block mt-1">
                    This covers {Math.round((parseInt(amount) / estimatedCost) * 100)}% of the estimated project cost.
                  </span>
                )}
              </p>
            </motion.div>
          )}
        </div>

        <DialogFooter className="border-t-2 border-orange-200 pt-6 bg-gradient-to-r from-orange-50/30 to-amber-50/30 rounded-b-lg p-6 -m-6 mt-6">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !amount || !fundingType}
              className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
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
                  Pledge Funding
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}