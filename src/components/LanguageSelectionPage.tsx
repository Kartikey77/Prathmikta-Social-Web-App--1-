import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useLanguage } from "./LanguageContext";
import { Globe, Check, Shield } from "lucide-react";

interface LanguageSelectionPageProps {
  onLanguageSelected: () => void;
}

export function LanguageSelectionPage({ onLanguageSelected }: LanguageSelectionPageProps) {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi'>(language);
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageSelect = async (lang: 'en' | 'hi') => {
    setSelectedLang(lang);
    await setLanguage(lang);
  };

  const handleContinue = () => {
    setIsLoading(true);
    // Small delay for visual feedback
    setTimeout(() => {
      onLanguageSelected();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="h-1/3 bg-gradient-to-r from-orange-400 to-orange-500"></div>
        <div className="h-1/3 bg-white"></div>
        <div className="h-1/3 bg-gradient-to-r from-green-600 to-green-700"></div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Government Header */}
        <div className="text-center mb-8">
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
            प्राथमिकता 2.0 / Prathmikta 2.0
          </h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            <Shield className="w-3 h-3 mr-1" />
            सरकारी प्रमाणित / Government Certified
          </Badge>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 border-orange-200">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-blue-900">
              Choose Your Language
            </CardTitle>
            <p className="text-muted-foreground">
              Select Hindi or English to continue.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Options */}
            <div className="space-y-3">
              {/* Hindi Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={selectedLang === 'hi' ? 'default' : 'outline'}
                  onClick={() => handleLanguageSelect('hi')}
                  className={`w-full h-16 text-left justify-between ${
                    selectedLang === 'hi' 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' 
                      : 'hover:bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🇮🇳</div>
                    <div>
                      <div className="font-medium text-lg">हिन्दी</div>
                      <div className={`text-sm ${selectedLang === 'hi' ? 'text-orange-100' : 'text-muted-foreground'}`}>
                        देवनागरी लिपि
                      </div>
                    </div>
                  </div>
                  {selectedLang === 'hi' && (
                    <Check className="w-5 h-5 text-white" />
                  )}
                </Button>
              </motion.div>

              {/* English Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={selectedLang === 'en' ? 'default' : 'outline'}
                  onClick={() => handleLanguageSelect('en')}
                  className={`w-full h-16 text-left justify-between ${
                    selectedLang === 'en' 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                      : 'hover:bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🇬🇧</div>
                    <div>
                      <div className="font-medium text-lg">English</div>
                      <div className={`text-sm ${selectedLang === 'en' ? 'text-green-100' : 'text-muted-foreground'}`}>
                        Latin script
                      </div>
                    </div>
                  </div>
                  {selectedLang === 'en' && (
                    <Check className="w-5 h-5 text-white" />
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Continue Button */}
            <Button 
              onClick={handleContinue}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                t('langSelect.continue')
              )}
            </Button>

            {/* Info Notice */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800 text-sm">
                  {selectedLang === 'hi' 
                    ? 'आप बाद में भी अपनी भाषा की सेटिंग्स में जाकर भाषा बदल सकते हैं।'
                    : 'You can change the language later in settings.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}