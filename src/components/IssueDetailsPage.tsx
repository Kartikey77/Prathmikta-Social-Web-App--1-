import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { useLanguage } from "./LanguageContext";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  MessageCircle, 
  Camera,
  Upload,
  Star,
  Award,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Building2,
  UserCheck,
  Heart,
  Share2,
  Flag,
  Phone,
  MessageSquare,
  FileText,
  IndianRupee,
  Timer,
  Target
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

interface IssueDetailsPageProps {
  issueId: string;
  onNavigate: (page: string) => void;
  userType: "citizen" | "volunteer" | "business" | "municipal";
  currentUserId: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userType: "citizen" | "volunteer" | "business" | "municipal";
  userName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

interface ProgressUpdate {
  id: string;
  stage: string;
  status: "completed" | "in-progress" | "pending";
  date: string;
  description: string;
  images?: string[];
  updatedBy: string;
  userType: string;
}

export function IssueDetailsPage({ issueId, onNavigate, userType, currentUserId }: IssueDetailsPageProps) {
  const { t, language } = useLanguage();
  const [selectedResolutionPath, setSelectedResolutionPath] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showVolunteerDialog, setShowVolunteerDialog] = useState(false);
  const [showSponsorDialog, setShowSponsorDialog] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sponsorAmount, setSponsorAmount] = useState("");
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);

  // Mock issue data - in real app this would come from props or API
  const issueData = {
    id: issueId,
    title: language === 'hi' ? "सड़क पर गड्ढे की समस्या" : "Pothole Issue on Main Road",
    description: language === 'hi' 
      ? "मुख्य सड़क पर बड़े गड्ढे हैं जो यातायात में बाधा डाल रहे हैं और दुर्घटनाओं का कारण बन सकते हैं। तुरंत मरम्मत की आवश्यकता है।"
      : "Large potholes on the main road are causing traffic disruption and could lead to accidents. Immediate repair needed.",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80"
    ],
    location: language === 'hi' ? "कनाट प्लेस, नई दिल्ली" : "Connaught Place, New Delhi",
    reportedBy: language === 'hi' ? "राहुल शर्मा" : "Rahul Sharma",
    reportedDate: "2024-01-15",
    department: language === 'hi' ? "सड़क परिवहन विभाग" : "Road Transport Department",
    priority: "high",
    status: "in-progress",
    upvotes: 127,
    estimatedCost: 45000,
    estimatedDuration: "5-7 days",
    category: "infrastructure",
    urgencyLevel: 8.5
  };

  // Initialize progress updates
  useEffect(() => {
    const mockProgressUpdates: ProgressUpdate[] = [
      {
        id: "1",
        stage: language === 'hi' ? "रिपोर्ट दर्ज" : "Reported",
        status: "completed",
        date: "2024-01-15",
        description: language === 'hi' ? "समस्या की रिपोर्ट दर्ज की गई" : "Issue reported by citizen",
        updatedBy: language === 'hi' ? "राहुल शर्मा" : "Rahul Sharma",
        userType: "citizen"
      },
      {
        id: "2", 
        stage: language === 'hi' ? "सत्यापन" : "Verified",
        status: "completed",
        date: "2024-01-16",
        description: language === 'hi' ? "स्थानीय अधिकारी द्वारा सत्यापित" : "Verified by local municipal officer",
        updatedBy: language === 'hi' ? "अमित गुप्ता" : "Amit Gupta",
        userType: "municipal"
      },
      {
        id: "3",
        stage: language === 'hi' ? "कार्य आरंभ" : "Work Started", 
        status: "in-progress",
        date: "2024-01-18",
        description: language === 'hi' ? "मरम्मत कार्य शुरू किया गया" : "Repair work initiated",
        images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"],
        updatedBy: language === 'hi' ? "रमेश कुमार" : "Ramesh Kumar", 
        userType: "municipal"
      },
      {
        id: "4",
        stage: language === 'hi' ? "पूर्णता" : "Completed",
        status: "pending",
        date: "",
        description: language === 'hi' ? "कार्य पूर्णता की प्रतीक्षा" : "Awaiting completion",
        updatedBy: "",
        userType: "municipal"
      }
    ];
    setProgressUpdates(mockProgressUpdates);

    // Initialize chat messages
    const mockMessages: ChatMessage[] = [
      {
        id: "1",
        userId: "citizen-1",
        userType: "citizen", 
        userName: language === 'hi' ? "राहुल शर्मा" : "Rahul Sharma",
        message: language === 'hi' ? "यह समस्या काफी गंभीर है। जल्दी समाधान की जरूरत है।" : "This issue is quite serious. Need quick resolution.",
        timestamp: "2024-01-15 10:30 AM"
      },
      {
        id: "2",
        userId: "municipal-1", 
        userType: "municipal",
        userName: language === 'hi' ? "अमित गुप्ता (अधिकारी)" : "Amit Gupta (Officer)",
        message: language === 'hi' ? "हमने समस्या का निरीक्षण किया है। जल्द ही कार्य शुरू होगा।" : "We have inspected the issue. Work will start soon.",
        timestamp: "2024-01-16 02:15 PM"
      },
      {
        id: "3",
        userId: "volunteer-1",
        userType: "volunteer",
        userName: language === 'hi' ? "प्रिया पटेल (स्वयंसेवक)" : "Priya Patel (Volunteer)", 
        message: language === 'hi' ? "मैं इस कार्य में सहायता कर सकती हूं। मेरे पास निर्माण का अनुभव है।" : "I can help with this work. I have construction experience.",
        timestamp: "2024-01-17 09:00 AM"
      }
    ];
    setChatMessages(mockMessages);
  }, [language]);

  const resolutionPaths = [
    {
      id: "community",
      title: language === 'hi' ? "सामुदायिक समाधान" : "Community Fix",
      description: language === 'hi' 
        ? "स्वयंसेवकों द्वारा स्वयं समाधान" 
        : "Volunteer self-resolution option",
      estimatedTime: language === 'hi' ? "2-3 दिन" : "2-3 days",
      estimatedCost: "₹15,000",
      volunteers: 8,
      color: "bg-green-500",
      icon: <Users className="w-5 h-5" />,
      requirements: [
        language === 'hi' ? "5 स्वयंसेवक" : "5 volunteers needed",
        language === 'hi' ? "बेसिक उपकरण" : "Basic tools required", 
        language === 'hi' ? "सामुदायिक फंडिंग" : "Community funding"
      ]
    },
    {
      id: "sponsored",
      title: language === 'hi' ? "प्रायोजित समाधान" : "Sponsored Fix",
      description: language === 'hi'
        ? "व्यावसायिक फंडिंग + विभागीय निष्पादन"
        : "Business funding + department execution",
      estimatedTime: language === 'hi' ? "5-7 दिन" : "5-7 days",
      estimatedCost: "₹45,000",
      sponsors: 3,
      color: "bg-orange-500", 
      icon: <Building2 className="w-5 h-5" />,
      requirements: [
        language === 'hi' ? "व्यावसायिक प्रायोजक" : "Business sponsor needed",
        language === 'hi' ? "पेशेवर ठेकेदार" : "Professional contractor",
        language === 'hi' ? "गुणवत्ता आश्वासन" : "Quality assurance"
      ]
    },
    {
      id: "hybrid",
      title: language === 'hi' ? "मिश्रित समाधान" : "Hybrid Solution", 
      description: language === 'hi'
        ? "सामुदायिक सहयोग + प्रायोजन"
        : "Community collaboration + sponsorship",
      estimatedTime: language === 'hi' ? "3-5 दिन" : "3-5 days", 
      estimatedCost: "₹30,000",
      participants: 12,
      color: "bg-blue-500",
      icon: <Target className="w-5 h-5" />,
      requirements: [
        language === 'hi' ? "मिश्रित टीम" : "Mixed team approach",
        language === 'hi' ? "सामुदायिक + व्यावसायिक फंड" : "Community + business funds",
        language === 'hi' ? "समन्वित निष्पादन" : "Coordinated execution"
      ]
    }
  ];

  const availableSkills = [
    language === 'hi' ? "निर्माण" : "Construction",
    language === 'hi' ? "प्लंबिंग" : "Plumbing", 
    language === 'hi' ? "इलेक्ट्रिकल" : "Electrical",
    language === 'hi' ? "पेंटिंग" : "Painting",
    language === 'hi' ? "सफाई" : "Cleaning",
    language === 'hi' ? "परिवहन" : "Transportation"
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      userType: userType,
      userName: userType === 'citizen' ? (language === 'hi' ? "आप (नागरिक)" : "You (Citizen)") :
                userType === 'volunteer' ? (language === 'hi' ? "आप (स्वयंसेवक)" : "You (Volunteer)") :
                userType === 'business' ? (language === 'hi' ? "आप (व्यवसायी)" : "You (Business)") :
                (language === 'hi' ? "आप (अधिकारी)" : "You (Officer)"),
      message: newMessage,
      timestamp: new Date().toLocaleString()
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage("");
    toast.success(language === 'hi' ? "संदेश भेजा गया" : "Message sent");
  };

  const handleVolunteerRegistration = () => {
    if (selectedSkills.length === 0) {
      toast.error(language === 'hi' ? "कृपया कम से कम एक कौशल चुनें" : "Please select at least one skill");
      return;
    }
    
    setShowVolunteerDialog(false);
    toast.success(language === 'hi' ? "स्वयंसेवक के रूप में पंजीकृत हो गए!" : "Registered as volunteer!");
    
    // Add system message to chat
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: "system",
      userType: "citizen",
      userName: language === 'hi' ? "सिस्टम" : "System",
      message: language === 'hi' 
        ? `${currentUserId} ने स्वयंसेवक के रूप में पंजीकरण किया है। कौशल: ${selectedSkills.join(', ')}`
        : `${currentUserId} registered as volunteer. Skills: ${selectedSkills.join(', ')}`,
      timestamp: new Date().toLocaleString()
    };
    setChatMessages(prev => [...prev, systemMessage]);
  };

  const handleSponsorshipSubmit = () => {
    if (!sponsorAmount || parseInt(sponsorAmount) < 1000) {
      toast.error(language === 'hi' ? "न्यूनतम ₹1,000 की राशि आवश्यक है" : "Minimum ₹1,000 amount required");
      return;
    }
    
    setShowSponsorDialog(false);
    toast.success(language === 'hi' ? "प्रायोजन सफलतापूर्वक सबमिट किया गया!" : "Sponsorship submitted successfully!");
    
    // Add system message
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: "system",
      userType: "business",
      userName: language === 'hi' ? "सिस्टम" : "System",
      message: language === 'hi'
        ? `${currentUserId} ने ₹${sponsorAmount} की प्रायोजन राशि दी है`
        : `${currentUserId} has sponsored ₹${sponsorAmount}`,
      timestamp: new Date().toLocaleString()
    };
    setChatMessages(prev => [...prev, systemMessage]);
  };

  const getCurrentProgress = () => {
    const completedStages = progressUpdates.filter(update => update.status === "completed").length;
    return (completedStages / progressUpdates.length) * 100;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "in-progress": return "bg-blue-500";
      case "solved": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/80 via-white/90 to-green-50/80">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-orange-200/50">
        <div className="flex items-center gap-4 p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate("home")}
            className="text-blue-600 hover:bg-blue-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-medium text-gray-900 truncate">{issueData.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{issueData.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getPriorityColor(issueData.priority)} text-white`}>
              {issueData.priority.toUpperCase()}
            </Badge>
            <Badge className={`${getStatusColor(issueData.status)} text-white`}>
              {issueData.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Issue Overview Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-orange-100">
          <CardContent className="p-6">
            {/* Images */}
            {issueData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {issueData.images.map((image, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={image}
                      alt={`Issue image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-gray-700 mb-4">{issueData.description}</p>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'hi' ? 'रिपोर्ट दिनांक' : 'Reported'}: {issueData.reportedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{language === 'hi' ? 'रिपोर्टर' : 'Reporter'}: {issueData.reportedBy}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <IndianRupee className="w-4 h-4" />
                  <span>{language === 'hi' ? 'अनुमानित लागत' : 'Est. Cost'}: ₹{issueData.estimatedCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Timer className="w-4 h-4" />
                  <span>{language === 'hi' ? 'अनुमानित समय' : 'Est. Duration'}: {issueData.estimatedDuration}</span>
                </div>
              </div>
            </div>

            {/* Urgency Meter */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {language === 'hi' ? 'तात्कालिकता स्तर' : 'Urgency Level'}
                </span>
                <span className="text-sm font-medium text-red-600">{issueData.urgencyLevel}/10</span>
              </div>
              <Progress 
                value={issueData.urgencyLevel * 10} 
                className="h-2"
                style={{ 
                  background: `linear-gradient(to right, #ef4444 0%, #f97316 50%, #eab308 100%)`
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{issueData.upvotes}</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                {language === 'hi' ? 'साझा करें' : 'Share'}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Flag className="w-4 h-4" />
                {language === 'hi' ? 'रिपोर्ट करें' : 'Report'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="resolution" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="resolution" className="text-xs">
              {language === 'hi' ? 'समाधान' : 'Resolution'}
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs">
              {language === 'hi' ? 'प्रगति' : 'Progress'}
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">
              {language === 'hi' ? 'चर्चा' : 'Chat'}
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs">
              {language === 'hi' ? 'विवरण' : 'Details'}
            </TabsTrigger>
          </TabsList>

          {/* Resolution Pathways Tab */}
          <TabsContent value="resolution" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  {language === 'hi' ? 'समाधान मार्ग चुनें' : 'Choose Resolution Path'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resolutionPaths.map((path) => (
                  <motion.div
                    key={path.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedResolutionPath === path.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50/50' 
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => setSelectedResolutionPath(path.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`${path.color} p-2 rounded-lg text-white`}>
                            {path.icon}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900">{path.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {path.estimatedCost}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{path.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {path.estimatedTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {path.volunteers || path.sponsors || path.participants} {language === 'hi' ? 'सदस्य' : 'participants'}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {path.requirements.map((req, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span>{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {selectedResolutionPath && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 pt-4"
                  >
                    {(userType === "volunteer" || userType === "citizen") && (
                      <Dialog open={showVolunteerDialog} onOpenChange={setShowVolunteerDialog}>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                            <UserCheck className="w-4 h-4" />
                            {language === 'hi' ? 'मैं मदद करना चाहता हूं' : 'I Want to Help'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {language === 'hi' ? 'स्वयंसेवक पंजीकरण' : 'Volunteer Registration'}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                {language === 'hi' ? 'आपके कौशल चुनें' : 'Select Your Skills'}
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {availableSkills.map((skill) => (
                                  <label key={skill} className="flex items-center gap-2 text-sm">
                                    <input
                                      type="checkbox"
                                      checked={selectedSkills.includes(skill)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedSkills([...selectedSkills, skill]);
                                        } else {
                                          setSelectedSkills(selectedSkills.filter(s => s !== skill));
                                        }
                                      }}
                                      className="rounded border-gray-300"
                                    />
                                    <span>{skill}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <Button onClick={handleVolunteerRegistration} className="w-full">
                              {language === 'hi' ? 'पंजीकरण करें' : 'Register as Volunteer'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {(userType === "business" || userType === "citizen") && (
                      <Dialog open={showSponsorDialog} onOpenChange={setShowSponsorDialog}>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700">
                            <DollarSign className="w-4 h-4" />
                            {language === 'hi' ? 'मैं फंड करना चाहता हूं' : 'I Want to Fund'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {language === 'hi' ? 'प्रायोजन राशि' : 'Sponsorship Amount'}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                {language === 'hi' ? 'राशि (₹)' : 'Amount (₹)'}
                              </label>
                              <Input
                                type="number"
                                placeholder="5000"
                                value={sponsorAmount}
                                onChange={(e) => setSponsorAmount(e.target.value)}
                                min="1000"
                                className="bg-input-background"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {language === 'hi' ? 'न्यूनतम राशि: ₹1,000' : 'Minimum amount: ₹1,000'}
                              </p>
                            </div>
                            <Button onClick={handleSponsorshipSubmit} className="w-full">
                              {language === 'hi' ? 'प्रायोजन भेजें' : 'Submit Sponsorship'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="progress" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  {language === 'hi' ? 'प्रगति ट्रैकिंग' : 'Progress Tracking'}
                </CardTitle>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{language === 'hi' ? 'समग्र प्रगति' : 'Overall Progress'}</span>
                  <span>{Math.round(getCurrentProgress())}%</span>
                </div>
                <Progress value={getCurrentProgress()} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {progressUpdates.map((update, index) => (
                  <div key={update.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        update.status === 'completed' ? 'bg-green-500 text-white' :
                        update.status === 'in-progress' ? 'bg-blue-500 text-white' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {update.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : update.status === 'in-progress' ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>
                      {index < progressUpdates.length - 1 && (
                        <div className={`w-0.5 h-12 ${
                          update.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{update.stage}</h4>
                        {update.date && (
                          <span className="text-xs text-gray-500">{update.date}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{update.description}</p>
                      {update.images && (
                        <div className="grid grid-cols-3 gap-2">
                          {update.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="aspect-square rounded-lg overflow-hidden">
                              <ImageWithFallback
                                src={image}
                                alt={`Progress ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {update.updatedBy && (
                        <p className="text-xs text-gray-500">
                          {language === 'hi' ? 'अपडेट किया गया:' : 'Updated by:'} {update.updatedBy}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upload Progress Photos (for authorized users) */}
            {(userType === "municipal" || userType === "volunteer") && (
              <Card className="bg-white/90 backdrop-blur-sm border-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-600" />
                    {language === 'hi' ? 'प्रगति फोटो अपलोड करें' : 'Upload Progress Photos'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full flex items-center gap-2" variant="outline">
                    <Upload className="w-4 h-4" />
                    {language === 'hi' ? 'फोटो चुनें' : 'Choose Photos'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Real-time Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  {language === 'hi' ? 'स्टेकहोल्डर चर्चा' : 'Stakeholder Discussion'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80 p-4">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className={`text-xs text-white ${
                            message.userType === 'citizen' ? 'bg-blue-500' :
                            message.userType === 'volunteer' ? 'bg-green-500' :
                            message.userType === 'business' ? 'bg-orange-500' :
                            'bg-gray-500'
                          }`}>
                            {message.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {message.userName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {message.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{message.message}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="aspect-video rounded-lg overflow-hidden">
                                  <ImageWithFallback
                                    src={attachment}
                                    alt={`Attachment ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4 space-y-3">
                  <Textarea
                    placeholder={language === 'hi' ? 'अपना संदेश लिखें...' : 'Type your message...'}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-input-background resize-none"
                    rows={2}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      {language === 'hi' ? 'फोटो' : 'Photo'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      {language === 'hi' ? 'फाइल' : 'File'}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      className="ml-auto flex items-center gap-2"
                      disabled={!newMessage.trim()}
                    >
                      <MessageSquare className="w-4 h-4" />
                      {language === 'hi' ? 'भेजें' : 'Send'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {language === 'hi' ? 'विस्तृत जानकारी' : 'Detailed Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'विभाग' : 'Department'}
                      </label>
                      <p className="text-sm text-gray-600">{issueData.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'श्रेणी' : 'Category'}
                      </label>
                      <p className="text-sm text-gray-600 capitalize">{issueData.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'रिपोर्ट किया गया' : 'Reported By'}
                      </label>
                      <p className="text-sm text-gray-600">{issueData.reportedBy}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'अनुमानित लागत' : 'Estimated Cost'}
                      </label>
                      <p className="text-sm text-gray-600">₹{issueData.estimatedCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'अनुमानित अवधि' : 'Estimated Duration'}
                      </label>
                      <p className="text-sm text-gray-600">{issueData.estimatedDuration}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'वोट' : 'Votes'}
                      </label>
                      <p className="text-sm text-gray-600">{issueData.upvotes} upvotes</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Emergency Contact */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">
                    {language === 'hi' ? 'आपातकालीन संपर्क' : 'Emergency Contact'}
                  </h4>
                  <div className="flex items-center gap-4">
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      1911
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      {language === 'hi' ? 'व्हाट्सऐप' : 'WhatsApp'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}