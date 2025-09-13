import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { useLanguage } from "./LanguageContext";
import { UnifiedFeed } from "./UnifiedFeed";
import { MarketingCampaignDialog } from "./MarketingCampaignDialog";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { 
  MapPin, 
  Wrench, 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  Star,
  Users,
  Zap,
  Award,
  TrendingUp,
  Settings,
  Hammer,
  Lightbulb,
  Heart,
  Building2,
  DollarSign,
  BarChart3,
  Eye,
  Download,
  Calendar,
  Megaphone,
  Play,
  Pause,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: string;
  points: number;
  skills: string[];
  location: string;
  urgency: "low" | "medium" | "high";
  department: string;
  requiredVolunteers: number;
  currentVolunteers: number;
}

interface SponsorshipOpportunity {
  id: string;
  title: string;
  description: string;
  cost: number;
  impact: string;
  category: string;
  urgency: "low" | "medium" | "high";
  location: string;
  estimatedReach: number;
  deadline: string;
  currentFunding: number;
  requiredFunding: number;
  sponsors: number;
}

interface MarketingCampaign {
  id: string;
  companyName: string;
  name: string;
  objective: string;
  budget: number[];
  duration: number;
  status: "pending_approval" | "active" | "paused" | "completed" | "rejected";
  createdAt: string;
  estimatedReach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  targetAudience: {
    ageRange: number[];
    locations: string[];
    interests: string[];
    userTypes: string[];
  };
  adCreative: {
    type: string;
    title: string;
    description: string;
    callToAction: string;
    imageUrl: string;
    videoUrl: string;
  };
}

interface VolunteerDashboardProps {
  onNavigate: (page: string) => void;
  userSkills: string[];
  userLevel: number;
  userPoints: number;
  userLocation: string;
  userInfo?: any;
  volunteerType?: "ngo" | "student" | "citizen" | "business";
  companyName?: string;
  totalSpent?: number;
  issuesFunded?: number;
  communityReach?: number;
  posts?: any[];
  onComment?: (issueId: string) => void;
  onUpvote?: (issueId: string) => void;
}

