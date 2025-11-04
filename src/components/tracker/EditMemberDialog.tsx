import { useState } from "react";
import { TeamMember, AD_TYPES, PLATFORMS, CONTRACT_TYPES } from "@/types/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface EditMemberDialogProps {
  member: TeamMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<TeamMember>) => void;
}

export const EditMemberDialog = ({ member, open, onOpenChange, onUpdate }: EditMemberDialogProps) => {
  const [formData, setFormData] = useState({
    description: member.description,
    phone: member.phone,
    salary: member.salary.toString(),
    advertisementTypes: member.advertisementTypes,
    platform: member.platform,
    contractType: member.contractType,
    notes: member.notes
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.phone || !formData.salary || formData.advertisementTypes.length === 0 || !formData.platform || !formData.contractType) {
      toast.error("Please fill in all required fields");
      return;
    }

    onUpdate(member.id, {
      description: formData.description,
      phone: formData.phone,
      salary: parseFloat(formData.salary),
      advertisementTypes: formData.advertisementTypes,
      platform: formData.platform,
      contractType: formData.contractType,
      notes: formData.notes
    });

    onOpenChange(false);
  };

  const toggleAdType = (adType: string) => {
    setFormData(prev => ({
      ...prev,
      advertisementTypes: prev.advertisementTypes.includes(adType)
        ? prev.advertisementTypes.filter(t => t !== adType)
        : [...prev.advertisementTypes, adType]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogDescription>
            Update team member information. Target videos cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Name / Description *</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number *</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-salary">Salary ($) *</Label>
              <Input
                id="edit-salary"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="3500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-platform">Platform *</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData({ ...formData, platform: value })}
                required
              >
                <SelectTrigger id="edit-platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contractType">Contract Type *</Label>
              <Select
                value={formData.contractType}
                onValueChange={(value) => setFormData({ ...formData, contractType: value })}
                required
              >
                <SelectTrigger id="edit-contractType">
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  {CONTRACT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Advertisement Types *</Label>
            <div className="grid grid-cols-2 gap-3">
              {AD_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-ad-${type}`}
                    checked={formData.advertisementTypes.includes(type)}
                    onCheckedChange={() => toggleAdType(type)}
                  />
                  <Label htmlFor={`edit-ad-${type}`} className="cursor-pointer font-normal">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional details or comments"
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
