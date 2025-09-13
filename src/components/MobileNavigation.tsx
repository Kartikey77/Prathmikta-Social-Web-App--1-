import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Home, 
  Plus, 
  User, 
  Settings, 
  Search,
  Bell,
  Heart,
  Award,
  FileText,
  Building2,
  Users,
  DollarSign,
  LogOut
} from "lucide-react";

interface MobileNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userType: "citizen" | "volunteer" | "municipal";
  userInfo: any;
  onLogout: () => void;
}

export function MobileNavigation({ 
  currentPage, 
  onNavigate, 
  userType, 
  userInfo, 
  onLogout 
}: MobileNavigationProps) {

  const getNavItems = () => {
    switch (userType) {
      case "citizen":
        return [
          { id: "citizen-dashboard", icon: Home, label: 'Home' },
          { id: "compose", icon: Plus, label: 'Report' },
          { id: "posts", icon: FileText, label: 'My Reports' },
          { id: "profile", icon: User, label: 'Profile' }
        ];
      case "volunteer":
        return [
          { id: "volunteer-dashboard", icon: Home, label: 'Home' },
          { id: "tasks", icon: Award, label: 'Tasks' },
          { id: "community", icon: Users, label: 'Community' },
          { id: "profile", icon: User, label: 'Profile' }
        ];
      default:
        return [
          { id: "home", icon: Home, label: 'Home' },
          { id: "compose", icon: Plus, label: 'Report' },
          { id: "posts", icon: FileText, label: 'Posts' },
          { id: "profile", icon: User, label: 'Profile' }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Top Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 bg-gradient-to-r from-orange-500 via-white to-green-600 rounded-full flex items-center justify-center"
            >
              <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </motion.div>
            <div>
              <h1 className="text-lg font-medium">
                Prathmikta 2.0
              </h1>
              <p className="text-orange-100 text-sm">
                {userType === "citizen" ? 'Citizen' :
                 userType === "volunteer" ? 'Volunteer' :
                 'Municipal'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 relative"
            >
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm('Are you sure you want to logout?')) {
                  onLogout();
                }
              }}
              className="text-white hover:bg-white/20 hover:bg-red-500/20"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-200 z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.map((item, index) => {
            const isActive = currentPage === item.id || 
              (item.id === "citizen-dashboard" && currentPage === "home") ||
              (item.id === "volunteer-dashboard" && currentPage === "home") ||
              (item.id === "business-dashboard" && currentPage === "home");
            
            return (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-1 w-full ${
                    isActive 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-600' : ''}`} />
                  </motion.div>
                  <span className="text-xs font-medium">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-orange-600 rounded-full"
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button (for quick reporting) - Citizens only */}
      {userType === "citizen" && currentPage !== "compose" && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-20 right-4 z-40"
        >
          <Button
            onClick={() => onNavigate("compose")}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
          >
            <Plus className="w-6 h-6 text-white" />
          </Button>
        </motion.div>
      )}
    </>
  );
}