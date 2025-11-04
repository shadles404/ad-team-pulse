import { useState } from "react";
import { TeamMember, AD_TYPES, PLATFORMS, CONTRACT_TYPES } from "@/types/team";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

interface RegistrationProps {
  onRegister: (member: Omit<TeamMember, 'id'>) => void;
}

export const Registration = ({ onRegister }: RegistrationProps) => {
  const [formData, setFormData] = useState({
    description: "",
    phone: "",
    salary: "",
    targetVideos: "",
    advertisementTypes: [] as string[],
    platform: "",
    contractType: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.phone || !formData.salary || !formData.targetVideos || formData.advertisementTypes.length === 0 || !formData.platform || !formData.contractType) {
      toast.error("Please fill in all required fields");
      return;
    }

    const targetCount = parseInt(formData.targetVideos);
    
    onRegister({
      description: formData.description,
      phone: formData.phone,
      salary: parseFloat(formData.salary),
      targetVideos: targetCount,
      progressChecks: new Array(targetCount).fill(false),
      advertisementTypes: formData.advertisementTypes,
      platform: formData.platform,
      contractType: formData.contractType,
      notes: formData.notes
    });

    // Reset form
    setFormData({
      description: "",
      phone: "",
      salary: "",
      targetVideos: "",
      advertisementTypes: [],
      platform: "",
      contractType: "",
      notes: ""
    });

    toast.success("Advertiser registered successfully!");
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
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Register New Advertiser
          </CardTitle>
          <CardDescription>
            Add a new team member with their target goals. Targets cannot be edited once saved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Name / Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1234567890"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary ($) *</Label>
                <Input
                  id="salary"
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
                <Label htmlFor="targetVideos">Target Videos *</Label>
                <Input
                  id="targetVideos"
                  type="number"
                  value={formData.targetVideos}
                  onChange={(e) => setFormData({ ...formData, targetVideos: e.target.value })}
                  placeholder="4"
                  min="1"
                  max="20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => setFormData({ ...formData, platform: value })}
                  required
                >
                  <SelectTrigger id="platform">
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
                <Label htmlFor="contractType">Contract Type *</Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) => setFormData({ ...formData, contractType: value })}
                  required
                >
                  <SelectTrigger id="contractType">
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
                      id={`ad-${type}`}
                      checked={formData.advertisementTypes.includes(type)}
                      onCheckedChange={() => toggleAdType(type)}
                    />
                    <Label htmlFor={`ad-${type}`} className="cursor-pointer font-normal">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional details or comments"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              <UserPlus className="h-4 w-4 mr-2" />
              Register Advertiser
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
