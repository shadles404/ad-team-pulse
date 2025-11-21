import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TeamMember } from "@/types/team";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PaymentConfirmationFormProps {
  onSubmit: (confirmation: any) => void;
  userId: string;
  teamMembers: TeamMember[];
  onCancel: () => void;
}

export const PaymentConfirmationForm = ({
  onSubmit,
  userId,
  teamMembers,
  onCancel,
}: PaymentConfirmationFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    celebrity_id: "",
    celebrity_name: "",
    phone_number: "",
    job_completed: true,
    salary: 0,
    user_id: userId,
  });

  const handleCelebritySelect = (member: TeamMember) => {
    setFormData({
      ...formData,
      celebrity_id: member.id,
      celebrity_name: member.description,
      phone_number: member.phone,
      salary: member.salary,
    });
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.celebrity_id || !formData.celebrity_name) {
      toast.error("Please select a celebrity");
      return;
    }

    if (formData.salary <= 0) {
      toast.error("Please enter a valid salary amount");
      return;
    }

    onSubmit(formData);
    toast.success("Payment confirmation added successfully");
    onCancel();
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="celebrity">Celebrity / Influencer *</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {formData.celebrity_name || "Select celebrity..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search celebrity..." />
                  <CommandEmpty>No celebrity found.</CommandEmpty>
                  <CommandGroup>
                    {teamMembers.map((member) => (
                      <CommandItem
                        key={member.id}
                        value={member.description}
                        onSelect={() => handleCelebritySelect(member)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.celebrity_id === member.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {member.description}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone_number}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salary Amount *</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })
              }
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_completed" className="flex items-center gap-2">
              Job Completed
            </Label>
            <div className="flex items-center gap-2 h-10">
              <Switch
                id="job_completed"
                checked={formData.job_completed}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, job_completed: checked })
                }
              />
              <span className="text-sm text-muted-foreground">
                {formData.job_completed ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Confirm Payment</Button>
        </div>
      </form>
    </Card>
  );
};
