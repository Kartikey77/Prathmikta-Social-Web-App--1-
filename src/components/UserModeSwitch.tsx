import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { Users, Eye, Heart, Building, GraduationCap, User } from "lucide-react";
import { toast } from "sonner";

interface UserModeSwitchProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: "citizen" | "volunteer";
  currentVolunteerType?: "ngo" | "student" | "citizen" | "business";
  onModeChange: (newMode: "citizen" | "volunteer", volunteerType?: "ngo" | "student" | "citizen" | "business") => void;
}

export function UserModeSwitch({ 
  isOpen, 
  onClose, 
  currentMode, 
  currentVolunteerType,
  onModeChange 
}: UserModeSwitchProps) {
  const [selectedMode, setSelectedMode] = useState<"citizen" | "volunteer">(currentMode);
  const [selectedVolunteerType, setSelectedVolunteerType] = useState<"ngo" | "student" | "citizen" | "business" | undefined>(currentVolunteerType);

  const handleConfirm = () => {
    if (selectedMode === "volunteer" && !selectedVolunteerType) {
      toast.error("Please select a volunteer type");
      return;
    }

    onModeChange(selectedMode, selectedVolunteerType);
    toast.success(`Switched to ${selectedMode === "citizen" ? "Citizen" : "Volunteer"} mode`);
    onClose();
  };

  const volunteerTypes = [
    {
      type: "ngo" as const,
      title: "NGO Volunteer",
      description: "Represent an NGO or non-profit organization",
      icon: Heart,
      color: "text-pink-600 bg-pink-50 border-pink-200"
    },
    {
      type: "student" as const,
      title: "Student Volunteer",
      description: "Student contributing to community service",
      icon: GraduationCap,
      color: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      type: "citizen" as const,
      title: "Citizen Volunteer",
      description: "Individual citizen helping the community",
      icon: User,
      color: "text-green-600 bg-green-50 border-green-200"
    },
    {
      type: "business" as const,
      title: "Corporate Sponsor",
      description: "Business or corporate entity providing funding",
      icon: Building,
      color: "text-orange-600 bg-orange-50 border-orange-200"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border-2 border-blue-200 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg p-6 -m-6 mb-6 border-b-2 border-blue-100">
          <DialogTitle className="flex items-center gap-3 text-blue-800">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="w-6 h-6 text-blue-600" />
            </motion.div>
            Switch User Mode
          </DialogTitle>
          <DialogDescription className="text-blue-700 mt-2">
            Choose how you want to participate in the Prathmikta 2.0 community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Select Your Role</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Citizen Mode */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedMode("citizen");
                  setSelectedVolunteerType(undefined);
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedMode === "citizen"
                    ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">Citizen</div>
                    <div className="text-sm text-blue-600">Report & Track Issues</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Report civic issues, track their progress, and engage with the community
                </p>
              </motion.div>

              {/* Volunteer Mode */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMode("volunteer")}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedMode === "volunteer"
                    ? "border-green-400 bg-green-50 ring-2 ring-green-200"
                    : "border-gray-200 hover:border-green-300 hover:bg-green-25"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">Volunteer</div>
                    <div className="text-sm text-green-600">Solve & Fund Issues</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Take action to solve community issues and provide funding support
                </p>
              </motion.div>
            </div>
          </div>

          {/* Volunteer Type Selection */}
          {selectedMode === "volunteer" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <h3 className="font-semibold text-gray-800">Select Volunteer Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {volunteerTypes.map((type) => (
                  <motion.div
                    key={type.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedVolunteerType(type.type)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedVolunteerType === type.type
                        ? "border-green-400 bg-green-50 ring-2 ring-green-200"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type.color}`}>
                        <type.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{type.title}</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Current Mode Display */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <span className="font-medium">Current Mode:</span>
              <Badge variant="outline" className="capitalize">
                {currentMode}
                {currentMode === "volunteer" && currentVolunteerType && ` - ${currentVolunteerType}`}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              You can switch modes anytime to change how you interact with the platform
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t-2 border-gray-100">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedMode === "volunteer" && !selectedVolunteerType}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Switch Mode
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}