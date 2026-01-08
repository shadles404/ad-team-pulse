import { useState, useEffect, useCallback } from "react";
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
import { PaymentConfirmation } from "@/components/payment/PaymentConfirmation";
import { usePaymentConfirmations } from "@/hooks/usePaymentConfirmations";
import { TeamMember } from "@/types/team";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { teamMembers, loading: dataLoading, addTeamMember, updateTeamMember, updateProgress, updateVideoLinks, resetProgress, deleteTeamMember } = useTeamMembers(user?.id);
  const { deliveries, loading: deliveriesLoading, addDelivery, updateDelivery, deleteDelivery } = useDeliveries(user?.id);
  const { confirmations, loading: paymentsLoading, addConfirmation, deleteConfirmation, hasPaymentForMonth } = usePaymentConfirmations(user?.id);
  const { role, isAdmin, loading: roleLoading } = useUserRole(user?.id);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Handle auto-payment when target is completed
  const handleTargetCompleted = useCallback(async (member: TeamMember) => {
    if (!user) return;

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Check if payment already exists for this month
    if (hasPaymentForMonth(member.id, currentMonth, currentYear)) {
      return; // Payment already created for this month
    }

    try {
      await addConfirmation({
        celebrity_id: member.id,
        celebrity_name: member.description,
        phone_number: member.phone,
        job_completed: true,
        salary: member.salary,
        user_id: user.id,
        month: currentMonth,
        year: currentYear,
        payment_status: 'pending',
        contract_reference: member.contractType || undefined,
      });
      toast.success(`🎉 ${member.description} completed their target! Payment confirmation created.`);
    } catch (error) {
      console.error("Error creating payment confirmation:", error);
    }
  }, [user, addConfirmation, hasPaymentForMonth]);

  if (authLoading || dataLoading || deliveriesLoading || paymentsLoading || roleLoading) {
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
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} onSignOut={signOut} userRole={role} isAdmin={isAdmin} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && <Dashboard teamMembers={teamMembers} />}
        {activeTab === "registration" && (
          <Registration onRegister={addTeamMember} />
        )}
        {activeTab === "tracking" && (
            <TeamTable
              teamMembers={teamMembers}
              onUpdateProgress={updateProgress}
              onUpdateVideoLinks={updateVideoLinks}
              onResetProgress={resetProgress}
              onUpdateMember={updateTeamMember}
              onDeleteMember={deleteTeamMember}
              isAdmin={isAdmin}
              onTargetCompleted={handleTargetCompleted}
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
        {activeTab === "payment" && (
          <PaymentConfirmation
            confirmations={confirmations}
            onAdd={addConfirmation}
            onDelete={deleteConfirmation}
            userId={user.id}
            teamMembers={teamMembers}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === "reports" && <Reports teamMembers={teamMembers} confirmations={confirmations} />}
        {activeTab === "settings" && <Settings />}
      </main>
    </div>
  );
};

export default Index;
