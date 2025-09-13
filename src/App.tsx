import { useState, useEffect } from "react";
import { LanguageProvider } from "./components/LanguageContext";
import { Navigation } from "./components/Navigation";
import { DemoModeIndicator } from "./components/DemoModeIndicator";
import { HomePage } from "./components/HomePage";
import { ComposePage } from "./components/ComposePage";
import { EnhancedComposePage } from "./components/EnhancedComposePage";
import { UnifiedFeed } from "./components/UnifiedFeed";
import { CitizenDashboard } from "./components/CitizenDashboard";
import { VolunteerDashboard } from "./components/VolunteerDashboard";
import { CommentDialog } from "./components/CommentDialog";

import { AadharVerificationPage } from "./components/AadharVerificationPage";
import { RoleSelectionPage } from "./components/RoleSelectionPage";
import { VolunteerTypeSelection } from "./components/VolunteerTypeSelection";

import { UserProfile, mockUserInfo } from "./components/UserProfile";
import { ProfilePage } from "./components/ProfilePage";
import { MyPostsPage } from "./components/MyPostsPage";
import { LoginPage } from "./components/LoginPage";
import { MunicipalDashboard } from "./components/MunicipalDashboard";
import { MunicipalitySelection } from "./components/MunicipalitySelection";
import { IssueDetailsPage } from "./components/IssueDetailsPage";
import { UserModeSwitch } from "./components/UserModeSwitch";

import { Toaster } from "./components/ui/sonner";
import { motion } from "motion/react";
import { 
  getPosts, 
  updatePostUpvotes, 
  updatePostStatus, 
  addPost, 
  getUserMunicipality, 
  setUserMunicipality,
  Post as DataPost
} from "./services/supabaseDataManager";
import { toast } from "sonner";

// Using Post interface from dataManager
type Post = DataPost & {
  isMyPost?: boolean;
};

interface User {
  type: "citizen" | "volunteer" | "municipal";
  username: string;
  name: string;
  volunteerType?: "ngo" | "student" | "citizen" | "business";
  skills?: string[];
}

