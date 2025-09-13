import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useLanguage } from "./LanguageContext";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Award,
  Star,
  Edit,
  Camera,
  Verified,
  Shield,
  TrendingUp,
  Users,
  Target,
  CheckCircle
} from "lucide-react";

interface UserInfo {
  id: string;
  name: string;
  aadhar: string;
  phone: string;
  email: string;
  location: string;
  joinedDate: string;
  profileImage?: string;
  userType: "citizen" | "volunteer" | "business" | "municipal";
  volunteerType?: "ngo" | "student" | "citizen" | "business";
  isVerified: boolean;
  stats: {
    issuesReported: number;
    issuesResolved: number;
    upvotesReceived: number;
    contributionScore: number;
    communityRank: number;
  };
  skills?: string[];
  achievements: string[];
}

interface UserProfileProps {
  userInfo: UserInfo;
  onEdit: () => void;
  onLogout: () => void;
}

export function UserProfile({ userInfo, onEdit, onLogout }: UserProfileProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "achievements">("overview");

  // Role-based theming
  const isBusiness = userInfo.userType === "business" || userInfo.volunteerType === "business";
  const isNGO = userInfo.volunteerType === "ngo";
  const isStudent = userInfo.volunteerType === "student";
  const isMunicipal = userInfo.userType === "municipal";
  const headerGradient = isBusiness
    ? "from-orange-600 to-orange-700"
    : isNGO
    ? "from-emerald-600 to-emerald-700"
    : isStudent
    ? "from-indigo-600 to-indigo-700"
    : isMunicipal
    ? "from-blue-700 to-blue-800"
    : "from-blue-500 to-green-500";
  const accentBadge = isBusiness
    ? "bg-orange-600"
    : isNGO
    ? "bg-emerald-600"
    : isStudent
    ? "bg-indigo-600"
    : isMunicipal
    ? "bg-blue-700"
    : "bg-green-600";

  const getUserTypeLabel = () => {
    switch (userInfo.userType) {
      case "citizen":
        return language === 'hi' ? 'नागरिक' : 'Citizen';
      case "volunteer":
        const volunteerTypeLabel = userInfo.volunteerType ? 
          (userInfo.volunteerType === "ngo" ? (language === 'hi' ? 'एनजीओ' : 'NGO') :
           userInfo.volunteerType === "student" ? (language === 'hi' ? 'छात्र' : 'Student') :
           userInfo.volunteerType === "business" ? (language === 'hi' ? 'कॉर्पोरेट' : 'Corporate') :
           (language === 'hi' ? 'नागरिक' : 'Citizen')) : '';
        return `${language === 'hi' ? 'स्वयंसेवक' : 'Volunteer'}${volunteerTypeLabel ? ` (${volunteerTypeLabel})` : ''}`;
      case "business":
        return language === 'hi' ? 'व्यावसायिक' : 'Business';
      case "municipal":
        return language === 'hi' ? 'नगरपालिका' : 'Municipal';
      default:
        return language === 'hi' ? 'उपयोगकर्ता' : 'User';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatAadhar = (aadhar: string) => {
    return aadhar.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className={`bg-gradient-to-r ${headerGradient} text-white border-0`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={userInfo.profileImage} />
                    <AvatarFallback className="bg-white text-blue-900 text-2xl font-bold">
                      {getInitials(userInfo.name)}
                    </AvatarFallback>
                  </Avatar>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{userInfo.name}</h1>
                    {userInfo.isVerified && (
                      <Badge className={`${accentBadge} text-white`}>
                        <Verified className="w-3 h-3 mr-1" />
                        {language === 'hi' ? 'सत्यापित' : 'Verified'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-blue-100">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{getUserTypeLabel()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{userInfo.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{language === 'hi' ? 'शामिल हुए:' : 'Joined:'} {userInfo.joinedDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <Button 
                      variant="outline" 
                      onClick={onEdit}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {language === 'hi' ? 'संपादित करें' : 'Edit Profile'}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="bg-white/95 backdrop-blur-sm border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-blue-900">{userInfo.stats.issuesReported}</div>
              <div className="text-muted-foreground text-sm">
                {language === 'hi' ? 'रिपोर्ट की गई' : 'Reported'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm border-green-200">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-green-900">{userInfo.stats.issuesResolved}</div>
              <div className="text-muted-foreground text-sm">
                {language === 'hi' ? 'हल किया गया' : 'Resolved'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-orange-900">{userInfo.stats.upvotesReceived}</div>
              <div className="text-muted-foreground text-sm">
                {language === 'hi' ? 'अपवोट्स' : 'Upvotes'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="font-bold text-purple-900">#{userInfo.stats.communityRank}</div>
              <div className="text-muted-foreground text-sm">
                {language === 'hi' ? 'रैंक' : 'Rank'}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-orange-200">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "overview" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("overview")}
                >
                  {language === 'hi' ? 'अवलोकन' : 'Overview'}
                </Button>
                <Button
                  variant={activeTab === "activity" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("activity")}
                >
                  {language === 'hi' ? 'गतिविधि' : 'Activity'}
                </Button>
                <Button
                  variant={activeTab === "achievements" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("achievements")}
                >
                  {language === 'hi' ? 'उपलब्धियां' : 'Achievements'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Personal Information */}
            <Card className="bg-white/95 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  {language === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-muted-foreground text-sm">
                      {language === 'hi' ? 'आधार नंबर' : 'Aadhar Number'}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatAadhar(userInfo.aadhar)}</span>
                      <Badge className="bg-green-100 text-green-800">
                        <Verified className="w-3 h-3 mr-1" />
                        {language === 'hi' ? 'सत्यापित' : 'Verified'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-muted-foreground text-sm">
                      {language === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                    </label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{userInfo.phone}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-muted-foreground text-sm">
                      {language === 'hi' ? 'ईमेल' : 'Email'}
                    </label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{userInfo.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-muted-foreground text-sm">
                      {language === 'hi' ? 'योगदान स्कोर' : 'Contribution Score'}
                    </label>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold text-orange-600">{userInfo.stats.contributionScore}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            {userInfo.skills && userInfo.skills.length > 0 && (
              <Card className="bg-white/95 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-green-600" />
                    {language === 'hi' ? 'कौशल' : 'Skills'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userInfo.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-800 border-green-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === "achievements" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  {language === 'hi' ? 'उपलब्धियां' : 'Achievements'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userInfo.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-yellow-900">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Logout Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            {language === 'hi' ? 'लॉग आउट' : 'Logout'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Default user info for demo
export const mockUserInfo: UserInfo = {
  id: "user123",
  name: "राजेश कुमार",
  aadhar: "123456789012",
  phone: "+91 98765 43210",
  email: "rajesh.kumar@example.com",
  location: "नई दिल्ली, भारत",
  joinedDate: "जनवरी 2024",
  userType: "volunteer",
  volunteerType: "citizen",
  isVerified: true,
  stats: {
    issuesReported: 15,
    issuesResolved: 8,
    upvotesReceived: 127,
    contributionScore: 850,
    communityRank: 3
  },
  skills: ["Plumbing", "Electrical", "Community Organizing", "Project Management"],
  achievements: [
    "Community Champion",
    "Top Contributor 2024",
    "Problem Solver Badge",
    "Verified Helper"
  ]
};