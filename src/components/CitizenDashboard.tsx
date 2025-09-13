import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { useLanguage } from "./LanguageContext";
import { UnifiedFeed } from "./UnifiedFeed";
import { 
  MapPin, 
  Plus, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Share2,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  User,
  FileText
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  username: string;
  upvotes: number;
  comments: number;
  images?: string[];
  status?: "pending" | "working" | "solved";
  isUpvoted: boolean;
  priority?: number;
  timeAgo?: string;
  department?: string;
  isAnonymous?: boolean;
}

interface CitizenDashboardProps {
  onNavigate: (page: string) => void;
  posts: Post[];
  userPoints: number;
  userLocation: string;
  onUpvote: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onViewIssue: (issueId: string) => void;
}

export function CitizenDashboard({ 
  onNavigate, 
  posts, 
  userPoints = 150, 
  userLocation = "Connaught Place, New Delhi",
  onUpvote,
  onComment,
  onShare,
  onViewIssue
}: CitizenDashboardProps) {
  const { t, language } = useLanguage();
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"feed" | "overview" | "reports">("overview");

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'hi' ? 'सुप्रभात' : 'Good morning';
    if (hour < 17) return language === 'hi' ? 'नमस्कार' : 'Good afternoon';
    return language === 'hi' ? 'शुभ संध्या' : 'Good evening';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-3 h-3" />;
      case "working": return <Settings className="w-3 h-3" />;
      case "solved": return <CheckCircle className="w-3 h-3" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "working": return "text-blue-600 bg-blue-50 border-blue-200";
      case "solved": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityIndicator = (priority: number) => {
    if (priority >= 20) return "🔥";
    if (priority >= 5) return "⚡";
    return "📍";
  };

  const handleTakeAction = (issueId: string, action: "solve" | "fund") => {
    console.log(`Citizen cannot ${action} issue ${issueId} - redirecting to appropriate action`);
    // Citizens can upvote or share, but not directly solve or fund
    if (action === "solve") {
      onUpvote(issueId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-1">
                {greeting()}, {language === 'hi' ? 'नागरिक!' : 'Citizen!'}
              </h1>
              <div className="flex items-center gap-2 text-blue-100">
                <MapPin className="w-4 h-4" />
                <span>{userLocation}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-white/90">{language === 'hi' ? 'अंक' : 'Points'}</div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="font-medium">{userPoints}</span>
              </div>
            </div>
          </div>

          {/* Anonymous Mode Toggle */}
          <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{language === 'hi' ? 'गुमनाम मोड' : 'Anonymous Mode'}</span>
            </div>
            <Switch
              checked={anonymousMode}
              onCheckedChange={setAnonymousMode}
              className="data-[state=checked]:bg-orange-500"
            />
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Quick Report Button */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => onNavigate("compose")}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg"
          >
            <Plus className="w-6 h-6 mr-3" />
            <div className="font-medium">{language === 'hi' ? 'समस्या रिपोर्ट करें' : 'Report an Issue'}</div>
          </Button>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-blue-200">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "feed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("feed")}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  {language === 'hi' ? 'सामुदायिक फीड' : 'Community Feed'}
                </Button>
                <Button
                  variant={activeTab === "overview" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("overview")}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {language === 'hi' ? 'अवलोकन' : 'Overview'}
                </Button>
                <Button
                  variant={activeTab === "reports" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("reports")}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {language === 'hi' ? 'मेरी रिपोर्टें' : 'My Reports'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Content */}
        {activeTab === "feed" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <UnifiedFeed 
              userType="citizen" 
              userInfo={{ anonymousMode }}
              posts={posts}
              onTakeAction={handleTakeAction}
              onComment={onComment}
              onUpvote={onUpvote}
            />
          </motion.div>
        )}

        {activeTab === "overview" && (
          <div className="space-y-6">
        {/* My Reports Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {language === 'hi' ? 'मेरी रिपोर्टें' : 'My Reports'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-yellow-600 font-medium">3</div>
                  <div className="text-muted-foreground">{language === 'hi' ? 'लंबित' : 'Pending'}</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-600 font-medium">2</div>
                  <div className="text-muted-foreground">{language === 'hi' ? 'प्रगति में' : 'In Progress'}</div>
                </div>
                <div className="text-center">
                  <div className="text-green-600 font-medium">8</div>
                  <div className="text-muted-foreground">{language === 'hi' ? 'हल हो गया' : 'Resolved'}</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => onNavigate("posts")}
              >
                {language === 'hi' ? 'सभी देखें' : 'View All'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

            {/* Points Leaderboard Teaser */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{language === 'hi' ? 'समुदायिक चैंपियन' : 'Community Champion'}</div>
                        <div className="text-muted-foreground">{language === 'hi' ? 'रैंकिंग #12' : 'Ranking #12'}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-orange-600">{userPoints}</div>
                      <div className="text-muted-foreground">{language === 'hi' ? 'अंक' : 'Points'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {activeTab === "reports" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Enhanced My Reports */}
            <Card className="bg-white/95 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {language === 'hi' ? 'मेरी रिपोर्टें' : 'My Reports'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-yellow-600 font-bold text-xl">3</div>
                    <div className="text-muted-foreground text-sm">{language === 'hi' ? 'लंबित' : 'Pending'}</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-blue-600 font-bold text-xl">2</div>
                    <div className="text-muted-foreground text-sm">{language === 'hi' ? 'प्रगति में' : 'In Progress'}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-green-600 font-bold text-xl">8</div>
                    <div className="text-muted-foreground text-sm">{language === 'hi' ? 'हल हो गया' : 'Resolved'}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {posts.filter(post => post.username === "You" || post.isAnonymous).slice(0, 3).map((post, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{post.title}</div>
                        <div className="text-muted-foreground text-xs">{post.timeAgo}</div>
                      </div>
                      <Badge className={getStatusColor(post.status || "pending")}>
                        {getStatusIcon(post.status || "pending")}
                        <span className="ml-1">
                          {post.status === "pending" ? (language === 'hi' ? 'लंबित' : 'Pending') :
                           post.status === "working" ? (language === 'hi' ? 'प्रगति में' : 'In Progress') :
                           (language === 'hi' ? 'हल हो गया' : 'Resolved')}
                        </span>
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => onNavigate("posts")}
                >
                  {language === 'hi' ? 'सभी देखें' : 'View All Reports'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}