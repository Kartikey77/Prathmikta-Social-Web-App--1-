import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useLanguage } from "./LanguageContext";
import { 
  Users, 
  GraduationCap, 
  Building2, 
  Heart,
  CheckCircle,
  ArrowRight,
  Star,
  Award
} from "lucide-react";

interface VolunteerType {
  id: "ngo" | "student" | "citizen" | "business";
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  features: string[];
  featuresHi: string[];
  color: string;
  gradient: string;
  icon: any;
  skills: string[];
  skillsHi: string[];
}

interface VolunteerTypeSelectionProps {
  onTypeSelect: (type: "ngo" | "student" | "citizen" | "business", additionalInfo?: any) => void;
}

export function VolunteerTypeSelection({ onTypeSelect }: VolunteerTypeSelectionProps) {
  const { t, language } = useLanguage();
  const [selectedType, setSelectedType] = useState<"ngo" | "student" | "citizen" | "business" | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const volunteerTypes: VolunteerType[] = [
    {
      id: "ngo",
      title: "NGO/Organization",
      titleHi: "एनजीओ/संगठन",
      description: "Represent an organization working for social causes",
      descriptionHi: "सामाजिक कारणों के लिए काम करने वाले संगठन का प्रतिनिधित्व करें",
      features: [
        "Lead large-scale projects",
        "Coordinate community initiatives", 
        "Access to funding opportunities",
        "Partner with government agencies"
      ],
      featuresHi: [
        "बड़े पैमाने की परियोजनाओं का नेतृत्व करें",
        "सामुदायिक पहलों का समन्वय करें",
        "फंडिंग के अवसरों तक पहुंच",
        "सरकारी एजेंसियों के साथ साझेदारी"
      ],
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      icon: Heart,
      skills: ["Project Management", "Community Outreach", "Fund Raising", "Policy Advocacy"],
      skillsHi: ["परियोजना प्रबंधन", "सामुदायिक पहुंच", "फंड रेज़िंग", "नीति वकालत"]
    },
    {
      id: "student",
      title: "Student Volunteer",
      titleHi: "छात्र स्वयंसेवक",
      description: "Student passionate about community service",
      descriptionHi: "सामुदायिक सेवा के लिए उत्साही छात्र",
      features: [
        "Gain practical experience",
        "Build leadership skills",
        "Earn volunteer certificates",
        "Connect with peers"
      ],
      featuresHi: [
        "व्यावहारिक अनुभव प्राप्त करें",
        "नेतृत्व कौशल विकसित करें",
        "स्वयंसेवक प्रमाणपत्र अर्जित करें",
        "साथियों से जुड़ें"
      ],
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      icon: GraduationCap,
      skills: ["Research", "Digital Marketing", "Event Organization", "Data Collection"],
      skillsHi: ["अनुसंधान", "डिजिटल मार्केटिंग", "कार्यक्रम आयोजन", "डेटा संग्रह"]
    },
    {
      id: "citizen",
      title: "Active Citizen",
      titleHi: "सक्रिय नागरिक",
      description: "Individual committed to improving their community",
      descriptionHi: "अपने समुदाय को सुधारने के लिए प्रतिबद्ध व्यक्ति",
      features: [
        "Flexible participation",
        "Local issue focus",
        "Skill-based matching",
        "Recognition rewards"
      ],
      featuresHi: [
        "लचीली भागीदारी",
        "स्थानीय मुद्दों पर ध्यान",
        "कौशल-आधारित मिलान",
        "मान्यता पुरस्कार"
      ],
      color: "green",
      gradient: "from-green-500 to-green-600",
      icon: Users,
      skills: ["Local Knowledge", "Community Relations", "Problem Solving", "Communication"],
      skillsHi: ["स्थानीय ज्ञान", "सामुदायिक संबंध", "समस्या समाधान", "संचार"]
    },
    {
      id: "business",
      title: "Corporate Volunteer",
      titleHi: "कॉर्पोरेट स्वयंसेवक",
      description: "Business professional contributing expertise",
      descriptionHi: "विशेषज्ञता का योगदान देने वाले व्यापारिक पेशेवर",
      features: [
        "Professional skill sharing",
        "CSR project participation",
        "Mentorship opportunities",
        "Corporate team building"
      ],
      featuresHi: [
        "पेशेवर कौशल साझाकरण",
        "CSR परियोजना भागीदारी",
        "मेंटरशिप के अवसर",
        "कॉर्पोरेट टीम निर्माण"
      ],
      color: "orange",
      gradient: "from-orange-500 to-orange-600",
      icon: Building2,
      skills: ["Strategic Planning", "Technology", "Finance", "Operations"],
      skillsHi: ["रणनीतिक योजना", "प्रौद्योगिकी", "वित्त", "संचालन"]
    }
  ];

  const handleTypeSelect = (type: "ngo" | "student" | "citizen" | "business") => {
    setSelectedType(type);
    setIsConfirming(true);
    
    // Auto-confirm after animation
    setTimeout(() => {
      onTypeSelect(type, {
        skills: volunteerTypes.find(vt => vt.id === type)?.skills || [],
        features: volunteerTypes.find(vt => vt.id === type)?.features || []
      });
    }, 2000);
  };

  if (isConfirming && selectedType) {
    const type = volunteerTypes.find(vt => vt.id === selectedType)!;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
            className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-r ${type.gradient} rounded-full flex items-center justify-center`}
          >
            <type.icon className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-green-900 mb-2">
              {language === 'hi' ? 'स्वयंसेवक प्रकार चयनित!' : 'Volunteer Type Selected!'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {language === 'hi' ? type.titleHi : type.title}
            </p>
            <Badge variant="outline" className={`bg-${type.color}-50 text-${type.color}-800 border-${type.color}-200`}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {language === 'hi' ? 'पुष्टि की गई' : 'Confirmed'}
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="h-1/3 bg-gradient-to-r from-orange-400 to-orange-500"></div>
        <div className="h-1/3 bg-white"></div>
        <div className="h-1/3 bg-gradient-to-r from-green-600 to-green-700"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 pt-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 via-white to-orange-600 rounded-full flex items-center justify-center"
          >
            <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </motion.div>
          <h1 className="text-green-900 mb-2">
            {language === 'hi' ? 'स्वयंसेवक प्रकार चुनें' : 'Choose Volunteer Type'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'hi' 
              ? 'आप किस प्रकार के स्वयंसेवक हैं?'
              : 'What type of volunteer are you?'
            }
          </p>
        </motion.div>

        {/* Type Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {volunteerTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full backdrop-blur-sm bg-white/95 border-green-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                    onClick={() => handleTypeSelect(type.id)}>
                <CardHeader className="text-center pb-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${type.gradient} rounded-full flex items-center justify-center group-hover:shadow-lg transition-shadow`}
                  >
                    <type.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-green-900">
                    {language === 'hi' ? type.titleHi : type.title}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {language === 'hi' ? type.descriptionHi : type.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {language === 'hi' ? 'मुख्य विशेषताएं' : 'Key Features'}
                    </h4>
                    <ul className="space-y-1">
                      {(language === 'hi' ? type.featuresHi : type.features).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      {language === 'hi' ? 'संबंधित कौशल' : 'Relevant Skills'}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {(language === 'hi' ? type.skillsHi : type.skills).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className={`w-full bg-gradient-to-r ${type.gradient} hover:opacity-90 group-hover:scale-105 transition-transform`}
                  >
                    {language === 'hi' ? 'चुनें' : 'Select'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8 bg-green-50 p-4 rounded-lg border border-green-200"
        >
          <p className="text-green-800">
            {language === 'hi' 
              ? 'आप बाद में अपनी प्रोफ़ाइल में प्रकार बदल सकते हैं।'
              : 'You can change your type later in your profile settings.'
            }
          </p>
        </motion.div>
      </div>
    </div>
  );
}