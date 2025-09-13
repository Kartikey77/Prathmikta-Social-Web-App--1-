import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronUp, MessageCircle, Share2, Clock, CheckCircle, AlertCircle, Play, CheckCheck, Filter } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Post {
  id: string;
  username: string;
  title: string;
  content: string;
  images?: string[];
  upvotes: number;
  comments: number;
  status?: "pending" | "working" | "solved";
  createdAt: string;
  lastUpdated: string;
}

interface MunicipalDashboardProps {
  onNavigate: (page: string) => void;
  posts: Post[];
  onUpdatePostStatus: (postId: string, newStatus: "pending" | "working" | "solved") => void;
  userInfo: { username: string; name: string };
}

export function MunicipalDashboard({ onNavigate, posts, onUpdatePostStatus, userInfo }: MunicipalDashboardProps) {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const getStatusIcon = (status: Post["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "working":
        return <AlertCircle className="w-4 h-4" />;
      case "solved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Post["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "working":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "solved":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  const canUpdateStatus = (currentStatus: Post["status"], newStatus: "pending" | "working" | "solved") => {
    if (currentStatus === "pending" && (newStatus === "working" || newStatus === "solved")) return true;
    if (currentStatus === "working" && newStatus === "solved") return true;
    return false;
  };

  const handleStatusUpdate = (postId: string, newStatus: "pending" | "working" | "solved") => {
    onUpdatePostStatus(postId, newStatus);
  };

  const filterPostsByStatus = (status: Post["status"]) => {
    return sortedPosts.filter(post => post.status === status);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const getStatusStats = () => {
    const pending = posts.filter(p => p.status === "pending").length;
    const working = posts.filter(p => p.status === "working").length;
    const solved = posts.filter(p => p.status === "solved").length;
    return { pending, working, solved };
  };

  const stats = getStatusStats();

  const PostCard = ({ post }: { post: Post }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {post.username.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">{post.username}</span>
            </div>
            <h3 className="font-medium mb-2">{post.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="outline" 
                className={`${getStatusColor(post.status)} flex items-center gap-1`}
              >
                {getStatusIcon(post.status)}
                {post.status?.charAt(0).toUpperCase() + post.status?.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{post.content}</p>
        
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {post.images.map((image, index) => (
              <ImageWithFallback
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Reported: {new Date(post.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(post.lastUpdated).toLocaleDateString()}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 border-t border-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ChevronUp className="w-4 h-4" />
              <span>{post.upvotes}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {post.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(post.id, "working")}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Work
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(post.id, "solved")}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark Resolved
                </Button>
              </>
            )}
            
            {post.status === "working" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusUpdate(post.id, "solved")}
                className="flex items-center gap-2 text-green-600 hover:text-green-700"
              >
                <CheckCheck className="w-4 h-4" />
                Mark Resolved
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-2">Municipal Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome, {userInfo.name} - Manage civic issues reported by citizens
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={sortOrder} onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Issues</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">{stats.working}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                    <p className="text-2xl font-bold">{stats.solved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All Issues ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="working">
              In Progress ({stats.working})
            </TabsTrigger>
            <TabsTrigger value="solved">
              Resolved ({stats.solved})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {sortedPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No civic issues reported yet.</p>
              </div>
            ) : (
              sortedPosts.map(post => <PostCard key={post.id} post={post} />)
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {filterPostsByStatus("pending").map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            {filterPostsByStatus("pending").length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No pending issues.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="working" className="space-y-4">
            {filterPostsByStatus("working").map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            {filterPostsByStatus("working").length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No issues currently in progress.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="solved" className="space-y-4">
            {filterPostsByStatus("solved").map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            {filterPostsByStatus("solved").length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No resolved issues yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}