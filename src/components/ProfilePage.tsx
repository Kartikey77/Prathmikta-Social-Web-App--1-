import { UserProfile, mockUserInfo } from "./UserProfile";

interface Municipality {
  id: string;
  name: string;
  state: string;
  district: string;
  population: string;
  area: string;
}

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
  currentUser?: { 
    type: "citizen" | "volunteer" | "municipal";
    username: string;
    name: string;
    volunteerType?: "ngo" | "student" | "citizen" | "business";
    skills?: string[];
  };
  selectedMunicipality?: Municipality;
}

export function ProfilePage({ onNavigate, onLogout, currentUser, selectedMunicipality }: ProfilePageProps) {
  const handleEditProfile = () => {
    console.log("Edit profile functionality");
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      onNavigate("aadhar");
    }
  };

  // Map currentUser to a rich userInfo with role-specific details and styling cues
  const baseInfo = mockUserInfo;
  const role = currentUser?.type || "citizen";
  const volunteerType = currentUser?.volunteerType;

  const roleStyledInfo = {
    ...baseInfo,
    name: currentUser?.name || baseInfo.name,
    userType: role === "municipal" ? "municipal" : role === "volunteer" && volunteerType === "business" ? "business" : role === "volunteer" ? "volunteer" : "citizen",
    volunteerType: volunteerType,
    skills: currentUser?.skills || baseInfo.skills,
    location: selectedMunicipality?.name ? `${selectedMunicipality.name}, ${selectedMunicipality.state}` : baseInfo.location,
    // Role-specific stats flavoring for demo
    stats: {
      ...baseInfo.stats,
      issuesReported: role === "citizen" ? 15 : role === "volunteer" ? 22 : 58,
      issuesResolved: role === "municipal" ? 37 : role === "volunteer" ? 12 : 8,
      upvotesReceived: role === "citizen" ? 127 : role === "volunteer" ? 450 : 980,
      contributionScore: role === "volunteer" && volunteerType === "business" ? 1850 : role === "volunteer" ? 850 : 320,
      communityRank: role === "volunteer" ? 3 : 12,
    },
    // Add achievement highlights per role
    achievements: role === "municipal"
      ? ["District Excellence", "Rapid Response", "Citizen First"]
      : role === "volunteer" && volunteerType === "ngo"
      ? ["NGO Lead", "Community Organizer", "Impact Maker"]
      : role === "volunteer" && volunteerType === "business"
      ? ["CSR Champion", "Top Sponsor 2025", "Jobs Creator"]
      : role === "volunteer" && volunteerType === "student"
      ? ["Campus Leader", "Hack for Good", "Digital Mentor"]
      : ["Community Champion", "Top Contributor 2024", "Verified Helper"],
  } as typeof mockUserInfo;

  return (
    <UserProfile 
      userInfo={roleStyledInfo}
      onEdit={handleEditProfile}
      onLogout={handleLogout}
    />
  );
}