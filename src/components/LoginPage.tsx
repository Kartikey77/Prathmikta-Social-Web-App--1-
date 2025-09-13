import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { User, Shield, Users, ArrowLeft, CheckCircle2, Star } from "lucide-react";
import { motion } from "motion/react";
import newLogo from "figma:asset/9940763ec6e94539b7990ea60669055c752ce3f7.png";

interface LoginPageProps {
  onLogin: (userType: "citizen" | "municipal", userInfo: { username: string; name: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [step, setStep] = useState<"selection" | "aadhaar" | "otp">("selection");
  const [userType, setUserType] = useState<"citizen" | "municipal">("citizen");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Format Aadhaar number as XXXX XXXX XXXX
  const formatAadhaar = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 12);
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleAadhaarSubmit = () => {
    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    if (cleanAadhaar.length !== 12) {
      alert("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOtpSent(true);
      setStep("otp");
      setLoading(false);
    }, 2000);
  };

  const handleOtpSubmit = () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      const username = userType === "citizen" 
        ? `USER#${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
        : `OFFICER#${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      onLogin(userType, {
        username,
        name: name || `${userType === "citizen" ? "Citizen" : "Officer"} User`
      });
      setLoading(false);
    }, 1500);
  };

  const handleUserTypeSelect = (type: "citizen" | "municipal") => {
    setUserType(type);
    setStep("aadhaar");
  };

  const goBack = () => {
    if (step === "otp") {
      setStep("aadhaar");
    } else if (step === "aadhaar") {
      setStep("selection");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Indian Flag Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-1/3 bg-orange-500"></div>
        <div className="h-1/3 bg-white"></div>
        <div className="h-1/3 bg-green-600"></div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-32 h-32 border-4 border-blue-800 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-800 rounded-full"></div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="w-full max-w-md space-y-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className="relative"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img 
                src={newLogo} 
                alt="Prathmikta Logo" 
                className="w-20 h-20 drop-shadow-lg object-contain" 
              />
              <motion.div
                className="absolute -top-3 -right-3"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="w-7 h-7 text-yellow-500" />
              </motion.div>
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
            Prathmikta
          </h1>
          <p className="text-gray-600">
            भारत सरकार | Government of India
          </p>
          <p className="text-sm text-muted-foreground">
            Digital India Initiative - Aadhaar Authentication
          </p>
        </motion.div>

        {step === "selection" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-orange-200 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-500 via-white to-green-500 text-center rounded-t-lg">
                <CardTitle className="text-blue-900">Select Login Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <motion.button
                  className="w-full p-6 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-all duration-300 bg-gradient-to-r from-orange-50 to-orange-100 hover:shadow-lg group"
                  onClick={() => handleUserTypeSelect("citizen")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <User className="w-8 h-8 text-orange-600 group-hover:text-orange-700 transition-colors" />
                    <div className="text-left">
                      <div className="font-semibold text-orange-900">नागरिक / Citizen</div>
                      <div className="text-sm text-orange-700">Report civic issues</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  className="w-full p-6 border-2 border-green-200 rounded-lg hover:border-green-400 transition-all duration-300 bg-gradient-to-r from-green-50 to-green-100 hover:shadow-lg group"
                  onClick={() => handleUserTypeSelect("municipal")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Shield className="w-8 h-8 text-green-600 group-hover:text-green-700 transition-colors" />
                    <div className="text-left">
                      <div className="font-semibold text-green-900">अधिकारी / Municipal Officer</div>
                      <div className="text-sm text-green-700">Manage civic issues</div>
                    </div>
                  </div>
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "aadhaar" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-blue-200 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={goBack}
                    className="text-blue-900 hover:text-blue-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="text-blue-900">Aadhaar Authentication</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Aadhaar Card Design */}
                <motion.div 
                  className="bg-gradient-to-br from-blue-100 via-white to-blue-100 p-6 rounded-xl border-2 border-blue-200 shadow-inner"
                  initial={{ rotateY: -10 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-blue-800 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-900">आधार</div>
                      <div className="text-xs text-blue-700">AADHAAR</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-blue-800">Full Name / पूरा नाम</Label>
                      <Input
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-blue-800">Aadhaar Number / आधार संख्या</Label>
                      <Input
                        placeholder="0000 0000 0000"
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(formatAadhaar(e.target.value))}
                        className="mt-1 font-mono text-lg tracking-wider border-blue-200 focus:border-blue-400"
                        maxLength={14}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleAadhaarSubmit} 
                    className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      "Send OTP / ओटीपी भेजें"
                    )}
                  </Button>
                </motion.div>

                <div className="text-center text-xs text-blue-600 bg-blue-50 p-3 rounded-lg">
                  🔒 Secure authentication powered by Digital India
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-green-200 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={goBack}
                    className="text-blue-900 hover:text-blue-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="text-blue-900">OTP Verification</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {otpSent && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>OTP sent to your registered mobile number</span>
                  </motion.div>
                )}

                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-900">
                    Enter 6-digit OTP
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    6-अंकीय ओटीपी दर्ज करें
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    For demo: Use any 6-digit number
                  </div>
                </div>

                <div className="flex justify-center">
                  <Input
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl font-mono tracking-widest w-48 border-2 border-green-200 focus:border-green-400"
                    maxLength={6}
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleOtpSubmit} 
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      "Verify & Login / सत्यापित करें और लॉगिन करें"
                    )}
                  </Button>
                </motion.div>

                <div className="text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Resend OTP / ओटीपी पुनः भेजें
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div 
          className="text-center text-xs text-gray-600 bg-white/70 backdrop-blur-sm p-3 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          🇮🇳 This is a prototype app. No real Aadhaar authentication is performed.
          <br />
          प्रोटोटाइप ऐप है। कोई वास्तविक आधार प्रमाणीकरण नहीं किया जाता।
        </motion.div>
      </motion.div>
    </div>
  );
}