import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TeamMember, AD_TYPES, PLATFORMS } from "@/types/team";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<TeamMember, 'id'>) => void;
  member?: TeamMember | null;
}

export const MemberDialog = ({ open, onOpenChange, onSave, member }: MemberDialogProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<Omit<TeamMember, 'id'>>({
    defaultValues: {
      description: "",
      phone: "",
      salary: 0,
      targetVideos: 0,
      completedVideos: 0,
      advertisementType: AD_TYPES[0],
      platform: PLATFORMS[0],
      notes: ""
    }
  });

  useEffect(() => {
    if (member) {
      reset(member);
    } else {
      reset({
        description: "",
        phone: "",
        salary: 0,
        targetVideos: 0,
        completedVideos: 0,
        advertisementType: AD_TYPES[0],
        platform: PLATFORMS[0],
        notes: ""
      });
    }
  }, [member, reset]);

  const onSubmit = (data: Omit<TeamMember, 'id'>) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Name/Description</Label>
              <Input id="description" {...register("description", { required: true })} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary ($)</Label>
              <Input 
                id="salary" 
                type="number" 
                {...register("salary", { valueAsNumber: true })} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetVideos">Target Videos</Label>
              <Input 
                id="targetVideos" 
                type="number" 
                {...register("targetVideos", { valueAsNumber: true })} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="completedVideos">Completed Videos</Label>
              <Input 
                id="completedVideos" 
                type="number" 
                {...register("completedVideos", { valueAsNumber: true })} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="advertisementType">Advertisement Type</Label>
              <Select
                value={watch("advertisementType")}
                onValueChange={(value) => setValue("advertisementType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AD_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={watch("platform")}
                onValueChange={(value) => setValue("platform", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register("notes")} rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {member ? "Update" : "Add"} Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
