import { Button } from "./ui/button";
import { Home, User, FileText, Shield, LogOut, Star, MapPin, Info, Users } from "lucide-react";
import { DatabaseStatus } from "./DatabaseStatus";
import { motion } from "motion/react";
import newLogo from "figma:asset/9940763ec6e94539b7990ea60669055c752ce3f7.png";

interface Municipality {
  id: string;
  name: string;
  state: string;
  district: string;
  population: string;
  area: string;
}

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userType?: "citizen" | "municipal" | "volunteer";
  userInfo?: { username: string; name: string };
  selectedMunicipality?: Municipality | null;
  onLogout?: () => void;
  onOpenModeSwitch?: () => void;
}

export function Navigation({ currentPage, onNavigate, userType = "citizen", userInfo, selectedMunicipality, onLogout, onOpenModeSwitch }: NavigationProps) {
  return (
    <motion.nav 
      className="border-b-2 border-orange-200 bg-gradient-to-r from-orange-100 via-white to-green-100 backdrop-blur-md shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.img 
                src={newLogo} 
                alt="Prathmikta 2.0 Logo" 
                className="h-10 w-10 object-contain"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                  Prathmikta 2.0
                </div>
                <div className="text-xs text-blue-600 -mt-1">
                  Government of India
                </div>
              </div>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-2">
              {userType === "citizen" ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentPage === "home" ? "default" : "ghost"}
                      onClick={() => onNavigate("home")}
                      className={`flex items-center gap-2 font-medium ${
                        currentPage === "home" 
                          ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg" 
                          : "text-blue-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100"
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      Home
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentPage === "posts" ? "default" : "ghost"}
                      onClick={() => onNavigate("posts")}
                      className={`flex items-center gap-2 font-medium ${
                        currentPage === "posts" 
                          ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg" 
                          : "text-blue-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      My Reports
                    </Button>
                  </motion.div>
                  {/* Municipality Info tab removed as per request */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentPage === "profile" ? "default" : "ghost"}
                      onClick={() => onNavigate("profile")}
                      className={`flex items-center gap-2 font-medium ${
                        currentPage === "profile" 
                          ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg" 
                          : "text-blue-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </motion.div>
                </>
              ) : userType === "municipal" ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentPage === "municipal" ? "default" : "ghost"}
                      onClick={() => onNavigate("municipal")}
                      className={`flex items-center gap-2 font-medium ${
                        currentPage === "municipal" 
                          ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg" 
                          : "text-blue-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100"
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentPage === "home" ? "default" : "ghost"}
                      onClick={() => onNavigate("home")}
                      className={`flex items-center gap-2 font-medium ${
                        currentPage === "home" 
                          ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg" 
                          : "text-blue-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100"
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      Home
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentPage === "profile" ? "default" : "ghost"}
                      onClick={() => onNavigate("profile")}
                      className={`flex items-center gap-2 font-medium ${
                        currentPage === "profile" 
                          ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg" 
                          : "text-blue-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Volunteer navigation */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentPage === "volunteer-dashboard" ? "default" : "ghost"}
                      onClick={() => onNavigate("volunteer-dashboard")}
                      className={`flex items-center gap-2 font-medium ${
                        currentPage === "volunteer-dashboard" 
                          ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg" 
                          : "text-blue-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100"
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      Home
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentPage === "community" ? "default" : "ghost"}
                      onClick={() => onNavigate("community")}
                      className={`flex items-center gap-2 font-medium ${
                        currentPage === "community" 
                          ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg" 
                          : "text-blue-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Community
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentPage === "tasks" ? "default" : "ghost"}
                      onClick={() => onNavigate("tasks")}
                      className={`flex items-center gap-2 font-medium ${
                        currentPage === "tasks" 
                          ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg" 
                          : "text-blue-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100"
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      Tasks
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentPage === "profile" ? "default" : "ghost"}
                      onClick={() => onNavigate("profile")}
                      className={`flex items-center gap-2 font-medium ${
                        currentPage === "profile" 
                          ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg" 
                          : "text-blue-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Municipality Location Display for Citizens */}
            {userType === "citizen" && selectedMunicipality && (
              <div className="hidden md:flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-orange-200">
                <MapPin className="w-4 h-4 text-orange-600" />
                <div>
                  <div className="text-sm font-medium text-blue-900">{selectedMunicipality.name}</div>
                  <div className="text-xs text-blue-600">{selectedMunicipality.state}</div>
                </div>
              </div>
            )}

            {/* User Info Display */}
            {userInfo && (
              <div className="hidden sm:flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-orange-200">
                <User className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-blue-900">{userInfo.name}</div>
                  <div className="text-xs text-blue-600 capitalize">{userType}</div>
                </div>
              </div>
            )}

            {/* Switch Mode Button (citizen/volunteer only) */}
            {onOpenModeSwitch && (userType === 'citizen' || userType === 'volunteer') && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={onOpenModeSwitch}
                  className="flex items-center gap-2 text-blue-800 border-orange-200 hover:bg-gradient-to-r hover:from-orange-100 hover:to-green-100"
                >
                  <Users className="w-4 h-4" />
                  Switch Mode
                </Button>
              </motion.div>
            )}

            {/* Database Status */}
            <DatabaseStatus />

            {/* Logout Button */}
            {onLogout && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}