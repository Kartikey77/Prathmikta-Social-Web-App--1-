import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { SolveActionDialog } from "./SolveActionDialog";
import { FundActionDialog } from "./FundActionDialog";
import { VolunteerStatsPanel } from "./VolunteerStatsPanel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Filter, 
  SortDesc, 
  MapPin, 
  Clock, 
  TrendingUp,
  Zap,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "./LanguageContext";

interface Issue {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  comments: number;
  isUpvoted: boolean;
  status: "pending" | "working" | "solved";
  createdAt: string;
  lastUpdated: string;
  location: string;
  department: string;
  urgency: "low" | "medium" | "high";
  estimatedCost?: number;
  assignedTo?: string;
  isFunded?: boolean;
  fundingAmount?: number;
  images?: string[];
  reportedBy: {
    id: string;
    name: string;
    aadhar: string;
    location: string;
  };
}

interface UnifiedFeedProps {
  userType: "citizen" | "volunteer" | "business" | "municipal";
  userInfo?: any;
  posts?: any[];
  onComment?: (issueId: string) => void;
  onUpvote?: (issueId: string) => void;
  onTakeAction?: (issueId: string, action: 'solve' | 'fund') => void;
}

export function UnifiedFeed({ userType, userInfo, posts = [], onComment, onUpvote, onTakeAction }: UnifiedFeedProps) {
  const { language } = useLanguage();
  const [issues, setIssues] = useState<Issue[]>([]);

  const [sortBy, setSortBy] = useState<"upvotes" | "recent" | "urgent">("upvotes");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "working" | "solved">("all");
  const [loading, setLoading] = useState(true);
  const [selectedIssueForSolve, setSelectedIssueForSolve] = useState<Issue | null>(null);
  const [selectedIssueForFund, setSelectedIssueForFund] = useState<Issue | null>(null);
  const [isSolveDialogOpen, setIsSolveDialogOpen] = useState(false);
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);

  // Convert posts to issues format
  useEffect(() => {
    setLoading(true);
    
    const convertedIssues: Issue[] = posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.content,
      upvotes: post.upvotes || 0,
      comments: post.comments || 0,
      isUpvoted: post.isUpvoted || false,
      status: post.status || "pending",
      createdAt: post.createdAt || "Recently",
      lastUpdated: post.lastUpdated || post.createdAt || "Recently",
      location: post.location || "Delhi, India",
      department: post.department || "General",
      urgency: post.urgency || "medium",
      estimatedCost: post.estimatedCost,
      assignedTo: post.assignedTo,
      images: post.images || [],
      reportedBy: {
        id: post.username || "user",
        name: post.username || "Citizen",
        aadhar: "****-****-****",
        location: post.municipality || "Delhi, India"
      }
    }));

    setIssues(convertedIssues);
    setLoading(false);
  }, [posts]);

  // Optimized sort and filter issues with useMemo
  const filteredIssues = useMemo(() => {
    let filtered = issues;

    if (filterStatus !== "all") {
      filtered = filtered.filter(issue => issue.status === filterStatus);
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "upvotes":
          return b.upvotes - a.upvotes;
        case "recent":
          // For demo, just use a simple ordering since we don't have real dates
          return parseInt(b.id) - parseInt(a.id);
        case "urgent":
          const urgencyOrder = { high: 3, medium: 2, low: 1 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        default:
          return b.upvotes - a.upvotes;
      }
    });
  }, [issues, sortBy, filterStatus]);

  const handleUpvote = useCallback((issueId: string) => {
    if (onUpvote) {
      onUpvote(issueId);
    } else {
      setIssues(prevIssues =>
        prevIssues.map(issue => {
          if (issue.id === issueId) {
            return {
              ...issue,
              upvotes: issue.isUpvoted ? issue.upvotes - 1 : issue.upvotes + 1,
              isUpvoted: !issue.isUpvoted
            };
          }
          return issue;
        })
      );
    }
  }, [onUpvote]);

  const handleComment = useCallback((issueId: string) => {
    if (onComment) {
      onComment(issueId);
    } else {
      console.log("Comment on issue:", issueId);
    }
  }, [onComment]);

  const handleSolveAction = useCallback((issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      setSelectedIssueForSolve(issue);
      setIsSolveDialogOpen(true);
    }
  }, [issues]);

  const handleFundAction = useCallback((issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      setSelectedIssueForFund(issue);
      setIsFundDialogOpen(true);
    }
  }, [issues]);

  const handleSolveConfirm = (data: any) => {
    if (selectedIssueForSolve) {
      setIssues(prevIssues =>
        prevIssues.map(issue => 
          issue.id === selectedIssueForSolve.id 
            ? { ...issue, status: "working" as const, assignedTo: userInfo?.name }
            : issue
        )
      );
      
      console.log('Solve action confirmed:', {
        issueId: selectedIssueForSolve.id,
        volunteer: userInfo?.name,
        data
      });

      // Notify parent if provided; otherwise show confirmation here
      if (onTakeAction) {
        onTakeAction(selectedIssueForSolve.id, 'solve');
      } else {
        toast.success(
          language === 'hi'
            ? 'आप इस समस्या को ठीक करने में मदद कर रहे हैं। स्थिति: प्रगति पर है।'
            : 'You’re helping fix this issue. Marked as In Progress.'
        );
      }
    }
  };

  const handleFundConfirm = (data: any) => {
    if (selectedIssueForFund) {
      console.log("Funding confirmed:", {
        issueId: selectedIssueForFund.id,
        sponsor: userInfo?.name,
        amount: data.amount,
        fundingType: data.fundingType,
        data
      });
      
      setIssues(prevIssues =>
        prevIssues.map(issue => 
          issue.id === selectedIssueForFund.id 
            ? { ...issue, isFunded: true, fundingAmount: data.amount }
            : issue
        )
      );

      // Notify parent if provided; otherwise show confirmation here
      if (onTakeAction) {
        onTakeAction(selectedIssueForFund.id, 'fund');
      } else {
        toast.success(
          language === 'hi'
            ? `फंडिंग सफलतापूर्वक प्रतिबद्ध की गई${data?.amount ? `: ₹${Number(data.amount).toLocaleString()}` : ''}`
            : `Funding pledged successfully${data?.amount ? `: ₹${Number(data.amount).toLocaleString()}` : ''}`
        );
      }
    }
  };

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "pending":
        return <AlertTriangle className="w-4 h-4" />;
      case "working":
        return <Clock className="w-4 h-4" />;
      case "solved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "pending":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "working":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "solved":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-32 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/80 via-white/90 to-green-50/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="text-center py-6">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-2"
          >
            Community Feed
          </motion.h1>
          <p className="text-gray-600">
            {userType === "volunteer" ? "Find issues you can help solve" : "Support community projects through funding"}
          </p>
        </div>

        {/* Volunteer Stats Panel */}
        {(userType === "volunteer" || userType === "business") && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <VolunteerStatsPanel 
              userInfo={userInfo}
              stats={{
                issuesSolved: userType === "business" ? 45 : 12,
                totalFunded: userType === "business" ? 500000 : 0,
                communityReach: userType === "business" ? 50000 : 5000,
                activeProjects: userType === "business" ? 8 : 3,
                level: userType === "business" ? 6 : 3,
                points: userType === "business" ? 1850 : 850
              }}
            />
          </motion.div>
        )}

        {/* Feed Controls */}
        <Card className="bg-white/95 backdrop-blur-sm border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Community Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <Button
                  variant={sortBy === "upvotes" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("upvotes")}
                  className="flex items-center gap-1"
                >
                  <SortDesc className="w-3 h-3" />
                  Upvotes
                </Button>
                <Button
                  variant={sortBy === "recent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("recent")}
                  className="flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  Recent
                </Button>
                <Button
                  variant={sortBy === "urgent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("urgent")}
                  className="flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  Urgent
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("pending")}
                  className="flex items-center gap-1"
                >
                  {getStatusIcon("pending")}
                  Pending
                </Button>
                <Button
                  variant={filterStatus === "working" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("working")}
                  className="flex items-center gap-1"
                >
                  {getStatusIcon("working")}
                  In Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues Feed */}
        <div className="space-y-4">
          {filteredIssues.map((issue, index) => (
            <motion.div
              key={issue.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm border-orange-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Issue Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {issue.reportedBy.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{issue.reportedBy.name}</div>
                          <div className="text-xs text-muted-foreground">{issue.createdAt}</div>
                        </div>
                      </div>
                      <h3 className="font-bold text-blue-900 mb-1">{issue.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{issue.description}</p>
                      {issue.images && issue.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {issue.images.slice(0, 4).map((img, idx) => (
                            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border">
                              <ImageWithFallback
                                src={img}
                                alt={`issue-${issue.id}-img-${idx}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" />
                        <span>{issue.location}</span>
                        <span>•</span>
                        <span>{issue.department}</span>
                        {issue.estimatedCost && (
                          <>
                            <span>•</span>
                            <span>₹{issue.estimatedCost.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(issue.status)}>
                        {getStatusIcon(issue.status)}
                        <span className="ml-1 capitalize">{issue.status}</span>
                      </Badge>
                      <Badge variant="outline" className={
                        issue.urgency === "high" ? "text-red-600 bg-red-50 border-red-200" :
                        issue.urgency === "medium" ? "text-yellow-600 bg-yellow-50 border-yellow-200" :
                        "text-green-600 bg-green-50 border-green-200"
                      }>
                        {issue.urgency}
                      </Badge>
                      {issue.isFunded && (
                        <Badge className="text-orange-600 bg-orange-50 border-orange-200">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Funded
                        </Badge>
                      )}
                      {issue.assignedTo && (
                        <Badge className="text-blue-600 bg-blue-50 border-blue-200">
                          Assigned
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleUpvote(issue.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                          issue.isUpvoted 
                            ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-md' 
                            : 'text-blue-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100 border border-orange-200 hover:border-orange-300'
                        }`}
                      >
                        <TrendingUp className={`w-4 h-4 ${issue.isUpvoted ? 'fill-current' : ''}`} />
                        <span className="font-medium">{issue.upvotes}</span>
                        <span className="text-sm">Upvote</span>
                      </button>
                      
                      <button
                        onClick={() => handleComment(issue.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100 border border-orange-200 hover:border-orange-300 transition-all duration-200"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium">{issue.comments}</span>
                        <span className="text-sm">Comments</span>
                      </button>
                    </div>
                  </div>

                  {/* User-specific Action Buttons */}
                  {(userType === "volunteer" || userType === "business") && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex gap-2">
                        {userType === "volunteer" && (
                          <Button
                            onClick={() => handleSolveAction(issue.id)}
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                            size="sm"
                          >
                            I can solve this
                          </Button>
                        )}
                        {userType === "business" && (
                          <Button
                            onClick={() => handleFundAction(issue.id)}
                            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
                            size="sm"
                          >
                            Fund this project
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Dialogs */}
        {selectedIssueForSolve && (
          <SolveActionDialog
            isOpen={isSolveDialogOpen}
            onClose={() => {
              setIsSolveDialogOpen(false);
              setSelectedIssueForSolve(null);
            }}
            issueTitle={selectedIssueForSolve.title}
            issueId={selectedIssueForSolve.id}
            estimatedCost={selectedIssueForSolve.estimatedCost}
            currentUser={userInfo}
            onConfirm={handleSolveConfirm}
          />
        )}

        {selectedIssueForFund && (
          <FundActionDialog
            isOpen={isFundDialogOpen}
            onClose={() => {
              setIsFundDialogOpen(false);
              setSelectedIssueForFund(null);
            }}
            issueTitle={selectedIssueForFund.title}
            issueId={selectedIssueForFund.id}
            estimatedCost={selectedIssueForFund.estimatedCost}
            currentUser={userInfo}
            onConfirm={handleFundConfirm}
          />
        )}

        {filteredIssues.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">
              No issues found
            </h3>
            <p className="text-muted-foreground">
              Try changing your filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}