import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/team";
import { toast } from "sonner";

export function useTeamMembers(userId: string | undefined) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchTeamMembers();
    }
  }, [userId]);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedData: TeamMember[] = data.map((item) => ({
        id: item.id,
        description: item.description,
        phone: item.phone,
        salary: item.salary,
        targetVideos: item.target_videos,
        progressChecks: item.progress_checks,
        advertisementTypes: item.advertisement_types || [],
        platform: item.platform,
        contractType: item.contract_type || "",
        notes: item.notes || "",
      }));

      setTeamMembers(formattedData);
    } catch (error) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (member: Omit<TeamMember, "id">) => {
    if (!userId) return;

    try {
      const { error } = await supabase.from("team_members").insert({
        user_id: userId,
        description: member.description,
        phone: member.phone,
        salary: member.salary,
        target_videos: member.targetVideos,
        progress_checks: member.progressChecks,
        advertisement_types: member.advertisementTypes,
        platform: member.platform,
        contract_type: member.contractType,
        notes: member.notes,
      });

      if (error) throw error;

      toast.success("Advertiser registered successfully!");
      await fetchTeamMembers();
    } catch (error) {
      toast.error("Failed to register advertiser");
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const updateData: any = {};
      
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.salary !== undefined) updateData.salary = updates.salary;
      if (updates.advertisementTypes !== undefined) updateData.advertisement_types = updates.advertisementTypes;
      if (updates.platform !== undefined) updateData.platform = updates.platform;
      if (updates.contractType !== undefined) updateData.contract_type = updates.contractType;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { error } = await supabase
        .from("team_members")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Team member updated successfully!");
      await fetchTeamMembers();
    } catch (error) {
      toast.error("Failed to update team member");
    }
  };

  const updateProgress = async (id: string, progressChecks: boolean[]) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .update({ progress_checks: progressChecks })
        .eq("id", id);

      if (error) throw error;

      setTeamMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, progressChecks } : m))
      );
      toast.success("Progress updated!");
    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  const resetProgress = async (id: string) => {
    const member = teamMembers.find((m) => m.id === id);
    if (!member) return;

    try {
      const newProgress = new Array(member.targetVideos).fill(false);
      const { error } = await supabase
        .from("team_members")
        .update({ progress_checks: newProgress })
        .eq("id", id);

      if (error) throw error;

      setTeamMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, progressChecks: newProgress } : m))
      );
      toast.success("Progress reset!");
    } catch (error) {
      toast.error("Failed to reset progress");
    }
  };

  return {
    teamMembers,
    loading,
    addTeamMember,
    updateTeamMember,
    updateProgress,
    resetProgress,
    refetch: fetchTeamMembers,
  };
}
