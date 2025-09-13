import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useLanguage } from "./LanguageContext";
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  Clock, 
  Car, 
  Droplets, 
  Lightbulb, 
  Trash2,
  Heart,
  GraduationCap,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { motion } from "motion/react";

interface Municipality {
  id: string;
  name: string;
  state: string;
  district: string;
  population: string;
  area: string;
}

interface MunicipalityInfoProps {
  onNavigate: (page: string) => void;
  municipality: Municipality;
}

export function MunicipalityInfo({ onNavigate, municipality }: MunicipalityInfoProps) {
  const { t } = useLanguage();

  // Mock data for municipality services and information
  const municipalityDetails = {
    established: "1956",
    website: "www.ranchi.gov.in",
    email: "info@ranchi.gov.in",
    phone: "+91-651-2460001",
    emergencyNumber: "100",
    mayor: "श्री राज किशोर महतो",
    commissioner: "श्री अमित कुमार",
    wards: "55",
    officeHours: "10:00 AM - 5:00 PM",
    workingDays: "Monday - Friday"
  };

  const services = [
    {
      icon: Droplets,
      title: "जल आपूर्ति",
      titleEn: "Water Supply",
      description: "24x7 पानी की आपूर्ति और गुणवत्ता नियंत्रण",
      descriptionEn: "24x7 water supply and quality control",
      contact: "651-2460020"
    },
    {
      icon: Lightbulb,
      title: "बिजली और स्ट्रीट लाइट",
      titleEn: "Electricity & Street Lights",
      description: "स्ट्रीट लाइट रखरखाव और विद्युत सेवाएं",
      descriptionEn: "Street light maintenance and electrical services",
      contact: "651-2460030"
    },
    {
      icon: Trash2,
      title: "कचरा प्रबंधन",
      titleEn: "Waste Management",
      description: "नियमित कचरा संग्रह और स्वच्छता सेवाएं",
      descriptionEn: "Regular waste collection and sanitation services",
      contact: "651-2460040"
    },
    {
      icon: Car,
      title: "सड़क और यातायात",
      titleEn: "Roads & Traffic",
      description: "सड़क रखरखाव और यातायात प्रबंधन",
      descriptionEn: "Road maintenance and traffic management",
      contact: "651-2460050"
    },
    {
      icon: Heart,
      title: "स्वास्थ्य सेवाएं",
      titleEn: "Health Services",
      description: "सामुदायिक स्वास्थ्य केंद्र और टीकाकरण",
      descriptionEn: "Community health centers and vaccination",
      contact: "651-2460060"
    },
    {
      icon: GraduationCap,
      title: "शिक्षा",
      titleEn: "Education",
      description: "नगरपालिका स्कूल और शिक्षा कार्यक्रम",
      descriptionEn: "Municipal schools and education programs",
      contact: "651-2460070"
    }
  ];

  const departments = [
    {
      name: "प्रशासन विभाग",
      nameEn: "Administration Department",
      head: "श्री राजेश कुमार",
      contact: "651-2460010"
    },
    {
      name: "इंजीनियरिंग विभाग",
      nameEn: "Engineering Department", 
      head: "श्री प्रीत सिंह",
      contact: "651-2460080"
    },
    {
      name: "राजस्व विभाग",
      nameEn: "Revenue Department",
      head: "श्रीमती अनिता शर्मा",
      contact: "651-2460090"
    },
    {
      name: "स्वास्थ्य विभाग",
      nameEn: "Health Department",
      head: "डॉ. सुनीत कुमार",
      contact: "651-2460100"
    }
  ];

  const ImportantCard = ({ icon: Icon, title, value, className = "" }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${className} p-4 rounded-lg shadow-md`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-white" />
        <div>
          <p className="text-white/90 text-sm">{title}</p>
          <p className="text-white font-semibold">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-green-500 rounded-full">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-blue-800 to-green-600 bg-clip-text text-transparent">
                {municipality.name} नगर निगम
              </h1>
              <p className="text-muted-foreground">
                {municipality.district}, {municipality.state} | Complete Municipal Information
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <ImportantCard
            icon={Users}
            title="जनसंख्या"
            value={municipality.population}
            className="from-orange-500 to-orange-600"
          />
          <ImportantCard
            icon={MapPin}
            title="क्षेत्रफल"
            value={municipality.area}
            className="from-green-500 to-green-600"
          />
          <ImportantCard
            icon={Building2}
            title="कुल वार्ड"
            value={municipalityDetails.wards}
            className="from-blue-500 to-blue-600"
          />
          <ImportantCard
            icon={Calendar}
            title="स्थापना वर्ष"
            value={municipalityDetails.established}
            className="from-purple-500 to-purple-600"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Phone className="w-5 h-5" />
                  संपर्क जानकारी
                </CardTitle>
                <CardDescription>
                  Municipal contact details and office timings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">मुख्य फोन</p>
                      <p className="font-medium">{municipalityDetails.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">आपातकाल</p>
                      <p className="font-medium text-red-600">{municipalityDetails.emergencyNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">ईमेल</p>
                      <p className="font-medium">{municipalityDetails.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">कार्य समय</p>
                      <p className="font-medium">{municipalityDetails.officeHours}</p>
                      <p className="text-sm text-muted-foreground">{municipalityDetails.workingDays}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">महापौर</p>
                    <p className="font-medium">{municipalityDetails.mayor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">आयुक्त</p>
                    <p className="font-medium">{municipalityDetails.commissioner}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-800">नागरिक सेवाएं</CardTitle>
                <CardDescription>
                  Available municipal services and helpline numbers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border border-orange-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <service.icon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{service.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{service.contact}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Departments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-800">विभागीय जानकारी</CardTitle>
              <CardDescription>
                Municipal departments and their contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-orange-400 to-green-400 rounded-full">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                        <p className="text-sm text-muted-foreground">{dept.nameEn}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">विभागाध्यक्ष:</span> {dept.head}
                          </p>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{dept.contact}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-orange-50 to-green-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800">महत्वपूर्ण सूचना</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• नागरिक सेवाओं के लिए ऑनलाइन आवेदन की सुविधा उपलब्ध है</li>
                <li>• शिकायत निवारण के लिए 24x7 हेल्पलाइन उपलब्ध है</li>
                <li>• नियमित सफाई और स्वच्छता कार्यक्रम चलाए जा रहे हैं</li>
                <li>• डिजिटल इंडिया पहल के तहत सभी सेवाएं ऑनलाइन उपलब्ध कराई जा रही हैं</li>
                <li>• नागरिकों से अनुरोध है कि वे नगर निगम के नियमों का पालन करें</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}