import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Registration } from "@/components/registration/Registration";
import { TeamTable } from "@/components/tracker/TeamTable";
import { Reports } from "@/components/reports/Reports";
import { Settings } from "@/components/settings/Settings";
import { TeamMember } from "@/types/team";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      description: "Sarah Johnson",
      phone: "+1234567890",
      salary: 3500,
      targetVideos: 4,
      progressChecks: [true, true, true, true],
      advertisementType: "Makeup Ad",
      platform: "Instagram",
      notes: "Excellent engagement rates"
    },
    {
      id: "2",
      description: "Mike Chen",
      phone: "+1234567891",
      salary: 3200,
      targetVideos: 5,
      progressChecks: [true, true, false, false, false],
      advertisementType: "Skincare Ad",
      platform: "TikTok",
      notes: "Working on new campaign"
    },
    {
      id: "3",
      description: "Emma Davis",
      phone: "+1234567892",
      salary: 4000,
      targetVideos: 6,
      progressChecks: [false, false, false, false, false, false],
      advertisementType: "Perfume Ad",
      platform: "YouTube",
      notes: "Top performer this month"
    }
  ]);

  const handleRegisterMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember = {
      ...member,
      id: Date.now().toString()
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const handleUpdateProgress = (id: string, progressChecks: boolean[]) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === id ? { ...m, progressChecks } : m
    ));
  };

  const handleResetProgress = (id: string) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === id ? { ...m, progressChecks: new Array(m.targetVideos).fill(false) } : m
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && <Dashboard teamMembers={teamMembers} />}
        {activeTab === "registration" && (
          <Registration onRegister={handleRegisterMember} />
        )}
        {activeTab === "tracking" && (
          <TeamTable
            teamMembers={teamMembers}
            onUpdateProgress={handleUpdateProgress}
            onResetProgress={handleResetProgress}
          />
        )}
        {activeTab === "reports" && <Reports />}
        {activeTab === "settings" && <Settings />}
      </main>
    </div>
  );
};

export default Index;