export function VolunteerDashboard({ 
  onNavigate, 
  userSkills = ["Plumbing", "Electrical", "Community Organizing"],
  userLevel = 3,
  userPoints = 850,
  userLocation = "Connaught Place, New Delhi",
  userInfo,
  volunteerType = "citizen",
  companyName = "Tech Solutions Pvt Ltd",
  totalSpent = 125000,
  issuesFunded = 23,
  communityReach = 15000,
  posts = [],
  onComment,
  onUpvote
}: VolunteerDashboardProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "feed" | "projects" | "sponsorship">("feed");
  
  const [activeProjects] = useState([
    {
      id: "1",
      title: language === 'hi' ? "पार्क की सफाई अभियान" : "Park Cleanup Drive",
      progress: 75,
      participants: 12,
      deadline: "3 days"
    },
    {
      id: "2", 
      title: language === 'hi' ? "स्ट्रीट लाइट मरम्मत" : "Street Light Repair",
      progress: 40,
      participants: 3,
      deadline: "1 week"
    }
  ]);

  const [availableTasks] = useState<Task[]>([
    {
      id: "1",
      title: language === 'hi' ? "फूटपाथ की मरम्मत" : "Footpath Repair",
      description: language === 'hi' ? "मुख्य बाजार में क्षतिग्रस्त फूटपाथ की मरम्मत" : "Fix damaged footpath in main market area",
      difficulty: "medium",
      estimatedTime: "4 hours",
      points: 50,
      skills: ["Construction", "Safety"],
      location: "Central Market",
      urgency: "high",
      department: language === 'hi' ? "सड़क" : "Roads",
      requiredVolunteers: 4,
      currentVolunteers: 1
    },
    {
      id: "2",
      title: language === 'hi' ? "पानी की पाइप लीकेज" : "Water Pipe Leakage",
      description: language === 'hi' ? "आवासीय क्षेत्र में पानी के पाइप की मरम्मत" : "Fix water pipe leakage in residential area",
      difficulty: "hard",
      estimatedTime: "6 hours", 
      points: 80,
      skills: ["Plumbing", "Tools"],
      location: "Sector 15",
      urgency: "high",
      department: language === 'hi' ? "जल" : "Water",
      requiredVolunteers: 2,
      currentVolunteers: 0
    },
    {
      id: "3",
      title: language === 'hi' ? "सामुदायिक बगीचा" : "Community Garden",
      description: language === 'hi' ? "नए पौधे लगाना और बगीचे की देखभाल" : "Plant new saplings and maintain garden area",
      difficulty: "easy",
      estimatedTime: "2 hours",
      points: 25,
      skills: ["Gardening", "Community"],
      location: "Block A Park",
      urgency: "low",
      department: language === 'hi' ? "पर्यावरण" : "Environment",
      requiredVolunteers: 8,
      currentVolunteers: 3
    }
  ]);

  const [leaderboard] = useState([
    { name: "Rajesh Kumar", points: 1250, rank: 1 },
    { name: "Priya Sharma", points: 1100, rank: 2 },
    { name: "You", points: userPoints, rank: 3 },
    { name: "Amit Singh", points: 720, rank: 4 },
    { name: "Sunita Devi", points: 650, rank: 5 }
  ]);

  // Business sponsorship data
  const [sponsorshipOpportunities] = useState<SponsorshipOpportunity[]>([
    {
      id: "1",
      title: language === 'hi' ? "पार्क नवीनीकरण परियोजना" : "Park Renovation Project",
      description: language === 'hi' ? "सामुदायिक पार्क में नई बेंच, खेल उपकरण और लैंडस्केपिंग" : "New benches, playground equipment, and landscaping for community park",
      cost: 50000,
      impact: language === 'hi' ? "500+ परिवार प्रभावित" : "500+ families impacted",
      category: language === 'hi' ? "पर्यावरण" : "Environment",
      urgency: "high",
      location: "Central Park, Sector 12",
      estimatedReach: 2000,
      deadline: "15 days",
      currentFunding: 30000,
      requiredFunding: 50000,
      sponsors: 3
    },
    {
      id: "2", 
      title: language === 'hi' ? "स्ट्रीट लाइट अपग्रेड" : "Street Light Upgrade",
      description: language === 'hi' ? "पुराने स्ट्रीट लाइट को LED तकनीक से बदलना" : "Replace old street lights with LED technology",
      cost: 80000,
      impact: language === 'hi' ? "70% ऊर्जा की बचत" : "70% energy savings",
      category: language === 'hi' ? "बुनियादी ढांचा" : "Infrastructure", 
      urgency: "medium",
      location: "Main Road, Commercial Area",
      estimatedReach: 5000,
      deadline: "1 month",
      currentFunding: 20000,
      requiredFunding: 80000,
      sponsors: 1
    },
    {
      id: "3",
      title: language === 'hi' ? "जल संरक्षण प्रणाली" : "Water Conservation System",
      description: language === 'hi' ? "रेन वाटर हार्वेस्टिंग और ड्रिप इरिगेशन सिस्टम" : "Rain water harvesting and drip irrigation system",
      cost: 120000,
      impact: language === 'hi' ? "30% पानी की बचत" : "30% water savings",
      category: language === 'hi' ? "जल" : "Water",
      urgency: "high",
      location: "Residential Complex A",
      estimatedReach: 1500,
      deadline: "3 weeks",
      currentFunding: 40000,
      requiredFunding: 120000,
      sponsors: 2
    }
  ]);

  const [activeSponshorships] = useState([
    {
      id: "1",
      project: language === 'hi' ? "सड़क मरम्मत अभियान" : "Road Repair Campaign",
      amount: 45000,
      progress: 85,
      status: "In Progress",
      reach: 3500
    },
    {
      id: "2",
      project: language === 'hi' ? "स्कूल इंफ्रास्ट्रक्चर" : "School Infrastructure",
      amount: 80000,
      progress: 60,
      status: "In Progress", 
      reach: 800
    }
  ]);

  const [csrMetrics] = useState({
    compliance: 92,
    targetAchievement: 78,
    communityProjects: 15,
    environmentalImpact: 85
  });

  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>([
    {
      id: "1",
      companyName: companyName,
      name: language === 'hi' ? 'सामुदायिक सेवा जागरूकता' : 'Community Service Awareness',
      objective: "brand_awareness",
      budget: [75000],
      duration: 14,
      status: "active",
      createdAt: "2024-01-15",
      estimatedReach: 18750,
      impressions: 245000,
      clicks: 4900,
      conversions: 147,
      targetAudience: {
        ageRange: [25, 55],
        locations: ["Delhi", "Mumbai", "Bangalore"],
        interests: [language === 'hi' ? 'समुदाय' : 'Community', language === 'hi' ? 'पर्यावरण' : 'Environment'],
        userTypes: ["citizens", "volunteers"]
      },
      adCreative: {
        type: "banner",
        title: language === 'hi' ? 'समुदाय के साथ जुड़ें' : 'Connect with Community',
        description: language === 'hi' ? 'हमारे साथ मिलकर समुदाय की सेवा करें' : 'Join us in serving the community together',
        callToAction: language === 'hi' ? 'अभी जुड़ें' : 'Join Now',
        imageUrl: "",
        videoUrl: ""
      }
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-50 border-green-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200"; 
      case "hard": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high": return <Zap className="w-3 h-3 text-red-500" />;
      case "medium": return <Clock className="w-3 h-3 text-yellow-500" />;
      case "low": return <Target className="w-3 h-3 text-green-500" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'hi' ? 'सुप्रभात' : 'Good morning';
    if (hour < 17) return language === 'hi' ? 'नमस्कार' : 'Good afternoon';
    return language === 'hi' ? 'शुभ संध्या' : 'Good evening';
  };

  const handleTakeAction = (issueId: string, action: "solve" | "fund") => {
    console.log(`${action} issue ${issueId}`);
    // Handle action - show success notification
    if (action === "solve") {
      toast.success(language === 'hi' 
        ? 'आपने इस समस्या को हल करने के लिए स्वीकार किया है!' 
        : 'You have accepted to solve this issue!'
      );
    } else if (action === "fund") {
      toast.success(language === 'hi' 
        ? 'फंडिंग के लिए धन्यवाद! परियोजना शुरू हो जाएगी।' 
        : 'Thank you for funding! Project will begin soon.'
      );
    }
  };

  const handleFundIssue = (issueId: string, action: "solve" | "fund") => {
    console.log(`Business funding issue ${issueId}`);
    if (action === "fund") {
      toast.success(language === 'hi' 
        ? 'आपका CSR वचन दर्ज हो गया है। धन्यवाद!' 
        : 'Your CSR pledge has been recorded. Thank you!'
      );
    } else if (action === "solve") {
      toast.success(language === 'hi' 
        ? 'आपने समाधान का नेतृत्व करने के लिए सहमति दी है!' 
        : 'You agreed to lead the solution!'
      );
    }
  };

  const handleCreateCampaign = (campaign: MarketingCampaign) => {
    setMarketingCampaigns(prev => [campaign, ...prev]);
  };

  const handleCampaignAction = (campaignId: string, action: "play" | "pause" | "edit" | "delete") => {
    switch (action) {
      case "play":
        setMarketingCampaigns(prev => prev.map(c => 
          c.id === campaignId ? {...c, status: "active"} : c
        ));
        break;
      case "pause":
        setMarketingCampaigns(prev => prev.map(c => 
          c.id === campaignId ? {...c, status: "paused"} : c
        ));
        break;
      case "edit":
        console.log("Edit campaign", campaignId);
        break;
      case "delete":
        setMarketingCampaigns(prev => prev.filter(c => c.id !== campaignId));
        break;
    }
  };

  const getVolunteerTypeLabel = () => {
    switch (volunteerType) {
      case "ngo":
        return language === 'hi' ? 'एनजीओ स्वयंसेवक' : 'NGO Volunteer';
      case "student":
        return language === 'hi' ? 'छात्र स्वयंसेवक' : 'Student Volunteer';
      case "business":
        return language === 'hi' ? 'कॉर्पोरेट स्वयंसेवक' : 'Corporate Volunteer';
      default:
        return language === 'hi' ? 'नागरिक स्वयंसेवक' : 'Citizen Volunteer';
    }
  };

  return (
    <div className={`min-h-screen pb-20 ${
      volunteerType === 'business' 
        ? 'bg-gradient-to-br from-orange-50 via-white to-yellow-50' 
        : 'bg-gradient-to-br from-green-50 via-white to-blue-50'
    }`}>
      {/* Header Banner */}
      <div className={`text-white p-6 ${
        volunteerType === 'business' 
          ? 'bg-gradient-to-r from-orange-600 to-orange-700' 
          : 'bg-gradient-to-r from-green-600 to-green-700'
      }`}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-1">
                {greeting()}, {volunteerType === 'business' ? (language === 'hi' ? 'प्रायोजक!' : 'Sponsor!') : (language === 'hi' ? 'स्वयंसेवक!' : 'Volunteer!')}
              </h1>
              <div className="space-y-1">
                <div className={`flex items-center gap-2 ${volunteerType === 'business' ? 'text-orange-100' : 'text-green-100'}`}>
                  {volunteerType === 'business' ? <Building2 className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  <span>{volunteerType === 'business' ? companyName : userLocation}</span>
                </div>
                <div className={`text-sm ${volunteerType === 'business' ? 'text-orange-200' : 'text-green-200'}`}>
                  {getVolunteerTypeLabel()}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-white/90">
                {volunteerType === 'business' 
                  ? (language === 'hi' ? 'कुल निवेश' : 'Total Investment')
                  : `${language === 'hi' ? 'स्तर' : 'Level'} ${userLevel}`
                }
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="font-medium">
                  {volunteerType === 'business' 
                    ? formatCurrency(totalSpent)
                    : `${userPoints} ${language === 'hi' ? 'अंक' : 'pts'}`
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Skills/Stats Display */}
          <div className="bg-white/10 p-3 rounded-lg">
            {volunteerType === 'business' ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="font-medium">{issuesFunded}</div>
                  <div className={`text-sm ${volunteerType === 'business' ? 'text-orange-100' : 'text-green-100'}`}>
                    {language === 'hi' ? 'परियोजनाएं' : 'Projects'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{communityReach.toLocaleString()}</div>
                  <div className={`text-sm ${volunteerType === 'business' ? 'text-orange-100' : 'text-green-100'}`}>
                    {language === 'hi' ? 'पहुंच' : 'Reach'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{csrMetrics.compliance}%</div>
                  <div className={`text-sm ${volunteerType === 'business' ? 'text-orange-100' : 'text-green-100'}`}>
                    {language === 'hi' ? 'CSR अनुपालन' : 'CSR Compliance'}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4" />
                  <span>{language === 'hi' ? 'मेरे कौशल' : 'My Skills'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-white/20 border-white/30 text-white">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Navigation Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`bg-white/95 backdrop-blur-sm ${volunteerType === 'business' ? 'border-orange-200' : 'border-green-200'}`}>
            <CardContent className="p-4">
              <div className="flex gap-2 overflow-x-auto">
                <Button
                  variant={activeTab === "feed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("feed")}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <TrendingUp className="w-4 h-4" />
                  {language === 'hi' ? 'सामुदायिक फीड' : 'Community Feed'}
                </Button>
                <Button
                  variant={activeTab === "overview" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("overview")}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Award className="w-4 h-4" />
                  {language === 'hi' ? 'अवलोकन' : 'Overview'}
                </Button>
                <Button
                  variant={activeTab === "projects" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("projects")}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Settings className="w-4 h-4" />
                  {language === 'hi' ? 'मेरी परियोजनाएं' : 'My Projects'}
                </Button>
                {volunteerType === 'business' && (
                  <Button
                    variant={activeTab === "sponsorship" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("sponsorship")}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <DollarSign className="w-4 h-4" />
                    {language === 'hi' ? 'प्रायोजन' : 'Sponsorship'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Content */}
        {activeTab === "feed" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <UnifiedFeed 
              userType={volunteerType === 'business' ? 'business' : 'volunteer'}
              userInfo={userInfo}
              posts={posts}
              onTakeAction={volunteerType === 'business' ? handleFundIssue : handleTakeAction}
              onComment={onComment}
              onUpvote={onUpvote}
            />
          </motion.div>
        )}

        {activeTab === "overview" && (
          <div className="space-y-6">
        {/* Skills-Matched Recommendations */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                {language === 'hi' ? 'आपके लिए सुझाए गए कार्य' : 'Recommended for You'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableTasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="bg-white p-3 rounded-lg border border-blue-100">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge className={getDifficultyColor(task.difficulty)}>
                        {task.difficulty}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{task.estimatedTime}</span>
                        <span>+{task.points} {language === 'hi' ? 'अंक' : 'pts'}</span>
                        {getUrgencyIcon(task.urgency)}
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleTakeAction(task.id, "solve")}
                        className={volunteerType === 'business' 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                          : 'bg-gradient-to-r from-green-500 to-green-600'}
                      >
                        {language === 'hi' ? 'स्वीकार करें' : 'Accept'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Projects */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`bg-white/95 backdrop-blur-sm ${volunteerType === 'business' ? 'border-orange-200' : 'border-green-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Settings className={`w-5 h-5 ${volunteerType === 'business' ? 'text-orange-600' : 'text-green-600'}`} />
                {language === 'hi' ? 'मेरी सक्रिय परियोजनाएं' : 'My Active Projects'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{project.title}</h4>
                      <Badge variant="outline" className="text-green-600">
                        {project.progress}% {language === 'hi' ? 'पूर्ण' : 'Complete'}
                      </Badge>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{project.participants} {language === 'hi' ? 'स्वयंसेवक' : 'volunteers'}</span>
                      </div>
                      <span>{language === 'hi' ? 'समयसीमा:' : 'Deadline:'} {project.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-6">
        {/* Available Tasks Grid */}
        <div className="flex items-center justify-between">
          <h2 className={volunteerType === 'business' ? 'text-orange-900' : 'text-green-900'}>
            {language === 'hi' ? 'उपलब्ध कार्य' : 'Available Tasks'}
          </h2>
          <Badge variant="outline" className={volunteerType === 'business' ? 'bg-orange-50 text-orange-800 border-orange-200' : 'bg-green-50 text-green-800 border-green-200'}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {language === 'hi' ? 'नया' : 'New'}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {availableTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className={`bg-white/95 backdrop-blur-sm ${volunteerType === 'business' ? 'border-orange-200' : 'border-green-200'} hover:shadow-md transition-shadow`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{task.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {getUrgencyIcon(task.urgency)}
                      <Badge className={getDifficultyColor(task.difficulty)}>
                        {task.difficulty}
                      </Badge>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{language === 'hi' ? 'समय:' : 'Time:'}</span>
                      <span>{task.estimatedTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{language === 'hi' ? 'अंक:' : 'Points:'}</span>
                      <span className="font-medium text-green-600">+{task.points}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{language === 'hi' ? 'स्थान:' : 'Location:'}</span>
                      <span>{task.location}</span>
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="mb-3">
                    <div className="text-sm text-muted-foreground mb-1">{language === 'hi' ? 'आवश्यक कौशल:' : 'Required Skills:'}</div>
                    <div className="flex flex-wrap gap-1">
                      {task.skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Volunteers Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{language === 'hi' ? 'स्वयंसेवक:' : 'Volunteers:'}</span>
                      <span>{task.currentVolunteers}/{task.requiredVolunteers}</span>
                    </div>
                    <Progress value={(task.currentVolunteers / task.requiredVolunteers) * 100} className="h-1" />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleTakeAction(task.id, "solve")}
                      className={`flex-1 ${volunteerType === 'business' 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' 
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}`}
                    >
                      <Hammer className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'मैं यह कर सकता हूं' : 'I can fix this'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                {language === 'hi' ? 'सामुदायिक लीडरबोर्ड' : 'Community Leaderboard'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.map((user, index) => (
                  <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                    user.name === "You" ? "bg-yellow-100 border border-yellow-300" : "bg-white/50"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        user.rank === 1 ? "bg-yellow-500 text-white" :
                        user.rank === 2 ? "bg-gray-400 text-white" :
                        user.rank === 3 ? "bg-orange-500 text-white" :
                        "bg-gray-200 text-gray-600"
                      }`}>
                        {user.rank}
                      </div>
                      <span className={`font-medium ${user.name === "You" ? "text-yellow-800" : ""}`}>
                        {user.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{user.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
          </div>
        )}

        {activeTab === "sponsorship" && volunteerType === 'business' && (
          <div className="space-y-6">
            {/* Marketing Campaigns Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-orange-900">{language === 'hi' ? 'मार्केटिंग अभियान' : 'Marketing Campaigns'}</h2>
                <MarketingCampaignDialog 
                  companyName={companyName}
                  onCreateCampaign={handleCreateCampaign}
                />
              </div>

              {/* Active Campaigns */}
              {marketingCampaigns.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {marketingCampaigns.map((campaign, index) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="bg-white/95 backdrop-blur-sm border-orange-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{campaign.name}</h3>
                                <Badge 
                                  className={
                                    campaign.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                                    campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                    campaign.status === 'pending_approval' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                    'bg-gray-100 text-gray-800 border-gray-200'
                                  }
                                >
                                  {campaign.status === 'active' ? (language === 'hi' ? 'सक्रिय' : 'Active') :
                                   campaign.status === 'paused' ? (language === 'hi' ? 'रोका गया' : 'Paused') :
                                   campaign.status === 'pending_approval' ? (language === 'hi' ? 'अनुमोदन प्रतीक्षित' : 'Pending') :
                                   campaign.status}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground text-sm mb-2">{campaign.adCreative.title}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {campaign.status === 'active' ? (
                                  <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'pause')}>
                                    <Pause className="w-4 h-4 mr-2" />
                                    {language === 'hi' ? 'रोकें' : 'Pause'}
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'play')}>
                                    <Play className="w-4 h-4 mr-2" />
                                    {language === 'hi' ? 'चलाएं' : 'Resume'}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'edit')}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  {language === 'hi' ? 'संपादित करें' : 'Edit'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleCampaignAction(campaign.id, 'delete')}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {language === 'hi' ? 'हटाएं' : 'Delete'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Campaign Performance */}
                          <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                            <div className="text-center">
                              <div className="font-medium text-blue-900">{campaign.impressions.toLocaleString()}</div>
                              <div className="text-muted-foreground">{language === 'hi' ? 'इंप्रेशन' : 'Impressions'}</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-green-900">{campaign.clicks.toLocaleString()}</div>
                              <div className="text-muted-foreground">{language === 'hi' ? 'क्लिक' : 'Clicks'}</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-orange-900">{((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%</div>
                              <div className="text-muted-foreground">CTR</div>
                            </div>
                          </div>

                          {/* Budget Progress */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">{language === 'hi' ? 'बजट:' : 'Budget:'}</span>
                              <span>{formatCurrency(campaign.budget[0])}</span>
                            </div>
                            <Progress value={75} className="h-2" />
                            <div className="text-xs text-muted-foreground mt-1">
                              {language === 'hi' ? '75% खर्च किया गया' : '75% spent'} • {campaign.duration - 5} {language === 'hi' ? 'दिन बचे' : 'days left'}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              {language === 'hi' ? 'रिपोर्ट' : 'Report'}
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {marketingCampaigns.length === 0 && (
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-6 text-center">
                    <Megaphone className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">{language === 'hi' ? 'कोई मार्केटिंग अभियान नहीं' : 'No Marketing Campaigns'}</h3>
                    <p className="text-muted-foreground mb-4">
                      {language === 'hi' ? 'Prathmikta 2.0 ऐप पर अपना पहला मार्केटिंग अभियान बनाएं' : 'Create your first marketing campaign on Prathmikta 2.0 app'}
                    </p>
                    <MarketingCampaignDialog 
                      companyName={companyName}
                      onCreateCampaign={handleCreateCampaign}
                    />
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Sponsorship Opportunities */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-orange-900">{language === 'hi' ? 'प्रायोजन के अवसर' : 'Sponsorship Opportunities'}</h2>
                <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {language === 'hi' ? 'उच्च ROI' : 'High ROI'}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {sponsorshipOpportunities.map((opportunity, index) => (
                  <motion.div
                    key={opportunity.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="bg-white/95 backdrop-blur-sm border-orange-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{opportunity.title}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{opportunity.description}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {getUrgencyIcon(opportunity.urgency)}
                            <Badge className={getUrgencyColor(opportunity.urgency)}>
                              {opportunity.urgency}
                            </Badge>
                          </div>
                        </div>

                        {/* Funding Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{language === 'hi' ? 'फंडिंग प्रगति:' : 'Funding Progress:'}</span>
                            <span>{formatCurrency(opportunity.currentFunding)} / {formatCurrency(opportunity.requiredFunding)}</span>
                          </div>
                          <Progress value={(opportunity.currentFunding / opportunity.requiredFunding) * 100} className="h-2" />
                        </div>

                        {/* Opportunity Details */}
                        <div className="space-y-2 mb-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{language === 'hi' ? 'प्रभाव:' : 'Impact:'}</span>
                            <span>{opportunity.impact}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{language === 'hi' ? 'पहुंच:' : 'Reach:'}</span>
                            <span>{opportunity.estimatedReach.toLocaleString()} {language === 'hi' ? 'लोग' : 'people'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{language === 'hi' ? 'समयसीमा:' : 'Deadline:'}</span>
                            <span>{opportunity.deadline}</span>
                          </div>
                        </div>

                        {/* Category */}
                        <div className="mb-3">
                          <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
                            {opportunity.category}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            {language === 'hi' ? 'फंड करें' : 'Fund This'}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Active Sponsorships */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-600" />
                    {language === 'hi' ? 'सक्रिय प्रायोजन' : 'Active Sponsorships'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeSponshorships.map((sponsorship) => (
                      <div key={sponsorship.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{sponsorship.project}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-600">
                              {sponsorship.progress}% {language === 'hi' ? 'पूर्ण' : 'Complete'}
                            </Badge>
                            <span className="text-muted-foreground">{formatCurrency(sponsorship.amount)}</span>
                          </div>
                        </div>
                        <Progress value={sponsorship.progress} className="h-2" />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{sponsorship.reach.toLocaleString()} {language === 'hi' ? 'लोग प्रभावित' : 'people impacted'}</span>
                          </div>
                          <span>{sponsorship.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* CSR Analytics */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    {language === 'hi' ? 'CSR अनुपालन ट्रैकिंग' : 'CSR Compliance Tracking'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground">{language === 'hi' ? 'अनुपालन स्कोर' : 'Compliance Score'}</span>
                        <span className="font-medium">{csrMetrics.compliance}%</span>
                      </div>
                      <Progress value={csrMetrics.compliance} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground">{language === 'hi' ? 'लक्ष्य उपलब्धि' : 'Target Achievement'}</span>
                        <span className="font-medium">{csrMetrics.targetAchievement}%</span>
                      </div>
                      <Progress value={csrMetrics.targetAchievement} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground">{language === 'hi' ? 'सामुदायिक परियोजनाएं' : 'Community Projects'}</span>
                        <span className="font-medium">{csrMetrics.communityProjects}</span>
                      </div>
                      <Progress value={(csrMetrics.communityProjects / 20) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground">{language === 'hi' ? 'पर्यावरणीय प्रभाव' : 'Environmental Impact'}</span>
                        <span className="font-medium">{csrMetrics.environmentalImpact}%</span>
                      </div>
                      <Progress value={csrMetrics.environmentalImpact} className="h-2" />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download Report'}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'वार्षिक समीक्षा' : 'Annual Review'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Marketing Campaign Analytics */}
            {marketingCampaigns.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-purple-600" />
                      {language === 'hi' ? 'अभियान एनालिटिक्स' : 'Campaign Analytics'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div className="font-medium text-blue-900">
                          {marketingCampaigns.reduce((sum, campaign) => sum + campaign.impressions, 0).toLocaleString()}
                        </div>
                        <div className="text-muted-foreground text-sm">{language === 'hi' ? 'कुल इंप्रेशन' : 'Total Impressions'}</div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="font-medium text-green-900">
                          {marketingCampaigns.reduce((sum, campaign) => sum + campaign.clicks, 0).toLocaleString()}
                        </div>
                        <div className="text-muted-foreground text-sm">{language === 'hi' ? 'कुल क्लिक' : 'Total Clicks'}</div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="font-medium text-orange-900">
                          {(
                            (marketingCampaigns.reduce((sum, campaign) => sum + campaign.clicks, 0) / 
                             marketingCampaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)) * 100
                          ).toFixed(2)}%
                        </div>
                        <div className="text-muted-foreground text-sm">{language === 'hi' ? 'औसत CTR' : 'Avg CTR'}</div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div className="font-medium text-purple-900">
                          ₹{marketingCampaigns.reduce((sum, campaign) => sum + campaign.budget[0], 0).toLocaleString()}
                        </div>
                        <div className="text-muted-foreground text-sm">{language === 'hi' ? 'कुल निवेश' : 'Total Invested'}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'विस्तृत रिपोर्ट' : 'Detailed Report'}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'एनालिटिक्स' : 'Analytics'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Community Impact Metrics */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    {language === 'hi' ? 'सामुदायिक प्रभाव मेट्रिक्स' : 'Community Impact Metrics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div className="font-medium text-blue-900">{communityReach.toLocaleString()}</div>
                      <div className="text-muted-foreground">{language === 'hi' ? 'कुल पहुंच' : 'Total Reach'}</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="font-medium text-green-900">{issuesFunded}</div>
                      <div className="text-muted-foreground">{language === 'hi' ? 'हल की गई समस्याएं' : 'Issues Resolved'}</div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 px-4 py-2">
                      <Star className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'सामुदायिक चैंपियन स्टेटस' : 'Community Champion Status'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}