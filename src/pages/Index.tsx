import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";
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
      targetVideos: 20,
      completedVideos: 22,
      advertisementType: "Makeup Ad",
      platform: "Instagram",
      notes: "Excellent engagement rates"
    },
    {
      id: "2",
      description: "Mike Chen",
      phone: "+1234567891",
      salary: 3200,
      targetVideos: 15,
      completedVideos: 12,
      advertisementType: "Skincare Ad",
      platform: "TikTok",
      notes: "Working on new campaign"
    },
    {
      id: "3",
      description: "Emma Davis",
      phone: "+1234567892",
      salary: 4000,
      targetVideos: 25,
      completedVideos: 28,
      advertisementType: "Perfume Ad",
      platform: "YouTube",
      notes: "Top performer this month"
    }
  ]);

  const handleAddMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember = {
      ...member,
      id: Date.now().toString()
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const handleEditMember = (id: string, updatedData: Omit<TeamMember, 'id'>) => {
    setTeamMembers(teamMembers.map(m => m.id === id ? { ...updatedData, id } : m));
  };

  const handleDeleteMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && <Dashboard teamMembers={teamMembers} />}
        {activeTab === "tracker" && (
          <TeamTable
            teamMembers={teamMembers}
            onAdd={handleAddMember}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
          />
        )}
        {activeTab === "reports" && <Reports />}
        {activeTab === "settings" && <Settings />}
      </main>
    </div>
  );
};

export default Index;
