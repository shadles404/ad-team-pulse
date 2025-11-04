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
        advertisementType: item.advertisement_type,
        platform: item.platform,
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
        advertisement_type: member.advertisementType,
        platform: member.platform,
        notes: member.notes,
      });

      if (error) throw error;

      toast.success("Advertiser registered successfully!");
      await fetchTeamMembers();
    } catch (error) {
      toast.error("Failed to register advertiser");
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
    updateProgress,
    resetProgress,
    refetch: fetchTeamMembers,
  };
}
