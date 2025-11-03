import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ProgressCheckboxesProps {
  checks: boolean[];
  onToggle: (index: number) => void;
  disabled?: boolean;
}

export const ProgressCheckboxes = ({ checks, onToggle, disabled = false }: ProgressCheckboxesProps) => {
  const completedCount = checks.filter(Boolean).length;
  const totalCount = checks.length;
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {checks.map((checked, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded border-2 transition-all",
              checked 
                ? "bg-success border-success" 
                : "bg-background border-muted-foreground/30 hover:border-primary"
            )}
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => !disabled && onToggle(index)}
              disabled={disabled}
              className="border-0 bg-transparent"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500",
              percentage === 100 ? "bg-success" : percentage > 0 ? "bg-warning" : "bg-destructive"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {completedCount}/{totalCount}
        </span>
      </div>
    </div>
  );
};
