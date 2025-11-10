import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Registration } from "@/components/registration/Registration";
import { TeamTable } from "@/components/tracker/TeamTable";
import { Reports } from "@/components/reports/Reports";
import { Settings } from "@/components/settings/Settings";
import { useAuth } from "@/hooks/useAuth";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useDeliveries } from "@/hooks/useDeliveries";
import { useUserRole } from "@/hooks/useUserRole";
import { Delivery } from "@/components/delivery/Delivery";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { teamMembers, loading: dataLoading, addTeamMember, updateTeamMember, updateProgress, resetProgress } = useTeamMembers(user?.id);
  const { deliveries, loading: deliveriesLoading, addDelivery, updateDelivery, deleteDelivery } = useDeliveries(user?.id);
  const { role, isAdmin, loading: roleLoading } = useUserRole(user?.id);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || dataLoading || deliveriesLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} onSignOut={signOut} userRole={role} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && <Dashboard teamMembers={teamMembers} />}
        {activeTab === "registration" && (
          <Registration onRegister={addTeamMember} />
        )}
        {activeTab === "tracking" && (
          <TeamTable
            teamMembers={teamMembers}
            onUpdateProgress={updateProgress}
            onResetProgress={resetProgress}
            onUpdateMember={updateTeamMember}
          />
        )}
        {activeTab === "delivery" && (
          <Delivery
            deliveries={deliveries}
            onAdd={addDelivery}
            onUpdate={updateDelivery}
            onDelete={deleteDelivery}
            userId={user.id}
            teamMembers={teamMembers}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === "reports" && <Reports teamMembers={teamMembers} />}
        {activeTab === "settings" && <Settings />}
      </main>
    </div>
  );
};

export default Index;
