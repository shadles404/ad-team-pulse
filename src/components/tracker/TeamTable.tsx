import { useState } from "react";
import { TeamMember } from "@/types/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, RotateCcw, CheckCircle, AlertCircle, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProgressCheckboxes } from "./ProgressCheckboxes";
import { EditMemberDialog } from "./EditMemberDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface TeamTableProps {
  teamMembers: TeamMember[];
  onUpdateProgress: (id: string, progressChecks: boolean[]) => void;
  onUpdateVideoLinks: (id: string, videoLinks: string[]) => void;
  onResetProgress: (id: string) => void;
  onUpdateMember: (id: string, updates: Partial<TeamMember>) => void;
  onDeleteMember: (id: string) => void;
  isAdmin: boolean;
}

export const TeamTable = ({ teamMembers, onUpdateProgress, onUpdateVideoLinks, onResetProgress, onUpdateMember, onDeleteMember, isAdmin }: TeamTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const filteredMembers = teamMembers.filter(member =>
    member.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.advertisementTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalSalary = filteredMembers.reduce((sum, m) => sum + m.salary, 0);
  const totalCompleted = filteredMembers.reduce((sum, m) => sum + m.progressChecks.filter(Boolean).length, 0);
  const totalTarget = filteredMembers.reduce((sum, m) => sum + m.targetVideos, 0);

  const handleExport = () => {
    const headers = ["No.", "Description", "Phone", "Salary", "Contract Type", "Target Videos", "Completed Videos", "Status", "Ad Types", "Platform", "Notes"];
    const rows = filteredMembers.map((member, index) => {
      const completed = member.progressChecks.filter(Boolean).length;
      return [
        index + 1,
        member.description,
        member.phone,
        member.salary,
        member.contractType,
        member.targetVideos,
        completed,
        completed >= member.targetVideos ? "Target Reached" : "Not Reached",
        member.advertisementTypes.join("; "),
        member.platform,
        member.notes
      ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team-tracker.csv";
    a.click();
    toast.success("Data exported successfully!");
  };

  const handleToggleProgress = (memberId: string, checkIndex: number) => {
    if (!isAdmin) return;
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    const newProgress = [...member.progressChecks];
    newProgress[checkIndex] = !newProgress[checkIndex];
    onUpdateProgress(memberId, newProgress);
  };

  const handleReset = (id: string) => {
    if (!isAdmin) return;
    onResetProgress(id);
    toast.success("Progress reset successfully!");
  };

  const handleDelete = () => {
    if (!isAdmin || !deletingMemberId) return;
    onDeleteMember(deletingMemberId);
    setDeletingMemberId(null);
  };

  return (
    <div className="space-y-4">
      {editingMember && (
        <EditMemberDialog
          member={editingMember}
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
          onUpdate={onUpdateMember}
        />
      )}

      <AlertDialog open={!!deletingMemberId} onOpenChange={(open) => !open && setDeletingMemberId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the team member and all their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="min-w-[250px]">Progress (Checkboxes)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ad Types</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Notes</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member, index) => {
                const completedCount = member.progressChecks.filter(Boolean).length;
                const targetReached = completedCount >= member.targetVideos;
                const notStarted = completedCount === 0;

                return (
                  <TableRow 
                    key={member.id}
                    className={targetReached ? "bg-success-light/50" : notStarted ? "bg-destructive-light/30" : "bg-warning-light/30"}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{member.description}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>${member.salary.toLocaleString()}</TableCell>
                    <TableCell>{member.contractType}</TableCell>
                    <TableCell>{member.targetVideos}</TableCell>
                    <TableCell>
                      <ProgressCheckboxes
                        checks={member.progressChecks}
                        onToggle={(checkIndex) => handleToggleProgress(member.id, checkIndex)}
                        disabled={!isAdmin}
                      />
                    </TableCell>
                    <TableCell>
                      {targetReached ? (
                        <Badge variant="default" className="gap-1 bg-success hover:bg-success">
                          <CheckCircle className="h-3 w-3" />
                          Reached
                        </Badge>
                      ) : notStarted ? (
                        <Badge variant="default" className="gap-1 bg-destructive hover:bg-destructive">
                          <AlertCircle className="h-3 w-3" />
                          Not Started
                        </Badge>
                      ) : (
                        <Badge variant="default" className="gap-1 bg-warning hover:bg-warning">
                          <AlertCircle className="h-3 w-3" />
                          In Progress
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.advertisementTypes.map(type => (
                          <Badge key={type} variant="outline" className="text-xs">{type}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{member.platform}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{member.notes || "-"}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingMember(member)}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReset(member.id)}
                            className="gap-2"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingMemberId(member.id)}
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    )}
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

    </div>
  );
};
