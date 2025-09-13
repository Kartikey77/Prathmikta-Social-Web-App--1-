import { Badge } from "./ui/badge";
import { useLanguage } from "./LanguageContext";
import { Smartphone } from "lucide-react";

export function DemoModeIndicator() {
  const { language } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 shadow-md">
        <Smartphone className="w-3 h-3 mr-1" />
        {language === 'hi' ? 'डेमो मोड' : 'Demo Mode'}
      </Badge>
    </div>
  );
}