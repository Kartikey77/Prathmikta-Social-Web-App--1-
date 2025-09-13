import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useLanguage } from "./LanguageContext";
import { UnifiedFeed } from "./UnifiedFeed";
import { 
  Building2, 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign,
  BarChart3,
  Award,
  Eye,
  Download,
  Calendar,
  MapPin,
  Star,
  Heart,
  Zap,
  CheckCircle,
  Clock
} from "lucide-react";

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

interface BusinessDashboardProps {
  onNavigate: (page: string) => void;
  companyName: string;
  totalSpent: number;
  issuesFunded: number;
  communityReach: number;
  userInfo?: any;
  posts?: any[];
  onComment?: (issueId: string) => void;
  onUpvote?: (issueId: string) => void;
}

export function BusinessDashboard({ 
  onNavigate, 
  companyName = "Tech Solutions Pvt Ltd",
  totalSpent = 125000,
  issuesFunded = 23,
  communityReach = 15000,
  userInfo,
  posts = [],
  onComment,
  onUpvote
}: BusinessDashboardProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"feed" | "opportunities" | "analytics">("feed");
  
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high": return <Zap className="w-3 h-3" />;
      case "medium": return <Clock className="w-3 h-3" />;
      case "low": return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
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

  const handleFundIssue = (issueId: string, action: "solve" | "fund") => {
    console.log(`Business funding issue ${issueId}`);
    // Handle funding logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-1">{greeting()}!</h1>
              <div className="flex items-center gap-2 text-orange-100">
                <Building2 className="w-4 h-4" />
                <span>{companyName}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-white/90">{language === 'hi' ? 'कुल निवेश' : 'Total Investment'}</div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="font-medium">{formatCurrency(totalSpent)}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 bg-white/10 p-3 rounded-lg">
            <div className="text-center">
              <div className="font-medium">{issuesFunded}</div>
              <div className="text-orange-100 text-sm">{language === 'hi' ? 'परियोजनाएं' : 'Projects'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{communityReach.toLocaleString()}</div>
              <div className="text-orange-100 text-sm">{language === 'hi' ? 'पहुंच' : 'Reach'}</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{csrMetrics.compliance}%</div>
              <div className="text-orange-100 text-sm">{language === 'hi' ? 'CSR अनुपालन' : 'CSR Compliance'}</div>
            </div>
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
          <Card className="bg-white/95 backdrop-blur-sm border-orange-200">
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
                  variant={activeTab === "opportunities" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("opportunities")}
                  className="flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  {language === 'hi' ? 'अवसर' : 'Opportunities'}
                </Button>
                <Button
                  variant={activeTab === "analytics" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("analytics")}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  {language === 'hi' ? 'एनालिटिक्स' : 'Analytics'}
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
            transition={{ delay: 0.2 }}
          >
            <UnifiedFeed 
              userType="business" 
              userInfo={userInfo}
              posts={posts}
              onTakeAction={handleFundIssue}
              onComment={onComment}
              onUpvote={onUpvote}
            />
          </motion.div>
        )}

        {activeTab === "opportunities" && (
          <div className="space-y-6">
        {/* Sponsorship Opportunities Carousel */}
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
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{language === 'hi' ? 'प्रायोजक:' : 'Sponsors:'}</span>
                        <span>{opportunity.sponsors} {language === 'hi' ? 'कंपनियां' : 'companies'}</span>
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

        {/* CSR Compliance Dashboard */}
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

        {/* Community Impact Metrics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
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

        {activeTab === "analytics" && (
          <div className="space-y-6">

        {/* Advertising Dashboard Teaser */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{language === 'hi' ? 'विज्ञापन अभियान' : 'Advertising Campaign'}</div>
                    <div className="text-muted-foreground">{language === 'hi' ? 'लक्षित सामुदायिक पहुंच' : 'Targeted community reach'}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {language === 'hi' ? 'डैशबोर्ड देखें' : 'View Dashboard'}
                </Button>
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