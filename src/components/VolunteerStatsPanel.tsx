import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  CheckCircle, 
  DollarSign, 
  Users, 
  Clock,
  TrendingUp,
  Award,
  Target
} from "lucide-react";

interface VolunteerStatsPanelProps {
  userInfo?: {
    name: string;
    volunteerType?: "ngo" | "student" | "citizen" | "business";
    skills?: string[];
  };
  stats?: {
    issuesSolved: number;
    totalFunded: number;
    communityReach: number;
    activeProjects: number;
    level: number;
    points: number;
  };
}

export function VolunteerStatsPanel({ 
  userInfo, 
  stats = {
    issuesSolved: 0,
    totalFunded: 0,
    communityReach: 0,
    activeProjects: 0,
    level: 1,
    points: 0
  }
}: VolunteerStatsPanelProps) {
  
  const isBusinessVolunteer = userInfo?.volunteerType === "business";

  return (
    <div className="space-y-4">
      {/* Profile Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-green-800">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold">{userInfo?.name || "Volunteer"}</div>
              <div className="text-sm font-normal text-green-600">
                Level {stats.level} • {stats.points} Points
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userInfo?.skills && userInfo.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {userInfo.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-green-700 border-green-300 bg-white/50">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-white/95 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-900">{stats.issuesSolved}</div>
                  <div className="text-sm text-blue-600">Issues Solved</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {isBusinessVolunteer ? (
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-white/95 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-900">
                      ₹{stats.totalFunded.toLocaleString()}
                    </div>
                    <div className="text-sm text-orange-600">Total Funded</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-white/95 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-900">{stats.activeProjects}</div>
                    <div className="text-sm text-green-600">Active Projects</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-white/95 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-900">
                    {stats.communityReach.toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-600">People Helped</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-white/95 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-900">{stats.level}</div>
                  <div className="text-sm text-indigo-600">Volunteer Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity Hint */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <div className="text-sm text-orange-800">
              <div className="font-medium">Keep up the great work!</div>
              <div className="text-orange-600">
                {isBusinessVolunteer 
                  ? "Check the community feed for new funding opportunities"
                  : "Browse the community feed to find issues you can help solve"
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}