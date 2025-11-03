import { useState } from "react";
import { TeamMember, AD_TYPES, PLATFORMS } from "@/types/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Download, Edit, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MemberDialog } from "./MemberDialog";
import { toast } from "sonner";

interface TeamTableProps {
  teamMembers: TeamMember[];
  onAdd: (member: Omit<TeamMember, 'id'>) => void;
  onEdit: (id: string, member: Omit<TeamMember, 'id'>) => void;
  onDelete: (id: string) => void;
}

export const TeamTable = ({ teamMembers, onAdd, onEdit, onDelete }: TeamTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const filteredMembers = teamMembers.filter(member =>
    member.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.advertisementType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSalary = filteredMembers.reduce((sum, m) => sum + m.salary, 0);
  const totalCompleted = filteredMembers.reduce((sum, m) => sum + m.completedVideos, 0);
  const totalTarget = filteredMembers.reduce((sum, m) => sum + m.targetVideos, 0);

  const handleExport = () => {
    const headers = ["No.", "Description", "Phone", "Salary", "Target Videos", "Completed Videos", "Status", "Ad Type", "Platform", "Notes"];
    const rows = filteredMembers.map((member, index) => [
      index + 1,
      member.description,
      member.phone,
      member.salary,
      member.targetVideos,
      member.completedVideos,
      member.completedVideos >= member.targetVideos ? "Target Reached" : "Not Reached",
      member.advertisementType,
      member.platform,
      member.notes
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team-tracker.csv";
    a.click();
    toast.success("Data exported successfully!");
  };

  const handleSave = (data: Omit<TeamMember, 'id'>) => {
    if (editingMember) {
      onEdit(editingMember.id, data);
      toast.success("Member updated successfully!");
    } else {
      onAdd(data);
      toast.success("Member added successfully!");
    }
    setDialogOpen(false);
    setEditingMember(null);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    toast.success("Member deleted successfully!");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or ad type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setEditingMember(null); setDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">No.</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ad Type</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member, index) => {
                const progressPercent = member.targetVideos > 0 
                  ? Math.min((member.completedVideos / member.targetVideos) * 100, 100) 
                  : 0;
                const targetReached = member.completedVideos >= member.targetVideos;

                return (
                  <TableRow 
                    key={member.id}
                    className={targetReached ? "bg-success-light/50" : "bg-warning-light/30"}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{member.description}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>${member.salary.toLocaleString()}</TableCell>
                    <TableCell>{member.targetVideos}</TableCell>
                    <TableCell>{member.completedVideos}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={progressPercent} className="h-2" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {progressPercent.toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {targetReached ? (
                        <Badge variant="default" className="gap-1 bg-success hover:bg-success">
                          <CheckCircle className="h-3 w-3" />
                          Reached
                        </Badge>
                      ) : (
                        <Badge variant="default" className="gap-1 bg-warning hover:bg-warning">
                          <AlertCircle className="h-3 w-3" />
                          Not Reached
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{member.advertisementType}</TableCell>
                    <TableCell>{member.platform}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{member.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 bg-card rounded-lg border">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Salary</p>
          <p className="text-2xl font-bold text-foreground">${totalSalary.toLocaleString()}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-sm text-muted-foreground">Total Videos</p>
          <p className="text-2xl font-bold text-foreground">
            {totalCompleted} / {totalTarget}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-sm text-muted-foreground">Overall Rate</p>
          <p className="text-2xl font-bold text-foreground">
            {totalTarget > 0 ? ((totalCompleted / totalTarget) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      <MemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        member={editingMember}
      />
    </div>
  );
};
