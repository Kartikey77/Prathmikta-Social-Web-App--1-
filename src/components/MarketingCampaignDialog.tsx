import { useState } from "react";
import { motion } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { useLanguage } from "./LanguageContext";
import { 
  Target, 
  DollarSign, 
  Users, 
  Calendar, 
  Upload, 
  Eye,
  BarChart3,
  Settings,
  Megaphone,
  TrendingUp,
  Globe,
  MapPin,
  Clock,
  Smartphone,
  Monitor,
  Palette,
  Image,
  Video,
  FileText
} from "lucide-react";
import { toast } from "sonner";

interface MarketingCampaignDialogProps {
  companyName: string;
  onCreateCampaign: (campaign: any) => void;
}

export function MarketingCampaignDialog({ companyName, onCreateCampaign }: MarketingCampaignDialogProps) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  
  // Campaign form state
  const [campaignData, setCampaignData] = useState({
    name: "",
    objective: "",
    budget: [10000],
    duration: 7,
    targetAudience: {
      ageRange: [18, 65],
      locations: [] as string[],
      interests: [] as string[],
      userTypes: [] as string[]
    },
    adCreative: {
      type: "banner",
      title: "",
      description: "",
      callToAction: "",
      imageUrl: "",
      videoUrl: ""
    },
    schedule: {
      startDate: "",
      endDate: "",
      timeSlots: [] as string[]
    }
  });

  const campaignObjectives = [
    { value: "brand_awareness", label: language === 'hi' ? 'ब्रांड जागरूकता' : 'Brand Awareness' },
    { value: "lead_generation", label: language === 'hi' ? 'लीड जेनरेशन' : 'Lead Generation' },
    { value: "website_traffic", label: language === 'hi' ? 'वेबसाइट ट्रैफिक' : 'Website Traffic' },
    { value: "app_installs", label: language === 'hi' ? 'ऐप इंस्टॉल' : 'App Installs' },
    { value: "community_engagement", label: language === 'hi' ? 'सामुदायिक जुड़ाव' : 'Community Engagement' }
  ];

  const adTypes = [
    { value: "banner", label: language === 'hi' ? 'बैनर विज्ञापन' : 'Banner Ad', icon: Image },
    { value: "video", label: language === 'hi' ? 'वीडियो विज्ञापन' : 'Video Ad', icon: Video },
    { value: "native", label: language === 'hi' ? 'नेटिव विज्ञापन' : 'Native Ad', icon: FileText },
    { value: "sponsored_post", label: language === 'hi' ? 'प्रायोजित पोस्ट' : 'Sponsored Post', icon: TrendingUp }
  ];

  const locations = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"
  ];

  const interests = [
    language === 'hi' ? 'पर्यावरण' : 'Environment',
    language === 'hi' ? 'तकनीक' : 'Technology', 
    language === 'hi' ? 'स्वास्थ्य' : 'Health',
    language === 'hi' ? 'शिक्षा' : 'Education',
    language === 'hi' ? 'समुदाय' : 'Community',
    language === 'hi' ? 'खेल' : 'Sports'
  ];

  const userTypes = [
    { value: "citizens", label: language === 'hi' ? 'नागरिक' : 'Citizens' },
    { value: "volunteers", label: language === 'hi' ? 'स्वयंसेवक' : 'Volunteers' },
    { value: "officials", label: language === 'hi' ? 'अधिकारी' : 'Officials' },
    { value: "all", label: language === 'hi' ? 'सभी उपयोगकर्ता' : 'All Users' }
  ];

  const handleNext = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCreateCampaign = () => {
    // Validate required fields
    if (!campaignData.name || !campaignData.objective || !campaignData.adCreative.title) {
      toast.error(language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill all required fields');
      return;
    }

    const campaign = {
      id: Date.now().toString(),
      companyName,
      ...campaignData,
      status: 'pending_approval',
      createdAt: new Date().toISOString(),
      estimatedReach: Math.floor((campaignData.budget[0] / 10) * 2.5), // Simple reach calculation
      impressions: 0,
      clicks: 0,
      conversions: 0
    };

    onCreateCampaign(campaign);
    setIsOpen(false);
    setActiveStep(1);
    setCampaignData({
      name: "",
      objective: "",
      budget: [10000],
      duration: 7,
      targetAudience: {
        ageRange: [18, 65],
        locations: [],
        interests: [],
        userTypes: []
      },
      adCreative: {
        type: "banner",
        title: "",
        description: "",
        callToAction: "",
        imageUrl: "",
        videoUrl: ""
      },
      schedule: {
        startDate: "",
        endDate: "",
        timeSlots: []
      }
    });
    toast.success(language === 'hi' ? 'अभियान सफलतापूर्वक बनाया गया!' : 'Campaign created successfully!');
  };

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const estimatedReach = Math.floor((campaignData.budget[0] / 10) * 2.5);
  const estimatedImpressions = estimatedReach * campaignData.duration;
  const estimatedCPM = campaignData.budget[0] / (estimatedImpressions / 1000);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
          <Megaphone className="w-4 h-4 mr-2" />
          {language === 'hi' ? 'मार्केटिंग अभियान बनाएं' : 'Create Marketing Campaign'}
        </Button>
      </DialogTrigger>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-orange-600" />
            {language === 'hi' ? 'नया मार्केटिंग अभियान' : 'New Marketing Campaign'}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step === activeStep 
                  ? 'bg-orange-600 text-white' 
                  : step < activeStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-0.5 mx-2 transition-colors ${
                  step < activeStep ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Campaign Details */}
          {activeStep === 1 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    {language === 'hi' ? 'अभियान विवरण' : 'Campaign Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="campaignName">{language === 'hi' ? 'अभियान का नाम' : 'Campaign Name'} *</Label>
                    <Input
                      id="campaignName"
                      value={campaignData.name}
                      onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                      placeholder={language === 'hi' ? 'अभियान का नाम दर्ज करें' : 'Enter campaign name'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="objective">{language === 'hi' ? 'अभियान उद्देश्य' : 'Campaign Objective'} *</Label>
                    <Select value={campaignData.objective} onValueChange={(value: string) => setCampaignData({...campaignData, objective: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'hi' ? 'उद्देश्य चुनें' : 'Select objective'} />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignObjectives.map((objective) => (
                          <SelectItem key={objective.value} value={objective.value}>
                            {objective.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{language === 'hi' ? 'बजट' : 'Budget'}: {formatBudget(campaignData.budget[0])}</Label>
                    <div className="mt-2">
                      <Slider
                        value={campaignData.budget}
                        onValueChange={(value: number[]) => setCampaignData({...campaignData, budget: value})}
                        max={500000}
                        min={5000}
                        step={5000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>₹5,000</span>
                        <span>₹5,00,000</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>{language === 'hi' ? 'अवधि' : 'Duration'}: {campaignData.duration} {language === 'hi' ? 'दिन' : 'days'}</Label>
                    <div className="mt-2">
                      <Slider
                        value={[campaignData.duration]}
                        onValueChange={(value: number[]) => setCampaignData({...campaignData, duration: value[0]})}
                        max={90}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>1 {language === 'hi' ? 'दिन' : 'day'}</span>
                        <span>90 {language === 'hi' ? 'दिन' : 'days'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Budget Breakdown */}
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{language === 'hi' ? 'अनुमानित रीच' : 'Estimated Reach'}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">{language === 'hi' ? 'दैनिक रीच:' : 'Daily Reach:'}</span>
                          <span className="font-medium ml-2">{estimatedReach.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{language === 'hi' ? 'कुल इंप्रेशन:' : 'Total Impressions:'}</span>
                          <span className="font-medium ml-2">{estimatedImpressions.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">CPM:</span>
                          <span className="font-medium ml-2">₹{estimatedCPM.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{language === 'hi' ? 'दैनिक बजट:' : 'Daily Budget:'}</span>
                          <span className="font-medium ml-2">₹{Math.floor(campaignData.budget[0] / campaignData.duration).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Target Audience */}
          {activeStep === 2 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {language === 'hi' ? 'लक्षित ऑडियंस' : 'Target Audience'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{language === 'hi' ? 'आयु सीमा' : 'Age Range'}: {campaignData.targetAudience.ageRange[0]} - {campaignData.targetAudience.ageRange[1]} {language === 'hi' ? 'वर्ष' : 'years'}</Label>
                    <div className="mt-2">
                      <Slider
                        value={campaignData.targetAudience.ageRange}
                        onValueChange={(value: number[]) => setCampaignData({
                          ...campaignData, 
                          targetAudience: {...campaignData.targetAudience, ageRange: value}
                        })}
                        max={80}
                        min={13}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>13</span>
                        <span>80</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>{language === 'hi' ? 'स्थान' : 'Locations'}</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {locations.map((location) => (
                        <Badge
                          key={location}
                          variant={campaignData.targetAudience.locations.includes(location) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newLocations = campaignData.targetAudience.locations.includes(location)
                              ? campaignData.targetAudience.locations.filter(l => l !== location)
                              : [...campaignData.targetAudience.locations, location];
                            setCampaignData({
                              ...campaignData,
                              targetAudience: {...campaignData.targetAudience, locations: newLocations}
                            });
                          }}
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>{language === 'hi' ? 'रुचियां' : 'Interests'}</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant={campaignData.targetAudience.interests.includes(interest) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newInterests = campaignData.targetAudience.interests.includes(interest)
                              ? campaignData.targetAudience.interests.filter(i => i !== interest)
                              : [...campaignData.targetAudience.interests, interest];
                            setCampaignData({
                              ...campaignData,
                              targetAudience: {...campaignData.targetAudience, interests: newInterests}
                            });
                          }}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>{language === 'hi' ? 'उपयोगकर्ता प्रकार' : 'User Types'}</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {userTypes.map((userType) => (
                        <Badge
                          key={userType.value}
                          variant={campaignData.targetAudience.userTypes.includes(userType.value) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newUserTypes = campaignData.targetAudience.userTypes.includes(userType.value)
                              ? campaignData.targetAudience.userTypes.filter(u => u !== userType.value)
                              : [...campaignData.targetAudience.userTypes, userType.value];
                            setCampaignData({
                              ...campaignData,
                              targetAudience: {...campaignData.targetAudience, userTypes: newUserTypes}
                            });
                          }}
                        >
                          <Users className="w-3 h-3 mr-1" />
                          {userType.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Ad Creative */}
          {activeStep === 3 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    {language === 'hi' ? 'विज्ञापन रचनात्मक' : 'Ad Creative'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{language === 'hi' ? 'विज्ञापन प्रकार' : 'Ad Type'}</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {adTypes.map((type) => (
                        <Button
                          key={type.value}
                          variant={campaignData.adCreative.type === type.value ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setCampaignData({
                            ...campaignData,
                            adCreative: {...campaignData.adCreative, type: type.value}
                          })}
                        >
                          <type.icon className="w-4 h-4 mr-2" />
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="adTitle">{language === 'hi' ? 'विज्ञापन शीर्षक' : 'Ad Title'} *</Label>
                    <Input
                      id="adTitle"
                      value={campaignData.adCreative.title}
                      onChange={(e) => setCampaignData({
                        ...campaignData,
                        adCreative: {...campaignData.adCreative, title: e.target.value}
                      })}
                      placeholder={language === 'hi' ? 'आकर्षक शीर्षक दर्ज करें' : 'Enter compelling title'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="adDescription">{language === 'hi' ? 'विज्ञापन विवरण' : 'Ad Description'}</Label>
                    <Textarea
                      id="adDescription"
                      value={campaignData.adCreative.description}
                      onChange={(e) => setCampaignData({
                        ...campaignData,
                        adCreative: {...campaignData.adCreative, description: e.target.value}
                      })}
                      placeholder={language === 'hi' ? 'विज्ञापन का विवरण दर्ज करें' : 'Enter ad description'}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="callToAction">{language === 'hi' ? 'कॉल टू एक्शन' : 'Call to Action'}</Label>
                    <Input
                      id="callToAction"
                      value={campaignData.adCreative.callToAction}
                      onChange={(e) => setCampaignData({
                        ...campaignData,
                        adCreative: {...campaignData.adCreative, callToAction: e.target.value}
                      })}
                      placeholder={language === 'hi' ? 'जैसे: "अभी संपर्क करें"' : 'e.g., "Contact Now"'}
                    />
                  </div>

                  <div>
                    <Label>{language === 'hi' ? 'मीडिया अपलोड' : 'Media Upload'}</Label>
                    <div className="mt-2 space-y-2">
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'इमेज अपलोड करें' : 'Upload Image'}
                      </Button>
                      {campaignData.adCreative.type === 'video' && (
                        <Button variant="outline" className="w-full">
                          <Video className="w-4 h-4 mr-2" />
                          {language === 'hi' ? 'वीडियो अपलोड करें' : 'Upload Video'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Ad Preview */}
                  <Card className="bg-gray-50 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-sm">{language === 'hi' ? 'विज्ञापन पूर्वावलोकन' : 'Ad Preview'}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="bg-white border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{companyName.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{companyName}</span>
                              <Badge variant="outline" className="text-xs">
                                {language === 'hi' ? 'प्रायोजित' : 'Sponsored'}
                              </Badge>
                            </div>
                            <h4 className="font-medium">{campaignData.adCreative.title || (language === 'hi' ? 'आपका विज्ञापन शीर्षक' : 'Your Ad Title')}</h4>
                            <p className="text-muted-foreground text-sm mt-1">
                              {campaignData.adCreative.description || (language === 'hi' ? 'आपका विज्ञापन विवरण यहाँ दिखेगा' : 'Your ad description will appear here')}
                            </p>
                            {campaignData.adCreative.callToAction && (
                              <Button size="sm" className="mt-2 bg-orange-600 hover:bg-orange-700">
                                {campaignData.adCreative.callToAction}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Review & Launch */}
          {activeStep === 4 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {language === 'hi' ? 'समीक्षा और लॉन्च' : 'Review & Launch'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Campaign Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">{language === 'hi' ? 'अभियान का नाम' : 'Campaign Name'}</Label>
                      <p className="font-medium">{campaignData.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{language === 'hi' ? 'उद्देश्य' : 'Objective'}</Label>
                      <p className="font-medium">
                        {campaignObjectives.find(obj => obj.value === campaignData.objective)?.label}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{language === 'hi' ? 'बजट' : 'Budget'}</Label>
                      <p className="font-medium">{formatBudget(campaignData.budget[0])}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{language === 'hi' ? 'अवधि' : 'Duration'}</Label>
                      <p className="font-medium">{campaignData.duration} {language === 'hi' ? 'दिन' : 'days'}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Estimated Performance */}
                  <div>
                    <h4 className="font-medium mb-3">{language === 'hi' ? 'अनुमानित प्रदर्शन' : 'Estimated Performance'}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-900">{estimatedReach.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{language === 'hi' ? 'दैनिक रीच' : 'Daily Reach'}</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-semibold text-green-900">{estimatedImpressions.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{language === 'hi' ? 'कुल इंप्रेशन' : 'Total Impressions'}</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="font-semibold text-orange-900">₹{estimatedCPM.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">CPM</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="font-semibold text-purple-900">{Math.floor(estimatedImpressions * 0.02).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{language === 'hi' ? 'अनुमानित क्लिक' : 'Est. Clicks'}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Terms and Conditions */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">{language === 'hi' ? 'नियम और शर्तें' : 'Terms & Conditions'}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {language === 'hi' ? 'विज्ञापन सामग्री की समीक्षा में 24-48 घंटे लग सकते हैं' : 'Ad content review may take 24-48 hours'}</li>
                      <li>• {language === 'hi' ? 'बजट दैनिक आधार पर खर्च किया जाएगा' : 'Budget will be spent on a daily basis'}</li>
                      <li>• {language === 'hi' ? 'आप कभी भी अभियान को रोक या संशोधित कर सकते हैं' : 'You can pause or modify campaign anytime'}</li>
                      <li>• {language === 'hi' ? 'विस्तृत रिपोर्ट दैनिक आधार पर उपलब्ध होगी' : 'Detailed reports will be available daily'}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={activeStep === 1}
          >
            {language === 'hi' ? 'पिछला' : 'Previous'}
          </Button>
          
          {activeStep < 4 ? (
            <Button onClick={handleNext} className="bg-orange-600 hover:bg-orange-700">
              {language === 'hi' ? 'अगला' : 'Next'}
            </Button>
          ) : (
            <Button onClick={handleCreateCampaign} className="bg-green-600 hover:bg-green-700">
              {language === 'hi' ? 'अभियान लॉन्च करें' : 'Launch Campaign'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}