interface Municipality {
  id: string;
  name: string;
  state: string;
  district: string;
  population: string;
  area: string;
}

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [currentPage, setCurrentPage] = useState("aadhar");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isAadharVerified, setIsAadharVerified] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"citizen" | "volunteer" | null>(null);
  const [userInfo, setUserInfo] = useState(mockUserInfo);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedPostForComment, setSelectedPostForComment] = useState<{ id: string; title: string } | null>(null);
  const [isModeSwitchOpen, setIsModeSwitchOpen] = useState(false);

  // Load data on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize the app - in demo mode this will use localStorage
        const { initializeApp } = await import('./utils/initializeApp');
        const isSupabaseConnected = await initializeApp();
        
        // Load data silently - connection status already logged by initializeApp
        // App is ready with either Supabase or localStorage storage
        
        const posts = await getPosts();
        setAllPosts(posts);
        
        // Load user's municipality selection
        const savedMunicipality = await getUserMunicipality();
        if (savedMunicipality) {
          setSelectedMunicipality(JSON.parse(savedMunicipality));
        }


      } catch (error) {
        // In demo mode, this is expected - continue with localStorage
        setAllPosts([]);
      }
    };
    
    loadData();
  }, []);


  // Get user's own posts from all posts
  const myPosts = allPosts.filter((post: Post) => post.username === currentUser?.username);

  const handleAadharVerification = () => {
    setIsAadharVerified(true);
    setCurrentPage("role-selection");
  };

  const handleRoleSelection = (role: "citizen" | "volunteer") => {
    setSelectedRole(role);
    
    if (role === "volunteer") {
      // Show volunteer type selection
      setCurrentPage("volunteer-type-selection");
    } else {
      // Use a single consistent citizen profile
      const randomProfile = { name: 'Priya Gupta', username: 'priyagupta_citizen' };
      
      setCurrentUser({ 
        type: role, 
        username: randomProfile.username, 
        name: randomProfile.name 
      });
      
      setCurrentPage("citizen-dashboard");
    }
  };

  const handleVolunteerTypeSelection = (volunteerType: "ngo" | "student" | "citizen" | "business", additionalInfo?: any) => {
    if (!selectedRole) return;
    
    // Generate different volunteer names and data based on type
    const volunteerProfiles = {
      ngo: {
        name: 'Rita Sharma',
        username: 'ritasharma_ngo',
        skills: ['Community Organization', 'Project Management', 'Social Work']
      },
      student: {
        name: 'Amit Kumar',
        username: 'amitkumar_student', 
        skills: ['Technical Support', 'Digital Literacy', 'Youth Organization']
      },
      citizen: {
        name: 'Sunita Devi',
        username: 'sunitadevi_volunteer',
        skills: ['Environment Protection', 'Cleanliness Drive', 'Awareness Programs']
      },
      business: {
        name: 'Raj Malhotra',
        username: 'rajmalhotra_corp',
        skills: ['Corporate Funding', 'CSR Management', 'Business Partnership']
      }
    };

    const profile = volunteerProfiles[volunteerType];
    
    setCurrentUser({ 
      type: selectedRole, 
      username: profile.username, 
      name: profile.name,
      volunteerType,
      skills: profile.skills
    });
    
    setCurrentPage("volunteer-dashboard");
  };

  const handleLogin = (userType: "citizen" | "municipal", userInfo: { username: string; name: string }) => {
    setCurrentUser({ type: userType, ...userInfo });
    if (userType === "municipal") {
      setCurrentPage("municipal");
    } else {
      // Citizens need to select municipality first
      if (!selectedMunicipality) {
        setCurrentPage("municipality-selection");
      } else {
        setCurrentPage("citizen-dashboard");
      }
    }
  };

  const handleMunicipalitySelection = async (municipality: Municipality) => {
    setSelectedMunicipality(municipality);
    await setUserMunicipality(JSON.stringify(municipality));
    setCurrentPage("citizen-dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedMunicipality(null);
    setIsAadharVerified(false);
    setSelectedRole(null);
    setCurrentPage("aadhar");
  };

  const handleEditProfile = () => {
    // In a real app, this would open an edit profile modal/page
    console.log("Edit profile functionality");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Handle switching user mode from navbar
  const handleModeChange = (newMode: "citizen" | "volunteer", volunteerType?: "ngo" | "student" | "citizen" | "business") => {
    if (newMode === 'citizen') {
      setCurrentUser({ type: 'citizen', username: 'priyagupta_citizen', name: 'Priya Gupta' });
      setCurrentPage('citizen-dashboard');
      return;
    }
    // volunteer mode
    const volunteerProfiles = {
      ngo: { name: 'Rita Sharma', username: 'ritasharma_ngo', skills: ['Community Organization', 'Project Management', 'Social Work'] },
      student: { name: 'Amit Kumar', username: 'amitkumar_student', skills: ['Technical Support', 'Digital Literacy', 'Youth Organization'] },
      citizen: { name: 'Sunita Devi', username: 'sunitadevi_volunteer', skills: ['Environment Protection', 'Cleanliness Drive', 'Awareness Programs'] },
      business: { name: 'Raj Malhotra', username: 'rajmalhotra_corp', skills: ['Corporate Funding', 'CSR Management', 'Business Partnership'] }
    } as const;
    const vt = (volunteerType || 'citizen') as keyof typeof volunteerProfiles;
    const profile = volunteerProfiles[vt];
  setCurrentUser({ type: 'volunteer', username: profile.username, name: profile.name, volunteerType: vt, skills: [...profile.skills] });
    setCurrentPage('volunteer-dashboard');
  };

  const handleViewIssue = (issueId: string) => {
    setSelectedIssueId(issueId);
    setCurrentPage("issue-details");
  };

  const handleUpvote = async (postId: string) => {
    try {
      const updatedPosts = await updatePostUpvotes(postId);
      setAllPosts(updatedPosts);
      toast.success('Vote updated successfully');
    } catch (error) {
      console.error('Error updating upvote:', error);
      toast.error('Failed to update vote');
    }
  };

  const handleComment = (postId: string) => {
  const post = allPosts.find((p: Post) => p.id === postId);
    if (post) {
      setSelectedPostForComment({ id: postId, title: post.title });
      setIsCommentDialogOpen(true);
    }
  };

  const handleShare = (postId: string) => {
    console.log("Share post:", postId);
  };

  const handleCreatePost = async (title: string, content: string, images: string[], metadata?: any) => {
    if (!currentUser) return;
    
    try {
      const newPost = await addPost({
        username: metadata?.isAnonymous ? 'Anonymous Citizen' : currentUser.username,
        title,
        content,
        images: images.length > 0 ? images : undefined,
        upvotes: 0,
        comments: 0,
        isUpvoted: false,
        status: "pending",
        municipality: selectedMunicipality?.name || "Delhi Municipal Corporation",
        ...metadata
      });

      // Refresh posts from storage
      const updatedPosts = await getPosts();
      setAllPosts(updatedPosts);
      
      toast.success('Issue submitted successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to submit issue');
    }
  };

  const handleCloseCommentDialog = async () => {
    setIsCommentDialogOpen(false);
    setSelectedPostForComment(null);
    // Refresh posts to update comment counts
    try {
      const updatedPosts = await getPosts();
      setAllPosts(updatedPosts);
    } catch (error) {
      console.error('Error refreshing posts:', error);
    }
  };

  const handleDeleteMyPost = (postId: string) => {
    // For simplicity, we'll just hide the post from UI
    // In a real app, you'd want a proper delete function in dataManager
  const updatedPosts = allPosts.filter((post: Post) => post.id !== postId);
    setAllPosts(updatedPosts);
    toast.success('Post deleted successfully');
  };

  const handleUpdateMyPost = (postId: string, updates: Partial<Post>) => {
    // For simplicity, update in memory only
    // In a real app, you'd want a proper update function in dataManager
    setAllPosts((prev: Post[]) => 
      prev.map((post: Post) => post.id === postId ? { ...post, ...updates, lastUpdated: 'Now' } : post)
    );
    toast.success('Post updated successfully');
  };

  // Municipal officer functionality
  const handleUpdatePostStatus = async (postId: string, newStatus: "pending" | "working" | "solved") => {
    try {
      const updatedPosts = await updatePostStatus(postId, newStatus);
      setAllPosts(updatedPosts);
      
      const statusText = newStatus === "pending" ? 'Pending' : 
                        newStatus === "working" ? 'Working' : 'Solved';
      toast.success(`Status updated: ${statusText}`);
    } catch (error) {
      console.error('Error updating post status:', error);
      toast.error('Failed to update status');
    }
  };

  // Authentication flow
  if (!isAadharVerified) {
    if (currentPage === "aadhar") {
      return <AadharVerificationPage onVerificationComplete={handleAadharVerification} />;
    }
  }

  if (isAadharVerified && !currentUser) {
    if (currentPage === "role-selection") {
      return <RoleSelectionPage onRoleSelect={handleRoleSelection} />;
    }
    if (currentPage === "volunteer-type-selection") {
      return <VolunteerTypeSelection onTypeSelect={handleVolunteerTypeSelection} />;
    }
  }

  // Fallback to old login for municipal users
  if (!currentUser && currentPage === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "aadhar":
        return <AadharVerificationPage onVerificationComplete={handleAadharVerification} />;
      case "role-selection":
        return <RoleSelectionPage onRoleSelect={handleRoleSelection} />;
      case "citizen-dashboard":
        return (
          <CitizenDashboard 
            onNavigate={handleNavigate}
            posts={allPosts as any}
            userPoints={150}
            userLocation="Connaught Place, New Delhi"
            onUpvote={handleUpvote}
            onComment={handleComment}
            onShare={handleShare}
            onViewIssue={handleViewIssue}
          />
        );
      case "volunteer-dashboard":
        const volunteerData = {
          ngo: {
            userLevel: 5,
            userPoints: 1250,
            userLocation: 'Karol Bagh, New Delhi',
            companyName: 'Jan Kalyan NGO',
            totalSpent: 200000,
            issuesFunded: 35,
            communityReach: 25000
          },
          student: {
            userLevel: 2,
            userPoints: 520,
            userLocation: 'DU Campus, Delhi',
            companyName: 'Delhi University',
            totalSpent: 0,
            issuesFunded: 8,
            communityReach: 5000
          },
          citizen: {
            userLevel: 4,
            userPoints: 980,
            userLocation: 'Lajpat Nagar, New Delhi',
            companyName: 'Independent Volunteer',
            totalSpent: 15000,
            issuesFunded: 18,
            communityReach: 8000
          },
          business: {
            userLevel: 6,
            userPoints: 1850,
            userLocation: 'Gurgaon Cyber City',
            companyName: 'Tech Innovation Pvt Ltd',
            totalSpent: 500000,
            issuesFunded: 45,
            communityReach: 50000
          }
        };

  const vt = (currentUser?.volunteerType || 'citizen') as keyof typeof volunteerData;
  const currentData = volunteerData[vt];

        return (
          <VolunteerDashboard 
            onNavigate={handleNavigate}
            userSkills={currentUser?.skills || ['Community Service']}
            userLevel={currentData.userLevel}
            userPoints={currentData.userPoints}
            userLocation={currentData.userLocation}
            userInfo={currentUser}
            volunteerType={currentUser?.volunteerType}
            companyName={currentData.companyName}
            totalSpent={currentData.totalSpent}
            issuesFunded={currentData.issuesFunded}
            communityReach={currentData.communityReach}
            posts={allPosts as any}
            onComment={handleComment}
            onUpvote={handleUpvote}
          />
        );
      case "municipality-selection":
        return (
          <MunicipalitySelection 
            onSelectMunicipality={handleMunicipalitySelection}
          />
        );
      case "home":
        return (
            <HomePage 
            onNavigate={handleNavigate}
              posts={allPosts as any}
            onUpvote={handleUpvote}
            onComment={handleComment}
            onShare={handleShare}
            onViewIssue={handleViewIssue}
          />
        );
      case "compose":
        // Only allow citizens to compose posts
        if (currentUser?.type === "citizen") {
          return (
            <EnhancedComposePage 
              onNavigate={handleNavigate}
              onCreatePost={handleCreatePost}
            />
          );
        } else if (currentUser?.type === "municipal") {
          return (
            <ComposePage 
              onNavigate={handleNavigate}
              onCreatePost={handleCreatePost}
            />
          );
        } else {
          // Volunteers cannot create posts
          return (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <p className="text-muted-foreground">Only citizens can create posts</p>
            </div>
          );
        }
      // municipality-info route removed
      case "issue-details":
        // Allow all logged-in users to view issue details
        if (!currentUser || !selectedIssueId) {
          return (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          );
        }
        return (
          <IssueDetailsPage 
            issueId={selectedIssueId}
            onNavigate={handleNavigate}
            userType={currentUser.type}
            currentUserId={currentUser.username}
          />
        );
      case "profile":
        return (
          <ProfilePage 
            onNavigate={handleNavigate} 
            onLogout={handleLogout}
            currentUser={currentUser || undefined}
            selectedMunicipality={selectedMunicipality || undefined}
          />
        );
      case "posts":
        // Only show citizen's own posts
        if (!currentUser || currentUser.type !== "citizen") {
          return (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <p className="text-muted-foreground">Only citizens can view their posts</p>
            </div>
          );
        }
        return (
          <MyPostsPage 
            onNavigate={handleNavigate}
            posts={myPosts.map((post: any) => ({ ...post, isMyPost: true, status: post.status || 'pending' })) as any}
            onDeletePost={handleDeleteMyPost}
            onUpdatePost={handleUpdateMyPost}
          />
        );
      case "community":
        // Show community feed for volunteers
        if (currentUser?.type === "volunteer") {
          return (
            <UnifiedFeed 
              userType={currentUser?.volunteerType === 'business' ? 'business' : 'volunteer'}
              userInfo={currentUser}
              posts={allPosts}
              onComment={handleComment}
              onUpvote={handleUpvote}
            />
          );
        } else {
          return (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <p className="text-muted-foreground">Only volunteers can access the community feed</p>
            </div>
          );
        }
      case "tasks":
        // Show tasks page for volunteers - redirect to volunteer dashboard projects tab
        if (currentUser?.type === "volunteer") {
          return (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          );
        } else {
          return (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <p className="text-muted-foreground">Only volunteers can access tasks</p>
            </div>
          );
        }
      case "municipal":
        // Only allow municipal officers
        if (!currentUser || currentUser.type !== "municipal") {
          return (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <p className="text-muted-foreground">Only municipal officers can access this page</p>
            </div>
          );
        }
        return (
          <MunicipalDashboard 
            onNavigate={handleNavigate}
            posts={allPosts as any}
            onUpdatePostStatus={handleUpdatePostStatus}
            userInfo={currentUser}
          />
        );
      default:
        // Default to appropriate dashboard based on user type
        if (currentUser?.type === "citizen") {
          return (
            <CitizenDashboard 
              onNavigate={handleNavigate}
              posts={allPosts as any}
              userPoints={150}
              userLocation="Connaught Place, New Delhi"
              onUpvote={handleUpvote}
              onComment={handleComment}
              onShare={handleShare}
              onViewIssue={handleViewIssue}
            />
          );
        } else if (currentUser?.type === "volunteer") {
          return (
            <VolunteerDashboard 
              onNavigate={handleNavigate}
              userSkills={currentUser?.skills || ["Plumbing", "Electrical", "Community Organizing"]}
              userLevel={3}
              userPoints={850}
              userLocation="Connaught Place, New Delhi"
              userInfo={currentUser}
              volunteerType={currentUser?.volunteerType}
              companyName="Tech Solutions Pvt Ltd"
              totalSpent={125000}
              issuesFunded={23}
              communityReach={15000}
              posts={allPosts as any}
              onComment={handleComment}
              onUpvote={handleUpvote}
            />
          );

        } else {
          return (
            <HomePage 
              onNavigate={handleNavigate}
              posts={allPosts as any}
              onUpvote={handleUpvote}
              onComment={handleComment}
              onShare={handleShare}
              onViewIssue={handleViewIssue}
            />
          );
        }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Indian Flag Pattern Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="h-1/3 bg-gradient-to-r from-orange-400 to-orange-500"></div>
        <div className="h-1/3 bg-white"></div>
        <div className="h-1/3 bg-gradient-to-r from-green-600 to-green-700"></div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-24 h-24 border-2 border-blue-800/20 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-800/20 rounded-full"></div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 min-h-screen bg-gradient-to-br from-orange-50/80 via-white/90 to-green-50/80 backdrop-blur-sm">
        {currentUser && currentPage !== "municipality-selection" && currentPage !== "aadhar" && currentPage !== "role-selection" && (
          <Navigation
            currentPage={currentPage}
            onNavigate={handleNavigate}
            userType={currentUser.type === 'municipal' ? 'municipal' : currentUser.type === 'volunteer' ? 'volunteer' : 'citizen'}
            userInfo={{ name: currentUser.name, username: currentUser.username }}
            selectedMunicipality={selectedMunicipality}
            onLogout={handleLogout}
            onOpenModeSwitch={() => setIsModeSwitchOpen(true)}
          />
        )}
        {renderPage()}
        <DemoModeIndicator />
        <Toaster />
        
        {/* Comment Dialog */}
        {selectedPostForComment && (
          <CommentDialog
            isOpen={isCommentDialogOpen}
            onClose={handleCloseCommentDialog}
            postTitle={selectedPostForComment.title}
            postId={selectedPostForComment.id}
            currentUser={currentUser || undefined}
          />
        )}

        {/* User Mode Switcher Dialog */}
        {currentUser && (currentUser.type === 'citizen' || currentUser.type === 'volunteer') && (
          <UserModeSwitch
            isOpen={isModeSwitchOpen}
            onClose={() => setIsModeSwitchOpen(false)}
            currentMode={currentUser.type === 'volunteer' ? 'volunteer' : 'citizen'}
            currentVolunteerType={currentUser.type === 'volunteer' ? currentUser.volunteerType : undefined}
            onModeChange={handleModeChange}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}