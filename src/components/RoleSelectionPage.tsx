import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useLanguage } from "./LanguageContext";
import { 
  Users, 
  HandHeart, 
  Building2, 
  Star, 
  Award, 
  TrendingUp,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface Role {
  id: "citizen" | "volunteer";
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  features: string[];
  featuresHi: string[];
  color: string;
  gradient: string;
  icon: any;
  benefits: string[];
  benefitsHi: string[];
}

interface RoleSelectionPageProps {
  onRoleSelect: (role: "citizen" | "volunteer") => void;
}

export function RoleSelectionPage({ onRoleSelect }: RoleSelectionPageProps) {
  const { t, language } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<"citizen" | "volunteer" | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const roles: Role[] = [
    {
      id: "citizen",
      title: "Community Citizen",
      titleHi: "समुदायिक नागरिक",
      description: "Report issues and engage with your community",
      descriptionHi: "समस्याओं की रिपोर्ट करें और अपने समुदाय से जुड़ें",
      features: ["Report civic issues", "Vote on community priorities", "Track issue resolution", "Earn community points"],
      featuresHi: ["नागरिक समस्याओं की रिपोर्ट करें", "सामुदायिक प्राथमिकताओं पर वोट करें", "समस्या समाधान को ट्रैक करें", "सामुदायिक अंक अर्जित करें"],
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      icon: Users,
      benefits: ["Anonymous reporting option", "Real-time status updates", "Community recognition"],
      benefitsHi: ["गुमनाम रिपोर्टिंग विकल्प", "रियल-टाइम स्थिति अपडेट", "सामुदायिक मान्यता"]
    },
    {
      id: "volunteer",
      title: "Community Volunteer & Sponsor",
      titleHi: "समुदायिक स्वयंसेवक एवं प्रायोजक",
      description: "Help solve issues, volunteer your skills, or sponsor community projects",
      descriptionHi: "समस्याओं को हल करने में मदद करें, अपने कौशल से स्वयंसेवा करें, या सामुदायिक परियोजनाओं को प्रायोजित करें",
      features: ["Take on community tasks", "Sponsor community projects", "Earn skill badges & track CSR impact", "Lead local projects", "Business sponsorship opportunities"],
      featuresHi: ["सामुदायिक कार्य संभालें", "सामुदायिक परियोजनाओं को प्रायोजित करें", "कौशल बैज अर्जित करें और CSR प्रभाव ट्रैक करें", "स्थानीय परियोजनाओं का नेतृत्व करें", "व्यावसायिक प्रायोजन के अवसर"],
      color: "green",
      gradient: "from-green-500 to-green-600",
      icon: HandHeart,
      benefits: ["Skill verification system", "Leadership & sponsorship opportunities", "Community impact tracking", "CSR compliance reports"],
      benefitsHi: ["कौशल सत्यापन प्रणाली", "नेतृत्व और प्रायोजन के अवसर", "सामुदायिक प्रभाव ट्रैकिंग", "CSR अनुपालन रिपोर्ट"]
    }
  ];

  const handleRoleSelect = (role: "citizen" | "volunteer") => {
    setSelectedRole(role);
    setIsConfirming(true);
    
    // Auto-confirm after animation
    setTimeout(() => {
      onRoleSelect(role);
    }, 2000);
  };

  if (isConfirming && selectedRole) {
    const role = roles.find(r => r.id === selectedRole)!;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
            className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-r ${role.gradient} rounded-full flex items-center justify-center`}
          >
            <role.icon className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-blue-900 mb-2">
              {language === 'hi' ? 'भूमिका चयनित!' : 'Role Selected!'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {language === 'hi' ? role.titleHi : role.title}
            </p>
            <Badge variant="outline" className={`bg-${role.color}-50 text-${role.color}-800 border-${role.color}-200`}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {language === 'hi' ? 'पुष्टि की गई' : 'Confirmed'}
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4">
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
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 via-white to-green-600 rounded-full flex items-center justify-center"
          >
            <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </motion.div>
          <h1 className="text-blue-900 mb-2">
            {language === 'hi' ? 'अपनी भूमिका चुनें' : 'Choose Your Role'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'hi' 
              ? 'आप कैसे अपने समुदाय में योगदान देना चाहते हैं?'
              : 'How would you like to contribute to your community?'
            }
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full backdrop-blur-sm bg-white/95 border-orange-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                    onClick={() => handleRoleSelect(role.id)}>
                <CardHeader className="text-center pb-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${role.gradient} rounded-full flex items-center justify-center group-hover:shadow-lg transition-shadow`}
                  >
                    <role.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-blue-900">
                    {language === 'hi' ? role.titleHi : role.title}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {language === 'hi' ? role.descriptionHi : role.description}
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
                      {(language === 'hi' ? role.featuresHi : role.features).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      {language === 'hi' ? 'लाभ' : 'Benefits'}
                    </h4>
                    <ul className="space-y-1">
                      {(language === 'hi' ? role.benefitsHi : role.benefits).map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <TrendingUp className="w-3 h-3 text-orange-600 mt-1 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className={`w-full bg-gradient-to-r ${role.gradient} hover:opacity-90 group-hover:scale-105 transition-transform`}
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
          className="text-center mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200"
        >
          <p className="text-blue-800">
            {language === 'hi' 
              ? 'आप बाद में अपनी प्रोफ़ाइल में भूमिका बदल सकते हैं।'
              : 'You can change your role later in your profile settings.'
            }
          </p>
        </motion.div>
      </div>
    </div>
  );
}