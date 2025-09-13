import React, { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { useLanguage } from "./LanguageContext";
import { 
  ArrowLeft,
  Upload,
  MapPin,
  Tag,
  DollarSign,
  Users,
  Wrench,
  Building2,
  AlertTriangle,
  Eye,
  EyeOff,
  Clock,
  Star,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { uploadImagesToStorage } from "../services/storage";

interface Department {
  id: string;
  name: string;
  nameHi: string;
  icon: any;
  color: string;
}



interface EnhancedComposePageProps {
  onNavigate: (page: string) => void;
  onCreatePost: (title: string, content: string, images: string[], metadata: any) => void;
}

export function EnhancedComposePage({ onNavigate, onCreatePost }: EnhancedComposePageProps) {
  const { t, language } = useLanguage();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priority, setPriority] = useState([3]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);


  const [step, setStep] = useState<"details" | "department" | "review">("details");
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const departments: Department[] = [
    {
      id: "water",
      name: "Water & Sanitation",
      nameHi: "जल और स्वच्छता",
      icon: "🚰",
      color: "blue"
    },
    {
      id: "electricity", 
      name: "Electricity & Power",
      nameHi: "बिजली और ऊर्जा",
      icon: "🔌",
      color: "yellow"
    },
    {
      id: "roads",
      name: "Roads & Transport",
      nameHi: "सड़क और परिवहन", 
      icon: "🛣️",
      color: "gray"
    },
    {
      id: "environment",
      name: "Environment & Parks",
      nameHi: "पर्यावरण और उद्यान",
      icon: "🌱",
      color: "green"
    },
    {
      id: "health",
      name: "Health & Safety",
      nameHi: "स्वास्थ्य और सुरक्षा",
      icon: "🏥",
      color: "red"
    },
    {
      id: "waste",
      name: "Waste Management",
      nameHi: "कचरा प्रबंधन",
      icon: "🗑️",
      color: "orange"
    }
  ];



  const suggestedTags = [
    language === 'hi' ? "तत्काल" : "urgent",
    language === 'hi' ? "बुजुर्ग" : "elderly",
    language === 'hi' ? "बच्चे" : "children", 
    language === 'hi' ? "सुरक्षा" : "safety",
    language === 'hi' ? "पहुंच" : "accessibility",
    language === 'hi' ? "मुख्य सड़क" : "main-road",
    language === 'hi' ? "स्कूल क्षेत्र" : "school-zone",
    language === 'hi' ? "अस्पताल" : "hospital"
  ];

  const generateCostEstimate = (dept: string, priority: number) => {
    const baseCosts = {
      water: 15000,
      electricity: 8000,
      roads: 25000,
      environment: 12000,
      health: 20000,
      waste: 10000
    };
    
    const multiplier = priority * 0.3 + 0.7;
    const base = baseCosts[dept as keyof typeof baseCosts] || 15000;
    return Math.round(base * multiplier);
  };

  const handleDepartmentSelect = (deptId: string) => {
    setSelectedDepartment(deptId);
    const cost = generateCostEstimate(deptId, priority[0]);
    setEstimatedCost(cost);
    setStep("review");
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev: string[]) => 
      prev.includes(tag) 
        ? prev.filter((t: string) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      // Try cloud upload first
      const fileArray = Array.from(files);
      const urls = await uploadImagesToStorage(fileArray);
      if (urls.length > 0) {
        setImages((prev: string[]) => [...prev, ...urls]);
        toast.success(language === 'hi' ? 'इमेज अपलोड हो गई' : 'Images uploaded');
      }
    } catch (e) {
      // Fallback to base64 preview on failure
      const toDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      try {
        const newImages: string[] = [];
        for (let i = 0; i < (files?.length || 0); i++) {
          const file = files![i];
          const dataUrl = await toDataUrl(file);
          newImages.push(dataUrl);
        }
        setImages((prev: string[]) => [...prev, ...newImages]);
        toast.success(language === 'hi' ? 'लोकल इमेज जोड़ी गई (फॉलबैक)' : 'Images added (local fallback)');
      } catch {
        toast.error(language === 'hi' ? 'इमेज अपलोड विफल' : 'Image upload failed');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev: string[]) => prev.filter((_: string, i: number) => i !== idx));
  };

  const handleSubmit = () => {
    const metadata = {
      department: selectedDepartment,
      tags: selectedTags,
      priority: priority[0],
      isAnonymous,
      estimatedCost,
      location: "Auto-detected"
    };

    onCreatePost(title, description, images, metadata);
    onNavigate("citizen-dashboard"); // Go back to citizen dashboard
    toast.success(language === 'hi' ? 'रिपोर्ट सबमिट हो गई' : 'Report submitted');
  };

  const getPriorityLabel = (value: number) => {
    if (value <= 1) return { text: language === 'hi' ? 'कम' : 'Low', color: 'text-green-600', icon: '📍' };
    if (value <= 2) return { text: language === 'hi' ? 'सामान्य' : 'Normal', color: 'text-blue-600', icon: '📌' };
    if (value <= 3) return { text: language === 'hi' ? 'महत्वपूर्ण' : 'Important', color: 'text-yellow-600', icon: '⚡' };
    if (value <= 4) return { text: language === 'hi' ? 'तत्काल' : 'Urgent', color: 'text-orange-600', icon: '🚨' };
    return { text: language === 'hi' ? 'आपातकाल' : 'Emergency', color: 'text-red-600', icon: '🔥' };
  };

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">{language === 'hi' ? 'समस्या का शीर्षक' : 'Issue Title'}</Label>
        <Input
          id="title"
          placeholder={language === 'hi' ? 'संक्षेप में समस्या बताएं...' : 'Briefly describe the issue...'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-input-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{language === 'hi' ? 'विस्तृत विवरण' : 'Detailed Description'}</Label>
        <Textarea
          id="description"
          placeholder={language === 'hi' ? 'समस्या का विस्तृत विवरण दें...' : 'Provide detailed description of the issue...'}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="bg-input-background"
        />
      </div>

      <div className="space-y-3">
        <Label>{language === 'hi' ? 'प्राथमिकता स्तर' : 'Priority Level'}</Label>
        <div className="px-3">
          <Slider
            value={priority}
            onValueChange={setPriority}
            max={5}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{language === 'hi' ? 'कम' : 'Low'}</span>
            <span>{language === 'hi' ? 'आपातकाल' : 'Emergency'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getPriorityLabel(priority[0]).icon}</span>
          <span className={`font-medium ${getPriorityLabel(priority[0]).color}`}>
            {getPriorityLabel(priority[0]).text}
          </span>
        </div>
      </div>



      <div className="space-y-3">
        <Label>{language === 'hi' ? 'सुझाए गए टैग' : 'Suggested Tags'}</Label>
        <div className="flex flex-wrap gap-2">
          {suggestedTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagToggle(tag)}
              className="h-8"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          {isAnonymous ? <EyeOff className="w-5 h-5 text-blue-600" /> : <Eye className="w-5 h-5 text-blue-600" />}
          <div>
            <div className="font-medium">{language === 'hi' ? 'गुमनाम पोस्ट' : 'Post Anonymously'}</div>
            <div className="text-muted-foreground text-sm">
              {language === 'hi' ? 'आपकी पहचान छुपाई जाएगी' : 'Your identity will be hidden'}
            </div>
          </div>
        </div>
        <Switch
          checked={isAnonymous}
          onCheckedChange={setIsAnonymous}
        />
      </div>

      <Button 
        onClick={() => setStep("department")}
        disabled={!title || !description}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
      >
        {language === 'hi' ? 'विभाग चुनें' : 'Select Department'}
      </Button>
    </div>
  );

  const renderDepartmentStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="font-medium mb-2">{language === 'hi' ? 'कौन सा विभाग इसे संभालेगा?' : 'Which department should handle this?'}</h3>
        <p className="text-muted-foreground">{language === 'hi' ? 'सही विभाग चुनने से तेज़ समाधान मिलता है' : 'Choosing the right department ensures faster resolution'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {departments.map((dept) => (
          <motion.div
            key={dept.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all border-2 ${
                selectedDepartment === dept.id 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => handleDepartmentSelect(dept.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{dept.icon}</div>
                <div className="font-medium mb-1">{language === 'hi' ? dept.nameHi : dept.name}</div>
                {selectedDepartment === dept.id && estimatedCost && (
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">
                    <DollarSign className="w-3 h-3 mr-1" />
                    ₹{estimatedCost.toLocaleString()}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Button 
        variant="outline" 
        onClick={() => setStep("details")}
        className="w-full"
      >
        {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
      </Button>
    </div>
  );



  const renderReviewStep = () => {
    const selectedDept = departments.find(d => d.id === selectedDepartment);
    
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="font-medium mb-2">{language === 'hi' ? 'रिपोर्ट की समीक्षा करें' : 'Review Your Report'}</h3>
          <p className="text-muted-foreground">{language === 'hi' ? 'सबमिट करने से पहले जांच लें' : 'Check everything before submitting'}</p>
        </div>

        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-4 space-y-3">
            <div>
              <div className="font-medium mb-1">{title}</div>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-2xl">{selectedDept?.icon}</span>
                <span>{language === 'hi' ? selectedDept?.nameHi : selectedDept?.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">{getPriorityLabel(priority[0]).icon}</span>
                <span className={getPriorityLabel(priority[0]).color}>
                  {getPriorityLabel(priority[0]).text}
                </span>
              </div>
            </div>



            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {estimatedCost && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>{language === 'hi' ? 'अनुमानित लागत:' : 'Estimated cost:'} ₹{estimatedCost.toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setStep("department")}
            className="flex-1"
          >
            {language === 'hi' ? 'वापस' : 'Back'}
          </Button>
          <Button 
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            {language === 'hi' ? 'रिपोर्ट सबमिट करें' : 'Submit Report'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("citizen-dashboard")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1>{language === 'hi' ? 'समस्या रिपोर्ट करें' : 'Report an Issue'}</h1>
            <p className="text-orange-100 text-sm">
              {step === "details" ? (language === 'hi' ? 'समस्या का विवरण दें' : 'Describe the issue') :
               step === "department" ? (language === 'hi' ? 'विभाग चुनें' : 'Select department') :
               (language === 'hi' ? 'समीक्षा और सबमिट' : 'Review & submit')}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-orange-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {['details', 'department', 'review'].map((s, index) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s ? 'bg-orange-600 text-white' :
                  ['details', 'department', 'review'].indexOf(step) > index ? 'bg-green-600 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-1 mx-2 ${
                    ['details', 'department', 'review'].indexOf(step) > index ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4">
        <motion.div
          key={step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {step === "details" && (
            <div className="space-y-6">
              {renderDetailsStep()}
              {/* Image upload section */}
              <div className="space-y-2">
                <Label>{language === 'hi' ? 'इमेज अपलोड' : 'Upload Images'}</Label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageFiles(e.target.files)}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-orange-50 file:text-orange-700
                    hover:file:bg-orange-100"
                />
                {isUploading && (
                  <div className="text-sm text-muted-foreground">{language === 'hi' ? 'अपलोड हो रहा है…' : 'Uploading…'}</div>
                )}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`upload-${idx}`} className="w-full h-32 object-cover rounded-lg border" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 group-hover:opacity-100"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {step === "department" && renderDepartmentStep()}
          {step === "review" && renderReviewStep()}
        </motion.div>
      </div>
    </div>
  );
}