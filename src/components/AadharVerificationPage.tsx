import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { useLanguage } from "./LanguageContext";
import { CreditCard, Shield, CheckCircle, AlertCircle } from "lucide-react";

interface AadharVerificationPageProps {
  onVerificationComplete: () => void;
}

export function AadharVerificationPage({ onVerificationComplete }: AadharVerificationPageProps) {
  const { t, language } = useLanguage();
  const [aadharNumber, setAadharNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"aadhar" | "otp" | "verified">("aadhar");
  const [isLoading, setIsLoading] = useState(false);

  const handleAadharSubmit = async () => {
    if (aadharNumber.length !== 12) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStep("otp");
      setIsLoading(false);
    }, 2000);
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setStep("verified");
      setIsLoading(false);
      // Auto-proceed after success animation
      setTimeout(() => {
        onVerificationComplete();
      }, 2000);
    }, 1500);
  };

  const formatAadhar = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
    return formatted;
  };

  if (step === "verified") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
          >
            <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-green-800 mb-2">
            {language === 'hi' ? 'सत्यापन सफल!' : 'Verification Successful!'}
          </h2>
          <p className="text-green-600">
            {language === 'hi' ? 'आपकी पहचान सत्यापित हो गई है' : 'Your identity has been verified'}
          </p>
        </motion.div>
      </div>
    );
  }

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
            {language === 'hi' ? 'प्रथमिकता 2.0' : 'Prathmikta 2.0'}
          </h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            <Shield className="w-3 h-3 mr-1" />
            {language === 'hi' ? 'सरकारी प्रमाणित' : 'Government Certified'}
          </Badge>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 border-orange-200">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-blue-900">
              {step === "aadhar" 
                ? (language === 'hi' ? 'आधार सत्यापन' : 'Aadhar Verification')
                : (language === 'hi' ? 'OTP सत्यापन' : 'OTP Verification')
              }
            </CardTitle>
            <p className="text-muted-foreground">
              {step === "aadhar" 
                ? (language === 'hi' ? 'कृपया अपना 12 अंकों का आधार नंबर दर्ज करें' : 'Please enter your 12-digit Aadhar number')
                : (language === 'hi' ? 'आपके पंजीकृत मोबाइल पर भेजा गया OTP दर्ज करें' : 'Enter the OTP sent to your registered mobile')
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === "aadhar" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="aadhar">
                    {language === 'hi' ? 'आधार संख्या' : 'Aadhar Number'}
                  </Label>
                  <Input
                    id="aadhar"
                    type="text"
                    placeholder={language === 'hi' ? 'XXXX XXXX XXXX' : 'XXXX XXXX XXXX'}
                    value={formatAadhar(aadharNumber)}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, '');
                      if (cleaned.length <= 12) {
                        setAadharNumber(cleaned);
                      }
                    }}
                    className="text-center tracking-widest bg-input-background"
                    maxLength={14}
                  />
                  {aadharNumber.length > 0 && aadharNumber.length < 12 && (
                    <p className="text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {language === 'hi' ? 'आधार संख्या 12 अंकों की होनी चाहिए' : 'Aadhar number must be 12 digits'}
                    </p>
                  )}
                </div>

                <Button 
                  onClick={handleAadharSubmit}
                  disabled={aadharNumber.length !== 12 || isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    language === 'hi' ? 'OTP भेजें' : 'Send OTP'
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">
                    {language === 'hi' ? 'OTP कोड' : 'OTP Code'}
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, '');
                      if (cleaned.length <= 6) {
                        setOtp(cleaned);
                      }
                    }}
                    className="text-center tracking-widest bg-input-background"
                    maxLength={6}
                  />
                  <p className="text-muted-foreground">
                    {language === 'hi' ? `छुपा हुआ: ****${aadharNumber.slice(-4)}` : `Hidden: ****${aadharNumber.slice(-4)}`}
                  </p>
                </div>

                <Button 
                  onClick={handleOtpSubmit}
                  disabled={otp.length !== 6 || isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    language === 'hi' ? 'सत्यापित करें' : 'Verify'
                  )}
                </Button>

                <Button 
                  variant="ghost" 
                  onClick={() => setStep("aadhar")}
                  className="w-full text-muted-foreground"
                >
                  {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
                </Button>
              </>
            )}

            {/* Security Notice */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800">
                  {language === 'hi' 
                    ? 'आपकी जानकारी पूर्णतः सुरक्षित है और सरकारी दिशानिर्देशों के अनुसार संरक्षित है।'
                    : 'Your information is completely secure and protected according to government guidelines.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}